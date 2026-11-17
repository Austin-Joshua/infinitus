import { NextResponse } from 'next/server';
import { getEvents } from '@/lib/events';

export const revalidate = 60;

export async function GET(request) {
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
