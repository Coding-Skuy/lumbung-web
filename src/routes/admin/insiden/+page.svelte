<script lang="ts">
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();
</script>

<svelte:head><title>Insiden</title></svelte:head>

<h1>Insiden</h1>
{#if data.insiden.length === 0}
  <p>Belum ada insiden.</p>
{:else}
  <table>
    <thead><tr><th>ID</th><th>Jenis</th><th>Catatan</th><th>Waktu</th></tr></thead>
    <tbody>
      {#each data.insiden as i (i.id)}
        <tr><td>{i.id}</td><td>{i.jenis}</td><td>{i.catatan ?? ""}</td><td>{i.waktu}</td></tr>
      {/each}
    </tbody>
  </table>
{/if}
