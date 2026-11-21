/**
 * Mathematical History & Heritage Dataset (Feature 3B)
 *
 * Chronological milestones of mathematical breakthroughs connecting ancient Indian
 * mathematics to modern computational topology, chaos theory, and AI.
 */

export const MATH_ERAS = [
  { id: 'all', label: 'All Eras' },
  { id: 'classical', label: 'Classical & Zero' },
  { id: 'calculus', label: 'Pioneering Calculus' },
  { id: 'topology', label: 'Topology & Analysis' },
  { id: 'modern', label: 'Chaos & Computational' },
];

export const MATH_MILESTONES = [
  {
    id: 'aryabhata',
    era: 'classical',
    year: 'c. 499 CE',
    century: '5th Century CE',
    title: 'Aryabhata — Kusumapura',
    subtitle: 'The Place-Value Decimal System & Approximation of Pi',
    description:
      'Aryabhata articulated the decimal place-value system with zero and computed an accurate approximation of π using circumference-to-diameter perimeter polygons, setting the foundation for classical Indian astronomy and algebra.',
    formula: 'π ≈ 62832 / 20000 = 3.1416',
    branch: 'Number Theory & Astronomy',
    tag: 'Foundational',
    keyContribution:
      'Pioneered sine tables (jya) and the kuttaka method for solving indeterminate linear equations.',
  },
  {
    id: 'brahmagupta',
    era: 'classical',
    year: 'c. 628 CE',
    century: '7th Century CE',
    title: 'Brahmagupta — Brahmasphutasiddhanta',
    subtitle: 'Systematization of Zero & Negative Numbers',
    description:
      'Brahmagupta was the first mathematician in history to formally define arithmetic operations for Zero (shunya) and negative quantities (debt/fortune), and formulated his celebrated identity for quadratic forms.',
    formula: '(a² + nb²)(c² + nd²) = (ac - nbd)² + n(bc + ad)²',
    branch: 'Algebra & Arithmetic',
    tag: 'Pioneering',
    keyContribution:
      'Rules for zero arithmetic: a + 0 = a, a × 0 = 0, and root solutions for quadratic equations.',
  },
  {
    id: 'madhava',
    era: 'calculus',
    year: 'c. 1350 CE',
    century: '14th Century CE',
    title: 'Madhava of Sangamagrama',
    subtitle: 'Discovery of Calculus & Infinite Power Series',
    description:
      'Three centuries before Newton and Leibniz, Madhava and the Kerala School of Astronomy discovered infinite series expansions for trigonometric sine, cosine, and arctangent, inventing mathematical analysis and infinite series approximations.',
    formula: 'π/4 = 1 - 1/3 + 1/5 - 1/7 + 1/9 - 1/11 + ...',
    branch: 'Mathematical Analysis',
    tag: 'Calculus Origin',
    keyContribution:
      'Discovered the Madhava-Gregory-Leibniz series and power series approximations for sin(θ) and cos(θ).',
  },
  {
    id: 'euler',
    era: 'topology',
    year: '1736 CE',
    century: '18th Century CE',
    title: 'Leonhard Euler — Königsberg',
    subtitle: 'Birth of Graph Theory & The Most Beautiful Equation',
    description:
      'By demonstrating that no continuous path could cross the Seven Bridges of Königsberg exactly once, Euler inaugurated Graph Theory and Topology. He later unified arithmetic, algebra, geometry, and analysis in one equation.',
    formula: 'e^{iπ} + 1 = 0 · V - E + F = 2',
    branch: 'Graph Theory & Topology',
    tag: 'Network Science',
    keyContribution:
      'Eulerian paths, polyhedral characteristic (V - E + F = 2), and foundational network topology.',
  },
  {
    id: 'ramanujan',
    era: 'topology',
    year: '1913–1920 CE',
    century: '20th Century CE',
    title: 'Srinivasa Ramanujan',
    subtitle: 'Partitions, Mock Theta Functions & Modular Equations',
    description:
      'Self-taught genius Srinivasa Ramanujan discovered nearly 3,900 identities, partition congruences, and modular forms that now govern string theory, black hole physics, and modern algorithm design.',
    formula: '1/π = (2√2 / 9801) ∑_{k=0}^∞ [(4k)!(1103 + 26390k) / (k!)^4 396^{4k}]',
    branch: 'Modular Forms & Number Theory',
    tag: 'Infinite Depth',
    keyContribution:
      'Hardy-Ramanujan asymptotic partition formula and the iconic taxicab number 1729 = 1³ + 12³ = 9³ + 10³.',
  },
  {
    id: 'lorenz',
    era: 'modern',
    year: '1963 CE',
    century: 'Late 20th Century',
    title: 'Edward Lorenz — Chaos Theory',
    subtitle: 'Deterministic Chaos & Strange Attractors',
    description:
      'Lorenz discovered that simple systems of non-linear differential equations could yield infinitely complex, non-repeating trajectories sensitive to initial conditions—the Butterfly Effect—visualized in the famous 3D Lorenz strange attractor.',
    formula: 'dx/dt = σ(y - x) · dy/dt = x(ρ - z) - y · dz/dt = xy - βz',
    branch: 'Dynamical Systems',
    tag: 'Chaos Theory',
    keyContribution:
      'Proved deterministic systems can exhibit chaotic, unpredictable behavior with fractal dimensions.',
  },
  {
    id: 'modern-ai',
    era: 'modern',
    year: 'Present Day',
    century: '21st Century',
    title: 'Discrete Geometry & Neural Manifolds',
    subtitle: 'Differential Geometry, High-Dimensional Latent Spaces & AI',
    description:
      'Modern artificial intelligence, quantum computing, and cryptography represent the culmination of pure mathematics: deep neural networks operate on high-dimensional Riemannian manifolds, manifold learning, and matrix eigenspaces.',
    formula: 'Attention(Q, K, V) = softmax(QK^T / √d_k) V',
    branch: 'Computational Mathematics',
    tag: 'Frontier AI',
    keyContribution:
      'High-dimensional tensor geometry, spectral graph theory, and topological data analysis.',
  },
];
