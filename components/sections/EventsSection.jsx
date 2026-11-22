import { COPY, SOCIAL } from '@/lib/site';
import { formatEventDate } from '@/lib/format';
import Reveal from '@/components/ui/Reveal';
import Link from 'next/link';
import EventCard, { EventPoster, ExternalArrow, eventHref } from '@/components/ui/EventCard';
import EventsBrowser from '@/components/ui/EventsBrowser';
import FeaturedEventsSlider from '@/components/ui/FeaturedEventsSlider';
import EventsKnowledgeGraph from '@/components/ui/EventsKnowledgeGraph';

export function FeaturedEvent({ event }) {
  return (
    <article className="card group flex flex-col md:flex-row items-center overflow-hidden p-5 sm:p-6 md:p-7 lg:p-8 gap-6 sm:gap-8 lg:gap-10">
      {/* Framed Poster with proper space, border, and aspect ratio */}
      <Link
        href={eventHref(event)}
        prefetch={true}
        tabIndex={-1}
        aria-hidden="true"
        className="relative shrink-0 w-full max-w-[280px] sm:max-w-[320px] md:w-[280px] lg:w-[320px] aspect-[4/5] overflow-hidden rounded-xl border border-fg/15 shadow-md bg-bg transition-transform duration-500 ease-out group-hover:scale-[1.02] group-hover:border-accent/40"
      >
        <EventPoster
          event={event}
          sizes="(min-width: 1024px) 320px, (min-width: 768px) 280px, 100vw"
          fit="cover"
          priority
          className="h-full w-full object-cover object-top"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </Link>

      {/* Content Side: Naturally aligned and fitted to the poster height */}
      <div className="flex flex-1 flex-col justify-center min-w-0 w-full">
        <div className="flex flex-wrap gap-2">
          <span className="chip border-sunset/40 text-sunset font-semibold">{COPY.events.featuredLabel}</span>
          {event.eventType && <span className="chip font-medium">{event.eventType}</span>}
        </div>
        <h2 className="mt-3 sm:mt-4 font-heading text-2xl font-bold leading-tight tracking-tight text-fg sm:text-3xl lg:text-4xl">
          <Link href={eventHref(event)} prefetch={true} className="transition-colors hover:text-accent">
            {event.title}
          </Link>
        </h2>
        <p className="mt-2.5 font-mono text-xs sm:text-sm text-accent font-medium">
          {formatEventDate(event.eventDate, event.endDate)}
          {event.venue ? ` · ${event.venue}` : ''}
        </p>
        {event.description && (
          <p className="lede mt-3 max-w-2xl text-xs sm:text-sm leading-relaxed text-muted">
            {event.description}
          </p>
        )}
        {event.highlights?.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-2">
            {event.highlights.map((h) => (
              <li key={h} className="rounded-lg border border-fg/15 bg-bg/50 px-3 py-1.5 text-xs sm:text-sm font-medium text-fg">
                {h}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3">
          <Link href={eventHref(event)} prefetch={true} className="btn-primary text-xs sm:text-sm">
            {COPY.events.details} <span aria-hidden="true" className="nudge">→</span>
          </Link>
          {event.externalLink && (
            <a href={event.externalLink} target="_blank" rel="noreferrer noopener" className="btn-ghost text-xs sm:text-sm">
              {COPY.events.viewPost} <ExternalArrow />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

/** Body of the Events page: upcoming (when scheduled), the latest featured event, then the full archive. */
export default function EventsSection({ events }) {
  const upcoming = events.filter((e) => e.status === 'upcoming');
  const past = events.filter((e) => e.status !== 'upcoming');
  const featured = past.filter((e) => e.featured);
  const featuredEvents = featured.length > 0 ? featured : past.slice(0, 6);

  return (
    <section className="section !pt-2 sm:!pt-3 pb-12 sm:pb-16">
      <div className="container-x">
        {/* Real upcoming events when scheduled */}
        {upcoming.length > 0 && (
          <div className="mb-14">
            <h2 className="font-heading text-xl font-semibold text-fg">{COPY.events.upcomingHeading}</h2>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 sm:gap-5">
              {upcoming.map((event) => (
                <Reveal key={event.id}>
                  <EventCard event={event} />
                </Reveal>
              ))}
            </div>
          </div>
        )}

        {/* Large Format Interactive Featured Events Slideshow */}
        {featuredEvents.length > 0 && (
          <Reveal>
            <FeaturedEventsSlider events={featuredEvents} />
          </Reveal>
        )}

        {/* Interactive Mathematical Knowledge Graph (Feature 1C) */}
        {events.length > 0 && (
          <Reveal className="mt-14 sm:mt-16 scroll-mt-24">
            <EventsKnowledgeGraph events={events} />
          </Reveal>
        )}

        {past.length > 0 && (
          <Reveal className="mt-14 sm:mt-16">
            <EventsBrowser events={past} />
          </Reveal>
        )}
      </div>
    </section>
  );
}
