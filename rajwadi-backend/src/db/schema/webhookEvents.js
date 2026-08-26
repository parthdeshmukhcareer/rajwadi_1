import { pgTable, uuid, varchar, jsonb, timestamp } from 'drizzle-orm/pg-core';

export const webhookEvents = pgTable('webhook_events', {
  id: uuid('id').defaultRandom().primaryKey(),
  provider: varchar('provider', { length: 50 }).default('RAZORPAY').notNull(),
  providerEventId: varchar('provider_event_id', { length: 255 }).unique().notNull(),
  eventType: varchar('event_type', { length: 100 }).notNull(),
  payload: jsonb('payload'),
  payloadHash: varchar('payload_hash', { length: 255 }),
  status: varchar('status', { length: 50 }).notNull(), // RECEIVED, PROCESSED, FAILED
  errorMessage: varchar('error_message', { length: 255 }),
  receivedAt: timestamp('received_at', { withTimezone: true }).defaultNow().notNull(),
  processedAt: timestamp('processed_at', { withTimezone: true }),
});
