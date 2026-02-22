import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { chatEndpoint } from '../../api';

export function ChatbotModal({ show, onHide }) {
  const [activeChatbot, setActiveChatbot] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  function openChatbot(type) {
    setActiveChatbot(type);
    setMessages([
      { role: 'bot', text: `Hello! I'm the ${type === 'secured' ? 'secured' : 'unsecured'} chatbot. Ask me anything or try requesting user data (e.g., Admin).` },
    ]);
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

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onHide}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
              <h3 className="text-lg font-semibold text-white">Chatbot Demo</h3>
              <button onClick={onHide} className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              {!activeChatbot ? (
                <div className="grid grid-cols-2 gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => openChatbot('secured')}
                    className="p-6 rounded-xl border-2 border-emerald-500/50 bg-emerald-500/10 text-left hover:bg-emerald-500/20 transition-colors"
                  >
                    <span className="text-emerald-400 font-semibold">Secured</span>
                    <p className="text-slate-400 text-sm mt-1">Blocks SQL & prompt injection</p>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => openChatbot('unsecured')}
                    className="p-6 rounded-xl border-2 border-red-500/50 bg-red-500/10 text-left hover:bg-red-500/20 transition-colors"
                  >
                    <span className="text-red-400 font-semibold">Unsecured</span>
                    <p className="text-slate-400 text-sm mt-1">Vulnerable to injection</p>
                  </motion.button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => { setActiveChatbot(null); setMessages([]); }}
                    className="text-sm text-slate-400 hover:text-white mb-4"
                  >
                    ← Back
                  </button>
                  <div className="h-64 overflow-y-auto space-y-3 mb-4 p-4 rounded-lg bg-slate-900/50 border border-slate-800">
                    {messages.map((m, i) => (
                      <div
                        key={i}
                        className={`max-w-[85%] rounded-lg px-4 py-2 ${
                          m.role === 'user' ? 'ml-auto bg-emerald-500/20 text-emerald-100' : 'bg-slate-800 text-slate-200'
                        }`}
                      >
                        {m.text}
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Type a message..."
                      className="flex-1 rounded-lg border border-slate-700 bg-slate-900 text-white px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-500/50"
                    />
                    <button
                      onClick={sendMessage}
                      disabled={loading}
                      className="px-4 py-2 rounded-lg bg-emerald-500 text-slate-950 font-semibold hover:bg-emerald-400 disabled:opacity-50"
                    >
                      Send
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
