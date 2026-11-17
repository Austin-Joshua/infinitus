import { NextResponse } from 'next/server.js';
import { checkRateLimit } from './rateLimit.js';

/**
 * Higher-order API route wrapper that unifies:
 * - Rate limiting (Upstash Redis or in-memory fallback)
 * - Standard security & caching headers
 * - Uniform error responses with correct HTTP status codes
 * - Method & robots protection
 */
export function createApiHandler({
  handler,
  rateLimit = { limit: 60, windowMs: 60 * 1000 },
  cacheControl = 'public, s-maxage=60, stale-while-revalidate=120',
}) {
  return async function apiRouteHandler(request, context) {
    // 1. Sliding-window rate limiting per client IP
    const rl = await checkRateLimit(request, rateLimit);

    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(rl.reset),
            'X-RateLimit-Limit': String(rateLimit.limit),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(rl.reset),
            'X-Robots-Tag': 'noindex, nofollow',
            'X-Content-Type-Options': 'nosniff',
          },
        }
      );
    }

    try {
      // 2. Execute the route-specific business logic
      const result = await handler(request, context);

      // If handler returned a custom Response/NextResponse (e.g. 400 validation error), attach standard headers
      if (result instanceof Response) {
        result.headers.set('X-RateLimit-Limit', String(rateLimit.limit));
        result.headers.set('X-RateLimit-Remaining', String(rl.remaining));
        result.headers.set('X-Robots-Tag', 'noindex, nofollow');
        result.headers.set('X-Content-Type-Options', 'nosniff');
        return result;
      }

      // Return standardized JSON response
      return NextResponse.json(result, {
        status: 200,
        headers: {
          'Cache-Control': cacheControl,
          'X-Content-Type-Options': 'nosniff',
          'X-RateLimit-Limit': String(rateLimit.limit),
          'X-RateLimit-Remaining': String(rl.remaining),
          'X-Robots-Tag': 'noindex, nofollow',
        },
      });
    } catch (error) {
      console.error('[API Handler Error]:', error);
      return NextResponse.json(
        { error: 'Internal Server Error' },
        {
          status: 500,
          headers: {
            'X-Robots-Tag': 'noindex, nofollow',
            'X-Content-Type-Options': 'nosniff',
          },
        }
      );
    }
  };
}
