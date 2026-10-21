import { redirect } from "@sveltejs/kit";
import { lumbung } from "$lib/server/lumbung";
import { COOKIE_TOKEN, hapusSesi } from "$lib/server/sesi";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ cookies }) => {
  const token = cookies.get(COOKIE_TOKEN);
  if (token) await lumbung.authKeluar(token).catch(() => undefined);
  hapusSesi(cookies);
  throw redirect(303, "/admin/masuk");
};
