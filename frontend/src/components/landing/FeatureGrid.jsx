import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Shield, Zap, Brain } from 'lucide-react';

const FEATURES = [
  { icon: Shield, title: '100+ Injection Patterns', description: 'OR/AND boolean, UNION-based, time-based blind, error-based, and database-specific attacks. Production-hardened detection.', color: 'kinetic' },
  { icon: Zap, title: 'Real-Time Blocking', description: 'Client-side interception before data reaches your server. Fetch & XHR protection for API requests with JSON bodies.', color: 'intelligence' },
  { icon: Brain, title: 'AI-Aware Defense', description: 'Blocks prompt injection and SQL extraction attempts in chatbot contexts. Protects AI assistants from data exfiltration.', color: 'kinetic' },
];

function FeatureCard({ feature }) {
  const cardRef = useRef(null);
  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02, y: -5 }}
      onMouseMove={handleMouseMove}
      className="spotlight-card relative rounded-2xl border border-neutral-800 bg-[#171717] p-8 hover:border-[#D9FF00]/30 transition-colors"
    >
      <div className={`inline-flex p-3 rounded-xl mb-6 ${
        feature.color === 'kinetic' ? 'bg-[#D9FF00]/10 text-[#D9FF00]' : 'bg-neutral-500/10 text-neutral-400'
      }`}>
        <feature.icon className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
      <p className="text-neutral-500 leading-relaxed">{feature.description}</p>
    </motion.div>
  );
}

export function FeatureGrid() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section id="features" className="py-24 px-6" ref={ref}>
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-neutral-500 bg-clip-text text-transparent mb-4">
            Enterprise-Grade Protection
          </h2>
          <p className="text-neutral-500 max-w-2xl mx-auto">
            One script tag. Zero configuration. Defense in depth across forms, chatboxes, and APIs.
          </p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-8">
          {FEATURES.map((f, i) => (
            <FeatureCard key={i} feature={f} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
