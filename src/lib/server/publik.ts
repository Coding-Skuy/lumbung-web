import type { PapanHarga, Profil } from "$lib/api/types";
import { ApiError, type LumbungClient } from "./lumbung-client";

export type HasilPapan = { status: "terbit"; papan: PapanHarga } | { status: "belum-terbit" };

/** 404 berarti papan minggu berjalan belum terbit (tanpa papan pengganti); galat lain dilempar ulang. */
export async function ambilPapanHarga(client: Pick<LumbungClient, "publikPapanHarga">): Promise<HasilPapan> {
  try {
    return { status: "terbit", papan: await client.publikPapanHarga() };
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return { status: "belum-terbit" };
    throw e;
  }
}

export async function ambilProfil(client: Pick<LumbungClient, "publikProfil">): Promise<Profil> {
  return client.publikProfil();
}
