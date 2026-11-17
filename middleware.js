import { NextResponse } from 'next/server';

/**
 * Middleware for Infinitus Web Application.
 *
 * Implements:
 * 1. Strict per-request CSP nonce generation ('self' 'nonce-<n>' 'strict-dynamic').
 * 2. Complete removal of 'unsafe-eval' in production (permitted strictly in development).
 * 3. Removal of 'unsafe-inline' from script-src.
 * 4. Narrowing of external image and connect origins (no unsplash, specific Supabase host).
 * 5. Method enforcement & X-Robots-Tag: noindex, nofollow for API routes (/api/*).
 */
export function middleware(request) {
  const { pathname } = request.nextUrl;

  // 1. API Route Protection
  if (pathname.startsWith('/api/')) {
    const method = request.method.toUpperCase();
    const allowedMethods = ['GET', 'HEAD', 'OPTIONS'];

    if (!allowedMethods.includes(method)) {
      return NextResponse.json(
        { error: 'Method Not Allowed' },
        {
          status: 405,
          headers: {
            'Allow': 'GET, HEAD, OPTIONS',
            'X-Robots-Tag': 'noindex, nofollow',
            'X-Content-Type-Options': 'nosniff',
          },
        }
      );
    }

    if (method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 204,
        headers: {
          'Allow': 'GET, HEAD, OPTIONS',
          'X-Robots-Tag': 'noindex, nofollow',
          'X-Content-Type-Options': 'nosniff',
        },
      });
    }

    const response = NextResponse.next();
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    return response;
  }

  // 2. Strict Per-Request CSP Nonce Generation for HTML Pages
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const isDev = process.env.NODE_ENV === 'development';

  const supabaseHost = process.env.SUPABASE_URL
    ? new URL(process.env.SUPABASE_URL).hostname
    : '*.supabase.co';

  // Strict CSP:
  // - script-src: 'self' 'nonce-<n>' 'strict-dynamic' (no unsafe-eval in prod, no unsafe-inline)
  // - style-src: 'self' 'unsafe-inline' (documented in SECURITY.md for Tailwind & Framer Motion)
  // - img-src: 'self' blob: data: https://${supabaseHost} (unsplash removed)
  // - connect-src: 'self' https://${supabaseHost}
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic' ${isDev ? "'unsafe-eval'" : ''};
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https://${supabaseHost};
    font-src 'self' data:;
    connect-src 'self' https://${supabaseHost};
    object-src 'none';
    base-uri 'self';
    form-action 'self' https://forms.gle https://docs.google.com;
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, ' ').trim();

  // Forward nonce in request headers for Server Components & RootLayout
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('content-security-policy', cspHeader);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Attach Content-Security-Policy to response
  response.headers.set('Content-Security-Policy', cspHeader);

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static chunks)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - static asset extensions (.svg, .png, .jpg, .jpeg, .gif, .webp, .ico, .woff, .woff2)
     */
    {
      source: '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2)$).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};
