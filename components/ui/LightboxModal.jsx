'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';

/**
 * Reusable, Portal-mounted Fullscreen Immersive Lightbox Modal.
 *
 * Built for a native-app-quality experience across:
 * - iPhone (all notches, Dynamic Island, Home indicator bar)
 * - Android phones & foldables
 * - iPads & Android tablets
 * - Laptops & Desktops
 *
 * Guarantees:
 * - Direct portal mount to document.body.
 * - Entire screen covered with 100vw x 100vh solid black (#000000).
 * - When open, body.lightbox-open hides main, header, footer, and nav completely.
 * - Fluid swipe navigation, keyboard support (Escape, Left/Right), and tap-to-toggle UI.
 */
export default function LightboxModal({
  photos = [],
  index = null,
  onClose,
  onIndexChange,
}) {
  const [mounted, setMounted] = useState(false);
  const [internalIndex, setInternalIndex] = useState(index ?? 0);
  const [showUi, setShowUi] = useState(true);
  const [direction, setDirection] = useState(1);
  const dialogRef = useRef(null);

  // Swipe gesture tracking
  const pointerStartX = useRef(null);
  const pointerStartY = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const open = index !== null && photos.length > 0;
  const currentIndex = internalIndex;
  const current = open ? photos[currentIndex] || photos[0] : null;

  // Sync internal index when parent index prop changes
  useEffect(() => {
    if (index !== null) {
      setInternalIndex(index);
      setShowUi(true);
    }
  }, [index]);

  const step = useCallback(
    (delta) => {
      if (photos.length <= 1) return;
      setDirection(delta);
      const next = (currentIndex + delta + photos.length) % photos.length;
      setInternalIndex(next);
      onIndexChange?.(next);
    },
    [currentIndex, photos.length, onIndexChange]
  );

  // HTML & Body scroll lockdown & full-bleed page isolation
  useEffect(() => {
    if (!open) return undefined;

    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.body.classList.add('lightbox-open');
    document.documentElement.classList.add('lightbox-open');

    const onKey = (event) => {
      if (event.key === 'Escape') {
        onClose?.();
        return;
      }
      if (event.key === 'ArrowRight') {
        step(1);
        return;
      }
      if (event.key === 'ArrowLeft') {
        step(-1);
        return;
      }

      // Focus trap
      if (event.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll(
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

    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.classList.remove('lightbox-open');
      document.documentElement.classList.remove('lightbox-open');
    };
  }, [open, onClose, step]);

  // Universal pointer & touch swipe handler
  const handlePointerDown = (e) => {
    pointerStartX.current = e.clientX;
    pointerStartY.current = e.clientY;
  };

  const handlePointerUp = (e) => {
    if (pointerStartX.current === null) return;
    const diffX = pointerStartX.current - e.clientX;
    const diffY = pointerStartY.current !== null ? Math.abs(pointerStartY.current - e.clientY) : 0;
    // Register swipe if movement is predominantly horizontal and > 35px
    if (Math.abs(diffX) > 35 && Math.abs(diffX) > diffY) {
      if (diffX > 0) {
        step(1);
      } else {
        step(-1);
      }
    }
    pointerStartX.current = null;
    pointerStartY.current = null;
  };

  if (!mounted || typeof document === 'undefined') {
    return null;
  }

  const modalContent = (
    <AnimatePresence>
      {open && current && (
        <motion.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={current.caption || 'Image viewer'}
          className="fixed inset-0 top-0 left-0 right-0 bottom-0 z-[999999] h-screen h-[100dvh] w-screen w-full bg-black select-none overflow-hidden touch-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
        >
          {/* Top Bar with Description, Counter & Close Button (Overlaid at top with dark gradient, safe-area padded) */}
          <div
            className={`absolute top-0 inset-x-0 z-40 flex items-start justify-between px-4 sm:px-6 pt-3 pb-12 sm:pb-16 bg-gradient-to-b from-black/90 via-black/55 to-transparent transition-all duration-300 pointer-events-none ${
              showUi ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
            }`}
            style={{
              paddingTop: 'max(1rem, env(safe-area-inset-top, 1rem))',
            }}
          >
            <div className="flex flex-col min-w-0 pr-4 pointer-events-auto" onClick={(e) => e.stopPropagation()}>
              <h2 className="line-clamp-2 text-sm sm:text-base md:text-lg font-bold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] leading-tight">
                {current.caption}
              </h2>
              <div className="mt-1 flex items-center flex-wrap gap-x-2 text-xs font-mono text-white/85 drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
                {current.date && <span>{current.date}</span>}
                {photos.length > 1 && (
                  <span>
                    {current.date && '· '}
                    {currentIndex + 1} of {photos.length}
                  </span>
                )}
                <span className="text-white/60 text-[11px] hidden xs:inline">
                  · Tap image to {showUi ? 'hide' : 'show'} controls
                </span>
              </div>
            </div>

            {/* Native-style Frosted Close Button */}
            <button
              type="button"
              autoFocus
              onClick={(e) => {
                e.stopPropagation();
                onClose?.();
              }}
              className="pointer-events-auto flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-full border border-white/30 bg-black/40 text-white shadow-xl backdrop-blur-md transition-all duration-200 active:scale-95 hover:bg-white/20 hover:border-white/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunset-orange"
              aria-label="Close image viewer"
            >
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Floating Left Arrow Button on Screen Edge (if more than 1 image) */}
          {photos.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                step(-1);
              }}
              className={`absolute left-3 sm:left-5 md:left-6 top-1/2 -translate-y-1/2 z-40 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-white/25 bg-black/60 text-white shadow-2xl backdrop-blur-md transition-all duration-200 hover:bg-black/85 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                showUi ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-90 pointer-events-none'
              }`}
              aria-label="Previous image"
            >
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" stroke="currentColor" className="h-5 w-5 sm:h-6 sm:w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Floating Right Arrow Button on Screen Edge (if more than 1 image) */}
          {photos.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                step(1);
              }}
              className={`absolute right-3 sm:right-5 md:right-6 top-1/2 -translate-y-1/2 z-40 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-white/25 bg-black/60 text-white shadow-2xl backdrop-blur-md transition-all duration-200 hover:bg-black/85 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                showUi ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-90 pointer-events-none'
              }`}
              aria-label="Next image"
            >
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" stroke="currentColor" className="h-5 w-5 sm:h-6 sm:w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Main Photo Canvas: Fullscreen centered, maximizes space utilization across Desktop, iPad, and Mobile */}
          <div
            className="w-full h-full flex items-center justify-center p-1 sm:p-3 md:p-6 overflow-hidden"
            style={{
              paddingTop: 'max(0.5rem, env(safe-area-inset-top, 0.5rem))',
              paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom, 0.5rem))',
            }}
            onClick={(e) => {
              // Clicking on background outside image closes lightbox
              if (e.target === e.currentTarget) {
                onClose?.();
              }
            }}
          >
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current.src}
                custom={direction}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full h-full max-w-[99vw] sm:max-w-[96vw] lg:max-w-[94vw] max-h-[92vh] max-h-[92dvh] sm:max-h-[94vh] sm:max-h-[94dvh] lg:max-h-[96vh] flex items-center justify-center"
                onClick={(e) => {
                  e.stopPropagation();
                  // Clicking the image toggles the UI (description and arrow buttons)
                  setShowUi((s) => !s);
                }}
              >
                <Image
                  src={current.src}
                  alt={current.alt || current.caption}
                  fill
                  sizes="(min-width: 1536px) 1400px, (min-width: 1024px) 96vw, 100vw"
                  priority
                  unoptimized={current.src.startsWith('http')}
                  className="object-contain rounded-lg sm:rounded-xl shadow-2xl cursor-pointer select-none"
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}
