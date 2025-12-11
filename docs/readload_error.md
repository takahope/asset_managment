# 除錯報告：表單提交後舊資料閃現問題 (Old Data Flashing Issue)

**日期:** 2025-12-10  
**受影響檔案:** `review.html`, `return.html`  
**參考範本:** `scrap.html`, `lending.html`

## 1. 問題描述 (Issue Description)
在 `review.html` (財產轉移接收) 與 `return.html` (歸還作業) 頁面中，當使用者選取項目並按下「提交」按鈕後，系統流程如下：
1.  顯示 Loading 進度條，隱藏表單內容。
2.  後端處理完成，回傳成功訊息。
3.  **異常現象：** 前端顯示成功訊息的同時，**舊的表單資料（包含剛剛已處理的項目）會再次「閃現」並顯示在畫面上**。
4.  經過約 2~3 秒的延遲 (`setTimeout`)，頁面才重新撈取資料並刷新，此時舊資料才消失。

這造成使用者困惑，誤以為資料未處理成功，或看到不一致的介面狀態。

## 2. 原因分析 (Root Cause Analysis)

經過與 `scrap.html` 及 `lending.html` (運作正常的頁面) 比較，發現問題出在 **UI 顯示狀態的切換時機**。

### 錯誤的邏輯 (Before):
1.  **提交時**: `showLoading(true)` -> 隱藏表單容器 (`display: none`)。
2.  **成功回調 (`handleSuccess`)**:
    *   呼叫 `showLoading(false)` -> **立即將表單容器設為 `display: block`**。
    *   此時 DOM 裡面的表格仍是**舊資料**。
    *   設定 `setTimeout` 延遲 N 秒後才呼叫 `loadData()`。
3.  **結果**: 在這 N 秒的等待期間，使用者看到了「成功訊息」+「舊的表單內容」。

### 正確的邏輯 (Target Behavior - 參考 `scrap.html`):
1.  **提交時**: 隱藏表單容器。
2.  **成功回調**:
    *   **保持表單容器隱藏** (不呼叫 `showLoading(false)` 或不還原 display)。
    *   僅顯示成功訊息 (`alert` 或 `status-message`)。
    *   設定 `setTimeout` 呼叫 `loadData()`。
3.  **資料載入完成 (`populateData`)**:
    *   更新 DOM 資料。
    *   **此時才將表單容器顯示出來 (`display: block`)**。

## 3. 解決方案與實作細節 (Solution Implementation)

### A. 修正 `return.html`

**問題點**: `handleSuccess` 函式中直接呼叫了 `showLoading(false)`，導致 `#main-form` 被提早顯示。

**修正方式**:
修改 `handleSuccess`，移除 `showLoading(false)`，改用 `hideProgressBar` (僅隱藏進度條遮罩，但不觸發 `#main-form` 的顯示邏輯)。表單顯示權責交回給 `loadData` -> `populateTable`。

```javascript
// 修改前
function handleSuccess(message) {
    showLoading(false); // <--- 這裡會導致 #main-form 變回 display: block
    const statusMsg = document.getElementById('status-message');
    // ...
}

// 修改後
function handleSuccess(message) {
    hideProgressBar('歸還完成！', 0); // <--- 僅隱藏進度條，不還原表單顯示
    const statusMsg = document.getElementById('status-message');
    // ...
}
```

### B. 修正 `review.html`

**問題點**: `review.html` 的 HTML 結構較為扁平，`#status-message` 與表格控制項 (`table`, `filters` 等) 同層級。如果隱藏父容器 `#main-content`，連成功訊息也會被隱藏。

**修正方式**:
1.  **HTML 結構調整**: 新增一個 `<div id="review-form-content">` 包裹住所有互動元件 (標題、篩選器、表格、按鈕)，將其與 `#status-message` 分離。
2.  **提交時 (`submitApproval`)**: 顯式隱藏 `#review-form-content`。
3.  **資料載入後 (`populateData`)**: 顯式顯示 `#review-form-content`。

```html
<!-- HTML 結構變更 -->
<div id="main-content">
    <!-- 新增包裹層，用於獨立控制表單顯示 -->
    <div id="review-form-content">
        <h4>...</h4>
        <!-- 篩選器、表格、按鈕... -->
    </div>
    
    <!-- status-message 獨立在外，確保表單隱藏時訊息仍可見 -->
    <div id="status-message"></div>
</div>
```

```javascript
// JavaScript 邏輯變更

function submitApproval() {
    // ...
    // 提交時隱藏表單內容，避免使用者操作，並準備顯示進度條
    document.getElementById('review-form-content').style.display = 'none'; 
    showProgressBar(...);
    // ...
}

function populateData(response) {
    // ... 資料更新邏輯 ...
    
    // 資料更新完畢後，才將表單內容顯示出來
    document.getElementById('review-form-content').style.display = 'block';
}
```

## 4. 結論 (Conclusion)

本次修正確保了所有頁面遵循一致的 SPA 刷新體驗：
1.  提交後 -> 介面進入 Loading 狀態 (表單隱藏)。
2.  成功後 -> 顯示成功訊息 (表單保持隱藏)。
3.  重新載入 -> 獲取新資料 -> 渲染新資料 -> **顯示表單**。

徹底解決了舊資料在資料更新前短暫閃現的問題，提升了使用者介面的流暢度與專業感。
