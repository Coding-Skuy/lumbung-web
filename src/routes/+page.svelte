<script lang="ts">
  // Halaman utama ops Lumbung: ringkasan lot, trip, dan papan harga.
  const papanHarga: Array<{ komoditas: string; pasar: string; hargaPerKg: number }> = [
    { komoditas: "Cabai merah", pasar: "Pasar Induk Kramat Jati", hargaPerKg: 0 },
    { komoditas: "Bawang merah", pasar: "Pasar Induk Brebes", hargaPerKg: 0 }
  ];
</script>

<h1>Ops Lumbung</h1>
<p>Kelola rute, pantau papan harga, dan rekap timbangan gudang.</p>

<nav>
  <a href="/ops">Ops</a>
  <a href="/rute">Rute</a>
  <a href="/papan-harga">Papan Harga</a>
</nav>

<section>
  <h2>Papan Harga (contoh awal)</h2>
  <ul>
    {#each papanHarga as item}
      <li>{item.komoditas} — {item.pasar} — Rp{item.hargaPerKg}/kg</li>
    {/each}
  </ul>
</section>
