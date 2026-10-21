// Deklarasi tipe global SvelteKit untuk lumbung-web.
import type { Sesi } from "$lib/server/sesi";

declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      /** Terisi di rute /admin/* oleh hooks.server.ts. */
      sesi?: Sesi;
    }
    // interface PageData {}
  }
}

export {};
