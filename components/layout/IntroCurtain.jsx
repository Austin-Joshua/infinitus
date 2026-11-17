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
    }, 900);

    const doneTimer = setTimeout(() => {
      setPhase('done');
    }, 1500);

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
      {/* Top Panel: Prussian Blue in light mode (#1B3350), Midnight Black in dark mode (#090A10) */}
      <motion.div
        initial={{ y: '0%' }}
        animate={{ y: isOpening ? '-100%' : '0%' }}
        transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
        className="absolute inset-x-0 top-0 z-10 h-[calc(50%+2px)] bg-[#1B3350] dark:bg-[#090A10] will-change-transform"
      />

      {/* Bottom Panel: Prussian Blue in light mode (#1B3350), Midnight Black in dark mode (#090A10) */}
      <motion.div
        initial={{ y: '0%' }}
        animate={{ y: isOpening ? '100%' : '0%' }}
        transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
        className="absolute inset-x-0 bottom-0 z-10 h-[calc(50%+2px)] bg-[#1B3350] dark:bg-[#090A10] will-change-transform"
      />

      {/* Center Logo: scales & dives into page as curtains open */}
      <motion.div
        initial={{ opacity: 1, scale: 1 }}
        animate={
          isOpening
            ? { opacity: 0, scale: 0.35 }
            : { opacity: 1, scale: 1 }
        }
        transition={
          isOpening
            ? { duration: 0.25, ease: 'easeInOut' }
            : { duration: 0.2, ease: 'easeOut' }
        }
        className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center will-change-transform"
      >
        <InfinitusLogo size="loader" priority />
      </motion.div>
    </div>
  );
}
