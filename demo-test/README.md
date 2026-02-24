# SentinelGate Demo — Test Anti-SQL Injection

## Run

```bash
cd demo-test
pip install -r requirements.txt
python server.py
```

Open **http://localhost:5050**

## Test

1. **With script** (http://localhost:5050) — Try injection → **BLOCKED**
2. **Without script** (http://localhost:5050/no-script.html) — Try same injection → **DB data returned**
3. Compare both to verify the script blocks injections
