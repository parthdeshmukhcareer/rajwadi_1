import { pgTable, uuid, varchar, text, timestamp } from 'drizzle-orm/pg-core';

export const supportQueries = pgTable('support_queries', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 20 }).notNull(),
  orderNumber: varchar('order_number', { length: 50 }),
  queryType: varchar('query_type', { length: 50 }).notNull(),
  message: text('message').notNull(),
  status: varchar('status', { length: 20 }).default('OPEN').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
});
