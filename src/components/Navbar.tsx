import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Home, User, Briefcase, GraduationCap, Award, Cpu, BookOpen, Mail, LayoutDashboard, Calendar } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

const navItems = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'About', path: '/#about', icon: User },
  { name: 'Projects', path: '/projects', icon: Briefcase },
  { name: 'Research', path: '/research', icon: BookOpen },
  { name: 'Events', path: '/events', icon: Calendar },
  { name: 'Certificates', path: '/certificates', icon: GraduationCap },
  { name: 'Skills', path: '/skills', icon: Cpu },
  { name: 'Blog', path: '/blog', icon: BookOpen },
  { name: 'Contact', path: '/contact', icon: Mail },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (path: string) => {
    setIsOpen(false);
    if (path.startsWith('/#')) {
      const id = path.substring(2);
      if (location.pathname === '/') {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        navigate('/');
        setTimeout(() => {
          const element = document.getElementById(id);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    }
  };

  return (
    <nav className={cn(
      "fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-5xl transition-all duration-300",
      scrolled ? "top-4" : "top-6"
    )}>
      <div className="glass rounded-full px-6 py-3 flex items-center justify-between shadow-emerald-500/5">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center text-slate-950 font-bold text-sm group-hover:rotate-12 transition-transform">
            RM
          </div>
          <span className="font-display font-bold text-lg hidden sm:block">Rahat</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => handleNavClick(item.path)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all hover:bg-white/10",
                location.pathname === item.path || (location.pathname === '/' && item.path === '/#about' && window.location.hash === '#about')
                  ? "text-emerald-400 bg-white/5"
                  : "text-slate-400"
              )}
            >
              {item.name}
            </Link>
          ))}
          <div className="w-px h-4 bg-white/10 mx-2" />
          <Link to="/admin" className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-emerald-400 transition-colors">
            <LayoutDashboard size={18} />
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="absolute top-full left-0 right-0 mt-4 md:hidden"
          >
            <div className="glass rounded-3xl p-4 flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => handleNavClick(item.path)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-2xl text-base font-medium transition-all",
                    location.pathname === item.path ? "text-emerald-400 bg-white/5" : "text-slate-400 hover:bg-white/5"
                  )}
                >
                  <item.icon size={20} />
                  {item.name}
                </Link>
              ))}
              <Link
                to="/admin"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-400 hover:bg-white/5"
              >
                <LayoutDashboard size={20} />
                Admin Dashboard
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
