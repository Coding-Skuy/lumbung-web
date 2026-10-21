<script lang="ts">
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();
</script>

<svelte:head><title>Profil Lumbung</title></svelte:head>

<h1 data-testid="profil-nama">{data.profil.nama}</h1>
{#if data.profil.deskripsi}<p>{data.profil.deskripsi}</p>{/if}
{#if data.profil.kontak_kemitraan}
  <h2>Kemitraan</h2>
  <p>{data.profil.kontak_kemitraan}</p>
{/if}
