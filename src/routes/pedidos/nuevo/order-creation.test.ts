import { describe, expect, it, vi } from 'vitest';
import { address } from '$lib/server/db/address.schema';
import { order } from '$lib/server/db/orders.schema';

const whereMock = vi.fn();
const insertCalls: { table: unknown }[] = [];

vi.mock('$lib/server/db', () => ({
	db: {
		select: () => ({ from: () => ({ where: whereMock }) }),
		insert: (table: unknown) => ({
			values: async () => {
				insertCalls.push({ table });
			}
		})
	}
}));

vi.mock('../../../../config/tenant.config', () => ({
	tenantConfig: { categorias: ['Camisas', 'Jeans'] }
}));

const { actions } = await import('./+page.server');

function fakeEvent(formEntries: Record<string, string>, hasAddress: boolean) {
	insertCalls.length = 0;
	whereMock.mockResolvedValue(
		hasAddress ? [{ userId: 'user-1', referencia: 'Calle Falsa 123', telefono: null }] : []
	);
	const fd = new FormData();
	for (const [k, v] of Object.entries(formEntries)) fd.set(k, v);
	return {
		locals: { user: { id: 'user-1', name: 'Ana Pérez' } },
		request: { formData: async () => fd }
	} as never;
}

describe('itemCategory server-side whitelist', () => {
	it('rejects a category not in the tenant catalog, even with a valid quantity/address', async () => {
		const result = await actions.default(
			fakeEvent({ itemCategory: 'Categoría inventada', quantity: '2' }, true)
		);
		expect(result).toMatchObject({ status: 400 });
		expect(insertCalls).toHaveLength(0);
	});

	it('accepts a category present in the catalog', async () => {
		await expect(
			actions.default(fakeEvent({ itemCategory: 'Camisas', quantity: '2' }, true))
		).rejects.toMatchObject({ status: 302 });
	});
});

describe('quantity validation', () => {
	it('rejects zero', async () => {
		const result = await actions.default(fakeEvent({ itemCategory: 'Camisas', quantity: '0' }, true));
		expect(result).toMatchObject({ status: 400 });
	});

	it('rejects a non-numeric value', async () => {
		const result = await actions.default(
			fakeEvent({ itemCategory: 'Camisas', quantity: 'dos' }, true)
		);
		expect(result).toMatchObject({ status: 400 });
	});
});

describe('address: exists vs. first-time insert', () => {
	it('when no address is saved yet, requires referencia and inserts both address and order', async () => {
		const missingReferencia = await actions.default(
			fakeEvent({ itemCategory: 'Camisas', quantity: '1' }, false)
		);
		expect(missingReferencia).toMatchObject({ status: 400 });
		expect(insertCalls).toHaveLength(0);

		await expect(
			actions.default(
				fakeEvent(
					{ itemCategory: 'Camisas', quantity: '1', referencia: 'Av. Ballivián 123' },
					false
				)
			)
		).rejects.toMatchObject({ status: 302 });
		expect(insertCalls.map((c) => c.table)).toEqual([address, order]);
	});

	it('when an address already exists, reuses it and only inserts the order', async () => {
		await expect(
			actions.default(fakeEvent({ itemCategory: 'Camisas', quantity: '1' }, true))
		).rejects.toMatchObject({ status: 302 });
		expect(insertCalls.map((c) => c.table)).toEqual([order]);
	});
});
