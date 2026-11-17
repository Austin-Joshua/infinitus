/**
 * In-memory sliding-window rate limiter for Next.js API routes.
 * Tracks requests per IP address to mitigate abusive traffic, scraping, and DoS.
 */
const ipRequests = new Map();

/**
 * Checks whether the incoming request is within allowed rate limits.
 * Default: 60 requests per minute per IP.
 */
export function checkRateLimit(request, { limit = 60, windowMs = 60 * 1000 } = {}) {
  // Extract client IP from standard proxy headers
  const forwarded = request.headers.get('x-forwarded-for');
  const ip =
    (forwarded ? forwarded.split(',')[0].trim() : null) ||
    request.headers.get('x-real-ip') ||
    '127.0.0.1';

  const now = Date.now();
  const entry = ipRequests.get(ip) || { count: 0, resetAt: now + windowMs };

  if (now > entry.resetAt) {
    entry.count = 1;
    entry.resetAt = now + windowMs;
  } else {
    entry.count += 1;
  }

  ipRequests.set(ip, entry);

  // Periodic pruning if cache grows
  if (ipRequests.size > 2000) {
    for (const [k, v] of ipRequests.entries()) {
      if (now > v.resetAt) ipRequests.delete(k);
    }
  }

  const remaining = Math.max(0, limit - entry.count);
  const resetSeconds = Math.ceil((entry.resetAt - now) / 1000);

  if (entry.count > limit) {
    return {
      allowed: false,
      remaining: 0,
      reset: resetSeconds,
    };
  }

  return {
    allowed: true,
    remaining,
    reset: resetSeconds,
  };
}
