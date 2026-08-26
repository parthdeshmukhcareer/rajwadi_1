import { db } from '../../db/index.js';
import { orders, productVariants, payments, paymentAttempts, webhookEvents, refunds } from '../../db/schema/index.js';
import { eq, inArray, sql as drizzleSql } from 'drizzle-orm';
import { Errors } from '../../utils/Errors.js';

export class PaymentsRepository {
  async getOrderForPayment(orderNumber, userId) {
    const query = db.select().from(orders).where(eq(orders.orderNumber, orderNumber));
    if (userId) {
      query.where(eq(orders.userId, userId));
    }
    const [order] = await query;
    return order;
  }

  async getOrderById(orderId) {
    const [order] = await db.select().from(orders).where(eq(orders.id, orderId));
    return order;
  }

  async getPaymentByOrder(orderId) {
    const [payment] = await db.select().from(payments).where(eq(payments.orderId, orderId));
    return payment;
  }

  async getPaymentByRazorpayOrderId(razorpayOrderId) {
    const [payment] = await db.select().from(payments).where(eq(payments.razorpayOrderId, razorpayOrderId));
    return payment;
  }

  async createRazorpayOrder(paymentData) {
    const [payment] = await db.insert(payments).values(paymentData).returning();
    return payment;
  }

  async recordPaymentAttempt(attemptData) {
    const [attempt] = await db.insert(paymentAttempts).values({
      ...attemptData,
      status: attemptData.status || 'AUTHORIZED'
    }).onConflictDoUpdate({
      target: paymentAttempts.razorpayPaymentId,
      set: {
        status: attemptData.status,
        failureCode: attemptData.failureCode,
        failureReason: attemptData.failureReason,
        updatedAt: new Date()
      }
    }).returning();
    return attempt;
  }

  async confirmPaidOrderTransaction(orderId, paymentAttemptData) {
    return await db.transaction(async (tx) => {
      // 1. Lock the order row
      const [order] = await tx.execute(
        drizzleSql`SELECT * FROM ${orders} WHERE id = ${orderId} FOR UPDATE`
      );

      if (!order) {
        throw Errors.ORDER_NOT_FOUND();
      }

      // 2. Already Paid / Confirmed?
      if (order.payment_status === 'PAID' && ['CONFIRMED', 'SHIPPED', 'DELIVERED'].includes(order.status)) {
        return { success: true, alreadyPaid: true, order };
      }

      // 3. Late Payment Check (Expired)
      if (order.status === 'EXPIRED') {
        // Record reconciliation state
        await tx.update(payments).set({
          status: 'PAID',
          reconciliationStatus: 'REVIEW_REQUIRED',
          paidAt: new Date(),
          updatedAt: new Date()
        }).where(eq(payments.orderId, orderId));

        await tx.insert(paymentAttempts).values({
          ...paymentAttemptData,
          orderId,
          status: 'CAPTURED'
        }).onConflictDoUpdate({
          target: paymentAttempts.razorpayPaymentId,
          set: { status: 'CAPTURED', updatedAt: new Date() }
        });

        // Do NOT consume stock!
        return { success: true, latePayment: true, order };
      }

      if (order.status !== 'PENDING_PAYMENT' || order.payment_status !== 'PENDING') {
        throw Errors.INVALID_ORDER_STATE('Order is not in pending state');
      }

      // 4. Lock Variants Deterministically
      const items = await tx.execute(
        drizzleSql`SELECT variant_id, quantity FROM order_items WHERE order_id = ${orderId} ORDER BY variant_id ASC`
      );

      const variantIds = items.map(item => item.variant_id);
      
      const lockedVariantsRes = await tx.execute(
        drizzleSql`SELECT id, stock_on_hand, reserved_stock FROM product_variants WHERE id IN (${drizzleSql.join(variantIds, drizzleSql`, `)}) FOR UPDATE`
      );

      // Verify and deduct
      for (const item of items) {
        const variant = lockedVariantsRes.find(v => v.id === item.variant_id);
        if (!variant) throw Errors.OUT_OF_STOCK('Variant not found during confirmation');
        if (variant.reserved_stock < item.quantity) {
             throw Errors.CHECKOUT_CONFLICT('Insufficient reserved stock for confirmation. Might have been released already.');
        }

        // Convert reserved to sold (decrement stock_on_hand)
        await tx.execute(
          drizzleSql`UPDATE product_variants 
                     SET stock_on_hand = stock_on_hand - ${item.quantity},
                         reserved_stock = reserved_stock - ${item.quantity}
                     WHERE id = ${item.variant_id} AND stock_on_hand >= ${item.quantity} AND reserved_stock >= ${item.quantity}`
        );
      }

      // 5. Mark Order Paid & Confirmed
      const [updatedOrder] = await tx.update(orders).set({
        status: 'CONFIRMED',
        paymentStatus: 'PAID',
        updatedAt: new Date()
      }).where(eq(orders.id, orderId)).returning();

      // 6. Update payment tables
      await tx.update(payments).set({
        status: 'PAID',
        paidAt: new Date(),
        updatedAt: new Date()
      }).where(eq(payments.orderId, orderId));

      await tx.insert(paymentAttempts).values({
        ...paymentAttemptData,
        orderId,
        status: 'CAPTURED'
      }).onConflictDoUpdate({
        target: paymentAttempts.razorpayPaymentId,
        set: { status: 'CAPTURED', updatedAt: new Date() }
      });

      return { success: true, order: updatedOrder };
    });
  }

  async getWebhookEvent(providerEventId) {
    const [event] = await db.select().from(webhookEvents).where(eq(webhookEvents.providerEventId, providerEventId));
    return event;
  }

  async saveWebhookEvent(eventData) {
    const [event] = await db.insert(webhookEvents).values(eventData)
      .onConflictDoUpdate({
        target: webhookEvents.providerEventId,
        set: { status: eventData.status, processedAt: eventData.processedAt, errorMessage: eventData.errorMessage }
      }).returning();
    return event;
  }

  async updateWebhookEventStatus(providerEventId, updates) {
    const [event] = await db.update(webhookEvents)
      .set(updates)
      .where(eq(webhookEvents.providerEventId, providerEventId))
      .returning();
    return event;
  }

  async processRefundWebhook(refundEntity, newStatus) {
    const { id: razorpayRefundId, payment_id: razorpayPaymentId, amount } = refundEntity;
    
    const [paymentAttempt] = await db.select().from(paymentAttempts).where(eq(paymentAttempts.razorpayPaymentId, razorpayPaymentId)).limit(1);
    if (!paymentAttempt) return;

    const [refundRecord] = await db.select().from(refunds).where(eq(refunds.paymentId, paymentAttempt.paymentId)).limit(1);
    if (!refundRecord) return;

    if (refundRecord.amount !== amount) return;

    // Avoid regressing state if already processed manually
    if (refundRecord.status === 'REFUNDED') return;

    if (newStatus === 'REFUNDED') {
       await db.update(refunds).set({
         razorpayRefundId: razorpayRefundId,
         status: 'REFUNDED',
         refundedAt: new Date(),
         updatedAt: new Date()
       }).where(eq(refunds.id, refundRecord.id));
       
       await db.update(orders).set({ paymentStatus: 'REFUNDED', updatedAt: new Date() }).where(eq(orders.id, refundRecord.orderId));
    } else if (newStatus === 'FAILED') {
       await db.update(refunds).set({
         razorpayRefundId: razorpayRefundId,
         status: 'FAILED',
         failureReason: 'Webhook reported failure',
         updatedAt: new Date()
       }).where(eq(refunds.id, refundRecord.id));
    }
  }
}
