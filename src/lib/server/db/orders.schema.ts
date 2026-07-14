import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// Order status is a plain text field with an application-level allowed set
// (see ORDER_STATUSES below), not a Postgres enum — keeps it cheap to add a
// status later without a migration, matching the "no code before a real
// tenant justifies it" posture from the office-hours design doc.
export const ORDER_STATUSES = ['received', 'washing', 'ready', 'delivered'] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const order = pgTable('order', {
	id: serial('id').primaryKey(),
	// "customer info básico" — free text for now, no customer/address table yet.
	customerName: text('customer_name').notNull(),
	// Free-text description of the order (garment categories/service) — the
	// real catalog grid is a separate, not-yet-numbered MVP task. This field
	// is deliberately unstructured until that task defines the real schema.
	description: text('description').notNull(),
	status: text('status').notNull().default('received').$type<OrderStatus>(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull()
});
