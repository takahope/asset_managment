# 01: 使用者視角隱藏兩張待列印待辦卡，待辦數字不計入

**What to build:** 一般使用者、組別窗口，以及切換到使用者視角的管理員／承辦窗口，在「待辦事項」側邊欄不再看到「待列印報廢申請單」與「待列印轉移申請單」兩張卡片，主頁待辦紅色數字也不再計入這兩張卡的數量。管理員視角（`isAdminView`）維持 7 張卡與原加總方式；切換視角時即時生效。「哪些卡片只限管理員視角」集中由 store 的單一顯示規則 `isTodoCardVisible(cardId)` 決定，側邊欄清單與待辦總數共用。各卡片數字計算、載入就緒判斷、後端與列印彈窗皆不變。規格：`docs/superpowers/specs/2026-10-19-hide-print-todo-cards-design.md`。

**Blocked by:** None (can start immediately)

**Status:** done

- [x] store 新增 `isTodoCardVisible(cardId)`：`scrapPending`、`transferPending` 回傳 `isAdminView`，其餘恆為 true
- [x] 側邊欄卡片依規則過濾，卡片定義仍保留 7 張，可見卡片維持原相對順序
- [x] `sidebarPendingTotal` 只加總可見卡片的數字，缺值視為 0
- [x] `cardCounts`、`sidebarCountsReady`、`isCardCountReady` 與 `code.js` 未修改
- [x] 未新增凍結 Tailwind 未收錄的 utility class
- [x] 新增 `scripts/test_todo_card_visibility.mjs`（自實際原始碼擷取，以 vm 執行），涵蓋：使用者視角 5 張卡且順序正確、使用者視角總數不計兩張待列印卡（其數字非 0 時）、管理員視角 7 張卡、管理員視角總數為 7 張總和、視角切換後清單與總數隨之改變並可恢復、缺值視為 0
- [x] `node scripts/test_todo_card_visibility.mjs` 全數通過，既有 `node scripts/test_select_filter.mjs` 仍通過
- [x] 不執行 `clasp push`／部署
