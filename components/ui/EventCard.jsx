import Image from 'next/image';
import Link from 'next/link';
import { eventHref, formatEventDate } from '@/lib/format';
import InfinitusLogo from '@/components/brand/InfinitusLogo';

export { eventHref };

export function ExternalArrow() {
  return (
    <span aria-hidden="true" className="nudge nudge-ne">
      ↗
    </span>
  );
}

export function EventPoster({ event, sizes, priority = false, className = '', fit = 'cover' }) {
  if (!event.coverImageUrl) {
    return (
      <div className={`flex items-center justify-center bg-card/60 p-6 ${className}`}>
        <InfinitusLogo size="footer" className="opacity-75" />
      </div>
    );
  }

  return (
    <Image
      src={event.coverImageUrl}
      alt={`${event.title} poster`}
      fill
      sizes={sizes}
      priority={priority}
      unoptimized={event.coverImageUrl.startsWith('http')}
      className={`${fit === 'contain' ? 'object-contain' : 'object-cover'} ${className}`}
    />
  );
}

/** Poster card. The title links to the event page and stretches over the whole card. */
export default function EventCard({ event }) {
  const isUpcoming = event.status === 'upcoming';

  return (
    <article className="card card-hover group relative flex h-full flex-col overflow-hidden rounded-2xl">
      <div className="relative aspect-[4/5] w-full overflow-hidden border-b border-fg/15 bg-bg-2/40">
        <EventPoster
          event={event}
          sizes="(min-width: 1536px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          fit="cover"
          className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      <div className="flex flex-1 flex-col p-3 sm:p-4.5">
        <div className="flex items-center justify-between gap-1 mb-1 sm:mb-1.5 flex-wrap">
          <span className="font-mono text-[10px] sm:text-xs text-accent font-semibold">
            {formatEventDate(event.eventDate, event.endDate)}
          </span>
          {isUpcoming ? (
            event.registrationFormUrl ? (
              <span className="chip border-emerald-500/40 text-emerald-600 dark:text-emerald-400 text-[9px] sm:text-[10px] font-semibold py-0.5 px-1.5 sm:px-2">
                Online Reg
              </span>
            ) : (
              <span className="chip border-sunset/40 text-sunset text-[9px] sm:text-[10px] font-semibold py-0.5 px-1.5 sm:px-2">
                On-Spot Reg
              </span>
            )
          ) : event.eventType ? (
            <span className="chip text-[9px] sm:text-[10px] py-0.5 px-1.5 sm:px-2 text-muted font-medium">
              {event.eventType}
            </span>
          ) : null}
        </div>
        <h3 className="font-heading text-xs sm:text-base font-bold leading-snug text-fg line-clamp-2">
          <Link
            href={eventHref(event)}
            prefetch={true}
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:rounded-md focus-visible:after:ring-2 focus-visible:after:ring-accent hover:text-accent transition-colors"
          >
            {event.title}
          </Link>
        </h3>
        {event.venue && <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-[11px] text-muted line-clamp-1">{event.venue}</p>}
        {event.description && (
          <p className="mt-1.5 sm:mt-2 line-clamp-2 text-[11px] sm:text-xs leading-relaxed text-muted hidden xs:block">{event.description}</p>
        )}

        <div className="relative z-10 mt-auto pt-2 sm:pt-3 border-t border-fg/10 flex items-center justify-between text-xs">
          <span className="font-mono text-[10px] sm:text-[11px] font-medium text-accent flex items-center gap-1 group-hover:text-sunset-orange transition-colors">
            {isUpcoming ? (event.registrationFormUrl ? 'Register online' : 'Offline details') : 'Details'} <span aria-hidden="true" className="nudge">→</span>
          </span>
          {event.externalLink ? (
            <a
              href={event.externalLink}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1 text-[11px] font-medium text-fg/70 transition-colors hover:text-accent"
              aria-label={`View external link for ${event.title}`}
            >
              Post <ExternalArrow />
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
