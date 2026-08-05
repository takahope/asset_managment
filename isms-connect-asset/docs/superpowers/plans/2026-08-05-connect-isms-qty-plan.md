# 資訊資產數量顯示與格式設定 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 擴充實體資產列表，在表格與手機卡片中加入「資訊資產數量」欄位，並實作管理員全域顯示格式設定。

**Architecture:** 後端透過 `PropertiesService` 儲存全域設定，並在取得實體資產列表 (`getAssetsWithMappingStatus`) 時，一併將設定值以及各項連動資產的虛擬數量帶給前端。前端 (`connect.html`) 於畫面渲染時，使用 `getPhysicalMappingCounts()` 取得連動數量，再依據全域設定即時決定呈現格式。

**Tech Stack:** Google Apps Script, Vanilla JS, HTML/CSS

## Global Constraints

- 修改 GAS 檔後必附部署聲明、禁止主動執行 clasp push、宣稱修復必附驗收證據。
- 前端修改時，一定要檢查掃描現有已編譯的凍結 Tailwind，若無可用 class，則必須使用具名 scoped CSS class。
- 無自動化測試，必須手動透過 Code Review 與介面邏輯檢查。

---

### Task 1: 後端擴充 (code.js)

**Files:**
- Modify: `code.js`

**Interfaces:**
- Produces: `getAssetsWithMappingStatus()` 回傳物件中新增 `quantityDisplayMode` 屬性，以及清單內每筆 asset 新增 `ismsAssetQty` 屬性。

- [ ] **Step 1: 實作 `saveBusinessProcessSettings` 擴充**
修改 `saveBusinessProcessSettings` 函式，接收並儲存 `quantityDisplayMode`：
```javascript
function saveBusinessProcessSettings(settings) {
  // 尋找此函式現有的 PropertiesService 寫入邏輯
  const props = PropertiesService.getScriptProperties();
  
  // 原有的靜態/動態設定
  if (settings.staticProcesses) {
    props.setProperty(CONFIG.BUSINESS_PROCESS_SETTINGS_KEY, JSON.stringify(settings.staticProcesses));
  }
  if (settings.dynamicMap) {
    props.setProperty(CONFIG.BUSINESS_PROCESS_DYNAMIC_MAP_KEY, JSON.stringify(settings.dynamicMap));
  }
  
  // 【新增】儲存顯示格式
  if (settings.quantityDisplayMode) {
    props.setProperty('ISMS_QUANTITY_DISPLAY_MODE', settings.quantityDisplayMode);
  }

  return { success: true };
}
```
*(注意：依據現有 `code.js` 的 `saveBusinessProcessSettings` 結構將上面程式碼正確整併)*

- [ ] **Step 2: 實作 `getAssetsWithMappingStatus` 擴充**
```javascript
// 在 getAssetsWithMappingStatus 的 try 區塊中：
const props = PropertiesService.getScriptProperties();
const displayMode = props.getProperty('ISMS_QUANTITY_DISPLAY_MODE') || 'both';

// 在 Mapping 的陣列生成迴圈中（約行 597/618 附近）：
// 補上 ismsAssetQty: ismsAsset ? ismsAsset.quantity : '',

// 最後回傳時：
return { 
  success: true, 
  assets: filtered, 
  quantityDisplayMode: displayMode 
};
```

- [ ] **Step 3: Commit**
```bash
git add code.js
git commit -m "feat(backend): add ISMS quantity fields and display mode settings"
```

---

### Task 2: 前端設定與全域狀態 (connect.html)

**Files:**
- Modify: `connect.html`

**Interfaces:**
- Consumes: `code.js` 中的 `getAssetsWithMappingStatus()` 及 `saveBusinessProcessSettings()` API。
- Produces: 全域變數 `globalQuantityDisplayMode` 供後續顯示使用。

- [ ] **Step 1: 新增全域變數**
在 `connect.html` 的 JS 頂部（如其他全域變數附近）宣告：
```javascript
let globalQuantityDisplayMode = 'both';
```

- [ ] **Step 2: 擴充設定彈出視窗 HTML**
在 `#settingsModal` 內加入下拉選單 (搜尋 `id="settingSheetId"` 附近)：
```html
<div class="mb-4">
  <label class="block text-sm font-medium text-gray-700 mb-2">資訊資產數量顯示格式</label>
  <select id="settingQuantityDisplayMode" class="form-input text-sm">
    <option value="both">兩者皆顯示 (虛擬數量/連動數量)</option>
    <option value="virtual">僅顯示虛擬數量</option>
    <option value="mapped">僅顯示實際連動數量</option>
  </select>
</div>
```

- [ ] **Step 3: 擴充 `renderSettings` 與 `submitSettings`**
```javascript
// 尋找 renderSettings，加入：
document.getElementById('settingQuantityDisplayMode').value = data.quantityDisplayMode || globalQuantityDisplayMode || 'both';

// 尋找 submitSettings，將該值包進 payload 裡傳給後端：
var payload = {
  sheetId: document.getElementById('settingSheetId').value.trim(),
  rawDynamicList: currentRawDynamicList,
  quantityDisplayMode: document.getElementById('settingQuantityDisplayMode').value
};

// 並在 submitSettings 成功回呼時更新全域變數並重繪：
globalQuantityDisplayMode = payload.quantityDisplayMode;
if (typeof applyFilters === 'function') applyFilters();
```

- [ ] **Step 4: 在 `loadAssets` 捕捉後端傳來的設定**
```javascript
// 尋找 loadAssets() 的 withSuccessHandler 中：
if (result.success) {
  allAssets = result.assets;
  
  // 新增：更新全域設定
  if (result.quantityDisplayMode) {
    globalQuantityDisplayMode = result.quantityDisplayMode;
  }
  // (原有的 applyFilters() 等等)
```

- [ ] **Step 5: Commit**
```bash
git add connect.html
git commit -m "feat(frontend): implement admin setting for ISMS quantity display mode"
```

---

### Task 3: 前端列表呈現 (connect.html)

**Files:**
- Modify: `connect.html`

**Interfaces:**
- Consumes: 全域變數 `globalQuantityDisplayMode` 與 API 回傳的 `ismsAssetQty` 屬性。
- Consumes: 現有函式 `getPhysicalMappingCounts()`。

- [ ] **Step 1: 新增預設顯示欄位**
在 `connect.html` 的 `DEFAULT_COL_PREFS` 陣列中，加入：
```javascript
{ id: 'ismsAssetQty', label: '資產數量', visible: true, mobileVisible: true, scanVisible: true },
```

- [ ] **Step 2: 實作欄位文字渲染 (`getAssetFieldValue`)**
在 `getAssetFieldValue(asset, fieldId)` 中加入攔截：
```javascript
if (fieldId === 'ismsAssetQty') {
  if (!asset.mappedIsmsAssetId) return '-';
  
  const vQty = asset.ismsAssetQty || '0';
  const mappingCounts = getPhysicalMappingCounts();
  const mQty = mappingCounts[asset.mappedIsmsAssetId] || 0;
  
  if (globalQuantityDisplayMode === 'virtual') {
    return String(vQty);
  } else if (globalQuantityDisplayMode === 'mapped') {
    return String(mQty);
  } else {
    return \`(\${vQty}/\${mQty})\`;
  }
}
```

- [ ] **Step 3: Commit**
```bash
git add connect.html
git commit -m "feat(table): dynamically render ISMS quantity column based on preferences"
```
