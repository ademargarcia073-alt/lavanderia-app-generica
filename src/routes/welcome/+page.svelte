<script lang="ts">
	import Card from '$lib/components/Card.svelte';
	import Button from '$lib/components/Button.svelte';
</script>

<div class="screen">
	<Card>
		<div class="logo-placeholder">logo del tenant</div>
		<div>
			<h1>Bienvenido</h1>
			<p class="description">
				Gestioná el lavado de tu ropa, seguí tus pedidos y recibí avisos cuando estén listos.
			</p>
		</div>
		<div class="actions">
			<Button href="/signup">Crear cuenta</Button>
			<Button href="/login" variant="secondary">Ya tengo cuenta</Button>
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

	.logo-placeholder {
		height: 120px;
		border-radius: 14px;
		background: repeating-linear-gradient(
			45deg,
			oklch(0.55 0.14 230 / 0.14),
			oklch(0.55 0.14 230 / 0.14) 8px,
			oklch(0.55 0.14 230 / 0.05) 8px,
			oklch(0.55 0.14 230 / 0.05) 16px
		);
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: var(--font-mono);
		font-size: 11px;
		color: oklch(0.45 0.1 230);
	}

	h1 {
		font-weight: 800;
		font-size: 26px;
		color: var(--color-text);
		line-height: 1.2;
		margin: 0;
	}

	.description {
		font-size: 15px;
		color: var(--color-text-secondary);
		margin: 8px 0 0;
	}

	.actions {
		margin-top: auto;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
</style>
