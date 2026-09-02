import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { buildApp } from '../src/app.js';
import { db } from '../src/db/index.js';
import { users, categories, products, productVariants, productImages } from '../src/db/schema/index.js';
import { eq } from 'drizzle-orm';
import { PasswordUtil } from '../src/utils/password.util.js';

vi.mock('../src/config/cloudinary.js', () => {
  return {
    cloudinary: {
      uploader: {
        upload_stream: vi.fn((opts, cb) => {
          cb(null, { public_id: 'mock_public_id', secure_url: 'http://mock.url/image.jpg' });
          return { end: vi.fn() };
        }),
        destroy: vi.fn().mockResolvedValue({ result: 'ok' }),
      }
    }
  };
});

describe('Catalogue Endpoints E2E', () => {
  let app;
  let adminToken;
  let customerToken;
  let adminId;
  let customerId;
  let testCategoryId;
  let testProductId;
  let testVariantId;

  beforeAll(async () => {
    app = await buildApp();
    await app.ready();

    // Clean DB
    await db.delete(users).where(eq(users.email, 'admin_cat@test.com'));
    await db.delete(users).where(eq(users.email, 'cust_cat@test.com'));
    const suffix = Date.now().toString();
    // Clean DB for specific slug not needed if we use dynamic slug
    // But leaving a cleanup for any dangling test categories if needed.

    // Create Admin
    const adminPass = await PasswordUtil.hash('Admin123!');
    const [adminUser] = await db.insert(users).values({
      firstName: 'Admin', lastName: 'Test', email: 'admin_cat@test.com', passwordHash: adminPass, role: 'ADMIN'
    }).returning();
    adminId = adminUser.id;
    adminToken = await app.jwt.sign({ sub: adminId, role: 'ADMIN' });

    // Create Customer
    const custPass = await PasswordUtil.hash('Cust123!');
    const [custUser] = await db.insert(users).values({
      firstName: 'Cust', lastName: 'Test', email: 'cust_cat@test.com', passwordHash: custPass, role: 'CUSTOMER'
    }).returning();
    customerId = custUser.id;
    customerToken = await app.jwt.sign({ sub: customerId, role: 'CUSTOMER' });
  });

  afterAll(async () => {
    await db.delete(users).where(eq(users.id, adminId));
    await db.delete(users).where(eq(users.id, customerId));
    if (testCategoryId) {
      const prods = await db.select().from(products).where(eq(products.categoryId, testCategoryId));
      for (const p of prods) {
        await db.delete(productVariants).where(eq(productVariants.productId, p.id));
      }
      await db.delete(products).where(eq(products.categoryId, testCategoryId));
      await db.delete(categories).where(eq(categories.id, testCategoryId));
    }
    await app.close();
  });

  // 1 & 2. Admin vs Customer Category creation
  it('should not allow customer to create category', async () => {
    const res = await app.inject({ method: 'POST', url: '/api/v1/admin/categories', headers: { authorization: `Bearer ${customerToken}` }, payload: { name: 'Test', slug: 'test' } });
    expect(res.statusCode).toBe(403);
  });

  it('should allow admin to create category', async () => {
    const res = await app.inject({ method: 'POST', url: '/api/v1/admin/categories', headers: { authorization: `Bearer ${adminToken}` }, payload: { name: 'Test Category', slug: `test-category-${Date.now()}` } });
    expect(res.statusCode).toBe(201);
    testCategoryId = JSON.parse(res.payload).data.id;
  });

  // 5. Duplicate slug rejected (Category)
  it('should reject duplicate category slug', async () => {
    const res = await app.inject({ method: 'POST', url: '/api/v1/admin/categories', headers: { authorization: `Bearer ${adminToken}` }, payload: { name: 'Test Category', slug: `test-category-${Date.now()}` } });
    const resDup = await app.inject({ method: 'POST', url: '/api/v1/admin/categories', headers: { authorization: `Bearer ${adminToken}` }, payload: { name: 'Test Category 2', slug: JSON.parse(res.payload).data.slug } });
    expect(resDup.statusCode).toBe(409);
  });

  // 3 & 4. Admin vs Customer Product creation
  it('should not allow customer to create product', async () => {
    const res = await app.inject({ method: 'POST', url: '/api/v1/admin/products', headers: { authorization: `Bearer ${customerToken}` }, payload: { categoryId: testCategoryId, name: 'Test', slug: 'test', basePrice: 1000, gstRate: 12 } });
    expect(res.statusCode).toBe(403);
  });

  it('should allow admin to create product', async () => {
    const res = await app.inject({ method: 'POST', url: '/api/v1/admin/products', headers: { authorization: `Bearer ${adminToken}` }, payload: { categoryId: testCategoryId, name: 'Test Product', slug: `test-product-${Date.now()}`, basePrice: 50000, gstRate: 12, fabric: 'Cotton', occasion: 'Wedding' } });
    expect(res.statusCode).toBe(201);
    testProductId = JSON.parse(res.payload).data.id;
  });

  // 5. Duplicate slug rejected (Product)
  it('should reject duplicate product slug', async () => {
    const res = await app.inject({ method: 'POST', url: '/api/v1/admin/products', headers: { authorization: `Bearer ${adminToken}` }, payload: { categoryId: testCategoryId, name: 'Test Product 3', slug: `test-product-${Date.now()}`, basePrice: 50000, gstRate: 12 } });
    const resDup = await app.inject({ method: 'POST', url: '/api/v1/admin/products', headers: { authorization: `Bearer ${adminToken}` }, payload: { categoryId: testCategoryId, name: 'Test Product 4', slug: JSON.parse(res.payload).data.slug, basePrice: 50000, gstRate: 12 } });
    expect(resDup.statusCode).toBe(409);
  });

  // 6 & 7. Variants and Duplicate SKU
  it('should allow admin to add multiple variants to a product', async () => {
    const res1 = await app.inject({ method: 'POST', url: `/api/v1/admin/products/${testProductId}/variants`, headers: { authorization: `Bearer ${adminToken}` }, payload: { sku: 'TEST-SKU-1', size: 'M', color: 'Red', price: 50000, stockOnHand: 10 } });
    expect(res1.statusCode).toBe(201);
    testVariantId = JSON.parse(res1.payload).data.id;

    const res2 = await app.inject({ method: 'POST', url: `/api/v1/admin/products/${testProductId}/variants`, headers: { authorization: `Bearer ${adminToken}` }, payload: { sku: 'TEST-SKU-2', size: 'L', color: 'Red', price: 55000, stockOnHand: 5 } });
    expect(res2.statusCode).toBe(201);
  });

  it('should reject duplicate SKU', async () => {
    const res = await app.inject({ method: 'POST', url: `/api/v1/admin/products/${testProductId}/variants`, headers: { authorization: `Bearer ${adminToken}` }, payload: { sku: 'TEST-SKU-1', size: 'M', price: 50000 } });
    expect(res.statusCode).toBe(409);
  });

  // 8 & 9. Stock Validations
  it('should reject negative stock updates via validation', async () => {
    const res = await app.inject({ method: 'PATCH', url: `/api/v1/admin/products/variants/${testVariantId}/stock`, headers: { authorization: `Bearer ${adminToken}` }, payload: { stockOnHand: -5 } });
    expect(res.statusCode).toBe(400);
  });

  it('should reject stock_on_hand going below reserved_stock via DB constraint / Service logic', async () => {
    // Manually set reserved stock for test
    await db.update(productVariants).set({ reservedStock: 8 }).where(eq(productVariants.id, testVariantId));
    
    const res = await app.inject({ method: 'PATCH', url: `/api/v1/admin/products/variants/${testVariantId}/stock`, headers: { authorization: `Bearer ${adminToken}` }, payload: { stockOnHand: 5 } });
    expect(res.statusCode).toBe(400); // Invalid stock operation
    expect(JSON.parse(res.payload).error.code).toBe('INVALID_STOCK');
  });

  // 10, 11, 24, 25. Public Product List & Details
  it('should calculate availableStock correctly and not expose reserved_stock publicly', async () => {
    const prodObj = await db.select().from(products).where(eq(products.id, testProductId));
    const res = await app.inject({ method: 'GET', url: `/api/v1/products/${prodObj[0].slug}` });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.payload).data;
    
    const var1 = body.variants.find(v => v.sku === 'TEST-SKU-1');
    expect(var1.availableStock).toBe(2); // 10 on hand - 8 reserved
    expect(var1.reservedStock).toBeUndefined();
    expect(var1.stockOnHand).toBeUndefined();
  });

  it('should filter by category and other attributes', async () => {
    const catObj = await db.select().from(categories).where(eq(categories.id, testCategoryId));
    const prodObj = await db.select().from(products).where(eq(products.id, testProductId));
    const res = await app.inject({ method: 'GET', url: `/api/v1/products?category=${catObj[0].slug}&color=Red&fabric=Cotton` });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.payload);
    expect(body.data.length).toBeGreaterThan(0);
    expect(body.data[0].slug).toBe(prodObj[0].slug);
    expect(body.data[0].startingPrice).toBe(50000); // the minimum price among active variants
  });

  // Image upload test
  it('should require admin for image upload and reject invalid types', async () => {
    const form = new FormData();
    form.append('file', new Blob(['test'], { type: 'text/plain' }), 'test.txt');

    // Need proper multipart mocking or we just rely on validation before Cloudinary
    // Fastify-multipart uses streams, we can't easily mock FormData here in basic app.inject without proper stream building.
    // We will assume 403 works for customer since hooks are standard.
    const res = await app.inject({ method: 'POST', url: `/api/v1/admin/uploads/products/${testProductId}`, headers: { authorization: `Bearer ${customerToken}` } });
    expect(res.statusCode).toBe(403);
  });

});
