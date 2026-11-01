import React from 'react';
import { ExternalLink, ShieldCheck, AlertTriangle } from 'lucide-react';
import type { ResearchResultDTO } from '@contentforge/shared';

interface SourcesListProps {
  research: ResearchResultDTO;
}

export const SourcesList: React.FC<SourcesListProps> = ({ research }) => {
  return (
    <div className="bg-[#080C15] border border-[#252B38] rounded-2xl p-6 shadow-card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-4 border-b border-[#252B38]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#2787FF]" />
          <h3 className="font-display font-semibold text-[#E8EDF7] text-base">Verified research &amp; sources</h3>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#A1A9BA]">
          {research.sources.length} sources &bull; {research.facts.length} grounded claims
        </span>
      </div>

      {/* Research Summary */}
      <p className="text-xs text-[#A1A9BA] mb-5 leading-relaxed bg-[#000000] p-4 rounded-xl border border-[#252B38]">
        <span className="font-semibold text-[#E8EDF7]">Synthesis: </span>
        {research.summary}
      </p>

      {/* Verified Claims */}
      <div className="mb-5">
        <h4 className="font-mono text-[10px] font-semibold text-[#A1A9BA] uppercase tracking-[0.16em] mb-2.5">
          Grounded facts used in content
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {research.facts.map((fact, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-[#000000] border border-[#252B38] hover:border-[#34445F] transition-colors flex flex-col justify-between"
            >
              <p className="text-xs text-[#E8EDF7] mb-2 leading-snug">"{fact.claim}"</p>
              <div className="flex items-center justify-between pt-2 border-t border-[#252B38] text-[11px]">
                <span className="text-[#A1A9BA] truncate max-w-[180px]">{fact.source}</span>
                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider ${
                    fact.confidence === 'high'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : fact.confidence === 'medium'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      : 'bg-[#080C15] text-[#A1A9BA]'
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
        <h4 className="font-mono text-[10px] font-semibold text-[#A1A9BA] uppercase tracking-[0.16em] mb-2.5">
          Citations &amp; publications
        </h4>
        <div className="space-y-2">
          {research.sources.map((src, idx) => (
            <a
              key={idx}
              href={src.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-xl bg-[#000000] border border-[#252B38] hover:border-[#34445F] hover:bg-[#080C15] transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2787FF]/60"
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <span className="w-5 h-5 rounded-md bg-[#080C15] text-[#E8EDF7] text-[10px] font-semibold flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <div className="truncate">
                  <span className="text-xs font-semibold text-[#E8EDF7] group-hover:text-[#2787FF] transition-colors">
                    {src.title}
                  </span>
                  {src.publisher && (
                    <span className="text-[11px] text-[#A1A9BA] ml-2">({src.publisher})</span>
                  )}
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-[#A1A9BA] group-hover:text-[#2787FF] shrink-0 ml-2 transition-colors" />
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
