# Uji kontrak konsumen (Pact) — lumbung-web

Konsumen `lumbung-web` (klien server-side `src/lib/server/lumbung-client.ts`) terhadap provider `lumbung-backend-service`,
cakupan: `GET /v1/publik/papan-harga` (200 dan 404 belum terbit) dan `GET /v1/publik/profil` (200 dan 500).
Sumber kebenaran bentuk respons: `docs/api/openapi.yaml` di lumbung-backend-service.

## Menjalankan

```bash
bun install
E2E_TELEMETRY_DISABLED=1 bun run test:pact   # hasil: pacts/lumbung-web-lumbung-backend-service.json
```

`test:pact` menghapus `pacts/` dulu agar interaksi lama tidak menumpuk. `bun test` biasa juga menjalankannya.
Berkas pact hasil dibangkitkan ikut di-commit supaya provider dapat memverifikasinya tanpa menjalankan web.

## Verifikasi provider

Dilakukan di lumbung-backend-service (issue provider terpisah di repo itu, bukan di sini): ambil
`pacts/lumbung-web-lumbung-backend-service.json` dari repo ini lalu jalankan verifier terhadap backend lokal.
Nilai `given` (state) yang harus disiapkan provider:

| State | Arti |
|---|---|
| papan harga minggu berjalan sudah terbit | papan minggu berjalan ada |
| papan harga minggu berjalan belum terbit | belum ada papan minggu berjalan (404) |
| profil Lumbung tersedia | profil ada |
| basis data tidak tersedia | galat 500 (opsional; dapat dilewati bila sulit disimulasikan) |

## Broker

Publikasi ke Pact Broker hanya dokumentasi pada v1.0.0 (belum ada broker): `pact-broker publish pacts --consumer-app-version <git-sha> --branch <branch>`.
Keputusan tooling lengkap: ADR-0003.
