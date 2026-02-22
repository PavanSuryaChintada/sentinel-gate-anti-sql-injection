import { useState, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { queryEndpoint } from '../../api';
import { TABLE_PLACEHOLDERS, TABLES, TEST_CASES } from '../../constants';

function QueryPanel({ type, input, table, result, loading, queryExecuted, onInputChange, onTableChange, onSubmit }) {
  const isVuln = type === 'vulnerable';
  const placeholder = TABLE_PLACEHOLDERS[table] || 'Enter value';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.01, y: -2 }}
      className={`rounded-2xl border p-6 ${
        isVuln ? 'border-[#FF3E3E]/30 bg-[#FF3E3E]/5' : 'border-[#D9FF00]/30 bg-[#D9FF00]/5'
      }`}
    >
      <div
        className={`flex items-center gap-2 mb-4 font-semibold ${
        isVuln ? 'text-[#FF3E3E]' : 'text-[#D9FF00]'
      }`}>
        <span>{isVuln ? '⚠' : '✓'}</span>
        {isVuln ? 'Vulnerable' : 'Secure'} Endpoint
      </div>
      <form onSubmit={(e) => { e.preventDefault(); const v = (input || '').trim(); if (v) onSubmit?.(v, table); }}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-neutral-400 mb-2">Table</label>
          <select
            value={table}
            onChange={(e) => onTableChange?.(e.target.value)}
            className="w-full rounded-lg border border-neutral-700 bg-[#0A0A0A] text-white px-4 py-2 focus:ring-2 focus:ring-[#D9FF00]/50 focus:border-[#D9FF00]/50 outline-none"
          >
            {TABLES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-neutral-400 mb-2">Lookup value</label>
          <input
            type="text"
            value={input}
            onChange={(e) => onInputChange?.(e.target.value)}
            placeholder={placeholder}
            className="w-full rounded-lg border border-neutral-700 bg-[#0A0A0A] text-white px-4 py-2 font-mono text-sm focus:ring-2 focus:ring-[#D9FF00]/50 focus:border-[#D9FF00]/50 outline-none"
          />
        </div>
        <button
          type="submit"
          className={`w-full py-3 rounded-lg font-semibold transition-all ${
            isVuln ? 'bg-[#FF3E3E]/20 text-[#FF3E3E] hover:bg-[#FF3E3E]/30' : 'bg-[#D9FF00]/20 text-[#D9FF00] hover:bg-[#D9FF00]/30'
          }`}
        >
          Test Query
        </button>
      </form>
      {loading && (
        <div className="mt-4 flex items-center gap-2 text-neutral-500">
          <div className="w-4 h-4 border-2 border-[#D9FF00] border-t-transparent rounded-full animate-spin" />
          Executing...
        </div>
      )}
      {!loading && result && (
        <div className="mt-4 p-4 rounded-lg bg-[#0A0A0A] border border-neutral-800 overflow-auto max-h-48">
          <pre className="text-xs text-neutral-400 font-mono whitespace-pre-wrap">
            {JSON.stringify(result, null, 2)}
          </pre>
          {queryExecuted && (
            <pre className="text-xs text-[#D9FF00] font-mono mt-2">{queryExecuted}</pre>
          )}
        </div>
      )}
    </motion.div>
  );
}

export function DemoSection({ onOpenChatbot }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const [vulnState, setVulnState] = useState({ input: "Admin' OR '1'='1", table: 'secrets', result: null, loading: false, queryExecuted: null });
  const [secureState, setSecureState] = useState({ input: "Admin' OR '1'='1", table: 'secrets', result: null, loading: false });

  const runVuln = useCallback(async (input, table) => {
    setVulnState((s) => ({ ...s, loading: true, result: null }));
    try {
      const data = await queryEndpoint('vulnerable', input, table);
      setVulnState((s) => ({ ...s, input, table, result: data, queryExecuted: data?.query_executed || null, loading: false }));
    } catch (e) {
      setVulnState((s) => ({ ...s, result: { status: 'error', message: e.message }, loading: false }));
    }
  }, []);

  const runSecure = useCallback(async (input, table) => {
    setSecureState((s) => ({ ...s, loading: true, result: null }));
    try {
      const data = await queryEndpoint('secure', input, table);
      setSecureState((s) => ({ ...s, input, table, result: data, loading: false }));
    } catch (e) {
      setSecureState((s) => ({ ...s, result: { status: 'error', message: e.message }, loading: false }));
    }
  }, []);

  const runTestCase = useCallback(async (tc) => {
    if (tc.vuln) runVuln(tc.vuln, 'secrets');
    if (tc.secure) runSecure(tc.secure, 'secrets');
    setVulnState((s) => ({ ...s, input: tc.vuln, table: 'secrets' }));
    setSecureState((s) => ({ ...s, input: tc.secure, table: 'secrets' }));
  }, [runVuln, runSecure]);

  return (
    <section id="demo" className="py-24 px-6" ref={ref}>
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-neutral-500 bg-clip-text text-transparent mb-4">
            Interactive Demo
          </h2>
          <p className="text-neutral-500 mb-6">Compare vulnerable vs secure SQL handling</p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onOpenChatbot}
            className="px-6 py-3 rounded-xl bg-[#D9FF00]/20 border border-[#D9FF00]/30 text-[#D9FF00] font-semibold hover:bg-[#D9FF00]/30 transition-colors"
          >
            Chatbot Demo
          </motion.button>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <QueryPanel
            type="vulnerable"
            input={vulnState.input}
            table={vulnState.table}
            result={vulnState.result}
            loading={vulnState.loading}
            queryExecuted={vulnState.queryExecuted}
            onInputChange={(v) => setVulnState((s) => ({ ...s, input: v }))}
            onTableChange={(t) => setVulnState((s) => ({ ...s, table: t }))}
            onSubmit={runVuln}
          />
          <QueryPanel
            type="secure"
            input={secureState.input}
            table={secureState.table}
            result={secureState.result}
            loading={secureState.loading}
            onInputChange={(v) => setSecureState((s) => ({ ...s, input: v }))}
            onTableChange={(t) => setSecureState((s) => ({ ...s, table: t }))}
            onSubmit={runSecure}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-neutral-800 bg-[#171717] p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Test cases</h3>
          <div className="flex flex-wrap gap-3">
            {TEST_CASES.map((tc) => (
              <motion.button
                key={tc.id}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => runTestCase(tc)}
                className="px-4 py-2 rounded-lg border border-neutral-700 text-neutral-300 text-sm font-medium hover:border-[#D9FF00]/50 hover:text-[#D9FF00] transition-colors"
              >
                {tc.label}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
