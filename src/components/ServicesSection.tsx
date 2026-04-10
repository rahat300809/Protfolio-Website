import React from 'react';
import { motion } from 'motion/react';
import { Code, Palette, Search, Cpu, Globe, Zap } from 'lucide-react';

const services = [
  {
    title: "Development",
    description: "Building robust and scalable software solutions tailored to your specific needs.",
    icon: Code,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10"
  },
  {
    title: "Design",
    description: "Creating intuitive and visually stunning user interfaces that enhance user experience.",
    icon: Palette,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10"
  },
  {
    title: "IoT Solutions",
    description: "Connecting the physical world with digital systems through smart embedded devices.",
    icon: Cpu,
    color: "text-purple-400",
    bg: "bg-purple-500/10"
  }
];

export default function ServicesSection() {
  return (
    <section className="py-24 relative overflow-hidden bg-slate-950/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-display font-bold mb-4">Our <span className="text-gradient">Services</span></h2>
          <p className="text-slate-500 max-w-xl mx-auto">Providing high-quality solutions across multiple domains of technology.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-8 text-center group"
            >
              <div className={`w-16 h-16 rounded-2xl ${service.bg} ${service.color} flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <service.icon size={32} />
              </div>
              <h3 className="text-xl font-bold mb-4">{service.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
