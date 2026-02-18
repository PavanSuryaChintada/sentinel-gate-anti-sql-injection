# SentinelGate - SQL Injection Shield (Chrome Extension)

A Chrome extension that protects chatboxes and text inputs across websites from SQL injection attacks. Defense-in-depth for AI chatbots, Newtrea sites, and web forms.

## What It Does

- **Monitors** text inputs, textareas, and contenteditable elements (chatboxes)
- **Detects** common SQL injection patterns (OR/AND, UNION SELECT, DROP, comments, etc.)
- **Blocks** submission when malicious input is detected and shows a toast notification
- **Works** on all websites including Newtrea, AI chatbot interfaces, and standard forms

## Installation

### Option 1: Load Unpacked (Development)

1. Run `python create_icons.py` to generate icons (if not already present)
2. Open Chrome → `chrome://extensions`
3. Enable **Developer mode** (top right)
4. Click **Load unpacked**
5. Select the `chrome-extension` folder

### Option 2: Chrome Web Store (Production)

1. Create a [Chrome Web Store Developer](https://chrome.google.com/webstore/devconsole) account ($5 one-time fee)
2. Zip the extension folder (excluding `create_icons.py`, `README.md`, `.git`)
3. Upload to Chrome Web Store
4. After approval, use the store URL for the "Add to Chrome" button on your website

## Add to Chrome Button (Website Integration)

On your SentinelGate website, the "Add to Chrome" button is in the hero section. **Update the link** after publishing:

1. Publish the extension to Chrome Web Store
2. Copy your extension's store URL: `https://chrome.google.com/webstore/detail/extension-name/EXTENSION_ID`
3. In `sentinelgate_lab/templates/index.html`, find the element with `id="addToChromeBtn"` and set its `href` to your store URL

Until published, the button links to the general Chrome Web Store. Users can also load the extension unpacked for development (see Installation above).

## Files

- `manifest.json` - Extension manifest (Manifest V3)
- `content.js` - Content script that protects inputs on all pages
- `popup.html` / `popup.js` - Extension popup with enable/disable toggle
- `icons/` - Extension icons (16, 48, 128px)

## Limitations

- **Client-side only**: SQL injection is fundamentally a server-side issue. This extension provides defense-in-depth by blocking known patterns before they reach the server. Servers should always use parameterized queries.
- **Pattern-based**: May have false positives on legitimate input containing SQL-like text. Users can disable the extension per-site or globally via the popup.
