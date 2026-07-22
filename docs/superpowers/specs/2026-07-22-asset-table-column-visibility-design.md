# Asset Table Column Visibility Design

## Overview
使用者可以自訂在「資產表格（桌面版）」中想要顯示或隱藏的欄位，並將設定記憶在本地端，以提升個人化操作體驗。

## Scope
- **僅套用於桌面版表格**：由於手機版卡片已經過排版最佳化，因此此欄位隱藏功能不在手機版生效。
- **儲存偏好設定**：設定會即時存入瀏覽器的 `localStorage` 中。
- **必備欄位（不可隱藏）**：首欄勾選框、財產編號 (Asset ID)、操作 (Actions)。

## Architecture & Data Flow
1. **State Management**:
   - 在 Alpine.js (`filterSection` 或對應的全域 `store`) 中宣告一個 `visibleColumns` 狀態，儲存目前顯示的欄位 key。
   - 可切換的欄位清單（暫定 key）：`['systemCategory', 'assetName', 'aliasDisplay', 'modelBrand', 'userName', 'leader', 'location', 'group', 'category', 'status']`。
2. **Data Persistence (`localStorage`)**:
   - 初始化 (`init()`) 時檢查 `localStorage.getItem('assetTableVisibleColumns')`。
   - 若有紀錄，則解析該 JSON 並賦值給 `visibleColumns`。
   - 若無紀錄，則預設所有可隱藏欄位皆為顯示。
   - 使用者切換選項時，即時更新 `visibleColumns` 陣列並呼叫 `localStorage.setItem` 寫回。

## UI Components
1. **Dropdown Menu (欄位選單)**:
   - 放置於 `alpine_views.html` 中 `.filter-toolbar-actions` 區塊，即「清除篩選」按鈕的旁邊。
   - 按鈕設計包含「⚙️ 顯示欄位」字樣與圖示。
   - 點擊按鈕後，以 `x-show` 展開一個具有陰影與邊框的下拉選單 (absolute 定位)。
   - 選單內部透過 `x-for` 迴圈或直接寫死 Checkbox 清單，綁定 `x-model="visibleColumns"`。
2. **Desktop Table Updates (表格渲染修改)**:
   - 針對桌面版 `<div class="hidden md:block overflow-x-auto">` 的 `<table id="asset-list">`。
   - 在表頭 `<th>` 與資料列 `<td>` 中，除了必備欄位外，其餘欄位加上 `x-show="visibleColumns.includes('欄位代碼')"`。
   - 搭配 Alpine.js 特性，當 `visibleColumns` 改變時，對應的直排將會瞬間顯示或隱藏，無須重整畫面。
