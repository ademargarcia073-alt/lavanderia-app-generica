import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { user } from './auth.schema';

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
	// Free-text description of the order (garment categories/service). Real
	// client orders auto-derive this from itemCategory/quantity/notes at
	// insert time, so this staff-facing rendering never needed to change.
	description: text('description').notNull(),
	status: text('status').notNull().default('received').$type<OrderStatus>(),
	// Nullable: existing test rows (created via the staff-only "pedido de
	// prueba" tool) predate real client accounts and have no user attached.
	userId: text('user_id').references(() => user.id, { onDelete: 'set null' }),
	// Single category per order (from tenantConfig.categorias), no cart.
	itemCategory: text('item_category'),
	quantity: integer('quantity'),
	notes: text('notes'),
	// Text snapshot of the client's address at order time — copied from
	// address.referencia, not a foreign key, so editing the saved address
	// later doesn't retroactively rewrite where a past order was delivered.
	deliveryAddress: text('delivery_address'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull()
});
