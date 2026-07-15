import { describe, expect, it, vi } from 'vitest';

const requireStaffMock = vi.fn();
const orderByMock = vi.fn().mockResolvedValue([]);

vi.mock('$lib/server/require-staff', () => ({
	requireStaff: requireStaffMock
}));

vi.mock('$lib/server/db', () => ({
	db: {
		select: () => ({ from: () => ({ orderBy: orderByMock }) }),
		insert: () => ({ values: vi.fn() }),
		update: () => ({ set: () => ({ where: vi.fn() }) })
	}
}));

const { load, actions } = await import('./+page.server');

function fakeEvent(isStaff: boolean) {
	requireStaffMock.mockResolvedValue(isStaff);
	return {
		locals: { user: { id: 'user-1' } },
		request: { formData: async () => new FormData() }
	} as never;
}

describe('/staff/orders — all three call sites reject non-staff', () => {
	it('load redirects a customer away', async () => {
		await expect(load(fakeEvent(false))).rejects.toMatchObject({ status: 302 });
	});

	it('load lets a staff account through', async () => {
		await expect(load(fakeEvent(true))).resolves.toMatchObject({ orders: [] });
	});

	it('createTestOrder rejects a customer', async () => {
		const result = await actions.createTestOrder(fakeEvent(false));
		expect(result).toMatchObject({ status: 403 });
	});

	it('updateStatus rejects a customer', async () => {
		const result = await actions.updateStatus(fakeEvent(false));
		expect(result).toMatchObject({ status: 403 });
	});
});
