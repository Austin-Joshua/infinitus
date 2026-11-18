import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rateLimit';
import { validateErrorReportPayload } from '@/lib/reportError';

function isSameOrigin(request) {
  const secFetchSite = request.headers.get('sec-fetch-site');
  if (secFetchSite && secFetchSite !== 'same-origin') {
    return false;
  }

  const origin = request.headers.get('origin');
  if (origin) {
    try {
      const originHost = new URL(origin).host;
      const requestHost = request.headers.get('host') || request.nextUrl.host;
      if (originHost !== requestHost) {
        return false;
      }
    } catch {
      return false;
    }
  }

  return true;
}

export async function POST(request) {
  // 1. Same-Origin Validation (Reject cross-origin callers)
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: 'Cross-origin requests forbidden' }, { status: 403 });
  }

  // 2. Body size guard via Content-Length header
  const contentLength = request.headers.get('content-length');
  if (contentLength && parseInt(contentLength, 10) > 1024) {
    return NextResponse.json({ error: 'Payload Too Large' }, { status: 413 });
  }

  // 3. Global flood limit: 300 reports per hour across all clients
  const globalRate = await checkRateLimit(request, {
    key: 'global-error-report',
    limit: 300,
    windowMs: 60 * 60 * 1000,
  });
  if (!globalRate.allowed) {
    return NextResponse.json(
      { error: 'Global Rate Limit Exceeded' },
      {
        status: 429,
        headers: {
          'Retry-After': String(globalRate.reset),
          'X-RateLimit-Limit': '300',
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(globalRate.reset),
        },
      }
    );
  }

  // 4. Per-IP rate limiting: 10 reports per minute per client IP
  const ipRate = await checkRateLimit(request, { limit: 10, windowMs: 60 * 1000 });
  if (!ipRate.allowed) {
    return NextResponse.json(
      { error: 'Too Many Requests' },
      {
        status: 429,
        headers: {
          'Retry-After': String(ipRate.reset),
          'X-RateLimit-Limit': '10',
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(ipRate.reset),
        },
      }
    );
  }

  // 5. Read body as text with size limit
  let rawText = '';
  try {
    rawText = await request.text();
  } catch {
    return NextResponse.json({ error: 'Unable to read request body' }, { status: 400 });
  }

  if (rawText.length > 1024 || Buffer.byteLength(rawText, 'utf8') > 1024) {
    return NextResponse.json({ error: 'Payload Too Large' }, { status: 413 });
  }

  if (!rawText || rawText.trim().length === 0) {
    return NextResponse.json({ error: 'Empty payload' }, { status: 400 });
  }

  // 6. JSON Parse & Strict Format Validation
  let body;
  try {
    body = JSON.parse(rawText);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const validation = validateErrorReportPayload(body);
  if (!validation.valid) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  // 7. Emit structured single-line log for Vercel runtime telemetry
  // No personal data, cookies, IP, or stack traces are logged
  console.error(
    '[client-error]',
    JSON.stringify({
      digest: validation.data.digest,
      route: validation.data.route,
      kind: validation.data.kind,
      t: Date.now(),
    })
  );

  // 8. Return 204 No Content
  return new NextResponse(null, {
    status: 204,
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  });
}
