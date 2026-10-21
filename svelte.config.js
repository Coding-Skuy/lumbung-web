import adapter from "@sveltejs/adapter-node";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** Konfigurasi SvelteKit lumbung-web (SSR di VPS, ADR-0001). */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter(),
    alias: {
      $lib: "./src/lib"
    }
  }
};

export default config;
