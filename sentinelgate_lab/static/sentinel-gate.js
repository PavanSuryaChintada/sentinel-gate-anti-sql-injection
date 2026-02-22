/**
 * SentinelGate - SQL Injection Shield
 * Production-ready embeddable script. Add to any website via:
 * <script src="https://your-domain.com/sentinel-gate.js"></script>
 *
 * Protects forms, inputs, chatboxes, and fetch/XHR from SQL injection.
 * (c) SentinelGate - MIT License
 */
(function () {
  'use strict';

  var VERSION = '1.0.0';
  var BLOCKED_MESSAGE = 'Security blocked: Potential SQL injection detected. Your input was not sent.';
  var TOAST_DURATION = 4500;

  /* 100+ SQL injection detection patterns - production hardened */
  var SQL_PATTERNS = [
    /* OR/AND boolean-based */
    /\bOR\s+['"]?\d+['"]?\s*=\s*['"]?\d+['"]?/i,
    /\bOR\s+['"]?1['"]?\s*=\s*['"]?1['"]?/i,
    /\bOR\s+['"]?1['"]?\s*=\s*['"]?1['"]?\s*--/i,
    /\bOR\s+1\s*=\s*1\b/i,
    /\bOR\s+'1'\s*=\s*'1'/i,
    /\bOR\s+"1"\s*=\s*"1"/i,
    /\bOR\s+true\b/i,
    /\bOR\s+false\b/i,
    /\bAND\s+['"]?\d+['"]?\s*=\s*['"]?\d+['"]?/i,
    /\bAND\s+1\s*=\s*1\b/i,
    /\bAND\s+'1'\s*=\s*'1'/i,
    /\bOR\s+['"]?\d+['"]?\s*=\s*['"]?\d+['"]?\s*--/i,
    /\|\|\s*['"]?\d+['"]?\s*=\s*['"]?\d+['"]?/i,
    /\bOR\s+.*\s*=\s*.*\s*--/i,
    /\bAND\s+.*\s*=\s*.*\s*--/i,
    /* UNION-based */
    /\bUNION\s+(ALL\s+)?SELECT\b/i,
    /\bUNION\s+(ALL\s+)?SELECT\s+.*\s+FROM\b/i,
    /\bUNION\s+SELECT\s+NULL\b/i,
    /\bUNION\s+SELECT\s+\*\b/i,
    /\bSELECT\s+.*\s+UNION\s+SELECT\b/i,
    /\bUNION\s+ALL\s+SELECT\s+NULL/i,
    /\bUNION\s+SELECT\s+.*\s+--/i,
    /\bUNION\s+SELECT\s+.*\s+#/i,
    /\bUNION\s+SELECT\s+.*\s+;/i,
    /* Comment / string termination */
    /;\s*--\s*$/,
    /'\s*;\s*--/,
    /"\s*;\s*--/,
    /\s--\s*$/,
    /'\s*\)\s*--/,
    /;\s*#\s*$/,
    /\/\*.*\*\/.*(SELECT|UNION|DROP|DELETE)/i,
    /'\s*\+\s*'/,
    /"\s*\+\s*"/,
    /* DROP / ALTER / DELETE / TRUNCATE */
    /\bDROP\s+(TABLE|DATABASE|SCHEMA|INDEX|VIEW)\b/i,
    /\bDROP\s+TABLE\s+IF\s+EXISTS\b/i,
    /\bALTER\s+TABLE\b/i,
    /\bDELETE\s+FROM\b/i,
    /\bTRUNCATE\s+(TABLE\s+)?\w+\b/i,
    /\bTRUNCATE\s+TABLE\b/i,
    /\bDROP\s+USER\b/i,
    /\bDROP\s+PROCEDURE\b/i,
    /\bDROP\s+FUNCTION\b/i,
    /* Stacked / batched queries */
    /;\s*DROP\b/i,
    /;\s*INSERT\b/i,
    /;\s*UPDATE\b/i,
    /;\s*DELETE\b/i,
    /;\s*CREATE\b/i,
    /;\s*ALTER\b/i,
    /;\s*EXEC\b/i,
    /;\s*EXECUTE\b/i,
    /* String termination for injection */
    /'\s*OR\s+/i,
    /"\s*OR\s+/i,
    /'\s*AND\s+/i,
    /"\s*AND\s+/i,
    /'\s*UNION\s+/i,
    /"\s*UNION\s+/i,
    /'\s*;\s*SELECT/i,
    /"\s*;\s*SELECT/i,
    /* Time-based blind */
    /\bSLEEP\s*\(/i,
    /\bBENCHMARK\s*\(/i,
    /\bWAITFOR\s+DELAY\b/i,
    /\bWAITFOR\s+TIME\b/i,
    /\bPG_SLEEP\s*\(/i,
    /\bDBMS_PIPE\.RECEIVE_MESSAGE\s*\(/i,
    /\bDBMS_LOCK\.SLEEP\s*\(/i,
    /\bfn:sleep\s*\(/i,
    /* Information schema / metadata */
    /\bINFORMATION_SCHEMA\b/i,
    /\bFROM\s+information_schema\b/i,
    /\bINTO\s+INFORMATION_SCHEMA\b/i,
    /\bINTO\s+OUTFILE\b/i,
    /\bINTO\s+DUMPFILE\b/i,
    /\bLOAD_FILE\s*\(/i,
    /\bLOAD\s+DATA\s+INFILE\b/i,
    /* Hex / char encoding */
    /\b0x[0-9a-fA-F]{4,}.*\b(SELECT|UNION|OR|AND)\b/i,
    /\bCHAR\s*\(/i,
    /\bCONCAT\s*\(/i,
    /\bCHR\s*\(/i,
    /\bCONVERT\s*\(/i,
    /* Error-based / version */
    /\bVERSION\s*\(/i,
    /\b@@VERSION\b/i,
    /\b@@DATABASE\b/i,
    /\bUSER\s*\(/i,
    /\bDATABASE\s*\(/i,
    /\bCURRENT_USER\b/i,
    /\bSYSTEM_USER\b/i,
    /\bSESSION_USER\b/i,
    /* MSSQL specific */
    /\bEXEC\s*\(/i,
    /\bEXECUTE\s*\(/i,
    /\bXP_CMDSHELL\b/i,
    /\bSP_OA\w+\b/i,
    /\bOPENROWSET\b/i,
    /\bOPENQUERY\b/i,
    /\bBULK\s+INSERT\b/i,
    /* MySQL specific */
    /\bINTO\s+OUTFILE\b/i,
    /\bINTO\s+DUMPFILE\b/i,
    /\bLOAD_FILE\b/i,
    /\bGROUP_CONCAT\s*\(/i,
    /\bFLOOR\s*\(\s*RAND\s*\(/i,
    /* PostgreSQL specific */
    /\bPG_READ_FILE\b/i,
    /\bCOPY\s+.*\s+FROM\s+PROGRAM\b/i,
    /\bPG_LS_DIR\b/i,
    /* Oracle specific */
    /\bUTL_FILE\b/i,
    /\bUTL_HTTP\b/i,
    /\bDBMS_XMLGEN\b/i,
    /* Generic dangerous */
    /\bSELECT\s+\*\s+FROM\b/i,
    /\bSELECT\s+.*\s+FROM\s+\w+\s*--/i,
    /\bINSERT\s+INTO\s+.*\s+VALUES\s*\(/i,
    /\bUPDATE\s+\w+\s+SET\s+/i,
    /\bGRANT\s+/i,
    /\bREVOKE\s+/i,
    /\bCREATE\s+TABLE\b/i,
    /\bCREATE\s+DATABASE\b/i,
    /\bCREATE\s+USER\b/i,
    /\bSHUTDOWN\b/i,
    /\bSHOW\s+TABLES\b/i,
    /\bSHOW\s+DATABASES\b/i,
    /\bORDER\s+BY\s+\d+/i,
    /\bHAVING\s+1\s*=\s*1\b/i,
    /\bWHERE\s+1\s*=\s*1\b/i,
    /* Subquery injection */
    /\bSELECT\s*\(.*SELECT\b/i,
    /'\s*\)\s*OR\s+/i,
    /"\s*\)\s*OR\s+/i,
    /* Null byte / encoding bypass */
    /%00.*(SELECT|UNION|DROP)/i,
    /\\x00.*(SELECT|UNION)/i,
    /* Additional common payloads */
    /admin'\s*--/i,
    /admin"\s*--/i,
    /1'\s+OR\s+'1'\s*=\s*'1/i,
    /1\s+OR\s+1\s*=\s*1/i,
    /')\s*OR\s+('1'\s*=\s*'1/i,
    /")\s*OR\s+("1"\s*=\s*"1/i,
    /\bOR\s+EXISTS\s*\(/i,
    /\bAND\s+EXISTS\s*\(/i,
    /\bOR\s+LIKE\s+'%/i,
    /\bAND\s+LIKE\s+'%/i,
    /* JSON/API injection vectors */
    /['"]['"]\s*:\s*['"].*(SELECT|UNION|DROP)/i,
    /\$\{.*(SELECT|UNION|DROP|OR\s+1)/i
  ];

  function containsSqlInjection(text) {
    if (!text || typeof text !== 'string') return false;
    var trimmed = text.trim();
    if (trimmed.length < 2) return false;

    for (var i = 0; i < SQL_PATTERNS.length; i++) {
      if (SQL_PATTERNS[i].test(trimmed)) return true;
    }

    /* Heuristic: suspicious quote + SQL keyword combo */
    var quoteCount = (trimmed.match(/'/g) || []).length;
    var dblQuoteCount = (trimmed.match(/"/g) || []).length;
    var suspiciousKeywords = /\b(OR|AND|UNION|SELECT|DROP|DELETE|INSERT|UPDATE|EXEC|--|;)\b/i;
    if ((quoteCount >= 2 || dblQuoteCount >= 2) && suspiciousKeywords.test(trimmed)) return true;

    /* Semicolon followed by space (stacked query attempt) */
    if (/;\s*\w/.test(trimmed) && /\b(SELECT|DROP|INSERT|UPDATE|DELETE|ALTER|CREATE)\b/i.test(trimmed)) return true;

    return false;
  }

  function getConfig() {
    var el = document.currentScript;
    if (el && el.getAttribute) {
      return {
        message: el.getAttribute('data-blocked-message') || BLOCKED_MESSAGE
      };
    }
    return { message: BLOCKED_MESSAGE };
  }

  var config = getConfig();

  function showToast(message) {
    var existing = document.getElementById('sentinelgate-toast');
    if (existing) existing.remove();

    var toast = document.createElement('div');
    toast.id = 'sentinelgate-toast';
    toast.setAttribute('role', 'alert');
    toast.textContent = message;
    toast.style.cssText = [
      'position:fixed',
      'bottom:24px',
      'left:50%',
      'transform:translateX(-50%)',
      'background:linear-gradient(135deg,#ef476f 0%,#c1121f 100%)',
      'color:white',
      'padding:14px 28px',
      'border-radius:8px',
      'font-family:system-ui,-apple-system,sans-serif',
      'font-size:14px',
      'font-weight:500',
      'box-shadow:0 4px 16px rgba(0,0,0,0.25)',
      'z-index:2147483647',
      'max-width:90vw',
      'text-align:center'
    ].join(';');

    var style = document.createElement('style');
    style.id = 'sentinelgate-styles';
    style.textContent = '@keyframes sentinelgate-fadein{from{opacity:0;transform:translateX(-50%) translateY(10px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}#sentinelgate-toast{animation:sentinelgate-fadein .3s ease}';
    if (!document.getElementById('sentinelgate-styles')) {
      document.head.appendChild(style);
    }
    document.body.appendChild(toast);

    setTimeout(function () {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s';
      setTimeout(function () { toast.remove(); }, 300);
    }, TOAST_DURATION);
  }

  function protectInput(input) {
    if (!input) return { blocked: false };
    var val = input.contentEditable === 'true' ? (input.textContent || input.innerText || '') : (input.value || '');
    if (!val) return { blocked: false };
    if (containsSqlInjection(val)) {
      showToast(config.message);
      if (input.contentEditable !== 'true') {
        input.value = '';
      } else {
        input.textContent = '';
        input.innerText = '';
      }
      if (input.focus) input.focus();
      return { blocked: true };
    }
    return { blocked: false };
  }

  function setupInputProtection(el) {
    if (el.dataset && el.dataset.sentinelgateProtected) return;
    if (el.setAttribute) el.setAttribute('data-sentinelgate-protected', 'true');

    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        var r = protectInput(el);
        if (r.blocked) e.preventDefault();
      }
    }, false);

    el.addEventListener('paste', function () {
      setTimeout(function () {
        protectInput(el);
      }, 0);
    }, false);
  }

  function setupFormProtection(form) {
    if (form.dataset && form.dataset.sentinelgateProtected) return;
    if (form.setAttribute) form.setAttribute('data-sentinelgate-protected', 'true');

    form.addEventListener('submit', function (e) {
      var inputs = form.querySelectorAll('input[type="text"], input[type="search"], input:not([type]), input[type="email"], textarea, [contenteditable="true"]');
      for (var i = 0; i < inputs.length; i++) {
        var inp = inputs[i];
        var val = inp.contentEditable === 'true' ? (inp.textContent || inp.innerText || '') : (inp.value || '');
        if (val && containsSqlInjection(val)) {
          e.preventDefault();
          e.stopPropagation();
          showToast(config.message);
          if (inp.focus) inp.focus();
          return false;
        }
      }
    }, true);
  }

  function protectChatboxSubmit(container) {
    if (!container) return;
    var sendButtons = container.querySelectorAll('button[type="submit"], button[aria-label*="send" i], button[aria-label*="Send" i], [data-testid*="send" i], .send-btn, [class*="send" i]');
    var inputs = container.querySelectorAll('input[type="text"], textarea, [contenteditable="true"], [role="textbox"]');

    for (var i = 0; i < inputs.length; i++) setupInputProtection(inputs[i]);

    for (var j = 0; j < sendButtons.length; j++) {
      var btn = sendButtons[j];
      if (btn.dataset && btn.dataset.sentinelgateProtected) continue;
      if (btn.setAttribute) btn.setAttribute('data-sentinelgate-protected', 'true');
      btn.addEventListener('click', function (ev) {
        for (var k = 0; k < inputs.length; k++) {
          var v = inputs[k].contentEditable === 'true' ? (inputs[k].textContent || inputs[k].innerText || '') : (inputs[k].value || '');
          if (v && containsSqlInjection(v)) {
            ev.preventDefault();
            ev.stopImmediatePropagation();
            showToast(config.message);
            return false;
          }
        }
      }, true);
    }
  }

  function scanAndProtect() {
    var forms = document.querySelectorAll('form');
    for (var f = 0; f < forms.length; f++) setupFormProtection(forms[f]);

    var chatSelectors = [
      '[class*="chat"] input', '[class*="chat"] textarea', '[class*="chat"] [contenteditable="true"]',
      '[id*="chat"] input', '[id*="chat"] textarea',
      '[data-testid*="chat"] input', '[role="form"] input', '[role="form"] textarea',
      '.chat-input', '.message-input',
      '[placeholder*="message" i]', '[placeholder*="type" i]', '[placeholder*="ask" i]', '[placeholder*="search" i]'
    ];

    for (var s = 0; s < chatSelectors.length; s++) {
      try {
        var nodes = document.querySelectorAll(chatSelectors[s]);
        for (var n = 0; n < nodes.length; n++) {
          var el = nodes[n];
          setupInputProtection(el);
          var container = el.closest ? el.closest('[class*="chat"], [id*="chat"], [class*="message"], form') : null;
          if (container) protectChatboxSubmit(container);
        }
      } catch (_) {}
    }
  }

  /* Intercept fetch for API/JSON bodies */
  var origFetch = window.fetch;
  if (typeof origFetch === 'function') {
    window.fetch = function (url, opts) {
      if (opts && opts.body) {
        var bodyStr = typeof opts.body === 'string' ? opts.body : '';
        try {
          if (bodyStr) {
            var parsed = JSON.parse(bodyStr);
            var check = function (o) {
              if (!o || typeof o !== 'object') return;
              for (var k in o) {
                if (o.hasOwnProperty && !o.hasOwnProperty(k)) continue;
                var v = o[k];
                if (typeof v === 'string' && containsSqlInjection(v)) return true;
                if (typeof v === 'object' && check(v)) return true;
              }
              return false;
            };
            if (check(parsed)) {
              showToast(config.message);
              return Promise.reject(new Error('SentinelGate: Request blocked'));
            }
          }
        } catch (_) {
          if (containsSqlInjection(bodyStr)) {
            showToast(config.message);
            return Promise.reject(new Error('SentinelGate: Request blocked'));
          }
        }
      }
      return origFetch.apply(this, arguments);
    };
  }

  var origSend = XMLHttpRequest.prototype.send;
  if (origSend) {
    XMLHttpRequest.prototype.send = function (body) {
      if (body && typeof body === 'string') {
        if (containsSqlInjection(body)) {
          showToast(config.message);
          return;
        }
        try {
          var j = JSON.parse(body);
          var recurse = function (o) {
            if (!o) return false;
            if (typeof o === 'string') return containsSqlInjection(o);
            if (typeof o === 'object') {
              for (var p in o) if (recurse(o[p])) return true;
            }
            return false;
          };
          if (recurse(j)) {
            showToast(config.message);
            return;
          }
        } catch (_) {}
      }
      origSend.apply(this, arguments);
    };
  }

  var observer = typeof MutationObserver !== 'undefined' ? new MutationObserver(scanAndProtect) : null;
  if (observer) {
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scanAndProtect);
  } else {
    scanAndProtect();
  }

  window.SentinelGate = {
    version: VERSION,
    check: containsSqlInjection,
    scan: scanAndProtect
  };
})();
