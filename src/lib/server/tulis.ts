import { KOMODITAS_PILOT, type TerbitPapanRequest } from "$lib/api/types";

type Hasil<T> = { ok: true; nilai: T } | { ok: false; pesan: string };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Nama bidang form harga referensi: `harga_<komoditas>_<1..3>` (rupiah integer). */
export const namaHarga = (k: string, i: number) => `harga_${k}_${i}`;

/**
 * Validasi form terbit papan. Hanya memeriksa bentuk (Senin, 3 harga > 0 per komoditas);
 * median, buffer 10 persen, grade B, dan fee dihitung server, bukan di sini.
 */
export function parseTerbitPapan(f: FormData): Hasil<TerbitPapanRequest> {
  const uuid = String(f.get("uuid") ?? "");
  if (!UUID.test(uuid)) return { ok: false, pesan: "Permintaan tidak valid, muat ulang halaman." };
  const mulai = String(f.get("berlaku_mulai") ?? "");
  const d = new Date(mulai + "T00:00:00Z");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(mulai) || Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== mulai) {
    return { ok: false, pesan: "Tanggal berlaku tidak valid." };
  }
  if (d.getUTCDay() !== 1) return { ok: false, pesan: "Tanggal berlaku harus hari Senin." };
  const referensi: TerbitPapanRequest["referensi"] = [];
  for (const k of KOMODITAS_PILOT) {
    const harga: number[] = [];
    for (const i of [1, 2, 3]) {
      const raw = String(f.get(namaHarga(k, i)) ?? "").trim();
      if (!/^\d{1,9}$/.test(raw) || Number(raw) <= 0) {
        return { ok: false, pesan: `Harga referensi ${i} untuk ${k} harus rupiah bulat lebih dari 0.` };
      }
      harga.push(Number(raw));
    }
    referensi.push({ komoditas: k, harga: harga as [number, number, number] });
  }
  return { ok: true, nilai: { uuid, berlaku_mulai: mulai, referensi } };
}
