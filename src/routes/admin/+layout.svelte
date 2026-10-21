<script lang="ts">
  import type { LayoutData } from "./$types";

  let { data, children }: { data: LayoutData; children: import("svelte").Snippet } = $props();
  const label = { rekap: "Rekap harian", invoice: "Invoice", mitra: "Mitra", insiden: "Insiden", papan: "Terbitkan papan" } as const;
</script>

{#if data.peran}
  <nav>
    {#each data.area as a (a)}<a href="/admin/{a}">{label[a]}</a>{/each}
    <form method="POST" action="/admin/keluar" style="display:inline"><button type="submit">Keluar</button></form>
    <span>Peran: {data.peran}</span>
  </nav>
{/if}
{@render children()}
