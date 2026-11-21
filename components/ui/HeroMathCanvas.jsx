'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useReducedMotion } from 'framer-motion';

/** Precomputed Discrete Fourier Transform of the Lemniscate of Bernoulli: (x² + y²)² = a²(x² - y²) */
function computeLemniscateDFT(numSamples = 256, scale = 110) {
  const points = [];
  for (let i = 0; i < numSamples; i++) {
    const t = (i / numSamples) * Math.PI * 2;
    const s = Math.sin(t);
    const c = Math.cos(t);
    const d = 1 + s * s;
    points.push({
      x: (scale * c) / d,
      y: (scale * s * c) / d,
    });
  }

  const dft = [];
  for (let k = 0; k < numSamples; k++) {
    let re = 0;
    let im = 0;
    for (let n = 0; n < numSamples; n++) {
      const phi = (2 * Math.PI * k * n) / numSamples;
      re += points[n].x * Math.cos(phi) + points[n].y * Math.sin(phi);
      im += points[n].y * Math.cos(phi) - points[n].x * Math.sin(phi);
    }
    re /= numSamples;
    im /= numSamples;
    const freq = k > numSamples / 2 ? k - numSamples : k;
    const amp = Math.hypot(re, im);
    const phase = Math.atan2(im, re);
    dft.push({ freq, amp, phase });
  }

  // Keep the most significant harmonics sorted by amplitude
  return dft.filter((e) => e.amp > 0.4).sort((a, b) => b.amp - a.amp);
}

const MODES = [
  {
    id: 'lorenz',
    name: 'Lorenz',
    tag: 'Chaos Theory',
    formula: 'dx/dt = σ(y - x) · dy/dt = x(ρ - z) - y · dz/dt = xy - βz',
    desc: '3D strange attractor illustrating deterministic chaos & butterfly effect',
  },
  {
    id: 'fourier',
    name: 'Fourier (∞)',
    tag: 'Harmonic Analysis',
    formula: 'f(t) = ∑ Cₖ · e^{i k ω t} → Tracing Lemniscate (∞)',
    desc: 'Harmonic epicycles synthesizing the Infinitus infinity curve',
  },
  {
    id: 'aizawa',
    name: 'Aizawa',
    tag: 'Dynamical Systems',
    formula: 'dz/dt = c + az - z³/3 - (x² + y²)(1 + ez) + fzx³',
    desc: 'Spherical torus attractor with interior spiral vortex',
  },
];

export default function HeroMathCanvas({ className = '' }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [mode, setMode] = useState('lorenz');
  const [isRunning, setIsRunning] = useState(true);
  const [isInteracting, setIsInteracting] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // Ref to hold current running state so pausing doesn't trigger canvas recreation or wipe
  const isRunningRef = useRef(isRunning);
  useEffect(() => {
    isRunningRef.current = isRunning;
  }, [isRunning]);

  // 3D rotation angles & physics state
  const stateRef = useRef({
    rotX: 0.35,
    rotY: -0.65,
    velX: 0.002,
    velY: 0.004,
    dragX: 0,
    dragY: 0,
    isDragging: false,
    fourierTime: 0,
    fourierPath: [],
    lorenzParticles: [],
    aizawaParticles: [],
    dftHarmonics: null,
    isDark: true,
  });

  // Initialize or reset particles for Lorenz & Aizawa
  const initSimulation = useCallback(() => {
    const s = stateRef.current;
    if (!s.dftHarmonics) {
      s.dftHarmonics = computeLemniscateDFT(256, 110);
    }

    // Reset Lorenz swarm (75 particles with micro-offsets)
    s.lorenzParticles = [];
    for (let i = 0; i < 75; i++) {
      const offset = (i - 37) * 0.002;
      s.lorenzParticles.push({
        x: 0.1 + offset,
        y: offset,
        z: 20 + offset,
        history: [],
      });
    }

    // Pre-warm Lorenz so chaotic butterfly wings are fully formed on first render
    const dt = 0.008;
    const sigma = 10;
    const rho = 28;
    const beta = 8 / 3;
    const centerZ = 25;
    for (let step = 0; step < 260; step++) {
      for (let p of s.lorenzParticles) {
        const dx = sigma * (p.y - p.x);
        const dy = p.x * (rho - p.z) - p.y;
        const dz = p.x * p.y - beta * p.z;
        p.x += dx * dt;
        p.y += dy * dt;
        p.z += dz * dt;
        if (step > 220) {
          p.history.push({ x: p.x, y: p.y, z: p.z - centerZ });
        }
      }
    }

    // Reset Aizawa swarm (80 particles on a disk)
    s.aizawaParticles = [];
    for (let i = 0; i < 80; i++) {
      const angle = (i / 80) * Math.PI * 2;
      const radius = 0.5 + (i % 5) * 0.1;
      s.aizawaParticles.push({
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        z: 0.1,
        history: [],
      });
    }

    // Pre-warm Aizawa flow
    const adt = 0.01;
    const aa = 0.95;
    const ab = 0.7;
    const ac = 0.6;
    const ad = 3.5;
    const ae = 0.25;
    const af = 0.1;
    for (let step = 0; step < 180; step++) {
      for (let p of s.aizawaParticles) {
        const dx = (p.z - ab) * p.x - ad * p.y;
        const dy = ad * p.x + (p.z - ab) * p.y;
        const dz =
          ac +
          aa * p.z -
          Math.pow(p.z, 3) / 3 -
          (p.x * p.x + p.y * p.y) * (1 + ae * p.z) +
          af * p.z * Math.pow(p.x, 3);
        p.x += dx * adt;
        p.y += dy * adt;
        p.z += dz * adt;
        if (step > 150) {
          p.history.push({ x: p.x, y: p.y, z: p.z });
        }
      }
    }

    s.fourierTime = 0;
    s.fourierPath = [];
  }, []);

  // Update theme colors
  useEffect(() => {
    const updateTheme = () => {
      const isDark = document.documentElement.classList.contains('dark');
      stateRef.current.isDark = isDark;
    };
    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Main rendering loop with 3D projection and mathematical integration
  useEffect(() => {
    initSimulation();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId;
    let isVisible = true;

    // IntersectionObserver to pause rendering when offscreen
    const io = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    if (containerRef.current) io.observe(containerRef.current);

    // Document visibility change listener (pause tab when hidden)
    const onVisibilityChange = () => {
      isVisible = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    // Resize handler with devicePixelRatio support
    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };
    handleResize();

    const resizeObserver = new ResizeObserver(handleResize);
    if (canvas.parentElement) resizeObserver.observe(canvas.parentElement);

    // 3D rotation helper
    const project3D = (x, y, z, cx, cy, scale, rotX, rotY) => {
      // Rotate around Y
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const x1 = x * cosY + z * sinY;
      const z1 = -x * sinY + z * cosY;

      // Rotate around X
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const y2 = y * cosX - z1 * sinX;
      const z2 = y * sinX + z1 * cosX;

      // Perspective projection
      const distance = 140;
      const fov = distance / (distance + z2);
      return {
        px: cx + x1 * scale * fov,
        py: cy - y2 * scale * fov,
        depth: z2,
      };
    };

    // Render loop
    const render = () => {
      if (isVisible) {
        const isRunningNow = isRunningRef.current;
        const rect = canvas.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const cx = width / 2;
        const cy = height / 2;
        const s = stateRef.current;
        const isDark = s.isDark;

        // Inertia & auto-spin
        if (!s.isDragging && !prefersReducedMotion && isRunningNow) {
          s.rotX += s.velX;
          s.rotY += s.velY;
          s.velX *= 0.96;
          s.velY = s.velY * 0.96 + 0.003 * 0.04; // Gentle return to smooth ambient spin
        } else if (!s.isDragging && (Math.abs(s.velX) > 0.0001 || Math.abs(s.velY) > 0.0001)) {
          // Coast drag velocity smoothly even when paused
          s.rotX += s.velX;
          s.rotY += s.velY;
          s.velX *= 0.92;
          s.velY *= 0.92;
        }

        // Clear canvas with subtle math grid overlay
        ctx.clearRect(0, 0, width, height);

        // Palette setup
        const primaryColor = isDark ? '#FF7A1A' : '#1B3350';
        const secondaryColor = isDark ? '#2F6BFF' : '#F03A2A';
        const faintColor = isDark ? 'rgba(255, 122, 26, 0.15)' : 'rgba(27, 51, 80, 0.12)';
        const gridColor = isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(20, 36, 56, 0.04)';

        // Draw faint coordinate crosshair
        ctx.strokeStyle = gridColor;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cx, 16);
        ctx.lineTo(cx, height - 16);
        ctx.moveTo(16, cy);
        ctx.lineTo(width - 16, cy);
        ctx.stroke();

        // MODE 1: LORENZ ATTRACTOR
        if (mode === 'lorenz') {
          const dt = 0.008;
          const sigma = 10;
          const rho = 28;
          const beta = 8 / 3;
          const scale = Math.min(width, height) * 0.024;
          const centerZ = 25;

          // Integrate particles only when running
          if (isRunningNow && !prefersReducedMotion) {
            for (let p of s.lorenzParticles) {
              const dx = sigma * (p.y - p.x);
              const dy = p.x * (rho - p.z) - p.y;
              const dz = p.x * p.y - beta * p.z;
              p.x += dx * dt;
              p.y += dy * dt;
              p.z += dz * dt;

              p.history.push({ x: p.x, y: p.y, z: p.z - centerZ });
              if (p.history.length > 36) p.history.shift();
            }
          }

          // Always draw trajectory ribbons and head dots (frozen in place when paused)
          for (let p of s.lorenzParticles) {
            if (p.history.length > 2) {
              ctx.beginPath();
              for (let i = 0; i < p.history.length; i++) {
                const pt = p.history[i];
                const pr = project3D(pt.x, pt.y, pt.z, cx, cy, scale, s.rotX, s.rotY);
                if (i === 0) ctx.moveTo(pr.px, pr.py);
                else ctx.lineTo(pr.px, pr.py);
              }
              const alpha = Math.min(1, p.history.length / 36);
              ctx.strokeStyle = isDark
                ? `rgba(255, 122, 26, ${0.45 * alpha})`
                : `rgba(27, 51, 80, ${0.45 * alpha})`;
              ctx.lineWidth = 1.35;
              ctx.stroke();
            }

            // Head glow dot
            const head = project3D(p.x, p.y, p.z - centerZ, cx, cy, scale, s.rotX, s.rotY);
            ctx.fillStyle = secondaryColor;
            ctx.beginPath();
            ctx.arc(head.px, head.py, 1.8, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // MODE 2: FOURIER EPICYCLES LEMNISCATE
        else if (mode === 'fourier') {
          const harmonics = s.dftHarmonics || [];
          const speed = prefersReducedMotion ? 0.005 : 0.015;

          // Advance time only when running
          if (isRunningNow) {
            s.fourierTime += speed;
            if (s.fourierTime > Math.PI * 2) s.fourierTime -= Math.PI * 2;
          }

          // Draw faint background guide of the full Lemniscate of Bernoulli
          ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(20, 36, 56, 0.07)';
          ctx.lineWidth = 1;
          ctx.setLineDash([3, 3]);
          ctx.beginPath();
          for (let i = 0; i <= 240; i++) {
            const t = (i / 240) * Math.PI * 2;
            const s = Math.sin(t);
            const c = Math.cos(t);
            const d = 1 + s * s;
            const gx = cx + (110 * c) / d;
            const gy = cy + (110 * s * c) / d;
            if (i === 0) ctx.moveTo(gx, gy);
            else ctx.lineTo(gx, gy);
          }
          ctx.stroke();
          ctx.setLineDash([]);

          let epX = cx;
          let epY = cy;

          // Draw epicycles
          for (let i = 0; i < harmonics.length; i++) {
            const h = harmonics[i];
            const prevX = epX;
            const prevY = epY;
            const theta = h.freq * s.fourierTime + h.phase;
            epX += h.amp * Math.cos(theta);
            epY += h.amp * Math.sin(theta);

            // Epicycle circle
            ctx.strokeStyle = faintColor;
            ctx.lineWidth = 0.75;
            ctx.beginPath();
            ctx.arc(prevX, prevY, h.amp, 0, Math.PI * 2);
            ctx.stroke();

            // Vector radius arm
            ctx.strokeStyle = isDark ? 'rgba(47, 107, 255, 0.4)' : 'rgba(240, 58, 42, 0.35)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(prevX, prevY);
            ctx.lineTo(epX, epY);
            ctx.stroke();
          }

          // Append traced point only when running
          if (isRunningNow) {
            s.fourierPath.push({ x: epX, y: epY });
            if (s.fourierPath.length > 320) s.fourierPath.shift();
          }

          // Draw continuous traced infinity curve
          if (s.fourierPath.length > 2) {
            ctx.beginPath();
            for (let i = 0; i < s.fourierPath.length; i++) {
              const pt = s.fourierPath[i];
              if (i === 0) ctx.moveTo(pt.x, pt.y);
              else ctx.lineTo(pt.x, pt.y);
            }
            ctx.strokeStyle = primaryColor;
            ctx.lineWidth = 2.2;
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';
            ctx.shadowColor = primaryColor;
            ctx.shadowBlur = isDark ? 8 : 2;
            ctx.stroke();
            ctx.shadowBlur = 0; // reset shadow
          }

          // Tracing pen head
          ctx.fillStyle = secondaryColor;
          ctx.beginPath();
          ctx.arc(epX, epY, 3.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // MODE 3: AIZAWA ATTRACTOR
        else if (mode === 'aizawa') {
          const dt = 0.01;
          const a = 0.95;
          const b = 0.7;
          const c = 0.6;
          const d = 3.5;
          const e = 0.25;
          const f = 0.1;
          const scale = Math.min(width, height) * 0.22;

          if (isRunningNow && !prefersReducedMotion) {
            for (let p of s.aizawaParticles) {
              const dx = (p.z - b) * p.x - d * p.y;
              const dy = d * p.x + (p.z - b) * p.y;
              const dz =
                c +
                a * p.z -
                Math.pow(p.z, 3) / 3 -
                (p.x * p.x + p.y * p.y) * (1 + e * p.z) +
                f * p.z * Math.pow(p.x, 3);

              p.x += dx * dt;
              p.y += dy * dt;
              p.z += dz * dt;

              p.history.push({ x: p.x, y: p.y, z: p.z });
              if (p.history.length > 28) p.history.shift();
            }
          }

          // Always draw Aizawa trajectory and particles (frozen when paused)
          for (let p of s.aizawaParticles) {
            if (p.history.length > 2) {
              ctx.beginPath();
              for (let i = 0; i < p.history.length; i++) {
                const pt = p.history[i];
                const pr = project3D(pt.x, pt.y, pt.z, cx, cy, scale, s.rotX, s.rotY);
                if (i === 0) ctx.moveTo(pr.px, pr.py);
                else ctx.lineTo(pr.px, pr.py);
              }
              const alpha = Math.min(1, p.history.length / 28);
              ctx.strokeStyle = isDark
                ? `rgba(255, 122, 26, ${0.4 * alpha})`
                : `rgba(27, 51, 80, ${0.4 * alpha})`;
              ctx.lineWidth = 1.25;
              ctx.stroke();
            }

            const head = project3D(p.x, p.y, p.z, cx, cy, scale, s.rotX, s.rotY);
            ctx.fillStyle = secondaryColor;
            ctx.beginPath();
            ctx.arc(head.px, head.py, 1.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      io.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [mode, initSimulation, prefersReducedMotion]);

  // Pointer drag controls for 3D navigation
  const onPointerDown = (e) => {
    stateRef.current.isDragging = true;
    stateRef.current.dragX = e.clientX;
    stateRef.current.dragY = e.clientY;
    setIsInteracting(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    const s = stateRef.current;
    if (!s.isDragging) return;
    const deltaX = e.clientX - s.dragX;
    const deltaY = e.clientY - s.dragY;
    s.dragX = e.clientX;
    s.dragY = e.clientY;

    s.velY = deltaX * 0.005;
    s.velX = -deltaY * 0.005;
    s.rotY += s.velY;
    s.rotX += s.velX;
  };

  const onPointerUp = (e) => {
    stateRef.current.isDragging = false;
    setIsInteracting(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
  };

  const handleReset = () => {
    stateRef.current.rotX = 0.35;
    stateRef.current.rotY = -0.65;
    stateRef.current.velX = 0.002;
    stateRef.current.velY = 0.004;
    initSimulation();
  };

  const activeMode = MODES.find((m) => m.id === mode) || MODES[0];

  return (
    <div
      ref={containerRef}
      className={`card relative overflow-hidden rounded-2xl border border-fg/15 bg-card/75 backdrop-blur-md p-4 sm:p-5 shadow-xl transition-all ${className}`}
      role="region"
      aria-label="Interactive mathematical visualizer: 3D chaotic attractors and Fourier epicycles"
    >
      {/* Blueprint Header: Mode Switcher Pills & Controls */}
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-fg/10">
        <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto" role="tablist">
          {MODES.map((m) => {
            const isActive = m.id === mode;
            return (
              <button
                key={m.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => {
                  setMode(m.id);
                  initSimulation();
                }}
                className={`px-2 py-1 sm:px-2.5 sm:py-1 text-[11px] sm:text-xs font-mono rounded-lg transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-accent text-btn-fg font-semibold shadow-sm'
                    : 'text-muted hover:text-fg hover:bg-fg/5'
                }`}
              >
                {m.name}
              </button>
            );
          })}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="p-1 sm:p-1.5 text-xs font-mono rounded-md border border-fg/10 text-muted hover:text-fg hover:bg-fg/5 transition-colors"
            title={isRunning ? 'Pause animation' : 'Resume animation'}
            aria-label={isRunning ? 'Pause animation' : 'Resume animation'}
          >
            {isRunning ? (
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
          <button
            onClick={handleReset}
            className="p-1 sm:p-1.5 text-xs font-mono rounded-md border border-fg/10 text-muted hover:text-fg hover:bg-fg/5 transition-colors"
            title="Reset simulation & orientation"
            aria-label="Reset simulation & orientation"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Interactive Canvas */}
      <div className="relative mt-3 w-full h-[260px] sm:h-[290px] md:h-[320px] rounded-xl overflow-hidden bg-bg/50 border border-fg/5">
        <canvas
          ref={canvasRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          className={`w-full h-full block touch-none ${
            mode === 'fourier'
              ? 'cursor-default'
              : isInteracting
              ? 'cursor-grabbing'
              : 'cursor-grab'
          }`}
          aria-hidden="true"
        />

        {/* Corner Coordinate Tick Overlay */}
        <div className="pointer-events-none absolute top-2 left-2 text-[9px] font-mono text-muted/60 select-none">
          +Z / Phase
        </div>
        <div className="pointer-events-none absolute bottom-2 right-2 text-[9px] font-mono text-muted/60 select-none">
          Infinitus Math Engine
        </div>

        {/* Status / Drag Hint */}
        {!isRunning ? (
          <div className="pointer-events-none absolute top-2 right-2 text-[10px] font-mono text-sunset bg-bg/85 backdrop-blur-sm px-2 py-0.5 rounded border border-sunset/30 select-none flex items-center gap-1.5 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-sunset" />
            <span>PAUSED</span>
          </div>
        ) : mode !== 'fourier' ? (
          <div className="pointer-events-none absolute top-2 right-2 text-[10px] font-mono text-muted/75 bg-bg/70 backdrop-blur-sm px-2 py-0.5 rounded border border-fg/10 select-none flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span>Drag to rotate 3D</span>
          </div>
        ) : null}
      </div>

      {/* Mathematical Caption & Live Formula Bar */}
      <div className="mt-3 pt-2.5 border-t border-fg/10 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 text-xs">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <span className="font-mono text-[11px] font-semibold text-accent uppercase tracking-wider shrink-0">
              {activeMode.tag}
            </span>
            <span className="text-muted/40 hidden sm:inline" aria-hidden="true">·</span>
            <span className="font-medium text-fg text-xs">{activeMode.desc}</span>
          </div>
          <p className="font-mono text-[10px] sm:text-[11px] text-muted truncate mt-0.5" title={activeMode.formula}>
            {activeMode.formula}
          </p>
        </div>
      </div>
    </div>
  );
}
