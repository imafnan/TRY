// All requests go through Next.js proxy routes to avoid CORS issues.
// /api/login     → POST  https://client-certificate.onrender.com/login
// /api/proxy/*   → any   https://client-certificate.onrender.com/*

export async function adminLogin(email: string, password: string) {
  let response: Response;
  try {
    response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  } catch {
    throw new Error("Network error — cannot reach server. Check your connection.");
  }

  let data: Record<string, unknown>;
  try {
    data = await response.json();
  } catch {
    throw new Error("Invalid response from server.");
  }

  if (!response.ok) {
    throw new Error((data.message as string) || "Invalid email or password");
  }

  // Save credentials — sent as x-admin-email / x-admin-password on every protected request
  localStorage.setItem("admin_auth", JSON.stringify({ email, password }));
  return data;
}

export function getAdminHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const raw = localStorage.getItem("admin_auth");
  if (!raw) throw new Error("Not authenticated");
  const { email, password } = JSON.parse(raw);
  return {
    "x-admin-email": email,
    "x-admin-password": password,
    "Content-Type": "application/json",
  };
}

/** Auth headers only — use with FormData so the browser sets multipart boundaries. */
export function getAdminAuthHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const raw = localStorage.getItem("admin_auth");
  if (!raw) throw new Error("Not authenticated");
  const { email, password } = JSON.parse(raw);
  return {
    "x-admin-email": email,
    "x-admin-password": password,
  };
}

export type AdminFetchOptions = RequestInit & {
  /** When false, 401/403 do not clear session or redirect (e.g. wrong current password on account forms). Default true. */
  redirectOnAuthFailure?: boolean;
};

export function patchAdminAuth(partial: { email?: string; password?: string }): void {
  if (typeof window === "undefined") return;
  const raw = localStorage.getItem("admin_auth");
  if (!raw) return;
  try {
    const auth = JSON.parse(raw) as { email: string; password: string };
    localStorage.setItem(
      "admin_auth",
      JSON.stringify({
        email: partial.email ?? auth.email,
        password: partial.password ?? auth.password,
      })
    );
  } catch {
    /* ignore */
  }
}

export async function adminFetch(
  endpoint: string,
  options: AdminFetchOptions = {}
): Promise<unknown> {
  const { redirectOnAuthFailure = true, ...fetchOptions } = options;

  let headers: Record<string, string>;
  try {
    headers = getAdminHeaders();
  } catch {
    if (typeof window !== "undefined") window.location.href = "/login";
    throw new Error("Not authenticated");
  }

  let response: Response;
  try {
    response = await fetch(`/api/proxy${endpoint}`, {
      ...fetchOptions,
      headers: {
        ...headers,
        ...(fetchOptions.headers as Record<string, string> || {}),
      },
    });
  } catch {
    throw new Error("Network error — cannot reach server.");
  }

  // Handle 401/403 — optionally clear auth and redirect (not for “wrong current password” flows)
  if (response.status === 401 || response.status === 403) {
    let errBody: unknown;
    try {
      errBody = await response.json();
    } catch {
      errBody = null;
    }
    const msg =
      typeof (errBody as Record<string, unknown> | null)?.message === "string"
        ? String((errBody as Record<string, unknown>).message)
        : response.status === 401
          ? "Unauthorized"
          : "Forbidden";

    if (redirectOnAuthFailure) {
      localStorage.removeItem("admin_auth");
      if (typeof window !== "undefined") window.location.href = "/login";
      throw new Error("Session expired. Please log in again.");
    }
    throw new Error(msg);
  }

  // Handle no-content responses
  if (response.status === 204 || response.headers.get("content-length") === "0") {
    return { success: true };
  }

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    if (!response.ok) throw new Error(`Server error: ${response.status}`);
    return { success: true };
  }

  if (!response.ok) {
    const msg = (data as Record<string, unknown>)?.message;
    throw new Error(typeof msg === "string" ? msg : `Request failed (${response.status})`);
  }

  return data;
}

export type AdminFormDataOptions = {
  method: "POST" | "PATCH";
  redirectOnAuthFailure?: boolean;
};

/** Multipart upload — field name must match API (e.g. `image`). Do not set Content-Type manually. */
export async function adminFetchFormData(
  endpoint: string,
  formData: FormData,
  options: AdminFormDataOptions = { method: "POST" }
): Promise<unknown> {
  const { method, redirectOnAuthFailure = true } = options;

  let headers: Record<string, string>;
  try {
    headers = getAdminAuthHeaders();
  } catch {
    if (typeof window !== "undefined") window.location.href = "/login";
    throw new Error("Not authenticated");
  }

  let response: Response;
  try {
    response = await fetch(`/api/proxy${endpoint}`, {
      method,
      headers,
      body: formData,
    });
  } catch {
    throw new Error("Network error — cannot reach server.");
  }

  if (response.status === 401 || response.status === 403) {
    let errBody: unknown;
    try {
      errBody = await response.json();
    } catch {
      errBody = null;
    }
    const msg =
      typeof (errBody as Record<string, unknown> | null)?.message === "string"
        ? String((errBody as Record<string, unknown>).message)
        : response.status === 401
          ? "Unauthorized"
          : "Forbidden";

    if (redirectOnAuthFailure) {
      localStorage.removeItem("admin_auth");
      if (typeof window !== "undefined") window.location.href = "/login";
      throw new Error("Session expired. Please log in again.");
    }
    throw new Error(msg);
  }

  if (response.status === 204 || response.headers.get("content-length") === "0") {
    return { success: true };
  }

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    if (!response.ok) throw new Error(`Server error: ${response.status}`);
    return { success: true };
  }

  if (!response.ok) {
    const msg = (data as Record<string, unknown>)?.message;
    throw new Error(typeof msg === "string" ? msg : `Request failed (${response.status})`);
  }

  return data;
}

/** Public JSON GET with generic errors (not certificate-specific). */
export async function publicApiGet(endpoint: string): Promise<unknown> {
  let response: Response;
  try {
    response = await fetch(`/api/proxy${endpoint}`);
  } catch {
    throw new Error("Network error — cannot reach server.");
  }

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    throw new Error("Invalid response from server.");
  }

  if (!response.ok) {
    const msg = (data as Record<string, unknown>)?.message;
    throw new Error(typeof msg === "string" ? msg : `Request failed (${response.status})`);
  }

  return data;
}

export async function publicFetch(endpoint: string): Promise<unknown> {
  let response: Response;
  try {
    response = await fetch(`/api/proxy${endpoint}`);
  } catch {
    throw new Error("Network error — cannot reach server.");
  }

  if (response.status === 404) {
    throw new Error("Certificate not found. Please check the Ref ID.");
  }

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    throw new Error("Invalid response from server.");
  }

  if (!response.ok) {
    const msg = (data as Record<string, unknown>)?.message;
    throw new Error(typeof msg === "string" ? msg : "Certificate not found.");
  }

  return data;
}

export function isAdminAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("admin_auth");
}

export function clearAdminAuth(): void {
  localStorage.removeItem("admin_auth");
}

