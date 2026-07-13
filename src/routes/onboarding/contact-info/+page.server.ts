import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { contactInfo } from '$lib/server/db/contact-info.schema';

export const load: PageServerLoad = (event) => {
	if (!event.locals.user) {
		return redirect(302, '/login');
	}
	return {};
};

export const actions: Actions = {
	default: async (event) => {
		if (!event.locals.user) return fail(401, { message: 'No autenticado' });

		const formData = await event.request.formData();
		const lastName = formData.get('lastName')?.toString().trim() ?? '';
		const phone = formData.get('phone')?.toString().trim() ?? '';
		const gender = formData.get('gender')?.toString().trim() || null;
		const birthDateRaw = formData.get('birthDate')?.toString().trim();
		const birthDate = birthDateRaw ? new Date(birthDateRaw) : null;

		if (!lastName || !phone) {
			return fail(400, { message: 'Apellido y móvil son obligatorios' });
		}

		await db
			.insert(contactInfo)
			.values({ userId: event.locals.user.id, lastName, phone, gender, birthDate });

		return redirect(302, '/');
	}
};
