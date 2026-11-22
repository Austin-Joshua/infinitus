'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from 'framer-motion';
import InfinitusLogo from '@/components/brand/InfinitusLogo';
import RitLogo from '@/components/brand/RitLogo';
import { useTheme } from '@/components/ui/ThemeProvider';
import { playClick, playThemeToggle } from '@/lib/soundEffects';
import { EASE } from '@/lib/motion';
import { COPY, NAV_LINKS, SOCIAL } from '@/lib/site';

const MAIN_NAV = NAV_LINKS.filter((link) => link.navVariant !== 'button' && link.id !== 'home');
const CONTACT_LINK = NAV_LINKS.find((link) => link.id === 'contact');

function isActive(pathname, href) {
  return href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);
}

function SunIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.75" {...props}>
      <circle cx="12" cy="12" r="4" stroke="currentColor" />
      <path
        d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.1 5.1l1.6 1.6M17.3 17.3l1.6 1.6M18.9 5.1l-1.6 1.6M6.7 17.3l-1.6 1.6"
        stroke="currentColor"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.75" {...props}>
      <path
        d="M19.5 13.2A7.5 7.5 0 1 1 10.8 4.5 6 6 0 0 0 19.5 13.2Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function InstagramNavIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.75" {...props}>
      <rect x="4" y="4" width="16" height="16" rx="5" stroke="currentColor" />
      <circle cx="12" cy="12" r="3.3" stroke="currentColor" />
      <path d="M16.2 7.8h.01" stroke="currentColor" strokeLinecap="round" />
    </svg>
  );
}

function HomeNavIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.75" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7m-9-5v12m8-7l2 2m-2-2v9a2 2 0 01-2 2H8a2 2 0 01-2-2v-9" />
    </svg>
  );
}

function AboutNavIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.75" stroke="currentColor" {...props}>
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8h.01M11 12h1v4h1" />
    </svg>
  );
}

function EventsNavIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.75" stroke="currentColor" {...props}>
      <rect x="3" y="4" width="18" height="18" rx="2" strokeLinecap="round" strokeLinejoin="round" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

function TeamNavIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.75" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </svg>
  );
}

function GalleryNavIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.75" stroke="currentColor" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 15l-5-5L5 21" />
    </svg>
  );
}

function ContactNavIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.75" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  );
}

function SearchNavIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" stroke="currentColor" {...props}>
      <circle cx="11" cy="11" r="7" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
    </svg>
  );
}

// Mobile Bottom Navigation tabs for fast, 1-tap mobile navigation
const MOBILE_BOTTOM_NAV = [
  { id: 'home', href: '/', navLabel: 'Home', icon: HomeNavIcon },
  { id: 'about', href: '/about', navLabel: 'About', icon: AboutNavIcon },
  { id: 'events', href: '/events', navLabel: 'Events', icon: EventsNavIcon },
  { id: 'team', href: '/team', navLabel: 'Team', icon: TeamNavIcon },
  { id: 'gallery', href: '/gallery', navLabel: 'Gallery', icon: GalleryNavIcon },
  { id: 'contact', href: '/contact', navLabel: 'Contact', icon: ContactNavIcon },
];

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  const openCommandPalette = () => {
    window.dispatchEvent(new CustomEvent('infinitus:open-command-palette'));
  };

  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });

  // Elevates with border and backdrop-blur once scrolled
  useMotionValueEvent(scrollY, 'change', (y) => {
    setScrolled(y > 16);
  });

  return (
    <>
      {/* Scroll Progress Bar at the Top */}
      <motion.div
        aria-hidden="true"
        data-scroll-progress="true"
        className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-gradient-to-r from-accent via-sunset to-accent"
        style={{ scaleX: progress }}
      />

      {/* Top Header Bar */}
      <motion.header
        data-site-header="true"
        className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${
          scrolled ? 'border-sunset-orange/20 bg-bg/85 backdrop-blur-xl shadow-md shadow-sunset-orange/5' : 'border-transparent bg-transparent'
        }`}
      >
        <div className="container-x flex h-14 sm:h-16 items-center justify-between gap-2.5 sm:gap-4">
          {/* Dual Branding: Infinitus Logo + College Logo */}
          <Link href="/" prefetch={true} className="group flex items-center gap-2 sm:gap-3" aria-label={COPY.brand.homeAriaLabel}>
            <span className="transition-transform duration-700 ease-out group-hover:rotate-[360deg] shrink-0">
              <InfinitusLogo size="nav" priority className="h-8 w-8 sm:h-9 sm:w-9" />
            </span>
            <span className="h-4 sm:h-5 w-px bg-fg/20 shrink-0" aria-hidden="true" />
            <span className="shrink-0">
              <RitLogo size="xs" className="opacity-95 transition-opacity group-hover:opacity-100" />
            </span>
          </Link>

          {/* Desktop Navigation (visible on md screens and above) */}
          <nav aria-label="Primary" className="hidden items-center gap-1.5 md:flex">
            {MAIN_NAV.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  prefetch={true}
                  aria-current={active ? 'page' : undefined}
                  className={`relative rounded-xl px-3.5 py-2 text-sm font-medium transition-colors ${
                    active ? 'text-sunset-orange font-semibold' : 'text-muted hover:text-fg'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 -z-10 rounded-xl border border-sunset-orange/60 bg-card shadow-sm shadow-sunset-orange/20"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  {item.navLabel}
                </Link>
              );
            })}
          </nav>

          {/* Header Action Buttons (Search + Instagram + Theme Toggle + Contact CTA) */}
          <div className="flex items-center gap-2">
            {/* Command Palette Trigger (Desktop Pill) */}
            <button
              type="button"
              onClick={openCommandPalette}
              aria-label="Open search and command palette (Ctrl+K)"
              title="Search events, team and actions (Ctrl+K)"
              data-testid="nav-search-button"
              className="hidden lg:flex items-center gap-2 rounded-full border border-sunset-orange/35 bg-card/75 px-3 py-1.5 text-xs text-muted transition-all duration-200 hover:border-sunset-orange/80 hover:text-fg hover:bg-card hover:shadow-sm hover:shadow-sunset-orange/20"
            >
              <SearchNavIcon className="h-3.5 w-3.5 text-sunset-orange" />
              <span className="font-sans">Search...</span>
              <kbd className="rounded border border-sunset-orange/30 bg-bg/70 px-1.5 py-0.5 font-mono text-[10px] text-muted">
                ⌘K
              </kbd>
            </button>

            {/* Command Palette Trigger (Mobile/Tablet Icon Button) */}
            <button
              type="button"
              onClick={openCommandPalette}
              aria-label="Open search and command palette"
              title="Search (Ctrl+K)"
              data-testid="mobile-search-button"
              className="relative flex h-9 w-9 sm:h-10 sm:w-10 lg:hidden items-center justify-center rounded-full border border-sunset-orange/35 bg-card text-fg shadow-sm shadow-sunset-orange/10 transition-all duration-200 hover:border-sunset-orange/80 hover:bg-card hover:shadow-md hover:shadow-sunset-orange/25 hover:scale-105 hover:text-sunset-orange active:scale-95"
            >
              <SearchNavIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>

            <a
              href={SOCIAL.instagram}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={`Follow INFINITUS on Instagram (${SOCIAL.instagramHandle})`}
              title="Instagram @infinitus_club.rit"
              className="relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-sunset-orange/35 bg-card text-fg shadow-sm shadow-sunset-orange/10 transition-all duration-200 hover:border-sunset-orange/80 hover:bg-card hover:shadow-md hover:shadow-sunset-orange/25 hover:scale-105 hover:text-sunset-orange active:scale-95"
            >
              <InstagramNavIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            </a>

            <button
              type="button"
              onClick={() => {
                toggleTheme();
                playThemeToggle();
              }}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              title={isDark ? 'Light mode' : 'Dark mode'}
              className="relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-sunset-orange/35 bg-card text-fg shadow-sm shadow-sunset-orange/10 transition-all duration-200 hover:border-sunset-orange/80 hover:bg-card hover:shadow-md hover:shadow-sunset-orange/25 hover:scale-105 hover:text-sunset-orange active:scale-95"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={isDark ? 'sun' : 'moon'}
                  initial={{ y: 16, rotate: -90, opacity: 0 }}
                  animate={{ y: 0, rotate: 0, opacity: 1 }}
                  exit={{ y: -16, rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.18, ease: EASE.out }}
                >
                  {isDark ? <SunIcon className="h-4 w-4 sm:h-5 sm:w-5" /> : <MoonIcon className="h-4 w-4 sm:h-5 sm:w-5" />}
                </motion.span>
              </AnimatePresence>
            </button>

            {CONTACT_LINK && (
              <Link
                href={CONTACT_LINK.href}
                prefetch={true}
                aria-current={isActive(pathname, CONTACT_LINK.href) ? 'page' : undefined}
                className="btn-primary hidden !rounded-full !px-4 !py-2 text-xs font-semibold sm:inline-flex"
              >
                {CONTACT_LINK.navLabel} <span aria-hidden="true" className="nudge">→</span>
              </Link>
            )}
          </div>
        </div>
      </motion.header>

      {/* Persistent Mobile Bottom Navigation Bar (Primary navigation in mobile display size) */}
      <nav
        aria-label="Mobile Navigation"
        data-mobile-nav="true"
        className="fixed inset-x-0 bottom-0 z-40 block md:hidden border-t border-sunset-orange/25 bg-bg/95 dark:bg-bg/98 backdrop-blur-2xl shadow-[0_-6px_24px_rgba(0,0,0,0.12)]"
        style={{ paddingBottom: 'max(0.4rem, env(safe-area-inset-bottom, 0.4rem))' }}
      >
        <div className="flex items-center justify-around py-1.5 px-1 max-w-lg mx-auto">
          {MOBILE_BOTTOM_NAV.map((item) => {
            const active = isActive(pathname, item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                href={item.href}
                prefetch={true}
                aria-current={active ? 'page' : undefined}
                className={`relative flex flex-1 flex-col items-center justify-center py-1 px-0.5 transition-all duration-200 active:scale-95 ${
                  active ? 'text-sunset-orange' : 'text-muted hover:text-fg'
                }`}
              >
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-lg transition-colors ${
                    active ? 'bg-sunset-orange/15 text-sunset-orange' : ''
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <span className={`text-[9.5px] sm:text-[10px] tracking-tight transition-colors ${active ? 'font-bold text-sunset-orange' : 'font-medium'}`}>
                  {item.navLabel}
                </span>
                {active && (
                  <motion.span
                    layoutId="mobile-nav-dot"
                    className="absolute -bottom-0.5 h-1 w-4 sm:w-5 rounded-full bg-sunset-orange shadow-sm shadow-sunset-orange/50"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
