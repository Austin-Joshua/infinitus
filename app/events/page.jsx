import PageHeader from '@/components/layout/PageHeader';
import EventsSection from '@/components/sections/EventsSection';
import { getEvents } from '@/lib/events';
import { COPY, pageById } from '@/lib/site';
import { pageMetadata, breadcrumbJsonLd } from '@/lib/seo';
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
  return (
    <>
      <JsonLd data={breadcrumbs} />
      <PageHeader label={page.navLabel} title={COPY.events.heading} intro={COPY.events.intro} />
      <EventsSection events={events} />
    </>
  );
}
