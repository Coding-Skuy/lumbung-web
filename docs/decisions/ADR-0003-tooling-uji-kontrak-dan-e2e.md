# ADR-0003 — Tooling uji kontrak dan E2E (Pact, Schemathesis, Maestro web)

- Status: Diterima
- Tanggal: 2026-10-21
- Catatan penomoran: ADR-0002 dipakai PR fondasi build (koreksi pin bun-types, status Diterima); ADR ini nomor berikutnya.

## Konteks

Siklus 2 menambah tiga lapis uji untuk web: kontrak konsumen (LMB-WEB-TEST-PACT, #6), uji properti terhadap openapi (LMB-WEB-TEST-SCHEMATHESIS, #7), dan E2E (LMB-WEB-TEST-MAESTRO, #8).

## Keputusan

1. **Pact**: `@pact-foundation/pact` 17.1.4 (PactV3) dijalankan lewat `bun test`; kontrak keluar ke `pacts/` dan di-commit. Berjalan baik di Bun 1.4.2 (pustaka native). Verifikasi provider dikerjakan di lumbung-backend-service; publikasi broker hanya dokumentasi (belum ada broker). Cakupan awal: dua endpoint publik.
2. **Schemathesis**: skrip `contract/schemathesis.sh` + workflow `workflow_dispatch` manual (bukan gerbang CI otomatis, karena butuh backend hidup). Default hanya metode GET agar tidak menulis data; POST hanya untuk backend lokal/uji. Hasil nyata ke backend lokal dicatat di `contract/README.md`.
3. **Maestro (mode web)**: alur di `.maestro/`, selector `id`/`data-testid` di kode. Status: **beta**. Perilaku teramati (Maestro CLI 2.11.0, Chrome, macOS):
   - Dua alur dijalankan sungguhan terhadap web hasil build + backend nyata lokal (papan terbit): `smoke` dan `papan-harga-publik` lulus (exit 0). Satu percobaan pertama gagal karena asersi teks, bukan kestabilan alat (lihat butir regex).
   - Asersi teks dicocokkan sebagai regex terhadap seluruh teks elemen: gunakan `".*Rp1\\.500.*"`, bukan `"Rp1.500"`.
   - Variabel harus dikirim lewat `-e WEB_URL=...` (interpolasi `${WEB_URL}` dari environment shell tidak terbaca di header `url:`).
   - Start dingin lambat (JVM + Chrome, puluhan detik); Chrome dibuka berjendela.
   - Selector `id:` cocok dengan `data-testid` maupun atribut `id` (terbukti: elemen hanya ber-`data-testid` ditemukan); tautan utama diberi keduanya.
   - Belum ada fallback otomatis di CI; alur Maestro tidak masuk gerbang CI sampai Maestro web keluar dari beta. **Fallback** bila tidak stabil: uji komponen/server (`bun test`, sudah ada) dan Pact; E2E dijalankan manual lokal.
4. Telemetri alat uji dimatikan: `E2E_TELEMETRY_DISABLED=1`, `MAESTRO_CLI_NO_ANALYTICS=1`.

## Konsekuensi

- Pact masuk `bun test` biasa (+~10 detik); `bun run test:pact` membersihkan `pacts/` dulu.
- Temuan Schemathesis adalah masukan untuk repo backend, bukan diperbaiki dari repo ini.
- Alur Maestro memerlukan backend (atau mock) berisi papan terbit; tanpa itu halaman menampilkan "belum terbit" dan alur bisnis gagal dengan sengaja.
