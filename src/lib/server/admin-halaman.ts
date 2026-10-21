import { error, redirect } from "@sveltejs/kit";
import { boleh, type AreaAdmin } from "$lib/akses";
import { ApiError } from "./lumbung-client";
import type { Sesi } from "./sesi";

/** Tolak (403) bila peran tidak berhak atas area; kembalikan token untuk panggilan backend. */
export function wajibArea(sesi: Sesi | undefined, area: AreaAdmin): string {
  if (!sesi) throw redirect(303, "/admin/masuk");
  if (!boleh(sesi.peran, area)) throw error(403, "Peran Anda tidak berhak melihat halaman ini.");
  return sesi.token;
}

/** Petakan galat backend ke respons SvelteKit: 401 -> masuk ulang, 403 -> ditolak, lainnya 502. */
export function petakanGalat(e: unknown): never {
  if (e instanceof ApiError) {
    if (e.status === 401) throw redirect(303, "/admin/masuk");
    if (e.status === 403) throw error(403, "Akses ditolak.");
    if (e.status === 422) throw error(400, e.message);
  }
  throw error(502, "Layanan backend tidak tersedia.");
}
