import { Resend } from 'resend';
import { env } from '$env/dynamic/private';

if (!env.RESEND_API_KEY) throw new Error('RESEND_API_KEY is not set');

const resend = new Resend(env.RESEND_API_KEY);

// Test-only sender. Resend's shared onboarding@resend.dev address can only
// deliver to the email the Resend account itself was registered with — it
// is not a real production "from" address. The tenant's real sending domain
// is a T5 decision, made once the product domain is chosen.
const FROM = 'onboarding@resend.dev';

export async function sendResetPasswordEmail(to: string, url: string) {
	await resend.emails.send({
		from: FROM,
		to,
		subject: 'Restablecer tu contraseña',
		html: `<p>Hacé click en el siguiente link para restablecer tu contraseña:</p><p><a href="${url}">${url}</a></p><p>Si no pediste este cambio, ignorá este email.</p>`
	});
}
