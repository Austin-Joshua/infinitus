'use client';

import { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { MATH_ERAS, MATH_MILESTONES } from '@/lib/mathHistory';
import { playClick } from '@/lib/soundEffects';

const ERA_DETAILS = {
  all: { span: '499 CE – Present', desc: 'Complete mathematical progression' },
  classical: { span: '5th–7th Century CE', desc: 'Place-value decimal & zero arithmetic' },
  calculus: { span: '14th Century CE', desc: 'Infinite series & mathematical analysis' },
  topology: { span: '18th–20th Century', desc: 'Graph theory, modular forms & partitions' },
  modern: { span: '1963–Present', desc: 'Deterministic chaos & computational math' },
};

export default function MathHistoryTimeline() {
  const [activeEra, setActiveEra] = useState('all');
  const [selectedMilestone, setSelectedMilestone] = useState(MATH_MILESTONES[0].id);
  const containerRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  const filteredMilestones = useMemo(() => {
    if (activeEra === 'all') return MATH_MILESTONES;
    return MATH_MILESTONES.filter((m) => m.era === activeEra);
  }, [activeEra]);

  // Always resolve activeItem from current filteredMilestones so mathematician card adapts immediately on era switch
  const activeItem = useMemo(() => {
    const found = filteredMilestones.find((m) => m.id === selectedMilestone);
    return found || filteredMilestones[0] || MATH_MILESTONES[0];
  }, [filteredMilestones, selectedMilestone]);

  const handleSelectEra = (eraId) => {
    playClick();
    setActiveEra(eraId);
    const milestones = eraId === 'all'
      ? MATH_MILESTONES
      : MATH_MILESTONES.filter((m) => m.era === eraId);
    if (milestones.length > 0) {
      setSelectedMilestone(milestones[0].id);
    }
  };

  return (
    <section
      ref={containerRef}
      id="math-history-timeline"
      className="section relative overflow-hidden !py-12 sm:!py-16 border-t border-fg/10"
      aria-label="Interactive Mathematical History & Heritage Timeline"
    >
      <div aria-hidden="true" className="graph-paper pointer-events-none absolute inset-0 opacity-30" />

      <div className="container-x relative">
        {/* Section Header */}
        <div className="pb-6 sm:pb-8">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-sunset-orange animate-pulse" />
            <p className="font-mono text-xs uppercase tracking-widest text-sunset-orange font-semibold">
              Mathematical Heritage
            </p>
          </div>
          <h2 className="font-heading text-2xl font-bold tracking-tight text-fg sm:text-3xl lg:text-4xl mt-2">
            Chronicles of Mathematical Discovery
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-muted max-w-2xl leading-relaxed">
            From Aryabhata and Madhava to Euler, Ramanujan, and modern neural manifolds—the centuries of mathematical insight that inspire INFINITUS.
          </p>
        </div>

        {/* Era Overview Grid: All 5 Eras Visible At A Glance Without Scrolling (Requirement 3) */}
        <div
          role="tablist"
          aria-label="Historical eras overview"
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 mb-8"
        >
          {MATH_ERAS.map((era) => {
            const active = activeEra === era.id;
            const meta = ERA_DETAILS[era.id] || { span: '', desc: '' };
            return (
              <button
                key={era.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => handleSelectEra(era.id)}
                className={`flex flex-col items-start p-3 sm:p-3.5 rounded-xl border text-left transition-all duration-200 active:scale-[0.98] cursor-pointer ${
                  active
                    ? 'border-sunset-orange bg-sunset-orange/10 shadow-md shadow-sunset-orange/10 text-fg ring-1 ring-sunset-orange/40'
                    : 'border-border/60 bg-card/75 text-fg/80 hover:border-sunset-orange/50 hover:bg-card'
                }`}
              >
                <div className="flex w-full items-center justify-between gap-1">
                  <span
                    className={`font-mono text-xs sm:text-sm font-semibold transition-colors ${
                      active ? 'text-sunset-orange' : 'text-fg'
                    }`}
                  >
                    {era.label}
                  </span>
                  {active && (
                    <span className="h-1.5 w-1.5 rounded-full bg-sunset-orange shrink-0 animate-ping" />
                  )}
                </div>
                <span className="mt-1 font-mono text-[10px] text-muted line-clamp-1">
                  {meta.span}
                </span>
              </button>
            );
          })}
        </div>

        {/* Timeline Horizontal Stepper with Centered Track Line & Progressive Scroll Animation (Requirements 3 & 6) */}
        <div className="relative mt-2 mb-8 overflow-x-auto no-scrollbar pt-4 pb-4 px-2 sm:px-4">
          <div className="flex items-start min-w-[640px] justify-between relative px-6">
            {/* Background Track Line (precisely centered at top-4 = 16px, circle radius) */}
            <div
              aria-hidden="true"
              className="absolute left-10 right-10 top-4 -translate-y-1/2 h-0.5 bg-fg/10 z-0"
            />

            {/* Scroll-Triggered Progressive Progress Line (Requirement 6) */}
            <motion.div
              aria-hidden="true"
              initial={{ scaleX: prefersReducedMotion ? 1 : 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              style={{ originX: 0 }}
              className="absolute left-10 right-10 top-4 -translate-y-1/2 h-0.5 bg-gradient-to-r from-sunset-orange via-gold to-sunset-orange shadow-[0_0_8px_rgba(255,107,0,0.4)] z-0"
            />

            {filteredMilestones.map((item, idx) => {
              const isSelected = item.id === activeItem.id;
              return (
                <motion.div
                  key={item.id}
                  initial={{ scale: prefersReducedMotion ? 1 : 0.7, opacity: prefersReducedMotion ? 1 : 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.16,
                    delay: prefersReducedMotion ? 0 : idx * 0.02,
                    ease: 'easeOut',
                  }}
                  className="relative z-10 flex flex-col items-center"
                >
                  <button
                    type="button"
                    onClick={() => {
                      playClick();
                      setSelectedMilestone(item.id);
                    }}
                    className="group relative flex flex-col items-center focus-visible:outline-none cursor-pointer"
                    aria-label={`Select ${item.title}`}
                  >
                    {/* Stepper Circle: h-8 w-8 = 32px, center is at 16px aligning with line */}
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-mono font-bold transition-all duration-300 ${
                        isSelected
                          ? 'bg-sunset-orange text-white scale-110 shadow-lg shadow-sunset-orange/40 ring-4 ring-sunset-orange/25'
                          : 'border border-border bg-card text-muted group-hover:border-sunset-orange/60 group-hover:text-fg group-hover:scale-105'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <span
                      className={`mt-2 font-mono text-[11px] whitespace-nowrap transition-colors ${
                        isSelected
                          ? 'font-bold text-sunset-orange'
                          : 'text-muted group-hover:text-fg'
                      }`}
                    >
                      {item.year}
                    </span>
                    <span className="text-[10px] text-muted/80 max-w-[90px] text-center truncate hidden sm:block mt-0.5">
                      {item.title.split('—')[0].trim()}
                    </span>
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Featured Milestone Card: Ultra-compact, Refined Single-Element Layout */}
        <AnimatePresence mode="wait">
          <motion.article
            key={activeItem.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.08, ease: 'easeOut' }}
            data-testid="math-history-active-card"
            className="rounded-xl sm:rounded-2xl border border-sunset-orange/30 bg-card p-3.5 sm:p-5 lg:p-6 shadow-md shadow-black/5"
          >
            <div className="grid gap-3.5 sm:gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.9fr)] items-start">
              {/* Left Column: Historical Context */}
              <div>
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                  <span className="rounded-full border border-sunset-orange/40 bg-sunset-orange/10 px-2 py-0.5 font-mono text-[9px] sm:text-[10px] font-semibold text-sunset-orange">
                    {activeItem.year}
                  </span>
                  <span className="font-mono text-[10px] sm:text-xs text-muted">
                    {activeItem.century}
                  </span>
                  <span className="rounded-full border border-border/80 bg-bg/80 px-2 py-0.5 font-mono text-[9px] sm:text-[10px] text-muted">
                    {activeItem.branch}
                  </span>
                </div>

                <h3 className="font-heading text-base sm:text-xl lg:text-2xl font-bold text-fg tracking-tight">
                  {activeItem.title}
                </h3>
                <p className="font-sans text-[11px] sm:text-xs font-semibold text-sunset-orange mt-0.5">
                  {activeItem.subtitle}
                </p>

                <p className="mt-2 font-sans text-[11px] sm:text-xs leading-relaxed text-muted">
                  {activeItem.description}
                </p>

                <div className="mt-3 border-t border-border/40 pt-2 sm:pt-2.5">
                  <p className="font-mono text-[9px] sm:text-[10px] uppercase tracking-wider text-muted font-semibold">
                    Key Historical Impact
                  </p>
                  <p className="mt-0.5 text-[11px] sm:text-xs text-fg/90 leading-relaxed">
                    {activeItem.keyContribution}
                  </p>
                </div>
              </div>

              {/* Right Column: Mathematical Formula & Identity */}
              <div className="flex flex-col justify-center rounded-lg sm:rounded-xl border border-border/60 bg-bg/60 p-3 sm:p-4">
                <span className="font-mono text-[8px] sm:text-[9px] uppercase tracking-widest text-sunset-orange font-semibold">
                  Foundational Mathematical Equation
                </span>

                <div className="mt-1.5 sm:mt-2 overflow-x-auto no-scrollbar rounded-lg bg-card/90 border border-sunset-orange/20 p-2 sm:p-2.5 font-mono text-[11px] sm:text-xs font-bold text-fg">
                  <code>{activeItem.formula}</code>
                </div>

                <div className="mt-2 flex items-center justify-between text-[9px] sm:text-[10px] font-mono text-muted">
                  <span>Domain: {activeItem.branch}</span>
                  <span className="text-sunset-orange font-semibold">#{activeItem.tag}</span>
                </div>
              </div>
            </div>
          </motion.article>
        </AnimatePresence>
      </div>
    </section>
  );
}
