import {
  adminFetch,
  adminLogin,
  clearAdminAuth,
  isAdminAuthenticated,
  patchAdminAuth,
} from "@/lib/api";
import type { LoginInput, User } from "@/types";

function normalizeUser(raw: unknown, fallbackEmail: string): User {
  if (typeof raw === "object" && raw !== null && "email" in raw && "role" in raw) {
    const u = raw as Record<string, unknown>;
    return { email: String(u.email), role: String(u.role) };
  }
  return { email: fallbackEmail, role: "admin" };
}

export const authService = {
  async login(input: LoginInput): Promise<{ user: User }> {
    const data = await adminLogin(input.email, input.password);

    const user = normalizeUser(data.user, input.email);

    // Also store user profile for display
    localStorage.setItem("admin_user", JSON.stringify(user));

    return { user };
  },

  logout(): void {
    clearAdminAuth();
    localStorage.removeItem("admin_user");
  },

  getStoredUser(): User | null {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem("admin_user");
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
  },

  isAuthenticated(): boolean {
    return isAdminAuthenticated();
  },

  /** PATCH /admin/account/email — updates stored credentials and profile on success */
  async changeEmail(currentPassword: string, newEmail: string): Promise<{ message?: string; user: User }> {
    const data = (await adminFetch("/admin/account/email", {
      method: "PATCH",
      body: JSON.stringify({ currentPassword, newEmail }),
      redirectOnAuthFailure: false,
    })) as Record<string, unknown>;

    const user = normalizeUser(data.user, newEmail);
    patchAdminAuth({ email: user.email });
    localStorage.setItem("admin_user", JSON.stringify(user));

    return {
      message: typeof data.message === "string" ? data.message : undefined,
      user,
    };
  },

  /** PATCH /admin/account/password — updates stored password on success */
  async changePassword(currentPassword: string, newPassword: string): Promise<{ message?: string }> {
    const data = (await adminFetch("/admin/account/password", {
      method: "PATCH",
      body: JSON.stringify({ currentPassword, newPassword }),
      redirectOnAuthFailure: false,
    })) as Record<string, unknown>;

    patchAdminAuth({ password: newPassword });

    return {
      message: typeof data.message === "string" ? data.message : undefined,
    };
  },
};
