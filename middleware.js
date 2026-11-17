import { NextResponse } from 'next/server';

/**
 * Middleware for Infinitus API protection.
 *
 * Enforces:
 * 1. Method restriction: JSON 405 for methods other than GET, HEAD, OPTIONS
 * 2. Search engine disallow: X-Robots-Tag: noindex, nofollow on all /api/* routes
 * 3. Narrow matcher: ['/api/:path*']
 */
export function middleware(request) {
  const { pathname } = request.nextUrl;

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

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};
