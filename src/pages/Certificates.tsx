import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { usePortfolio } from '../context/PortfolioContext';
import { Award, ExternalLink, X } from 'lucide-react';
import { ShuffleDeck } from '../components/ui/shuffle-deck';

export default function Certificates() {
  const { certificates } = usePortfolio();
  const [selectedCert, setSelectedCert] = useState<string | null>(null);

  const deckItems = certificates.slice(0, 5).map(c => ({
    id: c.id,
    title: c.title,
    subtitle: c.organization,
    description: `Issued: ${c.date}`,
    image: c.image
  }));

  return (
    <div className="pt-32 pb-20 container mx-auto px-4 sm:px-6">
      <div className="mb-16 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-6">My <span className="text-gradient">Certifications</span></h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Professional certifications and courses completed in the fields of IoT, AI, and Software Engineering.
        </p>
      </div>

      {certificates.length > 0 && (
        <div className="mb-20">
          <ShuffleDeck items={deckItems} />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {certificates.map((cert) => (
          <motion.div
            key={cert.id}
            whileHover={{ y: -5 }}
            className="glass-card group cursor-pointer overflow-hidden"
            onClick={() => setSelectedCert(cert.image)}
          >
            <div className="aspect-[4/3] overflow-hidden relative">
              <img
                src={cert.image}
                alt={cert.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <ExternalLink size={32} className="text-emerald-400" />
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3 text-emerald-400 mb-3">
                <Award size={20} />
                <span className="text-xs font-bold uppercase tracking-widest">{cert.organization}</span>
              </div>
              <h3 className="text-xl font-bold group-hover:text-emerald-400 transition-colors">{cert.title}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedCert && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCert(null)}
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-5xl w-full"
            >
              <button
                onClick={() => setSelectedCert(null)}
                className="absolute -top-12 right-0 text-white hover:text-emerald-400 transition-colors"
              >
                <X size={32} />
              </button>
              <img
                src={selectedCert}
                alt="Certificate Preview"
                className="w-full h-auto rounded-2xl shadow-2xl"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
