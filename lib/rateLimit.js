/**
 * Rate Limiting for Next.js API Routes.
 *
 * Distributed Rate Limiting:
 * When UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN environment variables exist,
 * uses Upstash Redis (@upstash/ratelimit) with a sliding window across all serverless instances.
 *
 * Local/Fallback Limiting:
 * If Upstash Redis credentials are not configured, falls back to an in-memory Map
 * sliding-window limiter and logs once that rate limiting is best-effort.
 */

let upstashLimiter = null;
let loggedBestEffortWarning = false;

function logBestEffortNoticeOnce() {
  if (!loggedBestEffortWarning && process.env.NODE_ENV !== 'test') {
    loggedBestEffortWarning = true;
    console.warn(
      '[RateLimit] UPSTASH_REDIS_REST_URL / TOKEN not configured. Using in-memory fallback (best-effort across serverless instances).'
    );
  }
}

// In-memory sliding window cache for fallback/local operation
const ipRequests = new Map();

function inMemoryRateLimit(ip, limit, windowMs) {
  logBestEffortNoticeOnce();

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

  return {
    allowed: entry.count <= limit,
    remaining: entry.count > limit ? 0 : remaining,
    reset: resetSeconds,
  };
}

function getClientIp(request) {
  // NOTE: The first x-forwarded-for entry is trusted specifically because Vercel's edge network
  // and reverse proxy sanitize upstream headers and prepend the validated client IP.
  // Other hosting environments or reverse proxies (AWS ALB, Cloudflare, nginx) may require
  // reading headers like cf-connecting-ip, true-client-ip, or rightmost x-forwarded-for to prevent IP spoofing.
  const forwarded = request.headers?.get ? request.headers.get('x-forwarded-for') : request.headers?.['x-forwarded-for'];
  return (
    (forwarded ? (typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : forwarded[0]) : null) ||
    (request.headers?.get ? request.headers.get('x-real-ip') : request.headers?.['x-real-ip']) ||
    '127.0.0.1'
  );
}

/**
 * Checks whether the incoming request is within allowed rate limits.
 * Returns a thenable result compatible with both synchronous and asynchronous callers.
 */
export function checkRateLimit(request, { limit = 60, windowMs = 60 * 1000 } = {}) {
  const ip = getClientIp(request);

  const hasUpstash = Boolean(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  );

  if (hasUpstash) {
    return (async () => {
      try {
        if (!upstashLimiter) {
          const { Redis } = await import('@upstash/redis');
          const { Ratelimit } = await import('@upstash/ratelimit');
          const redis = new Redis({
            url: process.env.UPSTASH_REDIS_REST_URL,
            token: process.env.UPSTASH_REDIS_REST_TOKEN,
          });
          upstashLimiter = new Ratelimit({
            redis,
            limiter: Ratelimit.slidingWindow(limit, `${Math.ceil(windowMs / 1000)} s`),
            prefix: '@infinitus/ratelimit',
          });
        }

        const res = await upstashLimiter.limit(ip);
        return {
          allowed: res.success,
          remaining: res.remaining,
          reset: Math.max(1, Math.ceil((res.reset - Date.now()) / 1000)),
        };
      } catch (err) {
        console.error('[RateLimit Upstash Error]:', err);
        return inMemoryRateLimit(ip, limit, windowMs);
      }
    })();
  }

  // Synchronous in-memory fallback
  const syncResult = inMemoryRateLimit(ip, limit, windowMs);

  // Return thenable object that works both synchronously and with `await`
  return {
    ...syncResult,
    then(onFulfilled, onRejected) {
      return Promise.resolve(syncResult).then(onFulfilled, onRejected);
    },
  };
}

export function isDistributedRateLimitingEnabled() {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}
