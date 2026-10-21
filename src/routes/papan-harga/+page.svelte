<script lang="ts">
  import { KOMODITAS_PILOT } from "$lib/api/types";
  import { formatRupiah } from "$lib/format";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();
  const hasil = $derived(data.hasil);
</script>

<svelte:head><title>Papan Harga Lumbung</title></svelte:head>

<h1 data-testid="papan-judul">Papan Harga Mingguan</h1>

{#if hasil.status === "belum-terbit"}
  <p data-testid="papan-belum-terbit">Papan harga minggu ini belum terbit. Papan diterbitkan paling lambat Jumat pukul 17.00.</p>
{:else}
  {@const papan = hasil.papan}
  <p data-testid="papan-berlaku">Berlaku: {papan.berlaku}</p>
  <table data-testid="papan-tabel">
    <thead>
      <tr><th>Komoditas</th><th>Grade A (per kg)</th><th>Grade B (per kg)</th></tr>
    </thead>
    <tbody>
      {#each KOMODITAS_PILOT as k (k)}
        <tr data-testid="papan-baris-{k}">
          <td>{k}</td>
          <td data-testid="papan-{k}-a">{formatRupiah(papan[k].a)}</td>
          <td data-testid="papan-{k}-b">{formatRupiah(papan[k].b)}</td>
        </tr>
      {/each}
    </tbody>
  </table>
  <h2>Fee logistik per kg</h2>
  <ul>
    <li data-testid="fee-dekat">Zona dekat (&lt;15 km): {formatRupiah(papan.fee.dekat)}</li>
    <li data-testid="fee-jauh">Zona jauh (15-25 km): {formatRupiah(papan.fee.jauh)}</li>
  </ul>
{/if}
