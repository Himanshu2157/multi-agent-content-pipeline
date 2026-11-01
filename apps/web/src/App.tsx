import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Navbar } from './components/Navbar.js';
import { InteractiveBackground } from './components/InteractiveBackground.js';
import { StartPage } from './pages/StartPage.js';
import { HomePage } from './pages/HomePage.js';
import { ProjectPage } from './pages/ProjectPage.js';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col bg-[#000000] text-[#E8EDF7] relative selection:bg-[#2787FF]/25 selection:text-[#2787FF]">
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>
          {/* Continuous Full-Page Pure Black Canvas & Refined Monochrome Particle Background */}
          <InteractiveBackground />
          <Navbar />
          <main id="main-content" tabIndex={-1} className="flex-1 relative z-20 focus:outline-none">
            <Routes>
              <Route path="/" element={<StartPage />} />
              <Route path="/create" element={<HomePage />} />
              <Route path="/configure" element={<HomePage />} />
              <Route path="/project/:projectId" element={<ProjectPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <footer className="relative z-20 border-t border-[#252B38] bg-[#000000]/80 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-[#A1A9BA] text-center sm:text-left">
                Content<span className="spectrum-gradient-text font-bold">Smith</span>
                <span className="mx-2 text-[#34445F]">/</span>
                Autonomous multi-agent content engine
              </p>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#737D91] text-center sm:text-right">
                Grounded citations &bull; Adversarial review
              </p>
            </div>
          </footer>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
