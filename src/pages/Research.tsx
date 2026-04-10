import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { usePortfolio } from '../context/PortfolioContext';
import { Research } from '../types';
import { Calendar, ArrowRight, Microscope, X, Github, Linkedin, ExternalLink } from 'lucide-react';
import { ShuffleDeck, DeckItem } from '../components/ui/shuffle-deck';

export default function ResearchPage() {
  const { researchItems } = usePortfolio();
  const [selectedResearch, setSelectedResearch] = useState<Research | null>(null);

  const deckItems = researchItems.slice(0, 5).map(r => ({
    id: r.id,
    title: r.title,
    subtitle: r.conference || r.journal || "Research",
    description: r.abstract,
    image: r.image
  }));

  return (
    <div className="pt-32 pb-20 container mx-auto px-4 sm:px-6">
      <div className="mb-16 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-6">Research <span className="text-gradient">Lab</span></h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Deep dives into emerging technologies, biotechnology, and artificial intelligence.
        </p>
      </div>

      {researchItems.length >= 2 && (
        <div className="mb-20 hidden md:block">
          <h2 className="text-2xl font-bold text-center mb-8">Featured Research</h2>
          <ShuffleDeck items={deckItems} />
        </div>
      )}

      <div className="max-w-4xl mx-auto space-y-12">
        {researchItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative flex flex-col md:flex-row gap-8 items-center"
          >
            <div className="w-full md:w-1/2 aspect-video rounded-3xl overflow-hidden glass">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="w-full md:w-1/2 space-y-4">
              <div className="flex items-center gap-3 text-emerald-400">
                <Calendar size={18} />
                <span className="text-sm font-medium">{item.publicationDate}</span>
              </div>
              <h3 className="text-3xl font-display font-bold">{item.title}</h3>
              <p className="text-slate-400 leading-relaxed font-semibold italic text-sm">{item.authors}</p>
              <button
                onClick={() => setSelectedResearch(item)}
                className="flex items-center gap-2 text-emerald-400 font-bold hover:gap-4 transition-all"
              >
                Read Full Details <ArrowRight size={20} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedResearch && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedResearch(null)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-3xl glass rounded-3xl p-8 md:p-12 overflow-y-auto max-h-[90vh]"
            >
              <button
                onClick={() => setSelectedResearch(null)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 text-slate-400 transition-colors"
              >
                <X size={24} />
              </button>
              <div className="flex items-center gap-4 text-emerald-400 mb-6">
                <Microscope size={32} />
                <span className="text-lg font-bold uppercase tracking-widest">Research Case Study</span>
              </div>
              <h2 className="text-4xl font-display font-bold mb-2">{selectedResearch.title}</h2>
              <p className="text-slate-400 mb-6 italic">{selectedResearch.authors}</p>

              <div className="prose prose-invert max-w-none">
                <p className="text-slate-300 text-lg leading-relaxed whitespace-pre-wrap">
                  {selectedResearch.abstract}
                </p>
              </div>

              {(selectedResearch.link || selectedResearch.githubLink || selectedResearch.linkedinLink || selectedResearch.websiteLink) && (
                <div className="mt-8 flex flex-wrap gap-4">
                  {selectedResearch.link && (
                    <a
                      href={selectedResearch.link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-colors rounded-xl font-bold"
                    >
                      View Publication
                    </a>
                  )}
                  {selectedResearch.githubLink && (
                    <a href={selectedResearch.githubLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors rounded-xl font-bold">
                      <Github size={18} /> GitHub
                    </a>
                  )}
                  {selectedResearch.linkedinLink && (
                    <a href={selectedResearch.linkedinLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 text-[#0A66C2] border border-[#0A66C2]/30 transition-colors rounded-xl font-bold">
                      <Linkedin size={18} /> LinkedIn
                    </a>
                  )}
                  {selectedResearch.websiteLink && (
                    <a href={selectedResearch.websiteLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 transition-colors rounded-xl font-bold">
                      <ExternalLink size={18} /> Website
                    </a>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
