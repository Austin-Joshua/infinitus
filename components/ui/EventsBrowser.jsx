'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import EventCard from '@/components/ui/EventCard';
import { COPY } from '@/lib/site';
import { eventYear } from '@/lib/format';

const INITIAL_COUNT = 8;

/** Past events with year filter tabs and a show-more toggle. */
export default function EventsBrowser({ events }) {
  const [year, setYear] = useState('All');
  const [expanded, setExpanded] = useState(false);

  const years = useMemo(
    () => ['All', ...[...new Set(events.map((e) => eventYear(e.eventDate)).filter(Boolean))].sort((a, b) => b - a)],
    [events]
  );

  const filtered = year === 'All' ? events : events.filter((e) => eventYear(e.eventDate) === year);
  const visible = expanded ? filtered : filtered.slice(0, INITIAL_COUNT);

  return (
    <div>
      <div role="group" aria-label="Filter events by year" className="flex flex-wrap gap-2.5 border-b border-fg/15 pb-6">
        {years.map((y) => {
          const active = y === year;
          return (
            <button
              key={y}
              type="button"
              aria-pressed={active}
              onClick={() => setYear(y)}
              className={`rounded-full px-4 py-2 font-mono text-xs font-semibold transition-all duration-150 active:scale-95 ${
                active
                  ? 'bg-sunset-orange text-white border border-sunset-orange shadow-lg shadow-sunset-orange/35 scale-[1.02]'
                  : 'bg-card border border-sunset-orange/35 text-fg/85 shadow-sm shadow-sunset-orange/5 hover:border-sunset-orange/70 hover:text-fg hover:shadow-md hover:-translate-y-0.5'
              }`}
            >
              {y}
            </button>
          );
        })}
      </div>

      <motion.div layout className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((event) => (
            <motion.div
              key={event.id}
              layout
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <EventCard event={event} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length > INITIAL_COUNT && (
        <div className="mt-10 flex justify-center">
          <button type="button" onClick={() => setExpanded((v) => !v)} className="btn-ghost">
            {expanded ? COPY.events.showLess : `${COPY.events.showAll} (${filtered.length})`}
          </button>
        </div>
      )}
    </div>
  );
}
