# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 專案定位

`isms-connect-asset` 是資產管理系統的**獨立 GAS 子專案**（父層 `../CLAUDE.md` 描述整個 monorepo）。職責是把「內部資產編號」與「ISMS 資訊資產編號」做對照，並提供資訊資產清單 / 軟體清冊的 CRUD 介面。

**與主專案不共用任何常數**——`env.js` 的欄位索引是從主專案**複製**過來的副本。主專案新增欄位不必同步；**移動既有欄位（改變欄位順序）時必須手動同步這裡的 `PROPERTY_COLUMN_INDICES` / `ITEM_COLUMN_INDICES`**，否則本專案會讀到錯位資料而不報錯。

## 部署與驗證

**本目錄（以及整個 monorepo）沒有 `.clasp.json`，`clasp push` 跑不起來。實際部署是手動把檔案內容貼進 Apps Script 編輯器。**

因此：回報 bug 時若本地程式碼經檢查是健康的，**先懷疑線上與本地不一致，不要急著改本地**。最快的鑑別法是請使用者在瀏覽器 console 檢查目標程式碼是否真的在頁面裡：

```javascript
[...document.querySelectorAll('script')].some(s => s.textContent.includes('你剛加的函式名'))
```

回傳 `false` 就是沒同步，重貼該檔即可。git 歷史只證明本地狀態，不證明雲端狀態。

### 可在編輯器直接執行的維運函式

```javascript
initMappingSheet()        // 建立「資產對照表」工作表 + 表頭 + 欄寬（已存在則跳過）
clearPermissionCache()    // 改完「權限」工作表後清快取（否則要等 5 分鐘）
clearHrGroupMapCache()    // 改完 HR 主表或 Script Property 後清快取（否則要等 10 分鐘）
```

「資訊資產操作紀錄」工作表由 `ensureOperationLogSheet_()` 在第一次寫 log 時自動建立，不需手動初始化。

### 必要的 Script Properties

| Key | 用途 |
|-----|------|
| `HR_SPREADSHEET_ID` | HR 主表試算表 ID；未設定時 `getHrSpreadsheetId_()` 會 throw，觸發組別對照的 fallback 路徑 |
| `HR_GROUP_NAME_MAP` | JSON 字串，HR 中文組別名 → 本系統組別名；值與主專案相同 |

`env.js` 裡的 `ISMS_SPREADSHEET_ID` 在版控中是佔位字串 `'YOUR_ISMS_SPREADSHEET_ID_HERE'`，真值只存在於線上編輯器的副本。**貼檔案上去時不要把 `env.js` 整份覆蓋掉**，會把線上的真 ID 洗成佔位字串，全系統立刻失效。

### 無自動化測試

手動驗證路徑：編輯器直接呼叫後端函式 → 部署 Web App 跑三個頁面 → 檢查兩本試算表的實際寫入 → 分別用白名單一般使用者與管理員各測一次（刪除鈕的 disabled 狀態、`deleteIsmsAsset` 的拒絕訊息）。

## 架構重點

### 1. 跨兩本試算表：一本唯讀、一本可寫

| 試算表 | 常數 | 讀寫 | 內含工作表 |
|--------|------|------|-----------|
| 主資產試算表 | `CONFIG.ASSET_SPREADSHEET_ID` | **唯讀** | 財產總表、物品總表、保管人/信箱（fallback 用） |
| ISMS 試算表 | `CONFIG.ISMS_SPREADSHEET_ID` | 讀寫 | 資訊資產清單、資產對照表、下拉選單、軟體清冊、權限、資訊資產操作紀錄 |
| HR 主表 | Script Property `HR_SPREADSHEET_ID` | 唯讀 | 人員主檔、組織架構樹、人員職務配置 |

本專案**從不寫入主資產試算表**。所有寫入（對照、資訊資產 CRUD、操作 log）都落在 ISMS 試算表。新增寫入功能時確認 `openById` 的目標是 `ISMS_SPREADSHEET_ID`。

### 2. 三頁路由，各頁完全獨立

`doGet(e)` 依 `?page=` 參數回傳三個互不相干的 HTML 檔：

| URL | 檔案 | 功能 |
|-----|------|------|
| 預設 | `index.html` (2449 行) | 資訊資產清單、新增/編輯/刪除、重複編號偵測、CSV/XLSX/PDF 匯出 |
| `?page=connect` | `connect.html` (1630 行) | 資產 ↔ 資訊資產多對一對照、條碼掃描、統計報表 |
| `?page=softwarelist` | `softwarelist.html` (1173 行) | 軟體清冊唯讀檢視與匯出 |

**三頁沒有共用的 partial、沒有 `include()`、沒有前端框架**（父專案是 Alpine.js SPA，這裡不是）。每頁自帶一份 `state` 物件、自己的 `showToast` / `esc` / FAB 程式碼——修一個 bug 常常要在三個檔案各修一次。CDN 依賴（Tailwind、Font Awesome、SheetJS、jsPDF、Quagga2）由各頁 `<head>` 各自載入。

三頁之間靠右下角浮動按鈕（FAB）互跳，連結來自後端 `getFabNavigationUrls()`；其中 `mainAppUrl`（跳回主資產系統）是**硬編碼在 `code.js:1223`**，主系統重新部署換 URL 時要來這裡改。

### 3. 權限模型

權限來源是 ISMS 試算表的「權限」工作表：**A 欄 = 白名單 Email、B 欄 = 管理員 Email**（管理員自動視為白名單）。`getPermissionLists_()` 一次讀完兩欄並快取 5 分鐘；讀不到工作表時回傳空集合，也就是 **fail-closed**（設定壞掉 = 全部拒絕，不是全部放行）。

**核心前提：`google.script.run` 不經過 `doGet`。** 它直接打到後端函式，`doGet` 的白名單擋不到它。因此每支端點必須自己驗證，不能假設外層擋過。

寫入端點一律走守門函式 `assertWriteAccess_(requireAdmin)`（`code.js:139`），回傳 `{ok, email, isAdmin, error}`：

| 端點 | 層級 | 備註 |
|------|------|------|
| `createIsmsAsset` / `updateIsmsAsset` | 白名單 | 一般承辦人即可新增/編輯 |
| `createMappings` / `updateMapping` | 白名單 | 同上 |
| `deleteIsmsAsset` / `deleteMappings` | 管理員 | 刪除類一律管理員 |
| `initMappingSheet` | 管理員 | 結構變更 |
| `clearHrGroupMapCache` | 管理員 | |
| `clearPermissionCache` | **刻意不擋** | 擋了會死鎖，見下 |

`clearPermissionCache` 是唯一的例外：管理員把自己加進 B 欄後要清快取才生效，但檢查管理員時讀到的正是那份還沒清的舊快取 → 永遠過不了。影響面僅止於「強迫重讀工作表」，故接受。**改權限被鎖在外面時，這支就是逃生門。**

權限模型是**角色制而非擁有者制**：資訊資產與對照表沒有擁有者欄位，是全所共用的登錄簿（ISMS 承辦人本來就要代表全所建對照），所以不做 `leaderEmail` / `userEmail` 比對。不要照搬主專案或 `gas-security-audit` skill 的 owner-scoping IDOR 模板到這裡，那會讓正常流程做不下去。

守門要放在 `LockService.waitLock()` **之前**——未授權的呼叫不該佔用全域鎖。

**尚未收斂的部分**：讀取端點（`getAssetsWithMappingStatus`、`getIsmsAssets`、`exportMappingReport`、`getSoftwareList` 等）目前仍**沒有白名單檢查**，任何網域內使用者都能透過 `google.script.run` 取得完整資產清冊。前端的管理員判斷（`index.html:1251` 只是把刪除鈕 `disabled`）同樣純屬 UI 提示，不構成防護。

### 4. 組別解析鏈（三層 fallback）

資產本身不一定有組別，`getAssetGroup_()` 依序試：

1. 資產的 `DEFAULT_GROUP`（AE 欄）
2. 使用人 email → 組別對照表
3. 保管人 email → 組別對照表
4. 都查不到 → `'未分組'`

而「email → 組別對照表」本身（`getEmailToGroupMap_()`）又有兩層：

- **主路徑**：直讀 HR 三表。人員主檔篩在職（`HR_ACTIVE_STATUSES = ['在勤','休假','育嬰假','外派人員']`——注意「在職」是這四值的合稱，不等於「在勤」）→ 人員職務配置取主職（`orgCodeRank_`：`PRE` > `CEO` > `DEPT-*` > `GRP-*`，其餘含 `TF-*` 視為兼任不採計）→ 組織架構樹把代碼轉中文名 → `HR_GROUP_NAME_MAP` 轉本系統名。
- **Fallback**：HR 讀取失敗時（含 Script Property 未設定）改讀主試算表「保管人/信箱」G 欄。這是靜默降級，只寫 `console.error`，前端看不出來——組別突然大量變成舊值或「未分組」時，先去執行記錄查有沒有這行。
- 兩者結果共用同一組 10 分鐘快取（`hr_email_group_map_v1`）。

### 5. 資訊資產編號產生：三道防線

`createIsmsAsset()` 用 `LockService` 全域鎖（等 10 秒）＋三段式防撞號產生 `{組別代號}-{類別代號}-{三位流水號}`：

1. **主**：正則掃 A 欄既有編號 `^{groupCode}-{categoryCode}-(\d+)$` 抽尾號取 max——A 欄是唯一真相。
2. **備援**：A 欄格式不符的列，改看 B/S 欄（類別/組別，代號或中文名皆可）＋ T 欄流水號。
3. **保險**：組出 ID 後再迴圈遞增，直到該 ID 確定不存在於 A 欄。

寫入時的欄位語意不對稱，改動時容易寫反：**B 欄（類別）與 S 欄（組別）寫「代號」，G 欄（權責單位）寫「組別中文名」**。`assetValue` = C + I + A（三項各限 1~4 整數）。

`appendRow` 後一律 `SpreadsheetApp.flush()`，避免緊接著的讀取拿到 stale 資料。

### 6. 操作稽核 log

`createIsmsAsset` / `updateIsmsAsset` / `deleteIsmsAsset` 三者都會呼叫 `logIsmsOperation_()`，寫入「資訊資產操作紀錄」：時間戳、操作者、類型、目標編號、變更欄位 CSV、變更前後完整 JSON 快照。

`updateIsmsAsset` 會先比對差異，**完全沒變更時回傳 `{success:true, noChange:true}` 且不寫 log**。log 失敗只 `console.error`、不阻斷主操作——這是刻意的，不要「修」成 throw。

新增任何會改動資訊資產的函式時，請一併補 log 呼叫，否則稽核軌跡會斷。

### 7. 前端的隱形約定（改動前必讀）

- **`connect.html` 只顯示 `category` 為 `'HW'` 或 `'EV'` 的資訊資產**。這個過濾**硬編碼在前端四個地方**（`:843`、`:953`、`:1035`、`:1052`），後端 `getIsmsAssets()` 完全不過濾。使用者回報「某資訊資產在對照頁選不到」，八成是類別不在這兩者之內。
- **數量欄位有優先序**：`mapRowToIsmsAssetObject_()` 的 `quantity` 取 **U 欄（已盤點數量）優先於 E 欄（數量）**，E 欄原值另存於 `quantityOriginal`。這是刻意的（見 git `f6e7816`），不要「修正」成直接讀 E 欄。
- **XSS 寫法三頁不一致**：`index.html` 走 DOM API（`createElement` / `textContent`），`connect.html` 與 `softwarelist.html` 走 `innerHTML` + 自帶的 `escapeHtml()` / `esc()`。**沿用你所在檔案的既有寫法**，不要在 `index.html` 引進 `innerHTML`，也不要在另外兩檔漏掉 escape。
- `index.html` 的 `detectAndRenderDuplicates()` 會在載入後掃出重複的資訊資產編號並跳出警示面板——這是資料品質提示，不是 bug。
- `connect.html` 的條碼掃描（Quagga2）有自訂格式化規則：20 碼去前 2 位，之後切成 `7-4-7`（`formatBarcode`，`:1391`），規則與主應用程式一致。

### 8. 回傳值協定

所有 `google.script.run` 端點一律回傳 `{ success: boolean, ... }`，錯誤走 `{ success: false, error: e.message }` 而**不是 throw**。因此前端的 `withFailureHandler` 幾乎不會觸發，錯誤要在 `withSuccessHandler` 裡判 `result.success`。新增 API 請沿用此慣例。

## GAS 限制

- **序列化**：GAS 無法序列化 `Date` / `Map` / `Set`。回傳前一律轉換（`new Date().toISOString()`、`Array.from(mySet)`）。`getMappingMap_()` 回傳的 `Map` 是**內部用**的，絕不可直接回給前端。
- **時區**：`appsscript.json` 設 `Asia/Taipei`；跨函式傳遞的時間一律用 ISO string。
- **存取**：`"access": "DOMAIN"`、`"executeAs": "USER_DEPLOYING"`。`Session.getActiveUser().getEmail()` 在此設定下可取得真實使用者信箱（權限判斷全靠它）。

## 編碼風格

- 2 空格縮排；函式/變數 `camelCase`，常數 `SCREAMING_SNAKE_CASE`
- **私有函式以底線結尾**（`getPermissionLists_`、`mapRowToAssetObject_`）——GAS 慣例，底線結尾的函式不會出現在編輯器的執行下拉選單，也不能被 `google.script.run` 呼叫。**前端要呼叫的函式絕對不能加底線**。
- 註解用繁體中文，保持簡潔
- 工作表名稱、欄位索引全部集中在 `env.js`，`code.js` 內不出現字面量欄號（唯一例外是「保管人/信箱」fallback 的 `'保管人/信箱'` 與 B/G 欄硬編碼）

## 事件紀錄

### 2026-07-25 補上寫入端點缺少的權限檢查
- 症狀（潛在，非使用者回報）：白名單只擋在 `doGet`，但 `google.script.run` 是獨立入口不經過 `doGet`；8 支寫入端點中只有 `deleteIsmsAsset` 檢查管理員，其餘（`createIsmsAsset` / `updateIsmsAsset` / `createMappings` / `updateMapping` / `deleteMappings` / `initMappingSheet` / `clearHrGroupMapCache`）任何網域使用者都能在 console 直接呼叫。
- 修法：新增守門函式 `assertWriteAccess_(requireAdmin)`（`code.js:139`），沿用既有 `getPermissionLists_()` 的 5 分鐘快取，一次取回 `{ok, email, isAdmin, error}`；8 支寫入端點在**搶鎖之前**呼叫，新增/編輯=白名單、刪除/結構變更=管理員。
- 兩個關鍵判斷：①**不套 owner-scoping 的 IDOR 模板**——資訊資產與對照表沒有擁有者欄位，是全所共用登錄簿，比對 `leaderEmail` 會讓 ISMS 承辦人無法代表全所建對照，正解是角色制。②`clearPermissionCache` **刻意不擋**——擋了會死鎖（檢查管理員時讀到的正是那份要清的舊快取），影響面僅「強迫重讀」，留作逃生門。
- 未做：讀取端點（含會匯出完整資產清冊的 `exportMappingReport`）仍無白名單檢查，屬同一個 `doGet` 落差，待決定是否一併收斂。
- 通則已沉澱：`gas-security-audit` skill「google.script.run 繞過 doGet」案例區。檔案：`code.js`。
