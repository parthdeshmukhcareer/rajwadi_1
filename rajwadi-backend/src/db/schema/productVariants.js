import { pgTable, uuid, varchar, boolean, integer, timestamp, uniqueIndex, index, check } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { products } from './products.js';

export const productVariants = pgTable('product_variants', {
  id: uuid('id').defaultRandom().primaryKey(),
  productId: uuid('product_id').references(() => products.id, { onDelete: 'cascade' }).notNull(),
  sku: varchar('sku', { length: 100 }).notNull().unique(),
  size: varchar('size', { length: 50 }),
  color: varchar('color', { length: 50 }),
  price: integer('price').notNull(),
  compareAtPrice: integer('compare_at_price'),
  stockOnHand: integer('stock_on_hand').default(0).notNull(),
  reservedStock: integer('reserved_stock').default(0).notNull(),
  weightGrams: integer('weight_grams'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
}, (table) => {
  return {
    productIdx: index('pv_product_id_idx').on(table.productId),
    skuIdx: uniqueIndex('pv_sku_idx').on(table.sku),
    isActiveIdx: index('pv_is_active_idx').on(table.isActive),
    priceCheck: check('pv_price_check', sql`${table.price} >= 0`),
    comparePriceCheck: check('pv_compare_price_check', sql`${table.compareAtPrice} IS NULL OR ${table.compareAtPrice} >= ${table.price}`),
    stockOnHandCheck: check('pv_stock_on_hand_check', sql`${table.stockOnHand} >= 0`),
    reservedStockCheck: check('pv_reserved_stock_check', sql`${table.reservedStock} >= 0`),
    stockSafetyCheck: check('pv_stock_safety_check', sql`${table.reservedStock} <= ${table.stockOnHand}`),
    weightCheck: check('pv_weight_check', sql`${table.weightGrams} IS NULL OR ${table.weightGrams} >= 0`),
  };
});
