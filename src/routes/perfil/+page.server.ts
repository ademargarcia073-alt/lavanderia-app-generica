import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { address } from '$lib/server/db/address.schema';
import { auth } from '$lib/server/auth';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/login');
	}

	const [existingAddress] = await db
		.select()
		.from(address)
		.where(eq(address.userId, event.locals.user.id));

	return { user: event.locals.user, address: existingAddress ?? null };
};

export const actions: Actions = {
	saveAddress: async (event) => {
		if (!event.locals.user) return fail(401, { message: 'No autenticado' });

		const formData = await event.request.formData();
		const referencia = formData.get('referencia')?.toString().trim() ?? '';
		const telefono = formData.get('telefono')?.toString().trim() || null;

		if (!referencia) {
			return fail(400, { message: 'La dirección es obligatoria' });
		}

		const [existing] = await db
			.select()
			.from(address)
			.where(eq(address.userId, event.locals.user.id));

		if (existing) {
			await db
				.update(address)
				.set({ referencia, telefono })
				.where(eq(address.userId, event.locals.user.id));
		} else {
			await db.insert(address).values({ userId: event.locals.user.id, referencia, telefono });
		}

		return { saved: true };
	},

	signOut: async (event) => {
		await auth.api.signOut({
			headers: event.request.headers
		});
		return redirect(302, '/login');
	}
};
