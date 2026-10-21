<script lang="ts">
  import { enhance } from "$app/forms";
  import type { ActionData, PageData } from "./$types";

  let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<svelte:head><title>Terbitkan Papan Harga</title></svelte:head>

<h1>Terbitkan Papan Harga</h1>
<p>
  Dihitung Jumat 15.00, publikasi maksimal Jumat 17.00. Isi tiga harga pasar referensi per komoditas (rupiah per kg);
  harga Grade A/B dan fee dihitung server.
</p>

<form method="POST" use:enhance>
  <input type="hidden" name="uuid" value={data.uuid} />
  <label>Berlaku mulai (Senin) <input type="date" name="berlaku_mulai" required /></label>
  {#each data.komoditas as k (k)}
    <fieldset>
      <legend>{k}</legend>
      {#each [1, 2, 3] as i (i)}
        <label>Referensi {i} <input name="harga_{k}_{i}" inputmode="numeric" required /></label>
      {/each}
    </fieldset>
  {/each}
  <button type="submit">Terbitkan</button>
</form>

{#if form?.sukses}
  <p role="status">
    Papan {form.duplikat ? "sudah pernah diterbitkan (permintaan yang sama)" : "diterbitkan"}. Audit: <strong>{form.audit_id}</strong>
  </p>
{:else if form?.pesan}
  <p role="alert">{form.pesan}</p>
{/if}
