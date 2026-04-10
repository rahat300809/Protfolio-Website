import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export default function EventCarousel({ compact = false }: { compact?: boolean }) {
    const { lifeEvents } = usePortfolio();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (!isHovered && lifeEvents.length > 1) {
            interval = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % lifeEvents.length);
            }, 3000);
        }
        return () => clearInterval(interval);
    }, [isHovered, lifeEvents.length]);

    if (!lifeEvents || lifeEvents.length === 0) {
        return null;
    }

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + lifeEvents.length) % lifeEvents.length);
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % lifeEvents.length);
    };

    const event = lifeEvents[currentIndex];

    return (
        <section className={`${compact ? 'relative overflow-hidden' : 'py-24 container mx-auto px-6 relative overflow-hidden'}`}>
            <div className={`flex flex-col ${compact ? '' : 'md:flex-row md:items-end'} justify-between mb-12 gap-6`}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className={`${compact ? 'text-3xl' : 'text-4xl'} font-display font-bold mb-4`}>Life <span className="text-gradient">Events</span></h2>
                    <p className="text-slate-400 max-w-xl">
                        Moments, achievements, and experiences working with teams and learning new things.
                    </p>
                </motion.div>

                <div className={`flex gap-4 self-center ${compact ? '' : 'md:self-end'}`}>
                    <button
                        onClick={handlePrev}
                        className="w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-white/10 hover:text-emerald-400 transition-all border border-white/5"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        onClick={handleNext}
                        className="w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-white/10 hover:text-emerald-400 transition-all border border-white/5"
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>
            </div>

            <div
                className="relative w-full rounded-3xl overflow-hidden glass border border-white/10 shadow-2xl"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.5 }}
                        className={`flex flex-col w-full ${compact ? '' : 'md:flex-row'} min-h-[400px]`}
                    >
                        {/* Left Side: Square Box Image */}
                        <div className={`w-full ${compact ? '' : 'md:w-[400px]'} shrink-0 p-6 md:p-8`}>
                            <div className="aspect-square rounded-2xl overflow-hidden glass border border-white/10 shadow-xl relative group">
                                {event.image ? (
                                    <img
                                        src={event.image}
                                        alt={event.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center">
                                        <Calendar size={64} className="text-slate-700 mb-4" />
                                        <span className="text-slate-500 font-medium text-sm">No Photo</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent pointer-events-none" />
                            </div>
                        </div>

                        {/* Right Side: Mixed Text Content */}
                        <div className={`flex-1 ${compact ? 'p-6 md:p-8 pt-0' : 'p-8 md:p-12'} flex flex-col justify-center`}>
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <div className="flex items-center gap-4 mb-6">
                                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-[10px] font-bold uppercase tracking-[0.2em]">
                                        {event.category}
                                    </span>
                                    <span className="text-sm font-mono text-slate-500">{event.date}</span>
                                </div>

                                <h3 className={`font-display font-bold ${compact ? 'text-2xl md:text-3xl' : 'text-3xl md:text-5xl'} text-white mb-4 leading-tight`}>
                                    {event.title}
                                </h3>

                                {event.cursiveTitle && (
                                    <div className="mb-8">
                                        <p className={`text-cursive ${compact ? 'text-2xl' : 'text-3xl md:text-4xl'} text-emerald-400/90 leading-relaxed`}>
                                            {event.cursiveTitle}
                                        </p>
                                    </div>
                                )}

                                <p className={`text-slate-400 ${compact ? 'text-base' : 'text-lg'} leading-relaxed max-w-2xl font-light`}>
                                    {event.description}
                                </p>
                            </motion.div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Progress Indicators */}
                <div className="absolute bottom-8 right-8 z-20 flex gap-3">
                    {lifeEvents.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`h-1.5 transition-all duration-300 rounded-full ${idx === currentIndex ? 'w-10 bg-emerald-400' : 'w-2 bg-white/20 hover:bg-white/40'}`}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>
            </div>

            <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
        </section>
    );
}
