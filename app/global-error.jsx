'use client';

import { useEffect } from 'react';
import { reportClientError } from '@/lib/reportError';

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[Global Error Boundary]:', error);
    }
    reportClientError({
      digest: error?.digest || null,
      route: typeof window !== 'undefined' ? window.location.pathname : '/',
      kind: 'global',
    });
  }, [error]);

  const handleReload = () => {
    try {
      if (typeof window !== 'undefined') {
        window.sessionStorage.removeItem('infinitus-intro');
        window.location.href = '/';
        return;
      }
    } catch {}
    if (reset) reset();
  };

  return (
    <html lang="en">
      <body className="min-h-screen bg-[#F0E8D8] text-[#0C0E1F] flex items-center justify-center p-6 font-sans">
        <div className="max-w-lg text-center space-y-4 rounded-2xl border border-[#FF7A1A]/35 bg-white/95 p-8 shadow-2xl">
          <p className="font-mono text-xs uppercase tracking-widest text-[#FF7A1A] font-semibold">500 · System Anomaly</p>
          <h1 className="text-2xl sm:text-3xl font-bold">Unexpected Exception</h1>
          <p className="text-sm opacity-80 leading-relaxed">
            A critical boundary error occurred. Please try reloading or returning home.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={handleReload}
              className="px-5 py-2.5 bg-[#FF7A1A] text-white rounded-xl text-xs sm:text-sm font-semibold hover:opacity-90 transition cursor-pointer shadow-md shadow-[#FF7A1A]/30"
            >
              Try again ↻
            </button>
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                handleReload();
              }}
              className="px-5 py-2.5 border border-[#FF7A1A]/40 rounded-xl text-xs sm:text-sm font-semibold hover:bg-black/5 transition"
            >
              Return to Home →
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
