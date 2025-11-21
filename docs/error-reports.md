# Error Report: Frontend Received Null from Backend

**Date**: 2025-11-21  
**Severity**: High (功能完全失效)  
**Affected Module**: 報廢列印 (Scrapping Print)

---

## 🔴 Symptom (症狀)

**前端行為**:
- `printScrap.html` 切換到詳細模式時，表格顯示「目前沒有任何狀態為『報廢中』的財產」
- Console 顯示：`📦 [renderDetailedTable] 收到資料: null`

**後端行為**:
- Execution log 顯示 `getAllScrappableItems` 成功找到 3 筆資料
- 日誌輸出：`✓ 成功載入 3 筆資料`

---

## 🔍 Diagnosis (診斷)

### Step 1: 前端檢查
```javascript
// printScrap.html line 131
function renderDetailedTable(items) {
  console.log('收到資料:', items);  // 輸出: null
  console.log('類型:', typeof items);  // 輸出: object
  console.log('是陣列?', Array.isArray(items));  // 輸出: false
}
```

### Step 2: 後端追蹤
```javascript
// code.js line 1245 (原始錯誤代碼)
function getAllScrappableItems(assetCategory) {
  const targetAssets = allAssets.filter(/* ... */);
  
  return targetAssets.map(asset => ({
    assetId: asset.assetId,
    scrapDate: asset.lastModified,  // ← 這是 Date 物件！
    scrapReason: asset.remarks
  }));
}
```

### Step 3: 測試驗證
在 Apps Script Editor 中執行 `Logger.log(typeof asset.lastModified)`，確認回傳 `"object"`（Date 類型）。

---

## 💡 Root Cause (根本原因)

`google.script.run` 的序列化機制**不支援 Date 物件**。當回傳值包含 `new Date()` 或從 Sheet 讀取的日期欄位時：
1. Google 嘗試將物件轉為 JSON
2. 遇到 Date 時無法處理
3. **整個回傳結果變成 `null`**（不是只有那個欄位）
4. 前端的 `withSuccessHandler` 收到 `null`
5. **後端不會拋出任何錯誤**

---

## ✅ Solution (解決方案)

### 修復後的代碼

```javascript
// filepath: /Users/kih/Library/CloudStorage/OneDrive-Personal/文件/財產處理/code.js
function getAllScrappableItems(assetCategory) {
  if (!checkAdminPermissions()) {
    throw new Error("權限不足");
  }

  const allAssets = getAllAssets();
  const targetAssets = allAssets.filter(asset => 
    asset.assetStatus === '報廢中' && 
    asset.assetCategory === assetCategory
  );

  // ✨ 關鍵修改：DTO 轉換層
  return targetAssets.map(asset => {
    let scrapDateStr = '';
    if (asset.lastModified) {
      try {
        scrapDateStr = Utilities.formatDate(
          new Date(asset.lastModified), 
          Session.getScriptTimeZone(), 
          "yyyy/MM/dd"
        );
      } catch (e) {
        scrapDateStr = '';
      }
    }

    return {
      assetId: String(asset.assetId || ''),
      assetName: String(asset.assetName || ''),
      originalKeeper: String(asset.leaderName || ''),
      originalUser: String(asset.userName || ''),
      scrapDate: scrapDateStr,  // ← 字串，非 Date
      scrapReason: String(asset.remarks || '')
    };
  });
}
```

---

## 🛡 Prevention (預防措施)

### 1. 在 `.github/copilot-instructions.md` 加入規則

已在 Section 6 "Data Serialization for Web App" 加入此案例。

### 2. 建立 Subagent

在 `CLAUDE.md` 中新增 `gas-check` 指令，未來可用：
```
@claude gas-check code.js
```
自動掃描類似問題。

### 3. 前端防禦代碼

在所有 `.html` 的 `withSuccessHandler` 中加入：
```javascript
if (data === null) {
  console.error("❌ Backend serialization failure detected");
  showError({ message: "資料載入失敗，請檢查後端序列化問題。" });
  return;
}
```

---

## 📊 Impact (影響)

- **User Impact**: 管理員無法使用報廢列印功能（詳細模式）
- **Duration**: 2025-11-21 09:00 - 11:30 (約 2.5 小時)
- **Affected Users**: 1 位管理員測試帳號
- **Data Loss**: 無

---

## ✅ Verification (驗證)

**測試步驟**:
1. 開啟 `printScrap.html` 詳細模式
2. 打開 Chrome DevTools Console
3. 確認 log 顯示 `📦 收到資料: [{...}, {...}, {...}]`（非 null）
4. 表格正確顯示 3 筆報廢項目

**結果**: ✅ 通過

---

## 🔗 Related Documents

- [GAS Serialization Rules](.github/rules/gas-serialization-rules.md)
- [Copilot Instructions](.github/copilot-instructions.md#6-data-serialization-for-web-app-critical)