import { SITE, CLUB_NAME } from './site';

/**
 * Returns an absolute URL string for the given relative or absolute path.
 */
export function absoluteUrl(path = '') {
  if (!path) return SITE.url;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const base = SITE.url.replace(/\/+$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${cleanPath}`;
}

/**
 * Generates complete page metadata, spelling out full OpenGraph and Twitter objects.
 * Next.js replaces (does not merge) openGraph/twitter when nested routes set their own,
 * so this function ensures siteName, locale, canonical alternates, and images are always preserved.
 */
export function pageMetadata({
  title,
  description = SITE.description,
  path = '',
  image = '/opengraph-image',
  imageAlt = `${CLUB_NAME} — Mathematics Club of Rajalakshmi Institute of Technology`,
}) {
  const canonicalUrl = absoluteUrl(path);
  const imageUrl = absoluteUrl(image);

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'website',
      locale: 'en_IN',
      siteName: CLUB_NAME,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: imageAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}
