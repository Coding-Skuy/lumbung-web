# Uji kontrak: Schemathesis

Uji berbasis properti terhadap `docs/api/openapi.yaml` di
[lumbung-backend-service](https://github.com/Coding-Skuy/lumbung-backend-service). Repo ini hanya klien; backend tidak diubah.

## Pakai

```bash
pip install schemathesis        # atau pasang uv (skrip memakai `uvx schemathesis`)
gh auth login                   # untuk mengunduh spec dari repo backend
BASE_URL=http://localhost:8080 contract/schemathesis.sh
```

| Variabel | Default | Fungsi |
|---|---|---|
| `BASE_URL` | `http://localhost:8080` | Backend lokal atau mock yang diuji |
| `OPENAPI_SPEC` | unduh via `gh api` | Jalur/URL spec lokal |
| `TAGS` | `Publik,Admin` | Operasi yang dikonsumsi web |
| `MAX_EXAMPLES` | `25` | Contoh per operasi |
| `METHODS` | `GET` | Metode yang diuji. POST/PUT/DELETE menulis data: hanya untuk backend lokal/uji, jangan ke produksi |
| `SERVICE_KEY` | kosong | Nilai header `X-Service-Key` untuk tag Admin (alternatif bearer); jangan di-commit |
| `ADMIN_TOKEN` | kosong | JWT admin (audiens `lumbung`) untuk tag Admin; jangan di-commit |

Laporan JUnit: `contract/.out/schemathesis-junit.xml` (diabaikan git).

## Backend lokal untuk uji

Bangun backend dari salinan repo (jangan ubah repo backend): `cargo build --release`, Postgres sementara (`initdb`), kunci ed25519 (`openssl genpkey -algorithm ed25519`),
env `DATABASE_URL`, `LISTEN_ADDR`, `JWT_ED25519_PRIVATE/PUBLIC`, `DEVICE_API_KEY_GUDANG`, `SERVICE_API_KEY`; migrasi berjalan otomatis saat start.
Tanpa papan terbit, `GET /publik/papan-harga` selalu 404 (sah) sehingga jalur 200 tidak teruji: terbitkan satu papan dulu lewat
`POST /v1/admin/papan-harga` dengan `X-Service-Key`. Lalu:

```bash
SERVICE_KEY=<kunci> OPENAPI_SPEC=<berkas spec> BASE_URL=http://localhost:8080/v1 TAGS=Publik,Admin contract/schemathesis.sh
```

Perhatikan `BASE_URL` memuat `/v1` (semua rute API di bawah awalan itu).

## Hasil uji nyata (2026-10-21)

Terhadap backend branch `feat/lmb-be-007-papan-harga` (build lokal), `TAGS=Publik,Admin METHODS=GET`, schemathesis 4.32.2: 6 operasi terpilih, 7 temuan.
Temuan untuk repo backend (bukan perbaikan di repo ini):

| Kode | Operasi | Arti |
|---|---|---|
| ST103 | `GET /publik/profil`, `/admin/rekap-harian`, `/admin/mitra`, `/admin/insiden` | 404 (rute belum diimplementasi di branch itu; spec mendokumentasikan 200) |
| ST204 | `TRACE /publik/profil` | 404, seharusnya 405 untuk metode tak dideklarasikan |
| ST401 | `GET /admin/invoice` | kredensial salah dijawab 400 (spec: 401/403) |

## CI

Workflow `.github/workflows/schemathesis.yml` hanya `workflow_dispatch` (manual). Input: `base_url`, `tags`, `max_examples`.
Spec diunduh dari repo backend; bila repo backend privat, set secret `BACKEND_READ_TOKEN` (token baca) di pengaturan repo.

## Catatan

- Kegagalan `ST101`/`ST204` pada backend nyata = temuan untuk repo backend (buka issue di sana, jangan ubah dari repo ini).
- Verifikasi provider Pact ada di tiket terpisah (LMB-WEB-TEST-PACT).
