import { CACHE_PUBLIK_MS, createTtlCache } from "$lib/server/ttl-cache";
import type { Profil } from "$lib/api/types";
import { lumbung } from "$lib/server/lumbung";
import { ambilProfil } from "$lib/server/publik";
import type { PageServerLoad } from "./$types";

const cache = createTtlCache<Profil>(CACHE_PUBLIK_MS);

export const load: PageServerLoad = async ({ setHeaders }) => {
  setHeaders({ "cache-control": "public, max-age=900" });
  return { profil: await cache.get(() => ambilProfil(lumbung)) };
};
