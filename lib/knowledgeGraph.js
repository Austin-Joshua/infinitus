/**
 * Mathematical domains and knowledge graph topology for INFINITUS events.
 * Maps 44 club events across 6 foundational mathematical branches.
 */

export const MATH_DOMAINS = [
  {
    id: 'discrete',
    name: 'Discrete Math & Number Theory',
    shortName: 'Number Theory',
    symbol: 'ℤ',
    color: '#FF7A1A', // Sunset Orange
    colorLight: '#D95A00',
    description: 'Prime distributions, modular arithmetic, Diophantine equations, and sequences.',
  },
  {
    id: 'logic',
    name: 'Logic, Deduction & Cryptography',
    shortName: 'Logic & Cryptography',
    symbol: '⊕',
    color: '#F03A2A', // Lobster Red
    colorLight: '#C92518',
    description: 'Boolean algebra, cryptarithms, forensic logic, and deductive problem solving.',
  },
  {
    id: 'computing',
    name: 'Algorithms & Applied Computing',
    shortName: 'Applied Computing',
    symbol: '𝒪(n)',
    color: '#2F6BFF', // Electric Blue
    colorLight: '#1B4ED8',
    description: 'Numerical methods, matrix computation, computational physics, and graph algorithms.',
  },
  {
    id: 'combinatorics',
    name: 'Combinatorics & Game Theory',
    shortName: 'Combinatorics',
    symbol: 'Σ',
    color: '#F59E0B', // Amber Gold
    colorLight: '#D97706',
    description: 'Permutations, optimal sorting strategies, bidding mathematics, and game trees.',
  },
  {
    id: 'geometry',
    name: 'Geometry & Spatial Mathematics',
    shortName: 'Geometry',
    symbol: 'π',
    color: '#10B981', // Emerald Teal
    colorLight: '#059669',
    description: 'Trigonometry, geometric tessellations, fractal dimensions, and spatial reasoning.',
  },
  {
    id: 'symposia',
    name: 'Symposia, Culture & Math Society',
    shortName: 'Culture & Symposia',
    symbol: '∞',
    color: '#8B5CF6', // Purple Violet
    colorLight: '#7C3AED',
    description: 'Flagship summits, National Mathematics Day celebrations, history, and community lectures.',
  },
];

/** Mapping event IDs to their primary (and optional secondary) mathematical domain */
const EVENT_DOMAIN_MAP = {
  'escape-the-math-room': { domain: 'logic', secondary: 'discrete' },
  'birthday-lineup': { domain: 'combinatorics' },
  'mathematical-imposter': { domain: 'logic' },
  'reverse-logic': { domain: 'logic' },
  'mathematics-of-campus': { domain: 'geometry' },
  'odd-one-out': { domain: 'logic' },
  'pen-of-democracy': { domain: 'symposia' },
  'diwali-design-fiesta': { domain: 'geometry' },
  'brain-battle': { domain: 'logic', secondary: 'combinatorics' },
  'balance-the-mind': { domain: 'combinatorics' },
  'beyond-equations': { domain: 'computing' },
  'scilab-workshop': { domain: 'computing' },
  'math-mystique': { domain: 'logic' },
  'math-in-motion': { domain: 'discrete', secondary: 'combinatorics' },
  'from-bridges-to-ai': { domain: 'computing' },
  'math-charades': { domain: 'logic' },
  'guess-the-number': { domain: 'discrete' },
  'math-relay': { domain: 'discrete' },
  'teachers-day-2026': { domain: 'symposia' },
  'math-bomb': { domain: 'discrete' },
  'math-culprit': { domain: 'logic' },
  'math-auction': { domain: 'combinatorics' },
  'the-silent-sort': { domain: 'combinatorics' },
  'shinka-2026': { domain: 'combinatorics', secondary: 'discrete' },
  'beyond-the-numbers': { domain: 'geometry' },
  'broken-blueprint': { domain: 'combinatorics' },
  pidoku: { domain: 'discrete', secondary: 'logic' },
  geotrace: { domain: 'geometry' },
  graphquest: { domain: 'computing', secondary: 'geometry' },
  'pi-quest': { domain: 'discrete', secondary: 'geometry' },
  'treasure-hunt': { domain: 'discrete', secondary: 'combinatorics' },
  'nature-geometer': { domain: 'geometry' },
  'stat-story': { domain: 'computing' },
  mathspire: { domain: 'combinatorics', secondary: 'discrete' },
  'matrix-reloaded': { domain: 'computing' },
  'remote-rush': { domain: 'combinatorics' },
  algebruh: { domain: 'symposia' },
  'beauty-of-maths': { domain: 'geometry' },
  'infinity-quest': { domain: 'discrete', secondary: 'symposia' },
  'guest-lecture': { domain: 'computing', secondary: 'symposia' },
  'math-o-fest-24': { domain: 'symposia' },
  'math-day-2023': { domain: 'symposia' },
  'the-math-podcast': { domain: 'discrete', secondary: 'logic' },
};

/**
 * Builds the graph dataset (nodes and links) for force-directed layout.
 */
export function buildKnowledgeGraph(events, width = 900, height = 600) {
  const domainNodes = MATH_DOMAINS.map((d, i) => {
    const angle = (i / MATH_DOMAINS.length) * Math.PI * 2;
    const radius = Math.min(width, height) * 0.32;
    return {
      id: `domain-${d.id}`,
      type: 'domain',
      domainId: d.id,
      name: d.name,
      shortName: d.shortName,
      symbol: d.symbol,
      color: d.color,
      colorLight: d.colorLight,
      description: d.description,
      x: width / 2 + Math.cos(angle) * radius,
      y: height / 2 + Math.sin(angle) * radius,
      vx: 0,
      vy: 0,
      radius: 26,
      mass: 5,
    };
  });

  const domainLookup = Object.fromEntries(domainNodes.map((n) => [n.domainId, n]));

  const eventNodes = events.map((ev, i) => {
    const mapInfo = EVENT_DOMAIN_MAP[ev.id] || { domain: 'discrete' };
    const domain = domainLookup[mapInfo.domain] || domainNodes[0];

    // Jitter around parent domain
    const jitterAngle = Math.random() * Math.PI * 2;
    const jitterDist = 50 + Math.random() * 80;

    return {
      id: `event-${ev.id}`,
      type: 'event',
      eventId: ev.id,
      title: ev.title,
      eventDate: ev.eventDate,
      venue: ev.venue,
      eventType: ev.eventType,
      coverImageUrl: ev.coverImageUrl,
      registrationFormUrl: ev.registrationFormUrl,
      status: ev.status,
      domainId: mapInfo.domain,
      secondaryDomainId: mapInfo.secondary || null,
      color: domain.color,
      colorLight: domain.colorLight,
      x: domain.x + Math.cos(jitterAngle) * jitterDist,
      y: domain.y + Math.sin(jitterAngle) * jitterDist,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      radius: 9,
      mass: 1,
    };
  });

  const nodes = [...domainNodes, ...eventNodes];
  const nodeIndex = new Map(nodes.map((n) => [n.id, n]));

  // Create links from events to their primary (and secondary) domains
  const links = [];
  for (const evNode of eventNodes) {
    const primaryDomainNode = domainLookup[evNode.domainId];
    if (primaryDomainNode) {
      links.push({
        source: evNode,
        target: primaryDomainNode,
        distance: 85,
        strength: 0.12,
        isSecondary: false,
      });
    }

    if (evNode.secondaryDomainId) {
      const secDomainNode = domainLookup[evNode.secondaryDomainId];
      if (secDomainNode) {
        links.push({
          source: evNode,
          target: secDomainNode,
          distance: 140,
          strength: 0.04,
          isSecondary: true,
        });
      }
    }
  }

  // Cross-link domain hubs in a ring to maintain structural symmetry
  for (let i = 0; i < domainNodes.length; i++) {
    const next = domainNodes[(i + 1) % domainNodes.length];
    links.push({
      source: domainNodes[i],
      target: next,
      distance: 210,
      strength: 0.05,
      isDomainRing: true,
    });
  }

  return { nodes, links, nodeIndex };
}
