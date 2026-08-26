import { requireAuth } from '../../middleware/auth.middleware.js';
import { db } from '../../db/index.js';
import { reviews, orders, orderItems } from '../../db/schema/index.js';
import { eq, and, desc, sql } from 'drizzle-orm';
import { Errors } from '../../utils/errors.js';
import { z } from 'zod';

const createReviewSchema = z.object({
  orderItemId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  title: z.string().max(255).optional(),
  comment: z.string().optional()
});

const updateReviewSchema = z.object({
  rating: z.number().int().min(1).max(5).optional(),
  title: z.string().max(255).optional(),
  comment: z.string().optional()
});

export async function reviewsRoutes(app) {
  // Public route to get reviews for a product
  app.get('/:productId/reviews', async (req, reply) => {
    const { productId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const [countRes] = await db.select({ count: sql`count(*)`.mapWith(Number) })
      .from(reviews).where(and(eq(reviews.productId, productId), eq(reviews.status, 'PUBLISHED')));
    
    const data = await db.select().from(reviews)
      .where(and(eq(reviews.productId, productId), eq(reviews.status, 'PUBLISHED')))
      .orderBy(desc(reviews.createdAt))
      .limit(limit)
      .offset(offset);
      
    return reply.send({ success: true, data, total: countRes.count });
  });

  // Protected routes
  app.register(async (protectedApp) => {
    protectedApp.addHook('preValidation', requireAuth);

    protectedApp.post('/:productId/reviews', async (req, reply) => {
      const { productId } = req.params;
      const userId = req.user.id;
      const payload = createReviewSchema.parse(req.body);

      // Verify purchase
      const [orderItem] = await db.select({
        id: orderItems.id,
        productId: orderItems.productId,
        orderId: orders.id,
        orderStatus: orders.status,
        orderUserId: orders.userId
      })
      .from(orderItems)
      .innerJoin(orders, eq(orders.id, orderItems.orderId))
      .where(eq(orderItems.id, payload.orderItemId))
      .limit(1);

      if (!orderItem) {
         throw Errors.VALIDATION_ERROR('Order item not found.');
      }
      if (orderItem.orderUserId !== userId) {
         throw Errors.FORBIDDEN();
      }
      if (orderItem.orderStatus !== 'DELIVERED') {
         throw Errors.VALIDATION_ERROR('You can only review delivered items.');
      }
      if (orderItem.productId !== productId) {
         throw Errors.VALIDATION_ERROR('Order item product mismatch.');
      }

      try {
        const [review] = await db.insert(reviews).values({
          userId,
          productId,
          orderItemId: payload.orderItemId,
          rating: payload.rating,
          title: payload.title,
          comment: payload.comment,
          status: 'PUBLISHED'
        }).returning();

        return reply.status(201).send({ success: true, data: review });
      } catch (err) {
        if (err.code === '23505') { // unique_violation
           throw Errors.CONFLICT('You have already reviewed this item.');
        }
        throw err;
      }
    });

    protectedApp.patch('/:productId/reviews/:id', async (req, reply) => {
      const { id, productId } = req.params;
      const userId = req.user.id;
      const payload = updateReviewSchema.parse(req.body);

      const [existing] = await db.select().from(reviews).where(and(eq(reviews.id, id), eq(reviews.userId, userId), eq(reviews.productId, productId))).limit(1);
      if (!existing) throw Errors.NOT_FOUND('Review');

      const [updated] = await db.update(reviews).set({
        ...payload,
        updatedAt: new Date()
      }).where(eq(reviews.id, id)).returning();

      return reply.send({ success: true, data: updated });
    });

    protectedApp.delete('/:productId/reviews/:id', async (req, reply) => {
      const { id, productId } = req.params;
      const userId = req.user.id;

      const [deleted] = await db.delete(reviews).where(and(eq(reviews.id, id), eq(reviews.userId, userId), eq(reviews.productId, productId))).returning();
      if (!deleted) throw Errors.NOT_FOUND('Review');

      return reply.send({ success: true, message: 'Review deleted successfully' });
    });
  });
}
