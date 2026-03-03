# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

<<<<<<< HEAD
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

8. **Page Navigation in GAS Web Apps**: Always use `window.open(url, '_top')` for page navigation in Google Apps Script Web Apps, never use `window.location.href` or `window.location.replace()`. The `_top` parameter ensures navigation happens in the top frame, preserving Google authorization context and avoiding cross-origin issues when pages run inside iframes. Using `window.location.href` will trigger authorization errors.

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

# Project Knowledge Base & Incident Log

## Recent Incidents

### [2025-11-21] Frontend received `null` from `google.script.run`
- **Symptom**: The `printScrap.html` page showed a loading spinner indefinitely or threw "received null" errors, even though backend logs showed `getAllScrappableItems` was finding data.
- **Root Cause**: The backend function was returning raw `Date` objects (from `asset.lastModified`). Google Apps Script's `google.script.run` cannot serialize `Date` objects to JSON for the browser. It silently fails and sends `null` to the client.
- **Resolution**: Updated `getAllScrappableItems` in `code.js` to explicitly convert dates to strings using `Utilities.formatDate` and ensure all fields are primitives (Strings) before returning.
- **Lesson**: Never return raw database rows to the frontend. Always use a DTO (Data Transfer Object) pattern to sanitize types.

### [2025-11-22] Navigation loader caused Google authorization error
- **Symptom**: 在 `shared-nav.html` 實作轉跳動畫功能後，點擊導覽按鈕雖然能正常顯示轉跳動畫（全螢幕遮罩 + spinner），但轉跳完成後頁面顯示「Google 雲端硬碟 - 需要存取權」錯誤，要求用戶重新授權。錯誤訊息：「請直接開啟文件查看是否可要求存取權，或改用具有存取權的帳戶」。此問題影響所有使用該導覽列的 9 個頁面（apply.html, review.html, lending.html, return.html, scrap.html, update.html, printScrap.html, printTransfer.html, userstate.html）。
- **Root Cause**: 在實作 `navigateWithLoader()` 函數時，使用了 `window.location.href = targetUrl` 進行頁面導航。在 Google Apps Script Web App 環境中，此方法會在當前框架內導航。如果頁面在 iframe 中執行，會觸發跨域安全檢查，導致 Google 認為這是一個新的未授權請求，強制要求用戶重新授權。原始代碼使用的是 `window.open(url, '_top')`，其中 `_top` 參數強制在頂層框架（top frame）中打開，可以跳出所有 iframe 層級並保持原有的 Google 授權上下文和 session。
- **Resolution**: 修改 `shared-nav.html` 第 124 行的 `navigateWithLoader()` 函數，將 `window.location.href = targetUrl` 改回 `window.open(targetUrl, '_top')`。具體修改：
  ```javascript
  // 修改前：
  setTimeout(() => {
    window.location.href = targetUrl;
  }, 100);

  // 修改後：
  setTimeout(() => {
    window.open(targetUrl, '_top');
  }, 100);
  ```
  修改後轉跳動畫正常顯示，頁面成功轉跳且不會出現授權錯誤，保持原有的用戶授權狀態。
- **Lesson**:
  1. **GAS 環境特殊性**：在 Google Apps Script Web App 中進行頁面導航時，必須使用 `window.open(url, '_top')`，不能使用 `window.location.href`、`window.location.replace()` 等一般網頁常用的方法。`_top` 參數確保在頂層框架操作，避免 iframe 跨域授權問題。
  2. **保持原有架構的重要性**：在重構或優化功能時，必須保持關鍵技術實作方式不變。原始代碼使用 `window.open(url, '_top')` 是基於 GAS 環境的技術要求，不應隨意替換為看似等效的其他方法。
  3. **完整測試的必要性**：功能修改後必須完整測試轉跳流程，不僅要測試動畫效果，還要確認轉跳後頁面是否正常載入且授權狀態正常。

## Architecture Notes
=======
## 專案概述

這是一個基於 Google Apps Script (GAS) 的資產管理系統,包含多個獨立的 Web App 模組,用於管理財產與物品的轉移、出借、報廢和盤點等流程。

## 開發環境設定

### 必要工具
- [clasp](https://github.com/google/clasp) - Google Apps Script 命令列工具

### 基本命令
```bash
# 首次使用需要登入
clasp login

# 從 GAS 拉取最新程式碼
clasp pull

# 推送本地修改到 GAS
clasp push

# 建立新部署版本
clasp deploy

# 在瀏覽器開啟 Apps Script 編輯器
clasp open
```

### 初始化工作表
第一次部署時,需要在 Apps Script 編輯器中執行:
```javascript
deployAllSheets()  // 位於 deploy.js
```

## 專案架構

### 核心模組

#### 主應用程式 (根目錄)
- `code.js` - 核心業務邏輯,包含所有資產操作 API
- `env.js` - 環境設定 (試算表 ID、文件夾 ID 等)
- `deploy.js` - 工作表初始化工具
- `dashboard_code.js` - 儀表板專用邏輯
- `*.html` - UI 頁面模板

#### 子專案
- `computer-report/` - 電腦資產報告模組
- `dashboard-app/` - 資料儀表板模組
- `itasset-warning/` - IT 資產警示模組

每個子專案都有獨立的 `appsscript.json`, `env.js`, `code.js`。

### 資料架構

系統使用 **雙工作表架構** 管理不同類型資產:

1. **財產總表** (`PROPERTY_MASTER_SHEET_NAME`) - 高價值固定資產
2. **物品總表** (`ITEM_MASTER_SHEET_NAME`) - 一般消耗品/低價物品

#### 統一資料抽象層
所有資產查詢透過以下函式統一處理:

- `getAllAssets()` - 合併兩張表的資料,回傳統一格式
- `mapRowToAssetObject(row, indices, sourceSheet)` - 將工作表列轉為物件
- `findAssetLocation(assetId)` - 自動定位資產所在工作表與列

#### 欄位索引物件
使用物件定義欄位位置,方便維護:
```javascript
PROPERTY_COLUMN_INDICES = {
  ASSET_ID: 1,
  ASSET_NAME: 2,
  LEADER_EMAIL: 13,
  // ...
}

ITEM_COLUMN_INDICES = {
  ASSET_ID: 1,
  ASSET_NAME: 2,
  // ...
}
```

### Web App 路由

主應用程式透過 `doGet(e)` 處理頁面路由:

| URL 參數 | 頁面 | 功能 |
|---------|------|------|
| `?page=` (空) | portal.html | 入口頁 |
| `?page=apply` | apply.html | 申請轉移 |
| `?page=review` | review.html | 審核轉移 |
| `?page=lending` | lending.html | 出借登記 |
| `?page=return` | return.html | 歸還登記 |
| `?page=scrap` | scrap.html | 報廢申請 |
| `?page=inventory` | inventory.html | 盤點作業 |
| `?page=userstate` | userstate.html | 個人資產狀態 |

### 關鍵工作流程

#### 1. 資產轉移流程
1. 使用者在 `apply.html` 提交轉移申請
2. 寫入「轉移申請紀錄」工作表
3. 審核者在 `review.html` 核准/拒絕
4. 核准後更新資產總表的保管人/地點

#### 2. 出借/歸還流程
- `handleLend()` - 登記出借,寫入「出借紀錄」
- `handleReturn()` - 登記歸還,更新狀態為「在庫」

#### 3. 報廢流程
- `handleScrap()` - 提交報廢申請,產生 Google Docs 申請單
- 狀態變更: 在庫 → 報廢中 → 已報廢

#### 4. 盤點流程
- `startInventory()` - 建立盤點作業
- `submitInventoryResults()` - 提交盤點結果
- `completeInventory()` - 結案並產生差異報告

### 權限控制

系統使用「管理員名單」工作表 (`ADMIN_LIST_SHEET_NAME`) 控制特定功能權限:
```javascript
function isAdmin() {
  // 檢查當前使用者是否在管理員名單中
}
```

### GAS 序列化注意事項

**重要**: GAS 無法序列化 `Date`, `Map`, `Set` 等物件。

✅ 正確做法:
```javascript
function getData() {
  return {
    timestamp: new Date().toISOString(),  // 轉字串
    items: Array.from(mySet)              // 轉陣列
  };
}
```

❌ 錯誤做法:
```javascript
function getData() {
  return {
    timestamp: new Date(),  // ❌ 會失敗
    items: mySet            // ❌ 會失敗
  };
}
```

詳見 `.gemini/skills/gas-serialization-knowledge/`

## 編碼風格

- **縮排**: 2 空格 (JS/HTML)
- **命名規則**:
  - 函式/變數: `camelCase`
  - 常數: `SCREAMING_SNAKE_CASE`
- **註解**: 繁體中文為主,保持簡潔
- **常數管理**: 將工作表名稱、欄位索引集中在檔案頂部

## 安全性注意事項

1. **環境設定**: 部署前必須更新 `env.js` 中的試算表/文件夾 ID
2. **存取權限**: `appsscript.json` 設定為網域內存取 (`"access": "DOMAIN"`)
3. **IDOR 防護**: 所有資產操作需驗證使用者權限
4. **XSS 防護**: 避免使用 `innerHTML`,改用 `textContent` 或模板引擎

詳見 `.gemini/skills/gas-security-audit/`

## 測試方式

目前無自動化測試框架,需手動驗證:

1. 在 Apps Script 編輯器測試後端函式
2. 部署 Web App 測試完整流程
3. 檢查試算表中的資料寫入與時間戳記
4. 驗證權限控制 (一般使用者 vs 管理員)

## 部署流程

1. 修改本地程式碼
2. `clasp push` 推送到 GAS
3. 在 Apps Script 編輯器測試
4. `clasp deploy` 建立新版本
5. 更新 Web App 部署設定

## 相關技能包

專案包含多個 Gemini AI 技能包 (`.gemini/skills/`):

- `asset-manage` - 完整 API 參考文件
- `gas-serialization-knowledge` - GAS 序列化規則
- `gas-security-audit` - 安全性檢查清單
- `gas-webapp-navigation-fix` - 頁面導航問題修復指南
>>>>>>> bmain/main
