/**
 * Sends a client-side error report to the internal telemetry endpoint.
 * Transmits strictly minimal, non-identifying telemetry (digest, route, kind).
 * Uses navigator.sendBeacon with fetch keepalive fallback; never throws.
 */
export function reportClientError({ digest, route, kind }) {
  try {
    if (typeof window === 'undefined') return;

    const payload = JSON.stringify({
      digest: digest ? String(digest).slice(0, 200) : null,
      route: (route || window.location.pathname || '/').slice(0, 200),
      kind: kind === 'global' ? 'global' : 'route',
    });

    const url = '/api/report-error';

    if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
      const blob = new Blob([payload], { type: 'application/json' });
      navigator.sendBeacon(url, blob);
    } else {
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true,
      }).catch(() => {
        // Silently swallow network errors; telemetry failure must never interrupt user recovery
      });
    }
  } catch {
    // Silently ignore reporting errors
  }
}
