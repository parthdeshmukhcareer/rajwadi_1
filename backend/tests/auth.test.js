import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { buildApp } from '../src/app.js';
import { db } from '../src/db/index.js';
import { users } from '../src/db/schema/index.js';
import { eq } from 'drizzle-orm';

describe('Auth Endpoints E2E', () => {
  let app;
  
  beforeAll(async () => {
    app = await buildApp();
    await app.ready();
    await db.delete(users).where(eq(users.email, 'test_e2e@rajwadi.local'));
  });

  afterAll(async () => {
    await db.delete(users).where(eq(users.email, 'test_e2e@rajwadi.local'));
    await app.close();
  });

  it('should register a new user', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/register',
      payload: {
        firstName: 'Test',
        lastName: 'User',
        email: 'test_e2e@rajwadi.local',
        password: 'Password123!',
      },
    });
    
    expect(response.statusCode).toBe(201);
    const body = JSON.parse(response.payload);
    expect(body.success).toBe(true);
    expect(body.data.user.email).toBe('test_e2e@rajwadi.local');
    expect(body.data.accessToken).toBeDefined();
    expect(response.headers['set-cookie']).toBeDefined();
  });

  it('should login an existing user', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      payload: {
        email: 'test_e2e@rajwadi.local',
        password: 'Password123!',
      },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.payload);
    expect(body.success).toBe(true);
    expect(body.data.accessToken).toBeDefined();
  });

  it('should get current user with access token', async () => {
    const loginRes = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      payload: {
        email: 'test_e2e@rajwadi.local',
        password: 'Password123!',
      },
    });
    const { accessToken } = JSON.parse(loginRes.payload).data;

    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/auth/me',
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.payload);
    expect(body.data.email).toBe('test_e2e@rajwadi.local');
  });
});
