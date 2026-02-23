"""
Standalone demo server - test SentinelGate anti-SQL injection script.
Run from demo-test folder: python server.py
Then open http://localhost:5050
"""
import os
import re
import sqlite3
from flask import Flask, jsonify, request, send_from_directory

THIS_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(THIS_DIR, 'demo.db')
SCRIPT_PATH = os.path.join(THIS_DIR, '..', 'sentinelgate_lab', 'static', 'sentinel-gate.js')

app = Flask(__name__, static_folder=THIS_DIR)

def get_db():
    return sqlite3.connect(DB_PATH)

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    with get_db() as c:
        c.execute('''CREATE TABLE IF NOT EXISTS secrets (
            id INTEGER PRIMARY KEY, name TEXT NOT NULL, data TEXT NOT NULL
        )''')
        c.execute('DELETE FROM secrets')
        c.executemany('INSERT INTO secrets VALUES (?, ?, ?)', [
            (1, 'Admin', 'SUPER_SECRET_PASSWORD_123'),
            (2, 'CEO', 'executive_dashboard_key_9x7k2'),
            (3, 'CTO', 'github_token_ghp_abc123xyz'),
            (4, 'HR', 'employee_salaries_confidential'),
            (5, 'Developer', 'staging_db_password_dev123'),
        ])
        c.commit()

SQL_PATTERNS = [
    r"\bOR\s+1\s*=\s*1\b", r"\bOR\s+'1'\s*=\s*'1'", r"\bUNION\s+SELECT\b",
    r"'\s*OR\s+", r"'\s*;\s*--", r"\bDROP\s+TABLE\b", r"\bUNION\s+SELECT\s+\*",
]
def is_sql_injection(t):
    t = t.lower().strip()
    for p in SQL_PATTERNS:
        if re.search(p, t, re.I): return True
    if ("'" in t or '"' in t) and any(k in t for k in ['or', 'and', 'select', 'union']):
        return True
    return False

def extract_user(t):
    for u in ['Admin', 'CEO', 'CTO', 'HR', 'Developer']:
        if u.lower() in t.lower(): return u
    return t.strip()

@app.route('/')
def index():
    return send_from_directory(THIS_DIR, 'index.html', mimetype='text/html')

@app.route('/no-script.html')
def no_script():
    return send_from_directory(THIS_DIR, 'no-script.html', mimetype='text/html')

@app.route('/sentinel-gate.js')
def script():
    if os.path.exists(SCRIPT_PATH):
        return send_from_directory(os.path.dirname(SCRIPT_PATH), 'sentinel-gate.js', mimetype='application/javascript')
    return jsonify({"error": "Script not found"}), 404

@app.route('/chat/unsecured', methods=['POST'])
def chat():
    if not request.is_json:
        return jsonify({"status": "error", "message": "JSON required"}), 400
    msg = request.json.get('message', '').strip()
    if not msg:
        return jsonify({"status": "error", "message": "Empty message"}), 400

    is_lookup = any(k in msg.lower() for k in ['get', 'find', 'show', 'data', 'password']) or \
        any(n in msg for n in ['Admin', 'CEO', 'CTO', 'HR', 'Developer']) or is_sql_injection(msg)

    if is_lookup:
        qin = msg if is_sql_injection(msg) else extract_user(msg)
        try:
            with get_db_connection() as conn:
                cursor = conn.cursor()
                q = f"SELECT * FROM secrets WHERE name = '{qin}'"
                cursor.execute(q)
                rows = [dict(r) for r in cursor.fetchall()]
                if rows:
                    resp = "Here is the data:\n" + "\n".join(f"- {r['name']}: {r['data']}" for r in rows)
                    if is_sql_injection(msg):
                        resp += f"\n\n[Query: {q}]"
                    return jsonify({"status": "success", "response": resp, "is_injection": True})
                return jsonify({"status": "success", "response": f"No record for '{qin}'."})
        except Exception as e:
            return jsonify({"status": "error", "response": str(e)}), 400

    return jsonify({"status": "success", "response": "Hello! Try 'get Admin' or an SQL injection."})

if __name__ == '__main__':
    init_db()
    print('')
    print('  SentinelGate Demo — http://localhost:5050')
    print('  /            = With script (injections BLOCKED)')
    print('  /no-script   = Without script (injections reach DB)')
    print('')
    app.run(host='0.0.0.0', port=5050, debug=False)
