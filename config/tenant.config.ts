import { z } from 'zod';

// Tenant config for this single-tenant deploy (Approach C from /office-hours:
// no admin panel yet — edit this file by hand and redeploy). Fields match the
// "configurable por tenant" table from the original brief. The garment/service
// catalog here is unstructured on purpose — the real customer-facing ordering
// UI is a separate, not-yet-numbered task; this just needs to exist and be
// valid, not be consumed by a real order flow yet.
const tenantConfigSchema = z.object({
	nombre: z.string().min(1),
	logo: z.string().url(),
	colores: z.object({
		primario: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'debe ser un color hex de 6 dígitos'),
		secundario: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'debe ser un color hex de 6 dígitos')
	}),
	categorias: z.array(z.string().min(1)).min(1, 'necesita al menos una categoría'),
	zonaCobertura: z.string().min(1),
	textosFaq: z
		.array(
			z.object({
				pregunta: z.string().min(1),
				respuesta: z.string().min(1)
			})
		)
		.min(1, 'necesita al menos una entrada de FAQ'),
	metodosPago: z.array(z.string().min(1)).min(1, 'necesita al menos un método de pago'),
	whatsapp: z.string().regex(/^\+\d{8,15}$/, 'debe ser un número en formato +59171234567')
});

export type TenantConfig = z.infer<typeof tenantConfigSchema>;

const rawConfig: TenantConfig = {
	nombre: 'Lavandería (tenant #1)',
	logo: 'https://placehold.co/200x200?text=Logo',
	colores: {
		primario: '#1E3A8A',
		secundario: '#F59E0B'
	},
	categorias: ['Camisas', 'Bolsa de lavado', 'Jeans', 'Vestidos', 'Sacos', 'Tintorería'],
	zonaCobertura: 'Por definir con el tenant #1 real',
	textosFaq: [
		{
			pregunta: '¿Cómo hago un pedido?',
			respuesta: 'Contactanos por WhatsApp para coordinar la recolección de tu ropa.'
		}
	],
	metodosPago: ['Efectivo', 'QR'],
	whatsapp: '+59100000000'
};

// Throws at import time (fail-fast) if the config above is invalid — see
// src/hooks.server.ts for the import that forces this to run on every boot.
export const tenantConfig: TenantConfig = tenantConfigSchema.parse(rawConfig);
