'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Lemniscate from '@/components/ui/Lemniscate';

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error for client diagnostics
    console.error('App runtime error caught by error boundary:', error);
  }, [error]);

  return (
    <section className="relative flex min-h-[85vh] items-center overflow-hidden pt-24 sm:pt-28">
      <div aria-hidden="true" className="graph-paper pointer-events-none absolute inset-0" />
      <div className="container-x relative grid items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="eyebrow text-amber-600 dark:text-amber-400">Error · Undefined Evaluation</p>
          <h1 className="h-display mt-4">Something went sideways</h1>
          <p className="lede mt-4 max-w-md">
            An unexpected error interrupted this page. You can attempt to recalculate the view or return to safety.
          </p>
          {error?.digest && (
            <p className="mt-3 font-mono text-xs text-muted">
              Reference code: <span className="text-fg">{error.digest}</span>
            </p>
          )}
          <div className="mt-8 flex flex-wrap items-center gap-3.5">
            <button
              type="button"
              onClick={() => reset()}
              className="btn-primary text-xs sm:text-sm cursor-pointer"
            >
              Try again <span aria-hidden="true">↻</span>
            </button>
            <Link href="/" className="btn-ghost text-xs sm:text-sm">
              <span aria-hidden="true">←</span> Return home
            </Link>
            <Link href="/contact" className="btn-ghost text-xs sm:text-sm">
              Report issue
            </Link>
          </div>
        </div>
        <div
          role="img"
          aria-label="Mathematical lemniscate curve"
          className="flex items-center justify-center max-w-md mx-auto lg:max-w-none w-full"
        >
          <Lemniscate axes dot draw className="w-full max-w-md" />
        </div>
      </div>
    </section>
  );
}
