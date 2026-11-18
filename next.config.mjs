/** @type {import('next').NextConfig} */

const supabaseHost = process.env.SUPABASE_URL
  ? new URL(process.env.SUPABASE_URL).hostname
  : '**.supabase.co';

const securityHeaders = [
  {
    key: 'Strict-Transport-Security',
    // While hosted on *.vercel.app, includeSubDomains and preload are removed
    // because vercel.app is a shared multi-tenant domain.
    // They can return once a dedicated custom domain (e.g. infinitus.ritchennai.edu.in) is mapped.
    value: 'max-age=63072000',
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
  devIndicators: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: supabaseHost,
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
      // Social crawler link previews (WhatsApp, LinkedIn, Facebook) require cross-origin access for OG images
      {
        source: '/opengraph-image',
        headers: [
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'cross-origin',
          },
        ],
      },
      {
        source: '/brand/infinitus-og.png',
        headers: [
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'cross-origin',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // Short vanity and campaign redirect URLs
      // TODO(owner): confirm which Google Form is recruitment and which is feedback.
      // Until confirmed by the owner, /join redirects temporarily (307) to /contact.
      {
        source: '/join',
        destination: '/contact',
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
