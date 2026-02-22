import { useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const ITEMS = [
  { title: 'OR-based injection', payload: "Admin' OR '1'='1", body: 'The single quote closes the string. OR \'1\'=\'1 is always true. Full table dump.', result: 'All secrets exposed.' },
  { title: 'Comment-based injection', payload: "'; DROP TABLE secrets; --", body: 'Semicolon ends the statement. DROP TABLE deletes data. -- comments out the rest.', result: 'Data destruction.' },
  { title: 'UNION-based injection', payload: "' UNION SELECT id, name, data FROM secrets --", body: 'UNION combines two SELECTs. Attacker runs a second query. -- comments out rest.', result: 'Unauthorized data exposure.' },
  { title: 'How to prevent', body: 'Parameterized queries, input validation, least privilege, ORM, WAF & monitoring.', list: true },
];

export function AttackTypes() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [open, setOpen] = useState(0);

  return (
    <section id="attack-types" className="py-24 px-6" ref={ref}>
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-neutral-500 bg-clip-text text-transparent mb-4">
            SQL Injection Types
          </h2>
          <p className="text-neutral-500">Common attack patterns and mitigations</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="rounded-2xl border border-neutral-800 bg-[#171717] overflow-hidden"
        >
          {ITEMS.map((item, i) => (
            <div
              key={i}
              className="border-b border-neutral-800 last:border-0"
            >
              <button
                onClick={() => setOpen(open === i ? -1 : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-neutral-800/30 transition-colors"
              >
                <span className="font-medium text-white">{item.title}</span>
                <span className={`text-neutral-500 transition-transform ${open === i ? 'rotate-180' : ''}`}>▼</span>
              </button>
              {open === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-6 pb-4"
                >
                  {item.payload && (
                    <p className="mb-2"><span className="text-neutral-500">Payload:</span> <code className="text-[#FF3E3E] font-mono text-sm">{item.payload}</code></p>
                  )}
                  <p className="text-neutral-400 text-sm mb-2">{item.body}</p>
                  {item.result && <p className="text-neutral-500 text-sm"><strong>Result:</strong> {item.result}</p>}
                  {item.list && <p className="text-neutral-400 text-sm">{item.body}</p>}
                </motion.div>
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
