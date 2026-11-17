/** Shared easing curves. `out` settles softly; `inOut` is for wipes and curtains. */
export const EASE = {
  out: [0.22, 1, 0.36, 1],
  inOut: [0.76, 0, 0.24, 1],
};

/**
 * Seconds to hold entrance animations so they play once the intro curtain has lifted.
 * Returns 0 on the server and whenever <html> lacks 'intro-pending';
 * otherwise max(0, 1.3 - performance.now() / 1000).
 */
export function introDelay() {
  if (typeof window === 'undefined') return 0;
  const root = document.documentElement;
  if (!root.classList.contains('intro-pending')) return 0;
  return Math.max(0, 1.3 - performance.now() / 1000);
}
