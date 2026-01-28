from flask import Flask, request, jsonify, render_template
import sqlite3
import os
from functools import wraps
from datetime import timedelta

app = Flask(__name__, template_folder=os.path.abspath('templates'))
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
@app.route('/')
def home():
    return render_template('index.html')

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