import type { Check, Scan } from "./types";

export type LiveResult = Pick<Scan, "url" | "scannedAt" | "overall" | "checks">;

const MAX_URL = 2048;

export const parseTarget = (raw: unknown): string | null => {
  if (typeof raw !== "string") return null;
  const s = raw.trim();
  if (!s || s.length > MAX_URL || /\s/.test(s)) return null;
  try {
    const u = new URL(/^[a-z][a-z0-9+.-]*:\/\//i.test(s) ? s : `https://${s}`);
    if ((u.protocol !== "https:" && u.protocol !== "http:") || u.username || u.password || !u.hostname.includes(".")) return null;
    return u.origin + "/";
  } catch {
    return null;
  }
};

export const toLive = (r: { url: string; scannedAt: string; overall: number; checks: Check[] }): LiveResult => ({
  url: r.url,
  scannedAt: r.scannedAt,
  overall: r.overall,
  checks: r.checks.map(({ id, title, weight, status, score, reason, fix }) => ({ id, title, weight, status, score, reason, fix })),
});

export const asScan = (r: LiveResult): Scan => ({ ...r, slug: "yours", name: new URL(r.url).hostname, category: "yours" });

export const topFixes = (checks: Check[], n = 3): Check[] =>
  checks
    .filter((c) => c.fix && c.score !== null && c.score < 100)
    .toSorted((a, b) => b.weight * (100 - (b.score ?? 0)) - a.weight * (100 - (a.score ?? 0)))
    .slice(0, n);

export const rateLimiter = (limit: number, windowMs: number) => {
  const hits = new Map<string, number[]>();
  return (key: string, now = Date.now()): boolean => {
    const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
    if (recent.length >= limit) {
      hits.set(key, recent);
      return false;
    }
    hits.set(key, [...recent, now]);
    if (hits.size > 5000) hits.delete(hits.keys().next().value as string);
    return true;
  };
};
