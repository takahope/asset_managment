# Scan Action Panel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 為系統新增「掃描動作決策面板」，使管理者在掃描資產後能直接透過專屬的彈出視窗查看特定欄位，並快速完成連動與業務流程的設定；同時擴充「欄位設定」支援掃描面板的顯示控制。

**Architecture:** 
1. `DEFAULT_COL_PREFS` 擴充 `scanVisible` 屬性，並修改 `colSettingsModal` 支援雙欄位 Checkbox。
2. 於 `connect.html` 新增 `<div id="scanActionPanelModal">` 結構與對應的專屬 CSS class (為避免依賴未編譯的 Tailwind)。
3. 將底部的 ISMS 搜尋與動態按鈕邏輯參數化，讓 `scanActionPanelModal` 也能共用 `handleUnifiedAction` 與狀態更新邏輯。

**Tech Stack:** Vanilla JS, Google Apps Script, HTML/CSS

## Global Constraints

- **修改前端時，一定要檢查掃描現有已編譯的凍結 Tailwind。如果沒有可用的 class，就必須使用「具名 scoped CSS class」，以免造成預期外的樣式錯誤。**
- 不能使用未經編譯的任意 Tailwind utilities (例如 `w-[15px]` 或 `z-2001`)。
- JS ID 名稱必須避免衝突（掃描面板表單元件加上 `scan-` 前綴）。
- 嚴格遵守 `docs/action_panel_spec.md` 中規定的 DOM 結構 (`action-panel-modal`, `action-panel__header` 等)。

---

### Task 1: 擴充 `currentColPrefs` 與欄位設定 UI (`connect.html`)

**Files:**
- Modify: `connect.html`

**Interfaces:**
- Consumes: N/A
- Produces: `currentColPrefs` 物件現在會帶有 `scanVisible: boolean` 屬性。

- [ ] **Step 1: 擴充 `DEFAULT_COL_PREFS`**
在 `connect.html` 中找到 `DEFAULT_COL_PREFS`，並為每個物件加上 `scanVisible`。預設為 `true` 的包含：資產編號、資訊資產編號、資產別名、連動狀態、使用狀態、業務流程、ISO範圍。
```javascript
{ id: 'assetId', label: '資產編號', visible: true, unmovable: true, scanVisible: true },
{ id: 'assetName', label: '資產名稱', visible: false, scanVisible: false },
```
(確保 15 個欄位皆有 `scanVisible` 屬性)

- [ ] **Step 2: 修改 `renderColSettingsList` HTML 生成**
在 `renderColSettingsList` 中，修改 DOM 生成。在 `id="colSettingsList"` 的迴圈前或裡面新增表頭 (主表 / 掃描)。
並修改每個 `item.innerHTML` 使其擁有兩個 Checkbox：
```javascript
// 在 listContainer 清空後，加入表頭
listContainer.innerHTML = `
  <div class="flex items-center p-2 bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500">
    <div style="width: 28px;"></div>
    <div style="width: 40px; text-align: center;">主表</div>
    <div style="width: 40px; text-align: center;">掃描</div>
    <div class="flex-grow pl-3">欄位名稱</div>
  </div>
`;

// 迴圈內的 item.innerHTML 改為：
item.innerHTML = `
  <i class="fas fa-grip-vertical text-gray-400 mr-2 ${col.unmovable ? 'opacity-30' : ''}" style="width: 20px;"></i>
  <div style="width: 40px; text-align: center;">
    <input type="checkbox" class="col-visibility-cb h-4 w-4 text-blue-600 rounded border-gray-300" ${col.visible ? 'checked' : ''} ${col.unmovable ? 'disabled' : ''}>
  </div>
  <div style="width: 40px; text-align: center;">
    <input type="checkbox" class="col-scan-visibility-cb h-4 w-4 text-blue-600 rounded border-gray-300" ${col.scanVisible ? 'checked' : ''}>
  </div>
  <span class="flex-grow text-sm pl-3 ${!col.visible && !col.scanVisible ? 'text-gray-400 line-through' : ''}">${col.label}</span>
`;
```

- [ ] **Step 3: 修改 `saveColSettings` 儲存邏輯**
在 `saveColSettings()` 中，抓取這兩個 Checkbox 的值並存回 `currentColPrefs`。
```javascript
const cbVisible = item.querySelector('.col-visibility-cb');
const cbScanVisible = item.querySelector('.col-scan-visibility-cb');
newPrefs.push({
  id: id,
  label: def.label,
  visible: cbVisible.checked,
  scanVisible: cbScanVisible ? cbScanVisible.checked : def.scanVisible,
  unmovable: !!def.unmovable
});
```

- [ ] **Step 4: 手動測試**
在瀏覽器中開啟頁面，點擊「顯示欄位」，確認出現「主表 / 掃描」表頭與雙 Checkbox，勾選後點擊儲存，重整頁面確認設定成功存入 LocalStorage。

---

### Task 2: 新增掃描動作決策面板 HTML 與 Scoped CSS (`connect.html`)

**Files:**
- Modify: `connect.html`

**Interfaces:**
- Consumes: N/A
- Produces: 具備 `<div id="scanActionPanelModal">` 與表單 `scan-ismsSearch`, `scan-ismsAssetSelect` 的 DOM 結構。

- [ ] **Step 1: 新增 Scoped CSS**
在 `connect.html` 的 `<style>` 區塊新增決策面板專用的樣式，以避免依賴未編譯的 Tailwind (根據 `AGENTS.md` 規範與 `action_panel_spec.md`)。
```css
/* 掃描決策面板專用樣式 */
.scan-panel-overlay {
  position: fixed; inset: 0; background: rgba(71,85,105,0.7); display: none; z-index: 3000; align-items: flex-start; justify-content: center; padding-top: 8vh;
}
.scan-panel-overlay.is-active { display: flex; }
.scan-panel-container {
  background: #fff; width: 100%; max-width: 640px; border-radius: 16px; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); max-height: 84vh; margin: 0 3vw;
}
.scan-panel-meta-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 8px; background: #f8fafc; padding: 12px; border-radius: 8px; font-size: 12px; color: #475569; margin-bottom: 16px;
}
.scan-panel-form-section {
  display: flex; flex-direction: column; gap: 12px; padding: 16px; overflow-y: auto; flex: 1;
}
```

- [ ] **Step 2: 注入 HTML DOM**
在 `connect.html` 的 `<body>` 最尾端 (緊鄰其他 Modal) 插入掃描面板 HTML。
```html
<div id="scanActionPanelOverlay" class="scan-panel-overlay">
  <div class="scan-panel-container action-panel-modal action-panel">
    <!-- Header -->
    <div class="action-panel__header p-4 border-b border-gray-200 flex justify-between items-center">
      <h5 class="font-bold text-gray-800">動作決策面板</h5>
      <button type="button" class="action-panel__secondary" onclick="closeScanActionPanel()">關閉</button>
    </div>
    <!-- Body -->
    <div class="scan-panel-form-section">
      <!-- 狀態卡片 -->
      <div class="action-panel__status-card flex justify-between items-center bg-yellow-50 p-3 border border-yellow-200 rounded-lg mb-3">
        <div>
          <small class="text-yellow-800 text-xs">掃描結果</small>
          <div id="scanPanelAssetId" class="font-bold text-lg mt-1">-</div>
        </div>
        <div class="bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs"><i class="fas fa-check"></i></div>
      </div>
      <!-- 動態 Meta 區塊 -->
      <div id="scanPanelMetaContainer" class="scan-panel-meta-grid">
        <!-- JS 將動態填入勾選的欄位 -->
      </div>
      <!-- 連動設定表單 -->
      <div class="text-xs text-gray-500 mb-1 tracking-wider">連動與業務流程設定</div>
      <input type="text" id="scan-ismsSearch" class="search-input" placeholder="搜尋資訊資產...">
      <div class="flex gap-2">
        <select id="scan-ismsAssetSelect" class="select-input flex-1 bg-gray-50"><option value="">-- 請選擇資訊資產 --</option></select>
        <button id="scan-btnEditIsms" class="btn-secondary px-3" disabled><i class="fas fa-edit"></i></button>
        <button id="scan-btnDeleteIsms" class="btn-danger px-3" disabled><i class="fas fa-trash"></i></button>
      </div>
      <input type="text" id="scan-mappingRemarks" class="search-input" placeholder="備註（選填）">
      <select id="scan-businessProcessSelect" class="select-input bg-gray-50"><option value="">-- 業務流程：不變更 --</option></select>
    </div>
    <!-- Footer -->
    <div class="action-panel__footer p-4 border-t border-gray-200 bg-gray-50">
      <button id="scan-createMappingBtn" type="button" class="btn-primary w-full py-2 disabled:opacity-50" disabled onclick="handleUnifiedAction('scan')">
        請先選擇資產與分類
      </button>
    </div>
  </div>
</div>
```

- [ ] **Step 3: 手動測試**
打開瀏覽器終端機，執行 `document.getElementById('scanActionPanelOverlay').classList.add('is-active')` 驗證視覺是否正常，接著移除該 class。

---

### Task 3: 面板資料初始化與掃描連動 (`connect.html`)

**Files:**
- Modify: `connect.html`

**Interfaces:**
- Consumes: `allAssets` 陣列、`currentColPrefs`。
- Produces: `openScanActionPanel(assetId)`, `closeScanActionPanel()`。

- [ ] **Step 1: 實作開關與渲染邏輯**
在 JS 區塊中定義 `openScanActionPanel(assetId)`。
```javascript
function openScanActionPanel(assetId) {
  const asset = allAssets.find(a => a.assetId === assetId);
  if (!asset) return; // 或跳出錯誤提示
  
  // 1. 勾選主表 checkbox，使其成為已選資產
  selectedAssetIds.add(assetId);
  updateActionBarState(); // 更新底部的「已選 X 筆」與表單
  
  // 2. 渲染 Meta 區塊
  document.getElementById('scanPanelAssetId').textContent = assetId;
  const metaContainer = document.getElementById('scanPanelMetaContainer');
  metaContainer.innerHTML = '';
  
  currentColPrefs.forEach(col => {
    if (col.scanVisible && col.id !== 'assetId' && col.id !== 'checkbox') {
      const val = asset[col.id] || '-';
      metaContainer.innerHTML += `
        <div>
          <span class="text-gray-400">${col.label}：</span><br>
          <span class="text-gray-700">${val}</span>
        </div>
      `;
    }
  });
  
  // 3. 顯示面板
  document.getElementById('scanActionPanelOverlay').classList.add('is-active');
  
  // 4. 初始化下拉連動
  syncScanFormFromMainBar();
}

function closeScanActionPanel() {
  document.getElementById('scanActionPanelOverlay').classList.remove('is-active');
}
```

- [ ] **Step 2: 攔截條碼掃描成功事件**
找出 `Quagga.onDetected` 或處理掃描成功的函式（如 `handleScanResult`），當成功解析出 `assetId` 且確認該資產存在時，呼叫 `openScanActionPanel(assetId)` 並關閉原本的 Scanner Zone。

---

### Task 4: 共用表單邏輯與動態按鈕參數化 (`connect.html`)

**Files:**
- Modify: `connect.html`

**Interfaces:**
- Consumes: `updateActionBarState`, `handleUnifiedAction`

- [ ] **Step 1: 同步與綁定 ISMS 搜尋下拉功能**
由於原本有 `setupIsmsSearch()` 監聽 `#ismsSearch`，現在需要將相同邏輯套用至 `#scan-ismsSearch`。
將初始化 ISMS 選項的邏輯獨立，讓 `scan-ismsAssetSelect` 也有相同選項。
```javascript
// 在 populateIsmsDropdown 等地方，同時將選項塞給 scan-ismsAssetSelect
function populateScanIsmsDropdown(optionsHtml) {
  const select = document.getElementById('scan-ismsAssetSelect');
  if(select) select.innerHTML = optionsHtml;
}
```
並確保 `#scan-ismsSearch` 也能過濾 `#scan-ismsAssetSelect` 的內容，以及 `#scan-ismsAssetSelect` 的 `change` 事件會解鎖按鈕。

- [ ] **Step 2: 修改 `updateActionBarState` 以連動更新掃描面板按鈕**
找到 `updateActionBarState()`，當它更新 `#createMappingBtn` 的文字與 disabled 狀態時，也同步更新 `#scan-createMappingBtn`。
```javascript
const scanBtn = document.getElementById('scan-createMappingBtn');
if (scanBtn) {
  scanBtn.disabled = mainBtn.disabled;
  scanBtn.innerHTML = mainBtn.innerHTML;
  scanBtn.className = mainBtn.className; // 同步 btn-primary 等狀態
}
```

- [ ] **Step 3: 參數化 `handleUnifiedAction`**
修改 `handleUnifiedAction`，允許傳入 `source` 參數。若 `source === 'scan'`，則其讀取的 input value 改為從 `scan-` 開頭的 ID 讀取。
```javascript
function handleUnifiedAction(source = 'main') {
  const prefix = source === 'scan' ? 'scan-' : '';
  const selectedIsmsId = document.getElementById(prefix + 'ismsAssetSelect').value;
  const remarks = document.getElementById(prefix + 'mappingRemarks').value;
  const bp = document.getElementById(prefix + 'businessProcessSelect').value;
  
  // 繼續原有的 API 呼叫邏輯，並在成功後呼叫 closeScanActionPanel()
  // ...
}
```

- [ ] **Step 4: 測試**
執行掃描測試，確認彈出面板後，能選擇資訊資產與業務流程，按下「建立連動」按鈕能正確觸發 `google.script.run`，並在完成後關閉面板與清除選取。
