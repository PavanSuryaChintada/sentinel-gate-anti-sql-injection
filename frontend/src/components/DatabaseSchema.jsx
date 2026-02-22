import { useState } from 'react';
import { SCHEMA_TABLES, TABLES } from '../constants';

const BADGE_CLASS = {
  secrets: 'secrets',
  departments: 'departments',
  projects: 'projects',
  office_locations: 'offices',
};

export function DatabaseSchema() {
  const [activeTable, setActiveTable] = useState('secrets');
  const schema = SCHEMA_TABLES[activeTable];

  return (
    <div className="row mt-5" id="database-schema">
      <div className="col-12">
        <div className="card schema-card shadow-sm" style={{ borderLeft: '4px solid var(--primary-color)' }}>
          <div
            className="card-header d-flex align-items-center justify-content-between py-3"
            style={{ background: 'linear-gradient(135deg, #0dcaf0 0%, #0a8ec2 100%)', border: 'none' }}
          >
            <div>
              <span className="text-white" style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>Database</span>
              <h5 className="mb-0 text-white fw-bold">
                <i className="bi bi-database-fill-gear me-2" />Schema & Demo Data
              </h5>
            </div>
            <span className="badge bg-white text-dark px-3 py-2">4 Tables</span>
          </div>
          <div className="card-body p-4">
            <p className="text-muted mb-4">
              This demo simulates a fictional company database. Select a table below to view its schema,
              or use the <strong>Table</strong> dropdown in the query panels above.
            </p>

            <div className="mb-2" style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#6c757d', fontWeight: 600 }}>Select Table</div>
            <div className="mb-4" style={{ maxWidth: 280 }}>
              <div className="input-group">
                <span className="input-group-text"><i className="bi bi-table" /></span>
                <select
                  className="form-select"
                  value={activeTable}
                  onChange={(e) => setActiveTable(e.target.value)}
                >
                  {TABLES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-2" style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#6c757d', fontWeight: 600 }}>Schema Definition</div>
            <div className="table-responsive mb-4">
              {schema && (
                <table className="table table-bordered schema-table mb-0">
                  <thead>
                    <tr>
                      <th>Column</th>
                      <th>Type</th>
                      <th>Description</th>
                      <th>Lookup</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schema.columns.map((col, i) => (
                      <tr key={col.name} className="schema-row" style={{ borderLeft: '3px solid transparent' }}>
                        <td style={{ fontFamily: 'Consolas,Monaco,monospace', fontWeight: 600 }}>{col.name}</td>
                        <td style={{ fontFamily: 'Consolas,Monaco,monospace', fontSize: '0.85em', color: '#6c757d' }}>{col.type}</td>
                        <td style={{ color: '#6c757d', fontSize: '0.9rem' }}>{col.desc}</td>
                        {i === 0 && (
                          <td rowSpan={schema.columns.length} className="align-middle" style={{ fontFamily: 'Consolas,Monaco,monospace', fontSize: '0.85em', color: 'var(--success-color)', fontWeight: 500 }}>
                            {schema.lookup}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="mb-2" style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#6c757d', fontWeight: 600 }}>Sample Lookup Values</div>
            <div className="row g-3 mb-4">
              {TABLES.map((t) => {
                const s = SCHEMA_TABLES[t];
                const bc = BADGE_CLASS[t] || 'departments';
                return (
                  <div key={t} className="col-md-6 col-lg-3">
                    <div
                      className="p-3 rounded"
                      style={{
                        background: t === 'secrets' ? 'rgba(239,71,111,0.06)' : t === 'departments' ? 'rgba(67,97,238,0.06)' : t === 'projects' ? 'rgba(6,214,160,0.06)' : 'rgba(13,202,240,0.06)',
                        border: `1px solid ${t === 'secrets' ? 'rgba(239,71,111,0.2)' : t === 'departments' ? 'rgba(67,97,238,0.2)' : t === 'projects' ? 'rgba(6,214,160,0.2)' : 'rgba(13,202,240,0.2)'}`,
                      }}
                    >
                      <div className="fw-bold mb-2" style={{ color: t === 'secrets' ? 'var(--danger-color)' : t === 'departments' ? 'var(--primary-color)' : t === 'projects' ? '#0d6b4d' : '#0dcaf0' }}>
                        <i className={`bi ${t === 'secrets' ? 'bi-key-fill' : t === 'departments' ? 'bi-building' : t === 'projects' ? 'bi-kanban' : 'bi-geo-alt-fill'} me-1`} />
                        {t}
                      </div>
                      <div className="d-flex flex-wrap gap-1">
                        {s?.values.map((v) => (
                          <span key={v} className={`lookup-badge ${bc}`} style={{ display: 'inline-block', padding: '0.25rem 0.5rem', borderRadius: 6, fontSize: '0.75rem', fontWeight: 600 }}>
                            {v}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <hr className="my-4" />
            <div className="mb-2" style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#6c757d', fontWeight: 600 }}>Testing Tips</div>
            <ul className="mb-0 ps-3">
              <li className="mb-2">Select a table from the dropdown, then enter a lookup value (e.g. <code>Engineering</code> for departments, <code>San Francisco</code> for office_locations).</li>
              <li className="mb-2">Use <code>Admin&apos; OR &apos;1&apos;=&apos;1</code> in the <strong>Vulnerable</strong> panel (secrets table) to dump all records.</li>
              <li className="mb-2">Try <code>Engineering&apos; OR &apos;1&apos;=&apos;1</code> when departments is selected to see injection across tables.</li>
              <li className="mb-2">Click <strong>Reset Database</strong> in the navbar to restore demo data.</li>
              <li>All data is fictional and for educational purposes only.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
