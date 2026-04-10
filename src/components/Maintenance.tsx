import React from 'react';
import { BeamsBackground } from './ui/beams-background';

export default function Maintenance() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#1a1c43] text-white">
      <div className="absolute inset-0 z-0">
        <BeamsBackground className="w-full h-full opacity-50" />
      </div>
      
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-12 lg:gap-24 p-8 max-w-5xl mx-auto w-full">
        {/* Astronaut Illustration Area */}
        <div className="relative w-72 h-72 md:w-96 md:h-96 flex-shrink-0 animate-float">
          {/* Swirling Portal Effect */}
          <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-[80px] animate-pulse" />
          <div className="absolute inset-4 rounded-full border border-white/10" style={{ transform: 'rotateX(70deg) rotateY(20deg)', animation: 'spin 10s linear infinite' }} />
          <div className="absolute inset-8 rounded-full border border-blue-400/20" style={{ transform: 'rotateX(60deg) rotateY(-20deg)', animation: 'spin 15s linear infinite reverse' }} />
          
          {/* Generative Astronaut Image */}
          <img 
            src="/astronaut-maintenance.png" 
            alt="Astronaut in portal" 
            className="absolute inset-0 w-full h-full object-contain filter drop-shadow-[0_0_30px_rgba(59,130,246,0.3)]"
          />
          
          <div className="absolute top-1/4 left-0 w-2 h-2 bg-yellow-300 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
          <div className="absolute bottom-1/4 right-8 w-1.5 h-1.5 bg-white rounded-full animate-ping" style={{ animationDelay: '1.2s' }} />
          <div className="absolute top-10 right-1/4 w-3 h-3 bg-yellow-200 rounded-full animate-ping" style={{ animationDelay: '2s' }} />
        </div>
        
        {/* Maintenance Text Content */}
        <div className="text-center md:text-left space-y-6 max-w-lg">
          <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-white">
            Maintenance Mode
          </h1>
          
          <div className="space-y-3 border-l-4 border-blue-500/50 pl-5 py-2 mt-8">
            <p className="text-lg md:text-xl text-slate-300 font-medium">
              We are adding new features:
            </p>
            <p className="text-slate-400 text-lg">
              it will be operational really soon
            </p>
            <p className="text-blue-400 text-sm font-bold uppercase tracking-widest mt-4">
              May the force be with you
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(2deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
