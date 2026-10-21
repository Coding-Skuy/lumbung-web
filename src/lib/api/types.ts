/**
 * Tipe kontrak API Lumbung yang dipakai web.
 * Sumber: lumbung-backend-service `docs/api/openapi.yaml` (v1.0.0).
 * Berat gram integer, uang rupiah integer; web tidak menghitung ulang angka apa pun.
 */

export type Komoditas = "cabai" | "bawang" | "kangkung";

/** Urutan tampil tetap 3 komoditas pilot v1.0.0 (KONTEKS §4). */
export const KOMODITAS_PILOT: readonly Komoditas[] = ["cabai", "bawang", "kangkung"];

export type HargaGrade = { a: number; b: number };

export type PapanHarga = {
  cabai: HargaGrade;
  bawang: HargaGrade;
  kangkung: HargaGrade;
  fee: { dekat: number; jauh: number };
  /** Contoh: "2026-10-06 s.d. 2026-10-12" (Senin-Minggu). */
  berlaku: string;
};

export type Profil = {
  nama: string;
  deskripsi?: string;
  kontak_kemitraan?: string;
};

/** Badan galat baku `AppError`. */
export type Galat = { error: string };

export type Peran = "petani" | "sopir" | "admin_gudang" | "admin_keuangan" | "koordinator_tani";

/** Respons `POST /auth/masuk` dan `POST /auth/refresh`. */
export type TokenResponse = {
  token: string;
  refresh_token: string;
  /** date-time ISO 8601 */
  berlaku_sampai: string;
  peran: Peran;
  trip_hari_ini?: string[];
};

export type RekapHarian = {
  tanggal: string;
  /** berat_g = gram integer */
  masuk: { komoditas: Komoditas; berat_g: number }[];
  /** rupiah integer */
  fee_tertagih: number;
  susut_persen: number;
};

export type StatusInvoice = "TERBIT" | "LUNAS" | "LEWAT_JATUH_TEMPO";

export type Invoice = {
  id: string;
  pembeli: string;
  minggu: string;
  nominal: number;
  status: StatusInvoice;
  jatuh_tempo: string;
  denda?: number;
};

export type StatusMitra = "AKTIF" | "NONAKTIF";

export type Mitra = { kode: string; nama: string; status: StatusMitra };

export type Insiden = { id: string; jenis: string; catatan?: string; waktu: string };
