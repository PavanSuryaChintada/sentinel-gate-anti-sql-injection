"""
Vercel Flask entry point. Must be app.py at project root for Vercel detection.
"""
from sentinelgate_lab.app import app

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=False)
