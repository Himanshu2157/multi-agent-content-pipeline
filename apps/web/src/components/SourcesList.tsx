import React from 'react';
import { ExternalLink, ShieldCheck, AlertTriangle } from 'lucide-react';
import type { ResearchResultDTO } from '@contentforge/shared';

interface SourcesListProps {
  research: ResearchResultDTO;
}

export const SourcesList: React.FC<SourcesListProps> = ({ research }) => {
  return (
    <div className="bg-forge-900/60 border border-forge-800 rounded-2xl p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-forge-800">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h3 className="font-bold text-white text-base">Verified Research & Sources</h3>
        </div>
        <span className="text-xs text-forge-400 font-medium">
          {research.sources.length} Verified Sources &bull; {research.facts.length} Grounded Claims
        </span>
      </div>

      {/* Research Summary */}
      <p className="text-xs text-forge-300 mb-5 leading-relaxed bg-forge-950/60 p-3.5 rounded-xl border border-forge-800/80">
        <span className="font-semibold text-forge-200">Synthesis: </span>
        {research.summary}
      </p>

      {/* Verified Claims */}
      <div className="mb-5">
        <h4 className="text-xs font-bold text-forge-400 uppercase tracking-wider mb-2.5">
          Grounded Facts Used in Content
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {research.facts.map((fact, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-forge-950/40 border border-forge-800/80 flex flex-col justify-between"
            >
              <p className="text-xs text-forge-200 mb-2 leading-snug">"{fact.claim}"</p>
              <div className="flex items-center justify-between pt-2 border-t border-forge-800/40 text-[11px]">
                <span className="text-forge-400 truncate max-w-[180px]">{fact.source}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    fact.confidence === 'high'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : fact.confidence === 'medium'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      : 'bg-forge-800 text-forge-400'
                  }`}
                >
                  {fact.confidence} confidence
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Source Links */}
      <div>
        <h4 className="text-xs font-bold text-forge-400 uppercase tracking-wider mb-2.5">
          Citations & Publications
        </h4>
        <div className="space-y-2">
          {research.sources.map((src, idx) => (
            <a
              key={idx}
              href={src.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-2.5 rounded-xl bg-forge-950/50 border border-forge-800/70 hover:border-brand-500/40 hover:bg-forge-900/80 transition-all group"
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <span className="w-5 h-5 rounded-full bg-forge-800 text-forge-300 text-[10px] font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <div className="truncate">
                  <span className="text-xs font-semibold text-forge-200 group-hover:text-brand-300 transition-colors">
                    {src.title}
                  </span>
                  {src.publisher && (
                    <span className="text-[11px] text-forge-500 ml-2">({src.publisher})</span>
                  )}
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-forge-500 group-hover:text-brand-400 shrink-0 ml-2 transition-colors" />
            </a>
          ))}
        </div>
      </div>

      {/* Cautions */}
      {research.cautions && research.cautions.length > 0 && (
        <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-2.5 text-amber-300 text-xs">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-amber-200">Fact-Checking Caution: </span>
            {research.cautions.join(' ')}
          </div>
        </div>
      )}
    </div>
  );
};
