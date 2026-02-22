import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { queryEndpoint } from '../api';
import { TABLE_PLACEHOLDERS, TABLES } from '../constants';

const VULN_EXPLAIN = (
  <>
    <p className="mb-2"><strong>String concatenation:</strong> User input is directly inserted into the SQL string with f-strings. The database cannot distinguish between intended SQL and attacker input.</p>
    <p className="mb-2"><strong>How the attack works:</strong> An attacker closes the string with <code>&#39;</code>, then adds <code>OR &#39;1&#39;=&#39;1</code>. The query becomes <code>WHERE name = &#39;Admin&#39; OR &#39;1&#39;=&#39;1&#39;</code> — the <code>OR &#39;1&#39;=&#39;1&#39;</code> is always true, so every row is returned.</p>
    <p className="mb-0"><strong>Impact:</strong> Full database dump, credential theft, data modification, or table deletion.</p>
  </>
);

const SECURE_EXPLAIN = (
  <>
    <p className="mb-2"><strong>Parameterized queries:</strong> The <code>?</code> placeholder is bound separately by the database driver. SQL structure and user data are kept apart.</p>
    <p className="mb-2"><strong>Why injection fails:</strong> When you send <code>Admin&#39; OR &#39;1&#39;=&#39;1</code>, the database searches for a user literally named that string — it never interprets the quotes or OR as SQL. No match = no data returned.</p>
    <p className="mb-0"><strong>Best practice:</strong> Never concatenate user input into SQL. Always use placeholders and bind parameters.</p>
  </>
);

export function QueryPanel({ type, input, table, result, loading, queryExecuted, onInputChange, onTableChange, onSubmit }) {
  const isVuln = type === 'vulnerable';
  const [showExplain, setShowExplain] = useState(false);

  const placeholder = TABLE_PLACEHOLDERS[table] || 'Enter value';

  async function handleSubmit(e) {
    e.preventDefault();
    const val = (input || '').trim();
    if (!val) return;
    await onSubmit?.(val, table);
  }

  return (
    <div className={`card h-100 ${isVuln ? 'vulnerable' : 'secure'}`}>
      <div className="card-header text-white">
        <i className={`bi ${isVuln ? 'bi-exclamation-triangle-fill' : 'bi-shield-check-fill'} me-2`} />
        {isVuln ? 'Vulnerable' : 'Secure'} Endpoint
      </div>
      <div className="card-body">
        <Form onSubmit={handleSubmit} className="mb-4">
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Table</Form.Label>
            <Form.Select value={table} onChange={(e) => onTableChange?.(e.target.value)}>
              {TABLES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Lookup value</Form.Label>
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-search" /></span>
              <Form.Control
                value={input}
                onChange={(e) => onInputChange?.(e.target.value)}
                placeholder={placeholder}
              />
            </div>
            <Form.Text className={isVuln ? 'text-danger' : 'text-success'}>
              <i className={`bi ${isVuln ? 'bi-exclamation-circle-fill' : 'bi-shield-check'}`} />
              {isVuln
                ? ' This endpoint is vulnerable to SQL injection'
                : ' This endpoint is protected against SQL injection'}
            </Form.Text>
            <Button
              type="button"
              variant="link"
              className={`explanation-btn ${isVuln ? 'vuln' : 'secure'} mt-2 p-0`}
              onClick={() => setShowExplain(!showExplain)}
            >
              <i className="bi bi-book" /> {isVuln ? 'Why is this vulnerable?' : 'How does this protect?'}
            </Button>
            {showExplain && (
              <div className="explanation-panel mt-2">
                {isVuln ? VULN_EXPLAIN : SECURE_EXPLAIN}
              </div>
            )}
          </Form.Group>
          <Button type="submit" className={`w-100 text-white ${isVuln ? 'btn-vulnerable' : 'btn-secure'}`}>
            <i className="bi bi-play-fill me-2" />Test {isVuln ? 'Vulnerable' : 'Secure'} Query
          </Button>
        </Form>

        {loading && (
          <div className="text-center py-4">
            <div className="loading-spinner" />
            <p className="mt-2 mb-0">Executing query...</p>
          </div>
        )}

        {!loading && result && (
          <div>
            <h6 className="fw-bold mb-3">Query Results</h6>
            <div className="result-container mb-3">
              <pre className="mb-0">{JSON.stringify(result, null, 2)}</pre>
            </div>
            {queryExecuted && (
              <div className="mt-3">
                <h6 className="fw-bold">Executed Query:</h6>
                <pre className="bg-light p-2">{queryExecuted}</pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
