import React, { useState } from 'react';
import {
  Copy,
  Check,
  Edit3,
  Share2,
  Bookmark,
  MessageSquare,
  ThumbsUp,
} from 'lucide-react';
import { LinkedInIcon } from './icons.js';
import type { LinkedInOutput, LinkedInPost } from '@contentforge/shared';

interface LinkedInResultsProps {
  content: LinkedInOutput;
}

export const LinkedInResults: React.FC<LinkedInResultsProps> = ({ content }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [posts, setPosts] = useState<LinkedInPost[]>(content.posts);

  const handleCopyPost = (post: LinkedInPost) => {
    const fullText = `${post.hook}\n\n${post.body}${post.cta ? `\n\n${post.cta}` : ''}`;
    navigator.clipboard.writeText(fullText);
    setCopiedId(post.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyAll = () => {
    const allText = posts
      .map(
        (p, idx) =>
          `--- POST ${idx + 1} (${p.angle}) ---\n\n${p.hook}\n\n${p.body}${
            p.cta ? `\n\n${p.cta}` : ''
          }`
      )
      .join('\n\n========================================\n\n');

    navigator.clipboard.writeText(allText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleTextChange = (id: string, newBody: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, body: newBody } : p))
    );
  };

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#080C15] border border-[#252B38] shadow-card">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#2787FF] to-[#1E74E0] p-[1.5px] shadow-sm shadow-[#2787FF]/10 shrink-0">
            <div className="w-full h-full bg-[#000000] rounded-[10px] flex items-center justify-center">
              <LinkedInIcon className="w-5 h-5 text-[#2787FF]" />
            </div>
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#E8EDF7]">LinkedIn Content Package</h3>
            <p className="text-xs text-[#A1A9BA]">
              {posts.length} Distinct Angles Generated &bull; Verifiable Citations Grounded
            </p>
          </div>
        </div>

        <button
          onClick={handleCopyAll}
          className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#2787FF] hover:bg-[#1E74E0] hover:shadow-btn-hover text-white transition-all duration-180 flex items-center gap-2 shrink-0 cursor-pointer shadow-md shadow-[#2787FF]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2787FF]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#080C15]"
        >
          {copiedAll ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          <span aria-live="polite">{copiedAll ? 'Copied all posts!' : `Copy all ${posts.length} posts`}</span>
        </button>
      </div>

      {/* Posts Cards Grid */}
      <div className="grid grid-cols-1 gap-6">
        {posts.map((post, idx) => {
          const isCopied = copiedId === post.id;
          const isEditing = editingId === post.id;

          return (
            <article
              key={post.id || idx}
              className="group relative overflow-hidden bg-[#080C15] border border-[#252B38] rounded-2xl p-6 shadow-card hover:border-[#34445F] hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-250"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#2787FF]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
              {/* Post Header */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#252B38]">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-[#000000] text-[#E8EDF7] border border-[#252B38] text-xs font-semibold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#000000] text-[#2787FF] border border-[#252B38]">
                    {post.angle}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingId(isEditing ? null : post.id)}
                    className="p-2 rounded-lg text-[#A1A9BA] hover:text-[#E8EDF7] hover:bg-[#000000] transition-colors text-xs flex items-center gap-1.5 cursor-pointer"
                    title={isEditing ? 'Done Editing' : 'Edit Post Text'}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{isEditing ? 'Done' : 'Edit'}</span>
                  </button>

                  <button
                    onClick={() => handleCopyPost(post)}
                    aria-label={`Copy LinkedIn post ${idx + 1}`}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#000000] hover:bg-[#080C15] hover:border-[#34445F] text-[#E8EDF7] hover:text-white transition-all duration-180 flex items-center gap-1.5 cursor-pointer border border-[#252B38] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2787FF]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#080C15]"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-semibold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Post</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Hook Banner */}
              <div className="mb-4 p-4 rounded-xl bg-gradient-to-r from-[#2787FF]/[0.06] to-transparent border border-[#252B38] border-l-2 border-l-[#2787FF]">
                <span className="text-[10px] font-mono font-semibold text-[#2787FF] uppercase tracking-[0.16em] block mb-1">
                  Scroll-stopping hook
                </span>
                <p className="text-sm font-semibold text-[#E8EDF7] leading-snug">
                  {post.hook}
                </p>
              </div>

              {/* Body */}
              <div className="mb-4">
                {isEditing ? (
                  <textarea
                    rows={8}
                    value={post.body}
                    onChange={(e) => handleTextChange(post.id, e.target.value)}
                    className="w-full rounded-xl bg-[#000000] border border-[#252B38] p-3 text-sm text-[#E8EDF7] focus:outline-none focus:ring-1 focus:ring-[#2787FF]"
                  />
                ) : (
                  <div className="text-sm text-[#E8EDF7] leading-relaxed whitespace-pre-wrap font-sans">
                    {post.body}
                  </div>
                )}
              </div>

              {/* CTA */}
              {post.cta && (
                <div className="pt-3 border-t border-[#252B38] flex items-center justify-between text-xs text-[#A1A9BA]">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#2787FF]">CTA:</span>
                    <span className="italic text-[#A1A9BA]">{post.cta}</span>
                  </div>
                  <div className="hidden sm:flex items-center gap-3 text-[#A1A9BA]">
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <MessageSquare className="w-3.5 h-3.5" />
                    <Share2 className="w-3.5 h-3.5" />
                    <Bookmark className="w-3.5 h-3.5" />
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
};
