# Kontribusi ke lumbung-web

Berlaku untuk manusia dan agent AI. Keputusan lengkap: [ADR-0004](docs/decisions/ADR-0004-tata-kelola-branch.md).

## Alur

1. **Fork** repo ke akun sendiri: `gh repo fork Coding-Skuy/lumbung-web --clone=false`, lalu clone fork dan tambah remote `upstream` ke repo org.
2. **Branch** dari `upstream/main`. Satu branch = satu tiket = satu PR. Nama: `<jenis>/<kode-tiket-huruf-kecil>-<slug>`.
   Jenis: `feat/`, `fix/`, `test/`, `docs/`, `chore/`. Contoh: `feat/lmb-web-002-papan-harga-publik`.
3. **Commit atomic** (conventional commits, bahasa Indonesia, satu perubahan logis per commit): `feat:`, `fix:`, `test:`, `docs:`, `chore:`.
4. **Uji lokal** sebelum PR: `bun install && bun run check && bun test && bun run build`. Kode baru wajib disertai uji (merah-hijau bila praktis).
   Uji kontrak: `bun run test:pact` (Pact), `contract/schemathesis.sh` (Schemathesis, butuh backend hidup), `.maestro/` (E2E web, beta; lihat ADR-0003). Matikan telemetri alat uji (`E2E_TELEMETRY_DISABLED=1`, `MAESTRO_CLI_NO_ANALYTICS=1`).
   Sebelum PR jalankan juga `graphify update .` (jangan commit `graphify-out/`).
5. **Perbarui `CHANGELOG.md`** pada setiap PR.
6. **Buka PR** ke `Coding-Skuy/lumbung-web` base `main` dengan template PR. Cantumkan `Closes #N`. Bila bergantung pada PR lain, cabangkan dari branch itu dan tulis "Bergantung pada #N, merge berurutan".
   Agent: bila GraphQL `gh` terbatas, pakai REST (`gh api repos/Coding-Skuy/lumbung-web/pulls`) dengan jeda >=0,5 detik antar panggilan tulis.
7. **Tinjauan manusia wajib.** Pembuat PR tidak merge PR sendiri; tidak ada force-push ke `main`.

## Aturan penting

- Requirement hidup di Lumbung-TownHall, bukan di repo ini ([AGENTS.md](AGENTS.md)).
- ADR immutable: keputusan baru = ADR bernomor berikutnya; dokumen `versions/v*` tidak diedit.
- ADR bernomor berikutnya setelah ADR di `main` dan PR terbuka (saat ini 0001-0004 terpakai).
- Jangan commit rahasia (`.env`, kunci API). `LUMBUNG_API_KEY` hanya di lingkungan server.
- Web tidak menghitung ulang fee, grade, atau papan harga.
