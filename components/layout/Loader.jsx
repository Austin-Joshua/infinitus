'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import InfinitusLogo from '@/components/brand/InfinitusLogo';

/**
 * Old-style theatre curtain loader:
 * - Color-sensitive for both modes: Royal Indigo Blue (#1D2566) in light mode,
 *   Deep Midnight Navy (#000F2E) in dark mode.
 * - Center logo fades & scales in, then dives into the page.
 * - Curtains split snappy from the center (top slides up, bottom slides down).
 * - Plays on every reload; click anywhere to skip.
 */
export default function Loader() {
  const [active, setActive] = useState(true);
  const [phase, setPhase] = useState('intro'); // 'intro' | 'open'

  useEffect(() => {
    // Lock body scroll while loader is active
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Sequence:
    // 0s - 0.55s: logo scales & fades in
    // 0.55s - 0.9s: brief hold
    // 0.9s: trigger curtain split
    const openTimer = setTimeout(() => {
      setPhase('open');
    }, 900);

    // 0.9s + 0.6s: curtains finished splitting, remove loader
    const finishTimer = setTimeout(() => {
      document.body.style.overflow = prevOverflow;
      setActive(false);
    }, 1500);

    return () => {
      clearTimeout(openTimer);
      clearTimeout(finishTimer);
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  const handleSkip = () => {
    document.body.style.overflow = '';
    setActive(false);
  };

  if (!active) return null;

  return (
    <div
      onClick={handleSkip}
      role="presentation"
      aria-hidden="true"
      className="fixed inset-0 z-[100] cursor-pointer overflow-hidden select-none"
    >
      {/*
        Top Panel:
        Light mode: Royal Indigo Blue (#1D2566)
        Dark mode: Deep Midnight Navy Blue (#000F2E)
        Overlaps by 2px at the middle so there is no gap before the open.
      */}
      <motion.div
        initial={{ y: '0%' }}
        animate={{ y: phase === 'open' ? '-100%' : '0%' }}
        transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
        className="absolute inset-x-0 top-0 z-10 h-[calc(50%+2px)] bg-[#1D2566] dark:bg-[#000F2E] will-change-transform"
      />

      {/*
        Bottom Panel:
        Light mode: Royal Indigo Blue (#1D2566)
        Dark mode: Deep Midnight Navy Blue (#000F2E)
        Overlaps by 2px at the middle so there is no gap before the open.
      */}
      <motion.div
        initial={{ y: '0%' }}
        animate={{ y: phase === 'open' ? '100%' : '0%' }}
        transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
        className="absolute inset-x-0 bottom-0 z-10 h-[calc(50%+2px)] bg-[#1D2566] dark:bg-[#000F2E] will-change-transform"
      />

      {/* Center Logo that scales in and dives into page as curtains open */}
      <motion.div
        initial={{ opacity: 0, scale: 0.88 }}
        animate={
          phase === 'open'
            ? { opacity: 0, scale: 0.35 }
            : { opacity: 1, scale: 1 }
        }
        transition={
          phase === 'open'
            ? { duration: 0.15, ease: 'easeInOut' }
            : { duration: 0.55, ease: 'easeOut' }
        }
        className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center will-change-transform"
      >
        <div className="relative">
          <InfinitusLogo size="loader" priority />
        </div>
      </motion.div>
    </div>
  );
}
