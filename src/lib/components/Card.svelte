<script lang="ts">
	import type { Snippet } from 'svelte';

	let { wide = false, children }: { wide?: boolean; children: Snippet } = $props();
</script>

<div class="card" class:wide>
	{@render children()}
</div>

<style>
	.card {
		width: 100%;
		max-width: 400px;
		min-height: min(640px, calc(100vh - 48px));
		margin: 0 auto;
		background: var(--color-surface);
		border: 1px solid var(--color-border-card);
		border-radius: var(--radius-screen-card);
		box-shadow: var(--shadow-card);
		padding: 28px 24px;
		display: flex;
		flex-direction: column;
		gap: 18px;
	}

	.card.wide {
		max-width: 680px;
		min-height: auto;
		border-radius: var(--radius-panel-card);
		gap: 20px;
	}
</style>
