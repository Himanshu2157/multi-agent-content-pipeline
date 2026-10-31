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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#080C15] border border-[#252B38] shadow-card">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#2787FF] to-[#D21BCE] p-[1.5px] flex items-center justify-center text-white shrink-0 shadow-sm shadow-[#D21BCE]/10">
            <div className="w-full h-full bg-[#000000] rounded-[10px] flex items-center justify-center">
              <Video className="w-5 h-5 text-[#D21BCE]" />
            </div>
          </div>
          <div>
            <h3 className="text-base font-bold text-[#E8EDF7]">{content.title}</h3>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-[#A1A9BA] mt-1">
              <span className="flex items-center gap-1 text-[#2787FF] font-semibold bg-[#000000] px-2.5 py-0.5 rounded-lg border border-[#252B38]">
                <Clock className="w-3.5 h-3.5" />
                {content.targetDuration || content.estimatedDuration || '60–90 seconds'}
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1 text-[#D21BCE] font-semibold bg-[#000000] px-2.5 py-0.5 rounded-lg border border-[#252B38]">
                <FileText className="w-3.5 h-3.5" />
                ~{displayWordCount} Spoken Words
              </span>
              <span>&bull;</span>
              <span className="text-[#E8EDF7] font-medium">
                {content.sections.length} Recordable Scenes
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={handleCopyScript}
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#2787FF] to-[#D21BCE] hover:opacity-95 hover:shadow-btn-hover text-white transition-all duration-180 flex items-center gap-2 shrink-0 cursor-pointer shadow-md shadow-[#D21BCE]/20 focus:outline-none focus:ring-2 focus:ring-[#D21BCE]/50"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Production Script Copied!' : 'Copy Video Script'}</span>
        </button>
      </div>

      {/* Hook Banner */}
      <div className="p-5 rounded-2xl bg-[#080C15] border border-[#252B38] shadow-card">
        <div className="flex items-center gap-2 mb-1.5">
          <Sparkles className="w-4 h-4 text-[#D21BCE]" />
          <span className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#2787FF] to-[#D21BCE] uppercase tracking-wider">
            Opening Hook (0–5 Seconds)
          </span>
        </div>
        <p className="text-base font-bold text-[#E8EDF7] leading-relaxed">
          "{content.hook}"
        </p>
      </div>

      {/* Script Timeline */}
      <div className="space-y-4 relative before:absolute before:left-5 before:top-4 before:bottom-4 before:w-[1.5px] before:bg-[#252B38]">
        {content.sections.map((section, idx) => (
          <div
            key={idx}
            className="flex items-start gap-4 relative pl-2 group"
          >
            {/* Step Number Dot */}
            <div className="w-7 h-7 rounded-full bg-[#000000] border border-[#252B38] text-[#2787FF] text-xs font-semibold flex items-center justify-center shrink-0 z-10 group-hover:border-[#2787FF] transition-colors">
              {idx + 1}
            </div>

            {/* Scene Card */}
            <div className="flex-1 bg-[#080C15] border border-[#252B38] rounded-2xl p-5 hover:border-[#34445F] transition-all duration-180 shadow-card space-y-3.5">
              <div className="flex items-center justify-between pb-3 border-b border-[#252B38]">
                <span className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-[#000000] text-[#D21BCE] border border-[#252B38] font-mono">
                  {section.timestamp}
                </span>
                <span className="text-[11px] text-[#A1A9BA] font-medium">Scene {idx + 1} of {content.sections.length}</span>
              </div>

              {/* Visual Cue */}
              <div className="flex items-start gap-2.5">
                <div className="p-1.5 rounded-lg bg-[#2787FF]/15 text-[#2787FF] mt-0.5 shrink-0">
                  <Eye className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#2787FF] block">
                    Visual & Camera Direction
                  </span>
                  <p className="text-xs text-[#E8EDF7] mt-0.5 leading-relaxed">
                    {section.visual}
                  </p>
                </div>
              </div>

              {/* B-Roll & Transition Chips (when available) */}
              {(section.bRoll || section.transition) && (
                <div className="flex flex-wrap gap-2 pt-0.5">
                  {section.bRoll && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#000000] border border-[#252B38] text-[11px] text-[#D21BCE]">
                      <Clapperboard className="w-3 h-3 text-[#D21BCE] shrink-0" />
                      <span><strong>B-Roll:</strong> {section.bRoll}</span>
                    </div>
                  )}
                  {section.transition && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#000000] border border-[#252B38] text-[11px] text-[#2787FF]">
                      <ArrowRight className="w-3 h-3 text-[#2787FF] shrink-0" />
                      <span><strong>Transition:</strong> {section.transition}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Voiceover Script */}
              <div className="flex items-start gap-2.5 bg-[#000000] border border-[#252B38] p-3.5 rounded-xl">
                <div className="p-1.5 rounded-lg bg-[#2787FF]/10 text-[#2787FF] mt-0.5 shrink-0">
                  <Mic className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#2787FF] block">
                    Spoken Voiceover
                  </span>
                  <p className="text-sm font-semibold text-[#E8EDF7] mt-0.5 leading-relaxed">
                    "{section.voiceover}"
                  </p>
                </div>
              </div>

              {/* On-Screen Text */}
              <div className="flex items-start gap-2.5">
                <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 mt-0.5 shrink-0">
                  <Type className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400 block">
                    On-Screen Text Overlay
                  </span>
                  <span className="inline-block px-2.5 py-1 rounded-xl bg-[#000000] border border-[#252B38] font-mono text-xs text-amber-300 font-semibold mt-1">
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
        <div className="p-4 rounded-2xl bg-[#080C15] border border-[#252B38] text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[#A1A9BA] shadow-card">
          <span className="font-semibold text-[#2787FF]">Closing Call To Action:</span>
          <span className="font-medium text-[#E8EDF7] italic">{content.cta}</span>
        </div>
      )}
    </div>
  );
};
