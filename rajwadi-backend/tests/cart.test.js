import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { buildApp } from '../src/app.js';
import { db } from '../src/db/index.js';
import { users, categories, products, productVariants, carts, cartItems, coupons } from '../src/db/schema/index.js';
import { eq } from 'drizzle-orm';
import { PasswordUtil } from '../src/utils/password.util.js';

describe('Cart & Coupons Endpoints E2E', () => {
  let app;
  let adminToken;
  let customerToken;
  let customer2Token;
  let adminId;
  let customerId;
  let customer2Id;
  let testCategoryId;
  let testProductId;
  let testVariant1Id;
  let testVariant2Id;
  let inactiveVariantId;
  let percentCouponId;

  beforeAll(async () => {
    app = await buildApp();
    await app.ready();

    // Setup users
    const adminPass = await PasswordUtil.hash('Admin123!');
    const [adminUser] = await db.insert(users).values({ firstName: 'A', lastName: 'T', email: 'admin_c@test.com', passwordHash: adminPass, role: 'ADMIN' }).returning();
    adminId = adminUser.id;
    adminToken = await app.jwt.sign({ sub: adminId, role: 'ADMIN' });

    const custPass = await PasswordUtil.hash('Cust123!');
    const [custUser] = await db.insert(users).values({ firstName: 'C', lastName: 'T', email: 'cust_c@test.com', passwordHash: custPass, role: 'CUSTOMER' }).returning();
    customerId = custUser.id;
    customerToken = await app.jwt.sign({ sub: customerId, role: 'CUSTOMER' });

    const [cust2User] = await db.insert(users).values({ firstName: 'C2', lastName: 'T2', email: 'cust2_c@test.com', passwordHash: custPass, role: 'CUSTOMER' }).returning();
    customer2Id = cust2User.id;
    customer2Token = await app.jwt.sign({ sub: customer2Id, role: 'CUSTOMER' });

    // Setup catalogue
    const [cat] = await db.insert(categories).values({ name: 'Cart Cat', slug: 'cart-cat' }).returning();
    testCategoryId = cat.id;

    const [prod] = await db.insert(products).values({ categoryId: cat.id, name: 'Cart Product', slug: 'cart-prod', basePrice: 1000, gstRate: 12 }).returning();
    testProductId = prod.id;

    const [v1] = await db.insert(productVariants).values({ productId: prod.id, sku: 'C-SKU-1', price: 1000, stockOnHand: 10 }).returning();
    testVariant1Id = v1.id;

    const [v2] = await db.insert(productVariants).values({ productId: prod.id, sku: 'C-SKU-2', price: 2000, stockOnHand: 5 }).returning();
    testVariant2Id = v2.id;

    const [vInactive] = await db.insert(productVariants).values({ productId: prod.id, sku: 'C-SKU-I', price: 1000, stockOnHand: 10, isActive: false }).returning();
    inactiveVariantId = vInactive.id;
  });

  afterAll(async () => {
    await db.delete(users).where(eq(users.email, 'admin_c@test.com'));
    await db.delete(users).where(eq(users.email, 'cust_c@test.com'));
    await db.delete(users).where(eq(users.email, 'cust2_c@test.com'));
    await db.delete(categories).where(eq(categories.slug, 'cart-cat'));
    await db.delete(coupons).where(eq(coupons.code, 'TEST10'));
    await db.delete(coupons).where(eq(coupons.code, 'FIXED500'));
    await app.close();
  });

  it('1. authenticated user gets empty cart', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/v1/cart', headers: { authorization: `Bearer ${customerToken}` } });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.payload).data;
    expect(body.items.length).toBe(0);
    expect(body.subtotal).toBe(0);
  });

  it('2. unauthenticated user cannot access cart', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/v1/cart' });
    expect(res.statusCode).toBe(401);
  });

  it('3. add active variant to cart', async () => {
    const res = await app.inject({ method: 'POST', url: '/api/v1/cart/items', headers: { authorization: `Bearer ${customerToken}` }, payload: { variantId: testVariant1Id, quantity: 2 } });
    expect(res.statusCode).toBe(201);
    const body = JSON.parse(res.payload).data;
    expect(body.items.length).toBe(1);
    expect(body.items[0].quantity).toBe(2);
    expect(body.subtotal).toBe(2000);
  });

  it('5. inactive variant rejected', async () => {
    const res = await app.inject({ method: 'POST', url: '/api/v1/cart/items', headers: { authorization: `Bearer ${customerToken}` }, payload: { variantId: inactiveVariantId, quantity: 1 } });
    expect(res.statusCode).toBe(400);
    expect(JSON.parse(res.payload).error.code).toBe('VARIANT_NOT_AVAILABLE');
  });

  it('6. invalid quantity rejected', async () => {
    const res = await app.inject({ method: 'POST', url: '/api/v1/cart/items', headers: { authorization: `Bearer ${customerToken}` }, payload: { variantId: testVariant1Id, quantity: 0 } });
    expect(res.statusCode).toBe(400);
    expect(JSON.parse(res.payload).error.code).toBe('VALIDATION_ERROR');
  });

  it('7. quantity above available stock rejected', async () => {
    const res = await app.inject({ method: 'POST', url: '/api/v1/cart/items', headers: { authorization: `Bearer ${customerToken}` }, payload: { variantId: testVariant2Id, quantity: 10 } });
    expect(res.statusCode).toBe(400);
    expect(JSON.parse(res.payload).error.code).toBe('INSUFFICIENT_STOCK');
  });

  it('8. adding same variant increases quantity', async () => {
    const res = await app.inject({ method: 'POST', url: '/api/v1/cart/items', headers: { authorization: `Bearer ${customerToken}` }, payload: { variantId: testVariant1Id, quantity: 3 } });
    expect(res.statusCode).toBe(201);
    const body = JSON.parse(res.payload).data;
    expect(body.items[0].quantity).toBe(5);
    expect(body.subtotal).toBe(5000);
  });

  it('10. update cart item', async () => {
    const getRes = await app.inject({ method: 'GET', url: '/api/v1/cart', headers: { authorization: `Bearer ${customerToken}` } });
    const cart = JSON.parse(getRes.payload).data;
    const itemId = cart.items[0].id;

    const res = await app.inject({ method: 'PATCH', url: `/api/v1/cart/items/${itemId}`, headers: { authorization: `Bearer ${customerToken}` }, payload: { quantity: 1 } });
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.payload).data.items[0].quantity).toBe(1);
  });

  it('11. user cannot update another user\'s cart item', async () => {
    const getRes = await app.inject({ method: 'GET', url: '/api/v1/cart', headers: { authorization: `Bearer ${customerToken}` } });
    const cart = JSON.parse(getRes.payload).data;
    const itemId = cart.items[0].id;

    const res = await app.inject({ method: 'PATCH', url: `/api/v1/cart/items/${itemId}`, headers: { authorization: `Bearer ${customer2Token}` }, payload: { quantity: 5 } });
    expect(res.statusCode).toBe(404);
  });

  it('12. delete cart item', async () => {
    await app.inject({ method: 'POST', url: '/api/v1/cart/items', headers: { authorization: `Bearer ${customerToken}` }, payload: { variantId: testVariant2Id, quantity: 1 } });
    
    const getRes = await app.inject({ method: 'GET', url: '/api/v1/cart', headers: { authorization: `Bearer ${customerToken}` } });
    const cart = JSON.parse(getRes.payload).data;
    const itemId = cart.items.find(i => i.variant.id === testVariant2Id).id;

    const res = await app.inject({ method: 'DELETE', url: `/api/v1/cart/items/${itemId}`, headers: { authorization: `Bearer ${customerToken}` } });
    expect(res.statusCode).toBe(200);
    
    const getRes2 = await app.inject({ method: 'GET', url: '/api/v1/cart', headers: { authorization: `Bearer ${customerToken}` } });
    expect(JSON.parse(getRes2.payload).data.items.length).toBe(1);
  });

  it('13. clear cart', async () => {
    const res = await app.inject({ method: 'DELETE', url: '/api/v1/cart', headers: { authorization: `Bearer ${customerToken}` } });
    expect(res.statusCode).toBe(200);
    
    const getRes = await app.inject({ method: 'GET', url: '/api/v1/cart', headers: { authorization: `Bearer ${customerToken}` } });
    expect(JSON.parse(getRes.payload).data.items.length).toBe(0);
  });

  it('14, 15, 16. cart uses latest Neon variant price and calculates subtotal without reserved_stock', async () => {
    await app.inject({ method: 'POST', url: '/api/v1/cart/items', headers: { authorization: `Bearer ${customerToken}` }, payload: { variantId: testVariant1Id, quantity: 2 } });
    
    await db.update(productVariants).set({ price: 1500, reservedStock: 2 }).where(eq(productVariants.id, testVariant1Id));

    const res = await app.inject({ method: 'GET', url: '/api/v1/cart', headers: { authorization: `Bearer ${customerToken}` } });
    const body = JSON.parse(res.payload).data;
    
    expect(body.items[0].variant.price).toBe(1500);
    expect(body.subtotal).toBe(3000);
    expect(body.items[0].variant.reservedStock).toBeUndefined();
    expect(body.items[0].variant.availableStock).toBe(8);
  });

  it('17. admin creates percentage coupon', async () => {
    const res = await app.inject({ method: 'POST', url: '/api/v1/admin/coupons', headers: { authorization: `Bearer ${adminToken}` }, payload: { code: 'test10', discountType: 'PERCENTAGE', discountValue: 10, maximumDiscountAmount: 500 } });
    expect(res.statusCode).toBe(201);
    const body = JSON.parse(res.payload).data;
    expect(body.code).toBe('TEST10');
    percentCouponId = body.id;
  });

  it('18. customer cannot create coupon', async () => {
    const res = await app.inject({ method: 'POST', url: '/api/v1/admin/coupons', headers: { authorization: `Bearer ${customerToken}` }, payload: { code: 'test20', discountType: 'PERCENTAGE', discountValue: 20 } });
    expect(res.statusCode).toBe(403);
  });

  it('19, 21. preview fixed coupon and percentage limits', async () => {
    await app.inject({ method: 'POST', url: '/api/v1/admin/coupons', headers: { authorization: `Bearer ${adminToken}` }, payload: { code: 'FIXED500', discountType: 'FIXED', discountValue: 500 } });
    
    const resFixed = await app.inject({ method: 'POST', url: '/api/v1/cart/preview', headers: { authorization: `Bearer ${customerToken}` }, payload: { couponCode: 'fixed500' } });
    const bodyFixed = JSON.parse(resFixed.payload).data;
    
    expect(bodyFixed.subtotal).toBe(3000);
    expect(bodyFixed.discount).toBe(500);
    expect(bodyFixed.estimatedTotal).toBe(2500);

    const resPercent = await app.inject({ method: 'POST', url: '/api/v1/cart/preview', headers: { authorization: `Bearer ${customerToken}` }, payload: { couponCode: 'TEST10' } });
    const bodyPercent = JSON.parse(resPercent.payload).data;
    
    expect(bodyPercent.discount).toBe(300);
    expect(bodyPercent.estimatedTotal).toBe(2700);
  });
});
