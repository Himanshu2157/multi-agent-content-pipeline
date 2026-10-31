"use client";

import React, { useRef, useEffect, useState } from 'react';

export interface ScatteredHeadingProps {
  /** The bold text string to render */
  text: string;
  /** Semantic HTML tag for accessibility */
  as?: 'h1' | 'h2' | 'h3' | 'h4';
  /** Extra CSS classes */
  className?: string;
  /** Accent glow color */
  accent?: string;
  /** Radius of cursor repel effect */
  repelRadius?: number;
}

const FLOW = (x: number, y: number, t: number) =>
  (Math.sin(x * 0.008 + t * 0.9) + Math.cos(y * 0.01 - t * 0.6)) * Math.PI;

export const ScatteredHeading: React.FC<ScatteredHeadingProps> = ({
  text,
  as: Tag = 'h3',
  className = '',
  accent = '#2787FF',
  repelRadius = 95,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glowRef = useRef<HTMLCanvasElement>(null);
  const [containerHeight, setContainerHeight] = useState(90);

  // Mutable state for the 60fps render loop
  const S = useRef({
    W: 0,
    H: 0,
    N: 0,
    // Float32Array slots: [x, y, vx, vy, homeX, homeY, scatterDx, scatterDy, delay, 0]
    P: new Float32Array(0),
    t0: 0,
    scatter: 0,
    targetScatter: 0,
    mouse: { x: -9999, y: -9999, active: false },
    active: true,
    lines: [] as string[],
    startY: 0,
    lineHeight: 0,
    font: '',
    fontSize: 0,
  });

  useEffect(() => {
    const container = containerRef.current;
    const cv = canvasRef.current;
    const gl = glowRef.current;
    if (!container || !cv || !gl) return;

    const ctx = cv.getContext('2d');
    const gtx = gl.getContext('2d');
    if (!ctx || !gtx) return;

    const s = S.current;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    let isVisible = true;
    let alive = true;

    // Sample heading text pixels into high-density dot coordinates
    const build = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const W = Math.max(10, Math.round(rect.width));
      // Responsive font size
      const fontSize = Math.min(Math.max(26, W * 0.045), 44);
      const lineHeight = fontSize * 1.28;

      const off = document.createElement('canvas');
      const og = off.getContext('2d', { willReadFrequently: true });
      if (!og) return;

      const words = text.split(/\s+/);
      const font = `800 ${fontSize}px "Plus Jakarta Sans", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
      og.font = font;

      // Word wrapping
      const lines: string[] = [];
      let currentLine = '';
      for (const w of words) {
        const testLine = currentLine ? `${currentLine} ${w}` : w;
        if (og.measureText(testLine).width > W * 0.94 && currentLine) {
          lines.push(currentLine);
          currentLine = w;
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) lines.push(currentLine);

      const totalH = Math.max(76, Math.round(lines.length * lineHeight + 28));
      const startY = totalH / 2 - ((lines.length - 1) * lineHeight) / 2;

      s.W = W;
      s.H = totalH;
      s.lines = lines;
      s.startY = startY;
      s.lineHeight = lineHeight;
      s.font = font;
      s.fontSize = fontSize;
      setContainerHeight(totalH);

      cv.width = W * dpr;
      cv.height = totalH * dpr;
      gl.width = W * dpr;
      gl.height = totalH * dpr;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      gtx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Enable font smoothing and subpixel antialiasing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      gtx.imageSmoothingEnabled = true;
      gtx.imageSmoothingQuality = 'high';

      off.width = W;
      off.height = totalH;
      og.font = font;
      og.textAlign = 'center';
      og.textBaseline = 'middle';
      og.fillStyle = '#E8EDF7';

      lines.forEach((line, idx) => {
        og.fillText(line, W / 2, startY + idx * lineHeight);
      });

      const imgData = og.getImageData(0, 0, W, totalH).data;
      const pts: number[] = [];
      // High-resolution sampling step (dense dot matrix)
      const step = Math.max(2, Math.round(fontSize / 16));

      for (let y = 0; y < totalH; y += step) {
        for (let x = 0; x < W; x += step) {
          const idx = (y * W + x) * 4;
          if (imgData[idx + 3] > 115) {
            pts.push(x, y);
          }
        }
      }

      const count = pts.length / 2;
      s.N = count;
      const P = new Float32Array(count * 10);

      for (let i = 0; i < count; i++) {
        const hx = pts[i * 2];
        const hy = pts[i * 2 + 1];
        const o = i * 10;

        // 3D scatter trajectory
        const angle = Math.random() * Math.PI * 2;
        const dist = 55 + Math.random() * 150;
        const sdx = Math.cos(angle) * dist;
        const sdy = Math.sin(angle) * dist;

        P[o] = hx;         // current x
        P[o + 1] = hy;     // current y
        P[o + 2] = 0;      // vx
        P[o + 3] = 0;      // vy
        P[o + 4] = hx;     // home x
        P[o + 5] = hy;     // home y
        P[o + 6] = sdx;    // scatter dx
        P[o + 7] = sdy;    // scatter dy
        P[o + 8] = Math.random() * 0.4; // delay
        P[o + 9] = 1;      // active
      }

      s.P = P;
      s.t0 = performance.now();
    };

    build();

    // Re-measure and render once fonts (Plus Jakarta Sans) are fully loaded
    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts.ready.then(() => {
        if (alive) {
          build();
          onScroll();
        }
      });
    }

    // Scroll progress evaluation (directional: gathers on entrance towards center line, stays intact above)
    const onScroll = () => {
      const rect = container.getBoundingClientRect();
      const vh = window.innerHeight;
      const centerY = rect.top + rect.height / 2;

      // Green-line trigger (~60% from top of viewport):
      // When heading is at or above the green line (0.60 * vh):
      // scatter = 0 -> STAYS 100% GATHERED & INTACT as user scrolls down!
      // When heading is entering from below towards the green line:
      // scatter scales from 1 (below) down to 0 at the green line!
      const gatherThreshold = vh * 0.60;
      const entryDistance = vh * 0.32;

      const scrollBottom = window.innerHeight + window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const isAtBottom = scrollBottom >= docHeight - 80;

      if (centerY <= gatherThreshold || isAtBottom) {
        s.targetScatter = 0;
      } else {
        const progress = (centerY - gatherThreshold) / entryDistance;
        s.targetScatter = Math.min(1, Math.max(0, progress));
      }
    };

    onScroll();
    // Initialize scatter directly so headings already in view start gathered
    s.scatter = s.targetScatter;
    window.addEventListener('scroll', onScroll, { passive: true, capture: true });

    // Resize observer
    let resizeTimer = 0;
    const ro = new ResizeObserver(() => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        build();
        onScroll();
      }, 150);
    });
    ro.observe(container);

    // Intersection observer to pause rendering off-screen
    const io = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    }, { threshold: 0 });
    io.observe(container);

    // Interactive mouse movement
    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      s.mouse.x = e.clientX - rect.left;
      s.mouse.y = e.clientY - rect.top;
      s.mouse.active = true;
    };

    const onMouseLeave = () => {
      s.mouse.active = false;
    };

    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('mouseleave', onMouseLeave);

    // ------------------------------------------------------------------------
    // RENDER LOOP
    // ------------------------------------------------------------------------
    const render = (now: number) => {
      raf = 0;
      if (!alive) return;

      if (isVisible) {
        const { W, H, N, P, lines, startY, lineHeight, font } = s;
        const t = (now - s.t0) / 1000;
        const R = repelRadius;
        const R2 = R * R;
        const rect = container.getBoundingClientRect();
        const vh = window.innerHeight;
        const centerY = rect.top + rect.height / 2;

        // Fade in the dots as heading approaches from below:
        // Invisible when at or below bottom of screen (centerY >= vh * 0.94)
        // Fully visible once within reading range (centerY <= vh * 0.72)
        const entranceFade = Math.min(1, Math.max(0, (vh * 0.94 - centerY) / (vh * 0.22)));

        // Slower, smoother physics interpolation (gentle fluid inertia)
        s.scatter += (s.targetScatter - s.scatter) * 0.048;
        const sc = s.scatter;
        const sweep = ((t * 0.4) % 1.6) - 0.3;

        ctx.clearRect(0, 0, W, H);
        gtx.clearRect(0, 0, W, H);

        // Gather progress (1 = fully gathered/unscattered, 0 = scattered)
        const gatherProgress = Math.min(1, Math.max(0, (0.35 - sc) / 0.35));
        const textAlpha = Math.pow(gatherProgress, 1.4) * entranceFade;
        const dotsAlpha = Math.max(0, 1 - Math.pow(gatherProgress, 1.8)) * entranceFade;

        // -------------------------------------------------------------
        // 1. REFINED FONT LAYER (Rendered cleanly when unscattered)
        // -------------------------------------------------------------
        if (textAlpha > 0.005 && lines && lines.length > 0) {
          ctx.save();
          ctx.font = font;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = '#E8EDF7';
          ctx.globalAlpha = textAlpha;

          lines.forEach((line, idx) => {
            ctx.fillText(line, W / 2, startY + idx * lineHeight);
          });

          // Interactive cursor cutout: when hovering over the refined text,
          // erase text right under cursor so the scattering particles can be seen!
          if (s.mouse.active && R > 0) {
            ctx.globalCompositeOperation = 'destination-out';
            const maskGrad = ctx.createRadialGradient(
              s.mouse.x, s.mouse.y, 0,
              s.mouse.x, s.mouse.y, R
            );
            maskGrad.addColorStop(0, 'rgba(0, 0, 0, 1)');
            maskGrad.addColorStop(0.65, 'rgba(0, 0, 0, 0.75)');
            maskGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = maskGrad;
            ctx.beginPath();
            ctx.arc(s.mouse.x, s.mouse.y, R, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();

          // Ambient subtle glow sweep on refined font
          if (!reduce && entranceFade > 0.1 && textAlpha > 0.1) {
            const sweepX = sweep * W;
            const sweepWidth = W * 0.28;
            const sweepGrad = gtx.createLinearGradient(sweepX - sweepWidth, 0, sweepX + sweepWidth, 0);
            sweepGrad.addColorStop(0, 'rgba(39, 135, 255, 0)');
            sweepGrad.addColorStop(0.5, 'rgba(39, 135, 255, 0.35)');
            sweepGrad.addColorStop(1, 'rgba(39, 135, 255, 0)');
            gtx.save();
            gtx.font = font;
            gtx.textAlign = 'center';
            gtx.textBaseline = 'middle';
            gtx.fillStyle = sweepGrad;
            gtx.globalAlpha = textAlpha * 0.75;
            lines.forEach((line, idx) => {
              gtx.fillText(line, W / 2, startY + idx * lineHeight);
            });
            gtx.restore();
          }
        }

        // -------------------------------------------------------------
        // 2. SCATTERED / REPEL PARTICLES LAYER
        // -------------------------------------------------------------
        ctx.fillStyle = '#E8EDF7';
        gtx.fillStyle = accent;

        const baseDotRadius = Math.max(0.9, 1.35 - sc * 0.35);

        for (let i = 0; i < N; i++) {
          const o = i * 10;
          const hx = P[o + 4];
          const hy = P[o + 5];
          const sdx = P[o + 6];
          const sdy = P[o + 7];
          const delay = P[o + 8];

          // Target point based on scatter progression
          const localScatter = Math.min(1, sc * (0.8 + delay * 0.6));
          let tx = hx + sdx * localScatter;
          let ty = hy + sdy * localScatter;

          if (reduce) {
            P[o] = tx;
            P[o + 1] = ty;
          } else {
            let ax = (tx - P[o]) * 0.085;
            let ay = (ty - P[o + 1]) * 0.085;

            // Flow wave when scattered
            if (localScatter > 0.04) {
              const flowAng = FLOW(P[o], P[o + 1], t);
              ax += Math.cos(flowAng) * 1.6 * localScatter;
              ay += Math.sin(flowAng) * 1.6 * localScatter;
            }

            // Interactive cursor repulsion
            if (s.mouse.active && R > 0) {
              const dx = P[o] - s.mouse.x;
              const dy = P[o + 1] - s.mouse.y;
              const d2 = dx * dx + dy * dy;
              if (d2 < R2) {
                const d = Math.sqrt(d2) || 1;
                const f = (1 - d / R) * 4.8;
                ax += (dx / d) * f;
                ay += (dy / d) * f;
              }
            }

            P[o + 2] = (P[o + 2] + ax) * 0.82;
            P[o + 3] = (P[o + 3] + ay) * 0.82;
            P[o] += P[o + 2];
            P[o + 1] += P[o + 3];
          }

          const x = P[o];
          const y = P[o + 1];

          // A particle is rendered if dotsAlpha > 0 (during scatter/unscatter)
          // or if the particle is currently being displaced away from home by mouse hover!
          const displacement = Math.hypot(x - hx, y - hy);
          const mouseDisplacedAlpha = s.mouse.active && displacement > 1.2
            ? Math.min(1, displacement / 10) * entranceFade
            : 0;

          const pAlpha = Math.max(dotsAlpha, mouseDisplacedAlpha);

          if (pAlpha > 0.01) {
            ctx.globalAlpha = pAlpha;
            ctx.beginPath();
            ctx.arc(x, y, baseDotRadius, 0, Math.PI * 2);
            ctx.fill();

            // Glowing electric sweep through in-flight particles
            if (sc < 0.85 && !reduce && entranceFade > 0.1) {
              const sweepDist = Math.max(0, 1 - Math.abs(x / W - sweep) * 5.5);
              const glowAlpha = sweepDist * (1 - sc) * 0.85 * entranceFade * pAlpha;
              if (glowAlpha > 0.02) {
                gtx.globalAlpha = glowAlpha;
                gtx.beginPath();
                gtx.arc(x, y, 2.5, 0, Math.PI * 2);
                gtx.fill();
              }
            }
          }
        }

        ctx.globalAlpha = 1;
        gtx.globalAlpha = 1;
      }

      raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      window.clearTimeout(resizeTimer);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('scroll', onScroll, { capture: true } as any);
      container.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [text, accent, repelRadius]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full flex items-center justify-center my-3 select-none ${className}`}
      style={{ minHeight: `${containerHeight}px`, height: `${containerHeight}px` }}
    >
      {/* Semantic Accessible Heading for SEO & Screen Readers */}
      <Tag className="sr-only">{text}</Tag>

      {/* Glow Layer */}
      <canvas
        ref={glowRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 w-full h-full opacity-60 mix-blend-screen blur-[8px]"
      />

      {/* Main Interactive Dot Canvas (ONLY dots render the heading, zero overlapping HTML text) */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-auto absolute inset-0 w-full h-full cursor-default"
      />
    </div>
  );
};

export default ScatteredHeading;
