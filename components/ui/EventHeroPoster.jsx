'use client';

import { useState } from 'react';
import Image from 'next/image';
import InfinitusLogo from '@/components/brand/InfinitusLogo';
import LightboxModal from '@/components/ui/LightboxModal';

/**
 * Interactive Event Hero Poster:
 * - Displays the framed official event poster.
 * - Tap / click anywhere on the poster to open the full-screen immersive lightbox modal.
 * - Seamlessly connected to the event's moments/photos for swipeable edge-to-edge browsing.
 */
export default function EventHeroPoster({ event, allPhotos = [] }) {
  const [open, setOpen] = useState(false);

  if (!event?.coverImageUrl) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-card/60 p-6">
        <InfinitusLogo size="footer" className="opacity-75" />
      </div>
    );
  }

  // Ensure there is at least the poster in the photos array
  const lightboxPhotos =
    allPhotos.length > 0
      ? allPhotos
      : [
          {
            src: event.coverImageUrl,
            caption: `${event.title} — Official Poster`,
            date: event.eventDate,
            width: 1080,
            height: 1350,
          },
        ];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group relative flex h-full w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        aria-label={`Enlarge official poster: ${event.title}`}
      >
        <Image
          src={event.coverImageUrl}
          alt={`${event.title} poster`}
          fill
          priority
          sizes="(min-width: 1280px) 35vw, (min-width: 1024px) 45vw, 100vw"
          unoptimized={event.coverImageUrl.startsWith('http')}
          className="h-full w-full object-contain transition-transform duration-500 ease-out group-hover:scale-[1.02]"
        />

        {/* Hover / Tap prompt overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-end justify-center pb-4">
          <span className="flex items-center gap-1.5 rounded-full border border-white/20 bg-black/85 px-3 py-1 font-mono text-[11px] font-semibold text-white shadow-lg">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" stroke="currentColor" className="h-3.5 w-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
            </svg>
            Enlarge Poster
          </span>
        </div>
      </button>

      {/* Lightbox Modal for Poster and Event Photos */}
      <LightboxModal
        photos={lightboxPhotos}
        index={open ? 0 : null}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
