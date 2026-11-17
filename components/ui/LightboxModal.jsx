'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';

/**
 * Reusable full-screen immersive Lightbox Modal for gallery moments and event posters.
 *
 * Features:
 * - Edge-to-edge large image presentation (max-h-[85vh], max-w-[96vw] on mobile).
 * - Floating circular chevron buttons on the left and right edges of the screen.
 * - Top description bar with caption, date, counter, tap-to-hide hint, and close (✕) button.
 * - Tap/click on the image toggles the UI visibility (top bar and side arrows).
 * - Universal swipe navigation (left/right swipe moves between photos/posters).
 * - Keyboard navigation (Escape to close, ArrowLeft/ArrowRight to step, Tab focus trap).
 * - High z-index (z-[100]) to cover mobile bottom navbar and header navigation seamlessly.
 */
export default function LightboxModal({
  photos = [],
  index = null,
  onClose,
  onIndexChange,
}) {
  const [internalIndex, setInternalIndex] = useState(index ?? 0);
  const [showUi, setShowUi] = useState(true);
  const [direction, setDirection] = useState(1);
  const dialogRef = useRef(null);

  // Swipe tracking
  const pointerStartX = useRef(null);
  const pointerStartY = useRef(null);

  const open = index !== null && photos.length > 0;
  const currentIndex = internalIndex;
  const current = open ? photos[currentIndex] || photos[0] : null;

  // Sync internal index when index prop changes
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

  useEffect(() => {
    if (!open) return undefined;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

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
      document.body.style.overflow = prevOverflow;
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

  return (
    <AnimatePresence>
      {open && current && (
        <motion.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={current.caption || 'Image viewer'}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 select-none overflow-hidden touch-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
        >
          {/* Top Bar with Description, Counter & Close Button (Can be toggled visible/hidden) */}
          <div
            className={`absolute top-0 inset-x-0 z-40 flex items-center justify-between p-3.5 sm:p-5 bg-gradient-to-b from-black/90 via-black/60 to-transparent transition-all duration-300 ${
              showUi ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
            }`}
            style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top, 0.75rem))' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col min-w-0 pr-4">
              <h3 className="line-clamp-2 text-sm sm:text-base font-semibold text-white drop-shadow-md leading-tight">
                {current.caption}
              </h3>
              <p className="mt-1 font-mono text-[11px] sm:text-xs text-white/75 drop-shadow-sm flex items-center flex-wrap gap-x-2">
                {current.date && <span>{current.date}</span>}
                {photos.length > 1 && (
                  <span>
                    {current.date && '· '}
                    {currentIndex + 1} of {photos.length}
                  </span>
                )}
                <span className="text-white/50 text-[10px] sm:text-[11px]">
                  · Tap image to {showUi ? 'hide' : 'show'} info
                </span>
              </p>
            </div>

            {/* Close Button Top Right */}
            <button
              type="button"
              autoFocus
              onClick={onClose}
              className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full border border-white/25 bg-black/50 text-white backdrop-blur-md transition-all duration-200 hover:scale-105 hover:bg-white/20 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunset-orange"
              aria-label="Close image viewer"
            >
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" stroke="currentColor" className="h-4 w-4 sm:h-5 sm:w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Floating Left Arrow Icon on Screen/Image Edge (if more than 1 image) */}
          {photos.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                step(-1);
              }}
              className={`absolute left-2 sm:left-4 lg:left-6 top-1/2 -translate-y-1/2 z-40 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-white/25 bg-black/55 text-white shadow-2xl backdrop-blur-md transition-all duration-200 hover:scale-110 hover:border-sunset-orange hover:bg-sunset-orange hover:text-white active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunset-orange ${
                showUi ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'
              }`}
              aria-label="Previous image"
            >
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" stroke="currentColor" className="h-5 w-5 sm:h-6 sm:w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Floating Right Arrow Icon on Screen/Image Edge (if more than 1 image) */}
          {photos.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                step(1);
              }}
              className={`absolute right-2 sm:right-4 lg:right-6 top-1/2 -translate-y-1/2 z-40 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-white/25 bg-black/55 text-white shadow-2xl backdrop-blur-md transition-all duration-200 hover:scale-110 hover:border-sunset-orange hover:bg-sunset-orange hover:text-white active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunset-orange ${
                showUi ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'
              }`}
              aria-label="Next image"
            >
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" stroke="currentColor" className="h-5 w-5 sm:h-6 sm:w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Main Larger Image Container (Edge-to-edge max height/width) */}
          <div
            className="relative flex h-full w-full items-center justify-center p-2 sm:p-6 md:p-8"
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
                initial={{ opacity: 0, x: direction * 35, scale: 0.98 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -direction * 35, scale: 0.98 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center justify-center"
                onClick={(e) => {
                  e.stopPropagation();
                  // Clicking the image toggles the UI (description and arrow buttons)
                  setShowUi((s) => !s);
                }}
              >
                <Image
                  src={current.src}
                  alt={current.alt || current.caption}
                  width={current.width || 1200}
                  height={current.height || 1500}
                  sizes="100vw"
                  priority
                  unoptimized={current.src.startsWith('http')}
                  className="max-h-[85vh] sm:max-h-[88vh] max-w-[96vw] sm:max-w-[88vw] w-auto h-auto rounded-xl sm:rounded-2xl object-contain shadow-2xl cursor-pointer"
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
