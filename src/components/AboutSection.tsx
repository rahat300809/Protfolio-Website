import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GraduationCap, MapPin, Calendar, Briefcase, Info, X } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { QuickInfo, LifeEvent } from '../types';
import AboutUsSection from './ui/about-us-section';
import { ShuffleDeck } from './ui/shuffle-deck';

export default function AboutSection() {
  const { quickInfos, settings, workExperiences, lifeEvents } = usePortfolio();
  const [selectedInfo, setSelectedInfo] = useState<QuickInfo | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<LifeEvent | null>(null);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'education': return <GraduationCap size={20} />;
      case 'focus': return <Briefcase size={20} />;
      case 'location': return <MapPin size={20} />;
      case 'experience': return <Calendar size={20} />;
      default: return <Info size={20} />;
    }
  };

  const getIconColorClass = (iconName: string) => {
    switch (iconName) {
      case 'education': return 'text-emerald-400';
      case 'focus': return 'text-cyan-400';
      case 'location': return 'text-purple-400';
      case 'experience': return 'text-amber-400';
      default: return 'text-blue-400';
    }
  };

  return (
    <section id="about" className="relative overflow-hidden pb-24">
      <AboutUsSection title="About Me" description={settings.aboutText} image={settings.aboutImage} />

      <div className="container mx-auto px-6 mt-16">
        {/* Quick Infos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-16 max-w-6xl mx-auto">
          {quickInfos.map((info, idx) => (
            <motion.div
              key={info.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
            >
              <button
                onClick={() => setSelectedInfo(info)}
                className="glass-card p-6 flex flex-col items-center gap-4 w-full text-center hover:bg-white/10 transition-all cursor-pointer group"
              >
                <div className={`w-12 h-12 rounded-xl glass flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${getIconColorClass(info.icon)}`}>
                  {getIcon(info.icon)}
                </div>
                <div>
                  <h4 className="font-bold text-white group-hover:text-emerald-400 transition-colors">{info.title}</h4>
                  <p className="text-sm text-slate-500 mt-1">{info.subtitle}</p>
                </div>
              </button>
            </motion.div>
          ))}
        </div>

        {/* Two-Column Layout: Work Experience (card deck) & Life Events (card deck) */}
        <div className="mt-4 grid grid-cols-1 xl:grid-cols-2 gap-4 max-w-[90rem] mx-auto items-start">
          {/* Left Column: Work Experience as ShuffleDeck */}
          {workExperiences.length > 0 && (
            <div>
              <div className="text-left mb-4 px-2">
                <h2 className="text-3xl font-display font-bold mb-1">Work <span className="text-gradient">Experience</span></h2>
                <p className="text-slate-400 text-sm">My professional journey and roles in the tech industry.</p>
              </div>
              <ShuffleDeck
                items={workExperiences.map(exp => ({
                  id: exp.id,
                  title: exp.role,
                  subtitle: `${exp.company} · ${exp.timespan}`,
                  description: exp.description,
                  image: exp.logo || undefined,
                }))}
              />
            </div>
          )}

          {/* Right Column: Life Events as ShuffleDeck with click-to-explore */}
          {lifeEvents.length > 0 && (
            <div>
              <div className="text-left mb-4 px-2">
                <h2 className="text-3xl font-display font-bold mb-1">Life <span className="text-gradient">Events</span></h2>
                <p className="text-slate-400 text-sm">Moments, achievements, and experiences along the way.</p>
              </div>
              <ShuffleDeck
                items={lifeEvents.map(ev => ({
                  id: ev.id,
                  title: ev.title,
                  subtitle: `${ev.category} · ${ev.date}`,
                  description: ev.cursiveTitle || ev.description,
                  image: ev.image || undefined,
                }))}
                onItemClick={(item) => {
                  const ev = lifeEvents.find(e => e.id === item.id);
                  if (ev) setSelectedEvent(ev);
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Quick Info Modal */}
      <AnimatePresence>
        {selectedInfo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedInfo(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-10 p-8"
            >
              <button
                onClick={() => setSelectedInfo(null)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-4 mb-6">
                <div className={`w-12 h-12 rounded-xl glass flex items-center justify-center ${getIconColorClass(selectedInfo.icon)}`}>
                  {getIcon(selectedInfo.icon)}
                </div>
                <div>
                  <h3 className="text-2xl font-bold font-display">{selectedInfo.title}</h3>
                  <p className="text-emerald-400 font-medium">{selectedInfo.subtitle}</p>
                </div>
              </div>

              <p className="text-slate-300 leading-relaxed text-lg">{selectedInfo.description}</p>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setSelectedInfo(null)}
                  className="px-6 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Life Event Detail Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEvent(null)}
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden z-10"
            >
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 z-10 p-2 text-slate-400 hover:text-white bg-black/40 hover:bg-black/60 rounded-full transition-colors"
              >
                <X size={20} />
              </button>

              {selectedEvent.image && (
                <div className="relative w-full h-56 overflow-hidden">
                  <img src={selectedEvent.image} alt={selectedEvent.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/80 pointer-events-none" />
                </div>
              )}

              <div className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-bold uppercase tracking-widest">
                    {selectedEvent.category}
                  </span>
                  <span className="text-sm font-mono text-slate-500">{selectedEvent.date}</span>
                </div>

                <h3 className="text-3xl font-display font-bold text-white mb-3">{selectedEvent.title}</h3>

                {selectedEvent.cursiveTitle && (
                  <p className="text-cursive text-2xl text-emerald-400/90 leading-relaxed mb-4">
                    {selectedEvent.cursiveTitle}
                  </p>
                )}

                <p className="text-slate-300 text-base leading-relaxed">{selectedEvent.description}</p>

                <div className="mt-8 flex justify-end">
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="px-6 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
