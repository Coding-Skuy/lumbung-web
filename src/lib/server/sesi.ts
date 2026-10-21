import type { LumbungClient } from "./lumbung-client";
import { ApiError } from "./lumbung-client";
import type { Peran, TokenResponse } from "$lib/api/types";

export const COOKIE_TOKEN = "lmb_token";
export const COOKIE_REFRESH = "lmb_refresh";
export const COOKIE_PERAN = "lmb_peran";

const TUJUH_HARI_DETIK = 7 * 24 * 60 * 60;

export type Sesi = { token: string; peran: Peran };

type OpsiCookie = { path: string; httpOnly?: boolean; sameSite?: "lax" | "strict" | "none"; secure?: boolean; maxAge?: number };

export type CookieStore = {
  get(name: string): string | undefined;
  set(name: string, value: string, opts: OpsiCookie): void;
  delete(name: string, opts: OpsiCookie): void;
};

function opsi(secure: boolean, maxAge: number) {
  return { path: "/", httpOnly: true, sameSite: "lax" as const, secure, maxAge };
}

/** Simpan token dalam cookie httpOnly (tidak terbaca JS browser). Akses ikut umur JWT (15 mnt). */
export function simpanSesi(cookies: CookieStore, t: TokenResponse, secure: boolean, now = Date.now()) {
  const sisaDetik = Math.max(1, Math.floor((Date.parse(t.berlaku_sampai) - now) / 1000));
  cookies.set(COOKIE_TOKEN, t.token, opsi(secure, sisaDetik));
  cookies.set(COOKIE_REFRESH, t.refresh_token, opsi(secure, TUJUH_HARI_DETIK));
  cookies.set(COOKIE_PERAN, t.peran, opsi(secure, TUJUH_HARI_DETIK));
}

export function hapusSesi(cookies: CookieStore) {
  for (const n of [COOKIE_TOKEN, COOKIE_REFRESH, COOKIE_PERAN]) cookies.delete(n, { path: "/" });
}

/**
 * Pulihkan sesi dari cookie. Token akses habis -> refresh satu kali (rotasi refresh).
 * Gagal refresh (401/reuse) -> sesi dihapus dan `undefined` (wajib masuk ulang).
 */
export async function pulihkanSesi(
  cookies: CookieStore,
  client: Pick<LumbungClient, "authRefresh">,
  secure: boolean
): Promise<Sesi | undefined> {
  const token = cookies.get(COOKIE_TOKEN);
  const peran = cookies.get(COOKIE_PERAN) as Peran | undefined;
  if (token && peran) return { token, peran };
  const refresh = cookies.get(COOKIE_REFRESH);
  if (!refresh) return undefined;
  try {
    const t = await client.authRefresh(refresh);
    simpanSesi(cookies, t, secure);
    return { token: t.token, peran: t.peran };
  } catch (e) {
    if (e instanceof ApiError && e.status !== 0) hapusSesi(cookies);
    return undefined;
  }
}
