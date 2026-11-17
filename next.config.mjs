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
    ];
  },
};

export default nextConfig;
