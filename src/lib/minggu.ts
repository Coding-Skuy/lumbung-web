/** Minggu ISO 8601 `YYYY-Www` untuk tanggal tertentu (nilai bawaan filter; bukan hitungan bisnis). */
export function mingguIso(d: Date): string {
  const t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const hari = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - hari);
  const awal = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  const minggu = Math.ceil(((t.getTime() - awal.getTime()) / 86400000 + 1) / 7);
  return `${t.getUTCFullYear()}-W${String(minggu).padStart(2, "0")}`;
}

export const mingguIsoSekarang = () => mingguIso(new Date());
