# Filter Drawer Pin Feature Design

## Objective
在既有的進階篩選卡片（Filter Drawer）下拉環中新增一個「釘選 (Pin)」功能。讓使用者可以固定篩選卡片，避免因滑鼠移開或點擊外部而自動隱藏，提升操作體驗。

## Architecture & Components

### 1. Visual Interface (HTML & CSS in `connect.html`)
- **下拉環 (Filter Drawer Tab) 調整**：
  - 將 `.filter-drawer-tab` 的寬度微調（從 60px 增至 80px）。
  - 將內部排版設定為 Flex 置中，並給予適當的 `gap` (例如 `gap: 12px;`)。
- **圖釘圖示 (Pin Icon)**：
  - 在原有的 Chevron 箭頭圖示旁邊，新增 `<i class="fa-solid fa-thumbtack" id="filterPinBtn"></i>`。
- **釘選狀態樣式 (`.is-pinned`)**：
  - 增加 `.filter-drawer-tab i#filterPinBtn.is-pinned` 的 CSS 樣式。
  - 當啟動釘選時，圖示顏色轉為藍色（`color: #3b82f6`），並且稍微傾斜（`transform: rotate(-45deg)`），給予明顯的視覺回饋。

### 2. Interaction Logic (JavaScript in `connect.html`)
- **State Management**：
  - 新增全域變數 `let isFilterDrawerPinned = false;`。
- **Event Listeners**：
  - **圖釘點擊事件**：為 `filterPinBtn` 綁定 `click` 事件。點擊時，切換 `isFilterDrawerPinned` 狀態，並在圖釘圖示上 `toggle` `.is-pinned` class。此事件需呼叫 `e.stopPropagation()` 以避免觸發外層拉環的展開/收合事件。
  - **阻擋自動收合**：
    - 修改 `handleDrawerMouseLeave`：若 `isFilterDrawerPinned === true`，則直接 `return`，不執行 `setTimeout` 收合邏輯。
    - 修改 `document` 的 `click` 事件（點擊外部）：若 `isFilterDrawerPinned === true`，則不觸發 `toggleFilterDrawer(false)`。
  - **手動收合重置**：
    - 當使用者主動點擊拉環（`filterDrawerTab`）將卡片收合時，自動重置 `isFilterDrawerPinned = false` 並移除圖釘的 `.is-pinned` 樣式。這能確保下一次重新展開卡片時，釘選狀態不會意外殘留。

## Data Flow & Error Handling
- 此為純前端 UI 互動邏輯更新，無後端 API 資料流變動。
- 圖釘按鈕的 `click` 事件獨立處理，並透過 `stopPropagation()` 避免與既有的 `filterDrawerTab` 點擊事件衝突。
- 透過「手動收合即重置」的防呆設計，避免使用者關閉卡片後，系統底層仍處於釘選狀態的問題。

## Testing & Validation
- **狀態切換**：卡片展開後，點擊圖釘圖示。確認圖示會改變顏色與角度（藍色，傾斜 -45度）。
- **防收合測試**：
  1. 釘選後，將滑鼠移開卡片範圍，確認卡片保持展開。
  2. 釘選後，點擊網頁外部空白處，確認卡片保持展開。
- **解除釘選與重置測試**：
  1. 再次點擊圖釘圖示解除釘選，此時滑鼠移開或點擊外部，卡片能正常收合。
  2. 在釘選狀態下，直接點擊外層拉環將卡片收合。確認卡片成功收合，且下次再展開時，圖釘已恢復未釘選的初始狀態。
