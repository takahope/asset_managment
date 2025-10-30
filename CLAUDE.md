# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Google Apps Script-based web application for comprehensive asset management within an organization. The system manages the complete lifecycle of assets including computers, property, and non-consumable items. It integrates with Google Sheets as the database and provides a web-based UI for various asset operations.

## Architecture

### Data Abstraction Layer (V3 Architecture)

The codebase implements a sophisticated object-oriented data abstraction layer that completely decouples application logic from physical storage:

- **Two Master Sheets**: Assets are stored in two separate sheets - `財產總表` (Property Master) and `物品總表` (Item Master)
- **Unified Object Model**: `getAllAssets()` reads from both sheets and returns a unified array of standardized asset objects
- **Location Finder**: `findAssetLocation(assetId)` abstracts away which sheet contains which asset
- **Object Mapping**: `mapRowToAssetObject(row, indices, sourceSheet)` converts sheet rows to JavaScript objects

This architecture means you should:
- **NEVER directly access sheet data** in feature implementations
- **ALWAYS use `getAllAssets()`** to read asset data
- **ALWAYS use `findAssetLocation()`** to update specific assets
- Use the appropriate `PROPERTY_COLUMN_INDICES` or `ITEM_COLUMN_INDICES` based on the returned sheet

### Key Components

**Backend (`code.js`)**:
- Single file containing all server-side logic (~1700 lines)
- All comments and variable names in Traditional Chinese
- Organized into functional modules:
  - Global configuration (lines 1-92)
  - Data abstraction layer (lines 94-193)
  - UI menu handlers (lines 196-295)
  - Web app routing (lines 297-396)
  - Asset transfer workflows (lines 514-774)
  - Lending/return workflows (lines 942-1144)
  - Scrapping workflows (lines 1182-1613)
  - Admin functions (lines 1309-1451)

**Frontend (HTML files)**:
- `portal.html`: Main landing page with feature cards
- `Index.html`: Computer status reporting form
- `apply.html`: Asset transfer application
- `review.html`: Transfer approval dashboard
- `lending.html`: Asset lending application
- `return.html`: Return management
- `scrap.html`: Scrapping application
- `printScrap.html`: Scrapping document generation
- `update.html`: Admin status updates
- `userstate.html`: Personal asset status query
- `shared-nav.html`: Shared navigation component (included via `include()` function)

### Dynamic Data Flow

The system eliminates the need for separate mapping sheets by dynamically extracting reference data:

- **Keepers/Borrowers**: Extracted from the asset list's unique `leaderName` and `leaderEmail` combinations
- **Locations**: Extracted from unique `location` values in asset records
- **Software Versions**: Stored in dedicated `軟體版本清單` sheet

Functions like `getTransferData()` and `getLendingData()` return not just assets but also all available options for dropdowns, ensuring UI always reflects current data.

## Development Commands

### Deployment
```bash
# Push local changes to Google Apps Script
clasp push

# Deploy as web app (after push)
clasp deploy
```

### Testing
- No automated test suite exists
- Testing is done manually through the Google Sheets UI
- Use the custom menu "財產管理系統" in the spreadsheet
- For web app testing, access via `ScriptApp.getService().getUrl()`

### Logging
```javascript
// View logs for debugging
Logger.log("Debug message");
// Then in Apps Script editor: View > Logs
```

## Configuration

### Environment Variables (`env.js`)
- `SPREADSHEET_ID`: The Google Sheet database ID
- `SCRAP_TEMPLATE_DOC_ID_PROPERTY`: Template for property scrapping documents
- `SCRAP_TEMPLATE_DOC_ID_NON_CONSUMABLE`: Template for non-consumable scrapping documents
- `SCRAP_OUTPUT_FOLDER_ID`: Google Drive folder for generated documents

⚠️ **NEVER commit real IDs** - the repository includes placeholder values

### Sheet Names (Configured in `code.js` lines 8-15)
```javascript
const PROPERTY_MASTER_SHEET_NAME = "財產總表";
const ITEM_MASTER_SHEET_NAME = "物品總表";
const RESPONSE_SHEET_NAME = "表單回應 1";
const APPLICATION_LOG_SHEET_NAME = "轉移申請紀錄";
const LENDING_LOG_SHEET_NAME = "出借紀錄";
const ADMIN_LIST_SHEET_NAME = "管理員名單";
```

## Key Features and Workflows

### 1. Asset Transfer (`apply.html` + `processBatchTransferApplication()`)
- User selects assets they own (status = '在庫')
- Chooses new keeper and location
- System updates asset status to '待接收' and logs to APPLICATION_LOG
- Email notification sent to new keeper
- New keeper approves via `review.html` → `processBatchApproval()`

### 2. Asset Lending (`lending.html` + `processBatchLending()`)
- Keeper lends assets temporarily (status → '出借中')
- Records include borrower, expected return date, lending location
- Logged to LENDING_LOG sheet
- Return handled via `return.html` → `processBatchReturn()` (status → '在庫')

### 3. Asset Scrapping (`scrap.html` + `processBatchScrapping()`)
- User applies for scrapping (status → '報廢中')
- Admin confirms via `update.html` → `processScrapConfirmation()` (status → '已報廢')
- Can generate formatted scrapping documents via `printScrap.html` → `createScrapDoc()`

### 4. Computer Reporting (`Index.html` + `processFormData()`)
- Monthly health check reporting for computers
- Includes Windows/Chrome/Antivirus update status and 7-Zip version
- Data written to RESPONSE_SHEET
- Automated monthly reminder via `checkComputerReportsAndNotify()`

### 5. Admin Functions
- Permission check: `checkAdminPermissions()` (reads from ADMIN_LIST_SHEET)
- Upload confirmation: `processUploadConfirmation()` for transferred assets
- Uses `CacheService` for admin email lists (10-minute cache)

## Important Patterns

### Permission Checking
```javascript
const currentUserEmail = Session.getActiveUser().getEmail().toLowerCase();
const adminEmails = getAdminEmails().map(email => email.toLowerCase());
if (!adminEmails.includes(currentUserEmail)) {
  // Access denied
}
```

### Batch Operations
All major operations (transfer, lending, scrapping) support batch processing:
- Accept arrays of asset IDs
- Use `forEach` to process each item
- Accumulate success count
- Return summary message

### Email Notifications
```javascript
MailApp.sendEmail(recipientEmail, subject, body);
```
Used for transfer notifications and monthly reminders.

### Status State Machine
Asset statuses flow through defined states:
- '在庫' (In stock) → '待接收' (Pending) → '在庫' (after approval)
- '在庫' → '出借中' (Lent out) → '在庫' (after return)
- '在庫' → '報廢中' (Scrapping) → '已報廢' (Scrapped)

### Cancellation Feature (`cancelTransferOrScrap()`)
- Users can cancel '待接收' or '報廢中' status
- Returns asset to '在庫' state
- Updates APPLICATION_LOG for transfers
- Security: Only asset owner or admin can cancel

## Routing System

The web app uses query parameters for page routing:
```javascript
function doGet(e) {
  const page = e.parameter.page;
  switch (page) {
    case 'report': return Index.html
    case 'apply': return apply.html
    case 'review': return review.html
    // ... etc
    default: return portal.html
  }
}
```

Navigation: `webAppUrl + '?page=review'`

## Common Gotchas

1. **Asset Status Dependencies**: Many operations require status = '在庫'. Always check before allowing operations.

2. **Column Index Off-by-One**: Sheet columns are 1-indexed (A=1, B=2), but JavaScript arrays are 0-indexed. The code handles this via `row[indices.COLUMN_NAME - 1]`.

3. **Email Case Sensitivity**: Always use `.toLowerCase()` when comparing emails.

4. **Sheet Name Context**: When updating assets, always use the correct indices (`PROPERTY_COLUMN_INDICES` vs `ITEM_COLUMN_INDICES`) based on `location.sheetName`.

5. **Cache Invalidation**: Admin email lists are cached for 10 minutes. Changes to ADMIN_LIST won't reflect immediately.

6. **Session User Email**: `Session.getActiveUser().getEmail()` returns the executing user's email. For web apps with `executeAs: "USER_ACCESSING"`, this is the accessing user.

7. **Date Formatting**: Scrapping documents parse both GMT timestamps and Minguo calendar dates (e.g., "112/05/15" → 2023/05/15).

## Security Model

- **Web App Access**: Set to "DOMAIN" in `appsscript.json` (organization-only)
- **Execution As**: "USER_ACCESSING" ensures user context is preserved
- **Admin Functions**: Protected by email whitelist in ADMIN_LIST_SHEET
- **Asset Ownership**: Most operations restricted to asset owner (`leaderEmail` match)
- **Cancellation Rights**: Owner or admin only

## Caching Strategy

```javascript
const cache = CacheService.getScriptCache();
const cacheKey = 'admin_emails_list';
const cachedData = cache.get(cacheKey);
if (cachedData) return JSON.parse(cachedData);
// ... fetch from sheet ...
cache.put(cacheKey, JSON.stringify(data), 600); // 10 min TTL
```

Applied to: `getAdminEmails()`, `getReportAdmins()`

## UI Integration with `google.script.run`

Frontend calls backend functions asynchronously:
```javascript
google.script.run
  .withSuccessHandler(function(data) { /* handle response */ })
  .withFailureHandler(function(error) { /* handle error */ })
  .backendFunctionName(param1, param2);
```

All HTML pages follow this pattern for data fetching and submission.

## Scheduled Triggers

- `checkComputerReportsAndNotify()`: Should be set up as a monthly time-driven trigger
- Checks which computers haven't reported this month
- Sends reminders to individual keepers and summary to report admins
