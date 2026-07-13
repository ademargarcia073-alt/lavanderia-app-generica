<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const statusLabel: Record<string, string> = {
		received: 'Recibido',
		washing: 'Lavando',
		ready: 'Listo',
		delivered: 'Entregado'
	};
</script>

<h1>Pedidos (staff)</h1>

{#if form?.message}
	<p style="color: red">{form.message}</p>
{/if}

<section>
	<h2>Nuevo pedido de prueba</h2>
	<p><em>Herramienta interna para probar el cambio de estado — no es el flujo real de cliente.</em></p>
	<form method="post" action="?/createTestOrder" use:enhance>
		<label>
			Nombre del cliente
			<input name="customerName" required />
		</label>
		<label>
			Descripción (ej. "3 camisas, 1 saco")
			<input name="description" required />
		</label>
		<button>Crear pedido de prueba</button>
	</form>
</section>

<section>
	<h2>Pedidos activos</h2>
	{#if data.orders.length === 0}
		<p>No hay pedidos todavía.</p>
	{:else}
		<table>
			<thead>
				<tr>
					<th>ID</th>
					<th>Cliente</th>
					<th>Descripción</th>
					<th>Estado</th>
					<th>Cambiar estado</th>
				</tr>
			</thead>
			<tbody>
				{#each data.orders as o (o.id)}
					<tr>
						<td>{o.id}</td>
						<td>{o.customerName}</td>
						<td>{o.description}</td>
						<td>{statusLabel[o.status] ?? o.status}</td>
						<td>
							<form method="post" action="?/updateStatus" use:enhance>
								<input type="hidden" name="id" value={o.id} />
								<select name="status" value={o.status}>
									{#each data.statuses as s (s)}
										<option value={s}>{statusLabel[s]}</option>
									{/each}
								</select>
								<button>Actualizar</button>
							</form>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
</section>
