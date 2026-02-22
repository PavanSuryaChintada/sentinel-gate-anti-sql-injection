import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const THREAT_CODE = "' OR 1=1 --";
const CLEAN_CODE = "id = ?";
const PIXEL_COUNT = 16;

const killVariants = {
  initial: { x: -100, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { scale: 0, opacity: 0, transition: { duration: 0.2 } },
};

export function SentinelInterceptor() {
  const [phase, setPhase] = useState('approach'); // approach | scanning | kill | clean
  const [statusText, setStatusText] = useState('INCOMING...');
  const [glitch, setGlitch] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => {
      setPhase('scanning');
      setStatusText('SCANNING...');
    }, 2400);

    const t2 = setTimeout(() => {
      setPhase('kill');
      setGlitch(true);
    }, 4000);

    const t3 = setTimeout(() => {
      setStatusText('THREAT NEUTRALIZED');
      setGlitch(false);
    }, 4200);

    const t4 = setTimeout(() => {
      setPhase('clean');
    }, 4400);

    const t5 = setTimeout(() => {
      setPhase('approach');
      setStatusText('INCOMING...');
      setResetKey((k) => k + 1);
    }, 8000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [resetKey]);

  return (
    <section id="live-kill" className="py-24 px-6">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-neutral-500 bg-clip-text text-transparent mb-4">
            Sentinel Interceptor
          </h2>
          <p className="text-neutral-500">AI-powered threat detection in real-time</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative flex items-center gap-6 p-8 rounded-2xl border border-neutral-800 bg-[#171717] min-h-[300px] overflow-hidden"
        >
          {/* Left: Dark terminal-style code window */}
          <div className="flex-shrink-0 w-64 rounded-xl border border-neutral-800 bg-[#0A0A0A] overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-neutral-800 bg-[#171717]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF3E3E]/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#D9FF00]/80" />
              <span className="text-neutral-500 text-xs font-mono ml-2">input.sql</span>
            </div>
            <div className="p-4 font-mono text-xs min-h-[90px] text-neutral-600">
              SELECT * FROM users WHERE
            </div>
          </div>

          {/* Center: Threat travels toward shield, then shield + laser */}
          <div className="flex-1 flex items-center justify-center relative min-h-[160px]">
            {/* Traveling threat - moves from left toward shield */}
            <AnimatePresence mode="wait">
              {phase === 'approach' && (
                <motion.div
                  key={`threat-travel-${resetKey}`}
                  initial={{ x: -80, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 2, ease: 'easeOut' }}
                  className="absolute left-0 font-mono text-sm text-[#FF3E3E] whitespace-nowrap"
                >
                  {THREAT_CODE}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Glowing SVG Shield - Sentinel Core */}
            <motion.div
              animate={{
                scale: phase === 'scanning' ? [1, 1.06, 1] : 1,
                boxShadow:
                  phase === 'scanning'
                    ? ['0 0 30px rgba(0, 229, 255, 0.4)', '0 0 50px rgba(0, 229, 255, 0.6)', '0 0 30px rgba(0, 229, 255, 0.4)']
                    : '0 0 40px rgba(217, 255, 0, 0.25)',
              }}
              transition={{ duration: 0.8, repeat: phase === 'scanning' ? Infinity : 0 }}
              className="relative flex-shrink-0 w-28 h-28"
            >
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_20px_rgba(217,255,0,0.4)]">
                <defs>
                  <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#D9FF00" stopOpacity="1" />
                    <stop offset="100%" stopColor="#606060" stopOpacity="0.8" />
                  </linearGradient>
                </defs>
                <path
                  d="M50 5 L90 25 L90 55 Q90 85 50 95 Q10 85 10 55 L10 25 Z"
                  fill="rgba(10,10,10,0.9)"
                  stroke="url(#shieldGrad)"
                  strokeWidth="2"
                />
                <path
                  d="M50 20 L75 32 L75 52 Q75 72 50 82 Q25 72 25 52 L25 32 Z"
                  fill="rgba(217,255,0,0.08)"
                  stroke="rgba(217,255,0,0.4)"
                  strokeWidth="1"
                />
                <circle cx="50" cy="50" r="12" fill="none" stroke="url(#shieldGrad)" strokeWidth="2" />
                <path d="M44 50 L48 54 L56 46" fill="none" stroke="#D9FF00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>

              {/* Cyan laser scan line - appears when threat hits shield */}
              <AnimatePresence>
                {phase === 'scanning' && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: [0, 90, 0] }}
                    exit={{ opacity: 0 }}
                    transition={{ y: { duration: 0.8, repeat: 2 }, opacity: 0.4 }}
                    className="absolute inset-0 pointer-events-none flex justify-center"
                  >
                    <div className="w-0.5 h-10 bg-cyan-400 shadow-[0_0_20px_rgba(0,229,255,0.9)]" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Right: Kill (shatter) or Clean pass */}
            <div className="absolute right-0 flex items-center justify-center min-w-[140px]">
              <AnimatePresence mode="wait">
                {phase === 'kill' && (
                  <motion.div
                    key="shatter"
                    className="flex flex-wrap gap-0.5 justify-center max-w-[200px]"
                    variants={killVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    {Array.from({ length: PIXEL_COUNT }).map((_, i) => (
                      <motion.span
                        key={i}
                        initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                        animate={{
                          x: (Math.random() - 0.5) * 100,
                          y: (Math.random() - 0.5) * 80,
                          opacity: 0,
                          scale: 0,
                        }}
                        transition={{ duration: 0.25, delay: i * 0.015 }}
                        className="block w-2 h-2 rounded-sm bg-[#FF3E3E]"
                      />
                    ))}
                  </motion.div>
                )}
                {phase === 'clean' && (
                  <motion.div
                    key="clean-pass"
                    initial={{ x: -60, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="font-mono text-sm text-[#D9FF00] text-center"
                  >
                    <span className="block">✓ Safe query</span>
                    <span className="text-xs text-neutral-500">{CLEAN_CODE}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Status text with glitch effect */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 text-center"
        >
          <motion.span
            key={statusText}
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              textShadow: glitch ? '2px 0 #FF3E3E, -2px 0 #00E5FF' : 'none',
              x: glitch ? [0, -3, 3, 0] : 0,
            }}
            transition={{ duration: 0.12, repeat: glitch ? 5 : 0 }}
            className="inline-block font-mono text-lg font-bold tracking-[0.3em] text-[#D9FF00]"
          >
            {statusText}
          </motion.span>
        </motion.div>
      </div>
    </section>
  );
}
