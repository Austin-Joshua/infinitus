'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { COPY, SOCIAL } from '@/lib/site';
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
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay: Math.min(start + delay, 0.35), ease: EASE.out },
  });

  return (
    <section ref={ref} className="relative overflow-hidden pb-6 pt-20 sm:pb-8 sm:pt-24">
      <div aria-hidden="true" className="graph-paper pointer-events-none absolute inset-0" />

      <div className="container-x relative">
        <div className="grid gap-10 pt-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-center lg:gap-16">
          <div>
            <motion.h1
              {...rise(0.3)}
              className="font-heading text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-fg leading-[1.15]"
            >
              <span className="sr-only">
                INFINITUS, the Mathematics Club of Rajalakshmi Institute of Technology, Chennai:{' '}
              </span>
              <SplitText text={COPY.hero.tagline} by="word" stagger={0.04} />
            </motion.h1>
            <motion.p {...rise(0.5)} className="lede mt-5 max-w-lg text-sm sm:text-base leading-relaxed">
              {COPY.hero.support}
            </motion.p>
            <motion.div {...rise(0.65)} className="mt-8 flex flex-wrap items-center gap-3.5 sm:gap-4">
              {/* Primary CTA: Contact / Join */}
              <Link
                href={SOCIAL.recruitmentForm || '/contact'}
                className="btn-primary text-xs sm:text-sm"
              >
                Join the Club <span aria-hidden="true" className="nudge">→</span>
              </Link>
              {/* Secondary CTA: Official Instagram Handle */}
              <a
                href={SOCIAL.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost text-xs sm:text-sm"
              >
                Follow on Instagram <span aria-hidden="true" className="nudge-ne">↗</span>
              </a>
              {/* Tertiary CTA: Text Link */}
              <Link
                href="/events"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-muted hover:text-fg transition-colors ml-1"
              >
                Explore events <span aria-hidden="true" className="nudge">→</span>
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: start + 0.35, ease: EASE.out }}
            style={{ y: figureY, rotate: figureRotate }}
            className="flex items-center justify-center max-w-md mx-auto lg:max-w-none w-full"
            role="img"
            aria-label="Animated graph of the lemniscate of Bernoulli, the infinity-shaped curve behind the INFINITUS name"
          >
            <Lemniscate axes dot draw drawDelay={start + 0.4} className="w-full max-w-lg mx-auto" />
          </motion.div>
        </div>

        {stats.length > 0 && (
          <motion.dl {...rise(0.8)} className="card mt-12 grid grid-cols-3 rounded-2xl p-4 sm:p-6">
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
