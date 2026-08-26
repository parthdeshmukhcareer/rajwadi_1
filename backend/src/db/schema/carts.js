import { pgTable, uuid, timestamp, index } from 'drizzle-orm/pg-core';
import { users } from './users.js';

export const carts = pgTable('carts', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
}, (table) => {
  return {
    userIdIdx: index('cart_user_id_idx').on(table.userId),
  };
});
