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
        isVuln ? 'border-red-500/30 bg-red-500/5' : 'border-emerald-500/30 bg-emerald-500/5'
      }`}
    >
      <div className={`flex items-center gap-2 mb-4 font-semibold ${
        isVuln ? 'text-red-400' : 'text-emerald-400'
      }`}>
        <span>{isVuln ? '⚠' : '✓'}</span>
        {isVuln ? 'Vulnerable' : 'Secure'} Endpoint
      </div>
      <form onSubmit={(e) => { e.preventDefault(); const v = (input || '').trim(); if (v) onSubmit?.(v, table); }}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-400 mb-2">Table</label>
          <select
            value={table}
            onChange={(e) => onTableChange?.(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-900 text-white px-4 py-2 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 outline-none"
          >
            {TABLES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-400 mb-2">Lookup value</label>
          <input
            type="text"
            value={input}
            onChange={(e) => onInputChange?.(e.target.value)}
            placeholder={placeholder}
            className="w-full rounded-lg border border-slate-700 bg-slate-900 text-white px-4 py-2 font-mono text-sm focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 outline-none"
          />
        </div>
        <button
          type="submit"
          className={`w-full py-3 rounded-lg font-semibold transition-all ${
            isVuln ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
          }`}
        >
          Test Query
        </button>
      </form>
      {loading && (
        <div className="mt-4 flex items-center gap-2 text-slate-400">
          <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          Executing...
        </div>
      )}
      {!loading && result && (
        <div className="mt-4 p-4 rounded-lg bg-slate-950 border border-slate-800 overflow-auto max-h-48">
          <pre className="text-xs text-slate-400 font-mono whitespace-pre-wrap">
            {JSON.stringify(result, null, 2)}
          </pre>
          {queryExecuted && (
            <pre className="text-xs text-amber-400 font-mono mt-2">{queryExecuted}</pre>
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
          <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent mb-4">
            Interactive Demo
          </h2>
          <p className="text-slate-400 mb-6">Compare vulnerable vs secure SQL handling</p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onOpenChatbot}
            className="px-6 py-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-semibold hover:bg-emerald-500/30 transition-colors"
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
          className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Test cases</h3>
          <div className="flex flex-wrap gap-3">
            {TEST_CASES.map((tc) => (
              <motion.button
                key={tc.id}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => runTestCase(tc)}
                className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 text-sm font-medium hover:border-emerald-500/50 hover:text-emerald-400 transition-colors"
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
