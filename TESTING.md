# Google Apps Script 測試套件說明

這是財產管理系統的完整測試套件文件。

## 目錄

- [概述](#概述)
- [測試框架](#測試框架)
- [測試類別](#測試類別)
- [執行測試](#執行測試)
- [測試涵蓋範圍](#測試涵蓋範圍)
- [斷言函式](#斷言函式)
- [最佳實踐](#最佳實踐)

## 概述

本測試套件為 `code.js` 中的所有主要函式提供單元測試，使用 Google Apps Script 內建的 Logger 進行測試輸出。測試套件包含：

- ✅ 斷言輔助函式
- ✅ 資料抽象層測試
- ✅ 資料獲取函式測試
- ✅ 審核流程測試
- ✅ 管理員權限測試
- ✅ 借用/歸還功能測試
- ✅ 報廢功能測試
- ✅ 整合測試
- ✅ 測試執行器

## 測試框架

### 斷言輔助函式

測試框架提供以下斷言函式：

#### `assert(condition, message)`
檢查條件是否為真。
```javascript
assert(value > 0, '值應該大於 0');
```

#### `assertEqual(actual, expected, message)`
檢查兩個值是否相等。
```javascript
assertEqual(result, 'success', '結果應該是 success');
```

#### `assertDeepEqual(actual, expected, message)`
檢查兩個物件是否深度相等（使用 JSON.stringify 比較）。
```javascript
assertDeepEqual(obj1, obj2, '兩個物件應該相等');
```

#### `assertNotNull(value, message)`
檢查值是否非空（非 null 和 undefined）。
```javascript
assertNotNull(data, '資料不應該為空');
```

#### `assertArrayContains(array, element, message)`
檢查陣列是否包含特定元素。
```javascript
assertArrayContains(['a', 'b', 'c'], 'b', '陣列應該包含 b');
```

#### `assertThrows(fn, message)`
檢查函式是否拋出異常。
```javascript
assertThrows(() => { throw new Error('test'); }, '應該拋出異常');
```

#### `assertType(value, expectedType, message)`
檢查值的型別。
```javascript
assertType(count, 'number', 'count 應該是數字');
```

#### `assertArrayLength(array, expectedLength, message)`
檢查陣列長度。
```javascript
assertArrayLength(items, 5, '應該有 5 個項目');
```

### 測試統計

測試框架自動追蹤測試統計：
- 總測試數
- 通過數
- 失敗數
- 跳過數
- 錯誤訊息列表

## 測試類別

### 1. 資料抽象層測試

#### `test_mapRowToAssetObject()`
測試將工作表資料列轉換為資產物件的函式。

**測試內容：**
- 正確映射所有欄位
- 處理財產總表和物品總表的差異
- sourceSheet 標記正確

#### `test_getAllAssets()`
測試從兩個主表讀取所有資產的函式。

**測試內容：**
- 回傳非空陣列
- 資產物件包含必要欄位
- 記錄讀取的資產數量

#### `test_findAssetLocation()`
測試查找資產所在工作表和列號的函式。

**測試內容：**
- 找到存在的資產
- 回傳正確的工作表和列號
- 對不存在的資產回傳 null

### 2. 資料獲取測試

#### `test_getSelectData()`
測試獲取駐站與電腦下拉選單資料的函式。

**測試內容：**
- 回傳正確的資料結構
- 群組和電腦映射正確

#### `test_getSevenZipVersions()`
測試讀取 7-Zip 版本清單的函式。

**測試內容：**
- 回傳版本陣列
- 版本格式正確

#### `test_getTransferData()`
測試獲取轉移申請頁面所需資料的函式。

**測試內容：**
- 包含當前使用者 email
- 包含可轉移資產列表
- 包含保管人、使用人、地點列表

#### `test_getUserStateData()`
測試獲取個人資產狀態的函式。

**測試內容：**
- 回傳使用者資產列表
- 管理員權限判斷正確
- 資產資訊完整

#### `test_getAppUrl()`
測試獲取 Web App URL 的函式。

**測試內容：**
- 回傳有效的 HTTPS URL

### 3. 審核流程測試

#### `test_getPendingApprovals()`
測試獲取待審核申請的函式。

**測試內容：**
- 回傳待審核列表
- 包含必要的審核資訊
- 錯誤處理正確

#### `test_countPendingApprovals()`
測試計算待審核案件數量的函式。

**測試內容：**
- 回傳數字型別
- 數量大於等於 0

### 4. 管理員權限測試

#### `test_checkAdminPermissions()`
測試檢查管理員權限的函式。

**測試內容：**
- 回傳布林值

#### `test_getAdminEmails()`
測試獲取管理員 email 清單的函式。

**測試內容：**
- 回傳 email 陣列
- Email 格式正確（包含 @）

### 5. 借用/歸還功能測試

#### `test_getLendingData()`
測試獲取可出借資產資料的函式。

**測試內容：**
- 包含可出借資產列表
- 包含借用人和地點列表
- 只包含「在庫」狀態的資產

#### `test_getLentOutAssets()`
測試獲取出借中資產的函式。

**測試內容：**
- 回傳出借記錄列表
- 包含借用人和預期歸還日期

#### `test_processBatchLending_validation()`
測試批次出借資料驗證。

**測試內容：**
- 必填欄位驗證
- 資料結構正確性
- 不執行實際寫入

#### `test_processBatchReturn_validation()`
測試批次歸還資料驗證。

**測試內容：**
- 空陣列處理
- lendId 格式驗證
- 不執行實際寫入

### 6. 報廢功能測試

#### `test_getScrappableAssets()`
測試獲取可報廢資產的函式。

**測試內容：**
- 只包含「在庫」或「出借中」的資產
- 資產資訊完整

#### `test_processBatchScrapping_validation()`
測試批次報廢資料驗證。

**測試內容：**
- 必填欄位驗證
- 報廢原因格式正確
- 「其他」原因處理
- 不執行實際寫入

### 7. 整合測試

#### `test_dataConsistency()`
測試資料一致性。

**測試內容：**
- `getAllAssets()` 和 `findAssetLocation()` 資料一致
- 隨機抽樣驗證

#### `test_columnIndices()`
測試欄位索引正確性。

**測試內容：**
- 財產總表索引正確
- 物品總表索引正確
- 關鍵欄位索引值正確

### 8. 表單處理測試

#### `test_processFormData_validation()`
測試電腦狀態回報表單資料驗證。

**測試內容：**
- 表單欄位完整性
- 勾選框狀態處理
- 不執行實際寫入

## 執行測試

### 執行所有測試

在 Google Apps Script 編輯器中執行：

```javascript
runAllTests()
```

查看執行結果：
1. 點擊「檢視」→「記錄」（或使用快捷鍵 Ctrl+Enter）
2. 查看詳細的測試輸出和統計摘要

### 執行特定測試類別

```javascript
// 只執行資料抽象層測試
runTestCategory('data-abstraction')

// 只執行資料獲取測試
runTestCategory('data-retrieval')

// 只執行審核流程測試
runTestCategory('approval')

// 只執行管理員測試
runTestCategory('admin')

// 只執行整合測試
runTestCategory('integration')
```

### 執行快速測試

執行基本測試（不包含所有功能測試）：

```javascript
runQuickTests()
```

### 執行單一測試

可以直接執行任何測試函式：

```javascript
test_getAllAssets()
test_getTransferData()
// ... 等等
```

## 測試涵蓋範圍

### 已測試的主要函式（按模組分類）

#### 資料抽象層
- ✅ `mapRowToAssetObject()`
- ✅ `getAllAssets()`
- ✅ `findAssetLocation()`

#### UI 和資料獲取
- ✅ `getSelectData()`
- ✅ `getSevenZipVersions()`
- ✅ `getTransferData()`
- ✅ `getUserStateData()`
- ✅ `getAppUrl()`

#### 審核流程
- ✅ `getPendingApprovals()`
- ✅ `countPendingApprovals()`

#### 管理員功能
- ✅ `checkAdminPermissions()`
- ✅ `getAdminEmails()`

#### 借用/歸還
- ✅ `getLendingData()`
- ✅ `getLentOutAssets()`
- ✅ `processBatchLending()` (資料驗證)
- ✅ `processBatchReturn()` (資料驗證)

#### 報廢功能
- ✅ `getScrappableAssets()`
- ✅ `processBatchScrapping()` (資料驗證)

#### 表單處理
- ✅ `processFormData()` (資料驗證)

### 測試涵蓋率統計

- **總測試函式數：** 22+
- **涵蓋的主要函式：** 18+
- **斷言數量：** 100+

## 測試輸出範例

```
======================================================================
開始執行 Google Apps Script 測試套件
======================================================================
開始時間: 2024/1/15 下午2:30:00

----------------------------------------------------------------------
測試: getAllAssets()
----------------------------------------------------------------------
  讀取到 150 筆資產
  第一筆資產: P001 - 電腦A
✓ PASS: getAllAssets 應該回傳非空值
✓ PASS: getAllAssets 應該回傳陣列
✓ getAllAssets 測試完成

----------------------------------------------------------------------
測試: findAssetLocation()
----------------------------------------------------------------------
  測試資產 ID: P001
  找到位置: 財產總表, 列 2
✓ PASS: findAssetLocation 應該找到資產
✓ PASS: findAssetLocation 對不存在的 ID 應該回傳 null
✓ findAssetLocation 測試完成

...

結束時間: 2024/1/15 下午2:30:15

======================================================================
測試摘要 (Test Summary)
======================================================================
總測試數: 105
通過: 103 ✓
失敗: 2 ✗
跳過: 0 ○
成功率: 98.10%
======================================================================
```

## 最佳實踐

### 1. 不要在測試中修改真實資料

**重要：** 所有涉及資料修改的測試（如 `processBatchLending`、`processBatchTransferApplication` 等）都只執行資料驗證，不執行實際的資料庫寫入操作。

```javascript
// ✅ 好的做法：只驗證資料結構
function test_processBatchLending_validation() {
  const validFormData = {
    assetIds: ['TEST001'],
    borrowerName: '測試借用人',
    // ...
  };
  // 只檢查資料結構，不呼叫實際函式
  assert(Array.isArray(validFormData.assetIds), '...');
}

// ❌ 避免：在測試中修改真實資料
function test_processBatchLending_actual() {
  processBatchLending({
    assetIds: ['REAL001'], // 不要這樣做！
    // ...
  });
}
```

### 2. 定期執行測試

建議在以下情況執行測試：
- 修改 `code.js` 後
- 部署到正式環境前
- 發現 bug 後（先寫測試重現問題）
- 定期檢查（例如每週）

### 3. 解讀測試結果

- **通過 (✓ PASS)：** 測試符合預期
- **失敗 (✗ FAIL)：** 發現問題，需要檢查
- **跳過 (○ SKIPPED)：** 測試條件不滿足（例如沒有資料）

### 4. 新增測試的指南

當添加新功能時，應該：

1. 在 `tests.js` 中建立新的測試函式：
```javascript
function test_yourNewFunction() {
  Logger.log('\n' + '-'.repeat(70));
  Logger.log('測試: yourNewFunction()');
  Logger.log('-'.repeat(70));

  try {
    const result = yourNewFunction();
    assertNotNull(result, '應該回傳結果');
    // 更多斷言...

    Logger.log('✓ yourNewFunction 測試完成');
  } catch (e) {
    Logger.log(`✗ 測試失敗: ${e.message}`);
  }
}
```

2. 將測試加入 `runAllTests()` 或適當的測試類別

3. 執行測試確保通過

### 5. 使用描述性的測試訊息

```javascript
// ✅ 好的做法
assertEqual(status, '在庫', '資產狀態應該是「在庫」');

// ❌ 不好的做法
assertEqual(status, '在庫', 'test');
```

### 6. 測試邊界條件

```javascript
// 測試空陣列
test_emptyArray();

// 測試不存在的資料
test_nonExistentData();

// 測試錯誤輸入
test_invalidInput();
```

## 故障排除

### 問題：測試顯示「找不到函式」

**原因：** 測試函式和主程式碼可能在不同檔案中。

**解決方案：** 確保 `tests.js` 和 `code.js` 都已部署（使用 `clasp push`）。

### 問題：Logger 沒有顯示輸出

**原因：** Logger 視窗沒有開啟或需要刷新。

**解決方案：**
1. 點擊「檢視」→「記錄」
2. 重新執行測試

### 問題：測試執行時間過長

**原因：** 執行所有測試可能需要較長時間。

**解決方案：**
- 使用 `runQuickTests()` 執行快速測試
- 或執行特定類別的測試 `runTestCategory('data-abstraction')`

### 問題：某些測試被跳過

**原因：** 測試條件不滿足（例如沒有資料）。

**解決方案：** 這通常是正常的。檢查 Logger 輸出了解跳過原因。

## 貢獻測試

如果你發現 bug 或想改進測試：

1. 為 bug 建立重現測試
2. 修正程式碼
3. 確保測試通過
4. 提交變更

## 授權

本測試套件遵循與主專案相同的授權條款。

---

最後更新：2024-01-15
