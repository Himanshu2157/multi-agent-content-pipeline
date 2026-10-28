import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, ShieldCheck, ArrowRight, RotateCcw } from 'lucide-react';
import { LinkedInIcon, InstagramIcon } from './icons.js';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isConfigure = location.pathname === '/create' || location.pathname === '/configure';

  const handleHomeClick = () => {
    if (isHome) {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className="border-b border-[#202C3D] bg-[#0B0F17]/95 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" onClick={handleHomeClick} className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#1685FF] via-[#833AB4] to-[#E1306C] p-[1.5px] shadow-md shadow-blue-500/10 transition-transform group-hover:scale-105">
            <div className="w-full h-full bg-[#0B0F17] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#1685FF]" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-xl text-white">
                Content<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1685FF] via-[#B845C8] to-[#E1306C]">Smith</span>
              </span>
            </div>
            <p className="text-[11px] text-[#7F8BA0] hidden sm:block">Autonomous AI Content Pipeline</p>
          </div>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm">
          <Link
            to="/"
            onClick={handleHomeClick}
            className={`relative py-1 font-medium transition-colors ${
              isHome ? 'text-[#1685FF]' : 'text-[#AAB4C5] hover:text-white'
            }`}
          >
            <span>Home</span>
            {isHome && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-[#1685FF] rounded-full shadow-[0_0_8px_#1685FF]" />
            )}
          </Link>

          <Link
            to="/create"
            className={`relative py-1 font-medium transition-colors ${
              isConfigure ? 'text-[#1685FF]' : 'text-[#AAB4C5] hover:text-white'
            }`}
          >
            <span>Configure Engine</span>
            {isConfigure && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-[#1685FF] rounded-full shadow-[0_0_8px_#1685FF]" />
            )}
          </Link>

          <a
            href="/#flowchart"
            className="text-[#AAB4C5] hover:text-white transition-colors font-medium"
          >
            Agent Flowchart
          </a>

          <div className="flex items-center gap-1.5 text-xs text-[#AAB4C5] bg-[#111A27] px-3 py-1.5 rounded-full border border-[#202C3D]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#1685FF]" />
            <span>Anti-Filler Verified</span>
          </div>
        </nav>

        {/* Right Actions: Social Buttons + Gradient CTA */}
        <div className="flex items-center gap-3">
          {/* Refresh Page to Top Button */}
          <button
            onClick={() => {
              window.scrollTo(0, 0);
              window.location.reload();
            }}
            title="Reload Page to Top"
            className="w-9 h-9 rounded-xl bg-[#111A27] hover:bg-[#151F2E] text-[#AAB4C5] hover:text-white border border-[#202C3D] hover:border-[#35445A] flex items-center justify-center shadow-sm transition-all hover:scale-105 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* LinkedIn Icon Button */}
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            title="LinkedIn"
            className="w-9 h-9 rounded-xl bg-[#0077B5] hover:bg-[#0A66C2] text-white flex items-center justify-center shadow-sm transition-all hover:scale-105"
          >
            <LinkedInIcon className="w-4 h-4" />
          </a>

          {/* Instagram Icon Button */}
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            title="Instagram"
            className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#833AB4] via-[#E1306C] to-[#F77737] text-white flex items-center justify-center shadow-sm transition-all hover:scale-105"
          >
            <InstagramIcon className="w-4 h-4" />
          </a>

          {/* Signature Gradient CTA Button */}
          <Link
            to="/create"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#0A66C2] via-[#833AB4] to-[#E1306C] hover:opacity-95 shadow-md shadow-purple-500/20 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <span>Launch Smith</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
};
