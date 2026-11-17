import { STIX_Two_Text, IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google';
import { CLUB_NAME, COLLEGE_NAME, SITE } from '@/lib/site';
import { ThemeProvider } from '@/components/ui/ThemeProvider';
import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
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
  keywords: SITE.keywords,
  authors: [{ name: CLUB_NAME }],
  creator: CLUB_NAME,
  publisher: COLLEGE_NAME,
  openGraph: {
    title: SITE.title,
    description: SITE.description,
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
    { media: '(prefers-color-scheme: dark)', color: '#0C0E1F' },
    { media: '(prefers-color-scheme: light)', color: '#F7F5EF' },
  ],
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
        </ThemeProvider>
      </body>
    </html>
  );
}
