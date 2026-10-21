import { lumbung } from "$lib/server/lumbung";
import { petakanGalat, wajibArea } from "$lib/server/admin-halaman";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
  const token = wajibArea(locals.sesi, "insiden");
  try {
    return { insiden: await lumbung.adminInsiden(token) };
  } catch (e) {
    petakanGalat(e);
  }
};
