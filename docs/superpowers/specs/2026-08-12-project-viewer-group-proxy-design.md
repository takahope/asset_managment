# GRP-PROJ 同組資產可見與操作權限保留 (Group Proxy Operability) Design Spec

## 1. 背景與目標 (Background & Goal)

**現狀：** 
在近期的更新中，當使用者位於 HR 名冊中的「專案檢視員 (GRP-PROJ)」組別時，會被賦予 `isProjectViewer = true`，連帶使得後端判斷 `useAdminScope = true`，讓他們能夠「讀取」全公司的所有資產。
然而，前端原本的防護邏輯中，針對操作按鈕（轉移、出借、報廢）使用了強硬的隱藏條件 (`x-show="!$store.app.isProjectViewer || $store.app.isAdmin"`)。這導致專案檢視員雖然能看到自己或同組同事的資產，卻完全無法對它們進行任何操作（按鈕消失），失去了原本「同組代理」帶來的便利性。

**目標：** 
讓專案檢視員 (GRP-PROJ) 在保有「全公司資產唯讀權限」的同時，**重新獲得對其所屬部門（同組）資產的操作權限**。
實作必須確保 UX 良好：按鈕應永遠顯示，但唯有勾選了具備操作權限的資產時才能點擊；若混合勾選了無權限的資產，按鈕應予以反灰 (Disabled)，並提供友善的提示，且後端既有防線必須完整維持。

## 2. 系統架構變更 (Architecture Changes)

我們將採用「後端運算標記，前端無腦綁定」的架構（Approach 1: Backend-driven Tagging）。由後端在匯出資料時，預先為每一筆資產標記該登入者是否具備操作權 (`canOperate: boolean`)。

### 2.1 Backend (`code.js`)
在載入使用者資產的主程式 `getUserStateData` 中：
1. **快取同組名單：** 
   若 `isGroupProxyTransferEnabled()` 為真，提前呼叫並建立 `groupEmailSet`（減少迴圈內的重複運算）。
2. **標記 `canOperate` 屬性：**
   在迴圈解析並產生每筆資產紀錄時，加入 `canOperate` 屬性。其判斷優先序為：
   - 若 `isAdmin` 為 true，則 `canOperate = true`。
   - 若開啟同組代理 (`groupProxyEnabled = true`)，檢查該資產之 `leaderEmail` 或 `userEmail` 是否存在於 `groupEmailSet` 內，若是則 `canOperate = true`。
   - 若未開啟同組代理，僅檢查該資產之 `leaderEmail` 或 `userEmail` 是否與當前使用者信箱完全吻合。
   - 若皆不符合，則 `canOperate = false`。
3. 後端本身的寫入端點（如 `processBatchTransferApplication` 等）**不需更動**，因為它們目前已嚴格依照 `isAdmin` 與同組名單防護，不會因 `useAdminScope = true` 而門戶大開。

### 2.2 Frontend State (`alpine_store.html`)
在 Alpine JS 狀態管理器中：
1. 擴充 `app` 模組，新增一個 getter `canOperateSelectedAssets`。
2. 該屬性將遍歷 `this.selectedAssets`（若是單筆模式則檢查當下 `this.asset`）。
3. 只要勾選清單中，有**任何一筆**資產的 `canOperate` 為 `false`，該屬性即回傳 `false`。
4. 必須確保 `hasAsset` 為 `true` (有選中東西) 的前提下才能回傳 `true`。

### 2.3 Frontend UI (`alpine_views.html`)
在行動決策面板 (Action Panel) 的 HTML 結構中：
1. **移除 `x-show` 限制：** 刪除原本的 `x-show="!$store.app.isProjectViewer || $store.app.isAdmin"`，確保按鈕必定可見。
2. **綁定 `:disabled`：** 修改原有的 `:disabled="!hasAsset"` 為 `:disabled="!hasAsset || !$store.app.canOperateSelectedAssets"`。
3. **新增 `:title` 提示：** 加上 `x-bind:title="(!hasAsset || $store.app.canOperateSelectedAssets) ? '' : '您沒有權限操作所選的某些資產'"`，讓游標移過反灰按鈕時能顯示原因。

## 3. 測試與驗證計畫 (Verification Strategy)

- **權限疊加驗證：** 使用一組被設定為 `GRP-PROJ`（專案檢視員）但不是系統管理員的帳號登入。
- **同組資產操作：** 勾選與該帳號同屬一個部門（或自身）的資產，確認「轉移、出借、報廢」按鈕亮起且可點擊。
- **跨組資產限制：** 勾選一筆非同組的資產，確認按鈕反灰且無法點選，游標停置可見錯誤提示。
- **混合勾選限制：** 同時勾選一筆同組與一筆跨組資產，確認按鈕依然反灰。
- **管理員覆蓋測試：** 使用具備管理員身分的帳號登入，確保隨意勾選任何資產，按鈕皆恆為可用狀態。
