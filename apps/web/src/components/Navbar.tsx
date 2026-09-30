import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <header className="border-b border-forge-800/80 bg-forge-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-emerald-400 p-[1px] shadow-lg shadow-brand-500/10">
            <div className="w-full h-full bg-forge-950 rounded-[11px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-brand-500 group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-lg text-white">ContentForge</span>
              <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20">
                Agentic MVP
              </span>
            </div>
            <p className="text-xs text-forge-400 hidden sm:block">Multi-Agent Self-Refining Content Pipeline</p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-forge-900 border border-forge-800 text-xs text-forge-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Multi-Agent Engine Online</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-forge-400 bg-forge-900/50 px-3 py-1.5 rounded-lg border border-forge-800/50">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Fact-Checking Active</span>
          </div>
        </div>
      </div>
    </header>
  );
};
