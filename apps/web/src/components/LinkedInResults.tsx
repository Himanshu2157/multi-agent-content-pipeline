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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#111A27] border border-[#202C3D] shadow-card">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0077B5] to-[#1685FF] p-[1.5px] shadow-sm shadow-blue-500/10 shrink-0">
            <div className="w-full h-full bg-[#0B0F17] rounded-[10px] flex items-center justify-center">
              <LinkedInIcon className="w-5 h-5 text-[#1685FF]" />
            </div>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">LinkedIn Content Package</h3>
            <p className="text-xs text-[#7F8BA0]">
              {posts.length} Distinct Angles Generated &bull; Verifiable Citations Grounded
            </p>
          </div>
        </div>

        <button
          onClick={handleCopyAll}
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#0077B5] to-[#1685FF] hover:opacity-95 hover:shadow-btn-hover text-white transition-all duration-180 flex items-center gap-2 shrink-0 cursor-pointer shadow-md shadow-blue-500/20 focus:outline-none focus:ring-2 focus:ring-[#1685FF]/50"
        >
          {copiedAll ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          <span>{copiedAll ? 'Copied All Posts!' : 'Copy All 5 Posts'}</span>
        </button>
      </div>

      {/* Posts Cards Grid */}
      <div className="grid grid-cols-1 gap-6">
        {posts.map((post, idx) => {
          const isCopied = copiedId === post.id;
          const isEditing = editingId === post.id;

          return (
            <div
              key={post.id || idx}
              className="bg-[#111A27] border border-[#202C3D] rounded-2xl p-6 shadow-card hover:border-[#35445A] transition-all duration-180"
            >
              {/* Post Header */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#202C3D]">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-[#151F2E] text-[#D2D8E2] border border-[#202C3D] text-xs font-semibold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#151F2E] text-[#1685FF] border border-[#202C3D]">
                    {post.angle}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingId(isEditing ? null : post.id)}
                    className="p-2 rounded-lg text-[#7F8BA0] hover:text-white hover:bg-[#151F2E] transition-colors text-xs flex items-center gap-1.5 cursor-pointer"
                    title={isEditing ? 'Done Editing' : 'Edit Post Text'}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{isEditing ? 'Done' : 'Edit'}</span>
                  </button>

                  <button
                    onClick={() => handleCopyPost(post)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#151F2E] hover:bg-[#182436] hover:border-[#35445A] text-[#D2D8E2] hover:text-white transition-all duration-180 flex items-center gap-1.5 cursor-pointer border border-[#202C3D] focus:outline-none focus:ring-1 focus:ring-[#1685FF]/50"
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
              <div className="mb-4 p-4 rounded-xl bg-[#0B0F17] border border-[#202C3D]">
                <span className="text-[10px] font-semibold text-[#1685FF] uppercase tracking-wider block mb-1">
                  Scroll-Stopping Hook
                </span>
                <p className="text-sm font-semibold text-white leading-snug">
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
                    className="w-full rounded-xl bg-[#0B0F17] border border-[#202C3D] p-3 text-sm text-[#F5F7FA] focus:outline-none focus:ring-1 focus:ring-[#1685FF]"
                  />
                ) : (
                  <div className="text-sm text-[#D2D8E2] leading-relaxed whitespace-pre-wrap font-sans">
                    {post.body}
                  </div>
                )}
              </div>

              {/* CTA */}
              {post.cta && (
                <div className="pt-3 border-t border-[#202C3D] flex items-center justify-between text-xs text-[#7F8BA0]">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#1685FF]">CTA:</span>
                    <span className="italic text-[#AAB4C5]">{post.cta}</span>
                  </div>
                  <div className="hidden sm:flex items-center gap-3 text-[#5A6472]">
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <MessageSquare className="w-3.5 h-3.5" />
                    <Share2 className="w-3.5 h-3.5" />
                    <Bookmark className="w-3.5 h-3.5" />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
