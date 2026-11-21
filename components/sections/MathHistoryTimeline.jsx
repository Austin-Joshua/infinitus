'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MATH_ERAS, MATH_MILESTONES } from '@/lib/mathHistory';
import { playClick } from '@/lib/soundEffects';

export default function MathHistoryTimeline() {
  const [activeEra, setActiveEra] = useState('all');
  const [selectedMilestone, setSelectedMilestone] = useState(MATH_MILESTONES[0].id);

  const filteredMilestones = useMemo(() => {
    if (activeEra === 'all') return MATH_MILESTONES;
    return MATH_MILESTONES.filter((m) => m.era === activeEra);
  }, [activeEra]);

  const activeItem =
    MATH_MILESTONES.find((m) => m.id === selectedMilestone) || filteredMilestones[0];

  return (
    <section
      id="math-history-timeline"
      className="section relative overflow-hidden !py-12 sm:!py-16 border-t border-fg/10"
      aria-label="Interactive Mathematical History & Heritage Timeline"
    >
      <div aria-hidden="true" className="graph-paper pointer-events-none absolute inset-0 opacity-30" />

      <div className="container-x relative">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-sunset-orange animate-pulse" />
              <p className="font-mono text-xs uppercase tracking-widest text-sunset-orange font-semibold">
                Mathematical Heritage
              </p>
            </div>
            <h2 className="font-heading text-2xl font-bold tracking-tight text-fg sm:text-3xl lg:text-4xl mt-2">
              Chronicles of Mathematical Discovery
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-muted max-w-2xl">
              From Aryabhata and Madhava to Euler, Ramanujan, and modern neural manifolds—the centuries of mathematical insight that inspire INFINITUS.
            </p>
          </div>

          {/* Era Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1" role="tablist" aria-label="Filter eras">
            {MATH_ERAS.map((era) => {
              const active = activeEra === era.id;
              return (
                <button
                  key={era.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => {
                    playClick();
                    setActiveEra(era.id);
                  }}
                  className={`rounded-full px-3.5 py-1 text-xs font-mono font-medium transition-all whitespace-nowrap active:scale-95 ${
                    active
                      ? 'bg-sunset-orange text-white font-semibold shadow-sm shadow-sunset-orange/30'
                      : 'border border-border/60 text-muted hover:text-fg hover:border-sunset-orange/40 bg-card/60'
                  }`}
                >
                  {era.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Timeline Horizontal / Desktop Stepper */}
        <div className="relative mt-2 mb-8 overflow-x-auto pb-3">
          <div className="flex items-center min-w-[680px] justify-between relative px-4">
            {/* Background Track Line */}
            <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-0.5 bg-gradient-to-r from-sunset-orange/20 via-sunset-orange/50 to-sunset-orange/20 -z-0" />

            {filteredMilestones.map((item, idx) => {
              const isSelected = item.id === activeItem.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    playClick();
                    setSelectedMilestone(item.id);
                  }}
                  className="group relative z-10 flex flex-col items-center focus-visible:outline-none"
                  aria-label={`Select ${item.title}`}
                >
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-mono font-bold transition-all duration-300 ${
                      isSelected
                        ? 'bg-sunset-orange text-white scale-110 shadow-lg shadow-sunset-orange/40 ring-4 ring-sunset-orange/20'
                        : 'border border-border bg-card text-muted group-hover:border-sunset-orange/60 group-hover:text-fg'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <span
                    className={`mt-2 font-mono text-[11px] whitespace-nowrap transition-colors ${
                      isSelected ? 'font-bold text-sunset-orange' : 'text-muted group-hover:text-fg'
                    }`}
                  >
                    {item.year}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Featured Milestone Card: Clean Single-Element Layout */}
        <AnimatePresence mode="wait">
          <motion.article
            key={activeItem.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.24, ease: 'easeOut' }}
            data-testid="math-history-active-card"
            className="rounded-2xl border border-sunset-orange/30 bg-card p-6 sm:p-8 shadow-xl shadow-black/5"
          >
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.9fr)] items-start">
              {/* Left Column: Historical Context */}
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="rounded-full border border-sunset-orange/40 bg-sunset-orange/10 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-sunset-orange">
                    {activeItem.year}
                  </span>
                  <span className="font-mono text-xs text-muted">
                    {activeItem.century}
                  </span>
                  <span className="rounded-full border border-border/80 bg-bg/80 px-2.5 py-0.5 font-mono text-[10px] text-muted">
                    {activeItem.branch}
                  </span>
                </div>

                <h3 className="font-heading text-xl sm:text-2xl lg:text-3xl font-bold text-fg tracking-tight">
                  {activeItem.title}
                </h3>
                <p className="font-sans text-sm font-semibold text-sunset-orange mt-1">
                  {activeItem.subtitle}
                </p>

                <p className="mt-4 font-sans text-xs sm:text-sm leading-relaxed text-muted">
                  {activeItem.description}
                </p>

                <div className="mt-6 border-t border-border/50 pt-4">
                  <p className="font-mono text-[11px] uppercase tracking-wider text-muted font-semibold">
                    Key Historical Impact
                  </p>
                  <p className="mt-1 text-xs text-fg/90">
                    {activeItem.keyContribution}
                  </p>
                </div>
              </div>

              {/* Right Column: Mathematical Formula & Identity */}
              <div className="flex flex-col justify-center rounded-xl border border-border/60 bg-bg/60 p-5 sm:p-6">
                <span className="font-mono text-[10px] uppercase tracking-widest text-sunset-orange font-semibold">
                  Foundational Mathematical Equation
                </span>

                <div className="mt-3 overflow-x-auto rounded-lg bg-card/90 border border-sunset-orange/20 p-4 font-mono text-sm sm:text-base font-bold text-fg">
                  <code>{activeItem.formula}</code>
                </div>

                <div className="mt-4 flex items-center justify-between text-[11px] font-mono text-muted">
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
