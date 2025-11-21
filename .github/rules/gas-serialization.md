# Google Apps Script Data Serialization Rules

## 🚨 The Silent Null Problem

當 `google.script.run` 將資料從後端 (`code.js`) 傳送到前端 (`.html`) 時，若回傳值包含以下類型，**整個回傳結果會變成 `null`，且不會拋出錯誤**：

### ❌ 不支援的類型
1. **Date Objects** (`new Date()`)
2. **Map** / **Set**
3. **Function**
4. **Circular References** (物件循環參照)

### ✅ 安全的類型
- `String`, `Number`, `Boolean`, `null`, `undefined`
- Plain `Object` (`{...}`)
- `Array` (`[...]`)

---

## 🔍 診斷清單 (Inspection Checklist)

當審查供前端調用的後端函式時，必須確認：

- [ ] **無原始 Date 物件**: 回傳前所有日期已用 `Utilities.formatDate()` 轉為字串
- [ ] **無 Map/Set**: 已轉換為 `Object` 或 `Array`
- [ ] **有 DTO 層**: 函式最後一步使用 `.map()` 明確建構乾淨的物件
- [ ] **所有欄位已型別轉換**: 使用 `String()`, `Number()` 確保無 `undefined`

---

## 🛠 修復模式 (Fix Patterns)

### Pattern 1: 日期轉換

```javascript
// ❌ WRONG
function getData() {
  return assets.map(a => ({
    id: a.id,
    updateTime: a.lastModified  // Date 物件
  }));
}

// ✅ CORRECT
function getData() {
  return assets.map(a => ({
    id: String(a.id),
    updateTime: a.lastModified 
      ? Utilities.formatDate(new Date(a.lastModified), Session.getScriptTimeZone(), "yyyy/MM/dd")
      : ""
  }));
}
```

### Pattern 2: Map 轉 Object

```javascript
// ❌ WRONG
function getKeepers() {
  const keepersMap = new Map();
  assets.forEach(a => keepersMap.set(a.email, a.name));
  return { keepers: keepersMap };  // Map 無法序列化
}

// ✅ CORRECT
function getKeepers() {
  const keepersMap = new Map();
  assets.forEach(a => keepersMap.set(a.email, a.name));
  return { keepers: Object.fromEntries(keepersMap) };  // 轉為純物件
}
```

### Pattern 3: 前端防禦

```javascript
// 在 HTML 的 withSuccessHandler 中加入檢查
google.script.run
  .withSuccessHandler(data => {
    if (data === null) {
      console.error("❌ 接收到 null！後端可能回傳了 Date/Map/Set。");
      showError({ message: "資料載入失敗，請聯繫開發人員檢查序列化問題。" });
      return;
    }
    // 正常處理資料
  })
  .withFailureHandler(showError)
  .backendFunction();
```

---

## 📊 實際案例 (Real-World Example)

**場景**: `getAllScrappableItems()` 回傳報廢清單給 `printScrap.html`

**症狀**: 前端收到 `null`，但後端日誌顯示有 3 筆資料

**根本原因**: 
```javascript
// 錯誤代碼片段
return assets.map(asset => ({
  scrapDate: asset.lastModified  // ← 這是 Date 物件！
}));
```

**解決方案**:
```javascript
return assets.map(asset => ({
  assetId: String(asset.assetId || ''),
  scrapDate: asset.lastModified 
    ? Utilities.formatDate(new Date(asset.lastModified), Session.getScriptTimeZone(), "yyyy/MM/dd")
    : '',
  scrapReason: String(asset.remarks || '')
}));
```

---

## 🎯 快速自檢命令

當完成新的 API 函式時，執行以下檢查：

1. **搜尋關鍵字**: 在函式中搜尋 `return`，確認回傳的物件是否乾淨
2. **類型追蹤**: 追蹤回傳物件中每個欄位的來源，確認沒有直接從 Sheet 讀取的 Date
3. **測試驗證**: 在前端 Console 印出 `typeof data` 和 `data === null`