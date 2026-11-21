import { getEvent } from '@/lib/events';
import { generateIcsContent } from '@/lib/calendar';

export async function GET(request, { params }) {
  const resolved = await params;
  const id = decodeURIComponent(resolved?.id || '');
  const found = await getEvent(id);

  if (!found || !found.event) {
    return new Response('Event not found', { status: 404 });
  }

  const icsData = generateIcsContent(found.event);

  return new Response(icsData, {
    status: 200,
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="${found.event.id}.ics"`,
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
