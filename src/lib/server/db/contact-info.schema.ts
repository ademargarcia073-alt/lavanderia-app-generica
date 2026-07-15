import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { user } from './auth.schema';

// App-level profile data collected in onboarding step 2. Kept separate from
// Better-Auth's own `user` table so `bun run auth:schema` never has a reason
// to touch it — Better-Auth owns auth-only fields, we own this.
export const CONTACT_ROLES = ['customer', 'staff'] as const;
export type ContactRole = (typeof CONTACT_ROLES)[number];

export const contactInfo = pgTable('contact_info', {
	userId: text('user_id')
		.primaryKey()
		.references(() => user.id, { onDelete: 'cascade' }),
	phone: text('phone').notNull(),
	gender: text('gender'),
	birthDate: timestamp('birth_date'),
	// Every account is 'customer' by default — the founder's own row gets
	// flipped to 'staff' by hand in Neon's SQL editor after this migration
	// runs (no admin UI for this yet, same manual-onboarding posture as the
	// rest of the tenant config).
	role: text('role').notNull().default('customer').$type<ContactRole>(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull()
});
