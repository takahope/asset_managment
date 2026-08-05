# Mobile Filter Layout Design Spec

## Overview
調整 `connect.html` 在手機版（螢幕較窄時）的篩選操作區域排版，主要針對按鈕群組、下拉選單排列方式，以及勾選方塊的折行處理進行優化，以提升行動裝置上的操作體驗。

## Scope
- 影響範圍：僅限 `connect.html` 的前端 HTML 結構與 CSS 樣式。
- 條件範圍：部分樣式僅在手機版（`< 768px`）生效，桌面版維持原樣。

## Component Design

### 1. 按鈕群組化 (Export & Settings)
**問題**：在原本的 flex 容器中，匯出與設定按鈕可能會因為外層的 `flex-wrap` 被迫分到不同的列。
**解法**：在 HTML 結構中，使用一個新的 `div` 容器將兩者包裹起來。
**實作細節**：
*   將 `#exportDropdownContainer` 與 `#btnSettings` 包在 `<div class="flex items-center gap-4">` 內。
*   這樣在父層的 `flex-wrap` 觸發時，這兩個按鈕會被視為單一元素，從而保證永遠在同一列。

### 2. 下拉選單 2x4 網格排版 (Mobile Only)
**問題**：原有的 `#filterSelects` 下拉選單在手機版並未最佳化空間利用。
**解法**：利用 CSS Grid 將其在手機版設定為兩欄式等寬排版。
**實作細節**：
*   在 `connect.html` 內的 `<style>` 區塊，新增針對 `.filter-selects` 的 `@media (max-width: 768px)` 設定：
    ```css
    @media (max-width: 768px) {
      .filter-selects {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 8px;
      }
      .filter-selects .ms-filter {
        width: 100%;
        margin-bottom: 0; /* 消除原本的 flex gap 帶來的潛在 margin */
      }
    }
    ```

### 3. 勾選方塊獨立折行 (Mobile Only)
**問題**：`#checkboxRow` 包含三個選項，第三個選項字數較多，在手機版容易導致版面擁擠或被截斷。
**解法**：為容器加上自動折行，並強制第三個選項在手機版佔滿寬度 (`100%`)。
**實作細節**：
*   將 `#checkboxRow` 容器的 class 從 `flex items-center gap-4 mb-3` 修改為 `flex flex-wrap items-center gap-4 mb-3`。
*   將第三個選項（「同時顯示無對應資產HW類...」）的 `<label>` 標籤，加上 Tailwind class：`w-full md:w-auto`。
*   如此一來，前兩個選項會留在第一列靠左，第三個選項則在手機版被擠到第二列滿版顯示。

## Self-Review Checklist
- [x] Placeholder scan: No placeholders or ambiguous terms.
- [x] Internal consistency: HTML and CSS changes align perfectly with the goals.
- [x] Scope check: Scope is narrow and strictly UI-focused.
- [x] Ambiguity check: The conditions (Mobile vs Desktop) are explicitly defined using Tailwind classes and standard media queries.
