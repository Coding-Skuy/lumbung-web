> Versi: v1.0.0 | Status: disetujui | Menggantikan: -
> Sumber: Lumbung-TownHall `platform/versions/v1.0.0/` pada commit `673a467`; [townhall-roadmap.md §2](https://github.com/Coding-Skuy/ChefGenie-TownHall/blob/main/townhall-roadmap.md); [KONTEKS §8/§9](https://github.com/Coding-Skuy/ChefGenie-TownHall/blob/main/KONTEKS-LINTAS-DIVISI.md)

# 60 — Blast Radius lumbung-web

Batas context v1.0.0 Lumbung (townhall-roadmap §2): 3 komoditas pilot, fee Rp1.500/kg dekat dan Rp2.500/kg jauh, radius 25 km; point of concern titik impas 18.000 kg/bulan dan susut <5%.

## Boleh disentuh

- Halaman publik papan harga dan profil; dasbor admin baca/tulis sesuai FSD/30.
- Konversi input kg desimal ke gram integer di sisi server SvelteKit.
- Cetakan A3 papan harga (jalur publikasi ke-2) dari data yang sama.

## Dilarang

- Menyentuh DB logis divisi lain (`pasaree`, `titipo`, `pedaree`, `pawonee`, `titeny`).
- Menambah `event_type` di luar registry KONTEKS §3 tanpa bump versi + 30 hari dual-read.
- Menambah komoditas keempat atau melayani di luar radius 25 km (non-goal PRD/30).
- Menghitung ulang fee, grade, atau papan harga di web.
- Mengirim `LUMBUNG_API_KEY` ke browser atau menulisnya ke repo.
- Menambahkan Next.js/React atau menaikkan versi dependensi tanpa ADR.
- Memanggil endpoint sopir/petani/gudang (bukan konsumen web).

## Kontrak diproduksi

- Halaman publik papan harga (`/harga`) dan profil; tampilan dasbor admin.
- Permintaan tulis admin beraudit: `POST /v1/admin/papan-harga`, `/invoice/{id}/lunas`, `/mitra/{id}/status`.

## Kontrak dikonsumsi

- REST `lumbung-backend-service`: 2 publik, 4 admin baca, 3 admin tulis (OpenAPI).
- Token desain dan layar dari `lumbung-design`.

## Aturan perubahan

Perubahan di luar batas ini = PR requirement di Lumbung-TownHall lebih dulu, lalu ADR baru di repo ini. Perubahan angka lintas-divisi wajib memperbarui KONTEKS §terkait + dokumen divisi + CHANGELOG versi dalam PR yang sama (KONTEKS §9).
