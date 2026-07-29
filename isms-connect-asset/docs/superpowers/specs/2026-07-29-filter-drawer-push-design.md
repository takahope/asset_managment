# Filter Drawer Push Interaction Design

## 1. 架構與排版設計 (Architecture & DOM Structure)
- **外層抽屜容器 (`.filter-drawer-wrapper`)**：
  在 `connect.html` 中將既有的 `<div class="card mb-5">` 篩選區塊包裝於新容器內。
  該容器使用 CSS Grid，預設設定 `grid-template-rows: 0fr` 隱藏內部卡片。
  展開時設為 `grid-template-rows: 1fr`。
  這能達成平滑向下推移主畫面（Push）的效果。
- **內層容器 (`.filter-drawer-inner`)**：
  外加 `overflow: hidden` 防止抽屜在 0fr 時內容溢出。
- **拉環按鈕 (`.filter-drawer-tab`)**：
  放置於 `.filter-drawer-wrapper` 的正下方。當抽屜收起時，拉環位於畫面頂端；當抽屜往下展開時，拉環隨著主畫面一同被往下推移，始終保持在卡片下緣。

## 2. 視覺與動畫設計 (Visual & Animation)
- **半圓箭頭拉環造型**：
  水平置中，微弧形或半圓形的標籤，帶有輕度立體陰影。
  內部包含 `fa-chevron-down` 圖示。卡片展開時平滑翻轉為 `fa-chevron-up`。
- **呼吸效果 (Breathing Effect)**：
  在隱藏狀態下，拉環持續播放緩慢上下浮動（`translateY(0)` 到 `translateY(3px)`）與光影變化的 `@keyframes` 呼吸動畫。游標移入或抽屜展開時，暫停呼吸動畫。
- **轉場動畫 (Transition)**：
  抽屜的推移與拉環動畫皆採用 `cubic-bezier(0.4, 0, 0.2, 1)`（`ease-out`），時間設定約 `0.3s - 0.4s`。

## 3. 互動邏輯與防呆機制 (Interaction & Safeguards)
- **展開觸發條件 (全域偵測)**：
  1. 游標移動至全畫面頂部邊緣（Y 座標 < 30px）。
  2. 游標移入或點擊「拉環」。
- **收合觸發條件**：
  - **一般收合**：游標移出卡片及拉環範圍並停留超過 0.3 秒，卡片自動收合。
  - **強制收合 (操作後)**：若防呆機制暫停了自動收合，使用者須**點擊拉環**或**點擊畫面外部空白處**方能收合。
- **焦點防呆 (Pause Auto-retract)**：
  監聽卡片內的 `focusin` 與 `focusout` 事件。只要任何 `<select>`、輸入框或操作元件取得焦點，即強制暫停「游標移出自動收合」的機制。確保使用者點擊並選擇下拉選單選項時，卡片絕對不會突發收合。

## 4. 變更範圍 (Scope)
- **影響檔案**：`connect.html`
- **相容性考量**：現有 `connect.html` 中的篩選皆使用原生 `<select>` 與 `checkbox`，不受 `overflow: hidden` 切割選單的影響，可完美兼容。
