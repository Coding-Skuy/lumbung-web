<script lang="ts">
  import { KOMODITAS_PILOT } from "$lib/api/types";
  import { formatRupiah } from "$lib/format";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();
  const hasil = $derived(data.hasil);
</script>

<svelte:head><title>Papan Harga Lumbung</title></svelte:head>

<h1>Papan Harga Mingguan</h1>

{#if hasil.status === "belum-terbit"}
  <p>Papan harga minggu ini belum terbit. Papan diterbitkan paling lambat Jumat pukul 17.00.</p>
{:else}
  {@const papan = hasil.papan}
  <p>Berlaku: {papan.berlaku}</p>
  <table>
    <thead>
      <tr><th>Komoditas</th><th>Grade A (per kg)</th><th>Grade B (per kg)</th></tr>
    </thead>
    <tbody>
      {#each KOMODITAS_PILOT as k (k)}
        <tr>
          <td>{k}</td>
          <td>{formatRupiah(papan[k].a)}</td>
          <td>{formatRupiah(papan[k].b)}</td>
        </tr>
      {/each}
    </tbody>
  </table>
  <h2>Fee logistik per kg</h2>
  <ul>
    <li>Zona dekat (&lt;15 km): {formatRupiah(papan.fee.dekat)}</li>
    <li>Zona jauh (15-25 km): {formatRupiah(papan.fee.jauh)}</li>
  </ul>
{/if}
