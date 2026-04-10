import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { ExternalLink } from 'lucide-react';
import { Project } from '../types';
import { cn } from '../lib/utils';

interface ProjectCardProps {
  project: Project;
  onClick: (project: Project) => void;
  key?: string | number;
}

export default function ProjectCard({ project, onClick }: ProjectCardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="glass-card group cursor-pointer overflow-hidden flex flex-col h-full"
      onClick={() => onClick(project)}
    >
      <div style={{ transform: "translateZ(30px)" }} className="relative aspect-video overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <span className="text-white text-sm font-medium flex items-center gap-2">
            View Details <ExternalLink size={14} />
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className={cn(
            "px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider",
            project.status === 'Completed' ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" :
            project.status === 'In Progress' ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" :
            "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
          )}>
            {project.status}
          </span>
        </div>
      </div>

      <div style={{ transform: "translateZ(20px)" }} className="p-5 flex-1 flex flex-col">
        <span className="text-emerald-400 text-xs font-medium mb-2 uppercase tracking-widest">{project.category}</span>
        <h3 className="text-xl font-display font-bold mb-2 group-hover:text-emerald-400 transition-colors">{project.title}</h3>
        <p className="text-slate-400 text-sm line-clamp-2 mb-4 flex-1">{project.description}</p>
        
        <div className="flex flex-wrap gap-2 mt-auto">
          {project.technologies.slice(0, 3).map((tech) => (
            <span key={tech} className="px-2 py-1 rounded-md bg-white/5 text-slate-500 text-[10px] font-medium border border-white/5">
              {tech}
            </span>
          ))}
          {project.technologies.length > 3 && (
            <span className="px-2 py-1 rounded-md bg-white/5 text-slate-500 text-[10px] font-medium border border-white/5">
              +{project.technologies.length - 3}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
