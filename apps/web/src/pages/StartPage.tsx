import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ArrowDown,
  Search,
  PenTool,
  Repeat,
  CheckCircle2,
  Video,
  Sliders,
  Layers,
  Database,
  Cpu,
  Zap,
} from 'lucide-react';
import { LinkedInIcon } from '../components/icons.js';
import { RevealOnScroll } from '../components/RevealOnScroll.js';

export const StartPage: React.FC = () => {
  // Interactive Cursor Position Tracking for Background Effects
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
    <div className="relative min-h-screen bg-[#0B0F17] text-[#F5F7FA] overflow-x-hidden selection:bg-[#1685FF]/30 selection:text-[#1685FF]">
      {/* 
        ============================================================
        1. FULL-PAGE CONTINUOUS AMBIENT GRADIENT & VISUAL SYSTEM
        ============================================================
        Applies across the entire Home Page from top to bottom
      */}
      <div className="fixed inset-0 pointer-events-none select-none z-0 overflow-hidden">
        {/* Layer A: Full-Canvas Cybernetic Background Image with Smooth Masking */}
        <img
          src="/hero-bg.jpg"
          alt="ContentSmith Ambient Background"
          className="w-full h-full object-cover object-center opacity-20 scale-105"
        />

        {/* Layer B: Cyber Wireframe Lattice Pattern */}
        <div className="absolute inset-0 bg-cyber-grid opacity-30" />

        {/* Layer C: Continuous Ambient Gradient Mesh (Whole Page) */}
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
        2. DYNAMIC CURSOR SPOTLIGHT FOLLOWER
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

      {/* Content wrapper sitting cleanly above the ambient and cursor canvas */}
      <div className="relative z-20">
        {/* ============================================================
            HERO SECTION
            ============================================================ */}
        <section className="relative pt-16 pb-24 md:pt-28 md:pb-36 px-4 sm:px-6 lg:px-8 border-b border-[#202C3D]/60">
          <div className="max-w-5xl mx-auto text-center">
            {/* Eyebrow Tagline with Scroll Reveal */}
            <RevealOnScroll direction="down" delay={50}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#111A27]/90 border border-[#202C3D] text-xs font-semibold text-[#1685FF] shadow-sm backdrop-blur-md mb-6 hover:border-[#1685FF]/50 transition-colors">
                <Sparkles className="w-3.5 h-3.5 text-[#1685FF]" />
                <span>Autonomous Multi-Agent Content Pipeline</span>
              </div>
            </RevealOnScroll>

            {/* Main Title with Scroll Reveal */}
            <RevealOnScroll direction="up" delay={150}>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.12]">
                High-Impact Content Built with{' '}
                <span className="spectrum-gradient-text">Autonomous Multi-Agent</span>{' '}
                Precision
              </h1>
            </RevealOnScroll>

            {/* Description with Scroll Reveal */}
            <RevealOnScroll direction="up" delay={250}>
              <p className="text-base sm:text-xl text-[#AAB4C5] max-w-3xl mx-auto leading-relaxed mb-10">
                Content<span className="spectrum-gradient-text font-bold">Smith</span> deploys a specialized trio of Research, Writer, and Critic agents that verify real-world facts, enforce strict topic fidelity, and autonomously iterate until quality is guaranteed.
              </p>
            </RevealOnScroll>

            {/* Primary & Secondary Call to Actions with Scroll Reveal */}
            <RevealOnScroll direction="up" delay={350}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/create"
                  className="w-full sm:w-auto spectrum-gradient-btn px-8 py-4 rounded-xl text-base font-bold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all flex items-center justify-center gap-3 cursor-pointer group hover:scale-[1.02]"
                >
                  <Sliders className="w-5 h-5" />
                  <span>Configure Content Generation</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                </Link>

                <a
                  href="#flowchart"
                  className="w-full sm:w-auto px-6 py-4 rounded-xl text-sm font-semibold bg-[#111A27]/80 hover:bg-[#151F2E] text-[#D2D8E2] hover:text-white border border-[#202C3D] hover:border-[#35445A] transition-all backdrop-blur-md flex items-center justify-center gap-2"
                >
                  <span>Explore Agent Flowchart</span>
                  <ArrowDown className="w-4 h-4 text-[#1685FF]" />
                </a>
              </div>
            </RevealOnScroll>

            {/* Core Guarantees Chips with Scroll Reveal */}
            <RevealOnScroll direction="up" delay={450}>
              <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-xs text-[#7F8BA0]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Zero Fabricated Citations</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#1685FF]" />
                  <span>Adversarial Critic Verification</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#E1306C]" />
                  <span>LinkedIn & Instagram Reel Ready</span>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </section>

        {/* ============================================================
            PROJECT OVERVIEW: WHY CONTENTSMITH?
            ============================================================ */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 border-b border-[#202C3D]/60 backdrop-blur-[2px]">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <RevealOnScroll direction="up">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#1685FF] mb-2">
                  THE AUTONOMOUS ADVANTAGE
                </h2>
                <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
                  Why Single-Prompt AI Fails & How Multi-Agent Teams Win
                </h3>
                <p className="text-sm sm:text-base text-[#AAB4C5] mt-3 leading-relaxed">
                  Standard LLMs suffer from prompt fatigue, superficial advice, and hallucinated URLs. ContentSmith solves this through true specialization and separation of concerns.
                </p>
              </div>
            </RevealOnScroll>

            {/* Feature Cards Grid with Staggered Scroll Reveal */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <RevealOnScroll direction="up" delay={100}>
                <div className="h-full p-7 rounded-2xl bg-[#111A27]/80 backdrop-blur-md border border-[#202C3D] hover:border-[#1685FF]/50 shadow-card hover:shadow-card-hover transition-all duration-300 group hover:-translate-y-1">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#0077B5] to-[#1685FF] p-[1.5px] mb-5 shadow-md shadow-blue-500/10 group-hover:scale-110 transition-transform">
                    <div className="w-full h-full bg-[#0B0F17] rounded-[10px] flex items-center justify-center">
                      <Database className="w-6 h-6 text-[#1685FF]" />
                    </div>
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2 group-hover:text-[#1685FF] transition-colors">
                    Ground-Truth Fact Verification
                  </h4>
                  <p className="text-xs text-[#7F8BA0] leading-relaxed">
                    Before writing a single word, the Research Agent gathers real statistics, scientific mechanisms, and external publications. No phantom URLs or invented studies.
                  </p>
                </div>
              </RevealOnScroll>

              {/* Feature 2 */}
              <RevealOnScroll direction="up" delay={200}>
                <div className="h-full p-7 rounded-2xl bg-[#111A27]/80 backdrop-blur-md border border-[#202C3D] hover:border-[#E1306C]/50 shadow-card hover:shadow-card-hover transition-all duration-300 group hover:-translate-y-1">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#833AB4] to-[#E1306C] p-[1.5px] mb-5 shadow-md shadow-pink-500/10 group-hover:scale-110 transition-transform">
                    <div className="w-full h-full bg-[#0B0F17] rounded-[10px] flex items-center justify-center">
                      <Cpu className="w-6 h-6 text-[#E1306C]" />
                    </div>
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2 group-hover:text-[#E1306C] transition-colors">
                    Adversarial Critic Loop
                  </h4>
                  <p className="text-xs text-[#7F8BA0] leading-relaxed">
                    A dedicated Critic Agent rigorously reviews the content against 6 strict rubrics. Flawed hooks, generic filler, or unsupported assertions are rejected back to the Writer.
                  </p>
                </div>
              </RevealOnScroll>

              {/* Feature 3 */}
              <RevealOnScroll direction="up" delay={300}>
                <div className="h-full p-7 rounded-2xl bg-[#111A27]/80 backdrop-blur-md border border-[#202C3D] hover:border-[#F77737]/50 shadow-card hover:shadow-card-hover transition-all duration-300 group hover:-translate-y-1">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#E1306C] to-[#F77737] p-[1.5px] mb-5 shadow-md shadow-orange-500/10 group-hover:scale-110 transition-transform">
                    <div className="w-full h-full bg-[#0B0F17] rounded-[10px] flex items-center justify-center">
                      <Zap className="w-6 h-6 text-[#F77737]" />
                    </div>
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2 group-hover:text-[#F77737] transition-colors">
                    Platform-Native Formats
                  </h4>
                  <p className="text-xs text-[#7F8BA0] leading-relaxed">
                    Generates 5 distinct angles for LinkedIn (contrarian, tactical, framework, case-study, teardown) or timed, recordable scene scripts with B-roll directions for Instagram Reels.
                  </p>
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </section>

        {/* ============================================================
            AGENT FLOWCHART ARCHITECTURE SECTION
            ============================================================ */}
        <section id="flowchart" className="py-28 px-4 sm:px-6 lg:px-8 border-b border-[#202C3D]/60 backdrop-blur-[2px]">
          <div className="max-w-6xl mx-auto">
            {/* Flowchart Header */}
            <RevealOnScroll direction="up">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111A27] border border-[#202C3D] text-[11px] font-bold uppercase tracking-wider text-[#1685FF] mb-3">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Multi-Agent State Machine</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                  Autonomous Agent Lifecycle Flowchart
                </h2>
                <p className="text-sm sm:text-base text-[#AAB4C5] mt-3 leading-relaxed">
                  Each topic progresses through a deterministic graph of autonomous specialized agents. Review the flowchart below to see how inputs are transformed into verified content.
                </p>
              </div>
            </RevealOnScroll>

            {/* Visual Flowchart Diagram */}
            <div className="space-y-6">
              {/* Step 1 & 2 Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                {/* Node 1: Topic Ingestion & Intent Analyzer */}
                <RevealOnScroll direction="left" delay={100}>
                  <div className="h-full p-6 rounded-2xl bg-[#111A27]/85 backdrop-blur-md border border-[#202C3D] hover:border-[#1685FF]/50 shadow-card hover:shadow-card-hover transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0077B5] to-[#1685FF] p-[1.5px] shadow-sm shadow-blue-500/10">
                          <div className="w-full h-full bg-[#0B0F17] rounded-[10px] flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-[#1685FF]" />
                          </div>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#1685FF]">Step 1 &bull; Ingestion</span>
                          <h4 className="text-base font-bold text-white">Topic Analyzer Agent</h4>
                        </div>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#151F2E] text-[#D2D8E2] border border-[#202C3D]">
                        guardrails.lock()
                      </span>
                    </div>
                    <p className="text-xs text-[#AAB4C5] leading-relaxed mb-3">
                      Deconstructs the user's thesis, extracts key semantic entities, and locks anti-hallucination guardrails to prevent topic drift.
                    </p>
                    <div className="p-2.5 rounded-xl bg-[#0B0F17]/90 border border-[#202C3D] text-[11px] text-[#7F8BA0] font-mono">
                      Input: Thesis string &rarr; Output: Domain boundaries & key entities
                    </div>
                  </div>
                </RevealOnScroll>

                {/* Node 2: Research Agent */}
                <RevealOnScroll direction="right" delay={200}>
                  <div className="h-full p-6 rounded-2xl bg-[#111A27]/85 backdrop-blur-md border border-[#202C3D] hover:border-[#1685FF]/50 shadow-card hover:shadow-card-hover transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0077B5] to-[#1685FF] p-[1.5px] shadow-sm shadow-blue-500/10">
                          <div className="w-full h-full bg-[#0B0F17] rounded-[10px] flex items-center justify-center">
                            <Search className="w-5 h-5 text-[#1685FF]" />
                          </div>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#1685FF]">Step 2 &bull; Grounding</span>
                          <h4 className="text-base font-bold text-white">Deep-Ground Research Agent</h4>
                        </div>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#151F2E] text-emerald-400 border border-[#202C3D]">
                        citations.verify()
                      </span>
                    </div>
                    <p className="text-xs text-[#AAB4C5] leading-relaxed mb-3">
                      Scrapes and evaluates real external documentation, papers, and data points. Extracts verified facts and statistical evidence.
                    </p>
                    <div className="p-2.5 rounded-xl bg-[#0B0F17]/90 border border-[#202C3D] text-[11px] text-[#7F8BA0] font-mono">
                      Input: Entity query &rarr; Output: 3+ verified facts & publisher URLs
                    </div>
                  </div>
                </RevealOnScroll>
              </div>

              {/* Connecting Flow Indicator with Scroll Reveal */}
              <RevealOnScroll direction="up" delay={100}>
                <div className="flex items-center justify-center py-1">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#1685FF] bg-[#111A27]/90 border border-[#202C3D] px-4 py-1.5 rounded-full shadow-sm backdrop-blur-md">
                    <ArrowDown className="w-4 h-4 text-[#1685FF] animate-bounce" />
                    <span>STATE DISPATCH &bull; GROUNDED CONTEXT FORWARDED</span>
                  </div>
                </div>
              </RevealOnScroll>

              {/* Step 3 & 4 Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                {/* Node 3: Content Strategist */}
                <RevealOnScroll direction="left" delay={150}>
                  <div className="h-full p-6 rounded-2xl bg-[#111A27]/85 backdrop-blur-md border border-[#202C3D] hover:border-[#B845C8]/50 shadow-card hover:shadow-card-hover transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#5B51D8] to-[#833AB4] p-[1.5px] shadow-sm shadow-purple-500/10">
                          <div className="w-full h-full bg-[#0B0F17] rounded-[10px] flex items-center justify-center">
                            <Layers className="w-5 h-5 text-[#B845C8]" />
                          </div>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#B845C8]">Step 3 &bull; Strategy</span>
                          <h4 className="text-base font-bold text-white">Content Strategist Agent</h4>
                        </div>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#151F2E] text-purple-300 border border-[#202C3D]">
                        angles.plan()
                      </span>
                    </div>
                    <p className="text-xs text-[#AAB4C5] leading-relaxed mb-3">
                      Formulates 5 distinct hook angles (for LinkedIn) or narrative tension arcs with timestamps (for Instagram Reels) to maximize retention.
                    </p>
                    <div className="p-2.5 rounded-xl bg-[#0B0F17]/90 border border-[#202C3D] text-[11px] text-[#7F8BA0] font-mono">
                      Input: Verified facts &rarr; Output: 5 angle blueprints / scene storyboard
                    </div>
                  </div>
                </RevealOnScroll>

                {/* Node 4: Platform Writer Agent */}
                <RevealOnScroll direction="right" delay={250}>
                  <div className="h-full p-6 rounded-2xl bg-[#111A27]/85 backdrop-blur-md border border-[#202C3D] hover:border-[#E1306C]/50 shadow-card hover:shadow-card-hover transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#833AB4] to-[#E1306C] p-[1.5px] shadow-sm shadow-pink-500/10">
                          <div className="w-full h-full bg-[#0B0F17] rounded-[10px] flex items-center justify-center">
                            <PenTool className="w-5 h-5 text-[#E1306C]" />
                          </div>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#E1306C]">Step 4 &bull; Synthesis</span>
                          <h4 className="text-base font-bold text-white">Platform Writer Agent</h4>
                        </div>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#151F2E] text-pink-300 border border-[#202C3D]">
                        draft.generate()
                      </span>
                    </div>
                    <p className="text-xs text-[#AAB4C5] leading-relaxed mb-3">
                      Synthesizes high-density, authoritative copy grounded strictly in research facts. Formats hooks, readable body structures, and engaging CTAs.
                    </p>
                    <div className="p-2.5 rounded-xl bg-[#0B0F17]/90 border border-[#202C3D] text-[11px] text-[#7F8BA0] font-mono">
                      Input: Angle blueprints &rarr; Output: Full draft iteration
                    </div>
                  </div>
                </RevealOnScroll>
              </div>

              {/* Connecting Flow: The Adversarial Quality Loop */}
              <RevealOnScroll direction="up" delay={200}>
                <div className="p-6 rounded-2xl bg-gradient-to-r from-[#111A27]/90 via-[#151F2E]/90 to-[#111A27]/90 backdrop-blur-md border border-[#202C3D] shadow-card hover:border-[#F77737]/50 transition-all duration-300 relative overflow-hidden">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#E1306C] to-[#F77737] p-[1.5px] shrink-0 shadow-sm shadow-orange-500/10">
                        <div className="w-full h-full bg-[#0B0F17] rounded-[10px] flex items-center justify-center">
                          <Repeat className="w-6 h-6 text-[#F77737]" />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#F77737]">Step 5 &bull; Quality Verification & Loop</span>
                          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-bold">
                            Score Threshold: 90/100
                          </span>
                        </div>
                        <h4 className="text-lg font-bold text-white">Adversarial Critic & Autonomous Self-Correction Loop</h4>
                        <p className="text-xs text-[#AAB4C5] mt-1 leading-relaxed max-w-2xl">
                          The Critic Agent scores the draft across 6 metrics (Topic Fidelity, Tone Match, Factual Accuracy, Platform Fit, Usefulness, Clarity). If any claim lacks factual backing, the Critic <strong>rejects</strong> the draft and routes specific revision instructions back to the Writer Agent.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0">
                      <div className="px-3.5 py-2 rounded-xl bg-[#0B0F17]/90 border border-[#202C3D] text-xs flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span className="text-[#D2D8E2]">If Approved: <strong>Deploy Deliverable</strong></span>
                      </div>
                      <div className="px-3.5 py-2 rounded-xl bg-[#0B0F17]/90 border border-[#202C3D] text-xs flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-400" />
                        <span className="text-[#D2D8E2]">If Rejected: <strong>Loop to Writer (Iterate)</strong></span>
                      </div>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </section>

        {/* ============================================================
            PLATFORM DELIVERABLES SHOWCASE
            ============================================================ */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 border-b border-[#202C3D]/60 backdrop-blur-[2px]">
          <div className="max-w-6xl mx-auto">
            {/* Deliverables Header */}
            <RevealOnScroll direction="up">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#1685FF] mb-2">
                  OUTPUT FORMATS
                </h2>
                <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
                  Engineered for Distribution & Engagement
                </h3>
                <p className="text-sm sm:text-base text-[#AAB4C5] mt-3 leading-relaxed">
                  Choose your target platform. ContentSmith generates production-ready deliverables formatted for immediate copy-pasting or recording.
                </p>
              </div>
            </RevealOnScroll>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* LinkedIn Showcase */}
              <RevealOnScroll direction="up" delay={100}>
                <div className="h-full p-8 rounded-2xl bg-[#111A27]/85 backdrop-blur-md border border-[#202C3D] hover:border-[#0077B5]/60 shadow-card hover:shadow-card-hover transition-all duration-300">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-[#0077B5] text-white flex items-center justify-center shadow-md">
                      <LinkedInIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white">LinkedIn Authority Post Pack</h4>
                      <p className="text-xs text-[#7F8BA0]">5 Multi-Angle Posts &bull; Grounded Citations</p>
                    </div>
                  </div>

                  <ul className="space-y-3 text-xs text-[#D2D8E2] mb-6">
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#1685FF] shrink-0 mt-0.5" />
                      <span><strong>5 Distinct Angles:</strong> Contrarian take, tactical deep-dive, industry case study, structured framework, and lessons learned.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#1685FF] shrink-0 mt-0.5" />
                      <span><strong>Scroll-Stopping Hooks:</strong> Tested line-by-line by the Critic to eliminate generic intros.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#1685FF] shrink-0 mt-0.5" />
                      <span><strong>1-Click Copy All:</strong> Instant clipboard export for scheduling in Buffer, Taplio, or LinkedIn Native.</span>
                    </li>
                  </ul>

                  <div className="p-3.5 rounded-xl bg-[#0B0F17]/90 border border-[#202C3D] text-[11px] text-[#7F8BA0] flex items-center justify-between">
                    <span>Output Guarantee:</span>
                    <span className="font-semibold text-white">0% Generic Regurgitation</span>
                  </div>
                </div>
              </RevealOnScroll>

              {/* Instagram Reel Showcase */}
              <RevealOnScroll direction="up" delay={200}>
                <div className="h-full p-8 rounded-2xl bg-[#111A27]/85 backdrop-blur-md border border-[#202C3D] hover:border-[#E1306C]/60 shadow-card hover:shadow-card-hover transition-all duration-300">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#833AB4] via-[#E1306C] to-[#F77737] text-white flex items-center justify-center shadow-md">
                      <Video className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white">Instagram Reel Production Script</h4>
                      <p className="text-xs text-[#7F8BA0]">Scene-by-Scene Visuals &bull; Timed Voiceovers</p>
                    </div>
                  </div>

                  <ul className="space-y-3 text-xs text-[#D2D8E2] mb-6">
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#E1306C] shrink-0 mt-0.5" />
                      <span><strong>Recordable Scene Breakdown:</strong> Exact timestamps (0–5s hook, 5–25s core, 25–45s proof, 45–60s CTA).</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#E1306C] shrink-0 mt-0.5" />
                      <span><strong>Camera & B-Roll Direction:</strong> Recommended visual framing, gestures, screen recordings, and transitions.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#E1306C] shrink-0 mt-0.5" />
                      <span><strong>On-Screen Text Badges:</strong> High-impact subtitles to retain viewers watching on mute.</span>
                    </li>
                  </ul>

                  <div className="p-3.5 rounded-xl bg-[#0B0F17]/90 border border-[#202C3D] text-[11px] text-[#7F8BA0] flex items-center justify-between">
                    <span>Output Guarantee:</span>
                    <span className="font-semibold text-white">Calculated Spoken Word Pace (~130wpm)</span>
                  </div>
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </section>

        {/* ============================================================
            BOTTOM CTA BANNER
            ============================================================ */}
        <section className="py-24 px-4 sm:px-6 lg:px-8">
          <RevealOnScroll direction="up">
            <div className="max-w-4xl mx-auto text-center p-10 sm:p-14 rounded-3xl bg-[#111A27]/90 backdrop-blur-md border border-[#202C3D] shadow-2xl relative overflow-hidden group hover:border-[#1685FF]/40 transition-colors">
              {/* Subtle Glowing Radial Accents */}
              <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#1685FF]/15 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-[#E1306C]/15 rounded-full blur-3xl pointer-events-none" />

              <h3 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
                Ready to Forge Authoritative Content?
              </h3>
              <p className="text-sm sm:text-base text-[#AAB4C5] max-w-xl mx-auto mb-8 leading-relaxed">
                Specify your topic, select your platform, and let Content<span className="spectrum-gradient-text font-bold">Smith</span>'s autonomous agents execute the research and synthesis.
              </p>

              <Link
                to="/create"
                className="inline-flex items-center gap-3 spectrum-gradient-btn px-8 py-4 rounded-xl text-base font-bold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all cursor-pointer group hover:scale-[1.02]"
              >
                <Sparkles className="w-5 h-5" />
                <span>Configure Content Generation</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
              </Link>
            </div>
          </RevealOnScroll>
        </section>
      </div>
    </div>
  );
};
