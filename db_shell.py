#!/usr/bin/env python3
"""
Interactive SQLite shell for SentinelGate's users.db.
Usage:
  python db_shell.py              # Interactive mode
  python db_shell.py "SELECT * FROM secrets"   # Run one query
"""
import os
import sys
import sqlite3

_basedir = os.path.join(os.path.dirname(__file__), 'sentinelgate_lab')
_db_path = os.path.join(_basedir, 'users.db')

if not os.path.exists(_db_path):
    print(f"Database not found at {_db_path}")
    print("Run the app once or: python -c \"from sentinelgate_lab.app import init_db; init_db()\"")
    exit(1)

conn = sqlite3.connect(_db_path)
conn.row_factory = sqlite3.Row

# One-shot query from command line
if len(sys.argv) > 1:
    query = " ".join(sys.argv[1:])
    try:
        cur = conn.execute(query)
        if query.strip().upper().startswith('SELECT'):
            rows = cur.fetchall()
            if rows:
                keys = list(rows[0].keys())
                widths = [max(len(str(k)), max(len(str(r[k])) for r in rows)) for k in keys]
                header = " | ".join(str(k).ljust(w) for k, w in zip(keys, widths))
                print(header)
                print("-" * len(header))
                for r in rows:
                    print(" | ".join(str(r[k]).ljust(w) for k, w in zip(keys, widths)))
                print(f"({len(rows)} row(s))")
            else:
                print("(0 rows)")
        else:
            conn.commit()
            print(f"Done. Rows affected: {cur.rowcount}")
    except sqlite3.Error as e:
        print(f"Error: {e}")
        sys.exit(1)
    conn.close()
    sys.exit(0)

print(f"Connected to {_db_path}")
print("Type SQL queries and press Enter. Type 'quit' or 'exit' to leave.")
print("Commands: .tables, .schema [table], .quit")
print("-" * 50)

while True:
    try:
        line = input("sqlite> ").strip()
        if not line:
            continue
        if line.lower() in ('quit', 'exit', '.q'):
            break
        if line == '.tables':
            cur = conn.execute(
                "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
            )
            print(" ".join(row[0] for row in cur.fetchall()))
            continue
        if line.startswith('.schema'):
            parts = line.split(maxsplit=1)
            table = parts[1] if len(parts) > 1 else None
            cur = conn.execute(
                "SELECT sql FROM sqlite_master WHERE type='table'"
                + (" AND name=?" if table else ""),
                (table,) if table else ()
            )
            for row in cur.fetchall():
                print(row[0] or "")
            continue
        if line == '.quit':
            break

        cur = conn.execute(line)
        if line.strip().upper().startswith('SELECT'):
            rows = cur.fetchall()
            if rows:
                # Print as table
                keys = list(rows[0].keys()) if rows else []
                widths = [max(len(str(k)), max(len(str(r[k])) for r in rows)) for k in keys]
                header = " | ".join(str(k).ljust(w) for k, w in zip(keys, widths))
                print(header)
                print("-" * len(header))
                for r in rows:
                    print(" | ".join(str(r[k]).ljust(w) for k, w in zip(keys, widths)))
                print(f"({len(rows)} row(s))")
            else:
                print("(0 rows)")
        else:
            conn.commit()
            print(f"Done. Rows affected: {cur.rowcount}")
    except sqlite3.Error as e:
        print(f"Error: {e}")
    except EOFError:
        break

conn.close()
print("Goodbye.")
