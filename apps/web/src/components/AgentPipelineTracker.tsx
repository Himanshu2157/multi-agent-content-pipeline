import React from 'react';
import {
  Search,
  PenTool,
  CheckSquare,
  Repeat,
  CheckCircle2,
  Clock,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import type {
  ContentGenerationDTO,
} from '@contentforge/shared';
import { cn } from '../lib/utils.js';

interface AgentPipelineTrackerProps {
  generation: ContentGenerationDTO;
  maxIterations: number;
}

export const AgentPipelineTracker: React.FC<AgentPipelineTrackerProps> = ({
  generation,
  maxIterations,
}) => {
  const { status, currentIteration, approved, agentExecutions } = generation;

  // Compute status of each agent node based on actual DB records
  const isAnalyzerDone = !!generation.topicAnalysis || status !== 'ANALYZING';
  const isAnalyzerRunning = status === 'ANALYZING';

  const isResearchDone = !!generation.researchResult || (status !== 'ANALYZING' && status !== 'RESEARCHING');
  const isResearchRunning = status === 'RESEARCHING';

  const isStrategistDone = !!generation.strategy || (status !== 'ANALYZING' && status !== 'RESEARCHING' && status !== 'STRATEGIZING');
  const isStrategistRunning = status === 'STRATEGIZING';

  const isWriterRunning = status === 'WRITING';
  const isWriterDone =
    (generation.drafts && generation.drafts.length >= currentIteration) ||
    status === 'REVIEWING' ||
    status === 'COMPLETED';

  const isCriticRunning = status === 'REVIEWING';
  const isCriticDone =
    (generation.criticReviews && generation.criticReviews.length >= currentIteration) ||
    status === 'COMPLETED';

  const isCompleted = status === 'COMPLETED';
  const isFailed = status === 'FAILED';

  // Last execution time or active agent
  const latestExecution =
    agentExecutions && agentExecutions.length > 0
      ? agentExecutions[agentExecutions.length - 1]
      : null;

  return (
    <div className="bg-[#111A27]/85 backdrop-blur-md border border-[#202C3D] rounded-2xl p-6 shadow-card">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-[#202C3D] gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0077B5] to-[#1685FF] p-[1.5px] shadow-sm shadow-blue-500/10">
            <div className="w-full h-full bg-[#0B0F17] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-4.5 h-4.5 text-[#1685FF]" />
            </div>
          </div>
          <div>
            <h3 className="font-bold text-white text-base">Multi-Agent Content Pipeline</h3>
            <p className="text-xs text-[#7F8BA0]">
              Autonomous execution &bull; Strict Topic Fidelity &bull; Self-correcting loop
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-[#0B0F17] border border-[#202C3D] text-xs font-mono text-[#D2D8E2] flex items-center gap-2">
            <Repeat className="w-3.5 h-3.5 text-[#1685FF]" />
            <span>
              Iteration {currentIteration} / {maxIterations}
            </span>
          </div>

          {isCompleted && (
            <span
              className={cn(
                'px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5',
                approved
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              )}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{approved ? 'Quality Approved' : 'Completed (Best Available)'}</span>
            </span>
          )}

          {isFailed && (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Execution Failed</span>
            </span>
          )}
        </div>
      </div>

      {/* Visual Pipeline Progression Steps (5 Agents) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        {/* Step 1: Topic Analyzer */}
        <div
          className={cn(
            'p-3.5 rounded-xl border transition-all relative overflow-hidden',
            isAnalyzerRunning
              ? 'bg-gradient-to-r from-[#0077B5]/15 to-[#1685FF]/15 border-[#1685FF] text-white shadow-[0_0_12px_rgba(22,133,255,0.15)]'
              : isAnalyzerDone
              ? 'bg-[#0B0F17] border-[#202C3D] text-[#D2D8E2]'
              : 'bg-[#0B0F17]/40 border-[#202C3D]/50 text-[#7F8BA0]'
          )}
        >
          {isAnalyzerRunning && (
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#1685FF] animate-pulse" />
          )}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  'w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold',
                  isAnalyzerDone ? 'bg-emerald-500/15 text-emerald-400' : 'bg-[#151F2E] text-[#7F8BA0]'
                )}
              >
                {isAnalyzerDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7F8BA0]">Step 1</span>
            </div>
            {isAnalyzerRunning && (
              <span className="w-2 h-2 rounded-full bg-[#1685FF] animate-ping" />
            )}
          </div>
          <div className="font-semibold text-xs text-white">Topic Analyzer</div>
          <p className="text-[10px] text-[#7F8BA0] mt-1 line-clamp-1">
            {isAnalyzerRunning
              ? 'Deriving intent & guardrails...'
              : isAnalyzerDone
              ? 'Topic guardrails locked'
              : 'Awaiting start'}
          </p>
        </div>

        {/* Step 2: Research Agent */}
        <div
          className={cn(
            'p-3.5 rounded-xl border transition-all relative overflow-hidden',
            isResearchRunning
              ? 'bg-gradient-to-r from-[#0077B5]/15 to-[#1685FF]/15 border-[#1685FF] text-white shadow-[0_0_12px_rgba(22,133,255,0.15)]'
              : isResearchDone
              ? 'bg-[#0B0F17] border-[#202C3D] text-[#D2D8E2]'
              : 'bg-[#0B0F17]/40 border-[#202C3D]/50 text-[#7F8BA0]'
          )}
        >
          {isResearchRunning && (
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#1685FF] animate-pulse" />
          )}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  'w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold',
                  isResearchDone ? 'bg-emerald-500/15 text-emerald-400' : 'bg-[#151F2E] text-[#7F8BA0]'
                )}
              >
                {isResearchDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Search className="w-3.5 h-3.5" />}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7F8BA0]">Step 2</span>
            </div>
            {isResearchRunning && (
              <span className="w-2 h-2 rounded-full bg-[#1685FF] animate-ping" />
            )}
          </div>
          <div className="font-semibold text-xs text-white">Research Agent</div>
          <p className="text-[10px] text-[#7F8BA0] mt-1 line-clamp-1">
            {isResearchRunning
              ? 'Gathering domain facts...'
              : isResearchDone
              ? `${generation.researchResult?.sources?.length || 2}+ sources grounded`
              : 'Awaiting intent'}
          </p>
        </div>

        {/* Step 3: Content Strategist */}
        <div
          className={cn(
            'p-3.5 rounded-xl border transition-all relative overflow-hidden',
            isStrategistRunning
              ? 'bg-gradient-to-r from-[#0077B5]/15 to-[#1685FF]/15 border-[#1685FF] text-white shadow-[0_0_12px_rgba(22,133,255,0.15)]'
              : isStrategistDone
              ? 'bg-[#0B0F17] border-[#202C3D] text-[#D2D8E2]'
              : 'bg-[#0B0F17]/40 border-[#202C3D]/50 text-[#7F8BA0]'
          )}
        >
          {isStrategistRunning && (
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#1685FF] animate-pulse" />
          )}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  'w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold',
                  isStrategistDone ? 'bg-emerald-500/15 text-emerald-400' : 'bg-[#151F2E] text-[#7F8BA0]'
                )}
              >
                {isStrategistDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7F8BA0]">Step 3</span>
            </div>
            {isStrategistRunning && (
              <span className="w-2 h-2 rounded-full bg-[#1685FF] animate-ping" />
            )}
          </div>
          <div className="font-semibold text-xs text-white">Content Strategist</div>
          <p className="text-[10px] text-[#7F8BA0] mt-1 line-clamp-1">
            {isStrategistRunning
              ? 'Formulating angles...'
              : isStrategistDone
              ? `${generation.strategy?.angles?.length || 5} angles planned`
              : 'Awaiting research'}
          </p>
        </div>

        {/* Step 4: Writer Agent */}
        <div
          className={cn(
            'p-3.5 rounded-xl border transition-all relative overflow-hidden',
            isWriterRunning
              ? 'bg-gradient-to-r from-[#0077B5]/15 to-[#1685FF]/15 border-[#1685FF] text-white shadow-[0_0_12px_rgba(22,133,255,0.15)]'
              : isWriterDone
              ? 'bg-[#0B0F17] border-[#202C3D] text-[#D2D8E2]'
              : 'bg-[#0B0F17]/40 border-[#202C3D]/50 text-[#7F8BA0]'
          )}
        >
          {isWriterRunning && (
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#1685FF] animate-pulse" />
          )}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  'w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold',
                  isWriterDone ? 'bg-emerald-500/15 text-emerald-400' : 'bg-[#151F2E] text-[#7F8BA0]'
                )}
              >
                {isWriterDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : <PenTool className="w-3.5 h-3.5" />}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7F8BA0]">Step 4</span>
            </div>
            {isWriterRunning && (
              <span className="w-2 h-2 rounded-full bg-[#1685FF] animate-ping" />
            )}
          </div>
          <div className="font-semibold text-xs text-white">Writer Agent</div>
          <p className="text-[10px] text-[#7F8BA0] mt-1 line-clamp-1">
            {isWriterRunning
              ? `Drafting iteration ${currentIteration}...`
              : isWriterDone
              ? `Draft ${currentIteration} ready`
              : 'Awaiting strategy'}
          </p>
        </div>

        {/* Step 5: Critic Agent & Loop */}
        <div
          className={cn(
            'p-3.5 rounded-xl border transition-all relative overflow-hidden',
            isCriticRunning
              ? 'bg-gradient-to-r from-[#0077B5]/15 to-[#1685FF]/15 border-[#1685FF] text-white shadow-[0_0_12px_rgba(22,133,255,0.15)]'
              : isCriticDone
              ? approved
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-[#0B0F17] border-[#202C3D] text-[#D2D8E2]'
              : 'bg-[#0B0F17]/40 border-[#202C3D]/50 text-[#7F8BA0]'
          )}
        >
          {isCriticRunning && (
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#1685FF] animate-pulse" />
          )}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  'w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold',
                  isCriticDone && approved
                    ? 'bg-emerald-500/15 text-emerald-400'
                    : isCriticDone
                    ? 'bg-amber-500/15 text-amber-400'
                    : 'bg-[#151F2E] text-[#7F8BA0]'
                )}
              >
                {isCriticDone ? <CheckSquare className="w-3.5 h-3.5" /> : <CheckSquare className="w-3.5 h-3.5" />}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7F8BA0]">Step 5</span>
            </div>
            {isCriticRunning && (
              <span className="w-2 h-2 rounded-full bg-[#1685FF] animate-ping" />
            )}
          </div>
          <div className="font-semibold text-xs text-white">Critic & Loop</div>
          <p className="text-[10px] text-[#7F8BA0] mt-1 line-clamp-1">
            {isCriticRunning
              ? 'Auditing topic fidelity...'
              : isCriticDone
              ? approved
                ? 'Approved (>=90 fidelity)'
                : `Refined cycle ${currentIteration}`
              : 'Awaiting draft'}
          </p>
        </div>
      </div>

      {/* Execution Log Metadata */}
      {latestExecution && (
        <div className="p-3 rounded-xl bg-[#0B0F17] border border-[#202C3D] flex items-center justify-between text-xs text-[#7F8BA0]">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-[#1685FF]" />
            <span>
              Active Execution:{' '}
              <strong className="text-[#F5F7FA]">{latestExecution.agentType} AGENT</strong> (Iteration{' '}
              {latestExecution.iteration})
            </span>
          </div>
          <span className="font-mono text-[11px] text-[#7F8BA0]">
            Started: {new Date(latestExecution.startedAt).toLocaleTimeString()}
          </span>
        </div>
      )}
    </div>
  );
};
