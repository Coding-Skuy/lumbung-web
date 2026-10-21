import type {
  Galat,
  Insiden,
  AuditHasil,
  Invoice,
  Mitra,
  PapanHarga,
  Profil,
  RekapHarian,
  StatusMitra,
  TerbitPapanRequest,
  TokenResponse
} from "$lib/api/types";

/** Galat dari backend (status HTTP + pesan baku `{error}`) atau jaringan (status 0). */
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export type ClientOptions = {
  /** Contoh: http://localhost:8080/v1 */
  baseUrl: string;
  /** `LUMBUNG_API_KEY`; hanya dari lingkungan server, dikirim sebagai `X-Service-Key`. */
  apiKey?: string;
  fetch?: typeof fetch;
};

export type RequestOptions = {
  method?: "GET" | "POST";
  /** Token akses sesi admin (bearer). */
  token?: string;
  body?: unknown;
  query?: Record<string, string | undefined>;
};

/** Klien HTTP server-side tipis ke lumbung-backend-service. Tidak pernah dipakai dari browser. */
export function createLumbungClient(opts: ClientOptions) {
  const doFetch = opts.fetch ?? fetch;
  const base = opts.baseUrl.replace(/\/+$/, "");

  async function request<T>(path: string, ro: RequestOptions = {}): Promise<T> {
    const url = new URL(base + path);
    for (const [k, v] of Object.entries(ro.query ?? {})) {
      if (v !== undefined) url.searchParams.set(k, v);
    }
    const headers: Record<string, string> = { accept: "application/json" };
    if (opts.apiKey) headers["x-service-key"] = opts.apiKey;
    if (ro.token) headers["authorization"] = `Bearer ${ro.token}`;
    if (ro.body !== undefined) headers["content-type"] = "application/json";

    let res: Response;
    try {
      res = await doFetch(url, {
        method: ro.method ?? "GET",
        headers,
        body: ro.body === undefined ? undefined : JSON.stringify(ro.body)
      });
    } catch {
      throw new ApiError(0, "backend tidak dapat dihubungi");
    }
    if (res.status === 204) return undefined as T;
    const text = await res.text();
    let json: unknown;
    try {
      json = text ? JSON.parse(text) : undefined;
    } catch {
      json = undefined;
    }
    if (!res.ok) {
      const msg = (json as Galat | undefined)?.error ?? `galat ${res.status}`;
      throw new ApiError(res.status, msg);
    }
    return json as T;
  }

  return {
    request,
    publikPapanHarga: () => request<PapanHarga>("/publik/papan-harga"),
    publikProfil: () => request<Profil>("/publik/profil"),
    authMasuk: (akun: string, pin: string) =>
      request<TokenResponse>("/auth/masuk", { method: "POST", body: { akun, pin } }),
    authRefresh: (refreshToken: string) =>
      request<TokenResponse>("/auth/refresh", { method: "POST", body: { refresh_token: refreshToken } }),
    authKeluar: (token: string) => request<void>("/auth/keluar", { method: "POST", token }),
    adminRekapHarian: (token: string, tanggal: string) =>
      request<RekapHarian>("/admin/rekap-harian", { token, query: { tanggal } }),
    adminInvoice: (token: string, minggu: string) =>
      request<{ data: Invoice[] }>("/admin/invoice", { token, query: { minggu } }).then((r) => r.data),
    adminMitra: (token: string) => request<{ data: Mitra[] }>("/admin/mitra", { token }).then((r) => r.data),
    adminTerbitPapan: (token: string, body: TerbitPapanRequest) =>
      request<AuditHasil>("/admin/papan-harga", { method: "POST", token, body }),
    adminInvoiceLunas: (token: string, id: string) =>
      request<AuditHasil>(`/admin/invoice/${encodeURIComponent(id)}/lunas`, { method: "POST", token }),
    adminMitraStatus: (token: string, kode: string, status: StatusMitra) =>
      request<AuditHasil>(`/admin/mitra/${encodeURIComponent(kode)}/status`, {
        method: "POST",
        token,
        body: { status }
      }),
    adminInsiden: (token: string) =>
      request<{ data: Insiden[] }>("/admin/insiden", { token }).then((r) => r.data)
  };
}

export type LumbungClient = ReturnType<typeof createLumbungClient>;
