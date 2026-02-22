import { Button } from 'react-bootstrap';
import { useTheme } from '../hooks/useTheme';
import { resetDatabase } from '../api';

export function Navbar({ onResetSuccess }) {
  const { isDark, toggle } = useTheme();

  async function handleReset() {
    if (!window.confirm('Are you sure you want to reset the database? This will restore default values.')) return;
    try {
      const data = await resetDatabase();
      alert(data.message);
      onResetSuccess?.();
    } catch (err) {
      alert('Failed to reset database. Please check the console.');
    }
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm mb-4 py-3">
      <div className="container d-flex justify-content-between align-items-center flex-wrap gap-2">
        <a className="navbar-brand" href="#">
          <i className="bi bi-shield-lock-fill me-2" />SentinelGate
        </a>
        <div className="d-flex gap-2 flex-shrink-0 align-items-center">
          <a href="#database-schema" className="btn btn-outline-secondary btn-sm" title="View database schema">
            <i className="bi bi-database-gear" /> Schema
          </a>
          <Button variant="outline-secondary" size="sm" onClick={toggle} title="Toggle light/dark mode">
            <i className={`bi ${isDark ? 'bi-sun-fill' : 'bi-moon-stars-fill'}`} />
            <span className="ms-1">{isDark ? 'Light' : 'Dark'}</span>
          </Button>
          <Button variant="outline-primary" onClick={handleReset}>
            <i className="bi bi-arrow-counterclockwise" /> Reset Database
          </Button>
        </div>
      </div>
    </nav>
  );
}
