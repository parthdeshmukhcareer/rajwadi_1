import { pgTable, uuid, varchar, integer, timestamp, boolean, index, check, uniqueIndex } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const coupons = pgTable('coupons', {
  id: uuid('id').defaultRandom().primaryKey(),
  code: varchar('code', { length: 50 }).notNull().unique(),
  discountType: varchar('discount_type', { length: 20 }).notNull(), // 'PERCENTAGE' or 'FIXED'
  discountValue: integer('discount_value').notNull(),
  minimumOrderAmount: integer('minimum_order_amount'),
  maximumDiscountAmount: integer('maximum_discount_amount'),
  startsAt: timestamp('starts_at', { withTimezone: true, mode: 'date' }),
  expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }),
  usageLimit: integer('usage_limit'),
  timesUsed: integer('times_used').default(0).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
}, (table) => {
  return {
    codeIdx: uniqueIndex('coupon_code_idx').on(table.code),
    isActiveIdx: index('coupon_is_active_idx').on(table.isActive),
    expiresAtIdx: index('coupon_expires_at_idx').on(table.expiresAt),
    codeUppercaseCheck: check('coupon_code_uppercase_check', sql`${table.code} = UPPER(${table.code})`),
    discountValueCheck: check('coupon_discount_value_check', sql`${table.discountValue} >= 0`),
    minimumOrderCheck: check('coupon_min_order_check', sql`${table.minimumOrderAmount} IS NULL OR ${table.minimumOrderAmount} >= 0`),
    maximumDiscountCheck: check('coupon_max_discount_check', sql`${table.maximumDiscountAmount} IS NULL OR ${table.maximumDiscountAmount} >= 0`),
    usageLimitCheck: check('coupon_usage_limit_check', sql`${table.usageLimit} IS NULL OR ${table.usageLimit} >= 0`),
    timesUsedCheck: check('coupon_times_used_check', sql`${table.timesUsed} >= 0`),
    percentageCheck: check('coupon_percentage_check', sql`${table.discountType} != 'PERCENTAGE' OR (${table.discountValue} >= 0 AND ${table.discountValue} <= 100)`),
  };
});
