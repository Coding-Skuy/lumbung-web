# Changelog

Semua perubahan penting lumbung-web dicatat di sini. Format mengikuti Keep a Changelog; versi mengikuti versi milestone Lumbung.

## [Belum dirilis]

### Ditambahkan
- Fondasi AI-dev v1.0.0: `AGENTS.md`, `CLAUDE.md`, `docs/decisions/` (ADR-0001), `versions/v1.0.0/docs/40-TECHSTACK.md`, `versions/v1.0.0/docs/60-BLAST-RADIUS.md` (tiket LMB-WEB-001, 2026-10-14).
- Fondasi build: `tsconfig.json`, `vite.config.ts`, adapter-node, vite-plugin-svelte, `src/app.html`, `src/app.d.ts`, skrip `test`, ADR-0002 (issue #10).

- Halaman publik `/papan-harga` dan `/profil` (SSR, cache 15 menit), klien server-side, tipe kontrak (issue #2).
- Dasbor admin baca SSR: `/admin/masuk`, `/admin/rekap`, `/admin/invoice`, `/admin/mitra`, `/admin/insiden` dengan sesi peran (issue #3).
- Admin tulis beraudit minimum: `/admin/papan-harga` (terbit) dengan `audit_id` tampil; `kgKeGram` (issue #4). Aksi invoice lunas dan status mitra tidak diaktifkan (hak tulis minimum).

### Diubah
- Pin `bun-types` 1.4.4 (tidak ada di npm) diganti 1.4.2 (issue #10).
