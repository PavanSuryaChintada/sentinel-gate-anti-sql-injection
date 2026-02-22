import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section id="about" className="py-24 px-6" ref={ref}>
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-neutral-500 bg-clip-text text-transparent mb-4">
            About This Demo
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="grid md:grid-cols-2 gap-8"
        >
          <div className="rounded-2xl border border-[#FF3E3E]/30 bg-[#FF3E3E]/5 p-6">
            <h3 className="text-lg font-semibold text-[#FF3E3E] mb-3">Vulnerable Endpoint</h3>
            <p className="text-neutral-400 text-sm mb-4">
              Directly concatenates user input into SQL. Attackers can execute arbitrary commands.
            </p>
            <pre className="rounded-lg bg-[#0A0A0A] p-4 font-mono text-xs text-neutral-300 overflow-x-auto">
{`query = f"SELECT * FROM secrets WHERE name = '{user_input}'"
cursor.execute(query)`}
            </pre>
          </div>
          <div className="rounded-2xl border border-[#D9FF00]/30 bg-[#D9FF00]/5 p-6">
            <h3 className="text-lg font-semibold text-[#D9FF00] mb-3">Secure Endpoint</h3>
            <p className="text-neutral-400 text-sm mb-4">
              Uses parameterized queries. User input is bound separately—no SQL injection possible.
            </p>
            <pre className="rounded-lg bg-[#0A0A0A] p-4 font-mono text-xs text-neutral-300 overflow-x-auto">
{`query = "SELECT * FROM secrets WHERE name = ?"
cursor.execute(query, (user_input,))`}
            </pre>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
