import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr?: string): string {
  if (!dateStr) return "N/A";
  try {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

/** Issue-style date: `09/01/2017` (MM/DD/YYYY). Uses the calendar date from ISO `YYYY-MM-DD` when present. */
export function formatDateMDY(dateStr?: string): string {
  if (!dateStr) return "N/A";
  const dayPart = dateStr.split("T")[0] ?? "";
  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dayPart);
  if (iso) {
    const [, y, m, d] = iso;
    return `${m}/${d}/${y}`;
  }
  try {
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;
    return `${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}/${d.getFullYear()}`;
  } catch {
    return dateStr;
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "object" && error !== null) {
    const e = error as Record<string, unknown>;
    if (typeof e.message === "string") return e.message;
    const nested = e.response as Record<string, unknown> | undefined;
    if (typeof nested?.data === "object" && nested.data !== null) {
      const data = nested.data as Record<string, unknown>;
      if (typeof data.message === "string") return data.message;
    }
  }
  if (typeof error === "string") return error;
  return "An unexpected error occurred. Please try again.";
}
