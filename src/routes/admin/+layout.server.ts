import { areaUntuk } from "$lib/akses";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = ({ locals }) => ({
  peran: locals.sesi?.peran,
  area: locals.sesi ? [...areaUntuk(locals.sesi.peran)] : []
});
