import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Zap } from 'lucide-react';

const MALICIOUS_QUERY = "SELECT * FROM users WHERE id = '1' OR '1'='1'";
const STAGES = ['typing', 'intercepted', 'sanitized'];

export function LiveKill() {
  const [stage, setStage] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (stage === 0) {
      setDisplayText('');
      setIsTyping(true);
      let i = 0;
      const interval = setInterval(() => {
        if (i < MALICIOUS_QUERY.length) {
          setDisplayText(MALICIOUS_QUERY.slice(0, i + 1));
          i++;
        } else {
          clearInterval(interval);
          setIsTyping(false);
          setTimeout(() => setStage(1), 800);
        }
      }, 80);
      return () => clearInterval(interval);
    }
  }, [stage]);

  useEffect(() => {
    if (stage === 1) {
      const t = setTimeout(() => setStage(2), 1200);
      return () => clearTimeout(t);
    }
  }, [stage]);

  useEffect(() => {
    if (stage === 2) {
      const t = setTimeout(() => setStage(0), 4000);
      return () => clearTimeout(t);
    }
  }, [stage]);

  return (
    <section id="live-kill" className="py-24 px-6">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent mb-4">
            Live Threat Neutralization
          </h2>
          <p className="text-slate-400">Watch malicious SQL get intercepted and sanitized in real-time</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-2xl border border-slate-800 bg-slate-900/50 p-8 overflow-hidden"
        >
          {/* Pipeline visualization */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <span className="w-2 h-2 rounded-full bg-slate-600" />
              Input
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-slate-700 via-emerald-500/50 to-slate-700" />
            <div className="flex items-center gap-2 text-emerald-500/80 text-sm">
              <Zap className="w-4 h-4" />
              AI Pulse
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-slate-700 via-emerald-500 to-slate-700" />
            <div className="flex items-center gap-2 text-emerald-500 text-sm">
              <Shield className="w-4 h-4" />
              Safe
            </div>
          </div>

          {/* Query display */}
          <div className="font-mono text-lg p-6 rounded-xl bg-slate-950/80 border border-slate-800 min-h-[120px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              {stage === 0 && (
                <motion.div
                  key="malicious"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`${isTyping ? 'text-red-500' : 'text-red-500'} flex items-center gap-2`}
                >
                  <code>{displayText}</code>
                  {isTyping && (
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                      className="inline-block w-2 h-5 bg-red-500"
                    />
                  )}
                </motion.div>
              )}
              {stage === 1 && (
                <motion.div
                  key="intercept"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-3 text-amber-400"
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 0.6, repeat: 2 }}
                    className="w-3 h-3 rounded-full bg-amber-400"
                  />
                  <span>Intercepting...</span>
                </motion.div>
              )}
              {stage === 2 && (
                <motion.div
                  key="sanitized"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-emerald-500 flex items-center gap-2"
                >
                  <Shield className="w-5 h-5" />
                  <code>Query blocked and sanitized — request denied</code>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Progress indicator */}
          <div className="flex gap-2 mt-4 justify-center">
            {STAGES.map((_, i) => (
              <motion.div
                key={i}
                className={`h-1 rounded-full w-12 ${
                  stage === i ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
                animate={{ width: stage === i ? 48 : 48 }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
