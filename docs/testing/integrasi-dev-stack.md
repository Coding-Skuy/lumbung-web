# Integrasi web dengan backend nyata (dev-stack) dan ukur latensi

Web hasil build dijalankan terhadap backend nyata di dev-stack Docker milik lumbung-infra-devops (`make dev-up`, `make dev-seed`, `make dev-smoke`;
backend branch uji kontrak, port 18480, DB 15532). Repo infra dan backend tidak diubah.

## Menjalankan

```bash
# di klon lumbung-infra-devops (BACKEND_DIR = klon backend pada branch yang diuji)
BACKEND_DIR=<klon-backend> make dev-up && make dev-seed && make dev-smoke

# di repo ini (nilai kunci diambil dari deploy/dev/.env infra; jangan dicetak/di-commit)
bun install && bun run build
LUMBUNG_API_URL=http://127.0.0.1:18480/v1 LUMBUNG_API_KEY=<SERVICE_API_KEY> PORT=3000 ORIGIN=http://localhost:3000 node build/index.js &
WEB_URL=http://localhost:3000 AKUN=OPR-SORTIR-1 PIN=123456 N=200 bun scripts/ukur-p95.ts
```

Akun seed: `OPR-SORTIR-1` (admin gudang), `keu-01` (admin keuangan), PIN `123456` (hanya DB dev).

## Hasil nyata (2026-10-22, macOS, Docker lokal, N=200 per halaman, berurutan)

| Halaman | p50 | p95 | Target |
|---|---|---|---|
| publik `/papan-harga` | 0,6 ms | 1,9 ms | <600 ms |
| publik `/profil` | 0,5 ms | 1,5 ms | <600 ms |
| admin `/rekap` | 8,0 ms | 19,0 ms | <1200 ms |
| admin `/invoice` | 6,7 ms | 14,5 ms | <1200 ms |
| admin `/mitra` | 5,7 ms | 10,3 ms | <1200 ms |
| admin `/insiden` | 4,7 ms | 8,5 ms | <1200 ms |

Catatan jujur: pengukuran lokal tanpa jaringan, satu klien berurutan, data dev sangat kecil (1 mitra, tanpa invoice/insiden), halaman publik dilayani dari
cache memori 15 menit. Angka ini menunjukkan tidak ada hambatan di sisi web, bukan p95 produksi; ukur ulang di staging dengan data pilot (40 petani) dan jaringan nyata.

## Alur yang dijalankan terhadap backend nyata

- Publik: `/papan-harga` 200 (papan terbit), `/profil` 200.
- Admin: login `OPR-SORTIR-1`; `/admin/rekap`, `/invoice`, `/mitra`, `/insiden`, `/papan-harga` 200.
- Tulis: terbit papan lewat form web untuk Senin minggu depan menghasilkan `audit_id` (contoh `AUD-20261022-002`); kirim ulang UUID yang sama memberi `duplikat`.
- Bentuk respons `rekap-harian`, `invoice`, `mitra`, `insiden`, `profil` dari backend sesuai tipe di `src/lib/api/types.ts` (gram integer, rupiah integer; status invoice `TERBIT/LUNAS/LEWAT_JATUH_TEMPO`).
  `MENUNGGU/DIBAYAR/TERLAMBAT` adalah status pembayaran petani (`/pembayaran-saya`, app mobile), bukan invoice web.
