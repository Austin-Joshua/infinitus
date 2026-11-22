'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useReducedMotion } from 'framer-motion';
import { formatEventDate, eventHref } from '@/lib/format';
import { COPY } from '@/lib/site';
import { EventPoster, ExternalArrow } from '@/components/ui/EventCard';
import { playClick } from '@/lib/soundEffects';

const AUTO_PLAY_INTERVAL = 4000;

export default function FeaturedEventsSlider({
  events = [],
  autoplayInterval = AUTO_PLAY_INTERVAL,
}) {
  const count = events.length;

  // Clone last event at start and first event at end for seamless circular wrap
  // slides layout: [events[count - 1], events[0], events[1], ..., events[count - 1], events[0]]
  const slides = useMemo(() => {
    if (count <= 1) return events;
    return [events[count - 1], ...events, events[0]];
  }, [events, count]);

  // Track active index in slides array (index 1 corresponds to events[0])
  const [activeSlideIndex, setActiveSlideIndex] = useState(count > 1 ? 1 : 0);
  const [withTransition, setWithTransition] = useState(true);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const containerRef = useRef(null);
  const pauseTimerRef = useRef(null);
  const isTransitioningRef = useRef(false);
  const wheelDeltaRef = useRef(0);
  const wheelCooldownRef = useRef(false);
  const touchStartRef = useRef({ x: 0, y: 0 });
  const isTouchingRef = useRef(false);
  const pointerStartRef = useRef({ x: 0, y: 0, active: false });
  const hasDraggedRef = useRef(false);
  const reduce = useReducedMotion();

  // Active event index in the original events array (0 .. count - 1)
  const currentEventIndex = useMemo(() => {
    if (count <= 1) return 0;
    if (activeSlideIndex === 0) return count - 1;
    if (activeSlideIndex === count + 1) return 0;
    return activeSlideIndex - 1;
  }, [activeSlideIndex, count]);

  // Temporarily pause auto-advance when user interacts
  const suspendAutoplay = useCallback(() => {
    setIsPaused(true);
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    pauseTimerRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 10000); // 10s of undisturbed viewing
  }, []);

  // Slide navigation
  const next = useCallback(() => {
    if (count <= 1 || isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    suspendAutoplay();
    setWithTransition(true);
    playClick();
    setActiveSlideIndex((prev) => prev + 1);
  }, [count, suspendAutoplay]);

  const prev = useCallback(() => {
    if (count <= 1 || isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    suspendAutoplay();
    setWithTransition(true);
    playClick();
    setActiveSlideIndex((prev) => prev - 1);
  }, [count, suspendAutoplay]);

  const goToEvent = useCallback(
    (targetIndex) => {
      if (count <= 1 || isTransitioningRef.current) return;
      suspendAutoplay();
      setWithTransition(true);
      playClick();
      setActiveSlideIndex(targetIndex + 1);
    },
    [count, suspendAutoplay]
  );

  // Seamless wrap-around when reaching cloned boundary slides
  const handleTransitionEnd = (e) => {
    if (e.target !== e.currentTarget || e.propertyName !== 'transform') return;
    isTransitioningRef.current = false;

    if (count > 1) {
      if (activeSlideIndex >= count + 1) {
        // Instant silent wrap to real first slide
        setWithTransition(false);
        setActiveSlideIndex(1);
      } else if (activeSlideIndex <= 0) {
        // Instant silent wrap to real last slide
        setWithTransition(false);
        setActiveSlideIndex(count);
      }
    }
  };

  // Re-enable smooth transition immediately after instant wrap
  useEffect(() => {
    if (!withTransition) {
      const raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setWithTransition(true);
        });
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [withTransition]);

  // Autoplay loop
  useEffect(() => {
    if (count <= 1 || isPaused || reduce) return undefined;
    const timer = setInterval(() => {
      if (!isTransitioningRef.current && !isDragging) {
        isTransitioningRef.current = true;
        setWithTransition(true);
        setActiveSlideIndex((prev) => prev + 1);
      }
    }, autoplayInterval);
    return () => clearInterval(timer);
  }, [count, isPaused, reduce, autoplayInterval, isDragging]);

  useEffect(() => {
    return () => {
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    };
  }, []);

  // Desktop Two-Finger Trackpad Horizontal Gesture
  useEffect(() => {
    const el = containerRef.current;
    if (!el || count <= 1) return;

    let resetTimer = null;
    const handleWheel = (e) => {
      // Detect dominant horizontal two-finger trackpad intent
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 6) {
        e.preventDefault();
        suspendAutoplay();

        if (wheelCooldownRef.current || isTransitioningRef.current) return;

        wheelDeltaRef.current += e.deltaX;

        // Provide real-time elastic movement while swiping
        const liveOffset = -Math.sign(wheelDeltaRef.current) * Math.min(Math.abs(wheelDeltaRef.current) * 0.7, 75);
        setDragOffset(liveOffset);

        if (wheelDeltaRef.current > 35) {
          // Two-finger swipe left -> Next event
          wheelCooldownRef.current = true;
          wheelDeltaRef.current = 0;
          setDragOffset(0);
          next();
          setTimeout(() => {
            wheelCooldownRef.current = false;
          }, 360);
        } else if (wheelDeltaRef.current < -35) {
          // Two-finger swipe right -> Previous event
          wheelCooldownRef.current = true;
          wheelDeltaRef.current = 0;
          setDragOffset(0);
          prev();
          setTimeout(() => {
            wheelCooldownRef.current = false;
          }, 360);
        }

        if (resetTimer) clearTimeout(resetTimer);
        resetTimer = setTimeout(() => {
          wheelDeltaRef.current = 0;
          setDragOffset(0);
        }, 120);
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', handleWheel);
      if (resetTimer) clearTimeout(resetTimer);
    };
  }, [count, next, prev, suspendAutoplay]);

  // Multi-Touch Events for Tablet & Mobile (supports 1-finger AND 2-finger drag)
  const getTouchCoords = (e) => {
    if (!e.touches || e.touches.length === 0) return { x: 0, y: 0 };
    if (e.touches.length >= 2) {
      // 2-finger gesture: track centroid between both contact points
      return {
        x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
        y: (e.touches[0].clientY + e.touches[1].clientY) / 2,
      };
    }
    return {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  const handleTouchStart = (e) => {
    if (count <= 1 || isTransitioningRef.current) return;
    if (e.touches.length > 2) return;
    const coords = getTouchCoords(e);
    touchStartRef.current = coords;
    isTouchingRef.current = true;
    hasDraggedRef.current = false;
    setIsDragging(true);
    setWithTransition(false);
    suspendAutoplay();
  };

  const handleTouchMove = (e) => {
    if (!isTouchingRef.current) return;
    const coords = getTouchCoords(e);
    const diffX = coords.x - touchStartRef.current.x;
    const diffY = coords.y - touchStartRef.current.y;

    if (Math.abs(diffX) > Math.abs(diffY)) {
      if (e.cancelable) e.preventDefault();
      hasDraggedRef.current = true;
      setDragOffset(diffX);
    }
  };

  const handleTouchEnd = () => {
    if (!isTouchingRef.current) return;
    isTouchingRef.current = false;
    setIsDragging(false);
    setWithTransition(true);

    const threshold = 40;
    const offset = dragOffset;
    setDragOffset(0);

    if (offset < -threshold) {
      next();
    } else if (offset > threshold) {
      prev();
    }
  };

  // Mouse Drag Support for Desktop
  const handlePointerDown = (e) => {
    if (count <= 1 || e.pointerType === 'touch') return;
    if (e.button !== 0) return;
    if (e.target.closest('a, button, input')) return;
    if (isTransitioningRef.current) return;

    pointerStartRef.current = { x: e.clientX, y: e.clientY, active: true };
    hasDraggedRef.current = false;
    setIsDragging(true);
    setWithTransition(false);
    suspendAutoplay();
  };

  const handlePointerMove = (e) => {
    if (!pointerStartRef.current.active) return;
    const diffX = e.clientX - pointerStartRef.current.x;
    if (Math.abs(diffX) > 6) {
      hasDraggedRef.current = true;
    }
    setDragOffset(diffX);
  };

  const handlePointerUp = () => {
    if (!pointerStartRef.current.active) return;
    pointerStartRef.current.active = false;
    setIsDragging(false);
    setWithTransition(true);

    const threshold = 45;
    const offset = dragOffset;
    setDragOffset(0);

    if (offset < -threshold) {
      next();
    } else if (offset > threshold) {
      prev();
    }
  };

  // Prevent link click when user dragged the card
  const handleClickCapture = (e) => {
    if (hasDraggedRef.current) {
      e.preventDefault();
      e.stopPropagation();
      hasDraggedRef.current = false;
    }
  };

  // Keyboard accessibility
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      prev();
    } else if (e.key === 'ArrowRight') {
      next();
    }
  };

  if (!events || count === 0) return null;

  return (
    <div
      className="relative select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured events slideshow"
    >
      {/* Previous Arrow Button on the Left */}
      <button
        type="button"
        onClick={prev}
        aria-label="Previous event"
        className="absolute left-1 sm:-left-5 lg:-left-6 top-1/2 -translate-y-1/2 z-30 flex h-9 w-9 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-sunset-orange/40 bg-card text-fg shadow-xl shadow-sunset-orange/15 transition-all duration-200 hover:scale-110 hover:border-sunset-orange hover:bg-sunset-orange hover:text-white active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunset-orange cursor-pointer"
      >
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" stroke="currentColor" className="h-4 w-4 sm:h-5 sm:w-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Next Arrow Button on the Right */}
      <button
        type="button"
        onClick={next}
        aria-label="Next event"
        className="absolute right-1 sm:-right-5 lg:-right-6 top-1/2 -translate-y-1/2 z-30 flex h-9 w-9 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-sunset-orange/40 bg-card text-fg shadow-xl shadow-sunset-orange/15 transition-all duration-200 hover:scale-110 hover:border-sunset-orange hover:bg-sunset-orange hover:text-white active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunset-orange cursor-pointer"
      >
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" stroke="currentColor" className="h-4 w-4 sm:h-5 sm:w-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Main Large Card Container */}
      <div
        ref={containerRef}
        className="card overflow-hidden rounded-2xl border border-sunset-orange/30 bg-card shadow-2xl relative select-none touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onClickCapture={handleClickCapture}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        {/* Continuous Horizontal Strip */}
        <div
          className="flex w-full will-change-transform"
          style={{
            transform: `translate3d(calc(-${activeSlideIndex * 100}% + ${dragOffset}px), 0, 0)`,
            transition: !withTransition || isDragging
              ? 'none'
              : 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {slides.map((ev, index) => {
            const rawIndex = (index - 1 + count) % count;
            return (
              <article
                key={`${ev.id}-${index}`}
                className="flex flex-col md:flex-row items-center p-5 sm:p-7 md:p-8 lg:p-9 gap-6 sm:gap-8 lg:gap-12 w-full shrink-0"
              >
                {/* Poster Frame */}
                <Link
                  href={eventHref(ev)}
                  prefetch={true}
                  tabIndex={-1}
                  aria-hidden="true"
                  className="relative shrink-0 w-full max-w-[280px] sm:max-w-[320px] md:w-[280px] lg:w-[320px] aspect-[4/5] overflow-hidden rounded-xl border border-fg/15 shadow-md bg-bg transition-transform duration-500 ease-out hover:scale-[1.02] hover:border-accent/40"
                >
                  <EventPoster
                    event={ev}
                    sizes="(min-width: 1024px) 320px, (min-width: 768px) 280px, 100vw"
                    fit="cover"
                    priority={index === 1}
                    className="h-full w-full object-cover object-top pointer-events-none"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 hover:opacity-100" />
                </Link>

                {/* Content Details */}
                <div className="flex flex-1 flex-col justify-center min-w-0 w-full">
                  {/* Header Badges & Slide Counter */}
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex flex-wrap gap-2">
                      {ev.status === 'upcoming' ? (
                        ev.registrationFormUrl ? (
                          <span className="chip border-emerald-500/40 text-emerald-600 dark:text-emerald-400 font-semibold">
                            Online Reg
                          </span>
                        ) : (
                          <span className="chip border-sunset/40 text-sunset font-semibold">
                            On-Spot Reg
                          </span>
                        )
                      ) : (
                        <span className="chip border-sunset/40 text-sunset font-semibold">
                          {COPY.events.featuredLabel}
                        </span>
                      )}
                      {ev.eventType && (
                        <span className="chip font-medium">{ev.eventType}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-sunset-orange">
                        {String(rawIndex + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="mt-3 sm:mt-4 font-heading text-2xl font-bold leading-tight tracking-tight text-fg sm:text-3xl lg:text-4xl">
                    <Link href={eventHref(ev)} prefetch={true} className="transition-colors hover:text-accent">
                      {ev.title}
                    </Link>
                  </h2>

                  {/* Date & Venue */}
                  <p className="mt-2.5 font-mono text-xs sm:text-sm text-accent font-medium">
                    {formatEventDate(ev.eventDate, ev.endDate)}
                    {ev.venue ? ` · ${ev.venue}` : ''}
                  </p>

                  {/* Description */}
                  {ev.description && (
                    <p className="lede mt-3 max-w-2xl text-xs sm:text-sm leading-relaxed text-muted line-clamp-3">
                      {ev.description}
                    </p>
                  )}

                  {/* Highlights */}
                  {ev.highlights?.length > 0 && (
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {ev.highlights.map((h) => (
                        <li
                          key={h}
                          className="rounded-lg border border-fg/15 bg-bg/50 px-3 py-1.5 text-xs sm:text-sm font-medium text-fg"
                        >
                          {h}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Action Buttons */}
                  <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3">
                    <Link href={eventHref(ev)} prefetch={true} className="btn-primary text-xs sm:text-sm">
                      {ev.status === 'upcoming' && ev.registrationFormUrl ? 'Register online' : COPY.events.details}{' '}
                      <span aria-hidden="true" className="nudge">→</span>
                    </Link>
                    {ev.status === 'upcoming' && !ev.registrationFormUrl && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-sunset-orange/30 bg-sunset-orange/10 px-3 py-1.5 text-xs font-mono font-medium text-sunset-orange">
                        <span className="h-1.5 w-1.5 rounded-full bg-sunset-orange animate-pulse" />
                        On-Spot Registration
                      </span>
                    )}
                    {ev.externalLink && (
                      <a
                        href={ev.externalLink}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="btn-ghost text-xs sm:text-sm"
                      >
                        {COPY.events.viewPost} <ExternalArrow />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Bottom Centered Pagination Dots */}
        <div className="border-t border-fg/10 bg-bg-2/30 px-5 sm:px-8 py-3.5 flex items-center justify-center">
          <div className="flex items-center gap-2">
            {events.map((ev, idx) => {
              const active = idx === currentEventIndex;
              return (
                <button
                  key={ev.id}
                  type="button"
                  onClick={() => goToEvent(idx)}
                  aria-label={`Go to event ${idx + 1}: ${ev.title}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    active
                      ? 'w-8 bg-sunset-orange shadow-sm shadow-sunset-orange/50'
                      : 'w-2 bg-fg/20 hover:bg-fg/40'
                  }`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
