import Link from 'next/link';
import { CLUB_SHORT, COPY, NAV_LINKS, SITE, SOCIAL, COLLEGE_NAME } from '@/lib/site';
import InfinitusLogo from '@/components/brand/InfinitusLogo';
import RitLogo from '@/components/brand/RitLogo';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-fg/15 bg-bg-2/80 transition-colors">
      <div className="container-x py-8 sm:py-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          {/* Brand Identity & Affiliation */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3.5 sm:gap-5">
            <div className="flex items-center gap-3">
              <InfinitusLogo size="nav" className="h-8 w-8" />
              <span aria-hidden="true" className="h-5 w-px bg-fg/20" />
              <RitLogo size="xs" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading text-sm font-bold tracking-wider text-fg">{CLUB_SHORT} CLUB</span>
                <span aria-hidden="true" className="text-fg/30">·</span>
                <span className="font-mono text-xs text-muted">{COLLEGE_NAME}</span>
              </div>
              <p className="font-serif text-xs italic text-muted mt-0.5">{COPY.footer.tagline}</p>
            </div>
          </div>

          {/* Horizontal Navigation Links */}
          <nav aria-label="Footer Navigation" className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs sm:text-sm">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className="text-muted transition-colors hover:text-accent font-medium"
              >
                {link.navLabel}
              </Link>
            ))}
          </nav>

          {/* Social & Support Quick Links */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            <a
              href={SOCIAL.instagram}
              target="_blank"
              rel="noreferrer noopener me"
              className="inline-flex items-center gap-1 rounded-full border border-fg/15 bg-card px-3 py-1 font-mono text-muted transition-colors hover:border-accent hover:text-accent"
            >
              Instagram <span aria-hidden="true">↗</span>
            </a>
            <a
              href={SOCIAL.queriesForm}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1 rounded-full border border-fg/15 bg-card px-3 py-1 font-mono text-muted transition-colors hover:border-accent hover:text-accent"
            >
              Feedback <span aria-hidden="true">↗</span>
            </a>
            <a
              href={`mailto:${SITE.contactEmail}`}
              className="inline-flex items-center gap-1 rounded-full border border-fg/15 bg-card px-3 py-1 font-mono text-muted transition-colors hover:border-accent hover:text-accent"
            >
              Email <span aria-hidden="true">✉</span>
            </a>
            <a
              href="https://ritchennai.org"
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1 rounded-full border border-fg/15 bg-card px-3 py-1 font-mono text-muted transition-colors hover:border-accent hover:text-accent"
            >
              RIT <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>

        {/* Compact Bottom Bar */}
        <div className="mt-6 flex flex-col gap-2 border-t border-fg/10 pt-4 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>{COPY.footer.copyright(year)}</p>
          <p>{COPY.footer.credit}</p>
        </div>
      </div>
    </footer>
  );
}
