<script lang="ts">
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();
</script>

<svelte:head><title>Mitra</title></svelte:head>

<h1>Mitra petani ({data.mitra.length})</h1>
<table>
  <thead><tr><th>Kode</th><th>Nama</th><th>Kontrak</th></tr></thead>
  <tbody>
    {#each data.mitra as m (m.kode)}
      <tr><td>{m.kode}</td><td>{m.nama}</td><td>{m.status}</td></tr>
    {/each}
  </tbody>
</table>
