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
| `ADMIN_TOKEN` | kosong | JWT admin (audiens `lumbung`) untuk tag Admin; jangan di-commit |

Laporan JUnit: `contract/.out/schemathesis-junit.xml` (diabaikan git).

## CI

Workflow `.github/workflows/schemathesis.yml` hanya `workflow_dispatch` (manual). Input: `base_url`, `tags`, `max_examples`.
Spec diunduh dari repo backend; bila repo backend privat, set secret `BACKEND_READ_TOKEN` (token baca) di pengaturan repo.

## Catatan

- Kegagalan `ST101`/`ST204` pada backend nyata = temuan untuk repo backend (buka issue di sana, jangan ubah dari repo ini).
- Verifikasi provider Pact ada di tiket terpisah (LMB-WEB-TEST-PACT).
