import React, { useState } from 'react';
import { motion } from 'motion/react';
import ProjectCard from '../components/ProjectCard';
import ProjectModal from '../components/ProjectModal';
import { Project } from '../types';
import { Search, ArrowRight } from 'lucide-react';
import { ShuffleDeck, DeckItem } from '../components/ui/shuffle-deck';
import { usePortfolio } from '../context/PortfolioContext';

const categories = ["All", "IoT", "Embedded Systems", "Robotics", "Web Development", "AI", "Mobile", "Research"];

export default function Projects() {
  const { projects } = usePortfolio();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filteredProjects = projects.filter(p => {
    const matchesFilter = filter === "All" || p.category.toLowerCase().includes(filter.toLowerCase());
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });


  return (
    <div className="pt-32 pb-20 container mx-auto px-4 sm:px-6">
      <div className="mb-16 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-6">My <span className="text-gradient">Projects</span></h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Explore my portfolio of projects ranging from hardware prototypes to full-stack software solutions.
        </p>
      </div>

      {projects.length >= 3 && (
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-center mb-8">Featured Work</h2>
          <ShuffleDeck items={projects.filter(p => p.image).slice(0, 3).map(p => ({
            id: p.id,
            title: p.title,
            subtitle: p.category,
            description: p.description,
            image: p.image
          }))} />
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6 mb-12">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full glass rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:border-emerald-500/50 transition-all"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-4 rounded-2xl text-sm font-medium whitespace-nowrap transition-all ${filter === cat ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "glass text-slate-400 hover:bg-white/5"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-12">
        {filteredProjects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className={`relative flex flex-col md:flex-row gap-8 items-center ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
          >
            <div className="w-full md:w-1/2 aspect-video rounded-3xl overflow-hidden glass hover:border-emerald-500/30 transition-colors group">
              <img
                src={project.image || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80"}
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4 glass px-3 py-1 rounded-full text-xs font-bold text-emerald-400">
                {project.category}
              </div>
            </div>
            <div className="w-full md:w-1/2 space-y-4">
              <h3 className="text-3xl font-display font-bold text-white group-hover:text-emerald-400 transition-colors">
                {project.title}
              </h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                {project.description}
              </p>
              
              <div className="flex flex-wrap gap-2 pt-2 pb-4">
                {project.technologies.slice(0, 3).map(tech => (
                  <span key={tech} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-slate-300">
                    {tech}
                  </span>
                ))}
                {project.technologies.length > 3 && (
                  <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-slate-500">
                    +{project.technologies.length - 3}
                  </span>
                )}
              </div>

              <button
                onClick={() => setSelectedProject(project)}
                className="flex items-center gap-2 text-emerald-400 font-bold hover:gap-4 transition-all"
              >
                View Project Details <ArrowRight size={20} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-slate-500 text-lg">No projects found matching your criteria.</p>
        </div>
      )}

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
}
