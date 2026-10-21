#!/usr/bin/env bash
# Uji berbasis properti Schemathesis terhadap openapi.yaml backend Lumbung.
# Lingkup default: operasi yang dikonsumsi web (tag Publik dan Admin).
#
# Variabel lingkungan (semua opsional):
#   BASE_URL       URL backend/mock yang diuji   (default http://localhost:8080)
#   OPENAPI_SPEC   jalur berkas atau URL spec    (default: diunduh dari lumbung-backend-service via gh)
#   TAGS           tag operasi dipisah koma      (default Publik,Admin)
#   MAX_EXAMPLES   jumlah contoh per operasi     (default 25)
#   ADMIN_TOKEN    JWT admin untuk tag Admin     (tidak pernah dicetak)
#   SCHEMATHESIS   perintah schemathesis         (default: schemathesis, atau uvx bila ada)
set -euo pipefail

cd "$(dirname "$0")/.."
BASE_URL="${BASE_URL:-http://localhost:8080}"
TAGS="${TAGS:-Publik,Admin}"
MAX_EXAMPLES="${MAX_EXAMPLES:-25}"
OUT_DIR="contract/.out"
mkdir -p "$OUT_DIR"

SPEC="${OPENAPI_SPEC:-}"
if [ -z "$SPEC" ]; then
  SPEC="$OUT_DIR/openapi.yaml"
  echo "Mengunduh spec dari Coding-Skuy/lumbung-backend-service (docs/api/openapi.yaml)..." >&2
  gh api repos/Coding-Skuy/lumbung-backend-service/contents/docs/api/openapi.yaml \
    -H "Accept: application/vnd.github.raw" > "$SPEC"
fi

if [ -n "${SCHEMATHESIS:-}" ]; then
  ST=("$SCHEMATHESIS")
elif command -v schemathesis >/dev/null 2>&1; then
  ST=(schemathesis)
elif command -v uvx >/dev/null 2>&1; then
  ST=(uvx schemathesis)
else
  echo "schemathesis tidak ditemukan. Pasang: pip install schemathesis (atau pasang uv)." >&2
  exit 2
fi

ARGS=(run "$SPEC" --url "$BASE_URL" --max-examples "$MAX_EXAMPLES"
      --report junit --report-junit-path "$OUT_DIR/schemathesis-junit.xml")
IFS=',' read -r -a TAG_LIST <<< "$TAGS"
for t in "${TAG_LIST[@]}"; do ARGS+=(--include-tag "$t"); done
if [ -n "${ADMIN_TOKEN:-}" ]; then ARGS+=(-H "Authorization: Bearer ${ADMIN_TOKEN}"); fi

echo "Schemathesis -> $BASE_URL (tag: $TAGS, contoh: $MAX_EXAMPLES)" >&2
E2E_TELEMETRY_DISABLED=1 "${ST[@]}" "${ARGS[@]}"
