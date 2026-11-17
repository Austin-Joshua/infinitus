'use client';

import { motion } from 'framer-motion';
import { EASE } from '@/lib/motion';

const DRAW = 1.6;
const inView = { once: true, margin: '0px 0px -15% 0px' };

const AMBIENT_SYMBOLS = [
  { char: '∞', top: '10%', left: '8%', delay: 0 },
  { char: '∫', top: '22%', right: '12%', delay: 1.5 },
  { char: '∑', bottom: '15%', left: '14%', delay: 2.5 },
  { char: 'π', bottom: '25%', right: '8%', delay: 3.5 },
  { char: '√', top: '45%', right: '35%', delay: 1 },
];

/**
 * Animated Timeline Journey:
 * - Ambient floating mathematical glyphs.
 * - Dynamic glowing progress line that draws as user scrolls into view.
 * - Pulsing interactive milestone nodes with spring-loaded entrance.
 * - Interactive milestone cards with complimentary events and tags.
 */
export default function Journey({ heading, steps }) {
  const at = (i) => 0.2 + (DRAW * i) / steps.length;

  return (
    <section className="section relative overflow-hidden bg-bg-2/50 !py-16 sm:!py-24">
      {/* Subtle graph paper and floating mathematical symbols */}
      <div aria-hidden="true" className="graph-paper pointer-events-none absolute inset-0 opacity-40" />

      {AMBIENT_SYMBOLS.map((s, idx) => (
        <motion.span
          key={idx}
          aria-hidden="true"
          initial={{ opacity: 0, y: 15 }}
          animate={{
            opacity: [0.15, 0.35, 0.15],
            y: [0, -12, 0],
          }}
          transition={{
            duration: 6,
            delay: s.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="pointer-events-none absolute select-none font-serif text-3xl sm:text-5xl font-light text-accent/20"
          style={{ top: s.top, left: s.left, right: s.right, bottom: s.bottom }}
        >
          {s.char}
        </motion.span>
      ))}

      <div className="container-x relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE.out }}
          className="max-w-2xl"
        >
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse" />
            <p className="font-mono text-xs uppercase tracking-widest text-accent font-medium">Timeline & Milestones</p>
          </div>
          <h2 className="font-heading text-2xl font-bold tracking-tight text-fg sm:text-3xl lg:text-4xl mt-2">
            {heading}
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-muted">
            The growth of INFINITUS from our foundational campus celebrations to hosting inter-school championships.
          </p>
        </motion.div>

        <div className="relative mt-12 sm:mt-16">
          {/* Base Track */}
          <div
            aria-hidden="true"
            className="absolute bottom-0 left-[11px] top-0 w-0.5 bg-fg/10 lg:bottom-auto lg:left-0 lg:right-0 lg:top-[11px] lg:h-0.5 lg:w-auto"
          />

          {/* Animated Glowing Drawn Line: Mobile vertical */}
          <motion.div
            aria-hidden="true"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={inView}
            transition={{ duration: DRAW, delay: 0.2, ease: EASE.inOut }}
            className="absolute bottom-0 left-[11px] top-0 w-0.5 origin-top bg-gradient-to-b from-accent via-accent-2 to-accent shadow-[0_0_12px_rgb(var(--accent)/0.6)] lg:hidden"
          />

          {/* Animated Glowing Drawn Line: Desktop horizontal */}
          <motion.div
            aria-hidden="true"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={inView}
            transition={{ duration: DRAW, delay: 0.2, ease: EASE.inOut }}
            className="absolute left-0 right-0 top-[11px] hidden h-0.5 origin-left bg-gradient-to-r from-accent via-accent-2 to-accent shadow-[0_0_12px_rgb(var(--accent)/0.6)] lg:block"
          />

          <ol className="grid gap-8 sm:gap-10 lg:grid-cols-4 lg:gap-6">
            {steps.map((step, i) => (
              <motion.li
                key={step.year}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={inView}
                transition={{ duration: 0.7, delay: at(i), ease: EASE.out }}
                className="group relative pl-10 lg:pl-0 lg:pt-10"
              >
                {/* Node with Pulsing Halo Ring */}
                <div className="absolute left-0 top-1.5 lg:top-0 flex items-center justify-center">
                  {/* Subtle pulsing background halo */}
                  <motion.span
                    initial={{ scale: 0 }}
                    whileInView={{ scale: [1, 1.8, 1] }}
                    viewport={inView}
                    transition={{
                      duration: 2.5,
                      delay: at(i) + 0.3,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="absolute h-5 w-5 rounded-full bg-accent/20"
                  />
                  {/* Outer spring marker */}
                  <motion.span
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={inView}
                    transition={{ type: 'spring', stiffness: 450, damping: 18, delay: at(i) }}
                    className="relative flex h-6 w-6 items-center justify-center rounded-full border-2 border-accent bg-bg shadow-sm transition-transform duration-300 group-hover:scale-125 group-hover:border-accent group-hover:shadow-[0_0_12px_rgb(var(--accent)/0.5)]"
                  >
                    <span className="h-2 w-2 rounded-full bg-accent transition-transform duration-300 group-hover:scale-125" />
                  </motion.span>
                </div>

                {/* Milestone Interactive Card */}
                <div className="card relative flex h-full flex-col justify-between overflow-hidden rounded-xl border border-fg/15 bg-card/85 p-5 sm:p-6 shadow-sm backdrop-blur-sm transition-all duration-300 group-hover:-translate-y-1.5 group-hover:border-accent/40 group-hover:shadow-[0_16px_32px_-16px_rgb(var(--fg)/0.2)]">
                  <div>
                    {/* Header Row: Year & Tag */}
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-heading text-3xl font-extrabold tracking-tight text-accent transition-colors duration-300 group-hover:text-accent-2 sm:text-4xl">
                        {step.year}
                      </p>
                      {step.tag && (
                        <span className="chip border-sunset/40 bg-sunset/10 text-[11px] font-mono text-sunset font-medium">
                          {step.tag}
                        </span>
                      )}
                    </div>

                    <h3 className="mt-3 font-heading text-base sm:text-lg font-bold text-fg">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm leading-relaxed text-muted">
                      {step.body}
                    </p>
                  </div>

                  {/* Complimentary Events for this Year */}
                  {step.events && step.events.length > 0 && (
                    <div className="mt-5 border-t border-fg/10 pt-3.5">
                      <p className="font-mono text-[10px] uppercase tracking-wider text-muted font-medium mb-2">
                        Key Events & Highlights
                      </p>
                      <ul className="flex flex-wrap gap-1.5">
                        {step.events.map((ev, eIdx) => (
                          <li
                            key={eIdx}
                            className="rounded-md border border-fg/10 bg-bg-2/60 px-2 py-0.5 text-[11px] font-sans text-fg/80 transition-colors group-hover:border-accent/30 group-hover:text-fg"
                          >
                            {ev}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
