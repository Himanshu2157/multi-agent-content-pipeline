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
  const isResearchDone = !!generation.researchResult || status !== 'RESEARCHING';
  const isResearchRunning = status === 'RESEARCHING';

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
    <div className="bg-forge-900/60 border border-forge-800 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-forge-800 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base">Multi-Agent Content Pipeline</h3>
            <p className="text-xs text-forge-400">
              Autonomous execution &bull; Grounded research &bull; Self-correcting loop
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-forge-950 border border-forge-800 text-xs font-mono text-forge-300 flex items-center gap-2">
            <Repeat className="w-3.5 h-3.5 text-brand-400" />
            <span>
              Iteration {currentIteration} / {maxIterations}
            </span>
          </div>

          {isCompleted && (
            <span
              className={cn(
                'px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5',
                approved
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
              )}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{approved ? 'Quality Approved' : 'Completed (Best Available)'}</span>
            </span>
          )}

          {isFailed && (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/30 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Execution Failed</span>
            </span>
          )}
        </div>
      </div>

      {/* Visual Pipeline Progression Steps */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Step 1: Research Agent */}
        <div
          className={cn(
            'p-4 rounded-xl border transition-all relative overflow-hidden',
            isResearchRunning
              ? 'bg-blue-500/10 border-blue-500/40 text-white shadow-lg shadow-blue-500/5'
              : isResearchDone
              ? 'bg-forge-950/60 border-forge-800 text-forge-200'
              : 'bg-forge-950/30 border-forge-900 text-forge-500'
          )}
        >
          {isResearchRunning && (
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-blue-500 animate-pulse" />
          )}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  'w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold',
                  isResearchDone ? 'bg-emerald-500/20 text-emerald-400' : 'bg-forge-800 text-forge-400'
                )}
              >
                {isResearchDone ? <CheckCircle2 className="w-4 h-4" /> : <Search className="w-4 h-4" />}
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-forge-400">Step 1</span>
            </div>
            {isResearchRunning && (
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
            )}
          </div>
          <div className="font-semibold text-sm text-white">Research Agent</div>
          <p className="text-[11px] text-forge-400 mt-1">
            {isResearchRunning
              ? 'Searching web & extracting facts...'
              : isResearchDone
              ? `${generation.researchResult?.sources?.length || 3} sources grounded`
              : 'Awaiting execution'}
          </p>
        </div>

        {/* Step 2: Writer Agent */}
        <div
          className={cn(
            'p-4 rounded-xl border transition-all relative overflow-hidden',
            isWriterRunning
              ? 'bg-emerald-500/10 border-emerald-500/40 text-white shadow-lg shadow-emerald-500/5'
              : isWriterDone
              ? 'bg-forge-950/60 border-forge-800 text-forge-200'
              : 'bg-forge-950/30 border-forge-900 text-forge-500'
          )}
        >
          {isWriterRunning && (
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-emerald-500 animate-pulse" />
          )}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  'w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold',
                  isWriterDone ? 'bg-emerald-500/20 text-emerald-400' : 'bg-forge-800 text-forge-400'
                )}
              >
                {isWriterDone ? <CheckCircle2 className="w-4 h-4" /> : <PenTool className="w-4 h-4" />}
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-forge-400">Step 2</span>
            </div>
            {isWriterRunning && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            )}
          </div>
          <div className="font-semibold text-sm text-white">Writer Agent</div>
          <p className="text-[11px] text-forge-400 mt-1">
            {isWriterRunning
              ? `Drafting iteration ${currentIteration}...`
              : isWriterDone
              ? `Draft ${currentIteration} completed`
              : 'Awaiting research'}
          </p>
        </div>

        {/* Step 3: Critic Agent */}
        <div
          className={cn(
            'p-4 rounded-xl border transition-all relative overflow-hidden',
            isCriticRunning
              ? 'bg-amber-500/10 border-amber-500/40 text-white shadow-lg shadow-amber-500/5'
              : isCriticDone
              ? 'bg-forge-950/60 border-forge-800 text-forge-200'
              : 'bg-forge-950/30 border-forge-900 text-forge-500'
          )}
        >
          {isCriticRunning && (
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-amber-500 animate-pulse" />
          )}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  'w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold',
                  isCriticDone ? 'bg-emerald-500/20 text-emerald-400' : 'bg-forge-800 text-forge-400'
                )}
              >
                {isCriticDone ? <CheckCircle2 className="w-4 h-4" /> : <CheckSquare className="w-4 h-4" />}
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-forge-400">Step 3</span>
            </div>
            {isCriticRunning && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            )}
          </div>
          <div className="font-semibold text-sm text-white">Critic Agent</div>
          <p className="text-[11px] text-forge-400 mt-1">
            {isCriticRunning
              ? 'Validating facts & rules...'
              : isCriticDone
              ? `Review ${currentIteration} completed`
              : 'Awaiting draft'}
          </p>
        </div>

        {/* Step 4: Autonomous Loop / Approval */}
        <div
          className={cn(
            'p-4 rounded-xl border transition-all relative overflow-hidden',
            isCompleted
              ? approved
                ? 'bg-emerald-500/10 border-emerald-500/40 text-white'
                : 'bg-amber-500/10 border-amber-500/40 text-white'
              : 'bg-forge-950/30 border-forge-900 text-forge-500'
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  'w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold',
                  isCompleted && approved
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : isCompleted
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'bg-forge-800 text-forge-400'
                )}
              >
                <Repeat className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-forge-400">Loop</span>
            </div>
          </div>
          <div className="font-semibold text-sm text-white">Self-Refinement</div>
          <p className="text-[11px] text-forge-400 mt-1">
            {isCompleted
              ? approved
                ? 'Quality standards satisfied'
                : 'Max iteration reached'
              : currentIteration > 1
              ? `Refining cycle ${currentIteration}`
              : 'Awaiting evaluation'}
          </p>
        </div>
      </div>

      {/* Execution Log Metadata */}
      {latestExecution && (
        <div className="p-3 rounded-xl bg-forge-950/60 border border-forge-800/80 flex items-center justify-between text-xs text-forge-400">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-brand-400" />
            <span>
              Active Execution:{' '}
              <strong className="text-forge-200">{latestExecution.agentType} AGENT</strong> (Iteration{' '}
              {latestExecution.iteration})
            </span>
          </div>
          <span className="font-mono text-[11px] text-forge-500">
            Started: {new Date(latestExecution.startedAt).toLocaleTimeString()}
          </span>
        </div>
      )}
    </div>
  );
};
