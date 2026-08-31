import { db } from '../../db/index.js';
import { payments, orders, users } from '../../db/schema/index.js';
import { eq, desc, sql } from 'drizzle-orm';
import { DomainError } from '../../utils/errors.js';

export class AdminPaymentsController {
  getPayments = async (request, reply) => {
    try {
      const { page = 1, limit = 10 } = request.query;
      const offset = (parseInt(page) - 1) * parseInt(limit);

      const [countRes] = await db.select({ count: sql`count(*)`.mapWith(Number) }).from(payments);
      const total = countRes.count;

      const items = await db.select({
        id: payments.id,
        amount: payments.amount,
        currency: payments.currency,
        status: payments.status,
        provider: payments.provider,
        razorpayOrderId: payments.razorpayOrderId,
        createdAt: payments.createdAt,
        paidAt: payments.paidAt,
        order: {
          orderNumber: orders.orderNumber,
        },
      })
      .from(payments)
      .leftJoin(orders, eq(payments.orderId, orders.id))
      .orderBy(desc(payments.createdAt))
      .limit(parseInt(limit))
      .offset(offset);

      return reply.send({
        success: true,
        data: items,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit))
        }
      });
    } catch (error) {
      throw new DomainError('Failed to fetch payments', 'FETCH_PAYMENTS_FAILED', 500);
    }
  };
}
