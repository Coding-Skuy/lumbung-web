import { lumbung } from "$lib/server/lumbung";
import { petakanGalat, wajibArea } from "$lib/server/admin-halaman";
import { mingguValid } from "$lib/akses";
import { mingguIsoSekarang } from "$lib/minggu";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, url }) => {
  const token = wajibArea(locals.sesi, "invoice");
  const q = url.searchParams.get("minggu");
  const minggu = mingguValid(q) ? q : mingguIsoSekarang();
  try {
    return { minggu, invoice: await lumbung.adminInvoice(token, minggu) };
  } catch (e) {
    petakanGalat(e);
  }
};
