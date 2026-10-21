# Kontribusi ke lumbung-web

Berlaku untuk manusia dan agent AI. Keputusan lengkap: [ADR-0002](docs/decisions/ADR-0002-tata-kelola-branch.md).

## Alur

1. **Fork** repo ke akun sendiri: `gh repo fork Coding-Skuy/lumbung-web --clone=false`, lalu clone fork dan tambah remote `upstream` ke repo org.
2. **Branch** dari `upstream/main`. Satu branch = satu tiket = satu PR. Nama: `<jenis>/<kode-tiket-huruf-kecil>-<slug>`.
   Jenis: `feat/`, `fix/`, `test/`, `docs/`, `chore/`. Contoh: `feat/lmb-web-002-papan-harga-publik`.
3. **Commit atomic** (conventional commits, bahasa Indonesia, satu perubahan logis per commit): `feat:`, `fix:`, `test:`, `docs:`, `chore:`.
4. **Uji lokal** sebelum PR: `bun install && bun run check && bun test`. Kode baru wajib disertai uji (merah-hijau bila praktis).
5. **Perbarui `CHANGELOG.md`** pada setiap PR.
6. **Buka PR** ke `Coding-Skuy/lumbung-web` base `main` dengan template PR. Cantumkan `Closes #N`.
7. **Tinjauan manusia wajib.** Pembuat PR tidak merge PR sendiri; tidak ada force-push ke `main`.

## Aturan penting

- Requirement hidup di Lumbung-TownHall, bukan di repo ini ([AGENTS.md](AGENTS.md)).
- ADR immutable: keputusan baru = ADR bernomor berikutnya; dokumen `versions/v*` tidak diedit.
- Jangan commit rahasia (`.env`, kunci API). `LUMBUNG_API_KEY` hanya di lingkungan server.
- Web tidak menghitung ulang fee, grade, atau papan harga.
