# CipherShield — SQL Injection Shield

Production-ready SQL injection protection for websites and chatbots. Add one script tag to your site and protect all forms, inputs, and chatboxes from SQL injection attacks.

---

## Protect Your Website in 10 Seconds

Copy this script tag and paste it in your website's `<head>` or before `</body>`:

```html
<script src="https://your-domain.com/cipher-shield.js"></script>
```

Replace `https://your-domain.com` with your deployed CipherShield URL (or use our demo URL after deployment). That's it. No extensions, no configuration—your forms and inputs are now protected.

---

## Features

- **100+ SQL injection patterns** — OR/AND boolean, UNION-based, comment-based, time-based, error-based, database-specific (MySQL, MSSQL, PostgreSQL, Oracle)
- **Client-side protection** — Blocks malicious input before it reaches your server
- **Works everywhere** — Forms, search boxes, chatboxes, text areas, contenteditable
- **Fetch & XHR interception** — Protects API requests with JSON bodies
- **Production hardened** — Zero dependencies, minimal footprint, configurable blocked message

---

## Running the App

### Option 1: React frontend (recommended)

```bash
# Backend
pip install -r requirements.txt
python app.py

# In another terminal: Frontend dev server (with API proxy)
cd frontend && npm install && npm run dev
```

Open http://localhost:5173 (React) — API requests are proxied to Flask at :5001.

**Production build** (serve React from Flask):

```bash
cd frontend && npm install && npm run build
python app.py
```

Then open http://localhost:5001 — Flask serves the built React app.

### Option 2: Legacy HTML template

Remove or rename `frontend/dist` so Flask falls back to the original `index.html` template.

**Windows:** If `npm install` in `frontend` fails with EPERM or esbuild EFTYPE errors, see [frontend/TROUBLESHOOTING.md](frontend/TROUBLESHOOTING.md) (clean reinstall, antivirus exclusion, or run without React).

---

## Project Structure

- `app.py` / `index.py` — Vercel entry points
- `sentinelgate_lab/` — Main Flask app, templates, API
- `frontend/` — React app (Vite + React)
  - `src/components/` — Reusable UI components (Navbar, QueryPanel, ChatbotModal, etc.)
  - Add new components here for easy extension
- `sentinelgate_lab/static/cipher-shield.js` — The production script (100+ patterns)
- `db_shell.py` — Interactive SQLite shell for the database
- `requirements.txt` — Python dependencies

---

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for Vercel, Render, and Railway instructions.

After deploying, share your URL with clients. They add one line to their codebase:

```html
<script src="https://your-ciphershield-app.vercel.app/cipher-shield.js"></script>
```

For the landing page script tag to show the deployed URL instead of localhost, set `VITE_SCRIPT_BASE=https://your-app-url` before running `npm run build` in the frontend.

---

## Database & SQL Queries

For database schema, SQL commands, and how to run queries from the terminal, see **[DBQUERIES_README.md](DBQUERIES_README.md)**.

---

## Machine Learning Classifier (Prototype)

The project includes an experimental ML classifier that flags potentially malicious queries. To train or retrain it locally:

```bash
cd ml
python train.py --data data/raw/dataset.csv --model models/classifier.pkl
```

When the dataset is imbalanced (e.g., almost all queries are malicious), the training script automatically adds a small number of synthetic safe examples so the model can still train. On the current development dataset, the latest run produced:

- **Accuracy**: 0.9636 on a held‑out test set
- **Malicious class**: precision ≈ 0.96, recall ≈ 1.00, F1 ≈ 0.98
- **Safe class**: very few samples in the test split, so metrics are unstable (0 predicted safe in this small run)

The trained model is saved to `ml/models/classifier.pkl` and loaded by the backend for ML‑assisted detection.
