import { fail, redirect } from "@sveltejs/kit";
import { ApiError } from "$lib/server/lumbung-client";
import { lumbung } from "$lib/server/lumbung";
import { simpanSesi } from "$lib/server/sesi";
import { areaUntuk } from "$lib/akses";
import type { Actions } from "./$types";

export const actions: Actions = {
  default: async ({ request, cookies, url }) => {
    const f = await request.formData();
    const akun = String(f.get("akun") ?? "").trim();
    const pin = String(f.get("pin") ?? "");
    if (!akun || !/^\d{6}$/.test(pin)) return fail(422, { akun, pesan: "Akun wajib diisi dan PIN 6 digit." });
    try {
      const t = await lumbung.authMasuk(akun, pin);
      if (areaUntuk(t.peran).length === 0) {
        return fail(403, { akun, pesan: "Peran ini tidak memiliki akses dasbor admin." });
      }
      simpanSesi(cookies, t, url.protocol === "https:");
    } catch (e) {
      if (e instanceof ApiError && (e.status === 401 || e.status === 429)) {
        return fail(e.status, { akun, pesan: e.status === 429 ? e.message : "Akun atau PIN salah." });
      }
      return fail(502, { akun, pesan: "Layanan tidak tersedia, coba lagi." });
    }
    throw redirect(303, "/admin");
  }
};
