import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <header className="border-b border-forge-700 bg-forge-950/95 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-lg bg-[#0A66C2] flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
            <Sparkles className="w-4.5 h-4.5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-lg text-white">ContentForge</span>
              <span className="px-2 py-0.5 text-[10px] uppercase font-semibold tracking-wider rounded-md bg-[#0A66C2]/15 text-[#1685FF] border border-[#0A66C2]/30">
                Agentic MVP
              </span>
            </div>
            <p className="text-xs text-forge-400 hidden sm:block">Multi-Agent Self-Refining Content Pipeline</p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-forge-900 border border-forge-700 text-xs text-forge-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Multi-Agent Engine Online</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-forge-300 bg-forge-900 px-3 py-1.5 rounded-lg border border-forge-700">
            <ShieldCheck className="w-4 h-4 text-[#0A66C2]" />
            <span>Fact-Checking Active</span>
          </div>
        </div>
      </div>
    </header>
  );
};
