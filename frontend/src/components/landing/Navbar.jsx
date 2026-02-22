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
        scrolled ? 'py-3 backdrop-blur-md bg-[#0A0A0A]/90 border-b border-neutral-800/50' : 'py-5'
      }`}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <nav className="container mx-auto px-6 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 text-xl font-bold">
          <Shield className="w-6 h-6 text-[#D9FF00]" />
          <span className="bg-gradient-to-r from-white to-neutral-500 bg-clip-text text-transparent">
            SentinelGate
          </span>
        </a>
        <div className="flex items-center gap-4">
          <a href="#demo" className="text-neutral-500 hover:text-white transition-colors text-sm font-medium">Demo</a>
          <a href="#features" className="text-neutral-500 hover:text-white transition-colors text-sm font-medium">Features</a>
          <a href="#database-schema" className="text-neutral-500 hover:text-white transition-colors text-sm font-medium">Schema</a>
          <a href="#attack-types" className="text-neutral-500 hover:text-white transition-colors text-sm font-medium">Attacks</a>
          <a href="#about" className="text-neutral-500 hover:text-white transition-colors text-sm font-medium">About</a>
          <button
            onClick={onResetDatabase}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-neutral-700 hover:border-[#D9FF00]/50 hover:bg-[#D9FF00]/10 transition-all text-neutral-300 hover:text-[#D9FF00]"
          >
            Reset DB
          </button>
        </div>
      </nav>
    </motion.header>
  );
}
