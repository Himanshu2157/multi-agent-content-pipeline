import React, { useRef, useEffect } from 'react';
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
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { LinkedInIcon } from '../components/icons.js';
import { RevealOnScroll } from '../components/RevealOnScroll.js';
import { DotField, type DotFieldHandle } from '@/components/ui/dot-field';
import { ScatteredHeading } from '@/components/ui/scattered-heading';

export const StartPage: React.FC = () => {
  const dotFieldRef = useRef<DotFieldHandle>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="relative min-h-screen text-[#F5F7FA] overflow-x-hidden">
      {/* Content wrapper sitting cleanly above the ambient and cursor canvas */}
      <div className="relative z-20">
        {/* ============================================================
            HERO SECTION: INTERACTIVE CANVAS DOT FIELD
            Pure, unhindered headline with 3D flocking and scattering
            ============================================================ */}
        <DotField
          ref={dotFieldRef}
          headline="Autonomous Content Built with Precision."
          accent="#1685FF"
          fontFamily="Geist, Plus Jakarta Sans, system-ui, sans-serif"
          fontWeight={600}
          repelRadius={120}
          scrollScatter={true}
          scrollHint={false}
        />

        {/* ============================================================
            TRANSITION SECTION: SHIFTED DOWN FROM HERO
            Appears smoothly with scroll animation after scattering
            ============================================================ */}
        <section className="min-h-[85vh] flex flex-col justify-center py-32 md:py-48 px-4 sm:px-6 lg:px-8 border-b border-[#202C3D]/60 relative backdrop-blur-[2px]">
          <div className="max-w-4xl mx-auto text-center">
            <RevealOnScroll direction="up" delay={50}>
              <p className="text-xl sm:text-2xl md:text-3xl font-medium text-[#D2D8E2] leading-relaxed tracking-tight">
                Content<span className="spectrum-gradient-text font-bold">Smith</span> deploys a specialized trio of{' '}
                <span className="text-white font-semibold underline decoration-[#1685FF]/50 decoration-2 underline-offset-4">Research</span>,{' '}
                <span className="text-white font-semibold underline decoration-[#B845C8]/50 decoration-2 underline-offset-4">Writer</span>, and{' '}
                <span className="text-white font-semibold underline decoration-[#E1306C]/50 decoration-2 underline-offset-4">Critic</span> agents{' '}
                that verify real-world facts, enforce strict topic fidelity, and autonomously iterate until quality is guaranteed.
              </p>
            </RevealOnScroll>

            <RevealOnScroll direction="up" delay={200}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
                <Link
                  to="/create"
                  className="w-full sm:w-auto spectrum-gradient-btn px-8 py-4 rounded-full text-sm sm:text-base font-bold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all flex items-center justify-center gap-3 cursor-pointer group hover:scale-[1.02]"
                >
                  <Sliders className="w-4.5 h-4.5" />
                  <span>Configure Content Generation</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </Link>

                <a
                  href="#flowchart"
                  className="w-full sm:w-auto px-6 py-4 rounded-full text-sm font-semibold bg-[#111A27]/85 hover:bg-[#151F2E] text-[#D2D8E2] hover:text-white border border-[#202C3D] hover:border-[#35445A] transition-all backdrop-blur-md flex items-center justify-center gap-2"
                >
                  <span>Explore Agent Flowchart</span>
                  <ArrowDown className="w-4 h-4 text-[#1685FF]" />
                </a>
              </div>
            </RevealOnScroll>

            <RevealOnScroll direction="up" delay={300}>
              <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-xs text-[#7F8BA0]">
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
                  <span>LinkedIn &amp; Instagram Reel Ready</span>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </section>

        {/* ============================================================
            PROJECT OVERVIEW: WHY CONTENTSMITH?
            ============================================================ */}
        <section className="py-36 md:py-52 px-4 sm:px-6 lg:px-8 border-b border-[#202C3D]/60 backdrop-blur-[2px]">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="text-center max-w-3xl mx-auto mb-16">
              <RevealOnScroll direction="up">
                <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#1685FF] mb-2">
                  THE AUTONOMOUS ADVANTAGE
                </h2>
              </RevealOnScroll>
              <ScatteredHeading
                text="Why Single-Prompt AI Fails & How Multi-Agent Teams Win"
                as="h3"
                accent="#1685FF"
              />
              <RevealOnScroll direction="up" delay={80}>
                <p className="text-sm sm:text-base text-[#AAB4C5] mt-3 leading-relaxed">
                  Standard LLMs suffer from prompt fatigue, superficial advice, and hallucinated URLs. ContentSmith solves this through true specialization and separation of concerns.
                </p>
              </RevealOnScroll>
            </div>

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
        <section id="flowchart" className="py-36 md:py-52 px-4 sm:px-6 lg:px-8 border-b border-[#202C3D]/60 backdrop-blur-[2px]">
          <div className="max-w-6xl mx-auto">
            {/* Flowchart Header */}
            <div className="text-center max-w-3xl mx-auto mb-16">
              <RevealOnScroll direction="up">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111A27] border border-[#202C3D] text-[11px] font-bold uppercase tracking-wider text-[#1685FF] mb-3">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Multi-Agent State Machine</span>
                </div>
              </RevealOnScroll>
              <ScatteredHeading
                text="Autonomous Agent Lifecycle Flowchart"
                as="h2"
                accent="#1685FF"
              />
              <RevealOnScroll direction="up" delay={80}>
                <p className="text-sm sm:text-base text-[#AAB4C5] mt-3 leading-relaxed">
                  Each topic progresses through a deterministic graph of autonomous specialized agents. Follow the state transitions below from semantic ingestion to the adversarial quality loop.
                </p>

                {/* State Machine Stage Progress Track */}
                <div className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs text-[#7F8BA0] font-mono">
                  <span className="px-3 py-1 rounded-full bg-[#111A27] border border-[#1685FF]/40 text-[#1685FF] font-semibold">
                    1. Ingestion
                  </span>
                  <span className="text-[#35445A] font-bold">&rarr;</span>
                  <span className="px-3 py-1 rounded-full bg-[#111A27] border border-[#1685FF]/40 text-[#1685FF] font-semibold">
                    2. Grounding
                  </span>
                  <span className="text-[#35445A] font-bold">&rarr;</span>
                  <span className="px-3 py-1 rounded-full bg-[#111A27] border border-[#B845C8]/40 text-[#B845C8] font-semibold">
                    3. Strategy
                  </span>
                  <span className="text-[#35445A] font-bold">&rarr;</span>
                  <span className="px-3 py-1 rounded-full bg-[#111A27] border border-[#E1306C]/40 text-[#E1306C] font-semibold">
                    4. Synthesis
                  </span>
                  <span className="text-[#35445A] font-bold">&rarr;</span>
                  <span className="px-3 py-1 rounded-full bg-[#111A27] border border-[#F77737]/40 text-[#F77737] font-semibold">
                    5. Critic &amp; Refine Loop
                  </span>
                </div>
              </RevealOnScroll>
            </div>

            {/* ============================================================
                PHASE 1: GROUND-TRUTH INTELLIGENCE & STRATEGY (STEPS 1, 2, 3)
                ============================================================ */}
            <div className="space-y-6">
              {/* Section Header */}
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1685FF] animate-pulse" />
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#1685FF]">
                  PHASE 1 &bull; GROUND-TRUTH INTELLIGENCE &amp; STRATEGY
                </h3>
              </div>

              {/* 3 Connected Nodes Grid on Desktop */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
                {/* Node 1: Topic Analyzer Agent */}
                <RevealOnScroll direction="up" delay={100}>
                  <div className="h-full p-6 rounded-2xl bg-[#111A27]/85 backdrop-blur-md border border-[#202C3D] hover:border-[#1685FF]/60 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between group">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0077B5] to-[#1685FF] p-[1.5px] shadow-sm shadow-blue-500/10 group-hover:scale-105 transition-transform">
                            <div className="w-full h-full bg-[#0B0F17] rounded-[10px] flex items-center justify-center">
                              <Sparkles className="w-5 h-5 text-[#1685FF]" />
                            </div>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#1685FF]">Step 01 &bull; Ingestion</span>
                            <h4 className="text-base font-bold text-white">Topic Analyzer Agent</h4>
                          </div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#151F2E] text-[#1685FF] border border-[#202C3D]">
                          guardrails.lock()
                        </span>
                      </div>

                      <p className="text-xs text-[#AAB4C5] leading-relaxed mb-4">
                        Deconstructs the user thesis, extracts core semantic entities, and establishes anti-hallucination domain boundaries to prevent topic drift.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-[#0B0F17]/90 border border-[#202C3D] text-[11px] font-mono space-y-1">
                      <div className="text-[#7F8BA0] flex items-center gap-1.5">
                        <span className="text-[#1685FF] font-bold">IN:</span>
                        <span className="truncate">Raw User Thesis String</span>
                      </div>
                      <div className="text-[#D2D8E2] flex items-center gap-1.5">
                        <span className="text-emerald-400 font-bold">OUT:</span>
                        <span className="truncate">Semantic Guardrails &amp; Entities</span>
                      </div>
                    </div>
                  </div>
                </RevealOnScroll>

                {/* Node 2: Deep-Ground Research Agent */}
                <RevealOnScroll direction="up" delay={200}>
                  <div className="h-full p-6 rounded-2xl bg-[#111A27]/85 backdrop-blur-md border border-[#202C3D] hover:border-[#1685FF]/60 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between group">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#1685FF] to-[#00A3FF] p-[1.5px] shadow-sm shadow-blue-500/10 group-hover:scale-105 transition-transform">
                            <div className="w-full h-full bg-[#0B0F17] rounded-[10px] flex items-center justify-center">
                              <Search className="w-5 h-5 text-[#00A3FF]" />
                            </div>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#1685FF]">Step 02 &bull; Grounding</span>
                            <h4 className="text-base font-bold text-white">Deep-Ground Research</h4>
                          </div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#151F2E] text-emerald-400 border border-[#202C3D]">
                          citations.verify()
                        </span>
                      </div>

                      <p className="text-xs text-[#AAB4C5] leading-relaxed mb-4">
                        Scrapes verified publications, whitepapers, and data points. Extracts ground-truth facts and eliminates fabricated citations or phantom URLs.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-[#0B0F17]/90 border border-[#202C3D] text-[11px] font-mono space-y-1">
                      <div className="text-[#7F8BA0] flex items-center gap-1.5">
                        <span className="text-[#1685FF] font-bold">IN:</span>
                        <span className="truncate">Entity Queries &amp; Constraints</span>
                      </div>
                      <div className="text-[#D2D8E2] flex items-center gap-1.5">
                        <span className="text-emerald-400 font-bold">OUT:</span>
                        <span className="truncate">3+ Verified Facts &amp; URLs</span>
                      </div>
                    </div>
                  </div>
                </RevealOnScroll>

                {/* Node 3: Content Strategist Agent */}
                <RevealOnScroll direction="up" delay={300}>
                  <div className="h-full p-6 rounded-2xl bg-[#111A27]/85 backdrop-blur-md border border-[#202C3D] hover:border-[#B845C8]/60 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between group">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#5B51D8] to-[#833AB4] p-[1.5px] shadow-sm shadow-purple-500/10 group-hover:scale-105 transition-transform">
                            <div className="w-full h-full bg-[#0B0F17] rounded-[10px] flex items-center justify-center">
                              <Layers className="w-5 h-5 text-[#B845C8]" />
                            </div>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#B845C8]">Step 03 &bull; Strategy</span>
                            <h4 className="text-base font-bold text-white">Content Strategist</h4>
                          </div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#151F2E] text-purple-300 border border-[#202C3D]">
                          angles.plan()
                        </span>
                      </div>

                      <p className="text-xs text-[#AAB4C5] leading-relaxed mb-4">
                        Architects 5 distinct hook angles (for LinkedIn) or narrative tension arcs with timestamps (for Instagram Reels) designed for maximum engagement.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-[#0B0F17]/90 border border-[#202C3D] text-[11px] font-mono space-y-1">
                      <div className="text-[#7F8BA0] flex items-center gap-1.5">
                        <span className="text-[#1685FF] font-bold">IN:</span>
                        <span className="truncate">Verified Fact Corpus</span>
                      </div>
                      <div className="text-[#D2D8E2] flex items-center gap-1.5">
                        <span className="text-emerald-400 font-bold">OUT:</span>
                        <span className="truncate">5 Angle Blueprints &amp; Arcs</span>
                      </div>
                    </div>
                  </div>
                </RevealOnScroll>
              </div>

              {/* Connecting Pipeline Conduit Between Phase 1 and Phase 2 */}
              <RevealOnScroll direction="up" delay={150}>
                <div className="flex items-center justify-center py-4">
                  <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-[#111A27]/90 border border-[#202C3D] shadow-sm backdrop-blur-md text-xs font-mono text-[#D2D8E2]">
                    <ArrowDown className="w-4 h-4 text-[#1685FF] animate-bounce shrink-0" />
                    <span>STATE DISPATCH &bull; GROUNDED CONTEXT &amp; BLUEPRINTS FORWARDED TO REFINEMENT ENGINE</span>
                    <ArrowDown className="w-4 h-4 text-[#1685FF] animate-bounce shrink-0" />
                  </div>
                </div>
              </RevealOnScroll>

              {/* ============================================================
                  PHASE 2: THE AUTONOMOUS REFINEMENT & QUALITY LOOP (STEPS 4 & 5)
                  ============================================================ */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#E1306C] animate-pulse" />
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#E1306C]">
                    PHASE 2 &bull; AUTONOMOUS REFINEMENT ENGINE &amp; ADVERSARIAL CRITIC LOOP
                  </h3>
                </div>

                <div className="p-6 sm:p-8 rounded-3xl bg-[#111A27]/90 backdrop-blur-md border border-[#202C3D] shadow-2xl relative overflow-hidden">
                  {/* Subtle Ambient Glow Accents */}
                  <div className="absolute top-0 right-0 w-80 h-80 bg-[#E1306C]/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#1685FF]/10 rounded-full blur-3xl pointer-events-none" />

                  {/* Node 4 & Node 5 Interactive Grid with Loop Conduit */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch relative">
                    {/* Node 4: Platform Writer Agent */}
                    <div className="lg:col-span-5 p-6 rounded-2xl bg-[#0B0F17]/90 border border-[#202C3D] hover:border-[#E1306C]/60 transition-all flex flex-col justify-between group">
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#833AB4] to-[#E1306C] p-[1.5px] shadow-sm shadow-pink-500/10 group-hover:scale-105 transition-transform">
                              <div className="w-full h-full bg-[#0B0F17] rounded-[10px] flex items-center justify-center">
                                <PenTool className="w-5 h-5 text-[#E1306C]" />
                              </div>
                            </div>
                            <div>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-[#E1306C]">Step 04 &bull; Synthesis</span>
                              <h4 className="text-base font-bold text-white">Platform Writer Agent</h4>
                            </div>
                          </div>
                        </div>

                        <div className="mb-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#151F2E] text-pink-300 border border-[#202C3D]">
                            draft.generate()
                          </span>
                        </div>

                        <p className="text-xs text-[#AAB4C5] leading-relaxed mb-4">
                          Synthesizes high-density, authoritative copy grounded strictly in research facts. Formats hooks, body structures, and engaging CTAs.
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-[#111A27] border border-[#202C3D] text-[11px] font-mono space-y-1">
                        <div className="text-[#7F8BA0] flex items-center gap-1.5">
                          <span className="text-[#E1306C] font-bold">IN:</span>
                          <span className="truncate">Blueprints + Verified Facts</span>
                        </div>
                        <div className="text-[#D2D8E2] flex items-center gap-1.5">
                          <span className="text-emerald-400 font-bold">OUT:</span>
                          <span className="truncate">Full Grounded Draft Iteration</span>
                        </div>
                      </div>
                    </div>

                    {/* Central Interactive Feedback Loop Channel */}
                    <div className="lg:col-span-2 flex flex-col justify-center items-center gap-4 py-4 lg:py-0">
                      {/* Forward Arrow: Writer -> Critic */}
                      <div className="w-full p-2.5 rounded-xl bg-[#151F2E]/90 border border-[#202C3D] text-center flex items-center justify-center gap-1.5 text-[11px] font-mono text-[#D2D8E2] shadow-sm">
                        <span>Draft Forward</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#1685FF] hidden lg:block" />
                        <ArrowDown className="w-3.5 h-3.5 text-[#1685FF] lg:hidden" />
                      </div>

                      {/* Animated Loop Badge */}
                      <div className="w-11 h-11 rounded-full bg-[#111A27] border border-[#F77737]/50 flex items-center justify-center text-[#F77737] shadow-[0_0_20px_rgba(247,119,55,0.25)]">
                        <RotateCcw className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
                      </div>

                      {/* Backward Loop: Critic -> Writer */}
                      <div className="w-full p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center flex items-center justify-center gap-1.5 text-[10px] font-mono text-amber-300 shadow-sm">
                        <span className="hidden lg:block">&larr;</span>
                        <span className="lg:hidden">&uarr;</span>
                        <span>Revise &amp; Loop</span>
                      </div>
                    </div>

                    {/* Node 5: Adversarial Critic Agent */}
                    <div className="lg:col-span-5 p-6 rounded-2xl bg-[#0B0F17]/90 border border-[#202C3D] hover:border-[#F77737]/60 transition-all flex flex-col justify-between group">
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#E1306C] to-[#F77737] p-[1.5px] shadow-sm shadow-orange-500/10 group-hover:scale-105 transition-transform">
                              <div className="w-full h-full bg-[#0B0F17] rounded-[10px] flex items-center justify-center">
                                <Repeat className="w-5 h-5 text-[#F77737]" />
                              </div>
                            </div>
                            <div>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-[#F77737]">Step 05 &bull; Quality Audit</span>
                              <h4 className="text-base font-bold text-white">Adversarial Critic</h4>
                            </div>
                          </div>
                        </div>

                        <div className="mb-3 flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#151F2E] text-amber-300 border border-[#202C3D]">
                            rubrics.score()
                          </span>
                          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-bold">
                            Bar: 90/100
                          </span>
                        </div>

                        <p className="text-xs text-[#AAB4C5] leading-relaxed mb-4">
                          Scores the draft across 6 metrics (Topic Fidelity, Tone, Accuracy, Platform Fit, Usefulness, Clarity). Flags unsupported statements.
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-[#111A27] border border-[#202C3D] text-[11px] font-mono space-y-1">
                        <div className="text-[#7F8BA0] flex items-center gap-1.5">
                          <span className="text-[#F77737] font-bold">EVAL:</span>
                          <span className="truncate">6 Rigorous Scoring Rubrics</span>
                        </div>
                        <div className="text-[#D2D8E2] flex items-center gap-1.5">
                          <span className="text-emerald-400 font-bold">OUT:</span>
                          <span className="truncate">Approved or Directed Revision</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Decision Outcomes Fork (Approved vs Rejected) */}
                  <div className="mt-8 pt-6 border-t border-[#202C3D] grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Outcome A: Rejection & Autonomous Revision */}
                    <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/30 flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-amber-500/15 text-amber-400 shrink-0 mt-0.5">
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                            If Score &lt; 90 &bull; Rejection &amp; Autonomous Loop
                          </span>
                        </div>
                        <p className="text-xs text-[#AAB4C5] leading-relaxed">
                          Critic generates concrete line-by-line revision instructions. Writer Agent receives critique and regenerates flawed sections (up to 5 autonomous cycles).
                        </p>
                      </div>
                    </div>

                    {/* Outcome B: Approved & Production Deployment */}
                    <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/30 flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-emerald-500/15 text-emerald-400 shrink-0 mt-0.5">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                            If Score &ge; 90 &bull; Quality Approved &amp; Deployed
                          </span>
                        </div>
                        <p className="text-xs text-[#AAB4C5] leading-relaxed">
                          Content passes all fidelity rubrics with verified research citations. Production-ready deliverable rendered for LinkedIn or Instagram Reels.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            PLATFORM DELIVERABLES SHOWCASE
            ============================================================ */}
        <section className="py-36 md:py-52 px-4 sm:px-6 lg:px-8 border-b border-[#202C3D]/60 backdrop-blur-[2px]">
          <div className="max-w-6xl mx-auto">
            {/* Deliverables Header */}
            <div className="text-center max-w-3xl mx-auto mb-16">
              <RevealOnScroll direction="up">
                <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#1685FF] mb-2">
                  OUTPUT FORMATS
                </h2>
              </RevealOnScroll>
              <ScatteredHeading
                text="Engineered for Distribution & Engagement"
                as="h3"
                accent="#1685FF"
              />
              <RevealOnScroll direction="up" delay={80}>
                <p className="text-sm sm:text-base text-[#AAB4C5] mt-3 leading-relaxed">
                  Choose your target platform. ContentSmith generates production-ready deliverables formatted for immediate copy-pasting or recording.
                </p>
              </RevealOnScroll>
            </div>

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
        <section className="pt-36 pb-56 px-4 sm:px-6 lg:px-8">
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
