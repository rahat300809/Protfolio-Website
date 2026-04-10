import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Cpu, CheckCircle2, Layers, Github, Linkedin, ExternalLink } from 'lucide-react';
import { Project } from '../types';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  if (!project) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-4xl max-h-[90vh] glass rounded-3xl overflow-hidden flex flex-col shadow-emerald-500/10"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-950/50 text-white hover:bg-emerald-500 transition-colors"
          >
            <X size={20} />
          </button>

          <div className="overflow-y-auto">
            <div className="aspect-video w-full relative">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider border border-emerald-500/30 mb-3 inline-block">
                  {project.category}
                </span>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-white">{project.title}</h2>
              </div>
            </div>

            <div className="p-6 md:p-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="md:col-span-2">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Layers size={20} className="text-emerald-400" />
                    Overview
                  </h3>
                  <p className="text-slate-400 leading-relaxed mb-8">
                    {project.fullDescription}
                  </p>

                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <CheckCircle2 size={20} className="text-emerald-400" />
                    Key Features
                  </h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                    {project.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-slate-400 text-sm">
                        <div className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-8">
                  <div>
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Status</h3>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${project.status === 'Completed' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      <span className="text-white font-medium">{project.status}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Technologies</h3>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <span key={tech} className="px-3 py-1.5 rounded-xl bg-white/5 text-slate-300 text-xs font-medium border border-white/10 flex items-center gap-2">
                          <Cpu size={12} className="text-emerald-400" />
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {(project.githubLink || project.linkedinLink || project.websiteLink) && (
                    <div>
                      <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Links</h3>
                      <div className="flex flex-col gap-3">
                        {project.githubLink && (
                          <a href={project.githubLink} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-slate-300 hover:text-emerald-400 transition-colors">
                            <Github size={18} />
                            <span className="text-sm font-medium">GitHub Repository</span>
                          </a>
                        )}
                        {project.linkedinLink && (
                          <a href={project.linkedinLink} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-slate-300 hover:text-emerald-400 transition-colors">
                            <Linkedin size={18} />
                            <span className="text-sm font-medium">LinkedIn Post</span>
                          </a>
                        )}
                        {project.websiteLink && (
                          <a href={project.websiteLink} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-slate-300 hover:text-emerald-400 transition-colors">
                            <ExternalLink size={18} />
                            <span className="text-sm font-medium">Live Website</span>
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
