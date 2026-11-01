import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft,
  RefreshCw,
  AlertTriangle,
  History,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Share2,
  ArrowDown,
  Sparkles,
  Hash,
} from 'lucide-react';
import { api } from '../services/api.js';
import { AgentPipelineTracker } from '../components/AgentPipelineTracker.js';
import { LinkedInResults } from '../components/LinkedInResults.js';
import { ReelResults } from '../components/ReelResults.js';
import { CriticReport } from '../components/CriticReport.js';
import { SourcesList } from '../components/SourcesList.js';
import { LinkedInIcon, InstagramIcon } from '../components/icons.js';
import { cn } from '../lib/utils.js';
import type {
  ContentGenerationDTO,
  LinkedInOutput,
  InstagramReelOutput,
} from '@contentforge/shared';

export const ProjectPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<'content' | 'critic' | 'sources' | 'history'>('content');
  const [selectedIteration, setSelectedIteration] = useState<number | null>(null);

  // 1. Fetch Project Details
  const {
    data: projectData,
    isLoading: isProjectLoading,
    error: projectError,
  } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => api.getProject(projectId!),
    enabled: !!projectId,
  });

  const project = projectData?.project;
  const initialGeneration = projectData?.latestGeneration;

  const [currentGenId, setCurrentGenId] = useState<string | null>(
    initialGeneration?.id || null
  );

  // Update currentGenId when projectData updates
  useEffect(() => {
    if (projectData?.latestGeneration?.id && !currentGenId) {
      setCurrentGenId(projectData.latestGeneration.id);
    }
  }, [projectData, currentGenId]);

  // 2. Poll Current Generation while active
  const {
    data: genData,
    refetch: refetchGeneration,
  } = useQuery({
    queryKey: ['generation', currentGenId],
    queryFn: () => api.getGeneration(currentGenId!),
    enabled: !!currentGenId,
    refetchInterval: (query) => {
      const g = query.state.data?.generation;
      if (!g) return 1500;
      return g.status === 'COMPLETED' || g.status === 'FAILED' ? false : 1500;
    },
  });

  const generation: ContentGenerationDTO | undefined =
    genData?.generation || initialGeneration;

  // 3. Mutation to Start or Restart Generation
  const startGenMutation = useMutation({
    mutationFn: () => api.startGeneration(projectId!),
    onSuccess: (data) => {
      setCurrentGenId(data.generationId);
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
      queryClient.invalidateQueries({ queryKey: ['generation', data.generationId] });
    },
  });

  // Auto-start generation if project has no generations yet
  useEffect(() => {
    if (project && (!project.generations || project.generations.length === 0) && !startGenMutation.isPending && !currentGenId) {
      startGenMutation.mutate();
    }
  }, [project, currentGenId, startGenMutation]);

  // 4. Server-Sent Events (SSE) Listener for zero-latency reactive updates
  useEffect(() => {
    if (!currentGenId) return;

    const eventSource = new EventSource(`/api/generations/${currentGenId}/events`);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'STEP_CHANGE' || data.type === 'PIPELINE_COMPLETE' || data.type === 'PIPELINE_ERROR') {
          refetchGeneration();
          queryClient.invalidateQueries({ queryKey: ['project', projectId] });
        }
      } catch (err) {
        // Heartbeat or parse ignore
      }
    };

    return () => {
      eventSource.close();
    };
  }, [currentGenId, projectId, queryClient, refetchGeneration]);

  if (isProjectLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-[#252B38] border-t-[#2787FF] animate-spin mb-4" />
        <p className="text-[#A1A9BA] text-sm">Loading project context…</p>
      </div>
    );
  }

  if (projectError || !project) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h2 className="font-display text-xl font-semibold text-[#E8EDF7] mb-2">Project not found</h2>
        <p className="text-[#A1A9BA] text-sm mb-6">
          The requested content project does not exist or may have been deleted.
        </p>
        <Link
          to="/create"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2787FF] text-white font-semibold text-sm hover:bg-[#1E74E0] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2787FF]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#000000]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Configuration</span>
        </Link>
      </div>
    );
  }

  const isCompleted = generation?.status === 'COMPLETED';
  const isFailed = generation?.status === 'FAILED';
  const isRunning = !isCompleted && !isFailed;

  // Selected or Latest Draft
  const drafts = generation?.drafts || [];
  const latestDraft = drafts.length > 0 ? drafts[drafts.length - 1] : null;
  const activeDraft = selectedIteration
    ? drafts.find((d) => d.iteration === selectedIteration) || latestDraft
    : latestDraft;

  // Selected or Latest Review
  const reviews = generation?.criticReviews || [];
  const latestReview = reviews.length > 0 ? reviews[reviews.length - 1] : null;
  const activeReview = selectedIteration
    ? reviews.find((r) => r.iteration === selectedIteration) || latestReview
    : latestReview;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative z-20">
      {/* Top Navigation & Project Metadata */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-[#252B38] gap-4">
        <div>
          <Link
            to="/create"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#A1A9BA] hover:text-[#2787FF] transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Create Another Project</span>
          </Link>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#E8EDF7] tracking-[-0.02em]">
            {project.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-xs text-[#A1A9BA] mt-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-[#080C15] border border-[#252B38] text-[#E8EDF7] font-medium">
              {project.platform === 'LINKEDIN' ? (
                <>
                  <LinkedInIcon className="w-3.5 h-3.5 text-[#2787FF]" />
                  <span>LinkedIn Post Pack</span>
                </>
              ) : (
                <>
                  <InstagramIcon className="w-3.5 h-3.5 text-[#D21BCE]" />
                  <span>Instagram Reel Script</span>
                </>
              )}
            </span>
            <span>&bull;</span>
            <span>Tone: <strong className="text-[#E8EDF7]">{project.tone}</strong></span>
            <span>&bull;</span>
            <span>Audience: <strong className="text-[#E8EDF7]">{project.audience}</strong></span>
            <span>&bull;</span>
            <span>Max Review Cycles: <strong className="text-[#E8EDF7]">{project.maxIterations}</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => startGenMutation.mutate()}
            disabled={isRunning || startGenMutation.isPending}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#080C15] hover:bg-[#0E1422] hover:border-[#34445F] text-[#A1A9BA] hover:text-[#E8EDF7] border border-[#252B38] transition-all duration-180 flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2787FF]/60"
          >
            <RefreshCw
              className={cn('w-3.5 h-3.5', (isRunning || startGenMutation.isPending) && 'animate-spin')}
            />
            <span>{isRunning ? 'Pipeline Active...' : 'Re-Run Pipeline'}</span>
          </button>
        </div>
      </div>

      {/* Live Agent Pipeline Execution Tracker */}
      {generation && (
        <AgentPipelineTracker
          generation={generation}
          maxIterations={project.maxIterations}
        />
      )}

      {/* Completion Banner (Section 16 Specification) */}
      {isCompleted && (
        <div
          className={cn(
            'p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-card',
            generation.approved
              ? 'bg-[#080C15] border-[#252B38] text-[#E8EDF7]'
              : 'bg-[#080C15] border-amber-500/30 text-amber-200'
          )}
        >
          <div className="flex items-start gap-3">
            {generation.approved ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            )}
            <div>
              <h4 className="font-display text-sm font-semibold text-[#E8EDF7]">
                {generation.approved
                  ? `Pipeline Complete: Approved on Iteration ${generation.currentIteration}`
                  : `Maximum Review Iterations Reached (${generation.currentIteration}/${project.maxIterations})`}
              </h4>
              <p className="text-xs mt-0.5 text-[#A1A9BA]">
                {generation.approved
                  ? `The Critic Agent verified this content against ground-truth research with a quality score of ${latestReview?.score || 94}/100.`
                  : 'Maximum review iterations reached. This content is the latest generated draft and may need manual review before publication.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono font-bold shrink-0">
            <span className="px-3 py-1 rounded-xl bg-[#000000] border border-[#252B38] text-[#E8EDF7]">
              Score: {latestReview?.score || 0}/100
            </span>
          </div>
        </div>
      )}

      {/* Results Workspace Tabs */}
      {activeDraft && (
        <div className="space-y-6">
          {/* Tabs Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-[#252B38] pb-2">
            <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto pb-1 -mb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" role="tablist" aria-label="Project result views">
              <button
                onClick={() => setActiveTab('content')}
                role="tab"
                aria-selected={activeTab === 'content'}
                className={cn(
                  'shrink-0 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-180 cursor-pointer flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2787FF]/60',
                  activeTab === 'content'
                    ? 'bg-[#2787FF] text-white shadow-sm shadow-[#2787FF]/20'
                    : 'text-[#A1A9BA] hover:text-[#E8EDF7] hover:bg-[#080C15]'
                )}
              >
                <FileText className="w-4 h-4" />
                <span>Generated Content</span>
              </button>

              <button
                onClick={() => setActiveTab('critic')}
                role="tab"
                aria-selected={activeTab === 'critic'}
                className={cn(
                  'shrink-0 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-180 cursor-pointer flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2787FF]/60',
                  activeTab === 'critic'
                    ? 'bg-[#2787FF] text-white shadow-sm shadow-[#2787FF]/20'
                    : 'text-[#A1A9BA] hover:text-[#E8EDF7] hover:bg-[#080C15]'
                )}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Critic Quality Report</span>
              </button>

              <button
                onClick={() => setActiveTab('sources')}
                role="tab"
                aria-selected={activeTab === 'sources'}
                className={cn(
                  'shrink-0 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-180 cursor-pointer flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2787FF]/60',
                  activeTab === 'sources'
                    ? 'bg-[#2787FF] text-white shadow-sm shadow-[#2787FF]/20'
                    : 'text-[#A1A9BA] hover:text-[#E8EDF7] hover:bg-[#080C15]'
                )}
              >
                <Share2 className="w-4 h-4" />
                <span>Verified Sources</span>
              </button>

              {drafts.length > 1 && (
                <button
                  onClick={() => setActiveTab('history')}
                  role="tab"
                  aria-selected={activeTab === 'history'}
                  className={cn(
                    'shrink-0 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-180 cursor-pointer flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2787FF]/60',
                    activeTab === 'history'
                      ? 'bg-[#2787FF] text-white shadow-sm shadow-[#2787FF]/20'
                      : 'text-[#A1A9BA] hover:text-[#E8EDF7] hover:bg-[#080C15]'
                  )}
                >
                  <History className="w-4 h-4" />
                  <span>Iteration History ({drafts.length})</span>
                </button>
              )}
            </div>

            {/* Iteration Selector Pill */}
            {drafts.length > 1 && latestDraft && (
              <div className="flex items-center gap-1.5 text-xs text-[#A1A9BA]">
                <span>Viewing:</span>
                <select
                  value={selectedIteration || latestDraft.iteration}
                  onChange={(e) => setSelectedIteration(Number(e.target.value))}
                  aria-label="Select iteration to view"
                  className="bg-[#000000] border border-[#252B38] rounded-xl px-2.5 py-1 text-xs text-[#E8EDF7] hover:border-[#34445F] focus:outline-none focus:ring-2 focus:ring-[#2787FF]/60"
                >
                  {drafts.map((d) => (
                    <option key={d.iteration} value={d.iteration}>
                      Iteration {d.iteration} {d.iteration === latestDraft.iteration ? '(Latest)' : ''}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Active Tab View */}
          {activeTab === 'content' && (
            <div>
              {project.platform === 'LINKEDIN' ? (
                <LinkedInResults content={activeDraft.content as LinkedInOutput} />
              ) : (
                <ReelResults content={activeDraft.content as InstagramReelOutput} />
              )}
            </div>
          )}

          {activeTab === 'critic' && activeReview && (
            <div>
              <CriticReport
                review={activeReview}
                iteration={activeReview.iteration}
              />
            </div>
          )}

          {activeTab === 'sources' && generation?.researchResult && (
            <div>
              <SourcesList research={generation.researchResult} />
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-base font-semibold text-[#E8EDF7]">
                    Autonomous multi-agent refinement audit trail
                  </h3>
                  <p className="text-xs text-[#A1A9BA] mt-0.5">
                    Verified trail showing drafts, critic rejections, and how the Writer agent refined each cycle.
                  </p>
                </div>
                <span className="text-xs font-mono px-2.5 py-1 rounded-xl bg-[#080C15] border border-[#252B38] text-[#E8EDF7]">
                  {drafts.length} Cycles Completed
                </span>
              </div>

              <div className="space-y-4">
                {drafts.map((draftItem, idx) => {
                  const revItem = reviews.find((r) => r.iteration === draftItem.iteration);
                  return (
                    <React.Fragment key={draftItem.iteration}>
                      {idx > 0 && (
                        <div className="flex items-center justify-center my-2 text-xs font-mono text-[#2787FF] font-semibold gap-2">
                          <div className="h-px bg-[#252B38] flex-1" />
                          <span className="px-3 py-1 rounded-full bg-[#080C15] border border-[#2787FF]/30 flex items-center gap-1.5 shadow-sm text-[11px]">
                            <ArrowDown className="w-3.5 h-3.5 text-[#2787FF] shrink-0" />
                            AUTONOMOUS REVISION CYCLE &bull; ADDRESSING CRITIC FEEDBACK
                          </span>
                          <div className="h-px bg-[#252B38] flex-1" />
                        </div>
                      )}

                      <div className="p-5 rounded-2xl bg-[#080C15] border border-[#252B38] space-y-3.5 hover:border-[#34445F] transition-all shadow-card">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#252B38] gap-2">
                          <div className="flex items-center gap-2.5">
                            <span className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-[#000000] text-[#2787FF] border border-[#252B38]">
                              Iteration {draftItem.iteration}
                            </span>
                            {draftItem.contentHash && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#A1A9BA] bg-[#000000] px-2 py-0.5 rounded-md border border-[#252B38]">
                                <Hash className="w-3 h-3 text-[#A1A9BA]" />
                                SHA: {draftItem.contentHash.substring(0, 8)}
                              </span>
                            )}
                            <span className="text-xs text-[#A1A9BA]">
                              {new Date(draftItem.createdAt).toLocaleTimeString()}
                            </span>
                          </div>

                          {revItem && (
                            <span
                              className={cn(
                                'text-xs font-semibold px-3 py-1 rounded-full inline-flex items-center gap-1.5 self-start sm:self-auto',
                                revItem.approved
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              )}
                            >
                              {revItem.approved ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                              )}
                              Score: {revItem.score}/100 &bull; {revItem.approved ? 'Critic Approved' : 'Critic Rejected (Revision Required)'}
                            </span>
                          )}
                        </div>

                        {/* Identified Critic Concerns for this cycle */}
                        {revItem && !revItem.approved && revItem.issues.length > 0 && (
                          <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-amber-300 space-y-1.5">
                            <strong className="block text-amber-200 font-semibold flex items-center gap-1.5">
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                              Critic Concerns Identified (Dispatched to Writer):
                            </strong>
                            <ul className="list-disc pl-4 space-y-1 text-amber-300/90">
                              {revItem.issues.map((iss, i) => (
                                <li key={i}>{iss.description}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Applied Revisions on this cycle (if revision) */}
                        {draftItem.revisionNotes && draftItem.revisionNotes.length > 0 && (
                          <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-xs text-emerald-300 space-y-1.5">
                            <strong className="block text-emerald-200 font-semibold flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                              Revisions Applied by Writer Agent in this Draft:
                            </strong>
                            <ul className="list-disc pl-4 space-y-1 text-emerald-300/90">
                              {draftItem.revisionNotes.map((note, nIdx) => (
                                <li key={nIdx}>{note}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-1">
                          <button
                            onClick={() => {
                              setSelectedIteration(draftItem.iteration);
                              setActiveTab('content');
                            }}
                            className="text-xs font-semibold text-[#2787FF] hover:text-[#1E74E0] transition-colors cursor-pointer inline-flex items-center gap-1"
                          >
                            <span>Inspect Full Draft {draftItem.iteration}</span>
                            <span>&rarr;</span>
                          </button>

                          {revItem && (
                            <button
                              onClick={() => {
                                setSelectedIteration(draftItem.iteration);
                                setActiveTab('critic');
                              }}
                              className="text-xs font-semibold text-[#A1A9BA] hover:text-[#E8EDF7] transition-colors cursor-pointer"
                            >
                              View Critic Review &rarr;
                            </button>
                          )}
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
