import { adminFetch, publicFetch } from "@/lib/api";
import type {
  Certificate,
  CreateCertificateInput,
  UpdateCertificateInput,
} from "@/types";

/** Normalize any response shape → Certificate[] */
function normalizeCerts(data: unknown): Certificate[] {
  if (Array.isArray(data)) return data as Certificate[];
  const d = data as Record<string, unknown>;
  if (Array.isArray(d?.data)) return d.data as Certificate[];
  if (Array.isArray(d?.certificates)) return d.certificates as Certificate[];
  return [];
}

/** Normalize any response shape → Certificate */
function normalizeCert(data: unknown): Certificate {
  const d = data as Record<string, unknown>;
  // Direct object with _id
  if (d?._id) return d as unknown as Certificate;
  // Wrapped in { data: ... }
  if (d?.data && typeof d.data === "object") {
    const inner = d.data as Record<string, unknown>;
    if (inner?._id) return inner as unknown as Certificate;
  }
  // Wrapped in { certificate: ... }
  if (d?.certificate && typeof d.certificate === "object") {
    const inner = d.certificate as Record<string, unknown>;
    if (inner?._id) return inner as unknown as Certificate;
  }
  throw new Error("Unexpected response format from server");
}

export const certificateService = {
  async getAll(): Promise<Certificate[]> {
    const data = await adminFetch("/certificates");
    return normalizeCerts(data);
  },

  /** Public — no admin auth needed. Searches by exact ref_no */
  async getByRef(refNo: string): Promise<Certificate> {
    const encoded = encodeURIComponent(refNo.trim());
    const data = await publicFetch(`/certificates/ref/${encoded}`);
    return normalizeCert(data);
  },

  async create(input: CreateCertificateInput): Promise<Certificate> {
    const data = await adminFetch("/certificates", {
      method: "POST",
      body: JSON.stringify(input),
    });
    return normalizeCert(data);
  },

  async update(id: string, input: UpdateCertificateInput): Promise<Certificate> {
    const data = await adminFetch(`/certificates/${id}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    });
    return normalizeCert(data);
  },

  async delete(id: string): Promise<void> {
    await adminFetch(`/certificates/${id}`, { method: "DELETE" });
  },
};
