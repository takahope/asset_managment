const SPREADSHEET_ID = "1ChjQbozyd8ROoGDo"; // 在試算表網址中可以找到
const REPORT_SPREADSHEET_ID = SPREADSHEET_ID; // 駐站電腦狀態回報試算表ID（請改成「駐站電腦狀態回報」）

// --- HR 主表(Phase 2:白名單改直讀 HR;HR_SPREADSHEET_ID 走 Script Property) ---
const HR_PERSONNEL_SHEET_NAME = "人員主檔"; // A 信箱、B 姓名、C 狀態
// 這四個細分狀態合稱「在職」；「在勤」只是其中一種細分狀態
const HR_ACTIVE_STATUSES = ['在勤', '休假', '育嬰假', '外派人員'];
