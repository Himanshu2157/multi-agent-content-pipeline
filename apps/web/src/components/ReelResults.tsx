import React, { useState } from 'react';
import {
  Copy,
  Check,
  Clock,
  Eye,
  Mic,
  Type,
  Video,
  Sparkles,
} from 'lucide-react';
import type { InstagramReelOutput } from '@contentforge/shared';

interface ReelResultsProps {
  content: InstagramReelOutput;
}

export const ReelResults: React.FC<ReelResultsProps> = ({ content }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyScript = () => {
    const scriptText = `--- INSTAGRAM REEL SCRIPT ---
TITLE: ${content.title}
DURATION: ${content.estimatedDuration}
HOOK: ${content.hook}

${content.sections
  .map(
    (s, idx) => `[SCENE ${idx + 1}: ${s.timestamp}]
VISUAL: ${s.visual}
VOICEOVER: "${s.voiceover}"
ON-SCREEN TEXT: ${s.onScreenText}`
  )
  .join('\n\n')}

${content.cta ? `CTA: ${content.cta}` : ''}
`;

    navigator.clipboard.writeText(scriptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-forge-900/60 border border-forge-800 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">{content.title}</h3>
            <div className="flex items-center gap-3 text-xs text-forge-400 mt-0.5">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-brand-400" />
                {content.estimatedDuration}
              </span>
              <span>&bull;</span>
              <span>{content.sections.length} Scene Blocks</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleCopyScript}
          className="px-4 py-2.5 rounded-xl text-xs font-bold bg-brand-500 hover:bg-brand-400 text-forge-950 transition-all flex items-center gap-2 shrink-0 cursor-pointer shadow-md shadow-brand-500/10"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Script Copied!' : 'Copy Video Script'}</span>
        </button>
      </div>

      {/* Hook Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 to-forge-950 border border-purple-500/30 shadow-lg">
        <div className="flex items-center gap-2 mb-1.5">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">
            Opening Hook (0–3 Seconds)
          </span>
        </div>
        <p className="text-base font-extrabold text-white leading-relaxed">
          "{content.hook}"
        </p>
      </div>

      {/* Script Timeline */}
      <div className="space-y-4 relative before:absolute before:left-5 before:top-4 before:bottom-4 before:w-0.5 before:bg-forge-800">
        {content.sections.map((section, idx) => (
          <div
            key={idx}
            className="flex items-start gap-4 relative pl-2 group"
          >
            {/* Step Number Dot */}
            <div className="w-7 h-7 rounded-full bg-forge-950 border-2 border-brand-500/40 text-brand-400 text-xs font-bold flex items-center justify-center shrink-0 z-10 group-hover:border-brand-400 transition-colors">
              {idx + 1}
            </div>

            {/* Scene Card */}
            <div className="flex-1 bg-forge-900/40 border border-forge-800 rounded-2xl p-5 hover:border-forge-700/80 transition-all shadow-md">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-forge-800/60">
                <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-brand-500/10 text-brand-400 border border-brand-500/20 font-mono">
                  {section.timestamp}
                </span>
                <span className="text-[11px] text-forge-400 font-medium">Scene {idx + 1}</span>
              </div>

              <div className="space-y-3">
                {/* Visual Cue */}
                <div className="flex items-start gap-2.5">
                  <div className="p-1 rounded bg-blue-500/10 text-blue-400 mt-0.5 shrink-0">
                    <Eye className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 block">
                      Visual & Camera Direction
                    </span>
                    <p className="text-xs text-forge-200 mt-0.5 leading-relaxed">
                      {section.visual}
                    </p>
                  </div>
                </div>

                {/* Voiceover Script */}
                <div className="flex items-start gap-2.5">
                  <div className="p-1 rounded bg-emerald-500/10 text-emerald-400 mt-0.5 shrink-0">
                    <Mic className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                      Voiceover Script
                    </span>
                    <p className="text-sm font-semibold text-white mt-0.5 leading-relaxed">
                      "{section.voiceover}"
                    </p>
                  </div>
                </div>

                {/* On-Screen Text */}
                <div className="flex items-start gap-2.5">
                  <div className="p-1 rounded bg-amber-500/10 text-amber-400 mt-0.5 shrink-0">
                    <Type className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                      On-Screen Text Overlay
                    </span>
                    <span className="inline-block px-2 py-0.5 rounded bg-forge-950 border border-forge-700 font-mono text-xs text-amber-300 font-bold mt-1">
                      {section.onScreenText}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Footer */}
      {content.cta && (
        <div className="p-4 rounded-xl bg-forge-900/60 border border-forge-800 text-xs flex items-center justify-between text-forge-300">
          <span className="font-semibold text-brand-400">Closing Call To Action:</span>
          <span className="font-medium text-white italic">{content.cta}</span>
        </div>
      )}
    </div>
  );
};
