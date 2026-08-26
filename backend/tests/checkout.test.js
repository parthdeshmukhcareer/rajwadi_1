import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { db } from '../src/db/index.js';
import { users, categories, products, productVariants, addresses, carts, cartItems, coupons, orders, orderItems } from '../src/db/schema/index.js';
import { eq } from 'drizzle-orm';
import Fastify from 'fastify';
import { buildApp } from '../src/app.js';
import { env } from '../src/config/env.js';
import { OrdersRepository } from '../src/modules/orders/orders.repository.js';

describe('Checkout & Orders E2E', () => {
  let app;
  let userToken;
  let userId;
  let addressId;
  let categoryId;
  let productId;
  let variantId;
  let cartId;

  beforeAll(async () => {
    process.env.DISABLE_JOBS = 'true';
    app = await buildApp();
    await app.ready();

    await db.delete(users).where(eq(users.email, 'checkout@test.com'));

    const [user] = await db.insert(users).values({
      email: 'checkout@test.com',
      passwordHash: 'dummy',
      firstName: 'Checkout',
      lastName: 'User'
    }).returning();
    userId = user.id;
    userToken = app.jwt.sign({ sub: user.id, role: 'CUSTOMER' });

    const [addr] = await db.insert(addresses).values({
      userId,
      fullName: 'Checkout User',
      phone: '9999999999',
      addressLine1: '123 Test St',
      city: 'Test City',
      state: 'Test State',
      postalCode: '123456',
      country: 'India',
      isDefault: true
    }).returning();
    addressId = addr.id;

    const [cat] = await db.insert(categories).values({ name: 'Checkout Cat', slug: 'checkout-cat' }).returning();
    categoryId = cat.id;

    const [prod] = await db.insert(products).values({
      categoryId,
      name: 'Checkout Product',
      slug: 'checkout-product',
      basePrice: 112000,
      gstRate: 12
    }).returning();
    productId = prod.id;

    const [variant] = await db.insert(productVariants).values({
      productId,
      sku: 'CHK-M-RED',
      size: 'M',
      color: 'Red',
      price: 112000,
      stockOnHand: 10,
      reservedStock: 0,
    }).returning();
    variantId = variant.id;

    const [cart] = await db.insert(carts).values({ userId }).returning();
    cartId = cart.id;
    await db.insert(cartItems).values({ cartId, variantId, quantity: 2 });
  });

  afterAll(async () => {
    await db.delete(orders).where(eq(orders.userId, userId));
    await db.delete(carts).where(eq(carts.userId, userId));
    await db.delete(productVariants).where(eq(productVariants.id, variantId));
    await db.delete(products).where(eq(products.id, productId));
    await db.delete(categories).where(eq(categories.id, categoryId));
    await db.delete(addresses).where(eq(addresses.id, addressId));
    await db.delete(users).where(eq(users.id, userId));
    await app.close();
  });

  it('1. should process successful checkout, reserve stock, create snapshots, clear cart', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/orders/checkout',
      headers: { authorization: `Bearer ${userToken}` },
      payload: { addressId }
    });

    expect(res.statusCode).toBe(201);
    const body = JSON.parse(res.payload);
    expect(body.success).toBe(true);
    const order = body.data;
    
    expect(order.subtotal).toBe(224000);
    expect(order.shippingTotal).toBe(Number(env.DEFAULT_SHIPPING_FEE));
    
    const [updatedVariant] = await db.select().from(productVariants).where(eq(productVariants.id, variantId));
    expect(updatedVariant.stockOnHand).toBe(10);
    expect(updatedVariant.reservedStock).toBe(2);

    const cItems = await db.select().from(cartItems).where(eq(cartItems.cartId, cartId));
    expect(cItems.length).toBe(0);
    
    const oItems = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
    expect(oItems.length).toBe(1);
    expect(oItems[0].taxAmount).toBe(24000);
  });
});
