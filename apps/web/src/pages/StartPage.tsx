import React, { useEffect } from 'react';
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
  Layers,
  Database,
  Cpu,
  Zap,
  AlertTriangle,
  RotateCcw,
  Check,
} from 'lucide-react';
import { LinkedInIcon } from '../components/icons.js';
import { RevealOnScroll } from '../components/RevealOnScroll.js';
import { ScatteredHeading } from '@/components/ui/scattered-heading';
import { CinematicHero } from '@/components/ui/cinematic-landing-hero';

const CAPABILITIES = [
  'Grounded citations',
  'Adversarial critic',
  'LinkedIn post packs',
  'Instagram reel scripts',
  '90/100 quality gate',
  'Autonomous refinement',
  'Zero fabricated URLs',
  'Iteration audit trail',
];

export const StartPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="relative min-h-screen text-[#E8EDF7] overflow-x-hidden">
      <div className="relative z-20">
        {/* ============================================================
            HERO — CINEMATIC SCROLL EXPERIENCE
            ============================================================ */}
        <CinematicHero />

        <section className="relative overflow-hidden border-b border-[#252B38]">
          {/* Capability marquee */}
          <div className="relative border-t border-[#252B38] bg-[#04070D]/80 py-3 overflow-hidden">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#000000] to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#000000] to-transparent" />
            <div className="flex w-max animate-marquee">
              {[0, 1].map((copy) => (
                <div key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
                  {CAPABILITIES.map((capability) => (
                    <span
                      key={`${copy}-${capability}`}
                      className="flex items-center gap-3 px-6 font-mono text-[10px] uppercase tracking-[0.22em] text-[#737D91] whitespace-nowrap"
                    >
                      <span className="h-1 w-1 rounded-full bg-[#2787FF]/70" />
                      {capability}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================
            STAT STRIP
            ============================================================ */}
        <section className="border-b border-[#252B38]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-4 divide-x divide-[#252B38] border-x border-[#252B38]">
            {[
              { value: '3', label: 'Specialized agents', sub: 'Research · Writer · Critic' },
              { value: '5', label: 'Distinct angles', sub: 'Per LinkedIn post pack' },
              { value: '90+', label: 'Quality threshold', sub: 'Adversarial scoring' },
              { value: '0', label: 'Fabricated URLs', sub: 'Ground-truth enforced' },
            ].map((stat, index) => (
              <div
                key={stat.label}
                className="px-5 py-7 sm:px-7 sm:py-9"
              >
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#E8EDF7]">
                    {stat.value}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#2787FF]">
                    0{index + 1}
                  </span>
                </div>
                <div className="mt-1.5 text-xs font-semibold text-[#E8EDF7]">{stat.label}</div>
                <div className="mt-0.5 text-[11px] text-[#737D91]">{stat.sub}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================
            WHY MULTI-AGENT — EDITORIAL SPLIT
            ============================================================ */}
        <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 border-b border-[#252B38]">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-28">
                <RevealOnScroll direction="up">
                  <div className="eyebrow text-[#2787FF] mb-3">The autonomous advantage</div>
                </RevealOnScroll>
                <RevealOnScroll direction="up" delay={60}>
                  <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.9rem] font-bold tracking-[-0.03em] leading-[1.06] text-[#E8EDF7]">
                    Why single-prompt AI fails &amp; how multi-agent teams win
                  </h2>
                </RevealOnScroll>
                <RevealOnScroll direction="up" delay={120}>
                  <p className="mt-5 text-sm sm:text-base text-[#A1A9BA] leading-relaxed max-w-md">
                    Standard LLMs suffer from prompt fatigue, superficial advice, and hallucinated URLs.
                    ContentSmith solves this through true specialization and separation of concerns.
                  </p>
                </RevealOnScroll>
                <RevealOnScroll direction="up" delay={160}>
                  <Link
                    to="/create"
                    className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#2787FF] hover:text-[#7EC0EB] transition-colors group"
                  >
                    <span>Put the pipeline to work</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </RevealOnScroll>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              {[
                {
                  number: '01',
                  icon: Database,
                  tone: 'text-[#2787FF]',
                  hoverTone: 'group-hover:text-[#7EC0EB]',
                  title: 'Ground-truth fact verification',
                  description:
                    'Before writing a single word, the Research Agent gathers real statistics, scientific mechanisms, and external publications. No phantom URLs or invented studies.',
                },
                {
                  number: '02',
                  icon: Cpu,
                  tone: 'text-[#A836D9]',
                  hoverTone: 'group-hover:text-[#C77BEA]',
                  title: 'Adversarial critic loop',
                  description:
                    'A dedicated Critic Agent rigorously reviews the content against 6 strict rubrics. Flawed hooks, generic filler, or unsupported assertions are rejected back to the Writer.',
                },
                {
                  number: '03',
                  icon: Zap,
                  tone: 'text-[#F77737]',
                  hoverTone: 'group-hover:text-amber-300',
                  title: 'Platform-native formats',
                  description:
                    'Generates 5 distinct angles for LinkedIn (contrarian, tactical, framework, case-study, teardown) or timed, recordable scene scripts with B-roll directions for Instagram Reels.',
                },
              ].map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <RevealOnScroll key={feature.title} direction="up" delay={index * 90}>
                    <article className="panel panel-hover group p-6 sm:p-7">
                      <div className="flex items-start gap-5">
                        <div className="flex flex-col items-center gap-3">
                          <div className={`flex h-11 w-11 items-center justify-center rounded-xl border border-[#252B38] bg-[#080C15] ${feature.tone}`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <span className="font-mono text-[10px] font-bold tracking-widest text-[#525B6C]">
                            {feature.number}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <h3 className={`font-display text-lg font-semibold text-[#E8EDF7] transition-colors ${feature.hoverTone}`}>
                            {feature.title}
                          </h3>
                          <p className="mt-2 text-xs sm:text-[13px] leading-relaxed text-[#A1A9BA]">
                            {feature.description}
                          </p>
                        </div>
                        <Check className="ml-auto mt-1 h-4 w-4 shrink-0 text-emerald-400/70" aria-hidden="true" />
                      </div>
                    </article>
                  </RevealOnScroll>
                );
              })}
            </div>
          </div>
        </section>

        {/* ============================================================
            AGENT FLOWCHART
            ============================================================ */}
        <section id="flowchart" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 border-b border-[#252B38]">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-3xl mb-14">
              <RevealOnScroll direction="up">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#080C15] border border-[#252B38] text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-[#2787FF] mb-4">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Multi-agent state machine</span>
                </div>
              </RevealOnScroll>
              <RevealOnScroll direction="up" delay={60}>
                <ScatteredHeading text="Autonomous Agent Lifecycle Flowchart" as="h2" accent="#2787FF" />
              </RevealOnScroll>
              <RevealOnScroll direction="up" delay={120}>
                <p className="text-sm sm:text-base text-[#A1A9BA] mt-4 leading-relaxed">
                  Each topic progresses through a deterministic graph of autonomous specialized agents. Follow the state
                  transitions from semantic ingestion to the adversarial quality loop.
                </p>
              </RevealOnScroll>

              <RevealOnScroll direction="up" delay={160}>
                <div className="mt-7 flex flex-wrap items-center gap-2 text-[10px] font-mono">
                  {['Ingestion', 'Grounding', 'Strategy', 'Synthesis', 'Critic loop'].map((stage, index) => (
                    <React.Fragment key={stage}>
                      <span className="rounded-full border border-[#252B38] bg-[#080C15] px-3 py-1 font-semibold text-[#A1A9BA]">
                        <span className="mr-1.5 text-[#2787FF]">0{index + 1}</span>
                        {stage}
                      </span>
                      {index < 4 && <ArrowRight className="w-3 h-3 text-[#34445F]" aria-hidden="true" />}
                    </React.Fragment>
                  ))}
                </div>
              </RevealOnScroll>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-[#2787FF] animate-pulse" />
                <h3 className="eyebrow text-[#2787FF]">Phase 1 · Ground-truth intelligence &amp; strategy</h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {[
                  {
                    step: 'Step 01 · Ingestion',
                    title: 'Topic Analyzer Agent',
                    icon: Sparkles,
                    tone: 'text-[#2787FF]',
                    tag: 'guardrails.lock()',
                    tagClass: 'text-[#7EC0EB] border-[#2787FF]/25 bg-[#2787FF]/[0.07]',
                    description:
                      'Deconstructs the user thesis, extracts core semantic entities, and establishes anti-hallucination domain boundaries to prevent topic drift.',
                    input: 'Raw user thesis string',
                    output: 'Semantic guardrails & entities',
                  },
                  {
                    step: 'Step 02 · Grounding',
                    title: 'Deep-Ground Research',
                    icon: Search,
                    tone: 'text-emerald-400',
                    tag: 'citations.verify()',
                    tagClass: 'text-emerald-400 border-emerald-500/25 bg-emerald-500/[0.07]',
                    description:
                      'Scrapes verified publications, whitepapers, and data points. Extracts ground-truth facts and eliminates fabricated citations or phantom URLs.',
                    input: 'Entity queries & constraints',
                    output: '3+ verified facts & URLs',
                  },
                  {
                    step: 'Step 03 · Strategy',
                    title: 'Content Strategist',
                    icon: Layers,
                    tone: 'text-[#A836D9]',
                    tag: 'angles.plan()',
                    tagClass: 'text-[#C77BEA] border-[#A836D9]/25 bg-[#A836D9]/[0.07]',
                    description:
                      'Architects 5 distinct hook angles (for LinkedIn) or narrative tension arcs with timestamps (for Instagram Reels) designed for maximum engagement.',
                    input: 'Verified fact corpus',
                    output: '5 angle blueprints & arcs',
                  },
                ].map((node, index) => {
                  const Icon = node.icon;
                  return (
                    <RevealOnScroll key={node.title} direction="up" delay={index * 100}>
                      <article className="panel panel-hover group flex h-full flex-col p-6">
                        <div className="mb-4 flex items-center gap-3">
                          <div className={`flex h-10 w-10 items-center justify-center rounded-xl border border-[#252B38] bg-[#080C15] ${node.tone}`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#737D91]">
                              {node.step}
                            </span>
                            <h4 className="font-display text-base font-semibold text-[#E8EDF7]">{node.title}</h4>
                          </div>
                        </div>

                        <span className={`mb-4 inline-flex w-fit rounded border px-2 py-0.5 font-mono text-[10px] font-semibold ${node.tagClass}`}>
                          {node.tag}
                        </span>

                        <p className="mb-5 text-xs leading-relaxed text-[#A1A9BA]">{node.description}</p>

                        <div className="mt-auto space-y-1.5 rounded-xl border border-[#252B38] bg-black/50 p-3 font-mono text-[11px]">
                          <div className="flex items-center gap-1.5 text-[#A1A9BA]">
                            <span className="font-bold text-[#2787FF]">IN:</span>
                            <span className="truncate">{node.input}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[#E8EDF7]">
                            <span className="font-bold text-emerald-400">OUT:</span>
                            <span className="truncate">{node.output}</span>
                          </div>
                        </div>
                      </article>
                    </RevealOnScroll>
                  );
                })}
              </div>

              <RevealOnScroll direction="up" delay={120}>
                <div className="flex items-center justify-center py-5">
                  <div className="flex items-center gap-3 rounded-full border border-[#252B38] bg-[#080C15]/80 px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[#A1A9BA] backdrop-blur-md">
                    <ArrowDown className="h-4 w-4 shrink-0 animate-bounce text-[#2787FF]" />
                    <span>State dispatch · grounded context forwarded</span>
                    <ArrowDown className="h-4 w-4 shrink-0 animate-bounce text-[#2787FF]" />
                  </div>
                </div>
              </RevealOnScroll>

              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-[#D21BCE] animate-pulse" />
                <h3 className="eyebrow text-[#D21BCE]">Phase 2 · Refinement engine &amp; adversarial critic loop</h3>
              </div>

              <div className="panel relative overflow-hidden p-6 sm:p-8">
                <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#D21BCE]/[0.06] blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[#2787FF]/[0.06] blur-3xl pointer-events-none" />

                <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                  {/* Writer */}
                  <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl border border-[#252B38] bg-black/50 p-6">
                    <div>
                      <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#252B38] bg-[#080C15] text-[#D21BCE]">
                          <PenTool className="h-5 w-5" />
                        </div>
                        <div>
                          <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#737D91]">
                            Step 04 · Synthesis
                          </span>
                          <h4 className="font-display text-base font-semibold text-[#E8EDF7]">Platform Writer Agent</h4>
                        </div>
                      </div>
                      <span className="mb-3 inline-flex rounded border border-[#D21BCE]/25 bg-[#D21BCE]/[0.07] px-2 py-0.5 font-mono text-[10px] font-semibold text-[#E68EE1]">
                        draft.generate()
                      </span>
                      <p className="text-xs leading-relaxed text-[#A1A9BA]">
                        Synthesizes high-density, authoritative copy grounded strictly in research facts. Formats hooks,
                        body structures, and engaging CTAs.
                      </p>
                    </div>
                    <div className="mt-5 space-y-1.5 rounded-xl border border-[#252B38] bg-[#080C15] p-3 font-mono text-[11px]">
                      <div className="flex items-center gap-1.5 text-[#A1A9BA]">
                        <span className="font-bold text-[#D21BCE]">IN:</span>
                        <span className="truncate">Blueprints + verified facts</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[#E8EDF7]">
                        <span className="font-bold text-emerald-400">OUT:</span>
                        <span className="truncate">Full grounded draft</span>
                      </div>
                    </div>
                  </div>

                  {/* Loop channel */}
                  <div className="lg:col-span-2 flex flex-col items-center justify-center gap-4 py-2">
                    <div className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-[#252B38] bg-[#0E1422] p-2.5 font-mono text-[10px] text-[#E8EDF7]">
                      <span>Forward</span>
                      <ArrowRight className="hidden h-3.5 w-3.5 text-[#2787FF] lg:block" />
                      <ArrowDown className="h-3.5 w-3.5 text-[#2787FF] lg:hidden" />
                    </div>
                    <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#F77737]/40 bg-[#080C15] text-[#F77737]">
                      <RotateCcw className="h-5 w-5 animate-spin-slow" />
                    </div>
                    <div className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-amber-500/25 bg-amber-500/10 p-2.5 font-mono text-[10px] text-amber-300">
                      <span className="hidden lg:block">&larr;</span>
                      <span className="lg:hidden">&uarr;</span>
                      <span>Revise &amp; loop</span>
                    </div>
                  </div>

                  {/* Critic */}
                  <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl border border-[#252B38] bg-black/50 p-6">
                    <div>
                      <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#252B38] bg-[#080C15] text-[#F77737]">
                          <Repeat className="h-5 w-5" />
                        </div>
                        <div>
                          <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#737D91]">
                            Step 05 · Quality audit
                          </span>
                          <h4 className="font-display text-base font-semibold text-[#E8EDF7]">Adversarial Critic</h4>
                        </div>
                      </div>
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <span className="rounded border border-[#F77737]/25 bg-[#F77737]/[0.07] px-2 py-0.5 font-mono text-[10px] font-semibold text-amber-300">
                          rubrics.score()
                        </span>
                        <span className="rounded border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-400">
                          Bar: 90/100
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed text-[#A1A9BA]">
                        Scores the draft across 6 metrics (topic fidelity, tone, accuracy, platform fit, usefulness,
                        clarity). Flags unsupported statements.
                      </p>
                    </div>
                    <div className="mt-5 space-y-1.5 rounded-xl border border-[#252B38] bg-[#080C15] p-3 font-mono text-[11px]">
                      <div className="flex items-center gap-1.5 text-[#A1A9BA]">
                        <span className="font-bold text-[#F77737]">EVAL:</span>
                        <span className="truncate">6 rigorous scoring rubrics</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[#E8EDF7]">
                        <span className="font-bold text-emerald-400">OUT:</span>
                        <span className="truncate">Approved or directed revision</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative mt-8 grid grid-cols-1 gap-4 border-t border-[#252B38] pt-6 md:grid-cols-2">
                  <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                    <div className="mt-0.5 shrink-0 rounded-lg bg-amber-500/15 p-2 text-amber-400">
                      <AlertTriangle className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-[0.14em] text-amber-300">
                        If score &lt; 90 · rejection &amp; autonomous loop
                      </span>
                      <p className="mt-1 text-xs leading-relaxed text-[#A1A9BA]">
                        Critic generates concrete line-by-line revision instructions. Writer Agent receives critique and
                        regenerates flawed sections (up to 5 autonomous cycles).
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                    <div className="mt-0.5 shrink-0 rounded-lg bg-emerald-500/15 p-2 text-emerald-400">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-[0.14em] text-emerald-300">
                        If score &ge; 90 · approved &amp; deployed
                      </span>
                      <p className="mt-1 text-xs leading-relaxed text-[#A1A9BA]">
                        Content passes all fidelity rubrics with verified research citations. Production-ready deliverable
                        rendered for LinkedIn or Instagram Reels.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            OUTPUT FORMATS
            ============================================================ */}
        <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 border-b border-[#252B38]">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-3xl mb-14">
              <RevealOnScroll direction="up">
                <div className="eyebrow text-[#2787FF] mb-3">Output formats</div>
              </RevealOnScroll>
              <RevealOnScroll direction="up" delay={60}>
                <ScatteredHeading text="Engineered for Distribution & Engagement" as="h2" accent="#2787FF" />
              </RevealOnScroll>
              <RevealOnScroll direction="up" delay={120}>
                <p className="text-sm sm:text-base text-[#A1A9BA] mt-4 leading-relaxed">
                  Choose your target platform. ContentSmith generates production-ready deliverables formatted for
                  immediate copy-pasting or recording.
                </p>
              </RevealOnScroll>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <RevealOnScroll direction="up" delay={80}>
                <article className="panel panel-hover group flex h-full flex-col p-7 sm:p-8">
                  <div className="mb-6 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0A66C2] text-white shadow-lg shadow-[#0A66C2]/25">
                      <LinkedInIcon className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-display text-xl font-semibold text-[#E8EDF7]">LinkedIn Authority Post Pack</h4>
                      <p className="text-xs text-[#737D91]">5 multi-angle posts · grounded citations</p>
                    </div>
                  </div>

                  <ul className="mb-7 space-y-3 text-xs text-[#A1A9BA]">
                    {[
                      ['5 distinct angles:', 'Contrarian take, tactical deep-dive, industry case study, structured framework, and lessons learned.'],
                      ['Scroll-stopping hooks:', 'Tested line-by-line by the Critic to eliminate generic intros.'],
                      ['1-click copy all:', 'Instant clipboard export for Buffer, Taplio, or LinkedIn native.'],
                    ].map(([lead, rest]) => (
                      <li key={lead} className="flex items-start gap-2.5">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#2787FF]" />
                        <span>
                          <strong className="text-[#E8EDF7]">{lead}</strong> {rest}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto flex items-center justify-between rounded-xl border border-[#252B38] bg-black/50 px-4 py-3 text-[11px]">
                    <span className="text-[#737D91]">Output guarantee</span>
                    <span className="font-semibold text-[#E8EDF7]">0% generic regurgitation</span>
                  </div>
                </article>
              </RevealOnScroll>

              <RevealOnScroll direction="up" delay={160}>
                <article className="panel panel-hover group flex h-full flex-col p-7 sm:p-8">
                  <div className="mb-6 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-[#833AB4] via-[#D21BCE] to-[#F77737] text-white shadow-lg shadow-[#D21BCE]/25">
                      <Video className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-display text-xl font-semibold text-[#E8EDF7]">Instagram Reel Production Script</h4>
                      <p className="text-xs text-[#737D91]">Scene-by-scene visuals · timed voiceovers</p>
                    </div>
                  </div>

                  <ul className="mb-7 space-y-3 text-xs text-[#A1A9BA]">
                    {[
                      ['Recordable scene breakdown:', 'Exact timestamps (0–5s hook, 5–25s core, 25–45s proof, 45–60s CTA).'],
                      ['Camera & B-roll direction:', 'Recommended visual framing, gestures, screen recordings, and transitions.'],
                      ['On-screen text badges:', 'High-impact subtitles to retain viewers watching on mute.'],
                    ].map(([lead, rest]) => (
                      <li key={lead} className="flex items-start gap-2.5">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#D21BCE]" />
                        <span>
                          <strong className="text-[#E8EDF7]">{lead}</strong> {rest}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto flex items-center justify-between rounded-xl border border-[#252B38] bg-black/50 px-4 py-3 text-[11px]">
                    <span className="text-[#737D91]">Output guarantee</span>
                    <span className="font-semibold text-[#E8EDF7]">Calculated pace (~130 wpm)</span>
                  </div>
                </article>
              </RevealOnScroll>
            </div>
          </div>
        </section>

        {/* ============================================================
            BOTTOM CTA
            ============================================================ */}
        <section className="px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <RevealOnScroll direction="up">
            <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-[#252B38] bg-[#080C15] p-10 text-center shadow-2xl sm:p-16">
              <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#2787FF]/[0.08] blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-[#D21BCE]/[0.07] blur-3xl pointer-events-none" />
              <div className="absolute inset-0 bg-dot-grid opacity-20 [mask-image:radial-gradient(60%_60%_at_50%_50%,black,transparent)] pointer-events-none" />

              <div className="relative">
                <div className="eyebrow mb-4 text-[#8FA6C6]">Start forging</div>
                <h3 className="font-display text-3xl font-bold tracking-[-0.03em] text-[#E8EDF7] sm:text-4xl lg:text-[2.9rem]">
                  Ready to forge authoritative content?
                </h3>
                <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[#A1A9BA] sm:text-base">
                  Specify your topic, select your platform, and let Content
                  <span className="spectrum-gradient-text font-bold">Smith</span>'s autonomous agents execute the research
                  and synthesis.
                </p>

                <Link
                  to="/create"
                  className="group mt-8 inline-flex items-center gap-3 rounded-xl bg-[#2787FF] px-8 py-4 text-sm font-bold text-white shadow-lg shadow-[#2787FF]/25 transition-all duration-250 hover:scale-[1.02] hover:bg-[#1E74E0] hover:shadow-[#2787FF]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2787FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#080C15] sm:text-base"
                >
                  <Sparkles className="h-5 w-5" />
                  <span>Configure content generation</span>
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1.5" />
                </Link>

                <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] text-[#737D91]">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Zero-cost local mode
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#2787FF]" /> Full iteration history
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#D21BCE]" /> No prompt fatigue
                  </span>
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </section>
      </div>
    </div>
  );
};
