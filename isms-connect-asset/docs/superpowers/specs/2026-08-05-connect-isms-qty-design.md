# 資訊資產數量顯示與格式設定 (ISMS Asset Quantity Display)

## 1. 目的
在實體資產列表 (`connect.html`) 中新增「資訊資產數量」欄位，讓使用者能在查看實體資產時，直接掌握該實體資產所屬之資訊資產的總數量與連動狀況。同時提供全域設定，讓管理者能決定顯示的格式。

## 2. 顯示邏輯
資訊資產數量分為兩種來源：
1. **虛擬數量**：來自 ISMS 資訊資產清單的數量（`quantity`）。
2. **連動數量**：由系統中對應到該資訊資產的實體資產數量計算而來。

管理者可在「系統設定」中，切換以下三種全域顯示格式（`quantityDisplayMode`）：
- `virtual`: 僅顯示虛擬數量 (例: 4)
- `mapped`: 僅顯示連動數量 (例: 2)
- `both`: 兩者皆顯示 (例: (4/2))

若實體資產尚未連動任何資訊資產，則數量顯示為 `-`。

## 3. 架構與實作細節

### 3.1 後端擴充 (`code.js`)
- **資料回傳 (`getAssetsWithMappingStatus`)**：
  1. 處理實體資產對應 `mappedIsmsAssetId` 時，一併將 `ismsAsset.quantity` 加入產出的物件中，屬性命名為 `ismsAssetQty`。
  2. 為了減少 API 請求，在此函式的回傳物件中，順便從 PropertiesService 讀取並附加 `quantityDisplayMode`（預設為 `both`）。
- **設定寫入 (`saveBusinessProcessSettings`)**：
  - 擴充儲存邏輯，接收前端傳來的 `quantityDisplayMode`，並存入 PropertiesService。

### 3.2 前端設定介面 (`connect.html`)
- 在「系統設定」彈出視窗 (`#settingsModal`) 中，新增一個下拉選單：
  ```html
  <div class="mb-4">
    <label class="block text-sm font-medium text-gray-700 mb-2">資訊資產數量顯示格式</label>
    <select id="settingQuantityDisplayMode" class="form-select text-sm w-full border-gray-300 rounded-md">
      <option value="both">兩者皆顯示 (虛擬數量/連動數量)</option>
      <option value="virtual">僅顯示虛擬數量</option>
      <option value="mapped">僅顯示實際連動數量</option>
    </select>
  </div>
  ```
- **讀取設定 (`renderSettings`)**：從 `data.quantityDisplayMode`（若無則從全域變數讀取）設定下拉選單的值。因為 `getBusinessProcessSettings` 也需要回傳這個設定，後端該 API 需同步調整。
- **寫入設定 (`submitSettings`)**：捕捉選單值，並隨同其他設定一併傳給伺服器儲存。
- **立即生效**：設定儲存成功後，更新前端全域變數 `globalQuantityDisplayMode`，並呼叫 `applyFilters()` 重繪畫面與卡片，讓修改即時生效。

### 3.3 前端表格呈現 (`connect.html`)
- **全域變數**：新增 `globalQuantityDisplayMode = 'both'` 預設值，當 `loadAssets()` 成功時，以伺服器回傳的值覆蓋它。
- **欄位定義 (`DEFAULT_COL_PREFS`)**：新增欄位定義，並預設為顯示。
  ```javascript
  { id: 'ismsAssetQty', label: '資產數量', visible: true, mobileVisible: true, scanVisible: true }
  ```
- **欄位渲染 (`getAssetFieldValue`)**：
  若 `fieldId === 'ismsAssetQty'`：
  1. 檢查 `asset.mappedIsmsAssetId`，若無連動則回傳 `-`。
  2. 取得虛擬數量：`vQty = asset.ismsAssetQty || '0'`。
  3. 取得連動數量：`mQty = getPhysicalMappingCounts()[asset.mappedIsmsAssetId] || 0`。（`getPhysicalMappingCounts()` 執行一次遍歷並快取結果為佳，若無法快取，因目前實作速度快，可直接呼叫）。
  4. 根據 `globalQuantityDisplayMode` 回傳組合字串：
     - `virtual` ➔ `vQty`
     - `mapped` ➔ `mQty`
     - `both` ➔ `(vQty/mQty)`

## 4. 防呆與邊界條件
- 若屬性服務 (PropertiesService) 中尚未有此設定，系統一律採用 `both`。
- 如果虛擬數量的值為空字串，在畫面顯示時會被視作 `0` 處理，避免顯示 `(/2)` 這類異常字串。
- 必須確保手機版卡片與匯出功能 (Dynamic Export) 能夠正常相容此欄位（因為 `getAssetFieldValue` 是共用邏輯，所以自動支援）。
