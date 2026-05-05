/**
 * Lightweight in-process fixed-window rate limiter.
 * Works per-instance (no Redis). Adequate for Vercel serverless because
 * each function instance handles one request at a time.
 */
const windows = new Map<string, { count: number; reset: number }>();

export function rateLimit(key: string, limit: number, windowSec: number): boolean {
  const now = Date.now();
  const resetAt = now + windowSec * 1000;
  const entry = windows.get(key);

  if (!entry || now > entry.reset) {
    // Prune expired entries periodically to bound memory usage
    if (windows.size > 5000) {
      for (const [k, v] of windows) {
        if (now > v.reset) windows.delete(k);
      }
    }
    windows.set(key, { count: 1, reset: resetAt });
    return true;
  }

  if (entry.count >= limit) return false;
  entry.count++;
  return true;
}

export function rateLimitKey(req: Request, prefix: string): string {
  const forwarded = req.headers.get("x-forwarded-for") ?? "";
  const realIp = req.headers.get("x-real-ip") ?? "";
  const ip = forwarded.split(",")[0].trim() || realIp || "unknown";
  return `${prefix}:${ip}`;
}
