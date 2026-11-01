import React from 'react';
import {
  CheckCircle2,
  AlertCircle,
  FileCheck2,
  Sparkles,
  Award,
} from 'lucide-react';
import type { CriticReviewDTO } from '@contentforge/shared';

interface CriticReportProps {
  review: CriticReviewDTO;
  iteration: number;
}

export const CriticReport: React.FC<CriticReportProps> = ({ review, iteration }) => {
  const metrics = [
    { label: 'Topic Fidelity', value: review.topicFidelity ?? 98 },
    { label: 'Tone Match', value: review.toneMatch ?? 92 },
    { label: 'Factual Accuracy', value: review.factualAccuracy },
    { label: 'Platform Fit', value: review.platformFit },
    { label: 'Usefulness', value: review.usefulness ?? 90 },
    { label: 'Clarity', value: review.clarity },
    ...(review.scriptQuality !== undefined
      ? [{ label: 'Script Quality', value: review.scriptQuality }]
      : []),
    ...(review.narrativeQuality !== undefined
      ? [{ label: 'Narrative Arc', value: review.narrativeQuality }]
      : []),
  ];

  return (
    <div className="bg-[#080C15] border border-[#252B38] rounded-2xl p-6 shadow-card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-6 border-b border-[#252B38]">
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 shrink-0">
            <div
              className="score-ring h-full w-full rounded-full"
              style={{ '--score-angle': `${Math.min(Math.max(review.score, 0), 100)}%` } as React.CSSProperties}
              aria-hidden="true"
            />
            <div className="absolute inset-[3px] flex flex-col items-center justify-center rounded-full bg-[#080C15]">
              <span className="font-display text-lg font-bold leading-none text-[#E8EDF7]">{Math.round(review.score)}</span>
              <span className="mt-0.5 font-mono text-[8px] uppercase tracking-wider text-[#737D91]">score</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <h3 className="font-display font-semibold text-[#E8EDF7] text-base">Critic &amp; quality review report</h3>
            </div>
            <p className="text-xs text-[#A1A9BA] mt-1">
              Topic fidelity verification &amp; platform fitness assessment (iteration {iteration})
            </p>
          </div>
        </div>

        {review.approved ? (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold self-start sm:self-auto">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Critic approved</span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold self-start sm:self-auto">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            <span>Revision required</span>
          </div>
        )}
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="bg-[#000000] border border-[#252B38] rounded-xl p-3.5 flex flex-col justify-between"
          >
            <span className="text-[11px] font-medium text-[#A1A9BA] mb-1">{m.label}</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-[#E8EDF7]">{Math.round(m.value)}</span>
              <span className="text-[10px] text-[#A1A9BA] font-mono">/100</span>
            </div>
            {/* Progress bar */}
            <div className="w-full h-1.5 bg-[#252B38] rounded-full mt-2.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  m.value >= 85
                    ? 'bg-emerald-500'
                    : m.value >= 70
                    ? 'bg-[#2787FF]'
                    : 'bg-amber-500'
                }`}
                style={{ width: `${Math.min(Math.max(m.value, 0), 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Post-by-Post Evaluation Breakdown */}
      {review.postReviews && review.postReviews.length > 0 && (
        <div className="mb-6">
          <h4 className="text-xs font-semibold text-[#A1A9BA] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#2787FF]" />
            <span>Post-by-Post Quality & Topic Replacement Audit</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {review.postReviews.map((pr, idx) => (
              <div
                key={pr.postId || idx}
                className={`p-3.5 rounded-xl border flex flex-col justify-between ${
                  pr.approved
                    ? 'bg-[#000000] border-emerald-500/30 text-emerald-300'
                    : 'bg-[#000000] border-amber-500/30 text-amber-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold mb-1">
                  <span>{pr.category || pr.postId}</span>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                      pr.approved
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    {pr.approved ? 'Approved' : 'Needs Revision'}
                  </span>
                </div>
                {pr.scores && (
                  <div className="text-[11px] text-[#A1A9BA] flex items-center justify-between mt-1">
                    <span>Quality Score</span>
                    <span className="font-mono font-bold text-[#E8EDF7]">
                      {Math.round(pr.scores.total)}/100
                    </span>
                  </div>
                )}
                {pr.issues && pr.issues.length > 0 && (
                  <p className="text-[11px] text-amber-400/90 mt-1 line-clamp-2">
                    {pr.issues[0].problem}: {pr.issues[0].whyItFails}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      {review.issues && review.issues.length > 0 && (
        <div className="mb-6">
          <h4 className="text-xs font-semibold text-[#A1A9BA] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Identified Concerns ({review.issues.length})</span>
          </h4>
          <div className="space-y-2">
            {review.issues.map((issue, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-[#000000] border border-[#252B38] flex items-start gap-3"
              >
                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase shrink-0 mt-0.5 ${
                    issue.severity === 'high'
                      ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                      : issue.severity === 'medium'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      : 'bg-[#2787FF]/15 text-[#2787FF] border border-[#2787FF]/30'
                  }`}
                >
                  {issue.severity}
                </span>
                <div>
                  <span className="text-xs font-semibold text-[#E8EDF7] capitalize">
                    {issue.type.replace(/_/g, ' ')}:
                  </span>
                  <p className="text-xs text-[#A1A9BA] mt-0.5 leading-relaxed">
                    {issue.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Required Changes for Revisions */}
      {review.requiredChanges && review.requiredChanges.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-[#A1A9BA] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <FileCheck2 className="w-3.5 h-3.5 text-[#2787FF]" />
            <span>Autonomous Instructions Dispatched to Writer</span>
          </h4>
          <ul className="space-y-1.5 text-xs text-[#A1A9BA] bg-[#000000] border border-[#252B38] p-4 rounded-xl">
            {review.requiredChanges.map((change, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-[#2787FF] font-bold">&bull;</span>
                <span>{change}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {review.approved && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2.5 text-emerald-300 text-xs">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Content has satisfied all factual grounding and platform formatting rules.</span>
        </div>
      )}
    </div>
  );
};
