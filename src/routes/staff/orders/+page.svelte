<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';
	import Card from '$lib/components/Card.svelte';
	import Button from '$lib/components/Button.svelte';
	import Badge from '$lib/components/Badge.svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const statusLabel: Record<string, string> = {
		received: 'Recibido',
		washing: 'Lavando',
		ready: 'Listo',
		delivered: 'Entregado'
	};

	function formatDate(value: string | Date) {
		return new Date(value).toLocaleString('es-BO', {
			day: '2-digit',
			month: '2-digit',
			hour: '2-digit',
			minute: '2-digit'
		});
	}
</script>

<div class="screen">
	<Card wide>
		<div class="header">
			<h1>Pedidos activos</h1>
			<Button href="#crear-pedido">+ Nuevo pedido</Button>
		</div>

		{#if form?.message}
			<p class="form-error">{form.message}</p>
		{/if}

		<div class="order-list">
			{#if data.orders.length === 0}
				<p class="empty">No hay pedidos todavía.</p>
			{:else}
				{#each data.orders as o (o.id)}
					<div class="order-row">
						<div class="order-info">
							<div class="order-name">Pedido #{o.id} — {o.customerName}</div>
							<div class="order-meta">{o.description} · {formatDate(o.createdAt)}</div>
						</div>
						<div class="order-status">
							<Badge status={o.status} />
							<form method="post" action="?/updateStatus" use:enhance class="status-form">
								<input type="hidden" name="id" value={o.id} />
								<select name="status" value={o.status}>
									{#each data.statuses as s (s)}
										<option value={s}>{statusLabel[s]}</option>
									{/each}
								</select>
								<button class="status-submit">Actualizar</button>
							</form>
						</div>
					</div>
				{/each}
			{/if}
		</div>

		<div id="crear-pedido" class="create-section">
			<h2>Crear pedido de prueba</h2>
			<p class="disclaimer">
				Herramienta interna para probar el cambio de estado — no es el flujo real de cliente.
			</p>
			<form method="post" action="?/createTestOrder" use:enhance class="create-form">
				<input class="create-input" name="customerName" placeholder="Nombre del cliente" required />
				<input
					class="create-input"
					name="description"
					placeholder="Descripción (ej. 3 camisas, 1 saco)"
					required
				/>
				<Button type="submit" variant="secondary">Crear</Button>
			</form>
		</div>
	</Card>
</div>

<style>
	.screen {
		min-height: 100vh;
		display: flex;
		align-items: center;
		padding: 24px 16px;
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	h1 {
		font-weight: 800;
		font-size: 22px;
		color: var(--color-text);
		margin: 0;
	}

	.form-error {
		font-size: 13px;
		color: var(--color-error);
		margin: 0;
	}

	.order-list {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.empty {
		font-size: 14px;
		color: var(--color-text-meta);
	}

	.order-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		background: var(--color-bg);
		border: 1px solid var(--color-border-card);
		border-radius: var(--radius-component);
		padding: 14px 16px;
		flex-wrap: wrap;
	}

	.order-name {
		font-weight: 700;
		font-size: 15px;
		color: var(--color-text);
	}

	.order-meta {
		font-size: 13px;
		color: var(--color-text-meta);
		margin-top: 2px;
	}

	.order-status {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 6px;
	}

	.status-form {
		display: flex;
		gap: 6px;
	}

	.status-form select {
		font-family: var(--font-body);
		font-size: 12px;
		border: 1.5px solid var(--color-border-input);
		border-radius: var(--radius-component);
		padding: 4px 6px;
	}

	.status-submit {
		font-family: var(--font-body);
		font-weight: 600;
		font-size: 12px;
		background: var(--color-btn-secondary-bg);
		color: var(--color-btn-secondary-text);
		border: none;
		border-radius: var(--radius-component);
		padding: 4px 10px;
		cursor: pointer;
	}

	.create-section {
		margin-top: 8px;
		border-top: 1px solid var(--color-border-card);
		padding-top: 20px;
	}

	.create-section h2 {
		font-weight: 700;
		font-size: 14px;
		color: var(--color-text-secondary);
		margin: 0 0 4px;
	}

	.disclaimer {
		font-size: 12px;
		color: var(--color-text-meta);
		font-style: italic;
		margin: 0 0 12px;
	}

	.create-form {
		display: flex;
		gap: 12px;
		flex-wrap: wrap;
		align-items: center;
	}

	.create-input {
		font-family: var(--font-body);
		font-size: 14px;
		border: 1.5px solid var(--color-border-input);
		border-radius: var(--radius-component);
		padding: 10px 13px;
		flex: 1;
		min-width: 160px;
		color: oklch(0.25 0.01 90);
	}

	.create-input:focus-visible {
		outline: 2px solid var(--color-accent);
		outline-offset: 2px;
		border-color: var(--color-accent);
	}
</style>
