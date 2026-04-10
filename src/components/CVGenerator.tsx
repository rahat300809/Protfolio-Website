import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Download, Printer, User, Mail, Phone, MapPin, Globe, Github, Linkedin, Award, Briefcase, Cpu, GraduationCap } from 'lucide-react';
import { certificates } from '../data/mockData';
import { usePortfolio } from '../context/PortfolioContext';

interface CVGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CVGenerator({ isOpen, onClose }: CVGeneratorProps) {
  const { projects, skillCategories } = usePortfolio();
  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-5xl h-[90vh] glass rounded-3xl overflow-hidden flex flex-col"
          >
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Printer size={20} className="text-emerald-400" />
                CV Preview
              </h2>
              <div className="flex items-center gap-2">
                <button onClick={handlePrint} className="glass-button py-2 px-4 text-sm bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                  <Printer size={16} /> Print / Save PDF
                </button>
                <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-slate-400">
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 md:p-12 bg-white text-slate-900 print:p-0 print:bg-white">
              {/* CV Content - Styled for Print */}
              <div id="cv-content" className="max-w-4xl mx-auto">
                <header className="border-b-4 border-emerald-500 pb-8 mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                  <div>
                    <h1 className="text-5xl font-display font-black tracking-tight mb-2">MD. RAHAT <span className="text-emerald-600">MAHAMUD</span></h1>
                    <p className="text-xl font-bold text-slate-600 uppercase tracking-widest">IoT Developer | Embedded Systems | AI Enthusiast</p>
                  </div>
                  <div className="space-y-1 text-sm font-medium text-slate-500 text-right">
                    <p className="flex items-center justify-end gap-2"><Mail size={14} /> rahat3008096081@gmail.com</p>
                    <p className="flex items-center justify-end gap-2"><Phone size={14} /> 01909566539</p>
                    <p className="flex items-center justify-end gap-2"><MapPin size={14} /> Dhaka, Bangladesh</p>
                    <p className="flex items-center justify-end gap-2"><Linkedin size={14} /> linkedin.com/in/rahat300809</p>
                  </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  <div className="md:col-span-1 space-y-8">
                    <section>
                      <h3 className="text-lg font-black uppercase tracking-widest border-b-2 border-slate-200 pb-2 mb-4 flex items-center gap-2">
                        <GraduationCap size={18} className="text-emerald-600" /> Education
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <p className="font-bold">B.Sc. in CSE</p>
                          <p className="text-sm text-slate-600">Daffodil International University</p>
                          <p className="text-xs text-slate-400">2021 - Present</p>
                        </div>
                      </div>
                    </section>

                    <section>
                      <h3 className="text-lg font-black uppercase tracking-widest border-b-2 border-slate-200 pb-2 mb-4 flex items-center gap-2">
                        <Cpu size={18} className="text-emerald-600" /> Skills
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {skillCategories.flatMap(cat => cat.skills).map(s => (
                          <span key={s.name} className="px-2 py-1 bg-slate-100 rounded text-xs font-bold text-slate-700">{s.name}</span>
                        ))}
                      </div>
                    </section>

                    <section>
                      <h3 className="text-lg font-black uppercase tracking-widest border-b-2 border-slate-200 pb-2 mb-4 flex items-center gap-2">
                        <Award size={18} className="text-emerald-600" /> Certificates
                      </h3>
                      <div className="space-y-3">
                        {certificates.map(c => (
                          <div key={c.id}>
                            <p className="text-sm font-bold">{c.title}</p>
                            <p className="text-xs text-slate-500">{c.organization}</p>
                          </div>
                        ))}
                      </div>
                    </section>
                  </div>

                  <div className="md:col-span-2 space-y-8">
                    <section>
                      <h3 className="text-lg font-black uppercase tracking-widest border-b-2 border-slate-200 pb-2 mb-4 flex items-center gap-2">
                        <Briefcase size={18} className="text-emerald-600" /> Key Projects
                      </h3>
                      <div className="space-y-6">
                        {projects.slice(0, 6).map(p => (
                          <div key={p.id}>
                            <div className="flex justify-between items-start mb-1">
                              <p className="font-bold text-lg">{p.title}</p>
                              <span className="text-xs font-bold px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded uppercase">{p.status}</span>
                            </div>
                            <p className="text-sm text-slate-600 mb-2">{p.description}</p>
                            <div className="flex flex-wrap gap-2">
                              {p.technologies.map(t => (
                                <span key={t} className="text-[10px] font-bold text-slate-400"># {t}</span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
