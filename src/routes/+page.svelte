<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageServerData } from './$types';
	import Card from '$lib/components/Card.svelte';
	import Button from '$lib/components/Button.svelte';

	let { data }: { data: PageServerData } = $props();
</script>

<div class="screen">
	<Card wide>
		<div class="header">
			<h1>Hola, {data.user.name.split(' ')[0]}</h1>
			<form method="post" action="?/signOut" use:enhance>
				<button class="sign-out">Cerrar sesión</button>
			</form>
		</div>
		<p class="subtitle">¿Qué necesitas lavar hoy?</p>
		<div class="grid">
			{#each data.categorias as categoria (categoria)}
				<a class="category" href="/pedidos/nuevo?categoria={encodeURIComponent(categoria)}">
					{categoria}
				</a>
			{/each}
		</div>
		<Button href="/pedidos" variant="secondary">Ver mis pedidos</Button>
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

	.sign-out {
		font-family: var(--font-body);
		font-size: 12px;
		font-weight: 600;
		color: var(--color-text-secondary);
		background: none;
		border: none;
		cursor: pointer;
		padding: 4px;
	}

	.subtitle {
		font-size: 14px;
		color: var(--color-text-secondary);
		margin: 0;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
		gap: 12px;
	}

	.category {
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		font-family: var(--font-body);
		font-weight: 700;
		font-size: 14px;
		color: var(--color-text);
		background: var(--color-bg);
		border: 1.5px solid var(--color-border-card);
		border-radius: var(--radius-component);
		padding: 20px 12px;
		text-decoration: none;
	}

	.category:hover {
		border-color: var(--color-accent);
		color: var(--color-accent);
	}
</style>
