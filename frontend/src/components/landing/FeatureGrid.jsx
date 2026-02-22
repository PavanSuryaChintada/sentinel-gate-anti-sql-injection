import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Shield, Zap, Brain } from 'lucide-react';

const FEATURES = [
  {
    icon: Shield,
    title: '100+ Injection Patterns',
    description: 'OR/AND boolean, UNION-based, time-based blind, error-based, and database-specific attacks. Production-hardened detection.',
    color: 'emerald',
  },
  {
    icon: Zap,
    title: 'Real-Time Blocking',
    description: 'Client-side interception before data reaches your server. Fetch & XHR protection for API requests with JSON bodies.',
    color: 'cyan',
  },
  {
    icon: Brain,
    title: 'AI-Aware Defense',
    description: 'Blocks prompt injection and SQL extraction attempts in chatbot contexts. Protects AI assistants from data exfiltration.',
    color: 'emerald',
  },
];

function FeatureCard({ feature, index }) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02, y: -5 }}
      onMouseMove={handleMouseMove}
      className="spotlight-card relative rounded-2xl border border-slate-800 bg-slate-900/50 p-8 hover:border-emerald-500/30 transition-colors"
    >
      <div className={`inline-flex p-3 rounded-xl mb-6 ${
        feature.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-cyan-500/10 text-cyan-400'
      }`}>
        <feature.icon className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
      <p className="text-slate-400 leading-relaxed">{feature.description}</p>
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
          <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent mb-4">
            Enterprise-Grade Protection
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
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
