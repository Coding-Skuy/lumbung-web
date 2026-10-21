/** Format tampilan saja (tanpa perhitungan bisnis): rupiah integer -> "Rp31.500". */
export function formatRupiah(n: number): string {
  return "Rp" + Math.trunc(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
