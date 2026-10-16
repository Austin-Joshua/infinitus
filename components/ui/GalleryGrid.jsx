'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';

/**
 * Balanced, spacious gallery grid with keyboard-friendly lightbox modal.
 */
export default function GalleryGrid({ photos = [] }) {
  const [index, setIndex] = useState(null);
  const open = index !== null;

  const close = useCallback(() => setIndex(null), []);
  const step = useCallback(
    (delta) => setIndex((i) => (i === null ? i : (i + delta + photos.length) % photos.length)),
    [photos.length]
  );

  useEffect(() => {
    if (!open) return undefined;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (event) => {
      if (event.key === 'Escape') close();
      if (event.key === 'ArrowRight') step(1);
      if (event.key === 'ArrowLeft') step(-1);
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, close, step]);

  const current = open ? photos[index] : null;

  return (
    <>
      {/* Spacious, unclustered responsive photo grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6 lg:gap-7">
        {photos.map((photo, i) => (
          <motion.button
            key={photo.src}
            type="button"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -5% 0px' }}
            transition={{ duration: 0.6, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => setIndex(i)}
            className="card card-hover group relative flex aspect-[4/3] w-full cursor-pointer flex-col overflow-hidden rounded-xl border border-fg/15 bg-card shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-accent/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label={`View photo: ${photo.caption}`}
          >
            <Image
              src={photo.src}
              alt={photo.caption}
              fill
              sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
              unoptimized={photo.src.startsWith('http')}
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />

            {/* Subtle frosted glass caption overlay */}
            <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3.5 pt-10 text-left text-white">
              <span className="text-xs font-semibold leading-tight drop-shadow-sm sm:text-sm">
                {photo.caption}
              </span>
              {photo.date && (
                <span className="shrink-0 rounded-full bg-white/20 px-2 py-0.5 font-mono text-[10px] font-medium backdrop-blur-md">
                  {photo.date}
                </span>
              )}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {current && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={current.caption}
            className="fixed inset-0 z-[80] flex flex-col items-center justify-center bg-black/90 p-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          >
            {/* Main Photo Container */}
            <motion.div
              key={current.src}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              className="relative max-h-[75vh] w-full max-w-4xl flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={current.src}
                alt={current.caption}
                width={current.width}
                height={current.height}
                sizes="(min-width: 1024px) 900px, 100vw"
                unoptimized={current.src.startsWith('http')}
                className="max-h-[75vh] w-auto rounded-lg object-contain shadow-2xl"
              />
            </motion.div>

            {/* Lightbox Controls & Caption */}
            <div
              className="mt-4 flex w-full max-w-2xl items-center justify-between gap-3 text-white px-2"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => step(-1)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-sm transition-colors hover:bg-white/20"
                aria-label="Previous photo"
              >
                ←
              </button>

              <div className="text-center px-2">
                <p className="text-xs font-semibold sm:text-sm">{current.caption}</p>
                <p className="mt-0.5 font-mono text-[11px] text-white/60">
                  {current.date ? `${current.date} · ` : ''}
                  {index + 1} of {photos.length}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => step(1)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-sm transition-colors hover:bg-white/20"
                  aria-label="Next photo"
                >
                  →
                </button>
                <button
                  type="button"
                  autoFocus
                  onClick={close}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-sm transition-colors hover:bg-white/20"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
