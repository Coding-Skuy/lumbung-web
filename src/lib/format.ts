/** Format tampilan saja (tanpa perhitungan bisnis): rupiah integer -> "Rp31.500". */
export function formatRupiah(n: number): string {
  return "Rp" + Math.trunc(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/** Tampilan berat: gram integer dari server -> "20,5 kg" (pemisahan satuan, bukan hitungan bisnis). */
export function formatKg(gram: number): string {
  const kg = gram / 1000;
  return kg.toLocaleString("id-ID", { maximumFractionDigits: 3 }) + " kg";
}
