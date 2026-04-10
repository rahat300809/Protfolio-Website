"use client";

import React from "react";
import type { ComponentProps, ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Frame, Github, Linkedin, Twitter, Dribbble } from "lucide-react";
import { usePortfolio } from "../../context/PortfolioContext";
import { Link } from "react-router-dom";

type ViewAnimationProps = {
  key?: React.Key;
  delay?: number;
  className?: ComponentProps<typeof motion.div>["className"];
  children: ReactNode;
};

function AnimatedContainer({ className, delay = 0.1, children }: ViewAnimationProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ filter: "blur(4px)", translateY: -8, opacity: 0 }}
      whileInView={{ filter: "blur(0px)", translateY: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.8 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function FooterSection() {
  const { settings } = usePortfolio();
  const links = settings?.socialLinks || {};

  const footerLinks = [
    {
      label: "Portfolio",
      links: [
        { title: "Home", href: "/" },
        { title: "Projects", href: "/projects" },
        { title: "Research", href: "/research" },
        { title: "Certificates", href: "/certificates" },
        { title: "Blog", href: "/blog" },
      ],
    },
    {
      label: "Social Links",
      links: [
        ...(links.github ? [{ title: "GitHub", href: links.github, icon: Github }] : []),
        ...(links.linkedin ? [{ title: "LinkedIn", href: links.linkedin, icon: Linkedin }] : []),
        ...(links.x ? [{ title: "X (Twitter)", href: links.x, icon: Twitter }] : []),
        ...(links.dribbble ? [{ title: "Dribbble", href: links.dribbble, icon: Dribbble }] : []),
      ],
    },
  ];

  return (
    <footer className="relative w-full border-t border-white/10 bg-slate-950 px-6 py-12 lg:py-16 overflow-hidden">
      {/* Subtle glowing orb for footer */}
      <div className="absolute top-0 left-1/2 h-px w-1/3 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent blur-sm" />

      <div className="w-full max-w-6xl mx-auto grid gap-8 xl:grid-cols-3 xl:gap-8 relative z-10">
        <AnimatedContainer className="space-y-4">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-emerald-500/20 group-hover:border-emerald-500/30 transition-all duration-300">
              <Frame className="text-emerald-400" size={20} />
            </div>
            <span className="text-xl font-display font-bold text-white tracking-wide">
              {settings.name}
              <span className="text-emerald-400">.</span>
            </span>
          </Link>
          <p className="text-slate-400 text-sm mt-6 leading-relaxed max-w-xs">
            {settings.bio}
          </p>
          <p className="text-slate-500 mt-8 text-sm">
            © {new Date().getFullYear()} {settings.name}. All rights reserved.
          </p>
        </AnimatedContainer>

        <div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-2 xl:col-span-2 xl:mt-0 lg:ml-auto">
          {footerLinks.map((section, index) => (
            <AnimatedContainer key={section.label} delay={0.1 + index * 0.1}>
              <div className="mb-10 md:mb-0">
                <h3 className="text-sm font-semibold tracking-wider text-white uppercase mb-6">
                  {section.label}
                </h3>
                <ul className="text-slate-400 space-y-4 text-sm">
                  {section.links.map((link) => (
                    <li key={link.title}>
                      <a
                        href={link.href}
                        target={section.label === "Social Links" ? "_blank" : undefined}
                        rel={section.label === "Social Links" ? "noopener noreferrer" : undefined}
                        className="hover:text-emerald-400 inline-flex items-center transition-all duration-300"
                      >
                        {link.icon && <link.icon className="mr-2 size-4" />}
                        {link.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedContainer>
          ))}
        </div>
      </div>
    </footer>
  );
}
