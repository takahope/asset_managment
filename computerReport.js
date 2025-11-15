// =================================================================
// --- 電腦回報相關功能模組 (Computer Report Module) ---
// =================================================================
//
// 本文件包含所有與電腦狀態回報相關的函數
// 從 code.js 中提取，用於模組化管理
//
// ⚠️ 重要依賴說明：
// 1. 本模組依賴 env.js 中的 SPREADSHEET_ID 常量
// 2. 本模組依賴 code.js 中的以下函數（需要一併引入或保持在 code.js 中）：
//    - getAllAssets(): 獲取所有資產的統一接口
//
// =================================================================

// =================================================================
// --- 常量定義 (Constants) ---
// =================================================================

// --- 工作表名稱設定 ---
const RESPONSE_SHEET_NAME = "表單回應 1"; // Web App 回報結果寫入的工作表
const SOFTWARE_VERSIONS_SHEET_NAME = "軟體版本清單"; // 軟體版本清單工作表
const ADMIN_LIST_SHEET_NAME = "管理員名單"; // 管理員權限列表
const PROPERTY_MASTER_SHEET_NAME = "財產總表"; // 財產總表

// --- 欄位索引設定 ---
const PROPERTY_COLUMN_INDICES = {
  ASSET_ID: 1,      // A欄: 財產編號
  ASSET_NAME: 2,    // B欄: 財產名稱
  PURCHASE_DATE: 6, // F欄: 取得日期
  USE_LIFE: 7,      // G欄: 使用年限
  ASSET_CATEGORY: 12, // L欄: 財產類別
  LOCATION: 8,      // H欄: 保管地點 (財產)
  LEADER_EMAIL: 13, // M欄: 保管人電子郵件
  LEADER_NAME: 10,  // J欄: 保管人
  USER_NAME: 11,    // K欄: 使用者
  USER_EMAIL: 14,   // N欄: 使用者電子郵件
  ASSET_STATUS: 15, // O欄: 財產狀態
  APPLICATION_TIME: 16, // P欄: 申請時間
  TRANSFER_TIME: 17,    // Q欄: 接收時間
  IS_UPLOADED: 18,      // R欄: 是否上傳
  UPLOAD_TIME: 19,      // S欄: 上傳時間
  IS_COMPUTER: 20,      // T欄: 是否為駐站電腦
  LAST_MODIFIED: 21,    // U欄: 報廢日期
  REMARKS: 22,          // V欄: 報廢原因
  DOC_URL: 23,          // W欄: 報廢申請文件
  IS_ACTUALLY_COMPUTER: 25 // Y欄: 是否為電腦
};

// 在「軟體版本清單」工作表中的欄位
const SV_SEVENZIP_COLUMN_INDEX = 1; // 7zip 版本在 A 欄

// =================================================================
// --- 電腦回報資料獲取函數 ---
// =================================================================

/**
 * 獲取下拉選單所需的資料
 * 從所有資產中篩選出電腦，並按駐站分組
 *
 * ⚠️ 依賴：getAllAssets() 函數
 *
 * @returns {Object} 以駐站為鍵，電腦編號陣列為值的物件
 */
function getSelectData() {
  const data = getAllAssets();

  const dataMap = {};

  data.forEach(asset => {
    if (asset.isComputer === '是' && asset.assetStatus !== '已報廢') {
      const group = asset.location;
      const computer = asset.assetId;
      if (group && computer) {
          if (!dataMap[group]) dataMap[group] = [];
          dataMap[group].push(computer);
      }
    }
  });
  return dataMap;
}

/**
 * 從「軟體版本清單」工作表讀取 7-Zip 版本清單
 */
function getSevenZipVersions() {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SOFTWARE_VERSIONS_SHEET_NAME);
    const lastRow = sheet.getLastRow();

    if (lastRow < 2) {
      Logger.log("軟體版本清單工作表中沒有資料");
      return [];
    }

    // 讀取 A 欄的所有資料 (從第2行開始，跳過標題)
    const data = sheet.getRange(2, SV_SEVENZIP_COLUMN_INDEX, lastRow - 1, 1).getValues();

    // 過濾空白值並轉換為一維陣列
    const versions = data
      .map(row => row[0])
      .filter(version => version && version.toString().trim() !== "")
      .map(version => version.toString().trim());

    Logger.log("讀取到的 7-Zip 版本：", versions);
    return versions;
  } catch (e) {
    Logger.log("讀取 7-Zip 版本時發生錯誤: " + e.message);
    return [];
  }
}

// =================================================================
// --- 電腦回報表單處理函數 ---
// =================================================================

/**
 * 處理從 Web App 前端提交過來的表單資料，並寫入 Google Sheet
 * @param {object} formObject - 從前端傳來的表單物件
 * @returns {string} - 回傳給使用者的成功或失敗訊息
 */
function processFormData(formObject) {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(RESPONSE_SHEET_NAME);
    const timestamp = new Date();

    // 調試：記錄接收到的完整表單資料
    Logger.log("接收到的表單資料：");
    Logger.log(JSON.stringify(formObject, null, 2));

    // 調試：檢查勾選狀態
    Logger.log("winUpdated 值：" + formObject.winUpdated + " (類型：" + typeof formObject.winUpdated + ")");
    Logger.log("chromeUpdated 值：" + formObject.chromeUpdated + " (類型：" + typeof formObject.chromeUpdated + ")");
    Logger.log("antivirusUpdated 值：" + formObject.antivirusUpdated + " (類型：" + typeof formObject.antivirusUpdated + ")");

    // 將勾選框狀態轉換為文字（處理字串和布林值）
    let winStatus = "否";
    let chromeStatus = "否";
    let antivirusStatus = "否";

    // 更嚴格的判斷條件
    if (formObject.winUpdated === true || formObject.winUpdated === "true" || formObject.winUpdated === "on") {
      winStatus = "是";
    }
    if (formObject.chromeUpdated === true || formObject.chromeUpdated === "true" || formObject.chromeUpdated === "on") {
      chromeStatus = "是";
    }
    if (formObject.antivirusUpdated === true || formObject.antivirusUpdated === "true" || formObject.antivirusUpdated === "on") {
      antivirusStatus = "是";
    }

    Logger.log("最終狀態 - Windows：" + winStatus + ", Chrome：" + chromeStatus + ", 防毒軟體：" + antivirusStatus);

    const newRow = [
      timestamp,
      formObject.group,
      formObject.computer,
      formObject.notes,
      winStatus,           // Windows 更新狀態
      chromeStatus,        // Chrome 更新狀態
      antivirusStatus,     // 防毒軟體更新狀態
      formObject.sevenZipVersion, // 7-Zip 版本 (合併後的單一欄位)
    ];

    // 調試：記錄要寫入的完整行資料
    Logger.log("要寫入的行資料：");
    Logger.log(newRow);

    sheet.appendRow(newRow);
    return "回報成功！感謝您的填寫。";
  } catch (e) {
    Logger.log("寫入錯誤: " + e.message);
    Logger.log("錯誤堆疊: " + e.stack);
    return "錯誤：無法寫入資料。請聯繫管理員。原因：" + e.message;
  }
}

// =================================================================
// --- 電腦回報檢查與通知函數 ---
// =================================================================

/**
 * 獲取「電腦回報」管理員名單
 * 從管理員名單工作表的 B 欄讀取，並使用快取機制提升效能
 *
 * @returns {Array} 管理員 Email 陣列
 */
function getReportAdmins() {
  const cache = CacheService.getScriptCache();
  const cacheKey = 'report_admins_list';

  // 步驟 1: 嘗試從快取中讀取
  const cachedAdmins = cache.get(cacheKey);
  if (cachedAdmins) {
    Logger.log("從快取中成功讀取「電腦回報」管理員名單。");
    return JSON.parse(cachedAdmins);
  }

  // 步驟 2: 如果快取中沒有，則從試算表讀取
  Logger.log("快取未命中，從 Google Sheet 讀取「電腦回報」管理員名單。");
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(ADMIN_LIST_SHEET_NAME);
  if (!sheet) {
    Logger.log(`錯誤：找不到名為 "${ADMIN_LIST_SHEET_NAME}" 的工作表。`);
    return [];
  }

  // 讀取 B 欄 (欄位索引為 2)
  const range = sheet.getRange(2, 2, sheet.getLastRow() - 1, 1);
  const emails = range.getValues()
                      .map(row => row[0])
                      .filter(email => email && email.includes('@'));

  // 步驟 3: 將結果存入快取
  if (emails.length > 0) {
    cache.put(cacheKey, JSON.stringify(emails), 600); // 快取 10 分鐘
    Logger.log(`已將 ${emails.length} 筆「電腦回報」管理員 Email 存入快取。`);
  }

  return emails;
}

/**
 * 檢查電腦回報狀態並發送通知
 * 此函數應設定為每月自動執行的觸發器
 *
 * ⚠️ 依賴：getAllAssets(), getReportAdmins() 函數
 *
 * 功能：
 * 1. 檢查本月哪些電腦尚未回報
 * 2. 向個別保管人發送提醒郵件
 * 3. 向管理員發送總清單
 */
function checkComputerReportsAndNotify() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const responseSheet = ss.getSheetByName(RESPONSE_SHEET_NAME);

  const allAssets = getAllAssets();

  const requiredComputers = allAssets.filter(asset => asset.isComputer === '是');

  const responseData = responseSheet.getRange(2, 1, responseSheet.getLastRow() - 1, 3).getValues();
  const submittedComputers = new Set();

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  for (const row of responseData) {
    const timestamp = new Date(row[0]);
    if (timestamp.getFullYear() === currentYear && timestamp.getMonth() === currentMonth) {
      const computerName = row[2];
      if (computerName) {
        submittedComputers.add(String(computerName).trim());
      }
    }
  }

  const remindersForLeaders = {};
  const allMissingForAdmin = [];

  for (const asset of requiredComputers) {
    if (asset.assetId) {
      const computerNameStr = String(asset.assetId).trim();
      if (computerNameStr && !submittedComputers.has(computerNameStr)) {
        const missingInfo = ` - 駐站: ${asset.location}, 電腦: ${computerNameStr}`;
        allMissingForAdmin.push(missingInfo);
        if (asset.leaderEmail) {
          if (!remindersForLeaders[asset.leaderEmail]) {
            remindersForLeaders[asset.leaderEmail] = [];
          }
          remindersForLeaders[asset.leaderEmail].push(missingInfo);
        }
      }
    }
  }

  const subjectDate = `${currentYear}年${currentMonth + 1}月`;
  for (const leaderEmail in remindersForLeaders) {
    if (remindersForLeaders[leaderEmail].length > 0) {
      const subject = `[自動通知] ${subjectDate} 駐站有電腦尚未回報狀態`;
      let body = `您好，\n\n截至目前，駐站尚有以下電腦未透過表單回報本月份狀態：\n` + remindersForLeaders[leaderEmail].join("\n") + `\n\n請協助處理。\n\n此為系統自動發送郵件。`;
      MailApp.sendEmail(leaderEmail, subject, body);
    }
  }

  if (allMissingForAdmin.length > 0) {
    const reportAdmins = getReportAdmins();

    if (reportAdmins && reportAdmins.length > 0) {
      const subject = `[自動通知] ${subjectDate} 未回報電腦總清單`;
      let body = `您好，\n\n截至目前，本月份尚有以下所有電腦未回報狀態：\n\n` + allMissingForAdmin.join("\n") + `\n\n系統已同步寄送通知給相關駐管。\n\n此為系統自動發送郵件。`;

      MailApp.sendEmail(reportAdmins.join(','), subject, body);
      Logger.log(`已發送總清單通知給 ${reportAdmins.length} 位「電腦回報」管理員。`);
    } else {
      Logger.log("警告：在「管理員名單」中找不到任何有效的「電腦回報」管理員Email，無法寄送總清單。");
    }
  } else {
    Logger.log("所有應回報的電腦皆已完成本月份的回報。");
  }
}

// =================================================================
// --- 測試與調試函數 ---
// =================================================================

/**
 * 測試當前使用者的 Email
 * 用於調試 Session.getActiveUser().getEmail() 是否正確
 */
function testMyEmail() {
  const currentUserEmail = Session.getActiveUser().getEmail();
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(PROPERTY_MASTER_SHEET_NAME);
  if (!sheet || sheet.getLastRow() < 2) {
    Logger.log(`工作表 "${PROPERTY_MASTER_SHEET_NAME}" 不存在或沒有資料。`);
    return;
  }
  const firstDataEmail = sheet.getRange(2, PROPERTY_COLUMN_INDICES.LEADER_EMAIL).getValue();

  Logger.log("系統偵測到您登入的 Email 是：" + currentUserEmail);
  Logger.log(`工作表 "${PROPERTY_MASTER_SHEET_NAME}" 中第一筆財產的保管人 Email 是：` + firstDataEmail);

  if (currentUserEmail === firstDataEmail) {
    Logger.log("比對結果：相符！");
  } else {
    Logger.log("比對結果：不相符！請檢查這兩個 Email 是否有差異。");
  }
}
