'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from '@/components/ui/ThemeProvider';
import { buildSearchIndex, searchIndex, groupResults } from '@/lib/commandIndex';
import { generateGoogleCalendarUrl } from '@/lib/calendar';
import { playOpenModal, playCloseModal, playClick, toggleSound } from '@/lib/soundEffects';
import { EVENTS, MEMBERS } from '@/lib/data';

// Icons
function SearchIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" stroke="currentColor" {...props}>
      <circle cx="11" cy="11" r="7" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
    </svg>
  );
}

function CalendarIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.75" stroke="currentColor" {...props}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

function UserIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.75" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
    </svg>
  );
}

function CompassIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.75" stroke="currentColor" {...props}>
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="currentColor" fillOpacity="0.15" />
    </svg>
  );
}

function SparklesIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.75" stroke="currentColor" {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 2l1.9 4.6L18 8.5l-4.1 1.9L12 15l-1.9-4.6L6 8.5l4.1-1.9L12 2zM19 15l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9.9-2.1z"
      />
    </svg>
  );
}

function GraphIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.75" stroke="currentColor" {...props}>
      <circle cx="6" cy="6" r="3" />
      <circle cx="18" cy="8" r="3" />
      <circle cx="12" cy="18" r="3" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 7.5l7 1.5M7.5 8.5l3.5 7M16.5 10.5l-3.5 5" />
    </svg>
  );
}

function SunMoonIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.75" stroke="currentColor" {...props}>
      <circle cx="12" cy="12" r="4" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

function MathCurveIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.75" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 18c3-9 6-12 9-6s6 9 9-6" />
    </svg>
  );
}

function CopyIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.75" stroke="currentColor" {...props}>
      <rect x="9" y="9" width="13" height="13" rx="2" strokeLinecap="round" strokeLinejoin="round" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
  );
}

function ExternalIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.75" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
    </svg>
  );
}

function ArrowUpIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  );
}

function CloseIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function CheckIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function SpeakerSoundIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.75" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5L6 9H2v6h4l5 4V5z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );
}

// Renders matching substrings in bold/color
function HighlightMatch({ text, query }) {
  if (!text) return null;
  if (!query || !query.trim()) return <span>{text}</span>;

  const rawQuery = query.trim().toLowerCase();
  const index = text.toLowerCase().indexOf(rawQuery);

  if (index === -1) {
    return <span>{text}</span>;
  }

  const before = text.slice(0, index);
  const match = text.slice(index, index + rawQuery.length);
  const after = text.slice(index + rawQuery.length);

  return (
    <span>
      {before}
      <span className="font-semibold text-sunset-orange underline underline-offset-2">{match}</span>
      {after}
    </span>
  );
}

export default function CommandPalette() {
  const router = useRouter();
  const { toggleTheme } = useTheme();

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [toastMessage, setToastMessage] = useState(null);

  const inputRef = useRef(null);
  const listRef = useRef(null);
  const toastTimeoutRef = useRef(null);

  // Pre-index items once
  const allItems = useMemo(() => buildSearchIndex(EVENTS, MEMBERS), []);

  // Filtered & grouped items
  const results = useMemo(() => searchIndex(query, allItems, 30), [query, allItems]);
  const groupedResults = useMemo(() => groupResults(results), [results]);

  // Flattened ordered list for linear keyboard indexing
  const flatItems = useMemo(() => {
    const list = [];
    for (const group of groupedResults) {
      list.push(...group.items);
    }
    return list;
  }, [groupedResults]);

  // Keep active index in bounds
  useEffect(() => {
    if (activeIndex >= flatItems.length) {
      setActiveIndex(Math.max(0, flatItems.length - 1));
    }
  }, [flatItems.length, activeIndex]);

  // Open & Close handlers
  const openPalette = useCallback(() => {
    setIsOpen(true);
    setQuery('');
    setActiveIndex(0);
    playOpenModal();
  }, []);

  const closePalette = useCallback(() => {
    setIsOpen(false);
    setQuery('');
    playCloseModal();
  }, []);

  // Toast feedback helper
  const showToast = useCallback((msg) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(msg);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  }, []);

  // Action execution
  const executeItem = useCallback(
    (item) => {
      if (!item) return;

      playClick();

      // Handle custom actions
      if (item.action) {
        switch (item.action) {
          case 'toggle-theme':
            toggleTheme();
            showToast('Theme switched!');
            break;
          case 'toggle-sound': {
            const next = toggleSound();
            showToast(next ? 'Harmonic sound effects unmuted' : 'Harmonic sound effects muted');
            break;
          }
          case 'set-math-lorenz':
            window.dispatchEvent(new CustomEvent('infinitus:set-math-mode', { detail: 'lorenz' }));
            if (window.location.pathname !== '/') {
              router.push('/#hero-math-canvas');
            } else {
              document.getElementById('hero-math-canvas')?.scrollIntoView({ behavior: 'smooth' });
            }
            showToast('Simulating Lorenz Chaotic Attractor');
            break;
          case 'set-math-fourier':
            window.dispatchEvent(new CustomEvent('infinitus:set-math-mode', { detail: 'fourier' }));
            if (window.location.pathname !== '/') {
              router.push('/#hero-math-canvas');
            } else {
              document.getElementById('hero-math-canvas')?.scrollIntoView({ behavior: 'smooth' });
            }
            showToast('Simulating Fourier Lemniscate (∞)');
            break;
          case 'set-math-aizawa':
            window.dispatchEvent(new CustomEvent('infinitus:set-math-mode', { detail: 'aizawa' }));
            if (window.location.pathname !== '/') {
              router.push('/#hero-math-canvas');
            } else {
              document.getElementById('hero-math-canvas')?.scrollIntoView({ behavior: 'smooth' });
            }
            showToast('Simulating Aizawa Attractor');
            break;
          case 'copy-url':
            if (typeof navigator !== 'undefined' && navigator.clipboard) {
              navigator.clipboard.writeText(window.location.href);
              showToast('Link copied to clipboard!');
            }
            break;
          case 'sync-cal-ramanujan': {
            const ev = EVENTS.find((e) => e.id === 'ramanujan-reimagined');
            if (ev) {
              window.open(generateGoogleCalendarUrl(ev), '_blank', 'noopener,noreferrer');
              showToast('Opening Google Calendar sync...');
            }
            break;
          }
          case 'sync-cal-number-hunt': {
            const ev = EVENTS.find((e) => e.id === 'number-hunt');
            if (ev) {
              window.open(generateGoogleCalendarUrl(ev), '_blank', 'noopener,noreferrer');
              showToast('Opening Google Calendar sync...');
            }
            break;
          }
          case 'install-pwa':
            window.dispatchEvent(new CustomEvent('infinitus:trigger-pwa-install'));
            showToast('Prompting PWA installation...');
            break;
          case 'scroll-top':
            window.scrollTo({ top: 0, behavior: 'smooth' });
            break;
          default:
            break;
        }
        closePalette();
        return;
      }

      // Handle external or internal navigation
      if (item.href) {
        if (item.external) {
          window.open(item.href, '_blank', 'noopener,noreferrer');
        } else {
          router.push(item.href);
        }
        closePalette();
      }
    },
    [router, toggleTheme, closePalette, showToast]
  );

  // Global keyboard shortcuts (Cmd+K, Ctrl+K, '/')
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => {
          if (!prev) playOpenModal();
          else playCloseModal();
          return !prev;
        });
        return;
      }

      // Escape closes palette globally
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        closePalette();
        return;
      }

      // Quick slash trigger '/' when not inside an input
      if (e.key === '/' && !isOpen) {
        const tag = document.activeElement?.tagName?.toLowerCase();
        const isEditable = document.activeElement?.isContentEditable;
        if (tag !== 'input' && tag !== 'textarea' && tag !== 'select' && !isEditable) {
          e.preventDefault();
          openPalette();
        }
      }
    };

    const handleCustomOpen = () => openPalette();

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('infinitus:open-command-palette', handleCustomOpen);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('infinitus:open-command-palette', handleCustomOpen);
    };
  }, [isOpen, openPalette]);

  // Modal dialog navigation & focus trap
  const handleModalKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      closePalette();
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (flatItems.length > 0 ? (prev + 1) % flatItems.length : 0));
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) =>
        flatItems.length > 0 ? (prev - 1 + flatItems.length) % flatItems.length : 0
      );
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      if (flatItems[activeIndex]) {
        executeItem(flatItems[activeIndex]);
      }
    }
  };

  // Scroll active item into view
  useEffect(() => {
    if (!isOpen) return;
    const activeEl = listRef.current?.querySelector(`[data-index="${activeIndex}"]`);
    if (activeEl) {
      activeEl.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex, isOpen]);

  // Lock body scroll and focus input when opened
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden');
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isOpen]);

  // Helper to render icon by type
  const renderItemIcon = (item) => {
    switch (item.icon) {
      case 'home':
      case 'about':
      case 'contact':
        return <CompassIcon className="h-4 w-4" />;
      case 'events':
      case 'calendar':
      case 'archive':
        return <CalendarIcon className="h-4 w-4" />;
      case 'graph':
        return <GraphIcon className="h-4 w-4" />;
      case 'team':
      case 'user':
        return <UserIcon className="h-4 w-4" />;
      case 'theme':
        return <SunMoonIcon className="h-4 w-4" />;
      case 'sound':
        return <SpeakerSoundIcon className="h-4 w-4" />;
      case 'math':
        return <MathCurveIcon className="h-4 w-4" />;
      case 'copy':
        return <CopyIcon className="h-4 w-4" />;
      case 'arrow-up':
        return <ArrowUpIcon className="h-4 w-4" />;
      default:
        return item.external ? <ExternalIcon className="h-4 w-4" /> : <SparklesIcon className="h-4 w-4" />;
    }
  };

  return (
    <>
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            data-testid="command-palette-toast"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-[120] flex items-center gap-2 rounded-xl border border-sunset-orange/40 bg-card px-4 py-2.5 shadow-xl"
          >
            <CheckIcon className="h-4 w-4 text-sunset-orange" />
            <span className="font-mono text-xs font-semibold text-fg">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Dialog */}
      <AnimatePresence>
        {isOpen && (
          <div
            className="fixed inset-0 z-[100] flex items-start justify-center p-3 sm:p-4 pt-[8vh] sm:pt-[12vh]"
            role="dialog"
            aria-modal="true"
            aria-label="INFINITUS Command Palette & Quick Search"
            data-testid="command-palette-modal"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 bg-black/60 dark:bg-black/75 backdrop-blur-md"
              onClick={closePalette}
              aria-hidden="true"
            />

            {/* Dialog Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -8 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-sunset-orange/30 bg-[#FBF8F2] dark:bg-[#0D0F17] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5),0_0_40px_rgba(255,107,0,0.12)] text-fg"
              onKeyDown={handleModalKeyDown}
            >
              {/* Header & Search Bar */}
              <div className="relative flex items-center border-b border-border/80 px-4 py-3 sm:py-3.5">
                <SearchIcon className="h-5 w-5 text-sunset-orange shrink-0 mr-3" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setActiveIndex(0);
                  }}
                  placeholder="Search events, team, math topics, or run an action..."
                  aria-label="Search events, team and actions"
                  data-testid="command-palette-input"
                  className="w-full bg-transparent font-sans text-sm sm:text-base text-fg placeholder:text-muted/60 focus:outline-none"
                />

                {query && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery('');
                      inputRef.current?.focus();
                    }}
                    aria-label="Clear search query"
                    className="mr-2 p-1 text-muted hover:text-fg transition-colors"
                  >
                    <CloseIcon className="h-4 w-4" />
                  </button>
                )}

                <kbd
                  onClick={closePalette}
                  className="hidden sm:inline-flex cursor-pointer items-center justify-center rounded border border-border bg-card px-2 py-0.5 font-mono text-[11px] text-muted hover:text-fg transition-colors shadow-sm"
                >
                  ESC
                </kbd>
                <button
                  type="button"
                  onClick={closePalette}
                  aria-label="Close command palette"
                  className="sm:hidden p-1 text-muted hover:text-fg transition-colors ml-1"
                >
                  <CloseIcon className="h-5 w-5" />
                </button>
              </div>

              {/* Scrollable Results List */}
              <div
                ref={listRef}
                className="max-h-[60vh] sm:max-h-[52vh] overflow-y-auto p-2 divide-y divide-border/40"
                role="listbox"
                aria-label="Search suggestions and results"
              >
                {flatItems.length === 0 ? (
                  <div className="py-12 px-6 text-center">
                    <p className="font-mono text-sm text-muted">
                      No mathematical events, members, or actions match{' '}
                      <span className="font-semibold text-sunset-orange">&quot;{query}&quot;</span>
                    </p>
                    <p className="mt-2 text-xs text-muted/70">
                      Try searching for <span className="font-mono text-fg">Ramanujan</span>,{' '}
                      <span className="font-mono text-fg">Matrix</span>,{' '}
                      <span className="font-mono text-fg">Hackathon</span>, or{' '}
                      <span className="font-mono text-fg">President</span>.
                    </p>
                  </div>
                ) : (
                  groupedResults.map((group) => {
                    return (
                      <div key={group.key} className="py-1.5">
                        <div className="px-3 py-1 text-[11px] font-mono font-semibold uppercase tracking-wider text-muted">
                          {group.title} ({group.items.length})
                        </div>
                        <div className="mt-0.5 space-y-0.5">
                          {group.items.map((item) => {
                            const globalIndex = flatItems.indexOf(item);
                            const isSelected = globalIndex === activeIndex;

                            return (
                              <button
                                key={item.id}
                                type="button"
                                data-index={globalIndex}
                                role="option"
                                aria-selected={isSelected}
                                onClick={() => executeItem(item)}
                                onMouseEnter={() => setActiveIndex(globalIndex)}
                                className={`group flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left transition-all ${
                                  isSelected
                                    ? 'bg-sunset-orange/15 text-sunset-orange border-l-2 border-sunset-orange shadow-sm'
                                    : 'text-fg hover:bg-fg/5'
                                }`}
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <div
                                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                                      isSelected
                                        ? 'border-sunset-orange/60 bg-sunset-orange/20 text-sunset-orange'
                                        : 'border-border/60 bg-card text-muted group-hover:text-fg'
                                    }`}
                                  >
                                    {renderItemIcon(item)}
                                  </div>

                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                      <span className="truncate font-sans text-sm font-medium">
                                        <HighlightMatch text={item.title} query={query} />
                                      </span>
                                      {item.badge && (
                                        <span
                                          className={`shrink-0 rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold border ${
                                            item.badgeVariant === 'accent'
                                              ? 'border-accent/40 bg-accent/15 text-accent'
                                              : 'border-sunset-orange/30 bg-sunset-orange/10 text-sunset-orange'
                                          }`}
                                        >
                                          {item.badge}
                                        </span>
                                      )}
                                    </div>
                                    {item.subtitle && (
                                      <p className="truncate text-xs text-muted/80">
                                        <HighlightMatch text={item.subtitle} query={query} />
                                      </p>
                                    )}
                                  </div>
                                </div>

                                <div className="shrink-0 flex items-center gap-2">
                                  {isSelected && (
                                    <span className="hidden sm:inline-flex items-center gap-1 font-mono text-[10px] text-sunset-orange/80">
                                      <span>↵</span> Select
                                    </span>
                                  )}
                                  {item.external && <ExternalIcon className="h-3.5 w-3.5 text-muted" />}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Keyboard Navigation Cheatsheet Footer */}
              <div className="flex items-center justify-between border-t border-border/80 bg-card/60 px-4 py-2.5 font-mono text-[11px] text-muted">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <kbd className="rounded border border-border bg-card px-1.5 py-0.5 text-[10px]">↑</kbd>
                    <kbd className="rounded border border-border bg-card px-1.5 py-0.5 text-[10px]">↓</kbd>
                    <span className="hidden sm:inline ml-0.5">Navigate</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="rounded border border-border bg-card px-1.5 py-0.5 text-[10px]">↵</kbd>
                    <span className="hidden sm:inline ml-0.5">Select</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="rounded border border-border bg-card px-1.5 py-0.5 text-[10px]">ESC</kbd>
                    <span className="hidden sm:inline ml-0.5">Dismiss</span>
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-sunset-orange font-semibold">
                  <span>∞</span>
                  <span className="hidden sm:inline text-[10px] uppercase tracking-wider">Infinitus Command</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
