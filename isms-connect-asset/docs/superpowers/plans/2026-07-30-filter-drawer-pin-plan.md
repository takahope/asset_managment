# Filter Drawer Pin Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在進階篩選卡片的下拉環加入圖釘按鈕，提供使用者手動鎖定展開狀態的功能。

**Architecture:** 直接修改 `connect.html` 中的 DOM 結構與現有的 CSS / Vanilla JS，利用全域變數 `isFilterDrawerPinned` 來控制自動收合機制的觸發。

**Tech Stack:** HTML, CSS, Vanilla JavaScript, FontAwesome

## Global Constraints

- GAS Web App 架構，修改純前端 `connect.html`
- 無自動化測試框架，所有測試以手動 UI 驗證（GAS UI）進行
- 保留現有檔案註解與結構，不可隨意重構無關區塊

---

### Task 1: 視覺介面實作 (HTML & CSS)

**Files:**
- Modify: `connect.html`

**Interfaces:**
- Produces: UI component `<i id="filterPinBtn">` for JS to bind events.

- [ ] **Step 1: Write manual verification plan**

> Note: No automated test framework.
Test: 開啟 `connect.html` 網頁版，觀察卡片下方的拉環是否變寬，且內部是否出現圖釘圖示，點擊不會報錯。

- [ ] **Step 2: Implement HTML/CSS changes**

修改 `connect.html` 中的 `.filter-drawer-tab` 相關 CSS：
```css
    /* 修改現有的 .filter-drawer-tab (大約 line 571 附近) */
    .filter-drawer-tab {
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      width: 80px; /* 原本 60px 改為 80px */
      height: 24px;
      background-color: white;
      border-radius: 0 0 50px 50px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px; /* 新增 gap */
      cursor: pointer;
      z-index: 41;
      transition: background-color 0.2s;
    }

    /* 在既有的 .filter-drawer-wrapper.is-open .filter-drawer-tab i 下方新增圖釘樣式 */
    .filter-drawer-tab i#filterPinBtn {
      transition: transform 0.2s, color 0.2s;
      color: #64748b; /* 覆蓋旋轉的通用選擇器可能造成的影響，保持獨立顏色 */
    }
    
    .filter-drawer-wrapper.is-open .filter-drawer-tab i#filterPinBtn {
      /* 確保展開時，圖釘不會跟箭頭一樣被翻轉 180 度 */
      transform: none; 
    }

    .filter-drawer-tab i#filterPinBtn.is-pinned {
      color: #3b82f6 !important;
      transform: rotate(-45deg) !important;
    }
```

修改 `connect.html` 中的 HTML (大約 line 728 附近)：
```html
        <!-- 下拉環 -->
        <div class="filter-drawer-tab" id="filterDrawerTab" title="展開/收合篩選器">
          <i class="fa-solid fa-chevron-down"></i>
          <i class="fa-solid fa-thumbtack" id="filterPinBtn" title="釘選/解除釘選"></i>
        </div>
```

- [ ] **Step 3: Verify visual implementation**

Run: 手動重新載入網頁。
Expected: 下拉環變寬，內有箭頭與圖釘。開發者工具手動為 `#filterPinBtn` 加上 `.is-pinned` class 時，圖釘變為藍色且傾斜 -45 度。

- [ ] **Step 4: Commit**

```bash
git add connect.html
git commit -m "feat: add pin button ui to filter drawer tab"
```

---

### Task 2: 互動邏輯實作 (JavaScript)

**Files:**
- Modify: `connect.html`

**Interfaces:**
- Consumes: `#filterPinBtn` 元素。
- Produces: `isFilterDrawerPinned` 狀態變數。

- [ ] **Step 1: Write manual verification plan**

Test: 
1. 點擊圖釘，圖示變色傾斜，移開滑鼠不會收合，點外部不會收合。
2. 再次點擊圖釘，圖示復原，移開滑鼠能收合。
3. 點擊圖釘後，點擊拉環本身收合，下次展開時圖釘應該是未釘選狀態。

- [ ] **Step 2: Implement JS logic**

修改 `connect.html` 中的 Filter Drawer Logic (大約 line 3603 附近)：

```javascript
    // --- Filter Drawer Logic ---
    let drawerTimeout = null;
    let isFilterDrawerFocused = false;
    let isFilterDrawerPinned = false; // 新增全域變數

    function toggleFilterDrawer(forceOpen) {
      const wrapper = document.getElementById('filterDrawerWrapper');
      if (!wrapper) return;
      
      if (typeof forceOpen === 'boolean') {
        wrapper.classList.toggle('is-open', forceOpen);
      } else {
        wrapper.classList.toggle('is-open');
      }
    }

    function handleDrawerMouseLeave() {
      // 如果內部有焦點，或處於釘選狀態，暫停自動收合
      if (isFilterDrawerFocused || isFilterDrawerPinned) return;
      
      drawerTimeout = setTimeout(() => {
        toggleFilterDrawer(false);
      }, 300);
    }
    
    // ... 原有 handleDrawerMouseEnter 保持不變 ...
```

修改 `DOMContentLoaded` 內的事件綁定 (大約 line 3632 附近)：

```javascript
    document.addEventListener('DOMContentLoaded', () => {
      const wrapper = document.getElementById('filterDrawerWrapper');
      const tab = document.getElementById('filterDrawerTab');
      const pinBtn = document.getElementById('filterPinBtn'); // 新增
      
      if (wrapper && tab) {
        // 圖釘點擊事件
        if (pinBtn) {
          pinBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // 避免觸發拉環的展開/收合
            isFilterDrawerPinned = !isFilterDrawerPinned;
            pinBtn.classList.toggle('is-pinned', isFilterDrawerPinned);
          });
        }

        // 拉環點擊切換
        tab.addEventListener('click', (e) => {
          e.stopPropagation();
          // 如果卡片目前是開啟狀態，且我們準備關閉它，則重置釘選狀態
          if (wrapper.classList.contains('is-open')) {
            isFilterDrawerPinned = false;
            if (pinBtn) pinBtn.classList.remove('is-pinned');
          }
          toggleFilterDrawer();
        });
        
        // ... (保留 mouseenter, mouseleave, focusin, change 事件) ...

        // 點擊外部強制收合
        document.addEventListener('click', (e) => {
          if (!wrapper.contains(e.target)) {
            // 如果已釘選，阻擋點擊外部收合
            if (isFilterDrawerPinned) return;
            
            isFilterDrawerFocused = false; // 解除防呆
            toggleFilterDrawer(false); // 收合
          }
        });
      }
    });
```

- [ ] **Step 3: Verify JS logic**

Run: 手動重新載入網頁。依據 Step 1 的計畫測試。
Expected: 釘選功能正常鎖定卡片狀態，手動關閉卡片會重置釘選。

- [ ] **Step 4: Commit**

```bash
git add connect.html
git commit -m "feat: add filter drawer pin logic"
```
