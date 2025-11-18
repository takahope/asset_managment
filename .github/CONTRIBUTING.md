# 貢獻指南 (Contributing Guide)

感謝您對財產管理系統專案的興趣！我們歡迎所有形式的貢獻。

## 目錄 (Table of Contents)

- [開發環境設定](#開發環境設定)
- [開發流程](#開發流程)
- [編碼規範](#編碼規範)
- [架構原則](#架構原則)
- [測試指南](#測試指南)
- [提交規範](#提交規範)

## 開發環境設定

### 必要工具

1. **Node.js** (v14 或更新版本)
2. **clasp** (Google Apps Script CLI)
   ```bash
   npm install -g @google/clasp
   ```
3. **Git**
4. **Google Workspace 帳號**

### 初始設定

1. Fork 本專案並 clone 到本地：
   ```bash
   git clone https://github.com/YOUR_USERNAME/asset_managment.git
   cd asset_managment
   ```

2. 登入 Google Apps Script：
   ```bash
   clasp login
   ```

3. 建立或連結 Apps Script 專案：
   ```bash
   clasp create --type sheets --title "財產管理系統-開發"
   # 或連結現有專案
   clasp clone YOUR_SCRIPT_ID
   ```

4. 設定環境變數（複製 `env.js` 並填入您的測試環境 ID）

## 開發流程

### 1. 建立功能分支

```bash
git checkout -b feature/your-feature-name
# 或
git checkout -b fix/your-bug-fix
```

### 2. 開發與測試

```bash
# 編輯檔案後，推送到 Apps Script
clasp push

# 開啟線上編輯器檢視
clasp open
```

### 3. 提交變更

```bash
git add .
git commit -m "描述性的提交訊息"
```

### 4. 推送並建立 Pull Request

```bash
git push origin feature/your-feature-name
```

然後在 GitHub 上建立 Pull Request。

## 編碼規範

### 命名規範

1. **變數和函式名稱**：使用英文 camelCase
   ```javascript
   const assetId = "A001";
   function getAssetLocation() { }
   ```

2. **常數**：使用英文 SCREAMING_SNAKE_CASE
   ```javascript
   const PROPERTY_MASTER_SHEET_NAME = "財產總表";
   const RESPONSE_SHEET_NAME = "表單回應 1";
   ```

3. **註解**：使用繁體中文
   ```javascript
   // 取得所有資產資料
   function getAllAssets() {
     // 從財產總表讀取資料
     const propertyData = propertySheet.getDataRange().getValues();
   }
   ```

### 程式碼風格

1. **縮排**：使用 2 個空格
2. **分號**：每行結尾使用分號
3. **引號**：優先使用雙引號 `""`
4. **空白行**：函式之間保留一行空白

## 架構原則

### ⚠️ 必須遵守的核心原則

#### 1. 資料抽象層（最重要！）

**✅ 正確做法**：
```javascript
// 使用抽象層函式
const assets = getAllAssets();
const location = findAssetLocation(assetId);
```

**❌ 錯誤做法**：
```javascript
// 絕對不要直接存取工作表！
const sheet = ss.getSheetByName("財產總表");
const data = sheet.getDataRange().getValues();
```

#### 2. 雙表結構處理

系統有兩個主表：`財產總表` 和 `物品總表`，欄位索引不同。

**✅ 正確做法**：
```javascript
const location = findAssetLocation(assetId);
const indices = location.sheetName === PROPERTY_MASTER_SHEET_NAME
  ? PROPERTY_COLUMN_INDICES
  : ITEM_COLUMN_INDICES;

location.sheet.getRange(location.rowIndex, indices.ASSET_STATUS).setValue('在庫');
```

#### 3. 使用者欄位可用性

`userName` 和 `userEmail` 只存在於財產總表：

```javascript
// 永遠檢查 null
if (asset.userName && asset.userEmail) {
  // 處理使用者資訊
}
```

#### 4. Email 比對

```javascript
// 永遠使用 toLowerCase()
const currentUserEmail = Session.getActiveUser().getEmail().toLowerCase();
const adminEmails = getAdminEmails().map(email => email.toLowerCase());
```

#### 5. 狀態轉換邏輯

遵循狀態機規則：
- 轉移：'在庫' → '待接收' → '在庫'
- 借用：'在庫' → '出借中' → '在庫'
- 報廢：'在庫' → '報廢中' → '已報廢'

#### 6. 轉移類型判斷

```javascript
// 系統會自動判斷轉移類型
// - 僅地點變更 → 不需審核，直接更新
// - 保管人或使用人變更 → 需要審核（待接收）
```

## 測試指南

### 手動測試清單

在提交 PR 前，請完成以下測試：

#### 資產轉移功能
- [ ] 僅變更地點（應直接完成，不需審核）
- [ ] 變更保管人（應進入待接收狀態）
- [ ] 變更使用人（應進入待接收狀態）
- [ ] 同時變更保管人和使用人
- [ ] 驗證 Email 通知是否正確發送

#### 借用/歸還功能
- [ ] 借用資產
- [ ] 歸還資產
- [ ] 檢查出借紀錄是否正確

#### 報廢功能
- [ ] 申請報廢
- [ ] 管理員確認報廢
- [ ] 產生報廢文件

#### 權限控制
- [ ] 一般使用者只能操作自己的資產
- [ ] 管理員功能需要管理員權限
- [ ] 測試不同 Email 的使用者

### 測試環境

1. 使用測試用的 Google Sheets，不要使用正式環境
2. 測試資料應包含：
   - 財產總表的資產（有使用者欄位）
   - 物品總表的資產（無使用者欄位）
   - 不同狀態的資產
   - 不同保管人的資產

## 提交規範

### Commit Message 格式

使用清晰的提交訊息：

```
<類型>: <簡短描述>

<詳細說明（選填）>
```

**類型**：
- `feat`: 新功能
- `fix`: Bug 修復
- `docs`: 文件更新
- `refactor`: 重構
- `style`: 格式調整（不影響程式碼邏輯）
- `test`: 測試相關
- `chore`: 建置或輔助工具變更

**範例**：
```
feat: Add user field support in asset transfer

- Add userName and userEmail fields to PROPERTY_COLUMN_INDICES
- Update transfer logic to handle user changes separately
- Add intelligent notification based on transfer type
```

### Pull Request 規範

1. **標題**：簡潔描述變更內容
2. **描述**：
   - 說明變更的目的和原因
   - 列出主要變更項目
   - 附上測試結果或截圖
   - 關聯相關 Issue
3. **檢查清單**：
   - 確認程式碼遵循編碼規範
   - 已更新相關文件
   - 已完成測試
   - 未包含敏感資訊（真實 ID）

## 安全性注意事項

### ⚠️ 絕對不要提交的內容

1. **真實的 ID**：
   - Google Sheets SPREADSHEET_ID
   - Template Document IDs
   - Folder IDs
   - Script IDs

2. **個人資訊**：
   - 真實的 Email 地址
   - 使用者名稱
   - 組織資訊

3. **認證資訊**：
   - OAuth tokens
   - API keys
   - 密碼

### 正確做法

使用 `env.js` 中的 placeholder 值：
```javascript
const SPREADSHEET_ID = "YOUR_SPREADSHEET_ID_HERE";
```

## 取得協助

如有任何問題，請：

1. 查閱 [README.md](../README.md) 和 [CLAUDE.md](../CLAUDE.md)
2. 搜尋現有的 [Issues](https://github.com/takahope/asset_managment/issues)
3. 建立新的 Issue 詢問

## 行為準則

- 尊重所有貢獻者
- 接受建設性的批評
- 專注於對專案最有利的事情
- 展現對其他社群成員的同理心

感謝您的貢獻！🎉
