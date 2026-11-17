import { headers } from 'next/headers';

/**
 * Serializes structured data as JSON-LD and safely escapes '<' as \u003c
 * to protect against script injection into the HTML document.
 * Automatically attaches the request nonce for strict Content Security Policy compliance.
 */
export default async function JsonLd({ data, nonce }) {
  if (!data) return null;

  let scriptNonce = nonce;
  if (!scriptNonce) {
    try {
      scriptNonce = (await headers()).get('x-nonce') || undefined;
    } catch {
      // In static compilation or non-request context, fallback gracefully
    }
  }

  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return (
    <script
      type="application/ld+json"
      nonce={scriptNonce}
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
