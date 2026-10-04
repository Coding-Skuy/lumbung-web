/** Konfigurasi SvelteKit stub untuk lumbung-web. */
const config = {
  kit: {
    // Adapter default; ganti ke adapter-node / adapter-static saat deploy.
    alias: {
      $lib: "./src/lib"
    }
  }
};

export default config;
