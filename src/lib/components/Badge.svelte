<script lang="ts">
	import type { OrderStatus } from '$lib/server/db/orders.schema';

	let { status }: { status: OrderStatus } = $props();

	const label: Record<OrderStatus, string> = {
		received: 'Recibido',
		washing: 'Lavando',
		ready: 'Listo',
		delivered: 'Entregado'
	};
</script>

<span class="badge {status}">{label[status]}</span>

<style>
	.badge {
		font-family: var(--font-body);
		font-size: 13px;
		font-weight: 600;
		color: white;
		border-radius: var(--radius-pill);
		padding: 6px 14px;
		white-space: nowrap;
	}

	.badge.received {
		background: var(--color-status-received);
	}

	.badge.washing {
		background: var(--color-status-washing);
	}

	.badge.ready {
		background: var(--color-status-ready);
	}

	.badge.delivered {
		background: var(--color-status-delivered);
	}
</style>
