<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';
	import Card from '$lib/components/Card.svelte';
	import Button from '$lib/components/Button.svelte';
	import TextField from '$lib/components/TextField.svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<div class="screen">
	<Card>
		<div class="heading">
			<h1>Perfil</h1>
			<p class="account">{data.user.name} · {data.user.email}</p>
		</div>

		<form method="post" action="?/saveAddress" use:enhance class="form">
			<TextField
				label="Dirección de entrega"
				name="referencia"
				placeholder="Ej. Av. Ballivián casi Ecuador, edificio Torino, piso 4"
				value={data.address?.referencia ?? ''}
				required
			/>
			<TextField
				label="Teléfono de contacto para la entrega"
				optionalLabel
				name="telefono"
				placeholder="+591 700 00000"
				value={data.address?.telefono ?? ''}
			/>
			{#if form?.message}
				<p class="form-error">{form.message}</p>
			{/if}
			<Button type="submit">Guardar dirección</Button>
		</form>

		<form method="post" action="?/signOut" use:enhance>
			<button class="sign-out">Cerrar sesión</button>
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
		gap: 4px;
	}

	h1 {
		font-weight: 800;
		font-size: 22px;
		color: var(--color-text);
		margin: 0;
	}

	.account {
		font-size: 13px;
		color: var(--color-text-meta);
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

	.sign-out {
		font-family: var(--font-body);
		font-size: 13px;
		font-weight: 600;
		color: var(--color-text-secondary);
		background: none;
		border: none;
		cursor: pointer;
		padding: 4px 0;
		align-self: flex-start;
	}
</style>
