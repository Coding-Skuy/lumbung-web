/**
 * Konversi input kg desimal admin (koma atau titik, contoh "20,5") ke gram integer.
 * Dipakai server SvelteKit sebelum memanggil backend (AGENTS.md butir 9). Maksimal 3 desimal; gagal -> undefined.
 * Tanpa floating point agar tidak ada galat pembulatan.
 */
export function kgKeGram(input: string): number | undefined {
  const m = /^(\d{1,7})(?:[.,](\d{1,3}))?$/.exec(input.trim());
  if (!m) return undefined;
  const gram = Number(m[1]) * 1000 + Number((m[2] ?? "").padEnd(3, "0"));
  return gram > 0 ? gram : undefined;
}
