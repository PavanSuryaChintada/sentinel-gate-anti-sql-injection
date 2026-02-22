import { useState, useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Copy, Check } from 'lucide-react';

export function ScriptTagDemo() {
  const [copied, setCopied] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const base = typeof window !== 'undefined' ? window.location.origin : '';
  const code = `<script src="${base}/sentinel-gate.js"><\/script>`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert(`Copy failed. Manually copy: ${code}`);
    }
  };

  return (
    <section id="script-tag" className="py-24 px-6" ref={ref}>
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent mb-4">
            Add One Line. Get Protected.
          </h2>
          <p className="text-slate-400">
            Paste this script tag in your <code className="text-slate-500 bg-slate-800 px-1 rounded">&lt;head&gt;</code> or before{' '}
            <code className="text-slate-500 bg-slate-800 px-1 rounded">&lt;/body&gt;</code>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.01, y: -2 }}
          className="relative rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden"
        >
          {/* IDE-style header */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-slate-800 bg-slate-900/80">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>
            <span className="text-slate-500 text-sm font-mono">index.html</span>
          </div>

          {/* Code block with glowing pulse on script tag */}
          <div className="p-6 font-mono text-base relative">
            <motion.div
              className="relative inline-block px-4 py-2 rounded-lg border border-emerald-500/30 bg-emerald-500/5"
              animate={{
                boxShadow: ['0 0 20px rgba(16,185,129,0.1)', '0 0 30px rgba(16,185,129,0.25)', '0 0 20px rgba(16,185,129,0.1)'],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <span className="text-slate-500">&lt;script</span>{' '}
              <span className="text-cyan-400">src=</span>
              <span className="text-amber-400">"{base}/sentinel-gate.js"</span>
              <span className="text-slate-500">&gt;&lt;/script&gt;</span>
            </motion.div>
          </div>

          {/* Copy button */}
          <div className="px-6 pb-6 flex justify-end">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCopy}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition-colors font-medium"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" /> Copy
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
