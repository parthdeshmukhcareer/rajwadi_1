import { pgTable, uuid, varchar, text, boolean, integer, timestamp, uniqueIndex, index, check } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { categories } from './categories.js';

export const products = pgTable('products', {
  id: uuid('id').defaultRandom().primaryKey(),
  categoryId: uuid('category_id').references(() => categories.id, { onDelete: 'restrict' }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  shortDescription: text('short_description'),
  description: text('description'),
  basePrice: integer('base_price').notNull(),
  compareAtPrice: integer('compare_at_price'),
  fabric: varchar('fabric', { length: 255 }),
  workType: varchar('work_type', { length: 255 }),
  occasion: varchar('occasion', { length: 255 }),
  careInstruction: text('care_instruction'),
  hsnCode: varchar('hsn_code', { length: 20 }),
  gstRate: integer('gst_rate').notNull(),
  isFeatured: boolean('is_featured').default(false).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  seoTitle: varchar('seo_title', { length: 255 }),
  seoDescription: text('seo_description'),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
}, (table) => {
  return {
    slugIdx: uniqueIndex('prod_slug_idx').on(table.slug),
    categoryIdx: index('prod_category_id_idx').on(table.categoryId),
    isActiveIdx: index('prod_is_active_idx').on(table.isActive),
    isFeaturedIdx: index('prod_is_featured_idx').on(table.isFeatured),
    createdAtIdx: index('prod_created_at_idx').on(table.createdAt),
    priceCheck: check('prod_price_check', sql`${table.basePrice} >= 0`),
    comparePriceCheck: check('prod_compare_price_check', sql`${table.compareAtPrice} IS NULL OR ${table.compareAtPrice} >= ${table.basePrice}`),
    gstCheck: check('prod_gst_check', sql`${table.gstRate} >= 0`),
  };
});
