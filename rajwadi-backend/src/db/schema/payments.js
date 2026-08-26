import { pgTable, uuid, varchar, integer, timestamp } from 'drizzle-orm/pg-core';
import { orders } from './orders.js';

export const payments = pgTable('payments', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid('order_id').references(() => orders.id).unique().notNull(),
  provider: varchar('provider', { length: 50 }).default('RAZORPAY').notNull(),
  razorpayOrderId: varchar('razorpay_order_id', { length: 255 }).unique().notNull(),
  amount: integer('amount').notNull(),
  currency: varchar('currency', { length: 10 }).default('INR').notNull(),
  status: varchar('status', { length: 50 }).notNull(), // CREATED, PAID, REFUNDED
  reconciliationStatus: varchar('reconciliation_status', { length: 50 }), // e.g. REVIEW_REQUIRED
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  paidAt: timestamp('paid_at', { withTimezone: true }),
});

export const paymentAttempts = pgTable('payment_attempts', {
  id: uuid('id').defaultRandom().primaryKey(),
  paymentId: uuid('payment_id').references(() => payments.id).notNull(),
  orderId: uuid('order_id').references(() => orders.id).notNull(),
  razorpayPaymentId: varchar('razorpay_payment_id', { length: 255 }).unique().notNull(),
  status: varchar('status', { length: 50 }).notNull(), // AUTHORIZED, CAPTURED, FAILED
  amount: integer('amount').notNull(),
  currency: varchar('currency', { length: 10 }).default('INR').notNull(),
  paymentMethod: varchar('payment_method', { length: 50 }),
  failureCode: varchar('failure_code', { length: 100 }),
  failureReason: varchar('failure_reason', { length: 255 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});
