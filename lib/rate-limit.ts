import { headers } from "next/headers";

/**
 * A small in-memory sliding window for the public write endpoints (booking
 * requests, contact messages). It is per server instance, so it resets on
 * redeploy and only partly helps on serverless - enough to stop a "hold enter"
 * flood without pulling in Redis. Swap `hits` for a shared store if needed;
 * the signature stays the same.
 */

type Window = { count: number; resetAt: number };

const hits = new Map<string, Window>();
const MAX_KEYS = 10_000;

export function rateLimit(key: string, limit: number, windowSeconds: number): { ok: boolean } {
  const now = Date.now();
  let entry = hits.get(key);
  if (!entry || entry.resetAt <= now) {
    entry = { count: 0, resetAt: now + windowSeconds * 1000 };
    hits.set(key, entry);
  }
  entry.count += 1;

  if (hits.size > MAX_KEYS) {
    for (const [k, v] of hits) if (v.resetAt <= now) hits.delete(k);
    if (hits.size > MAX_KEYS) {
      const oldest = hits.keys().next().value;
      if (oldest !== undefined) hits.delete(oldest);
    }
  }

  return { ok: entry.count <= limit };
}

/** Best-effort client IP from proxy headers; one shared bucket when there are none. */
export async function clientIp(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return h.get("x-real-ip")?.trim() || "unknown";
}
