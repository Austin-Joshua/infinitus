import Link from 'next/link';
import { CLUB_SHORT, COPY, NAV_LINKS, SITE, SOCIAL, COLLEGE_NAME } from '@/lib/site';
import InfinitusLogo from '@/components/brand/InfinitusLogo';
import RitLogo from '@/components/brand/RitLogo';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-sunset-orange/15 bg-card/60 backdrop-blur-md pt-5 pb-20 sm:pt-6 md:pb-6 transition-colors">
      <div className="container-x">
        {/* Main Horizontal Content Row */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Brand Identity & Tagline */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <InfinitusLogo size="nav" className="h-7 w-7" />
              <span aria-hidden="true" className="h-4 w-px bg-fg/20" />
              <RitLogo size="xs" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 font-heading text-xs sm:text-sm font-bold tracking-wider text-fg">
                <span>{CLUB_SHORT} CLUB</span>
                <span aria-hidden="true" className="text-fg/30 font-normal hidden sm:inline">·</span>
                <span className="font-mono text-[11px] sm:text-xs font-normal text-muted block sm:inline">{COLLEGE_NAME}</span>
              </div>
              <p className="font-serif text-[11px] italic text-muted leading-tight">{COPY.footer.tagline}</p>
            </div>
          </div>

          {/* Navigation Links - Horizontal */}
          <nav aria-label="Footer Navigation" className="flex flex-wrap items-center gap-x-4 sm:gap-x-5 gap-y-1 text-xs font-medium">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className="text-muted transition-colors hover:text-accent"
              >
                {link.navLabel}
              </Link>
            ))}
          </nav>

          {/* Connect & Support Links - Horizontal */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
            <a
              href={SOCIAL.instagram}
              target="_blank"
              rel="noreferrer noopener me"
              className="inline-flex items-center gap-1 text-muted transition-colors hover:text-accent font-medium"
            >
              Instagram <span aria-hidden="true" className="text-[10px]">↗</span>
            </a>
            <span aria-hidden="true" className="text-fg/20">·</span>
            <a
              href={SOCIAL.queriesForm}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1 text-muted transition-colors hover:text-accent font-medium"
            >
              Feedback <span aria-hidden="true" className="text-[10px]">↗</span>
            </a>
            <span aria-hidden="true" className="text-fg/20">·</span>
            <a
              href={`mailto:${SITE.contactEmail}`}
              className="inline-flex items-center gap-1 text-muted transition-colors hover:text-accent font-medium"
            >
              {SITE.contactEmail}
            </a>
            <span aria-hidden="true" className="text-fg/20">·</span>
            <a
              href="https://ritchennai.org"
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1 text-muted transition-colors hover:text-accent font-medium"
            >
              RIT <span aria-hidden="true" className="text-[10px]">↗</span>
            </a>
          </div>
        </div>

        {/* Seamless Meta & Legal: No horizontal dividing line, tight professional sub-row */}
        <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-[11px] font-mono text-muted/70">
          <p>{COPY.footer.copyright(year)}</p>
          <p>{COPY.footer.credit}</p>
        </div>
      </div>
    </footer>
  );
}
