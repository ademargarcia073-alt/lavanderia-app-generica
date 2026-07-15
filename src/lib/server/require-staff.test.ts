import { describe, expect, it, vi } from 'vitest';

const whereMock = vi.fn();

vi.mock('$lib/server/db', () => ({
	db: {
		select: () => ({
			from: () => ({
				where: whereMock
			})
		})
	}
}));

const { requireStaff } = await import('./require-staff');

function fakeEvent(role: string | undefined) {
	whereMock.mockResolvedValue(role === undefined ? [] : [{ role }]);
	return { locals: { user: { id: 'user-1' } } } as never;
}

describe('requireStaff', () => {
	it('denies a logged-out request', async () => {
		expect(await requireStaff({ locals: {} } as never)).toBe(false);
	});

	it('denies a customer', async () => {
		expect(await requireStaff(fakeEvent('customer'))).toBe(false);
	});

	it('denies a user with no contactInfo row yet (onboarding incomplete)', async () => {
		expect(await requireStaff(fakeEvent(undefined))).toBe(false);
	});

	it('allows a staff account', async () => {
		expect(await requireStaff(fakeEvent('staff'))).toBe(true);
	});
});
