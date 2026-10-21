import { describe, expect, test } from "bun:test";
import { bolehTulis, areaUntuk } from "../src/lib/akses";
import { kgKeGram } from "../src/lib/satuan";
import { namaHarga, parseInvoiceId, parseStatusMitra, parseTerbitPapan } from "../src/lib/server/tulis";
import { ApiError, createLumbungClient } from "../src/lib/server/lumbung-client";

const U = "0f8a6c3e-5b2d-4c1a-9e47-3a1d2b6c7f90";
function form(o: Record<string, string>) {
  const f = new FormData();
  for (const [k, v] of Object.entries(o)) f.set(k, v);
  return f;
}
function formPapan(over: Record<string, string> = {}) {
  const o: Record<string, string> = { uuid: U, berlaku_mulai: "2026-10-12" };
  for (const k of ["cabai", "bawang", "kangkung"]) [1, 2, 3].forEach((i) => (o[namaHarga(k, i)] = String(10000 * i)));
  return form({ ...o, ...over });
}

describe("kg desimal -> gram integer", () => {
  test("contoh dari tiket: 20,5 kg = 20500 g", () => {
    expect(kgKeGram("20,5")).toBe(20500);
    expect(kgKeGram("20.5")).toBe(20500);
  });
  test("bulat dan 3 desimal", () => {
    expect(kgKeGram("3")).toBe(3000);
    expect(kgKeGram("0,001")).toBe(1);
    expect(kgKeGram(" 1,250 ")).toBe(1250);
  });
  test("tanpa galat floating point", () => {
    expect(kgKeGram("0,29")).toBe(290);
    expect(kgKeGram("1,1")).toBe(1100);
  });
  test("tolak tak valid", () => {
    for (const v of ["", "abc", "-1", "0", "0,0", "1,2345", "1,,2", "1e3"]) expect(kgKeGram(v)).toBeUndefined();
  });
});

describe("form terbit papan", () => {
  test("valid -> badan tanpa angka hitungan", () => {
    const r = parseTerbitPapan(formPapan());
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.nilai.referensi).toHaveLength(3);
      expect(r.nilai.referensi[0]).toEqual({ komoditas: "cabai", harga: [10000, 20000, 30000] });
      expect(Object.keys(r.nilai).sort()).toEqual(["berlaku_mulai", "referensi", "uuid"]);
    }
  });
  test("bukan Senin ditolak", () => {
    const r = parseTerbitPapan(formPapan({ berlaku_mulai: "2026-10-13" }));
    expect(r).toEqual({ ok: false, pesan: "Tanggal berlaku harus hari Senin." });
  });
  test("tanggal ngawur ditolak", () => {
    expect(parseTerbitPapan(formPapan({ berlaku_mulai: "2026-02-30" })).ok).toBe(false);
  });
  test("harga nol, desimal, atau kosong ditolak", () => {
    for (const v of ["0", "1,5", "", "-3"]) expect(parseTerbitPapan(formPapan({ [namaHarga("bawang", 2)]: v })).ok).toBe(false);
  });
  test("uuid wajib valid", () => {
    expect(parseTerbitPapan(formPapan({ uuid: "x" })).ok).toBe(false);
  });
});

test("form status mitra dan invoice", () => {
  expect(parseStatusMitra(form({ kode: "PTN-007", status: "NONAKTIF" }))).toEqual({ ok: true, nilai: { kode: "PTN-007", status: "NONAKTIF" } });
  expect(parseStatusMitra(form({ kode: "PTN-7", status: "AKTIF" })).ok).toBe(false);
  expect(parseStatusMitra(form({ kode: "PTN-007", status: "X" })).ok).toBe(false);
  expect(parseInvoiceId(form({ id: "INV-1" })).ok).toBe(true);
  expect(parseInvoiceId(form({ id: " " })).ok).toBe(false);
});

describe("hak tulis", () => {
  test("terbit papan dan status mitra hanya admin gudang", () => {
    expect(bolehTulis("admin_gudang", "terbit-papan")).toBe(true);
    expect(bolehTulis("admin_keuangan", "terbit-papan")).toBe(false);
    expect(bolehTulis("admin_keuangan", "mitra-status")).toBe(false);
  });
  test("invoice lunas: keuangan dan gudang; peran lain tidak", () => {
    expect(bolehTulis("admin_keuangan", "invoice-lunas")).toBe(true);
    expect(bolehTulis("sopir", "invoice-lunas")).toBe(false);
    expect(bolehTulis(undefined, "invoice-lunas")).toBe(false);
  });
  test("menu papan hanya admin gudang", () => {
    expect(areaUntuk("admin_gudang")).toContain("papan");
    expect(areaUntuk("admin_keuangan")).not.toContain("papan");
  });
});

describe("klien tulis", () => {
  function rec(status: number, body: unknown) {
    const seen: { url?: string; method?: string; body?: string; auth?: string | null } = {};
    const f = (async (u: URL, init?: RequestInit) => {
      seen.url = String(u);
      seen.method = init?.method;
      seen.body = init?.body as string | undefined;
      seen.auth = new Headers(init?.headers).get("authorization");
      return new Response(JSON.stringify(body), { status });
    }) as unknown as typeof fetch;
    return { seen, c: createLumbungClient({ baseUrl: "http://x/v1", fetch: f }) };
  }
  test("terbit papan POST dengan bearer", async () => {
    const { seen, c } = rec(201, { audit_id: "AUD-20261009-003" });
    const r = parseTerbitPapan(formPapan());
    if (!r.ok) throw new Error("form");
    expect(await c.adminTerbitPapan("T", r.nilai)).toEqual({ audit_id: "AUD-20261009-003" });
    expect(seen.method).toBe("POST");
    expect(seen.url).toBe("http://x/v1/admin/papan-harga");
    expect(seen.auth).toBe("Bearer T");
    expect(JSON.parse(seen.body!).uuid).toBe(U);
  });
  test("duplikat 200 membawa flag", async () => {
    const { c } = rec(200, { audit_id: "AUD-1", duplikat: true });
    const r = parseTerbitPapan(formPapan());
    if (!r.ok) throw new Error("form");
    expect((await c.adminTerbitPapan("T", r.nilai)).duplikat).toBe(true);
  });
  test("409 konflik menjadi ApiError", async () => {
    const { c } = rec(409, { error: "papan minggu ini sudah ada" });
    const r = parseTerbitPapan(formPapan());
    if (!r.ok) throw new Error("form");
    const e = await c.adminTerbitPapan("T", r.nilai).catch((x) => x);
    expect(e).toBeInstanceOf(ApiError);
    expect(e.status).toBe(409);
  });
  test("lunas dan status mitra: path ter-encode", async () => {
    const a = rec(200, { audit_id: "AUD-2" });
    await a.c.adminInvoiceLunas("T", "INV/1 x");
    expect(a.seen.url).toBe("http://x/v1/admin/invoice/INV%2F1%20x/lunas");
    const b = rec(200, { audit_id: "AUD-3" });
    await b.c.adminMitraStatus("T", "PTN-007", "NONAKTIF");
    expect(b.seen.url).toBe("http://x/v1/admin/mitra/PTN-007/status");
    expect(JSON.parse(b.seen.body!)).toEqual({ status: "NONAKTIF" });
  });
});
