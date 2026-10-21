import { lumbung } from "$lib/server/lumbung";
import { fail } from "@sveltejs/kit";
import { galatTulis, petakanGalat, wajibArea, wajibTulis } from "$lib/server/admin-halaman";
import { parseInvoiceId } from "$lib/server/tulis";
import { mingguValid } from "$lib/akses";
import { mingguIsoSekarang } from "$lib/minggu";
import type { Actions, PageServerLoad } from "./$types";

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

export const actions: Actions = {
  lunas: async ({ request, locals }) => {
    const token = wajibTulis(locals.sesi, "invoice-lunas");
    const p = parseInvoiceId(await request.formData());
    if (!p.ok) return fail(422, { pesan: p.pesan });
    try {
      const hasil = await lumbung.adminInvoiceLunas(token, p.nilai);
      return { sukses: true as const, id: p.nilai, audit_id: hasil.audit_id };
    } catch (e) {
      const g = galatTulis(e);
      return fail(g.status, { pesan: g.pesan });
    }
  }
};
