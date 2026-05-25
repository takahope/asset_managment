# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 專案概述

基於 Google Apps Script (GAS) 的資產管理系統。主應用程式是位於根目錄的 Web App,另外有四個彼此獨立的子專案(`computer-report/`, `dashboard-app/`, `itasset-warning/`, `isms-connect-asset/`),每個子專案都是一個獨立的 GAS script(各自有 `appsscript.json`、`env.js`、`code.js`,並各自 `clasp push`)。

## 開發指令

```bash
clasp login          # 首次登入 Google 帳號
clasp pull           # 從 GAS 拉取最新程式碼
clasp push           # 推送本地修改到 GAS
clasp deploy         # 建立新部署版本
clasp open           # 瀏覽器開啟 Apps Script 編輯器
```

主專案與每個子專案各有自己的 `.clasp.json`,請 `cd` 到對應目錄再執行 `clasp push`。

### 初始化工作表
首次部署或新增欄位時,在 Apps Script 編輯器執行:
```javascript
deployAllSheets()   // deploy.js:位於檔案尾端,建立/補齊所有必要工作表表頭
```

### 無自動化測試
需手動驗證:Apps Script 編輯器直接呼叫後端函式 → 部署 Web App 跑完整流程 → 檢查試算表寫入結果 → 分別用一般使用者與管理員測權限。

## 架構重點

### 1. 雙總表 + V3 資料抽象層

資料分成 **財產總表** (`PROPERTY_MASTER_SHEET_NAME`) 與 **物品總表** (`ITEM_MASTER_SHEET_NAME`) 兩張 sheet,欄位布局不同。所有查詢都必須透過 `code.js` 頂端的統一資料層,**不要直接讀 raw row**:

- `PROPERTY_COLUMN_INDICES` / `ITEM_COLUMN_INDICES`:以物件表示欄位索引(1-based),新增/移動欄位時**只改這裡**。
- `mapRowToAssetObject(row, indices, sourceSheet)`:把 row 轉成標準化 asset object。
- `getAllAssets()`:合併兩張總表,回傳統一陣列。
- `findAssetLocation(assetId)`:定位某筆資產所在的 sheet/row。

這是「V3 物件化架構」,舊的 `MASTER_*` 常數已棄用,加新功能請沿用 V3 模式。

### 2. Web App 入口:單頁應用

`doGet(e)` (`code.js:794`) **目前只會回傳 `userstate.html`**;歷史上的 `?page=apply/review/lending/scrap/inventory/...` 已整併進單頁應用,轉移、出借、歸還、報廢、盤點、ISMS 分類皆為 userstate.html 內嵌的 modal / bottom sheet。新增功能時請以 SPA 心態修改 `userstate.html` + `code.js`,不要再新增獨立頁面。

`userstate.html` 超過 14k 行,修改前先用 Grep 定位區塊。

另外還有一組從試算表選單觸發的 modal 函式:`openPortal` / `openApplyPage` / `openUpdatePage` / `openReviewDashboard` (`code.js:586-648`),這些是 Sheet UI,與 Web App 入口分離。

### 3. 全域存取控制

**所有 Web App 請求都會先經過白名單檢查** (`doGet` 前段 + `getAllowedEmails`,`code.js:664`):

- 白名單 = 「保管人/信箱」工作表的 Email 欄 ∪ 「管理員名單」工作表
- 使用 `CacheService` 快取 10 分鐘(cacheKey: `system_access_allowlist`)
- 不在名單內會回傳 `createAccessDeniedPage()`
- 改名單後若沒立即生效,要等快取過期或清除 script cache

後端敏感函式另外會透過 `checkAdminPermissions()` / `isAdmin()` 做二次檢查 — 新增管理用 API 時**務必補上這個檢查**,避免 IDOR。

### 4. 同組代理轉移

`isGroupProxyTransferEnabled()` 是功能旗標。啟用時,非管理員使用者會看到「同組成員」的資產(以 `getGroupMemberEmails()` 擴展範圍),而不是只看到自己名下的。多個查詢函式都接受 `forceUserScope` 參數來覆寫這個行為(例如 `getUserStateData`、`getTransferData`、`getPendingApprovals`、`getLentOutAssets`、`getAllScrappableItems` 等),新增 list 類 API 時請沿用同一個慣例。

### 5. ISMS 資訊資產對照

系統會把內部資產編號與 ISMS 系統的資訊資產編號做對照,儲存於「資產對照表」工作表。相關函式:`getIsmsAssetList`、`getIsmsMappingForAssets`、`saveIsmsClassification`、`markAssetInventoryWithIsms`。ISMS 試算表 ID 設定在 `env.js` 的 `ISMS_SPREADSHEET_ID`。盤點流程會同時寫回 ISMS 相關欄位 — 修改盤點邏輯時要留意 `markBatch*` 系列的 ISMS 分支。

### 6. 關鍵工作流程

- **轉移**:`processBatchTransferApplication` → 寫入「轉移申請紀錄」→ `processBatchApproval` / `processBatchRejection` 審核 → 更新總表的保管人/使用人/地點,並產生 Google Docs 轉移單 (`createTransferDoc`)。轉移類型分「地點/保管人/使用人」,由 `AL_TRANSFER_TYPE_COLUMN_INDEX` 記錄。
- **出借/歸還**:`processBatchLending` / `processBatchReturn`,可產出外部出借申請單 (`createLendingDoc`,分組列印靠 `getExternalLendingPrintGroups`)。
- **報廢**:`processBatchScrapping` → 狀態 `在庫 → 報廢中 → 已報廢`;可透過 `restoreFromScrap` 還原;產生 Docs 用 `createScrapDoc` / `createScrapDocByDateRange`。
- **盤點**:`startInventorySession` → `markBatchInventory` / `resetBatchInventory`(寫入「盤點明細」)→ `updateInventoryProgress` → `completeInventorySession`。active session 的寫入有一組 `*InActiveSessions` helper,**修改明細時請走這些 helper**,不要只更新單一 session。
- **批次匯入**:詳細檔案格式見 `batchimport.md`;入口在 `userstate.html` 的「新增資產」modal → `addNewAssetsBatch()`。

### 7. 子專案

各子專案是獨立 GAS script,**不共用常數**。`computer-report` 只讀取 `PROPERTY_COLUMN_INDICES` 的子集,因此在主專案新增欄位時,不需要同步到它,但**移動現有欄位時要同步更新**每個子專案的索引物件。

## GAS 特殊限制

### 序列化
GAS 無法序列化 `Date`, `Map`, `Set`。後端函式回傳前必須轉換:
```javascript
return {
  timestamp: new Date().toISOString(),  // ✅
  items: Array.from(mySet)              // ✅
};
```

### 時區
`appsscript.json` 設為 `Asia/Taipei`;寫入時間戳時若用 `new Date()` 直接存到 sheet 會走此時區,但跨函式傳遞請都用 ISO string。

### 存取模式
`"access": "DOMAIN"` — Web App 限網域內使用者。搭配第 3 點的白名單做雙重防護。

## 編碼風格

- 2 空格縮排(JS/HTML)
- 函式/變數 `camelCase`,常數 `SCREAMING_SNAKE_CASE`
- 註解用繁體中文,保持簡潔
- 工作表名稱、欄位索引集中在檔案頂部
- 避免 `innerHTML`(XSS),用 `textContent` 或樣板

## 部署流程

1. 修改本地程式碼
2. 對應目錄 `clasp push`
3. Apps Script 編輯器手動測試
4. `clasp deploy` 建新版本
5. 更新 Web App 部署設定(必要時)
