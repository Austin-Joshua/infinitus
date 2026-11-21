'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';

/**
 * Reusable, Portal-mounted Fullscreen Immersive Lightbox Modal.
 *
 * Implements:
 * - Contained picture calculation with precise aspect-ratio wrapper hugging corners and shadow.
 * - Scroll position preservation on open and restoration on close.
 * - Focus return to thumbnail trigger upon closing.
 * - Tap vs. drag distinction (> 8px threshold ignores tap toggles/closes).
 * - Caption overlay clearance: reserves top padding when controls are visible so posters are never obscured.
 * - Single viewport height rule via .lightbox-dialog.
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
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [loadedDim, setLoadedDim] = useState(null);

  const dialogRef = useRef(null);
  const canvasRef = useRef(null);
  const lastExternalActiveEl = useRef(null);

  // Track the most recent element focused or clicked outside any modal dialog
  useEffect(() => {
    const handleActive = (e) => {
      const target = e.target;
      if (target && typeof target.closest === 'function' && !target.closest('[role="dialog"]')) {
        lastExternalActiveEl.current = target;
      }
    };
    document.addEventListener('focusin', handleActive, true);
    document.addEventListener('pointerdown', handleActive, true);
    return () => {
      document.removeEventListener('focusin', handleActive, true);
      document.removeEventListener('pointerdown', handleActive, true);
    };
  }, []);

  // Swipe & pointer drag gesture tracking
  const pointerStart = useRef({ x: 0, y: 0 });
  const hasDragged = useRef(false);

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

  // Reset loaded dimensions on slide change
  useEffect(() => {
    setLoadedDim(null);
  }, [current?.src]);

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

  const stepRef = useRef(step);
  const onCloseRef = useRef(onClose);
  stepRef.current = step;
  onCloseRef.current = onClose;

  // Effect A: Scroll lock, body class, and focus restoration (deps: [open] only)
  useEffect(() => {
    if (!open) return undefined;

    const savedScrollY = window.scrollY;
    // Save the opening element once upon opening (guaranteed to be the external trigger)
    const triggerEl =
      lastExternalActiveEl.current && typeof lastExternalActiveEl.current.closest === 'function' && !lastExternalActiveEl.current.closest('[role="dialog"]')
        ? lastExternalActiveEl.current
        : document.activeElement && typeof document.activeElement.closest === 'function' && !document.activeElement.closest('[role="dialog"]')
        ? document.activeElement
        : null;

    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.body.classList.add('lightbox-open');
    document.documentElement.classList.add('lightbox-open');

    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.classList.remove('lightbox-open');
      document.documentElement.classList.remove('lightbox-open');
      window.scrollTo({ top: savedScrollY, behavior: 'instant' });

      // Focus the saved opening trigger element or fallback container
      const restoreFocus = () => {
        if (triggerEl && document.contains(triggerEl) && typeof triggerEl.focus === 'function') {
          triggerEl.focus({ preventScroll: true });
        } else {
          const fallback = document.querySelector('[role="region"][aria-label*="Gallery"], main, #main');
          if (fallback) {
            if (!fallback.hasAttribute('tabindex')) {
              fallback.setAttribute('tabindex', '-1');
            }
            if (typeof fallback.focus === 'function') {
              fallback.focus({ preventScroll: true });
            }
          }
        }
      };

      restoreFocus();
      requestAnimationFrame(restoreFocus);
    };
  }, [open]);

  // Effect B: Keyboard events (Escape, arrow keys, focus trap) (deps: [open] only)
  useEffect(() => {
    if (!open) return undefined;

    const onKey = (event) => {
      if (event.key === 'Escape') {
        onCloseRef.current?.();
        return;
      }
      if (event.key === 'ArrowRight') {
        stepRef.current?.(1);
        return;
      }
      if (event.key === 'ArrowLeft') {
        stepRef.current?.(-1);
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
    };
  }, [open]);

  // Track canvas size with ResizeObserver for exact aspect-ratio box containment
  useEffect(() => {
    if (!open || !canvasRef.current) return;
    const updateSize = () => {
      if (canvasRef.current) {
        const computed = window.getComputedStyle(canvasRef.current);
        const padX = (parseFloat(computed.paddingLeft) || 0) + (parseFloat(computed.paddingRight) || 0);
        const padY = (parseFloat(computed.paddingTop) || 0) + (parseFloat(computed.paddingBottom) || 0);
        const availW = Math.max(0, canvasRef.current.clientWidth - padX);
        const availH = Math.max(0, canvasRef.current.clientHeight - padY);
        setCanvasSize({
          width: availW,
          height: availH,
        });
      }
    };
    updateSize();
    const ro = new ResizeObserver(updateSize);
    ro.observe(canvasRef.current);
    window.addEventListener('resize', updateSize);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateSize);
    };
  }, [open, showUi]);

  // Pointer drag & swipe tracking
  const handlePointerDown = (e) => {
    pointerStart.current = { x: e.clientX, y: e.clientY };
    hasDragged.current = false;
  };

  const handlePointerMove = (e) => {
    if (hasDragged.current) return;
    const dx = e.clientX - pointerStart.current.x;
    const dy = e.clientY - pointerStart.current.y;
    if (Math.hypot(dx, dy) > 8) {
      hasDragged.current = true;
    }
  };

  const handlePointerUp = (e) => {
    const diffX = pointerStart.current.x - e.clientX;
    const diffY = Math.abs(pointerStart.current.y - e.clientY);
    // Register swipe if predominantly horizontal and movement > 35px
    if (Math.abs(diffX) > 35 && Math.abs(diffX) > diffY) {
      if (diffX > 0) {
        step(1);
      } else {
        step(-1);
      }
    }
    // Release drag flag after any immediate click event suppresses
    setTimeout(() => {
      hasDragged.current = false;
    }, 50);
  };

  if (!mounted || typeof document === 'undefined') {
    return null;
  }

  // Compute contained photo wrapper dimensions
  const photoWidth = current?.width || loadedDim?.width;
  const photoHeight = current?.height || loadedDim?.height;
  const hasKnownDims = Boolean(photoWidth && photoHeight);

  let wrapperStyle = undefined;
  if (hasKnownDims && canvasSize.width > 0 && canvasSize.height > 0) {
    const photoAspect = photoWidth / photoHeight;
    const canvasAspect = canvasSize.width / canvasSize.height;
    let w, h;
    if (canvasAspect > photoAspect) {
      // Height is limiting
      h = canvasSize.height;
      w = Math.round(h * photoAspect);
    } else {
      // Width is limiting
      w = canvasSize.width;
      h = Math.round(w / photoAspect);
    }
    wrapperStyle = {
      width: `${w}px`,
      height: `${h}px`,
      maxWidth: '100%',
      maxHeight: '100%',
      aspectRatio: `${photoWidth} / ${photoHeight}`,
    };
  }

  const modalContent = (
    <AnimatePresence>
      {open && current && (
        <motion.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={current.caption || 'Image viewer'}
          className="fixed inset-0 z-[999999] bg-black select-none overflow-hidden touch-none lightbox-dialog"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onClick={(e) => {
            if (hasDragged.current) return;
            const isInsidePicture = e.target.closest('[data-lightbox-picture="true"]');
            const isInsideControl = e.target.closest('button, a, [role="button"]');
            if (!isInsidePicture && !isInsideControl) {
              onCloseRef.current?.();
            }
          }}
        >
          {/* Top Bar with Caption, Counter & Close Button */}
          <div
            className={`absolute top-0 inset-x-0 z-40 flex items-start justify-between px-4 sm:px-6 pt-3 pb-8 sm:pb-12 bg-gradient-to-b from-black/90 via-black/50 to-transparent transition-all duration-300 ${
              showUi ? 'opacity-100 translate-y-0 visible pointer-events-auto' : 'opacity-0 -translate-y-4 invisible pointer-events-none'
            }`}
            style={{
              paddingTop: 'max(0.75rem, env(safe-area-inset-top, 0.75rem))',
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

            {/* Frosted Close Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClose?.();
              }}
              className="pointer-events-auto flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-full border border-white/30 bg-black/60 text-white shadow-xl transition-all duration-200 active:scale-95 hover:bg-white/20 hover:border-white/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunset-orange"
              aria-label="Close image viewer"
            >
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Floating Left Arrow Button */}
          {photos.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                step(-1);
              }}
              className={`absolute left-3 sm:left-5 md:left-6 top-1/2 -translate-y-1/2 z-40 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-white/25 bg-black/70 text-white shadow-2xl transition-all duration-200 hover:bg-black/90 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                showUi ? 'opacity-100 scale-100 visible pointer-events-auto' : 'opacity-0 scale-90 invisible pointer-events-none'
              }`}
              aria-label="Previous image"
            >
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" stroke="currentColor" className="h-5 w-5 sm:h-6 sm:w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Floating Right Arrow Button */}
          {photos.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                step(1);
              }}
              className={`absolute right-3 sm:right-5 md:right-6 top-1/2 -translate-y-1/2 z-40 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-white/25 bg-black/70 text-white shadow-2xl transition-all duration-200 hover:bg-black/90 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                showUi ? 'opacity-100 scale-100 visible pointer-events-auto' : 'opacity-0 scale-90 invisible pointer-events-none'
              }`}
              aria-label="Next image"
            >
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" stroke="currentColor" className="h-5 w-5 sm:h-6 sm:w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Main Photo Canvas: Option (b) reserves top padding when UI is shown so caption never covers poster */}
          <div
            ref={canvasRef}
            className="w-full h-full flex items-center justify-center overflow-hidden transition-all duration-200"
            style={{
              paddingTop: showUi
                ? 'max(4.25rem, calc(env(safe-area-inset-top, 0px) + 3.75rem))'
                : 'max(0.75rem, env(safe-area-inset-top, 0.75rem))',
              paddingBottom: showUi
                ? 'max(1.25rem, env(safe-area-inset-bottom, 1.25rem))'
                : 'max(0.75rem, env(safe-area-inset-bottom, 0.75rem))',
              paddingLeft: showUi ? '1rem' : '0.5rem',
              paddingRight: showUi ? '1rem' : '0.5rem',
            }}
          >
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current.src}
                data-lightbox-picture="true"
                custom={direction}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                style={wrapperStyle}
                className={
                  hasKnownDims
                    ? 'relative rounded-2xl shadow-2xl overflow-hidden cursor-pointer select-none'
                    : 'relative w-full h-full max-w-full max-h-full flex items-center justify-center cursor-pointer select-none'
                }
                onClick={(e) => {
                  e.stopPropagation();
                  if (hasDragged.current) return;
                  setShowUi((s) => !s);
                }}
              >
                <Image
                  src={current.src}
                  alt={current.alt || current.caption}
                  fill
                  sizes="(min-width: 1280px) 90vw, (min-width: 768px) 94vw, 98vw"
                  priority
                  unoptimized={current.src.startsWith('http')}
                  onLoad={(e) => {
                    const img = e.target;
                    if (img && img.naturalWidth && img.naturalHeight) {
                      setLoadedDim({ width: img.naturalWidth, height: img.naturalHeight });
                    }
                  }}
                  className={hasKnownDims ? 'object-cover select-none' : 'object-contain select-none'}
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
