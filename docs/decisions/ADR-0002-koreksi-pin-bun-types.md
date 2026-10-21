# ADR-0002 — Koreksi pin bun-types dan fondasi build

- Status: Diterima (disetujui pemilik, 2026-10-21; menggantikan sebagian ADR-0001/AGENTS.md butir "pin `bun-types` 1.4.4")
- Tanggal: 2026-10-21

## Konteks

Issue #10: `bun install` gagal karena `bun-types@1.4.4` tidak ada di registry npm (hanya `1.4.4-canary.*`; tag `latest` = 1.4.3). Bun terpasang di mesin dev/CI adalah 1.4.2. Selain itu `tsconfig.json`, `vite.config.ts`, dan `@sveltejs/vite-plugin-svelte` belum ada sehingga `bun run check` dan `vite build` tidak jalan.

## Keputusan

1. `bun-types` dipin exact ke `1.4.2` (rilis stabil yang cocok dengan Bun terpasang); pin 1.4.4 pada AGENTS.md diganti.
2. Tambah `@sveltejs/vite-plugin-svelte` `6.2.0` (peer: vite ^6.3 || ^7, svelte ^5) dan `@sveltejs/adapter-node` `5.2.13` (SSR di VPS, ADR-0001 butir 2). Semua versi tetap exact.
3. Tambah `tsconfig.json` (strict, extends `.svelte-kit/tsconfig.json`), `vite.config.ts`, `src/app.html`, `src/app.d.ts`, dan skrip `test` (`bun test`).
4. Versi lain (Svelte 5.35.0, SvelteKit 2.22.0, Vite 7.0.4, TypeScript 5.9.2) tidak berubah.

## Konsekuensi

- `bun install && bun run check && bun test && bun run build` dapat dijalankan dari checkout bersih.
- Pin mengikuti Bun terpasang (`bun --version` = 1.4.2); naik versi Bun = ADR pengganti dan ubah satu baris.
