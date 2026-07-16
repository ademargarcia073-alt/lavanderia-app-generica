import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { order } from '$lib/server/db/orders.schema';
import { desc, eq } from 'drizzle-orm';

export const load: PageServerLoad = async (event) => {
	const { user } = await event.parent();

	const orders = await db
		.select()
		.from(order)
		.where(eq(order.userId, user.id))
		.orderBy(desc(order.createdAt));

	return { orders };
};
