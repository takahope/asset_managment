# Repository Guidelines

## Project Structure & Module Organization
This is a Google Apps Script (GAS) web app stored at the repo root.

- `code.js`: Primary GAS backend logic (asset data, transfers, lending, scrapping, inventory).
- `dashboard_code.js`: Dashboard-specific helpers and data shaping.
- `deploy.js`: One-time sheet setup helpers (run `deployAllSheets()` from GAS).
- `env.js`: Environment IDs for Sheets/Docs/Folders used by the app.
- `*.html`: UI templates (e.g., `Inedex.html`, `dashboard.html`, `selectbyqr.html`).
- `appsscript.json`: GAS manifest (runtime, web app settings).
- `.clasp.json`: Local clasp configuration for syncing with GAS.

## Build, Test, and Development Commands
Use clasp to sync local files with the Apps Script project:

- `clasp login`: authenticate with Google (one-time per machine).
- `clasp pull`: fetch the current script from GAS.
- `clasp push`: upload local changes to GAS.
- `clasp deploy`: create a new deployment/version.
- `clasp open`: open the script in the Apps Script editor.

For sheet initialization, run `deployAllSheets()` in `deploy.js` from the Apps Script editor.

## Coding Style & Naming Conventions
- Indentation: 2 spaces in JS/HTML.
- Naming: `camelCase` for functions/variables, `SCREAMING_SNAKE_CASE` for constants.
- Keep top-level constants grouped (sheet names, column indices) as in `code.js`.
- Comments are concise and often in Traditional Chinese; keep tone consistent.

## Testing Guidelines
No automated test framework is configured. Validate changes manually:
- Test web app flows in the GAS UI (transfer, lending, scrap, inventory).
- Verify Sheet writes and timestamps in the target spreadsheet.

## Commit & Pull Request Guidelines
This workspace does not include Git history. If you create commits, use short, imperative messages and include scope when helpful (e.g., `inventory: fix export dates`).

PRs should include:
- A clear description of the change and impacted flows.
- Screenshots for UI changes (`dashboard.html`, `selectbyqr.html`, etc.).
- Any related Sheet schema changes or required environment updates.

## Security & Configuration Tips
- Update IDs in `env.js` for your environment before deploying.
- Web app access is domain-restricted in `appsscript.json`; confirm this matches deployment needs.
