> Versi: v1.0.0 | Status: disetujui | Menggantikan: -
> Sumber: Lumbung-TownHall `platform/versions/v1.0.0/` pada commit `673a467` ([platform/versions/v1.0.0](https://github.com/Coding-Skuy/Lumbung-TownHall/blob/673a467126e195ffd67c9d3ff21d108193a6c3ec/platform/versions/v1.0.0))

# 40 — Tech Stack lumbung-web

Matriks stack web. Versi dari `package.json` main per 2026-10-14. Repo sudah di Svelte/SvelteKit sehingga tidak ada kewajiban migrasi dari Next.js/React.

## Matriks

| Komponen | Versi | Catatan |
|---|---|---|
| Bun | 1.4.x (`bun-types` 1.4.4) | runtime + package manager |
| Svelte | 5.35.0 | runes |
| SvelteKit | 2.22.0 | SSR, `+page.server.ts` |
| Vite | 7.0.4 | build |
| TypeScript | 5.9.2 | strict |
| svelte-check | 4.1.1 | `bun run check` |

## Halaman v1.0.0 (dari kontrak)

| Area | Halaman | Sumber data | Auth |
|---|---|---|---|
| Publik | Papan harga (cabai, bawang, kangkung per grade + fee dekat 1500/jauh 2500 + tanggal berlaku) | `GET /v1/publik/papan-harga` (cache 15 menit) | tanpa login |
| Publik | Profil Lumbung + kontak kemitraan | `GET /v1/publik/profil` | tanpa login |
| Admin baca | Rekap harian, invoice mingguan, mitra (40 petani), insiden | `GET /v1/admin/*` | sesi peran |
| Admin tulis | Terbit papan Jumat 15.00, tandai invoice lunas, status mitra | `POST /v1/admin/*` | sesi peran + `audit_id` |

## Catatan migrasi

Tidak ada: repo sudah Svelte 5 + SvelteKit 2. Dilarang menambahkan React/Next.js.
