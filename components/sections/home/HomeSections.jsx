import Image from 'next/image';
import Link from 'next/link';
import { COPY, PAGES, SOCIAL } from '@/lib/site';
import { INSTAGRAM_POSTS } from '@/lib/instagram';
import { formatEventDate } from '@/lib/format';
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
  return (
    <Reveal className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        {eyebrow && <p className="font-mono text-xs uppercase tracking-widest text-accent font-medium">{eyebrow}</p>}
        <h2 className="font-heading text-2xl font-bold tracking-tight text-fg sm:text-3xl lg:text-4xl mt-1.5">{heading}</h2>
      </div>
      {href && (
        <Link href={href} className="btn-ghost self-start sm:self-auto text-xs sm:text-sm">
          {cta} <span aria-hidden="true" className="nudge">→</span>
        </Link>
      )}
    </Reveal>
  );
}

export function KeywordMarquee() {
  return (
    <div className="border-y border-fg/15 bg-bg-2/60 py-4 sm:py-5">
      <Marquee duration={45}>
        {COPY.home.marquee.map((word) => (
          <span key={word} className="flex items-center whitespace-nowrap font-heading text-2xl italic text-fg sm:text-4xl">
            <span className="px-6 sm:px-8">{word}</span>
            <span aria-hidden="true" className="font-serif not-italic text-accent text-xl sm:text-2xl">∞</span>
          </span>
        ))}
      </Marquee>
    </div>
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
    <section className="section !py-16 sm:!py-20 bg-bg-2/30">
      <div className="container-x">
        <Reveal className="flex items-baseline justify-between gap-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-accent font-medium">Explore The Club</p>
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
  const featured = past.find((e) => e.featured) ?? past[0];
  const latest = past.filter((e) => e !== featured).slice(0, 4);

  return (
    <section className="section bg-bg-2/50 !py-16 sm:!py-24">
      <div className="container-x">
        <SectionHead
          eyebrow="Competitions & Workshops"
          heading={COPY.home.eventsHeading}
          href="/events"
          cta={COPY.home.eventsCta}
        />

        {/* Upcoming Slot above Past Events */}
        <Reveal className="mt-8">
          {nextUp ? (
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
          ) : (
            <div className="card p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-dashed border-fg/20">
              <div>
                <span className="chip border-accent/30 text-accent font-medium">Upcoming Schedule</span>
                <h3 className="font-heading text-xl sm:text-2xl font-bold text-fg mt-2">
                  Next event: announced on Instagram
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-muted">
                  Follow our official handle for competition briefs, dates, and registration announcements.
                </p>
              </div>
              <a
                href={SOCIAL.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary self-start sm:self-auto text-xs sm:text-sm shrink-0"
              >
                Follow {SOCIAL.instagramHandle} <span aria-hidden="true" className="nudge-ne">↗</span>
              </a>
            </div>
          )}
        </Reveal>

        {featured && (
          <Reveal className="mt-8">
            <FeaturedEvent event={featured} />
          </Reveal>
        )}
        <Stagger className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {latest.map((event) => (
            <StaggerItem key={event.id}>
              <EventCard event={event} />
            </StaggerItem>
          ))}
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
    <section className="section !py-16 sm:!py-24">
      <div className="container-x">
        <SectionHead
          eyebrow="Club Leadership"
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

        <div className="mt-10 flex justify-center">
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
    <section className="section overflow-hidden bg-bg-2/50 !py-16 sm:!py-24">
      <div className="container-x">
        <SectionHead
          eyebrow="Memories in Math"
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
    <section className="section overflow-hidden bg-bg/90 !py-16 sm:!py-24 border-t border-fg/10">
      <div className="container-x">
        <SectionHead
          eyebrow="Social Sync · @infinitus_club.rit"
          heading="From our Instagram feed"
          href={SOCIAL.instagram}
          cta="Follow on Instagram"
        />

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 sm:gap-7">
          {INSTAGRAM_POSTS.map((post, idx) => (
            <Reveal key={post.id} delay={idx * 0.04}>
              <a
                href={post.permalink}
                target="_blank"
                rel="noreferrer noopener"
                className="card card-hover group relative flex h-full flex-col overflow-hidden rounded-2xl"
                aria-label={`View Instagram post: ${post.caption}`}
              >
                {/* Clean Top Bar: Handle, Infinity Icon, and Tag Chip */}
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-fg/10 bg-bg-2/40">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent text-[11px] font-mono font-bold">
                      ∞
                    </span>
                    <span className="font-mono text-xs font-medium text-fg/80 truncate">
                      @infinitus_club.rit
                    </span>
                  </div>
                  {post.tag && (
                    <span className="chip text-[10px] sm:text-[11px] py-0.5 px-2 border-sunset/40 text-sunset font-medium shrink-0">
                      {post.tag}
                    </span>
                  )}
                </div>

                {/* Poster Frame: 100% unobstructed edge-to-edge 4:5 frame */}
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-bg-2/20">
                  <Image
                    src={post.image}
                    alt={post.caption}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>

                {/* Caption & Metadata Footer */}
                <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
                  <p className="line-clamp-3 text-xs sm:text-sm leading-relaxed text-fg/90 font-sans">
                    {post.caption}
                  </p>
                  <div className="mt-4 flex items-center justify-between border-t border-fg/10 pt-3 text-xs">
                    <span className="font-mono text-muted">{post.date}</span>
                    <span className="font-mono font-medium text-accent flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      View post <span aria-hidden="true">↗</span>
                    </span>
                  </div>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CtaBand() {
  return (
    <section className="section relative overflow-hidden bg-bg-2/30 !py-16 sm:!py-24">
      <div aria-hidden="true" className="graph-paper pointer-events-none absolute inset-0" />
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
