/** Shared easing curves. `out` settles swiftly and sharply; `inOut` is for wipes and curtains. */
export const EASE = {
  out: [0.16, 1, 0.3, 1],
  inOut: [0.76, 0, 0.24, 1],
};

/** Fast and responsive animation durations across all components */
export const DURATION = {
  instant: 0.08,
  fast: 0.14,
  normal: 0.2,
  slow: 0.28,
};

/**
 * Seconds to hold entrance animations so they play once the intro curtain has lifted.
 * Returns 0 on the server and whenever <html> lacks 'intro-pending';
 * otherwise max(0, 1.3 - performance.now() / 1000).
 */
export function introDelay() {
  return 0;
}
