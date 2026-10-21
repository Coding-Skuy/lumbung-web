import { describe, expect, test } from "bun:test";
import { MatchersV3, PactV3 } from "@pact-foundation/pact";
import { resolve } from "node:path";
import { ApiError, createLumbungClient } from "../../src/lib/server/lumbung-client";
import { ambilPapanHarga } from "../../src/lib/server/publik";

const { integer, string, regex } = MatchersV3;

/** Konsumen: klien server-side lumbung-web. Provider: lumbung-backend-service (openapi.yaml v1.0.0). */
const pact = new PactV3({
  consumer: "lumbung-web",
  provider: "lumbung-backend-service",
  dir: resolve(import.meta.dir, "../../pacts"),
  logLevel: "warn"
});

const clientDi = (baseUrl: string) => createLumbungClient({ baseUrl: `${baseUrl}/v1` });

describe("kontrak publik: GET /v1/publik/papan-harga", () => {
  test("papan terbit minggu berjalan", async () => {
    pact
      .given("papan harga minggu berjalan sudah terbit")
      .uponReceiving("permintaan papan harga publik")
      .withRequest({ method: "GET", path: "/v1/publik/papan-harga", headers: { Accept: "application/json" } })
      .willRespondWith({
        status: 200,
        headers: {
          "Content-Type": regex(/^application\/json/, "application/json"),
          "Cache-Control": "public, max-age=900"
        },
        body: {
          cabai: { a: integer(31500), b: integer(26500) },
          bawang: { a: integer(28000), b: integer(23500) },
          kangkung: { a: integer(6000), b: integer(5000) },
          fee: { dekat: 1500, jauh: 2500 },
          berlaku: string("2026-10-06 s.d. 2026-10-12")
        }
      });
    await pact.executeTest(async (mock) => {
      const hasil = await ambilPapanHarga(clientDi(mock.url));
      expect(hasil.status).toBe("terbit");
      if (hasil.status === "terbit") {
        expect(hasil.papan.fee).toEqual({ dekat: 1500, jauh: 2500 });
        expect(typeof hasil.papan.cabai.a).toBe("number");
      }
    });
  });

  test("papan minggu berjalan belum terbit (404)", async () => {
    pact
      .given("papan harga minggu berjalan belum terbit")
      .uponReceiving("permintaan papan harga publik sebelum terbit")
      .withRequest({ method: "GET", path: "/v1/publik/papan-harga", headers: { Accept: "application/json" } })
      .willRespondWith({
        status: 404,
        headers: { "Content-Type": regex(/^application\/json/, "application/json") },
        body: { error: string("tidak ditemukan") }
      });
    await pact.executeTest(async (mock) => {
      expect(await ambilPapanHarga(clientDi(mock.url))).toEqual({ status: "belum-terbit" });
    });
  });
});

describe("kontrak publik: GET /v1/publik/profil", () => {
  test("profil Lumbung", async () => {
    pact
      .given("profil Lumbung tersedia")
      .uponReceiving("permintaan profil publik")
      .withRequest({ method: "GET", path: "/v1/publik/profil", headers: { Accept: "application/json" } })
      .willRespondWith({
        status: 200,
        headers: { "Content-Type": regex(/^application\/json/, "application/json") },
        body: { nama: string("Lumbung"), deskripsi: string("Agregasi panen"), kontak_kemitraan: string("mitra@lumbung.id") }
      });
    await pact.executeTest(async (mock) => {
      const p = await clientDi(mock.url).publikProfil();
      expect(p.nama).toBe("Lumbung");
    });
  });

  test("galat server 500 menjadi ApiError", async () => {
    pact
      .given("basis data tidak tersedia")
      .uponReceiving("permintaan profil publik saat galat internal")
      .withRequest({ method: "GET", path: "/v1/publik/profil", headers: { Accept: "application/json" } })
      .willRespondWith({
        status: 500,
        headers: { "Content-Type": regex(/^application\/json/, "application/json") },
        body: { error: string("galat internal") }
      });
    await pact.executeTest(async (mock) => {
      const e = await clientDi(mock.url).publikProfil().catch((x) => x);
      expect(e).toBeInstanceOf(ApiError);
      expect(e.status).toBe(500);
    });
  });
});
