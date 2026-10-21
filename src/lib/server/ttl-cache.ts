/** Cache memori sederhana dengan TTL; jam dapat disuntik untuk uji. */
export function createTtlCache<T>(ttlMs: number, now: () => number = Date.now) {
  let entry: { at: number; value: T } | undefined;
  return {
    async get(load: () => Promise<T>): Promise<T> {
      if (entry && now() - entry.at < ttlMs) return entry.value;
      const value = await load();
      entry = { at: now(), value };
      return value;
    },
    clear() {
      entry = undefined;
    }
  };
}

/** Papan harga dan profil publik di-cache 15 menit (produk/32, ADR-0001 butir 4). */
export const CACHE_PUBLIK_MS = 15 * 60 * 1000;
