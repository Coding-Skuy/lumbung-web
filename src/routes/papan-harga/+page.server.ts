import { CACHE_PUBLIK_MS, createTtlCache } from "$lib/server/ttl-cache";
import { lumbung } from "$lib/server/lumbung";
import { ambilPapanHarga, type HasilPapan } from "$lib/server/publik";
import type { PageServerLoad } from "./$types";

const cache = createTtlCache<HasilPapan>(CACHE_PUBLIK_MS);

export const load: PageServerLoad = async ({ setHeaders }) => {
  setHeaders({ "cache-control": "public, max-age=900" });
  return { hasil: await cache.get(() => ambilPapanHarga(lumbung)) };
};
