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
  Clapperboard,
  ArrowRight,
  FileText,
} from 'lucide-react';
import type { InstagramReelOutput } from '@contentforge/shared';

interface ReelResultsProps {
  content: InstagramReelOutput;
}

export const ReelResults: React.FC<ReelResultsProps> = ({ content }) => {
  const [copied, setCopied] = useState(false);

  // Compute total spoken words across all voiceover scenes
  const totalVoiceoverWords = content.sections
    .map((s) => s.voiceover.split(/\s+/).filter(Boolean).length)
    .reduce((sum, count) => sum + count, 0);

  const displayWordCount = content.wordCount || totalVoiceoverWords;

  const handleCopyScript = () => {
    const scriptText = `--- INSTAGRAM REEL PRODUCTION SCRIPT ---
TITLE: ${content.title}
TARGET DURATION: ${content.targetDuration || content.estimatedDuration}
ESTIMATED SPOKEN WORDS: ~${displayWordCount} words
OPENING HOOK (0-5s): "${content.hook}"

========================================
SCENE BREAKDOWN (RECORDABLE PRODUCTION SCRIPT)
========================================

${content.sections
  .map(
    (s, idx) => `SCENE ${idx + 1} (${s.timestamp})
VISUAL: ${s.visual}
${s.bRoll ? `B-ROLL: ${s.bRoll}\n` : ''}${s.transition ? `TRANSITION: ${s.transition}\n` : ''}ON-SCREEN TEXT: ${s.onScreenText}
VOICEOVER: "${s.voiceover}"`
  )
  .join('\n\n----------------------------------------\n\n')}

========================================
CLOSING CALL TO ACTION:
${content.cta ? content.cta : 'Save this video and share your thoughts in the comments!'}
`;

    navigator.clipboard.writeText(scriptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-forge-900 border border-forge-700 shadow-card">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-lg bg-gradient-to-tr from-[#833AB4] via-[#E1306C] to-[#F77737] p-[1px] flex items-center justify-center text-white shrink-0 shadow-sm">
            <div className="w-full h-full bg-forge-950 rounded-[7px] flex items-center justify-center">
              <Video className="w-5 h-5 text-[#E1306C]" />
            </div>
          </div>
          <div>
            <h3 className="text-base font-bold text-white">{content.title}</h3>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-forge-400 mt-1">
              <span className="flex items-center gap-1 text-[#1685FF] font-semibold bg-[#0A66C2]/15 px-2 py-0.5 rounded border border-[#0A66C2]/30">
                <Clock className="w-3.5 h-3.5" />
                {content.targetDuration || content.estimatedDuration || '60–90 seconds'}
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1 text-purple-300 font-semibold bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                <FileText className="w-3.5 h-3.5" />
                ~{displayWordCount} Spoken Words
              </span>
              <span>&bull;</span>
              <span className="text-forge-300 font-medium">
                {content.sections.length} Recordable Scenes
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={handleCopyScript}
          className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#0A66C2] hover:bg-[#1685FF] text-white transition-all flex items-center gap-2 shrink-0 cursor-pointer shadow-sm"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Production Script Copied!' : 'Copy Video Script'}</span>
        </button>
      </div>

      {/* Hook Banner */}
      <div className="p-5 rounded-xl bg-forge-900 border border-forge-700 shadow-card">
        <div className="flex items-center gap-2 mb-1.5">
          <Sparkles className="w-4 h-4 text-[#E1306C]" />
          <span className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#F77737] uppercase tracking-wider">
            Opening Hook (0–5 Seconds)
          </span>
        </div>
        <p className="text-base font-bold text-white leading-relaxed">
          "{content.hook}"
        </p>
      </div>

      {/* Script Timeline */}
      <div className="space-y-4 relative before:absolute before:left-5 before:top-4 before:bottom-4 before:w-0.5 before:bg-forge-700">
        {content.sections.map((section, idx) => (
          <div
            key={idx}
            className="flex items-start gap-4 relative pl-2 group"
          >
            {/* Step Number Dot */}
            <div className="w-7 h-7 rounded-full bg-forge-950 border border-forge-700 text-[#1685FF] text-xs font-semibold flex items-center justify-center shrink-0 z-10 group-hover:border-[#0A66C2] transition-colors">
              {idx + 1}
            </div>

            {/* Scene Card */}
            <div className="flex-1 bg-forge-900 border border-forge-700 rounded-xl p-5 hover:border-forge-600 transition-colors shadow-card space-y-3.5">
              <div className="flex items-center justify-between pb-3 border-b border-forge-700">
                <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20 font-mono">
                  {section.timestamp}
                </span>
                <span className="text-[11px] text-forge-400 font-medium">Scene {idx + 1} of {content.sections.length}</span>
              </div>

              {/* Visual Cue */}
              <div className="flex items-start gap-2.5">
                <div className="p-1 rounded bg-[#0A66C2]/10 text-[#0A66C2] mt-0.5 shrink-0">
                  <Eye className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#1685FF] block">
                    Visual & Camera Direction
                  </span>
                  <p className="text-xs text-forge-200 mt-0.5 leading-relaxed">
                    {section.visual}
                  </p>
                </div>
              </div>

              {/* B-Roll & Transition Chips (when available) */}
              {(section.bRoll || section.transition) && (
                <div className="flex flex-wrap gap-2 pt-0.5">
                  {section.bRoll && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-forge-950 border border-forge-700 text-[11px] text-purple-300">
                      <Clapperboard className="w-3 h-3 text-purple-400 shrink-0" />
                      <span><strong>B-Roll:</strong> {section.bRoll}</span>
                    </div>
                  )}
                  {section.transition && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-forge-950 border border-forge-700 text-[11px] text-cyan-300">
                      <ArrowRight className="w-3 h-3 text-cyan-400 shrink-0" />
                      <span><strong>Transition:</strong> {section.transition}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Voiceover Script */}
              <div className="flex items-start gap-2.5 bg-forge-950 border border-forge-700/80 p-3.5 rounded-lg">
                <div className="p-1 rounded bg-blue-500/10 text-blue-400 mt-0.5 shrink-0">
                  <Mic className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-400 block">
                    Spoken Voiceover
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
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400 block">
                    On-Screen Text Overlay
                  </span>
                  <span className="inline-block px-2.5 py-1 rounded-lg bg-forge-950 border border-forge-700 font-mono text-xs text-amber-300 font-semibold mt-1">
                    {section.onScreenText}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Footer */}
      {content.cta && (
        <div className="p-4 rounded-xl bg-forge-900 border border-forge-700 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-forge-300 shadow-card">
          <span className="font-semibold text-[#1685FF]">Closing Call To Action:</span>
          <span className="font-medium text-white italic">{content.cta}</span>
        </div>
      )}
    </div>
  );
};
