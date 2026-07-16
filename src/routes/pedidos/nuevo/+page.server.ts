import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { order } from '$lib/server/db/orders.schema';
import { address } from '$lib/server/db/address.schema';
import { tenantConfig } from '../../../../config/tenant.config';
import { eq } from 'drizzle-orm';

async function loadAddress(userId: string) {
	const [row] = await db.select().from(address).where(eq(address.userId, userId));
	return row ?? null;
}

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/login');
	}

	const requested = event.url.searchParams.get('categoria');
	const selectedCategoria = tenantConfig.categorias.includes(requested ?? '')
		? (requested as string)
		: tenantConfig.categorias[0];

	const existingAddress = await loadAddress(event.locals.user.id);

	return {
		categorias: tenantConfig.categorias,
		selectedCategoria,
		existingAddress
	};
};

export const actions: Actions = {
	default: async (event) => {
		if (!event.locals.user) return fail(401, { message: 'No autenticado' });

		const formData = await event.request.formData();
		const itemCategory = formData.get('itemCategory')?.toString() ?? '';
		const quantityRaw = formData.get('quantity')?.toString() ?? '';
		const notes = formData.get('notes')?.toString().trim() || null;
		const quantity = Number(quantityRaw);

		// Server-side whitelist — the <select> in the UI already restricts this,
		// but a forged POST must not be able to write an arbitrary string into
		// a column that's supposed to reflect the tenant's real catalog.
		if (!tenantConfig.categorias.includes(itemCategory)) {
			return fail(400, { message: 'Categoría inválida' });
		}
		if (!Number.isInteger(quantity) || quantity < 1) {
			return fail(400, { message: 'La cantidad debe ser un número entero mayor a 0' });
		}

		const existingAddress = await loadAddress(event.locals.user.id);
		let deliveryAddress: string;

		if (existingAddress) {
			deliveryAddress = existingAddress.referencia;
		} else {
			const referencia = formData.get('referencia')?.toString().trim() ?? '';
			const telefono = formData.get('telefono')?.toString().trim() || null;

			if (!referencia) {
				return fail(400, { message: 'La dirección es obligatoria' });
			}

			await db.insert(address).values({ userId: event.locals.user.id, referencia, telefono });
			deliveryAddress = referencia;
		}

		const description = `${quantity} x ${itemCategory}${notes ? ` — ${notes}` : ''}`;

		await db.insert(order).values({
			customerName: event.locals.user.name,
			description,
			userId: event.locals.user.id,
			itemCategory,
			quantity,
			notes,
			deliveryAddress
		});

		return redirect(302, '/pedidos');
	}
};
