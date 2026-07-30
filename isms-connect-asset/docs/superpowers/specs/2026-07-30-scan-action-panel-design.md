# Scan Action Panel Design Spec

## 1. 概述 (Overview)
當使用者點擊「掃描條碼」或在移動端使用相機掃描資產後，系統會自動彈出「掃描動作決策面板」。此面板專注於「資訊資產連動」與「業務流程」設定，並讓使用者能快速檢視資產狀態。
同時，現有的「欄位設定」彈窗將新增「掃描面板顯示」的勾選功能，允許管理者自定義要在掃描面板中顯示哪些資產欄位。

## 2. 資料結構與狀態 (Data & State)
### 2.1 `currentColPrefs` 擴充
原本控制主表欄位顯示的狀態（存於 localStorage `isms_connect_col_prefs_v2`），需擴充一個屬性 `scanVisible`：
```javascript
{
  id: 'assetId',
  label: '資產編號',
  visible: true,      // 控制主表顯示
  scanVisible: true,  // 【新增】控制掃描決策面板顯示
  unmovable: false
}
```
預設 `scanVisible` 為 `true` 的欄位包含：資產編號、資訊資產編號、資產別名、連動狀態、使用狀態、業務流程、ISO範圍。

## 3. UI 介面設計 (UI Components)
### 3.1 欄位設定視窗 (`colSettingsModal`) 修改
採用 **「頂部表頭對齊」 (雙欄位 Checkbox)** 方案：
- 清單頂部新增固定表頭：「主表」、「掃描」、「欄位名稱」。
- 每列資料左側提供兩個 Checkbox，分別綁定 `col.visible` 與 `col.scanVisible`。
- 修改 `renderColSettingsList` 與儲存邏輯，以同步更新 `scanVisible` 屬性。

### 3.2 掃描動作決策面板 (`scanActionPanelModal`)
採用 **「標準規格排版」**：
- **Header**: 面板標題與關閉按鈕。
- **Body**: 
  - **狀態卡片 (Status Card)**：顯示掃描到的資產編號與狀態圖示。
  - **動態 Meta 區塊**：根據 `currentColPrefs` 中 `scanVisible === true` 的欄位，動態渲染該資產的詳細屬性（預設 7 項）。
  - **連動設定表單**：包含資訊資產搜尋 (`scan-ismsSearch`)、下拉選單 (`scan-ismsAssetSelect`)、編輯/刪除按鈕、備註 (`scan-mappingRemarks`) 與業務流程選單 (`scan-businessProcessSelect`)。
- **Footer**: 
  - 動態主要按鈕（對應原主頁下方的動作，如「建立連動」、「建立連動並設定業務流程」等）。

## 4. 實作細節與架構 (Implementation Details)
### 4.1 DOM ID 防衝突設計
由於現有底部的 action bar 已經使用了 `ismsSearch`、`ismsAssetSelect` 等 ID，為了避免 Vanilla JS 中 ID 衝突，掃描面板內的表單元素應加上 `scan-` 前綴（如 `scan-ismsAssetSelect`）。

### 4.2 事件綁定與邏輯共用
- **搜尋與下拉聯動**：需要將原先寫死綁定在 `ismsSearch` / `ismsAssetSelect` 的邏輯進行重構或參數化，使其同時支援掃描面板的 `scan-` 元素。
- **動態按鈕邏輯**：掃描面板底部的確認按鈕，其文字與行為需與主畫面底部 action bar 的動態邏輯保持一致，執行時呼叫共用的 `handleUnifiedAction()` 或將其參數化。
- **自動勾選機制**：當掃描成功取得資產編號時，系統應自動在背景將該資產加入「已選清單」，並將其資料傳遞給面板以渲染 Meta 區塊。

## 5. 邊界情況 (Edge Cases)
- **掃描不到資產**：應顯示錯誤提示。
- **未勾選任何掃描欄位**：Meta 區塊應隱藏或顯示「無顯示欄位」。
- **視覺規範**：Class 命名應盡量遵循 `docs/action_panel_spec.md` 規範（如 `action-panel__body`, `action-panel__status-card`），確保視覺統一。
