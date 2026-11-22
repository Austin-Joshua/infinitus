'use client';

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useReducedMotion } from 'framer-motion';
import { MATH_DOMAINS, buildKnowledgeGraph } from '@/lib/knowledgeGraph';
import { formatEventDate, eventHref } from '@/lib/format';

export default function EventsKnowledgeGraph({ events, className = '' }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [selectedDomain, setSelectedDomain] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeEvent, setActiveEvent] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isSimulating, setIsSimulating] = useState(true);
  const prefersReducedMotion = useReducedMotion();

  // Internal physics & rendering state
  const stateRef = useRef({
    graph: null,
    transform: { x: 0, y: 0, scale: 1 },
    dragNode: null,
    activePointers: new Map(),
    pinchDist: null,
    isPanning: false,
    panStart: { x: 0, y: 0 },
    mousePos: { x: 0, y: 0 },
    alpha: 1.0,
    isDark: true,
  });

  // Theme synchronization
  useEffect(() => {
    const updateTheme = () => {
      stateRef.current.isDark = document.documentElement.classList.contains('dark');
    };
    updateTheme();
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Initialize graph
  useEffect(() => {
    const rect = containerRef.current?.getBoundingClientRect() || { width: 900, height: 560 };
    stateRef.current.graph = buildKnowledgeGraph(events, rect.width, rect.height);
    stateRef.current.alpha = 1.0;
  }, [events]);

  // Recenter and reset transform
  const handleRecenter = useCallback(() => {
    stateRef.current.transform = { x: 0, y: 0, scale: 1 };
    stateRef.current.alpha = 0.4;
    setZoomLevel(1);
  }, []);

  // Zoom helpers
  const handleZoom = (factor) => {
    const t = stateRef.current.transform;
    const nextScale = Math.max(0.55, Math.min(2.2, t.scale * factor));
    t.scale = nextScale;
    stateRef.current.alpha = 0.15;
    setZoomLevel(nextScale);
  };

  // Main canvas animation & force simulation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId;
    let isVisible = true;

    const io = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    if (containerRef.current) io.observe(containerRef.current);

    const onVisibilityChange = () => {
      isVisible = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      stateRef.current.alpha = 0.3;
    };
    handleResize();

    const resizeObserver = new ResizeObserver(handleResize);
    if (canvas.parentElement) resizeObserver.observe(canvas.parentElement);

    // Physics step
    const stepPhysics = (width, height) => {
      const s = stateRef.current;
      if (!s.graph) return;
      const { nodes, links } = s.graph;
      const alpha = s.alpha;
      if (alpha < 0.003) {
        if (isSimulating) setIsSimulating(false);
        return;
      }
      if (!isSimulating) setIsSimulating(true);

      const cx = width / 2;
      const cy = height / 2;

      // Check if a node is actively being dragged by any pointer (single or multi-touch)
      const isNodeDragged = (node) => {
        if (!node) return false;
        if (s.dragNode === node) return true;
        for (const p of s.activePointers.values()) {
          if (p.dragNode === node) return true;
        }
        return false;
      };

      // 1. Center gravity force
      for (const node of nodes) {
        if (isNodeDragged(node)) continue;
        const kCenter = node.type === 'domain' ? 0.02 * alpha : 0.015 * alpha;
        node.vx += (cx - node.x) * kCenter;
        node.vy += (cy - node.y) * kCenter;
      }

      // 2. Repulsion between all nodes (Coulomb's Law)
      for (let i = 0; i < nodes.length; i++) {
        const u = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const v = nodes[j];
          const dx = v.x - u.x;
          const dy = v.y - u.y;
          const distSq = dx * dx + dy * dy + 1;
          const dist = Math.sqrt(distSq);

          const repFactor = u.type === 'domain' && v.type === 'domain' ? 1200 : 380;
          const force = (repFactor * alpha) / distSq;
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;

          if (!isNodeDragged(u)) {
            u.vx -= fx / u.mass;
            u.vy -= fy / u.mass;
          }
          if (!isNodeDragged(v)) {
            v.vx += fx / v.mass;
            v.vy += fy / v.mass;
          }

          // Collision prevention
          const minDist = u.radius + v.radius + 8;
          if (dist < minDist) {
            const overlap = (minDist - dist) * 0.5 * alpha;
            const ox = (dx / dist) * overlap;
            const oy = (dy / dist) * overlap;
            if (!isNodeDragged(u)) {
              u.vx -= ox;
              u.vy -= oy;
            }
            if (!isNodeDragged(v)) {
              v.vx += ox;
              v.vy += oy;
            }
          }
        }
      }

      // 3. Spring link attraction (Hooke's Law)
      for (const link of links) {
        const u = link.source;
        const v = link.target;
        const dx = v.x - u.x;
        const dy = v.y - u.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const displacement = dist - link.distance;
        const force = displacement * link.strength * alpha;
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;

        if (!isNodeDragged(u)) {
          u.vx += fx / u.mass;
          u.vy += fy / u.mass;
        }
        if (!isNodeDragged(v)) {
          v.vx -= fx / v.mass;
          v.vy -= fy / v.mass;
        }
      }

      // 4. Update positions & damping
      const damping = 0.86;
      for (const node of nodes) {
        if (isNodeDragged(node)) continue;
        node.vx *= damping;
        node.vy *= damping;
        node.x += node.vx;
        node.y += node.vy;

        // Bounded within canvas limits
        const pad = node.radius + 10;
        node.x = Math.max(pad, Math.min(width - pad, node.x));
        node.y = Math.max(pad, Math.min(height - pad, node.y));
      }

      s.alpha *= 0.985;
    };

    // Render loop
    const render = () => {
      if (isVisible) {
        const rect = canvas.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const s = stateRef.current;
        const isDark = s.isDark;

        if (!prefersReducedMotion) {
          stepPhysics(width, height);
        }

        ctx.clearRect(0, 0, width, height);

        // Apply pan & zoom transform
        ctx.save();
        ctx.translate(s.transform.x, s.transform.y);
        ctx.scale(s.transform.scale, s.transform.scale);

        // Background subtle grid
        const gridColor = isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(20, 36, 56, 0.03)';
        ctx.strokeStyle = gridColor;
        ctx.lineWidth = 1 / s.transform.scale;
        const step = 40;
        ctx.beginPath();
        for (let x = -width; x < width * 2; x += step) {
          ctx.moveTo(x, -height);
          ctx.lineTo(x, height * 2);
        }
        for (let y = -height; y < height * 2; y += step) {
          ctx.moveTo(-width, y);
          ctx.lineTo(width * 2, y);
        }
        ctx.stroke();

        if (s.graph) {
          const { nodes, links } = s.graph;
          const activeHover = hoveredNode;
          const activeFilter = selectedDomain;
          const query = searchQuery.trim().toLowerCase();

          // Helper to check if a node is highlighted
          const isNodeHighlighted = (node) => {
            if (query) {
              return (
                node.name?.toLowerCase().includes(query) ||
                node.title?.toLowerCase().includes(query) ||
                node.eventType?.toLowerCase().includes(query) ||
                node.venue?.toLowerCase().includes(query)
              );
            }
            if (activeHover) {
              if (node === activeHover) return true;
              if (activeHover.type === 'domain') {
                return node.domainId === activeHover.domainId || node.secondaryDomainId === activeHover.domainId;
              }
              if (activeHover.type === 'event') {
                return node.id === `domain-${activeHover.domainId}`;
              }
            }
            if (activeFilter !== 'all') {
              if (node.type === 'domain') return node.domainId === activeFilter;
              return node.domainId === activeFilter || node.secondaryDomainId === activeFilter;
            }
            return true;
          };

          // Draw links
          for (const link of links) {
            const u = link.source;
            const v = link.target;
            const uHighlighted = isNodeHighlighted(u);
            const vHighlighted = isNodeHighlighted(v);
            const highlighted = uHighlighted && vHighlighted;

            let alpha = highlighted ? (isDark ? 0.45 : 0.4) : isDark ? 0.08 : 0.06;
            if (link.isSecondary) alpha *= 0.6;
            if (link.isDomainRing) alpha *= 0.5;

            ctx.strokeStyle = highlighted
              ? isDark
                ? link.source.color || '#FF7A1A'
                : link.source.colorLight || '#D95A00'
              : isDark
              ? 'rgba(255, 255, 255, 0.15)'
              : 'rgba(20, 36, 56, 0.12)';

            ctx.lineWidth = highlighted
              ? (link.isDomainRing ? 1.5 : 2) / s.transform.scale
              : 0.75 / s.transform.scale;

            if (link.isSecondary || link.isDomainRing) {
              ctx.setLineDash([4 / s.transform.scale, 4 / s.transform.scale]);
            } else {
              ctx.setLineDash([]);
            }

            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.moveTo(u.x, u.y);
            ctx.lineTo(v.x, v.y);
            ctx.stroke();
            ctx.setLineDash([]);
          }

          ctx.globalAlpha = 1;

          // Draw event nodes
          for (const node of nodes) {
            if (node.type !== 'event') continue;
            const highlighted = isNodeHighlighted(node);
            const isHovered = node === activeHover;
            const isSelected = activeEvent?.id === node.eventId;
            const color = isDark ? node.color : node.colorLight;

            ctx.save();
            ctx.globalAlpha = highlighted ? 1 : 0.2;

            // Halo glow for hovered/selected
            if (isHovered || isSelected) {
              ctx.beginPath();
              ctx.arc(node.x, node.y, node.radius + 6, 0, Math.PI * 2);
              ctx.fillStyle = isDark ? 'rgba(255, 122, 26, 0.25)' : 'rgba(27, 51, 80, 0.2)';
              ctx.fill();
            }

            // Outer ring
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            ctx.fillStyle = isDark ? '#121420' : '#FFFFFF';
            ctx.fill();
            ctx.strokeStyle = color;
            ctx.lineWidth = (isHovered || isSelected ? 2.5 : 1.5) / s.transform.scale;
            ctx.stroke();

            // Inner core dot
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.radius * 0.45, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();

            ctx.restore();
          }

          // Draw domain hub nodes
          for (const node of nodes) {
            if (node.type !== 'domain') continue;
            const highlighted = isNodeHighlighted(node);
            const isHovered = node === activeHover;
            const isSelected = selectedDomain === node.domainId;
            const color = isDark ? node.color : node.colorLight;

            ctx.save();
            ctx.globalAlpha = highlighted ? 1 : 0.25;

            // Domain outer pulse ring
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.radius + (isHovered ? 8 : 4), 0, Math.PI * 2);
            ctx.fillStyle = isDark ? `${color}25` : `${color}20`;
            ctx.fill();

            // Main Domain body
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            ctx.fillStyle = isDark ? '#121420' : '#FFFFFF';
            ctx.fill();
            ctx.strokeStyle = color;
            ctx.lineWidth = (isHovered || isSelected ? 3.5 : 2) / s.transform.scale;
            ctx.stroke();

            // Domain mathematical symbol
            ctx.fillStyle = color;
            ctx.font = `bold ${Math.round(15 / s.transform.scale)}px serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(node.symbol, node.x, node.y);

            // Domain Label below node
            ctx.font = `600 ${Math.round(10.5 / s.transform.scale)}px sans-serif`;
            ctx.fillStyle = isDark ? '#F2F4FA' : '#142438';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.fillText(node.shortName, node.x, node.y + node.radius + 6);

            ctx.restore();
          }
        }

        ctx.restore();
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
  }, [events, hoveredNode, selectedDomain, searchQuery, activeEvent, prefersReducedMotion, isSimulating]);

  // Screen to graph world coordinates
  const screenToWorld = useCallback((clientX, clientY) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const t = stateRef.current.transform;
    const sx = clientX - rect.left;
    const sy = clientY - rect.top;
    return {
      x: (sx - t.x) / t.scale,
      y: (sy - t.y) / t.scale,
    };
  }, []);

  // Find node under pointer (supports generous touch target on mobile/tablet)
  const getNodeAt = useCallback((worldX, worldY, isTouch = false) => {
    const s = stateRef.current;
    if (!s.graph) return null;
    const { nodes } = s.graph;
    // Check domain hubs first (generous touch hit target so fingers grab easily), then events
    for (let i = nodes.length - 1; i >= 0; i--) {
      const node = nodes[i];
      const dx = worldX - node.x;
      const dy = worldY - node.y;
      const hitRadius = node.type === 'domain'
        ? (isTouch ? Math.max(node.radius + 26, 42) : node.radius + 12)
        : (isTouch ? Math.max(node.radius + 18, 30) : node.radius + 8);
      if (dx * dx + dy * dy <= hitRadius * hitRadius) {
        return node;
      }
    }
    return null;
  }, []);

  // Pointer event handlers with multi-touch finger dragging & pinch-to-zoom
  const handlePointerDown = (e) => {
    const s = stateRef.current;
    const isTouch = e.pointerType === 'touch';
    const world = screenToWorld(e.clientX, e.clientY);
    const hit = getNodeAt(world.x, world.y, isTouch);

    s.activePointers.set(e.pointerId, {
      clientX: e.clientX,
      clientY: e.clientY,
      dragNode: hit,
      startX: e.clientX,
      startY: e.clientY,
    });

    if (hit) {
      s.alpha = Math.max(s.alpha, 0.65);
    } else {
      if (s.activePointers.size === 1) {
        s.isPanning = true;
        s.panStart = {
          x: e.clientX - s.transform.x,
          y: e.clientY - s.transform.y,
        };
      } else if (s.activePointers.size === 2) {
        const [p1, p2] = Array.from(s.activePointers.values());
        s.pinchDist = Math.hypot(p1.clientX - p2.clientX, p1.clientY - p2.clientY);
      }
    }
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
  };

  const handlePointerMove = (e) => {
    const s = stateRef.current;
    const world = screenToWorld(e.clientX, e.clientY);
    s.mousePos = { x: e.clientX, y: e.clientY };

    const ptr = s.activePointers.get(e.pointerId);
    if (ptr) {
      ptr.clientX = e.clientX;
      ptr.clientY = e.clientY;

      if (ptr.dragNode) {
        // Dragging a node (supports multi-touch simultaneous dragging of multiple domain hubs!)
        ptr.dragNode.x = world.x;
        ptr.dragNode.y = world.y;
        ptr.dragNode.vx = 0;
        ptr.dragNode.vy = 0;
        s.alpha = Math.max(s.alpha, 0.45);
      } else if (s.activePointers.size === 2) {
        // Two-finger pinch-to-zoom and two-finger pan
        const [p1, p2] = Array.from(s.activePointers.values());
        const currentDist = Math.hypot(p1.clientX - p2.clientX, p1.clientY - p2.clientY);
        if (s.pinchDist && s.pinchDist > 10) {
          const factor = currentDist / s.pinchDist;
          if (Math.abs(factor - 1) > 0.008) {
            const nextScale = Math.max(0.5, Math.min(2.5, s.transform.scale * factor));
            s.transform.scale = nextScale;
            setZoomLevel(nextScale);
            s.pinchDist = currentDist;
            s.alpha = Math.max(s.alpha, 0.25);
          }
        } else {
          s.pinchDist = currentDist;
        }
      } else if (s.isPanning) {
        s.transform.x = e.clientX - s.panStart.x;
        s.transform.y = e.clientY - s.panStart.y;
      }
    } else {
      const hover = getNodeAt(world.x, world.y, false);
      if (hover !== hoveredNode) {
        setHoveredNode(hover);
      }
    }
  };

  const handlePointerUp = (e) => {
    const s = stateRef.current;
    const ptr = s.activePointers.get(e.pointerId);

    if (ptr) {
      const distMoved = Math.hypot(e.clientX - ptr.startX, e.clientY - ptr.startY);
      // Quick tap without dragging counts as selection click
      if (distMoved < 8 && ptr.dragNode) {
        const hit = ptr.dragNode;
        if (hit.type === 'event') {
          const fullEvent = events.find((ev) => ev.id === hit.eventId);
          setActiveEvent(fullEvent || null);
        } else if (hit.type === 'domain') {
          setSelectedDomain((prev) => (prev === hit.domainId ? 'all' : hit.domainId));
        }
      } else if (distMoved < 8 && !ptr.dragNode && s.activePointers.size === 1) {
        // Tap on empty space clears selection
        setActiveEvent(null);
      }
      s.activePointers.delete(e.pointerId);
    }

    if (s.activePointers.size === 0) {
      s.isPanning = false;
      s.pinchDist = null;
    }
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
  };

  // Wheel zoom
  const handleWheel = (e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
    handleZoom(zoomFactor);
  };

  return (
    <div
      ref={containerRef}
      className={`card relative overflow-hidden rounded-2xl border border-fg/15 bg-card p-4 sm:p-6 shadow-xl transition-all ${className}`}
      role="region"
      aria-label="Interactive Mathematical Knowledge Graph: 44 INFINITUS events mapped across mathematical domains"
    >
      {/* Header bar: Title, eyebrow, and search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-fg/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-widest text-accent font-semibold">
              Mathematical Constellation
            </span>
            <span className="text-muted/40" aria-hidden="true">·</span>
            <span className="font-mono text-[11px] text-muted">44 Events Mapped</span>
          </div>
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-fg mt-1 tracking-tight">
            Interactive Knowledge Graph
          </h2>
          <p className="text-xs sm:text-sm text-muted mt-1 max-w-xl">
            Drag nodes to explore dynamic force springs, click domains to filter clusters, or select any event to view details.
          </p>
        </div>

        {/* Quick Search Input */}
        <div className="relative w-full md:w-64 shrink-0">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              stateRef.current.alpha = 0.25;
            }}
            placeholder="Search constellation…"
            className="w-full rounded-lg border border-fg/15 bg-bg/60 px-3 py-1.5 pl-8 font-mono text-xs text-fg placeholder:text-muted/60 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            aria-label="Search events in the knowledge graph"
          />
          <svg
            className="pointer-events-none absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2 text-muted hover:text-fg font-mono text-xs"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Domain Filter Pills */}
      <div className="mt-3.5 flex items-center gap-1.5 overflow-x-auto pb-1" role="tablist">
        <button
          role="tab"
          aria-selected={selectedDomain === 'all'}
          onClick={() => {
            setSelectedDomain('all');
            stateRef.current.alpha = 0.35;
          }}
          className={`rounded-lg px-2.5 py-1 font-mono text-xs whitespace-nowrap transition-all ${
            selectedDomain === 'all'
              ? 'bg-accent text-btn-fg font-semibold shadow-sm'
              : 'text-muted hover:text-fg hover:bg-fg/5'
          }`}
        >
          All Branches (44)
        </button>

        {MATH_DOMAINS.map((domain) => {
          const isActive = selectedDomain === domain.id;
          return (
            <button
              key={domain.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => {
                setSelectedDomain(isActive ? 'all' : domain.id);
                stateRef.current.alpha = 0.35;
              }}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-mono text-xs whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-accent text-btn-fg font-semibold shadow-sm'
                  : 'text-muted hover:text-fg hover:bg-fg/5'
              }`}
            >
              <span className="font-serif font-bold">{domain.symbol}</span>
              <span>{domain.shortName}</span>
            </button>
          );
        })}
      </div>

      {/* Interactive Graph Canvas Viewport */}
      <div className="relative mt-3 w-full h-[400px] sm:h-[480px] md:h-[520px] rounded-xl overflow-hidden bg-bg/50 border border-fg/10">
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onWheel={handleWheel}
          className="w-full h-full block touch-none cursor-grab active:cursor-grabbing"
          aria-hidden="true"
        />

        {/* Floating Zoom & Pan Toolbar */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-bg/95 p-1 rounded-lg border border-fg/15 shadow-md">
          <button
            onClick={() => handleZoom(1.15)}
            className="p-1.5 text-xs font-mono rounded hover:bg-fg/10 text-muted hover:text-fg transition-colors"
            title="Zoom in"
            aria-label="Zoom in"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </button>
          <button
            onClick={() => handleZoom(0.85)}
            className="p-1.5 text-xs font-mono rounded hover:bg-fg/10 text-muted hover:text-fg transition-colors"
            title="Zoom out"
            aria-label="Zoom out"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
            </svg>
          </button>
          <div className="w-[1px] h-3.5 bg-fg/15 mx-0.5" />
          <button
            onClick={handleRecenter}
            className="p-1.5 text-xs font-mono rounded hover:bg-fg/10 text-muted hover:text-fg transition-colors"
            title="Reset position & zoom"
            aria-label="Reset position & zoom"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        {/* Hover Tooltip */}
        {hoveredNode && !activeEvent && (
          <div
            className="pointer-events-none absolute z-20 max-w-xs rounded-lg border border-fg/15 bg-card p-2.5 shadow-xl text-xs transition-opacity duration-150"
            style={{
              left: Math.min(Math.max(12, stateRef.current.mousePos.x - 80), 300),
              top: Math.max(12, stateRef.current.mousePos.y - 80),
            }}
          >
            {hoveredNode.type === 'domain' ? (
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-serif font-bold text-sm" style={{ color: hoveredNode.color }}>
                    {hoveredNode.symbol}
                  </span>
                  <span className="font-semibold text-fg">{hoveredNode.name}</span>
                </div>
                <p className="mt-1 text-[11px] text-muted leading-tight">{hoveredNode.description}</p>
                <p className="mt-1.5 font-mono text-[10px] text-accent font-medium">Click to isolate domain cluster</p>
              </div>
            ) : (
              <div>
                <span className="font-mono text-[10px] uppercase font-semibold text-accent">
                  {hoveredNode.eventType}
                </span>
                <h4 className="font-heading font-bold text-fg text-xs mt-0.5 line-clamp-2">
                  {hoveredNode.title}
                </h4>
                <p className="font-mono text-[10px] text-muted mt-1">
                  {formatEventDate(hoveredNode.eventDate)}
                  {hoveredNode.venue ? ` · ${hoveredNode.venue}` : ''}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Active Selected Event Preview Drawer */}
        {activeEvent && (
          <div className="absolute inset-x-3 bottom-3 z-30 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-sunset-orange/40 bg-card p-4 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-center gap-3.5 min-w-0 w-full sm:w-auto">
              {activeEvent.coverImageUrl && (
                <div className="relative h-14 w-11 shrink-0 overflow-hidden rounded-md border border-fg/10 bg-bg">
                  <Image
                    src={activeEvent.coverImageUrl}
                    alt={activeEvent.title}
                    fill
                    sizes="44px"
                    className="object-cover object-top"
                  />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="chip text-[9px] py-0.5 px-1.5 border-sunset/40 text-sunset font-medium">
                    {activeEvent.eventType || 'Event'}
                  </span>
                  {activeEvent.status === 'upcoming' && (
                    <span className="chip text-[9px] py-0.5 px-1.5 bg-sunset/15 border-sunset/50 text-sunset font-semibold">
                      Upcoming
                    </span>
                  )}
                </div>
                <h3 className="font-heading font-bold text-sm sm:text-base text-fg truncate mt-1">
                  {activeEvent.title}
                </h3>
                <p className="font-mono text-[11px] text-muted truncate mt-0.5">
                  {formatEventDate(activeEvent.eventDate, activeEvent.endDate)}
                  {activeEvent.venue ? ` · ${activeEvent.venue}` : ''}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
              <Link
                href={eventHref(activeEvent)}
                className="btn-primary text-xs py-1.5 px-3 whitespace-nowrap"
              >
                View Event Page <span aria-hidden="true" className="nudge">→</span>
              </Link>
              <button
                onClick={() => setActiveEvent(null)}
                className="p-1.5 text-muted hover:text-fg font-mono text-xs rounded border border-fg/10"
                aria-label="Close event preview"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Accessible screen-reader breakdown */}
      <div className="sr-only">
        <h3>Mathematical Knowledge Graph Breakdown</h3>
        {MATH_DOMAINS.map((domain) => {
          const domainEvents = events.filter((e) => {
            const mapInfo = events.find((ev) => ev.id === e.id);
            return mapInfo;
          });
          return (
            <div key={domain.id}>
              <h4>{domain.name} ({domain.symbol})</h4>
              <p>{domain.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
