<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';
	import Card from '$lib/components/Card.svelte';
	import Button from '$lib/components/Button.svelte';
	import TextField from '$lib/components/TextField.svelte';
	import Alert from '$lib/components/Alert.svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let mismatchError = $state('');

	function handleSubmit(event: SubmitEvent) {
		const formEl = event.currentTarget as HTMLFormElement;
		const formData = new FormData(formEl);
		if (formData.get('newPassword') !== formData.get('confirmPassword')) {
			event.preventDefault();
			mismatchError = 'Las contraseñas no coinciden';
		} else {
			mismatchError = '';
		}
	}
</script>

<div class="screen">
	<Card>
		<h1>Nueva contraseña</h1>
		{#if data.invalid}
			<Alert>
				El enlace no es válido o expiró. <a href="/forgot-password">Pide uno nuevo</a>.
			</Alert>
		{:else if !data.token}
			<Alert>Falta el token del enlace. Usa el enlace que te llegó por correo.</Alert>
		{:else}
			<form method="post" use:enhance onsubmit={handleSubmit} class="form">
				<input type="hidden" name="token" value={data.token} />
				<TextField
					label="Nueva contraseña"
					type="password"
					name="newPassword"
					placeholder="Mínimo 8 caracteres"
					required
					minlength={8}
				/>
				<TextField
					label="Confirmar contraseña"
					type="password"
					name="confirmPassword"
					placeholder="Repite tu contraseña"
					required
					minlength={8}
				/>
				{#if mismatchError}
					<p class="form-error">{mismatchError}</p>
				{/if}
				{#if form?.message}
					<p class="form-error">{form.message}</p>
				{/if}
				<Button type="submit">Guardar contraseña</Button>
			</form>
		{/if}
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
</style>
