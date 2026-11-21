/**
 * Live Event-Day Mode / Symposium Live Hub Dataset (Feature 4A)
 *
 * Real-time operational data for INFINITUS Symposium:
 * - Active Round Tracker (Sprint, Algorithmic Duel, Grand Finale)
 * - Campus Venue & Floor Map (Wozniak Auditorium, Green Building 4th Floor, Block B)
 * - Live Standings, Scores & Finalist Ranks
 */

export const SYMPOSIUM_INFO = {
  title: 'INFINITUS National Mathematics Day & Symposium',
  edition: 'Annual Technical Edition 2026',
  date: '26 November 2026',
  time: '09:00 AM – 04:30 PM IST',
  college: 'Rajalakshmi Institute of Technology',
  location: 'Chennai, Tamil Nadu',
  totalTeams: 64,
  participatingInstitutions: 18,
  activeRoundId: 'round-2',
};

export const SYMPOSIUM_ROUNDS = [
  {
    id: 'round-1',
    number: 1,
    title: 'Preliminary Mathematical Sprint',
    time: '09:00 AM – 10:15 AM',
    status: 'completed',
    statusLabel: 'Completed',
    venueName: 'Wozniak Auditorium & Block B',
    format: 'Speed Arithmetic, Diophantine Equations & Mental Math',
    qualifiers: 'Top 32 Teams Advanced to Round 2',
    cutoffScore: '650 / 800',
    summary:
      'High-speed preliminary round testing numerical accuracy, rapid mental calculation, and foundational algebra under tight time constraints.',
    keyStats: {
      teamsStarted: 64,
      teamsAdvanced: 32,
      averageScore: '592 pts',
      highestScore: '780 pts (Team Riemann)',
    },
  },
  {
    id: 'round-2',
    number: 2,
    title: 'Algorithmic Duel & Cryptographic Decryption',
    time: '10:30 AM – 01:00 PM',
    status: 'active',
    statusLabel: 'Live Now',
    venueName: 'Wozniak Auditorium & Green Building 4th Floor',
    format: 'Modular Decryption, Graph Theory Traversals & Matrix Duels',
    qualifiers: 'Top 8 Teams Advance to the Grand Finale',
    cutoffScore: 'Active Scoring',
    activeProgressPercent: 72,
    timeRemaining: '38 mins remaining',
    summary:
      'Multi-stage competition combining algorithmic problem sets, Euler path traversals, cipher decryptions, and mathematical game theory.',
    keyStats: {
      teamsActive: 32,
      problemsReleased: 8,
      mostSolvedProblem: 'Prob #3 (Modular Arithmetic Cipher)',
      currentLeader: 'Team Riemann (890 pts)',
    },
  },
  {
    id: 'round-3',
    number: 3,
    title: 'The Grand Finale — Ramanujan Conjecture Arena',
    time: '01:45 PM – 03:45 PM',
    status: 'upcoming',
    statusLabel: 'Upcoming',
    venueName: 'Wozniak Auditorium (Main Keynote Stage)',
    format: 'Buzzer Showdown & Mathematical Proof Defense before Faculty Jury',
    qualifiers: 'Championship Trophy, Cash Awards & Certificates',
    cutoffScore: 'Top 8 Finalists Only',
    summary:
      'The pinnacle event where the top 8 finalist teams defend rigorous mathematical proofs and answer rapid-fire buzzer challenges before the grand faculty jury.',
    keyStats: {
      finalistSlots: 8,
      grandPrize: 'INFINITUS Trophy & Institutional Honors',
      juryLead: 'Dr. A Thilagavathy & Invited Academicians',
      livestream: 'Live in Wozniak Auditorium',
    },
  },
];

export const CAMPUS_VENUES = [
  {
    id: 'wozniak',
    name: 'Wozniak Auditorium',
    badge: 'Main Keynote Arena',
    floor: 'Academic Block — Ground Floor',
    capacity: '450 Seats',
    currentActivity: 'Round 2 Live Decryption Duel & Algorithmic Sprint',
    status: 'Active Arena',
    description:
      'The premier technical auditorium of RIT Chennai featuring dual 4K laser projectors, acoustic surround system, and tiered seating configured for competitive showdowns.',
    amenities: [
      'Dual 4K Projector Displays',
      'Dedicated Stage Buzzer Desks',
      'Surround Sound & Acoustic Treatment',
      'Campus Gigabit High-Speed Wi-Fi',
      'Live Leaderboard Display Wall',
    ],
    zones: [
      {
        id: 'stage',
        name: 'Main Keynote Stage & Buzzer Podium',
        role: 'Central Stage',
        activity: 'Problem Broadcast & Live Countdown',
        lead: 'Faculty Panel & Host Austin Joshua M',
      },
      {
        id: 'contestants',
        name: 'Contestant Seating (Rows A–F)',
        role: 'Team Workstations',
        activity: 'Active Problem Solving & Answer Validation',
        lead: '32 Competing College Teams',
      },
      {
        id: 'jury',
        name: 'Faculty & External Jury Desk',
        role: 'Evaluation Panel',
        activity: 'Real-time Verification of Proof Submissions',
        lead: 'Dr. A Thilagavathy & Senior Professors',
      },
      {
        id: 'control',
        name: 'Audio-Visual & Tech Control Desk',
        role: 'Operations Desk',
        activity: 'Leaderboard Score Ingestion & Camera Broadcast',
        lead: 'Student Tech Coordinators',
      },
    ],
  },
  {
    id: 'green-4',
    name: 'Green Building (4th Floor)',
    badge: 'Innovation Showcase',
    floor: 'Green Block — Level 4',
    capacity: '250 Attendees',
    currentActivity: 'Ramanujan Reimagined Exhibition & Software Expo',
    status: 'Ongoing Exhibition',
    description:
      'Dedicated mathematical computing labs and exhibition halls showcasing interactive Fourier simulations, Ramanujan manuscript replicas, and mathematical software projects.',
    amenities: [
      '60 High-Performance Workstations',
      'Interactive Smart Boards',
      'Poster Easels & Demo Stations',
      'Fibre Ethernet & Dedicated Server Rack',
      'Participant Refreshment Lounge',
    ],
    zones: [
      {
        id: 'lab-401',
        name: 'Lab 401 — Software Demonstrations',
        role: 'Interactive Demos',
        activity: 'Live Fourier Canvas & Chaos Attractor Demos',
        lead: 'Student Developers',
      },
      {
        id: 'lab-402',
        name: 'Lab 402 — Ramanujan Heritage Wall',
        role: 'Exhibition Wall',
        activity: 'Mathematical Posters & Partition Identities Display',
        lead: 'Design & Content Team',
      },
      {
        id: 'lab-403',
        name: 'Lab 403 — Cryptographic Challenge Desk',
        role: 'Breakout Desk',
        activity: 'Walk-in Decryption & Cipher Mini-Challenges',
        lead: 'INFINITUS Mentors',
      },
      {
        id: 'desk-reg',
        name: 'Central Helpdesk & Kit Distribution',
        role: 'Participant Support',
        activity: 'Badge Verification & Certificates Desk',
        lead: 'Organizing Committee',
      },
    ],
  },
  {
    id: 'block-b',
    name: 'Block B Classrooms (B2-06 & B3-02)',
    badge: 'Breakout Arenas',
    floor: 'Block B — 2nd & 3rd Floors',
    capacity: '120 Seats',
    currentActivity: 'Mathematical Imposter & Reverse Logic Breakout Challenges',
    status: 'Breakout Sessions',
    description:
      'Classroom venues configured for rapid-fire deductive reasoning, logic puzzles, and collaborative peer challenges throughout the symposium morning.',
    amenities: [
      'Interactive Smart Projectors',
      'Whiteboards for Step-by-Step Proofs',
      'Flexible Modular Group Seating',
    ],
    zones: [
      {
        id: 'room-b206',
        name: 'Room B2-06: Reverse Logic Arena',
        role: 'Logic Challenge',
        activity: 'Deductive Problem Solving & Trap Avoidance',
        lead: 'Round Coordinator',
      },
      {
        id: 'room-b302',
        name: 'Room B3-02: Mathematical Imposter & Birthday Lineup',
        role: 'Probability Game',
        activity: 'Social Mathematics & Imposter Elimination',
        lead: 'Club Volunteers',
      },
    ],
  },
];

export const LIVE_STANDINGS = [
  {
    rank: 1,
    team: 'Team Riemann',
    institution: 'Rajalakshmi Institute of Technology',
    score: 890,
    solved: 7,
    total: 8,
    accuracy: '96%',
    streak: 4,
    status: 'finalist',
    statusLabel: 'Finalist Confirmed',
    tag: 'Top Seed',
  },
  {
    rank: 2,
    team: "Euler's Circuit",
    institution: 'IIT Madras',
    score: 855,
    solved: 7,
    total: 8,
    accuracy: '93%',
    streak: 3,
    status: 'finalist',
    statusLabel: 'Finalist Confirmed',
    tag: 'Challenger',
  },
  {
    rank: 3,
    team: 'Ramanujan 1729',
    institution: 'Anna University (CEG)',
    score: 820,
    solved: 6,
    total: 8,
    accuracy: '95%',
    streak: 2,
    status: 'finalist',
    statusLabel: 'Finalist Confirmed',
    tag: 'Speed Leader',
  },
  {
    rank: 4,
    team: 'Fibonacci Spiral',
    institution: 'SSN College of Engineering',
    score: 785,
    solved: 6,
    total: 8,
    accuracy: '89%',
    streak: 1,
    status: 'finalist',
    statusLabel: 'Finalist Confirmed',
    tag: 'Contender',
  },
  {
    rank: 5,
    team: 'Chaos Attractors',
    institution: 'Rajalakshmi Engineering College',
    score: 750,
    solved: 5,
    total: 8,
    accuracy: '91%',
    streak: 2,
    status: 'finalist',
    statusLabel: 'Finalist Confirmed',
    tag: 'Contender',
  },
  {
    rank: 6,
    team: 'Modular Primes',
    institution: 'Vellore Institute of Technology',
    score: 720,
    solved: 5,
    total: 8,
    accuracy: '88%',
    streak: 1,
    status: 'finalist',
    statusLabel: 'Finalist Confirmed',
    tag: 'Contender',
  },
  {
    rank: 7,
    team: 'Golden Ratio Guild',
    institution: 'SRM Institute of Science & Tech',
    score: 695,
    solved: 5,
    total: 8,
    accuracy: '85%',
    streak: 0,
    status: 'finalist',
    statusLabel: 'Finalist Confirmed',
    tag: 'Contender',
  },
  {
    rank: 8,
    team: 'Turing Machines',
    institution: 'RIT Chennai',
    score: 680,
    solved: 4,
    total: 8,
    accuracy: '90%',
    streak: 1,
    status: 'finalist',
    statusLabel: 'Finalist Confirmed',
    tag: 'Cutoff Bubble',
  },
  {
    rank: 9,
    team: 'Fourier Transform',
    institution: 'Loyola-ICAM College',
    score: 655,
    solved: 4,
    total: 8,
    accuracy: '84%',
    streak: 0,
    status: 'eliminated',
    statusLabel: 'Round 2 Eliminated',
    tag: 'Runner-up',
  },
  {
    rank: 10,
    team: 'Dirac Delta Force',
    institution: "St. Joseph's College of Eng",
    score: 630,
    solved: 4,
    total: 8,
    accuracy: '82%',
    streak: 0,
    status: 'eliminated',
    statusLabel: 'Round 2 Eliminated',
    tag: 'Runner-up',
  },
];

export function getFilteredStandings(filter = 'all') {
  if (filter === 'finalists') {
    return LIVE_STANDINGS.filter((s) => s.status === 'finalist');
  }
  return LIVE_STANDINGS;
}

export function getVenueById(id) {
  return CAMPUS_VENUES.find((v) => v.id === id) || CAMPUS_VENUES[0];
}

export function getRoundById(id) {
  return SYMPOSIUM_ROUNDS.find((r) => r.id === id) || SYMPOSIUM_ROUNDS[0];
}
