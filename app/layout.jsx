import { STIX_Two_Text, IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google';
import { CLUB_NAME, COLLEGE_NAME, SITE, SOCIAL } from '@/lib/site';
import { absoluteUrl } from '@/lib/seo';
import { ThemeProvider } from '@/components/ui/ThemeProvider';
import JsonLd from '@/components/seo/JsonLd';
import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/ui/ScrollToTop';
import '@/styles/globals.css';

// STIX is the typeface of mathematical publishing; it sets both headings and italic accents.
const serif = STIX_Two_Text({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});

const body = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
});

const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
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

    var play = !reduced && (!seen || (location.pathname === '/' && reloaded));

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
  },
};

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#090A10' },
    { media: '(prefers-color-scheme: light)', color: '#F7F5EF' },
  ],
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: CLUB_NAME,
  alternateName: 'INFINITUS RIT',
  url: SITE.url,
  description: SITE.description,
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: CLUB_NAME,
  alternateName: 'INFINITUS Mathematics Club',
  url: SITE.url,
  logo: absoluteUrl('/icon.svg'),
  email: SITE.contactEmail,
  description: SITE.description,
  parentOrganization: {
    '@type': 'CollegeOrUniversity',
    name: COLLEGE_NAME,
    url: 'https://ritchennai.org',
  },
  sameAs: [SOCIAL.instagram],
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Chennai',
    addressRegion: 'Tamil Nadu',
    addressCountry: 'IN',
    // TODO(owner): confirm from the RIT website the exact campus street address and PIN code
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${serif.variable} ${body.variable} ${mono.variable}`}
      // Lets Next.js turn smooth scrolling off while it resets scroll on route changes
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: initScript }} />
        <JsonLd data={websiteJsonLd} />
        <JsonLd data={organizationJsonLd} />
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
        <ThemeProvider>
          <Nav />
          {children}
          <Footer />
          <ScrollToTop />
        </ThemeProvider>
      </body>
    </html>
  );
}
