<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<h1>Restablecer contraseña</h1>

{#if form?.sent}
	<p>Si ese email existe en el sistema, te llegó un link para restablecer tu contraseña.</p>
{:else}
	<form method="post" use:enhance>
		<label>
			Email
			<input type="email" name="email" required />
		</label>
		<button>Enviar link de reset</button>
	</form>
	<p style="color: red">{form?.message ?? ''}</p>
{/if}

<p><a href="/login">Volver a login</a></p>
