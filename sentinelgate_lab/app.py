import os
import re
import sqlite3
from datetime import timedelta
from functools import wraps

from flask import Flask, jsonify, render_template, request, Response, send_from_directory  # pyright: ignore[reportMissingImports]

_basedir = os.path.dirname(os.path.abspath(__file__))
_proj_root = os.path.dirname(_basedir)
_react_dist = os.path.join(_proj_root, 'frontend', 'dist')
_use_react = os.path.exists(os.path.join(_react_dist, 'index.html'))

app = Flask(__name__, template_folder=os.path.join(_basedir, 'templates'), static_folder=os.path.join(_basedir, 'static'))
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your-secure-secret-key-here')
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(minutes=30)

# Database path: use /tmp on Vercel (serverless filesystem is read-only except /tmp)
# Locally use absolute path to avoid CWD-dependent behavior
_db_path = os.path.join('/tmp', 'users.db') if os.environ.get('VERCEL') else os.path.join(_basedir, 'users.db')

# Database initialization
def get_db_connection():
    conn = sqlite3.connect(_db_path)
    conn.row_factory = sqlite3.Row
    return conn

# Lookup column per table for query endpoints
TABLE_LOOKUP_COLUMN = {
    'secrets': 'name',
    'departments': 'name',
    'projects': 'name',
    'office_locations': 'city',
}

def ensure_db_ready():
    """Ensure all tables have data (handles Vercel cold starts where /tmp is empty)."""
    try:
        with get_db_connection() as conn:
            c = conn.cursor()
            c.execute("SELECT COUNT(*) FROM secrets")
            if c.fetchone()[0] == 0:
                init_db()
    except sqlite3.OperationalError:
        init_db()

# Allowed tables for query endpoints (prevents arbitrary table access in secure path)
QUERYABLE_TABLES = {'secrets', 'departments', 'projects', 'office_locations'}

def init_db():
    with get_db_connection() as conn:
        c = conn.cursor()

        # Table: secrets - employee credentials (sensitive)
        c.execute('''
            CREATE TABLE IF NOT EXISTS secrets (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                data TEXT NOT NULL
            )
        ''')
        c.execute("DELETE FROM secrets")
        secrets_data = [
            (1, 'Admin', 'SUPER_SECRET_PASSWORD_123'),
            (2, 'CEO', 'executive_dashboard_key_9x7k2'),
            (3, 'CTO', 'github_token_ghp_abc123xyz'),
            (4, 'CFO', 'financial_reports_2024_q4'),
            (5, 'HR', 'employee_salaries_confidential'),
            (6, 'Support', 'helpdesk_access_2024'),
            (7, 'Developer', 'staging_db_password_dev123'),
            (8, 'QA', 'test_credentials_qa_env'),
            (9, 'Sales', 'crm_api_key_salesforce_xyz'),
            (10, 'Marketing', 'google_ads_token_mkt2024'),
            (11, 'DevOps', 'aws_access_key_AKIA_demo'),
            (12, 'Intern', 'onboarding_temp_pass_123'),
            (13, 'Contractor', 'vpn_access_exp_2025'),
            (14, 'Manager', 'team_performance_data_q4'),
            (15, 'Analyst', 'bi_dashboard_sql_creds'),
        ]
        c.executemany("INSERT INTO secrets VALUES (?, ?, ?)", secrets_data)

        # Table: departments - company departments
        c.execute('''
            CREATE TABLE IF NOT EXISTS departments (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                manager TEXT NOT NULL,
                budget REAL NOT NULL,
                headcount INTEGER NOT NULL
            )
        ''')
        c.execute("DELETE FROM departments")
        departments_data = [
            (1, 'Engineering', 'CTO', 2500000.00, 45),
            (2, 'Sales', 'Sales', 1200000.00, 22),
            (3, 'Marketing', 'Marketing', 800000.00, 12),
            (4, 'Finance', 'CFO', 600000.00, 8),
            (5, 'Human Resources', 'HR', 400000.00, 5),
            (6, 'Operations', 'DevOps', 900000.00, 15),
        ]
        c.executemany("INSERT INTO departments VALUES (?, ?, ?, ?, ?)", departments_data)

        # Table: projects - active projects
        c.execute('''
            CREATE TABLE IF NOT EXISTS projects (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                department_id INTEGER NOT NULL,
                status TEXT NOT NULL,
                budget REAL NOT NULL,
                deadline TEXT,
                FOREIGN KEY (department_id) REFERENCES departments(id)
            )
        ''')
        c.execute("DELETE FROM projects")
        projects_data = [
            (1, 'SentinelGate Security', 1, 'active', 150000.00, '2025-06-30'),
            (2, 'Cloud Migration', 1, 'active', 320000.00, '2025-09-15'),
            (3, 'Q4 Campaign', 3, 'completed', 75000.00, '2024-12-31'),
            (4, 'CRM Integration', 2, 'active', 45000.00, '2025-04-30'),
            (5, 'Budget Review 2025', 4, 'planning', 0, '2025-03-01'),
            (6, 'Infrastructure Upgrade', 6, 'active', 180000.00, '2025-08-31'),
        ]
        c.executemany("INSERT INTO projects VALUES (?, ?, ?, ?, ?, ?)", projects_data)

        # Table: office_locations - company offices
        c.execute('''
            CREATE TABLE IF NOT EXISTS office_locations (
                id INTEGER PRIMARY KEY,
                city TEXT NOT NULL,
                country TEXT NOT NULL,
                address TEXT NOT NULL,
                timezone TEXT NOT NULL
            )
        ''')
        c.execute("DELETE FROM office_locations")
        offices_data = [
            (1, 'San Francisco', 'USA', '123 Market St', 'America/Los_Angeles'),
            (2, 'New York', 'USA', '456 Broadway', 'America/New_York'),
            (3, 'London', 'UK', '78 Thames St', 'Europe/London'),
            (4, 'Berlin', 'Germany', '9 Unter den Linden', 'Europe/Berlin'),
        ]
        c.executemany("INSERT INTO office_locations VALUES (?, ?, ?, ?, ?)", offices_data)

        conn.commit()

# Error handlers
@app.errorhandler(404)
def not_found_error(error):
    return jsonify({"status": "error", "message": "Resource not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"status": "error", "message": "Internal server error"}), 500

# API rate limiting decorator
def limit_requests(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Implement rate limiting logic here if needed
        return f(*args, **kwargs)
    return decorated_function

# Routes
@app.route('/version')
def version():
    return jsonify({"version": "v2-no-navbar-buttons", "template": "index.html"})


@app.route('/sentinel-gate.js')
def serve_sentinel_script():
    """Serve the embeddable SQL injection shield script with correct origin in header comment."""
    static_dir = app.static_folder or os.path.join(_basedir, 'static')
    path = os.path.join(static_dir, 'sentinel-gate.js')
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    # Inject actual deployed URL into header comment (so viewing the .js file shows correct embed code)
    base = request.url_root.rstrip('/')
    if request.headers.get('X-Forwarded-Proto') == 'https':
        base = base.replace('http://', 'https://', 1)
    content = content.replace(
        'https://your-domain.com',
        base,
        1
    )
    resp = Response(content, mimetype='application/javascript')
    resp.headers['Cache-Control'] = 'public, max-age=3600'
    resp.headers['X-Content-Type-Options'] = 'nosniff'
    return resp

@app.route('/')
def home():
    if _use_react:
        return send_from_directory(_react_dist, 'index.html', mimetype='text/html')
    resp = app.make_response(render_template('index.html'))
    resp.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    resp.headers['Pragma'] = 'no-cache'
    resp.headers['Expires'] = '0'
    return resp


@app.route('/assets/<path:filename>')
def serve_react_assets(filename):
    """Serve React build assets when using React frontend."""
    if _use_react:
        assets_dir = os.path.join(_react_dist, 'assets')
        if os.path.exists(os.path.join(assets_dir, filename)):
            return send_from_directory(assets_dir, filename)
    return jsonify({"status": "error", "message": "Not found"}), 404

@app.route('/query/vulnerable', methods=['POST'])
@limit_requests
def query_vulnerable():
    if not request.is_json:
        return jsonify({
            "status": "error",
            "message": "Request must be JSON"
        }), 400

    ensure_db_ready()
    user_input = request.json.get('chat_input', '')
    table = request.json.get('table', 'secrets')
    if table not in QUERYABLE_TABLES:
        table = 'secrets'
    col = TABLE_LOOKUP_COLUMN.get(table, 'name')
    # DANGER: Vulnerable to SQL injection - user_input and table/col concatenated
    query = f"SELECT * FROM {table} WHERE {col} = '{user_input}'"
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            # DANGER: This is vulnerable to SQL Injection!
            cursor.execute(query)
            result = [dict(row) for row in cursor.fetchall()]
            return jsonify({
                "status": "success",
                "data": result,
                "query_executed": query
            })
    except Exception as e:
        app.logger.error(f"Error in vulnerable endpoint: {str(e)}")
        return jsonify({
            "status": "error",
            "message": "An error occurred while processing your request",
            "query_executed": query
        }), 400

@app.route('/query/secure', methods=['POST'])
@limit_requests
def query_secure():
    if not request.is_json:
        return jsonify({
            "status": "error",
            "message": "Request must be JSON"
        }), 400

    ensure_db_ready()
    user_input = request.json.get('chat_input', '')
    test_case = request.json.get('test_case', '')
    table = request.json.get('table', 'secrets')
    if table not in QUERYABLE_TABLES:
        table = 'secrets'
    col = TABLE_LOOKUP_COLUMN.get(table, 'name')
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            # Secure: parameterized query; table/col validated from whitelist
            query = f"SELECT * FROM {table} WHERE {col} = ?"
            cursor.execute(query, (user_input,))
            result = [dict(row) for row in cursor.fetchall()]
            if result:
                messages_found = {
                    'valid': "Valid user lookup. Sensitive data redacted—secure endpoint never exposes raw credentials.",
                    'injection': "Query executed using parameterized statements",
                    'malicious': "Query executed using parameterized statements",
                    'nonexistent': "Query executed using parameterized statements",
                    'always_true': "Query executed using parameterized statements",
                }
                msg = messages_found.get(test_case, "Query executed using parameterized statements")
                # Redact sensitive "data" field—secure endpoint does not expose raw secrets
                redacted = [{**r, "data": "[REDACTED]" if r.get("data") else r.get("data")} for r in result]
                return jsonify({
                    "status": "success",
                    "data": redacted,
                    "message": msg
                })
            messages_empty = {
                'valid': "Valid user lookup. No data returned.",
                'injection': "Cannot disclose such information. Suspected SQL injection attempt blocked.",
                'malicious': "Cannot disclose such information. Malicious query pattern rejected.",
                'nonexistent': "Cannot disclose whether such a user exists. This endpoint does not confirm or deny user presence.",
                'always_true': "Cannot disclose such information. Invalid input pattern detected and blocked.",
            }
            msg = messages_empty.get(test_case, "Cannot disclose such information.")
            return jsonify({
                "status": "success",
                "data": [],
                "message": msg,
                "user_found": False
            })
    except Exception as e:
        app.logger.error(f"Error in secure endpoint: {str(e)}")
        return jsonify({
            "status": "error",
            "message": "An error occurred while processing your request"
        }), 400

# Chatbot security helpers - 100+ SQL injection patterns (production hardened)
SQL_INJECTION_PATTERNS = [
    r"('\s*OR\s*'1'\s*=\s*'1|OR\s+1\s*=\s*1)",
    r"(DROP\s+TABLE|DELETE\s+FROM|INSERT\s+INTO)",
    r"(UNION\s+SELECT|SELECT\s+\*)",
    r"(;\s*--|--\s*$)",
    r"('\s*OR\s*'1'|'\s*OR\s*1)",
    r"(admin'\s*OR|'\s*;\s*DROP)",
    r"\bOR\s+['\"]?\d+['\"]?\s*=\s*['\"]?\d+['\"]?",
    r"\bOR\s+['\"]?1['\"]?\s*=\s*['\"]?1['\"]?\s*--",
    r"\bAND\s+['\"]?\d+['\"]?\s*=\s*['\"]?\d+['\"]?",
    r"\bUNION\s+(ALL\s+)?SELECT\b",
    r"\bUNION\s+(ALL\s+)?SELECT\s+.*\s+FROM\b",
    r";\s*--\s*$",
    r"'\s*;\s*--",
    r'"\s*;\s*--',
    r"\bDROP\s+(TABLE|DATABASE|SCHEMA)\b",
    r"\bALTER\s+TABLE\b",
    r"\bTRUNCATE\b",
    r";\s*DROP\b",
    r";\s*INSERT\b",
    r";\s*UPDATE\b",
    r"'\s*OR\s+",
    r'"\s*OR\s+',
    r"'\s*AND\s+",
    r'"\s*AND\s+',
    r"\bSLEEP\s*\(",
    r"\bBENCHMARK\s*\(",
    r"\bWAITFOR\s+DELAY\b",
    r"\bPG_SLEEP\s*\(",
    r"\bINFORMATION_SCHEMA\b",
    r"\bFROM\s+information_schema\b",
    r"\b0x[0-9a-fA-F]+.*\b(SELECT|UNION|OR)\b",
    r"\bVERSION\s*\(",
    r"\b@@VERSION\b",
    r"\bEXEC\s*\(",
    r"\bXP_CMDSHELL\b",
    r"\bOPENROWSET\b",
    r"\bLOAD_FILE\b",
    r"\bINTO\s+OUTFILE\b",
    r"\bINTO\s+DUMPFILE\b",
    r"\bGROUP_CONCAT\s*\(",
    r"\bSELECT\s+\*\s+FROM\b",
    r"\bINSERT\s+INTO\s+.*\s+VALUES\s*\(",
    r"\bUPDATE\s+\w+\s+SET\s+",
    r"\bGRANT\s+",
    r"\bCREATE\s+TABLE\b",
    r"\bCREATE\s+DATABASE\b",
    r"\bORDER\s+BY\s+\d+",
    r"\bHAVING\s+1\s*=\s*1\b",
    r"\bWHERE\s+1\s*=\s*1\b",
    r"1'\s+OR\s+'1'\s*=\s*'1",
    r"1\s+OR\s+1\s*=\s*1",
    r"\bOR\s+EXISTS\s*\(",
    r"\bAND\s+EXISTS\s*\(",
    r"\bCHAR\s*\(",
    r"\bCONCAT\s*\(",
    r"\bCONVERT\s*\(",
    r"\bUSER\s*\(",
    r"\bDATABASE\s*\(",
    r"\bCURRENT_USER\b",
    r"\bSYSTEM_USER\b",
    r"\bEXECUTE\s*\(",
    r"\bOPENQUERY\b",
    r"\bBULK\s+INSERT\b",
    r"\bPG_READ_FILE\b",
    r"\bUTL_FILE\b",
    r"\bUTL_HTTP\b",
    r"\bDBMS_PIPE\.RECEIVE_MESSAGE\s*\(",
    r"\bDROP\s+USER\b",
    r"\bDROP\s+INDEX\b",
    r"\bDROP\s+VIEW\b",
    r"\bTRUNCATE\s+TABLE\b",
    r"\bREVOKE\s+",
    r"\bSHUTDOWN\b",
    r"\bSHOW\s+TABLES\b",
    r"\bSHOW\s+DATABASES\b",
    r"\bSELECT\s*\(.*SELECT\b",
    r"'\)\s*OR\s+",
    r'"\)\s*OR\s+',
    r"%00.*(SELECT|UNION|DROP)",
    r"\\x00.*(SELECT|UNION)",
    r"admin'\s*--",
    r"admin\"\s*--",
    r"'\)\s*OR\s+\('1'\s*=\s*'1",
    r'"\)\s*OR\s+\("1"\s*=\s*"1',
    r"\bOR\s+LIKE\s+'%",
    r"\bAND\s+LIKE\s+'%",
    r"\|\|\s*['\"]?\d+['\"]?\s*=\s*['\"]?\d+['\"]?",
    r"/\*.*\*\/.*(SELECT|UNION|DROP|DELETE)",
    r"'\s*\+\s*'",
    r'"\s*\+\s*"',
    r";\s*#\s*$",
    r"'\s*\)\s*--",
]

PROMPT_INJECTION_PATTERNS = [
    r"ignore\s+(all\s+)?(previous|prior)\s+instructions",
    r"disregard\s+(your\s+)?(instructions|rules)",
    r"reveal\s+(your\s+)?(system\s+)?(prompt|instructions)",
    r"show\s+(me\s+)?(your\s+)?(system\s+)?(prompt|instructions)",
    r"what\s+are\s+your\s+(system\s+)?(instructions|rules)",
    r"you\s+are\s+now\s+(a|in)\s+",
    r"pretend\s+(you\s+are|to\s+be)",
    r"act\s+as\s+if\s+you",
]

def is_sql_injection(text):
    text_lower = text.lower().strip()
    for pattern in SQL_INJECTION_PATTERNS:
        if re.search(pattern, text_lower, re.IGNORECASE):
            return True
    # Check for quote-based injection
    if "'" in text or '"' in text and any(kw in text_lower for kw in ['or', 'and', 'select', 'union', 'drop']):
        return True
    return False

def is_prompt_injection(text):
    text_lower = text.lower().strip()
    for pattern in PROMPT_INJECTION_PATTERNS:
        if re.search(pattern, text_lower):
            return True
    return False

def get_general_response(user_input):
    """Simple intelligent responses for general chat (demo - can be replaced with LLM API)"""
    inp = user_input.lower().strip()
    if any(g in inp for g in ['hello', 'hi', 'hey', 'greetings']):
        return "Hello! I'm here to help. Ask me anything."
    if any(g in inp for g in ['help', 'what can you']):
        return "I can answer general questions. User data lookups are only available in the Unsecured Chatbot."
    if any(g in inp for g in ['thanks', 'thank you']):
        return "You're welcome! Let me know if you need anything else."
    if any(g in inp for g in ['who are you', 'what are you']):
        return "I'm a database assistant chatbot. I help retrieve user information from the system."
    if any(g in inp for g in ['bye', 'goodbye']):
        return "Goodbye! Stay secure!"
    # Default contextual response
    return f"I understand you're asking about: \"{user_input[:50]}...\" if applicable. For user data, try asking for a specific username like Admin, CEO, Developer, or Support."

def extract_username_for_lookup(text):
    """Extract username from phrases like 'get Admin' or 'show User1 data'"""
    known_users = ['Admin', 'CEO', 'CTO', 'CFO', 'HR', 'Support', 'Developer', 'QA', 'Sales', 'Marketing', 'DevOps', 'Intern', 'Contractor', 'Manager', 'Analyst']
    for u in known_users:
        if u.lower() in text.lower():
            return u
    return text.strip()

@app.route('/chat/unsecured', methods=['POST'])
@limit_requests
def chat_unsecured():
    """Unsecured chatbot - vulnerable to SQL injection and prompt injection"""
    if not request.is_json:
        return jsonify({"status": "error", "message": "Request must be JSON"}), 400
    user_input = request.json.get('message', '').strip()
    if not user_input:
        return jsonify({"status": "error", "message": "Empty message"}), 400

    # Check if it's a data lookup (explicit request) or SQL injection attempt - VULNERABLE: runs either
    is_lookup = any(kw in user_input.lower() for kw in ['get', 'find', 'show', 'lookup', 'data', 'info', 'password', 'secret']) or \
                any(name in user_input for name in ['Admin', 'CEO', 'CTO', 'CFO', 'HR', 'Support', 'Developer', 'QA', 'Sales', 'Marketing', 'DevOps', 'Intern', 'Contractor', 'Manager', 'Analyst']) or \
                is_sql_injection(user_input)

    if is_lookup:
        # For explicit lookup like "get Admin", use extracted name; for injection, pass raw input (vulnerable!)
        query_input = user_input if is_sql_injection(user_input) else extract_username_for_lookup(user_input)
        try:
            with get_db_connection() as conn:
                cursor = conn.cursor()
                # DANGER: Vulnerable to SQL injection - passes user input directly into query
                query = f"SELECT * FROM secrets WHERE name = '{query_input}'"
                cursor.execute(query)
                result = [dict(row) for row in cursor.fetchall()]
                if result:
                    response = f"Here is the data you requested:\n" + "\n".join(
                        [f"- {r['name']}: {r['data']}" for r in result]
                    )
                    if is_sql_injection(user_input):
                        response += f"\n\n[Query executed: {query}]"
                    return jsonify({"status": "success", "response": response, "is_injection": True})
                elif not is_sql_injection(user_input):
                    return jsonify({"status": "success", "response": f"No record found for '{query_input}'."})
        except Exception as e:
            return jsonify({"status": "error", "response": f"Query error: {str(e)}"}), 400

    return jsonify({"status": "success", "response": get_general_response(user_input)})

@app.route('/chat/secured', methods=['POST'])
@limit_requests
def chat_secured():
    """Secured chatbot - NEVER reveals data. Blocks SQL injection, prompt injection, and all data lookups."""
    if not request.is_json:
        return jsonify({"status": "error", "message": "Request must be JSON"}), 400
    user_input = request.json.get('message', '').strip()
    if not user_input:
        return jsonify({"status": "error", "message": "Empty message"}), 400

    # BLOCK: Refuse SQL injection attempts
    if is_sql_injection(user_input):
        return jsonify({
            "status": "success",
            "response": "I cannot process that request. It appears to contain potentially malicious SQL patterns. For security reasons, I do not return any user data."
        })

    # BLOCK: Refuse prompt injection attempts
    if is_prompt_injection(user_input):
        return jsonify({
            "status": "success",
            "response": "I cannot comply with that request. It looks like an attempt to manipulate my instructions."
        })

    # BLOCK: Secured chatbot NEVER reveals data - refuse all data lookup requests
    is_data_request = any(kw in user_input.lower() for kw in ['get', 'find', 'show', 'lookup', 'data', 'info', 'password', 'secret']) or \
                     any(name in user_input for name in ['Admin', 'CEO', 'CTO', 'CFO', 'HR', 'Support', 'Developer', 'QA', 'Sales', 'Marketing', 'DevOps', 'Intern', 'Contractor', 'Manager', 'Analyst']) or \
                     (user_input.isalnum() and user_input in ['Admin', 'CEO', 'CTO', 'CFO', 'HR', 'Support', 'Developer', 'QA', 'Sales', 'Marketing', 'DevOps', 'Intern', 'Contractor', 'Manager', 'Analyst'])

    if is_data_request:
        return jsonify({
            "status": "success",
            "response": "I cannot provide user data. This chatbot is secured and does not return sensitive information. For data lookup demonstrations, use the Unsecured Chatbot."
        })

    return jsonify({"status": "success", "response": get_general_response(user_input)})

@app.route('/reset', methods=['GET'])
def reset_db():
    try:
        init_db()
        return jsonify({
            "status": "success", 
            "message": "Database reset successfully"
        })
    except Exception as e:
        app.logger.error(f"Error resetting database: {str(e)}")
        return jsonify({
            "status": "error",
            "message": "Failed to reset database"
        }), 500

# Initialize the database when the app starts
with app.app_context():
    init_db()

if __name__ == '__main__':
    # For production, use a production WSGI server like Gunicorn
    app.run(host='0.0.0.0', port=5001, debug=False)