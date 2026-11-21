import Image from 'next/image';
import Link from 'next/link';
import { COPY, PAGES, SOCIAL } from '@/lib/site';
import { INSTAGRAM_POSTS } from '@/lib/instagram';
import { formatEventDate } from '@/lib/format';
import InfinitusLogo from '@/components/brand/InfinitusLogo';
import Marquee from '@/components/ui/Marquee';
import Reveal, { Stagger, StaggerItem } from '@/components/ui/Reveal';
import SplitText from '@/components/ui/SplitText';
import EventCard from '@/components/ui/EventCard';
import MemberCard from '@/components/ui/MemberCard';
import { FeaturedEvent } from '@/components/sections/EventsSection';

function isGoogleFormUrl(url) {
  if (!url) return false;
  return url.includes('forms.gle') || url.includes('docs.google.com/forms');
}

/** Clean section heading row without artificial section numbering */
function SectionHead({ eyebrow, heading, href, cta }) {
  const isExternal = href && (href.startsWith('http://') || href.startsWith('https://'));
  return (
    <Reveal className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        {eyebrow && <p className="font-mono text-xs uppercase tracking-widest text-accent font-medium">{eyebrow}</p>}
        <h2 className="font-heading text-2xl font-bold tracking-tight text-fg sm:text-3xl lg:text-4xl mt-1.5">{heading}</h2>
      </div>
      {href && (
        isExternal ? (
          <a
            href={href}
            target="_blank"
            rel="noreferrer noopener"
            className="btn-ghost self-start sm:self-auto text-xs sm:text-sm inline-flex items-center gap-1.5"
          >
            {cta} {!cta.toLowerCase().includes('instagram') && <span aria-hidden="true" className="nudge-ne">↗</span>}
          </a>
        ) : (
          <Link href={href} className="btn-ghost self-start sm:self-auto text-xs sm:text-sm">
            {cta} <span aria-hidden="true" className="nudge">→</span>
          </Link>
        )
      )}
    </Reveal>
  );
}

export function KeywordMarquee() {
  return (
    <aside aria-label="Key club domains" className="py-4 sm:py-5 overflow-hidden border-y border-fg/10 bg-bg/50">
      <span className="sr-only">Key domains: {COPY.home.marquee.join(', ')}</span>
      <div aria-hidden="true">
        <Marquee duration={45}>
          {COPY.home.marquee.map((word) => (
            <span key={word} className="flex items-center whitespace-nowrap font-heading text-2xl italic text-fg/85 sm:text-4xl">
              <span className="px-6 sm:px-8">{word}</span>
              <span aria-hidden="true" className="font-serif not-italic text-sunset-orange text-xl sm:text-2xl">∞</span>
            </span>
          ))}
        </Marquee>
      </div>
    </aside>
  );
}

export function HomeAbout() {
  const { about, home } = COPY;
  return (
    <section className="section !py-16 sm:!py-24">
      <div className="container-x grid gap-8 lg:grid-cols-[12rem_minmax(0,1fr)] lg:gap-14">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-widest text-accent font-medium">{about.eyebrow}</p>
        </Reveal>
        <div>
          <h2 className="max-w-5xl font-heading text-2xl font-medium leading-[1.25] text-fg sm:text-4xl lg:text-5xl">
            <SplitText text={home.aboutStatement} onView stagger={0.03} />{' '}
            <SplitText text={home.aboutStatementAccent} onView delay={0.3} className="italic text-accent" />
          </h2>
          <Reveal delay={0.2} className="mt-8 grid gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
            <p className="lede max-w-2xl !text-sm sm:!text-base">{about.body}</p>
            <Link href="/about" className="group inline-flex items-center gap-2 text-sm font-semibold text-accent">
              <span className="border-b border-accent/40 pb-0.5 transition-colors group-hover:border-accent">Read our story</span>
              <span aria-hidden="true" className="nudge">→</span>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

const EXPLORE_METADATA = {
  about: {
    tag: 'Community',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 3" />
      </svg>
    ),
  },
  events: {
    tag: 'Activities',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <rect x="3" y="4" width="18" height="18" rx="2" strokeLinecap="round" strokeLinejoin="round" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    ),
  },
  team: {
    tag: 'Leadership',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
  gallery: {
    tag: 'Moments',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <rect x="3" y="3" width="18" height="18" rx="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 15l-5-5L5 21" />
      </svg>
    ),
  },
};

/** Index of club pages: sleek cards without awkward structural section markers */
export function HomeExplore() {
  const pages = PAGES.filter((p) => COPY.home.explore[p.id]);
  return (
    <section className="section !py-8 sm:!py-12">
      <div className="container-x">
        <Reveal className="flex items-baseline justify-between gap-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-accent font-medium">{COPY.home.exploreEyebrow}</p>
            <h2 className="font-heading text-2xl font-bold tracking-tight text-fg sm:text-3xl mt-1">
              {COPY.home.exploreHeading}
            </h2>
          </div>
        </Reveal>

        <Stagger className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pages.map((page) => {
            const meta = EXPLORE_METADATA[page.id];
            return (
              <StaggerItem key={page.id}>
                <Link
                  href={page.href}
                  className="card card-hover group relative flex h-full min-h-[14rem] flex-col justify-between p-6 sm:p-7"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 font-mono text-xs font-semibold text-accent">
                      {meta?.icon}
                      <span>{meta?.tag}</span>
                    </span>
                    <span
                      aria-hidden="true"
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-fg/5 text-muted transition-all duration-300 group-hover:bg-accent group-hover:text-white"
                    >
                      →
                    </span>
                  </div>

                  <div className="mt-6">
                    <h3 className="font-heading text-xl font-bold text-fg transition-colors group-hover:text-accent sm:text-2xl">
                      {page.navLabel}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-muted line-clamp-2">
                      {COPY.home.explore[page.id]}
                    </p>
                  </div>
                </Link>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}

export function HomeEvents({ events }) {
  const past = events.filter((e) => e.status !== 'upcoming');
  const upcoming = events.filter((e) => e.status === 'upcoming');
  const nextUp = upcoming[0];
  const displayEvents = past.slice(0, 4);
  const fourthPosterUrl = displayEvents[3]?.coverImageUrl;

  return (
    <section className="section !py-8 sm:!py-12">
      <div className="container-x">
        <SectionHead
          eyebrow="Events"
          heading={COPY.home.eventsHeading}
          href="/events"
          cta={COPY.home.eventsCta}
        />

        {/* Real Upcoming Event Slot (left blank when no genuine upcoming event is scheduled) */}
        {nextUp && (
          <Reveal className="mt-8">
            <div className="card p-6 sm:p-8 border-accent/40">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                  <span className="chip border-sunset/40 text-sunset font-semibold">Upcoming Event</span>
                  <h3 className="font-heading text-2xl sm:text-3xl font-bold text-fg mt-2">
                    {nextUp.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-base text-muted flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span>{formatEventDate(nextUp.eventDate)}</span>
                    {nextUp.venue && (
                      <>
                        <span aria-hidden="true" className="text-fg/30">·</span>
                        <span>{nextUp.venue}</span>
                      </>
                    )}
                  </p>
                  {nextUp.description && (
                    <p className="mt-3 text-xs sm:text-sm text-muted max-w-2xl line-clamp-2">
                      {nextUp.description}
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  {isGoogleFormUrl(nextUp.registrationFormUrl) && (
                    <a
                      href={nextUp.registrationFormUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary text-xs sm:text-sm"
                    >
                      Register Now <span aria-hidden="true" className="nudge-ne">↗</span>
                    </a>
                  )}
                  <Link
                    href={`/events/${encodeURIComponent(nextUp.id)}`}
                    className="btn-ghost text-xs sm:text-sm"
                  >
                    View Details <span aria-hidden="true" className="nudge">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        )}

        {/* 4-Card Responsive Grid with Last Poster Card Blurred for "Show More Events" */}
        <Stagger className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {displayEvents.slice(0, 3).map((event) => (
            <StaggerItem key={event.id}>
              <EventCard event={event} />
            </StaggerItem>
          ))}

          {/* 4th Card: Blurred poster background with "Show More Events" leading to /events */}
          <StaggerItem>
            <article className="card card-hover group relative flex h-full flex-col overflow-hidden rounded-2xl border border-sunset-orange/35 shadow-lg shadow-sunset-orange/10 min-h-[320px] sm:min-h-[380px]">
              {/* Blurred Poster Background */}
              <div className="absolute inset-0 z-0 overflow-hidden bg-bg-2">
                {fourthPosterUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={fourthPosterUrl}
                    alt=""
                    aria-hidden="true"
                    className="h-full w-full object-cover object-top filter blur-[3px] scale-110 opacity-35 transition-transform duration-700 ease-out group-hover:scale-125 group-hover:opacity-45"
                  />
                )}
                {/* Gradient / Opaque Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/90 to-bg/70" />
              </div>

              {/* Centered CTA Content */}
              <div className="relative z-10 flex flex-1 flex-col items-center justify-center p-6 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-sunset-orange/50 bg-sunset-orange/20 text-sunset-orange shadow-lg shadow-sunset-orange/25 transition-transform duration-300 group-hover:scale-110">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" stroke="currentColor" className="h-7 w-7">
                    <rect x="3" y="4" width="18" height="18" rx="3" />
                    <path d="M16 2v4M8 2v4M3 10h18" />
                  </svg>
                </div>

                <span className="chip mt-4 border-sunset/40 text-sunset font-semibold text-xs py-0.5 px-3">
                  {past.length} Events Hosted
                </span>

                <h3 className="mt-3 font-heading text-xl sm:text-2xl font-bold text-fg">
                  Show More Events
                </h3>

                <p className="mt-2 max-w-[220px] text-xs text-muted leading-relaxed">
                  Explore our complete collection of workshops, competitions, talks, and team challenges.
                </p>

                <div className="mt-6">
                  <span className="btn-primary text-xs inline-flex items-center gap-1.5 shadow-md shadow-sunset-orange/25 group-hover:shadow-lg group-hover:shadow-sunset-orange/40">
                    View All Events <span aria-hidden="true" className="nudge">→</span>
                  </span>
                </div>

                {/* Direct Link Overlay to /events */}
                <Link
                  href="/events"
                  className="absolute inset-0 z-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-2xl"
                  aria-label="View all INFINITUS events on the events page"
                />
              </div>
            </article>
          </StaggerItem>
        </Stagger>
      </div>
    </section>
  );
}

// Key office bearers featured on the home page in proper card layout
const HOME_TEAM_ROLES = ['President', 'Vice President', 'Secretary', 'Joint Secretary', 'Technical Head'];

export function HomeTeam({ members }) {
  const leaders = HOME_TEAM_ROLES.flatMap((role) => members.filter((m) => m.role === role)).slice(0, 4);

  return (
    <section className="section !py-8 sm:!py-12">
      <div className="container-x">
        <SectionHead
          eyebrow="Team"
          heading={COPY.home.teamHeading}
          href="/team"
          cta={COPY.home.teamCta}
        />

        <Stagger className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-5">
          {leaders.map((member) => (
            <StaggerItem key={member.id}>
              <MemberCard member={member} />
            </StaggerItem>
          ))}
        </Stagger>

        <div className="mt-8 flex justify-center">
          <Link href="/team" className="btn-primary text-xs sm:text-sm">
            Meet the Full Committee ({members.length} Members) <span aria-hidden="true" className="nudge">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

/** Two rows of gallery photos with balanced, unobtrusive height */
export function HomeGallery({ photos }) {
  const half = Math.ceil(photos.length / 2);
  const rows = [photos.slice(0, half), photos.slice(half)];

  return (
    <section className="section overflow-hidden !py-8 sm:!py-12">
      <div className="container-x">
        <SectionHead
          eyebrow="Gallery"
          heading={COPY.home.galleryHeading}
          href="/gallery"
          cta={COPY.home.galleryCta}
        />
      </div>
      <div className="mt-8 space-y-3 sm:space-y-4">
        {rows.map((row, r) => (
          <Marquee key={r} duration={50 + r * 10} reverse={r === 1}>
            {row.map((photo) => (
              <Link
                key={photo.src}
                href="/gallery"
                className="group relative mr-3 sm:mr-4 block h-36 sm:h-44 md:h-48 shrink-0 overflow-hidden rounded-xl border border-fg/15 bg-card shadow-sm hover:shadow-md transition-all"
                style={{ aspectRatio: `${photo.width || 4} / ${photo.height || 3}` }}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt || photo.caption}
                  fill
                  sizes="260px"
                  unoptimized={photo.src.startsWith('http')}
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </Link>
            ))}
          </Marquee>
        ))}
      </div>
    </section>
  );
}

export function HomeInstagram() {
  return (
    <section className="section overflow-hidden !py-8 sm:!py-12">
      <div className="container-x">
        <SectionHead
          eyebrow="Instagram"
          heading="From our feed"
          href={SOCIAL.instagram}
          cta="Follow on Instagram"
        />

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 sm:gap-4 lg:gap-5">
          {INSTAGRAM_POSTS.slice(0, 8).map((post, idx) => (
            <Reveal key={post.id} delay={idx * 0.03}>
              <a
                href={post.permalink || SOCIAL.instagram}
                target="_blank"
                rel="noreferrer noopener"
                className="card card-hover group relative flex h-full max-w-sm sm:max-w-none mx-auto w-full flex-col overflow-hidden rounded-xl border border-fg/10 shadow-sm"
                aria-label={`View Instagram post: ${post.caption}`}
              >
                {/* Official Club Header: Official Infinitus Logo, Instagram Handle, and Tag Chip */}
                <div className="flex items-center justify-between px-3 py-2 border-b border-fg/10 bg-bg-2/30">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="relative h-5 w-5 shrink-0 overflow-hidden rounded-full ring-1 ring-sunset-orange/40 shadow-xs bg-bg">
                      <InfinitusLogo size="nav" className="h-full w-full object-cover" />
                    </div>
                    <span className="font-mono text-[11px] font-semibold text-fg/90 truncate tracking-tight">
                      {SOCIAL.instagramHandle}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {post.tag && (
                      <span className="chip text-[9px] py-0.5 px-1.5 border-sunset/40 text-sunset font-medium">
                        {post.tag}
                      </span>
                    )}
                    <span aria-hidden="true" className="flex h-4 w-4 items-center justify-center text-muted group-hover:text-sunset-orange transition-colors">
                      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.75" className="h-3.5 w-3.5">
                        <rect x="4" y="4" width="16" height="16" rx="5" stroke="currentColor" />
                        <circle cx="12" cy="12" r="3.3" stroke="currentColor" />
                        <path d="M16.2 7.8h.01" stroke="currentColor" strokeLinecap="round" />
                      </svg>
                    </span>
                  </div>
                </div>

                {/* Poster Frame: Compact, tailored aspect ratio */}
                <div className="relative aspect-square sm:aspect-[4/4.5] w-full overflow-hidden bg-bg-2/20 max-h-[250px] sm:max-h-[270px]">
                  <Image
                    src={post.image}
                    alt={post.caption}
                    fill
                    sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>

                {/* Caption & Metadata Footer */}
                <div className="flex flex-1 flex-col justify-between p-3 sm:p-3.5">
                  <p className="line-clamp-2 text-xs leading-snug text-fg/90 font-sans">
                    {post.caption}
                  </p>
                  <div className="mt-3 flex items-center justify-between border-t border-fg/10 pt-2 text-[11px]">
                    <span className="font-mono text-muted">{post.date}</span>
                    <span className="font-mono font-medium text-accent flex items-center gap-1 group-hover:text-sunset-orange transition-colors">
                      Instagram <span aria-hidden="true">↗</span>
                    </span>
                  </div>
                </div>
              </a>
            </Reveal>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <a
            href={SOCIAL.instagram}
            target="_blank"
            rel="noreferrer noopener"
            className="btn-ghost text-xs sm:text-sm inline-flex items-center gap-2"
          >
            View more on Instagram <span aria-hidden="true" className="nudge-ne">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}

export function CtaBand() {
  return (
    <section className="section relative overflow-hidden !py-10 sm:!py-16">
      {/* Softly diffused ambient backlight with no harsh edges */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
      >
        <div className="h-96 w-[42rem] max-w-full rounded-full bg-sunset-orange/[0.09] blur-[140px]" />
      </div>
      <div className="container-x relative">
        <p className="font-mono text-xs uppercase tracking-widest text-accent font-medium">{COPY.home.ctaEyebrow}</p>
        <h2 className="mt-4 max-w-4xl font-heading text-2xl font-bold tracking-tight text-fg sm:text-4xl lg:text-5xl">
          <SplitText text={COPY.home.ctaHeading} onView stagger={0.03} />
        </h2>
        <Reveal delay={0.25} className="mt-8">
          <Link
            href="/contact"
            className="btn-primary text-sm sm:text-base !px-7 !py-3.5 shadow-md"
          >
            {COPY.home.ctaButton} <span aria-hidden="true" className="nudge">→</span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
