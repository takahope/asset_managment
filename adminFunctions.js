/**
 * 從 "管理員名單" 工作表獲取管理員 Email 列表，並使用快取優化效能。
 * @returns {string[]} 一個包含所有管理員 Email 的陣列。
 */
function getAdminEmails() {
  const cache = CacheService.getScriptCache();
  const cacheKey = 'admin_emails_list';

  // 步驟 1: 嘗試從快取中讀取資料
  const cachedAdmins = cache.get(cacheKey);
  if (cachedAdmins) {
    Logger.log("從快取中成功讀取管理員名單。 সনাক্তকরণ");
    return JSON.parse(cachedAdmins); // 將快取的字串轉回陣列
  }

  // 步驟 2: 如果快取中沒有，則從試算表讀取
  Logger.log("快取未命中，從 Google Sheet 讀取管理員名單。");
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(ADMIN_LIST_SHEET_NAME);
  if (!sheet) {
    Logger.log(`錯誤：找不到名為 "${ADMIN_LIST_SHEET_NAME}" 的工作表。`);
    return []; // 如果找不到工作表，回傳空陣列
  }

  const range = sheet.getRange("A2:A" + sheet.getLastRow());
  const emails = range.getValues()
                      .map(row => row[0])
                      .filter(email => email && email.includes('@')); // 過濾掉空白或格式不符的儲存格

  // 步驟 3: 將從試算表讀到的資料存入快取，以便下次使用
  // 快取有效時間設為 10 分鐘 (600 秒)
  if (emails.length > 0) {
    cache.put(cacheKey, JSON.stringify(emails), 600);
    Logger.log(`已將 ${emails.length} 筆管理員 Email 存入快取。`);
  }

  return emails;
}

/**
 * 從 "管理員名單" 工作表的 B 欄獲取「電腦回報」總管理員 Email 列表，並使用快取。
 * @returns {string[]} 一個包含所有回報總管理員 Email 的陣列。
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

  // ✨ **核心修改點：讀取 B 欄 (欄位索引為 2)**
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

function checkAdminPermissions() {
  const currentUserEmail = Session.getActiveUser().getEmail().toLowerCase();
  const adminEmails = getAdminEmails().map(email => email.toLowerCase());
  return adminEmails.includes(currentUserEmail);
}

function getAdminName() {
  const currentUserEmail = Session.getActiveUser().getEmail();
  const mappingSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(KEEPER_EMAIL_MAP_SHEET_NAME);
  const data = mappingSheet.getRange("A2:B" + mappingSheet.getLastRow()).getValues();
  const mapping = new Map(data.map(row => [row[1], row[0]])); // Email -> Name
  return mapping.get(currentUserEmail) || currentUserEmail; // 如果找不到，就回傳 Email
}
