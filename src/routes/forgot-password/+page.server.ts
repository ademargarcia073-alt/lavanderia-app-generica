import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { auth } from '$lib/server/auth';
import { APIError } from 'better-auth/api';

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const email = formData.get('email')?.toString() ?? '';

		try {
			await auth.api.requestPasswordReset({
				body: {
					email,
					redirectTo: '/reset-password'
				}
			});
		} catch (error) {
			if (error instanceof APIError) {
				return fail(400, { message: error.message || 'No se pudo enviar el email' });
			}
			return fail(500, { message: 'Error inesperado' });
		}

		return { sent: true };
	}
};
