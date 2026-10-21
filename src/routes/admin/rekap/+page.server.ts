import { lumbung } from "$lib/server/lumbung";
import { petakanGalat, wajibArea } from "$lib/server/admin-halaman";
import { tanggalValid } from "$lib/akses";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, url }) => {
  const token = wajibArea(locals.sesi, "rekap");
  const q = url.searchParams.get("tanggal");
  const tanggal = tanggalValid(q) ? q : new Date().toISOString().slice(0, 10);
  try {
    return { tanggal, rekap: await lumbung.adminRekapHarian(token, tanggal) };
  } catch (e) {
    petakanGalat(e);
  }
};
