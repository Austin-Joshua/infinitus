import PageHeader from '@/components/layout/PageHeader';
import EventsSection from '@/components/sections/EventsSection';
import { getEvents } from '@/lib/events';
import { COPY, pageById } from '@/lib/site';
import { pageMetadata, breadcrumbJsonLd, absoluteUrl } from '@/lib/seo';
import { eventHref } from '@/lib/format';
import JsonLd from '@/components/seo/JsonLd';

export const revalidate = 60;

export const metadata = pageMetadata({
  title: COPY.pages.events.title,
  description: COPY.pages.events.description,
  path: '/events',
});

const breadcrumbs = breadcrumbJsonLd([
  { name: 'Home', path: '/' },
  { name: 'Events', path: '/events' },
]);

export default async function EventsPage() {
  const events = await getEvents();
  const page = pageById('events');

  const eventsJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'INFINITUS Mathematics Events & Workshops',
    description: 'Upcoming and conducted mathematics competitions, olympiads, and workshops at RIT Chennai.',
    itemListElement: events.slice(0, 15).map((ev, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: absoluteUrl(eventHref(ev)),
      name: ev.title,
    })),
  };

  return (
    <>
      <JsonLd data={breadcrumbs} />
      <JsonLd data={eventsJsonLd} />
      <PageHeader label={page.navLabel} title={COPY.events.heading} />
      <EventsSection events={events} />
    </>
  );
}
