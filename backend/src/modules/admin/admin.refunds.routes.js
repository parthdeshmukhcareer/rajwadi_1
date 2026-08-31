import { requireAuth } from '../../middleware/auth.middleware.js';
import { requireAdmin } from '../../middleware/admin.middleware.js';
import { db } from '../../db/index.js';
import { refunds, orders } from '../../db/schema/index.js';
import { desc, ilike, and, eq } from 'drizzle-orm';
import { OrdersRepository } from '../orders/orders.repository.js';
import crypto from 'crypto';
import { razorpay } from '../../config/razorpay.js';
import { Errors } from '../../utils/errors.js';

const ordersRepo = new OrdersRepository();

export async function adminRefundRoutes(app) {
  app.addHook('preValidation', requireAuth);
  app.addHook('preValidation', requireAdmin);

  app.get('/', async (req, reply) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 24;
    
    const data = await db.select().from(refunds).orderBy(desc(refunds.createdAt)).limit(limit).offset((page - 1) * limit);
    return reply.send({ success: true, data });
  });

  app.get('/:id', async (req, reply) => {
    const { id } = req.params;
    const [refund] = await db.select().from(refunds).where(eq(refunds.id, id)).limit(1);
    if (!refund) throw Errors.NOT_FOUND('Refund');
    return reply.send({ success: true, data: refund });
  });

  app.post('/orders/:orderId/cancel-refund', async (req, reply) => {
    const { orderId } = req.params;
    const adminId = req.user.id;

    let idToUse = orderId;
    if (orderId.startsWith('RJD-')) {
      const [orderRec] = await db.select().from(orders).where(eq(orders.orderNumber, orderId)).limit(1);
      if (!orderRec) throw Errors.ORDER_NOT_FOUND();
      idToUse = orderRec.id;
    }

    // Fixed idempotency key for this order's refund
    const idempotencyKey = `ref_order_${idToUse}`;

    let result;
    try {
      result = await ordersRepo.processPaidCancellationTransaction(idToUse, adminId, idempotencyKey);
    } catch (err) {
      if (err.message === 'ORDER_NOT_FOUND') throw Errors.ORDER_NOT_FOUND();
      if (err.message === 'ORDER_CANNOT_BE_CANCELLED') throw Errors.ORDER_CANNOT_BE_CANCELLED();
      if (err.message === 'ORDER_NOT_PAID') throw Errors.ORDER_NOT_PAID();
      if (err.message === 'NO_CAPTURED_PAYMENT_ATTEMPT') throw Errors.NO_CAPTURED_PAYMENT_ATTEMPT();
      if (err.message === 'PAYMENT_AMOUNT_MISMATCH') throw Errors.PAYMENT_AMOUNT_MISMATCH();
      if (err.message === 'INVALID_CURRENCY') throw Errors.PAYMENT_CURRENCY_MISMATCH();
      throw err;
    }

    const refundId = result.refund.id;
    const capturedPaymentId = result.paymentAttempt ? result.paymentAttempt.razorpayPaymentId : null;

    // Atomically claim the refund to call external API
    let claimedRefund;
    await db.transaction(async (tx) => {
      const [lockedRefund] = await tx.select().from(refunds).where(eq(refunds.id, refundId)).for('update');
      if (lockedRefund.status === 'REQUESTED') {
        const [updated] = await tx.update(refunds).set({ status: 'PROCESSING', updatedAt: new Date() }).where(eq(refunds.id, refundId)).returning();
        claimedRefund = updated;
      } else {
        claimedRefund = lockedRefund; // Already processing/refunded/failed
      }
    });

    if (claimedRefund.status !== 'PROCESSING' || !capturedPaymentId) {
      return reply.send({ success: true, message: 'Refund is already being processed or finished.', data: { refund: claimedRefund } });
    }

    try {
      // Call Razorpay API using idempotency key
      const razorpayRefund = await razorpay.payments.refund(capturedPaymentId, {
        amount: claimedRefund.amount,
        receipt: `rjd_ref_${idToUse}`,
        notes: { orderId: idToUse }
      });

      let newStatus = 'PROCESSING';
      let refundedAt = null;

      if (razorpayRefund.status === 'processed') {
        newStatus = 'REFUNDED';
        refundedAt = new Date();
      }

      const [finalRefund] = await db.update(refunds).set({
        razorpayRefundId: razorpayRefund.id,
        status: newStatus,
        refundedAt: refundedAt,
        updatedAt: new Date()
      }).where(eq(refunds.id, refundId)).returning();

      return reply.send({ success: true, message: 'Refund initiated successfully', data: { refund: finalRefund } });
    } catch (apiError) {
      // Ambiguous network failure or provider rejection
      // Do NOT revert the DB inventory or CANCELLED order status
      const failureReason = apiError.error ? apiError.error.description : apiError.message;
      
      const [failedRefund] = await db.update(refunds).set({
        status: 'REVIEW_REQUIRED',
        failureReason: String(failureReason).substring(0, 500),
        updatedAt: new Date()
      }).where(eq(refunds.id, refundId)).returning();

      return reply.send({ success: true, message: 'Cancellation succeeded, but refund provider API returned an error. Review Required.', data: { refund: failedRefund } });
    }
  });

  app.delete('/:id', async (req, reply) => {
    const { id } = req.params;
    const [deletedRefund] = await db.delete(refunds).where(eq(refunds.id, id)).returning();
    if (!deletedRefund) throw Errors.NOT_FOUND('Refund');
    return reply.send({ success: true, message: 'Refund record deleted successfully' });
  });
}
