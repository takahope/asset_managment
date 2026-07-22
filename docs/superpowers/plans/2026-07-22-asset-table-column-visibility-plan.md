# Asset Table Column Visibility Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Allow users to show or hide non-essential columns in the desktop asset table and persist preferences to localStorage.

**Architecture:** We add a `visibleColumns` array state to the `filterSection` Alpine.js component and initialize it from `localStorage`. We add a dropdown UI in the filter toolbar to toggle the columns. We add `x-show` bindings to the desktop table headers (`<th>`) and cells (`<td>`) in `alpine_views.html`.

**Tech Stack:** HTML, Alpine.js, TailwindCSS.

## Global Constraints

- **僅套用於桌面版表格**：由於手機版卡片已經過排版最佳化，因此此欄位隱藏功能不在手機版生效。
- **儲存偏好設定**：設定會即時存入瀏覽器的 `localStorage` 中。
- **必備欄位（不可隱藏）**：首欄勾選框、財產編號 (Asset ID)、操作 (Actions)。

---

### Task 1: Add State and Initialization Logic

**Files:**
- Modify: `alpine_views.html`

**Interfaces:**
- Produces: `visibleColumns` array in `filterSection` Alpine component state.
- Produces: `isColumnMenuOpen` boolean in `filterSection` Alpine component state.
- Produces: `allToggleableColumns` array defining the available columns.

- [ ] **Step 1: Add state to filterSection in `alpine_views.html`**

Update `Alpine.data('filterSection', function () { return { ... } })` to include the state variables. Find the `return {` line (around line 12) and add the state variables:

```javascript
            localSearch: '',
            // (New) Column visibility state
            allToggleableColumns: [
                { key: 'systemCategory', label: '系統類別' },
                { key: 'assetName', label: '財產名稱' },
                { key: 'aliasDisplay', label: '財產別名' },
                { key: 'modelBrand', label: '型號/廠牌' },
                { key: 'userName', label: '使用者' },
                { key: 'leader', label: '保管人' },
                { key: 'location', label: '保管位置' },
                { key: 'group', label: '組別' },
                { key: 'category', label: '財產類別' },
                { key: 'status', label: '狀態' }
            ],
            visibleColumns: [],
            isColumnMenuOpen: false,
```

- [ ] **Step 2: Add logic to `init()`**

Find `init: function () {` in `filterSection`. Add logic to load from `localStorage` or default to all columns:

```javascript
                // (New) Load visible columns from localStorage
                var savedColumns = localStorage.getItem('assetTableVisibleColumns');
                if (savedColumns) {
                    try {
                        self.visibleColumns = JSON.parse(savedColumns);
                    } catch (e) {
                        self.visibleColumns = self.allToggleableColumns.map(function(c) { return c.key; });
                    }
                } else {
                    self.visibleColumns = self.allToggleableColumns.map(function(c) { return c.key; });
                }
                
                // Watch for changes to save to localStorage
                self.$watch('visibleColumns', function (value) {
                    localStorage.setItem('assetTableVisibleColumns', JSON.stringify(value));
                });
```

- [ ] **Step 3: Update `_outsideHandler` to close the new dropdown**

In `init`, find `this._outsideHandler = function (event) {` and modify it to close `isColumnMenuOpen` when clicking outside:

```javascript
                this._outsideHandler = function (event) {
                    var root = event.target && event.target.closest ? event.target.closest('.fs-dropdown-root') : null;
                    if (root && self.$root.contains(root)) return;
                    self.closeAllDropdowns();
                    
                    var colRoot = event.target && event.target.closest ? event.target.closest('.column-dropdown-root') : null;
                    if (!colRoot) self.isColumnMenuOpen = false;
                };
```

- [ ] **Step 4: Commit**

```bash
git add alpine_views.html
git commit -m "feat: add visibleColumns state and localStorage persistence to filterSection"
```

### Task 2: Add Dropdown Menu UI

**Files:**
- Modify: `alpine_views.html`

**Interfaces:**
- Consumes: `visibleColumns`, `allToggleableColumns`, `isColumnMenuOpen` from Task 1.

- [ ] **Step 1: Add Dropdown button to the toolbar**

Find `<div class="filter-toolbar-actions ...">` in `alpine_views.html` (around line 874). Insert the dropdown HTML as the first element inside `.filter-toolbar-actions`, before the "清除篩選" button:

```html
                        <!-- 顯示欄位選單 -->
                        <div class="relative column-dropdown-root col-span-2 w-full lg:col-auto lg:w-auto">
                            <button type="button" @click="isColumnMenuOpen = !isColumnMenuOpen"
                                    class="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors border-slate-200 text-slate-700 bg-white hover:bg-slate-50 w-full"
                                    title="自訂顯示欄位">
                                <i class="fa-solid fa-gear"></i>
                                顯示欄位
                            </button>
                            <div x-show="isColumnMenuOpen" x-transition.opacity.duration.200ms style="display: none;"
                                 class="absolute left-0 lg:right-0 lg:left-auto top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1.5 z-[60]">
                                <template x-for="col in allToggleableColumns" :key="col.key">
                                    <label class="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-50 cursor-pointer text-sm text-slate-700 transition-colors">
                                        <input type="checkbox" :value="col.key" x-model="visibleColumns"
                                               class="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer">
                                        <span x-text="col.label"></span>
                                    </label>
                                </template>
                            </div>
                        </div>
```

- [ ] **Step 2: Commit**

```bash
git add alpine_views.html
git commit -m "feat: add column visibility dropdown menu to toolbar"
```

### Task 3: Apply `x-show` to Desktop Table

**Files:**
- Modify: `alpine_views.html`

**Interfaces:**
- Consumes: `visibleColumns` array from Task 1.

- [ ] **Step 1: Update Table Headers (`<thead>`)**

Locate the table header `<thead>` in the desktop table (around line 1476).
For every `<th>` except the Checkbox (`w-10`), Asset ID (`財產編號`), and Actions (`操作`), add `x-show="visibleColumns.includes('...')"` matching the keys. 

Ensure the modified headers look like this:
```html
<th x-show="visibleColumns.includes('systemCategory')" class="px-2 py-3 font-semibold text-slate-600 whitespace-nowrap">系統類別</th>
<th x-show="visibleColumns.includes('assetName')" class="px-2 py-3 font-semibold text-slate-600 w-[160px] max-w-[160px]">財產名稱</th>
<th x-show="visibleColumns.includes('aliasDisplay')" class="px-2 py-3 font-semibold text-slate-600 w-[160px] max-w-[160px]">財產別名</th>
<th x-show="visibleColumns.includes('modelBrand')" class="px-2 py-3 font-semibold text-slate-600 w-[180px] max-w-[180px]">型號/廠牌</th>
<th x-show="visibleColumns.includes('userName')" class="px-2 py-3 font-semibold text-slate-600 whitespace-nowrap">使用者</th>
<th x-show="visibleColumns.includes('leader')" class="px-2 py-3 font-semibold text-slate-600 whitespace-nowrap">保管人</th>
<th x-show="visibleColumns.includes('location')" class="px-2 py-3 font-semibold text-slate-600 min-w-[100px]">保管位置</th>
<th x-show="visibleColumns.includes('group')" class="px-2 py-3 font-semibold text-slate-600 whitespace-nowrap">組別</th>
<th x-show="visibleColumns.includes('category')" class="px-2 py-3 font-semibold text-slate-600 whitespace-nowrap">財產類別</th>
<th x-show="visibleColumns.includes('status')" class="px-2 py-3 font-semibold text-slate-600 whitespace-nowrap">狀態</th>
```

- [ ] **Step 2: Update Table Data Cells (`<tbody>`)**

Similarly, locate the `<td>` elements in the `<tbody>` loop (around line 1500) and add the matching `x-show` directives. Make sure the order exactly matches the table headers. Example:

```html
<td x-show="visibleColumns.includes('systemCategory')" class="px-2 py-3 whitespace-nowrap align-top">
...
<td x-show="visibleColumns.includes('assetName')" class="px-2 py-3 font-medium text-slate-800 align-top w-[160px] max-w-[160px]">
...
<td x-show="visibleColumns.includes('aliasDisplay')" class="px-2 py-3 text-slate-600 align-top w-[160px] max-w-[160px]">
...
<td x-show="visibleColumns.includes('modelBrand')" class="px-2 py-3 text-slate-600 align-top w-[180px] max-w-[180px]">
...
<td x-show="visibleColumns.includes('userName')" class="px-2 py-3 text-slate-600 whitespace-nowrap align-top" x-text="row.asset.userName"></td>
...
<td x-show="visibleColumns.includes('leader')" class="px-2 py-3 text-slate-600 whitespace-nowrap align-top" x-text="row.asset.leader"></td>
...
<td x-show="visibleColumns.includes('location')" class="px-2 py-3 text-slate-600 align-top">
...
<td x-show="visibleColumns.includes('group')" class="px-2 py-3 text-slate-600 align-top">
...
<td x-show="visibleColumns.includes('category')" class="px-2 py-3 text-slate-600 align-top">
...
<td x-show="visibleColumns.includes('status')" class="px-2 py-3 align-top">
```

- [ ] **Step 3: Commit**

```bash
git add alpine_views.html
git commit -m "feat: apply column visibility toggle to desktop table headers and cells"
```
