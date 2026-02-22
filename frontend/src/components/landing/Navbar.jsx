import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

export function Navbar({ onResetDatabase }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'py-3 backdrop-blur-md bg-slate-950/80 border-b border-slate-800/50' : 'py-5'
      }`}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <nav className="container mx-auto px-6 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 text-xl font-bold">
          <Shield className="w-6 h-6 text-emerald-500" />
          <span className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            SentinelGate
          </span>
        </a>
        <div className="flex items-center gap-4">
          <a
            href="#demo"
            className="text-slate-400 hover:text-white transition-colors text-sm font-medium"
          >
            Demo
          </a>
          <a
            href="#features"
            className="text-slate-400 hover:text-white transition-colors text-sm font-medium"
          >
            Features
          </a>
          <button
            onClick={onResetDatabase}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-700 hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all text-slate-300 hover:text-emerald-400"
          >
            Reset DB
          </button>
        </div>
      </nav>
    </motion.header>
  );
}
