import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { tenantConfig } from '../../config/tenant.config';

export const load: PageServerLoad = (event) => {
	if (!event.locals.user) {
		return redirect(302, '/welcome');
	}
	return { user: event.locals.user, categorias: tenantConfig.categorias };
};
