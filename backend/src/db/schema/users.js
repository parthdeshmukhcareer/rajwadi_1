import { pgTable, uuid, varchar, text, boolean, timestamp, uniqueIndex, date } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  firstName: varchar('first_name', { length: 255 }).notNull(),
  lastName: varchar('last_name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  phone: varchar('phone', { length: 20 }).unique(),
  passwordHash: text('password_hash'),
  role: varchar('role', { enum: ['CUSTOMER', 'ADMIN'] }).default('CUSTOMER').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
  gender: varchar('gender', { length: 50 }),
  dateOfBirth: date('date_of_birth', { mode: 'string' }),
  avatarUrl: text('avatar_url'),
  emailVerified: boolean('email_verified').default(false).notNull(),
}, (table) => {
  return {
    emailIdx: uniqueIndex('email_idx').on(table.email),
    phoneIdx: uniqueIndex('phone_idx').on(table.phone),
  };
});
