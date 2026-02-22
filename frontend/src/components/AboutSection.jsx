import { useState } from 'react';
import { Button } from 'react-bootstrap';

export function AboutSection() {
  const [showVulnImpact, setShowVulnImpact] = useState(false);
  const [showSecureImpact, setShowSecureImpact] = useState(false);

  return (
    <div className="row mt-4">
      <div className="col-12">
        <div className="card">
          <div className="card-header bg-primary text-white">
            <i className="bi bi-info-circle-fill me-2" />About This Demo
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <h5>Vulnerable Endpoint</h5>
                <p>
                  This endpoint is vulnerable to SQL injection because it directly concatenates user input
                  into the SQL query. Attackers can manipulate the input to execute arbitrary SQL commands.
                </p>
                <pre className="bg-dark text-light p-2">
{`# Vulnerable Code Example
query = f"SELECT * FROM secrets WHERE name = '{user_input}'"
cursor.execute(query)`}
                </pre>
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="explanation-btn primary mt-2"
                  onClick={() => setShowVulnImpact(!showVulnImpact)}
                >
                  <i className="bi bi-exclamation-triangle" /> Real-world impact
                </Button>
                {showVulnImpact && (
                  <div className="explanation-panel vuln mt-2">
                    <p className="mb-2">SQL injection remains one of the most critical web vulnerabilities. OWASP ranks it in the top 3.</p>
                    <p className="mb-0"><strong>Consequences:</strong> Data breaches (millions of records), account takeover, credential theft, data destruction, and full database compromise. Real attacks have affected major companies and exposed sensitive user data.</p>
                  </div>
                )}
              </div>
              <div className="col-md-6">
                <h5>Secure Endpoint</h5>
                <p>
                  This endpoint is protected against SQL injection by using parameterized queries, which
                  properly escape and sanitize user input before including it in SQL statements.
                </p>
                <pre className="bg-dark text-light p-2">
{`# Secure Code Example
query = "SELECT * FROM secrets WHERE name = ?"
cursor.execute(query, (user_input,))`}
                </pre>
                <Button
                  variant="outline-success"
                  size="sm"
                  className="explanation-btn success mt-2"
                  onClick={() => setShowSecureImpact(!showSecureImpact)}
                >
                  <i className="bi bi-shield-check" /> Best practices
                </Button>
                {showSecureImpact && (
                  <div className="explanation-panel secure mt-2">
                    <ul className="mb-0">
                      <li><strong>Parameterized queries</strong> — Never concatenate user input into SQL</li>
                      <li><strong>Input validation</strong> — Whitelist allowed characters and formats</li>
                      <li><strong>Least privilege</strong> — DB user should have minimal permissions</li>
                      <li><strong>ORM</strong> — Use an ORM that handles escaping automatically</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
