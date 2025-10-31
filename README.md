# 財產管理系統 (Asset Management System)

基於 Google Apps Script 開發的企業級資產管理網頁應用程式，提供完整的資產生命週期管理功能，包括電腦、財產及非消耗品的全方位管理解決方案。

## ✨ 功能特點

### 核心功能
- **資產轉移管理** - 支援批次資產轉移申請與審核流程
- **資產借用歸還** - 完整的借用記錄與歸還管理機制
- **資產報廢處理** - 報廢申請、審核及文件自動產生
- **電腦狀態回報** - 定期電腦健康狀態檢查與回報
- **個人資產查詢** - 快速查詢個人保管及借用資產狀態
- **管理員功能** - 資產狀態更新、上傳確認等進階管理功能

### 系統特色
- 🔄 **雙表整合架構** - 統一管理財產總表與物品總表，提供一致的操作介面
- 📊 **動態數據流** - 自動從資產清單提取保管人、地點等參考資料，無需維護額外對照表
- ✉️ **自動通知機制** - 重要操作自動發送 Email 通知相關人員
- 📱 **響應式設計** - 支援 PWA (Progressive Web App) 功能，可在各種裝置上使用
- 🔒 **權限控制** - 基於 Email 的身份驗證與管理員白名單機制
- 💾 **快取優化** - 使用 CacheService 提升系統效能

## 🏗️ 技術架構

### 技術棧
- **後端**: Google Apps Script (JavaScript V8 Runtime)
- **資料庫**: Google Sheets
- **前端**: HTML5 + CSS3 + JavaScript
- **文件產生**: Google Docs API
- **通知服務**: Gmail API (MailApp)
- **快取服務**: CacheService

### V3 資料抽象層架構

本系統實現了先進的物件導向資料抽象層，完全解耦應用邏輯與實體儲存：

```javascript
// 統一物件模型
getAllAssets()          // 從雙表讀取並回傳標準化資產物件陣列
findAssetLocation()     // 抽象化資產定位邏輯
mapRowToAssetObject()   // 將工作表列轉換為 JavaScript 物件
```

**架構優勢**：
- ✅ 功能實作**絕不直接存取**工作表資料
- ✅ 統一使用 `getAllAssets()` 讀取資產
- ✅ 使用 `findAssetLocation()` 更新特定資產
- ✅ 根據回傳的 sheetName 使用正確的欄位索引

### 資料表結構

| 工作表名稱 | 用途 | 說明 |
|-----------|------|------|
| 財產總表 | 財產資產主檔 | 儲存財產類資產資料 |
| 物品總表 | 物品資產主檔 | 儲存非消耗品資料 |
| 表單回應 1 | 電腦回報記錄 | 儲存電腦狀態回報資料 |
| 轉移申請紀錄 | 轉移申請日誌 | 記錄所有轉移申請 |
| 出借紀錄 | 借用日誌 | 記錄所有借用歸還 |
| 管理員名單 | 權限管理 | 定義系統管理員清單 |
| 軟體版本清單 | 參考資料 | 儲存軟體版本資訊 |

## 📋 系統需求

- Google Workspace 帳號 (具有網域權限)
- Google Apps Script 專案
- Google Sheets 試算表
- Node.js 和 npm (僅開發部署時需要)
- clasp (Google Apps Script CLI)

## 🚀 安裝與部署

### 1. 環境設定

```bash
# 安裝 clasp 命令列工具
npm install -g @google/clasp

# 登入 Google 帳號
clasp login
```

### 2. Clone 專案

```bash
git clone https://github.com/takahope/asset_managment.git
cd asset_managment
```

### 3. 設定環境變數

編輯 `env.js` 檔案，設定以下資訊：

```javascript
// Google Sheets 試算表 ID (從試算表網址取得)
const SPREADSHEET_ID = "YOUR_SPREADSHEET_ID";

// 報廢文件範本 ID
const SCRAP_TEMPLATE_DOC_ID_PROPERTY = "YOUR_PROPERTY_TEMPLATE_ID";
const SCRAP_TEMPLATE_DOC_ID_NON_CONSUMABLE = "YOUR_NON_CONSUMABLE_TEMPLATE_ID";

// 報廢文件輸出資料夾 ID
const SCRAP_OUTPUT_FOLDER_ID = "YOUR_FOLDER_ID";
```

⚠️ **安全提醒**：請勿將真實的 ID 提交至版控系統

### 4. 建立 Apps Script 專案

```bash
# 建立新專案 (首次使用)
clasp create --type sheets --title "財產管理系統"

# 或連結現有專案
clasp clone YOUR_SCRIPT_ID
```

### 5. 部署應用程式

```bash
# 推送程式碼到 Google Apps Script
clasp push

# 部署為網頁應用程式
clasp deploy --description "Production Release v1.0"
```

### 6. 設定觸發器

在 Google Apps Script 編輯器中設定時間驅動觸發器：

1. 開啟專案的觸發器設定
2. 新增觸發器
3. 選擇函式：`checkComputerReportsAndNotify`
4. 事件來源：時間驅動
5. 類型：月計時器
6. 儲存

## ⚙️ 設定說明

### 工作表名稱設定 (code.js 第 8-15 行)

```javascript
const PROPERTY_MASTER_SHEET_NAME = "財產總表";
const ITEM_MASTER_SHEET_NAME = "物品總表";
const RESPONSE_SHEET_NAME = "表單回應 1";
const APPLICATION_LOG_SHEET_NAME = "轉移申請紀錄";
const LENDING_LOG_SHEET_NAME = "出借紀錄";
const ADMIN_LIST_SHEET_NAME = "管理員名單";
```

### 網頁應用程式設定 (appsscript.json)

```json
{
  "timeZone": "Asia/Taipei",
  "webapp": {
    "executeAs": "USER_ACCESSING",  // 以存取者身份執行
    "access": "DOMAIN"               // 限組織內使用
  }
}
```

## 📖 使用指南

### 存取應用程式

網頁應用程式可透過以下方式存取：

```
主入口: https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
特定頁面: https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec?page=apply
```

### 頁面路由

| URL 參數 | 頁面 | 功能 |
|---------|------|------|
| (無) | portal.html | 主入口頁面 |
| page=report | Index.html | 電腦狀態回報 |
| page=apply | apply.html | 資產轉移申請 |
| page=review | review.html | 轉移審核 |
| page=lending | lending.html | 資產借用申請 |
| page=return | return.html | 資產歸還管理 |
| page=scrap | scrap.html | 資產報廢申請 |
| page=printScrap | printScrap.html | 報廢文件產生 |
| page=update | update.html | 管理員狀態更新 |
| page=userstate | userstate.html | 個人資產查詢 |

### 工作流程說明

#### 1️⃣ 資產轉移流程

```
申請人選擇資產 (狀態: 在庫)
    ↓
送出轉移申請
    ↓
系統更新狀態為「待接收」
    ↓
發送 Email 通知新保管人
    ↓
新保管人審核並接收
    ↓
狀態更新為「在庫」
```

**相關檔案**：
- 前端：`apply.html`、`review.html`
- 後端：`processBatchTransferApplication()` (code.js:514-774)

#### 2️⃣ 資產借用流程

```
保管人選擇資產 (狀態: 在庫)
    ↓
填寫借用人、預計歸還日期
    ↓
送出借用申請
    ↓
狀態更新為「出借中」
    ↓
記錄至出借紀錄表
    ↓
歸還時透過歸還頁面處理
    ↓
狀態恢復為「在庫」
```

**相關檔案**：
- 前端：`lending.html`、`return.html`
- 後端：`processBatchLending()` (code.js:942-1144)

#### 3️⃣ 資產報廢流程

```
使用者申請報廢 (狀態: 在庫)
    ↓
狀態更新為「報廢中」
    ↓
管理員確認報廢
    ↓
狀態更新為「已報廢」
    ↓
(選用) 產生報廢文件
```

**相關檔案**：
- 前端：`scrap.html`、`printScrap.html`
- 後端：`processBatchScrapping()` (code.js:1182-1613)

#### 4️⃣ 電腦回報流程

```
使用者開啟回報表單
    ↓
填寫電腦狀態資訊
  - Windows 更新狀態
  - Chrome 更新狀態
  - 防毒軟體狀態
  - 7-Zip 版本
    ↓
送出表單
    ↓
資料寫入「表單回應 1」
```

**相關檔案**：
- 前端：`Index.html`
- 後端：`processFormData()` (code.js)

### 狀態流程圖

```
在庫 (In Stock)
  ├─→ 待接收 (Pending Transfer) ──→ 在庫 (Approved)
  ├─→ 出借中 (Lent Out) ──────────→ 在庫 (Returned)
  └─→ 報廢中 (Scrapping) ─────────→ 已報廢 (Scrapped)
```

## 📂 專案結構

```
asset_managment/
├── code.js                 # 主要後端邏輯 (~1700 行)
│   ├── 全域設定 (1-92)
│   ├── 資料抽象層 (94-193)
│   ├── UI 選單處理器 (196-295)
│   ├── 網頁應用路由 (297-396)
│   ├── 資產轉移工作流程 (514-774)
│   ├── 借用/歸還工作流程 (942-1144)
│   ├── 報廢工作流程 (1182-1613)
│   └── 管理員功能 (1309-1451)
│
├── env.js                  # 環境變數設定
├── appsscript.json        # Apps Script 專案設定
│
├── portal.html            # 主入口頁面
├── Index.html             # 電腦狀態回報表單
├── apply.html             # 資產轉移申請
├── review.html            # 轉移審核儀表板
├── lending.html           # 資產借用申請
├── return.html            # 歸還管理
├── scrap.html             # 報廢申請
├── printScrap.html        # 報廢文件產生
├── update.html            # 管理員狀態更新
├── userstate.html         # 個人資產查詢
├── shared-nav.html        # 共用導航元件
│
├── CLAUDE.md              # 專案開發指南
├── .claspignore           # clasp 忽略檔案
└── .gitignore             # Git 忽略檔案
```

## 🔧 開發指南

### 本地開發

```bash
# 從 Google Apps Script 拉取最新程式碼
clasp pull

# 編輯檔案後推送
clasp push

# 開啟線上編輯器
clasp open
```

### 除錯與測試

```javascript
// 在程式碼中加入 Logger
Logger.log("除錯訊息: " + JSON.stringify(data));

// 在 Apps Script 編輯器中查看日誌
// 檢視 > 日誌
```

**測試方式**：
- 透過 Google Sheets 的自訂選單「財產管理系統」進行功能測試
- 透過網頁應用程式 URL 進行前端介面測試
- 使用不同權限的帳號測試權限控制功能

### 重要開發模式

#### ✅ 正確做法

```javascript
// 使用資料抽象層
const assets = getAllAssets();
const location = findAssetLocation(assetId);

// 使用專用工具讀取檔案
const content = // 使用 Read 工具

// 直接輸出訊息給使用者
return "操作成功完成";
```

#### ❌ 避免做法

```javascript
// 直接存取工作表 (違反抽象層原則)
const sheet = ss.getSheetByName("財產總表");
const data = sheet.getDataRange().getValues();

// 使用 bash 命令讀取檔案 (應使用 Read 工具)
cat file.txt

// 使用 echo 輸出訊息 (應直接輸出文字)
echo "訊息"
```

### 常見陷阱

1. **資產狀態相依性**：許多操作要求 status = '在庫'，執行前務必檢查
2. **欄位索引 Off-by-One**：工作表欄位從 1 開始，JavaScript 陣列從 0 開始
3. **Email 大小寫**：比對 Email 時務必使用 `.toLowerCase()`
4. **工作表名稱上下文**：更新資產時使用正確的欄位索引
5. **快取失效**：管理員清單有 10 分鐘快取，變更不會立即生效
6. **日期格式化**：報廢文件需處理 GMT 時間戳記與民國曆日期

## 🔐 安全性模型

- **網頁存取**：限組織網域內使用 (DOMAIN)
- **執行身份**：以存取者身份執行 (USER_ACCESSING)
- **管理員功能**：透過管理員名單工作表的 Email 白名單保護
- **資產所有權**：多數操作限制為資產保管人 (leaderEmail 比對)
- **取消權限**：僅資產擁有者或管理員可取消轉移/報廢

## 📊 快取策略

```javascript
const cache = CacheService.getScriptCache();
const cacheKey = 'admin_emails_list';
const cachedData = cache.get(cacheKey);
if (cachedData) return JSON.parse(cachedData);

// 從工作表取得資料
cache.put(cacheKey, JSON.stringify(data), 600); // TTL: 10 分鐘
```

**快取應用**：
- `getAdminEmails()` - 管理員 Email 清單
- `getReportAdmins()` - 回報管理員清單

## 🔔 自動通知機制

### Email 通知範本

```javascript
MailApp.sendEmail({
  to: recipientEmail,
  subject: subject,
  body: body
});
```

**通知時機**：
- 資產轉移申請送出
- 借用申請完成
- 月底電腦回報提醒 (未回報者)
- 報廢申請狀態變更

### 定期提醒設定

`checkComputerReportsAndNotify()` 函式應設定為每月執行的時間驅動觸發器，會：
1. 檢查本月未回報的電腦
2. 發送個別提醒給保管人
3. 發送彙整摘要給回報管理員

## 🤝 貢獻指南

歡迎提交 Issue 或 Pull Request！

開發流程：
1. Fork 本專案
2. 建立功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交變更 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

## 📝 授權

本專案採用私有授權，僅供組織內部使用。

## 📞 聯絡資訊

如有問題或建議，請透過以下方式聯絡：
- 建立 GitHub Issue
- 聯絡專案維護者

---

**最後更新**：2025-10-31
**版本**：3.0
**維護者**：takahope
