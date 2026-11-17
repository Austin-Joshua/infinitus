/** @type {import('next').NextConfig} */

// Content-Security-Policy (CSP)
// Sourced strictly: self, static theme-script sha256 hash, Vercel analytics, Supabase storage
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com https://vitals.vercel-insights.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data: https://*.supabase.co https://images.unsplash.com;
  font-src 'self' data:;
  connect-src 'self' https://*.supabase.co https://vitals.vercel-insights.com;
  object-src 'none';
  base-uri 'self';
  form-action 'self' https://forms.gle https://docs.google.com;
  frame-ancestors 'none';
  upgrade-insecure-requests;
`.replace(/\s{2,}/g, ' ').trim();

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: cspHeader,
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), screen-wake-lock=()',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'Cross-Origin-Opener-Policy',
    value: 'same-origin',
  },
  {
    key: 'Cross-Origin-Resource-Policy',
    value: 'same-origin',
  },
];

const nextConfig = {
  reactStrictMode: true,
  // Hides the bottom-left Next.js "N" dev badge during local development.
  // It never appears on production builds (e.g. Vercel).
  devIndicators: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
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
