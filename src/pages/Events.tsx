import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, X } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { LifeEvent } from '../types';
import { CircularTestimonials } from '../components/ui/circular-testimonials';

export default function Events() {
    const { lifeEvents } = usePortfolio();
    const [selectedEvent, setSelectedEvent] = useState<LifeEvent | null>(null);

    return (
        <div className="pt-24 pb-20 min-h-screen">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-16"
                >
                    <h1 className="text-5xl md:text-6xl font-display font-black tracking-tight mb-6">
                        Life <span className="text-emerald-500">Events</span>
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl leading-relaxed">
                        A timeline of my achievements, experiences, and important life moments.
                    </p>
                </motion.div>

                {lifeEvents.length === 0 ? (
                    <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
                        <Calendar size={64} className="mx-auto mb-6 opacity-20 text-slate-400" />
                        <p className="text-xl text-slate-400">No events found yet.</p>
                    </div>
                ) : (
                    <div className="bg-slate-900/50 p-6 md:p-12 rounded-3xl border border-white/10 overflow-hidden">
                        <CircularTestimonials
                            testimonials={lifeEvents.map(event => ({
                                quote: event.description || "An important life event.",
                                name: event.title,
                                designation: `${event.category} - ${event.date}`,
                                src: event.image || "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1368&auto=format&fit=crop"
                            }))}
                            autoplay={true}
                            colors={{
                                name: "#34d399",
                                designation: "#94a3b8",
                                testimony: "#f8fafc",
                                arrowBackground: "rgba(255,255,255,0.05)",
                                arrowForeground: "#f8fafc",
                                arrowHoverBackground: "rgba(16, 185, 129, 0.2)",
                            }}
                            fontSizes={{
                                name: "1.5rem",
                                designation: "0.875rem",
                                quote: "1.25rem",
                            }}
                        />
                    </div>
                )}

                <AnimatePresence>
                    {selectedEvent && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setSelectedEvent(null)}
                                className="absolute inset-0 bg-slate-950/95 backdrop-blur-xl"
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="relative w-full max-w-6xl glass rounded-3xl overflow-hidden flex flex-col md:flex-row max-h-[95vh] shadow-2xl border border-white/20"
                            >
                                <button
                                    onClick={() => setSelectedEvent(null)}
                                    className="absolute top-4 right-4 z-20 w-12 h-12 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-emerald-500 hover:text-white hover:scale-110 transition-all border border-white/20"
                                >
                                    <X size={24} />
                                </button>

                                {selectedEvent.image && (
                                    <div className="w-full md:w-1/2  md:h-auto bg-black flex items-center justify-center relative overflow-hidden border-b md:border-b-0 md:border-r border-white/10">
                                        <div className="absolute inset-0 flex items-center justify-center p-1">
                                            <img
                                                src={selectedEvent.image}
                                                alt={selectedEvent.title}
                                                className="w-full h-full object-contain drop-shadow-2xl"
                                                style={{ maxHeight: 'calc(95vh - 2px)' }}
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className={`w-full flex-shrink-0 ${selectedEvent.image ? 'md:w-1/2' : ''} p-8 md:p-14 overflow-y-auto bg-slate-900/80`}>
                                    <div className="flex flex-wrap items-center gap-4 mb-8">
                                        <div className="bg-emerald-500/10 text-emerald-400 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider border border-emerald-500/20 shadow-inner">
                                            {selectedEvent.category}
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-400 font-mono bg-white/5 px-4 py-1.5 rounded-full border border-white/5">
                                            <Calendar size={16} className="text-emerald-500" />
                                            <span>{selectedEvent.date}</span>
                                        </div>
                                    </div>

                                    <h2 className="text-4xl md:text-5xl font-display font-black mb-8 text-white leading-tight">
                                        {selectedEvent.title}
                                    </h2>

                                    <div className="prose prose-invert prose-lg max-w-none">
                                        <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                                            {selectedEvent.description}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
