import { pgTable, uuid, varchar, integer, timestamp, index } from 'drizzle-orm/pg-core';
import { orders } from './orders.js';
import { payments } from './payments.js';
import { users } from './users.js';

export const refunds = pgTable('refunds', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid('order_id').references(() => orders.id).unique().notNull(),
  paymentId: uuid('payment_id').references(() => payments.id).notNull(),
  razorpayRefundId: varchar('razorpay_refund_id', { length: 255 }).unique(),
  idempotencyKey: varchar('idempotency_key', { length: 255 }).unique().notNull(),
  amount: integer('amount').notNull(),
  currency: varchar('currency', { length: 10 }).default('INR').notNull(),
  status: varchar('status', { length: 50 }).notNull(), // REQUESTED, PROCESSING, REFUNDED, FAILED, REVIEW_REQUIRED
  reason: varchar('reason', { length: 255 }),
  initiatedByUserId: uuid('initiated_by_user_id').references(() => users.id),
  failureCode: varchar('failure_code', { length: 100 }),
  failureReason: varchar('failure_reason', { length: 500 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  refundedAt: timestamp('refunded_at', { withTimezone: true }),
}, (table) => {
  return {
    statusIdx: index('refund_status_idx').on(table.status),
    orderIdIdx: index('refund_order_id_idx').on(table.orderId), // Also created automatically via unique, but good practice
  };
});
