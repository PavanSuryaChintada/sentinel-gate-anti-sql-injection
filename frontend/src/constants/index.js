export const TABLE_PLACEHOLDERS = {
  secrets: 'e.g. Admin, CEO',
  departments: 'e.g. Engineering, Sales',
  projects: 'e.g. SentinelGate Security',
  office_locations: 'e.g. San Francisco, London',
};

export const TABLES = ['secrets', 'departments', 'projects', 'office_locations'];

export const TEST_CASES = [
  {
    id: 'valid',
    vuln: 'Admin',
    secure: 'Admin',
    label: 'Valid User',
    icon: 'bi-person-check',
    variant: 'primary',
    explain: 'Legitimate lookup for "Admin". **Vulnerable:** Returns 1 row (works with clean input, but unsafe). **Secure:** Returns 1 row (safe). Same result for valid input—use injection test cases to see the vulnerability.',
  },
  {
    id: 'injection',
    vuln: "Admin' OR '1'='1",
    secure: "Admin' OR '1'='1",
    label: 'SQL Injection',
    icon: 'bi-bug',
    variant: 'vuln',
    explain: 'The `\'` closes the string. `OR \'1\'=\'1` adds a condition that is always true. The query becomes `WHERE name=\'Admin\' OR \'1\'=\'1\'`. **Vulnerable:** Returns ALL rows (full data leak). **Secure:** Treats the whole input as a literal username, finds no match.',
  },
  {
    id: 'malicious',
    vuln: "' UNION SELECT id, name, data FROM secrets --",
    secure: "' UNION SELECT id, name, data FROM secrets --",
    label: 'Malicious Input',
    icon: 'bi-exclamation-octagon',
    variant: 'vuln',
    explain: 'UNION injection: `\' UNION SELECT id, name, data FROM secrets --` appends a second query to dump the table. **Vulnerable:** Returns ALL rows (full leak). **Secure:** Treats input as literal string → no match, empty result.',
  },
  {
    id: 'nonexistent',
    vuln: 'NonExistentUser',
    secure: 'NonExistentUser',
    label: 'Non-existent User',
    icon: 'bi-question-circle',
    variant: 'info',
    explain: 'No user "NonExistentUser" exists. **Vulnerable:** Returns 0 rows (no match). **Secure:** Returns 0 rows. Same for clean input—both correctly return empty. Contrast with injection cases.',
  },
  {
    id: 'always_true',
    vuln: "' OR '1'='1",
    secure: "' OR '1'='1",
    label: 'Always True',
    icon: 'bi-exclamation-triangle',
    variant: 'info',
    explain: 'Simpler injection: `\' OR \'1\'=\'1` closes the string and adds an always-true condition. No username needed. The WHERE clause becomes `WHERE name=\'\' OR \'1\'=\'1\'`. **Vulnerable:** Returns all rows. **Secure:** Searches for that exact string, finds nothing.',
  },
];

export const SCHEMA_TABLES = {
  secrets: {
    columns: [
      { name: 'id', type: 'INTEGER', desc: 'Primary key' },
      { name: 'name', type: 'TEXT', desc: 'Employee/role name' },
      { name: 'data', type: 'TEXT', desc: 'Sensitive credentials (passwords, API keys)' },
    ],
    lookup: 'name',
    values: ['Admin', 'CEO', 'CTO', 'CFO', 'HR', 'Support', 'Developer', 'QA', 'Sales', 'Marketing', 'DevOps', 'Intern', 'Contractor', 'Manager', 'Analyst'],
  },
  departments: {
    columns: [
      { name: 'id', type: 'INTEGER', desc: 'Primary key' },
      { name: 'name', type: 'TEXT', desc: 'Department name' },
      { name: 'manager', type: 'TEXT', desc: 'Department manager' },
      { name: 'budget', type: 'REAL', desc: 'Annual budget' },
      { name: 'headcount', type: 'INTEGER', desc: 'Number of employees' },
    ],
    lookup: 'name',
    values: ['Engineering', 'Sales', 'Marketing', 'Finance', 'Human Resources', 'Operations'],
  },
  projects: {
    columns: [
      { name: 'id', type: 'INTEGER', desc: 'Primary key' },
      { name: 'name', type: 'TEXT', desc: 'Project name' },
      { name: 'department_id', type: 'INTEGER', desc: 'FK → departments.id' },
      { name: 'status', type: 'TEXT', desc: 'active, completed, planning' },
      { name: 'budget', type: 'REAL', desc: 'Project budget' },
      { name: 'deadline', type: 'TEXT', desc: 'Target date (YYYY-MM-DD)' },
    ],
    lookup: 'name',
    values: ['SentinelGate Security', 'Cloud Migration', 'Q4 Campaign', 'CRM Integration', 'Budget Review 2025', 'Infrastructure Upgrade'],
  },
  office_locations: {
    columns: [
      { name: 'id', type: 'INTEGER', desc: 'Primary key' },
      { name: 'city', type: 'TEXT', desc: 'City name' },
      { name: 'country', type: 'TEXT', desc: 'Country' },
      { name: 'address', type: 'TEXT', desc: 'Street address' },
      { name: 'timezone', type: 'TEXT', desc: 'IANA timezone' },
    ],
    lookup: 'city',
    values: ['San Francisco', 'New York', 'London', 'Berlin'],
  },
};
