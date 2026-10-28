import React, { useState, useEffect, useRef } from 'react';

// ============================================================================
// STRICT MONOCHROME PALETTE
// ============================================================================
const MONO_COLORS = [
  '#FFFFFF', // Crisp White
  '#D9D9D9', // Light Gray
  '#808080', // Medium Gray
  '#404040', // Dark Gray
  '#000000', // Deep Obsidian Black
] as const;

// ============================================================================
// CANVAS VECTOR RENDERING HELPERS
// ============================================================================
const drawRoundRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) => {
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, w, h, r);
  } else {
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
  }
};

// ============================================================================
// 19 MONOCHROME SOCIAL MEDIA & ENGAGEMENT ICONS
// Rendered on a normalized 24x24 coordinate canvas
// ============================================================================
interface IconDefinition {
  id: string;
  name: string;
  isBrand: boolean;
  draw: (ctx: CanvasRenderingContext2D, color: string) => void;
}

const ICON_DEFINITIONS: IconDefinition[] = [
  // --------------------------------------------------------------------------
  // SOCIAL MEDIA LOGOS (5)
  // --------------------------------------------------------------------------
  {
    id: 'instagram',
    name: 'Instagram',
    isBrand: true,
    draw: (ctx) => {
      ctx.beginPath();
      drawRoundRect(ctx, 3, 3, 18, 18, 5.2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(12, 12, 4.2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(16.8, 7.2, 1.25, 0, Math.PI * 2);
      ctx.fill();
    },
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    isBrand: true,
    draw: (ctx) => {
      ctx.beginPath();
      drawRoundRect(ctx, 2.5, 2.5, 19, 19, 4.2);
      ctx.stroke();
      // 'i'
      ctx.beginPath();
      ctx.arc(7.2, 7.3, 1.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(7.2, 10.4);
      ctx.lineTo(7.2, 16.6);
      ctx.stroke();
      // 'n'
      ctx.beginPath();
      ctx.moveTo(11.2, 16.6);
      ctx.lineTo(11.2, 10.4);
      ctx.bezierCurveTo(11.2, 9.4, 12.8, 9.4, 14.4, 10.5);
      ctx.bezierCurveTo(16.1, 11.6, 16.1, 13.5, 16.1, 16.6);
      ctx.stroke();
    },
  },
  {
    id: 'youtube',
    name: 'YouTube',
    isBrand: true,
    draw: (ctx) => {
      ctx.beginPath();
      drawRoundRect(ctx, 2.5, 5.5, 19, 13, 4.5);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(10, 8.8);
      ctx.lineTo(15.5, 12);
      ctx.lineTo(10, 15.2);
      ctx.closePath();
      ctx.fill();
    },
  },
  {
    id: 'x_twitter',
    name: 'X (Twitter)',
    isBrand: true,
    draw: (ctx) => {
      const p = new Path2D(
        'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z'
      );
      ctx.fill(p);
    },
  },
  {
    id: 'facebook',
    name: 'Facebook',
    isBrand: true,
    draw: (ctx) => {
      ctx.beginPath();
      drawRoundRect(ctx, 2.5, 2.5, 19, 19, 4.5);
      ctx.stroke();
      const p = new Path2D(
        'M15.5 8.5h-1.8a2 2 0 0 0-2 2v2H9.5v2.8h2.2v6.2h3v-6.2h2.2l.5-2.8h-2.7V11c0-.5.3-1 .9-1h1.9v-2.5z'
      );
      ctx.fill(p);
    },
  },

  // --------------------------------------------------------------------------
  // ENGAGEMENT ICONS (14)
  // --------------------------------------------------------------------------
  {
    id: 'thumbs_up',
    name: 'Like / Thumbs Up',
    isBrand: false,
    draw: (ctx) => {
      const p = new Path2D(
        'M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3'
      );
      ctx.stroke(p);
    },
  },
  {
    id: 'heart',
    name: 'Heart',
    isBrand: false,
    draw: (ctx) => {
      const p = new Path2D(
        'M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z'
      );
      ctx.stroke(p);
    },
  },
  {
    id: 'comment',
    name: 'Comment / Bubble',
    isBrand: false,
    draw: (ctx) => {
      const p = new Path2D(
        'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z'
      );
      ctx.stroke(p);
    },
  },
  {
    id: 'share',
    name: 'Share',
    isBrand: false,
    draw: (ctx) => {
      ctx.beginPath();
      ctx.arc(18, 5, 2.5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(6, 12, 2.5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(18, 19, 2.5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(8.5, 10.7);
      ctx.lineTo(15.5, 6.3);
      ctx.moveTo(8.5, 13.3);
      ctx.lineTo(15.5, 17.7);
      ctx.stroke();
    },
  },
  {
    id: 'repost',
    name: 'Repost / Reshare',
    isBrand: false,
    draw: (ctx) => {
      const p = new Path2D(
        'm17 2 4 4-4 4 M3 11v-1a4 4 0 0 1 4-4h14 M7 22l-4-4 4-4 M21 13v1a4 4 0 0 1-4 4H3'
      );
      ctx.stroke(p);
    },
  },
  {
    id: 'send',
    name: 'Send / Paper Plane',
    isBrand: false,
    draw: (ctx) => {
      const p = new Path2D('m22 2-7 20-4-9-9-4Z M22 2 11 13');
      ctx.stroke(p);
    },
  },
  {
    id: 'bell',
    name: 'Notification Bell',
    isBrand: false,
    draw: (ctx) => {
      const p = new Path2D(
        'M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9 M10.3 21a1.94 1.94 0 0 0 3.4 0'
      );
      ctx.stroke(p);
    },
  },
  {
    id: 'user',
    name: 'User / Profile',
    isBrand: false,
    draw: (ctx) => {
      const p = new Path2D(
        'M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2 M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z'
      );
      ctx.stroke(p);
    },
  },
  {
    id: 'hashtag',
    name: 'Hashtag',
    isBrand: false,
    draw: (ctx) => {
      const p = new Path2D('M4 9h16 M4 15h16 M10 3 8 21 M16 3l-2 18');
      ctx.stroke(p);
    },
  },
  {
    id: 'play',
    name: 'Play Button',
    isBrand: false,
    draw: (ctx) => {
      ctx.beginPath();
      ctx.arc(12, 12, 9.5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(10, 8.5);
      ctx.lineTo(15.5, 12);
      ctx.lineTo(10, 15.5);
      ctx.closePath();
      ctx.fill();
    },
  },
  {
    id: 'three_dots_bubble',
    name: 'Three-dot Chat Bubble',
    isBrand: false,
    draw: (ctx) => {
      const p = new Path2D(
        'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'
      );
      ctx.stroke(p);
      ctx.beginPath();
      ctx.arc(8, 10, 1.2, 0, Math.PI * 2);
      ctx.arc(12, 10, 1.2, 0, Math.PI * 2);
      ctx.arc(16, 10, 1.2, 0, Math.PI * 2);
      ctx.fill();
    },
  },
  {
    id: 'bookmark',
    name: 'Bookmark / Save',
    isBrand: false,
    draw: (ctx) => {
      const p = new Path2D('m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z');
      ctx.stroke(p);
    },
  },
  {
    id: 'user_plus',
    name: 'Follow / Add User',
    isBrand: false,
    draw: (ctx) => {
      const p = new Path2D(
        'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z M19 8v6 M22 11h-6'
      );
      ctx.stroke(p);
    },
  },
  {
    id: 'link',
    name: 'Link / Chain',
    isBrand: false,
    draw: (ctx) => {
      const p = new Path2D(
        'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71 M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71'
      );
      ctx.stroke(p);
    },
  },
];

// ============================================================================
// PRE-RENDERED OFFSCREEN CANVAS CACHE
// Created once synchronously to avoid any allocation during animation frames
// ============================================================================
type OffscreenCache = HTMLCanvasElement[][];

const createOffscreenCache = (): OffscreenCache => {
  const cache: OffscreenCache = [];
  const baseSize = 64;
  const padding = 6;
  const drawArea = baseSize - padding * 2;
  const scale = drawArea / 24;

  for (let i = 0; i < ICON_DEFINITIONS.length; i++) {
    cache[i] = [];
    const iconDef = ICON_DEFINITIONS[i];

    for (let c = 0; c < MONO_COLORS.length; c++) {
      const color = MONO_COLORS[c];
      const canvas = document.createElement('canvas');
      canvas.width = baseSize;
      canvas.height = baseSize;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        ctx.save();
        ctx.translate(padding, padding);
        ctx.scale(scale, scale);

        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = 1.85;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // For black particles, apply a fine subtle contour so it reads as deep obsidian
        if (color === '#000000') {
          ctx.shadowColor = 'rgba(255, 255, 255, 0.25)';
          ctx.shadowBlur = 1;
        }

        iconDef.draw(ctx, color);
        ctx.restore();
      }

      cache[i][c] = canvas;
    }
  }

  return cache;
};

// ============================================================================
// PARTICLE DATA STRUCTURE
// ============================================================================
interface Particle {
  id: number;
  iconIndex: number;
  colorIndex: number;
  baseSize: number;
  x: number;
  y: number;
  z: number; // 0.2 (closest, larger, crisper) to 1.8 (far away, smaller, soft)
  vx: number;
  vy: number;
  vz: number;
  swayAmpX: number;
  swayFreqX: number;
  swayPhaseX: number;
  swayAmpY: number;
  swayFreqY: number;
  swayPhaseY: number;
  rotZ: number;
  speedRotZ: number;
  tiltAmpX: number;
  tiltFreqX: number;
  tiltPhaseX: number;
  tiltAmpY: number;
  tiltFreqY: number;
  tiltPhaseY: number;
  baseOpacity: number;
  pulseFreq: number;
  pulsePhase: number;
}

// Generate a randomized particle with natural 3D depth and balanced distribution
const createParticle = (
  id: number,
  width: number,
  height: number,
  randomPlacement = true
): Particle => {
  // Ensure balanced distribution between social brands (~35%) and engagement icons (~65%)
  let iconIndex = 0;
  if (Math.random() < 0.35) {
    iconIndex = Math.floor(Math.random() * 5); // 0..4 Social logos
  } else {
    iconIndex = 5 + Math.floor(Math.random() * 14); // 5..18 Engagement icons
  }

  // Color distribution: white & light gray favored for crisp foreground/midground,
  // dark gray & black for depth silhouettes
  const randColor = Math.random();
  let colorIndex = 0;
  if (randColor < 0.32) {
    colorIndex = 0; // #FFFFFF
  } else if (randColor < 0.62) {
    colorIndex = 1; // #D9D9D9
  } else if (randColor < 0.82) {
    colorIndex = 2; // #808080
  } else if (randColor < 0.94) {
    colorIndex = 3; // #404040
  } else {
    colorIndex = 4; // #000000
  }

  const z = 0.25 + Math.random() * 1.5; // Depth range: 0.25 to 1.75
  const baseSize = 22 + Math.random() * 12; // Base size before perspective

  // Velocity: gentle slow drift in different directions (floating in zero-g)
  const vx = (Math.random() - 0.5) * 0.35;
  const vy = -0.08 - Math.random() * 0.28; // Gentle upward/ambient drift
  const vz = (Math.random() - 0.5) * 0.002;

  // Base opacity based on color and depth
  let baseOpacity = 0.22;
  if (colorIndex === 0) baseOpacity = 0.26 + Math.random() * 0.14; // #FFFFFF
  else if (colorIndex === 1) baseOpacity = 0.22 + Math.random() * 0.12; // #D9D9D9
  else if (colorIndex === 2) baseOpacity = 0.18 + Math.random() * 0.10; // #808080
  else if (colorIndex === 3) baseOpacity = 0.14 + Math.random() * 0.08; // #404040
  else baseOpacity = 0.16 + Math.random() * 0.08; // #000000

  return {
    id,
    iconIndex,
    colorIndex,
    baseSize,
    x: randomPlacement ? Math.random() * width : Math.random() * width,
    y: randomPlacement ? Math.random() * height : height + 30 + Math.random() * 40,
    z,
    vx,
    vy,
    vz,
    swayAmpX: 0.6 + Math.random() * 0.8,
    swayFreqX: 0.006 + Math.random() * 0.012,
    swayPhaseX: Math.random() * Math.PI * 2,
    swayAmpY: 0.4 + Math.random() * 0.6,
    swayFreqY: 0.005 + Math.random() * 0.010,
    swayPhaseY: Math.random() * Math.PI * 2,
    rotZ: Math.random() * Math.PI * 2,
    speedRotZ: (Math.random() - 0.5) * 0.008,
    tiltAmpX: 0.2 + Math.random() * 0.25,
    tiltFreqX: 0.005 + Math.random() * 0.009,
    tiltPhaseX: Math.random() * Math.PI * 2,
    tiltAmpY: 0.25 + Math.random() * 0.3,
    tiltFreqY: 0.006 + Math.random() * 0.011,
    tiltPhaseY: Math.random() * Math.PI * 2,
    baseOpacity,
    pulseFreq: 0.008 + Math.random() * 0.015,
    pulsePhase: Math.random() * Math.PI * 2,
  };
};

// ============================================================================
// MAIN COMPONENT: InteractiveBackground
// ============================================================================
export const InteractiveBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [isHovering, setIsHovering] = useState(false);

  // Mouse interaction state refs
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });

  // Responsive particle density calculation
  const getTargetParticleCount = (width: number) => {
    if (width >= 1280) return 110; // Desktop
    if (width >= 768) return 80;   // Laptop / Tablet
    return 48;                     // Mobile
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Pre-render offscreen cache for all 19 icons in 5 monochrome colors
    const offscreenCache = createOffscreenCache();

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles
    const particleCount = getTargetParticleCount(width);
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle(i, width, height, true));
    }

    let animationFrameId: number;
    let time = 0;

    // Respawn helper when particles drift out of screen or depth
    const respawn = (p: Particle) => {
      const edge = Math.random();
      if (edge < 0.6) {
        // Respawn just below bottom
        p.x = Math.random() * width;
        p.y = height + 40;
      } else if (edge < 0.8) {
        // Respawn from right
        p.x = width + 40;
        p.y = Math.random() * height;
      } else {
        // Respawn from left
        p.x = -40;
        p.y = Math.random() * height;
      }

      p.z = 0.35 + Math.random() * 1.4;
      p.vx = (Math.random() - 0.5) * 0.35;
      p.vy = -0.08 - Math.random() * 0.28;
      p.rotZ = Math.random() * Math.PI * 2;
    };

    // ------------------------------------------------------------------------
    // ANIMATION RENDER LOOP (60+ FPS)
    // ------------------------------------------------------------------------
    const render = () => {
      time += 1;

      ctx.clearRect(0, 0, width, height);

      const margin = 80;
      const mouse = mouseRef.current;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // 1. Position update with gentle floating sway
        const swayX = Math.sin(time * p.swayFreqX + p.swayPhaseX) * p.swayAmpX;
        const swayY = Math.cos(time * p.swayFreqY + p.swayPhaseY) * p.swayAmpY;

        // Reduce velocity if user prefers reduced motion
        const speedFactor = prefersReducedMotion ? 0.2 : 1.0;
        p.x += (p.vx + swayX * 0.3) * speedFactor;
        p.y += (p.vy + swayY * 0.2) * speedFactor;
        p.z += p.vz * speedFactor;

        // Subtle gentle cursor repulsion when mouse is near (organic interactive aura)
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const distSq = dx * dx + dy * dy;
          const maxDist = 120;
          if (distSq < maxDist * maxDist && distSq > 1) {
            const dist = Math.sqrt(distSq);
            const force = (1 - dist / maxDist) * 0.65;
            p.x += (dx / dist) * force;
            p.y += (dy / dist) * force;
          }
        }

        // Respawn condition
        if (
          p.x < -60 ||
          p.x > width + 60 ||
          p.y < -60 ||
          p.y > height + 60 ||
          p.z < 0.2 ||
          p.z > 1.85
        ) {
          respawn(p);
          continue;
        }

        // 2. Perspective Projection & Scaling
        // Scale decreases with depth z, creating a true 3D frustum
        const scale = 1.0 / (0.55 + 0.65 * p.z);

        // 3. Natural Edge & Depth Fading
        const fadeX = Math.min(1, Math.max(0, p.x / margin), Math.max(0, (width - p.x) / margin));
        const fadeY = Math.min(1, Math.max(0, p.y / margin), Math.max(0, (height - p.y) / margin));
        const fadeZ = Math.min(
          1,
          Math.max(0, (p.z - 0.2) / 0.15),
          Math.max(0, (1.85 - p.z) / 0.2)
        );

        // Subtle breathing pulse
        const pulse = 0.88 + 0.12 * Math.sin(time * p.pulseFreq + p.pulsePhase);
        const alpha = p.baseOpacity * fadeX * fadeY * fadeZ * pulse;

        if (alpha <= 0.005) continue;

        // 4. 3D Rotation & Perspective Tumbling
        if (!prefersReducedMotion) {
          p.rotZ += p.speedRotZ;
        }

        const currentRotX = prefersReducedMotion
          ? 0
          : Math.sin(time * p.tiltFreqX + p.tiltPhaseX) * p.tiltAmpX;
        const currentRotY = prefersReducedMotion
          ? 0
          : Math.cos(time * p.tiltFreqY + p.tiltPhaseY) * p.tiltAmpY;

        // Perspective foreshortening based on 3D rotation
        const stretchX = Math.cos(currentRotY) * scale;
        const stretchY = Math.cos(currentRotX) * scale;

        // 5. Hardware-Accelerated Draw using Cached Offscreen Canvas
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotZ);
        ctx.scale(stretchX, stretchY);
        ctx.globalAlpha = Math.max(0, Math.min(1, alpha));

        const cachedImg = offscreenCache[p.iconIndex]?.[p.colorIndex];
        if (cachedImg) {
          ctx.drawImage(
            cachedImg,
            -p.baseSize / 2,
            -p.baseSize / 2,
            p.baseSize,
            p.baseSize
          );
        }

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  // Mouse movement listener for interactive aura & cursor follower
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      mouseRef.current = { x: e.clientX, y: e.clientY, active: true };
      if (!isHovering) setIsHovering(true);
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
      mouseRef.current.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isHovering]);

  return (
    <>
      {/* 
        ============================================================
        3D FLOATING MONOCHROME SOCIAL MEDIA PARTICLE CANVAS
        Placed strictly behind content (z-0), pointer-events: none
        ============================================================
      */}
      <div className="fixed inset-0 pointer-events-none select-none z-0 overflow-hidden">
        {/* Subtle Ambient Base Gradient Mesh (Deep Midnight #0B0F17) */}
        <div className="absolute inset-0 bg-[#0B0F17]" />

        {/* Soft Ambient Radial Glows (subtle backdrop illumination) */}
        <div className="absolute -top-32 left-1/4 w-[500px] h-[500px] rounded-full bg-[#1685FF]/8 blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 -right-32 w-[550px] h-[550px] rounded-full bg-[#833AB4]/6 blur-[150px] pointer-events-none" />
        <div className="absolute bottom-20 left-10 w-[500px] h-[500px] rounded-full bg-[#0077B5]/6 blur-[140px] pointer-events-none" />

        {/* Full-Viewport 3D Particle Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />

        {/* Minimal Vignette for readable content contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F17]/30 via-transparent to-[#0B0F17]/70 pointer-events-none" />
      </div>

      {/* 
        ============================================================
        DYNAMIC CURSOR SPOTLIGHT FOLLOWER
        Casts a subtle responsive aura where the cursor points
        ============================================================
      */}
      <div
        className="pointer-events-none fixed inset-0 z-10 transition-opacity duration-300"
        style={{
          opacity: isHovering ? 1 : 0,
          background: `
            radial-gradient(650px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255, 255, 255, 0.04), rgba(22, 133, 255, 0.03), transparent 60%),
            radial-gradient(280px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255, 255, 255, 0.05), transparent 70%)
          `,
        }}
      />
    </>
  );
};

export default InteractiveBackground;
