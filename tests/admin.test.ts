import { describe, expect, test } from "bun:test";
import { areaUntuk, boleh, mingguValid, tanggalValid } from "../src/lib/akses";
import type { Peran, TokenResponse } from "../src/lib/api/types";
import { mingguIso } from "../src/lib/minggu";
import { formatKg } from "../src/lib/format";
import { ApiError, createLumbungClient } from "../src/lib/server/lumbung-client";
import { COOKIE_PERAN, COOKIE_REFRESH, COOKIE_TOKEN, pulihkanSesi, simpanSesi, type CookieStore } from "../src/lib/server/sesi";

function jar(init: Record<string, string> = {}) {
  const m = new Map(Object.entries(init));
  const sets: Record<string, { v: string; o: Record<string, unknown> }> = {};
  const c: CookieStore = {
    get: (n) => m.get(n),
    set: (n, v, o) => {
      m.set(n, v);
      sets[n] = { v, o: o as Record<string, unknown> };
    },
    delete: (n) => void m.delete(n)
  };
  return { c, m, sets };
}

const token = (peran: Peran = "admin_gudang"): TokenResponse => ({
  token: "T2",
  refresh_token: "R2",
  berlaku_sampai: new Date(Date.now() + 900_000).toISOString(),
  peran
});

describe("hak peran (FR-303)", () => {
  test("admin keuangan hanya rekap dan invoice", () => {
    expect(areaUntuk("admin_keuangan")).toEqual(["rekap", "invoice"]);
    expect(boleh("admin_keuangan", "mitra")).toBe(false);
    expect(boleh("admin_keuangan", "insiden")).toBe(false);
  });
  test("admin gudang semua area", () => {
    expect(areaUntuk("admin_gudang")).toHaveLength(4);
  });
  test("peran lain tanpa akses", () => {
    for (const p of ["sopir", "petani", "koordinator_tani", undefined]) expect(areaUntuk(p)).toEqual([]);
  });
});

describe("validasi query", () => {
  test("minggu ISO", () => {
    expect(mingguValid("2026-W41")).toBe(true);
    expect(mingguValid("2026-W54")).toBe(false);
    expect(mingguValid("2026-41")).toBe(false);
    expect(mingguValid(null)).toBe(false);
  });
  test("tanggal", () => {
    expect(tanggalValid("2026-10-10")).toBe(true);
    expect(tanggalValid("2026-02-30")).toBe(false);
    expect(tanggalValid("10-10-2026")).toBe(false);
  });
  test("mingguIso", () => {
    expect(mingguIso(new Date("2026-10-10T00:00:00Z"))).toBe("2026-W41");
    expect(mingguIso(new Date("2026-01-01T00:00:00Z"))).toBe("2026-W01");
  });
});

test("formatKg dari gram", () => {
  expect(formatKg(20500)).toBe("20,5 kg");
  expect(formatKg(1000)).toBe("1 kg");
});

describe("sesi", () => {
  test("simpanSesi: cookie httpOnly, umur akses mengikuti JWT", () => {
    const { c, sets } = jar();
    simpanSesi(c, token(), true);
    expect(sets[COOKIE_TOKEN].o.httpOnly).toBe(true);
    expect(sets[COOKIE_TOKEN].o.secure).toBe(true);
    expect(sets[COOKIE_TOKEN].o.maxAge as number).toBeLessThanOrEqual(900);
    expect(sets[COOKIE_REFRESH].o.maxAge).toBe(7 * 86400);
  });
  test("token masih ada: tanpa refresh", async () => {
    const { c } = jar({ [COOKIE_TOKEN]: "T", [COOKIE_PERAN]: "admin_keuangan" });
    const s = await pulihkanSesi(c, { authRefresh: async () => Promise.reject(new Error("tak boleh")) }, false);
    expect(s).toEqual({ token: "T", peran: "admin_keuangan" });
  });
  test("token habis, refresh sukses (rotasi)", async () => {
    const { c, m } = jar({ [COOKIE_REFRESH]: "R1" });
    const s = await pulihkanSesi(c, { authRefresh: async (r) => (r === "R1" ? token() : Promise.reject(new Error("x"))) }, false);
    expect(s).toEqual({ token: "T2", peran: "admin_gudang" });
    expect(m.get(COOKIE_REFRESH)).toBe("R2");
  });
  test("refresh ditolak 401: sesi dihapus", async () => {
    const { c, m } = jar({ [COOKIE_REFRESH]: "R1", [COOKIE_PERAN]: "admin_gudang" });
    const s = await pulihkanSesi(c, { authRefresh: async () => Promise.reject(new ApiError(401, "tidak sah")) }, false);
    expect(s).toBeUndefined();
    expect(m.size).toBe(0);
  });
  test("tanpa cookie: tidak ada sesi", async () => {
    const { c } = jar();
    expect(await pulihkanSesi(c, { authRefresh: async () => Promise.reject(new Error("x")) }, false)).toBeUndefined();
  });
});

describe("klien admin", () => {
  test("mengirim bearer + query dan membuka {data}", async () => {
    let seen: { url: string; h: Headers } | undefined;
    const f = (async (u: URL, init?: RequestInit) => {
      seen = { url: String(u), h: new Headers(init?.headers) };
      return new Response(JSON.stringify({ data: [{ id: "INV-1" }] }), { status: 200 });
    }) as unknown as typeof fetch;
    const c = createLumbungClient({ baseUrl: "http://x/v1", fetch: f });
    expect(await c.adminInvoice("TKN", "2026-W41")).toEqual([{ id: "INV-1" } as never]);
    expect(seen?.url).toBe("http://x/v1/admin/invoice?minggu=2026-W41");
    expect(seen?.h.get("authorization")).toBe("Bearer TKN");
  });
  test("403 menjadi ApiError 403", async () => {
    const f = (async () => new Response(JSON.stringify({ error: "akses ditolak" }), { status: 403 })) as unknown as typeof fetch;
    const e = await createLumbungClient({ baseUrl: "http://x/v1", fetch: f }).adminMitra("T").catch((x) => x);
    expect(e.status).toBe(403);
  });
  test("logout 204 tanpa badan", async () => {
    const f = (async () => new Response(null, { status: 204 })) as unknown as typeof fetch;
    expect(await createLumbungClient({ baseUrl: "http://x/v1", fetch: f }).authKeluar("T")).toBeUndefined();
  });
});
