import Link from 'next/link';
import { notFound } from 'next/navigation';
import { EventPoster, ExternalArrow, eventHref } from '@/components/ui/EventCard';
import GalleryGrid from '@/components/ui/GalleryGrid';
import Reveal, { ClipReveal } from '@/components/ui/Reveal';
import SplitText from '@/components/ui/SplitText';
import JsonLd from '@/components/seo/JsonLd';
import { EVENTS } from '@/lib/data';
import { getEvent } from '@/lib/events';
import { formatEventDate } from '@/lib/format';
import { COPY, CLUB_NAME, SITE } from '@/lib/site';
import { pageMetadata, absoluteUrl } from '@/lib/seo';

export const revalidate = 60;

export function generateStaticParams() {
  return EVENTS.map((event) => ({ id: event.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const found = await getEvent(decodeURIComponent(id));
  if (!found) return {};
  const { event } = found;
  const description =
    event.description && event.description.length > 155
      ? `${event.description.slice(0, 152)}...`
      : event.description || `${event.title} organized by INFINITUS at Rajalakshmi Institute of Technology.`;

  return pageMetadata({
    title: event.title,
    description,
    path: `/events/${encodeURIComponent(event.id)}`,
    image: event.coverImageUrl || '/opengraph-image',
    imageAlt: `${event.title} poster`,
  });
}

function NeighbourLink({ event, label, align }) {
  if (!event) return <div />;
  return (
    <Link
      href={eventHref(event)}
      className={`group relative flex flex-col gap-2 overflow-hidden py-8 sm:py-12 ${
        align === 'right' ? 'items-end pl-6 text-right sm:pl-10' : 'pr-6 sm:pr-10'
      }`}
    >
      <span aria-hidden="true" className="absolute inset-0 origin-bottom scale-y-0 bg-fg/[0.04] transition-transform duration-500 ease-out group-hover:scale-y-100" />
      <span className="relative font-mono text-xs uppercase tracking-widest text-muted">
        {align === 'right' ? `${label} →` : `← ${label}`}
      </span>
      <span className="relative font-heading text-xl text-fg transition-colors group-hover:text-accent sm:text-3xl">{event.title}</span>
      <span className="relative font-mono text-xs text-accent">{formatEventDate(event.eventDate, event.endDate)}</span>
    </Link>
  );
}

export default async function EventPage({ params }) {
  const { id } = await params;
  const found = await getEvent(decodeURIComponent(id));
  if (!found) notFound();
  const { event, newer, older } = found;
  const isUpcoming = event.status === 'upcoming';
  const photos = event.images.map((src, i) => ({ src, width: 1080, height: 1350, caption: `${event.title} — photo ${i + 1}` }));

  const isOnline = Boolean(event.venue && event.venue.toLowerCase().includes('online'));
  const eventJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description: event.description,
    startDate: event.eventDate,
    endDate: event.endDate || event.eventDate,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: isOnline
      ? 'https://schema.org/OnlineEventAttendanceMode'
      : 'https://schema.org/OfflineEventAttendanceMode',
    location: isOnline
      ? {
          '@type': 'VirtualLocation',
          url: event.externalLink || SITE.url,
        }
      : {
          '@type': 'Place',
          name: event.venue || 'Rajalakshmi Institute of Technology',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Chennai',
            addressRegion: 'Tamil Nadu',
            addressCountry: 'IN',
            // TODO(owner): confirm from RIT website full campus street address and PIN code
          },
        },
    image: event.coverImageUrl ? absoluteUrl(event.coverImageUrl) : absoluteUrl('/opengraph-image'),
    url: absoluteUrl(`/events/${encodeURIComponent(event.id)}`),
    organizer: {
      '@type': 'Organization',
      name: CLUB_NAME,
      url: SITE.url,
    },
  };

  return (
    <>
      <article className="pb-24 pt-28 sm:pt-36">
        <JsonLd data={eventJsonLd} />
        <div className="container-x">
          <Link
            href="/events"
            className="inline-flex items-center gap-1.5 font-mono text-xs font-medium text-accent hover:underline"
          >
            ← Back to events
          </Link>

          <div className="mt-8 grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20 xl:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)]">
            <div className="lg:sticky lg:top-24 lg:self-start">
              <ClipReveal delay={0.2} className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-sunset-orange/40 bg-card/85 p-3 sm:p-4 flex items-center justify-center shadow-xl shadow-sunset-orange/15 backdrop-blur-md">
                <div className="relative h-full w-full overflow-hidden rounded-xl bg-bg">
                  <EventPoster
                    event={event}
                    priority
                    sizes="(min-width: 1280px) 35vw, (min-width: 1024px) 45vw, 100vw"
                    fit="contain"
                    className="h-full w-full"
                  />
                </div>
              </ClipReveal>
            </div>

            <div className="lg:pt-4">
              <Reveal className="flex flex-wrap gap-2">
                {isUpcoming && <span className="chip border-gold/40 text-gold">Upcoming</span>}
                {event.eventType && <span className="chip">{event.eventType}</span>}
              </Reveal>
              <SplitText
                as="h1"
                text={event.title}
                delay={0.1}
                className="mt-4 block font-heading text-3xl font-bold leading-tight tracking-tight text-fg sm:text-4xl lg:text-5xl"
              />

              <Reveal delay={0.3}>
                <dl className="card mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl p-4 sm:p-5">
                  <div>
                    <dt className="font-mono text-xs uppercase tracking-widest text-muted">Date</dt>
                    <dd className="mt-1 font-heading text-lg font-bold text-fg sm:text-xl">{formatEventDate(event.eventDate, event.endDate)}</dd>
                  </div>
                  {event.venue && (
                    <div className="border-t border-fg/10 pt-3 sm:border-t-0 sm:border-l sm:pl-4 sm:pt-0">
                      <dt className="font-mono text-xs uppercase tracking-widest text-muted">Venue</dt>
                      <dd className="mt-1 font-heading text-lg font-bold text-fg sm:text-xl">{event.venue}</dd>
                    </div>
                  )}
                </dl>

                {event.description && <p className="lede mt-8 max-w-2xl text-lg sm:text-xl">{event.description}</p>}

                {event.highlights?.length > 0 && (
                  <ul className="mt-8 flex flex-wrap gap-2">
                    {event.highlights.map((h) => (
                      <li key={h} className="chip">
                        {h}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-10 flex flex-wrap gap-3">
                  {isUpcoming && event.registrationFormUrl && (
                    <a href={event.registrationFormUrl} target="_blank" rel="noreferrer noopener" className="btn-primary">
                      {COPY.events.registerCta} <ExternalArrow />
                    </a>
                  )}
                  {event.externalLink && (
                    <a
                      href={event.externalLink}
                      target="_blank"
                      rel="noreferrer noopener"
                      className={isUpcoming && event.registrationFormUrl ? 'btn-ghost' : 'btn-primary'}
                    >
                      {COPY.events.viewPost} <ExternalArrow />
                    </a>
                  )}
                  <Link href="/events" className="btn-ghost">
                    <span aria-hidden="true">←</span> {COPY.events.backToEvents}
                  </Link>
                </div>
              </Reveal>
            </div>
          </div>

          {photos.length > 0 && (
            <div className="mt-24">
              <GalleryGrid photos={photos} />
            </div>
          )}
        </div>
      </article>

      {(newer || older) && (
        <nav aria-label="More events" className="border-t border-fg/15">
          <div className="container-x grid divide-y divide-fg/15 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
            <NeighbourLink event={newer} label={COPY.events.prevEvent} />
            <NeighbourLink event={older} label={COPY.events.nextEvent} align="right" />
          </div>
        </nav>
      )}
    </>
  );
}
