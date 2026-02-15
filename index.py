"""
Vercel entry point - imports the Flask app from sentinelgate_lab.
Vercel looks for app.py, index.py, or server.py at the project root.
"""
from sentinelgate_lab.app import app
