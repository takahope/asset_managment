# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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
