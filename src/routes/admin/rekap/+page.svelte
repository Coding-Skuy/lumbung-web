<script lang="ts">
  import { formatKg, formatRupiah } from "$lib/format";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();
</script>

<svelte:head><title>Rekap Harian</title></svelte:head>

<h1>Rekap Harian</h1>
<form method="GET"><label>Tanggal <input type="date" name="tanggal" value={data.tanggal} /></label> <button>Tampilkan</button></form>

<table>
  <thead><tr><th>Komoditas</th><th>Masuk</th></tr></thead>
  <tbody>
    {#each data.rekap.masuk as m (m.komoditas)}
      <tr><td>{m.komoditas}</td><td>{formatKg(m.berat_g)}</td></tr>
    {/each}
  </tbody>
</table>
<p>Fee tertagih: {formatRupiah(data.rekap.fee_tertagih)}</p>
<p>Susut: {data.rekap.susut_persen}%</p>
