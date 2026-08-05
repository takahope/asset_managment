# ISMS Connect - 顯示未連動 HW 篩選器設計規格 (Spec)

## 1. 概述 (Overview)
在 `connect.html` 的現有核取方塊過濾器（駐站、無對應資產編號）旁，新增一個「顯示未連動 HW」的核取方塊。
此功能旨在幫助管理者在同一個清單中，能同時檢視「實體資產」以及「尚未連動的 HW 資訊資產」，並且這兩者都會受到上方各類下拉選單的篩選控制。

## 2. UI 設計 (UI Design)
- **位置**：`connect.html` 的 `#checkboxRow` 區塊中，放在「無對應資產編號」核取方塊的右側。
- **元件**：
  - Type: `<input type="checkbox">`
  - ID: `noAssetMappingHWCb`
  - 標籤文字：「顯示未連動 HW」
- **互動行為**：勾選與取消勾選會觸發 `setFilterState('noAssetMappingHW', this.checked)`，並重新呼叫 `applyFilters()` 渲染表格與統計卡。

## 3. 資料篩選邏輯 (Data Filtering Logic)
- **狀態管理**：
  - 在 `filterState` 物件中新增 `noAssetMappingHW: false` 的預設狀態。
  - 在 `clearAllFilters` 函式中，確保 `noAssetMappingHW` 也會被重置為 `false`。
  - 在更新核取方塊的 UI 時，確保一併處理 `noAssetMappingHWCb` 的勾選狀態。
- **核心過濾器 (`matchesFilters` 函式)**：
  - 當 `filterState.noAssetMappingHW` 為 `true` 且未被 `excludeDim` 排除時，執行以下邏輯檢查：
    - **條件一**：是否為未連動的 HW 資訊資產（`asset.assetId === '無對應資產/消耗品'` 且 `asset.category === 'HW'`）
    - **條件二**：是否為一般實體資產（`asset.assetId !== '無對應資產/消耗品'`）
  - 若一筆資產 **不符合** 條件一 也 **不符合** 條件二，則回傳 `false` 將其濾除。（換言之，此選項會過濾掉未連動的非 HW 資訊資產，例如 EV 類或軟體類，保留其餘所有資料）。
  - 通過上述檢查的資料，會繼續往下執行既有的下拉選單篩選邏輯（如保管人、ISO 範圍、部門等）。

## 4. 影響範圍與測試項目 (Impact & Testing)
- **影響範圍**：
  - `connect.html` 的 HTML 結構 (`#checkboxRow`)
  - `connect.html` 的前端 Javascript 狀態管理 (`filterState`, `clearAllFilters`, `setFilterState`)
  - `connect.html` 的篩選邏輯 (`matchesFilters`)
- **無影響**：
  - 不動到後端 `code.js`。
  - 不影響實體資產原本的下拉選單篩選行為。
- **測試項目**：
  1. 勾選「顯示未連動 HW」時，清單內不該出現未連動的 EV 資產。
  2. 勾選「顯示未連動 HW」並選擇上方下拉選單（例如 ISO 範圍為 V）時，清單只顯示符合 ISO 範圍 V 的實體資產與未連動 HW 資產。
  3. 點擊「清除篩選」按鈕能正確解除此選項的勾選狀態並恢復全部列表。
