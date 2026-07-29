# Filter Drawer Push Interaction Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Modify connect.html to wrap the filter card in a hidden CSS Grid drawer that slides down on hover and pushes content, including an interactive arrow tab.

**Architecture:** A new `.filter-drawer-wrapper` (grid `0fr` to `1fr`) wraps the existing `.card`. A `.filter-drawer-tab` sits at the bottom edge. Vanilla JS handles global mouse positioning, hover states, and focus-based auto-retract pausing.

**Tech Stack:** HTML, Vanilla CSS, Vanilla JS, FontAwesome, Google Apps Script.

## Global Constraints

- Target: `connect.html` only
- Framework: No JS frameworks, pure Vanilla JS.
- Testing: No automated testing framework; rely on manual visual/DOM testing.
- Must preserve existing `<select>` and `checkbox` elements exactly.

---

### Task 1: Add CSS Styles for Drawer and Tab

**Files:**
- Modify: `connect.html` (CSS section, inside `<style>`)

**Interfaces:**
- Produces: CSS classes `.filter-drawer-wrapper`, `.filter-drawer-inner`, `.filter-drawer-tab`, `.is-open`, `@keyframes breatheTab`.

- [ ] **Step 1: Write CSS definitions**

Add this to the `<style>` block in `connect.html`:

```css
/* Filter Drawer Styles */
.filter-drawer-wrapper {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 40;
}
.filter-drawer-wrapper.is-open {
  grid-template-rows: 1fr;
}
.filter-drawer-inner {
  overflow: hidden;
}
.filter-drawer-tab {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 24px;
  background-color: white;
  border-radius: 0 0 50px 50px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 41;
  transition: background-color 0.2s;
}
.filter-drawer-tab:hover {
  background-color: #f8fafc;
}
.filter-drawer-tab i {
  color: #64748b;
  font-size: 14px;
  transition: transform 0.4s;
}
.filter-drawer-wrapper.is-open .filter-drawer-tab i {
  transform: rotate(180deg);
}

/* Breathing Animation */
@keyframes breatheTab {
  0%, 100% { transform: translate(-50%, 0); }
  50% { transform: translate(-50%, 3px); }
}
.filter-drawer-wrapper:not(.is-open) .filter-drawer-tab {
  animation: breatheTab 2s infinite ease-in-out;
}
.filter-drawer-wrapper:not(.is-open) .filter-drawer-tab:hover {
  animation: none;
}
```

- [ ] **Step 2: Verify CSS**
Run: Visually check that styles are properly closed and valid. (Manual)
Expected: Valid CSS syntax.

- [ ] **Step 3: Commit**
```bash
git add connect.html
git commit -m "feat: add CSS for filter drawer push interaction"
```

### Task 2: Refactor HTML DOM Structure

**Files:**
- Modify: `connect.html` (HTML body)

**Interfaces:**
- Consumes: CSS classes from Task 1.
- Produces: The modified HTML DOM with `#filterDrawerWrapper`.

- [ ] **Step 1: Wrap existing filter card in new DOM**

Locate the filter section starting with `<section class="card p-4 md:p-5 mb-5">` (around line 728) and wrap it like this:

```html
<!-- 新增抽屜外層 -->
<div class="filter-drawer-wrapper" id="filterDrawerWrapper">
  <div class="filter-drawer-inner">
    
    <!-- 將原本的 filter section 放在這裡 -->
    <section class="card p-4 md:p-5 mb-5" style="border-top-left-radius: 0; border-top-right-radius: 0;">
      <!-- existing filter fields (do not change contents) -->
    </section>

  </div>
  <!-- 下拉環 -->
  <div class="filter-drawer-tab" id="filterDrawerTab" title="展開/收合篩選器">
    <i class="fa-solid fa-chevron-down"></i>
  </div>
</div>
```

- [ ] **Step 2: Verify HTML DOM**
Run: Inspect `connect.html` structure.
Expected: Card is wrapped. In browser, filter is hidden by default. The tab shows at the top and breathes.

- [ ] **Step 3: Commit**
```bash
git add connect.html
git commit -m "feat: wrap filter card in CSS Grid drawer DOM"
```

### Task 3: Implement Basic Interaction Logic (Hover & Auto-Retract)

**Files:**
- Modify: `connect.html` (JS section, near the end of `<script>`)

**Interfaces:**
- Consumes: `#filterDrawerWrapper`, `#filterDrawerTab` DOM IDs.
- Produces: `toggleFilterDrawer()`, `drawerTimeout`, `isFilterDrawerFocused`.

- [ ] **Step 1: Add JS variables and event listeners for hover/toggle**

Add this to the script block:

```javascript
let drawerTimeout = null;
let isFilterDrawerFocused = false;

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
  // 如果內部有焦點，暫停自動收合
  if (isFilterDrawerFocused) return;
  
  drawerTimeout = setTimeout(() => {
    toggleFilterDrawer(false);
  }, 300);
}

function handleDrawerMouseEnter() {
  clearTimeout(drawerTimeout);
  toggleFilterDrawer(true);
}

document.addEventListener('DOMContentLoaded', () => {
  const wrapper = document.getElementById('filterDrawerWrapper');
  const tab = document.getElementById('filterDrawerTab');
  
  if (wrapper && tab) {
    // 拉環點擊切換
    tab.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleFilterDrawer();
    });
    
    // 移入與移出
    wrapper.addEventListener('mouseenter', handleDrawerMouseEnter);
    wrapper.addEventListener('mouseleave', handleDrawerMouseLeave);
  }
});

// 全域滑鼠 Y 座標偵測 (靠近上方邊緣時自動展開)
document.addEventListener('mousemove', (e) => {
  if (e.clientY < 30) {
    handleDrawerMouseEnter();
  }
});
```

- [ ] **Step 2: Verify Toggle Logic**
Run: Manual preview. Move mouse to Y < 30 or hover the tab.
Expected: Drawer expands. Leave the drawer area, it waits 300ms and retracts.

- [ ] **Step 3: Commit**
```bash
git add connect.html
git commit -m "feat: add hover and toggle logic for filter drawer"
```

### Task 4: Implement Focus Safeguard (Pause Auto-Retract)

**Files:**
- Modify: `connect.html` (JS section, inside the DOMContentLoaded listener added in Task 3)

**Interfaces:**
- Consumes: `isFilterDrawerFocused`, `toggleFilterDrawer()` from Task 3.

- [ ] **Step 1: Add focus and click-outside tracking logic**

Add these listeners inside the `if (wrapper && tab)` block in `DOMContentLoaded`:

```javascript
    // 監聽焦點進入與離開 (防呆機制)
    wrapper.addEventListener('focusin', () => {
      isFilterDrawerFocused = true;
      clearTimeout(drawerTimeout); // 確保不會收合
    });
    
    // 點選 select 或 checkbox 造成 change 時，保持開啟狀態
    wrapper.addEventListener('change', () => {
      isFilterDrawerFocused = true; 
    });

    // 點擊外部強制收合
    document.addEventListener('click', (e) => {
      if (!wrapper.contains(e.target)) {
        isFilterDrawerFocused = false; // 解除防呆
        toggleFilterDrawer(false); // 收合
      }
    });
```

- [ ] **Step 2: Verify Focus Safeguard**
Run: Manual preview. Open drawer, click a `<select>`. Move mouse outside.
Expected: Drawer does NOT retract. Click on background -> drawer retracts.

- [ ] **Step 3: Commit**
```bash
git add connect.html
git commit -m "feat: add focus safeguard for filter drawer auto-retract"
```
