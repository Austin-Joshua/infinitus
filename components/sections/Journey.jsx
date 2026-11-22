'use client';

import { useState, useId, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { EASE } from '@/lib/motion';
import { playClick } from '@/lib/soundEffects';

const DRAW = 0.45;
const inView = { once: true, margin: '0px 0px -10% 0px' };

const AMBIENT_SYMBOLS = [
  { char: '∞', top: '10%', left: '8%', delay: 0 },
  { char: '∫', top: '22%', right: '12%', delay: 1.5 },
  { char: '∑', bottom: '15%', left: '14%', delay: 2.5 },
  { char: 'π', bottom: '25%', right: '8%', delay: 3.5 },
  { char: '√', top: '45%', right: '35%', delay: 1 },
];

function CloseIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

/** Detailed Modal showing the full retrospective and enlarged view for that academic year */
function YearDetailModal({ step, open, onClose }) {
  const [mounted, setMounted] = useState(false);
  const dialogRef = useRef(null);
  const closeBtnRef = useRef(null);
  const titleId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return undefined;

    const timer = setTimeout(() => {
      if (closeBtnRef.current) closeBtnRef.current.focus();
    }, 50);

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        playClick();
        onClose();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      clearTimeout(timer);
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open || !step || !mounted) return null;

  const modalContent = (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Backdrop */}
        <button
          type="button"
          aria-label="Close year retrospective"
          onClick={() => {
            playClick();
            onClose();
          }}
          className="absolute inset-0 bg-black/80 cursor-pointer"
        />

        {/* Modal Window with 3D Flip & Expand entrance */}
        <motion.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          initial={{ opacity: 0, rotateY: -80, scale: 0.8, y: 16 }}
          animate={{ opacity: 1, rotateY: 0, scale: 1, y: 0 }}
          exit={{ opacity: 0, rotateY: 80, scale: 0.8, y: 12 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformStyle: 'preserve-3d' }}
          className="relative z-10 w-full max-w-2xl max-h-[88vh] overflow-y-auto no-scrollbar rounded-2xl border border-sunset-orange/40 bg-card p-6 sm:p-8 shadow-2xl shadow-sunset-orange/15"
        >
          {/* Close Button */}
          <button
            ref={closeBtnRef}
            type="button"
            onClick={() => {
              playClick();
              onClose();
            }}
            aria-label="Close"
            className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-xl border border-sunset-orange/30 bg-card text-fg/70 transition-all hover:border-sunset-orange hover:bg-card hover:text-sunset-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent cursor-pointer"
          >
            <CloseIcon className="h-4 w-4" />
          </button>

          {/* Modal Header */}
          <div className="flex items-start justify-between gap-4 border-b border-fg/10 pb-5 pr-8">
            <div>
              <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                <span className="font-heading text-3xl sm:text-4xl font-extrabold text-sunset-orange">
                  {step.year}
                </span>
                {step.symbol && (
                  <span className="font-serif text-3xl sm:text-4xl font-black text-sunset-orange select-none leading-none drop-shadow-sm">
                    {step.symbol}
                  </span>
                )}
                {step.tag && (
                  <span className="chip border-sunset/40 bg-sunset/10 text-xs font-mono text-sunset font-bold">
                    {step.tag}
                  </span>
                )}
                {step.theme && (
                  <span className="chip border-fg/15 text-xs font-mono text-muted hidden sm:inline-block font-semibold">
                    {step.theme}
                  </span>
                )}
              </div>
              <h3 id={titleId} className="font-heading text-xl sm:text-2xl font-bold text-fg">
                {step.title}
              </h3>
            </div>
            {step.symbol && (
              <span className="font-serif text-6xl sm:text-7xl font-black text-sunset-orange/30 select-none shrink-0 drop-shadow-sm">
                {step.symbol}
              </span>
            )}
          </div>

          {/* Key Stats Grid */}
          {step.stats && step.stats.length > 0 && (
            <div className="mt-5 grid grid-cols-3 gap-2.5 sm:gap-3.5 items-stretch">
              {step.stats.map((stat, sIdx) => (
                <div
                  key={sIdx}
                  className="flex flex-col justify-between rounded-xl border border-fg/10 bg-bg/60 p-3 sm:p-4 text-center min-h-[84px]"
                >
                  <p className="font-heading text-xl sm:text-3xl font-extrabold text-sunset-orange">
                    {stat.value}
                  </p>
                  <p className="mt-1 font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-muted font-bold leading-snug">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Full Narrative Story */}
          <div className="mt-6">
            <h4 className="font-mono text-xs uppercase tracking-wider text-sunset-orange font-bold">
              The Year’s Retrospective
            </h4>
            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-fg/85">
              {step.fullStory || step.body}
            </p>
          </div>

          {/* Chronological Event Breakdown */}
          {step.chronicle && step.chronicle.length > 0 && (
            <div className="mt-6 border-t border-fg/10 pt-5">
              <h4 className="font-mono text-xs uppercase tracking-wider text-muted font-bold mb-3">
                Key Milestones & Landmark Events
              </h4>
              <div className="space-y-3">
                {step.chronicle.map((item, cIdx) => (
                  <div
                    key={cIdx}
                    className="rounded-xl border border-fg/10 bg-card/60 p-3.5 sm:p-4 transition-all hover:border-sunset-orange/30"
                  >
                    <h5 className="font-heading text-xs sm:text-sm font-bold text-fg">
                      {item.title}
                    </h5>
                    <p className="mt-1 text-xs text-muted leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Legacy Summary */}
          {step.legacy && (
            <div className="mt-6 rounded-xl border border-sunset-orange/30 bg-sunset-orange/5 p-4 text-xs leading-relaxed text-fg/90">
              <span className="font-bold text-sunset-orange">Legacy & Impact: </span>
              {step.legacy}
            </div>
          )}

          {/* Close CTA */}
          <div className="mt-6 flex justify-end border-t border-fg/10 pt-4">
            <button
              type="button"
              onClick={() => {
                playClick();
                onClose();
              }}
              className="btn-primary !px-6 !py-2.5 text-xs font-bold cursor-pointer"
            >
              Done Reading
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}

/** Individual 3D Flip Card for each academic year */
function JourneyCard({ step, isEnlarged, onEnlarge }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // Guarantee that when the enlarged modal closes, the card resets to the clean initial front position
  useEffect(() => {
    if (!isEnlarged) {
      setIsFlipped(false);
    }
  }, [isEnlarged]);

  const handleCardClick = () => {
    playClick();
    setIsFlipped(true);
    onEnlarge(step);
  };

  return (
    <div
      data-year={step.year}
      className="perspective-1000 group relative h-full w-full min-h-[300px] sm:min-h-[320px] select-none"
      onClick={handleCardClick}
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{
          duration: prefersReducedMotion ? 0.01 : 0.32,
          ease: [0.16, 1, 0.3, 1],
        }}
        style={{ transformStyle: 'preserve-3d' }}
        className="relative h-full w-full cursor-pointer"
      >
        {/* FRONT FACE - Matches pristine earlier initial position */}
        <div
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
          className="card card-hover flex h-full w-full flex-col justify-between overflow-hidden rounded-xl p-5 sm:p-6 border border-fg/15 bg-card shadow-md transition-all duration-300 hover:shadow-xl hover:border-sunset-orange/50 hover:-translate-y-1"
          role="button"
          tabIndex={0}
          aria-label={`${step.year}: ${step.title}. Click to flip card and view details.`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleCardClick();
            }
          }}
        >
          <div>
            {/* Header Row: Year + Bold Math Symbol + Tag */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <p className="font-heading text-3xl font-extrabold tracking-tight text-accent transition-colors duration-300 group-hover:text-sunset-orange sm:text-4xl">
                  {step.year}
                </p>
                {step.symbol && (
                  <span
                    className="font-serif text-2xl sm:text-3xl font-black text-sunset-orange select-none leading-none drop-shadow-sm"
                    title={`Mathematical Symbol: ${step.symbol}`}
                  >
                    {step.symbol}
                  </span>
                )}
              </div>
              {step.tag && (
                <span className="chip border-sunset/40 bg-sunset/10 text-[11px] font-mono text-sunset font-bold">
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

          {/* Key Events & Highlights - Displaying all items cleanly as in initial state */}
          {step.events && step.events.length > 0 && (
            <div className="mt-4 border-t border-fg/10 pt-3">
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted font-bold mb-1.5">
                Key Events & Highlights
              </p>
              <ul className="flex flex-wrap gap-1.5">
                {step.events.map((ev, eIdx) => (
                  <li
                    key={eIdx}
                    className="rounded-md border border-fg/10 bg-bg-2/60 px-2 py-0.5 text-[10px] sm:text-[11px] font-sans text-fg/80"
                  >
                    {ev}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* BACK FACE - Visible during 3D flip animation */}
        <div
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
          className="absolute inset-0 card flex h-full w-full flex-col justify-between overflow-hidden rounded-xl p-5 border border-sunset-orange/40 bg-card shadow-xl"
          role="button"
          tabIndex={isFlipped ? 0 : -1}
          aria-label={`${step.year} retrospective stats.`}
        >
          <div>
            <div className="flex items-center justify-between gap-2 border-b border-fg/10 pb-2">
              <div className="flex items-center gap-2">
                <span className="font-heading text-lg sm:text-xl font-bold text-sunset-orange shrink-0">
                  {step.year} Archive
                </span>
                {step.symbol && (
                  <span className="font-serif text-xl font-black text-sunset-orange select-none">
                    {step.symbol}
                  </span>
                )}
              </div>
              <span className="chip border-sunset/40 bg-sunset/10 font-mono text-[10px] text-sunset font-bold">
                {step.tag || 'Archive'}
              </span>
            </div>

            {/* Stats Grid on Back Face */}
            {step.stats && step.stats.length > 0 && (
              <div className="mt-3.5 grid grid-cols-3 gap-2 text-center items-stretch">
                {step.stats.map((stat, sIdx) => (
                  <div
                    key={sIdx}
                    className="flex flex-col justify-between rounded-lg border border-fg/10 bg-bg-2/60 p-2 min-h-[68px] sm:min-h-[72px]"
                  >
                    <p className="font-heading text-sm sm:text-base font-extrabold text-sunset-orange leading-none pt-0.5">
                      {stat.value}
                    </p>
                    <p className="mt-1 font-mono text-[8px] sm:text-[9px] uppercase tracking-tight text-muted font-bold leading-tight">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Legacy Excerpt */}
            <p className="mt-3 text-xs leading-relaxed text-muted line-clamp-3">
              {step.legacy || step.body}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/**
 * Animated Timeline Journey:
 * - Ambient floating mathematical glyphs with bold styling.
 * - Dynamic glowing progress line that draws as user scrolls into view.
 * - Initial state displays all cards in their clean, upright earlier front position.
 * - On clicking any card, it executes a 3D perspective flip and enlarges into the comprehensive retrospective modal.
 * - Closing the modal resets the card to its clean initial position.
 */
export default function Journey({ heading, steps }) {
  const [activeStep, setActiveStep] = useState(null);
  const at = (i) => 0.05 + (DRAW * i) / steps.length;

  return (
    <section id="journey-timeline" className="section relative overflow-hidden !py-8 sm:!py-14">
      {/* Subtle graph paper and floating mathematical symbols */}
      <div aria-hidden="true" className="graph-paper pointer-events-none absolute inset-0 opacity-40" />

      {AMBIENT_SYMBOLS.map((s, idx) => (
        <motion.span
          key={idx}
          aria-hidden="true"
          initial={{ opacity: 0, y: 15 }}
          animate={{
            opacity: [0.2, 0.45, 0.2],
            y: [0, -12, 0],
          }}
          transition={{
            duration: 6,
            delay: s.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="pointer-events-none absolute select-none font-serif text-4xl sm:text-6xl font-black text-accent/30 dark:text-sunset-orange/30 drop-shadow-sm"
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
          transition={{ duration: 0.22, ease: EASE.out }}
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
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={inView}
                transition={{ duration: 0.25, delay: at(i), ease: EASE.out }}
                className="group relative pl-10 lg:pl-0 lg:pt-10"
              >
                {/* Node with Pulsing Halo Ring */}
                <div className="absolute left-0 top-1.5 lg:top-0 flex items-center justify-center">
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

                {/* Milestone Interactive 3D Flip Card */}
                <JourneyCard
                  step={step}
                  isEnlarged={activeStep?.year === step.year}
                  onEnlarge={(s) => setActiveStep(s)}
                />
              </motion.li>
            ))}
          </ol>
        </div>
      </div>

      {/* Enlarged Year Retrospective Modal Dialog with 3D Flip & Scale */}
      <YearDetailModal
        step={activeStep}
        open={Boolean(activeStep)}
        onClose={() => setActiveStep(null)}
      />
    </section>
  );
}
