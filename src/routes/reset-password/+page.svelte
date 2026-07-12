<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<h1>Nueva contraseña</h1>

{#if data.invalid}
	<p style="color: red">
		El link no es válido o expiró. <a href="/forgot-password">Pedí uno nuevo</a>.
	</p>
{:else if !data.token}
	<p style="color: red">Falta el token del link. Usá el link que te llegó por email.</p>
{:else}
	<form method="post" use:enhance>
		<input type="hidden" name="token" value={data.token} />
		<label>
			Nueva contraseña
			<input type="password" name="newPassword" required minlength="8" />
		</label>
		<button>Restablecer contraseña</button>
	</form>
	<p style="color: red">{form?.message ?? ''}</p>
{/if}
