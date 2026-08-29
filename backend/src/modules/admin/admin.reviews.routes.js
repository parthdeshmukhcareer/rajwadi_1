import { requireAuth } from '../../middleware/auth.middleware.js';
import { requireAdmin } from '../../middleware/admin.middleware.js';
import { db } from '../../db/index.js';
import { reviews } from '../../db/schema/index.js';
import { desc, and, eq, sql } from 'drizzle-orm';
import { Errors } from '../../utils/errors.js';
import { z } from 'zod';

const updateStatusSchema = z.object({
  status: z.enum(['PUBLISHED', 'HIDDEN'])
});

export async function adminReviewRoutes(app) {
  app.addHook('preValidation', requireAuth);
  app.addHook('preValidation', requireAdmin);

  app.get('/', async (req, reply) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 24;
    const status = req.query.status;
    const offset = (page - 1) * limit;
    
    const conditions = [];
    if (status) conditions.push(eq(reviews.status, status));

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    
    const [countRes] = await db.select({ count: sql`count(*)`.mapWith(Number) }).from(reviews).where(whereClause);
    const reviewsData = await db.select().from(reviews).where(whereClause).orderBy(desc(reviews.createdAt)).limit(limit).offset(offset);
    
    // Fetch relationships
    const { users, products } = await import('../../db/schema/index.js');
    
    const data = await Promise.all(reviewsData.map(async (review) => {
      const [user] = await db.select().from(users).where(eq(users.id, review.userId)).limit(1);
      const [product] = await db.select().from(products).where(eq(products.id, review.productId)).limit(1);
      return { ...review, user, product };
    }));
    
    return reply.send({ success: true, data, total: countRes.count });
  });

  app.patch('/:id/status', async (req, reply) => {
    const { id } = req.params;
    const payload = updateStatusSchema.parse(req.body);

    const [updated] = await db.update(reviews).set({
      status: payload.status,
      updatedAt: new Date()
    }).where(eq(reviews.id, id)).returning();

    if (!updated) throw Errors.NOT_FOUND('Review');

    return reply.send({ success: true, data: updated });
  });
}
