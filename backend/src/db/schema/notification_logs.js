import { pgTable, uuid, varchar, text, timestamp } from 'drizzle-orm/pg-core';
import { orders } from './orders.js';

export const notificationLogs = pgTable('notification_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid('order_id').references(() => orders.id, { onDelete: 'cascade' }),
  type: varchar('type', { length: 50 }).notNull(), // e.g. 'WHATSAPP_ORDER_CONFIRMED', 'WHATSAPP_ORDER_CANCELLED'
  status: varchar('status', { length: 50 }).notNull(), // 'SENT', 'FAILED'
  details: text('details'),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
});
