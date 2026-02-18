/**
 * SentinelGate - SQL Injection Shield
 * Content script that monitors chatboxes and text inputs to detect and block SQL injection attempts.
 * Works across all websites including Newtrea, AI chatbots, and web forms.
 */

(function () {
  'use strict';

  const SQL_INJECTION_PATTERNS = [
    // OR/AND-based injection
    /\bOR\s+['"]?\d+['"]?\s*=\s*['"]?\d+['"]?/i,
    /\bOR\s+['"]?\d+['"]?\s*=\s*['"]?\d+['"]?\s*--/i,
    /\bAND\s+['"]?\d+['"]?\s*=\s*['"]?\d+['"]?/i,
    /\bOR\s+['"]?1['"]?\s*=\s*['"]?1['"]?/i,
    /\bOR\s+['"]?1['"]?\s*=\s*['"]?1['"]?\s*--/i,
    // UNION-based
    /\bUNION\s+(ALL\s+)?SELECT\b/i,
    /\bUNION\s+(ALL\s+)?SELECT\s+.*\s+FROM\b/i,
    // Comment-based
    /;\s*--\s*$/,
    /'\s*;\s*--/,
    /"\s*;\s*--/,
    // DROP/ALTER/DELETE
    /\bDROP\s+(TABLE|DATABASE|SCHEMA)\b/i,
    /\bALTER\s+TABLE\b/i,
    /\bDELETE\s+FROM\b/i,
    /\bTRUNCATE\b/i,
    // Stacked queries
    /;\s*DROP\b/i,
    /;\s*INSERT\b/i,
    /;\s*UPDATE\b/i,
    // String termination
    /'\s*OR\s+/i,
    /"\s*OR\s+/i,
    /'\s*AND\s+/i,
    /"\s*AND\s+/i,
    // Sleep/benchmark (time-based)
    /\bSLEEP\s*\(/i,
    /\bBENCHMARK\s*\(/i,
    /\bWAITFOR\s+DELAY\b/i,
    // Information schema
    /\bINFORMATION_SCHEMA\b/i,
    /\bFROM\s+information_schema\b/i,
    // Hex encoding attempts
    /\b0x[0-9a-fA-F]+\b.*\b(SELECT|UNION|OR)\b/i,
    // Double dash (SQL comment)
    /\s--\s*$/,
    /'\s*\)\s*--/,
  ];

  const BLOCKED_MESSAGE = '🚫 SentinelGate blocked a potential SQL injection. Your message was not sent.';
  const TOAST_DURATION = 4000;

  let isEnabled = true;

  // Load saved preference
  chrome.storage.sync.get(['sentinelgateEnabled'], (result) => {
    isEnabled = result.sentinelgateEnabled !== false;
  });

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'sync' && changes.sentinelgateEnabled) {
      isEnabled = changes.sentinelgateEnabled.newValue !== false;
    }
  });

  function containsSqlInjection(text) {
    if (!text || typeof text !== 'string') return false;
    const trimmed = text.trim();
    if (trimmed.length < 3) return false;

    for (const pattern of SQL_INJECTION_PATTERNS) {
      if (pattern.test(trimmed)) return true;
    }

    // Additional heuristic: suspicious quote patterns
    const quoteCount = (trimmed.match(/'/g) || []).length;
    if (quoteCount >= 2 && /OR|AND|UNION|SELECT|DROP/i.test(trimmed)) return true;

    return false;
  }

  function showToast(message) {
    const toast = document.createElement('div');
    toast.id = 'sentinelgate-toast';
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(135deg, #ef476f 0%, #c1121f 100%);
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 14px;
      font-weight: 500;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      z-index: 2147483647;
      animation: sentinelgate-fadein 0.3s ease;
    `;

    const style = document.createElement('style');
    style.textContent = `
      @keyframes sentinelgate-fadein {
        from { opacity: 0; transform: translateX(-50%) translateY(10px); }
        to { opacity: 1; transform: translateX(-50%) translateY(0); }
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s';
      setTimeout(() => toast.remove(), 300);
    }, TOAST_DURATION);
  }

  function protectInput(input) {
    if (!input || !input.value || !isEnabled) return { blocked: false };

    if (containsSqlInjection(input.value)) {
      showToast(BLOCKED_MESSAGE);
      input.value = '';
      input.focus();
      return { blocked: true };
    }
    return { blocked: false };
  }

  function setupInputProtection(element) {
    if (element.dataset.sentinelgateProtected) return;
    element.dataset.sentinelgateProtected = 'true';

    element.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        const { blocked } = protectInput(element);
        if (blocked) e.preventDefault();
      }
    });

    element.addEventListener('paste', (e) => {
      setTimeout(() => {
        const { blocked } = protectInput(element);
        if (blocked) e.preventDefault();
      }, 0);
    });
  }

  function setupFormProtection(form) {
    if (form.dataset.sentinelgateProtected) return;
    form.dataset.sentinelgateProtected = 'true';

    form.addEventListener('submit', (e) => {
      if (!isEnabled) return;

      const inputs = form.querySelectorAll(
        'input[type="text"], input[type="search"], input:not([type]), textarea, [contenteditable="true"]'
      );

      for (const input of inputs) {
        const value = input.contentEditable === 'true' ? input.textContent : input.value;
        if (value && containsSqlInjection(value)) {
          e.preventDefault();
          e.stopPropagation();
          showToast(BLOCKED_MESSAGE);
          if (input.focus) input.focus();
          return false;
        }
      }
    });
  }

  function protectChatboxSubmit(container) {
    const sendButtons = container.querySelectorAll(
      'button[type="submit"], button[aria-label*="send"], button[aria-label*="Send"], [data-testid*="send"], .send-btn, [class*="send"]'
    );
    const inputs = container.querySelectorAll(
      'input[type="text"], textarea, [contenteditable="true"], [role="textbox"]'
    );

    inputs.forEach(setupInputProtection);

    sendButtons.forEach((btn) => {
      if (btn.dataset.sentinelgateProtected) return;
      btn.dataset.sentinelgateProtected = 'true';
      btn.addEventListener('click', (e) => {
        if (!isEnabled) return;
        for (const input of inputs) {
          const value = input.contentEditable === 'true' ? input.textContent : (input.value || '');
          if (value && containsSqlInjection(value)) {
            e.preventDefault();
            e.stopImmediatePropagation();
            showToast(BLOCKED_MESSAGE);
            return false;
          }
        }
      }, true);
    });
  }

  function scanAndProtect() {
    if (!isEnabled) return;

    document.querySelectorAll('form').forEach(setupFormProtection);

    const chatSelectors = [
      '[class*="chat"] input',
      '[class*="chat"] textarea',
      '[class*="chat"] [contenteditable="true"]',
      '[id*="chat"] input',
      '[id*="chat"] textarea',
      '[data-testid*="chat"] input',
      '[role="form"] input',
      '[role="form"] textarea',
      '.chat-input',
      '.message-input',
      '[placeholder*="message" i]',
      '[placeholder*="type" i]',
      '[placeholder*="ask" i]',
    ];

    const seen = new Set();
    chatSelectors.forEach((sel) => {
      try {
        document.querySelectorAll(sel).forEach((el) => {
          if (!seen.has(el)) {
            seen.add(el);
            setupInputProtection(el);
            let container = el.closest('[class*="chat"], [id*="chat"], [class*="message"], form');
            if (container) protectChatboxSubmit(container);
          }
        });
      } catch (_) {}
    });
  }

  const observer = new MutationObserver(() => scanAndProtect());
  observer.observe(document.body, { childList: true, subtree: true });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scanAndProtect);
  } else {
    scanAndProtect();
  }
})();
