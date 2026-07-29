# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 專案定位

`isms-connect-asset` 是資產管理系統的**獨立 GAS 子專案**（父層 `../CLAUDE.md` 描述整個 monorepo）。職責是把「內部資產編號」與「ISMS 資訊資產編號」做對照，並提供資訊資產清單 / 軟體清冊的 CRUD 介面。

程式碼分兩個檔：`code.js`（既有 API）與 `iso_scope.js`（ISO 範圍判定與掃描，2026-07-27 新增；
`code.js` 已 1296 行，再擴充難以維護，作法比照主專案的 `hr_directory.js`）。

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
clearIsoScopeCache()      // 改完 HR 組織架構樹 I 欄（認證駐站）後清快取（否則要等 10 分鐘）
```

「ISO範圍例外」工作表由 `ensureIsoExceptionSheet_()` 建立；例外表不存在時判定不會失敗
（回空例外集合），與認證駐站的 fail-closed 不同。

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
| `?page=connect` | `connect.html` | **單頁**：資產清單＋分面篩選＋ISO 範圍晶片與掃描＋底部對照動作條＋業務流程批次設定＋CSV 匯出 |
| `?page=softwarelist` | `softwarelist.html` (1173 行) | 軟體清冊唯讀檢視與匯出 |

`connect.html` 原本有四個分頁（資產清單／對照作業／資訊資產／報表查詢），2026-07-26 合併為單頁：後三個分頁被重新理解為「同一份資料的不同切面」，轉化為主清單上的篩選器與操作。**不要再新增分頁**，新功能請掛在篩選列、統計卡或底部動作條上。詳見「事件紀錄 2026-07-26」與 `docs/superpowers/specs/2026-07-26-connect-single-page-design.md`。

**三頁沒有共用的 partial、沒有 `include()`、沒有前端框架**（父專案是 Alpine.js SPA，這裡不是）。每頁自帶一份 `state` 物件、自己的 `showToast` / `esc` / FAB 程式碼——修一個 bug 常常要在三個檔案各修一次。CDN 依賴（Tailwind、Font Awesome、SheetJS、jsPDF、Quagga2）由各頁 `<head>` 各自載入。

三頁之間靠右下角浮動按鈕（FAB）互跳，連結來自後端 `getFabNavigationUrls()`；其中 `mainAppUrl`（跳回主資產系統）是**硬編碼在 `code.js:1223`**，主系統重新部署換 URL 時要來這裡改。

### 3. 權限模型

權限來源是 ISMS 試算表的「權限」工作表：**A 欄 = 白名單 Email、B 欄 = 管理員 Email**（管理員自動視為白名單）。`getPermissionLists_()` 一次讀完兩欄並快取 5 分鐘；讀不到工作表時回傳空集合，也就是 **fail-closed**（設定壞掉 = 全部拒絕，不是全部放行）。

**核心前提：`google.script.run` 不經過 `doGet`。** 它直接打到後端函式，`doGet` 的白名單擋不到它。因此每支端點必須自己驗證，不能假設外層擋過。

寫入端點一律走守門函式 `assertWriteAccess_(requireAdmin)`（`code.js:139`），回傳 `{ok, email, isAdmin, error}`：

| 端點 | 層級 | 備註 |
|------|------|------|
| `createIsmsAsset` / `updateIsmsAsset` | 白名單 | 一般承辦人即可新增/編輯 |
| `createMappings` | 白名單 | 同上（`updateMapping` 已於 2026-07-26 移除，功能被它涵蓋） |
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
- **業務流程只能透過 `setIsmsBusinessProcessBatch`（`business_process.js`）修改**。
  `updateIsmsAsset` 完全不碰 V 欄，而且它強制 CIA 為 1~4——ISO 掃描補號的資產
  刻意留空 CIA，會被它擋下。**不要為了「統一」而把 V 欄併進 `updateIsmsAsset`。**
- **前端 `resolveBusinessProcessTargets()` 的 `affectedCount` 與後端
  `countAffectedAssets_()` 是同一個定義**（目標資訊資產底下所有已對照實體資產，
  含未勾選者）。改動任一邊都必須同步，否則 TOCTOU 檢查每次都誤判成「資料已變動」。
- **動作條的「清除業務流程」用哨兵值 `__CLEAR__`，不是空字串**。空字串代表「不變更」。
  兩者共用同一個值是批次編輯 UI 的經典缺陷，一次誤觸就會洗掉一批資料。

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

### 8. ISO 驗證範圍判定（spec 2026-07-27，程式碼在 `iso_scope.js`）

判定核心是台級純函式 `judgeAssetIsoScope_()`，優先序：**例外 > 駐站認證狀態 > 業務流程**。
`iso_scope.js` 刻意分三段（純函式／讀取層／端點），純函式不碰任何 GAS API，
可用 `node test/iso_scope.test.cjs` 在本地跑 23 個斷言（`test/` 不進版控，也不會被誤貼到 GAS）。

- **認證駐站的真相是 HR「組織架構樹」I 欄**（值 `V` 或 `認證駐站`），由 `station_status` 專案的
  `syncCertifiedStationFlagsToOrgSheet_()`（`station_status/code.js:938`）寫入。
  **這是跨專案契約**——`HR_ORG_TREE_COLUMN_INDICES.CERTIFIED_FLAG = 9` 與那邊的
  `orgSheet.getRange(item.rowIndex, 9)` 必須同步，任一邊改欄位順序都會靜默錯位。
  本專案不讀也不需要 `認證駐站紀錄`（那張表在 station_status 自己綁定的試算表）。
- **地點反查駐站必須套 `HR_GROUP_NAME_MAP`**：資產地點欄存的是慣用名，組織架構樹 D 欄是 HR 原名，
  直接比對會全部對不上。`getCertifiedStationMap_()` 的 key 已經是慣用名。
- **旗標判定一律走 `isCertifiedFlagValue_()`，它會做 NFKC 正規化**。中文輸入法很容易打出
  **全形Ｖ（U+FF36）**，在儲存格裡與半形 V 肉眼無法分辨，`toUpperCase()` 也救不了
  （它只處理大小寫、不處理全半形）。2026-07-27 實際踩到：E 欄三列打勾只有兩列生效。
  新增任何讀旗標的地方請沿用這支函式，不要自己寫 `=== 'V'`。
- **認證業務流程**是「下拉選單」工作表 key=`業務流程` 列的 **E 欄** `V` 旗標。
  `STATION_DEFAULT_BUSINESS_PROCESS`（`收案系統`）**必須在該清單且 E 欄打 `V`**——
  駐站分支平常不看業務流程，但設備轉出駐站的瞬間就改看它，漏打會無聲掉出範圍。
- **對照表 F/G/H 欄兼任基準線**。F 欄三值：`V` 在範圍 / `?` 待判定 / 空 不在範圍。
  它是**上次套用的結果，不是即時真相**；畫面顯示永遠是即時推導，差異 = 即時推導 vs F 欄。
  用三值而非 V/空，是為了讓「在範圍→待判定」不被誤報成「離開範圍」。
- **HR 讀不到時 fail-closed**：`getCertifiedStationMap_()` 直接 throw，絕不降級成空集合。
  降級會讓全部駐站資產靜默判成「不在範圍」。這與 `getEmailToGroupMap_()` 會靜默降級讀
  「保管人/信箱」的行為**刻意不同**。

- **fail-closed 的邊界刻意畫在 ISO 入口，不在 `getDropdownOptions()`**（不要「統一」它們）：
  `getDropdownOptions()` 讀不到 E 欄時仍回 `success:true` 並附
  `businessProcessFlagColumnAvailable: false`——因為它同時供 `index.html` 的新增資訊資產
  表單使用，改成 throw 會把那個表單一起弄壞。fail-closed 只加在 ISO 判定專用的
  `getCertifiedProcessSet_()`：旗標欄不可用時 throw。
  該函式另有**部署防呆**——欄位為 `undefined` 即視為線上 `code.js` 是舊版並明確要求重貼，
  因為手動貼檔部署下「線上與本地不一致」是常態風險，而它的症狀（認證流程集合變空）
  與「真的沒有任何認證流程」一模一樣。
  `getDropdownOptions()` 迴圈後那行 `console.log` 是為了讓三種失敗模式可分辨：
  **log 沒出現**=線上舊版、**業務流程 0 筆**=B 欄 key 文字不符、
  **有筆數但已認證 0 筆**=E 欄旗標值形狀不被接受（全形Ｖ、核取方塊的 boolean 等）。
- 補號歸併鍵 = **地點 + 資產名稱 + 財產類別 + 組別**，駐站與非駐站同規則（組別不同就拆）。
  **廠牌型號欄含序號，不可入鍵**——用它會靜默退化成一台一筆且不報錯。
  組別為 `未分組` 或查不到代號者不補號，列入「無法處理」清單。
- 補號的 **CIA 刻意留空**（填 1/1/1 會混進資產價值統計變成「看起來已完成」），
  所以**不重用 `createIsmsAsset()`**（它強制 CIA 1~4）；類別固定 `HW`。
- 套用**不重用 `createMappings()`**：它逐筆 `appendRow`，200 台就是 200 趟 API 往返。
  改成讀整表、記憶體內改完、一次 `setValues`。既有列的 C/D 欄不覆寫。
- 權限：`previewIsoScopeScan` 白名單（唯讀）、`applyIsoScopeScan` **管理員**。
  套用時重算並比對前端帶回的筆數以擋 TOCTOU。
- 前端 ISO 晶片**必須傳 `excludeDim: 'isoScope'`**，並用 `data-iso` + 事件委派
  （不可用 inline `onclick`，理由見 `connect.html` 的 `renderGroupChips` 註解）。

## 事件紀錄

### 2026-07-29 新增 B219 硬體機密標籤專用篩選下拉選單
- 背景：為了方便管理者快速找出特定地點（B219）內，需要貼上機密標籤的實體硬體資產。
- 做法：在 `index.html` 資訊資產總表的篩選列中，將原本的 `md:grid-cols-7` 擴充為 `md:grid-cols-8`，並加入一個新的 `<select id="filterLabel">`。當選擇「藍色標籤 (機密)」時，會強制過濾出 `location` 為 B219 或 園區B219、`category` 為 HW，且機密性為 4 的項目；選擇「綠色標籤 (密)」則為機密性 3。維持與其他條件（如關鍵字）的交集邏輯。

### 2026-07-29 修正 ISO 範圍掃描將「空殼資訊資產」誤判為「未比對的實體資產」並排入自動補號的問題
- 背景：當一筆資訊資產有分類編號，但底下尚未綁定任何實體資產時，系統在執行 ISO 範圍掃描，會錯誤地將其放入「將自動補號」清單。
- 原因：為了讓前端能顯示空殼資訊資產，`getAssetsWithMappingStatus()` 會動態塞入 `assetId: '無對應資產/消耗品'` 且 `isMapped: false` 的虛擬紀錄。而 `computeIsoScopePlan_` 取得資產清單後未過濾虛擬紀錄，直接因 `isMapped: false` 將其視為未對照的實體資產，觸發了自動補號邏輯。
- 做法：在 `iso_scope.js` 中的 `computeIsoScopePlan_` 取得資產清單後，透過 `filter(a => a.assetId !== '無對應資產/消耗品')` 直接將虛擬紀錄排除，使其不再參與自動補號與範圍判定。

### 2026-07-29 修復 ISO 範圍掃描「進入範圍」明細遺漏顯示問題
- 背景：測試執行範圍掃描時，畫面數量統計顯示「有 1 台進入範圍的資產」，下方卻沒有列出是哪一台。
- 原因：在 `connect.html` 的 `renderIsoScanReport` 渲染邏輯中，當初開發時實作了 `r.diff.leaving.length`（離開範圍）的清單顯示，卻忘記對應實作 `r.diff.entering.length`（進入範圍）的顯示區塊。
- 做法：比照「離開範圍」的樣板，補上針對 `r.diff.entering.length` 的 `<ul><li>` 清單生成邏輯，並同樣套用最多顯示 20 台及 `escapeHtml` 處理。


### 2026-07-28 connect.html 批次指定業務流程
- 動機：ISO 判定的 `PENDING`（非駐站 + 業務流程未填）在系統內無解——`createIsmsAsset` 會寫 V 欄，但 `updateIsmsAsset` 完全不碰它，業務流程建立後只能手動改試算表。
- **關鍵發現：「建立對照時順帶填」與「批次修改既有」是同一件事。** 動作條的 `ismsAssetSelect` 從 `allIsmsAssets` 填充，永遠只能選既有資訊資產，`createMappings` 不會建立新的——所以兩條路的寫入對象與波及範圍相同，共用同一支端點與同一個確認流程。設計初期以為前者比較安全，是錯的。
- 做法：新增 `business_process.js`（純函式層 + 單一端點，比照 `iso_scope.js` 的切法）；動作條加業務流程下拉與套用鈕；波及範圍純前端由 `allAssets` 算，寫入前經後端重算比對擋 TOCTOU。
- **一個控制項、兩個作用對象**：動作條上「套用業務流程」作用於勾選資產反查出的集合，「建立對照」作用於下拉選定的那一筆。解法是動態按鈕文案（有選值時變成「建立對照並設定業務流程」），而不是加說明文字——說明文字會被略過，按鈕文案是點擊前必看的最後一個字串。
- **`resetCreateMappingBtn` 原本把標籤寫死**，動態文案做完後每次建立對照結束都會被它洗回去。這是本專案第 5 次踩「改一個東西時只追一種名字形態」——這次在計畫階段就先 grep `建立對照` 字串把它揪出來。
- **「清除」與「不變更」必須是兩個不同的值**（`__CLEAR__` vs `''`）。批次編輯 UI 以單一空值同時代表兩者，是那種上線半年後才被發現、且已經洗掉一批資料的缺陷。
- **C 路徑的 TOCTOU 必然失敗，除非先重載**：建立對照會改變波及台數，用建立前的數字送出去會被後端擋下。所以 `applyBusinessProcessAfterMapping` 先 `loadAssets(onDone)` 再算——這是 `loadAssets` 新增回呼參數的唯一理由，失敗路徑刻意不呼叫回呼。
- **兩個獨立的非同步條件會互相覆蓋**：「非管理員」與「選項載入失敗」都會停用那個下拉，但它們是兩條各自的流程，只看其中一個會被後到的那個設回 enabled。用 `businessProcessOptionsAvailable` 旗標讓 `applyAdminGating()` 同時看兩個條件。
- **刻意不更新對照表 F/G/H 欄（ISO 基準線）**。F 欄的定義是「上次掃描套用的結果」，改業務流程後應該在下次掃描顯示為待套用差異，那是稽核軌跡；順手改掉等於讓變更繞過掃描的確認關卡。
- 權限：全部管理員（使用者決定）。已知不對稱：白名單使用者新增資訊資產時可填業務流程，事後卻不能改——這是刻意接受的取捨。
- fail-open / fail-closed 的邊界：`getDropdownOptions()` 載入失敗只停用這個功能（UI 選項讀不到只是少一個功能），與 `getCertifiedProcessSet_()` 的 fail-closed（判定依據讀不到會產出錯誤結論）刻意不同。
- 檔案：`business_process.js`、`connect.html`。設計與計畫：`docs/superpowers/specs|plans/2026-07-28-connect-business-process-batch-*.md`。

### 2026-07-26 connect.html 四分頁合併為單頁
- 動機：勾選資產後要切到「對照作業」分頁才能建立對照，流程被切斷。
- 關鍵發現：四個分頁的資料在 `DOMContentLoaded` 就全部載入完畢，分頁只是視覺隱藏；且主表每筆資產已帶著 `group` / `isMapped` / `mappedIsmsAssetId` 回到前端 —— 後三個分頁的功能所需原料前端全都現成，可純前端計算。
- 做法：資訊資產分頁 → 篩選列的下拉（只列**實際有資產對照上去**的編號＋筆數）；報表查詢分頁 → 可點擊統計卡＋組別晶片列＋前端 CSV 匯出；對照作業分頁 → 勾選 ≥1 才滑出的底部動作條。
- **分面計數規則（最重要的一條）**：每個分面的計數都要**排除它自己那一維** —— 統計卡排除 `mappedStatus`、組別晶片排除 `group`。否則點下去其他選項全部歸零，就再也不能比較也不能點回去。實作為 `matchesFilters(asset, excludeDim)` 的 `excludeDim` 參數。
- 效益：首載後端呼叫 5 → 3；兩張總表完整重讀 3 次 → 1 次（`getGroupList` 與 `getMappingStatistics` 內部各自又完整呼叫一次 `getAssetsWithMappingStatus`）。`code.js` 1460 → 1300 行，移除 5 支死碼端點；`deleteMappings` 刻意保留為唯一可移除對照的維運工具。
- 順帶修補：`loadUserInfo` 補上 `withFailureHandler`（原本完全沒有）；表格載入失敗改為錯誤列＋重試鈕而非永遠轉圈；CSV 匯出補上公式注入防護（`sanitizeCsvCell`，缺陷繼承自被刪除的後端 `exportMappingReport`）。
- **踩到 4 次同型錯誤**：刪除元素／函式時只追一種名字形態，漏掉其他引用點 —— `filterAssets`（條碼掃描 IIFE 內還在呼叫）、`goToMappingBtn`（`updateSelectionUI` 還在寫它的 `.disabled`）、`loadStatistics`（`switchTab` 內的延遲載入）、`reportSelect`（只 grep 了 DOM id `reportIsmsSelect`，沒 grep 變數名）。共通點：`node --check` 只驗語法，**抓不到未宣告變數這種執行期錯誤**。正解是刪除前把該物的**函式名／變數名／DOM id 三種形態全部列出來 grep**。
- 通則已沉澱：`gas-fullstack` 前端節。檔案：`connect.html`、`code.js`。設計與計畫：`docs/superpowers/specs|plans/2026-07-26-connect-single-page-*.md`。

### 2026-07-26 對照頁表格欄位之間出現大片空白
- 症狀：`connect.html` 資產清單表格，廠牌型號與保管人之間、資產名稱與廠牌型號之間各有數百 px 空白；縮 `min-width` 無效。
- 根因（同一機制發作兩次）：`.data-table td` 有 `white-space: nowrap`，只要該欄**任何一列**有超長內容（實測：資產名稱最長 21 字「Zyxel AC1200 4G 寬頻路由器」、廠牌型號含長序號），整欄就被撐到 max-content；短內容那幾列看到的就是空白。畫面上看得到的列全是短的，所以完全看不出兇手在哪。
- 走錯的一步：先加 `.col-asset-name { width: 100% }` 想讓它吸走剩餘空間——但 `width:100%` **只能分配「剩餘」空間**，當某欄已被 max-content 撐到表格溢出時根本沒有剩餘可分，該招完全失效，反而在後續造成新的大空隙。
- 判斷訊號：**表格溢出容器、且各欄實際寬度比例與 min-width 比例明顯不符** → 就是 max-content 在主導，不是空間攤分。（實例：min-width 180:150，實測卻是 365:1050。）
- 修法：`.cell-name` / `.cell-brand` 內層 `<div>` + `white-space: normal` + `overflow-wrap: anywhere` + `max-width`（不截斷，只折行）。用內層 div 是因為 auto table layout 下 `<td>` 的 `max-width` 不保證生效。`max-width` 與該欄 `min-width` 設同值即可鎖死欄寬。另 `#assetTable { width: auto }` 讓表格不強制滿版（代價：寬螢幕右側留白，這是「零空隙」的必然結果）。
- 排除項：**不是 Tailwind 造成的**。`connect.html:24` 載的是 Play CDN(JIT) 版，與主專案凍結的預建 `css_tailwind.html` 不同，任意值 class 在這裡會生效；表格也只用具名 class，Preflight 對 `table` 只設 `border-collapse`。
- 通則已沉澱：`gas-fullstack` CSS/佈局節。檔案：`connect.html`。

### 2026-07-25 補上寫入端點缺少的權限檢查
- 症狀（潛在，非使用者回報）：白名單只擋在 `doGet`，但 `google.script.run` 是獨立入口不經過 `doGet`；8 支寫入端點中只有 `deleteIsmsAsset` 檢查管理員，其餘（`createIsmsAsset` / `updateIsmsAsset` / `createMappings` / `updateMapping` / `deleteMappings` / `initMappingSheet` / `clearHrGroupMapCache`）任何網域使用者都能在 console 直接呼叫。
- 修法：新增守門函式 `assertWriteAccess_(requireAdmin)`（`code.js:139`），沿用既有 `getPermissionLists_()` 的 5 分鐘快取，一次取回 `{ok, email, isAdmin, error}`；8 支寫入端點在**搶鎖之前**呼叫，新增/編輯=白名單、刪除/結構變更=管理員。
- 兩個關鍵判斷：①**不套 owner-scoping 的 IDOR 模板**——資訊資產與對照表沒有擁有者欄位，是全所共用登錄簿，比對 `leaderEmail` 會讓 ISMS 承辦人無法代表全所建對照，正解是角色制。②`clearPermissionCache` **刻意不擋**——擋了會死鎖（檢查管理員時讀到的正是那份要清的舊快取），影響面僅「強迫重讀」，留作逃生門。
- 未做：讀取端點（含會匯出完整資產清冊的 `exportMappingReport`）仍無白名單檢查，屬同一個 `doGet` 落差，待決定是否一併收斂。
- 通則已沉澱：`gas-security-audit` skill「google.script.run 繞過 doGet」案例區。檔案：`code.js`。
