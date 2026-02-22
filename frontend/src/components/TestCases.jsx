import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { queryEndpoint } from '../api';
import { TEST_CASES } from '../constants';

const VARIANT_CLASS = {
  primary: 'btn-outline-primary',
  vuln: 'btn-outline-danger',
  info: 'btn-outline-info',
};

export function TestCases({ onRunVuln, onRunSecure }) {
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(false);

  async function runTestCase(tc) {
    setLoading(true);
    try {
      if (tc.vuln) {
        const data = await queryEndpoint('vulnerable', tc.vuln, 'secrets', null);
        onRunVuln?.({ input: tc.vuln, table: 'secrets', data });
      }
      if (tc.secure) {
        const data = await queryEndpoint('secure', tc.secure, 'secrets', tc.id);
        onRunSecure?.({ input: tc.secure, table: 'secrets', data });
      }
    } catch (e) {
      onRunVuln?.({ input: tc.vuln, table: 'secrets', data: { status: 'error', message: e.message } });
      onRunSecure?.({ input: tc.secure, table: 'secrets', data: { status: 'error', message: e.message } });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="row mt-5">
      <div className="col-12">
        <div className="card">
          <div className="card-header bg-dark text-white">
            <i className="bi bi-lightning-charge-fill me-2" />Test Cases
          </div>
          <div className="card-body">
            <h5 className="card-title mb-3">Try these test cases:</h5>
            <div className="row g-3">
              {TEST_CASES.map((tc) => (
                <div key={tc.id} className="col-12 col-md-6 col-lg-4">
                  <div className={`test-case-card ${tc.id} p-3 rounded`} style={{ borderLeft: '4px solid #dee2e6' }}>
                    <Button
                      variant={VARIANT_CLASS[tc.variant] || 'outline-secondary'}
                      className="test-case-btn w-100 mb-2"
                      onClick={() => runTestCase(tc)}
                      disabled={loading}
                    >
                      <i className={`bi ${tc.icon} me-1`} /> {tc.label}
                    </Button>
                    <Button
                      variant="link"
                      size="sm"
                      className={`explanation-btn ${tc.variant} p-0`}
                      onClick={() => setExpanded(expanded === tc.id ? null : tc.id)}
                    >
                      <i className="bi bi-info-circle" /> Learn more
                    </Button>
                    {expanded === tc.id && (
                      <div className="explanation-panel mt-2">
                        <p className="mb-0 small">{tc.explain}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
