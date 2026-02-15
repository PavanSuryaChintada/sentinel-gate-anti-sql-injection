"""
Vercel serverless function - Flask app entry point.
Must be in api/ folder for Vercel to execute it (not serve as static file).
"""
from sentinelgate_lab.app import app
