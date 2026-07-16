<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageServerData } from './$types';
	import Card from '$lib/components/Card.svelte';
	import Button from '$lib/components/Button.svelte';
	import TextField from '$lib/components/TextField.svelte';

	let { data, form }: { data: PageServerData; form: ActionData } = $props();
</script>

<div class="screen">
	<Card>
		<div class="heading">
			<h1>Nuevo pedido</h1>
		</div>
		<form method="post" use:enhance class="form">
			<label class="field">
				<span class="label">Categoría</span>
				<select class="select" name="itemCategory">
					{#each data.categorias as categoria (categoria)}
						<option value={categoria} selected={categoria === data.selectedCategoria}>
							{categoria}
						</option>
					{/each}
				</select>
			</label>

			<TextField label="Cantidad" name="quantity" type="number" min="1" value="1" required />
			<TextField label="Notas" optionalLabel name="notes" placeholder="Ej. planchado aparte" />

			{#if data.existingAddress}
				<div class="address-summary">
					<span class="label">Dirección de entrega</span>
					<p>{data.existingAddress.referencia}</p>
				</div>
			{:else}
				<TextField
					label="Dirección de entrega"
					name="referencia"
					placeholder="Ej. Av. Ballivián casi Ecuador, edificio Torino, piso 4"
					required
				/>
				<TextField
					label="Teléfono de contacto para la entrega"
					optionalLabel
					name="telefono"
					placeholder="+591 700 00000"
				/>
			{/if}

			{#if form?.message}
				<p class="form-error">{form.message}</p>
			{/if}

			<Button type="submit">Confirmar pedido</Button>
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

	.field {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.label {
		font-size: 13px;
		font-weight: 600;
		color: oklch(0.35 0.01 90);
	}

	.select {
		font-family: var(--font-body);
		font-size: 14px;
		border: 1.5px solid var(--color-border-input);
		border-radius: var(--radius-component);
		padding: 12px 14px;
		color: oklch(0.25 0.01 90);
		background: white;
	}

	.address-summary p {
		font-size: 14px;
		color: var(--color-text);
		background: var(--color-bg);
		border: 1px solid var(--color-border-card);
		border-radius: var(--radius-component);
		padding: 12px 14px;
		margin: 0;
	}

	.form-error {
		font-size: 13px;
		color: var(--color-error);
		margin: 0;
	}
</style>
