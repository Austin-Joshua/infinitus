import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rateLimit';

export async function POST(request) {
  // 1. Rate limiting: 10 reports per minute per client IP
  const rate = await checkRateLimit(request, { limit: 10, windowMs: 60 * 1000 });
  if (!rate.allowed) {
    return NextResponse.json(
      { error: 'Too Many Requests' },
      {
        status: 429,
        headers: {
          'Retry-After': String(rate.reset),
          'X-RateLimit-Limit': '10',
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(rate.reset),
        },
      }
    );
  }

  // 2. Strict JSON payload validation
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return NextResponse.json({ error: 'Malformed payload' }, { status: 400 });
  }

  const { digest, route, kind } = body;

  // Validate kind
  if (kind !== 'route' && kind !== 'global') {
    return NextResponse.json({ error: 'Invalid error kind' }, { status: 400 });
  }

  // Validate route
  if (typeof route !== 'string' || route.length === 0 || route.length > 200) {
    return NextResponse.json({ error: 'Invalid route parameter' }, { status: 400 });
  }

  // Validate digest (optional, but if present must be string <= 200 chars)
  if (digest !== undefined && digest !== null && (typeof digest !== 'string' || digest.length > 200)) {
    return NextResponse.json({ error: 'Invalid digest parameter' }, { status: 400 });
  }

  // 3. Emit structured single-line log for Vercel runtime telemetry
  // No personal data, cookies, IP, or stack traces are logged
  console.error(
    '[client-error]',
    JSON.stringify({
      digest: digest || null,
      route,
      kind,
      t: Date.now(),
    })
  );

  // 4. Return 204 No Content
  return new NextResponse(null, {
    status: 204,
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  });
}
