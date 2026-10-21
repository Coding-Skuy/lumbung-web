<script lang="ts">
  import { enhance } from "$app/forms";
  import type { ActionData } from "./$types";

  let { form }: { form: ActionData } = $props();
</script>

<svelte:head><title>Masuk Admin Lumbung</title></svelte:head>

<h1>Masuk Admin</h1>
<form method="POST" use:enhance>
  <label>Akun <input name="akun" autocomplete="username" required value={form?.akun ?? ""} /></label>
  <label>PIN <input name="pin" type="password" inputmode="numeric" pattern={"\\d{6}"} autocomplete="current-password" required /></label>
  <button type="submit">Masuk</button>
</form>
{#if form?.pesan}<p role="alert">{form.pesan}</p>{/if}
