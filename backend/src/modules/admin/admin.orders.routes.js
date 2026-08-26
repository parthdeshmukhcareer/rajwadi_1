import { requireAuth } from '../../middleware/auth.middleware.js';
import { requireAdmin } from '../../middleware/admin.middleware.js';
import { db } from '../../db/index.js';
import { orders } from '../../db/schema/index.js';
import { desc, ilike, and, eq } from 'drizzle-orm';
import { Errors } from '../../utils/errors.js';
import { OrdersRepository } from '../orders/orders.repository.js';
import { z } from 'zod';

const ordersRepo = new OrdersRepository();

const updateStatusSchema = z.object({
  status: z.enum(['PROCESSING', 'SHIPPED', 'DELIVERED']),
  shippingCarrier: z.string().optional(),
  trackingNumber: z.string().optional(),
  trackingUrl: z.string().url().optional()
});

export async function adminOrderRoutes(app) {
  app.addHook('preValidation', requireAuth);
  app.addHook('preValidation', requireAdmin);

  app.get('/', async (req, reply) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 24;
    const search = req.query.search;
    
    const conditions = [];
    if (search) conditions.push(ilike(orders.orderNumber, `%${search}%`));
    
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    
    const data = await db.select().from(orders).where(whereClause).orderBy(desc(orders.createdAt)).limit(limit).offset((page - 1) * limit);
    return reply.send({ success: true, data });
  });

  app.get('/:id', async (req, reply) => {
    const { id } = req.params;
    const [order] = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
    if (!order) throw Errors.ORDER_NOT_FOUND();
    return reply.send({ success: true, data: order });
  });

  app.patch('/:id/status', async (req, reply) => {
    const { id } = req.params;
    const payload = updateStatusSchema.parse(req.body);
    
    let updatedOrder;
    try {
      updatedOrder = await ordersRepo.processAdminOrderStatusUpdateTransaction(id, payload.status, payload);
    } catch (err) {
      if (err.message === 'ORDER_NOT_FOUND') throw Errors.ORDER_NOT_FOUND();
      if (err.message === 'INVALID_ORDER_TRANSITION') throw Errors.INVALID_ORDER_TRANSITION();
      if (err.message === 'SHIPPING_DATA_REQUIRED') throw Errors.SHIPPING_DATA_REQUIRED();
      throw err;
    }
    
    return reply.send({ success: true, data: updatedOrder });
  });
}
