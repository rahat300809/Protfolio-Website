/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import FooterSection from './components/ui/footer-section';
import { SocialIcons } from './components/ui/social-icons';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Research from './pages/Research';
import Certificates from './pages/Certificates';
import Skills from './pages/Skills';
import Events from './pages/Events';
import Blog from './pages/Blog';
import Contact from './components/Contact';
import AdminDashboard from './pages/AdminDashboard';
import CVGenerator from './components/CVGenerator';
import Maintenance from './components/Maintenance';
import { FileText } from 'lucide-react';

import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import { BeamsBackground } from './components/ui/beams-background';

function AppContent() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const { isCVOpen, setIsCVOpen, settings } = usePortfolio();

  if (settings.isMaintenanceMode && !isAdmin) {
    return (
      <div className="min-h-screen relative text-slate-200">
        <Maintenance />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative text-slate-200">
      <BeamsBackground className="fixed inset-0 min-h-screen w-full overflow-hidden bg-slate-950 pointer-events-none -z-50 hidden md:block" />
      {!isAdmin && <Navbar />}
      {!isAdmin && (
        <div className="fixed top-4 right-4 z-50 hidden xl:block origin-top-right scale-90">
          <SocialIcons />
        </div>
      )}

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/events" element={<Events />} />
          <Route path="/research" element={<Research />} />
          <Route path="/certificates" element={<Certificates />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<div className="pt-20"><Contact /></div>} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>

      {!isAdmin && <FooterSection />}

      {/* Floating CV Button */}
      {!isAdmin && (
        settings.cvUrl ? (
          <a
            href={settings.cvUrl}
            target="_blank"
            rel="noreferrer"
            className="fixed bottom-8 right-8 z-40 w-14 h-14 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/20 hover:scale-110 active:scale-95 transition-all group"
          >
            <FileText size={24} />
            <span className="absolute right-full mr-4 px-3 py-1.5 rounded-lg glass text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              Download CV
            </span>
          </a>
        ) : (
          <button
            onClick={() => setIsCVOpen(true)}
            className="fixed bottom-8 right-8 z-40 w-14 h-14 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/20 hover:scale-110 active:scale-95 transition-all group"
          >
            <FileText size={24} />
            <span className="absolute right-full mr-4 px-3 py-1.5 rounded-lg glass text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              Generate CV
            </span>
          </button>
        )
      )}

      <CVGenerator isOpen={isCVOpen} onClose={() => setIsCVOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <PortfolioProvider>
      <Router>
        <AppContent />
      </Router>
    </PortfolioProvider>
  );
}
