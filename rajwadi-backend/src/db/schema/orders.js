import { pgTable, uuid, varchar, integer, timestamp, jsonb, index, check, pgSequence } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { users } from './users.js';

export const orderNumberSeq = pgSequence('order_number_seq', { startWith: 1 });

export const orders = pgTable('orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderNumber: varchar('order_number', { length: 50 }).notNull().unique(), // RJD-YYYY-NNNNNN
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  status: varchar('status', { length: 50 }).notNull().default('PENDING_PAYMENT'),
  paymentStatus: varchar('payment_status', { length: 50 }).notNull().default('PENDING'),
  subtotal: integer('subtotal').notNull(),
  discountTotal: integer('discount_total').notNull().default(0),
  taxTotal: integer('tax_total').notNull(),
  shippingTotal: integer('shipping_total').notNull(),
  grandTotal: integer('grand_total').notNull(),
  couponCode: varchar('coupon_code', { length: 50 }),
  shippingAddress: jsonb('shipping_address').notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
}, (table) => {
  return {
    userIdIdx: index('order_user_id_idx').on(table.userId),
    orderNumberIdx: index('order_order_number_idx').on(table.orderNumber),
    statusIdx: index('order_status_idx').on(table.status),
    paymentStatusIdx: index('order_payment_status_idx').on(table.paymentStatus),
    createdAtIdx: index('order_created_at_idx').on(table.createdAt),
    expiresAtIdx: index('order_expires_at_idx').on(table.expiresAt),
    workerIdx: index('order_worker_idx').on(table.status, table.expiresAt), // For efficient expiration
    subtotalCheck: check('order_subtotal_check', sql`${table.subtotal} >= 0`),
    discountCheck: check('order_discount_check', sql`${table.discountTotal} >= 0`),
    taxCheck: check('order_tax_check', sql`${table.taxTotal} >= 0`),
    shippingCheck: check('order_shipping_check', sql`${table.shippingTotal} >= 0`),
    grandTotalCheck: check('order_grand_total_check', sql`${table.grandTotal} >= 0`),
  };
});
