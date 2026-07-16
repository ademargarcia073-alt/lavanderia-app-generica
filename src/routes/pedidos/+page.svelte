<script lang="ts">
	import type { PageServerData } from './$types';
	import Card from '$lib/components/Card.svelte';
	import Button from '$lib/components/Button.svelte';
	import Badge from '$lib/components/Badge.svelte';

	let { data }: { data: PageServerData } = $props();

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
			<h1>Mis pedidos</h1>
			<Button href="/">+ Nuevo pedido</Button>
		</div>

		<div class="order-list">
			{#if data.orders.length === 0}
				<p class="empty">Todavía no hiciste ningún pedido.</p>
			{:else}
				{#each data.orders as o (o.id)}
					<div class="order-row">
						<div class="order-info">
							<div class="order-name">
								Pedido #{o.id} — {o.quantity} x {o.itemCategory}
							</div>
							<div class="order-meta">
								{o.deliveryAddress} · {formatDate(o.createdAt)}
							</div>
						</div>
						<Badge status={o.status} />
					</div>
				{/each}
			{/if}
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
</style>
