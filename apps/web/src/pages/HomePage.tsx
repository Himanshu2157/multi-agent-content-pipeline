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
      <div className="flex items-center justify-between pb-6 mb-8 border-b border-[#202C3D]">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#7F8BA0]" />
          <span className="text-xs font-medium text-[#7F8BA0]">Backend Connectivity:</span>
          {isHealthLoading ? (
            <span className="text-xs text-[#7F8BA0] animate-pulse">Checking health...</span>
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

        <div className="text-xs text-[#7F8BA0]">
          Autonomous Architecture: <span className="text-[#D2D8E2] font-mono">LangGraph State Machine</span>
        </div>
      </div>

      {/* Configure Page Header */}
      <div className="mb-8">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7F8BA0] hover:text-[#1685FF] transition-colors mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Overview & Flowchart</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Configure Content Generation
            </h1>
            <p className="text-xs sm:text-sm text-[#7F8BA0] mt-1">
              Define your thesis, select your platform, and dispatch Content<span className="spectrum-gradient-text font-bold">Smith</span>'s multi-agent pipeline.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Input Form */}
        <div className="lg:col-span-7 bg-[#111A27] border border-[#202C3D] rounded-2xl p-6 sm:p-8 shadow-card">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#202C3D]">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-[#1685FF]" />
                Configure Content Generation
              </h2>
              <p className="text-xs text-[#7F8BA0] mt-1">
                Enter your topic and let the autonomous agents do the heavy lifting.
              </p>
            </div>
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
            {/* Topic Input */}
            <div>
              <label htmlFor="topic" className="block text-sm font-semibold text-[#D2D8E2] mb-2">
                Content Topic or Thesis <span className="text-[#1685FF]">*</span>
              </label>
              <textarea
                id="topic"
                rows={3}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. How autonomous AI coding agents are changing senior engineering workflows in 2026..."
                className="w-full rounded-xl bg-[#0B0F17] border border-[#202C3D] px-4 py-3 text-sm text-[#F5F7FA] placeholder-[#7F8BA0] focus:outline-none focus:ring-1 focus:ring-[#1685FF] focus:border-[#1685FF] transition-colors resize-none"
                required
              />
              <p className="text-[11px] text-[#7F8BA0] mt-1.5 flex items-center gap-1">
                <span>The Research Agent will automatically gather web sources and statistics for this topic.</span>
              </p>
            </div>

            {/* Platform Selection */}
            <div>
              <label className="block text-sm font-semibold text-[#D2D8E2] mb-2">
                Target Platform <span className="text-[#1685FF]">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPlatform(PLATFORMS.LINKEDIN)}
                  className={cn(
                    'p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between cursor-pointer',
                    platform === PLATFORMS.LINKEDIN
                      ? 'bg-gradient-to-r from-[#0077B5]/20 to-[#1685FF]/20 border-[#1685FF] text-white shadow-[0_0_15px_rgba(22,133,255,0.15)]'
                      : 'bg-[#0B0F17] border-[#202C3D] text-[#AAB4C5] hover:border-[#35445A] hover:text-white'
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-lg bg-[#0077B5]/20 flex items-center justify-center">
                      <LinkedInIcon className={cn('w-4.5 h-4.5', platform === PLATFORMS.LINKEDIN ? 'text-[#1685FF]' : 'text-[#7F8BA0]')} />
                    </div>
                    {platform === PLATFORMS.LINKEDIN && (
                      <CheckCircle2 className="w-4 h-4 text-[#1685FF]" />
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">LinkedIn</div>
                    <div className="text-[11px] text-[#7F8BA0] mt-0.5">4–5 Multi-Angle Posts with CTAs</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPlatform(PLATFORMS.INSTAGRAM_REEL)}
                  className={cn(
                    'p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between cursor-pointer',
                    platform === PLATFORMS.INSTAGRAM_REEL
                      ? 'bg-gradient-to-r from-[#833AB4]/20 via-[#E1306C]/20 to-[#F77737]/20 border-[#E1306C] text-white shadow-[0_0_15px_rgba(225,48,108,0.15)]'
                      : 'bg-[#0B0F17] border-[#202C3D] text-[#AAB4C5] hover:border-[#35445A] hover:text-white'
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-lg bg-[#E1306C]/20 flex items-center justify-center">
                      <Video className={cn('w-4.5 h-4.5', platform === PLATFORMS.INSTAGRAM_REEL ? 'text-[#E1306C]' : 'text-[#7F8BA0]')} />
                    </div>
                    {platform === PLATFORMS.INSTAGRAM_REEL && (
                      <CheckCircle2 className="w-4 h-4 text-[#E1306C]" />
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">Instagram Reel</div>
                    <div className="text-[11px] text-[#7F8BA0] mt-0.5">Scene-by-scene script & visuals</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Tone & Audience */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#D2D8E2] mb-2">
                  Tone
                </label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full rounded-xl bg-[#0B0F17] border border-[#202C3D] px-3.5 py-2.5 text-sm text-[#F5F7FA] focus:outline-none focus:ring-1 focus:ring-[#1685FF] focus:border-[#1685FF]"
                >
                  {DEFAULT_TONES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#D2D8E2] mb-2">
                  Target Audience
                </label>
                <input
                  type="text"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  placeholder="e.g. Founders, Engineers, Creators"
                  className="w-full rounded-xl bg-[#0B0F17] border border-[#202C3D] px-3.5 py-2.5 text-sm text-[#F5F7FA] placeholder-[#7F8BA0] focus:outline-none focus:ring-1 focus:ring-[#1685FF] focus:border-[#1685FF]"
                />
              </div>
            </div>

            {/* Max Iterations Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-[#D2D8E2]">
                  Maximum Review & Refinement Iterations
                </label>
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-md bg-[#151F2E] text-[#1685FF] border border-[#202C3D]">
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
                className="w-full accent-[#1685FF] h-2 bg-[#151F2E] rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-[#7F8BA0] mt-1">
                <span>1 (Fastest, single review)</span>
                <span>3 (Recommended)</span>
                <span>5 (Maximum rigor)</span>
              </div>
            </div>

            {/* Submit Action: Signature Spectrum Gradient Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-[#0A66C2] via-[#833AB4] to-[#E1306C] hover:opacity-95 text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transition-all duration-180 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1685FF]/50 hover:scale-[1.01]"
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

        {/* Right Column: Multi-Agent Architecture Visualizer (Midnight Spectrum Surface) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#111A27] border border-[#202C3D] rounded-2xl p-6 shadow-card">
            <h3 className="text-base font-bold text-white mb-5 flex items-center gap-2">
              <Layers className="w-4.5 h-4.5 text-[#1685FF]" />
              How the Multi-Agent Pipeline Works
            </h3>

            <div className="space-y-4 relative before:absolute before:left-5 before:top-4 before:bottom-4 before:w-[1.5px] before:bg-[#202C3D]">
              {/* Agent 1 */}
              <div className="flex items-start gap-4 relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0077B5] to-[#1685FF] p-[1.5px] shrink-0 z-10 shadow-sm shadow-blue-500/10">
                  <div className="w-full h-full bg-[#0B0F17] rounded-[10px] flex items-center justify-center">
                    <Search className="w-4.5 h-4.5 text-[#1685FF]" />
                  </div>
                </div>
                <div>
                  <div className="text-[11px] font-bold text-[#1685FF] uppercase tracking-wider">Agent 1</div>
                  <div className="text-sm font-semibold text-white">Research Specialist</div>
                  <p className="text-xs text-[#7F8BA0] mt-0.5 leading-relaxed">
                    Gathers real-world sources, key statistics, and checks counter-claims. Zero fabricated claims or fake URLs.
                  </p>
                </div>
              </div>

              {/* Agent 2 */}
              <div className="flex items-start gap-4 relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#833AB4] to-[#E1306C] p-[1.5px] shrink-0 z-10 shadow-sm shadow-pink-500/10">
                  <div className="w-full h-full bg-[#0B0F17] rounded-[10px] flex items-center justify-center">
                    <PenTool className="w-4.5 h-4.5 text-[#E1306C]" />
                  </div>
                </div>
                <div>
                  <div className="text-[11px] font-bold text-[#E1306C] uppercase tracking-wider">Agent 2</div>
                  <div className="text-sm font-semibold text-white">Platform Writer Agent</div>
                  <p className="text-xs text-[#7F8BA0] mt-0.5 leading-relaxed">
                    Drafts 4–5 distinct angles for LinkedIn or timed scripts for Instagram Reels grounded in the verified research.
                  </p>
                </div>
              </div>

              {/* Agent 3 */}
              <div className="flex items-start gap-4 relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#5B51D8] to-[#833AB4] p-[1.5px] shrink-0 z-10 shadow-sm shadow-purple-500/10">
                  <div className="w-full h-full bg-[#0B0F17] rounded-[10px] flex items-center justify-center">
                    <CheckSquare className="w-4.5 h-4.5 text-[#B845C8]" />
                  </div>
                </div>
                <div>
                  <div className="text-[11px] font-bold text-[#B845C8] uppercase tracking-wider">Agent 3</div>
                  <div className="text-sm font-semibold text-white">Critic & Quality Reviewer</div>
                  <p className="text-xs text-[#7F8BA0] mt-0.5 leading-relaxed">
                    Critiques factual backing, platform suitability, hooks, and clarity. Flags unsupported claims.
                  </p>
                </div>
              </div>

              {/* Feedback Loop */}
              <div className="flex items-start gap-4 relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#E1306C] to-[#F77737] p-[1.5px] shrink-0 z-10 shadow-sm shadow-orange-500/10">
                  <div className="w-full h-full bg-[#0B0F17] rounded-[10px] flex items-center justify-center">
                    <Repeat className="w-4.5 h-4.5 text-[#F77737]" />
                  </div>
                </div>
                <div>
                  <div className="text-[11px] font-bold text-[#F77737] uppercase tracking-wider">Autonomous Loop</div>
                  <div className="text-sm font-semibold text-white">Self-Refinement Cycle</div>
                  <p className="text-xs text-[#7F8BA0] mt-0.5 leading-relaxed">
                    Critic feedback is routed back to the Writer Agent. It rewrites flawed drafts until approved or max iterations reached.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#111A27] border border-[#202C3D] text-xs text-[#7F8BA0] flex items-center justify-between shadow-card">
            <span>Product Guarantee:</span>
            <span className="font-semibold text-[#F5F7FA]">No fabricated facts &bull; Full iteration history</span>
          </div>
        </div>
      </div>
    </div>
  );
};
