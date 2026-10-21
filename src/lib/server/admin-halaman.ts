import { error, redirect } from "@sveltejs/kit";
import { boleh, bolehTulis, type AksiTulis, type AreaAdmin } from "$lib/akses";
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

/** Untuk form action: sesi + hak tulis; kembalikan token. */
export function wajibTulis(sesi: Sesi | undefined, aksi: AksiTulis): string {
  if (!sesi) throw redirect(303, "/admin/masuk");
  if (!bolehTulis(sesi.peran, aksi)) throw error(403, "Peran Anda tidak berhak melakukan aksi ini.");
  return sesi.token;
}

/** Galat backend pada aksi tulis -> pesan untuk form (status HTTP + teks). 401 diarahkan masuk ulang. */
export function galatTulis(e: unknown): { status: number; pesan: string } {
  if (e instanceof ApiError) {
    if (e.status === 401) throw redirect(303, "/admin/masuk");
    if (e.status === 403) return { status: 403, pesan: "Akses ditolak (tercatat di audit)." };
    if (e.status === 404) return { status: 404, pesan: "Data tidak ditemukan." };
    if (e.status === 409) return { status: 409, pesan: `Konflik: ${e.message}` };
    if (e.status === 422 || e.status === 400) return { status: 422, pesan: `Validasi gagal: ${e.message}` };
  }
  return { status: 502, pesan: "Layanan backend tidak tersedia, coba lagi." };
}
