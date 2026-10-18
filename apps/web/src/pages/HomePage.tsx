import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
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
} from 'lucide-react';
import { LinkedInIcon } from '../components/icons.js';
import { api } from '../services/api.js';
import { PLATFORMS, DEFAULT_TONES } from '@contentforge/shared';
import { cn } from '../lib/utils.js';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  // Backend Health Status Check
  const { data: health, isLoading: isHealthLoading, isError: isHealthError } = useQuery({
    queryKey: ['health'],
    queryFn: api.getHealth,
    refetchInterval: 10000,
  });

  // Form State
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState<'LINKEDIN' | 'INSTAGRAM_REEL'>(PLATFORMS.LINKEDIN);
  const [tone, setTone] = useState<string>(DEFAULT_TONES[0]);
  const [audience, setAudience] = useState('Tech professionals & software developers');
  const [maxIterations, setMaxIterations] = useState<number>(3);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      setErrorMsg('Please enter a topic for the content generation pipeline.');
      return;
    }

    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const { project } = await api.createProject({
        topic: topic.trim(),
        platform,
        tone,
        audience,
        maxIterations,
      });

      // Navigate to project generation page
      navigate(`/project/${project.id}`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create content project. Please check if backend is running.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Backend Status Bar */}
      <div className="flex items-center justify-between pb-6 mb-8 border-b border-forge-700">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-forge-400" />
          <span className="text-xs font-medium text-forge-400">Backend Connectivity:</span>
          {isHealthLoading ? (
            <span className="text-xs text-forge-400 animate-pulse">Checking health...</span>
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

        <div className="text-xs text-forge-400">
          Autonomous Architecture: <span className="text-forge-200 font-mono">LangGraph State Machine</span>
        </div>
      </div>

      {/* Hero Headline */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-forge-900 border border-forge-700 text-xs font-semibold text-[#1685FF] mb-4 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#0A66C2]" />
          Autonomous Multi-Agent Content Pipeline
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
          Don't refine prompts.{' '}
          <span className="text-[#0A66C2]">
            Let AI research, critique & refine itself.
          </span>
        </h1>
        <p className="text-base sm:text-lg text-forge-300 max-w-2xl mx-auto leading-relaxed">
          ContentForge deploys a specialized trio of Research, Writer, and Critic agents that verify facts, enforce platform rules, and iterate autonomously until quality is guaranteed.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Input Form */}
        <div className="lg:col-span-7 bg-forge-900 border border-forge-700 rounded-xl p-6 sm:p-8 shadow-card">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-forge-700">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-[#0A66C2]" />
                Configure Content Generation
              </h2>
              <p className="text-xs text-forge-400 mt-1">
                Enter your topic and let the autonomous agents do the heavy lifting.
              </p>
            </div>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-300 text-sm">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-200">Unable to generate</p>
                <p className="text-xs mt-0.5">{errorMsg}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Topic Input */}
            <div>
              <label htmlFor="topic" className="block text-sm font-semibold text-forge-200 mb-2">
                Content Topic or Thesis <span className="text-[#1685FF]">*</span>
              </label>
              <textarea
                id="topic"
                rows={3}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. How autonomous AI coding agents are changing senior engineering workflows in 2026..."
                className="w-full rounded-lg bg-forge-950 border border-forge-700 px-4 py-3 text-sm text-forge-100 placeholder-forge-400 focus:outline-none focus:ring-1 focus:ring-[#0A66C2] focus:border-[#0A66C2] transition-colors resize-none"
                required
              />
              <p className="text-[11px] text-forge-400 mt-1.5 flex items-center gap-1">
                <span>The Research Agent will automatically gather web sources and statistics for this topic.</span>
              </p>
            </div>

            {/* Platform Selection */}
            <div>
              <label className="block text-sm font-semibold text-forge-200 mb-2">
                Target Platform <span className="text-[#1685FF]">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPlatform(PLATFORMS.LINKEDIN)}
                  className={cn(
                    'p-4 rounded-lg border text-left transition-all relative flex flex-col justify-between cursor-pointer',
                    platform === PLATFORMS.LINKEDIN
                      ? 'bg-[#0A66C2]/10 border-[#0A66C2] text-white shadow-sm'
                      : 'bg-forge-950 border-forge-700 text-forge-300 hover:border-forge-600 hover:text-white'
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <LinkedInIcon className={cn('w-5 h-5', platform === PLATFORMS.LINKEDIN ? 'text-[#0A66C2]' : 'text-forge-400')} />
                    {platform === PLATFORMS.LINKEDIN && (
                      <CheckCircle2 className="w-4 h-4 text-[#0A66C2]" />
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">LinkedIn</div>
                    <div className="text-[11px] text-forge-400 mt-0.5">4–5 Multi-Angle Posts with CTAs</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPlatform(PLATFORMS.INSTAGRAM_REEL)}
                  className={cn(
                    'p-4 rounded-lg border text-left transition-all relative flex flex-col justify-between cursor-pointer',
                    platform === PLATFORMS.INSTAGRAM_REEL
                      ? 'bg-purple-950/20 border-[#E1306C]/60 text-white shadow-sm'
                      : 'bg-forge-950 border-forge-700 text-forge-300 hover:border-forge-600 hover:text-white'
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Video className={cn('w-5 h-5', platform === PLATFORMS.INSTAGRAM_REEL ? 'text-[#E1306C]' : 'text-forge-400')} />
                    {platform === PLATFORMS.INSTAGRAM_REEL && (
                      <CheckCircle2 className="w-4 h-4 text-[#E1306C]" />
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">Instagram Reel</div>
                    <div className="text-[11px] text-forge-400 mt-0.5">Scene-by-scene script & visuals</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Tone & Audience */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-forge-200 mb-2">
                  Tone
                </label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full rounded-lg bg-forge-950 border border-forge-700 px-3.5 py-2.5 text-sm text-forge-200 focus:outline-none focus:ring-1 focus:ring-[#0A66C2] focus:border-[#0A66C2]"
                >
                  {DEFAULT_TONES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-forge-200 mb-2">
                  Target Audience
                </label>
                <input
                  type="text"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  placeholder="e.g. Founders, Engineers, Creators"
                  className="w-full rounded-lg bg-forge-950 border border-forge-700 px-3.5 py-2.5 text-sm text-forge-200 placeholder-forge-400 focus:outline-none focus:ring-1 focus:ring-[#0A66C2] focus:border-[#0A66C2]"
                />
              </div>
            </div>

            {/* Max Iterations Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-forge-200">
                  Maximum Review & Refinement Iterations
                </label>
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded bg-forge-800 text-[#1685FF] border border-forge-700">
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
                className="w-full accent-[#0A66C2] h-2 bg-forge-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-forge-400 mt-1">
                <span>1 (Fastest, single review)</span>
                <span>3 (Recommended)</span>
                <span>5 (Maximum rigor)</span>
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 rounded-lg font-bold text-sm bg-[#0A66C2] hover:bg-[#1685FF] text-white shadow-sm transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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

        {/* Right Column: Multi-Agent Architecture Visualizer */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-forge-900 border border-forge-700 rounded-xl p-6 shadow-card">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#0A66C2]" />
              How the Multi-Agent Pipeline Works
            </h3>

            <div className="space-y-3 relative before:absolute before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-forge-700">
              {/* Agent 1 */}
              <div className="flex items-start gap-3.5 relative">
                <div className="w-8 h-8 rounded-lg bg-[#0A66C2]/10 border border-[#0A66C2]/30 flex items-center justify-center shrink-0 z-10 bg-forge-950">
                  <Search className="w-4 h-4 text-[#1685FF]" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#1685FF] uppercase tracking-wider">Agent 1</div>
                  <div className="text-sm font-semibold text-white">Research Specialist</div>
                  <p className="text-xs text-forge-400 mt-0.5">
                    Gathers real-world sources, key statistics, and checks counter-claims. Does not fabricate URLs or data.
                  </p>
                </div>
              </div>

              {/* Agent 2 */}
              <div className="flex items-start gap-3.5 relative">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center shrink-0 z-10 bg-forge-950">
                  <PenTool className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <div className="text-xs font-bold text-blue-400 uppercase tracking-wider">Agent 2</div>
                  <div className="text-sm font-semibold text-white">Platform Writer Agent</div>
                  <p className="text-xs text-forge-400 mt-0.5">
                    Drafts 4–5 distinct angles for LinkedIn or timed scripts for Instagram Reels grounded in the verified research.
                  </p>
                </div>
              </div>

              {/* Agent 3 */}
              <div className="flex items-start gap-3.5 relative">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 z-10 bg-forge-950">
                  <CheckSquare className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">Agent 3</div>
                  <div className="text-sm font-semibold text-white">Critic & Quality Reviewer</div>
                  <p className="text-xs text-forge-400 mt-0.5">
                    Critiques factual backing, platform suitability, hooks, and clarity. Flags unsupported claims.
                  </p>
                </div>
              </div>

              {/* Feedback Loop */}
              <div className="flex items-start gap-3.5 relative">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center shrink-0 z-10 bg-forge-950">
                  <Repeat className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <div className="text-xs font-bold text-purple-400 uppercase tracking-wider">Autonomous Loop</div>
                  <div className="text-sm font-semibold text-white">Self-Refinement Cycle</div>
                  <p className="text-xs text-forge-400 mt-0.5">
                    Critic feedback is routed back to the Writer Agent. It rewrites flawed drafts until approved or max iterations reached.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-forge-950 border border-forge-700 text-xs text-forge-400 flex items-center justify-between shadow-card">
            <span>Product Guarantee:</span>
            <span className="font-semibold text-forge-200">No fabricated facts • Full iteration history</span>
          </div>
        </div>
      </div>
    </div>
  );
};
