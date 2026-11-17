'use client';

import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { motion } from 'framer-motion';
import InfinitusLogo from '@/components/brand/InfinitusLogo';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * First-visit / Landing-page reload opening curtain:
 * Plays only once per session (or on reload of the landing page).
 *
 * Sequence:
 * - 0ms - 900ms: Curtains hold closed at center with the central logo.
 * - 900ms - 1500ms: Panels slide apart to top and bottom, center logo dives.
 * - 1500ms: Curtain unmounts completely.
 * - Tap/Click: Skips immediately.
 */
export default function IntroCurtain() {
  const [phase, setPhase] = useState('idle'); // 'idle' | 'holding' | 'opening' | 'done'
  const isPendingRef = useRef(false);

  useIsomorphicLayoutEffect(() => {
    const root = document.documentElement;
    const hasPending = root.classList.contains('intro-pending');

    if (hasPending) {
      isPendingRef.current = true;
      root.classList.remove('intro-pending');
      root.classList.add('intro-seen');
      setPhase('holding');
    } else if (!isPendingRef.current) {
      setPhase('done');
      return undefined;
    }

    // Sequence timers
    const openTimer = setTimeout(() => {
      setPhase('opening');
    }, 800);

    const doneTimer = setTimeout(() => {
      setPhase('done');
    }, 1400);

    return () => {
      clearTimeout(openTimer);
      clearTimeout(doneTimer);
    };
  }, []);

  const handleSkip = () => {
    setPhase('done');
  };

  if (phase === 'idle' || phase === 'done') {
    return null;
  }

  const isOpening = phase === 'opening';

  return (
    <div
      onClick={handleSkip}
      role="presentation"
      aria-hidden="true"
      className="fixed inset-0 z-[100] cursor-pointer overflow-hidden select-none"
    >
      {/* Top Scroll Panel: Signature Prussian Blue in both modes for distinct contrast against page backgrounds */}
      <motion.div
        initial={{ y: '0%' }}
        animate={{ y: isOpening ? '-100%' : '0%' }}
        transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
        className="absolute inset-x-0 top-0 z-10 h-[calc(50%+1px)] bg-[#1B3350] border-b-2 border-sunset-orange/70 shadow-[0_4px_24px_rgba(255,122,26,0.35)] will-change-transform"
      />

      {/* Bottom Scroll Panel: Signature Prussian Blue in both modes for distinct contrast against page backgrounds */}
      <motion.div
        initial={{ y: '0%' }}
        animate={{ y: isOpening ? '100%' : '0%' }}
        transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
        className="absolute inset-x-0 bottom-0 z-10 h-[calc(50%+1px)] bg-[#1B3350] border-t-2 border-sunset-orange/70 shadow-[0_-4px_24px_rgba(255,122,26,0.35)] will-change-transform"
      />

      {/* Center Seal Logo: spins 360° clockwise briskly like an unsealing scroll, then dives as letter opens */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85, rotate: 0 }}
        animate={
          isOpening
            ? { opacity: 0, scale: 0.35, rotate: 360 }
            : { opacity: 1, scale: 1, rotate: 360 }
        }
        transition={
          isOpening
            ? {
                opacity: { duration: 0.22, ease: 'easeInOut' },
                scale: { duration: 0.25, ease: 'easeInOut' },
              }
            : {
                rotate: { duration: 0.62, ease: [0.16, 1, 0.3, 1] },
                scale: { duration: 0.45, ease: 'easeOut' },
                opacity: { duration: 0.2, ease: 'easeOut' },
              }
        }
        className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center will-change-transform"
      >
        <div className="relative flex items-center justify-center">
          {/* Glowing ambient backlight behind the central scroll seal */}
          <div className="absolute h-36 w-36 rounded-full bg-sunset-orange/20 blur-2xl" />
          <InfinitusLogo size="loader" priority />
        </div>
      </motion.div>
    </div>
  );
}
