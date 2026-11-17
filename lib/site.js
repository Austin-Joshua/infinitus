import { EVENTS, MEMBERS } from './data';

/**
 * Official site copy, navigation map, and metadata.
 * Sourced from docs/INFINITUS_Official_Website_Content.md and the club's Instagram.
 */

export const COLLEGE_NAME = 'Rajalakshmi Institute of Technology';
export const COLLEGE_SHORT = 'RIT';

export const CLUB_NAME = 'INFINITUS Club';
export const CLUB_SHORT = 'INFINITUS';

export const SITE = {
  title: 'INFINITUS | RIT Mathematics Club',
  titleTemplate: '%s | INFINITUS',
  description:
    'INFINITUS is the official Mathematics Club of Rajalakshmi Institute of Technology, Chennai. We run campus olympiads, algorithm challenges, applied workshops, and peer problem-solving sessions.',
  shortDescription:
    'The Mathematics Club of Rajalakshmi Institute of Technology, Chennai. We connect mathematical theory with computation, logic games, and collaborative engineering.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://infinitus-seven.vercel.app',
  contactEmail: 'infinitus@ritchennai.edu.in',
  location: 'Chennai, Tamil Nadu, India',
  locale: 'en_IN',
};

export const SOCIAL = {
  instagram: 'https://www.instagram.com/infinitus_club.rit/',
  instagramHandle: '@infinitus_club.rit',
  queriesForm: 'https://forms.gle/wMbC1SEdAXYYbFvn9',
  // TODO(owner): Add official Google Form recruitment link when recruitment cycle opens
  recruitmentForm: null,
};

/** Site pages, in navigation order. */
export const PAGES = [
  { id: 'home', href: '/', navLabel: 'Home' },
  { id: 'about', href: '/about', navLabel: 'About' },
  { id: 'events', href: '/events', navLabel: 'Events' },
  { id: 'team', href: '/team', navLabel: 'Team' },
  { id: 'gallery', href: '/gallery', navLabel: 'Gallery' },
  { id: 'contact', href: '/contact', navLabel: 'Contact', navVariant: 'button' },
];

export const NAV_LINKS = PAGES;

export function pageById(id) {
  return PAGES.find((p) => p.id === id);
}

export const COPY = {
  hero: {
    badge: 'Official Mathematics Club',
    tagline: 'Where logic meets innovation',
    support:
      'Rajalakshmi Institute of Technology, Chennai — mathematical olympiads, cryptography puzzles, web dev workshops, and competitive problem solving.',
    primaryCta: 'Explore events',
    secondaryCta: 'Meet the team',
    scrollHint: 'Scroll',
  },
  home: {
    // TODO(owner): Confirm general membership count (350+) and total participant count (1,200+) before re-adding to marquee.
    marquee: [
      'SHINKA — Strikers 2026',
      `${EVENTS.length} Events Hosted`,
      "Mathspire — Expilog '25",
      `${MEMBERS.length} Committee Members`,
      'PiDoku: Decode π',
      'Matrix Reloaded',
      'National Mathematics Day',
      "Infinity Quest '24",
    ],
    aboutStatement: 'Cultivating mathematical curiosity, problem solving, and analytical thinking',
    aboutStatementAccent: 'beyond the lecture hall.',
    exploreEyebrow: 'Contents',
    exploreHeading: 'Find your way around',
    explore: {
      about: 'Who we are, what we do, and how far we have come since 2023.',
      events: 'Championships, quizzes, workshops and creative contests — every one we have hosted.',
      team: 'The Core Committee 2026–27 and what each role looks after.',
      gallery: 'Snapshots from our events, celebrations and milestones.',
    },
    eventsHeading: 'Latest from the club',
    eventsCta: 'All events',
    teamHeading: 'The people behind it',
    teamCta: 'Full committee',
    galleryHeading: 'Moments, in motion',
    galleryCta: 'Open gallery',
    ctaEyebrow: 'Say hello',
    ctaHeading: 'Have a question, an idea, or a problem worth solving?',
    ctaButton: 'Get in touch',
  },
  pages: {
    about: {
      title: 'About Us | INFINITUS RIT',
      description: 'Learn about INFINITUS at RIT Chennai — student-led competitions, technical workshops, mathematical games, and our journey since 2023.',
    },
    events: {
      title: 'Math Events & Competitions | INFINITUS RIT',
      description: 'Explore mathematics competitions, quizzes, championships, and workshops hosted by INFINITUS at Rajalakshmi Institute of Technology, Chennai.',
    },
    team: {
      title: 'Core Committee & Team | INFINITUS RIT',
      description: 'Meet the INFINITUS Core Committee 2026–27 at Rajalakshmi Institute of Technology — student coordinators, leadership, and faculty guidance.',
    },
    gallery: {
      title: 'Event Gallery & Moments | INFINITUS RIT',
      description: 'Photo highlights from INFINITUS club events, symposia, competitions, and student activities at Rajalakshmi Institute of Technology, Chennai.',
    },
    contact: {
      title: 'Contact INFINITUS | Mathematics Club RIT',
      description: 'Get in touch with INFINITUS, the official Mathematics Club of Rajalakshmi Institute of Technology, Chennai for queries, partnerships, and ideas.',
    },
  },
  notFound: {
    heading: 'This page tends to infinity',
    body: "We followed the limit and found nothing there. The page you're after may have moved.",
    cta: 'Back to home',
  },
  about: {
    eyebrow: 'About INFINITUS',
    statement: 'A student community exploring how pure logic and applied mathematics shape',
    statementAccent: 'technology, computation, and everyday reasoning.',
    body: 'INFINITUS is the official Mathematics Club of Rajalakshmi Institute of Technology, Chennai. Founded in 2023, we bridge classroom mathematics with real problem solving through student-led competitions, technical workshops, mathematical games, and intercollegiate contests.',
    bodySecondary:
      'Our initiatives span graph theory, algorithmic logic, statistical modelling, and puzzle decryption. Whether preparing for competitive challenges or discovering the geometry in everyday structures, members solve problems together in a supportive peer environment.',
    pillars: [
      {
        title: 'Competitions & quizzes',
        body: 'Team challenges, online quizzes and championships that put problem-solving speed and logic to the test.',
      },
      {
        title: 'Workshops & sessions',
        body: 'Hands-on learning — from web development to statistics storytelling and guest lectures.',
      },
      {
        title: 'Games & puzzles',
        body: 'PiDoku, treasure hunts and channel-surfing chaos — mathematics you play, not just study.',
      },
      {
        title: 'Math × technology',
        body: 'Initiatives that connect mathematical thinking with code, data and innovation.',
      },
      {
        title: 'Creative mathematics',
        body: 'Poster contests, photography and memes that reveal the beauty of maths in everyday life.',
      },
      {
        title: 'The Math Podcast',
        body: 'Fresh conversations on mathematics, ideas and the people behind them.',
      },
    ],
    focusQuote: 'Mathematics beyond the classroom.',
    focus:
      'We operate as an open platform where undergraduates across all engineering disciplines share insights, design challenging math events, and build practical intuition for analytical thinking.',
    journeyHeading: 'Our journey so far',
    journey: [
      {
        year: '2023',
        title: 'First steps & Genesis',
        tag: 'Foundations',
        symbol: '∞',
        body: 'A mathematical rangoli, the National Mathematics Day celebration on campus, and the formal inauguration of INFINITUS.',
        events: ['National Mathematics Day', 'Mathematical Rangoli', 'Founding Induction'],
      },
      {
        year: '2024',
        title: 'Finding our rhythm',
        tag: 'Expansion',
        symbol: '∑',
        body: "Math-O-Fest '24 symposium, expert guest lecture from SSN College of Engineering, and the multi-stage Infinity Quest '24.",
        events: ["Math-O-Fest '24", 'SSN Keynote Lecture', "Infinity Quest '24"],
      },
      {
        year: '2025',
        title: 'Growing louder & Flagship',
        tag: 'Recognition',
        symbol: '∫',
        body: "Mathspire Expilog '25 with 4 challenging rounds, Matrix Reloaded workshop, The Math Podcast, and RIT's Best Vice President 2024–25 honour.",
        events: ["Mathspire Expilog '25", 'Matrix Reloaded Workshop', 'Best VP Award', 'The Math Podcast'],
      },
      {
        year: '2026',
        title: 'Beyond campus & Horizons',
        tag: 'Championship',
        symbol: 'π',
        body: 'PI-QUEST on Pi Day, PiDoku logic sprint, and SHINKA — our 2-day mathematics & innovation championship for school students.',
        events: ['SHINKA Strikers 2026', 'PI-QUEST Pi Day', 'PiDoku: Decode π', 'Algo-Odyssey Challenge'],
      },
    ],
  },
  events: {
    eyebrow: 'Events & Contests',
    heading: "What we've hosted",
    intro: 'Championships, quizzes, workshops and creative contests — a look at what INFINITUS has hosted.',
    featuredLabel: 'Latest',
    upcomingHeading: 'Upcoming',
    registerCta: 'Register now',
    nextEventTitle: 'Next event: to be announced',
    nextEventBody: 'New events are announced on Instagram first. Follow along so you never miss a registration.',
    viewPost: 'View on Instagram',
    showAll: 'Show all events',
    showLess: 'Show fewer',
    details: 'Details',
    backToEvents: 'All events',
    prevEvent: 'Newer',
    nextEvent: 'Older',
  },
  members: {
    eyebrow: 'Core Committee',
    heading: 'Core Committee 2026–27',
    subheading: 'Student coordinators and faculty advisors organizing club initiatives, event logistics, and technical operations for 2026–27.',
    leadershipLabel: 'Office bearers',
  },
  gallery: {
    eyebrow: 'Photo Gallery',
    heading: 'From our events',
    intro: 'Snapshots from our events, celebrations and milestones.',
  },
  contact: {
    eyebrow: 'Get In Touch',
    heading: 'Contact us',
    intro:
      'Questions about the club, membership, collaborations or this website? Send them through our Google Form or reach us directly.',
    formTitle: 'Website & club queries',
    formBody: 'Feedback, club enhancement ideas, membership enquiries and general questions.',
    formCta: 'Open Google Form',
    orgLine: 'INFINITUS Mathematics Club',
    addressLines: ['Rajalakshmi Institute of Technology', 'Chennai, Tamil Nadu, India'],
  },
  footer: {
    tagline: 'Where logic meets innovation.',
    copyright: (year) => `© ${year} INFINITUS Club, ${COLLEGE_NAME}.`,
    credit: 'Designed & built by the INFINITUS Technical Team',
  },
  brand: {
    homeAriaLabel: `INFINITUS Club at ${COLLEGE_NAME} — Home`,
  },
};
