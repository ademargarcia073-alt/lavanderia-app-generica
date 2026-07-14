import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { order, ORDER_STATUSES, type OrderStatus } from '$lib/server/db/orders.schema';
import { desc, eq } from 'drizzle-orm';

function isOrderStatus(value: string): value is OrderStatus {
	return (ORDER_STATUSES as readonly string[]).includes(value);
}

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/login');
	}

	const orders = await db.select().from(order).orderBy(desc(order.createdAt));

	return { orders, statuses: ORDER_STATUSES };
};

export const actions: Actions = {
	// Internal test tool only — creates an order without going through any
	// real customer flow (garment grid, address, etc). That real flow is a
	// separate, not-yet-numbered MVP task.
	createTestOrder: async (event) => {
		if (!event.locals.user) return fail(401, { message: 'No autenticado' });

		const formData = await event.request.formData();
		const customerName = formData.get('customerName')?.toString().trim() ?? '';
		const description = formData.get('description')?.toString().trim() ?? '';

		if (!customerName || !description) {
			return fail(400, { message: 'Faltan datos del pedido de prueba' });
		}

		await db.insert(order).values({ customerName, description });

		return { created: true };
	},

	updateStatus: async (event) => {
		if (!event.locals.user) return fail(401, { message: 'No autenticado' });

		const formData = await event.request.formData();
		const id = Number(formData.get('id'));
		const status = formData.get('status')?.toString() ?? '';

		if (!id || !isOrderStatus(status)) {
			return fail(400, { message: 'Pedido o estado inválido' });
		}

		await db.update(order).set({ status }).where(eq(order.id, id));

		return { updated: true };
	}
};
