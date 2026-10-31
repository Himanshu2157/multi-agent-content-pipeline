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
          {/* Continuous Full-Page Pure Black Canvas & Refined Monochrome Particle Background */}
          <InteractiveBackground />
          <Navbar />
          <main className="flex-1 relative z-20">
            <Routes>
              <Route path="/" element={<StartPage />} />
              <Route path="/create" element={<HomePage />} />
              <Route path="/configure" element={<HomePage />} />
              <Route path="/project/:projectId" element={<ProjectPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <footer className="relative z-20 border-t border-[#252B38] py-8 text-center text-xs text-[#A1A9BA] bg-[#000000]/90 backdrop-blur-md">
            <p>
              Content<span className="spectrum-gradient-text font-bold">Smith</span> &bull; Autonomous Multi-Agent AI Content Engine &bull; Grounded Citations & Adversarial Quality Review
            </p>
          </footer>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
