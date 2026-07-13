<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<h1>Datos de contacto</h1>
<form method="post" use:enhance>
	<label>
		Apellido
		<input name="lastName" required />
	</label>
	<label>
		Número móvil
		<input name="phone" required />
	</label>
	<label>
		Género (opcional)
		<input name="gender" />
	</label>
	<label>
		Fecha de nacimiento (opcional)
		<input type="date" name="birthDate" />
	</label>
	<button>Continuar</button>
</form>
<p style="color: red">{form?.message ?? ''}</p>
