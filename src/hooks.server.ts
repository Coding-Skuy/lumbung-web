import { redirect, type Handle } from "@sveltejs/kit";
import { lumbung } from "$lib/server/lumbung";
import { pulihkanSesi } from "$lib/server/sesi";

/** Semua /admin/* (kecuali /admin/masuk) wajib sesi peran; token tidak pernah dikirim ke browser selain cookie httpOnly. */
export const handle: Handle = async ({ event, resolve }) => {
  const path = event.url.pathname;
  if (path.startsWith("/admin") && path !== "/admin/masuk") {
    const sesi = await pulihkanSesi(event.cookies, lumbung, event.url.protocol === "https:");
    if (!sesi) throw redirect(303, "/admin/masuk");
    event.locals.sesi = sesi;
  }
  const res = await resolve(event);
  if (path.startsWith("/admin")) res.headers.set("cache-control", "private, no-store");
  return res;
};
