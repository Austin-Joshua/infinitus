'use client';

import IntroCurtain from '@/components/layout/IntroCurtain';

/**
 * Universal route template.
 * - Plays the opening curtain only on first visit or landing-page refresh (via IntroCurtain).
 * - Fades page in smoothly via pure CSS (.page-in) without blanking SSR content or blocking clicks.
 * - Renders main content fully visible in server HTML.
 */
export default function Template({ children }) {
  return (
    <>
      <IntroCurtain />
      <main id="main" tabIndex={-1} className="page-in relative focus:outline-none">
        {children}
      </main>
    </>
  );
}
