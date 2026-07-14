<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import Card from '$lib/components/Card.svelte';
	import Button from '$lib/components/Button.svelte';
	import TextField from '$lib/components/TextField.svelte';

	let { form }: { form: ActionData } = $props();
</script>

<div class="screen">
	<Card>
		<h1>Recuperar contraseña</h1>
		{#if form?.sent}
			<p class="explanation">
				Si ese correo existe en nuestro sistema, te llegó un enlace para restablecer tu
				contraseña.
			</p>
		{:else}
			<p class="explanation">
				Ingresa tu correo y te enviamos un enlace para restablecer tu contraseña.
			</p>
			<form method="post" use:enhance class="form">
				<TextField
					label="Correo electrónico"
					type="email"
					name="email"
					placeholder="correo@ejemplo.com"
					required
				/>
				{#if form?.message}
					<p class="form-error">{form.message}</p>
				{/if}
				<Button type="submit">Enviar enlace</Button>
			</form>
		{/if}
		<p class="footer-link">Volver a <a href="/login">iniciar sesión</a></p>
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

	.explanation {
		font-size: 14px;
		color: var(--color-text-secondary);
		margin: 0;
	}

	.form {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.form-error {
		font-size: 13px;
		color: var(--color-error);
		margin: 0;
	}

	.footer-link {
		font-size: 13px;
		color: var(--color-text-meta);
		text-align: center;
		margin: 0;
	}

	.footer-link a {
		color: var(--color-accent);
		font-weight: 600;
		text-decoration: none;
	}

	.footer-link a:hover {
		color: var(--color-accent-hover);
	}
</style>
