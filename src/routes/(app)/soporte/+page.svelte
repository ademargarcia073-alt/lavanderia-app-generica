<script lang="ts">
	import Card from '$lib/components/Card.svelte';
</script>

<div class="screen">
	<Card>
		<h1>Soporte</h1>
		<p class="placeholder">Esta sección todavía no tiene contenido.</p>
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

	.placeholder {
		font-size: 14px;
		color: var(--color-text-secondary);
		margin: 0;
	}
</style>
