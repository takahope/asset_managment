// =================================================================
// --- 全域設定 (Global Settings) ---
// =================================================================

const RESPONSE_SHEET_NAME = "駐站回報清單"; // Web App 回報結果寫入的工作表
const SOFTWARE_VERSIONS_SHEET_NAME = "軟體版本清單"; // 軟體版本清單工作表
const KEEPER_EMAIL_MAP_SHEET_NAME = "保管人/信箱";
const ADMIN_LIST_SHEET_NAME = "管理員名單";
const PROPERTY_MASTER_SHEET_NAME = "財產總表";
const ITEM_MASTER_SHEET_NAME = "物品總表";

// 在「軟體版本清單」工作表中的欄位
const SV_SEVENZIP_COLUMN_INDEX = 1; // 7zip 版本在 A 欄

// --- 最小化欄位索引 (A欄是1, B欄是2, ...) ---
const PROPERTY_COLUMN_INDICES = {
  ASSET_ID: 1,
  LOCATION: 8,
  LEADER_EMAIL: 13,
  ASSET_STATUS: 15,
  IS_COMPUTER: 20
};

const ITEM_COLUMN_INDICES = {
  ASSET_ID: 1,
  LOCATION: 13,
  LEADER_EMAIL: 14,
  ASSET_STATUS: 15,
  IS_COMPUTER: 20
};

// =================================================================
// --- Web App 入口 ---
// =================================================================

function doGet() {
  const currentUserEmail = Session.getActiveUser().getEmail();
  const allowedEmails = getAllowedEmails();

  if (!allowedEmails.includes(currentUserEmail.toLowerCase())) {
    Logger.log(`存取被拒絕：${currentUserEmail} 不在授權名單中。`);
    return createAccessDeniedPage(currentUserEmail);
  }

  const html = HtmlService.createTemplateFromFile('Index').evaluate();
  html.setTitle("電腦狀態回報");
  html.addMetaTag('viewport', 'width=device-width, initial-scale=1.0');
  return html;
}

// =================================================================
// --- 權限與存取控制 ---
// =================================================================

/**
 * 讀取 HR 主表試算表 ID(本專案 Script Property;與主專案各設一次)
 * @returns {string}
 */
function getHrSpreadsheetId_() {
  const id = PropertiesService.getScriptProperties().getProperty('HR_SPREADSHEET_ID');
  if (!id) {
    throw new Error('尚未設定 HR_SPREADSHEET_ID(本專案 Script Property)。');
  }
  return String(id).trim();
}

/**
 * 直讀 HR 人員主檔,回傳全體在職人員的小寫 email 陣列。
 * HR 讀取失敗時 throw,由呼叫端 fallback。
 * @returns {string[]}
 */
function getHrActiveEmails_() {
  const ss = SpreadsheetApp.openById(getHrSpreadsheetId_());
  const sheet = ss.getSheetByName(HR_PERSONNEL_SHEET_NAME);
  if (!sheet || sheet.getLastRow() <= 1) {
    throw new Error(`HR「${HR_PERSONNEL_SHEET_NAME}」讀取失敗或無資料。`);
  }
  const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 3).getValues(); // A 信箱、B 姓名、C 狀態
  const emails = [];
  data.forEach(row => {
    const email = String(row[0] || '').toLowerCase().trim();
    const status = String(row[2] || '').trim();
    if (!email || !email.includes('@')) return;
    if (HR_ACTIVE_STATUSES.indexOf(status) === -1) return;
    emails.push(email);
  });
  return emails;
}

/**
 * Fallback:讀「保管人/信箱」同步表 B 欄(HR 直讀失敗時使用;該表由主專案每日同步維護)。
 * @returns {string[]}
 */
function getKeeperSheetEmailsFallback_() {
  const keeperSheet = SpreadsheetApp.openById(SPREADSHEET_ID)
    .getSheetByName(KEEPER_EMAIL_MAP_SHEET_NAME);
  if (!keeperSheet || keeperSheet.getLastRow() <= 1) return [];
  return keeperSheet.getRange(2, 2, keeperSheet.getLastRow() - 1, 1).getValues() // B2:B
    .map(row => row[0])
    .filter(email => email && String(email).includes('@'))
    .map(email => String(email).toLowerCase().trim());
}

/**
 * 取得系統存取白名單（含快取）
 * 來源：保管人信箱 + 資產管理員 + 回報管理員
 * @returns {string[]} 允許存取的 Email 陣列（已小寫化）
 */
function getAllowedEmails() {
  const cache = CacheService.getScriptCache();
  const cacheKey = 'system_access_allowlist';

  // 嘗試從快取讀取
  const cachedList = cache.get(cacheKey);
  if (cachedList) {
    Logger.log("從快取中讀取系統存取白名單。");
    return JSON.parse(cachedList);
  }

  Logger.log("快取未命中，從 Google Sheet 建立系統存取白名單。");

  // 來源 1：HR 全體在職人員（直讀 HR；失敗回退讀「保管人/信箱」同步表 B 欄）
  let keeperEmails = [];
  try {
    keeperEmails = getHrActiveEmails_();
  } catch (e) {
    Logger.log("直讀 HR 失敗，回退讀「保管人/信箱」B 欄：" + e.message);
    try {
      keeperEmails = getKeeperSheetEmailsFallback_();
    } catch (e2) {
      Logger.log("讀取保管人信箱 fallback 亦失敗：" + e2.message);
    }
  }

  // 來源 2：管理員名單 / 回報管理員
  const adminEmails = getAdminEmails().map(e => String(e).toLowerCase().trim());
  const reportAdmins = getReportAdmins().map(e => String(e).toLowerCase().trim());

  // 合併並去重複
  const allEmails = [...new Set([...keeperEmails, ...adminEmails, ...reportAdmins])];

  // 存入快取（10 分鐘）
  if (allEmails.length > 0) {
    cache.put(cacheKey, JSON.stringify(allEmails), 600);
    Logger.log(`已將 ${allEmails.length} 筆授權 Email 存入快取。`);
  }

  return allEmails;
}

/**
 * 建立存取拒絕頁面
 * @param {string} userEmail 被拒絕存取的使用者 Email
 * @returns {HtmlOutput} 存取拒絕頁面
 */
function createAccessDeniedPage(userEmail) {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>權限不足</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    .container {
      background: white;
      padding: 40px;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.2);
      text-align: center;
      max-width: 420px;
    }
    .icon {
      font-size: 48px;
      margin-bottom: 16px;
    }
    h1 {
      margin: 0 0 12px 0;
      font-size: 24px;
      color: #333;
    }
    p {
      margin: 0 0 12px 0;
      color: #666;
      line-height: 1.5;
    }
    .email {
      background: #f5f5f5;
      padding: 8px 12px;
      border-radius: 6px;
      font-family: monospace;
      color: #333;
      display: inline-block;
      margin: 8px 0;
    }
    .contact {
      margin-top: 24px;
      padding-top: 20px;
      border-top: 1px solid #eee;
      font-size: 14px;
      color: #888;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="icon">&#128683;</div>
    <h1>權限不足</h1>
    <p>您的帳號未在系統授權名單中，無法存取此應用程式。</p>
    <div class="email">${userEmail}</div>
    <p class="contact">如需存取權限，請聯繫系統管理員。</p>
  </div>
</body>
</html>`;

  return HtmlService.createHtmlOutput(html)
    .setTitle('權限不足')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0');
}

/**
 * 從 "管理員名單" 工作表獲取管理員 Email 列表，並使用快取優化效能。
 * @returns {string[]} 一個包含所有管理員 Email 的陣列。
 */
function getAdminEmails() {
  const props = PropertiesService.getScriptProperties();
  return parseEmailListProperty_(props.getProperty('ADMIN_EMAILS'));
}

/**
 * 從 Script Property REPORT_ADMIN_EMAILS 獲取「電腦回報」總管理員 Email 列表。
 * 注意：此 property 與主專案（asset_managment）的 REPORT_ADMIN_EMAILS 是各自獨立的
 * script property，主專案設定視窗變更後不會同步到這裡，需在本專案另行設定。
 * @returns {string[]} 一個包含所有回報總管理員 Email 的陣列。
 */
function getReportAdmins() {
  const props = PropertiesService.getScriptProperties();
  return parseEmailListProperty_(props.getProperty('REPORT_ADMIN_EMAILS'));
}

/**
 * 將逗號/換行/分號分隔的 email 字串解析為陣列，過濾空白與不含 @ 的項目。
 * @param {string} raw
 * @returns {string[]}
 */
function parseEmailListProperty_(raw) {
  if (!raw) return [];
  return String(raw)
    .split(/[\n,;]+/)
    .map(email => email.trim())
    .filter(email => email && email.includes('@'));
}

// =================================================================
// --- 資料抽象層 (最小化) ---
// =================================================================

function mapRowToAssetObject(row, indices, sourceSheet) {
  return {
    assetId: row[indices.ASSET_ID - 1],
    location: row[indices.LOCATION - 1],
    leaderEmail: row[indices.LEADER_EMAIL - 1],
    assetStatus: row[indices.ASSET_STATUS - 1],
    isComputer: row[indices.IS_COMPUTER - 1],
    sourceSheet: sourceSheet
  };
}

function getAllAssets() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const propertySheet = ss.getSheetByName(PROPERTY_MASTER_SHEET_NAME);
  const itemSheet = ss.getSheetByName(ITEM_MASTER_SHEET_NAME);
  let allAssetObjects = [];

  if (propertySheet && propertySheet.getLastRow() > 1) {
    const propertyData = propertySheet.getRange(2, 1, propertySheet.getLastRow() - 1, propertySheet.getLastColumn()).getValues();
    const propertyObjects = propertyData.map(row => mapRowToAssetObject(row, PROPERTY_COLUMN_INDICES, PROPERTY_MASTER_SHEET_NAME));
    allAssetObjects = allAssetObjects.concat(propertyObjects);
  } else {
    Logger.log(`警告：找不到工作表 "${PROPERTY_MASTER_SHEET_NAME}" 或其中沒有資料。`);
  }

  if (itemSheet && itemSheet.getLastRow() > 1) {
    const itemData = itemSheet.getRange(2, 1, itemSheet.getLastRow() - 1, itemSheet.getLastColumn()).getValues();
    const itemObjects = itemData.map(row => mapRowToAssetObject(row, ITEM_COLUMN_INDICES, ITEM_MASTER_SHEET_NAME));
    allAssetObjects = allAssetObjects.concat(itemObjects);
  } else {
    Logger.log(`警告：找不到工作表 "${ITEM_MASTER_SHEET_NAME}" 或其中沒有資料。`);
  }

  Logger.log(`getAllAssets: 共讀取並正規化 ${allAssetObjects.length} 筆資產物件。`);
  return allAssetObjects;
}

// =================================================================
// --- 前端回報表單 API ---
// =================================================================

/**
 * [供 Index.html 呼叫] 獲取駐站與電腦的二級下拉選單資料
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
    const sheet = SpreadsheetApp.openById(REPORT_SPREADSHEET_ID).getSheetByName(SOFTWARE_VERSIONS_SHEET_NAME);
    const lastRow = sheet.getLastRow();

    if (lastRow < 2) {
      Logger.log("軟體版本清單工作表中沒有資料");
      return [];
    }

    const data = sheet.getRange(2, SV_SEVENZIP_COLUMN_INDEX, lastRow - 1, 1).getValues();
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

/**
 * 處理從 Web App 前端提交過來的表單資料，並寫入 Google Sheet
 * @param {object} formObject - 從前端傳來的表單物件
 * @returns {string} - 回傳給使用者的成功或失敗訊息
 */
function processFormData(formObject) {
  try {
    const sheet = SpreadsheetApp.openById(REPORT_SPREADSHEET_ID).getSheetByName(RESPONSE_SHEET_NAME);
    const timestamp = new Date();

    Logger.log("接收到的表單資料：");
    Logger.log(JSON.stringify(formObject, null, 2));

    Logger.log("winUpdated 值：" + formObject.winUpdated + " (類型：" + typeof formObject.winUpdated + ")");
    Logger.log("chromeUpdated 值：" + formObject.chromeUpdated + " (類型：" + typeof formObject.chromeUpdated + ")");
    Logger.log("antivirusUpdated 值：" + formObject.antivirusUpdated + " (類型：" + typeof formObject.antivirusUpdated + ")");

    let winStatus = "否";
    let chromeStatus = "否";
    let antivirusStatus = "否";

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
      winStatus,
      chromeStatus,
      antivirusStatus,
      formObject.sevenZipVersion
    ];

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
// --- 每月自動提醒功能 (背景排程執行) ---
// =================================================================

/**
 * 每月定時觸發，檢查電腦回報狀態並發送通知
 */
function checkComputerReportsAndNotify() {
  const ss = SpreadsheetApp.openById(REPORT_SPREADSHEET_ID);
  const responseSheet = ss.getSheetByName(RESPONSE_SHEET_NAME);

  const allAssets = getAllAssets();
  const requiredComputers = allAssets.filter(asset => asset.isComputer === '是' && asset.assetStatus !== '已報廢');

  const responseLastRow = responseSheet.getLastRow();
  const responseData = responseLastRow > 1
    ? responseSheet.getRange(2, 1, responseLastRow - 1, 3).getValues()
    : [];

  const submittedComputers = new Set();

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  for (const row of responseData) {
    if (!row[0]) continue;
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

/**
 * 測試電腦回報通知：只輸出預計寄送內容到執行紀錄
 */
function testComputerReportsAndNotify() {
  const ss = SpreadsheetApp.openById(REPORT_SPREADSHEET_ID);
  const responseSheet = ss.getSheetByName(RESPONSE_SHEET_NAME);
  if (!responseSheet) {
    Logger.log(`找不到工作表 "${RESPONSE_SHEET_NAME}"，無法測試通知。`);
    return;
  }

  const allAssets = getAllAssets();
  const requiredComputers = allAssets.filter(asset => asset.isComputer === '是' && asset.assetStatus !== '已報廢');

  const responseLastRow = responseSheet.getLastRow();
  const responseData = responseLastRow > 1
    ? responseSheet.getRange(2, 1, responseLastRow - 1, 3).getValues()
    : [];

  const submittedComputers = new Set();

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  for (const row of responseData) {
    if (!row[0]) continue;
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
    if (!asset.assetId) continue;
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
      Logger.log(`[預計通知項目] ${missingInfo} -> 駐管Email: ${asset.leaderEmail || '未填'}`);
    }
  }

  Logger.log(`統計：應回報 ${requiredComputers.length} 台，已回報 ${submittedComputers.size} 台，未回報 ${allMissingForAdmin.length} 台。`);

  const subjectDate = `${currentYear}年${currentMonth + 1}月`;
  for (const leaderEmail in remindersForLeaders) {
    if (remindersForLeaders[leaderEmail].length === 0) continue;
    const subject = `[自動通知] ${subjectDate} 駐站有電腦尚未回報狀態`;
    const body = `您好，\n\n截至目前，駐站尚有以下電腦未透過表單回報本月份狀態：\n` + remindersForLeaders[leaderEmail].join("\n") + `\n\n請協助處理。\n\n此為系統自動發送郵件。`;
    Logger.log(`\n[預計寄送給駐管] ${leaderEmail}\n主旨：${subject}\n內容：\n${body}\n`);
  }

  if (allMissingForAdmin.length > 0) {
    const reportAdmins = getReportAdmins();
    if (reportAdmins && reportAdmins.length > 0) {
      const subject = `[自動通知] ${subjectDate} 未回報電腦總清單`;
      const body = `您好，\n\n截至目前，本月份尚有以下所有電腦未回報狀態：\n\n` + allMissingForAdmin.join("\n") + `\n\n系統已同步寄送通知給相關駐管。\n\n此為系統自動發送郵件。`;
      Logger.log(`\n[預計寄送給回報管理員] ${reportAdmins.join(',')}\n主旨：${subject}\n內容：\n${body}\n`);
    } else {
      Logger.log("警告：在「管理員名單」中找不到任何有效的「電腦回報」管理員Email，無法寄送總清單。");
    }
  } else {
    Logger.log("所有應回報的電腦皆已完成本月份的回報。");
  }
}

// =================================================================
// --- 一次性遷移：管理員名單工作表 → Script Property（本專案獨立執行） ---
// =================================================================

/**
 * ✨ [一次性手動執行] 將「管理員名單」工作表 A/B 欄現有資料遷移至本專案的 Script Property。
 * 與主專案（asset_managment）的 migrateAdminSettingsToProperties() 各自獨立，兩專案都要各執行一次。
 * 部署前務必執行，否則遷移後 ADMIN_EMAILS 為空會導致 getAdminEmails 依賴的功能失效。
 */
function migrateAdminSettingsToProperties() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const adminSheet = ss.getSheetByName(ADMIN_LIST_SHEET_NAME);
  if (!adminSheet) {
    Logger.log(`找不到「${ADMIN_LIST_SHEET_NAME}」工作表，無法遷移。`);
    return;
  }

  const props = PropertiesService.getScriptProperties();
  const lastRow = adminSheet.getLastRow();

  const adminEmails = lastRow >= 2
    ? adminSheet.getRange(2, 1, lastRow - 1, 1).getValues().map(r => r[0]).filter(v => v && String(v).includes('@'))
    : [];
  const reportAdminEmails = lastRow >= 2
    ? adminSheet.getRange(2, 2, lastRow - 1, 1).getValues().map(r => r[0]).filter(v => v && String(v).includes('@'))
    : [];

  props.setProperty('ADMIN_EMAILS', adminEmails.join(','));
  props.setProperty('REPORT_ADMIN_EMAILS', reportAdminEmails.join(','));

  Logger.log(`遷移完成：ADMIN_EMAILS=${adminEmails.length} 筆, REPORT_ADMIN_EMAILS=${reportAdminEmails.length} 筆`);
}
