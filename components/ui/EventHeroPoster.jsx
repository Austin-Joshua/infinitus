'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';
import InfinitusLogo from '@/components/brand/InfinitusLogo';
import LightboxModal from '@/components/ui/LightboxModal';
import { playClick } from '@/lib/soundEffects';

/**
 * 3D Gyro-Parallax Poster Viewer (Feature 4B):
 * - Multi-layer 3D depth with perspective tilting on pointer move (Desktop).
 * - Real-time device gyroscope orientation tracking via DeviceOrientationEvent (Mobile).
 * - Dynamic holographic specular light reflection sheen reacting to orientation.
 * - Layered Z-depth elements (poster, gloss reflection, holographic badges).
 * - Seamless full-screen lightbox modal on click/tap.
 * - Accessible fallback with useReducedMotion().
 */
export default function EventHeroPoster({ event, allPhotos = [] }) {
  const [open, setOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [gyroActive, setGyroActive] = useState(false);
  const [gyroAvailable, setGyroAvailable] = useState(false);

  const containerRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  // Normalized pointer/gyro coordinates: range [-0.5, 0.5]
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring physics for fluid 60-120fps motion without jitter
  const springConfig = { stiffness: 260, damping: 24, mass: 0.6 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // 3D rotation angles (clamped to max ±16 degrees for comfortable elegance)
  const maxTilt = prefersReducedMotion ? 0 : 15;
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [maxTilt, -maxTilt]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-maxTilt, maxTilt]);

  // Holographic specular sheen position percentages (0% to 100%)
  const glareX = useTransform(smoothX, [-0.5, 0.5], [10, 90]);
  const glareY = useTransform(smoothY, [-0.5, 0.5], [10, 90]);
  const glareOpacity = useTransform(
    smoothX,
    (x) => (isHovered || gyroActive ? Math.min(0.65, Math.hypot(x, mouseY.get()) * 1.2 + 0.15) : 0)
  );

  // Handle pointer movement over the poster card
  const handlePointerMove = useCallback(
    (e) => {
      if (prefersReducedMotion || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;

      mouseX.set(Math.max(-0.5, Math.min(0.5, px)));
      mouseY.set(Math.max(-0.5, Math.min(0.5, py)));
    },
    [mouseX, mouseY, prefersReducedMotion]
  );

  const handlePointerEnter = () => {
    setIsHovered(true);
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    if (!gyroActive) {
      mouseX.set(0);
      mouseY.set(0);
    }
  };

  // Device Gyroscope listener for mobile / tablet motion
  const handleOrientation = useCallback((e) => {
    if (e.beta === null || e.gamma === null) return;
    setGyroAvailable(true);

    // beta: front-to-back tilt in [-180, 180] (typical portrait phone holds around 30 to 60 deg)
    // gamma: left-to-right tilt in [-90, 90]
    const rawX = Math.max(-28, Math.min(28, e.gamma || 0));
    const rawY = Math.max(-28, Math.min(28, (e.beta || 45) - 45));

    mouseX.set(rawX / 56); // maps ±28 deg to ±0.5
    mouseY.set(rawY / 56);
    setGyroActive(true);
  }, [mouseX, mouseY]);

  useEffect(() => {
    if (prefersReducedMotion || typeof window === 'undefined') return;

    if (window.DeviceOrientationEvent) {
      // Check if permission required (iOS 13+)
      if (typeof DeviceOrientationEvent.requestPermission !== 'function') {
        window.addEventListener('deviceorientation', handleOrientation, { passive: true });
        return () => window.removeEventListener('deviceorientation', handleOrientation);
      }
    }
  }, [handleOrientation, prefersReducedMotion]);

  // Request iOS Gyroscope permission seamlessly on user touch / click
  const enableIosGyro = useCallback(async () => {
    if (
      typeof window !== 'undefined' &&
      window.DeviceOrientationEvent &&
      typeof DeviceOrientationEvent.requestPermission === 'function'
    ) {
      try {
        const state = await DeviceOrientationEvent.requestPermission();
        if (state === 'granted') {
          window.addEventListener('deviceorientation', handleOrientation, { passive: true });
          setGyroActive(true);
        }
      } catch (err) {
        // Gyro permission rejected or unavailable
      }
    }
  }, [handleOrientation]);

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
          },
        ];

  return (
    <>
      <div
        ref={containerRef}
        data-testid="gyro-parallax-container"
        onPointerDown={enableIosGyro}
        onPointerMove={handlePointerMove}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        className="relative flex h-full w-full items-center justify-center [perspective:1200px] touch-pan-y"
      >
        <motion.div
          data-testid="gyro-parallax-card"
          onClick={() => {
            playClick();
            setOpen(true);
          }}
          style={{
            rotateX,
            rotateY,
            transformStyle: 'preserve-3d',
          }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
          className="group relative flex h-full w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-transparent border-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              playClick();
              setOpen(true);
            }
          }}
          aria-label={`3D Gyro-Parallax official poster: ${event.title}. Click to enlarge.`}
        >
          {/* Depth Layer 1: Poster Artwork Image (translateZ: 14px) */}
          <div
            style={{ transform: 'translateZ(14px)' }}
            className="relative h-full w-full overflow-hidden rounded-lg shadow-2xl shadow-black/40"
          >
            <Image
              src={event.coverImageUrl}
              alt={`${event.title} poster`}
              fill
              priority
              sizes="(min-width: 1280px) 35vw, (min-width: 1024px) 45vw, 100vw"
              unoptimized={event.coverImageUrl.startsWith('http')}
              className="h-full w-full object-contain transition-transform duration-500 ease-out"
            />
          </div>

          {/* Depth Layer 2: Dynamic Holographic Specular Reflection Sheen (translateZ: 28px) */}
          <motion.div
            data-testid="gyro-specular-glare"
            aria-hidden="true"
            style={{
              transform: 'translateZ(28px)',
              opacity: glareOpacity,
              background: useTransform(
                [glareX, glareY],
                ([gx, gy]) =>
                  `radial-gradient(circle 380px at ${gx}% ${gy}%, rgba(255, 255, 255, 0.42) 0%, rgba(255, 140, 50, 0.16) 38%, transparent 72%)`
              ),
            }}
            className="pointer-events-none absolute inset-0 z-20 mix-blend-screen transition-opacity duration-300"
          />

          {/* Depth Layer 3: Hover Prompt Overlay (translateZ: 44px) */}
          <div
            style={{ transform: 'translateZ(44px)' }}
            className="pointer-events-none absolute inset-x-0 bottom-4 z-30 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          >
            <span className="flex items-center gap-1.5 rounded-full border border-white/20 bg-black/90 px-3.5 py-1.5 font-mono text-[11px] font-semibold text-white shadow-2xl">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" stroke="currentColor" className="h-3.5 w-3.5 text-sunset-orange">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
              </svg>
              Enlarge Poster
            </span>
          </div>
        </motion.div>
      </div>

      {/* Lightbox Modal for Full Resolution Browsing */}
      <LightboxModal
        photos={lightboxPhotos}
        index={open ? 0 : null}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
