/**
 * Ukur latensi halaman web (p50/p95/maks) terhadap web yang sedang berjalan.
 * Jalankan: bun scripts/ukur-p95.ts  (env: WEB_URL, AKUN, PIN, N)
 * Target (produk/32): publik p95 < 600 ms, admin p95 < 1200 ms. Hanya baca; tidak menulis data.
 */
const WEB = process.env.WEB_URL ?? "http://localhost:3000";
const AKUN = process.env.AKUN ?? "OPR-SORTIR-1";
const PIN = process.env.PIN ?? "123456";
const N = Number(process.env.N ?? 200);

function persen(sorted: number[], p: number) {
  return sorted[Math.min(sorted.length - 1, Math.ceil((p / 100) * sorted.length) - 1)];
}

async function ukur(nama: string, path: string, targetMs: number, cookie?: string) {
  const t: number[] = [];
  let gagal = 0;
  for (let i = 0; i < N; i++) {
    const t0 = performance.now();
    const r = await fetch(WEB + path, { headers: cookie ? { cookie } : {}, redirect: "manual" });
    await r.arrayBuffer();
    t.push(performance.now() - t0);
    if (r.status !== 200) gagal++;
  }
  const s = [...t].sort((a, b) => a - b);
  const p95 = persen(s, 95);
  console.log(
    `${nama.padEnd(22)} n=${N} gagal=${gagal} pertama=${t[0].toFixed(1)}ms p50=${persen(s, 50).toFixed(1)}ms p95=${p95.toFixed(1)}ms maks=${s[s.length - 1].toFixed(1)}ms target<${targetMs}ms ${p95 < targetMs && gagal === 0 ? "LULUS" : "GAGAL"}`
  );
  return p95 < targetMs && gagal === 0;
}

async function masuk(): Promise<string> {
  const r = await fetch(`${WEB}/admin/masuk`, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded", origin: WEB },
    body: new URLSearchParams({ akun: AKUN, pin: PIN }),
    redirect: "manual"
  });
  const cookies = r.headers.getSetCookie().map((c) => c.split(";")[0]);
  if (!cookies.some((c) => c.startsWith("lmb_token="))) throw new Error(`login gagal (status ${r.status})`);
  return cookies.join("; ");
}

const cookie = await masuk();
const hari = new Date().toISOString().slice(0, 10);
const hasil = [
  await ukur("publik /papan-harga", "/papan-harga", 600),
  await ukur("publik /profil", "/profil", 600),
  await ukur("admin /rekap", `/admin/rekap?tanggal=${hari}`, 1200, cookie),
  await ukur("admin /invoice", "/admin/invoice", 1200, cookie),
  await ukur("admin /mitra", "/admin/mitra", 1200, cookie),
  await ukur("admin /insiden", "/admin/insiden", 1200, cookie)
];
process.exit(hasil.every(Boolean) ? 0 : 1);
