# SentinelGate — Database Schema & SQL Commands

This document covers the database schema and SQL commands for the SentinelGate demo.

---

## Database Schema

The demo uses a fictional company database with four tables:

| Table | Column | Type | Description | Lookup by |
|-------|--------|------|-------------|-----------|
| **secrets** | id | INTEGER | Primary key | name |
| | name | TEXT | Employee/role name | |
| | data | TEXT | Sensitive credentials (passwords, API keys) | |
| **departments** | id | INTEGER | Primary key | name |
| | name | TEXT | Department name | |
| | manager | TEXT | Department manager | |
| | budget | REAL | Annual budget | |
| | headcount | INTEGER | Number of employees | |
| **projects** | id | INTEGER | Primary key | name |
| | name | TEXT | Project name | |
| | department_id | INTEGER | FK → departments.id | |
| | status | TEXT | active, completed, planning | |
| | budget | REAL | Project budget | |
| | deadline | TEXT | Target date (YYYY-MM-DD) | |
| **office_locations** | id | INTEGER | Primary key | city |
| | city | TEXT | City name | |
| | country | TEXT | Country | |
| | address | TEXT | Street address | |
| | timezone | TEXT | IANA timezone | |

---

## Accessing the Database (Terminal)

### Prerequisites

1. **Create the database** (if it doesn't exist):
   ```bash
   python -c "from sentinelgate_lab.app import init_db; init_db()"
   ```

2. **Use the db_shell** (Python script at project root):

### One-shot queries

```bash
# List all secrets
python db_shell.py "SELECT * FROM secrets"

# List all departments
python db_shell.py "SELECT * FROM departments"

# List all projects
python db_shell.py "SELECT * FROM projects"

# List all office locations
python db_shell.py "SELECT * FROM office_locations"

# Filter by name
python db_shell.py "SELECT * FROM secrets WHERE name = 'Admin'"
python db_shell.py "SELECT * FROM departments WHERE name = 'Engineering'"
python db_shell.py "SELECT * FROM projects WHERE name = 'SentinelGate Security'"
python db_shell.py "SELECT * FROM office_locations WHERE city = 'London'"

# Count records
python db_shell.py "SELECT COUNT(*) FROM secrets"
python db_shell.py "SELECT COUNT(*) FROM departments"

# Join projects with departments
python db_shell.py "SELECT p.name, p.status, d.name as dept FROM projects p JOIN departments d ON p.department_id = d.id"

# List tables
python db_shell.py "SELECT name FROM sqlite_master WHERE type='table'"

# Show schema for a table
python db_shell.py "SELECT sql FROM sqlite_master WHERE type='table' AND name='secrets'"
```

### Interactive mode

```bash
python db_shell.py
```

Then type SQL at the `sqlite>` prompt:

```
sqlite> SELECT * FROM secrets LIMIT 3
sqlite> .tables
sqlite> .schema departments
sqlite> quit
```

---

## SQL Commands Reference

### Basic queries

```sql
-- All records from a table
SELECT * FROM secrets;
SELECT * FROM departments;
SELECT * FROM projects;
SELECT * FROM office_locations;

-- Filter by lookup column
SELECT * FROM secrets WHERE name = 'Admin';
SELECT * FROM departments WHERE name = 'Engineering';
SELECT * FROM projects WHERE name = 'Cloud Migration';
SELECT * FROM office_locations WHERE city = 'San Francisco';

-- Limit results
SELECT * FROM secrets LIMIT 5;
SELECT * FROM projects WHERE status = 'active';
```

### Aggregations

```sql
SELECT COUNT(*) FROM secrets;
SELECT COUNT(*) FROM departments;
SELECT SUM(budget) FROM departments;
SELECT AVG(budget) FROM projects;
SELECT status, COUNT(*) FROM projects GROUP BY status;
```

### Joins

```sql
-- Projects with department names
SELECT p.id, p.name, p.status, d.name as department
FROM projects p
JOIN departments d ON p.department_id = d.id;

-- Projects with budget and department
SELECT p.name, p.budget, d.name as dept, d.manager
FROM projects p
JOIN departments d ON p.department_id = d.id
WHERE p.status = 'active';
```

### Schema inspection

```sql
-- List all tables
SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;

-- Show CREATE statement for a table
SELECT sql FROM sqlite_master WHERE type='table' AND name='secrets';

-- List columns (SQLite)
PRAGMA table_info(secrets);
PRAGMA table_info(departments);
PRAGMA table_info(projects);
PRAGMA table_info(office_locations);
```
