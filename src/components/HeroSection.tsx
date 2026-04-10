import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Download, ArrowRight, Github, Linkedin, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePortfolio } from '../context/PortfolioContext';
import { LiquidButton } from './ui/liquid-glass-button';

import AnoAI from './ui/animated-shader-background';

export default function HeroSection() {
  const { settings, setIsCVOpen } = usePortfolio();
  const containerRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const shadowX = useTransform(mouseXSpring, [-0.5, 0.5], [20, -20]);
  const shadowY = useTransform(mouseYSpring, [-0.5, 0.5], [20, -20]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden">
      {/* Background */}
      <AnoAI />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full animate-pulse" />

      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">

          {/* Mobile profile image (circular) */}
          <div className="flex justify-center lg:hidden">
            <div className="w-36 h-36 sm:w-48 sm:h-48 rounded-full overflow-hidden glass border border-white/10 shadow-xl shadow-emerald-500/10">
              <img
                src={settings.profileImage}
                alt={settings.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center lg:text-left"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-medium mb-5 border border-emerald-500/20">
              Available for new opportunities
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4 tracking-tight leading-tight">
              Hi, I am <span className="text-gradient">{settings.name}</span>
            </h1>
            <p className="text-lg text-slate-400 font-medium mb-2">
              {settings.title}
            </p>
            <p className="text-sm sm:text-base text-slate-500 mb-8 max-w-lg mx-auto lg:mx-0">
              {settings.bio}
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-8">
              <Link to="/projects">
                <LiquidButton>
                  View Projects <ArrowRight size={18} />
                </LiquidButton>
              </Link>
              {settings.cvUrl ? (
                <a href={settings.cvUrl} target="_blank" rel="noreferrer">
                  <LiquidButton variant="outline">
                    Download CV <Download size={18} />
                  </LiquidButton>
                </a>
              ) : (
                <LiquidButton variant="outline" onClick={() => setIsCVOpen(true)}>
                  Download CV <Download size={18} />
                </LiquidButton>
              )}
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-6 text-slate-400">
              <a href="https://github.com/rahat300809/" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                <Github size={24} />
              </a>
              <a href="https://www.linkedin.com/in/rahat300809/" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                <Linkedin size={24} />
              </a>
              <a href="mailto:rahat3008096081@gmail.com" className="hover:text-white transition-colors">
                <Mail size={24} />
              </a>
            </div>
          </motion.div>

          {/* Desktop 3D Tilt Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 30 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block perspective-1000"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            ref={containerRef}
          >
            <motion.div
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
              className="relative z-10 w-full max-w-md mx-auto aspect-[4/5] rounded-[2rem] overflow-hidden glass border-white/10 shadow-2xl"
            >
              <img
                src={settings.profileImage}
                alt={settings.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
            </motion.div>

            <motion.div
              style={{ x: shadowX, y: shadowY, scale: 0.95 }}
              className="absolute inset-0 bg-emerald-500/20 blur-[60px] rounded-[2rem] -z-10"
            />
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-emerald-500/20 blur-3xl rounded-full -z-10" />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-cyan-500/20 blur-3xl rounded-full -z-10" />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
