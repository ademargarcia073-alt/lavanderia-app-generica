import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { auth } from '$lib/server/auth';
import { APIError } from 'better-auth/api';

export const load: PageServerLoad = (event) => {
	if (event.locals.user) {
		return redirect(302, '/');
	}
	return {};
};

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const email = formData.get('email')?.toString() ?? '';
		const password = formData.get('password')?.toString() ?? '';
		const firstName = formData.get('firstName')?.toString().trim() ?? '';
		const lastName = formData.get('lastName')?.toString().trim() ?? '';

		if (!firstName || !lastName) {
			return fail(400, { message: 'Nombre y apellido son obligatorios' });
		}

		// Better-Auth's user table only stores a single `name` field — we
		// collect first/last name separately in the form (to avoid asking for
		// apellido twice, once here and once in onboarding) but concatenate
		// them before calling signUpEmail. No additionalFields: nothing in the
		// app needs first/last name queried independently yet.
		const name = `${firstName} ${lastName}`;

		try {
			await auth.api.signUpEmail({
				body: { email, password, name }
			});
		} catch (error) {
			if (error instanceof APIError) {
				return fail(400, { message: error.message || 'Registration failed' });
			}
			return fail(500, { message: 'Unexpected error' });
		}

		return redirect(302, '/onboarding/contact-info');
	}
};
