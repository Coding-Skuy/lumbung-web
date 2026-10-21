# ADR-0002 — Tata kelola branch dan alur PR lumbung-web

- Status: Diterima
- Tanggal: 2026-10-21

## Konteks

Kontribusi datang dari manusia dan agent AI. Tanpa alur seragam, `main` rawan berisi perubahan tanpa tinjauan dan riwayat sulit dibaca.

## Keputusan

1. Kontributor bekerja di **fork**; PR dibuka ke `Coding-Skuy/lumbung-web` base `main`.
2. Branch dari `upstream/main`, satu branch = satu tiket = satu PR, bernama `<jenis>/<kode-tiket>-<slug>` (`feat|fix|test|docs|chore`).
3. Commit **atomic** dengan conventional commits berbahasa Indonesia.
4. PR memakai `.github/pull_request_template.md`; `CHANGELOG.md` wajib diperbarui; tiket ditutup lewat `Closes #N` saat merge.
5. `.github/CODEOWNERS` menetapkan `@Coding-Skuy` sebagai pemilik seluruh repo sampai ada tim lain.
6. Pembuat PR tidak merge PR sendiri; tidak ada force-push ke `main`.

## Usulan proteksi branch `main` (tidak diterapkan oleh ADR ini)

Usulan untuk pemilik repo, diterapkan manual lewat pengaturan GitHub:

- Wajib PR + minimal 1 persetujuan, dismiss approval basi saat ada commit baru.
- Wajib review Code Owners.
- Wajib status check lulus (`bun run check`, `bun test`) dan branch up-to-date.
- Larang force-push dan penghapusan `main`; riwayat linear (squash/rebase merge).

## Konsekuensi

- Riwayat bersih dan terlacak ke tiket; tinjauan manusia selalu terjadi.
- Proteksi branch belum aktif sampai pemilik repo menerapkannya.
