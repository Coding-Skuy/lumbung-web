import { describe, expect, test } from "bun:test";
import { ApiError, createLumbungClient } from "../src/lib/server/lumbung-client";
import { ambilPapanHarga } from "../src/lib/server/publik";
import { createTtlCache } from "../src/lib/server/ttl-cache";
import { formatRupiah } from "../src/lib/format";

const papan = {
  cabai: { a: 31500, b: 26500 },
  bawang: { a: 28000, b: 23500 },
  kangkung: { a: 6000, b: 5000 },
  fee: { dekat: 1500, jauh: 2500 },
  berlaku: "2026-10-06 s.d. 2026-10-12"
};

function fakeFetch(status: number, body: unknown, seen: { url?: string; headers?: Headers } = {}) {
  return (async (url: URL, init?: RequestInit) => {
    seen.url = String(url);
    seen.headers = new Headers(init?.headers);
    return new Response(JSON.stringify(body), { status });
  }) as unknown as typeof fetch;
}

describe("klien Lumbung", () => {
  test("memanggil /publik/papan-harga dengan X-Service-Key", async () => {
    const seen: { url?: string; headers?: Headers } = {};
    const c = createLumbungClient({ baseUrl: "http://x/v1/", apiKey: "k", fetch: fakeFetch(200, papan, seen) });
    expect(await c.publikPapanHarga()).toEqual(papan);
    expect(seen.url).toBe("http://x/v1/publik/papan-harga");
    expect(seen.headers?.get("x-service-key")).toBe("k");
  });

  test("galat baku menjadi ApiError", async () => {
    const c = createLumbungClient({ baseUrl: "http://x/v1", fetch: fakeFetch(500, { error: "boom" }) });
    const e = await c.publikProfil().catch((x) => x);
    expect(e).toBeInstanceOf(ApiError);
    expect(e.status).toBe(500);
    expect(e.message).toBe("boom");
  });

  test("jaringan putus menjadi ApiError status 0", async () => {
    const f = (async () => {
      throw new Error("down");
    }) as unknown as typeof fetch;
    const e = await createLumbungClient({ baseUrl: "http://x/v1", fetch: f }).publikProfil().catch((x) => x);
    expect(e.status).toBe(0);
  });
});

describe("papan harga publik", () => {
  test("terbit", async () => {
    const c = createLumbungClient({ baseUrl: "http://x/v1", fetch: fakeFetch(200, papan) });
    expect(await ambilPapanHarga(c)).toEqual({ status: "terbit", papan });
  });
  test("404 = belum terbit", async () => {
    const c = createLumbungClient({ baseUrl: "http://x/v1", fetch: fakeFetch(404, { error: "tidak ditemukan" }) });
    expect(await ambilPapanHarga(c)).toEqual({ status: "belum-terbit" });
  });
  test("galat lain dilempar", async () => {
    const c = createLumbungClient({ baseUrl: "http://x/v1", fetch: fakeFetch(500, { error: "x" }) });
    await expect(ambilPapanHarga(c)).rejects.toBeInstanceOf(ApiError);
  });
});

describe("cache TTL", () => {
  test("memakai ulang dalam TTL, memuat ulang setelahnya", async () => {
    let t = 0;
    let n = 0;
    const cache = createTtlCache<number>(900_000, () => t);
    const load = async () => ++n;
    expect(await cache.get(load)).toBe(1);
    t = 899_999;
    expect(await cache.get(load)).toBe(1);
    t = 900_000;
    expect(await cache.get(load)).toBe(2);
  });
});

test("formatRupiah", () => {
  expect(formatRupiah(31500)).toBe("Rp31.500");
  expect(formatRupiah(600)).toBe("Rp600");
  expect(formatRupiah(1234567)).toBe("Rp1.234.567");
});
