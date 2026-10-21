import type { Peran } from "$lib/api/types";

export type AreaAdmin = "rekap" | "invoice" | "mitra" | "insiden";

/**
 * Hak peran di UI (FR-303): admin keuangan hanya rekap dan invoice; admin gudang semua.
 * Hanya penyaring tampilan; backend tetap otoritas (403 bila peran ditolak).
 */
const MATRIKS: Partial<Record<Peran, readonly AreaAdmin[]>> = {
  admin_gudang: ["rekap", "invoice", "mitra", "insiden"],
  admin_keuangan: ["rekap", "invoice"]
};

export function areaUntuk(peran: string | undefined): readonly AreaAdmin[] {
  return MATRIKS[peran as Peran] ?? [];
}

export function boleh(peran: string | undefined, area: AreaAdmin): boolean {
  return areaUntuk(peran).includes(area);
}

/** Minggu ISO `YYYY-Www` valid (dipakai query `?minggu=`). */
export function mingguValid(v: string | null): v is string {
  return v !== null && /^\d{4}-W(0[1-9]|[1-4]\d|5[0-3])$/.test(v);
}

/** Tanggal `YYYY-MM-DD` valid (dipakai query `?tanggal=`). */
export function tanggalValid(v: string | null): v is string {
  if (v === null || !/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
  const d = new Date(v + "T00:00:00Z");
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === v;
}
