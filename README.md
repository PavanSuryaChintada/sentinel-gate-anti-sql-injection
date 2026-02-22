# SentinelGate — SQL Injection Shield

Production-ready SQL injection protection for websites and chatbots. Add one script tag to your site and protect all forms, inputs, and chatboxes from SQL injection attacks.

---

## Protect Your Website in 10 Seconds

Copy this script tag and paste it in your website's `<head>` or before `</body>`:

```html
<script src="https://your-domain.com/sentinel-gate.js"></script>
```

Replace `https://your-domain.com` with your deployed SentinelGate URL (or use our demo URL after deployment). That's it. No extensions, no configuration—your forms and inputs are now protected.

---

## Features

- **100+ SQL injection patterns** — OR/AND boolean, UNION-based, comment-based, time-based, error-based, database-specific (MySQL, MSSQL, PostgreSQL, Oracle)
- **Client-side protection** — Blocks malicious input before it reaches your server
- **Works everywhere** — Forms, search boxes, chatboxes, text areas, contenteditable
- **Fetch & XHR interception** — Protects API requests with JSON bodies
- **Production hardened** — Zero dependencies, minimal footprint, configurable blocked message

---

## Running the App

```bash
pip install -r requirements.txt
python app.py
```

Then open http://localhost:5001

---

## Project Structure

- `app.py` / `index.py` — Vercel entry points
- `sentinelgate_lab/` — Main Flask app, templates, and the embeddable script
- `sentinelgate_lab/static/sentinel-gate.js` — The production script (100+ patterns)
- `db_shell.py` — Interactive SQLite shell for the database
- `requirements.txt` — Python dependencies

---

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for Vercel, Render, and Railway instructions.

After deploying, share your URL with clients. They add one line to their codebase:

```html
<script src="https://your-sentinelgate-app.vercel.app/sentinel-gate.js"></script>
```

---

## Database & SQL Queries

For database schema, SQL commands, and how to run queries from the terminal, see **[DBQUERIES_README.md](DBQUERIES_README.md)**.
