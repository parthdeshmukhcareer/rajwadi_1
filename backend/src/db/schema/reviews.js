import { pgTable, uuid, varchar, integer, timestamp, index, check, text } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { users } from './users.js';
import { products } from './products.js';
import { orderItems } from './orderItems.js';

export const reviews = pgTable('reviews', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  productId: uuid('product_id').references(() => products.id, { onDelete: 'cascade' }).notNull(),
  orderItemId: uuid('order_item_id').references(() => orderItems.id, { onDelete: 'cascade' }).unique().notNull(),
  rating: integer('rating').notNull(),
  title: varchar('title', { length: 255 }),
  comment: text('comment'),
  status: varchar('status', { length: 50 }).default('PUBLISHED').notNull(), // PUBLISHED, HIDDEN
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => {
  return {
    productIdIdx: index('review_product_id_idx').on(table.productId),
    userIdIdx: index('review_user_id_idx').on(table.userId),
    statusIdx: index('review_status_idx').on(table.status),
    createdAtIdx: index('review_created_at_idx').on(table.createdAt),
    ratingCheck: check('review_rating_check', sql`${table.rating} >= 1 AND ${table.rating} <= 5`),
  };
});
