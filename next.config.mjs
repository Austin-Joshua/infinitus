/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Hides the bottom-left Next.js "N" dev badge during local development.
  // It never appears on production builds (e.g. Vercel).
  devIndicators: false,
  async redirects() {
    return [
      // Enforce non-www canonical host
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.infinitus-seven.vercel.app' }],
        destination: 'https://infinitus-seven.vercel.app/:path*',
        permanent: true,
      },
      // Short Instagram story / caption links
      {
        source: '/join',
        destination: 'https://forms.gle/wMbC1SEdAXYYbFvn9',
        permanent: false,
      },
      {
        source: '/instagram',
        destination: 'https://www.instagram.com/infinitus_club.rit/',
        permanent: false,
      },
      {
        source: '/ig',
        destination: 'https://www.instagram.com/infinitus_club.rit/',
        permanent: false,
      },
      {
        source: '/feedback',
        destination: 'https://forms.gle/wMbC1SEdAXYYbFvn9',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
