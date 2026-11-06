# 02: 於 CLAUDE.md 記錄變更與已接受的副作用

**What to build:** 後續維護者讀 CLAUDE.md 時能知道：一般使用者視角已隱藏兩張待列印卡與其計數、判斷依據為 `isAdminView`、規則集中於 `isTodoCardVisible`，以及已接受的副作用——一般使用者不再有「接收後退回轉移」與「批次取消報廢」入口（資產列仍可逐筆取消報廢；退回改由承辦窗口或管理員處理），避免日後誤判為 bug。

**Blocked by:** 01

**Status:** done

- [x] CLAUDE.md 新增 2026-10-19 變更條目，格式比照既有條目（需求／實作／驗證）
- [x] 條目記載判斷依據 `isAdminView`、承辦窗口因 `checkAdminPermissions()` 自動包含、組別窗口比照一般使用者
- [x] 條目記載上述副作用與「後端與列印彈窗未變動」
- [x] 條目記載驗證指令 `node scripts/test_todo_card_visibility.mjs`
- [x] 不執行部署
