# Copilot Instructions for Asset Management System

## System Overview

This is a Google Apps Script web application for comprehensive organizational asset management. The system handles computers, property (財產), and non-consumable items (物品) through their complete lifecycle: transfers, lending, returns, and disposal. It uses Google Sheets as the database and provides a web-based UI.

**Key Architecture**: V3 Data Abstraction Layer completely decouples application logic from physical sheet storage using object-oriented patterns.

## Critical Development Rules

### 1. Data Access Pattern - NEVER Break This

```javascript
// ✅ CORRECT: Always use the abstraction layer
const assets = getAllAssets();                    // Read all assets as unified objects
const location = findAssetLocation(assetId);      // Find where an asset lives
const asset = mapRowToAssetObject(row, indices);  // Convert sheet row to object

// ❌ WRONG: Never directly access sheets in feature code
const sheet = ss.getSheetByName("財產總表");
const data = sheet.getDataRange().getValues();    // Violates abstraction
```

**Why**: Assets are stored in TWO separate sheets (`財產總表` and `物品總表`) with different column layouts. The abstraction layer handles this complexity.

### 2. Column Index Context Switching

When updating an asset via `findAssetLocation()`, you MUST use the correct indices based on `location.sheetName`:

```javascript
const location = findAssetLocation(assetId);
const indices = location.sheetName === PROPERTY_MASTER_SHEET_NAME 
    ? PROPERTY_COLUMN_INDICES   // For 財產總表
    : ITEM_COLUMN_INDICES;      // For 物品總表

location.sheet.getRange(location.rowIndex, indices.ASSET_STATUS).setValue('在庫');
```

**Common Bug**: Using `PROPERTY_COLUMN_INDICES` for items in `物品總表` causes wrong column updates.

### 3. Status State Machine

Asset operations depend heavily on status. Always validate before operations:

```javascript
// Valid status transitions:
'在庫' → '待接收' → '在庫' (after transfer approval)
'在庫' → '出借中' → '在庫' (after return)
'在庫' → '報廢中' → '已報廢' (after admin confirmation)

// Most operations require status === '在庫'
if (asset.assetStatus !== '在庫') {
    throw new Error("財產必須為「在庫」狀態才能執行此操作");
}
```

### 4. Email Comparison

Always use `.toLowerCase()` when comparing emails:

```javascript
const currentUserEmail = Session.getActiveUser().getEmail().toLowerCase();
const adminEmails = getAdminEmails().map(email => email.toLowerCase());
if (adminEmails.includes(currentUserEmail)) { /* authorized */ }
```

### 5. Batch Operation Pattern

All major operations (transfer, lending, scrapping) follow this structure:

```javascript
function processBatchOperation(formData) {
    const { assetIds, ...otherParams } = formData;
    let successCount = 0;
    
    assetIds.forEach(assetId => {
        const location = findAssetLocation(assetId);
        if (location && /* validate conditions */) {
            // Update sheet
            successCount++;
        }
    });
    
    return `成功處理 ${successCount} 筆財產！`;
}
```

### 6. Data Serialization for Web App (CRITICAL)

`google.script.run` **fails silently** (returns `null`) if you try to return `Date`, `Map`, or `Set` objects.

**❌ WRONG:**
```javascript
function getData() {
    return data.map(row => ({
        id: row[0],
        date: row[1] // If row[1] is a Date object, frontend receives NULL for the whole result!
    }));
}
```

**✅ CORRECT:**
```javascript
function getData() {
    return data.map(row => ({
        id: String(row[0]),
        date: Utilities.formatDate(new Date(row[1]), Session.getScriptTimeZone(), "yyyy/MM/dd")
    }));
}
```

## UI Integration Patterns

### Frontend-Backend Communication

```javascript
// Frontend (HTML): Call backend function
google.script.run
    .withSuccessHandler(function(data) {
        // Process returned data
    })
    .withFailureHandler(function(error) {
        alert('錯誤：' + error.message);
    })
    .backendFunctionName(param1, param2);

// Backend (code.js): Return data or error
function backendFunctionName(param1, param2) {
    try {
        // ... logic ...
        return { success: true, data: result };
    } catch (e) {
        Logger.log("Error: " + e.message);
        return { error: e.message };
    }
}
```

### Dynamic Dropdown Population

Pages like `apply.html` and `lending.html` dynamically populate dropdowns from live asset data:

```javascript
// Backend extracts unique values from asset list
function getTransferData() {
    const allAssets = getAllAssets();
    
    // Extract unique keepers (Email → Name mapping)
    const keepersMap = new Map();
    allAssets.forEach(asset => {
        if (asset.leaderEmail && asset.leaderName) {
            keepersMap.set(asset.leaderEmail, asset.leaderName);
        }
    });
    
    // Extract unique locations
    const locations = [...new Set(allAssets.map(a => a.location))].sort();
    
    return { assets: myAssets, keepers: Object.fromEntries(keepersMap), locations };
}
```

This eliminates need for separate mapping sheets - UI always reflects current data.

## Key Files & Their Responsibilities

- **code.js** (1700 lines): All backend logic
  - Lines 1-92: Global config (sheet names, column indices)
  - Lines 94-193: Data abstraction layer (`getAllAssets`, `findAssetLocation`, `mapRowToAssetObject`)
  - Lines 196-295: Custom menu handlers
  - Lines 297-396: Web app routing (`doGet`)
  - Lines 514-774: Transfer workflows
  - Lines 942-1144: Lending/return workflows
  - Lines 1182-1613: Scrapping workflows

- **portal.html**: Main landing page with feature cards and pending approval badge
- **shared-nav.html**: Shared navigation component (included via `include()` function)
- **env.js**: Environment variables (SPREADSHEET_ID, template IDs) - NEVER commit real values

## Common Operations Reference

### Permission Check (Admin Functions)

```javascript
function someAdminFunction() {
    const currentUserEmail = Session.getActiveUser().getEmail().toLowerCase();
    const adminEmails = getAdminEmails().map(email => email.toLowerCase());
    
    if (!adminEmails.includes(currentUserEmail)) {
        return { error: "權限不足，您無法存取此功能。" };
    }
    // ... admin logic ...
}
```

Admin emails are read from `ADMIN_LIST_SHEET_NAME` (Column A) and cached for 10 minutes.

### Sending Email Notifications

```javascript
const subject = `[財產轉移通知] 您有 ${count} 筆待接收的財產`;
const body = `您好 ${recipientName}，\n\n${senderEmail} 已申請將財產轉移給您。\n\n`;
MailApp.sendEmail(recipientEmail, subject, body);
```

### Asset Update Transaction

```javascript
const now = new Date();
const location = findAssetLocation(assetId);
if (location) {
    const indices = location.sheetName === PROPERTY_MASTER_SHEET_NAME 
        ? PROPERTY_COLUMN_INDICES : ITEM_COLUMN_INDICES;
    
    location.sheet.getRange(location.rowIndex, indices.ASSET_STATUS).setValue('在庫');
    location.sheet.getRange(location.rowIndex, indices.TRANSFER_TIME).setValue(now);
}
```

## Common Pitfalls to Avoid

1. **Off-by-One Errors**: Sheet columns are 1-indexed (A=1, B=2), arrays are 0-indexed. Code handles via `row[indices.COLUMN - 1]`.

2. **Cache Stale Data**: Admin/Report admin lists cached 10 minutes. Changes won't reflect immediately.

3. **Incomplete Batch Processing**: Always track `successCount` and handle cases where some items fail validation.

4. **Date Formatting**: Scrapping documents must parse both GMT timestamps and Minguo calendar (e.g., "112/05/15" = 2023/05/15).

5. **Status Dependencies**: Operations like transfer require `status === '在庫'`. Operations like return require `status === '出借中'`.

6. **Lending Location Field**: When creating lending records, include the `lendingLocation` parameter (Column J in LENDING_LOG).

7. **Frontend Null Data**: If frontend receives `null` but backend logs show data, check for `Date` objects in the return value.

## Deployment & Testing

### Deploy Changes

```bash
clasp push              # Upload to Google Apps Script
clasp deploy            # Create new deployment version
```

### Testing Strategy

- **No automated tests** - all testing is manual
- Test via custom menu "財產管理系統" in Google Sheets
- Web app URL from `ScriptApp.getService().getUrl()`
- Test with multiple user accounts to verify permissions
- Use `Logger.log()` for debugging, view in Apps Script editor (View > Logs)

### Scheduled Trigger Setup

`checkComputerReportsAndNotify()` should be set as monthly time-driven trigger:
- Checks computers that haven't reported this month
- Sends reminders to keepers
- Sends summary to report admins (Column B in ADMIN_LIST_SHEET)

## Language & Naming Conventions

- **All comments in Traditional Chinese** (繁體中文)
- **Variable names in English** with descriptive prefixes:
  - `AL_*`: Application Log columns
  - `LL_*`: Lending Log columns
  - `PROPERTY_*` / `ITEM_*`: Column indices for respective sheets
- **Function names use camelCase**
- **Sheet/Column constants use SCREAMING_SNAKE_CASE**

## Security Model

- **Web Access**: DOMAIN-only (organization members)
- **Execution Context**: USER_ACCESSING (user's permissions)
- **Admin Protection**: Email whitelist in ADMIN_LIST_SHEET
- **Asset Ownership**: Operations restricted to `leaderEmail` match
- **Cancellation Rights**: Owner or admin only

---

**When in doubt**: Check existing implementations in `code.js`. All major workflows (transfer, lending, scrapping) follow similar patterns. The abstraction layer is your friend - use it consistently.
