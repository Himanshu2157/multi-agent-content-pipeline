import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Video,
  Layers,
  Search,
  PenTool,
  CheckSquare,
  Repeat,
  AlertCircle,
  Activity,
  Sliders,
  Play,
  FileText,
  Clock,
  ExternalLink,
  Cpu,
} from 'lucide-react';
import { LinkedInIcon, InstagramIcon } from '../components/icons.js';
import { api } from '../services/api.js';
import { PLATFORMS, DEFAULT_TONES } from '@contentforge/shared';
import { cn } from '../lib/utils.js';

export interface TestTopicPreset {
  id: string;
  badge: string;
  title: string;
  platform: 'LINKEDIN' | 'INSTAGRAM_REEL';
  tone: string;
  audience: string;
  maxIterations: number;
  topic: string;
  description: string;
}

export const TEST_TOPIC_PRESETS: TestTopicPreset[] = [
  {
    id: 'jet-engine',
    badge: 'Physics & Aerospace',
    title: 'Jet Engine Reverse Thrust',
    platform: 'LINKEDIN',
    tone: 'Analytical & Authoritative',
    audience: 'Aerospace & Mechanical Engineers',
    maxIterations: 3,
    topic: 'How commercial jet engines generate reverse thrust upon landing: Aerodynamic bucket vs cascade blocker door mechanics and bypass redirection',
    description: 'Deconstructs reaction propulsion, cold-stream bypass diversion, and dispels the myth of turbine spin reversal.',
  },
  {
    id: 'cpu-pipeline',
    badge: 'Systems & Hardware',
    title: 'CPU Silicon Pipelining',
    platform: 'LINKEDIN',
    tone: 'Technical & Deep-Dive',
    audience: 'Systems Programmers & Performance Engineers',
    maxIterations: 3,
    topic: 'Inside the CPU silicon pipeline: Fetch, Decode, Execute, and the measurable latency penalty of speculative branch mispredictions',
    description: 'Traces binary instructions through 14–20 silicon stages and quantifies out-of-order reorder buffer flushes.',
  },
  {
    id: 'data-structures',
    badge: 'Software Architecture',
    title: 'Memory Cache Locality',
    platform: 'LINKEDIN',
    tone: 'Pragmatic & Solution-Oriented',
    audience: 'Backend Architects & Software Engineers',
    maxIterations: 3,
    topic: 'Memory layout & cache locality: Why high-level collection abstractions hide brutal CPU cache miss costs at scale',
    description: 'Benchmarks contiguous memory arrays with prefetchers versus pointer-chasing heap allocations in linked structures.',
  },
  {
    id: 'ai-agents-reel',
    badge: 'AI Engineering (Video)',
    title: 'Why Single-Prompt AI Fails',
    platform: 'INSTAGRAM_REEL',
    tone: 'Visionary & Inspiring',
    audience: 'AI Engineers & Tech Founders',
    maxIterations: 3,
    topic: 'Why single-prompt LLMs fail in production: Architecting autonomous multi-agent critic loops with self-correction',
    description: 'Generates a timed 60s video script with retention hook timestamps, camera directions, and on-screen text badges.',
  },
];

const AGENT_WORK_STAGES = [
  {
    agent: 'Topic Analyzer',
    sub: 'Semantic Ingestion',
    action: 'Deconstructing semantic thesis entities & locking anti-hallucination domain guardrails...',
  },
  {
    agent: 'Research Specialist',
    sub: 'Factual Grounding',
    action: 'Querying external publication index & verifying real statistical citations...',
  },
  {
    agent: 'Content Strategist',
    sub: 'Platform Framing',
    action: 'Architecting distinct hook angles and platform tension arcs...',
  },
  {
    agent: 'Adversarial Critic',
    sub: 'Quality Gate Loop',
    action: 'Arming 90/100 approval threshold & initializing LangGraph state machine...',
  },
];

interface AgentLoadingState {
  isActive: boolean;
  topic: string;
  platform: 'LINKEDIN' | 'INSTAGRAM_REEL';
  durationMs: number;
  complexityScore: number;
  strengthLabel: string;
  progress: number;
  currentStageIndex: number;
}

/**
 * Calculates topic strength and computational allocation duration between 3.0s and 6.0s
 */
function calculateTopicStrength(topicText: string): {
  durationMs: number;
  complexityScore: number;
  strengthLabel: string;
} {
  const clean = topicText.trim();
  const wordCount = clean.split(/\s+/).filter(Boolean).length;
  const charCount = clean.length;

  const technicalKeywords = [
    'architecture', 'pipeline', 'algorithm', 'system', 'consensus',
    'mechanic', 'aerospace', 'silicon', 'hardware', 'quantum',
    'latency', 'protocol', 'database', 'distributed', 'speculative',
    'optimization', 'memory', 'cache', 'neural', 'vector',
    'biochemistry', 'physics', 'engine', 'reverse', 'thrust'
  ];

  const techMatches = technicalKeywords.filter((kw) =>
    clean.toLowerCase().includes(kw)
  ).length;

  // Base score 30..100
  let score = Math.min(
    100,
    Math.round(
      Math.min(wordCount * 3.5, 45) +
      Math.min(charCount * 0.25, 30) +
      Math.min(techMatches * 8, 25)
    )
  );
  if (score < 30) score = 30;

  // Map 30..100 linearly to duration between 3000ms (3.0s) and 6000ms (6.0s)
  const durationMs = Math.round(3000 + ((score - 30) / 70) * 3000);

  let strengthLabel = 'Standard Topic Scope';
  if (score > 80) strengthLabel = 'Deep Multi-Entity Domain Thesis';
  else if (score > 60) strengthLabel = 'High-Complexity Technical Subject';
  else if (score > 40) strengthLabel = 'Moderate Technical Scope';

  return {
    durationMs,
    complexityScore: score,
    strengthLabel,
  };
}

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  // Backend Health Status Check
  const { data: health, isLoading: isHealthLoading, isError: isHealthError } = useQuery({
    queryKey: ['health'],
    queryFn: api.getHealth,
    refetchInterval: 10000,
  });

  // Recent Projects List
  const { data: projectsData } = useQuery({
    queryKey: ['projects'],
    queryFn: api.listProjects,
    refetchInterval: 12000,
  });
  const recentProjects = projectsData?.projects || [];

  // Form State
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState<'LINKEDIN' | 'INSTAGRAM_REEL'>(PLATFORMS.LINKEDIN);
  const [tone, setTone] = useState<string>(DEFAULT_TONES[0]);
  const [audience, setAudience] = useState('Tech professionals & software developers');
  const [maxIterations, setMaxIterations] = useState<number>(3);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Preset Selection State
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [presetSuccessMsg, setPresetSuccessMsg] = useState<string | null>(null);

  // Dynamic Agent Loading Screen State (3 to 6 seconds scaled to topic strength)
  const [loadingState, setLoadingState] = useState<AgentLoadingState | null>(null);

  const handleSelectPreset = (preset: TestTopicPreset) => {
    setTopic(preset.topic);
    setPlatform(preset.platform);
    setTone(preset.tone);
    setAudience(preset.audience);
    setMaxIterations(preset.maxIterations);
    setSelectedPresetId(preset.id);
    setPresetSuccessMsg(`Loaded preset "${preset.title}". Form is populated and ready!`);
    setTimeout(() => setPresetSuccessMsg(null), 4000);
  };

  /**
   * Unified Pipeline Launcher with Dynamic Agent Simulation Delay (3s - 6s)
   */
  const startPipelineWithAgentDelay = async (
    targetTopic: string,
    targetPlatform: 'LINKEDIN' | 'INSTAGRAM_REEL',
    targetTone: string,
    targetAudience: string,
    targetIterations: number
  ) => {
    const cleanTopic = targetTopic.trim();
    if (!cleanTopic) {
      setErrorMsg('Please enter a topic for the content generation pipeline.');
      return;
    }

    setErrorMsg(null);
    setIsSubmitting(true);

    // 1. Compute dynamic duration based on topic strength & complexity
    const { durationMs, complexityScore, strengthLabel } = calculateTopicStrength(cleanTopic);

    setLoadingState({
      isActive: true,
      topic: cleanTopic,
      platform: targetPlatform,
      durationMs,
      complexityScore,
      strengthLabel,
      progress: 0,
      currentStageIndex: 0,
    });

    // 2. Start API project creation in parallel
    const projectPromise = api.createProject({
      topic: cleanTopic,
      platform: targetPlatform,
      tone: targetTone,
      audience: targetAudience,
      maxIterations: targetIterations,
    });

    // 3. Progressively advance the simulation over the calculated duration (3s - 6s)
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const rawProgress = Math.min(100, Math.round((elapsed / durationMs) * 100));

      let stageIdx = 0;
      if (rawProgress >= 75) stageIdx = 3;
      else if (rawProgress >= 50) stageIdx = 2;
      else if (rawProgress >= 25) stageIdx = 1;

      setLoadingState((prev) =>
        prev
          ? {
              ...prev,
              progress: rawProgress,
              currentStageIndex: stageIdx,
            }
          : null
      );

      if (elapsed >= durationMs) {
        clearInterval(interval);
      }
    }, 40);

    try {
      // Await both the minimum calculated duration AND the API project response
      const [projectResult] = await Promise.all([
        projectPromise,
        new Promise((resolve) => setTimeout(resolve, durationMs)),
      ]);

      // Small visual pause at 100% completion before navigating
      setTimeout(() => {
        clearInterval(interval);
        setLoadingState(null);
        setIsSubmitting(false);
        navigate(`/project/${projectResult.project.id}`);
      }, 180);
    } catch (err: any) {
      clearInterval(interval);
      setLoadingState(null);
      setIsSubmitting(false);
      setErrorMsg(err.message || 'Failed to dispatch content project. Please check if backend is running.');
    }
  };

  const handleRunPresetNow = async (preset: TestTopicPreset) => {
    setTopic(preset.topic);
    setPlatform(preset.platform);
    setTone(preset.tone);
    setAudience(preset.audience);
    setMaxIterations(preset.maxIterations);
    setSelectedPresetId(preset.id);

    await startPipelineWithAgentDelay(
      preset.topic,
      preset.platform,
      preset.tone,
      preset.audience,
      preset.maxIterations
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await startPipelineWithAgentDelay(
      topic,
      platform,
      tone,
      audience,
      maxIterations
    );
  };

  // Dynamic Theme Colors based on Selected Platform (Instagram Reel: Magenta, LinkedIn: Electric Blue)
  const isReel = platform === PLATFORMS.INSTAGRAM_REEL;
  const theme = {
    accentText: isReel ? 'text-[#D21BCE]' : 'text-[#2787FF]',
    accentBorder: isReel ? 'border-[#D21BCE]' : 'border-[#2787FF]',
    accentBorderSubtle: isReel ? 'border-[#D21BCE]/30' : 'border-[#2787FF]/30',
    accentBorderHover: isReel ? 'hover:border-[#D21BCE]/40' : 'hover:border-[#2787FF]/40',
    accentBgSubtle: isReel ? 'bg-[#D21BCE]/10' : 'bg-[#2787FF]/10',
    accentRing: isReel
      ? 'focus:ring-[#D21BCE] focus:border-[#D21BCE]'
      : 'focus:ring-[#2787FF] focus:border-[#2787FF]',
    accentSlider: isReel ? 'accent-[#D21BCE]' : 'accent-[#2787FF]',
    buttonGradient: isReel
      ? 'bg-gradient-to-r from-[#2787FF] to-[#D21BCE] shadow-lg shadow-[#D21BCE]/25 hover:shadow-[#D21BCE]/40 focus:ring-[#D21BCE]/50'
      : 'bg-[#2787FF] hover:bg-[#1E74E0] shadow-lg shadow-[#2787FF]/25 hover:shadow-[#2787FF]/40 focus:ring-[#2787FF]/50',
  };

  // Dynamic Loading Screen Theme (Magenta for Reel, Electric Blue for LinkedIn)
  const isLoadingReel = loadingState?.platform === PLATFORMS.INSTAGRAM_REEL;
  const loadingTheme = {
    glow1: isLoadingReel ? 'bg-[#D21BCE]/15' : 'bg-[#2787FF]/15',
    glow2: isLoadingReel ? 'bg-[#D21BCE]/10' : 'bg-[#2787FF]/10',
    gradientPing: isLoadingReel
      ? 'from-[#2787FF] to-[#D21BCE]'
      : 'from-[#2787FF] to-[#1E74E0]',
    spinBorder: isLoadingReel ? 'border-[#D21BCE]/30' : 'border-[#2787FF]/30',
    coreGrad: isLoadingReel
      ? 'from-[#2787FF] to-[#D21BCE] shadow-[#D21BCE]/30'
      : 'from-[#2787FF] to-[#1E74E0] shadow-[#2787FF]/30',
    coreIcon: isLoadingReel ? 'text-[#D21BCE]' : 'text-[#2787FF]',
    badgeBorderText: isLoadingReel
      ? 'border-[#D21BCE]/30 text-[#D21BCE]'
      : 'border-[#2787FF]/30 text-[#2787FF]',
    badgeIcon: isLoadingReel ? 'text-[#D21BCE]' : 'text-[#2787FF]',
    stageCurrent: isLoadingReel
      ? 'bg-[#080C15] border-[#D21BCE] text-[#E8EDF7] shadow-[0_0_12px_rgba(210,27,206,0.25)]'
      : 'bg-[#080C15] border-[#2787FF] text-[#E8EDF7] shadow-[0_0_12px_rgba(39,135,255,0.25)]',
    stageCurrentNum: isLoadingReel ? 'text-[#D21BCE]' : 'text-[#2787FF]',
    actionDot: isLoadingReel ? 'bg-[#D21BCE]' : 'bg-[#2787FF]',
    actionText: isLoadingReel ? 'text-[#D21BCE]' : 'text-[#2787FF]',
    progressBar: isLoadingReel
      ? 'bg-gradient-to-r from-[#2787FF] to-[#D21BCE] shadow-[0_0_12px_rgba(210,27,206,0.5)]'
      : 'bg-[#2787FF] shadow-[0_0_12px_rgba(39,135,255,0.5)]',
    selection: isLoadingReel ? 'selection:bg-[#D21BCE]/30' : 'selection:bg-[#2787FF]/30',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-20">
      {/* ============================================================
          DYNAMIC AGENT WORK LOADING SCREEN (3s to 6s BASED ON TOPIC STRENGTH)
          ============================================================ */}
      {loadingState?.isActive && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Multi-agent pipeline running"
          className={cn("fixed inset-0 z-50 bg-[#000000]/90 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn", loadingTheme.selection)}
        >
          <div className="max-w-xl w-full p-8 rounded-3xl bg-[#080C15] border border-[#252B38] shadow-2xl relative overflow-hidden text-center">
            <div className="absolute inset-x-0 top-0 h-px shimmer-line" />
            {/* Background Ambient Glows */}
            <div className={cn("absolute -top-24 -right-24 w-60 h-60 rounded-full blur-3xl pointer-events-none", loadingTheme.glow1)} />
            <div className={cn("absolute -bottom-24 -left-24 w-60 h-60 rounded-full blur-3xl pointer-events-none", loadingTheme.glow2)} />

            {/* Center Radar / Orb Animation */}
            <div className="relative mx-auto w-20 h-20 mb-6 flex items-center justify-center">
              {/* Pulsing Outer Rings */}
              <div className={cn("absolute inset-0 rounded-full bg-gradient-to-tr opacity-25 animate-ping", loadingTheme.gradientPing)} />
              <div
                className={cn("absolute -inset-2 rounded-full border animate-spin", loadingTheme.spinBorder)}
                style={{ animationDuration: '8s' }}
              />

              {/* Inner Core */}
              <div className={cn("w-16 h-16 rounded-2xl bg-gradient-to-tr p-[2px] shadow-lg", loadingTheme.coreGrad)}>
                <div className="w-full h-full bg-[#000000] rounded-[14px] flex items-center justify-center">
                  <Cpu className={cn("w-8 h-8 animate-pulse", loadingTheme.coreIcon)} />
                </div>
              </div>
            </div>

            {/* Topic Complexity Gauge Badge */}
            <div className={cn("inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#080C15] border text-xs font-mono mb-3", loadingTheme.badgeBorderText)}>
              <Sparkles className={cn("w-3.5 h-3.5", loadingTheme.badgeIcon)} />
              <span>
                TOPIC DEPTH: <strong>{loadingState.complexityScore}/100</strong>
              </span>
              <span>&bull;</span>
              <span className="text-[#E8EDF7] font-sans font-medium">{loadingState.strengthLabel}</span>
            </div>

            {/* Main Title */}
            <h3 className="font-display text-xl sm:text-2xl font-bold text-[#E8EDF7] mb-2 tracking-tight">
              Multi-agent swarm initializing
            </h3>
            <p className="text-xs text-[#A1A9BA] max-w-md mx-auto mb-6 leading-relaxed">
              Topic allocated <strong className="text-[#E8EDF7]">{(loadingState.durationMs / 1000).toFixed(1)}s</strong> deep analysis &amp; adversarial calibration budget.
            </p>

            {/* Active Stage Stepper */}
            <div className="grid grid-cols-4 gap-2 mb-6">
              {AGENT_WORK_STAGES.map((stage, idx) => {
                const isDone = loadingState.currentStageIndex > idx || loadingState.progress === 100;
                const isCurrent = loadingState.currentStageIndex === idx && loadingState.progress < 100;
                return (
                  <div
                    key={stage.agent}
                    className={cn(
                      'p-2.5 rounded-xl border text-center transition-all',
                      isCurrent
                        ? loadingTheme.stageCurrent
                        : isDone
                        ? 'bg-[#000000] border-emerald-500/40 text-[#E8EDF7]'
                        : 'bg-[#000000]/60 border-[#252B38] text-[#A1A9BA]'
                    )}
                  >
                    <div className="flex items-center justify-center mb-1">
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <span className={cn('text-[10px] font-mono font-bold', isCurrent ? loadingTheme.stageCurrentNum : 'text-[#A1A9BA]')}>
                          0{idx + 1}
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] font-bold truncate">{stage.agent.split(' ')[0]}</div>
                  </div>
                );
              })}
            </div>

            {/* Real-time Agent Action Log */}
            <div aria-live="polite" className="p-3.5 rounded-xl bg-[#000000] border border-[#252B38] text-left text-xs font-mono text-[#E8EDF7] mb-6 flex items-start gap-2.5 shadow-inner">
              <div className={cn("w-2 h-2 rounded-full mt-1 animate-ping shrink-0", loadingTheme.actionDot)} />
              <div className="min-w-0 flex-1">
                <span className={cn("text-[10px] uppercase font-bold block mb-0.5", loadingTheme.actionText)}>
                  Active Agent &bull; {AGENT_WORK_STAGES[loadingState.currentStageIndex]?.agent}
                </span>
                <p className="text-xs text-[#A1A9BA] truncate">
                  {AGENT_WORK_STAGES[loadingState.currentStageIndex]?.action}
                </p>
              </div>
            </div>

            {/* Progress Bar & Percentage */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-[#A1A9BA]">
                <span>Pipeline Allocation Progress</span>
                <span className="text-[#E8EDF7] font-bold">{loadingState.progress}%</span>
              </div>
              <div className="w-full h-2.5 bg-[#000000] rounded-full overflow-hidden border border-[#252B38] p-[1px]">
                <div
                  className={cn("h-full rounded-full transition-all duration-75 ease-out", loadingTheme.progressBar)}
                  style={{ width: `${loadingState.progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Backend Status Bar */}
      <div className="flex items-center justify-between pb-6 mb-8 border-b border-[#252B38]">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#A1A9BA]" />
          <span className="text-xs font-medium text-[#A1A9BA]">Backend Connectivity:</span>
          {isHealthLoading ? (
            <span className="text-xs text-[#A1A9BA] animate-pulse">Checking health...</span>
          ) : isHealthError ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
              API Disconnected
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Connected ({health?.app} - Uptime: {Math.floor(health?.uptime || 0)}s)
            </span>
          )}
        </div>

        <div className="text-xs text-[#A1A9BA]">
          Autonomous Architecture: <span className="text-[#E8EDF7] font-mono">LangGraph State Machine</span>
        </div>
      </div>

      {/* Configure Page Header */}
      <div className="mb-8">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#A1A9BA] hover:text-[#2787FF] transition-colors mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Overview &amp; Flowchart</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="eyebrow text-[#2787FF] mb-2">Pipeline studio · Step 01</div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#E8EDF7] tracking-[-0.03em]">
              Configure content generation
            </h1>
            <p className="text-sm text-[#A1A9BA] mt-2 max-w-2xl leading-relaxed">
              Select a pre-ready testing scenario or customize your own parameters to trigger Content<span className="spectrum-gradient-text font-bold">Smith</span>'s multi-agent pipeline.
            </p>
          </div>
          <span className="hidden sm:inline-flex items-center gap-2 self-start sm:self-auto rounded-full border border-[#252B38] bg-[#080C15] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[#A1A9BA]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#2787FF] shadow-[0_0_8px_#2787FF]" />
            3 agents · 5 steps
          </span>
        </div>
      </div>

      {/* ============================================================
          PRE-READY TESTING TOPIC BUTTONS SECTION
          ============================================================ */}
      <div className="mb-10 p-6 rounded-2xl bg-[#080C15] border border-[#252B38] shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#2787FF] to-[#D21BCE] p-[1.5px] shadow-sm shadow-[#2787FF]/10">
              <div className="w-full h-full bg-[#000000] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-4.5 h-4.5 text-[#2787FF]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-base font-semibold text-[#E8EDF7]">Pre-ready testing scenarios</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#2787FF]/15 text-[#2787FF] border border-[#2787FF]/30">
                  1-Click Test &amp; Run
                </span>
              </div>
              <p className="text-xs text-[#A1A9BA] mt-0.5">
                Click any scenario below to automatically populate the configuration, or click <strong>Test &amp; Run</strong> to see live agent results immediately.
              </p>
            </div>
          </div>
        </div>

        {/* Feedback Alert when Preset Loaded */}
        {presetSuccessMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 text-emerald-400 text-xs animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{presetSuccessMsg}</span>
          </div>
        )}

        {/* 4 Pre-Ready Testing Topic Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {TEST_TOPIC_PRESETS.map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            const isPresetReel = preset.platform === 'INSTAGRAM_REEL';
            return (
              <div
                key={preset.id}
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
                onClick={() => handleSelectPreset(preset)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSelectPreset(preset);
                  }
                }}
                className={cn(
                  'group p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between relative overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2787FF]/70',
                  isSelected
                    ? isPresetReel
                      ? 'bg-[#080C15] border-[#D21BCE]/70 shadow-[0_0_24px_rgba(210,27,206,0.16)]'
                      : 'bg-[#080C15] border-[#2787FF]/70 shadow-[0_0_24px_rgba(39,135,255,0.16)]'
                    : 'bg-[#080C15] border-[#252B38] hover:border-[#34445F] hover:-translate-y-0.5'
                )}
              >
                {/* Active Indicator Top Bar */}
                {isSelected && (
                  <div
                    className={cn(
                      'absolute top-0 left-0 right-0 h-1',
                      isPresetReel
                        ? 'bg-gradient-to-r from-[#2787FF] to-[#D21BCE]'
                        : 'bg-[#2787FF]'
                    )}
                  />
                )}

                <div>
                  {/* Category Badge & Platform Indicator */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span
                      className={cn(
                        'px-2 py-0.5 rounded text-[10px] font-semibold font-mono border',
                        isPresetReel
                          ? 'bg-[#000000] text-[#D21BCE] border-[#D21BCE]/30'
                          : 'bg-[#000000] text-[#2787FF] border-[#2787FF]/30'
                      )}
                    >
                      {preset.badge}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-medium text-[#A1A9BA]">
                      {preset.platform === 'LINKEDIN' ? (
                        <>
                          <LinkedInIcon className="w-3.5 h-3.5 text-[#2787FF]" />
                          <span>LinkedIn</span>
                        </>
                      ) : (
                        <>
                          <InstagramIcon className="w-3.5 h-3.5 text-[#D21BCE]" />
                          <span>Reel</span>
                        </>
                      )}
                    </span>
                  </div>

                  {/* Title */}
                  <h4
                    className={cn(
                      'text-sm font-bold text-[#E8EDF7] transition-colors leading-snug mb-1.5',
                      isPresetReel ? 'group-hover:text-[#D21BCE]' : 'group-hover:text-[#2787FF]'
                    )}
                  >
                    {preset.title}
                  </h4>

                  {/* Description */}
                  <p className="text-[11px] text-[#A1A9BA] line-clamp-2 leading-relaxed mb-3">
                    {preset.description}
                  </p>
                </div>

                {/* Card Action Footer */}
                <div className="pt-3 border-t border-[#252B38] flex items-center justify-between gap-2 mt-auto">
                  <span className="text-[10px] text-[#A1A9BA] font-medium">
                    Tone: <strong className="text-[#E8EDF7]">{preset.tone.split(' ')[0]}</strong>
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRunPresetNow(preset);
                    }}
                    onKeyDown={(e) => e.stopPropagation()}
                    aria-label={`Test and run preset: ${preset.title}`}
                    disabled={isSubmitting}
                    className={cn(
                      'px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50',
                      isPresetReel
                        ? 'bg-[#D21BCE]/15 hover:bg-[#D21BCE] text-[#D21BCE] hover:text-white border-[#D21BCE]/30'
                        : 'bg-[#2787FF]/15 hover:bg-[#2787FF] text-[#2787FF] hover:text-white border-[#2787FF]/30'
                    )}
                    title="Run this test scenario directly and view the result"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Test &amp; Run</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ============================================================
          MAIN CONFIGURATION & PIPELINE VISUALIZER GRID
          ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Input Form (Pipeline Parameters styled dynamically: Magenta for Instagram Reel, Electric Blue for LinkedIn) */}
        <div className={cn('lg:col-span-7 bg-[#080C15] border border-[#252B38] transition-colors rounded-2xl p-6 sm:p-8 shadow-card', theme.accentBorderHover)}>
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#252B38]">
            <div>
              <h2 className="font-display text-xl font-semibold text-[#E8EDF7] flex items-center gap-2">
                <Sliders className={cn('w-5 h-5', theme.accentText)} />
                Pipeline parameters
              </h2>
              <p className="text-xs text-[#A1A9BA] mt-1">
                Customize topic details, target audience, and critic iterations.
              </p>
            </div>
            {selectedPresetId && (
              <span className={cn('px-2.5 py-1 rounded-full text-[11px] font-mono border flex items-center gap-1.5', theme.accentBgSubtle, theme.accentText, theme.accentBorderSubtle)}>
                <CheckCircle2 className="w-3.5 h-3.5" />
                Preset Active
              </span>
            )}
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-300 text-sm">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-200">Unable to generate</p>
                <p className="text-xs mt-0.5">{errorMsg}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Topic Input with Enter-to-Submit */}
            <div>
              <label htmlFor="topic" className="block text-sm font-semibold text-[#E8EDF7] mb-2">
                Content Topic or Thesis <span className={theme.accentText}>*</span>
              </label>
              <textarea
                id="topic"
                rows={3}
                value={topic}
                onChange={(e) => {
                  setTopic(e.target.value);
                  setSelectedPresetId(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder="e.g. How autonomous AI coding agents are changing senior engineering workflows in 2026..."
                className={cn(
                  'w-full rounded-xl bg-[#000000] border border-[#252B38] px-4 py-3.5 text-sm text-[#E8EDF7] placeholder-[#5F6A7D] hover:border-[#34445F] focus:outline-none focus:ring-2 transition-colors resize-none',
                  theme.accentRing
                )}
                required
              />
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-[#A1A9BA] mt-2 gap-1.5">
                <span>The Research Agent will automatically gather web sources and statistics for this topic.</span>
                <span className="flex items-center gap-1.5 text-[10px] text-[#E8EDF7] bg-[#000000] px-2 py-0.5 rounded-md border border-[#252B38] shrink-0 self-start sm:self-auto font-mono">
                  <kbd className={cn('px-1 py-0.2 rounded bg-[#080C15] border border-[#252B38] font-bold', theme.accentText)}>Enter ↵</kbd>
                  <span>to start pipeline</span>
                </span>
              </div>
            </div>

            {/* Platform Selection */}
            <div>
              <label className="block text-sm font-semibold text-[#E8EDF7] mb-2">
                Target Platform <span className={theme.accentText}>*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPlatform(PLATFORMS.LINKEDIN)}
                  className={cn(
                    'p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2787FF]/70',
                    platform === PLATFORMS.LINKEDIN
                      ? 'bg-[#2787FF]/15 border-[#2787FF] text-[#E8EDF7] shadow-[0_0_15px_rgba(39,135,255,0.15)]'
                      : 'bg-[#000000] border-[#252B38] text-[#A1A9BA] hover:border-[#34445F] hover:text-[#E8EDF7]'
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-lg bg-[#2787FF]/20 flex items-center justify-center">
                      <LinkedInIcon className={cn('w-4.5 h-4.5', platform === PLATFORMS.LINKEDIN ? 'text-[#2787FF]' : 'text-[#A1A9BA]')} />
                    </div>
                    {platform === PLATFORMS.LINKEDIN && (
                      <CheckCircle2 className="w-4 h-4 text-[#2787FF]" />
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">LinkedIn</div>
                    <div className="text-[11px] text-[#A1A9BA] mt-0.5">4–5 Multi-Angle Posts with CTAs</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPlatform(PLATFORMS.INSTAGRAM_REEL)}
                  className={cn(
                    'p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2787FF]/70',
                    platform === PLATFORMS.INSTAGRAM_REEL
                      ? 'bg-[#D21BCE]/15 border-[#D21BCE] text-[#E8EDF7] shadow-[0_0_15px_rgba(210,27,206,0.15)]'
                      : 'bg-[#000000] border-[#252B38] text-[#A1A9BA] hover:border-[#34445F] hover:text-[#E8EDF7]'
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-lg bg-[#D21BCE]/20 flex items-center justify-center">
                      <Video className={cn('w-4.5 h-4.5', platform === PLATFORMS.INSTAGRAM_REEL ? 'text-[#D21BCE]' : 'text-[#A1A9BA]')} />
                    </div>
                    {platform === PLATFORMS.INSTAGRAM_REEL && (
                      <CheckCircle2 className="w-4 h-4 text-[#D21BCE]" />
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">Instagram Reel</div>
                    <div className="text-[11px] text-[#A1A9BA] mt-0.5">Scene-by-scene script &amp; visuals</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Tone & Audience */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#E8EDF7] mb-2">
                  Tone
                </label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className={cn(
                    'w-full rounded-xl bg-[#000000] border border-[#252B38] px-3.5 py-2.5 text-sm text-[#E8EDF7] hover:border-[#34445F] focus:outline-none focus:ring-2 transition-colors',
                    theme.accentRing
                  )}
                >
                  {DEFAULT_TONES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#E8EDF7] mb-2">
                  Target Audience
                </label>
                <input
                  type="text"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  placeholder="e.g. Founders, Engineers, Creators"
                  className={cn(
                    'w-full rounded-xl bg-[#000000] border border-[#252B38] px-3.5 py-2.5 text-sm text-[#E8EDF7] placeholder-[#5F6A7D] hover:border-[#34445F] focus:outline-none focus:ring-2 transition-colors',
                    theme.accentRing
                  )}
                />
              </div>
            </div>

            {/* Max Iterations Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-[#E8EDF7]">
                  Maximum Review &amp; Refinement Iterations
                </label>
                <span className={cn('px-2.5 py-0.5 text-xs font-semibold rounded-md bg-[#000000] border border-[#252B38] font-mono', theme.accentText, theme.accentBorderSubtle)}>
                  {maxIterations} {maxIterations === 1 ? 'cycle' : 'cycles'}
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={5}
                step={1}
                value={maxIterations}
                onChange={(e) => setMaxIterations(Number(e.target.value))}
                className={cn('w-full h-2 bg-[#252B38] rounded-lg cursor-pointer transition-colors', theme.accentSlider)}
              />
              <div className="flex justify-between text-[11px] text-[#A1A9BA] mt-1">
                <span>1 (Fastest, single review)</span>
                <span>3 (Recommended)</span>
                <span>5 (Maximum rigor)</span>
              </div>
            </div>

            {/* Submit Action: Reactive Dynamic Gradient Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
              className={cn(
                'w-full py-4 px-6 rounded-xl font-bold text-sm tracking-wide text-white shadow-lg transition-all duration-180 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#080C15] hover:scale-[1.01]',
                theme.buttonGradient
              )}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Initializing Multi-Agent System...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Start Autonomous Pipeline</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Multi-Agent Architecture Visualizer & Recent Projects */}
        <div className="lg:col-span-5 space-y-6">
          {/* How Pipeline Works */}
          <div className="bg-[#080C15] border border-[#252B38] rounded-2xl p-6 shadow-card">
            <h3 className="font-display text-base font-semibold text-[#E8EDF7] mb-5 flex items-center gap-2">
              <Layers className="w-4.5 h-4.5 text-[#2787FF]" />
              How the multi-agent pipeline works
            </h3>

            <div className="space-y-4 relative before:absolute before:left-5 before:top-4 before:bottom-4 before:w-[1.5px] before:bg-[#252B38]">
              {/* Agent 1 */}
              <div className="flex items-start gap-4 relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#2787FF] to-[#1E74E0] p-[1.5px] shrink-0 z-10 shadow-sm shadow-[#2787FF]/10">
                  <div className="w-full h-full bg-[#000000] rounded-[10px] flex items-center justify-center">
                    <Search className="w-4.5 h-4.5 text-[#2787FF]" />
                  </div>
                </div>
                <div>
                  <div className="text-[11px] font-bold text-[#2787FF] uppercase tracking-wider">Agent 1</div>
                  <div className="text-sm font-semibold text-[#E8EDF7]">Research Specialist</div>
                  <p className="text-xs text-[#A1A9BA] mt-0.5 leading-relaxed">
                    Gathers real-world sources, key statistics, and checks counter-claims. Zero fabricated claims or fake URLs.
                  </p>
                </div>
              </div>

              {/* Agent 2 */}
              <div className="flex items-start gap-4 relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#2787FF] to-[#D21BCE] p-[1.5px] shrink-0 z-10 shadow-sm shadow-[#D21BCE]/10">
                  <div className="w-full h-full bg-[#000000] rounded-[10px] flex items-center justify-center">
                    <PenTool className="w-4.5 h-4.5 text-[#D21BCE]" />
                  </div>
                </div>
                <div>
                  <div className="text-[11px] font-bold text-[#D21BCE] uppercase tracking-wider">Agent 2</div>
                  <div className="text-sm font-semibold text-[#E8EDF7]">Platform Writer Agent</div>
                  <p className="text-xs text-[#A1A9BA] mt-0.5 leading-relaxed">
                    Drafts 4–5 distinct angles for LinkedIn or timed scripts for Instagram Reels grounded in verified research.
                  </p>
                </div>
              </div>

              {/* Agent 3 */}
              <div className="flex items-start gap-4 relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#2787FF] to-[#D21BCE] p-[1.5px] shrink-0 z-10 shadow-sm shadow-[#D21BCE]/10">
                  <div className="w-full h-full bg-[#000000] rounded-[10px] flex items-center justify-center">
                    <CheckSquare className="w-4.5 h-4.5 text-[#D21BCE]" />
                  </div>
                </div>
                <div>
                  <div className="text-[11px] font-bold text-[#D21BCE] uppercase tracking-wider">Agent 3</div>
                  <div className="text-sm font-semibold text-[#E8EDF7]">Critic &amp; Quality Reviewer</div>
                  <p className="text-xs text-[#A1A9BA] mt-0.5 leading-relaxed">
                    Critiques factual backing, platform suitability, hooks, and clarity. Flags unsupported claims.
                  </p>
                </div>
              </div>

              {/* Feedback Loop */}
              <div className="flex items-start gap-4 relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#D21BCE] to-[#2787FF] p-[1.5px] shrink-0 z-10 shadow-sm shadow-[#2787FF]/10">
                  <div className="w-full h-full bg-[#000000] rounded-[10px] flex items-center justify-center">
                    <Repeat className="w-4.5 h-4.5 text-[#2787FF]" />
                  </div>
                </div>
                <div>
                  <div className="text-[11px] font-bold text-[#2787FF] uppercase tracking-wider">Autonomous Loop</div>
                  <div className="text-sm font-semibold text-[#E8EDF7]">Self-Refinement Cycle</div>
                  <p className="text-xs text-[#A1A9BA] mt-0.5 leading-relaxed">
                    Critic feedback routes back to the Writer Agent. It rewrites flawed drafts until approved or max iterations reached.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Completed Projects / View Existing Results */}
          {recentProjects.length > 0 && (
            <div className="bg-[#080C15] border border-[#252B38] rounded-2xl p-6 shadow-card">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#252B38]">
                <h3 className="text-sm font-bold text-[#E8EDF7] flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#2787FF]" />
                  <span>Recent Generated Projects</span>
                </h3>
                <span className="text-[11px] font-mono text-[#A1A9BA]">
                  {recentProjects.length} {recentProjects.length === 1 ? 'project' : 'projects'}
                </span>
              </div>

              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {recentProjects.slice(0, 5).map((p) => (
                  <Link
                    key={p.id}
                    to={`/project/${p.id}`}
                    className="p-3 rounded-xl bg-[#000000] hover:bg-[#080C15] border border-[#252B38] hover:border-[#34445F] transition-all flex items-center justify-between gap-3 group"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-semibold text-[#2787FF]">
                          {p.platform === 'LINKEDIN' ? 'LinkedIn' : 'Instagram Reel'}
                        </span>
                        <span className="text-[10px] text-[#A1A9BA]">&bull;</span>
                        <span className="text-[10px] text-[#A1A9BA] truncate">{p.tone}</span>
                      </div>
                      <h5 className="text-xs font-semibold text-[#E8EDF7] truncate group-hover:text-[#2787FF] transition-colors">
                        {p.title}
                      </h5>
                    </div>
                    <ExternalLink className="w-4 h-4 text-[#A1A9BA] group-hover:text-[#2787FF] group-hover:translate-x-0.5 transition-all shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Guarantee Pill */}
          <div className="p-4 rounded-xl bg-[#080C15] border border-[#252B38] text-xs text-[#A1A9BA] flex items-center justify-between shadow-card">
            <span className="flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-[#2787FF]" />
              <span>Product Guarantee:</span>
            </span>
            <span className="font-semibold text-[#E8EDF7]">No fabricated facts &bull; Full iteration history</span>
          </div>
        </div>
      </div>
    </div>
  );
};
