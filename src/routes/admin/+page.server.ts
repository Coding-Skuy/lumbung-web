import { redirect } from "@sveltejs/kit";
import { areaUntuk } from "$lib/akses";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => {
  const [pertama] = areaUntuk(locals.sesi?.peran);
  throw redirect(303, pertama ? `/admin/${pertama}` : "/admin/masuk");
};
