/**
 * Sends a client-side error report to the internal telemetry endpoint.
 * Transmits strictly minimal, non-identifying telemetry (digest, route, kind).
 * Uses navigator.sendBeacon with fetch keepalive fallback; never throws.
 */

export const ROUTE_PATTERN = /^\/[A-Za-z0-9_\-/.]{0,199}$/;
export const DIGEST_PATTERN = /^[A-Za-z0-9_-]{1,200}$/;

/**
 * Validates error report payload against strict security and format rules.
 */
export function validateErrorReportPayload(body) {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return { valid: false, error: 'Malformed payload' };
  }

  const { digest, route, kind } = body;

  if (kind !== 'route' && kind !== 'global') {
    return { valid: false, error: 'Invalid error kind' };
  }

  if (typeof route !== 'string' || !ROUTE_PATTERN.test(route)) {
    return { valid: false, error: 'Invalid route format' };
  }

  if (digest !== undefined && digest !== null && digest !== '') {
    if (typeof digest !== 'string' || !DIGEST_PATTERN.test(digest)) {
      return { valid: false, error: 'Invalid digest format' };
    }
  }

  return {
    valid: true,
    data: {
      digest: typeof digest === 'string' && digest.length > 0 ? digest : null,
      route,
      kind,
    },
  };
}

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
