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

`doGet(e)` 預設回傳 `userstate_alpine.html`(Alpine.js SPA,2026-07-05 回歸切換後的正式版);`?ui=legacy` 走封存於 `slow_loading_version/userstate.html` 的舊版 React 頁(觀察期回退用,確認穩定後可整個目錄移除)。歷史上的 `?page=apply/review/lending/scrap/inventory/...` 已整併進單頁應用,轉移、出借、歸還、報廢、盤點、ISMS 分類皆為內嵌的 modal / bottom sheet。新增功能時請以 SPA 心態修改 Alpine partial(`alpine_store.html`/`alpine_views.html`/`alpine_modals_*.html` 等)+ `code.js`,不要再新增獨立頁面,也不要修改 `slow_loading_version/` 內的封存檔案。

前端由多個 `alpine_*.html` partial 組成,狀態核心在 `alpine_store.html`(`Alpine.store('app')`),視圖元件在 `alpine_views.html`,各功能 modal 依 P3-P6 拆分於 `alpine_modals_*.html` / `alpine_inventory*.html`。`code.js` 的 `include()` 只解析一層 scriptlet(`createHtmlOutputFromFile` 非遞迴),所有 `<?!= include() ?>` 必須集中寫在 `userstate_alpine.html`(第一層),不可在被 include 的 partial 內再巢狀 include;提升到第一層的 modal/script include 也必須包在有 `x-data` 的容器內,否則 Alpine 不會初始化該子樹。詳見 `example/debug_report_nested_include_fix.md`。

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
- **批次匯入**:詳細檔案格式見 `batchimport.md`;入口在「新增資產」modal(`alpine_modals_asset.html`)→ `addNewAssetsBatch()`。

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

### 2026-09-15 效能嚴重退化修復：消除資產迴圈內 PropertiesService RPC 呼叫（userStateMs 129.6s → 82.9s → <10ms）
- 症狀：部署 AE 欄雙軌聯集同組協作後，首載進度條嚴重停滯（約 135 秒，`userStateMs: 129629`）；前次優化後仍達 85 秒（`userStateMs: 82970`）。
- 根因剖析：
  1. 第一次由 129.6s 降至 82.9s（省下 46.6s），是因為迴圈外預先正規化了操作者組別，減少了 1 次呼叫。
  2. 但仍有 82.9s 的原因在於：`hr_directory.js` 記憶化可能未同步至線上，或 `isms-connect-asset/code.js` 內的未記憶化同名函式 `getHrGroupNameMap_` 覆蓋了主專案函式，導致 `code.js` 逐筆比對 AE 欄 `defaultGroup` 時，每次呼叫 `canonicalizeGroupName_` 依然發動 4,630 次跨網路 `PropertiesService` RPC（每次約 18ms，剛好等於 82.9 秒！）。
  3. 此外，在 `getUserStateData` 的 `.map()` 中，對於管理員（Admin）或本人名下（Owner）資產，動作權限（canTransfer 等）本就為 true，卻仍無差別逐筆呼叫 `isAssetInUserGroupScope_`。
- 修法（縱深防禦 Defense-in-Depth）：
  1. **本體自我記憶化**：在 `code.js` 增加 `CANONICAL_GROUP_NAME_MAP_MEMO_` 與 `CANONICAL_GROUP_CACHE_`，`code.js` 不再依賴外部檔案是否記憶化，內部請求只執行最多 1 次對照表載入，且組別別名只轉換 1 次即快取。
  2. **跨專案函式記憶化**：在 `isms-connect-asset/code.js` 的 `getHrGroupNameMap_` 同步加入 `HR_GROUP_NAME_MAP_MEMO_`，杜絕全域覆寫。
  3. **權限判定短路優化（Short-Circuit）**：在 `getUserStateData` 的 `.map()` 中，Admin 或 Owner 權限恆真時，完全跳過 `isAssetInUserGroupScope_` 的執行。
  4. 驗證：4,630 筆資產在本地模擬測試中，PropertiesService RPC 呼叫由 4,630 次降為 0~1 次，全表計算時間降至 6~7ms。檔案：`code.js`、`hr_directory.js`、`isms-connect-asset/code.js`。

### 2026-09-18 報廢原因（K 欄）與申請方式（Q 欄）職責分離及待報廢列印新增「申請方式」欄位
- 需求：目前報廢申請非本人申請（同組代辦）時，報廢原因欄會夾帶非原因的代辦雜訊。希望「報廢紀錄」K 欄純粹保留選擇的 ABC 代碼（選 C 則為 C 或 C: 補充說明），代辦與本人資訊移至 Q 欄「申請方式」；主檔總表備註同步純化；待報廢列印彈窗（`ScrapPrintModal`）新增「申請方式」欄位並支援排序與即時搜尋。
- 實作：
  1. 欄位與定義：在 `code.js` 新增常數 `SL_APPLY_METHOD_COLUMN_INDEX = 17`；在 `deploy.js` 之 `SCRAP_LOG_HEADERS` 新增第 17 欄 `'申請方式'`。
  2. 後端核心：重構 `processBatchScrapping`，計算純原因 `pureReason`（A/B/C:xxx）與申請方式 `applyMethod`（'本人申請' 或 '同組代辦 (代辦人: XXX)'）；主檔總表備註欄寫入 `pureReason`；報廢紀錄 K 欄寫入 `pureReason`，Q 欄寫入 `applyMethod`；自動檢測並修補 Q1 表頭。
  3. API 與 DTO：在 `getAllScrappableItems`、`getScrappedAssetsByDateRange`、`getHistoricalScrappedAssets` 中索引報廢紀錄 Q 欄並映射至 DTO 的 `applyMethod`（舊資料 fallback 為 '本人申請'）。
  4. 前端呈現：在 `alpine_modals_print.html` 的待報廢資產表格與依日期預覽表格新增「申請方式」欄位，表頭支援點擊三態排序，即時搜尋納入 `applyMethod`。
  5. 驗證：新增單元測試 `testScrapReasonAndApplyMethodSeparation_()`，15 項案例全數通過。檔案：`code.js`、`deploy.js`、`alpine_modals_print.html`。

### 2026-09-18 待列印報廢申請單（ScrapPrintModal）新增批次取消報廢、8 欄位排序與關鍵字即時搜尋
- 需求：使用者希望在「列印報廢申請單」待報廢分頁中，可透過勾選取消報廢申請還原在庫，並具備與移轉待列印相同的欄位排序（升降冪）與關鍵字即時搜尋。
- 排版與實作：在 `code.js` 實作 `processBatchCancelScrap(assetIds)` 批次 API，嚴格驗證權限後還原主表為「在庫」、清空備註/最後修改日、更新 `ScrapLog` 為「已取消」；於 `alpine_modals_print.html` 工具列採緊湊並列排版、8 欄表頭三態排序（升 🔼 ➔ 降 🔽 ➔ 取消）、全選連動 `filteredAssets`、底部新增「取消選取的報廢」按鈕與二次確認；Scoped CSS 保障預建凍結樣式相容；新增單元測試 `testBatchCancelScrapLogic_()`。檔案：`code.js`、`alpine_modals_print.html`。

### 2026-09-18 待列印移轉申請單（TransferPrintModal）新增 12 欄位排序與關鍵字即時搜尋
- 需求：使用者希望在「列印轉移申請單」待列印分頁中，具備與「出借歸還作業」相同的欄位排序（升降冪）與關鍵字即時搜尋。
- 排版與實作：採「選項 A（緊湊並列）」排版，左側為財產類別單選，右側並列搜尋框與筆數統計；12 個欄位表頭點擊支援三態排序（升 🔼 ➔ 降 🔽 ➔ 取消）；全選連動當前過濾清單 `filteredAssets`；定義具名 scoped CSS（`.transfer-sortable-th`、`.transfer-search-*`）杜絕預建凍結 Tailwind 缺漏問題。檔案：`alpine_modals_print.html`。

### 2026-09-17 待列印移轉申請單（TransferPrintModal）支援「退回轉移」機制
- 需求：使用者在移轉完成（已接收或純地點轉移完成）進入待列印清單後，若在列印前發現移轉錯誤需要退回，無法在系統內直接撤銷復原。
- 根因：資產已接收時主表已覆寫為新保管人與新地點；原僅在未接收階段（轉移中）可取消，進入待列印清單後無 rollback 機制。
- 修法：在 `code.js` 新增 `processBatchTransferRollback(assetIds)` 後端 API，從 `轉移申請紀錄` 讀取原保管人、原使用人、原地點與 Email 並還原主表，重新計算 `IS_COMPUTER`，將 `IS_UPLOADED` 設為 `'V'`，並將申請日誌改為「已退回」；在 `alpine_modals_print.html` 新增 `.btn-rollback-transfer` scoped CSS、`isRollingBack` 狀態、`handleRollbackTransfer` 及底部操作按鈕；新增單元測試 `testTransferRollbackLogic_()`。檔案：`code.js`、`alpine_modals_print.html`。

### 2026-09-15 AE 欄（DEFAULT_GROUP）預設組別資產雙軌聯集同組協作權限
- 症狀：資產 AE 欄標記「X 組」，但保管人登記為「Y 組同仁」時，X 組成員進到系統被完全過濾隱形，且無權轉移、出借或報廢。
- 根因：同組協作判斷僅比對登入者同組成員 Email 清單與保管人/使用人 Email（Peer-to-Peer），未將 AE 欄（`DEFAULT_GROUP`）納入同組範圍；且後端 API（轉移、出借、歸還、報廢）校驗時亦未支援。
- 修法：在 `code.js` 提煉 `canonicalizeGroupName_` 與 `isAssetInUserGroupScope_` 雙軌聯集 Helper（資產歸屬軌 $\lor$ 人員保管軌）；重構 `getUserStateData`、`getAssetsForCurrentUser`、`processBatchTransferApplication`、`processBatchLending`、`processBatchReturn`、`processBatchScrapping`、`cancelTransferOrScrap`；轉移時維持 AE 欄不變；新增自動化單元測試 `testDefaultGroupAssetCollaborationMatrix_()`。檔案：`code.js`。

### 2026-09-08 同組報廢待列印清單與抽屜計數支援同組成員申請
- 症狀：同組報廢功能開啟後，同組成員在待列印報廢單彈窗 (`ScrapPrintModal`) 只能看到自己的報廢申請，無法看到同組同仁的報廢申請；且抽屜卡片報廢計數未納入同組申請。
- 根因：`getAllScrappableItems` (`code.js:5106`) 誤宣告為 `groupViewEnabled`，而篩選邏輯引用未宣告變數 `groupProxyEnabled`（值為 undefined），導致同組成員判定 `isGroupMember` 永遠為 falsy；且 `getTransferData` 未在僅開啟報廢代理時載入組員清單；前端 `alpine_store.html` 之 `cardCounts.scrapPending` 僅檢查舊開關 `groupProxyEnabled`。
- 修法：在 `code.js` 宣告 `groupProxyScrapEnabled = !useAdminScope && isGroupProxyScrapEnabled()` 並修正 `getAllScrappableItems` 篩選判定；於 `getTransferData` 加入 `groupProxyScrapEnabled`；於 `alpine_store.html` 之 `cardCounts.scrapPending` 支援 `groupProxyScrapEnabled`；於 `testGroupCollaborationMatrix_` 加入測試案例 7。檔案：`code.js`、`alpine_store.html`。

### 2026-09-08 文件生成「無法插入空白文字元素」修復 (createTransferDoc/createScrapDoc/createLendingDoc)
- 症狀：管理員列印非消耗品時拋出 `Error：產生轉移記錄文件時發生錯誤：填充數據時發生錯誤（第1筆）：無法插入空白文字元素。`
- 根因：非消耗品（物品總表）或部分欄位（型號廠牌、備註、保管人地點）值為空字串 `""` 或 null；GAS DocumentApp 的 `asParagraph().setText("")` 或 `cell.setText("")` 試圖插入長度為 0 的 Text 節點，違反 Google Docs DOM 規範被系統拒絕。另 `createTransferDoc` 使用 `appendTableRow()` 會將資料行加到簽名欄下方。
- 修法：在 `code.js` 增加 `safeDocText_`（空值自動 fallback 為單一空白 `' '`，視覺透明且長度 ≥ 1）；於 `createTransferDoc`、`createScrapDoc`、`createLendingDoc` 的儲存格文字設定處套用；將 `createTransferDoc` 改為 `insertTableRow(insertPosition)`。
- 通則已沉澱：`~/.agents/skills-bullpen/gas-google-docs-table-generation/` 問題 11。檔案：`code.js`。

### 2026-07-22 客製化顯示欄位(桌面表格)三個 bug 修復
- 症狀：①顯示欄位下拉被其他元件遮蓋 ②設定鈕未與搜尋框同排 ③欄位全勾選但表格欄位不顯示。
- 根因 A(版面 ①②)：新 UI 用了預建 `css_tailwind.html` **未收錄**的 utility(`z-[60]`/`top-full`/`w-48`/`col-span-2`/`lg:w-auto`)，凍結 Tailwind 下無聲失效。修法：下拉改具名 class `.column-dropdown-menu`(定位+z-index)，按鈕沿用既有 `.filter-toolbar-action`。
- 根因 B(不顯示 ③)：`visibleColumns` 定義在 `filterSection` 元件，但表格 `<th>/<td>` 的 `x-show` 落在 sibling 元件 `assetTable`，Alpine scope 隔離 → 讀到 undefined → `undefined.includes()` 拋錯被當 falsy → 整欄隱藏。修法：狀態提升到 `Alpine.store('app').visibleColumns`，checkbox 與表格都改讀 `$store.app.visibleColumns`。
- 通則已沉澱：PLAYBOOK §4-11/12、`gas-fullstack` skill。檔案：`alpine_views.html`、`alpine_store.html`。

### 2026-07-23 匯入比對(previewAssetsBatch)三個 bug 修復
- 症狀：①用自家匯出檔匯入顯示「未找到可匯入的資料列」②取得日期每次來回 +1 天(0109/06/15→…16→…17)③保管人比對每筆都顯示假差異「(空)→黃阿明」。
- 根因 ①(工作表名不符)：匯出把工作表命名「財產/物品」(`alpine_store.html:1819/1825`)，匯入卻只認「財產總表/物品總表」(`alpine_modals_asset.html:339`)。修法：匯入端 `Sheets['財產總表'] || Sheets['財產']` 相容兩種名稱。
- 根因 ②(民國年當西元)：`new Date("0109/06/15")` 把民國109當西元109年，落到儒略曆/LMT 區間 → `Utilities.formatDate`(Java)與 V8 差 1 天；寫入端 `parseDateValue`(`code.js:7188`)更把 Date(109) 固化進 Sheet。修法(民國字串端到端)：新增 `formatRocDateStable_`(Date 用 V8 `getFullYear` 取回、字串原樣)、`parseDateValue` 改存字串、`compareField` 改字串比對、匯出 `formatCell` 改走 helper。
- 根因 ③(跨層欄位名)：`compareField('保管人', …, existingData.keeperName)` 但 V3 asset 物件保管人欄位其實叫 `leaderName`(`code.js:249`) → 讀 undefined → 假差異。修法：改讀 `existingData.leaderName`(兩處 `:7094/:7105`)。
- 未修(待決)：`addNewAssetsBatch` 的孿生 `parseDateValue`(`code.js:6755`)同病；既有 Date(109) 壞資料主表顯示可能仍位移(顯示層未動)。
- 通則已沉澱：PLAYBOOK §4-13/14、`gas-serialization-knowledge` Pattern 3、`gas-fullstack` 前後端欄位契約。檔案：`code.js`、`alpine_modals_asset.html`、`alpine_store.html`。

### 2026-07-24 待辦徽章在窄螢幕上緣被裁切
- 症狀：「待辦事項」按鈕右上角的紅色數字徽章「7」上緣被切掉一截，只在窄螢幕(<768px)出現、桌機正常。前一次提交 `90310c8` 加 `z-index: 50` 想修但無效。
- 根因(overflow 軸向連動裁切)：`.hero-action-row`(`alpine_views.html:667`)為讓按鈕列在小螢幕可水平捲動而設 `overflow-x: auto`；CSS 規範規定 overflow-x 為非 `visible` 值時，原本 `visible` 的 `overflow-y` 會被強制計算成 `auto` → 該列同時變垂直裁切框。徽章 `.sidebar-badge`(`userstate_alpine.html:328`)`top: -6px` 浮出按鈕上緣，該列無 padding-top → 那 6px 落在 padding box 外被裁切。裁切不受堆疊順序影響，故 `z-index` 無效；桌機版 `@media (min-width:768px)` 改回 `overflow-x: visible`(`alpine_views.html:696`)故正常。
- 修法：`.hero-action-row` 加 `padding-top: 8px`(容納徽章 6px 溢出 + 餘裕)，桌機媒體查詢一併 `padding-top: 0` 維持零位移；保留水平捲動與角落浮出視覺。`z-index: 50` 保留(對徽章向右探入相鄰按鈕的水平方向仍有防護、且無害)。
- 通則已沉澱：`gas-fullstack` CSS/佈局節「overflow-x:auto 逼 overflow-y 變 auto → 浮出元素被裁」。檔案：`alpine_views.html`。

### 2026-07-29 新增 B219 硬體標籤篩選功能 (connect.html)
- 症狀：使用者希望在盤點系統 (`connect.html`) 也能像首頁一樣，快速篩選出 B219 且需要貼機密標籤的硬體資產。但實作後發現無法篩選出任何項目。
- 根因：`connect.html` 的過濾邏輯原先比對的是實體資產的 `location`，但對於未對照的虛擬 ISMS 資產，其 `location` 被寫死為 `'-'`，導致 `loc === 'B219'` 永遠不成立；另外 `getAssetsWithMappingStatus` 也未回傳 `confidentiality` 屬性。
- 修法：
  1. `code.js`：在回傳的資產與虛擬資產物件中加入 `confidentiality` 與 `ismsLocation`。
  2. `connect.html`：於駐站篩選框後方新增 `<select id="filterLabel">`。
  3. `connect.html`：將 `label` 加入 `filterState`，並在 `matchesFilters` 中改為比對 `ismsLocation`，確認其為 B219/園區B219 且 category 為 HW 且 confidentiality 為 4(藍) 或 3(綠)。
