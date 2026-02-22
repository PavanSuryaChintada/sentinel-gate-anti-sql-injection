import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

export function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-slate-800">
      <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-emerald-500" />
          <span className="font-semibold text-white">SentinelGate</span>
        </div>
        <p className="text-slate-500 text-sm">
          © 2026 SentinelGate. AI-driven SQL injection prevention. Production-ready.
        </p>
      </div>
    </footer>
  );
}
