'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';
import InfinitusLogo from '@/components/brand/InfinitusLogo';
import { EASE } from '@/lib/motion';

/**
 * Universal Opening Curtain Transition:
 * Re-mounts on every route change (and initial load).
 * - Blue curtains split from the middle (top panel slides up to -100%, bottom slides down to 100%).
 * - Color-sensitive for both modes: Royal Indigo Blue (#1D2566) in light mode,
 *   Deep Midnight Navy (#000F2E) in dark mode.
 * - Center logo fades & scales down as the curtains part, diving into the page.
 * - Uniform across every single page (About, Team, Events, Gallery, Contact, Home).
 * - Dismissable instantly on tap/click.
 */
export default function Template({ children }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState('intro'); // 'intro' | 'open'
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    // Reset state on path navigation
    setPhase('intro');
    setFinished(false);

    if (reduce) {
      setFinished(true);
      return undefined;
    }

    // Sequence:
    // 0s - 0.12s: curtains start closed at center, logo holds
    // 0.12s - 0.67s: curtains split snappy to top and bottom, logo dives
    const openTimer = setTimeout(() => {
      setPhase('open');
    }, 120);

    // 0.70s: animation complete, curtains removed from interaction
    const finishTimer = setTimeout(() => {
      setFinished(true);
    }, 700);

    return () => {
      clearTimeout(openTimer);
      clearTimeout(finishTimer);
    };
  }, [pathname, reduce]);

  const handleSkip = () => {
    setFinished(true);
  };

  return (
    <>
      {!finished && !reduce && (
        <div
          onClick={handleSkip}
          role="presentation"
          aria-hidden="true"
          className="fixed inset-0 z-[100] cursor-pointer overflow-hidden select-none"
        >
          {/* Top Panel: Royal Indigo in light mode (#1D2566), Deep Midnight Navy in dark mode (#000F2E) */}
          <motion.div
            initial={{ y: '0%' }}
            animate={{ y: phase === 'open' ? '-100%' : '0%' }}
            transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
            className="absolute inset-x-0 top-0 z-10 h-[calc(50%+2px)] bg-[#1D2566] dark:bg-[#000F2E] will-change-transform"
          />

          {/* Bottom Panel: Royal Indigo in light mode (#1D2566), Deep Midnight Navy in dark mode (#000F2E) */}
          <motion.div
            initial={{ y: '0%' }}
            animate={{ y: phase === 'open' ? '100%' : '0%' }}
            transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
            className="absolute inset-x-0 bottom-0 z-10 h-[calc(50%+2px)] bg-[#1D2566] dark:bg-[#000F2E] will-change-transform"
          />

          {/* Center Logo: scales & dives into page as curtains open */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={
              phase === 'open'
                ? { opacity: 0, scale: 0.35 }
                : { opacity: 1, scale: 1 }
            }
            transition={
              phase === 'open'
                ? { duration: 0.2, ease: 'easeInOut' }
                : { duration: 0.15, ease: 'easeOut' }
            }
            className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center will-change-transform"
          >
            <InfinitusLogo size="loader" priority />
          </motion.div>
        </div>
      )}

      {/* Main Page Content */}
      <motion.main
        key={pathname}
        id="main"
        className="relative"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.2, ease: EASE.out }}
      >
        {children}
      </motion.main>
    </>
  );
}
