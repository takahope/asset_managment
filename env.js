const SPREADSHEET_ID = "1ChjQbozyd8ROoGDo"; // 在試算表網址中可以找到
const REPORT_SPREADSHEET_ID = SPREADSHEET_ID; // 駐站電腦狀態回報試算表ID（請改成「駐站電腦狀態回報」）

// --- ✨ **新增**：報廢列印功能相關設定 ---
const SCRAP_TEMPLATE_DOC_ID = "1Dta5j4M8QaUM4y9Y"; // ⚠️ 請務必替換成您的範本ID
const SCRAP_OUTPUT_FOLDER_ID = "1PqJwrgwoiRv5F-r"; // 建議指定一個資料夾

const SCRAP_TEMPLATE_DOC_ID_PROPERTY = "1Dta5jaUM4y9Y";
const SCRAP_TEMPLATE_DOC_ID_NON_CONSUMABLE = "1z5eFRYnS4iRaK53FgIg";

// --- ✨ **新增**：轉移列印功能相關設定 ---
const TRANSFER_TEMPLATE_DOC_ID_PROPERTY = "1S50625lkLWApgvotGY"; // ⚠️ 請替換成財產轉移範本ID
const TRANSFER_TEMPLATE_DOC_ID_ITEM = "1OurXTu94oHYX2C1Y";         // ⚠️ 請替換成物品轉移範本ID
const TRANSFER_OUTPUT_FOLDER_ID = "1EV_43yZo4uZ";             // ⚠️ 請替換成轉移記錄輸出資料夾ID



// --- ✨ **新增**：出借申請單列印功能相關設定 ---
const LENDING_TEMPLATE_DOC_ID = "1xk64B39oeHv2rO1IjM";                 // ⚠️ 請替換成出借申請單範本ID
const LENDING_OUTPUT_FOLDER_ID = "1QYX2WUuuemVwDTzlhC";               // ⚠️ 請替換成出借申請單輸出資料夾ID

// --- ✨ **新增**：ISMS 資訊資產對照整合設定 ---
const ISMS_SPREADSHEET_ID = "YOUR_ISMS_SPREADSHEET_ID_HERE"; // ⚠️ 請替換成 ISMS 資訊資產試算表 ID
const ISMS_ASSET_SHEET_NAME = "資訊資產清單";                   // ISMS 資訊資產清單工作表名稱
const ISMS_MAPPING_SHEET_NAME = "資產對照表";                   // 資產對照表工作表名稱
const ISMS_DROPDOWN_SHEET_NAME = "下拉選單";                     // ISMS 試算表內的下拉選單工作表

// --- ✨ **新增**：FAB 子專案導航連結（isms-connect-asset 子專案 Web App 部署 URL） ---
// 基底 URL；子頁面由 code.js 以 query string 組合（?page=connect, ?page=softwarelist）
const ISMS_CONNECT_ASSET_WEB_APP_URL = "https://script.google.com/a/macros/as.edu.tw/s/cby35pdL21bTuxFR/exec";
const FAB_URL_ISMS_ASSET = ISMS_CONNECT_ASSET_WEB_APP_URL;                      // 資訊資產清單
const FAB_URL_ISMS_CONNECT = ISMS_CONNECT_ASSET_WEB_APP_URL + "?page=connect";   // 資產對照管理
const FAB_URL_SOFTWARE_LIST = ISMS_CONNECT_ASSET_WEB_APP_URL + "?page=softwarelist"; // 軟體清冊

// --- ✨ 使用者頁面操作說明書 ---
const USERSTATE_OPERATION_MANUAL_URL = "https://drive.google.com/file/d/YOUR_PDF_FILE_ID/view"; // ⚠️ 舊版操作說明書連結（保留供相容 fallback）
const USERSTATE_OPERATION_MANUAL_PDF_DOWNLOAD_URL = ""; // ⚠️ 請替換成 PDF 直接下載連結
const USERSTATE_OPERATION_MANUAL_VIDEO_YOUTUBE_URL = ""; // ⚠️ 請替換成 YouTube 影片連結
const USERSTATE_OPERATION_MANUAL_VIDEO_DRIVE_URL = ""; // ⚠️ 請替換成 Google Drive 影片連結
