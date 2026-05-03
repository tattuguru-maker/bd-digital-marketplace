import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const BDT = new Intl.NumberFormat("en-BD", {
  style: "currency",
  currency: "BDT",
  maximumFractionDigits: 0,
});

export function formatBDT(amount: number) {
  return BDT.format(amount).replace("BDT", "৳").replace(/\s+/, "");
}

export function formatNumber(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return n.toString();
}

export function discountPercent(original: number, sale: number) {
  if (!original || sale >= original) return 0;
  return Math.round(((original - sale) / original) * 100);
}

/**
 * Convex server errors come wrapped in a noisy envelope like
 *   "[CONVEX M(admin:setUserRole)] [Request ID: …] Server Error
 *    Uncaught Error: <real message> at handler (…:line) Called by client"
 * Strip that down to just the thrown message for display.
 */
export function cleanConvexError(err: unknown, fallback = "Something went wrong."): string {
  const raw = err instanceof Error ? err.message : typeof err === "string" ? err : "";
  if (!raw) return fallback;
  const afterError = raw.split(/Uncaught Error:\s*/)[1] ?? raw;
  const beforeHandler = afterError.split(/\s*at handler\s*/)[0] ?? afterError;
  return beforeHandler.trim() || fallback;
}

export function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}
