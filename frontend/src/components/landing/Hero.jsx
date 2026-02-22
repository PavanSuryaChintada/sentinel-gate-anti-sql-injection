import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#D9FF00]/15 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neutral-500/10 rounded-full blur-[128px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D9FF00]/5 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#0A0A0A_70%)]" />
      </div>

      <motion.div
        className="absolute top-1/3 right-1/4"
        animate={{ y: [0, -15, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="relative">
          <div className="absolute inset-0 bg-[#D9FF00]/20 rounded-full blur-2xl animate-pulse" />
          <div className="relative w-24 h-24 rounded-2xl border border-[#D9FF00]/30 bg-[#171717]/80 backdrop-blur-sm flex items-center justify-center">
            <Shield className="w-12 h-12 text-[#D9FF00]" />
          </div>
        </div>
      </motion.div>

      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#D9FF00]/30 bg-[#D9FF00]/5 text-[#D9FF00] text-sm font-medium mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-[#D9FF00] animate-pulse" />
          AI-Driven SQL Injection Prevention
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6"
        >
          <span className="bg-gradient-to-r from-white via-neutral-200 to-neutral-500 bg-clip-text text-transparent">
            Protect your database
          </span>
          <br />
          <span className="bg-gradient-to-r from-[#D9FF00] to-neutral-400 bg-clip-text text-transparent">
            in one script tag
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl text-neutral-500 max-w-2xl mx-auto mb-12"
        >
          100+ injection patterns. Client-side + server-side defense. Zero configuration.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <a
            href="#script-tag"
            className="px-8 py-4 rounded-xl bg-[#D9FF00] hover:bg-[#D9FF00]/90 text-[#0A0A0A] font-semibold transition-all hover:shadow-lg hover:shadow-[#D9FF00]/25"
          >
            Get the Script
          </a>
          <a
            href="#live-kill"
            className="px-8 py-4 rounded-xl border border-neutral-700 hover:border-[#D9FF00]/50 text-neutral-300 font-semibold transition-all"
          >
            See it in Action
          </a>
        </motion.div>
      </div>
    </section>
  );
}
