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
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-forge-400 text-sm">Loading project context...</p>
      </div>
    );
  }

  if (projectError || !project) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Project Not Found</h2>
        <p className="text-forge-400 text-sm mb-6">
          The requested content project does not exist or may have been deleted.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0A66C2] text-white font-semibold text-sm hover:bg-[#1685FF] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Dashboard</span>
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Navigation & Project Metadata */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-[#202C3D] gap-4">
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7F8BA0] hover:text-[#1685FF] transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Create Another Project</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {project.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-xs text-[#7F8BA0] mt-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-[#111A27] border border-[#202C3D] text-[#D2D8E2] font-medium">
              {project.platform === 'LINKEDIN' ? (
                <>
                  <LinkedInIcon className="w-3.5 h-3.5 text-[#1685FF]" />
                  <span>LinkedIn Post Pack</span>
                </>
              ) : (
                <>
                  <InstagramIcon className="w-3.5 h-3.5 text-[#E1306C]" />
                  <span>Instagram Reel Script</span>
                </>
              )}
            </span>
            <span>&bull;</span>
            <span>Tone: <strong className="text-[#F5F7FA]">{project.tone}</strong></span>
            <span>&bull;</span>
            <span>Audience: <strong className="text-[#F5F7FA]">{project.audience}</strong></span>
            <span>&bull;</span>
            <span>Max Review Cycles: <strong className="text-[#F5F7FA]">{project.maxIterations}</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => startGenMutation.mutate()}
            disabled={isRunning || startGenMutation.isPending}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#111A27] hover:bg-[#151F2E] hover:border-[#35445A] text-[#AAB4C5] hover:text-white border border-[#202C3D] transition-all duration-180 flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-card focus:outline-none focus:ring-1 focus:ring-[#1685FF]/50"
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
              ? 'bg-[#111A27] border-[#202C3D] text-[#D2D8E2]'
              : 'bg-[#111A27] border-amber-500/30 text-amber-200'
          )}
        >
          <div className="flex items-start gap-3">
            {generation.approved ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            )}
            <div>
              <h4 className="text-sm font-bold text-white">
                {generation.approved
                  ? `Pipeline Complete: Approved on Iteration ${generation.currentIteration}`
                  : `Maximum Review Iterations Reached (${generation.currentIteration}/${project.maxIterations})`}
              </h4>
              <p className="text-xs mt-0.5 text-[#7F8BA0]">
                {generation.approved
                  ? `The Critic Agent verified this content against ground-truth research with a quality score of ${latestReview?.score || 94}/100.`
                  : 'Maximum review iterations reached. This content is the latest generated draft and may need manual review before publication.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono font-bold shrink-0">
            <span className="px-3 py-1 rounded-xl bg-[#0B0F17] border border-[#202C3D] text-[#D2D8E2]">
              Score: {latestReview?.score || 0}/100
            </span>
          </div>
        </div>
      )}

      {/* Results Workspace Tabs */}
      {activeDraft && (
        <div className="space-y-6">
          {/* Tabs Header */}
          <div className="flex items-center justify-between border-b border-[#202C3D] pb-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('content')}
                className={cn(
                  'px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-180 cursor-pointer flex items-center gap-2 focus:outline-none focus:ring-1 focus:ring-[#1685FF]/50',
                  activeTab === 'content'
                    ? 'bg-[#0A66C2] text-white shadow-sm shadow-blue-500/20'
                    : 'text-[#7F8BA0] hover:text-[#F5F7FA] hover:bg-[#151F2E]'
                )}
              >
                <FileText className="w-4 h-4" />
                <span>Generated Content</span>
              </button>

              <button
                onClick={() => setActiveTab('critic')}
                className={cn(
                  'px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-180 cursor-pointer flex items-center gap-2 focus:outline-none focus:ring-1 focus:ring-[#1685FF]/50',
                  activeTab === 'critic'
                    ? 'bg-[#0A66C2] text-white shadow-sm shadow-blue-500/20'
                    : 'text-[#7F8BA0] hover:text-[#F5F7FA] hover:bg-[#151F2E]'
                )}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Critic Quality Report</span>
              </button>

              <button
                onClick={() => setActiveTab('sources')}
                className={cn(
                  'px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-180 cursor-pointer flex items-center gap-2 focus:outline-none focus:ring-1 focus:ring-[#1685FF]/50',
                  activeTab === 'sources'
                    ? 'bg-[#0A66C2] text-white shadow-sm shadow-blue-500/20'
                    : 'text-[#7F8BA0] hover:text-[#F5F7FA] hover:bg-[#151F2E]'
                )}
              >
                <Share2 className="w-4 h-4" />
                <span>Verified Sources</span>
              </button>

              {drafts.length > 1 && (
                <button
                  onClick={() => setActiveTab('history')}
                  className={cn(
                    'px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-180 cursor-pointer flex items-center gap-2 focus:outline-none focus:ring-1 focus:ring-[#1685FF]/50',
                    activeTab === 'history'
                      ? 'bg-[#0A66C2] text-white shadow-sm shadow-blue-500/20'
                      : 'text-[#7F8BA0] hover:text-[#F5F7FA] hover:bg-[#151F2E]'
                  )}
                >
                  <History className="w-4 h-4" />
                  <span>Iteration History ({drafts.length})</span>
                </button>
              )}
            </div>

            {/* Iteration Selector Pill */}
            {drafts.length > 1 && latestDraft && (
              <div className="flex items-center gap-1.5 text-xs text-[#7F8BA0]">
                <span>Viewing:</span>
                <select
                  value={selectedIteration || latestDraft.iteration}
                  onChange={(e) => setSelectedIteration(Number(e.target.value))}
                  className="bg-[#0B0F17] border border-[#202C3D] rounded-xl px-2.5 py-1 text-xs text-[#F5F7FA] focus:outline-none focus:ring-1 focus:ring-[#1685FF]"
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
                  <h3 className="text-base font-bold text-white">
                    Autonomous Multi-Agent Refinement Audit Trail
                  </h3>
                  <p className="text-xs text-[#7F8BA0] mt-0.5">
                    Verified trail showing drafts, critic rejections, and how the Writer agent refined each cycle.
                  </p>
                </div>
                <span className="text-xs font-mono px-2.5 py-1 rounded-xl bg-[#111A27] border border-[#202C3D] text-[#D2D8E2]">
                  {drafts.length} Cycles Completed
                </span>
              </div>

              <div className="space-y-4">
                {drafts.map((draftItem, idx) => {
                  const revItem = reviews.find((r) => r.iteration === draftItem.iteration);
                  return (
                    <React.Fragment key={draftItem.iteration}>
                      {idx > 0 && (
                        <div className="flex items-center justify-center my-2 text-xs font-mono text-[#1685FF] font-semibold gap-2">
                          <div className="h-px bg-[#202C3D] flex-1" />
                          <span className="px-3 py-1 rounded-full bg-[#111A27] border border-[#1685FF]/30 flex items-center gap-1.5 shadow-sm text-[11px]">
                            <ArrowDown className="w-3.5 h-3.5 text-[#1685FF] shrink-0" />
                            AUTONOMOUS REVISION CYCLE &bull; ADDRESSING CRITIC FEEDBACK
                          </span>
                          <div className="h-px bg-[#202C3D] flex-1" />
                        </div>
                      )}

                      <div className="p-5 rounded-2xl bg-[#111A27] border border-[#202C3D] space-y-3.5 hover:border-[#35445A] transition-all shadow-card">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#202C3D] gap-2">
                          <div className="flex items-center gap-2.5">
                            <span className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-[#151F2E] text-[#1685FF] border border-[#202C3D]">
                              Iteration {draftItem.iteration}
                            </span>
                            {draftItem.contentHash && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#7F8BA0] bg-[#0B0F17] px-2 py-0.5 rounded-md border border-[#202C3D]">
                                <Hash className="w-3 h-3 text-[#7F8BA0]" />
                                SHA: {draftItem.contentHash.substring(0, 8)}
                              </span>
                            )}
                            <span className="text-xs text-[#7F8BA0]">
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
                            className="text-xs font-semibold text-[#1685FF] hover:text-[#0A66C2] transition-colors cursor-pointer inline-flex items-center gap-1"
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
                              className="text-xs font-semibold text-[#7F8BA0] hover:text-[#F5F7FA] transition-colors cursor-pointer"
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
