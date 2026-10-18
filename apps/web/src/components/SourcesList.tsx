import React from 'react';
import { ExternalLink, ShieldCheck, AlertTriangle } from 'lucide-react';
import type { ResearchResultDTO } from '@contentforge/shared';

interface SourcesListProps {
  research: ResearchResultDTO;
}

export const SourcesList: React.FC<SourcesListProps> = ({ research }) => {
  return (
    <div className="bg-[#111A27] border border-[#202C3D] rounded-2xl p-6 shadow-card">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#202C3D]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#1685FF]" />
          <h3 className="font-bold text-white text-base">Verified Research & Sources</h3>
        </div>
        <span className="text-xs text-[#7F8BA0] font-medium">
          {research.sources.length} Verified Sources &bull; {research.facts.length} Grounded Claims
        </span>
      </div>

      {/* Research Summary */}
      <p className="text-xs text-[#AAB4C5] mb-5 leading-relaxed bg-[#0B0F17] p-4 rounded-xl border border-[#202C3D]">
        <span className="font-semibold text-white">Synthesis: </span>
        {research.summary}
      </p>

      {/* Verified Claims */}
      <div className="mb-5">
        <h4 className="text-xs font-semibold text-[#7F8BA0] uppercase tracking-wider mb-2.5">
          Grounded Facts Used in Content
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {research.facts.map((fact, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-[#0B0F17] border border-[#202C3D] flex flex-col justify-between"
            >
              <p className="text-xs text-[#D2D8E2] mb-2 leading-snug">"{fact.claim}"</p>
              <div className="flex items-center justify-between pt-2 border-t border-[#202C3D] text-[11px]">
                <span className="text-[#7F8BA0] truncate max-w-[180px]">{fact.source}</span>
                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider ${
                    fact.confidence === 'high'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : fact.confidence === 'medium'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      : 'bg-[#151F2E] text-[#7F8BA0]'
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
        <h4 className="text-xs font-semibold text-[#7F8BA0] uppercase tracking-wider mb-2.5">
          Citations & Publications
        </h4>
        <div className="space-y-2">
          {research.sources.map((src, idx) => (
            <a
              key={idx}
              href={src.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-xl bg-[#0B0F17] border border-[#202C3D] hover:border-[#35445A] hover:bg-[#151F2E] transition-all group"
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <span className="w-5 h-5 rounded-md bg-[#151F2E] text-[#D2D8E2] text-[10px] font-semibold flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <div className="truncate">
                  <span className="text-xs font-semibold text-[#D2D8E2] group-hover:text-[#1685FF] transition-colors">
                    {src.title}
                  </span>
                  {src.publisher && (
                    <span className="text-[11px] text-[#7F8BA0] ml-2">({src.publisher})</span>
                  )}
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-[#7F8BA0] group-hover:text-[#1685FF] shrink-0 ml-2 transition-colors" />
            </a>
          ))}
        </div>
      </div>

      {/* Cautions */}
      {research.cautions && research.cautions.length > 0 && (
        <div className="mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-2.5 text-amber-300 text-xs">
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
