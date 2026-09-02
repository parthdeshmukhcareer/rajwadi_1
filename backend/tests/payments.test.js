import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { db } from '../src/db/index.js';
import { users, categories, products, productVariants, addresses, carts, cartItems, orders, orderItems, payments, paymentAttempts, webhookEvents, refunds } from '../src/db/schema/index.js';
import { eq } from 'drizzle-orm';
import Fastify from 'fastify';
import { buildApp } from '../src/app.js';
import { razorpay } from '../src/config/razorpay.js';
import crypto from 'crypto';
import { env } from '../src/config/env.js';
import { EmailService } from '../src/services/email.service.js';

describe('Payments E2E', () => {
  let app;
  let userToken;
  let userId;
  let orderNumber;
  let orderId;
  let variantId;
  let catIdToClean;

  beforeAll(async () => {
    process.env.DISABLE_JOBS = 'true';
    app = await buildApp();
    await app.ready();

    const userObj = await db.select().from(users).where(eq(users.email, 'paytest@test.com')).limit(1);
    if (userObj.length > 0) {
      const uId = userObj[0].id;
      await db.delete(refunds);
      await db.delete(paymentAttempts);
      await db.delete(payments);
      await db.delete(orders).where(eq(orders.userId, uId));
      await db.delete(carts).where(eq(carts.userId, uId));
      await db.delete(users).where(eq(users.id, uId));
    }

    const [user] = await db.insert(users).values({
      email: 'paytest@test.com',
      passwordHash: 'dummy',
      firstName: 'Pay',
      lastName: 'User'
    }).returning();
    userId = user.id;
    userToken = app.jwt.sign({ sub: user.id, role: 'CUSTOMER' });

    const [addr] = await db.insert(addresses).values({
      userId: user.id,
      fullName: 'Test User',
      phone: '9999999999',
      addressLine1: '123 Test St',
      city: 'Testville',
      state: 'TS',
      postalCode: '123456',
      country: 'India',
      addressType: 'HOME'
    }).returning();

    // We don't need to delete by hardcoded slug since we will use unique.
    
    const suffix = Date.now().toString();
    const [cat] = await db.insert(categories).values({ name: 'Pay Cat', slug: `pay-cat-${suffix}` }).returning();
    catIdToClean = cat.id;
    const [prod] = await db.insert(products).values({ categoryId: cat.id, name: 'Pay Prod', slug: `pay-prod-${suffix}`, basePrice: 112000, gstRate: 12 }).returning();
    
    const [variant] = await db.insert(productVariants).values({
      productId: prod.id, sku: 'PAY-SKU', size: 'M', color: 'R', price: 112000, stockOnHand: 10, reservedStock: 0
    }).returning();
    variantId = variant.id;

    const [cart] = await db.insert(carts).values({ userId }).returning();
    await db.insert(cartItems).values({ cartId: cart.id, variantId, quantity: 2 });

    // Checkout
    const checkoutRes = await app.inject({
      method: 'POST',
      url: '/api/v1/orders/checkout',
      headers: { authorization: `Bearer ${userToken}` },
      payload: { addressId: addr.id }
    });
    
    const body = JSON.parse(checkoutRes.payload);
    orderNumber = body.data.orderNumber;
    orderId = body.data.id;

    // Mock Razorpay SDK
    let mockedAmount = body.data.grandTotal;
    vi.spyOn(razorpay.orders, 'create').mockImplementation(async (options) => {
      mockedAmount = options.amount;
      return { id: 'order_rzp_mock123', amount: options.amount, currency: options.currency };
    });
    vi.spyOn(razorpay.payments, 'fetch').mockImplementation(async () => ({ 
      id: 'pay_rzp_mock123', 
      amount: mockedAmount, 
      currency: 'INR', 
      status: 'captured', 
      method: 'card', 
      order_id: 'order_rzp_mock123' 
    }));

    // Mock Email Service
    vi.spyOn(EmailService.prototype, 'sendEmail').mockResolvedValue({ success: true, messageId: 'test_email_message_id' });
  });

  afterAll(async () => {
    await db.delete(refunds);
    await db.delete(paymentAttempts);
    await db.delete(payments);
    await db.delete(webhookEvents);
    await db.delete(orderItems);
    await db.delete(orders).where(eq(orders.userId, userId));
    await db.delete(carts).where(eq(carts.userId, userId));
    
    if (variantId) {
      const [v] = await db.select().from(productVariants).where(eq(productVariants.id, variantId));
      if (v) {
        await db.delete(productVariants).where(eq(productVariants.id, variantId));
        await db.delete(products).where(eq(products.id, v.productId));
      }
    }
    if (catIdToClean) {
        await db.delete(categories).where(eq(categories.id, catIdToClean));
    }
    // Also try to cleanup category if we stored its ID
    if (userId) {
      await db.delete(addresses).where(eq(addresses.userId, userId));
      await db.delete(users).where(eq(users.id, userId));
    }
    await app.close();
    vi.restoreAllMocks();
  });

  it('1. should create razorpay order safely', async () => {
    const res = await app.inject({
      method: 'POST',
      url: `/api/v1/orders/${orderNumber}/payment`,
      headers: { authorization: `Bearer ${userToken}` },
    });
    expect(res.statusCode).toBe(201);
    const body = JSON.parse(res.payload);
    expect(body.data.razorpayOrderId).toBe('order_rzp_mock123');
    expect(body.data.amount).toBeGreaterThan(0);
    expect(body.data.keyId).toBeDefined();
    expect(body.data.keySecret).toBeUndefined(); // never expose
  });

  it('2. should verify payment with valid signature and deduct exact stock', async () => {
    const razorpayOrderId = 'order_rzp_mock123';
    const razorpayPaymentId = 'pay_rzp_mock123';
    
    const payload = razorpayOrderId + '|' + razorpayPaymentId;
    const razorpaySignature = crypto.createHmac('sha256', env.RAZORPAY_KEY_SECRET).update(payload).digest('hex');

    const res = await app.inject({
      method: 'POST',
      url: `/api/v1/payments/verify`,
      headers: { authorization: `Bearer ${userToken}` },
      payload: { razorpayOrderId, razorpayPaymentId, razorpaySignature }
    });
    
    if (res.statusCode !== 200) {
      console.log("TEST 2 ERROR:", res.payload);
    }

    expect(res.statusCode).toBe(200);
    
    // Check stock was decremented properly
    const [variant] = await db.select().from(productVariants).where(eq(productVariants.id, variantId));
    expect(variant.reservedStock).toBe(0);
    expect(variant.stockOnHand).toBe(8); // initially 10, bought 2
    
    // Check order status
    const [order] = await db.select().from(orders).where(eq(orders.id, orderId));
    expect(order.status).toBe('CONFIRMED');
    expect(order.paymentStatus).toBe('PAID');
  }, 10000);

  it('3. webhook order.paid should be idempotent (no double deduction)', async () => {
    const payloadObj = {
      event: 'order.paid',
      payload: {
        payment: {
          entity: {
            id: 'pay_rzp_mock123',
            order_id: 'order_rzp_mock123',
            amount: 233900, // example
            currency: 'INR',
            status: 'captured',
            method: 'card'
          }
        }
      }
    };
    
    // Fetch actual amount from DB payment
    const [payment] = await db.select().from(payments).where(eq(payments.orderId, orderId));
    payloadObj.payload.payment.entity.amount = payment.amount;

    const rawBody = JSON.stringify(payloadObj);
    const signature = crypto.createHmac('sha256', env.RAZORPAY_WEBHOOK_SECRET).update(rawBody).digest('hex');

    const res = await app.inject({
      method: 'POST',
      url: `/api/v1/webhooks/razorpay`,
      headers: {
        'x-razorpay-signature': signature,
        'x-razorpay-event-id': 'evt_mock123',
        'content-type': 'application/json'
      },
      payload: rawBody
    });

    expect(res.statusCode).toBe(200);

    // Stock should still be 8
    const [variant] = await db.select().from(productVariants).where(eq(productVariants.id, variantId));
    expect(variant.stockOnHand).toBe(8);
    expect(variant.reservedStock).toBe(0);
  });
});
