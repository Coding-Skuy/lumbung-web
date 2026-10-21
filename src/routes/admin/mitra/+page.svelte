<script lang="ts">
  import { enhance } from "$app/forms";
  import type { ActionData, PageData } from "./$types";

  let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<svelte:head><title>Mitra</title></svelte:head>

<h1>Mitra petani ({data.mitra.length})</h1>
<table>
  <thead><tr><th>Kode</th><th>Nama</th><th>Kontrak</th><th></th></tr></thead>
  <tbody>
    {#each data.mitra as m (m.kode)}
      <tr><td>{m.kode}</td><td>{m.nama}</td><td>{m.status}</td>
        <td>
          {#if data.bisaUbah}
            <form method="POST" action="?/status" use:enhance>
              <input type="hidden" name="kode" value={m.kode} />
              <input type="hidden" name="status" value={m.status === "AKTIF" ? "NONAKTIF" : "AKTIF"} />
              <button type="submit">{m.status === "AKTIF" ? "Nonaktifkan" : "Aktifkan"}</button>
            </form>
          {/if}
        </td>
      </tr>
    {/each}
  </tbody>
</table>

{#if form?.sukses}
  <p role="status">Mitra {form.kode} kini {form.status}. Audit: <strong>{form.audit_id}</strong></p>
{:else if form?.pesan}
  <p role="alert">{form.pesan}</p>
{/if}
