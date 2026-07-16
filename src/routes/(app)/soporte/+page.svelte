<script lang="ts">
	import Card from '$lib/components/Card.svelte';
	import Button from '$lib/components/Button.svelte';
	import { tenantConfig } from '../../../../config/tenant.config';

	// wa.me needs digits only, no leading "+" — tenantConfig.whatsapp is
	// validated as "+59171234567" by the tenant config schema.
	const whatsappDigits = tenantConfig.whatsapp.replace(/\D/g, '');
</script>

<div class="screen">
	<Card wide>
		<h1>Preguntas frecuentes</h1>
		<div class="faq-list">
			{#each tenantConfig.textosFaq as item (item.pregunta)}
				<div class="faq-item">
					<p class="pregunta">{item.pregunta}</p>
					<p class="respuesta">{item.respuesta}</p>
				</div>
			{/each}
		</div>
		<Button href="https://wa.me/{whatsappDigits}">Escríbenos por WhatsApp</Button>
	</Card>
</div>

<style>
	.screen {
		min-height: 100vh;
		display: flex;
		align-items: center;
		padding: 24px 16px;
	}

	h1 {
		font-weight: 800;
		font-size: 22px;
		color: var(--color-text);
		margin: 0;
	}

	.faq-list {
		display: flex;
		flex-direction: column;
		gap: 14px;
	}

	.faq-item {
		background: var(--color-bg);
		border: 1px solid var(--color-border-card);
		border-radius: var(--radius-component);
		padding: 14px 16px;
	}

	.pregunta {
		font-weight: 700;
		font-size: 14px;
		color: var(--color-text);
		margin: 0 0 4px;
	}

	.respuesta {
		font-size: 13px;
		color: var(--color-text-secondary);
		margin: 0;
	}
</style>
