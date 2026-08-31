import { pgTable, uuid, varchar, text, boolean, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';

export const settings = pgTable('settings', {
  id: uuid('id').defaultRandom().primaryKey(),
  key: varchar('key', { length: 255 }).notNull().unique(),
  value: text('value'),
  type: varchar('type', { length: 50 }).notNull(), // 'string', 'number', 'boolean', 'json'
  group: varchar('group', { length: 100 }).notNull(), // e.g. 'store', 'shipping'
  label: varchar('label', { length: 255 }).notNull(),
  description: text('description'),
  isPublic: boolean('is_public').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
}, (table) => {
  return {
    keyIdx: uniqueIndex('settings_key_idx').on(table.key)
  };
});
