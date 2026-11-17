'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
} from 'framer-motion';
import InfinitusLogo from '@/components/brand/InfinitusLogo';
import RitLogo from '@/components/brand/RitLogo';
import { useTheme } from '@/components/ui/ThemeProvider';
import { EASE } from '@/lib/motion';
import { CLUB_SHORT, COPY, NAV_LINKS, SOCIAL, SITE } from '@/lib/site';

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

const NAV_ICONS = {
  home: HomeNavIcon,
  about: AboutNavIcon,
  events: EventsNavIcon,
  team: TeamNavIcon,
  gallery: GalleryNavIcon,
  contact: ContactNavIcon,
};

export default function Nav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isFocusedWithin, setIsFocusedWithin] = useState(false);
  const reduce = useReducedMotion();
  const { isDark, toggleTheme } = useTheme();
  const menuBtnRef = useRef(null);
  const mobileNavRef = useRef(null);

  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });

  // Always sticky and visible: elevates with border and backdrop-blur once scrolled
  useMotionValueEvent(scrollY, 'change', (y) => {
    setScrolled(y > 16);
  });

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Auto-close mobile drawer when screen is resized to tablet/desktop breakpoint
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const mql = window.matchMedia('(min-width: 768px)');
    const handleBreakpointChange = (e) => {
      if (e.matches) {
        setMenuOpen(false);
      }
    };
    mql.addEventListener('change', handleBreakpointChange);
    return () => mql.removeEventListener('change', handleBreakpointChange);
  }, []);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        menuBtnRef.current?.focus();
        return;
      }
      if (event.key === 'Tab' && mobileNavRef.current) {
        const focusable = mobileNavRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [menuOpen]);

  const solid = scrolled || menuOpen;

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-gradient-to-r from-accent via-sunset to-accent"
        style={{ scaleX: progress }}
      />

      <motion.header
        className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${
          solid ? 'border-sunset-orange/20 bg-bg/85 backdrop-blur-xl shadow-md shadow-sunset-orange/5' : 'border-transparent bg-transparent'
        }`}
        onFocusCapture={() => setIsFocusedWithin(true)}
        onBlurCapture={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) {
            setIsFocusedWithin(false);
          }
        }}
      >
        <div className="container-x flex h-14 sm:h-16 items-center justify-between gap-2.5 sm:gap-4">
          {/* Dual Branding: Infinitus Logo + College Logo */}
          <Link href="/" className="group flex items-center gap-2 sm:gap-3" aria-label={COPY.brand.homeAriaLabel}>
            <span className="transition-transform duration-700 ease-out group-hover:rotate-[360deg] shrink-0">
              <InfinitusLogo size="nav" priority className="h-8 w-8 sm:h-9 sm:w-9" />
            </span>
            <span className="h-4 sm:h-5 w-px bg-fg/20 shrink-0" aria-hidden="true" />
            <span className="shrink-0">
              <RitLogo size="xs" className="opacity-95 transition-opacity group-hover:opacity-100" />
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav aria-label="Primary" className="hidden items-center gap-1.5 md:flex">
            {MAIN_NAV.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={`relative rounded-xl px-3.5 py-2 text-sm font-medium transition-colors ${
                    active ? 'text-sunset-orange font-semibold' : 'text-muted hover:text-fg'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 -z-10 rounded-xl border border-sunset-orange/60 bg-card/85 backdrop-blur-md shadow-sm shadow-sunset-orange/20"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  {item.navLabel}
                </Link>
              );
            })}
          </nav>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2">
            <a
              href={SOCIAL.instagram}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={`Follow INFINITUS on Instagram (${SOCIAL.instagramHandle})`}
              title="Instagram @infinitus_club.rit"
              className="relative hidden sm:flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-sunset-orange/35 bg-card/75 text-fg shadow-sm shadow-sunset-orange/10 backdrop-blur-md transition-all duration-200 hover:border-sunset-orange/80 hover:bg-card hover:shadow-md hover:shadow-sunset-orange/25 hover:scale-105 hover:text-sunset-orange active:scale-95"
            >
              <InstagramNavIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            </a>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              title={isDark ? 'Light mode' : 'Dark mode'}
              className="relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-sunset-orange/35 bg-card/75 text-fg shadow-sm shadow-sunset-orange/10 backdrop-blur-md transition-all duration-200 hover:border-sunset-orange/80 hover:bg-card hover:shadow-md hover:shadow-sunset-orange/25 hover:scale-105 hover:text-sunset-orange active:scale-95"
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
                aria-current={isActive(pathname, CONTACT_LINK.href) ? 'page' : undefined}
                className="btn-primary hidden !rounded-full !px-4 !py-2 text-xs font-semibold sm:inline-flex"
              >
                {CONTACT_LINK.navLabel} <span aria-hidden="true" className="nudge">→</span>
              </Link>
            )}

            <button
              ref={menuBtnRef}
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav-menu"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-sunset-orange/35 bg-card/75 text-fg shadow-sm shadow-sunset-orange/10 backdrop-blur-md transition-all duration-200 hover:border-sunset-orange/80 hover:bg-card hover:shadow-md hover:shadow-sunset-orange/25 hover:scale-105 hover:text-sunset-orange active:scale-95 md:hidden"
            >
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.75" className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true">
                <motion.path
                  stroke="currentColor"
                  strokeLinecap="round"
                  initial={false}
                  animate={{ d: menuOpen ? 'M6 6L18 18' : 'M4 8L20 8' }}
                  transition={{ duration: 0.25 }}
                />
                <motion.path
                  stroke="currentColor"
                  strokeLinecap="round"
                  initial={false}
                  animate={{ d: menuOpen ? 'M6 18L18 6' : 'M4 16L20 16' }}
                  transition={{ duration: 0.25 }}
                />
              </svg>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Native App-Style Mobile Drawer Navigation */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            ref={mobileNavRef}
            id="mobile-nav-menu"
            aria-label="Primary mobile"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: reduce ? 0 : 0.22, ease: EASE.out }}
            className="fixed inset-x-0 bottom-0 top-14 sm:top-16 z-40 flex flex-col justify-between overflow-y-auto bg-bg/95 dark:bg-bg/98 backdrop-blur-2xl p-4 sm:p-6 md:hidden border-t border-fg/10"
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between px-2 pt-1 pb-1.5">
                <span className="font-mono text-[11px] uppercase tracking-wider text-muted">
                  Menu
                </span>
                <span className="chip border-sunset-orange/30 text-sunset-orange text-[10px] font-semibold py-0.5 px-2">
                  {CLUB_SHORT} CLUB
                </span>
              </div>
              <ul className="flex flex-col gap-1.5 mt-1">
                {NAV_LINKS.map((item, i) => {
                  const active = isActive(pathname, item.href);
                  const Icon = NAV_ICONS[item.id] || HomeNavIcon;
                  return (
                    <motion.li
                      key={item.id}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.04 * i, duration: 0.25, ease: EASE.out }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setMenuOpen(false)}
                        aria-current={active ? 'page' : undefined}
                        className={`group flex items-center justify-between rounded-xl px-3.5 py-3 font-heading text-base font-semibold transition-all duration-200 active:scale-[0.98] ${
                          active
                            ? 'border border-sunset-orange/60 bg-card/90 text-sunset-orange shadow-md shadow-sunset-orange/20 backdrop-blur-md'
                            : 'text-fg hover:bg-fg/5 hover:text-accent'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                              active
                                ? 'bg-sunset-orange/15 text-sunset-orange'
                                : 'bg-fg/5 text-muted group-hover:bg-accent/10 group-hover:text-accent'
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                          </span>
                          <span>{item.navLabel}</span>
                        </div>
                        <span
                          aria-hidden="true"
                          className={`text-xs transition-transform duration-200 ${
                            active ? 'text-sunset-orange translate-x-0.5' : 'text-muted group-hover:translate-x-1 group-hover:text-accent'
                          }`}
                        >
                          →
                        </span>
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
            </div>

            {/* Mobile Footer Quick Actions & Links */}
            <div className="mt-6 border-t border-fg/10 pt-4 flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={SOCIAL.instagram}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex items-center justify-center gap-2 rounded-xl border border-sunset-orange/30 bg-card/80 py-2.5 px-3 text-xs font-semibold text-fg backdrop-blur-md transition-all hover:border-sunset-orange hover:text-sunset-orange active:scale-95"
                >
                  <InstagramNavIcon className="h-4 w-4 text-sunset-orange" />
                  <span>Instagram</span>
                </a>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="flex items-center justify-center gap-2 rounded-xl border border-sunset-orange/30 bg-card/80 py-2.5 px-3 text-xs font-semibold text-fg backdrop-blur-md transition-all hover:border-sunset-orange hover:text-sunset-orange active:scale-95"
                >
                  {isDark ? <SunIcon className="h-4 w-4 text-sunset-orange" /> : <MoonIcon className="h-4 w-4 text-sunset-orange" />}
                  <span>{isDark ? 'Light' : 'Dark'} Mode</span>
                </button>
              </div>

              <a
                href={SOCIAL.queriesForm}
                target="_blank"
                rel="noreferrer noopener"
                className="btn-primary w-full text-center text-xs sm:text-sm font-semibold !py-3 justify-center"
              >
                Queries & Feedback Form <span aria-hidden="true" className="nudge-ne">↗</span>
              </a>

              <div className="flex items-center justify-between text-[11px] text-muted pt-1 px-1">
                <span className="truncate max-w-[180px]">{COLLEGE_NAME}</span>
                <a
                  href={`mailto:${SITE.contactEmail}`}
                  className="hover:text-accent font-mono transition-colors shrink-0"
                >
                  {SITE.contactEmail}
                </a>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
