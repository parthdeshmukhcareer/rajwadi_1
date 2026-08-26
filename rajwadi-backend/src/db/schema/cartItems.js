import { pgTable, uuid, integer, timestamp, uniqueIndex, index, check } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { carts } from './carts.js';
import { productVariants } from './productVariants.js';

export const cartItems = pgTable('cart_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  cartId: uuid('cart_id').references(() => carts.id, { onDelete: 'cascade' }).notNull(),
  variantId: uuid('variant_id').references(() => productVariants.id, { onDelete: 'cascade' }).notNull(),
  quantity: integer('quantity').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
}, (table) => {
  return {
    cartIdIdx: index('ci_cart_id_idx').on(table.cartId),
    variantIdIdx: index('ci_variant_id_idx').on(table.variantId),
    uniqueCartVariantIdx: uniqueIndex('ci_cart_variant_idx').on(table.cartId, table.variantId),
    quantityCheck: check('ci_quantity_check', sql`${table.quantity} > 0`),
  };
});
