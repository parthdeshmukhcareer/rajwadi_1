import { describe, it, expect, beforeAll, afterAll, vi, beforeEach } from 'vitest';
import { EmailService } from '../src/services/email.service.js';
import { db } from '../src/db/index.js';
import { emailLogs, users, orders } from '../src/db/schema/index.js';
import { eq } from 'drizzle-orm';

describe('EmailService', () => {
  let emailService;
  
  beforeAll(() => {
    // Force NODE_ENV to something else temporarily if we want to test the Resend mock throwing, 
    // but our service now skips Resend in 'test'. 
    // To test the exact error handling, we can mock `emailService.resend.emails.send` and override process.env.NODE_ENV
    process.env.RESEND_API_KEY = 'test_key';
    emailService = new EmailService();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  beforeEach(async () => {
    await db.delete(emailLogs);
  });

  it('1. Creates PENDING email log and updates to SENT when Resend mock succeeds', async () => {
    // Override the NODE_ENV check inside the class for this test to force it to hit the mock
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    
    vi.spyOn(emailService.resend.emails, 'send').mockResolvedValue({
      data: { id: 'mock_success_id' },
      error: null
    });

    const res = await emailService.sendEmail({
      to: 'test@example.com',
      subject: 'Test Success',
      html: '<p>Hi</p>',
      emailType: 'ORDER_CONFIRMED'
    });

    expect(res.success).toBe(true);
    expect(res.messageId).toBe('mock_success_id');

    const logs = await db.select().from(emailLogs).where(eq(emailLogs.emailTo, 'test@example.com'));
    expect(logs.length).toBe(1);
    expect(logs[0].status).toBe('SENT');
    expect(logs[0].providerMessageId).toBe('mock_success_id');

    process.env.NODE_ENV = originalEnv;
  });

  it('2. Updates to FAILED when Resend mock fails and does not throw error that breaks caller', async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    
    vi.spyOn(emailService.resend.emails, 'send').mockResolvedValue({
      data: null,
      error: { message: 'Mocked API Error' }
    });

    // Should not throw
    const res = await emailService.sendEmail({
      to: 'fail@example.com',
      subject: 'Test Fail',
      html: '<p>Hi</p>',
      emailType: 'ORDER_CONFIRMED'
    });

    expect(res.success).toBe(false);
    expect(res.error).toBe('Mocked API Error');

    const logs = await db.select().from(emailLogs).where(eq(emailLogs.emailTo, 'fail@example.com'));
    expect(logs.length).toBe(1);
    expect(logs[0].status).toBe('FAILED');
    expect(logs[0].errorMessage).toBe('Mocked API Error');

    process.env.NODE_ENV = originalEnv;
  });

  it('3. Duplicate ORDER_CONFIRMED SENT email is skipped', async () => {
    // Create dummy user and order to satisfy foreign keys
    const ts = Date.now();
    const [user] = await db.insert(users).values({ email: `dup_test_${ts}@test.com`, passwordHash: 'hash', firstName: 'D', lastName: 'T' }).returning();
    const [order] = await db.insert(orders).values({ userId: user.id, orderNumber: `ORD-DUP-${ts}`, subtotal: 100, taxTotal: 0, shippingTotal: 0, totalAmount: 100, grandTotal: 100, status: 'PENDING', shippingAddress: {} }).returning();

    // Insert a SENT log
    await db.insert(emailLogs).values({
      orderId: order.id,
      emailTo: 'dup@example.com',
      emailType: 'ORDER_CONFIRMED',
      subject: 'Dup',
      status: 'SENT',
      provider: 'resend'
    });

    const res = await emailService.sendOrderConfirmation(order, user, [], {});

    expect(res).toBeUndefined(); // Returns early (undefined) when skipped

    // cleanup
    await db.delete(emailLogs).where(eq(emailLogs.orderId, order.id));
    await db.delete(orders).where(eq(orders.id, order.id));
    await db.delete(users).where(eq(users.id, user.id));
  });

  it('4. FAILED email can retry (does not skip)', async () => {
    const ts = Date.now();
    const [user] = await db.insert(users).values({ email: `retry_test_${ts}@test.com`, passwordHash: 'hash', firstName: 'R', lastName: 'T' }).returning();
    const [order] = await db.insert(orders).values({ userId: user.id, orderNumber: `ORD-RETRY-${ts}`, subtotal: 100, taxTotal: 0, shippingTotal: 0, totalAmount: 100, grandTotal: 100, status: 'PENDING', shippingAddress: {} }).returning();

    // Insert a FAILED log
    await db.insert(emailLogs).values({
      orderId: order.id,
      emailTo: 'retry@example.com',
      emailType: 'ORDER_CONFIRMED',
      subject: 'Retry',
      status: 'FAILED',
      provider: 'resend'
    });

    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'test'; // use fallback mock

    const res = await emailService.sendOrderConfirmation(order, user, [], {});

    expect(res.success).toBe(true);

    const logs = await db.select().from(emailLogs).where(eq(emailLogs.orderId, order.id));
    expect(logs.length).toBe(2); // One FAILED, one SENT
    expect(logs.find(l => l.status === 'SENT')).toBeDefined();

    process.env.NODE_ENV = originalEnv;

    // cleanup
    await db.delete(emailLogs).where(eq(emailLogs.orderId, order.id));
    await db.delete(orders).where(eq(orders.id, order.id));
    await db.delete(users).where(eq(users.id, user.id));
  });
});
