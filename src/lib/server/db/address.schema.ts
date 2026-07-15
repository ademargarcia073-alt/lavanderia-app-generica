import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { user } from './auth.schema';

// One address per user (1-to-1, same shape as contactInfo) — a client has a
// single saved delivery address, not a book of several. userId is the
// primary key so "save" is always an upsert, never a list.
export const address = pgTable('address', {
	userId: text('user_id')
		.primaryKey()
		.references(() => user.id, { onDelete: 'cascade' }),
	referencia: text('referencia').notNull(),
	telefono: text('telefono'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull()
});
