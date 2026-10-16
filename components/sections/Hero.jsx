'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { COPY } from '@/lib/site';
import { EASE, introDelay } from '@/lib/motion';
import Lemniscate from '@/components/ui/Lemniscate';
import SplitText from '@/components/ui/SplitText';
import Counter from '@/components/ui/Counter';

export default function Hero({ stats = [] }) {
  const ref = useRef(null);
  const [start] = useState(introDelay);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
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
        <div className="grid gap-10 pt-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-center lg:gap-16">
          <div>
            <motion.h1
              {...rise(0.3)}
              className="font-heading text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-fg leading-[1.15]"
            >
              <SplitText text={COPY.hero.tagline} by="word" stagger={0.04} />
            </motion.h1>
            <motion.p {...rise(0.5)} className="lede mt-5 max-w-lg text-sm sm:text-base leading-relaxed">
              {COPY.hero.support}
            </motion.p>
            <motion.div {...rise(0.65)} className="mt-8 flex flex-wrap gap-3.5">
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
          <motion.dl {...rise(0.8)} className="mt-12 grid grid-cols-3 rounded-2xl border border-fg/10 bg-card/50 backdrop-blur-sm p-4 sm:p-6 shadow-sm">
            {stats.map((stat, i) => (
              <div key={stat.label} className={`flex flex-col-reverse py-2 sm:py-3 ${i ? 'border-l border-fg/10 pl-4 sm:pl-8' : ''}`}>
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
