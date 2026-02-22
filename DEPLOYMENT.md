# SentinelGate Deployment Guide

This guide covers deploying the SentinelGate SQL Injection Shield to production. After deployment, clients can protect their websites by adding one script tag:

```html
<script src="https://your-app-url/sentinel-gate.js"></script>
```

---

## Option 1: Vercel

Your project is set up for Vercel. The app uses `/tmp` for SQLite when deployed (ephemeral storage, resets on cold starts—fine for this demo).

**If Python files download instead of running:** Go to Vercel Dashboard → Project → **Settings** → **General** → **Framework Preset** → set to **Flask** (or **Other**), then redeploy.

### Prerequisites

- [Vercel CLI](https://vercel.com/docs/cli) (optional, for CLI deployment)
- GitHub/GitLab/Bitbucket account (for Git-based deployment)

### Deploy via Vercel Dashboard (Easiest)

1. **Push your code** to GitHub (if not already):
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Go to [vercel.com/new](https://vercel.com/new)** and sign in.

3. **Import your repository**:
   - Click "Import" next to your `sentinelGate` repo
   - **CRITICAL**: Set **Framework Preset** to **Flask** before deploying (prevents file downloads)

4. **Configure**:
   - **Root Directory**: `.` (project root)
   - **Framework Preset**: **Flask**
   - **Build Command**: `pip install -r requirements.txt`
   - **Environment Variables**: Add `SECRET_KEY` (generate with `python -c "import secrets; print(secrets.token_hex(32))"`)

5. **Deploy** — Click "Deploy". Your app will be live in ~1–2 minutes.

### Deploy via Vercel CLI

```bash
# Install Vercel CLI (if needed)
npm i -g vercel

# From project root
cd "c:\Users\chpsu\Documents\git repos\sentinelGate"
vercel

# Follow prompts: link to existing project or create new one
# For production: vercel --prod
```

### Local Testing Before Deploy

```bash
# Install dependencies
pip install -r requirements.txt

# Test with Vercel's local dev server
vercel dev
```

---

## Option 2: Render (Recommended if Vercel has issues)

Render works reliably with Flask. A `render.yaml` is included for one-click deploy.

1. Go to [dashboard.render.com](https://dashboard.render.com) → **New** → **Web Service**
2. Connect your GitHub repo
3. Render auto-detects `render.yaml`. Or manually set:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn -w 1 -b 0.0.0.0:$PORT app:app`
4. Deploy. Your app will be live at `https://your-app.onrender.com`

---

## Option 3: Railway

1. Go to [railway.app](https://railway.app) and create a new project
2. Connect your GitHub repo
3. Railway auto-detects Python; add `gunicorn` to `requirements.txt`
4. Set start command: `gunicorn -w 1 -b 0.0.0.0:$PORT index:app`

---

## Environment Variables

| Variable     | Required | Description                          |
|-------------|----------|--------------------------------------|
| `SECRET_KEY`| Yes (prod) | Flask session secret. Generate with `python -c "import secrets; print(secrets.token_hex(32))"` |

---

## Important Notes

- **Vercel**: SQLite in `/tmp` is ephemeral—data resets on cold starts. The `/reset` endpoint re-initializes the demo data. This is acceptable for a security demo.
- **SECRET_KEY**: Always set a strong `SECRET_KEY` in production (Vercel Dashboard → Project → Settings → Environment Variables).
- **Free tier limits**: Vercel has ~30s request timeout and 250MB app size; this app fits well within those limits.
