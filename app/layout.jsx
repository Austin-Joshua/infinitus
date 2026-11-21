import localFont from 'next/font/local';
import { headers } from 'next/headers';
import { CLUB_NAME, COLLEGE_NAME, SITE, SOCIAL } from '@/lib/site';
import { absoluteUrl } from '@/lib/seo';
import { ThemeProvider } from '@/components/ui/ThemeProvider';
import JsonLd from '@/components/seo/JsonLd';
import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/ui/ScrollToTop';
import CommandPalette from '@/components/ui/CommandPalette';
import PwaManager from '@/components/ui/PwaManager';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import '@/styles/globals.css';

// STIX is the typeface of mathematical publishing; it sets both headings and italic accents.
const serif = localFont({
  src: [
    {
      path: './fonts/stix-two-text-normal.woff2',
      weight: '400 700',
      style: 'normal',
    },
    {
      path: './fonts/stix-two-text-italic.woff2',
      weight: '400 700',
      style: 'italic',
    },
  ],
  variable: '--font-serif',
  display: 'swap',
});

const body = localFont({
  src: './fonts/ibm-plex-sans.woff2',
  weight: '100 700',
  style: 'normal',
  variable: '--font-body',
  display: 'swap',
});

const mono = localFont({
  src: [
    {
      path: './fonts/ibm-plex-mono-400.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/ibm-plex-mono-500.woff2',
      weight: '500',
      style: 'normal',
    },
  ],
  variable: '--font-mono',
  display: 'swap',
});

// Before paint: apply saved theme or system preference so colors render instantly,
// and evaluate curtain play state (first visit or landing reload only).
const initScript = `
(function () {
  var root = document.documentElement;
  try {
    var stored = localStorage.getItem('infinitus-theme');
    root.classList.toggle('dark', stored ? stored === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches);
  } catch (e) {}

  try {
    var reduced = false;
    try {
      reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e) {}

    var reloaded = false;
    try {
      var navEntry = performance.getEntriesByType('navigation')[0];
      reloaded = navEntry && navEntry.type === 'reload';
    } catch (e) {}

    var seen = false;
    try {
      seen = sessionStorage.getItem('infinitus-intro') === '1';
    } catch (e) {}

    var play = !reduced && (!seen || reloaded);

    try {
      sessionStorage.setItem('infinitus-intro', '1');
    } catch (e) {
      play = false;
    }

    if (play) {
      root.classList.add('intro-pending');
    } else {
      root.classList.add('intro-seen');
    }
  } catch (e) {
    root.classList.add('intro-seen');
  }
})();
`;

export const metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE.title,
    template: SITE.titleTemplate,
  },
  description: SITE.description,
  authors: [{ name: CLUB_NAME }],
  creator: CLUB_NAME,
  publisher: COLLEGE_NAME,
  category: 'education',
  openGraph: {
    title: SITE.title,
    description: SITE.description,
    url: SITE.url,
    type: 'website',
    locale: SITE.locale,
    siteName: CLUB_NAME,
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE.title,
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#090A10' },
    { media: '(prefers-color-scheme: light)', color: '#F0E8D8' },
  ],
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: CLUB_NAME,
  alternateName: [
    'INFINITUS RIT',
    'INFINITUS Club',
    'RIT Mathematics Club',
    'INFINITUS Mathematics Club',
    'Rajalakshmi Institute of Technology Mathematics Club',
  ],
  url: SITE.url,
  description: SITE.description,
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': ['Organization', 'EducationalOrganization'],
  name: CLUB_NAME,
  legalName: 'INFINITUS Mathematics Club',
  alternateName: [
    'INFINITUS RIT',
    'INFINITUS Club',
    'RIT Mathematics Club',
    'INFINITUS Mathematics Club',
    'Rajalakshmi Institute of Technology Mathematics Club',
  ],
  url: SITE.url,
  logo: absoluteUrl('/icon.png'),
  image: absoluteUrl('/opengraph-image'),
  foundingDate: '2023',
  email: SITE.contactEmail,
  description: SITE.description,
  parentOrganization: {
    '@type': 'CollegeOrUniversity',
    name: COLLEGE_NAME,
    alternateName: 'RIT Chennai',
    url: 'https://ritchennai.org',
  },
  sameAs: [SOCIAL.instagram],
  knowsAbout: [
    'Mathematics',
    'Mathematical Olympiad',
    'Algorithms',
    'Logic Puzzles',
    'Problem Solving',
    'Competitive Programming',
    'Cryptography',
  ],
  ...(SITE.address ? { address: SITE.address } : {}),
};

export default async function RootLayout({ children }) {
  let nonce = undefined;
  try {
    nonce = (await headers()).get('x-nonce') || undefined;
  } catch {
    // Non-request context
  }

  return (
    <html
      lang="en"
      className={`${serif.variable} ${body.variable} ${mono.variable}`}
      // Lets Next.js turn smooth scrolling off while it resets scroll on route changes
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script nonce={nonce} dangerouslySetInnerHTML={{ __html: initScript }} />
        <JsonLd data={websiteJsonLd} nonce={nonce} />
        <JsonLd data={organizationJsonLd} nonce={nonce} />
        <noscript>
          <style>{`
            .page-in { opacity: 1 !important; transform: none !important; animation: none !important; }
            [style*="opacity:0"], [style*="opacity: 0"] { opacity: 1 !important; }
            [style*="transform"] { transform: none !important; }
            html.intro-pending::before { display: none !important; }
          `}</style>
        </noscript>
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:font-semibold focus:text-white focus:shadow-xl focus:outline-none"
        >
          Skip to content
        </a>
        <ThemeProvider>
          <Nav />
          {children}
          <Footer />
          <ScrollToTop />
          <CommandPalette />
          <PwaManager />
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
