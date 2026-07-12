import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import type { PageServerLoad } from './$types';
import { auth } from '$lib/server/auth';
import { APIError } from 'better-auth/api';

export const load: PageServerLoad = (event) => {
	const token = event.url.searchParams.get('token');
	const error = event.url.searchParams.get('error');
	return { token, invalid: error === 'INVALID_TOKEN' };
};

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const newPassword = formData.get('newPassword')?.toString() ?? '';
		const token = formData.get('token')?.toString() ?? '';

		try {
			await auth.api.resetPassword({
				body: { newPassword, token }
			});
		} catch (error) {
			if (error instanceof APIError) {
				return fail(400, { message: error.message || 'No se pudo restablecer la contraseña' });
			}
			return fail(500, { message: 'Error inesperado' });
		}

		return redirect(302, '/login');
	}
};
