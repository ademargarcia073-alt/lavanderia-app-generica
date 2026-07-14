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
		<div class="heading">
			<div class="step-indicator">Paso 2 de 2</div>
			<h1>Un poco más sobre ti</h1>
		</div>
		<form method="post" use:enhance class="form">
			<TextField label="Apellido" name="lastName" placeholder="Ej. Fernández" required />
			<TextField label="Móvil" name="phone" placeholder="+591 700 00000" required />
			<TextField label="Género" optionalLabel name="gender" placeholder="Seleccionar" />
			<TextField
				label="Fecha de nacimiento"
				optionalLabel
				type="date"
				name="birthDate"
				placeholder="DD/MM/AAAA"
			/>
			{#if form?.message}
				<p class="form-error">{form.message}</p>
			{/if}
			<Button type="submit">Continuar</Button>
		</form>
	</Card>
</div>

<style>
	.screen {
		min-height: 100vh;
		display: flex;
		align-items: center;
		padding: 24px 16px;
	}

	.heading {
		display: flex;
		flex-direction: column;
	}

	.step-indicator {
		font-size: 12px;
		font-weight: 600;
		color: var(--color-accent);
		margin-bottom: 4px;
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
		gap: 14px;
	}

	.form-error {
		font-size: 13px;
		color: var(--color-error);
		margin: 0;
	}
</style>
