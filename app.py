from flask import Flask, request, jsonify, render_template
import sqlite3
import os
import re
from functools import wraps
from datetime import timedelta

_basedir = os.path.dirname(os.path.abspath(__file__))
app = Flask(__name__, template_folder=os.path.join(_basedir, 'templates'))
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your-secure-secret-key-here')
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(minutes=30)

# Database initialization
def get_db_connection():
    conn = sqlite3.connect('users.db')
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    with get_db_connection() as conn:
        c = conn.cursor()
        c.execute('''
            CREATE TABLE IF NOT EXISTS secrets (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                data TEXT NOT NULL
            )
        ''')
        # Clear existing data
        c.execute("DELETE FROM secrets")
        # Insert default data
        default_data = [
            (1, 'Admin', 'SUPER_SECRET_PASSWORD_123'),
            (2, 'User1', 'just_a_normal_data'),
            (3, 'Support', 'helpdesk_access_2024')
        ]
        c.executemany("INSERT INTO secrets VALUES (?, ?, ?)", default_data)
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

@app.route('/')
def home():
    resp = app.make_response(render_template('index.html'))
    resp.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    resp.headers['Pragma'] = 'no-cache'
    resp.headers['Expires'] = '0'
    return resp

@app.route('/query/vulnerable', methods=['POST'])
@limit_requests
def query_vulnerable():
    if not request.is_json:
        return jsonify({
            "status": "error",
            "message": "Request must be JSON"
        }), 400

    user_input = request.json.get('chat_input', '')
    
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            # DANGER: This is vulnerable to SQL Injection!
            query = f"SELECT * FROM secrets WHERE name = '{user_input}'"
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

    user_input = request.json.get('chat_input', '')
    
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            # This is the secure way using parameterized queries
            query = "SELECT * FROM secrets WHERE name = ?"
            cursor.execute(query, (user_input,))
            result = [dict(row) for row in cursor.fetchall()]
            return jsonify({
                "status": "success",
                "data": result,
                "message": "Query executed using parameterized statements"
            })
    except Exception as e:
        app.logger.error(f"Error in secure endpoint: {str(e)}")
        return jsonify({
            "status": "error",
            "message": "An error occurred while processing your request"
        }), 400

# Chatbot security helpers
SQL_INJECTION_PATTERNS = [
    r"('\s*OR\s*'1'\s*=\s*'1|OR\s+1\s*=\s*1)",
    r"(DROP\s+TABLE|DELETE\s+FROM|INSERT\s+INTO)",
    r"(UNION\s+SELECT|SELECT\s+\*)",
    r"(;\s*--|--\s*$)",
    r"('\s*OR\s*'1'|'\s*OR\s*1)",
    r"(admin'\s*OR|'\s*;\s*DROP)",
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
    # Check for quote-based injectionx  
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
        return "Hello! I'm here to help. You can ask me questions or request user data by name."
    if any(g in inp for g in ['help', 'what can you']):
        return "I can help you look up user information. Try asking for a username like 'Admin' or 'User1'. I can also answer general questions!"
    if any(g in inp for g in ['thanks', 'thank you']):
        return "You're welcome! Let me know if you need anything else."
    if any(g in inp for g in ['who are you', 'what are you']):
        return "I'm a database assistant chatbot. I help retrieve user information from the system."
    if any(g in inp for g in ['bye', 'goodbye']):
        return "Goodbye! Stay secure!"
    # Default contextual response
    return f"I understand you're asking about: \"{user_input[:50]}...\" if applicable. For user data, try asking for a specific username like Admin, User1, or Support."

def extract_username_for_lookup(text):
    """Extract username from phrases like 'get Admin' or 'show User1 data'"""
    known_users = ['Admin', 'User1', 'Support']
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
                any(name in user_input for name in ['Admin', 'User1', 'Support']) or \
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
    """Secured chatbot - protected against SQL injection and prompt injection"""
    if not request.is_json:
        return jsonify({"status": "error", "message": "Request must be JSON"}), 400
    user_input = request.json.get('message', '').strip()
    if not user_input:
        return jsonify({"status": "error", "message": "Empty message"}), 400

    # BLOCK: Refuse SQL injection attempts
    if is_sql_injection(user_input):
        return jsonify({
            "status": "success",
            "response": "I cannot process that request. It appears to contain potentially malicious SQL patterns. For security reasons, I only accept simple username lookups (e.g., 'Admin', 'User1')."
        })

    # BLOCK: Refuse prompt injection attempts
    if is_prompt_injection(user_input):
        return jsonify({
            "status": "success",
            "response": "I cannot comply with that request. It looks like an attempt to manipulate my instructions. I'm designed to help with legitimate user data lookups only."
        })

    # Allow only simple alphanumeric usernames for lookup
    is_safe_lookup = user_input.isalnum() or (user_input.replace(' ', '').isalnum() and len(user_input) < 20)
    is_lookup = any(kw in user_input.lower() for kw in ['get', 'find', 'show', 'lookup', 'data']) or is_safe_lookup

    if is_lookup and is_safe_lookup:
        try:
            with get_db_connection() as conn:
                cursor = conn.cursor()
                query = "SELECT * FROM secrets WHERE name = ?"
                cursor.execute(query, (user_input,))
                result = [dict(row) for row in cursor.fetchall()]
                if result:
                    response = f"Here is the data for {user_input}:\n" + "\n".join(
                        [f"- {r['name']}: {r['data']}" for r in result]
                    )
                    return jsonify({"status": "success", "response": response})
                elif user_input in ['Admin', 'User1', 'Support']:
                    return jsonify({"status": "success", "response": f"No record found for '{user_input}'."})
        except Exception as e:
            return jsonify({"status": "error", "response": str(e)}), 400

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