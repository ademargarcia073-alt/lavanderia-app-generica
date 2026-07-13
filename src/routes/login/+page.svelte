<script lang='ts'>
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<h1>Login</h1>
<form method="post" action="?/signInEmail" use:enhance>
	<label>
		Email
		<input type="email" name="email" required />
	</label>
	<label>
		Password
		<input type="password" name="password" required />
	</label>
	<button>Login</button>
</form>
<p style="color: red">{form?.message ?? ''}</p>
<p><a href="/forgot-password">¿Olvidaste tu contraseña?</a></p>
<p>¿No tenés cuenta? <a href="/signup">Sign up</a></p>
