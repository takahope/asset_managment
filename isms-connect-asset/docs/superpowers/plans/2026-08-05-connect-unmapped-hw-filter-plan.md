# ISMS Connect - 顯示未連動 HW 篩選器 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 新增「顯示未連動 HW」核取方塊，讓管理者能一次瀏覽實體資產與尚未連動的硬體 (HW) 資訊資產。

**Architecture:** 
在 `connect.html` 的過濾區塊加入獨立核取方塊，並在 `matchesFilters` 邏輯中增加對此狀態的支援。當核取方塊啟用時，過濾掉所有未連動且類別非 HW 的資訊資產，其餘資產繼續套用既有的下拉選單篩選條件。

**Tech Stack:** HTML, Javascript, TailwindCSS

## Global Constraints

- 無自動化測試，必須手動透過 Code Review 與介面邏輯檢查。
- 必須遵循 `connect.html` 原有的架構，包含使用 `filterState` 與 `applyFilters()` 進行全域狀態重繪。

---

### Task 1: Update Frontend UI and State Initialization

**Files:**
- Modify: `connect.html`

**Interfaces:**
- Produces: UI checkbox `#noAssetMappingHWCb` and basic state hooks in `filterState`.

- [ ] **Step 1: Add checkbox to UI**

Find the `#checkboxRow` block in `connect.html` (around line 2007) and add the new checkbox HTML right after `noAssetMappingCb`:

```html
              <label class="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
                <input type="checkbox" id="noAssetMappingHWCb" class="rounded border-gray-300" onchange="setFilterState('noAssetMappingHW', this.checked)">
                <span class="whitespace-nowrap">顯示未連動 HW</span>
              </label>
```

- [ ] **Step 2: Update `filterState` initialization**

Update `clearAllFilters` function in `connect.html` (around line 4299) to include `noAssetMappingHW: false`:

```javascript
      filterState = {
        keyword: '', group: '', mappedStatus: '', usageStatus: '',
        ismsAssetId: new Set(), category: new Set(), isoScope: '', assetName: new Set(),
        leaderName: new Set(), userName: new Set(), location: new Set(), stationOnly: false,
        isoBasis: new Set(), label: new Set(), noAssetMapping: false, noAssetMappingHW: false
      };
```

- [ ] **Step 3: Update checkbox clearing logic**

In `clearAllFilters`, add `noAssetMappingHWCb` to the checkboxes array (around line 4304):

```javascript
      var checkboxes = ['stationOnlyCb', 'noAssetMappingCb', 'noAssetMappingHWCb'];
```

- [ ] **Step 4: Commit**

```bash
git add connect.html
git commit -m "feat(frontend): add unmapped HW filter UI and state hooks"
```

---

### Task 2: Implement Filter Logic in `matchesFilters`

**Files:**
- Modify: `connect.html`

**Interfaces:**
- Consumes: `filterState.noAssetMappingHW` from Task 1.

- [ ] **Step 1: Update `matchesFilters`**

Locate the `matchesFilters` function in `connect.html` (around line 4225), right before the existing `noAssetMapping` filter block. Add the new filter logic:

```javascript
      // 顯示未連動 HW 篩選：只過濾掉「未連動」且「非 HW」的資訊資產，其餘正常檢查
      if (filterState.noAssetMappingHW && excludeDim !== 'noAssetMappingHW') {
        var isUnmappedISMS = (asset.assetId === '無對應資產/消耗品');
        if (isUnmappedISMS && asset.category !== 'HW') {
          return false;
        }
      }
      
      // 無對應資產編號篩選（虛擬記錄：assetId === '無對應資產/消耗品' 且 isMapped === false）
```

- [ ] **Step 2: Commit**

```bash
git add connect.html
git commit -m "feat(frontend): implement filter logic for unmapped HW"
```
