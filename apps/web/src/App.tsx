import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Navbar } from './components/Navbar.js';
import { StartPage } from './pages/StartPage.js';
import { HomePage } from './pages/HomePage.js';
import { ProjectPage } from './pages/ProjectPage.js';

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
        <div className="min-h-screen flex flex-col bg-[#0B0F17] text-[#F5F7FA]">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<StartPage />} />
              <Route path="/create" element={<HomePage />} />
              <Route path="/configure" element={<HomePage />} />
              <Route path="/project/:projectId" element={<ProjectPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <footer className="border-t border-[#202C3D] py-8 text-center text-xs text-[#7F8BA0] bg-[#0B0F17]">
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
