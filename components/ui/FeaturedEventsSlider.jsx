'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { formatEventDate, eventHref } from '@/lib/format';
import { COPY } from '@/lib/site';
import { EventPoster, ExternalArrow } from '@/components/ui/EventCard';

// Increased slider speed: 3.2 seconds per slide (brisk, engaging, and dynamic)
const AUTO_PLAY_INTERVAL = 3200;

export default function FeaturedEventsSlider({
  events = [],
  autoplayInterval = AUTO_PLAY_INTERVAL,
}) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const pauseTimerRef = useRef(null);
  const reduce = useReducedMotion();

  const count = events.length;

  // Temporarily pause auto-advance when user actively navigates so it doesn't fight them
  const suspendAutoplay = useCallback(() => {
    setIsPaused(true);
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    pauseTimerRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 10000); // 10s of peaceful reading before resuming
  }, []);

  const goTo = useCallback(
    (index, newDirection = 1, userInitiated = false) => {
      if (count === 0) return;
      if (userInitiated) suspendAutoplay();
      setDirection(newDirection);
      setCurrent((index + count) % count);
    },
    [count, suspendAutoplay]
  );

  const prev = useCallback(() => {
    goTo(current - 1, -1, true);
  }, [current, goTo]);

  const next = useCallback(() => {
    goTo(current + 1, 1, true);
  }, [current, goTo]);

  // Slideshow auto-advance timer with user-friendly pause
  useEffect(() => {
    if (count <= 1 || isPaused || reduce) return undefined;
    const timer = setInterval(() => {
      goTo(current + 1, 1, false);
    }, autoplayInterval);
    return () => clearInterval(timer);
  }, [count, current, isPaused, reduce, autoplayInterval, goTo]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    };
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      prev();
    } else if (e.key === 'ArrowRight') {
      next();
    }
  };

  if (!events || events.length === 0) return null;

  const activeEvent = events[current];

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
        className="absolute left-1 sm:-left-5 lg:-left-6 top-1/2 -translate-y-1/2 z-30 flex h-9 w-9 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-sunset-orange/40 bg-card text-fg shadow-xl shadow-sunset-orange/15 transition-all duration-200 hover:scale-110 hover:border-sunset-orange hover:bg-sunset-orange hover:text-white active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunset-orange"
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
        className="absolute right-1 sm:-right-5 lg:-right-6 top-1/2 -translate-y-1/2 z-30 flex h-9 w-9 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-sunset-orange/40 bg-card text-fg shadow-xl shadow-sunset-orange/15 transition-all duration-200 hover:scale-110 hover:border-sunset-orange hover:bg-sunset-orange hover:text-white active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunset-orange"
      >
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" stroke="currentColor" className="h-4 w-4 sm:h-5 sm:w-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Main Large Card Container */}
      <div className="card overflow-hidden rounded-2xl border border-sunset-orange/30 bg-card shadow-2xl">
        <AnimatePresence initial={false} custom={direction}>
          <motion.article
            key={activeEvent.id}
            custom={direction}
            initial={{ opacity: 0, x: direction * 48 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -direction * 48 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            dragMomentum={false}
            onDragStart={suspendAutoplay}
            onDragEnd={(e, { offset, velocity }) => {
              const swipeConfidenceThreshold = 30;
              const swipeVelocityThreshold = 200;
              if (offset.x < -swipeConfidenceThreshold || velocity.x < -swipeVelocityThreshold) {
                next();
              } else if (offset.x > swipeConfidenceThreshold || velocity.x > swipeVelocityThreshold) {
                prev();
              }
            }}
            className="flex flex-col md:flex-row items-center p-5 sm:p-7 md:p-8 lg:p-9 gap-6 sm:gap-8 lg:gap-12 cursor-grab active:cursor-grabbing"
          >
            {/* Poster Frame */}
            <Link
              href={eventHref(activeEvent)}
              tabIndex={-1}
              aria-hidden="true"
              className="relative shrink-0 w-full max-w-[280px] sm:max-w-[320px] md:w-[280px] lg:w-[320px] aspect-[4/5] overflow-hidden rounded-xl border border-fg/15 shadow-md bg-bg transition-transform duration-500 ease-out hover:scale-[1.02] hover:border-accent/40"
            >
              <EventPoster
                event={activeEvent}
                sizes="(min-width: 1024px) 320px, (min-width: 768px) 280px, 100vw"
                fit="cover"
                priority={current === 0}
                className="h-full w-full object-cover object-top pointer-events-none"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 hover:opacity-100" />
            </Link>

            {/* Content Details */}
            <div className="flex flex-1 flex-col justify-center min-w-0 w-full">
              {/* Header Badges & Slide Counter */}
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex flex-wrap gap-2">
                  <span className="chip border-sunset/40 text-sunset font-semibold">
                    {COPY.events.featuredLabel}
                  </span>
                  {activeEvent.eventType && (
                    <span className="chip font-medium">{activeEvent.eventType}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-semibold text-sunset-orange">
                    {String(current + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
                  </span>
                </div>
              </div>

              {/* Title */}
              <h2 className="mt-3 sm:mt-4 font-heading text-2xl font-bold leading-tight tracking-tight text-fg sm:text-3xl lg:text-4xl">
                <Link href={eventHref(activeEvent)} className="transition-colors hover:text-accent">
                  {activeEvent.title}
                </Link>
              </h2>

              {/* Date & Venue */}
              <p className="mt-2.5 font-mono text-xs sm:text-sm text-accent font-medium">
                {formatEventDate(activeEvent.eventDate, activeEvent.endDate)}
                {activeEvent.venue ? ` · ${activeEvent.venue}` : ''}
              </p>

              {/* Description */}
              {activeEvent.description && (
                <p className="lede mt-3 max-w-2xl text-xs sm:text-sm leading-relaxed text-muted line-clamp-3">
                  {activeEvent.description}
                </p>
              )}

              {/* Highlights */}
              {activeEvent.highlights?.length > 0 && (
                <ul className="mt-5 flex flex-wrap gap-2">
                  {activeEvent.highlights.map((h) => (
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
                <Link href={eventHref(activeEvent)} className="btn-primary text-xs sm:text-sm">
                  {COPY.events.details} <span aria-hidden="true" className="nudge">→</span>
                </Link>
                {activeEvent.externalLink && (
                  <a
                    href={activeEvent.externalLink}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="btn-ghost text-xs sm:text-sm"
                  >
                    {COPY.events.viewPost} <ExternalArrow />
                  </a>
                )}
              </div>
            </div>
          </motion.article>
        </AnimatePresence>

        {/* Bottom Centered Pagination Dots (Without auto-playing status toggle) */}
        <div className="border-t border-fg/10 bg-bg-2/30 px-5 sm:px-8 py-3.5 flex items-center justify-center">
          <div className="flex items-center gap-2">
            {events.map((ev, idx) => {
              const active = idx === current;
              return (
                <button
                  key={ev.id}
                  type="button"
                  onClick={() => goTo(idx, idx > current ? 1 : -1, true)}
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
