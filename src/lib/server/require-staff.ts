import type { RequestEvent } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { contactInfo } from '$lib/server/db/contact-info.schema';

// Any logged-in account can otherwise reach a staff-only route's load AND
// its actions independently (SvelteKit invokes an action directly, it does
// not run load first) — every call site guards for itself by calling this.
// No contactInfo row (onboarding not finished) is treated as not-staff, not
// as a crash.
export async function requireStaff(event: RequestEvent): Promise<boolean> {
	if (!event.locals.user) return false;
	const [row] = await db
		.select({ role: contactInfo.role })
		.from(contactInfo)
		.where(eq(contactInfo.userId, event.locals.user.id));
	return row?.role === 'staff';
}
