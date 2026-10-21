import { env } from "$env/dynamic/private";
import { createLumbungClient } from "./lumbung-client";

/** Klien terpasang dari lingkungan server. `LUMBUNG_API_KEY` tidak pernah masuk bundel browser. */
export const lumbung = createLumbungClient({
  baseUrl: env.LUMBUNG_API_URL ?? "http://localhost:8080/v1",
  apiKey: env.LUMBUNG_API_KEY
});
