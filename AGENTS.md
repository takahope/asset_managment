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

## Event Log
- 2026-07-29: Fixed issue in `iso_scope.js` where virtual records (`assetId: '無對應資產/消耗品'`) representing empty ISMS assets were incorrectly treated as unmapped physical assets and queued for auto-creation.
- 2026-07-29: Fixed missing "entering scope" (進入範圍) asset list display in isoScanModal of `connect.html`.
- 2026-07-23: Added "Tag Error" (`tag`) type alongside "Location Error" and "Keeper Error", with dedicated sky-colored action button, distinct notification email copy, modal sky badge, and updated Sheet export mapping.
- 2026-07-23: Added "Keeper Error" type alongside "Location Error", with dedicated action buttons, distinct notification email copy, and expanded CSV export header schema.
- 2026-07-20: Replaced single-select Font Awesome chevrons in `alpine_views.html` with CSS-drawn chevrons to avoid missing icon rendering.
- 2026-07-20: Fixed `alpine_views.html` native select icon positioning by replacing missing frozen Tailwind `right-3` reliance with scoped CSS.
- 2026-07-20: Added scoped responsive CSS for `alpine_views.html` filter toolbar to avoid missing frozen Tailwind `lg:*` utilities breaking desktop layout.
- 2026-07-20: Fixed duplicate native/custom select arrows in `alpine_views.html` filter selects with scoped appearance reset CSS.
- 2026-07-19: Fixed Alpine.js `x-model` and dynamic `<option>` race condition in `alpine_model_setting.html` by using `$nextTick` to set select models.

## ★ Insight ─────────────────────────────────────
- 沉澱時發現 gas-fullstack:476 早已寫過「凍結 Tailwind → 寫具名 scoped CSS class」的通則——這正解釋了為何當初該 skill 沒被觸發：這次是新功能作者沒讀既有規範。所以我補的是更難察覺的新症狀（z-index 任意值 → 遮蓋），提高未來被 grep/掃到的機率，而非複述通則。
- 三層沉澱各司其職：PLAYBOOK §4=跨專案速記、skill=詳解單一來源、專案 CLAUDE.md=在地事件溯源。同一課三處互相指引，日後任一入口都找得到全貌。

**⚠️ 前端修改鐵則** 
修改前端時，一定要檢查掃描現有已編譯的凍結 Tailwind。如果沒有可用的 class，就**必須**使用「具名 scoped CSS class」，以免造成預期外的樣式錯誤。
