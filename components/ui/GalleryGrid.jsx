'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import LightboxModal from '@/components/ui/LightboxModal';

/**
 * Balanced, spacious gallery grid with an immersive, full-screen lightbox modal:
 * - Edge-to-edge larger image presentation in mobile and desktop viewports.
 * - Floating left & right chevron navigation icons on the sides of the image.
 * - Top description bar with caption, date, counter, and close button.
 * - Tap/click on image toggles the UI visibility (descriptions and arrows).
 * - Touch & pointer swipe left/right navigation across all devices.
 * - Keyboard friendly with Escape, ArrowLeft, ArrowRight, and focus trap.
 */
export default function GalleryGrid({ photos = [] }) {
  const [index, setIndex] = useState(null);
  const triggerRef = useRef(null);

  const close = () => {
    setIndex(null);
    setTimeout(() => {
      triggerRef.current?.focus({ preventScroll: true });
    }, 50);
  };

  const openLightbox = (i) => {
    triggerRef.current = document.activeElement;
    setIndex(i);
  };

  return (
    <>
      {/* Spacious, unclustered responsive photo grid - instantly visible without delay */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6 lg:gap-7">
        {photos.map((photo, i) => (
          <button
            key={photo.src}
            type="button"
            onClick={() => openLightbox(i)}
            className="card card-hover group relative flex aspect-[4/3] w-full cursor-pointer flex-col overflow-hidden rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-transform duration-200 active:scale-[0.98]"
            aria-label={`View photo: ${photo.caption}`}
            aria-haspopup="dialog"
          >
            <Image
              src={photo.src}
              alt={photo.alt || photo.caption}
              fill
              sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
              priority={i < 6}
              loading={i < 6 ? 'eager' : 'lazy'}
              unoptimized={photo.src.startsWith('http')}
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />

            {/* Subtle frosted glass caption overlay on hover/mobile */}
            <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3.5 pt-10 text-left text-white">
              <span className="text-xs font-semibold leading-tight drop-shadow-sm sm:text-sm">
                {photo.caption}
              </span>
              {photo.date && (
                <span className="shrink-0 rounded-full border border-white/20 bg-black/60 px-2 py-0.5 font-mono text-[10px] font-medium text-white">
                  {photo.date}
                </span>
              )}
            </span>
          </button>
        ))}
      </div>

      {/* Fullscreen Immersive Lightbox Modal */}
      <LightboxModal
        photos={photos}
        index={index}
        onClose={close}
        onIndexChange={(newIdx) => setIndex(newIdx)}
      />
    </>
  );
}
