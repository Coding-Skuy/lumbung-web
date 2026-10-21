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
