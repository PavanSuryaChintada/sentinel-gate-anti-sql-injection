import { Accordion } from 'react-bootstrap';

const ITEMS = [
  {
    eventKey: '0',
    title: 'Classic OR-based injection',
    payload: "Admin' OR '1'='1",
    body: "The single quote after \"Admin\" closes the string. The attacker then adds OR '1'='1, which is a condition that always evaluates to true. The full query becomes WHERE name='Admin' OR '1'='1' — the database returns every row because the OR condition is satisfied.",
    result: 'Full table dump. All secrets exposed.',
  },
  {
    eventKey: '1',
    title: 'Comment-based injection',
    payload: "'; DROP TABLE secrets; --",
    body: "; ends the current SQL statement. DROP TABLE secrets is a new statement that deletes the entire table. -- starts a comment, so the rest of the original query (e.g. ') is ignored.",
    result: 'Data destruction. The table and all its data are removed.',
  },
  {
    eventKey: '2',
    title: 'UNION-based injection',
    payload: "' UNION SELECT id, name, data FROM secrets --",
    body: "UNION combines results from two SELECT statements. The attacker closes the string, adds UNION, and runs a second query. The -- comments out the rest. Both result sets are returned together.",
    result: 'Data from columns or tables the application never intended to expose. Useful when the original query returns few columns.',
  },
  {
    eventKey: '3',
    title: 'How to prevent',
    body: null,
    list: [
      'Parameterized queries — Use placeholders (?, %s) and bind values separately. The database driver escapes input. Never concatenate user input into SQL.',
      'Input validation — Whitelist allowed characters and formats. Reject unexpected input early.',
      'Least privilege — Database user should have minimal permissions. Avoid DROP, ALTER, or admin rights for app connections.',
      'ORM — Use an ORM (SQLAlchemy, Django ORM) that handles escaping automatically.',
      'WAF & monitoring — Web application firewalls and logging can detect and block common injection patterns.',
    ],
  },
];

export function AttackTypes() {
  return (
    <div className="row mt-4">
      <div className="col-12">
        <div className="card">
          <div className="card-header bg-secondary text-white">
            <i className="bi bi-journal-bookmark-fill me-2" />SQL Injection Types Explained
          </div>
          <div className="card-body">
            <Accordion defaultActiveKey="0">
              {ITEMS.map((item, i) => (
                <Accordion.Item key={item.eventKey} eventKey={item.eventKey}>
                  <Accordion.Header>
                    <i className={`bi ${i < 3 ? `bi-${i + 1}-circle` : 'bi-shield-check'} me-2`} />
                    {item.title}
                  </Accordion.Header>
                  <Accordion.Body>
                    {item.payload && (
                      <p className="mb-2"><strong>Payload:</strong> <code>{item.payload}</code></p>
                    )}
                    {item.body && <p className="mb-2">{item.body}</p>}
                    {item.result && <p className="mb-0"><strong>Result:</strong> {item.result}</p>}
                    {item.list && (
                      <ul className="mb-0">
                        {item.list.map((li, j) => (
                          <li key={j} className={j < item.list.length - 1 ? 'mb-2' : ''}>{li}</li>
                        ))}
                      </ul>
                    )}
                  </Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
}
