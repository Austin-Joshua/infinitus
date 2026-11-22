import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ExternalArrow, eventHref } from '@/components/ui/EventCard';
import EventHeroPoster from '@/components/ui/EventHeroPoster';
import GalleryGrid from '@/components/ui/GalleryGrid';
import JsonLd from '@/components/seo/JsonLd';
import AddToCalendarMenu from '@/components/ui/AddToCalendarMenu';
import { EVENTS } from '@/lib/data';
import { getEvent } from '@/lib/events';
import { formatEventDate } from '@/lib/format';
import { COPY, CLUB_NAME, SITE } from '@/lib/site';
import { pageMetadata, absoluteUrl, breadcrumbJsonLd } from '@/lib/seo';

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
    image: `/events/${encodeURIComponent(event.id)}/opengraph-image`,
    imageAlt: `${event.title} official event card`,
  });
}

function NeighbourLink({ event, label, align }) {
  if (!event) return <div />;
  return (
    <Link
      href={eventHref(event)}
      prefetch={true}
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
  const hasOnlineForm = Boolean(event.registrationFormUrl);
  const formattedDate = formatEventDate(event.eventDate, event.endDate);
  const photos = (event.images || []).map((src, i) => ({
    src,
    width: 1080,
    height: 1350,
    caption: `${event.title} — Photo ${i + 1}`,
    alt: `${event.title} event photograph ${i + 1}`,
    date: formattedDate,
  }));
  const allPhotos = [
    ...(event.coverImageUrl
      ? [
          {
            src: event.coverImageUrl,
            width: 1080,
            height: 1350,
            caption: `${event.title} — Official Poster`,
            date: formattedDate,
          },
        ]
      : []),
    ...photos,
  ];

  const isOnline = Boolean(
    event.venue &&
      (event.venue.toLowerCase().includes('online') || event.venue.toLowerCase().includes('virtual'))
  );

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
          ...(SITE.address ? { address: SITE.address } : {}),
        },
    image: event.coverImageUrl ? absoluteUrl(event.coverImageUrl) : absoluteUrl('/opengraph-image'),
    url: absoluteUrl(`/events/${encodeURIComponent(event.id)}`),
    organizer: {
      '@type': 'Organization',
      name: CLUB_NAME,
      url: SITE.url,
    },
  };

  const breadcrumbs = breadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Events', path: '/events' },
    { name: event.title, path: `/events/${encodeURIComponent(event.id)}` },
  ]);

  return (
    <>
      <article className="pb-16 pt-20 sm:pt-28">
        <JsonLd data={eventJsonLd} />
        <JsonLd data={breadcrumbs} />
        <div className="container-x">
          <Link
            href="/events"
            prefetch={true}
            className="inline-flex items-center gap-1.5 font-mono text-xs font-medium text-accent hover:underline"
          >
            ← Back to events
          </Link>

          <div className="mt-8 grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20 xl:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)]">
            <div className="lg:sticky lg:top-24 lg:self-start">
              <div className="relative aspect-[1/1.414] w-full max-w-md mx-auto">
                <EventHeroPoster event={event} allPhotos={allPhotos} />
              </div>
            </div>

            <div className="lg:pt-4">
              {/* Badges: Clear distinction between Online and Offline Registration (Requirement 4) */}
              <div className="flex flex-wrap items-center gap-2">
                {isUpcoming ? (
                  hasOnlineForm ? (
                    <span className="chip border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold">
                      Online Registration Open
                    </span>
                  ) : (
                    <span className="chip border-sunset-orange/50 bg-sunset-orange/10 text-sunset-orange font-semibold">
                      Offline / On-Spot Registration
                    </span>
                  )
                ) : (
                  <span className="chip border-fg/20 text-muted">Completed Event</span>
                )}
                {isOnline ? (
                  <span className="chip border-sky-500/40 text-sky-500 font-medium">Virtual / Online</span>
                ) : (
                  <span className="chip border-fg/15 text-fg/80 font-medium">In-Person Campus</span>
                )}
                {event.eventType && <span className="chip">{event.eventType}</span>}
              </div>

              <h1 className="mt-4 block font-heading text-3xl font-bold leading-tight tracking-tight text-fg sm:text-4xl lg:text-5xl">
                {event.title}
              </h1>

              <div>
                <dl className="card mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl p-4 sm:p-5">
                  <div>
                    <dt className="font-mono text-xs uppercase tracking-widest text-muted">Date & Time</dt>
                    <dd className="mt-1 font-heading text-lg font-bold text-fg sm:text-xl">{formattedDate}</dd>
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

                {/* Registration & Attendance Instructions Box (Requirement 4) */}
                {isUpcoming && (
                  <div className="mt-8 rounded-2xl border border-sunset-orange/30 bg-card/80 p-5 sm:p-6 shadow-lg shadow-sunset-orange/5">
                    <div className="flex items-center gap-2">
                      <span className="flex h-2.5 w-2.5 rounded-full bg-sunset-orange animate-pulse" />
                      <h2 className="font-heading text-base sm:text-lg font-bold text-fg">
                        {hasOnlineForm ? 'Online Registration & Entry Details' : 'Offline Registration & On-Spot Entry'}
                      </h2>
                    </div>

                    {hasOnlineForm ? (
                      <div className="mt-3 space-y-2 text-xs sm:text-sm text-fg/80 leading-relaxed">
                        <p>
                          Registration is currently live online. Complete the official Google Form before registration closes.
                        </p>
                        {!isOnline && event.venue && (
                          <div className="mt-2 rounded-xl border border-fg/10 bg-bg/60 p-3 font-mono text-xs text-muted">
                            <span className="font-bold text-fg">Venue Check-In:</span> Present your registration confirmation at {event.venue} on {formattedDate}.
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="mt-3 space-y-2 text-xs sm:text-sm text-fg/80 leading-relaxed">
                        <p>
                          Registration for this event is conducted <strong className="text-fg font-semibold">physically on-spot</strong>. Attendees and teams can register directly at the entrance desk before the event begins.
                        </p>
                        <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2 rounded-xl border border-fg/10 bg-bg/60 p-3.5 font-mono text-xs text-muted">
                          <div>
                            <span className="block text-[10px] uppercase tracking-wider text-sunset-orange font-bold">Registration Desk</span>
                            <span className="text-fg font-semibold">{event.venue || 'RIT Campus'}</span>
                          </div>
                          <div>
                            <span className="block text-[10px] uppercase tracking-wider text-sunset-orange font-bold">Eligibility & Entry</span>
                            <span className="text-fg font-semibold">Open to all students with College ID</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Primary Action Buttons */}
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  {isUpcoming && hasOnlineForm && (
                    <a href={event.registrationFormUrl} target="_blank" rel="noreferrer noopener" className="btn-primary">
                      {COPY.events.registerCta} <ExternalArrow />
                    </a>
                  )}
                  {isUpcoming && !hasOnlineForm && (
                    <div className="inline-flex items-center gap-2 rounded-full border border-sunset-orange/40 bg-sunset-orange/10 px-4 py-2.5 text-xs font-semibold text-sunset-orange shadow-sm">
                      <span className="h-2 w-2 rounded-full bg-sunset-orange animate-ping" />
                      <span>On-Spot Registration at Venue</span>
                    </div>
                  )}
                  <AddToCalendarMenu event={event} />
                  {event.externalLink && (
                    <a
                      href={event.externalLink}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="btn-ghost"
                    >
                      {COPY.events.viewPost} <ExternalArrow />
                    </a>
                  )}
                  <Link href="/events" prefetch={true} className="btn-ghost">
                    <span aria-hidden="true">←</span> {COPY.events.backToEvents}
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {photos.length > 0 && (
            <div className="mt-20 sm:mt-24">
              <h2 className="mb-6 font-heading text-2xl font-bold tracking-tight text-fg sm:text-3xl">
                Event Moments
              </h2>
              <GalleryGrid photos={photos} />
            </div>
          )}

          <nav aria-label="Adjacent events" className="mt-16 grid grid-cols-1 border-t border-fg/15 sm:grid-cols-2">
            <NeighbourLink event={older} label="Previous Event" align="left" />
            <NeighbourLink event={newer} label="Next Event" align="right" />
          </nav>
        </div>
      </article>
    </>
  );
}
