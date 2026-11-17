import { NextResponse } from 'next/server';
import { getEvents } from '@/lib/events';
import { createApiHandler } from '@/lib/apiHandler';

export const revalidate = 60;

export const GET = createApiHandler({
  handler: async (request) => {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    // Protect against arbitrary query parameters
    if (type && type !== 'upcoming' && type !== 'conducted') {
      return NextResponse.json(
        { error: 'Invalid type parameter. Expected "upcoming" or "conducted".' },
        { status: 400 }
      );
    }

    return await getEvents(type || undefined);
  },
});
