import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Copy, Check } from 'lucide-react';

const SCRIPT_BASE = import.meta.env.VITE_SCRIPT_BASE || '';
const PROD_URL = 'https://sentinel-gate-anti-sql-injection.vercel.app';

export function ScriptTagDemo() {
  const [copied, setCopied] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const isLocalhost = /localhost|127\.0\.0\.1/.test(origin);
  const base = SCRIPT_BASE || (isLocalhost ? PROD_URL : origin) || PROD_URL;
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
          <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-neutral-500 bg-clip-text text-transparent mb-4">
            Add One Line. Get Protected.
          </h2>
          <p className="text-neutral-500">
            Paste in <code className="text-neutral-600 bg-neutral-900 px-1 rounded">&lt;head&gt;</code> or before{' '}
            <code className="text-neutral-600 bg-neutral-900 px-1 rounded">&lt;/body&gt;</code>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.01, y: -2 }}
          className="relative rounded-2xl border border-neutral-800 bg-[#0A0A0A] overflow-hidden"
        >
          <div className="flex items-center justify-between px-6 py-3 border-b border-neutral-800 bg-[#171717]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#FF3E3E]/80" />
              <span className="w-3 h-3 rounded-full bg-neutral-500/80" />
              <span className="w-3 h-3 rounded-full bg-[#D9FF00]/80" />
            </div>
            <span className="text-neutral-500 text-sm font-mono">index.html</span>
          </div>
          <div className="p-6 font-mono text-sm">
            <p className="text-neutral-500 text-xs mb-2">Copy this script tag — paste in your HTML:</p>
            <pre
              className="w-full p-4 rounded-lg border border-neutral-800 bg-[#0A0A0A] overflow-x-auto cursor-pointer select-all hover:border-[#D9FF00]/30 transition-colors"
              onClick={handleCopy}
              title="Click to copy"
            >
              <code className="text-neutral-300">
                {`<script src="${base}/sentinel-gate.js"></script>`}
              </code>
            </pre>
          </div>
          <div className="px-6 pb-6 flex justify-end">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCopy}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#D9FF00]/10 border border-[#D9FF00]/30 text-[#D9FF00] hover:bg-[#D9FF00]/20 transition-colors font-medium"
            >
              {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy</>}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
