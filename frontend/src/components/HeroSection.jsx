import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { EmbedScriptCard } from './EmbedScriptCard';

export function HeroSection({ onOpenChatbot }) {
  const [showChatExplain, setShowChatExplain] = useState(false);

  return (
    <div className="text-center mb-5">
      <h1 className="display-5 fw-bold mb-3">SQL Injection Demo</h1>
      <p className="lead text-muted">
        A demonstration of SQL injection vulnerabilities and secure coding practices
      </p>
      <a href="#database-schema" className="btn btn-outline-secondary btn-sm mt-2">
        <i className="bi bi-database-gear me-1" />View Database Schema
      </a>

      <EmbedScriptCard />

      <div className="d-flex flex-column align-items-center gap-2 mt-2">
        <div className="d-flex flex-wrap justify-content-center gap-2">
          <Button variant="success" size="lg" onClick={onOpenChatbot}>
            <i className="bi bi-chat-dots-fill me-2" />Chatbot Demo
          </Button>
          <Button
            variant="outline-primary"
            className="explanation-btn info"
            onClick={() => setShowChatExplain(!showChatExplain)}
          >
            <i className="bi bi-info-circle" /> What is the Chatbot Demo?
          </Button>
        </div>
      </div>

      {showChatExplain && (
        <div className="mt-2 mx-auto" style={{ maxWidth: 600 }}>
          <div className="explanation-panel">
            <p className="mb-0">
              Compare <strong>Secured</strong> vs <strong>Unsecured</strong> chatbots. The unsecured chatbot
              executes user input as SQL and leaks all secrets when given injection payloads. The secured
              chatbot refuses all data requests and blocks SQL/prompt injection attempts. Use this to see
              how AI assistants can be vulnerable to prompt injection and data exfiltration.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
