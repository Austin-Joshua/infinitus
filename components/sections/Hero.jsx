'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { CLUB_SHORT, COPY } from '@/lib/site';
import { EASE, introDelay } from '@/lib/motion';
import InfinitusLogo from '@/components/brand/InfinitusLogo';
import RitLogo from '@/components/brand/RitLogo';
import Lemniscate from '@/components/ui/Lemniscate';
import SplitText from '@/components/ui/SplitText';
import Counter from '@/components/ui/Counter';

export default function Hero({ stats = [] }) {
  const ref = useRef(null);
  const [start] = useState(introDelay);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const titleY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const figureY = useTransform(scrollYProgress, [0, 1], ['0%', '-12%']);
  const figureRotate = useTransform(scrollYProgress, [0, 1], [0, -4]);

  const rise = (delay) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay: start + delay, ease: EASE.out },
  });

  return (
    <section ref={ref} className="relative overflow-hidden pb-8 pt-24 sm:pt-28">
      <div aria-hidden="true" className="graph-paper pointer-events-none absolute inset-0" />

      <div className="container-x relative">
        <motion.div {...rise(0)} className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs sm:text-sm text-muted">
          <InfinitusLogo size="nav" className="h-6 w-6" />
          <span aria-hidden="true" className="h-4 w-px bg-fg/20" />
          <RitLogo size="xs" />
          <span aria-hidden="true" className="h-4 w-px bg-fg/20" />
          <span className="font-mono text-accent font-medium">{COPY.hero.badge}</span>
        </motion.div>

        <motion.div style={{ y: titleY }}>
          <SplitText
            as="h1"
            text={CLUB_SHORT}
            by="char"
            stagger={0.04}
            delay={0.1}
            className="mt-4 block font-heading text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-fg leading-none"
          />
        </motion.div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: start + 0.4, ease: EASE.inOut }}
          className="mt-6 h-px origin-left bg-fg/20"
        />

        <div className="grid gap-10 pt-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-center lg:gap-16">
          <div>
            <motion.p {...rise(0.5)} className="font-heading text-xl italic text-fg sm:text-3xl">
              {COPY.hero.tagline}.
            </motion.p>
            <motion.p {...rise(0.6)} className="lede mt-4 max-w-lg text-sm sm:text-base">
              {COPY.hero.support}
            </motion.p>
            <motion.div {...rise(0.7)} className="mt-6 flex flex-wrap gap-3">
              <Link href="/events" className="btn-primary text-xs sm:text-sm">
                {COPY.hero.primaryCta} <span aria-hidden="true" className="nudge">→</span>
              </Link>
              <Link href="/team" className="btn-ghost text-xs sm:text-sm">
                {COPY.hero.secondaryCta}
              </Link>
            </motion.div>
          </div>

          <motion.figure
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: start + 0.35, ease: EASE.out }}
            style={{ y: figureY, rotate: figureRotate }}
            className="max-w-md mx-auto lg:max-w-none w-full"
          >
            <Lemniscate axes dot draw drawDelay={start + 0.4} className="w-full" />
            <figcaption className="mt-3 text-xs leading-relaxed text-muted">
              <span className="font-semibold text-fg">Fig. 1.</span> The lemniscate of Bernoulli,{' '}
              <span className="font-serif italic">(x² + y²)² = a²(x² − y²)</span> — the curve behind our name.
            </figcaption>
          </motion.figure>
        </div>

        {stats.length > 0 && (
          <motion.dl {...rise(0.8)} className="mt-12 grid grid-cols-3 border-y border-fg/15">
            {stats.map((stat, i) => (
              <div key={stat.label} className={`flex flex-col-reverse py-4 sm:py-5 ${i ? 'border-l border-fg/15 pl-4 sm:pl-8' : ''}`}>
                <dt className="mt-1 text-xs text-muted font-mono">{stat.label}</dt>
                <dd className="font-heading text-2xl font-bold text-fg sm:text-4xl lg:text-5xl">
                  <Counter value={stat.value} />
                </dd>
              </div>
            ))}
          </motion.dl>
        )}
      </div>
    </section>
  );
}
