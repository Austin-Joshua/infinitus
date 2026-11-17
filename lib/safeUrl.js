/**
 * Validates and sanitizes URLs to protect against XSS and unsafe protocol injection.
 * Only allows 'https:', 'http:', or site-relative ('/...') paths.
 * Rejects 'javascript:', 'data:', 'vbscript:', and protocol-relative ('//...') URLs.
 */
export function safeUrl(url) {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();

  // Site-relative paths (/events, /brand/logo.webp)
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
    return trimmed;
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
      return trimmed;
    }
  } catch {
    return null;
  }

  return null;
}

/**
 * Checks whether a given URL is a legitimate Google Forms registration link.
 */
export function isRegistrationFormUrl(url) {
  if (!url || typeof url !== 'string') return false;
  const clean = safeUrl(url);
  if (!clean) return false;
  return clean.includes('forms.gle/') || clean.includes('docs.google.com/forms');
}
