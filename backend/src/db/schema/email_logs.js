import { pgTable, uuid, varchar, text, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users.js';
import { orders } from './orders.js';

export const emailLogs = pgTable('email_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
  orderId: uuid('order_id').references(() => orders.id, { onDelete: 'set null' }),
  emailTo: varchar('email_to', { length: 255 }).notNull(),
  emailType: varchar('email_type', { length: 50 }).notNull(), // e.g. ORDER_CONFIRMED, ORDER_SHIPPED
  subject: varchar('subject', { length: 255 }).notNull(),
  status: varchar('status', { enum: ['PENDING', 'SENT', 'FAILED'] }).default('PENDING').notNull(),
  provider: varchar('provider', { length: 50 }).default('resend').notNull(),
  providerMessageId: varchar('provider_message_id', { length: 255 }),
  errorMessage: text('error_message'),
  sentAt: timestamp('sent_at', { withTimezone: true, mode: 'date' }),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
});
