import { useState, useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';

export function AIShield() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    const handleMove = (e) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
      setMousePos({ x: x * 20, y: y * 20 });
    };
    const el = ref.current;
    el?.addEventListener('mousemove', handleMove);
    return () => el?.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <section className="py-24 px-6" ref={ref}>
      <div className="container mx-auto max-w-4xl flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-neutral-500 bg-clip-text text-transparent mb-4">
            Intelligent Firewall
          </h2>
          <p className="text-neutral-500">Hover to see the shield react</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5 }}
          style={{ transform: `perspective(800px) rotateY(${mousePos.x}deg) rotateX(${-mousePos.y}deg)` }}
          className="relative w-48 h-48"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_30px_rgba(217,255,0,0.3)]">
            <defs>
              <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#D9FF00" stopOpacity="1" />
                <stop offset="100%" stopColor="#606060" stopOpacity="0.8" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <path d="M50 5 L90 25 L90 55 Q90 85 50 95 Q10 85 10 55 L10 25 Z" fill="none" stroke="url(#shieldGrad)" strokeWidth="2" filter="url(#glow)" />
            <path d="M50 20 L75 32 L75 52 Q75 72 50 82 Q25 72 25 52 L25 32 Z" fill="rgba(217,255,0,0.08)" stroke="rgba(217,255,0,0.4)" strokeWidth="1" />
            <circle cx="50" cy="50" r="12" fill="none" stroke="url(#shieldGrad)" strokeWidth="2" />
            <path d="M44 50 L48 54 L56 46" fill="none" stroke="#D9FF00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      </div>
    </section>
  );
}
