import React from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, Github, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="py-12 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="glass rounded-3xl p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-cyan-400" />
          
          <h2 className="text-2xl font-display font-bold mb-2">MD. Rahat Mahamud</h2>
          <p className="text-slate-400 mb-8">Computer Science & Engineering Student | Daffodil International University</p>
          
          <div className="flex flex-wrap items-center justify-center gap-8 mb-10">
            <a href="mailto:252-15-234@diu.edu.bd" className="flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors">
              <Mail size={18} />
              252-15-234@diu.edu.bd
            </a>
            <a href="tel:01909566539" className="flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors">
              <Phone size={18} />
              01909566539
            </a>
          </div>

          <div className="flex items-center justify-center gap-4 mb-10">
            <a href="https://github.com/rahat300809/" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl glass flex items-center justify-center text-slate-400 hover:text-emerald-400 transition-all">
              <Github size={20} />
            </a>
            <a href="https://www.linkedin.com/in/rahat300809/" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl glass flex items-center justify-center text-slate-400 hover:text-emerald-400 transition-all">
              <Linkedin size={20} />
            </a>
          </div>

          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} MD. Rahat Mahamud. All rights reserved. Built with Passion & IoT.
          </p>
        </div>
      </div>
    </footer>
  );
}
