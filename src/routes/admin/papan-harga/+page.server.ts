import { fail } from "@sveltejs/kit";
import { KOMODITAS_PILOT } from "$lib/api/types";
import { lumbung } from "$lib/server/lumbung";
import { galatTulis, wajibArea, wajibTulis } from "$lib/server/admin-halaman";
import { parseTerbitPapan } from "$lib/server/tulis";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => {
  wajibArea(locals.sesi, "papan");
  // UUID klien dibuat saat halaman dimuat; kirim ulang form yang sama aman (idempotensi, 200 duplikat).
  return { uuid: crypto.randomUUID(), komoditas: [...KOMODITAS_PILOT] };
};

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const token = wajibTulis(locals.sesi, "terbit-papan");
    const f = await request.formData();
    const p = parseTerbitPapan(f);
    if (!p.ok) return fail(422, { pesan: p.pesan });
    try {
      const hasil = await lumbung.adminTerbitPapan(token, p.nilai);
      return { sukses: true as const, audit_id: hasil.audit_id, duplikat: hasil.duplikat === true };
    } catch (e) {
      const g = galatTulis(e);
      return fail(g.status, { pesan: g.pesan });
    }
  }
};
