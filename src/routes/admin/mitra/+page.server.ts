import { lumbung } from "$lib/server/lumbung";
import { petakanGalat, wajibArea } from "$lib/server/admin-halaman";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
  const token = wajibArea(locals.sesi, "mitra");
  try {
    return { mitra: await lumbung.adminMitra(token) };
  } catch (e) {
    petakanGalat(e);
  }
};
