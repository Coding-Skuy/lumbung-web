# lumbung-web

Dasbor web operasional Lumbung: kelola rute, pantau papan harga, dan rekap gudang.

## Teknologi

- Bun `1.4.x` — runtime dan package manager.
- Svelte `5` — UI reaktif (runes).
- SvelteKit `2` — routing dan SSR.
- TypeScript `5.9.x` — tipe statis (strict).

Versi pin exact ada di `package.json`.

## Fitur

- `ops` — halaman operasional gudang: lot masuk, timbangan, fee.
- `rute` — halaman rute trip kebun ke gudang dan pasar induk.
- `papan-harga` — papan harga hortikultura per pasar induk.

## Cara Jalan

```bash
bun install
bun run dev
bun run build
```

## Keterkaitan

- Backend: [lumbung-backend-service](https://github.com/Coding-Skuy/lumbung-backend-service)
- Platform: [Lumbung-TownHall](https://github.com/Coding-Skuy/Lumbung-TownHall)
