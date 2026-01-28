# SentinelGate - SQL Injection Demo

A professional, interactive demonstration of SQL injection vulnerabilities and secure coding practices. This project showcases the dangers of SQL injection and how to prevent it using parameterized queries.

## Features

- Interactive demonstration of SQL injection vulnerabilities
- Side-by-side comparison of vulnerable and secure code
- Real-time query execution with visual feedback
- Multiple test cases to demonstrate different attack vectors
- Modern, responsive UI built with Bootstrap 5
- Detailed explanations of vulnerabilities and fixes

## Prerequisites

- Python 3.8+
- pip (Python package manager)
- Modern web browser

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/PavanSuryaChintada/sentinel-gate-anti-sql-injection.git
   cd sentinel-gate-anti-sql-injection
   ```

2. **Create and activate a virtual environment:**
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate

   # macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

## Usage

1. **Start the development server:**
   ```bash
   python app.py
   ```

2. **Open your web browser and navigate to:**
   ```
   http://127.0.0.1:5001
   ```

3. **Explore the demo:**
   - Try the test cases to see SQL injection in action
   - Compare the vulnerable and secure endpoints
   - Examine the code to understand the differences

## Test Cases

Try these examples in the vulnerable endpoint:

1. **Basic Injection:**
   ```
   Admin' OR '1'='1
   ```

2. **Malicious Input:**
   ```
   '; DROP TABLE secrets; --
   ```

3. **Always True Condition:**
   ```
   ' OR '1'='1
   ```

## Security Best Practices

This demo highlights several important security practices:

1. **Use Parameterized Queries:**
   ```python
   # Vulnerable
   cursor.execute(f"SELECT * FROM users WHERE username = '{user_input}'")
   
   # Secure
   cursor.execute("SELECT * FROM users WHERE username = ?", (user_input,))
   ```

2. **Input Validation:**
   - Always validate and sanitize user input
   - Use allowlists instead of blocklists

3. **Least Privilege:**
   - Database users should have minimum required permissions
   - Use read-only connections when possible

## Project Structure

```
sentinel-gate-anti-sql-injection/
├── app.py               # Main Flask application
├── requirements.txt     # Project dependencies
├── users.db            # SQLite database
└── templates/
    └── index.html      # Frontend interface
```

## Contributing

Contributions are welcome! Please read our [contributing guidelines](CONTRIBUTING.md) before submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Flask](https://flask.palletsprojects.com/)
- Styled with [Bootstrap 5](https://getbootstrap.com/)
- Icons by [Bootstrap Icons](https://icons.getbootstrap.com/)
