# Google Sheets 資產管理系統部署說明

本文件說明如何將此資產管理系統部署到 Google Sheets 環境。

## 📋 目錄

1. [前置準備](#前置準備)
2. [環境設定](#環境設定)
3. [使用 clasp 部署](#使用-clasp-部署)
4. [建立必要的工作表](#建立必要的工作表)
5. [設定環境變數](#設定環境變數)
6. [發布 Web App](#發布-web-app)
7. [測試部署](#測試部署)
8. [常見問題](#常見問題)

---

## 前置準備

### 必要工具

1. **Node.js** (版本 14 或以上)
   ```bash
   node --version
   npm --version
   ```

2. **clasp** (Command Line Apps Script Projects)
   ```bash
   npm install -g @google/clasp
   ```

3. **Google 帳號**
   - 需要有 Google Workspace 或 Google 帳號
   - 建議使用組織 Google Workspace 帳號以確保網域限制功能正常

### 檔案檢查清單

確認您的專案包含以下檔案：

- ✅ `code.js` - 後端主程式
- ✅ `env.js` - 環境變數設定
- ✅ `appsscript.json` - Apps Script 設定檔
- ✅ `Index.html` - 電腦狀態回報頁面
- ✅ `portal.html` - 入口頁面
- ✅ `apply.html` - 財產轉移申請
- ✅ `review.html` - 轉移接收
- ✅ `lending.html` - 財產出借
- ✅ `return.html` - 歸還管理
- ✅ `scrap.html` - 財產報廢
- ✅ `printScrap.html` - 列印報廢單
- ✅ `update.html` - 更新上傳狀態
- ✅ `userstate.html` - 個人財產狀態查詢
- ✅ `inventory.html` - 資產盤點（新增）
- ✅ `shared-nav.html` - 共用導航列

---

## 環境設定

### 1. 建立 Google 試算表

1. 前往 [Google Sheets](https://sheets.google.com)
2. 建立新的試算表
3. 命名為「資產管理系統」或您偏好的名稱
4. 從網址列複製試算表 ID（位於 `/d/` 和 `/edit` 之間）
   ```
   https://docs.google.com/spreadsheets/d/[這裡是ID]/edit
   ```

### 2. 建立報廢文件範本（選用）

如果需要使用報廢文件產生功能：

1. 建立兩個 Google 文件作為範本：
   - 財產報廢申請範本
   - 非消耗品報廢申請範本

2. 在範本中使用以下佔位符號：
   - `{{申請人}}` - 申請人姓名
   - `{{申請日期}}` - 申請日期
   - `{{財產編號}}` - 財產編號
   - `{{財產名稱}}` - 財產名稱
   - `{{報廢原因}}` - 報廢原因
   - （更多佔位符號請參考 `code.js` 中的 `createScrapDoc()` 函式）

3. 複製範本文件 ID

### 3. 建立輸出資料夾

1. 在 Google Drive 建立資料夾用於存放生成的報廢文件
2. 複製資料夾 ID（從網址列）

---

## 使用 clasp 部署

### 初次部署

#### 1. 登入 Google 帳號

```bash
clasp login
```

這會開啟瀏覽器，請登入您的 Google 帳號並授權。

#### 2. 建立 Apps Script 專案

如果是全新專案：

```bash
# 在專案目錄中執行
clasp create --title "資產管理系統" --type sheets --rootDir .
```

如果已有現成的 Google Sheets：

```bash
# 開啟您的試算表，前往 擴充功能 > Apps Script
# 複製專案 Script ID（從專案設定中）
clasp clone [YOUR_SCRIPT_ID]
```

#### 3. 編輯 `.clasp.json`

確認 `.clasp.json` 檔案內容：

```json
{
  "scriptId": "YOUR_SCRIPT_ID",
  "rootDir": "."
}
```

#### 4. 推送程式碼

```bash
clasp push
```

如果遇到問題，可以強制推送：

```bash
clasp push --force
```

### 更新部署

當您修改程式碼後，只需執行：

```bash
clasp push
```

---

## 建立必要的工作表

### 自動建立的工作表

以下工作表會在第一次使用相關功能時自動建立：

- ✅ **盤點紀錄** - 資產盤點會話記錄
- ✅ **盤點明細** - 資產盤點明細資料

### 手動建立的工作表

請在 Google 試算表中手動建立以下工作表（含標題列）：

#### 1. **財產總表** (必要)

建立工作表並設定標題列（第一列）：

| A | B | C | D | E | F | G | H | I | J | K | L | M | N | O | P | Q | R | S | T | U | V | W | X | Y |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 財產編號 | 財產名稱 | ... | ... | ... | 取得日期 | 使用年限 | 保管地點 | ... | 保管人 | 使用者 | 財產類別 | 保管人Email | 使用者Email | 財產狀態 | 申請時間 | 接收時間 | 是否上傳 | 上傳時間 | 是否為駐站電腦 | 報廢日期 | 報廢原因 | 報廢申請文件 | ... | 是否為電腦 |

#### 2. **物品總表** (必要)

建立工作表並設定標題列（第一列）：

| A | B | C | D | E | F | G | H | I | J | K | L | M | N | O | P | Q | R | S | T | U | V | W | X | Y |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 物品編號 | 物品名稱 | ... | ... | 取得日期 | 使用年限 | ... | ... | ... | 財產類別 | 保管人 | ... | 保管地點 | 保管人Email | 財產狀態 | 申請時間 | 接收時間 | 是否上傳 | 上傳時間 | 是否為駐站電腦 | 報廢日期 | 報廢原因 | 報廢申請文件 | ... | 是否為電腦 |

#### 3. **表單回應 1** (必要 - 電腦回報功能)

| A | B | C | D | E | F | G | H | I |
|---|---|---|---|---|---|---|---|---|
| 時間戳記 | 財產編號 | Windows更新 | Chrome更新 | 防毒軟體 | 7-Zip版本 | 保管人 | 保管人Email | 其他備註 |

#### 4. **轉移申請紀錄** (必要 - 轉移功能)

| A | B | C | D | E | F | G | H | I | J | K | L | M | N | O |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 申請編號 | 申請時間 | 財產編號 | 原保管人 | 原地點 | 新保管人 | 新地點 | 狀態 | 新保管人Email | 審核時間 | 審核連結 | 原使用人 | 新使用人 | 新使用人Email | 轉移類型 |

#### 5. **出借紀錄** (必要 - 出借功能)

| A | B | C | D | E | F | G | H | I |
|---|---|---|---|---|---|---|---|---|
| 出借編號 | 出借時間 | 財產編號 | 財產名稱 | 原保管人 | 借用人 | 預計歸還日期 | 出借地點 | 狀態 |

#### 6. **管理員名單** (必要 - 權限管理)

| A |
|---|
| Email |
| admin1@example.com |
| admin2@example.com |

#### 7. **軟體版本清單** (選用 - 電腦回報功能)

| A |
|---|
| 7-Zip版本 |
| 23.01 |

---

## 設定環境變數

### 編輯 `env.js`

在部署前，請務必更新 `env.js` 檔案中的環境變數：

```javascript
// env.js

// Google 試算表 ID
const SPREADSHEET_ID = "YOUR_SPREADSHEET_ID_HERE";

// 報廢文件範本 ID
const SCRAP_TEMPLATE_DOC_ID_PROPERTY = "PROPERTY_TEMPLATE_DOC_ID";
const SCRAP_TEMPLATE_DOC_ID_NON_CONSUMABLE = "NON_CONSUMABLE_TEMPLATE_DOC_ID";

// 報廢文件輸出資料夾 ID
const SCRAP_OUTPUT_FOLDER_ID = "OUTPUT_FOLDER_ID";
```

**⚠️ 重要：**
- 請將佔位符號替換為實際的 ID
- 不要將真實 ID 提交到公開的版本控制系統
- 建議將 `env.js` 加入 `.gitignore`

### 推送更新

修改 `env.js` 後，記得推送：

```bash
clasp push
```

---

## 發布 Web App

### 1. 開啟 Apps Script 編輯器

```bash
clasp open
```

或直接在瀏覽器中開啟您的試算表，然後前往：
**擴充功能 > Apps Script**

### 2. 部署 Web 應用程式

1. 在 Apps Script 編輯器中，點擊右上角的「部署」按鈕
2. 選擇「新增部署作業」
3. 點擊「選取類型」，選擇「網頁應用程式」
4. 設定部署參數：

   - **說明**：資產管理系統 v1.0（或您的版本號）
   - **執行身分**：我（您的電子郵件）
   - **具有存取權的使用者**：
     - 組織內使用：選擇「僅限我的組織中的使用者」
     - 公開使用：選擇「所有人」（不建議）

5. 點擊「部署」
6. 授權應用程式（首次部署需要）
7. 複製「網頁應用程式網址」

### 3. 設定授權

首次執行可能需要授權以下權限：

- ✅ 查看和管理您的試算表
- ✅ 查看和管理您的 Google 文件
- ✅ 傳送電子郵件
- ✅ 連線到外部服務

### 4. 更新部署

當您修改程式碼並推送後，需要建立新版本：

1. `clasp push` 推送程式碼
2. 在 Apps Script 編輯器中，點擊「部署」>「管理部署作業」
3. 點擊現有部署旁的編輯圖示 ✏️
4. 選擇「新版本」
5. 點擊「部署」

---

## 測試部署

### 1. 測試入口頁面

開啟您的 Web 應用程式網址（從部署步驟取得），應該會看到：

- 財產管理入口頁面
- 9 個功能卡片（包含新的「資產盤點」）
- 點擊任一功能應能正常導航

### 2. 測試資產盤點功能

1. 點擊「資產盤點」卡片
2. 確認頁面載入正常
3. 嘗試選擇篩選條件（全部/地點/保管人）
4. 點擊「開始盤點」
5. 檢查是否自動建立以下工作表：
   - 盤點紀錄
   - 盤點明細

### 3. 測試其他功能

- ✅ 電腦狀態回報
- ✅ 財產轉移申請
- ✅ 轉移接收
- ✅ 財產出借
- ✅ 歸還管理
- ✅ 財產報廢
- ✅ 列印報廢單
- ✅ 更新上傳狀態
- ✅ 個人財產狀態查詢
- ✅ 資產盤點

### 4. 檢查權限

1. 使用不同帳號測試
2. 確認管理員功能只有管理員名單中的使用者可以存取
3. 測試資產擁有者權限（只能操作自己的資產）

### 5. 測試日誌

在 Apps Script 編輯器中查看執行記錄：

1. 點擊左側「執行」圖示
2. 檢查最近的執行記錄
3. 確認沒有錯誤訊息

---

## 常見問題

### Q1: clasp push 失敗

**問題**：執行 `clasp push` 時出現錯誤

**解決方案**：
```bash
# 重新登入
clasp logout
clasp login

# 確認專案設定
cat .clasp.json

# 強制推送
clasp push --force
```

### Q2: 找不到試算表

**問題**：執行時出現「找不到工作表」錯誤

**解決方案**：
1. 確認 `env.js` 中的 `SPREADSHEET_ID` 是否正確
2. 確認執行身分有該試算表的編輯權限
3. 確認工作表名稱與 `code.js` 中的常數一致：
   - `PROPERTY_MASTER_SHEET_NAME = "財產總表"`
   - `ITEM_MASTER_SHEET_NAME = "物品總表"`

### Q3: 權限錯誤

**問題**：使用者無法存取特定功能

**解決方案**：
1. 確認「管理員名單」工作表已建立
2. 確認使用者 Email 已加入管理員名單
3. Email 比對不區分大小寫，但需完全符合
4. 注意快取時間（10分鐘），更新管理員名單後需等待

### Q4: Web App 顯示空白

**問題**：開啟 Web App 網址但頁面空白

**解決方案**：
1. 檢查瀏覽器控制台是否有 JavaScript 錯誤
2. 確認所有 HTML 檔案都已推送（`clasp push`）
3. 確認 `doGet()` 函式正常運作
4. 檢查 `include()` 函式是否正確載入 `shared-nav.html`

### Q5: 無法傳送 Email

**問題**：轉移通知等 Email 無法送出

**解決方案**：
1. 確認 Apps Script 專案已授權「傳送電子郵件」權限
2. 檢查 Gmail 配額限制（每日約 100-1500 封，視帳號類型而定）
3. 確認收件者 Email 格式正確
4. 檢查執行記錄中的錯誤訊息

### Q6: 盤點功能找不到資產

**問題**：開始盤點後顯示「沒有符合條件的資產」

**解決方案**：
1. 確認資產狀態為「在庫」（code.js:2032）
2. 確認財產總表和物品總表有資料
3. 檢查篩選條件是否正確
4. 確認 `getAllAssets()` 函式正常運作

### Q7: 盤點工作表未自動建立

**問題**：使用盤點功能但工作表未建立

**解決方案**：
1. 手動執行 `createInventorySheets()` 函式
2. 在 Apps Script 編輯器中：
   - 選擇函式：`createInventorySheets`
   - 點擊執行按鈕
3. 檢查執行權限是否足夠

---

## 進階設定

### 自訂功能表

在試算表中加入自訂功能表（可選）：

```javascript
// 在 code.js 中加入
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('財產管理系統')
    .addItem('開啟入口頁面', 'openPortal')
    .addSeparator()
    .addItem('資產盤點', 'openInventory')
    .addItem('財產轉移', 'openApply')
    .addItem('報廢申請', 'openScrap')
    .addToUi();
}

function openPortal() {
  const url = getAppUrl();
  const html = '<script>window.open("' + url + '", "_blank");</script>';
  SpreadsheetApp.getUi().showModalDialog(
    HtmlService.createHtmlOutput(html),
    '開啟中...'
  );
}
```

### 設定觸發條件

設定每月自動提醒（電腦回報功能）：

1. 在 Apps Script 編輯器中
2. 左側選單 > 觸發條件
3. 新增觸發條件：
   - 選擇函式：`checkComputerReportsAndNotify`
   - 事件來源：時間驅動
   - 時間型觸發條件類型：月計時器
   - 選取月份日期：1
   - 選取時段：凌晨 1-2 點

---

## 維護與監控

### 定期檢查

- ✅ 每週檢查執行記錄是否有錯誤
- ✅ 每月檢查資料庫大小（Google Sheets 限制）
- ✅ 定期備份試算表資料
- ✅ 檢查 Email 配額使用情況

### 效能優化

- 當資料量超過 5000 筆時，考慮使用分頁載入
- 定期清理已完成的舊記錄
- 使用快取功能減少工作表讀取次數

### 版本管理

建議使用 Git 管理程式碼版本：

```bash
# 每次更新前
git pull origin main

# 修改後提交
git add .
git commit -m "描述您的變更"
git push origin main

# 然後部署
clasp push
```

---

## 支援與聯絡

如有任何問題，請參考：

- [Apps Script 官方文件](https://developers.google.com/apps-script)
- [clasp 使用說明](https://github.com/google/clasp)
- [專案 CLAUDE.md](./CLAUDE.md) - 系統架構說明

---

**版本歷史**

- v1.1.0 (2025-01-14) - 新增資產盤點功能
- v1.0.0 - 初始版本

**最後更新**: 2025-01-14
