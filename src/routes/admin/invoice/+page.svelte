<script lang="ts">
  import { enhance } from "$app/forms";
  import { formatRupiah } from "$lib/format";
  import type { ActionData, PageData } from "./$types";

  let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<svelte:head><title>Invoice</title></svelte:head>

<h1>Invoice mingguan</h1>
<form method="GET"><label>Minggu <input name="minggu" pattern={"\\d{4}-W\\d{2}"} value={data.minggu} /></label> <button>Tampilkan</button></form>

{#if data.invoice.length === 0}
  <p>Tidak ada invoice untuk {data.minggu}.</p>
{:else}
  <table>
    <thead><tr><th>ID</th><th>Pembeli</th><th>Nominal</th><th>Status</th><th>Jatuh tempo</th><th>Denda</th><th></th></tr></thead>
    <tbody>
      {#each data.invoice as i (i.id)}
        <tr>
          <td>{i.id}</td><td>{i.pembeli}</td><td>{formatRupiah(i.nominal)}</td><td>{i.status}</td>
          <td>{i.jatuh_tempo}</td><td>{i.denda === undefined ? "-" : formatRupiah(i.denda)}</td>
          <td>
            {#if i.status !== "LUNAS"}
              <form method="POST" action="?/lunas" use:enhance>
                <input type="hidden" name="id" value={i.id} />
                <button type="submit">Tandai lunas</button>
              </form>
            {/if}
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}

{#if form?.sukses}
  <p role="status">Invoice {form.id} ditandai lunas. Audit: <strong>{form.audit_id}</strong></p>
{:else if form?.pesan}
  <p role="alert">{form.pesan}</p>
{/if}
