# connect.html 四分頁合併單頁 實作計畫

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 `connect.html` 的四個分頁合併為單頁，將後三個分頁轉化為主資產清單上的篩選器與操作，並移除因此失效的 5 支後端端點。

**Architecture:** 引入單一 `filterState` 物件作為篩選真相，所有衍生資料（統計數字、組別計數、篩選結果）由 `allAssets` 前端計算，不再打後端。UI 由「可點擊統計卡 + 組別晶片列 + 資訊資產下拉」構成篩選面，對照作業改為勾選後才滑出的固定底部動作條。

**Tech Stack:** Google Apps Script Web App、vanilla JS（無框架）、Tailwind Play CDN (JIT)、Font Awesome、Quagga2。

**設計文件：** `docs/superpowers/specs/2026-07-26-connect-single-page-design.md`

## Global Constraints

- **不引入任何前端框架**，維持 vanilla JS（`var` / `function` 風格與檔案現況一致）。
- **維持單一檔案**：`connect.html` 不拆檔。本子專案的慣例是單檔頁面（`index.html` 2449 行、`softwarelist.html` 1173 行），且不使用 `include()`。
- **不修改後端業務邏輯**，`code.js` 僅移除死碼端點。
- **不動權限模型**：`assertWriteAccess_` 守門維持現狀。
- **不動 `index.html` 與 `softwarelist.html`**。
- **不改資產表欄位組成**，保留既有欄寬修正：`.cell-name { max-width:180px }`、`.cell-brand { max-width:240px }`、`#assetTable { width:auto }`。
- **保留** `deleteMappings` 後端端點（維運工具，維持管理員守門）。
- **XSS**：本檔慣例是 `innerHTML` + `escapeHtml()`，沿用之，不改寫為 DOM API。
- **每個 `google.script.run` 都必須有 `withFailureHandler`**（PLAYBOOK §4-9）。
- **禁止執行 `clasp push` / `clasp deploy`**。部署由使用者手動貼上。

## 無自動化測試的替代驗證

本專案沒有測試框架。每個任務的驗證步驟是**在瀏覽器實測**，並附具體預期值。

**GAS console 除錯前提**：頁面跑在 `userCodeAppPanel` sandbox iframe 內，`document.getElementById()` 在預設的 `top` context 抓不到元素。驗證時**右鍵點目標元素 → 檢查**，會自動切到正確 frame，再用 `$0` 或直接執行程式碼。所有 console 片段一律用 IIFE 包住，避免重複貼上時 `Identifier 'x' has already been declared`。

## 部署檢查點

| 檢查點 | 涵蓋任務 | 動作 |
|--------|---------|------|
| **A** | Task 1–3 | 貼上 `connect.html` → 建新部署版本 → 跑 Task 3 的驗證 |
| **B** | Task 4–6 | 貼上 `connect.html` → 建新部署版本 → 跑 Task 6 的驗證 |
| **C** | Task 7–8 | 貼上 `connect.html` 與 `code.js` → 建新部署版本 → 跑 Task 8 的驗證 |

## File Structure

| 檔案 | 職責 | 變更 |
|------|------|------|
| `isms-connect-asset/connect.html` | 單頁 UI 與全部前端邏輯 | Task 1–7 |
| `isms-connect-asset/code.js` | 後端端點 | Task 8（僅刪除死碼） |

### 前端函式責任邊界（重構後）

| 分層 | 函式 | 說明 |
|------|------|------|
| 狀態 | `filterState`、`selectedAssetIds`、`allAssets`、`allIsmsAssets` | 全域狀態 |
| 純計算 | `matchesFilters`、`getFilteredAssets`、`computeStats`、`computeGroupCounts`、`deriveGroupList`、`buildExportCsv` | 無副作用，可在 console 單獨驗證 |
| 渲染 | `renderAssetTable`、`renderStatCards`、`renderGroupChips`、`renderIsmsFilterOptions`、`renderSelectedList`、`renderActionBar` | 讀狀態、寫 DOM |
| 協調 | `applyFilters`、`loadAssets`、`loadIsmsAssets`、`loadUserInfo` | 串接上面兩層 |

---

### Task 1: 前端衍生計算層

把統計數字與組別清單從後端搬到前端。此任務**不改變任何畫面外觀**，只是換掉數字的來源，因此可以用「改完數字應與改前完全相同」來驗證。

**Files:**
- Modify: `isms-connect-asset/connect.html`（JS 區塊，`filterAssets` 附近 `:1037-1062`；`DOMContentLoaded` 註冊處）

**Interfaces:**
- Consumes: 既有全域 `allAssets`（`getAssetsWithMappingStatus` 的回傳陣列，每筆含 `assetId`/`assetName`/`leaderName`/`location`/`group`/`isMapped`/`mappedIsmsAssetId`）
- Produces: `filterState` 物件、`matchesFilters(asset, excludeDim)` → boolean、`getFilteredAssets()` → Array、`computeStats(assets)` → `{totalCount, mappedCount, unmappedCount, mappingRate}`、`computeGroupCounts()` → `[{group, count}]`、`deriveGroupList()` → `string[]`

- [ ] **Step 1: 記錄改動前的基準值**

部署目前線上版本，開啟「資訊資產清單」分頁，**抄下四張統計卡的數字**（總數／已對照／未對照／對照率）與「報表查詢」分頁組別統計表的每一列（組別名＋總數）。這是 Task 1 的驗收基準。

- [ ] **Step 2: 新增篩選狀態與純計算函式**

在 `connect.html` 的 JS 區塊，於既有 `function filterAssets()` **之前**插入：

```javascript
    // ==========================================
    // 篩選狀態（單一真相）與衍生計算
    // ==========================================
    var filterState = {
      keyword: '',        // 搜尋關鍵字（已 toLowerCase）
      group: '',          // '' = 全部組別
      mappedStatus: '',   // '' = 全部 | 'mapped' | 'unmapped'
      ismsAssetId: ''     // '' = 全部資訊資產
    };

    /**
     * 判斷單筆資產是否通過篩選。
     * @param {Object} asset
     * @param {string|null} excludeDim 要略過的維度名（'group' 等），null = 全部維度都套用
     * @returns {boolean}
     */
    function matchesFilters(asset, excludeDim) {
      if (excludeDim !== 'keyword' && filterState.keyword) {
        var k = filterState.keyword;
        var hit = asset.assetId.toLowerCase().indexOf(k) >= 0 ||
                  asset.assetName.toLowerCase().indexOf(k) >= 0 ||
                  asset.leaderName.toLowerCase().indexOf(k) >= 0 ||
                  asset.location.toLowerCase().indexOf(k) >= 0;
        if (!hit) return false;
      }
      if (excludeDim !== 'group' && filterState.group) {
        if ((asset.group || '未分組') !== filterState.group) return false;
      }
      if (excludeDim !== 'mappedStatus' && filterState.mappedStatus) {
        if (filterState.mappedStatus === 'mapped' && !asset.isMapped) return false;
        if (filterState.mappedStatus === 'unmapped' && asset.isMapped) return false;
      }
      if (excludeDim !== 'ismsAssetId' && filterState.ismsAssetId) {
        if (asset.mappedIsmsAssetId !== filterState.ismsAssetId) return false;
      }
      return true;
    }

    function getFilteredAssets() {
      return allAssets.filter(function(a) { return matchesFilters(a, null); });
    }

    /** 統計卡：套用「全部」篩選維度 —— 描述「當前這批資料是什麼」 */
    function computeStats(assets) {
      var total = assets.length;
      var mapped = 0;
      for (var i = 0; i < assets.length; i++) {
        if (assets[i].isMapped) mapped++;
      }
      return {
        totalCount: total,
        mappedCount: mapped,
        unmappedCount: total - mapped,
        mappingRate: total > 0 ? Math.round((mapped / total) * 100) : 0
      };
    }

    /** 全部出現過的組別，去重排序（取代後端 getGroupList） */
    function deriveGroupList() {
      var seen = {};
      var list = [];
      for (var i = 0; i < allAssets.length; i++) {
        var g = allAssets[i].group || '未分組';
        if (!seen[g]) { seen[g] = true; list.push(g); }
      }
      return list.sort(function(a, b) { return a.localeCompare(b, 'zh-TW'); });
    }

    /**
     * 晶片計數：套用「除 group 以外」的所有維度。
     * 若也套用 group，點選任一組後其他組會全部歸零，晶片就失去橫向比較的價值。
     */
    function computeGroupCounts() {
      var counts = {};
      for (var i = 0; i < allAssets.length; i++) {
        var a = allAssets[i];
        if (!matchesFilters(a, 'group')) continue;
        var g = a.group || '未分組';
        counts[g] = (counts[g] || 0) + 1;
      }
      return deriveGroupList().map(function(g) {
        return { group: g, count: counts[g] || 0 };
      });
    }
```

- [ ] **Step 3: 讓統計卡改吃前端計算**

把既有的 `function updateStats(stats)`（`:1027`）整個替換為：

```javascript
    function renderStatCards(stats) {
      document.getElementById('statTotal').textContent = stats.totalCount;
      document.getElementById('statMapped').textContent = stats.mappedCount;
      document.getElementById('statUnmapped').textContent = stats.unmappedCount;
      document.getElementById('statRate').textContent = stats.mappingRate + '%';
    }
```

在 `loadAssets()` 的 `withSuccessHandler` 內，找到呼叫 `updateStats(result.statistics)` 的那一行，改為 `renderStatCards(computeStats(allAssets));`。

- [ ] **Step 4: 移除兩支後端呼叫**

刪除 `function loadGroupList()` 與 `function loadStatistics()` 兩個函式整體，以及 `DOMContentLoaded` 內對它們的呼叫。`DOMContentLoaded` 應剩下：

```javascript
    document.addEventListener('DOMContentLoaded', function() {
      loadUserInfo();
      loadAssets();
      loadIsmsAssets();
      setupEventListeners();
    });
```

同時把 `doCreateMapping()` 成功分支中的 `loadStatistics();` 刪除（`loadAssets()` 會連帶重算統計）。

- [ ] **Step 5: 組別下拉改吃前端資料**

`loadGroupList` 原本會填 `#groupFilter`。在 `loadAssets()` 的成功分支、`renderStatCards(...)` 之後，加入：

```javascript
          var groupSelect = document.getElementById('groupFilter');
          if (groupSelect) {
            groupSelect.innerHTML = '<option value="">全部組別</option>' +
              deriveGroupList().map(function(g) {
                return '<option value="' + escapeHtml(g) + '">' + escapeHtml(g) + '</option>';
              }).join('');
          }
```

- [ ] **Step 6: 驗證（需部署）**

貼上 `connect.html`、建新部署版本，開啟頁面：

1. 四張統計卡的數字與 Step 1 抄下的**完全相同**。
2. 「全部組別」下拉的選項與 Step 1 抄下的組別統計表列出的組別**完全相同**（含順序，皆為 `localeCompare('zh-TW')` 排序）。
3. 右鍵點統計卡 → 檢查，在 console 執行：

```javascript
(() => {
  const s = computeStats(allAssets);
  console.log('統計', s);
  console.log('組別計數', computeGroupCounts());
  console.log('晶片加總', computeGroupCounts().reduce((n, c) => n + c.count, 0), '應等於總數', s.totalCount);
})();
```
預期：「晶片加總」等於「總數」。

- [ ] **Step 7: Commit**

```bash
cd /Users/kih/Desktop/onedrive_backup/asset_manage_dev/asset_managment
git add isms-connect-asset/connect.html
git commit -m "refactor(connect): derive stats and group list on the client

移除 loadGroupList / loadStatistics 兩支後端呼叫,改由 allAssets 前端計算。
首載後端呼叫 5 → 3,兩張總表完整重讀 3 次 → 1 次。
畫面外觀不變。"
```

---

### Task 2: 篩選改讀 filterState

把現有的 `filterAssets()`（直接讀 DOM）改為讀 `filterState`，並讓所有篩選入口都先寫入 `filterState` 再呼叫統一的 `applyFilters()`。此任務同樣**不改變畫面外觀**。

**Files:**
- Modify: `isms-connect-asset/connect.html`（`filterAssets` `:1037-1062`、`setupEventListeners` `:824-836`）

**Interfaces:**
- Consumes: Task 1 的 `filterState`、`getFilteredAssets`、`computeStats`、`renderStatCards`
- Produces: `applyFilters()` → void（唯一的「重算並重繪」入口）

- [ ] **Step 1: 用 applyFilters 取代 filterAssets**

刪除 `function filterAssets()` 整體，替換為：

```javascript
    /** 唯一的「重算並重繪」入口：任何篩選變動都呼叫這支 */
    function applyFilters() {
      var filtered = getFilteredAssets();
      renderAssetTable(filtered);
      renderStatCards(computeStats(filtered));
    }
```

注意：統計卡現在吃的是 `computeStats(filtered)` 而非 `computeStats(allAssets)` —— 統計卡描述「當前篩選結果」。同步把 Task 1 Step 3 在 `loadAssets()` 內寫的 `renderStatCards(computeStats(allAssets));` 改為呼叫 `applyFilters();`。

- [ ] **Step 2: 篩選入口改寫 filterState**

在 `setupEventListeners()` 中，把三個篩選控制項的處理器改為先寫 `filterState`：

```javascript
      document.getElementById('assetSearch').addEventListener('input', debounce(function() {
        filterState.keyword = document.getElementById('assetSearch').value.toLowerCase().trim();
        applyFilters();
      }, 300));

      document.getElementById('groupFilter').addEventListener('change', function() {
        filterState.group = document.getElementById('groupFilter').value;
        applyFilters();
      });

      document.getElementById('unmappedOnly').addEventListener('change', function() {
        filterState.mappedStatus = document.getElementById('unmappedOnly').checked ? 'unmapped' : '';
        applyFilters();
      });
```

- [ ] **Step 2b: 修正條碼掃描器對 `filterAssets` 的呼叫（必做，否則掃描功能會壞）**

`filterAssets` 不只被 `setupEventListeners` 使用——條碼掃描 IIFE 內的 `enhanceSearchBox()` 也呼叫它（`connect.html:1649`，「掃不到對應資產時退回搜尋模式」的分支）。刪掉 `filterAssets` 而不改這裡，Enter 掃描找不到資產時會拋 `ReferenceError`，且錯誤被關在 IIFE 內、畫面上沒有任何徵兆。

把 `:1642-1650` 的 `if (asset) { ... } else { ... }` 改為：

```javascript
              if (asset) {
                selectedAssetIds.add(asset.assetId);
                updateSelectionUI();
                showToast(`已加入資產: ${asset.assetName}`, 'success');
                this.value = ''; // 清空搜尋框
              } else {
                // 找不到，保持搜尋模式
                filterState.keyword = this.value.toLowerCase().trim();
                applyFilters();
              }
```

`filterState` 與 `applyFilters` 都宣告在外層 script scope，IIFE 內可直接存取。

刪除 `setupEventListeners` 中任何殘留的 `filterAssets` 引用。全檔搜尋 `filterAssets` 確認為 0 筆——**包含條碼掃描區塊**。

- [ ] **Step 3: 驗證（可與 Task 3 合併部署）**

暫不部署，改為靜態檢查：

```bash
cd /Users/kih/Desktop/onedrive_backup/asset_manage_dev/asset_managment/isms-connect-asset
grep -c "filterAssets" connect.html   # 預期輸出 0
grep -n "applyFilters" connect.html   # 預期至少 4 處（定義 1、loadAssets 1、事件 3）
```

- [ ] **Step 4: Commit**

```bash
git add isms-connect-asset/connect.html
git commit -m "refactor(connect): centralize filtering into filterState + applyFilters"
```

---

### Task 3: 統計卡可點擊 + 組別晶片列

第一個可見的 UI 變化。統計卡取代 `僅顯示未對照` checkbox，晶片列取代組別下拉。

**Files:**
- Modify: `isms-connect-asset/connect.html`（CSS 區塊；統計卡 markup `:505-521`；篩選列 markup `:580-595`；JS）

**Interfaces:**
- Consumes: Task 1 的 `computeGroupCounts`、Task 2 的 `applyFilters`、`filterState`
- Produces: `renderGroupChips()` → void、`setMappedStatusFilter(status)` → void、`setGroupFilter(group)` → void

- [ ] **Step 1: 新增 CSS**

在 `<style>` 區塊末端（`.col-info-id` 那組規則之後）加入：

```css
    /* 可點擊統計卡 */
    .stat-card.is-clickable { cursor: pointer; transition: all 0.15s; }
    .stat-card.is-clickable:hover { transform: translateY(-2px); box-shadow: 0 4px 14px rgba(15,23,42,0.10); }
    .stat-card.is-active { outline: 2px solid #2563eb; outline-offset: -2px; background: #eff6ff; }

    /* 組別晶片列 */
    .chip-row {
      display: flex; flex-wrap: nowrap; gap: 8px;
      overflow-x: auto; padding: 4px 0 8px;
    }
    .chip {
      flex: 0 0 auto;
      display: inline-flex; align-items: center; gap: 6px;
      padding: 6px 12px; border-radius: 999px;
      border: 1px solid #e2e8f0; background: #fff;
      color: #334155; font-size: 0.875rem; cursor: pointer;
      white-space: nowrap; transition: all 0.15s;
    }
    .chip:hover { border-color: #93c5fd; background: #f8fafc; }
    .chip.is-active { border-color: #2563eb; background: #2563eb; color: #fff; }
    .chip__count {
      min-width: 20px; padding: 0 6px; border-radius: 999px;
      background: #f1f5f9; color: #475569; font-size: 0.75rem; font-weight: 600;
    }
    .chip.is-active .chip__count { background: rgba(255,255,255,0.25); color: #fff; }
```

- [ ] **Step 2: 統計卡 markup 加上可點擊屬性**

把 `:505-521` 的四張統計卡替換為：

```html
        <div class="stat-card is-clickable" id="cardTotal" onclick="setMappedStatusFilter('')">
          <div class="stat-value" id="statTotal">-</div>
          <div class="stat-label">資產總數</div>
        </div>
        <div class="stat-card is-clickable" id="cardMapped" onclick="setMappedStatusFilter('mapped')">
          <div class="stat-value text-green-600" id="statMapped">-</div>
          <div class="stat-label">已對照</div>
        </div>
        <div class="stat-card is-clickable" id="cardUnmapped" onclick="setMappedStatusFilter('unmapped')">
          <div class="stat-value text-amber-600" id="statUnmapped">-</div>
          <div class="stat-label">未對照</div>
        </div>
        <div class="stat-card">
          <div class="stat-value text-blue-600" id="statRate">-</div>
          <div class="stat-label">對照率</div>
        </div>
```

（「總資訊資產數」改為「資產總數」——這張表的內容本來就是資產，原標籤是錯的。「對照率」不可點，維持純顯示。）

- [ ] **Step 3: 篩選列換掉組別下拉與 checkbox**

把 `:585-591`（`<select id="groupFilter">` 與 `僅顯示未對照` 的 `<label>`）整段刪除，並在該 `<div class="flex flex-wrap items-center gap-4 mb-6">` **結束標籤之後**插入晶片列容器：

```html
            <div class="chip-row" id="groupChips"></div>
```

- [ ] **Step 4: 新增渲染與篩選切換函式**

在 `applyFilters` 定義之後插入：

```javascript
    function renderGroupChips() {
      var counts = computeGroupCounts();
      var total = counts.reduce(function(n, c) { return n + c.count; }, 0);

      // 用 data-group + 事件委派，不用 inline onclick：
      // escapeHtml 會把 ' 轉成 &#039;，而 HTML 屬性解析器會在 JS 看到之前把它解回 '，
      // 塞進 onclick="setGroupFilter('...')" 的字串就會被截斷。data-* + dataset 讀取
      // 是正確的往返方式，組別名含任何字元都安全。
      var html = '<button type="button" class="chip' + (filterState.group === '' ? ' is-active' : '') +
                 '" data-group=""><span>全部</span>' +
                 '<span class="chip__count">' + total + '</span></button>';

      html += counts.map(function(c) {
        var active = filterState.group === c.group ? ' is-active' : '';
        return '<button type="button" class="chip' + active +
               '" data-group="' + escapeHtml(c.group) + '">' +
               '<span>' + escapeHtml(c.group) + '</span>' +
               '<span class="chip__count">' + c.count + '</span></button>';
      }).join('');

      document.getElementById('groupChips').innerHTML = html;
    }

    /** 點已選中的組別＝取消，回到全部 */
    function setGroupFilter(group) {
      filterState.group = (filterState.group === group) ? '' : group;
      applyFilters();
    }

    /** 點已選中的狀態＝取消；'' 一律代表全部 */
    function setMappedStatusFilter(status) {
      filterState.mappedStatus = (filterState.mappedStatus === status) ? '' : status;
      applyFilters();
    }

    function renderStatCardActiveState() {
      document.getElementById('cardTotal').classList.toggle('is-active', filterState.mappedStatus === '');
      document.getElementById('cardMapped').classList.toggle('is-active', filterState.mappedStatus === 'mapped');
      document.getElementById('cardUnmapped').classList.toggle('is-active', filterState.mappedStatus === 'unmapped');
    }
```

- [ ] **Step 5: 把新渲染掛進 applyFilters**

把 Task 2 建立的 `applyFilters` 擴充為：

```javascript
    function applyFilters() {
      var filtered = getFilteredAssets();
      renderAssetTable(filtered);
      renderStatCards(computeStats(filtered));
      renderGroupChips();
      renderStatCardActiveState();
    }
```

- [ ] **Step 6: 註冊晶片事件委派、移除失效的事件註冊**

在 `setupEventListeners()` 加入晶片列的事件委派（只註冊一次，晶片重繪後仍有效）：

```javascript
      document.getElementById('groupChips').addEventListener('click', function(e) {
        var chip = e.target.closest('.chip');
        if (!chip) return;
        setGroupFilter(chip.dataset.group || '');
      });
```

刪除 Task 2 Step 2 寫的 `groupFilter` 與 `unmappedOnly` 兩個監聽器（對應的 DOM 元素已不存在）。搜尋 `groupFilter` 與 `unmappedOnly` 確認全檔為 0 筆——包含 Task 1 Step 5 加的那段填下拉的程式碼，一併刪除。

- [ ] **Step 7: 驗證（部署檢查點 A）**

貼上 `connect.html`、建新部署版本：

1. 未套任何篩選：晶片數字加總 = 統計卡「資產總數」。
2. 點「未對照」卡 → 卡片出現藍色外框；各組晶片數字**下降但不歸零**；晶片加總 = 統計卡「未對照」的數字。
3. 再點一次「未對照」卡 → 取消篩選，回到全部，「資產總數」卡變為 active。
4. 點任一組別晶片（例如「資訊組」）→ **其他組的晶片數字維持可見且不變**（這是排除 group 維度的關鍵驗證）。
5. 再點同一顆晶片 → 取消，回到「全部」。
6. 搜尋框輸入關鍵字 → 晶片數字與統計卡同步變動。

- [ ] **Step 8: Commit**

```bash
git add isms-connect-asset/connect.html
git commit -m "feat(connect): clickable stat cards and group filter chips

統計卡取代「僅顯示未對照」checkbox,組別晶片列取代組別下拉。
晶片計數排除 group 維度,點選後其他組數字仍可比較(faceted search)。"
```

---

### Task 4: 資訊資產下拉篩選 + 拆除分頁機制

**Files:**
- Modify: `isms-connect-asset/connect.html`（篩選列 markup；tab 導航 `:559-577`；`tab-isms` `:673-704`；`tab-report` `:707-790` 附近；JS 多處）

**Interfaces:**
- Consumes: Task 1 的 `filterState`、Task 2 的 `applyFilters`、既有全域 `allIsmsAssets`
- Produces: `renderIsmsFilterOptions()` → void、`setIsmsFilter(ismsAssetId)` → void

- [ ] **Step 1: 篩選列加入資訊資產下拉**

在篩選列（`掃描條碼` 按鈕之後、`重新整理` 按鈕之前）插入：

```html
              <select id="ismsFilter" class="select-input" onchange="setIsmsFilter(this.value)">
                <option value="">全部資訊資產</option>
              </select>
```

- [ ] **Step 2: 新增下拉渲染與篩選函式**

在 `setGroupFilter` 之後插入：

```javascript
    /** 只列 HW / EV 類別，與對照作業的選單口徑一致 */
    function renderIsmsFilterOptions() {
      var options = allIsmsAssets.filter(function(a) {
        return a.category === 'HW' || a.category === 'EV';
      }).map(function(a) {
        return '<option value="' + escapeHtml(a.ismsAssetId) + '">' +
               escapeHtml(a.ismsAssetId) + ' · ' + escapeHtml(a.name) + '</option>';
      }).join('');
      document.getElementById('ismsFilter').innerHTML =
        '<option value="">全部資訊資產</option>' + options;
    }

    function setIsmsFilter(ismsAssetId) {
      filterState.ismsAssetId = ismsAssetId || '';
      applyFilters();
    }
```

在 `loadIsmsAssets()` 的成功分支內，`populateIsmsSelect()` 呼叫之後，加上 `renderIsmsFilterOptions();`。

- [ ] **Step 3: 拆除分頁導航**

刪除 `:559-575` 的整段 tab 導航（`<!-- Tab 導航 -->` 註解到 `</div>` 為止的四顆按鈕與其外層 `<div class="flex border-b">`），保留外層 `<div class="card mb-6">` 與 `<div class="p-6">`。

刪除 `function switchTab(tabName)` 整體。

- [ ] **Step 4: 移除 tab-isms 與 tab-report 兩個區塊**

刪除 `<div id="tab-isms" class="tab-content hidden">` 整塊（含 `ismsTable`、`ismsListSearch`）。
刪除 `<div id="tab-report" class="tab-content hidden">` 整塊（含 `reportIsmsSelect`、`groupStatsTable`、`queryResultSection`）。

刪除對應的 JS 函式：`renderIsmsTable`、`filterIsmsTable`、`viewIsmsAssetDetail`、`queryByIsmsAsset`、`renderGroupStats`、`exportReport`、`goToMapping`。

刪除 `setupEventListeners` 中對 `ismsListSearch` 的監聽器。

在 `populateIsmsSelect()` 內刪除對 `reportSelect`（`#reportIsmsSelect`）的賦值，只保留 `#ismsAssetSelect`。

- [ ] **Step 5: 讓剩下兩個區塊成為普通區塊**

`tab-assets` 與 `tab-mapping` 兩個 `<div>` 的 `class="tab-content"` / `class="tab-content hidden"` 一律改為 `class=""`（或直接移除 class 屬性）。`tab-mapping` 移除 `hidden` 後會顯示在資產表下方——這是本任務的暫時狀態，Task 5 會把它改造成底部動作條。

刪除 `:597-604` 那段「已選擇 N 筆 + 前往對照」的 `<div>`（`goToMappingBtn` 已無用）。

**同時必須改 `updateSelectionUI()`**——它第 2 行直接寫 `document.getElementById('goToMappingBtn').disabled`，按鈕刪掉後會在**每次勾選資產時**拋 `TypeError: Cannot set properties of null`，讓勾選功能整個壞掉。改為：

```javascript
    function updateSelectionUI() {
      document.getElementById('selectedCount').textContent = selectedAssetIds.size;
      renderSelectedList();
    }
```

（`renderSelectedList` 是 Task 5 才更名的；在 Task 4 這一步先維持呼叫 `updateMappingTab()`，Task 5 Step 3 再一併改名。）

並**保留** `<span id="selectedCount">`，把它移進 `tab-mapping` 區塊的標題列，避免 `updateSelectionUI()` 找不到元素而拋錯：

```html
                <h3 class="font-semibold text-gray-900 mb-4">
                  <i class="fas fa-box mr-2 text-blue-600"></i>待對照資產
                  <span id="mappingAssetCount" class="text-sm text-gray-500 ml-2">(0 筆)</span>
                  <span id="selectedCount" class="hidden">0</span>
                </h3>
```

- [ ] **Step 6: 靜態檢查**

```bash
cd /Users/kih/Desktop/onedrive_backup/asset_manage_dev/asset_managment/isms-connect-asset
for f in switchTab tab-content goToMapping viewIsmsAssetDetail queryByIsmsAsset renderIsmsTable filterIsmsTable renderGroupStats exportReport reportIsmsSelect ismsListSearch; do
  printf '%-22s %s\n' "$f" "$(grep -c "$f" connect.html)"
done
# 全部預期輸出 0
```

- [ ] **Step 7: Commit**

```bash
git add isms-connect-asset/connect.html
git commit -m "feat(connect): replace ISMS tab and report tab with an inline filter

資訊資產分頁與報表查詢分頁的功能改由主清單的資訊資產下拉承接,
拆除四分頁導航與 switchTab。對照作業暫列於資產表下方,待改為底部動作條。"
```

---

### Task 5: 底部浮出動作條

**Files:**
- Modify: `isms-connect-asset/connect.html`（CSS；`tab-mapping` markup；`updateSelectionUI` / `updateMappingTab`）

**Interfaces:**
- Consumes: 既有 `selectedAssetIds`（Set）、`removeFromSelection`、`updateCreateMappingBtn`、`createMapping`
- Produces: `renderSelectedList()` → void（原 `updateMappingTab` 更名）、`renderActionBar()` → void、`toggleSelectedPopover()` → void

- [ ] **Step 1: 新增 CSS**

```css
    /* 底部浮出動作條 */
    .action-bar {
      position: fixed; left: 0; right: 0; bottom: 0; z-index: 40;
      display: flex; align-items: center; gap: 16px; flex-wrap: wrap;
      padding: 12px 24px;
      background: #fff; border-top: 1px solid #e2e8f0;
      box-shadow: 0 -4px 20px rgba(15,23,42,0.10);
      transform: translateY(110%); transition: transform 0.2s ease;
    }
    .action-bar.is-open { transform: translateY(0); }
    .action-bar__count {
      display: inline-flex; align-items: center; gap: 6px;
      font-weight: 600; color: #1d4ed8; cursor: pointer; white-space: nowrap;
    }
    .action-bar__field { display: flex; align-items: center; gap: 8px; }
    .action-bar__spacer { flex: 1 1 auto; }

    /* 已選清單浮層 */
    .selected-popover {
      position: fixed; left: 24px; bottom: 76px; z-index: 41;
      width: min(420px, calc(100vw - 48px)); max-height: 320px; overflow-y: auto;
      background: #fff; border: 1px solid #e2e8f0; border-radius: 12px;
      box-shadow: 0 8px 28px rgba(15,23,42,0.16); padding: 12px;
      display: none;
    }
    .selected-popover.is-open { display: block; }

    /* 動作條展開時，避免遮住表格最後一列 */
    body.has-action-bar { padding-bottom: 88px; }
```

- [ ] **Step 2: 用動作條 markup 取代 tab-mapping 區塊**

刪除整個 `<div id="tab-mapping" ...>` 區塊，並在 `</body>` 之前（掃描器 markup 附近的同層）插入：

```html
    <!-- 已選資產浮層 -->
    <div id="selectedPopover" class="selected-popover">
      <div class="flex items-center justify-between mb-2">
        <span class="font-semibold text-gray-900 text-sm">
          待對照資產 <span id="mappingAssetCount" class="text-gray-500">(0 筆)</span>
        </span>
        <button class="text-gray-400 hover:text-gray-600" onclick="toggleSelectedPopover()">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div id="selectedAssetsList" class="space-y-2"></div>
    </div>

    <!-- 底部浮出動作條 -->
    <div id="actionBar" class="action-bar">
      <span class="action-bar__count" onclick="toggleSelectedPopover()">
        <i class="fas fa-chevron-up"></i>
        已選 <span id="selectedCount">0</span> 筆
      </span>

      <div class="action-bar__field">
        <input type="text" id="ismsSearch" class="search-input" placeholder="搜尋資訊資產…" style="width:180px">
        <select id="ismsAssetSelect" class="select-input" style="min-width:240px">
          <option value="">-- 請選擇資訊資產 --</option>
        </select>
      </div>

      <div class="action-bar__field">
        <input type="text" id="mappingRemarks" class="search-input" placeholder="備註（選填）" style="width:180px">
      </div>

      <div class="action-bar__spacer"></div>

      <button id="createMappingBtn" class="btn-primary" onclick="createMapping()" disabled>
        <i class="fas fa-link mr-2"></i>建立對照
      </button>
    </div>
```

注意：`#mappingRemarks` 由 `<textarea>` 改為 `<input>`，`createMapping()` 讀取 `.value` 的方式不變，無需改 JS。`#ismsAssetSelect` 移除 `size="8"` 屬性，成為一般下拉。

- [ ] **Step 3: 更名並新增控制函式**

把 `function updateMappingTab()` 更名為 `renderSelectedList()`，內容不變（它填的 `#selectedAssetsList`、`#mappingAssetCount` 兩個 id 都已保留在浮層內）。全檔搜尋 `updateMappingTab` 改為 `renderSelectedList`。

新增：

```javascript
    function renderActionBar() {
      var hasSelection = selectedAssetIds.size > 0;
      document.getElementById('actionBar').classList.toggle('is-open', hasSelection);
      document.body.classList.toggle('has-action-bar', hasSelection);
      if (!hasSelection) {
        document.getElementById('selectedPopover').classList.remove('is-open');
      }
    }

    function toggleSelectedPopover() {
      document.getElementById('selectedPopover').classList.toggle('is-open');
    }
```

在 `updateSelectionUI()` 結尾加上 `renderActionBar();`。

- [ ] **Step 4: 驗證（可與 Task 6 合併部署）**

靜態檢查：

```bash
cd /Users/kih/Desktop/onedrive_backup/asset_manage_dev/asset_managment/isms-connect-asset
grep -c "updateMappingTab" connect.html          # 預期 0
grep -c "tab-mapping" connect.html               # 預期 0
grep -c "renderActionBar" connect.html           # 預期 2（定義 1、呼叫 1）
grep -c 'id="selectedCount"' connect.html        # 預期 1
grep -c 'id="mappingAssetCount"' connect.html    # 預期 1
```

- [ ] **Step 5: Commit**

```bash
git add isms-connect-asset/connect.html
git commit -m "feat(connect): mapping panel becomes a bottom action bar

勾選 >=1 筆才滑出,未勾選時完全不佔版面,資產表維持完整寬度。
已選清單改為可展開浮層,保留逐筆移除能力。"
```

---

### Task 6: 前端匯出 CSV

**Files:**
- Modify: `isms-connect-asset/connect.html`（篩選列 markup；JS）

**Interfaces:**
- Consumes: Task 1 的 `getFilteredAssets`、既有 `allIsmsAssets`
- Produces: `buildExportCsv(assets)` → string、`downloadCsv(csvContent, filename)` → void、`exportFiltered()` → void

- [ ] **Step 1: 篩選列加入匯出按鈕**

在 `重新整理` 按鈕之後插入：

```html
              <button class="btn-secondary" onclick="exportFiltered()">
                <i class="fas fa-download mr-2"></i>匯出篩選結果
              </button>
```

- [ ] **Step 2: 新增匯出函式**

欄位順序與標題**必須**與原後端 `exportMappingReport` 一致，確保既有使用者拿到的檔案格式不變。

```javascript
    /**
     * 組出 CSV。欄位與原後端 exportMappingReport 完全一致（10 欄）。
     * @param {Array} assets 要匯出的資產
     * @returns {string}
     */
    function buildExportCsv(assets) {
      var ismsMap = {};
      for (var i = 0; i < allIsmsAssets.length; i++) {
        ismsMap[allIsmsAssets[i].ismsAssetId] = allIsmsAssets[i];
      }

      var headers = ['資產編號', '資產名稱', '資產類別', '保管人', '地點', '組別',
                     '對照狀態', '資訊資產編號', '資訊資產名稱', '資訊資產類別'];

      var rows = assets.map(function(a) {
        var isms = ismsMap[a.mappedIsmsAssetId] || {};
        return [
          a.assetId, a.assetName, a.assetCategory, a.leaderName, a.location, a.group,
          a.isMapped ? '已對照' : '未對照',
          a.mappedIsmsAssetId || '', isms.name || '', isms.category || ''
        ];
      });

      return [headers].concat(rows).map(function(row) {
        return row.map(function(cell) {
          return '"' + String(cell == null ? '' : cell).replace(/"/g, '""') + '"';
        }).join(',');
      }).join('\n');
    }

    function downloadCsv(csvContent, filename) {
      // BOM 讓 Excel 正確辨識 UTF-8 中文
      var blob = new Blob(['﻿' + csvContent], { type: 'text/csv;charset=utf-8;' });
      var url = URL.createObjectURL(blob);
      var link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(function() { URL.revokeObjectURL(url); }, 1000);
    }

    function exportFiltered() {
      var assets = getFilteredAssets();
      if (assets.length === 0) {
        showToast('目前篩選結果沒有資料可匯出', 'error');
        return;
      }
      var d = new Date();
      var stamp = d.getFullYear() + '-' +
                  String(d.getMonth() + 1).padStart(2, '0') + '-' +
                  String(d.getDate()).padStart(2, '0');
      downloadCsv(buildExportCsv(assets), '資產對照報表_' + stamp + '.csv');
      showToast('已匯出 ' + assets.length + ' 筆', 'success');
    }
```

- [ ] **Step 3: 驗證（部署檢查點 B）**

貼上 `connect.html`、建新部署版本：

1. **勾選行為**：勾選 2 筆 → 底部動作條由下方滑出；取消勾選至 0 筆 → 完全收起，表格下方不留空白。
2. 點「已選 N 筆」→ 浮層展開列出兩筆，點單筆的移除鈕可移除，數字同步變動。
3. 選一個資訊資產 → 「建立對照」按鈕由停用變啟用；建立成功後 toast 顯示、清單重載、統計卡與晶片數字更新。
4. 對已有對照的資產再建立新對照 → **覆蓋確認彈窗仍正常跳出**。
5. **資訊資產篩選**：選 IT-EV-001 → 表格只剩對照到它的資產。與舊版「報表查詢 → 依資訊資產查詢」的結果逐筆比對應一致（若舊版仍可存取，用上一個部署版本比對；否則抽查 3 筆確認 `資訊資產編號` 欄皆為 IT-EV-001）。
6. **匯出**：不套篩選按匯出 → 開啟 CSV，欄位標題與筆數比對；再套「未對照 + 資訊組」後匯出 → 筆數 = 畫面上的列數。中文不亂碼。
7. 表格欄寬正常：資產名稱 180px、廠牌型號 ≤240px 且長內容折行不截斷。
8. **條碼掃描（Task 2 Step 2b 的迴歸驗證）**：
   - 點「掃描條碼」開啟相機、關閉，不報錯。
   - 在搜尋框輸入一個**存在的**資產編號後按 Enter → 該筆被加入勾選、動作條滑出、搜尋框清空。
   - 在搜尋框輸入一個**不存在的**編號後按 Enter → 表格退回關鍵字搜尋結果（通常為空清單），**console 不得出現 `filterAssets is not defined`**。

- [ ] **Step 4: Commit**

```bash
git add isms-connect-asset/connect.html
git commit -m "feat(connect): export filtered rows to CSV on the client

取代後端 exportMappingReport,匯出範圍改為當前篩選結果。
欄位順序與標題維持與後端版本一致,加 BOM 確保 Excel 中文不亂碼。"
```

---

### Task 7: 錯誤處理補強

修補三個位於本次改動路徑上的既有缺口。

**Files:**
- Modify: `isms-connect-asset/connect.html`（`loadUserInfo`、`loadAssets`、`loadIsmsAssets`）

**Interfaces:**
- Consumes: 既有 `showToast`
- Produces: `renderTableError(message)` → void

- [ ] **Step 1: loadUserInfo 補上失敗處理**

`loadUserInfo()` 目前完全沒有 `withFailureHandler`。替換為：

```javascript
    function loadUserInfo() {
      google.script.run
        .withSuccessHandler(function(user) {
          document.getElementById('userInfo').textContent = user && user.email ? user.email : '(未知使用者)';
        })
        .withFailureHandler(function(err) {
          document.getElementById('userInfo').textContent = '(無法取得使用者)';
          console.error('loadUserInfo 失敗:', err);
        })
        .getCurrentUser();
    }
```

- [ ] **Step 2: 表格載入失敗要收斂 spinner 並提供重試**

新增：

```javascript
    /** 失敗時把 loading spinner 收斂成錯誤列，附重試入口（PLAYBOOK §4-9） */
    function renderTableError(message) {
      document.getElementById('assetTableBody').innerHTML =
        '<tr><td colspan="10" class="text-center py-8">' +
        '<div class="text-red-600 mb-3"><i class="fas fa-triangle-exclamation mr-2"></i>' +
        escapeHtml(message) + '</div>' +
        '<button class="btn-secondary" onclick="loadAssets()">' +
        '<i class="fas fa-rotate-right mr-2"></i>重試</button>' +
        '</td></tr>';
    }
```

在 `loadAssets()` 中，把 `withFailureHandler` 的內容改為：

```javascript
        .withFailureHandler(function(err) {
          renderTableError('載入資產失敗：' + (err && err.message ? err.message : err));
        })
```

並把成功分支中 `result.success === false` 的處理也改為呼叫 `renderTableError(result.error)`，而非只有 toast。

- [ ] **Step 3: 資訊資產載入失敗要降級而非中斷**

`loadIsmsAssets()` 的失敗處理改為停用兩個選單但不擋主清單：

```javascript
        .withFailureHandler(function(err) {
          var msg = '資訊資產載入失敗：' + (err && err.message ? err.message : err);
          var filterSel = document.getElementById('ismsFilter');
          var mapSel = document.getElementById('ismsAssetSelect');
          filterSel.innerHTML = '<option value="">（資訊資產載入失敗）</option>';
          filterSel.disabled = true;
          mapSel.innerHTML = '<option value="">（資訊資產載入失敗）</option>';
          mapSel.disabled = true;
          showToast(msg, 'error');
          console.error(msg, err);
        })
```

- [ ] **Step 4: 空狀態確認**

確認 `renderAssetTable(assets)` 在 `assets.length === 0` 時顯示「無符合條件的資產」（既有行為，`:906-909`），且 `renderGroupChips()` 在計數為 0 時**仍然渲染晶片**（Task 3 的實作已是如此——`counts[g] || 0`，不會過濾掉 0 的組別）。若整列消失，使用者將無法點回其他組別。

- [ ] **Step 5: Commit**

```bash
git add isms-connect-asset/connect.html
git commit -m "fix(connect): resolve spinners into error states with retry

loadUserInfo 補上 withFailureHandler;表格載入失敗改為錯誤列+重試鈕,
不再永遠轉圈;資訊資產載入失敗改為停用選單降級,不阻擋主清單。"
```

---

### Task 8: 移除 code.js 的 5 支死碼端點

**Files:**
- Modify: `isms-connect-asset/code.js`

**Interfaces:**
- Consumes: 無
- Produces: 無（純移除）

- [ ] **Step 1: 移除前再次確認無呼叫者**

```bash
cd /Users/kih/Desktop/onedrive_backup/asset_manage_dev/asset_managment/isms-connect-asset
for fn in getGroupList getMappingStatistics getAssetsByIsmsAsset exportMappingReport updateMapping; do
  echo "=== $fn ==="
  grep -n "$fn" index.html softwarelist.html connect.html code.js | grep -v "^code.js:[0-9]*:function $fn"
done
# 預期：五個區段全部無輸出
```

若任何一支有輸出，**停止並回報**，不要移除。

- [ ] **Step 2: 移除五個函式**

從 `code.js` 刪除下列函式的完整定義（含其上方的 JSDoc 註解區塊）：

| 函式 | 所在區段註解 |
|------|-------------|
| `getGroupList` | `// 資產 API` 區段末 |
| `getAssetsByIsmsAsset` | `// 報表 API` 區段 |
| `getMappingStatistics` | `// 報表 API` 區段 |
| `exportMappingReport` | `// 報表 API` 區段 |
| `updateMapping` | `// 對照管理 API` 區段 |

**保留** `deleteMappings`（唯一可移除對照記錄的維運工具，維持 `assertWriteAccess_(true)` 守門）。若 `// 報表 API` 區段在移除後只剩 `getFabNavigationUrls`，把該函式併入其下方的 `// 軟體清冊 API` 之前，並刪除空掉的區段標題。

- [ ] **Step 3: 語法檢查**

```bash
cd /Users/kih/Desktop/onedrive_backup/asset_manage_dev/asset_managment/isms-connect-asset
node --check code.js && echo "✅ 語法通過"
```

- [ ] **Step 4: 確認剩餘端點的守門狀態未受影響**

```bash
awk '/^function [a-zA-Z][a-zA-Z0-9]*\(/{name=$2; sub(/\(.*/,"",name); guard="—"}
     /assertWriteAccess_\(true\)/{if(name)guard="ADMIN"}
     /assertWriteAccess_\(false\)/{if(name)guard="WHITELIST"}
     /^}/{if(name){printf "%-32s %s\n", name, guard; name=""}}' code.js
```
預期：`createIsmsAsset`/`updateIsmsAsset`/`createMappings` = WHITELIST；`deleteIsmsAsset`/`deleteMappings`/`initMappingSheet`/`clearHrGroupMapCache` = ADMIN。`updateMapping` 不應出現在清單中。

- [ ] **Step 5: 驗證（部署檢查點 C）**

貼上 `connect.html` **與** `code.js`、建新部署版本：

1. 頁面正常載入，統計卡、晶片、表格皆有資料。
2. 開 DevTools Network 或在 console 觀察，確認首載只有 3 次 `google.script.run` 往返。
3. 建立一筆對照 → 成功，且資料寫入「資產對照表」。
4. 匯出 → CSV 正常。
5. 在 Apps Script 編輯器的執行下拉選單中，確認 `deleteMappings` 仍在（維運工具未被誤刪），而 `exportMappingReport` 等五支已消失。
6. 用非管理員的白名單帳號操作一次建立對照 → 仍可成功（權限模型未被更動）。

- [ ] **Step 6: Commit**

```bash
cd /Users/kih/Desktop/onedrive_backup/asset_manage_dev/asset_managment
git add isms-connect-asset/code.js
git commit -m "refactor(isms-connect-asset): drop 5 dead backend endpoints

getGroupList / getMappingStatistics / getAssetsByIsmsAsset /
exportMappingReport 的功能已改由前端計算;updateMapping 在本次重構前
即為死碼(功能被 createMappings 完全涵蓋)。

保留 deleteMappings —— 它同樣無 UI 呼叫,但是唯一可移除對照記錄的
維運工具,維持管理員守門。"
```

---

## 收尾

全部任務完成後：

- [ ] 依 PLAYBOOK P4 在 `isms-connect-asset/CLAUDE.md` 的「事件紀錄」新增一則（≤10 行），記錄：四分頁合併為單頁、後端呼叫 5→3、總表重讀 3→1、晶片計數排除自身維度的規則、移除的 5 支端點與保留 `deleteMappings` 的理由。
- [ ] 更新 `isms-connect-asset/CLAUDE.md` 的「架構重點 §2 三頁路由」——`connect.html` 已無分頁機制，描述需同步修正。
- [ ] 若「晶片計數排除自身維度」這個 faceted search 規則在其他專案也適用，append 到 bullpen 的 `gas-fullstack` skill CSS/佈局節或前端節。
