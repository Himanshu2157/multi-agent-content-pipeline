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
    { label: 'Topic Fidelity', value: review.topicFidelity ?? 100 },
    { label: 'Factual Accuracy', value: review.factualAccuracy },
    { label: 'Platform Fit', value: review.platformFit },
    { label: 'Relevance', value: review.relevance },
    { label: 'Clarity', value: review.clarity },
    { label: 'Natural Voice', value: review.naturalness ?? 90 },
  ];

  return (
    <div className="bg-forge-900/60 border border-forge-800 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-6 border-b border-forge-800">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-white text-base">Critic & Quality Review Report</h3>
          </div>
          <p className="text-xs text-forge-400 mt-0.5">
            Automated topic fidelity verification and platform fitness assessment (Iteration {iteration})
          </p>
        </div>

        {review.approved ? (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Critic Approved ({review.score}/100)</span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            <span>Revision Required ({review.score}/100)</span>
          </div>
        )}
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-6">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="bg-forge-950/60 border border-forge-800/80 rounded-xl p-3 flex flex-col justify-between"
          >
            <span className="text-[11px] font-medium text-forge-400 mb-1">{m.label}</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-extrabold text-white">{Math.round(m.value)}</span>
              <span className="text-[10px] text-forge-500 font-mono">/100</span>
            </div>
            {/* Progress bar */}
            <div className="w-full h-1.5 bg-forge-800 rounded-full mt-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  m.value >= 85
                    ? 'bg-emerald-500'
                    : m.value >= 70
                    ? 'bg-amber-500'
                    : 'bg-red-500'
                }`}
                style={{ width: `${Math.min(Math.max(m.value, 0), 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Issues flagged by Critic */}
      {review.issues && review.issues.length > 0 && (
        <div className="mb-6">
          <h4 className="text-xs font-bold text-forge-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Identified Concerns ({review.issues.length})</span>
          </h4>
          <div className="space-y-2">
            {review.issues.map((issue, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-forge-950/40 border border-forge-800/70 flex items-start gap-3"
              >
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 mt-0.5 ${
                    issue.severity === 'high'
                      ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                      : issue.severity === 'medium'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                  }`}
                >
                  {issue.severity}
                </span>
                <div>
                  <span className="text-xs font-semibold text-forge-200 capitalize">
                    {issue.type.replace(/_/g, ' ')}:
                  </span>
                  <p className="text-xs text-forge-300 mt-0.5 leading-relaxed">
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
          <h4 className="text-xs font-bold text-forge-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <FileCheck2 className="w-3.5 h-3.5 text-brand-400" />
            <span>Autonomous Instructions Dispatched to Writer</span>
          </h4>
          <ul className="space-y-1.5 text-xs text-forge-300 bg-forge-950/40 border border-forge-800/70 p-3.5 rounded-xl">
            {review.requiredChanges.map((change, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-brand-400 font-bold">&bull;</span>
                <span>{change}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {review.approved && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2.5 text-emerald-300 text-xs">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Content has satisfied all factual grounding and platform formatting rules.</span>
        </div>
      )}
    </div>
  );
};
