import type { LayoutServerLoad } from './$types';
import { tenantConfig } from '../../config/tenant.config';

export const load: LayoutServerLoad = () => {
	return { tenantName: tenantConfig.nombre };
};
