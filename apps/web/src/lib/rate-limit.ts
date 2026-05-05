/**
 * Lightweight in-process rate limiter using a sliding window counter.
 * Works per-instance (no Redis). Adequate for Vercel serverless because
 * each function instance handles one request at a time.
 */
const windows = new Map<string, { count: number; reset: number }>();

export function rateLimit(key: string, limit: number, windowSec: number): boolean {
  const now = Date.now();
  const resetAt = now + windowSec * 1000;
  const entry = windows.get(key);

  if (!entry || now > entry.reset) {
    windows.set(key, { count: 1, reset: resetAt });
    return true; // allowed
  }

  if (entry.count >= limit) return false; // blocked

  entry.count++;
  return true; // allowed
}

export function rateLimitKey(req: Request, prefix: string): string {
  const forwarded = (req as any).headers?.get?.("x-forwarded-for") ?? "";
  const ip = forwarded.split(",")[0].trim() || "unknown";
  return `${prefix}:${ip}`;
}
