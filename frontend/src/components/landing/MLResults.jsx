import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export function MLResults() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section id="ml-results" className="py-24 px-6" ref={ref}>
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-10"
        >
          <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-neutral-500 bg-clip-text text-transparent mb-4">
            ML Approach & Results
          </h2>
          <p className="text-neutral-500 max-w-3xl mx-auto text-sm md:text-base">
            CipherShield uses a hybrid detection pipeline: <span className="text-[#D9FF00] font-semibold">100+ handcrafted SQL patterns</span> +
            an experimental <span className="text-[#D9FF00] font-semibold">Random Forest classifier</span> trained on real attack strings and benign traffic.
            The model helps generalize beyond fixed rules to obfuscated and AI-generated payloads.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="rounded-2xl border border-neutral-800 bg-[#171717] p-6 overflow-x-auto"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Prototype Evaluation (Internal Dataset)</h3>
          <p className="text-neutral-500 text-xs md:text-sm mb-4">
            Trained with <code className="font-mono text-xs">python train.py --data data/raw/dataset.csv --model models/classifier.pkl</code>.
            Automatic balancing added a few synthetic safe samples so the model can distinguish safe vs malicious input.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs md:text-sm border-collapse">
              <thead>
                <tr className="text-neutral-400 border-b border-neutral-800">
                  <th className="text-left py-2 pr-4">Metric</th>
                  <th className="text-left py-2 pr-4">Safe</th>
                  <th className="text-left py-2 pr-4">Malicious</th>
                  <th className="text-left py-2">Notes</th>
                </tr>
              </thead>
              <tbody className="text-neutral-300">
                <tr className="border-b border-neutral-800/60">
                  <td className="py-2 pr-4 font-medium">Precision</td>
                  <td className="py-2 pr-4">0.00 (few samples)</td>
                  <td className="py-2 pr-4">≈ 0.96</td>
                  <td className="py-2 text-neutral-500">Very small number of safe samples in test split; malicious precision is high.</td>
                </tr>
                <tr className="border-b border-neutral-800/60">
                  <td className="py-2 pr-4 font-medium">Recall</td>
                  <td className="py-2 pr-4">0.00 (few samples)</td>
                  <td className="py-2 pr-4">≈ 1.00</td>
                  <td className="py-2 text-neutral-500">Model caught essentially all malicious inputs in this run.</td>
                </tr>
                <tr className="border-b border-neutral-800/60">
                  <td className="py-2 pr-4 font-medium">F1-score</td>
                  <td className="py-2 pr-4">0.00 (unstable)</td>
                  <td className="py-2 pr-4">≈ 0.98</td>
                  <td className="py-2 text-neutral-500">High F1 for malicious class; safe-class metrics need more data.</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">Overall accuracy</td>
                  <td className="py-2 pr-4" colSpan={2}>
                    0.9636
                  </td>
                  <td className="py-2 text-neutral-500">Prototype result on a small internal dataset (273 samples after auto-balancing).</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-neutral-500 text-xs md:text-sm mt-4">
            These numbers are **prototype** results, not production guarantees. In production, CipherShield is designed so that:
            rules instantly block obvious injections, the ML classifier flags suspicious edge cases, and server-side controls
            (parameterized queries, WAF, etc.) provide an additional safety net.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

