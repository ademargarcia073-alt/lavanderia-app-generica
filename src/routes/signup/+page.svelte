<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<h1>Sign up</h1>
<form method="post" use:enhance>
	<label>
		Nombre
		<input name="name" required />
	</label>
	<label>
		Email
		<input type="email" name="email" required />
	</label>
	<label>
		Contraseña
		<input type="password" name="password" required minlength="8" />
	</label>
	<button>Crear cuenta</button>
</form>
<p style="color: red">{form?.message ?? ''}</p>
<p>¿Ya tenés cuenta? <a href="/login">Login</a></p>
