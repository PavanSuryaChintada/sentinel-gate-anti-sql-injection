# Frontend install issues on Windows

If `npm install` fails with **EPERM** or **esbuild EFTYPE** errors, try the following.

## 1. Clean reinstall

Close all terminals and IDEs that have the `frontend` folder open, then run in PowerShell:

```powershell
cd frontend

# Remove existing install
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue

# Clear npm cache
npm cache clean --force

# Reinstall
npm install
```

## 2. Run PowerShell as Administrator

Right‑click **PowerShell** → **Run as administrator**, then `cd` to your project and run the clean reinstall steps above. This can fix **EPERM** (operation not permitted) when removing `node_modules`.

## 3. Antivirus / Windows Defender

Windows Defender or other antivirus often blocks the **esbuild** binary (`.exe`) and causes **EFTYPE** or **spawnSync** errors.

- **Temporarily:** Add an exclusion for your project folder:  
  **Windows Security** → **Virus & threat protection** → **Manage settings** → **Exclusions** → **Add exclusion** → **Folder** → select your project folder (e.g. `sentinel-gate-anti-sql-injection-main`).
- Then run the clean reinstall again.

## 4. Move project out of Downloads / OneDrive

Install can fail if the project is under **Downloads** or a **OneDrive**-synced path. Copy the project to a short local path, then install there:

```powershell
# Example: copy to C:\dev
mkdir C:\dev -ErrorAction SilentlyContinue
Copy-Item -Recurse "C:\Users\praveeeee\Downloads\sentinel-gate-anti-sql-injection-main" "C:\dev\sentinel-gate-anti-sql-injection-main"
cd C:\dev\sentinel-gate-anti-sql-injection-main\frontend
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
npm install
```

## 5. Use the app without building the React UI

You can run the app with the **legacy HTML UI** (no Node/npm needed):

1. Do **not** create or keep a `frontend/dist` folder (delete it if it exists).
2. Start the backend:

   ```bash
   pip install -r requirements.txt
   python app.py
   ```

3. Open **http://localhost:5001** — Flask will serve the original template.
