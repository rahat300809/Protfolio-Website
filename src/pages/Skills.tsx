import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'motion/react';
import { Cpu, Code, Brain, Globe, Zap, Users, Microscope, X, Info } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

const categoryIcons: Record<string, any> = {
  "Programming": Code,
  "Embedded Systems": Cpu,
  "AI Tools": Brain,
  "Vibe Coding Tools": Zap,
  "Web Development": Globe,
  "Research & Leadership": Users,
};

const categoryColors: Record<string, string> = {
  "Programming": "text-emerald-400",
  "Embedded Systems": "text-cyan-400",
  "AI Tools": "text-purple-400",
  "Vibe Coding Tools": "text-amber-400",
  "Web Development": "text-blue-400",
  "Research & Leadership": "text-rose-400",
};

interface SkillCardProps {
  category: any;
  index: number;
  onClick: (category: any) => void;
  key?: string | number;
}

const SkillCard = ({ category, index, onClick }: SkillCardProps) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

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

  const Icon = categoryIcons[category.category] || Microscope;
  const colorClass = categoryColors[category.category] || "text-emerald-400";

  return (
    <motion.div
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onClick(category)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass-card p-8 relative group cursor-pointer"
    >
      <div style={{ transform: "translateZ(50px)" }} className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl glass flex items-center justify-center ${colorClass}`}>
              <Icon size={24} />
            </div>
            <h2 className="text-2xl font-display font-bold">{category.category}</h2>
          </div>
          <Info size={18} className="text-slate-600 group-hover:text-emerald-400 transition-colors" />
        </div>

        {category.description && (
          <p className="text-slate-500 text-sm mb-6 italic leading-relaxed line-clamp-2">
            "{category.description}"
          </p>
        )}

        <div className="space-y-6">
          {category.skills.slice(0, 3).map((skill: any) => (
            <div key={skill.name}>
              <div className="flex justify-between mb-2">
                <span className="text-slate-300 font-medium">{skill.name}</span>
                <span className="text-emerald-400 font-bold">{skill.level}%</span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.level}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"
                />
              </div>
            </div>
          ))}
          {category.skills.length > 3 && (
            <p className="text-xs text-slate-600 text-center font-bold uppercase tracking-widest">
              + {category.skills.length - 3} more skills
            </p>
          )}
        </div>
      </div>

      {/* 3D Glow Effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </motion.div>
  );
};

export default function Skills() {
  const { skillCategories } = usePortfolio();
  const [selectedCategory, setSelectedCategory] = useState<any>(null);

  return (
    <div className="pt-32 pb-20 container mx-auto px-4 sm:px-6 perspective-1000">
      <div className="mb-16 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-6">Technical <span className="text-gradient">Expertise</span></h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          A dynamic showcase of my skills, from low-level embedded systems to modern AI-assisted development.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {skillCategories.map((cat, index) => (
          <SkillCard key={cat.id} category={cat} index={index} onClick={setSelectedCategory} />
        ))}
      </div>

      <AnimatePresence>
        {selectedCategory && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCategory(null)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl glass rounded-3xl p-8 md:p-12 overflow-y-auto max-h-[90vh]"
            >
              <button
                onClick={() => setSelectedCategory(null)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 text-slate-400 transition-colors"
              >
                <X size={24} />
              </button>

              <div className="flex items-center gap-4 mb-8">
                <div className={`w-16 h-16 rounded-2xl glass flex items-center justify-center ${categoryColors[selectedCategory.category]}`}>
                  {React.createElement(categoryIcons[selectedCategory.category] || Microscope, { size: 32 })}
                </div>
                <div>
                  <h2 className="text-3xl font-display font-bold">{selectedCategory.category}</h2>
                  <p className="text-emerald-400 text-sm font-bold uppercase tracking-widest">Skill Category</p>
                </div>
              </div>

              {selectedCategory.description && (
                <p className="text-slate-300 text-lg leading-relaxed mb-10 italic">
                  "{selectedCategory.description}"
                </p>
              )}

              <div className="space-y-8">
                {selectedCategory.skills.map((skill: any) => (
                  <div key={skill.name}>
                    <div className="flex justify-between mb-3">
                      <span className="text-white font-bold text-lg">{skill.name}</span>
                      <span className="text-emerald-400 font-bold">{skill.level}%</span>
                    </div>
                    <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.level}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"
                      />
                    </div>
                    {skill.tags && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {skill.tags.map((tag: string) => (
                          <span key={tag} className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="mt-20 text-center">
        <h3 className="text-2xl font-display font-bold mb-10">Modern Workflow Stack</h3>
        <div className="flex flex-wrap justify-center gap-4">
          {["Git", "Docker", "Linux", "VS Code", "Altium Designer", "TensorFlow", "Postman", "Firebase", "Arduino IDE", "PlatformIO"].map((tool) => (
            <motion.span
              key={tool}
              whileHover={{ scale: 1.1, rotate: 2 }}
              className="px-6 py-3 rounded-2xl glass text-slate-400 font-medium hover:text-emerald-400 hover:border-emerald-500/30 transition-all cursor-default"
            >
              {tool}
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  );
}
