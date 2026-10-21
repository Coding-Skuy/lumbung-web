import { bolehTulis } from "$lib/akses";
import { lumbung } from "$lib/server/lumbung";
import { fail } from "@sveltejs/kit";
import { galatTulis, petakanGalat, wajibArea, wajibTulis } from "$lib/server/admin-halaman";
import { parseStatusMitra } from "$lib/server/tulis";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
  const token = wajibArea(locals.sesi, "mitra");
  try {
    return { mitra: await lumbung.adminMitra(token), bisaUbah: bolehTulis(locals.sesi?.peran, "mitra-status") };
  } catch (e) {
    petakanGalat(e);
  }
};

export const actions: Actions = {
  status: async ({ request, locals }) => {
    const token = wajibTulis(locals.sesi, "mitra-status");
    const p = parseStatusMitra(await request.formData());
    if (!p.ok) return fail(422, { pesan: p.pesan });
    try {
      const hasil = await lumbung.adminMitraStatus(token, p.nilai.kode, p.nilai.status);
      return { sukses: true as const, kode: p.nilai.kode, status: p.nilai.status, audit_id: hasil.audit_id };
    } catch (e) {
      const g = galatTulis(e);
      return fail(g.status, { pesan: g.pesan });
    }
  }
};
