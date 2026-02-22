import { useState } from 'react';
import { Button } from 'react-bootstrap';

export function EmbedScriptCard() {
  const base = typeof window !== 'undefined' ? window.location.origin : '';
  const [copied, setCopied] = useState(false);
  const code = `<script src="${base}/sentinel-gate.js"><\/script>`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert(`Copy failed. Manually copy: ${code}`);
    }
  }

  return (
    <div className="card border-2 border-success mb-4" style={{ maxWidth: 700, margin: '0 auto' }}>
      <div className="card-header bg-success text-white fw-bold">
        <i className="bi bi-shield-lock-fill me-2" />Protect Your Website — Copy & Paste One Line
      </div>
      <div className="card-body">
        <p className="text-muted mb-3">
          Add this script tag to your website&apos;s <code>&lt;head&gt;</code> or before <code>&lt;/body&gt;</code>.
          All forms, inputs, and chatboxes will be protected from SQL injection. No extensions, no setup—works immediately.
        </p>
        <div className="d-flex flex-wrap align-items-center gap-2">
          <code
            className="embed-script-box flex-grow-1"
            onClick={handleCopy}
            title="Click to copy"
            role="button"
          >
            {code}
          </code>
          <Button
            variant={copied ? 'outline-success' : 'success'}
            className="embed-copy-btn"
            onClick={handleCopy}
            title="Copy to clipboard"
          >
            <i className={`bi ${copied ? 'bi-check' : 'bi-clipboard'}`} /> {copied ? 'Copied!' : 'Copy'}
          </Button>
        </div>
        <p className="small text-muted mt-2 mb-0">
          Replace the URL with your deployment (e.g. <code>https://your-app.vercel.app</code>).
          Deploy this app, then use your own URL in the script src.
        </p>
      </div>
    </div>
  );
}
