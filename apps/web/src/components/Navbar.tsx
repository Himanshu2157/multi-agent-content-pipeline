import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, ShieldCheck, ArrowRight, RotateCcw, Menu, X } from 'lucide-react';
import { LinkedInIcon, InstagramIcon } from './icons.js';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isConfigure = location.pathname === '/create' || location.pathname === '/configure';
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const handleHomeClick = () => {
    if (isHome) {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  };

  const navLinkClass = (isActive: boolean) =>
    `relative py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2787FF]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded ${
      isActive ? 'text-[#E8EDF7]' : 'text-[#A1A9BA] hover:text-[#E8EDF7]'
    }`;

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        isScrolled
          ? 'border-[#252B38] bg-[#000000]/80 backdrop-blur-xl shadow-[0_10px_30px_-20px_rgba(0,0,0,1)]'
          : 'border-transparent bg-[#000000]/40 backdrop-blur-md'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          to="/"
          onClick={handleHomeClick}
          className="flex items-center gap-3 group rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2787FF]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          aria-label="ContentSmith home"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#2787FF] via-[#7B3FE4] to-[#D21BCE] p-[1.5px] shadow-sm shadow-[#2787FF]/10 transition-transform duration-300 group-hover:scale-105">
            <div className="w-full h-full bg-[#080C15] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#2787FF]" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold tracking-tight text-xl text-[#E8EDF7]">
                Content<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2787FF] via-[#A836D9] to-[#D21BCE]">Smith</span>
              </span>
              <span className="hidden sm:inline-flex items-center rounded-full border border-[#252B38] bg-[#080C15] px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider text-[#8FA6C6]">
                v1
              </span>
            </div>
            <p className="text-[11px] text-[#A1A9BA] hidden sm:block">Autonomous AI content pipeline</p>
          </div>
        </Link>

        {/* Center Nav Links */}
        <nav aria-label="Primary" className="hidden md:flex items-center gap-7 text-sm">
          <Link
            to="/"
            onClick={handleHomeClick}
            aria-current={isHome ? 'page' : undefined}
            className={navLinkClass(isHome)}
          >
            <span>Home</span>
            {isHome && (
              <span className="absolute -bottom-[3px] left-1/2 -translate-x-1/2 w-6 h-[2px] rounded-full bg-gradient-to-r from-[#2787FF] to-[#D21BCE] shadow-[0_0_10px_rgba(39,135,255,0.8)]" />
            )}
          </Link>

          <Link
            to="/create"
            aria-current={isConfigure ? 'page' : undefined}
            className={navLinkClass(isConfigure)}
          >
            <span>Configure Engine</span>
            {isConfigure && (
              <span className="absolute -bottom-[3px] left-1/2 -translate-x-1/2 w-6 h-[2px] rounded-full bg-gradient-to-r from-[#2787FF] to-[#D21BCE] shadow-[0_0_10px_rgba(39,135,255,0.8)]" />
            )}
          </Link>

          <a
            href="/#flowchart"
            className="text-[#A1A9BA] hover:text-[#E8EDF7] transition-colors font-medium rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2787FF]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            Agent Flowchart
          </a>

          <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#A1A9BA] bg-[#080C15] px-3 py-1.5 rounded-full border border-[#252B38]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#2787FF]" />
            <span>Anti-Filler Verified</span>
          </div>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <button
            onClick={() => {
              window.scrollTo(0, 0);
              window.location.reload();
            }}
            aria-label="Reload page"
            title="Reload page"
            className="hidden sm:flex w-9 h-9 rounded-xl bg-[#080C15] hover:bg-[#0E1422] text-[#A1A9BA] hover:text-[#E8EDF7] border border-[#252B38] hover:border-[#34445F] items-center justify-center shadow-sm transition-all duration-200 hover:scale-105 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2787FF]/70"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="ContentSmith on LinkedIn"
            title="LinkedIn"
            className="hidden sm:flex w-9 h-9 rounded-xl bg-[#080C15] hover:bg-[#0A66C2] text-[#A1A9BA] hover:text-white border border-[#252B38] hover:border-[#0A66C2] items-center justify-center shadow-sm transition-all duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A66C2]/70"
          >
            <LinkedInIcon className="w-4 h-4" />
          </a>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="ContentSmith on Instagram"
            title="Instagram"
            className="hidden sm:flex w-9 h-9 rounded-xl bg-[#080C15] hover:bg-[#0E1422] text-[#A1A9BA] hover:text-white border border-[#252B38] hover:border-[#D21BCE]/50 items-center justify-center shadow-sm transition-all duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D21BCE]/60"
          >
            <InstagramIcon className="w-4 h-4" />
          </a>

          <Link
            to="/create"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#2787FF] hover:bg-[#1E74E0] shadow-md shadow-[#2787FF]/20 transition-all duration-200 hover:scale-[1.02] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2787FF]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            <span>Launch Smith</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-nav"
            className="md:hidden w-10 h-10 rounded-xl bg-[#080C15] text-[#E8EDF7] border border-[#252B38] flex items-center justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2787FF]/70"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation panel */}
      {isMenuOpen && (
        <div
          id="mobile-nav"
          className="md:hidden border-t border-[#252B38] bg-[#05080F]/95 backdrop-blur-xl animate-slideDown"
        >
          <nav aria-label="Mobile" className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col gap-1">
            <Link
              to="/"
              onClick={handleHomeClick}
              aria-current={isHome ? 'page' : undefined}
              className={`px-3 py-3 rounded-xl text-sm font-semibold transition-colors ${
                isHome ? 'bg-[#2787FF]/10 text-[#E8EDF7]' : 'text-[#A1A9BA] hover:bg-[#080C15] hover:text-[#E8EDF7]'
              }`}
            >
              Home
            </Link>
            <Link
              to="/create"
              aria-current={isConfigure ? 'page' : undefined}
              className={`px-3 py-3 rounded-xl text-sm font-semibold transition-colors ${
                isConfigure ? 'bg-[#2787FF]/10 text-[#E8EDF7]' : 'text-[#A1A9BA] hover:bg-[#080C15] hover:text-[#E8EDF7]'
              }`}
            >
              Configure Engine
            </Link>
            <a
              href="/#flowchart"
              className="px-3 py-3 rounded-xl text-sm font-semibold text-[#A1A9BA] hover:bg-[#080C15] hover:text-[#E8EDF7] transition-colors"
            >
              Agent Flowchart
            </a>
            <Link
              to="/create"
              className="mt-2 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-white bg-[#2787FF] hover:bg-[#1E74E0] transition-colors"
            >
              <span>Launch Smith</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <div className="flex items-center justify-center gap-3 pt-3">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="ContentSmith on LinkedIn"
                className="w-10 h-10 rounded-xl bg-[#080C15] text-[#A1A9BA] border border-[#252B38] flex items-center justify-center"
              >
                <LinkedInIcon className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="ContentSmith on Instagram"
                className="w-10 h-10 rounded-xl bg-[#080C15] text-[#A1A9BA] border border-[#252B38] flex items-center justify-center"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <button
                type="button"
                onClick={() => {
                  window.scrollTo(0, 0);
                  window.location.reload();
                }}
                aria-label="Reload page"
                className="w-10 h-10 rounded-xl bg-[#080C15] text-[#A1A9BA] border border-[#252B38] flex items-center justify-center cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
