import { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { chatEndpoint } from '../api';

export function ChatbotModal({ show, onHide }) {
  const [activeChatbot, setActiveChatbot] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  function openChatbot(type) {
    setActiveChatbot(type);
    setMessages([
      { role: 'bot', text: `Hello! I'm the ${type === 'secured' ? 'secured' : 'unsecured'} chatbot. Ask me anything or try requesting user data (e.g., Admin, User1).` },
    ]);
    setInput('');
  }

  function backToCards() {
    setActiveChatbot(null);
    setMessages([]);
    setInput('');
  }

  async function sendMessage() {
    const msg = input.trim();
    if (!msg || !activeChatbot) return;
    setInput('');
    setMessages((m) => [...m, { role: 'user', text: msg }]);
    setLoading(true);
    try {
      const data = await chatEndpoint(activeChatbot, msg);
      const response = data.response || data.message || 'No response.';
      setMessages((m) => [...m, { role: 'bot', text: response }]);
    } catch (err) {
      setMessages((m) => [...m, { role: 'bot', text: `Error: ${err.message}` }]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyPress(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title><i className="bi bi-chat-dots-fill me-2" />Chatbot Demo</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!activeChatbot ? (
          <>
            <p className="text-muted mb-4">
              Choose a chatbot to test. The secured chatbot blocks SQL and prompt injection; the unsecured one does not.
            </p>
            <div className="row g-3">
              <div className="col-6">
                <div className="card chatbot-card secured h-100" onClick={() => openChatbot('secured')} role="button">
                  <div className="card-header fw-bold">
                    <i className="bi bi-shield-check-fill me-2" />Secured Chatbot
                  </div>
                  <div className="card-body">
                    <p className="mb-0 small">Protected against SQL & prompt injection. Try it!</p>
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="card chatbot-card unsecured h-100" onClick={() => openChatbot('unsecured')} role="button">
                  <div className="card-header fw-bold">
                    <i className="bi bi-exclamation-triangle-fill me-2" />Unsecured Chatbot
                  </div>
                  <div className="card-body">
                    <p className="mb-0 small">Vulnerable to injection. For demo only.</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div>
            <Button variant="outline-secondary" size="sm" className="mb-2" onClick={backToCards}>
              <i className="bi bi-arrow-left" /> Back
            </Button>
            <div className={`badge mb-2 ${activeChatbot === 'secured' ? 'bg-success' : 'bg-danger'}`}>
              {activeChatbot === 'secured' ? 'Secured' : 'Unsecured'} Chatbot
            </div>
            <div className="chat-messages mb-3" style={{ minHeight: 200 }}>
              {messages.map((m, i) => (
                <div key={i} className={`chat-msg ${m.role}`} style={{ whiteSpace: 'pre-wrap' }}>
                  {m.text}
                </div>
              ))}
            </div>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <Button variant="primary" onClick={sendMessage} disabled={loading}>
                <i className="bi bi-send-fill" /> Send
              </Button>
            </div>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
}
