// =================================================================
// --- 全域設定 (Global Settings) ---
// =================================================================

const RESPONSE_SHEET_NAME = "表單回應 1";
const APPLICATION_LOG_SHEET_NAME = "轉移申請紀錄";
const KEEPER_EMAIL_MAP_SHEET_NAME = "保管人/信箱";
const ADMIN_LIST_SHEET_NAME = "管理員名單";
const PROPERTY_MASTER_SHEET_NAME = "財產總表";
const ITEM_MASTER_SHEET_NAME = "物品總表";

// --- 欄位索引 (A欄是1) ---
const PROPERTY_COLUMN_INDICES = {
  ASSET_ID: 1,
  ASSET_NAME: 2,
  PURCHASE_DATE: 6,
  USE_LIFE: 7,
  LOCATION: 8,
  LEADER_NAME: 10,
  USER_NAME: 11,
  LEADER_EMAIL: 13,
  USER_EMAIL: 14,
  ASSET_STATUS: 15,
  TRANSFER_TIME: 17,
  IS_UPLOADED: 18,
  IS_COMPUTER: 20
};

const ITEM_COLUMN_INDICES = {
  ASSET_ID: 1,
  ASSET_NAME: 2,
  PURCHASE_DATE: 5,
  USE_LIFE: 6,
  LOCATION: 13,
  LEADER_NAME: 11,
  LEADER_EMAIL: 14,
  ASSET_STATUS: 15,
  TRANSFER_TIME: 17,
  IS_UPLOADED: 18,
  IS_COMPUTER: 20
};

// --- 「申請紀錄」工作表中的欄位索引 ---
const AL_ASSET_ID_COLUMN_INDEX = 3;
const AL_NEW_LEADER_COLUMN_INDEX = 6;
const AL_NEW_LEADER_EMAIL_COLUMN_INDEX = 9;
const AL_STATUS_COLUMN_INDEX = 8;

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

  const html = HtmlService.createTemplateFromFile('dashboard').evaluate();
  html.setTitle("系統儀表板");
  html.addMetaTag('viewport', 'width=device-width, initial-scale=1.0');
  return html;
}

// =================================================================
// --- 權限與存取控制 ---
// =================================================================

/**
 * 取得系統存取白名單（含快取）
 * 來源：保管人信箱 + 資產管理員
 * @returns {string[]} 允許存取的 Email 陣列（已小寫化）
 */
function getAllowedEmails() {
  const cache = CacheService.getScriptCache();
  const cacheKey = 'dashboard_access_allowlist';

  const cachedList = cache.get(cacheKey);
  if (cachedList) {
    Logger.log("從快取中讀取儀表板存取白名單。");
    return JSON.parse(cachedList);
  }

  let keeperEmails = [];
  try {
    const keeperSheet = SpreadsheetApp.openById(SPREADSHEET_ID)
      .getSheetByName(KEEPER_EMAIL_MAP_SHEET_NAME);
    if (keeperSheet && keeperSheet.getLastRow() > 1) {
      const range = keeperSheet.getRange(2, 2, keeperSheet.getLastRow() - 1, 1);
      keeperEmails = range.getValues()
        .map(row => row[0])
        .filter(email => email && String(email).includes('@'))
        .map(email => String(email).toLowerCase().trim());
    }
  } catch (e) {
    Logger.log("讀取保管人信箱時發生錯誤：" + e.message);
  }

  const adminEmails = getAdminEmails().map(e => String(e).toLowerCase().trim());
  const allEmails = [...new Set([...keeperEmails, ...adminEmails])];

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
  const cache = CacheService.getScriptCache();
  const cacheKey = 'admin_emails_list';

  const cachedAdmins = cache.get(cacheKey);
  if (cachedAdmins) {
    Logger.log("從快取中成功讀取管理員名單。");
    return JSON.parse(cachedAdmins);
  }

  Logger.log("快取未命中，從 Google Sheet 讀取管理員名單。");
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(ADMIN_LIST_SHEET_NAME);
  if (!sheet) {
    Logger.log(`錯誤：找不到名為 "${ADMIN_LIST_SHEET_NAME}" 的工作表。`);
    return [];
  }

  const range = sheet.getRange("A2:A" + sheet.getLastRow());
  const emails = range.getValues()
    .map(row => row[0])
    .filter(email => email && email.includes('@'));

  if (emails.length > 0) {
    cache.put(cacheKey, JSON.stringify(emails), 600);
    Logger.log(`已將 ${emails.length} 筆管理員 Email 存入快取。`);
  }

  return emails;
}

// =================================================================
// --- 資料抽象層 (最小化) ---
// =================================================================

function mapRowToAssetObject(row, indices, sourceSheet) {
  return {
    assetId: row[indices.ASSET_ID - 1],
    assetName: row[indices.ASSET_NAME - 1],
    purchaseDate: indices.PURCHASE_DATE ? row[indices.PURCHASE_DATE - 1] : null,
    useLife: indices.USE_LIFE ? row[indices.USE_LIFE - 1] : null,
    location: row[indices.LOCATION - 1],
    leaderName: row[indices.LEADER_NAME - 1],
    leaderEmail: row[indices.LEADER_EMAIL - 1],
    userName: indices.USER_NAME ? row[indices.USER_NAME - 1] : null,
    userEmail: indices.USER_EMAIL ? row[indices.USER_EMAIL - 1] : null,
    assetStatus: row[indices.ASSET_STATUS - 1],
    transferTime: row[indices.TRANSFER_TIME - 1],
    isUploaded: row[indices.IS_UPLOADED - 1],
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
