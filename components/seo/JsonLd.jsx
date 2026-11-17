/**
 * Serializes structured data as JSON-LD and safely escapes '<' as \u003c
 * to protect against script injection into the HTML document.
 */
export default function JsonLd({ data }) {
  if (!data) return null;
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
