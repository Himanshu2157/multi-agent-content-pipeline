import React, { useState, useEffect } from 'react';

export const InteractiveBackground: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      if (!isHovering) setIsHovering(true);
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
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
        FULL-PAGE CONTINUOUS AMBIENT GRADIENT CANVAS
        ============================================================
      */}
      <div className="fixed inset-0 pointer-events-none select-none z-0 overflow-hidden">
        {/* Layer A: Full-Canvas Cybernetic Background Image */}
        <img
          src="/hero-bg.jpg"
          alt="ContentSmith Ambient Background"
          className="w-full h-full object-cover object-center opacity-20 scale-105"
        />

        {/* Layer B: Cyber Wireframe Lattice Pattern */}
        <div className="absolute inset-0 bg-cyber-grid opacity-30" />

        {/* Layer C: Continuous Ambient Gradient Mesh */}
        {/* Top Radial Glow (Electric Blue) */}
        <div className="absolute -top-32 left-1/4 w-[600px] h-[600px] rounded-full bg-[#1685FF]/18 blur-[130px] animate-float-1" />

        {/* Right Mid Radial Glow (Magenta / Pink) */}
        <div className="absolute top-1/3 -right-32 w-[650px] h-[650px] rounded-full bg-[#E1306C]/14 blur-[140px] animate-float-2" />

        {/* Center Purple Radial Glow */}
        <div className="absolute top-1/2 left-1/3 w-[550px] h-[550px] rounded-full bg-[#833AB4]/12 blur-[120px] animate-float-3" />

        {/* Bottom Radial Glow (Cyan / Electric Blue) */}
        <div className="absolute bottom-20 left-10 w-[600px] h-[600px] rounded-full bg-[#0077B5]/16 blur-[130px] animate-float-1" />

        {/* Bottom-Right Sunset Warmth Glow */}
        <div className="absolute -bottom-20 right-10 w-[500px] h-[500px] rounded-full bg-[#F77737]/10 blur-[130px] animate-float-2" />

        {/* Base Dark Vignette Layer */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F17]/60 via-[#0B0F17]/85 to-[#0B0F17]/95" />
      </div>

      {/* 
        ============================================================
        DYNAMIC CURSOR SPOTLIGHT FOLLOWER
        ============================================================
        Casts a responsive aura wherever the user points their mouse
      */}
      <div
        className="pointer-events-none fixed inset-0 z-10 transition-opacity duration-300"
        style={{
          opacity: isHovering ? 1 : 0,
          background: `
            radial-gradient(750px circle at ${mousePos.x}px ${mousePos.y}px, rgba(22, 133, 255, 0.14), rgba(131, 58, 180, 0.08), rgba(225, 48, 108, 0.04), transparent 65%),
            radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, rgba(22, 133, 255, 0.18), transparent 70%)
          `,
        }}
      />
    </>
  );
};
