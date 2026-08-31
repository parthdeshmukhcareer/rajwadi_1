import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { buildApp } from '../src/app.js';
import { db } from '../src/db/index.js';
import { users, orders } from '../src/db/schema/index.js';
import { eq } from 'drizzle-orm';
import { PasswordUtil } from '../src/utils/password.util.js';

describe('Admin Reports API', () => {
  let app;
  let adminToken;
  let customerToken;
  let adminUser;
  let customerUser;

  beforeAll(async () => {
    app = await buildApp();
    await app.ready();
    
    // Create admin
    const adminPass = await PasswordUtil.hash('Admin123!');
    [adminUser] = await db.insert(users).values({ firstName: 'A', lastName: 'T', email: 'report_admin@test.com', passwordHash: adminPass, role: 'ADMIN' }).returning();
    adminToken = await app.jwt.sign({ sub: adminUser.id, role: 'ADMIN' });

    // Create customer
    const custPass = await PasswordUtil.hash('Cust123!');
    [customerUser] = await db.insert(users).values({ firstName: 'C', lastName: 'T', email: 'report_cust@test.com', passwordHash: custPass, role: 'CUSTOMER' }).returning();
    customerToken = await app.jwt.sign({ sub: customerUser.id, role: 'CUSTOMER' });
  });

  afterAll(async () => {
    await db.delete(orders).where(eq(orders.userId, customerUser.id));
    await db.delete(users).where(eq(users.id, adminUser.id));
    await db.delete(users).where(eq(users.id, customerUser.id));
    await app.close();
  });

  it('1. Guest receives 401', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/admin/reports/sales'
    });
    expect(response.statusCode).toBe(401);
  });

  it('2. Customer receives 403', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/admin/reports/sales',
      headers: {
        Authorization: `Bearer ${customerToken}`
      }
    });
    expect(response.statusCode).toBe(403);
  });

  it('3. Admin can access /api/v1/admin/reports/sales', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/admin/reports/sales',
      headers: {
        Authorization: `Bearer ${adminToken}`
      }
    });
    expect(response.statusCode).toBe(200);
    const data = JSON.parse(response.body);
    expect(data.success).toBe(true);
    expect(data.data.metrics).toBeDefined();
    expect(data.data.metrics.averageOrderValue).toBeDefined();
    expect(data.data.topSellingProducts).toBeInstanceOf(Array);
    expect(data.data.recentOrders).toBeInstanceOf(Array);
  });

  it('4. Invalid range returns 200 but uses default (or whatever logic handles it, or custom fails without dates)', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/admin/reports/sales?range=custom',
      headers: {
        Authorization: `Bearer ${adminToken}`
      }
    });
    expect(response.statusCode).toBe(400); // Custom without dates should fail
    const data = JSON.parse(response.body);
    expect(data.success).toBe(false);
  });
});
