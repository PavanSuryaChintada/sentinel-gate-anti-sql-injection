import { useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { SCHEMA_TABLES, TABLES } from '../../constants';

const BADGE_CLASS = {
  secrets: 'bg-[#FF3E3E]/20 text-[#FF3E3E]',
  departments: 'bg-[#606060]/20 text-neutral-400',
  projects: 'bg-[#D9FF00]/20 text-[#D9FF00]',
  office_locations: 'bg-neutral-500/20 text-neutral-400',
};

export function DatabaseSchema() {
  const [activeTable, setActiveTable] = useState('secrets');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const schema = SCHEMA_TABLES[activeTable];

  return (
    <section id="database-schema" className="py-24 px-6" ref={ref}>
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-neutral-500 bg-clip-text text-transparent mb-4">
            Database Schema & Demo Data
          </h2>
          <p className="text-neutral-500">Select a table to view its schema and sample lookup values</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-neutral-800 bg-[#171717] overflow-hidden"
        >
          <div className="p-6 border-b border-neutral-800 flex flex-wrap items-center gap-4">
            <span className="text-neutral-500 text-sm uppercase tracking-wider">Select table</span>
            <select
              value={activeTable}
              onChange={(e) => setActiveTable(e.target.value)}
              className="rounded-lg border border-neutral-700 bg-[#0A0A0A] text-white px-4 py-2 font-mono text-sm focus:ring-2 focus:ring-[#D9FF00]/50 outline-none"
            >
              {TABLES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="p-6">
            {schema && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-neutral-800">
                      <th className="text-left py-3 px-4 text-neutral-500 font-medium">Column</th>
                      <th className="text-left py-3 px-4 text-neutral-500 font-medium">Type</th>
                      <th className="text-left py-3 px-4 text-neutral-500 font-medium">Description</th>
                      <th className="text-left py-3 px-4 text-[#D9FF00] font-medium">Lookup</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schema.columns.map((col, i) => (
                      <tr key={col.name} className="border-b border-neutral-800/50 hover:bg-neutral-800/30 transition-colors">
                        <td className="py-3 px-4 font-mono text-white">{col.name}</td>
                        <td className="py-3 px-4 font-mono text-neutral-500">{col.type}</td>
                        <td className="py-3 px-4 text-neutral-400">{col.desc}</td>
                        {i === 0 && (
                          <td rowSpan={schema.columns.length} className="py-3 px-4 font-mono text-[#D9FF00] align-top">
                            {schema.lookup}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="mt-8">
              <span className="text-neutral-500 text-sm uppercase tracking-wider">Sample lookup values</span>
              <div className="flex flex-wrap gap-2 mt-3">
                {schema?.values.map((v) => (
                  <span key={v} className={`px-3 py-1 rounded-lg text-xs font-medium ${BADGE_CLASS[activeTable] || BADGE_CLASS.departments}`}>
                    {v}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
