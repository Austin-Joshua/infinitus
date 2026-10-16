import Link from 'next/link';
import { CLUB_SHORT, COPY, NAV_LINKS, SITE, SOCIAL, COLLEGE_NAME } from '@/lib/site';
import InfinitusLogo from '@/components/brand/InfinitusLogo';
import RitLogo from '@/components/brand/RitLogo';

const linkClass = 'group inline-flex items-center gap-1.5 text-muted transition-colors hover:text-accent text-sm';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-fg/15 bg-bg-2">
      <div className="container-x py-14 sm:py-16">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr] lg:gap-16">
          <div>
            <div className="flex items-center gap-3.5">
              <InfinitusLogo size="nav" className="h-10 w-10" />
              <span aria-hidden="true" className="h-7 w-px bg-fg/20" />
              <RitLogo size="sm" />
            </div>
            <p className="mt-4 font-heading text-lg font-semibold tracking-wide text-fg">{CLUB_SHORT} CLUB</p>
            <p className="mt-1 text-xs font-mono text-muted">{COLLEGE_NAME}</p>
            <p className="mt-4 max-w-sm font-serif text-base italic text-fg/80">{COPY.footer.tagline}</p>
          </div>

          <nav aria-label="Footer Navigation">
            <p className="font-mono text-xs uppercase tracking-widest text-muted">Navigation</p>
            <ul className="mt-4 space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.id}>
                  <Link href={link.href} className={linkClass}>
                    <span aria-hidden="true" className="text-xs text-accent opacity-70">›</span>
                    {link.navLabel}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-muted">Connect & Support</p>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a href={SOCIAL.instagram} target="_blank" rel="noreferrer noopener" className={linkClass}>
                  Instagram ({SOCIAL.instagramHandle}) <span aria-hidden="true" className="nudge nudge-ne">↗</span>
                </a>
              </li>
              <li>
                <a href={SOCIAL.queriesForm} target="_blank" rel="noreferrer noopener" className={linkClass}>
                  Queries & Feedback Form <span aria-hidden="true" className="nudge nudge-ne">↗</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${SITE.contactEmail}`} className={`${linkClass} break-all`}>
                  {SITE.contactEmail}
                </a>
              </li>
              <li>
                <a href="https://ritchennai.org" target="_blank" rel="noreferrer noopener" className={linkClass}>
                  RIT Official Website <span aria-hidden="true" className="nudge nudge-ne">↗</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-fg/15 pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>{COPY.footer.copyright(year)}</p>
          <p>{COPY.footer.credit}</p>
        </div>
      </div>
    </footer>
  );
}
