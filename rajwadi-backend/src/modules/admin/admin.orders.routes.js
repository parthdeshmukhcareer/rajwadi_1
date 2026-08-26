import { requireAuth } from '../../middleware/auth.middleware.js';
import { requireAdmin } from '../../middleware/admin.middleware.js';
import { db } from '../../db/index.js';
import { orders } from '../../db/schema/index.js';
import { desc, ilike, and, eq } from 'drizzle-orm';
import { Errors } from '../../utils/errors.js';

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
}
