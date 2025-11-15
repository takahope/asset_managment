# 代碼重構說明 - 模塊化拆分

## 概述

原本的 `code.js` 文件約 1900+ 行代碼，為了提高可維護性和可讀性，已將其拆分為 10 個功能明確的模塊文件。

## 新的文件結構

```
asset_managment/
├── env.js                  # 環境變量配置 (SPREADSHEET_ID 等)
├── main.js                 # 主入口文件和系統信息
├── config.js               # 全域配置和常量定義
├── dataLayer.js            # 資料抽象層
├── uiHandlers.js           # UI 選單和 Web 路由
├── transferWorkflow.js     # 資產轉移工作流
├── lendingWorkflow.js      # 資產借出/歸還工作流
├── scrapWorkflow.js        # 資產報廢工作流
├── adminFunctions.js       # 管理員功能
├── computerReport.js       # 電腦狀態回報
└── code.js.backup          # 原始文件備份
```

## 各模塊詳細說明

### 1. main.js (主入口)
- 系統版本信息
- 系統初始化函數
- 模塊文檔說明

### 2. config.js (全域配置)
**包含內容：**
- 工作表名稱常量
  - `PROPERTY_MASTER_SHEET_NAME` - 財產總表
  - `ITEM_MASTER_SHEET_NAME` - 物品總表
  - `APPLICATION_LOG_SHEET_NAME` - 轉移申請紀錄
  - `LENDING_LOG_SHEET_NAME` - 出借紀錄
  - `ADMIN_LIST_SHEET_NAME` - 管理員名單
  - 等...

- 欄位索引物件
  - `PROPERTY_COLUMN_INDICES` - 財產總表欄位索引
  - `ITEM_COLUMN_INDICES` - 物品總表欄位索引
  - `AL_*` - 申請紀錄欄位索引
  - `LL_*` - 出借紀錄欄位索引
  - `SV_*` - 軟體版本欄位索引

### 3. dataLayer.js (資料抽象層)
**包含函數：**
- `mapRowToAssetObject(row, indices, sourceSheet)` - 將資料列轉換為資產物件
- `getAllAssets()` - 從兩個總表讀取所有資產
- `findAssetLocation(assetId)` - 查找資產所在工作表和列號

**設計理念：**
- 完全隔離物理儲存和應用邏輯
- 統一的物件模型
- 應用層無需知道資料來自哪個工作表

### 4. uiHandlers.js (UI 處理)
**包含函數：**
- `onOpen()` - 建立自訂選單
- `openPortal()` - 開啟系統入口網站
- `openReportPage()` - 開啟電腦狀態回報
- `openApplyPage()` - 開啟財產轉移申請
- `openUpdatePage()` - 開啟更新已轉移財產
- `openReviewDashboard()` - 開啟審核待轉移財產
- `showLendingDialog()` - 顯示財產出借對話框
- `showReturnDialog()` - 顯示歸還作業對話框
- `showScrapDialog()` - 顯示財產報廢對話框
- `doGet(e)` - Web App 路由處理
- `getUserStateData()` - 獲取使用者財產狀態
- `getAppUrl()` - 獲取 Web App URL
- `include(filename)` - HTML 模板包含功能

### 5. transferWorkflow.js (轉移工作流)
**包含函數：**
- `getTransferData()` - 獲取轉移資料和選項
- `processBatchTransferApplication(formData)` - 處理批次轉移申請
- `getPendingApprovals()` - 獲取待審核申請
- `processBatchApproval(appIds)` - 處理批次審核
- `getAssetsForUpdate()` - 獲取待更新資產
- `processUploadConfirmation(assetIds)` - 處理上傳確認
- `countPendingApprovals()` - 計算待審核數量
- `cancelTransferOrScrap(assetId)` - 取消轉移或報廢

**支援功能：**
- 保管人變更
- 使用人變更
- 地點變更
- 混合變更

### 6. lendingWorkflow.js (借出/歸還工作流)
**包含函數：**
- `getLendingData()` - 獲取出借資料
- `processBatchLending(formData)` - 處理批次出借
- `getLentOutAssets()` - 獲取已出借資產
- `processBatchReturn(lendIds)` - 處理批次歸還

**狀態流轉：**
- 在庫 → 出借中 → 在庫

### 7. scrapWorkflow.js (報廢工作流)
**包含函數：**
- `getScrappableAssets()` - 獲取可報廢資產
- `processBatchScrapping(formData)` - 處理批次報廢
- `processScrapConfirmation(assetIds)` - 處理報廢確認
- `getAllScrappableItems(assetCategory)` - 獲取所有可報廢項目
- `getScrappingDataForAdmin(assetCategory)` - 獲取管理員報廢資料
- `getScrappingApplicants(assetCategory)` - 獲取報廢申請人
- `createScrapDoc(applicantName, assetCategory, assetIds)` - 創建報廢文件

**狀態流轉：**
- 在庫/出借中 → 報廢中 → 已報廢

**特殊功能：**
- 民國日期解析
- 使用年限計算
- Google Docs 報廢文件生成

### 8. adminFunctions.js (管理功能)
**包含函數：**
- `getAdminEmails()` - 獲取管理員郵箱列表（含快取）
- `getReportAdmins()` - 獲取報表管理員（含快取）
- `checkAdminPermissions()` - 檢查管理員權限
- `getAdminName()` - 獲取管理員名稱

**快取策略：**
- 使用 `CacheService` 快取 10 分鐘
- 減少頻繁讀取工作表

### 9. computerReport.js (電腦報告)
**包含函數：**
- `getSelectData()` - 獲取下拉選單資料
- `getSevenZipVersions()` - 獲取 7-Zip 版本列表
- `processFormData(formObject)` - 處理表單資料
- `checkComputerReportsAndNotify()` - 檢查電腦報告並通知

**觸發器：**
- 月度觸發器檢查未回報電腦
- 發送提醒郵件給保管人和管理員

### 10. env.js (環境變量)
**包含內容：**
- `SPREADSHEET_ID` - Google Sheet ID
- `SCRAP_TEMPLATE_DOC_ID_PROPERTY` - 財產報廢模板 ID
- `SCRAP_TEMPLATE_DOC_ID_NON_CONSUMABLE` - 非消耗品報廢模板 ID
- `SCRAP_OUTPUT_FOLDER_ID` - 報廢文件輸出資料夾 ID

⚠️ **注意：** 請勿提交真實 ID 到版本控制

## Google Apps Script 載入機制

Google Apps Script 會自動載入專案中的所有 `.gs` 文件，因此：

1. **無需手動導入** - 所有模塊自動可用
2. **共享全域作用域** - 所有函數和變量在全域可見
3. **載入順序** - 按字母順序載入，但函數定義會被提升

## 模塊依賴關係

```
main.js (文檔用途)
  │
  ├─→ env.js (環境變量)
  ├─→ config.js (配置常量)
  ├─→ dataLayer.js
  │     ↓
  ├─→ uiHandlers.js ──→ 依賴 dataLayer, adminFunctions
  ├─→ transferWorkflow.js ──→ 依賴 dataLayer, config
  ├─→ lendingWorkflow.js ──→ 依賴 dataLayer, config
  ├─→ scrapWorkflow.js ──→ 依賴 dataLayer, config, adminFunctions
  ├─→ adminFunctions.js ──→ 依賴 config
  └─→ computerReport.js ──→ 依賴 dataLayer, config, adminFunctions
```

## 優勢

1. **可維護性提升**
   - 每個文件職責單一，易於理解
   - 函數按功能分組，便於查找

2. **可讀性改善**
   - 文件大小合理（100-400 行）
   - 清晰的模塊邊界

3. **協作友好**
   - 減少合併衝突
   - 便於多人同時開發不同模塊

4. **測試便利**
   - 模塊獨立性強
   - 便於單元測試

## 遷移注意事項

### 對現有功能的影響

✅ **無破壞性變更** - 所有函數簽名保持不變

✅ **向後兼容** - 所有 HTML 前端無需修改

✅ **觸發器兼容** - 現有觸發器（如 `onOpen`、`checkComputerReportsAndNotify`）繼續有效

### 部署步驟

1. **備份現有版本**
   ```bash
   # 原 code.js 已自動備份為 code.js.backup
   ```

2. **推送到 Google Apps Script**
   ```bash
   clasp push
   ```

3. **驗證功能**
   - 測試自訂選單
   - 測試 Web App 路由
   - 測試各項工作流程

4. **刪除舊文件（可選）**
   - 在 Google Apps Script 編輯器中刪除 `code.gs.backup`
   - 或保留作為備份參考

## 常見問題

**Q: 為什麼函數沒有 export/import？**
A: Google Apps Script 使用全域作用域，所有 .gs 文件自動共享變量和函數。

**Q: 如何確保載入順序？**
A: 通過合理的依賴設計（config → dataLayer → 其他模塊），避免循環依賴。

**Q: 性能是否受影響？**
A: 不會。Google Apps Script 會在執行前編譯所有文件，執行時性能與單文件相同。

**Q: 可以進一步拆分嗎？**
A: 可以。例如可將 `transferWorkflow.js` 拆分為 `transferApply.js` 和 `transferApprove.js`。

## 維護建議

1. **保持模塊職責單一** - 新功能加入對應模塊
2. **更新文檔** - 修改函數時更新本文檔
3. **遵循命名規範** - 函數名清晰表達功能
4. **添加註解** - 複雜邏輯務必註解說明

## 版本歷史

- **v3.0.0** (2025-11-15) - 模塊化重構，拆分為 10 個文件
- **v2.x** - V3 架構：資料抽象層
- **v1.x** - 原始單文件版本

---

**重構日期：** 2025-11-15
**重構原因：** 提高代碼可維護性和團隊協作效率
**影響範圍：** 僅後端結構，前端和功能無變化
