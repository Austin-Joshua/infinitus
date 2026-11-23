import { EVENTS, MEMBERS } from './data.js';

/**
 * Builds the searchable dataset for the INFINITUS Command Palette.
 * Aggregates all 44 events, 15 core committee members, site routes, and instant actions.
 */
export function buildSearchIndex(events = EVENTS, members = MEMBERS) {
  const index = [];

  // 1. Core Navigation
  const navigationItems = [
    {
      id: 'nav-home',
      title: 'Home',
      subtitle: 'Overview, hero chaotic attractor & quick links',
      href: '/',
      icon: 'home',
      group: 'Navigation',
      keywords: ['home', 'landing', 'start', 'rit', 'math club'],
    },
    {
      id: 'nav-events',
      title: 'Events Directory',
      subtitle: '44 mathematics competitions, workshops, hackathons & olympiads',
      href: '/events',
      icon: 'events',
      group: 'Navigation',
      keywords: ['events', 'competitions', 'calendar', 'hackathons', 'workshops', 'schedule'],
    },
    {
      id: 'nav-graph',
      title: 'Mathematical Knowledge Graph',
      subtitle: 'Interactive constellation of 6 math branches & 44 events',
      href: '/events#events-knowledge-graph',
      icon: 'graph',
      group: 'Navigation',
      badge: 'Constellation',
      keywords: ['graph', 'knowledge graph', 'constellation', 'network', 'branches', 'topology', 'd3', 'force'],
    },
    {
      id: 'nav-team',
      title: 'Core Committee & Team',
      subtitle: 'Office bearers, student coordinators, designers & developers',
      href: '/team',
      icon: 'team',
      group: 'Navigation',
      keywords: ['team', 'members', 'committee', 'coordinators', 'president', 'leadership'],
    },
    {
      id: 'nav-gallery',
      title: 'Photo Gallery',
      subtitle: 'Photographic records of symposiums, workshops and awards',
      href: '/gallery',
      icon: 'gallery',
      group: 'Navigation',
      keywords: ['gallery', 'photos', 'pictures', 'images', 'moments', 'workshop photos'],
    },
    {
      id: 'nav-about',
      title: 'About INFINITUS',
      subtitle: 'Club origin, mission, faculty advisors & college patronage',
      href: '/about',
      icon: 'about',
      group: 'Navigation',
      keywords: ['about', 'mission', 'history', 'patronage', 'rit', 'aim'],
    },
    {
      id: 'nav-math-history',
      title: 'Mathematical History & Heritage',
      subtitle: 'Chronicles from Aryabhata & Madhava to Euler, Ramanujan & Modern AI',
      href: '/about#math-history-timeline',
      icon: 'math',
      group: 'Navigation',
      badge: 'Heritage',
      keywords: ['history', 'heritage', 'aryabhata', 'brahmagupta', 'madhava', 'calculus', 'euler', 'ramanujan', 'chronicles', 'discovery', 'timeline'],
    },
    {
      id: 'nav-contact',
      title: 'Contact & Inquiries',
      subtitle: 'Get in touch with club coordinators or submit feedback',
      href: '/contact',
      icon: 'contact',
      group: 'Navigation',
      keywords: ['contact', 'email', 'reach out', 'feedback', 'inquiry'],
    },
  ];

  index.push(...navigationItems);

  // 2. Instant Actions
  const actionItems = [
    {
      id: 'act-theme',
      title: 'Toggle Theme',
      subtitle: 'Switch between Obsidian Dark and Ricotta Cream Light modes',
      action: 'toggle-theme',
      icon: 'theme',
      group: 'Actions',
      keywords: ['theme', 'dark mode', 'light mode', 'color', 'toggle', 'switch theme'],
    },
    {
      id: 'act-sound',
      title: 'Toggle Harmonic Sound Effects',
      subtitle: 'Mute or unmute procedural Web Audio micro-sound design',
      action: 'toggle-sound',
      icon: 'sound',
      group: 'Actions',
      keywords: ['sound', 'audio', 'mute', 'unmute', 'harmonic', 'music', 'micro-sounds', 'chime', 'volume'],
    },
    {
      id: 'act-lorenz',
      title: 'Simulate Lorenz Attractor',
      subtitle: 'Run 3D chaotic butterfly dynamics (σ=10, ρ=28, β=8/3)',
      action: 'set-math-lorenz',
      icon: 'math',
      group: 'Actions',
      badge: 'Hero Canvas',
      keywords: ['lorenz', 'chaos', 'attractor', 'butterfly effect', 'simulation', '3d'],
    },
    {
      id: 'act-fourier',
      title: 'Simulate Fourier Lemniscate (∞)',
      subtitle: 'Synthesize the Infinitus infinity curve with rotating epicycles',
      action: 'set-math-fourier',
      icon: 'math',
      group: 'Actions',
      badge: 'Hero Canvas',
      keywords: ['fourier', 'lemniscate', 'infinity', 'epicycles', 'harmonics', 'simulation'],
    },
    {
      id: 'act-aizawa',
      title: 'Simulate Aizawa Attractor',
      subtitle: 'Simulate spherical torus chaotic flow with orbit momentum',
      action: 'set-math-aizawa',
      icon: 'math',
      group: 'Actions',
      badge: 'Hero Canvas',
      keywords: ['aizawa', 'torus', 'dynamical systems', 'strange attractor', 'simulation'],
    },
    {
      id: 'act-upcoming',
      title: 'Filter Upcoming Events',
      subtitle: 'Jump to upcoming events and registrations on the events schedule',
      href: '/events#upcoming',
      icon: 'calendar',
      group: 'Actions',
      keywords: ['upcoming', 'future', 'next event', 'schedule', 'register'],
    },
    {
      id: 'act-completed',
      title: 'Browse Past Events Archive',
      subtitle: 'Explore conducted workshops, competitions and hackathons',
      href: '/events#conducted',
      icon: 'archive',
      group: 'Actions',
      keywords: ['completed', 'conducted', 'past', 'archive', 'history'],
    },
    {
      id: 'act-copy',
      title: 'Copy Current Page URL',
      subtitle: 'Copy the current browser address to clipboard',
      action: 'copy-url',
      icon: 'copy',
      group: 'Actions',
      keywords: ['copy', 'share', 'link', 'url', 'clipboard'],
    },
    {
      id: 'act-pwa-install',
      title: 'Install INFINITUS Web App (PWA)',
      subtitle: 'Install progressive web app for offline access & faster launches',
      action: 'install-pwa',
      icon: 'sparkles',
      group: 'Actions',
      badge: 'PWA Offline',
      keywords: ['install', 'pwa', 'offline', 'app', 'homescreen', 'desktop app'],
    },
    {
      id: 'act-instagram',
      title: 'Follow @infinitus_club.rit on Instagram',
      subtitle: 'Official Instagram page for announcements, posters and stories',
      href: 'https://instagram.com/infinitus_club.rit',
      external: true,
      icon: 'instagram',
      group: 'Actions',
      keywords: ['instagram', 'social', 'handle', 'reels', 'stories', 'follow'],
    },
    {
      id: 'act-scroll-top',
      title: 'Scroll to Top of Page',
      subtitle: 'Smoothly return to the start of the current page',
      action: 'scroll-top',
      icon: 'arrow-up',
      group: 'Actions',
      keywords: ['scroll', 'top', 'up', 'beginning'],
    },
  ];

  index.push(...actionItems);

  // 3. Events (all 44 events)
  if (Array.isArray(events)) {
    for (const ev of events) {
      if (!ev || !ev.id) continue;
      const isUpcoming = ev.status === 'upcoming';
      index.push({
        id: `event-${ev.id}`,
        title: ev.title || 'Untitled Event',
        subtitle: `${ev.category || 'Event'} • ${ev.date || 'TBA'}${ev.venue ? ` • ${ev.venue}` : ''}`,
        href: `/events/${ev.id}`,
        badge: isUpcoming ? 'Upcoming' : 'Conducted',
        badgeVariant: isUpcoming ? 'accent' : 'muted',
        group: 'Events',
        icon: 'calendar',
        keywords: [
          ev.title || '',
          ev.tagline || '',
          ev.description || '',
          ev.category || '',
          ev.venue || '',
          ev.status || '',
          ev.date || '',
        ],
      });
    }
  }

  // 4. Team Members (all 15 members)
  if (Array.isArray(members)) {
    for (const m of members) {
      if (!m || !m.id) continue;
      const subtitleParts = [m.role, m.department, m.year].filter(Boolean);
      index.push({
        id: `member-${m.id}`,
        title: m.name || 'Member',
        subtitle: subtitleParts.join(' • '),
        href: `/team#${m.id}`,
        badge: m.role,
        group: 'Team Members',
        icon: 'user',
        posterUrl: m.posterUrl || null,
        keywords: [m.name || '', m.role || '', m.department || '', m.year || ''],
      });
    }
  }

  return index;
}

/**
 * Searches the index given a query string.
 * High scores for exact and prefix matches in title/name; secondary scores for keywords and description.
 */
export function searchIndex(query, items, maxResults = 25) {
  if (!items || !items.length) return [];

  const rawQuery = (query || '').trim().toLowerCase();

  // If query is empty, return suggested quick links & actions
  if (!rawQuery) {
    const suggestedIds = [
      'nav-events',
      'nav-graph',
      'act-theme',
      'act-lorenz',
      'act-fourier',
      'nav-team',
      'event-scilab-workshop',
      'event-matrix-reloaded',
      'act-upcoming',
      'nav-gallery',
    ];
    const itemMap = new Map(items.map((i) => [i.id, i]));
    const suggested = [];
    for (const id of suggestedIds) {
      const it = itemMap.get(id);
      if (it) suggested.push(it);
    }
    return suggested;
  }

  const queryTerms = rawQuery.split(/\s+/).filter(Boolean);

  const scored = [];

  for (const item of items) {
    let score = 0;
    const titleLower = (item.title || '').toLowerCase();
    const subtitleLower = (item.subtitle || '').toLowerCase();
    const badgeLower = (item.badge || '').toLowerCase();
    const groupLower = (item.group || '').toLowerCase();
    const keywordsLower = (item.keywords || []).map((k) => (k || '').toLowerCase()).join(' ');

    // Check query terms
    let allTermsMatch = true;
    for (const term of queryTerms) {
      const inTitle = titleLower.includes(term);
      const inSubtitle = subtitleLower.includes(term);
      const inKeywords = keywordsLower.includes(term);
      const inBadge = badgeLower.includes(term);
      const inGroup = groupLower.includes(term);

      if (!inTitle && !inSubtitle && !inKeywords && !inBadge && !inGroup) {
        allTermsMatch = false;
        break;
      }

      if (titleLower === rawQuery) {
        score += 120;
      } else if (titleLower.startsWith(rawQuery)) {
        score += 80;
      } else if (inTitle) {
        score += 50;
      }

      if (inBadge) score += 30;
      if (inSubtitle) score += 20;
      if (inKeywords) score += 15;
    }

    if (allTermsMatch && score > 0) {
      scored.push({ item, score });
    }
  }

  // Sort descending by score
  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, maxResults).map((s) => s.item);
}

/**
 * Organizes a flat list of result items into ordered groups:
 * Actions -> Navigation -> Events -> Team Members
 */
export function groupResults(items) {
  const groups = [
    { key: 'Actions', title: 'Quick Actions', items: [] },
    { key: 'Navigation', title: 'Navigation', items: [] },
    { key: 'Events', title: 'Events & Contests', items: [] },
    { key: 'Team Members', title: 'Core Committee & Team', items: [] },
  ];

  const groupMap = new Map(groups.map((g) => [g.key, g]));

  for (const item of items) {
    const grp = groupMap.get(item.group);
    if (grp) {
      grp.items.push(item);
    } else {
      let custom = groups.find((g) => g.key === item.group);
      if (!custom) {
        custom = { key: item.group, title: item.group, items: [] };
        groups.push(custom);
      }
      custom.items.push(item);
    }
  }

  return groups.filter((g) => g.items.length > 0);
}
