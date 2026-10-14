# ADR-0001 — Fondasi teknis lumbung-web

- Status: Diterima
- Tanggal: 2026-10-14

## Konteks

lumbung-web menyajikan papan harga publik (cache 15 menit) dan dasbor admin. Repo sudah berbasis Bun + Svelte 5 + SvelteKit 2 (tidak drift ke Next.js/React).

## Keputusan

1. Stack: Bun + Svelte 5 + SvelteKit 2 + TypeScript strict; versi exact di `package.json`. Dilarang Next.js/React.
2. SSR di VPS; semua panggilan ke backend dari server. `LUMBUNG_API_KEY` di variabel lingkungan server, rotasi 90 hari; bila bocor dicabut dalam 1 jam dan kunci baru terbit sebelum Jumat publikasi harga.
3. Web tidak menghitung ulang fee, grade, atau papan; semua angka dari server (FSD/30).
4. Endpoint publik di-cache 15 menit; admin baca 4 dan tulis 3 dengan `audit_id` (contoh AUD-20261009-003) ditampilkan di dasbor.
5. Sesi admin berperan (admin gudang, admin keuangan); 1 orang 1 akun; JWT audiens `lumbung`.

## Konsekuensi

- Halaman publik p95 <600 ms (cache 15 menit); admin p95 <1,2 detik (produk/32).
- Fitur README awal (`ops`, `rute`, `papan-harga`) harus diselaraskan dengan kontrak FSD/30 saat tiket LMB-WEB-002..004 dikerjakan.
