import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { tenantConfig } from '../../../config/tenant.config';

// Single shared auth guard for the whole 4-tab area (Home/Pedidos/Soporte/
// Perfil). This only covers `load` — form actions run independently of
// load in SvelteKit, so each action underneath still checks
// event.locals.user for itself (same reason /staff/orders' guard had to
// live in its actions too, not just its load).
export const load: LayoutServerLoad = (event) => {
	if (!event.locals.user) {
		return redirect(302, '/welcome');
	}
	return { user: event.locals.user, categorias: tenantConfig.categorias };
};
