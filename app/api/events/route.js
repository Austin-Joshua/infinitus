import { NextResponse } from 'next/server';
import { getEvents } from '@/lib/events';
import { checkRateLimit } from '@/lib/rateLimit';

export const revalidate = 60;

export async function GET(request) {
  // Apply sliding-window rate limiting per IP (60 requests per minute)
  const rateLimit = checkRateLimit(request, { limit: 60, windowMs: 60 * 1000 });
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(rateLimit.reset),
          'X-RateLimit-Limit': '60',
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(rateLimit.reset),
        },
      }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    // Protect against arbitrary input values
    if (type && type !== 'upcoming' && type !== 'conducted') {
      return NextResponse.json(
        { error: 'Invalid type parameter. Expected "upcoming" or "conducted".' },
        { status: 400 }
      );
    }

    const events = await getEvents(type || undefined);
    return NextResponse.json(events, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        'X-Content-Type-Options': 'nosniff',
        'X-RateLimit-Limit': '60',
        'X-RateLimit-Remaining': String(rateLimit.remaining),
      },
    });
  } catch (error) {
    console.error('API /api/events error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST() {
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
}
