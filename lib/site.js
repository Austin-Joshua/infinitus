import { EVENTS, MEMBERS } from './data.js';

/**
 * Official site copy, navigation map, and metadata.
 * Sourced from docs/INFINITUS_Official_Website_Content.md and the club's Instagram.
 */

export const COLLEGE_NAME = 'Rajalakshmi Institute of Technology';
export const COLLEGE_SHORT = 'RIT';

export const CLUB_NAME = 'INFINITUS';
export const CLUB_SHORT = 'INFINITUS';

export const SITE = {
  title: 'INFINITUS — Mathematics Club | Rajalakshmi Institute of Technology',
  titleTemplate: '%s · INFINITUS RIT',
  description:
    'Official website of INFINITUS, the Mathematics Club of Rajalakshmi Institute of Technology (RIT Chennai). Campus olympiads, workshops, and competitions.',
  shortDescription:
    'Logic, computation, and collaborative mathematical problem solving.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://infinitus-seven.vercel.app',
  contactEmail: 'infinitus@ritchennai.edu.in',
  location: 'Chennai, Tamil Nadu, India',
  locale: 'en_IN',
  // TODO(owner): confirm official college postal address before publishing in structured data
  address: null,
};

export const SOCIAL = {
  instagram: 'https://www.instagram.com/infinitus_club.rit/',
  instagramHandle: '@infinitus_club.rit',
  queriesForm: 'https://forms.gle/wMbC1SEdAXYYbFvn9',
  // Official recruitment Google Form
  recruitmentForm: 'https://forms.gle/J1D5RVqmkMywa7v76',
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
    badge: 'Mathematics Club',
    tagline: 'Where logic meets innovation',
    support:
      'Mathematical olympiads, algorithm challenges, applied workshops, and competitive problem solving.',
    primaryCta: 'Explore events',
    secondaryCta: 'Meet the team',
    scrollHint: 'Scroll',
  },
  home: {
    // TODO(owner): Confirm general membership count (350+) and total participant count (1,200+) before re-adding to marquee.
    marquee: [
      'Escape the Math Room: Ultimate Adventure',
      'Reverse Logic — Think Backwards',
      'SHINKA — Strikers 2026',
      `${EVENTS.length} Events Hosted`,
      'Birthday Lineup: Silent Sorting',
      "Mathspire — Expilog '25",
      `${MEMBERS.length} Committee Members`,
      'Math in Motion',
      'PiDoku: Decode π',
      'Matrix Reloaded',
      'National Mathematics Day',
      "Infinity Quest '24",
    ],
    aboutStatement: 'Cultivating mathematical curiosity, problem solving, and analytical thinking',
    aboutStatementAccent: 'beyond the lecture hall.',
    exploreEyebrow: 'Explore',
    exploreHeading: 'Find your way around',
    explore: {
      about: 'Who we are, what we do, and how far we have come since 2023.',
      events: 'Championships, quizzes, workshops and creative contests — every one we have hosted.',
      team: 'The Core Committee 2026–27 and what each role looks after.',
      gallery: 'Snapshots from our events, celebrations and milestones.',
    },
    eventsHeading: 'Recent & upcoming',
    eventsCta: 'All events',
    teamHeading: 'Leadership',
    teamCta: 'Full team',
    galleryHeading: 'Moments & memories',
    galleryCta: 'Open gallery',
    ctaEyebrow: 'Connect',
    ctaHeading: 'Have a question, an idea, or a problem worth solving?',
    ctaButton: 'Get in touch',
  },
  pages: {
    about: {
      title: 'About',
      description: 'Discover INFINITUS, the premier Mathematics Club of Rajalakshmi Institute of Technology (RIT Chennai). Founded in 2023 to bridge logic, computation, and collaborative problem solving.',
    },
    events: {
      title: 'Events',
      description: 'Explore mathematics competitions, championships, PiDoku, SHINKA 2026, and hands-on workshops organized by INFINITUS at Rajalakshmi Institute of Technology.',
    },
    team: {
      title: 'Team',
      description: 'Meet the INFINITUS Core Committee 2026–2027 at Rajalakshmi Institute of Technology — student leadership, domain heads, and faculty guidance.',
    },
    gallery: {
      title: 'Gallery',
      description: 'Photo highlights and moments from mathematical olympiads, Scilab workshops, PiDoku, and student celebrations at INFINITUS RIT Chennai.',
    },
    contact: {
      title: 'Contact',
      description: 'Contact INFINITUS Mathematics Club at Rajalakshmi Institute of Technology (RIT Chennai). Submit queries, feedback, or collaboration proposals.',
    },
  },
  notFound: {
    heading: 'This page tends to infinity',
    body: "We followed the limit and found nothing there. The page you're after may have moved.",
    cta: 'Back to home',
  },
  about: {
    eyebrow: 'About',
    statement: 'A student community exploring how pure logic and applied mathematics shape',
    statementAccent: 'technology, computation, and everyday reasoning.',
    body: 'Founded in 2023, we bridge classroom mathematics with real problem solving through student-led competitions, technical workshops, mathematical games, and collaborative challenges.',
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
        theme: 'Inception & Culture',
        stats: [
          { label: 'Events Hosted', value: '4' },
          { label: 'Founding Members', value: '25+' },
          { label: 'Student Reach', value: '300+' },
        ],
        fullStory:
          'INFINITUS was born in late 2023 under the Department of Science & Humanities at Rajalakshmi Institute of Technology. The club was officially inaugurated with a massive National Mathematics Day celebration commemorating Srinivasa Ramanujan. The campus came alive with an innovative Mathematical Rangoli competition blending traditional Kolam symmetry with geometric fractals and tessellations, establishing our signature culture where analytical precision meets artistic expression.',
        chronicle: [
          {
            title: 'Official Club Inauguration',
            description:
              'Formal inauguration of the INFINITUS Mathematics Club with faculty mentors and student leaders setting our mission to make higher mathematics intuitive and engaging.',
          },
          {
            title: 'National Mathematics Day Celebrations',
            description:
              'Commemorating Srinivasa Ramanujan with lecture sessions, logic puzzles, and campus-wide mathematical quizzes.',
          },
          {
            title: 'Mathematical Rangoli Challenge',
            description:
              'Students designed intricate geometric kolams based on fractal dimensions, rotational symmetry groups, and golden ratios.',
          },
        ],
        legacy: 'Laid the cultural foundation and proved that mathematics can be an exhilarating campus spectator event.',
      },
      {
        year: '2024',
        title: 'Finding our rhythm',
        tag: 'Expansion',
        symbol: '∑',
        body: "Math-O-Fest '24 symposium, expert guest lecture from SSN College of Engineering, and the multi-stage Infinity Quest '24.",
        events: ["Math-O-Fest '24", 'SSN Keynote Lecture', "Infinity Quest '24"],
        theme: 'Academic Depth & Rigor',
        stats: [
          { label: 'Symposium Attendees', value: '450+' },
          { label: 'Competitive Rounds', value: '8' },
          { label: 'Partner Colleges', value: '12+' },
        ],
        fullStory:
          'In 2024, INFINITUS scaled from internal campus gatherings to inter-departmental and inter-collegiate prominence. We launched Math-O-Fest ’24, an expansive mathematics symposium, and welcomed esteemed mathematicians including Dr. S. Sundararajan from SSN College of Engineering for an inspiring keynote on discrete mathematics in modern cryptography. The high-octane Infinity Quest ’24 pushed analytical speed to new boundaries with three progressive elimination stages.',
        chronicle: [
          {
            title: "Math-O-Fest '24 Flagship Symposium",
            description:
              'A full-day multi-track mathematics convention hosting speed calculation, mathematical model displays, and coding relays.',
          },
          {
            title: 'SSN College of Engineering Keynote',
            description:
              'Dr. S. Sundararajan delivered a keynote on Cryptographic Number Theory and Practical Quantum Primes.',
          },
          {
            title: "Infinity Quest '24",
            description:
              'Campus-wide intellectual marathon combining treasure hunts, mental math sprints, and reverse logic puzzles.',
          },
        ],
        legacy: 'Expanded academic partnerships and proved our ability to organize large-scale academic symposia.',
      },
      {
        year: '2025',
        title: 'Growing louder & Flagship',
        tag: 'Recognition',
        symbol: '∫',
        body: "Mathspire Expilog '25 with 4 challenging rounds, Matrix Reloaded workshop, The Math Podcast, and RIT's Best Vice President 2024–25 honour.",
        events: ["Mathspire Expilog '25", 'Matrix Reloaded Workshop', 'Best VP Award', 'The Math Podcast'],
        theme: 'Innovation & Leadership',
        stats: [
          { label: 'Expilog Contenders', value: '500+' },
          { label: 'Podcast Episodes', value: '6+' },
          { label: 'State & College Award', value: '1' },
        ],
        fullStory:
          '2025 witnessed unprecedented growth in both technical programming and leadership recognition. Mathspire Expilog ’25 established a benchmark with 4 rigorous rounds testing everything from game theory to real analysis. We debuted "The Math Podcast" audio series and ran the Matrix Reloaded hands-on linear algebra workshop. At the annual college awards, INFINITUS leadership was honoured with RIT’s Best Vice President 2024–25 award, validating our relentless work in student empowerment.',
        chronicle: [
          {
            title: "Mathspire Expilog '25",
            description:
              'Four progressive rounds: Prelims, Speed Algebra, Case Simulation, and Grand Stage Finalist Confrontation.',
          },
          {
            title: 'Matrix Reloaded Hands-On Workshop',
            description:
              'Practical visualization of linear transformations, Markov chains, and computer graphics matrices.',
          },
          {
            title: 'Launch of "The Math Podcast"',
            description:
              'Discussion series breaking down infinite cardinalities, the Banach-Tarski paradox, and the Millennium Prize Problems.',
          },
          {
            title: "RIT Best Vice President Award 2024–25",
            description:
              'Institutional recognition for outstanding leadership, seamless operational execution, and student engagement.',
          },
        ],
        legacy: 'Garnered institutional accolades and expanded into rich multimedia content creation.',
      },
      {
        year: '2026',
        title: 'Beyond campus & Horizons',
        tag: 'Championship',
        symbol: 'π',
        body: 'PI-QUEST on Pi Day, PiDoku logic sprint, and SHINKA — our 2-day mathematics & innovation championship for school students.',
        events: ['SHINKA Strikers 2026', 'PI-QUEST Pi Day', 'PiDoku: Decode π', 'Algo-Odyssey Challenge'],
        theme: 'Inter-School Championships & Hackathons',
        stats: [
          { label: 'Total Events', value: `${EVENTS.length}` },
          { label: 'School Students', value: '600+' },
          { label: 'Olympiad Participants', value: '350+' },
        ],
        fullStory:
          `2026 represents the pinnacle of our outreach: going beyond the college walls to nurture the next generation of mathematical minds. In August 2026, INFINITUS hosted SHINKA Strikers 2026, a 2-day championship with Math Olympiad, Math Bee, and Innovation Expo for high school students across Tamil Nadu. Parallelly, our university calendar featured PI-QUEST, PiDoku logic sprint, and the Algo-Odyssey Challenge, bringing our total events hosted to ${EVENTS.length}.`,
        chronicle: [
          {
            title: 'SHINKA Strikers 2026 Championship',
            description:
              'Historic 2-day championship welcoming hundreds of bright school students to compete in Olympiad problem solving and innovative science exhibits.',
          },
          {
            title: 'World Pi Day: PI-QUEST & PiDoku',
            description:
              'Rapid-fire π decimal recitation and numerical cipher puzzles celebrated across the campus on March 14.',
          },
          {
            title: 'Algo-Odyssey Algorithmic Sprint',
            description:
              'Competitive algorithmic mathematics challenge testing dynamic programming, graph theory, and mathematical optimization.',
          },
        ],
        legacy: 'Empowering future scientists and establishing INFINITUS as a premier mathematical hub across schools and universities.',
      },
    ],
  },
  events: {
    eyebrow: 'Events',
    heading: 'Events & Contests',
    intro: 'Championships, quizzes, workshops, and creative challenges across the academic years.',
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
    eyebrow: 'Team',
    heading: 'Core Committee',
    subheading: 'Student coordinators, domain leads, and faculty advisors for the 2026–27 academic term.',
    leadershipLabel: 'Office bearers',
  },
  gallery: {
    eyebrow: 'Gallery',
    heading: 'Moments & Highlights',
    intro: 'Snapshots from competitions, workshops, and celebrations.',
  },
  contact: {
    eyebrow: 'Contact',
    heading: 'Get in Touch',
    intro:
      'Questions, feedback, or collaborative ideas? Send them through our forms or reach out directly.',
    recruitmentBadge: 'Recruitment 2026–27',
    recruitmentTitle: 'Core Member Recruitment 2026–27',
    recruitmentBody:
      'Interested to join as a core team member? Lead initiatives, organize campus olympiads, build technical systems, and shape the mathematical future of INFINITUS.',
    recruitmentCta: 'Apply for Core Team',
    queriesBadge: 'General Queries',
    formTitle: 'Website & club queries',
    formBody: 'Feedback, club enhancement ideas, membership enquiries and general questions.',
    formCta: 'Open Google Form',
    findUsHeading: 'Find Us',
    emailBadge: 'Email',
    emailTitle: 'Email Us',
    emailValue: 'infinitus@ritchennai.edu.in',
    emailBody: 'Direct inquiries, event collaborations, and official club correspondence.',
    emailCta: 'Send Email',
    instagramBadge: 'Instagram',
    instagramTitle: 'Instagram',
    instagramValue: '@infinitus_club.rit',
    instagramBody: 'Follow for live event updates, announcements, problem series, and recaps.',
    instagramCta: 'Follow on Instagram',
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
