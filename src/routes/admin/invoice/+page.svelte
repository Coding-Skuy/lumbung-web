<script lang="ts">
  import { formatRupiah } from "$lib/format";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();
</script>

<svelte:head><title>Invoice</title></svelte:head>

<h1>Invoice mingguan</h1>
<form method="GET"><label>Minggu <input name="minggu" pattern={"\\d{4}-W\\d{2}"} value={data.minggu} /></label> <button>Tampilkan</button></form>

{#if data.invoice.length === 0}
  <p>Tidak ada invoice untuk {data.minggu}.</p>
{:else}
  <table>
    <thead><tr><th>ID</th><th>Pembeli</th><th>Nominal</th><th>Status</th><th>Jatuh tempo</th><th>Denda</th></tr></thead>
    <tbody>
      {#each data.invoice as i (i.id)}
        <tr>
          <td>{i.id}</td><td>{i.pembeli}</td><td>{formatRupiah(i.nominal)}</td><td>{i.status}</td>
          <td>{i.jatuh_tempo}</td><td>{i.denda === undefined ? "-" : formatRupiah(i.denda)}</td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}
