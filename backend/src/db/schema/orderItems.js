import { pgTable, uuid, varchar, integer, timestamp, index } from 'drizzle-orm/pg-core';
import { orders } from './orders.js';

export const orderItems = pgTable('order_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid('order_id').references(() => orders.id, { onDelete: 'cascade' }).notNull(),
  productId: uuid('product_id').notNull(),
  variantId: uuid('variant_id').notNull(),
  productName: varchar('product_name', { length: 255 }).notNull(),
  sku: varchar('sku', { length: 100 }).notNull(),
  size: varchar('size', { length: 50 }),
  color: varchar('color', { length: 50 }),
  unitPrice: integer('unit_price').notNull(),
  quantity: integer('quantity').notNull(),
  discountAmount: integer('discount_amount').notNull().default(0),
  taxAmount: integer('tax_amount').notNull().default(0),
  lineTotal: integer('line_total').notNull(),
  productImage: varchar('product_image', { length: 500 }),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
}, (table) => {
  return {
    orderIdIdx: index('oi_order_id_idx').on(table.orderId),
    variantIdIdx: index('oi_variant_id_idx').on(table.variantId),
  };
});
