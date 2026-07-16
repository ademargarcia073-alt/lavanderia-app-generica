import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { order } from '$lib/server/db/orders.schema';
import { desc, eq } from 'drizzle-orm';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/login');
	}

	const orders = await db
		.select()
		.from(order)
		.where(eq(order.userId, event.locals.user.id))
		.orderBy(desc(order.createdAt));

	return { orders };
};
