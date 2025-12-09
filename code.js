// =================================================================
// --- 全域設定 (Global Settings) ---
// 所有功能都會使用此處的設定，請在此統一修改
// =================================================================

// --- 工作表名稱設定 ---
// const COMPUTER_DATA_SHEET_NAME = "電腦資料財產總表"; // 這個工作表已不再需要
// const MASTER_ASSET_LIST_SHEET_NAME = "財產總表"; // **所有資料的唯一來源 (已由 PROPERTY_MASTER_SHEET_NAME 和 ITEM_MASTER_SHEET_NAME 取代)**
const RESPONSE_SHEET_NAME = "表單回應 1"; // Web App 回報結果寫入的工作表
const SOFTWARE_VERSIONS_SHEET_NAME = "軟體版本清單"; // 軟體版本清單工作表
const APPLICATION_LOG_SHEET_NAME = "轉移申請紀錄";
const KEEPER_EMAIL_MAP_SHEET_NAME = "保管人/信箱";
const KEEPER_LOCATION_MAP_SHEET_NAME = "存置地點列表";
const LENDING_LOG_SHEET_NAME = "出借紀錄"; // ✨ **新增：出借紀錄工作表**
const ADMIN_LIST_SHEET_NAME = "管理員名單"; // ✨ **新增：管理員權限列表**



// --- 欄位索引設定 (A欄是1, B欄是2, ...) ---

// ✨ **V2 架構：已棄用** - 改用下面的物件導向索引
// const MASTER_ASSET_ID_COLUMN_INDEX = 1;
// ... (其他舊的 MASTER_ 常數)

// ✨ **V3 架構：物件導向欄位索引** ✨
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
  USER_EMAIL: 14,   // N欄: 使用者電子郵件 ✨ 新增
  ASSET_STATUS: 15, // O欄: 財產狀態 (原N欄)
  APPLICATION_TIME: 16, // P欄: 申請時間 (原O欄)
  TRANSFER_TIME: 17,    // Q欄: 接收時間 (原P欄)
  IS_UPLOADED: 18,      // R欄: 是否上傳 (原Q欄)
  UPLOAD_TIME: 19,      // S欄: 上傳時間 (原R欄)
  IS_COMPUTER: 20,      // T欄: 是否為駐站電腦 (原S欄)
  LAST_MODIFIED: 21,    // U欄: 報廢日期 (原T欄)
  REMARKS: 22,          // V欄: 報廢原因 (原U欄)
  DOC_URL: 23,          // W欄: 報廢申請文件 (原V欄)
  IS_ACTUALLY_COMPUTER: 25 // Y欄: 是否為電腦 (原X欄)
};

const ITEM_COLUMN_INDICES = {
  ASSET_ID: 1,      // A欄: 物品編號
  ASSET_NAME: 2,    // B欄: 物品名稱
  PURCHASE_DATE: 5, // E欄: 取得日期
  USE_LIFE: 6,      // F欄: 使用年限
  ASSET_CATEGORY: 10, // J欄: 財產類別
  LOCATION: 13,     // M欄: 保管地點 (物品)
  LEADER_EMAIL: 14, // N欄: 保管人電子郵件
  LEADER_NAME: 11,  // k欄: 保管人
  ASSET_STATUS: 15, // o欄: 財產狀態
  APPLICATION_TIME: 16, // P欄 申請時間
  TRANSFER_TIME: 17,    // Q欄 接收時間
  IS_UPLOADED: 18,      // R欄 是否上傳
  UPLOAD_TIME: 19,      // S欄 上傳時間
  IS_COMPUTER: 20,      // T欄 是否為駐站電腦
  LAST_MODIFIED: 21,    // U欄 報廢日期
  REMARKS: 22,          // V欄 報廢原因
  DOC_URL: 23,          // W欄 報廢申請文件
  IS_ACTUALLY_COMPUTER: 25 // Y欄 是否為電腦
};


// --- 「申請紀錄」工作表中的欄位索引 ---
const AL_APP_ID_COLUMN_INDEX = 1;
const AL_APP_TIME_COLUMN_INDEX = 2;
const AL_ASSET_ID_COLUMN_INDEX = 3;
const AL_OLD_LEADER_COLUMN_INDEX = 4;
const AL_OLD_LOCATION_COLUMN_INDEX = 5;
const AL_NEW_LEADER_COLUMN_INDEX = 6;
const AL_NEW_LOCATION_COLUMN_INDEX = 7;
const AL_STATUS_COLUMN_INDEX = 8;
const AL_NEW_LEADER_EMAIL_COLUMN_INDEX = 9; // ✨ 新增：新保管人Email
const AL_REVIEW_TIME_COLUMN_INDEX = 10;      // ✨ 更新欄位號碼
const AL_REVIEW_LINK_COLUMN_INDEX = 11;      // ✨ 更新欄位號碼
const AL_OLD_USER_COLUMN_INDEX = 12;         // ✨ 新增：原使用人
const AL_NEW_USER_COLUMN_INDEX = 13;         // ✨ 新增：新使用人
const AL_NEW_USER_EMAIL_COLUMN_INDEX = 14;   // ✨ 新增：新使用人Email
const AL_TRANSFER_TYPE_COLUMN_INDEX = 15;    // ✨ 新增：轉移類型（地點/保管人/使用人）
const AL_APPROVER_EMAIL_COLUMN_INDEX = 16;  // ✨ 新增：實際審核者Email（方案D）
const AL_APPLICANT_EMAIL_COLUMN_INDEX = 17;  // Q 欄：申請操作人員 Email

// 在「軟體版本清單」工作表中的欄位
const SV_SEVENZIP_COLUMN_INDEX = 1; // 7zip 版本在 A 欄

// --- ✨ **新增：「出借紀錄」工作表中的欄位索引** ---
const LL_LEND_ID_COLUMN_INDEX = 1;
const LL_STATUS_COLUMN_INDEX = 9;
const LL_RETURN_DATE_COLUMN_INDEX = 7;

const PROPERTY_MASTER_SHEET_NAME = "財產總表"; // ✨ **拆分後：財產總表**
const ITEM_MASTER_SHEET_NAME = "物品總表";   // ✨ **拆分後：物品總表**

// =================================================================
// --- ✨ 全新 V3：資料抽象層 (Data Access Layer) ---
// --- 將資料列轉換為物件，並隱藏兩個總表的複雜性 ---
// =================================================================

/**
 * 將資料列根據指定的欄位索引轉換為標準的資產物件。
 * @param {Array<any>} row - 從工作表讀取的一列資料。
 * @param {object} indices - 包含欄位名稱到索引數字的對應物件。
 * @param {string} sourceSheet - 資料來源的工作表名稱。
 * @returns {object} - 標準化的資產物件。
 */
function mapRowToAssetObject(row, indices, sourceSheet) {
    return {
      assetId: row[indices.ASSET_ID - 1],
      assetName: row[indices.ASSET_NAME - 1],
      purchaseDate: row[indices.PURCHASE_DATE - 1],
      useLife: row[indices.USE_LIFE - 1],
      assetCategory: row[indices.ASSET_CATEGORY - 1],
      location: row[indices.LOCATION - 1],
      leaderEmail: row[indices.LEADER_EMAIL - 1],
      leaderName: row[indices.LEADER_NAME - 1],
      userName: indices.USER_NAME ? row[indices.USER_NAME - 1] : null, // 使用者 (僅財產總表有此欄位)
      userEmail: indices.USER_EMAIL ? row[indices.USER_EMAIL - 1] : null, // 使用者Email (僅財產總表有此欄位)
      assetStatus: row[indices.ASSET_STATUS - 1],
      applicationTime: row[indices.APPLICATION_TIME - 1],
      transferTime: row[indices.TRANSFER_TIME - 1],
      isUploaded: row[indices.IS_UPLOADED - 1],
      uploadTime: row[indices.UPLOAD_TIME - 1],
      isComputer: row[indices.IS_COMPUTER - 1],
      lastModified: row[indices.LAST_MODIFIED - 1],
      remarks: row[indices.REMARKS - 1],
      docUrl: row[indices.DOC_URL - 1],
      isActuallyComputer: row[indices.IS_ACTUALLY_COMPUTER - 1],
      sourceSheet: sourceSheet
    };
}

/**
 * 從「財產總表」和「物品總表」讀取所有資產資料，並將它們正規化為標準的物件陣列。
 * @returns {Array<Object>} 包含所有資產物件的陣列。
 */
function getAllAssets() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const propertySheet = ss.getSheetByName(PROPERTY_MASTER_SHEET_NAME);
  const itemSheet = ss.getSheetByName(ITEM_MASTER_SHEET_NAME);
  let allAssetObjects = [];

  // 1. 處理財產總表
  if (propertySheet && propertySheet.getLastRow() > 1) {
    const propertyData = propertySheet.getRange(2, 1, propertySheet.getLastRow() - 1, propertySheet.getLastColumn()).getValues();
    const propertyObjects = propertyData.map(row => mapRowToAssetObject(row, PROPERTY_COLUMN_INDICES, PROPERTY_MASTER_SHEET_NAME));
    allAssetObjects = allAssetObjects.concat(propertyObjects);
  } else {
    Logger.log(`警告：找不到工作表 "${PROPERTY_MASTER_SHEET_NAME}" 或其中沒有資料。`);
  }

  // 2. 處理物品總表
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

/**
 * ✨ NEW: 獲取當前使用者相關的所有資產 (無論是保管人或使用人)。
 * @returns {Array<Object>} 包含所有相關資產物件的陣列。
 */
function getAssetsForCurrentUser() {
  const currentUserEmail = Session.getActiveUser().getEmail();
  const allAssets = getAllAssets();

  const userAssets = allAssets.filter(asset => {
    // 條件：登入者的 email 等於保管人 email 或 使用人 email
    // 對於沒有 userEmail 欄位的物品總表，asset.userEmail 會是 null，不會造成錯誤
    return asset.leaderEmail === currentUserEmail || asset.userEmail === currentUserEmail;
  });

  Logger.log(`getAssetsForCurrentUser: 為 ${currentUserEmail} 找到 ${userAssets.length} 筆相關資產。`);
  return userAssets;
}

/**
 * 查找指定 assetId 所在的實際工作表及列號。
 * @param {string} assetId - 要查找的資產ID。
 * @returns {object|null} - 如果找到，回傳 { sheet: Sheet, rowIndex: number, sheetName: string }，否則回傳 null。
 */
function findAssetLocation(assetId) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  
  // 1. 在財產總表查找
  const propertySheet = ss.getSheetByName(PROPERTY_MASTER_SHEET_NAME);
  if (propertySheet) {
    const idColumnValues = propertySheet.getRange(2, PROPERTY_COLUMN_INDICES.ASSET_ID, propertySheet.getLastRow() - 1, 1).getValues();
    for (let i = 0; i < idColumnValues.length; i++) {
      if (idColumnValues[i][0].toString().trim() === assetId.toString().trim()) {
        return { sheet: propertySheet, rowIndex: i + 2, sheetName: PROPERTY_MASTER_SHEET_NAME };
      }
    }
  }

  // 2. 在物品總表查找
  const itemSheet = ss.getSheetByName(ITEM_MASTER_SHEET_NAME);
  if (itemSheet) {
    const idColumnValues = itemSheet.getRange(2, ITEM_COLUMN_INDICES.ASSET_ID, itemSheet.getLastRow() - 1, 1).getValues();
    for (let i = 0; i < idColumnValues.length; i++) {
      if (idColumnValues[i][0].toString().trim() === assetId.toString().trim()) {
        return { sheet: itemSheet, rowIndex: i + 2, sheetName: ITEM_MASTER_SHEET_NAME };
      }
    }
  }

  Logger.log(`findAssetLocation: 找不到資產ID "${assetId}"。`);
  return null;
}

// =================================================================
// --- 試算表 UI 功能 (自訂選單) ---
// =================================================================

/**
 * 當試算表檔案被開啟時，自動執行此函式來建立自訂選單
 */
function onOpen() {
  SpreadsheetApp.getUi()
      .createMenu('財產管理系統')
      .addItem('🔗 開啟系統入口網站', 'openPortal')
      .addSeparator()
      .addItem('➤ 電腦狀態回報', 'openReportPage')
      .addItem('➤ 申請財產轉移', 'openApplyPage')
      .addItem('➤ 審核待轉移財產', 'openReviewDashboard')
      .addSeparator()
      .addItem('➤ 申請財產出借', 'showLendingDialog')
      .addItem('➤ 歸還作業管理', 'showReturnDialog')
      .addSeparator()
      .addItem('➤ 申請財產報廢', 'showScrapDialog') // ✨ **新增**
      .addSeparator()
      .addItem('➤ 更新已轉移財產', 'openUpdatePage')
      .addToUi();
}
/**
 * 處理「開啟系統入口網站」：在新分頁中打開 Web App 主頁
 */
function openPortal() {
  const url = getAppUrl();
  const html = `
    <html>
      <body>
        <p>系統入口網站將在新分頁開啟...</p>
        <a href="${url}" target="_blank" rel="noopener noreferrer">如果沒有自動開啟，請點擊此處</a>
        <script>
          window.open("${url}");
          setTimeout(function(){ google.script.host.close(); }, 12000);
        </script>
      </body>
    </html>`;
  const htmlOutput = HtmlService.createHtmlOutput(html).setWidth(350).setHeight(150);
  SpreadsheetApp.getUi().showModalDialog(htmlOutput, '開啟系統入口網站');
}

/**
 * 處理「電腦狀態回報」：在試算表中顯示對話方塊
 */
function openReportPage() {
    // 注意：電腦回報頁面 (Index.html) 也使用了樣板語法，所以需要 .evaluate()
    const html = HtmlService.createTemplateFromFile('Index').evaluate()
        .setWidth(600)
        .setHeight(700); // 您可以根據需求調整對話方塊大小
    SpreadsheetApp.getUi().showModalDialog(html, '電腦狀態回報');
}

/**
 * 處理「申請財產轉移」：在試算表中顯示對話方塊
 */
function openApplyPage() {
  const html = HtmlService.createHtmlOutputFromFile('apply')
      .setWidth(600)
      .setHeight(500);
  SpreadsheetApp.getUi().showModalDialog(html, '申請財產轉移');
}

/**
 * 處理「更新已轉移財產」選單點擊 (增加權限檢查)
 */
// --- openUpdatePage 更新版 ---
function openUpdatePage() {
  const currentUserEmail = Session.getActiveUser().getEmail().toLowerCase();
  const adminEmails = getAdminEmails().map(email => email.toLowerCase());

  if (!adminEmails.includes(currentUserEmail)) {
    SpreadsheetApp.getUi().alert('權限不足', '只有指定的資產管理員才能存取此功能。', SpreadsheetApp.getUi().ButtonSet.OK);
    return;
  }
  const html = HtmlService.createHtmlOutputFromFile('update').setWidth(800).setHeight(600);
  SpreadsheetApp.getUi().showModalDialog(html, '更新已轉移財產的上傳狀態');
}

/**
 * 處理「審核待轉移財產」選單點擊 (智慧型)
 * 先檢查是否有待辦事項，再決定是否開啟介面
 */
function openReviewDashboard() {
  // 呼叫我們之前建立的 countPendingApprovals() 函式來計算待辦數量
  const pendingCount = countPendingApprovals();

  // 如果有待辦事項，則開啟審核儀表板
  if (pendingCount > 0) {
    const html = HtmlService.createHtmlOutputFromFile('review')
        .setWidth(900)
        .setHeight(600);
    SpreadsheetApp.getUi().showModalDialog(html, `接收待轉移財產 (${pendingCount} 筆待辦)`);
  } 
  // 如果沒有待辦事項，則彈出提示
  else {
    SpreadsheetApp.getUi().alert('無待辦事項', '恭喜！目前沒有任何待您簽核的財產轉移申請。', SpreadsheetApp.getUi().ButtonSet.OK);
  }
}


// =================================================================
// --- Web App 核心功能 (使用者介面相關) ---
// =================================================================

/**
 * 當使用者打開網頁應用程式的網址時執行
 */
//function doGet() {
//  const html = HtmlService.createTemplateFromFile('Index').evaluate();
//  html.setTitle("電腦狀態回報表單");
//  return html;
//
//}
function doGet(e) {
  const page = e.parameter.page;
  let template;
  let title;

  switch (page) {
    case 'report':
      template = HtmlService.createTemplateFromFile('Index');
      title = "電腦狀態回報";
      break;
    case 'apply':
      template = HtmlService.createTemplateFromFile('apply');
      title = "財產轉移申請";
      break;
    case 'update':
      template = HtmlService.createTemplateFromFile('update');
      title = "更新上傳狀態";
      break;
    case 'review':
      template = HtmlService.createTemplateFromFile('review');
      title = "財產轉移接收";
      break;
    // ✨ **新增的路由** ✨
    case 'lending':
      template = HtmlService.createTemplateFromFile('lending');
      title = "申請財產出借";
      break;
    case 'return':
      template = HtmlService.createTemplateFromFile('return');
      title = "歸還作業管理";
      break;
    // ✨ **新增的路由** ✨
    case 'scrap':
      template = HtmlService.createTemplateFromFile('scrap');
      title = "申請財產報廢";
      break;
    // ✨ 新增 case 'printScrap'
    case 'printScrap':
      template = HtmlService.createTemplateFromFile('printScrap');
      title = "列印報廢申請單";
      break;
    // ✨ 新增 case 'printTransfer'
    case 'printTransfer':
      template = HtmlService.createTemplateFromFile('printTransfer');
      title = "列印轉移記錄";
      break;
    case 'userstate':
      template = HtmlService.createTemplateFromFile('userstate');
      title = "個人財產狀態查詢";
      break;
    default:
      // 預設顯示入口網站
      template = HtmlService.createTemplateFromFile('main');
      title = "財產管理系統入口";
      break;
  }

  const html = template.evaluate();
  html.setTitle(title);
  html.addMetaTag('viewport', 'width=device-width, initial-scale=1.0');
  return html;
}
function getUserStateData() {
  const currentUserEmail = Session.getActiveUser().getEmail();
  const isAdmin = checkAdminPermissions();

  let filteredData;

  if (isAdmin) {
    filteredData = getAllAssets();
  } else {
    filteredData = getAssetsForCurrentUser();
  }

  const results = filteredData.map(asset => ({
    assetId: asset.assetId,
    assetName: asset.assetName,
    leader: asset.leaderName,
    leaderEmail: asset.leaderEmail, // ✨ Add leaderEmail
    location: asset.location,
    status: asset.assetStatus,
    category: asset.assetCategory,
    userName: asset.userName || '無' // 使用者名稱，物品總表顯示「無」
  }));

  return {
    isAdmin: isAdmin,
    userEmail: currentUserEmail, // ✨ Add userEmail
    assets: results
  };
}

function getAppUrl() {
  return ScriptApp.getService().getUrl();
}

/**
 * [供 Index.html 呼叫] 獲取駐站與電腦的二級下拉選單資料 (修正並清理版)
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
// --- 財產轉移申請與審核功能 (後端) ---
// (請將此區塊完整替換)
// =================================================================

/**
 * [供 apply.html 呼叫] 獲取申請頁面所需的所有初始資料
 * (此函式與前一版相同，為求完整一併提供)
 */
function getTransferData() {
  const currentUserEmail = Session.getActiveUser().getEmail();
  const allAssets = getAllAssets(); // Keep this to get all users/keepers for dropdowns
  const allMyAssets = getAssetsForCurrentUser();

  // 1. 從所有資產中，篩選出屬於當前使用者的、可轉移的資產
  const myAssets = allMyAssets
    .filter(asset => asset.assetStatus === '在庫')
    .map(asset => ({
      id: asset.assetId,
      assetName: asset.assetName,
      location: asset.location,
      category: asset.assetCategory,
      userName: asset.userName || '無', // 使用者名稱，物品總表顯示「無」
      leaderName: asset.leaderName, // 保管人姓名
      sourceSheet: asset.sourceSheet // 標記資料來源
    }));

  // 2. 從「保管人/信箱」工作表讀取保管人和使用人列表（改用固定列表）
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const keeperEmailSheet = ss.getSheetByName(KEEPER_EMAIL_MAP_SHEET_NAME);

  // 讀取保管人資料（A欄：姓名，B欄：Email，C欄：是否為駐管，D欄：資訊組保管人，E欄：資訊組使用人，F欄：收案組保管＆使用人）
  // 假設第1行是標題，從第2行開始讀取
  const keeperData = keeperEmailSheet.getRange(2, 1, keeperEmailSheet.getLastRow() - 1, 6).getValues();
  const uniqueKeepersMap = new Map();
  const custodianMap = new Map(); // ✨ 駐管專用 Map
  const infoCustodianMap = new Map(); // ✨ 新增：資訊組保管人 Map
  const infoUserMap = new Map(); // ✨ 新增：資訊組使用人 Map
  const intakeCustodianMap = new Map(); // ✨ 新增：收案組保管＆使用人 Map

  keeperData.forEach(row => {
    const name = row[0];  // A欄：姓名
    const email = row[1]; // B欄：Email
    const isCustodian = row[2]; // C欄：是否為駐管
    const isInfoCustodian = row[3]; // D欄：資訊組駐站資產保管人
    const isInfoUser = row[4]; // E欄：資訊組駐站資產使用人
    const isIntakeCustodian = row[5]; // F欄：駐站轉中心收案組保管＆使用人

    if (name && email) {
      uniqueKeepersMap.set(email, name);

      // ✨ 如果 C 欄為「是」，加入駐管列表
      if (isCustodian === '是') {
        custodianMap.set(email, name);
      }

      // ✨ 如果 D 欄為「是」，加入資訊組保管人列表
      if (isInfoCustodian === '是') {
        infoCustodianMap.set(email, name);
      }

      // ✨ 如果 E 欄為「是」，加入資訊組使用人列表
      if (isInfoUser === '是') {
        infoUserMap.set(email, name);
      }

      // ✨ 如果 F 欄為「是」，加入收案組保管＆使用人列表
      if (isIntakeCustodian === '是') {
        intakeCustodianMap.set(email, name);
      }
    }
  });

  // 從「存置地點列表」工作表讀取地點清單（A欄：地點名稱，B欄：是否為駐站，C欄：駐站轉資訊組，D欄：駐站轉中心收案，E欄：資訊組電腦專用）
  const locationSheet = ss.getSheetByName(KEEPER_LOCATION_MAP_SHEET_NAME);
  const locationData = locationSheet.getRange(2, 1, locationSheet.getLastRow() - 1, 5).getValues();
  const locationList = locationData.map(row => row[0]).filter(loc => loc); // 過濾空值

  // ✨ 篩選出駐站地點
  const stationLocationList = locationData
    .filter(row => row[1] === '是') // B欄為「是」
    .map(row => row[0])
    .filter(loc => loc);

  // ✨ 新增：篩選出資訊組地點
  const infoLocationList = locationData
    .filter(row => row[2] === '是') // C欄為「是」
    .map(row => row[0])
    .filter(loc => loc);

  // ✨ 新增：篩選出收案組地點
  const intakeLocationList = locationData
    .filter(row => row[3] === '是') // D欄為「是」
    .map(row => row[0])
    .filter(loc => loc);

  // ✨ 新增：篩選出資訊組電腦專用地點
  const infoComputerLocationList = locationData
    .filter(row => row[4] === '是') // E欄為「是」
    .map(row => row[0])
    .filter(loc => loc);

  // 3. 將 Map 轉換為前端需要的格式
  const keepers = {};
  uniqueKeepersMap.forEach((name, email) => {
    keepers[email] = name;
  });

  // ✨ 將駐管 Map 轉換為物件
  const custodians = {};
  custodianMap.forEach((name, email) => {
    custodians[email] = name;
  });

  // ✨ 使用人列表與保管人列表相同（從同一工作表讀取）
  const users = keepers;

  // 地點清單已從「存置地點列表」工作表讀取，無需排序（假設工作表已排序）
  const locations = locationList;

  // 4. 回傳整合後的資料
  return {
    userEmail: currentUserEmail,
    assets: myAssets,
    keepers: keepers,
    users: users,
    locations: locations,
    custodians: custodians,           // ✨ 駐管列表
    stationLocations: stationLocationList, // ✨ 駐站地點列表
    // ✨ 資訊組相關資料
    infoCustodian: infoCustodianMap.size > 0 ? Object.fromEntries(infoCustodianMap) : null,
    infoUser: infoUserMap.size > 0 ? Object.fromEntries(infoUserMap) : null,
    infoLocation: infoLocationList.length > 0 ? infoLocationList[0] : null,
    infoComputerLocation: infoComputerLocationList.length > 0 ? infoComputerLocationList[0] : null, // ✨ 新增：電腦專用地點
    // ✨ 收案組相關資料
    intakeCustodian: intakeCustodianMap.size > 0 ? Object.fromEntries(intakeCustodianMap) : null,
    intakeLocation: intakeLocationList.length > 0 ? intakeLocationList[0] : null
  };
}

/**
 * [供 apply.html 呼叫] 處理前端提交的「批次」財產轉移申請 (高效能且安全版)
 * 使用批次讀取 + 分欄批次寫入，在保護公式的同時實現高效能。
 */
function processBatchTransferApplication(formData) {
  try {
    const {
      assetIds,
      newKeeperEmail,
      newLocation,
      newUserName,
      newUserEmail,
      isStationTransfer,  // ✨ 是否為駐站轉移
      custodianEmail,     // ✨ 駐管 Email
      stationLocation,    // ✨ 駐站地點
      // ✨ 新增：資訊組模式
      isInfoTransfer,     // 是否為「駐站回送中心資訊組」
      infoCustodianEmail, // 資訊組保管人 Email
      infoUserEmail,      // 資訊組使用人 Email
      infoLocation,       // 資訊組地點
      infoComputerLocation, // ✨ 新增：資訊組電腦專用地點
      // ✨ 新增：收案組模式
      isIntakeTransfer,   // 是否為「駐站回送中心收案組」
      intakeCustodianEmail, // 收案組保管人 Email（同時也是使用人）
      intakeLocation      // 收案組地點
    } = formData;
    
    // ✨ 改進：支援選擇性參數（可以只變更其中一項）
    if (!assetIds || assetIds.length === 0) {
        throw new Error("請至少勾選一筆財產。");
    }

    // ✨ 新增：駐站轉移模式的參數處理
    let actualNewKeeperEmail = newKeeperEmail;
    let actualNewUserEmail = newUserEmail;
    let actualNewLocation = newLocation;
    let actualTransferType = '';

    if (isStationTransfer) {
      // 駐站轉移：保管人和使用人都設為駐管
      actualNewKeeperEmail = custodianEmail;
      actualNewUserEmail = custodianEmail;
      actualNewLocation = stationLocation;
      actualTransferType = '駐站轉移'; // 特殊標記

      // 驗證必要參數
      if (!custodianEmail || !stationLocation) {
        throw new Error("駐站轉移需要選擇駐管和駐站地點。");
      }
    } else if (isInfoTransfer) {
      // ✨ 資訊組模式：保管人和使用人分別指定
      actualNewKeeperEmail = infoCustodianEmail;
      actualNewUserEmail = infoUserEmail;
      // ✨ 注意：地點將在處理每個資產時動態決定（根據是否為電腦）
      actualNewLocation = infoLocation; // 預設使用一般地點
      actualTransferType = '駐站回送資訊組';

      // ✨ 修改：驗證必要參數（包含電腦專用地點）
      if (!infoCustodianEmail || !infoUserEmail || !infoLocation || !infoComputerLocation) {
        throw new Error("資訊組轉移需要完整的保管人、使用人、一般地點和電腦地點資料。");
      }
    } else if (isIntakeTransfer) {
      // ✨ 收案組模式：保管人和使用人為同一人
      actualNewKeeperEmail = intakeCustodianEmail;
      actualNewUserEmail = intakeCustodianEmail; // 同一人
      actualNewLocation = intakeLocation;
      actualTransferType = '駐站回送收案組';

      // 驗證必要參數
      if (!intakeCustodianEmail || !intakeLocation) {
        throw new Error("收案組轉移需要完整的保管人和地點資料。");
      }
    } else {
      // 一般轉移模式驗證
      if (!newKeeperEmail && !newLocation && !newUserName && !newUserEmail) {
        throw new Error("請至少選擇一項要變更的項目（保管人、地點或使用人）。");
      }
    }

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

    // ✨ 修復：優先從「保管人/信箱」表讀取 Email → 姓名映射
    const keeperEmailSheet = ss.getSheetByName(KEEPER_EMAIL_MAP_SHEET_NAME);
    const keeperData = keeperEmailSheet.getRange(2, 1, keeperEmailSheet.getLastRow() - 1, 2).getValues();
    const emailToNameMap = new Map();

    // 1️⃣ 先從「保管人/信箱」表建立映射（主要來源）
    keeperData.forEach(row => {
      const name = row[0]; // A欄：姓名
      const email = row[1]; // B欄：Email
      if (name && email) {
        emailToNameMap.set(email, name);
      }
    });

    // 2️⃣ 從資產列表補充不在「保管人/信箱」表中的保管人
    const allAssets = getAllAssets();
    allAssets.forEach(asset => {
      if (asset.leaderEmail && asset.leaderName && !emailToNameMap.has(asset.leaderEmail)) {
        emailToNameMap.set(asset.leaderEmail, asset.leaderName);
      }
    });

    // 3️⃣ 解析新保管人姓名（✨ 使用 actualNewKeeperEmail）
    const newKeeperName = actualNewKeeperEmail ? (emailToNameMap.get(actualNewKeeperEmail) || actualNewKeeperEmail.split('@')[0]) : null;

    // 4️⃣ 處理使用人Email（使用相同的映射表）
    const userEmailToNameMap = new Map(emailToNameMap); // 複製保管人映射作為基礎

    // 補充：從資產的使用人欄位中加入額外映射
    allAssets.forEach(asset => {
      if (asset.userEmail && asset.userName && !userEmailToNameMap.has(asset.userEmail)) {
        userEmailToNameMap.set(asset.userEmail, asset.userName);
      }
    });

    // ✨ 使用 actualNewUserEmail 解析使用人姓名
    const finalNewUserName = actualNewUserEmail ? (userEmailToNameMap.get(actualNewUserEmail) || newUserName || actualNewUserEmail.split('@')[0]) : newUserName;
    const appLogSheet = ss.getSheetByName(APPLICATION_LOG_SHEET_NAME);

    // ✨ 新增：讀取地點映射，用於判斷是否為駐站
    const locationSheet = ss.getSheetByName(KEEPER_LOCATION_MAP_SHEET_NAME);
    const locationData = locationSheet.getRange(2, 1, locationSheet.getLastRow() - 1, 4).getValues();
    const locationIsStationMap = new Map(locationData.map(row => [row[0], row[1]]));

    const now = new Date();
    const applicantEmail = Session.getActiveUser().getEmail(); // 申請操作人員 Email
    const newLogsToAdd = [];
    const createdApplications = [];

    assetIds.forEach(assetId => {
      const location = findAssetLocation(assetId);
      if (location) {
        const assetRow = location.sheet.getRange(location.rowIndex, 1, 1, location.sheet.getLastColumn()).getValues()[0];
        const indices = location.sheetName === PROPERTY_MASTER_SHEET_NAME ? PROPERTY_COLUMN_INDICES : ITEM_COLUMN_INDICES;
        const asset = mapRowToAssetObject(assetRow, indices, location.sheetName);

        if (asset.assetStatus === '在庫') {
          const indicesToUpdate = location.sheetName === PROPERTY_MASTER_SHEET_NAME ? PROPERTY_COLUMN_INDICES : ITEM_COLUMN_INDICES;
          
          // ✨ 改進：判斷轉移類型並決定需要審核的項目
          const oldUserName = asset.userName || '';
          const oldUserEmail = asset.userEmail || '';
          // ✨ 使用 actualXXX 變量替代原始參數
          const finalNewKeeperEmail = actualNewKeeperEmail || asset.leaderEmail;
          const finalNewKeeperName = newKeeperName || asset.leaderName;

          // ✨ 新增：資訊組模式根據是否為電腦決定地點
          let finalNewLocation = actualNewLocation || asset.location;
          if (actualTransferType === '駐站回送資訊組') {
            // 檢查是否為財產總表且為電腦
            if (location.sheetName === PROPERTY_MASTER_SHEET_NAME) {
              const isComputer = assetRow[indicesToUpdate.IS_ACTUALLY_COMPUTER - 1] === '是';
              if (isComputer) {
                finalNewLocation = infoComputerLocation; // 使用電腦專用地點
              } else {
                finalNewLocation = infoLocation; // 使用一般地點
              }
            } else {
              // 物品總表沒有電腦欄位，直接使用一般地點
              finalNewLocation = infoLocation;
            }
          }

          const finalNewUserEmail = actualNewUserEmail || asset.userEmail || '';
          const actualNewUserName = finalNewUserName || asset.userName || '';

          // ✨ 使用 actualXXX 變量判斷是否有變更
          const isKeeperChange = actualNewKeeperEmail && asset.leaderEmail !== actualNewKeeperEmail;
          // ✨ 修改：使用 finalNewLocation 判斷地點變更（因為資訊組模式可能會根據是否為電腦使用不同地點）
          const isLocationChange = finalNewLocation && asset.location !== finalNewLocation;
          const isUserChange = (actualNewUserEmail && oldUserEmail !== actualNewUserEmail) || (newUserName && oldUserName !== newUserName);

          // ✨ 判斷轉移類型（優先使用駐站轉移標記）
          let transferType = '';
          if (actualTransferType === '駐站轉移') {
            transferType = '駐站轉移'; // 駐站轉移有最高優先級
          } else if (isKeeperChange && isUserChange) {
            transferType = '保管人+使用人';
          } else if (isKeeperChange) {
            transferType = '保管人';
          } else if (isUserChange) {
            transferType = '使用人';
          } else if (isLocationChange) {
            transferType = '地點';
          } else {
            // 沒有實際變更，跳過此資產
            return;
          }
          
          // 只有變更保管人或使用人時才需要設為「待接收」狀態
          const needsApproval = isKeeperChange || isUserChange;
          
          if (needsApproval) {
            location.sheet.getRange(location.rowIndex, indicesToUpdate.ASSET_STATUS).setValue("待接收");
            location.sheet.getRange(location.rowIndex, indicesToUpdate.APPLICATION_TIME).setValue(now);
            location.sheet.getRange(location.rowIndex, indicesToUpdate.IS_UPLOADED).setValue('');
            location.sheet.getRange(location.rowIndex, indicesToUpdate.UPLOAD_TIME).setValue('');
            location.sheet.getRange(location.rowIndex, indicesToUpdate.TRANSFER_TIME).setValue('');
          } else {
            // 僅變更地點，直接更新無需審核
            location.sheet.getRange(location.rowIndex, indicesToUpdate.LOCATION).setValue(finalNewLocation);
            location.sheet.getRange(location.rowIndex, indicesToUpdate.TRANSFER_TIME).setValue(now);

            // ✨ 新增：判斷是否為駐站 + 是否為電腦，更新 IS_COMPUTER 欄位
            const isStation = locationIsStationMap.get(finalNewLocation) === '是';
            const assetRow = location.sheet.getRange(location.rowIndex, 1, 1, location.sheet.getLastColumn()).getValues()[0];
            const isActuallyComputer = assetRow[indicesToUpdate.IS_ACTUALLY_COMPUTER - 1] === '是';
            const shouldBeMarked = isStation && isActuallyComputer;
            location.sheet.getRange(location.rowIndex, indicesToUpdate.IS_COMPUTER).setValue(shouldBeMarked ? '是' : '');

            // ✨ 新增：清空上傳狀態，觸發管理員更新
            location.sheet.getRange(location.rowIndex, indicesToUpdate.IS_UPLOADED).setValue('');
            location.sheet.getRange(location.rowIndex, indicesToUpdate.UPLOAD_TIME).setValue('');
          }

          const appId = `APP-${now.getTime()}-${createdApplications.length}`;
          
          const newLogRow = [
            appId, now, asset.assetId,
            asset.leaderName, asset.location,
            finalNewKeeperName, finalNewLocation,
            needsApproval ? "待接收" : "已完成", finalNewKeeperEmail,
            needsApproval ? "" : now, // REVIEW_TIME
            "", // REVIEW_LINK
            oldUserName, // AL_OLD_USER_COLUMN_INDEX (12)
            actualNewUserName, // AL_NEW_USER_COLUMN_INDEX (13)
            finalNewUserEmail, // AL_NEW_USER_EMAIL_COLUMN_INDEX (14)
            transferType, // AL_TRANSFER_TYPE_COLUMN_INDEX (15)
            "", // AL_APPROVER_EMAIL_COLUMN_INDEX (16) - 審核者 Email（審核時填入）
            applicantEmail // AL_APPLICANT_EMAIL_COLUMN_INDEX (17) - 申請操作人員 Email
          ];
          newLogsToAdd.push(newLogRow);
          createdApplications.push({ 
            id: asset.assetId, 
            transferType: transferType, 
            needsApproval: needsApproval,
            oldKeeperEmail: asset.leaderEmail,
            oldUserEmail: oldUserEmail,
            newKeeperEmail: finalNewKeeperEmail,
            newUserEmail: finalNewUserEmail,
            assetName: asset.assetName
          });
        }
      }
    });

    if (createdApplications.length === 0) {
      throw new Error("處理失敗：所有勾選的財產都未進行任何變更。請確認：\n" +
                      "1. 資產狀態為「在庫」\n" +
                      "2. 保管人、地點或使用人有實際變更（不能選擇相同的值）\n" +
                      "3. 資產確實存在於系統中");
    }
    
    if (newLogsToAdd.length > 0) {
      appLogSheet.getRange(appLogSheet.getLastRow() + 1, 1, newLogsToAdd.length, newLogsToAdd[0].length)
                 .setValues(newLogsToAdd);
    }

    // ✨ 新增：檢查轉移的資產中是否有使用者與保管人不同的情況，需要發送額外通知
    const assetsWithDifferentUser = [];
    assetIds.forEach(assetId => {
      const location = findAssetLocation(assetId);
      if (location) {
        const assetRow = location.sheet.getRange(location.rowIndex, 1, 1, location.sheet.getLastColumn()).getValues()[0];
        const indices = location.sheetName === PROPERTY_MASTER_SHEET_NAME ? PROPERTY_COLUMN_INDICES : ITEM_COLUMN_INDICES;
        const asset = mapRowToAssetObject(assetRow, indices, location.sheetName);
        
        // 只有財產總表有使用者欄位，且使用者和保管人不同時才需要記錄
        if (asset.sourceSheet === PROPERTY_MASTER_SHEET_NAME && 
            asset.userName && 
            asset.userName.trim() !== '' && 
            asset.userName !== asset.leaderName) {
          assetsWithDifferentUser.push({
            assetId: asset.assetId,
            assetName: asset.assetName,
            userName: asset.userName,
            keeperName: asset.leaderName
          });
        }
      }
    });

    // ✨ 改進：統計需要審核和不需要審核的項目
    const needsApprovalApps = createdApplications.filter(app => app.needsApproval);
    const autoCompletedApps = createdApplications.filter(app => !app.needsApproval);
    
    // 根據轉移類型產生摘要
    const transferTypeSummary = {};
    createdApplications.forEach(app => {
      const type = app.transferType || '地點';
      transferTypeSummary[type] = (transferTypeSummary[type] || 0) + 1;
    });
    
    let typeDescription = '';
    Object.keys(transferTypeSummary).forEach(type => {
      if (typeDescription) typeDescription += '、';
      typeDescription += `${type}(${transferTypeSummary[type]}筆)`;
    });
    
    let resultMessage = '';
    const webAppUrl = getAppUrl();
    const reviewLink = `${webAppUrl}?page=review`;
    const currentUserEmail = Session.getActiveUser().getEmail();
    
    // ✨ 改進：根據不同情況發送不同的通知
    // 情況1：只變更使用人（change-user 勾選，其他未勾）
    if (actualNewUserEmail && !actualNewKeeperEmail && !actualNewLocation) {
      // 通知新使用人
      if (actualNewUserEmail) {
        const subject = `[財產轉移通知] 您有 ${needsApprovalApps.length} 筆待接收的財產（使用人變更）`;
        let body = `您好 ${finalNewUserName}，\n\n${currentUserEmail} 已申請將您設為 ${needsApprovalApps.length} 筆財產的使用人。\n\n`;
        body += `財產清單：\n`;
        needsApprovalApps.forEach(app => {
          body += `  - ${app.id}: ${app.assetName}\n`;
        });
        body += `\n請點擊下方連結，前往您的審核儀表板進行批次簽核：\n`;
        body += `${reviewLink}\n\n此為系統自動發送郵件。`;
        MailApp.sendEmail(actualNewUserEmail, subject, body);
      }
      
      // 通知原保管人
      const oldKeepers = new Set(needsApprovalApps.map(app => app.oldKeeperEmail).filter(e => e));
      oldKeepers.forEach(keeperEmail => {
        const keeperAssets = needsApprovalApps.filter(app => app.oldKeeperEmail === keeperEmail);
        const subject = `[財產通知] 您保管的 ${keeperAssets.length} 筆財產的使用人已變更`;
        let body = `您好，\n\n您保管的以下財產的使用人已變更：\n\n`;
        keeperAssets.forEach(app => {
          body += `  - ${app.id}: ${app.assetName} → 新使用人: ${finalNewUserName}\n`;
        });
        body += `\n此為系統自動發送郵件。`;
        MailApp.sendEmail(keeperEmail, subject, body);
      });
      
      resultMessage = `成功提交 ${needsApprovalApps.length} 筆使用人變更申請！已通知新使用人和原保管人。`;
    }
    // 情況2：只變更保管人（change-keeper 勾選，其他未勾）
    else if (actualNewKeeperEmail && !actualNewUserEmail && !actualNewLocation) {
      // 通知新保管人
      const subject = `[財產轉移通知] 您有 ${needsApprovalApps.length} 筆待接收的財產（保管人變更）`;
      let body = `您好 ${newKeeperName}，\n\n${currentUserEmail} 已申請將 ${needsApprovalApps.length} 筆財產轉移給您保管。\n\n`;
      body += `財產清單：\n`;
      needsApprovalApps.forEach(app => {
        body += `  - ${app.id}: ${app.assetName}\n`;
      });
      body += `\n請點擊下方連結，前往您的審核儀表板進行批次簽核：\n`;
      body += `${reviewLink}\n\n此為系統自動發送郵件。`;
      MailApp.sendEmail(actualNewKeeperEmail, subject, body);
      
      // 通知原使用人
      const oldUsers = new Set(needsApprovalApps.map(app => app.oldUserEmail).filter(e => e));
      oldUsers.forEach(userEmail => {
        const userAssets = needsApprovalApps.filter(app => app.oldUserEmail === userEmail);
        const subject = `[財產通知] 您使用的 ${userAssets.length} 筆財產的保管人已變更`;
        let body = `您好，\n\n您使用的以下財產的保管人已變更：\n\n`;
        userAssets.forEach(app => {
          body += `  - ${app.id}: ${app.assetName} → 新保管人: ${newKeeperName}\n`;
        });
        body += `\n此為系統自動發送郵件。`;
        MailApp.sendEmail(userEmail, subject, body);
      });
      
      resultMessage = `成功提交 ${needsApprovalApps.length} 筆保管人變更申請！已通知新保管人和原使用人。`;
    }
    // 情況3：只變更地點（change-location 勾選，其他未勾）
    else if (actualNewLocation && !actualNewKeeperEmail && !actualNewUserEmail) {
      // 通知管理員
      const adminEmails = getAdminEmails();
      if (isAdminEmailEnabled() && adminEmails && adminEmails.length > 0) {
        const webAppUrl = getAppUrl();
        const printTransferLink = `${webAppUrl}?page=printTransfer`; // ✨ 新增：更新頁面連結
        const subject = `[財產通知] ${autoCompletedApps.length} 筆財產地點已變更`;
        let body = `您好，\n\n${currentUserEmail} 已變更以下財產的地點：\n\n`;
        autoCompletedApps.forEach(app => {
          body += `  - ${app.id}: ${app.assetName} → 新地點: ${actualNewLocation}\n`;
        });
        body += `請點擊下方連結，前往更新頁面進行操作：\n`;
        body += `${printTransferLink}\n\n`; // ✨ 新增：直接連結
        body += `\n此為系統自動發送郵件。`;
        MailApp.sendEmail(adminEmails.join(','), subject, body);
      }
      resultMessage = `${autoCompletedApps.length} 筆財產地點已變更！請列印轉移申請單。`;
    }
    // 情況4：組合變更（其他情況）
    else if (needsApprovalApps.length > 0) {
      const notifiedEmails = new Set(); // 追蹤已發送郵件的對象，避免重複發送

      // ✅ 1. 通知新保管人（方案D：審核者之一）
      if (actualNewKeeperEmail) {
        const subject = `[財產轉移通知] 您有 ${needsApprovalApps.length} 筆待接收的財產（需審核）`;
        let body = `您好 ${newKeeperName}，\n\n${currentUserEmail} 已申請將 ${needsApprovalApps.length} 筆財產轉移給您保管。\n\n`;
        body += `轉移類型：${typeDescription}\n\n`;
        body += `財產清單：\n`;
        needsApprovalApps.forEach(app => {
          body += `  - ${app.id}: ${app.assetName}\n`;
        });
        if (actualNewUserEmail) {
          body += `\n新使用人：${finalNewUserName}\n`;
        }
        body += `\n請點擊下方連結，前往您的審核儀表板進行批次簽核：\n`;
        body += `${reviewLink}\n`;
        body += `\n⚠️ 提醒：此申請需要您或新使用人審核，任一方審核即可完成轉移。\n`;
        body += `\n此為系統自動發送郵件。`;
        MailApp.sendEmail(actualNewKeeperEmail, subject, body);
        notifiedEmails.add(actualNewKeeperEmail.toLowerCase());
      }

      // ✅ 2. 通知新使用人（方案D：改為審核通知）
      if (actualNewUserEmail && !notifiedEmails.has(actualNewUserEmail.toLowerCase())) {
        const subject = `[財產轉移通知] 您有 ${needsApprovalApps.length} 筆待接收的財產（需審核）`;
        let body = `您好 ${finalNewUserName}，\n\n${currentUserEmail} 已申請將 ${needsApprovalApps.length} 筆財產轉移給您使用。\n\n`;
        body += `轉移類型：${typeDescription}\n\n`;
        body += `財產清單：\n`;
        needsApprovalApps.forEach(app => {
          body += `  - ${app.id}: ${app.assetName}\n`;
        });
        if (actualNewKeeperEmail) {
          body += `\n新保管人：${newKeeperName}\n`;
        }
        body += `\n請點擊下方連結，前往您的審核儀表板進行批次簽核：\n`;
        body += `${reviewLink}\n`;
        body += `\n⚠️ 提醒：此申請需要您或新保管人審核，任一方審核即可完成轉移。\n`;
        body += `\n此為系統自動發送郵件。`;
        MailApp.sendEmail(actualNewUserEmail, subject, body);
        notifiedEmails.add(actualNewUserEmail.toLowerCase());
      }

      // ✅ 3. 通知原保管人（如果保管人有變更且不是申請人本人）
      if (actualNewKeeperEmail) {
        const oldKeepers = new Set(
          needsApprovalApps
            .map(app => app.oldKeeperEmail)
            .filter(e => e && !notifiedEmails.has(e.toLowerCase()) && e.toLowerCase() !== currentUserEmail.toLowerCase())
        );
        oldKeepers.forEach(oldKeeperEmail => {
          const keeperAssets = needsApprovalApps.filter(app => app.oldKeeperEmail === oldKeeperEmail);
          const oldKeeperName = emailToNameMap.get(oldKeeperEmail) || oldKeeperEmail.split('@')[0];

          const subject = `[財產通知] 您保管的 ${keeperAssets.length} 筆財產已申請轉出`;
          let body = `您好 ${oldKeeperName}，\n\n${currentUserEmail} 已申請將您保管的以下財產轉移給新保管人。\n\n`;
          body += `財產清單：\n`;
          keeperAssets.forEach(app => {
            body += `  - ${app.id}: ${app.assetName}\n`;
          });
          body += `\n新保管人：${newKeeperName}\n`;
          if (actualNewUserEmail) {
            body += `新使用人：${finalNewUserName}\n`;
          }
          body += `\n此申請正在等待新保管人或新使用人審核中（任一方審核即可完成）。\n`;
          body += `\n此為系統自動發送郵件。`;
          MailApp.sendEmail(oldKeeperEmail, subject, body);
          notifiedEmails.add(oldKeeperEmail.toLowerCase());
        });
      }

      // ✅ 4. 通知原使用人（如果使用人有變更且不是申請人本人，且與原保管人不同）
      if (actualNewUserEmail) {
        const oldUsers = new Set(
          needsApprovalApps
            .map(app => app.oldUserEmail)
            .filter(e => e && !notifiedEmails.has(e.toLowerCase()) && e.toLowerCase() !== currentUserEmail.toLowerCase())
        );
        oldUsers.forEach(oldUserEmail => {
          const userAssets = needsApprovalApps.filter(app => app.oldUserEmail === oldUserEmail);
          const oldUserName = userEmailToNameMap.get(oldUserEmail) || oldUserEmail.split('@')[0];

          const subject = `[財產通知] 您使用的 ${userAssets.length} 筆財產的使用人已變更`;
          let body = `您好 ${oldUserName}，\n\n${currentUserEmail} 已申請變更以下財產的使用人。\n\n`;
          body += `財產清單：\n`;
          userAssets.forEach(app => {
            body += `  - ${app.id}: ${app.assetName}\n`;
          });
          body += `\n新使用人：${finalNewUserName}\n`;
          if (actualNewKeeperEmail) {
            body += `新保管人：${newKeeperName}\n`;
          }
          body += `\n此申請正在等待新保管人或新使用人審核中（任一方審核即可完成）。\n`;
          body += `\n此為系統自動發送郵件。`;
          MailApp.sendEmail(oldUserEmail, subject, body);
          notifiedEmails.add(oldUserEmail.toLowerCase());
        });
      }

      // ✅ 5. 組合結果訊息（方案D）
      let notificationSummary = [];
      if (actualNewKeeperEmail) notificationSummary.push('新保管人（需審核）');
      if (actualNewUserEmail) notificationSummary.push('新使用人（需審核）');

      resultMessage = `成功提交 ${needsApprovalApps.length} 筆需要審核的申請！已通知：${notificationSummary.join('、')}。任一方審核即可完成轉移。`;
    }
    
    if (autoCompletedApps.length > 0 && !resultMessage) {
      resultMessage = `${autoCompletedApps.length} 筆財產已直接完成（無需審核）！`;
    }

    return resultMessage || `成功處理 ${createdApplications.length} 筆財產！`;

  } catch (e) {
    Logger.log("高效能批次申請失敗: " + e.message + " at " + e.stack);
    return "申請失敗：" + e.message;
  }
}


/**
 * ✨ **全新函式**
 * [供 review.html 呼叫] 獲取當前使用者所有待審核的申請
 */
/**
 * [供 review.html 呼叫] 獲取當前使用者所有待審核的申請 (附有詳細日誌的偵錯版)
 */
function getPendingApprovals() {
  Logger.log("--- getPendingApprovals 函式開始執行 (v3) ---");
  const startTime = new Date();

  try {
    const currentUserEmail = Session.getActiveUser().getEmail();
    const appLogSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(APPLICATION_LOG_SHEET_NAME);
    
    const allAssets = getAllAssets();
    const assetIdToInfoMap = new Map(allAssets.map(asset => [
      asset.assetId, 
      { 
        assetName: asset.assetName, 
        userName: asset.userName || '無' 
      }
    ]));
    
    const range = appLogSheet.getRange(2, 1, appLogSheet.getLastRow() - 1, appLogSheet.getLastColumn());
    const values = range.getValues();

    const pendingApprovals = values
      .filter(row => {
        const newLeaderEmail = row[AL_NEW_LEADER_EMAIL_COLUMN_INDEX - 1];
        const newUserEmail = row[AL_NEW_USER_EMAIL_COLUMN_INDEX - 1];
        const status = row[AL_STATUS_COLUMN_INDEX - 1];
        const transferType = row.length > AL_TRANSFER_TYPE_COLUMN_INDEX - 1
          ? row[AL_TRANSFER_TYPE_COLUMN_INDEX - 1]
          : '地點';

        // ✨ 方案D：如果是「保管人+使用人」變更，兩者都可以審核
        if (transferType === '保管人+使用人') {
          return (newLeaderEmail === currentUserEmail || newUserEmail === currentUserEmail)
                 && status === "待接收";
        }

        // 其他情況：只有新保管人可以審核
        return newLeaderEmail === currentUserEmail && status === "待接收";
      })
      .map(row => {
        const assetId = row[AL_ASSET_ID_COLUMN_INDEX - 1];
        const assetInfo = assetIdToInfoMap.get(assetId) || { assetName: '（找不到名稱）', userName: '無' };

        // ✨ 讀取轉移類型資訊（如果有的話）
        const transferType = row.length > AL_TRANSFER_TYPE_COLUMN_INDEX - 1
          ? row[AL_TRANSFER_TYPE_COLUMN_INDEX - 1]
          : '地點';

        // ✨ 讀取新使用人資訊（方案D需要）
        const newUser = row.length > AL_NEW_USER_COLUMN_INDEX - 1
          ? row[AL_NEW_USER_COLUMN_INDEX - 1]
          : '';
        const oldUser = row.length > AL_OLD_USER_COLUMN_INDEX - 1
          ? row[AL_OLD_USER_COLUMN_INDEX - 1]
          : '';

        return {
          appId: row[AL_APP_ID_COLUMN_INDEX - 1],
          applyTime: new Date(row[AL_APP_TIME_COLUMN_INDEX - 1]).toLocaleString('zh-TW'),
          assetId: assetId,
          assetName: assetInfo.assetName,
          userName: assetInfo.userName,
          oldKeeper: row[AL_OLD_LEADER_COLUMN_INDEX - 1],
          oldLocation: row[AL_OLD_LOCATION_COLUMN_INDEX - 1],
          newLocation: row[AL_NEW_LOCATION_COLUMN_INDEX - 1],
          newKeeper: row[AL_NEW_LEADER_COLUMN_INDEX - 1], // ✨ 新增：新保管人姓名
          oldUser: oldUser, // ✨ 新增：原使用人
          newUser: newUser, // ✨ 新增：新使用人
          transferType: transferType // ✨ 新增：轉移類型
        };
      });
    
    Logger.log(`--- getPendingApprovals 函式執行完畢，找到 ${pendingApprovals.length} 筆待審核項目。---`);
    
    return { approvals: pendingApprovals };
  } catch(e) {
    Logger.log(`!!!!!! getPendingApprovals 發生嚴重錯誤: ${e.message} at ${e.stack}`);
    return { error: "讀取待審核清單時發生錯誤: " + e.message };
  }
}
/**
 * [供 review.html 呼叫] 處理前端提交的「批次」審核 (終極偵錯版)
 * 這個版本包含了極其詳細的日誌，用於找出為何處理會失敗或跳過。
 */
function processBatchApproval(appIds) {
  Logger.log("\n\n--- processBatchApproval (v3) 開始執行 ---");
  if (!appIds || appIds.length === 0) {
    return "您沒有選擇任何項目。"; 
  }

  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const appLogSheet = ss.getSheetByName(APPLICATION_LOG_SHEET_NAME);
    const locationSheet = ss.getSheetByName(KEEPER_LOCATION_MAP_SHEET_NAME);
    const locationData = locationSheet.getRange(2, 1, locationSheet.getLastRow() - 1, 4).getValues();
    const locationIsStationMap = new Map(locationData.map(row => [row[0], row[1]]));
    
    const appLogData = appLogSheet.getRange(2, 1, appLogSheet.getLastRow(), appLogSheet.getLastColumn()).getValues();
    const appLogMap = new Map(appLogData.map((row, index) => [row[AL_APP_ID_COLUMN_INDEX - 1], { row, index: index + 2 }]));

    const now = new Date();
    let successCount = 0;
    const errors = [];

    appIds.forEach(appId => {
      const appDetails = appLogMap.get(appId);
      if (appDetails && appDetails.row[AL_STATUS_COLUMN_INDEX - 1] === "待接收") {
        const assetId = appDetails.row[AL_ASSET_ID_COLUMN_INDEX - 1].toString();
        const location = findAssetLocation(assetId);

        if (location) {
          const appRowIndex = appDetails.index;
          const currentUserEmail = Session.getActiveUser().getEmail();

          appLogSheet.getRange(appRowIndex, AL_STATUS_COLUMN_INDEX).setValue("已完成");
          appLogSheet.getRange(appRowIndex, AL_REVIEW_TIME_COLUMN_INDEX).setValue(now);
          appLogSheet.getRange(appRowIndex, AL_APPROVER_EMAIL_COLUMN_INDEX).setValue(currentUserEmail); // ✨ 方案D：記錄實際審核者
          
          const newLocation = appDetails.row[AL_NEW_LOCATION_COLUMN_INDEX - 1];
          const indices = location.sheetName === PROPERTY_MASTER_SHEET_NAME ? PROPERTY_COLUMN_INDICES : ITEM_COLUMN_INDICES;
          
          location.sheet.getRange(location.rowIndex, indices.LOCATION).setValue(newLocation);
          location.sheet.getRange(location.rowIndex, indices.ASSET_STATUS).setValue("在庫");
          location.sheet.getRange(location.rowIndex, indices.TRANSFER_TIME).setValue(now);

          // ✨ 新增：更新保管人姓名和Email
          const newKeeperEmail = appDetails.row[AL_NEW_LEADER_EMAIL_COLUMN_INDEX - 1];
          let newKeeperName = appDetails.row[AL_NEW_LEADER_COLUMN_INDEX - 1];

          // 如果姓名為空，從Email推算
          if (!newKeeperName || newKeeperName.toString().trim() === '') {
            newKeeperName = newKeeperEmail ? newKeeperEmail.split('@')[0] : '';
          }

          location.sheet.getRange(location.rowIndex, indices.LEADER_NAME).setValue(newKeeperName);
          location.sheet.getRange(location.rowIndex, indices.LEADER_EMAIL).setValue(newKeeperEmail);

          // ✨ 新增：同時更新使用人欄位（僅財產總表有此欄位）
          if (location.sheetName === PROPERTY_MASTER_SHEET_NAME) {
            // 讀取新使用人資訊（如果有在申請記錄中）
            const newUserName = appDetails.row.length > AL_NEW_USER_COLUMN_INDEX - 1 
              ? appDetails.row[AL_NEW_USER_COLUMN_INDEX - 1] 
              : '';
            const newUserEmail = appDetails.row.length > AL_NEW_USER_EMAIL_COLUMN_INDEX - 1 
              ? appDetails.row[AL_NEW_USER_EMAIL_COLUMN_INDEX - 1] 
              : '';
            
            // 如果有新使用人資訊，則更新；否則保持與保管人同步
            if (newUserName && newUserName.toString().trim() !== '') {
              location.sheet.getRange(location.rowIndex, indices.USER_NAME).setValue(newUserName);
            } else {
              // 預設使用人等於保管人
              location.sheet.getRange(location.rowIndex, indices.USER_NAME).setValue(newKeeperName);
            }
            
            // ✨ 新增：更新使用人Email
            if (newUserEmail && newUserEmail.toString().trim() !== '') {
              location.sheet.getRange(location.rowIndex, indices.USER_EMAIL).setValue(newUserEmail);
            } else {
              // 預設使用人Email等於保管人Email
              location.sheet.getRange(location.rowIndex, indices.USER_EMAIL).setValue(newKeeperEmail);
            }
          }

          const isStation = locationIsStationMap.get(newLocation) === '是';
          // IS_ACTUALLY_COMPUTER 欄位可能不存在於所有物件中，需要安全檢查
          const assetRow = location.sheet.getRange(location.rowIndex, 1, 1, location.sheet.getLastColumn()).getValues()[0];
          const isActuallyComputer = assetRow[indices.IS_ACTUALLY_COMPUTER - 1] === '是';
          const shouldBeMarked = isStation && isActuallyComputer;
          location.sheet.getRange(location.rowIndex, indices.IS_COMPUTER).setValue(shouldBeMarked ? '是' : '');

          // ✨ 方案D：如果是「保管人+使用人」申請，通知另一方審核者
          const transferType = appDetails.row.length > AL_TRANSFER_TYPE_COLUMN_INDEX - 1
            ? appDetails.row[AL_TRANSFER_TYPE_COLUMN_INDEX - 1]
            : '';

          if (transferType === '保管人+使用人') {
            const newKeeperEmail = appDetails.row[AL_NEW_LEADER_EMAIL_COLUMN_INDEX - 1];
            const newUserEmail = appDetails.row.length > AL_NEW_USER_EMAIL_COLUMN_INDEX - 1
              ? appDetails.row[AL_NEW_USER_EMAIL_COLUMN_INDEX - 1]
              : '';
            const newUserName = appDetails.row.length > AL_NEW_USER_COLUMN_INDEX - 1
              ? appDetails.row[AL_NEW_USER_COLUMN_INDEX - 1]
              : '';
            let newKeeperName = appDetails.row[AL_NEW_LEADER_COLUMN_INDEX - 1];
            if (!newKeeperName || newKeeperName.toString().trim() === '') {
              newKeeperName = newKeeperEmail ? newKeeperEmail.split('@')[0] : '';
            }

            // 找出另一方審核者
            let otherReviewerEmail = '';
            let otherReviewerName = '';
            if (currentUserEmail.toLowerCase() === newKeeperEmail.toLowerCase()) {
              // 當前審核者是新保管人 → 通知新使用人
              otherReviewerEmail = newUserEmail;
              otherReviewerName = newUserName || newUserEmail.split('@')[0];
            } else if (newUserEmail && currentUserEmail.toLowerCase() === newUserEmail.toLowerCase()) {
              // 當前審核者是新使用人 → 通知新保管人
              otherReviewerEmail = newKeeperEmail;
              otherReviewerName = newKeeperName;
            }

            // 發送通知給另一方（前提：另一方不是自己）
            if (otherReviewerEmail
                && otherReviewerEmail.trim() !== ''
                && otherReviewerEmail.toLowerCase() !== currentUserEmail.toLowerCase()) {  // ✨ 新增：避免自己通知自己
              try {
                const currentUserName = getAllAssets()
                  .find(a => a.leaderEmail === currentUserEmail)?.leaderName || currentUserEmail.split('@')[0];

                const subject = `[財產通知] 您的待審核申請已由其他審核者完成`;
                let body = `您好 ${otherReviewerName}，\n\n`;
                body += `您收到的財產轉移審核申請（申請ID: ${appId}）已由 ${currentUserName} 完成審核。\n\n`;
                body += `資產編號：${assetId}\n`;
                body += `新保管人：${newKeeperName}\n`;
                body += `新使用人：${newUserName}\n`;
                body += `審核時間：${now.toLocaleString('zh-TW')}\n\n`;
                body += `此申請已完成，您無需再進行審核。\n\n`;
                body += `此為系統自動發送郵件。`;

                MailApp.sendEmail(otherReviewerEmail, subject, body);
                Logger.log(`✅ 已通知另一方審核者: ${otherReviewerEmail}`);
              } catch (emailError) {
                Logger.log(`⚠️ 發送通知給另一方審核者時發生錯誤: ${emailError.message}`);
                // 不中斷流程，繼續處理
              }
            }
          }

          // ✨ 新增：通知原始申請人
          try {
            const applicantEmail = appDetails.row[AL_APPLICANT_EMAIL_COLUMN_INDEX - 1];

            // 只有當申請人不是審核者本人時才發送通知（避免自己審核自己的申請收到多餘通知）
            if (applicantEmail && applicantEmail.toLowerCase() !== currentUserEmail.toLowerCase()) {
              const webAppUrl = getAppUrl();
              const printTransferLink = `${webAppUrl}?page=printTransfer`;

              // 嘗試取得申請人姓名
              const applicantName = getAllAssets()
                .find(a => a.leaderEmail && a.leaderEmail.toLowerCase() === applicantEmail.toLowerCase())?.leaderName
                || applicantEmail.split('@')[0];

              // 從申請紀錄取得新使用人姓名（用於郵件內容）
              const notifyNewUserName = appDetails.row.length > AL_NEW_USER_COLUMN_INDEX - 1
                ? appDetails.row[AL_NEW_USER_COLUMN_INDEX - 1]
                : '';

              const subject = `[財產轉移通知] 您的轉移申請已審核完成`;
              let body = `您好 ${applicantName}，\n\n`;
              body += `您提交的財產轉移申請（申請ID: ${appId}）已審核完成。\n\n`;
              body += `資產編號：${assetId}\n`;
              body += `新保管人：${newKeeperName}\n`;
              if (notifyNewUserName && notifyNewUserName.toString().trim() !== '') {
                body += `新使用人：${notifyNewUserName}\n`;
              }
              body += `審核時間：${now.toLocaleString('zh-TW')}\n\n`;
              body += `請點擊下方連結，前往「列印轉移申請」頁面列印轉移申請單：\n`;
              body += `${printTransferLink}\n\n`;
              body += `此為系統自動發送郵件。`;

              MailApp.sendEmail(applicantEmail, subject, body);
              Logger.log(`✅ 已通知申請人: ${applicantEmail}`);
            }
          } catch (emailError) {
            Logger.log(`⚠️ 發送通知給申請人時發生錯誤: ${emailError.message}`);
            // 不中斷流程
          }

          successCount++;
        } else {
          errors.push(`找不到資產 ${assetId}`);
        }
      } else {
        errors.push(`申請ID ${appId} 狀態不符或不存在`);
      }
    });

    if (successCount > 0) {
      const adminEmails = getAdminEmails();
      if (isAdminEmailEnabled() && adminEmails && adminEmails.length > 0) {
        const webAppUrl = getAppUrl();
        const printTransferLink = `${webAppUrl}?page=printTransfer`; // ✨ 新增：更新頁面連結

        const subject = `[系統通知] 有 ${successCount} 筆已完成轉移的財產待您更新`;
        let body = `您好，\n\n系統剛剛有 ${successCount} 筆財產轉移申請已被核准，請您執行後續的上傳更新作業。\n\n`;
        body += `請點擊下方連結，前往更新頁面進行操作：\n`;
        body += `${printTransferLink}\n\n`; // ✨ 新增：直接連結
        body += `此為系統自動發送郵件。`;
        MailApp.sendEmail(adminEmails.join(','), subject, body);
      }
    }

    let message = `成功核准 ${successCount} 筆申請。`;
    if (errors.length > 0) {
      message += `\n失敗或跳過 ${errors.length} 筆 (${errors.join('; ')})。`;
    }
    return message;

  } catch (e) {
    Logger.log(`!!!!!! processBatchApproval 發生嚴重錯誤: ${e.message} at ${e.stack}`);
    return "批次核准過程中發生嚴重錯誤: " + e.message;
  }
}

// =================================================================
// --- 資產管理員更新功能 (後端) ---
// =================================================================

/**
 * [供 update.html 呼叫] 獲取管理員儀表板的所有待辦事項
 * (包含待上傳 和 待報廢)
 */
// --- getAssetsForUpdate 更新版 ---
function getAssetsForUpdate() {
  const currentUserEmail = Session.getActiveUser().getEmail().toLowerCase();
  const adminEmails = getAdminEmails().map(email => email.toLowerCase());

  if (!adminEmails.includes(currentUserEmail)) {
    Logger.log(`權限阻擋：使用者 ${currentUserEmail} 嘗試存取更新頁面。`);
    return { error: "權限不足，您無法存取此功能。" };
  }

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const allAssets = getAllAssets();

  const assetsForUpload = [];
  const assetsForScrap = [];

  // ✨ 改進：從 APPLICATION_LOG 讀取完整的轉移申請記錄
  const appLogSheet = ss.getSheetByName(APPLICATION_LOG_SHEET_NAME);
  const appLogData = appLogSheet.getRange(2, 1, appLogSheet.getLastRow() - 1, appLogSheet.getLastColumn()).getValues();

  // 建立資產ID到申請記錄的映射（只取最新的「已完成」記錄）
  const assetToAppLogMap = new Map();
  appLogData.forEach(row => {
    const assetId = row[AL_ASSET_ID_COLUMN_INDEX - 1];
    const status = row[AL_STATUS_COLUMN_INDEX - 1];
    const reviewTime = row[AL_REVIEW_TIME_COLUMN_INDEX - 1];

    if (status === '已完成' && reviewTime) {
      // 如果已有記錄，比較時間，保留較新的
      if (!assetToAppLogMap.has(assetId) ||
          new Date(reviewTime) > new Date(assetToAppLogMap.get(assetId).reviewTime)) {
        assetToAppLogMap.set(assetId, {
          appId: row[AL_APP_ID_COLUMN_INDEX - 1],
          oldKeeper: row[AL_OLD_LEADER_COLUMN_INDEX - 1],
          oldLocation: row[AL_OLD_LOCATION_COLUMN_INDEX - 1],
          newKeeper: row[AL_NEW_LEADER_COLUMN_INDEX - 1],
          newLocation: row[AL_NEW_LOCATION_COLUMN_INDEX - 1],
          oldUser: row[AL_OLD_USER_COLUMN_INDEX - 1] || '',
          newUser: row[AL_NEW_USER_COLUMN_INDEX - 1] || '',
          transferType: row[AL_TRANSFER_TYPE_COLUMN_INDEX - 1] || '地點',
          reviewTime: reviewTime
        });
      }
    }
  });

  allAssets.forEach(asset => {
    // 條件一：篩選待上傳的項目（已轉移但尚未上傳）
    if (asset.transferTime && asset.isUploaded !== 'V') {
      const appLog = assetToAppLogMap.get(asset.assetId);

      assetsForUpload.push({
        assetId: asset.assetId,
        assetName: asset.assetName,
        // ✨ 新增：變更前後的完整資訊
        oldKeeper: appLog ? appLog.oldKeeper : asset.leaderName,
        newKeeper: appLog ? appLog.newKeeper : asset.leaderName,
        oldUser: appLog ? appLog.oldUser : (asset.userName || ''),
        newUser: appLog ? appLog.newUser : (asset.userName || ''),
        oldLocation: appLog ? appLog.oldLocation : asset.location,
        newLocation: appLog ? appLog.newLocation : asset.location,
        transferType: appLog ? appLog.transferType : '地點',
        transferDate: new Date(asset.transferTime).toLocaleDateString('zh-TW'),
        // 保留原有欄位以保持向後相容
        location: asset.location,
        leader: asset.leaderName,
        userName: asset.userName || '無'
      });
    }

    // 條件二：篩選待報廢的項目
    if (asset.assetStatus === '報廢中') {
      assetsForScrap.push({
        assetId: asset.assetId,
        assetName: asset.assetName,
        location: asset.location,
        leader: asset.leaderName,
        userName: asset.userName || '無', // 使用者名稱，物品總表顯示「無」
        scrapReason: asset.remarks
      });
    }
  });

  // 回傳一個包含兩個陣列的物件
  return { assetsForUpload, assetsForScrap };
}

/**
 * [供 update.html 呼叫] 處理資產管理員提交的更新狀態
 * @param {Array} assetIds - 被勾選的財產編號陣列
 * @returns {string} 執行結果訊息
 */
function processUploadConfirmation(assetIds) {
  if (!assetIds || assetIds.length === 0) {
    return "沒有選擇任何項目。";
  }

  try {
    const now = new Date();
    let updatedCount = 0;

    assetIds.forEach(id => {
      const location = findAssetLocation(id);
      if (location) {
        // 根據工作表名稱，選擇對應的欄位索引
        const indices = location.sheetName === PROPERTY_MASTER_SHEET_NAME ? PROPERTY_COLUMN_INDICES : ITEM_COLUMN_INDICES;
        location.sheet.getRange(location.rowIndex, indices.IS_UPLOADED).setValue('V');
        location.sheet.getRange(location.rowIndex, indices.UPLOAD_TIME).setValue(now);
        updatedCount++;
      }
    });

    if (updatedCount > 0) {
      return `成功更新 ${updatedCount} 筆財產狀態！`;
    } else {
      return "找不到對應的財產項目，可能資料已被變更。";
    }
  } catch (e) {
    Logger.log("上傳狀態更新失敗: " + e.message);
    return "更新失敗：" + e.message;
  }
}



// =================================================================
// --- 每月自動提醒功能 (背景排程執行) ---
// (此部分無需任何修改)
// =================================================================

/**
 * 每月定時觸發，檢查電腦回報狀態並發送通知 (過濾版)
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
// --- ✨ 全新功能模組：財產出借與歸還 ✨ ---
// =================================================================

/**
 * 顯示「申請財產出借」的對話方塊
 */
function showLendingDialog() {
  // 權限檢查：只有資產保管人才能出借
  // (此處省略，因 getLendingData 內會依據使用者篩選)
  const html = HtmlService.createHtmlOutputFromFile('lending')
      .setWidth(800)
      .setHeight(650);
  SpreadsheetApp.getUi().showModalDialog(html, '申請財產出借');
}

/**
 * 顯示「歸還作業管理」的對話方塊
 */
function showReturnDialog() {
  const html = HtmlService.createHtmlOutputFromFile('return')
      .setWidth(800)
      .setHeight(600);
  SpreadsheetApp.getUi().showModalDialog(html, '歸還作業管理');
}

/**
 * [供 lending.html 呼叫] 獲取使用者名下「在庫」的資產清單及所有可選的借用人
 */
function getLendingData() {
  try {
    const currentUserEmail = Session.getActiveUser().getEmail();
    const allAssets = getAllAssets(); // Keep for borrower/location lists
    const allMyAssets = getAssetsForCurrentUser();

    // 1. 篩選出當前使用者可出借的資產
    const availableAssets = allMyAssets
      .filter(asset => asset.assetStatus === '在庫')
      .map(asset => ({
        id: asset.assetId,
        assetName: asset.assetName,
        leaderName: asset.leaderName,
        location: asset.location,
        userName: asset.userName || '無' // 使用者名稱，物品總表顯示「無」
      }));

    // 2. 從所有資產中，提取不重複的借用人 (姓名) 和地點
    const uniqueBorrowersSet = new Set();
    const uniqueLocationsSet = new Set();
    allAssets.forEach(asset => {
      if (asset.leaderName) {
        uniqueBorrowersSet.add(asset.leaderName);
      }
      if (asset.location) {
        uniqueLocationsSet.add(asset.location);
      }
    });

    // 3. 將 Set 轉換為排序後的陣列
    const borrowerList = Array.from(uniqueBorrowersSet).sort((a, b) => a.localeCompare(b, 'zh-Hant'));
    const locationList = Array.from(uniqueLocationsSet).sort();

    // 4. 回傳整合後的資料
    return { 
        assets: availableAssets,
        borrowers: borrowerList,
        locations: locationList
    };

  } catch (e) {
    Logger.log("獲取可出借資產失敗: " + e.message);
    return { error: "讀取資料時發生錯誤：" + e.message };
  }
}

/**
 * [供 lending.html 呼叫] 處理批次的財產出借申請
 */
function processBatchLending(formData) {
  try {
    const { assetIds, borrowerName, returnDate, reason, lendingLocation } = formData;
    if (!assetIds || assetIds.length === 0 || !borrowerName || !returnDate || !lendingLocation) {
      throw new Error("資料不完整，請填寫所有必填欄位。");
    }

    const lendingLogSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(LENDING_LOG_SHEET_NAME);
    const allAssets = getAllAssets();
    const assetMap = new Map(allAssets.map(asset => [asset.assetId, asset]));

    const now = new Date();
    let successCount = 0;

    assetIds.forEach(assetId => {
      const asset = assetMap.get(assetId);
      if (asset && asset.assetStatus === '在庫') {
        const location = findAssetLocation(assetId);
        if (location) {
          const indices = location.sheetName === PROPERTY_MASTER_SHEET_NAME ? PROPERTY_COLUMN_INDICES : ITEM_COLUMN_INDICES;
          location.sheet.getRange(location.rowIndex, indices.ASSET_STATUS).setValue('出借中');
          
          const lendId = `LEND-${now.getTime()}-${successCount}`;
          // ✨ **核心修改：在 appendRow 中增加 lendingLocation**
          lendingLogSheet.appendRow([
            lendId, now, asset.assetId, asset.leaderName,
            borrowerName, new Date(returnDate), "", // 實際歸還日期留空
            reason, "出借中", lendingLocation // 寫入新的 J 欄
          ]);
          successCount++;
        } else {
          Logger.log(`processBatchLending: 找不到資產 ${assetId}，跳過。`);
        }
      }
    });

    if (successCount === 0) {
      throw new Error("處理失敗，勾選的財產可能已被他人借出或狀態已變更。");
    }

    return `成功為 ${successCount} 筆財產辦理出借！`;

  } catch (e) {
    Logger.log("批次出借失敗: " + e.message);
    return "申請出借失敗：" + e.message;
  }
}

/**
 * [供 return.html 呼叫] 獲取該保管人所有「出借中」的資產
 */
function getLentOutAssets() {
    try {
        const currentUserEmail = Session.getActiveUser().getEmail();
        const lendingLogSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(LENDING_LOG_SHEET_NAME);
        const lendingData = lendingLogSheet.getRange(2, 1, lendingLogSheet.getLastRow() - 1, 10).getValues(); // ✨ 讀取到 J 欄

        const allAssets = getAllAssets();
        const assetKeeperMap = new Map(allAssets.map(asset => [asset.assetId, asset.leaderEmail]));

        const lentAssets = lendingData
            .filter(row => {
                const assetId = row[2];
                const keeperEmail = assetKeeperMap.get(assetId);
                const status = row[LL_STATUS_COLUMN_INDEX - 1];
                return keeperEmail === currentUserEmail && status === '出借中';
            })
            .map(row => ({
                lendId: row[0],
                applyTime: new Date(row[1]).toLocaleDateString('zh-TW'),
                assetId: row[2],
                borrower: row[4],
                expectedReturnDate: new Date(row[5]).toLocaleDateString('zh-TW'),
                reason: row[7],
                lendingLocation: row[9] || '' // ✨ 新增：讀取 J 欄 (索引為9) 的出借後地點
            }));

        return { assets: lentAssets };
    } catch (e) {
        Logger.log("獲取出借中資產失敗: " + e.message);
        return { error: "讀取資料時發生錯誤：" + e.message };
    }
}


/**
 * [供 return.html 呼叫] 處理批次的財產歸還作業
 */
function processBatchReturn(lendIds) {
    if (!lendIds || lendIds.length === 0) {
        throw new Error("您沒有勾選任何要歸還的項目。");
    }

    try {
        const lendingLogSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(LENDING_LOG_SHEET_NAME);
        const lendingData = lendingLogSheet.getRange(2, 1, lendingLogSheet.getLastRow() - 1, lendingLogSheet.getLastColumn()).getValues();
        const lendingMap = new Map(lendingData.map((row, index) => [row[LL_LEND_ID_COLUMN_INDEX - 1], { row, index: index + 2 }]));

        const now = new Date();
        let successCount = 0;

        lendIds.forEach(lendId => {
            const lendDetails = lendingMap.get(lendId);
            if (lendDetails && lendDetails.row[LL_STATUS_COLUMN_INDEX - 1] === '出借中') {
                const assetId = lendDetails.row[2];

                // 1. 更新「出借紀錄」
                const lendRowIndex = lendDetails.index;
                lendingLogSheet.getRange(lendRowIndex, LL_STATUS_COLUMN_INDEX).setValue('已歸還');
                lendingLogSheet.getRange(lendRowIndex, LL_RETURN_DATE_COLUMN_INDEX).setValue(now);
                
                // 2. 更新財產總表的狀態
                const location = findAssetLocation(assetId);
                if (location) {
                    const indices = location.sheetName === PROPERTY_MASTER_SHEET_NAME ? PROPERTY_COLUMN_INDICES : ITEM_COLUMN_INDICES;
                    location.sheet.getRange(location.rowIndex, indices.ASSET_STATUS).setValue('在庫');
                }
                successCount++;
            }
        });
        
        return `成功將 ${successCount} 筆財產狀態更新為「在庫」！`;

    } catch (e) {
        Logger.log("批次歸還失敗: " + e.message);
        return "歸還作業失敗：" + e.message;
    }
}

/**
 * [供 portal.html 呼叫] 計算當前使用者待審核的案件數量
 * @returns {number} 待審核的案件數量
 */
function countPendingApprovals() {
  try {
    const currentUserEmail = Session.getActiveUser().getEmail();
    if (!currentUserEmail) {
      return 0;
    }
    const appLogSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(APPLICATION_LOG_SHEET_NAME);
    const values = appLogSheet.getRange(2, 1, appLogSheet.getLastRow() - 1, AL_NEW_LEADER_EMAIL_COLUMN_INDEX).getValues();
    
    let count = 0;
    for (const row of values) {
      if (row[AL_NEW_LEADER_EMAIL_COLUMN_INDEX - 1] === currentUserEmail && row[AL_STATUS_COLUMN_INDEX - 1] === "待接收") {
        count++;
      }
    }
    return count;
  } catch(e) {
    Logger.log("計算待審核數量失敗: " + e.message);
    return 0; // 發生錯誤時回傳 0
  }
}

/**
 * 用於在 HTML 樣板中引用其他 HTML 檔案的內容
 * @param {string} filename 要引用的 HTML 檔案名稱 (不含 .html)
 * @returns {string} 該檔案的 HTML 內容
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

// =================================================================
// --- ✨ 全新功能模組：財產報廢 --- ✨
// =================================================================

/**
 * 顯示「申請財產報廢」的對話方塊
 */
function showScrapDialog() {
  const html = HtmlService.createHtmlOutputFromFile('scrap')
      .setWidth(800)
      .setHeight(650);
  SpreadsheetApp.getUi().showModalDialog(html, '申請財產報廢');
}

/**
 * [供 scrap.html 呼叫] 獲取使用者名下可報廢的資產 (狀態為「在庫」或「出借中」)
 */
function getScrappableAssets() {
  try {
    const allMyAssets = getAssetsForCurrentUser();

    const availableAssets = allMyAssets
      .filter(asset => {
        return (asset.assetStatus === '在庫' || asset.assetStatus === '出借中');
      })
      .map(asset => ({
        id: asset.assetId,
        assetName: asset.assetName, // 財產名稱
        location: asset.location,
        status: asset.assetStatus,
        category: asset.assetCategory,
        userName: asset.userName || '無', // 使用者名稱，物品總表顯示「無」
        leaderName: asset.leaderName // 保管人姓名
      }));
      
    return { assets: availableAssets };
  } catch (e) {
    Logger.log("獲取可報廢資產失敗: " + e.message);
    return { error: "讀取資料時發生錯誤：" + e.message };
  }
}


/**
 * [供 scrap.html 呼叫] 處理批次的財產報廢申請 (改為"報廢中"狀態)
 */
function processBatchScrapping(formData) {
  try {
    const { assetIds, reason, remarks } = formData;
    if (!assetIds || assetIds.length === 0 || !reason) {
      throw new Error("資料不完整，請至少勾選一筆財產並選擇報廢原因。");
    }

    const allAssets = getAllAssets();
    const assetMap = new Map(allAssets.map(asset => [asset.assetId, asset]));

    const now = new Date();
    let successCount = 0;
    const scrappedAssets = []; // 收集報廢財產資訊供郵件通知使用
    const fullReason = reason === '其他' ? `其他: ${remarks}` : `${reason} ${remarks}`;

    assetIds.forEach(assetId => {
      const asset = assetMap.get(assetId);
      if (asset && asset.assetStatus !== '已報廢' && asset.assetStatus !== '報廢中') {
        const location = findAssetLocation(assetId);
        if (location) {
          const indices = location.sheetName === PROPERTY_MASTER_SHEET_NAME ? PROPERTY_COLUMN_INDICES : ITEM_COLUMN_INDICES;
          location.sheet.getRange(location.rowIndex, indices.ASSET_STATUS).setValue('報廢中');
          location.sheet.getRange(location.rowIndex, indices.LAST_MODIFIED).setValue(now);
          location.sheet.getRange(location.rowIndex, indices.REMARKS).setValue(fullReason);

          // 收集成功報廢的財產資訊供郵件通知使用
          scrappedAssets.push({
            assetId: assetId,
            assetName: asset.assetName,
            keeperName: asset.leaderName,
            userName: asset.userName || '無',
            location: asset.location,
            category: asset.assetCategory  // 修正：使用正確的屬性名稱 assetCategory
          });

          successCount++;
        } else {
          Logger.log(`processBatchScrapping: 找不到資產 ${assetId}，跳過。`);
        }
      }
    });

    if (successCount === 0) {
      throw new Error("處理失敗，勾選的財產可能已在報廢流程中或狀態已變更。");
    }

    // 📧 發送郵件通知給所有管理員
    if (successCount > 0) {
      try {
        const applicantEmail = Session.getActiveUser().getEmail();
        const applicantName = scrappedAssets[0].keeperName; // 申請人即為保管人
        const adminEmails = getAdminEmails();

        if (isAdminEmailEnabled() && adminEmails && adminEmails.length > 0) {
          const webAppUrl = getAppUrl();
          const printScrapLink = `${webAppUrl}?page=printScrap`;

          const subject = `[財產報廢通知] ${applicantName} 提交了 ${successCount} 筆財產報廢申請`;
          let body = `您好，\n\n`;
          body += `使用者 ${applicantName} (${applicantEmail}) 剛剛提交了 ${successCount} 筆財產的報廢申請：\n\n`;

          // 列出報廢財產清單
          scrappedAssets.forEach(asset => {
            body += `  📦 ${asset.assetId} - ${asset.assetName}\n`;
            body += `     保管人：${asset.keeperName} | 使用人：${asset.userName}\n`;
            body += `     地點：${asset.location} | 類別：${asset.category}\n\n`;
          });

          body += `📋 報廢原因：${fullReason}\n\n`;
          body += `請點擊下方連結前往「列印報廢申請紀錄」頁面進行列印：\n`;
          body += `${printScrapLink}\n\n`;
          body += `此為系統自動發送郵件。`;

          MailApp.sendEmail(adminEmails.join(','), subject, body);
          Logger.log(`✅ 已發送報廢通知給 ${adminEmails.length} 位管理員`);
        }
      } catch (emailError) {
        Logger.log(`⚠️ 郵件發送失敗: ${emailError.message}`);
        // 即使郵件發送失敗，報廢申請已成功，不影響主流程
      }
    }

    return `成功為 ${successCount} 筆財產提交報廢申請，待管理員確認。`;

  } catch (e) {
    Logger.log("批次報廢申請失敗: " + e.message);
    return "申請報廢失敗：" + e.message;
  }
}

/**
 * [供 update.html 呼叫] 處理管理員的批次報廢確認
 */
function processScrapConfirmation(assetIds) {
  if (!assetIds || assetIds.length === 0) {
    throw new Error("您沒有勾選任何要確認報廢的項目。");
  }

  try {
    const allAssets = getAllAssets();
    const assetMap = new Map(allAssets.map(asset => [asset.assetId, asset]));

    const now = new Date();
    let successCount = 0;

    assetIds.forEach(assetId => {
      const asset = assetMap.get(assetId);
      if (asset && asset.assetStatus === '報廢中') {
        const location = findAssetLocation(assetId);
        if (location) {
          const indices = location.sheetName === PROPERTY_MASTER_SHEET_NAME ? PROPERTY_COLUMN_INDICES : ITEM_COLUMN_INDICES;
          location.sheet.getRange(location.rowIndex, indices.ASSET_STATUS).setValue('已報廢');
          const originalReason = asset.remarks;
          location.sheet.getRange(location.rowIndex, indices.REMARKS).setValue(originalReason.replace('[報廢申請]', '[報廢完成]'));
          location.sheet.getRange(location.rowIndex, indices.LAST_MODIFIED).setValue(now);
          successCount++;
        }
      }
    });

    return `成功確認 ${successCount} 筆財產的報廢作業！`;

  } catch (e) {
    Logger.log("批次報廢確認失敗: " + e.message);
    return "報廢確認失敗：" + e.message;
  }
}

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
 * 檢查是否啟用管理員郵件通知功能
 * 讀取「管理員名單」工作表的 C2 儲存格，若為「是」則啟用
 * @returns {boolean} true = 啟用郵件通知, false = 停用
 */
function isAdminEmailEnabled() {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(ADMIN_LIST_SHEET_NAME);
  if (!sheet) {
    Logger.log(`錯誤：找不到名為 "${ADMIN_LIST_SHEET_NAME}" 的工作表。`);
    return false;
  }

  const emailToggle = sheet.getRange("C2").getValue();
  const isEnabled = (emailToggle === '是');

  if (!isEnabled) {
    Logger.log(`📧 管理員郵件通知已停用（C2 = 「${emailToggle}」）`);
  }

  return isEnabled;
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

/**
 * 取得所有待報廢的詳細項目 (詳細模式用)
 * @param {string} assetCategory - 財產類別 (財產/非消耗品)
 * @returns {Array<Object>} 包含詳細資訊的陣列
 */
function getAllScrappableItems(assetCategory) {
  // 1. 取得當前使用者身分與權限
  const currentUserEmail = Session.getActiveUser().getEmail();
  const isAdmin = checkAdminPermissions();

  const allAssets = getAllAssets();
  
  // 2. 篩選符合條件的資產 (狀態 + 權限)
  const targetAssets = allAssets.filter(asset => {
    // 基本條件
    if (asset.assetStatus !== '報廢中' || asset.assetCategory !== assetCategory) {
      return false;
    }
    
    // 權限條件：管理員看全部，一般人看自己 (保管人或使用人)
    if (isAdmin) return true;
    return asset.leaderEmail === currentUserEmail || asset.userEmail === currentUserEmail;
  });

  // 3. 轉換為前端可用的純物件格式
  return targetAssets.map(asset => {
    // 處理日期格式化
    let scrapDateStr = '';
    if (asset.lastModified) {
      try {
        scrapDateStr = Utilities.formatDate(new Date(asset.lastModified), Session.getScriptTimeZone(), "yyyy/MM/dd");
      } catch (e) {
        scrapDateStr = ''; // 若日期無效則留空
      }
    }

    return {
      assetId: String(asset.assetId || ''),
      assetName: String(asset.assetName || ''),
      originalKeeper: String(asset.leaderName || ''),
      originalUser: String(asset.userName || ''), // 物品總表可能無此欄位，轉為空字串
      scrapDate: scrapDateStr,                    // 傳送格式化後的字串，而非 Date 物件
      scrapReason: String(asset.remarks || '')    // 確保為字串
    };
  });
}

function getAdminName() {
  const currentUserEmail = Session.getActiveUser().getEmail();
  const mappingSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(KEEPER_EMAIL_MAP_SHEET_NAME);
  const data = mappingSheet.getRange("A2:B" + mappingSheet.getLastRow()).getValues();
  const mapping = new Map(data.map(row => [row[1], row[0]])); // Email -> Name
  return mapping.get(currentUserEmail) || currentUserEmail; // 如果找不到，就回傳 Email
}

function getScrappingDataForAdmin(assetCategory) {
  // 此函式名稱雖保留 "ForAdmin"，但現在已支援一般使用者
  const currentUserEmail = Session.getActiveUser().getEmail();
  const isAdmin = checkAdminPermissions();

  try {
    const allAssets = getAllAssets();
    
    const applicants = {};

    allAssets.forEach(asset => {
      if (asset.assetStatus === '報廢中' && asset.leaderName && asset.assetCategory === assetCategory) {
        // 權限過濾：非管理員只能看到自己的資料
        if (!isAdmin) {
          if (asset.leaderEmail !== currentUserEmail && asset.userEmail !== currentUserEmail) {
            return; 
          }
        }

        if (applicants[asset.leaderName]) {
          applicants[asset.leaderName]++;
        } else {
          applicants[asset.leaderName] = 1;
        }
      }
    });

    return Object.keys(applicants).map(name => ({
      applicant: name,
      count: applicants[name]
    }));
    
  } catch (e) {
    Logger.log("getScrappingDataForAdmin 失敗: " + e.message);
    throw new Error("讀取待報廢清單時發生錯誤。");
  }
}

/**
 * [供 printScrap.html 呼叫] 取得所有狀態為「報廢中」的財產，並按保管人分組
 * @returns {Array<Object>} 回傳一個陣列，包含 { applicant: '保管人名稱', count: 報廢數量 }
 */
function getScrappingApplicants(assetCategory) {
  // 直接轉呼叫通用的邏輯
  return getScrappingDataForAdmin(assetCategory);
}

/**
 * [供 printScrap.html 呼叫] 為指定保管人產生一份彙整的報廢申請文件 (最終格式修正版)
 * 修正了數字格式、民國日期解析、以及已使用期間的計算問題。
 * @param {string} applicantName 要處理的保管人名稱
 * @returns {object} 包含新文件 URL 的物件 { fileUrl: '...' }
 */
function createScrapDoc(applicantName, assetCategory, assetIds) {
  const now = new Date();
  const currentUserEmail = Session.getActiveUser().getEmail();
  const isAdmin = checkAdminPermissions();

  // 🛡️ 安全檢查：防止一般使用者產生他人的報表
  // 如果不是管理員，我們強制檢查 applicantName 是否對應到當前使用者，
  // 或者更嚴格地，我們在篩選資產時再次過濾。
  
  try {
    const allAssets = getAllAssets();
    const assetsToScrap = [];

    // 建立 Email 與 Name 的簡易查找 (為了安全檢查)
    // 這裡我們直接在篩選資產時做嚴格檢查，這比檢查 applicantName 更安全
    
    if (assetIds && assetIds.length > 0) {
      const assetIdSet = new Set(assetIds);
      allAssets.forEach(asset => {
        if (assetIdSet.has(asset.assetId)) {
          // 🛡️ 權限檢查
          if (!isAdmin && asset.leaderEmail !== currentUserEmail && asset.userEmail !== currentUserEmail) {
            Logger.log(`[Security Block] User ${currentUserEmail} tried to print asset ${asset.assetId} belonging to ${asset.leaderEmail}`);
            return; // 跳過不屬於自己的資產
          }
          assetsToScrap.push(asset);
        }
      });
    } else {
      // 簡易模式：根據 applicantName 篩選
      allAssets.forEach(asset => {
        if (asset.leaderName === applicantName && asset.assetStatus === '報廢中' && asset.assetCategory === assetCategory) {
           // 🛡️ 權限檢查
           if (!isAdmin && asset.leaderEmail !== currentUserEmail && asset.userEmail !== currentUserEmail) {
             return; // 跳過
           }
          assetsToScrap.push(asset);
        }
      });
    }

    if (assetsToScrap.length === 0) {
        if (!isAdmin) {
             throw new Error(`找不到您 (${applicantName}) 的待報廢財產，或您沒有權限列印此報表。`);
        }
        throw new Error(`找不到 ${applicantName} 的待報廢財產。`);
    }

    const assetMap = new Map(allAssets.map(asset => [asset.assetId, asset]));

    const templateId = assetCategory === '財產' ? SCRAP_TEMPLATE_DOC_ID_PROPERTY : SCRAP_TEMPLATE_DOC_ID_NON_CONSUMABLE;
    const categoryName = assetCategory === '財產' ? '財產' : '非消耗品';
    const docName = `財產報廢單_${categoryName}_${applicantName}_${Utilities.formatDate(now, "GMT+8", "yyyyMMdd")}`;
    const templateFile = DriveApp.getFileById(templateId);
    const outputFolder = DriveApp.getFolderById(SCRAP_OUTPUT_FOLDER_ID);
    const newFile = templateFile.makeCopy(docName, outputFolder);
    const newDoc = DocumentApp.openById(newFile.getId());
    const body = newDoc.getBody();
    body.replaceText("{{申請日期}}", Utilities.formatDate(now, "GMT+8", "yyyy/MM/dd"));
    body.replaceText("{{填表人}}", applicantName);

    // 🔍 找到表格和範本行
    const tables = body.getTables();
    if (tables.length === 0) {
      throw new Error('錯誤：在模板文件中找不到表格！');
    }

    const targetTable = tables[0]; // 假設是第一個表格
    let templateRowIndex = -1;

    // 尋找包含 {{TEMPLATE_ROW}} 的行
    for (let i = 0; i < targetTable.getNumRows(); i++) {
      const firstCell = targetTable.getRow(i).getCell(0);
      if (firstCell.getText().includes('{{TEMPLATE_ROW}}')) {
        templateRowIndex = i;
        break;
      }
    }

    if (templateRowIndex === -1) {
      throw new Error('錯誤：在表格中找不到 {{TEMPLATE_ROW}} 範本行！請在模板的表格中添加包含 {{TEMPLATE_ROW}} 的行。');
    }

    Logger.log(`找到範本行於索引: ${templateRowIndex}`);

    // 📐 準備邊框樣式
    const borderStyle = {};
    borderStyle[DocumentApp.Attribute.BORDER_WIDTH] = 1.5;       // 1.5pt 寬度（比 1pt 更明顯）
    borderStyle[DocumentApp.Attribute.BORDER_COLOR] = '#000000'; // 黑色

    // 📋 獲取範本行
    const templateRow = targetTable.getRow(templateRowIndex);
    const templateCellCount = templateRow.getNumCells();
    Logger.log(`範本行儲存格數量: ${templateCellCount}`);

    if (templateCellCount !== 7) {
      throw new Error(`範本行儲存格數量錯誤！預期 7 個，實際 ${templateCellCount} 個。請確保範本行有 7 個獨立的儲存格。`);
    }

    Logger.log(`開始插入 ${assetsToScrap.length} 筆報廢資料`);

    // 🔄 動態插入數據列（使用 .copy() 方法）
    assetsToScrap.forEach((asset, index) => {
      const assetInfo = assetMap.get(asset.assetId.trim());
      if (assetInfo) {
        // 📅 處理購置日期
        let purchaseDateStr = (assetInfo.purchaseDate || '').toString();
        purchaseDateStr = purchaseDateStr.split('\n')[0].trim();

        let purchaseDate = null;
        let years = 'N/A';
        let months = 'N/A';
        let purchaseDateFormatted = '無日期資料';

        if (purchaseDateStr.includes('GMT')) {
            purchaseDate = new Date(purchaseDateStr);
        } else {
            const dateParts = purchaseDateStr.match(/(0?\d+)\/(\d+)\/(\d+)/);
            if (dateParts) {
                const minguoYear = parseInt(dateParts[1], 10);
                const gregorianYear = minguoYear + 1911;
                const monthJs = parseInt(dateParts[2], 10) - 1;
                const day = parseInt(dateParts[3], 10);
                purchaseDate = new Date(gregorianYear, monthJs, day);
            }
        }

        if (purchaseDate && !isNaN(purchaseDate.getTime())) {
             purchaseDateFormatted = Utilities.formatDate(purchaseDate, "GMT+8", "yyyy/MM/dd");
             const monthsUsed = (now.getFullYear() - purchaseDate.getFullYear()) * 12 + (now.getMonth() - purchaseDate.getMonth());
             years = Math.floor(monthsUsed / 12);
             months = monthsUsed % 12;
        }

        // 📊 準備儲存格數據
        const cellData = [
          (index + 1).toString(),                                                          // 序號
          assetInfo.assetId.trim(),                                                        // 財產編號
          assetInfo.assetName,                                                             // 財產名稱
          purchaseDateFormatted,                                                           // 購置日期
          !isNaN(parseInt(assetInfo.useLife)) ? parseInt(assetInfo.useLife).toString() : (assetInfo.useLife || ''),  // 使用年限
          `${years}/${months}`,                                                            // 已使用期間
          assetInfo.remarks || ''                                                          // 報廢原因
        ];

        try {
          // 🆕 在範本行之後插入新行（而非在表格末端添加）
          // 計算插入位置：範本行索引 + 1 + 當前已插入的行數
          const insertPosition = templateRowIndex + index + 1;
          const newRow = targetTable.insertTableRow(insertPosition);
          Logger.log(`插入新行於位置: ${insertPosition}`);

          // 🔄 複製並填充每個儲存格
          for (let i = 0; i < cellData.length; i++) {
            // 1️⃣ 複製範本儲存格（繼承所有樣式）
            const templateCell = templateRow.getCell(i);
            const newCell = templateCell.copy();

            // 2️⃣ 更新段落文字（保留對齊格式）
            if (newCell.getNumChildren() > 0 &&
                newCell.getChild(0).getType() === DocumentApp.ElementType.PARAGRAPH) {
              newCell.getChild(0).asParagraph().setText(cellData[i]);

              // 清理多餘的空行
              while (newCell.getNumChildren() > 1) {
                newCell.removeChild(newCell.getChild(1));
              }
            } else {
              newCell.setText(cellData[i]);
            }

            // 3️⃣ 強制設定邊框樣式（雙重保險）
            try {
              newCell.setAttributes(borderStyle);
            } catch (borderError) {
              Logger.log(`⚠️ 儲存格 ${i} 設定邊框失敗: ${borderError.message}`);
            }

            // 4️⃣ 將處理好的儲存格加入新行
            newRow.appendTableCell(newCell);
          }

          Logger.log(`✅ 第 ${index + 1} 行資料填充成功（${cellData.length} 個儲存格）`);
        } catch (e) {
          Logger.log(`❌ 填充第 ${index + 1} 行時發生錯誤: ${e.message}`);
          throw new Error(`填充數據時發生錯誤（第 ${index + 1} 筆）: ${e.message}`);
        }
      }
    });

    // 🗑️ 刪除範本行
    Logger.log(`刪除範本行（索引 ${templateRowIndex}）`);
    targetTable.removeRow(templateRowIndex);
    Logger.log(`✅ 成功刪除範本行`);

    // ⚠️ 以下是向後兼容的舊邏輯（如果上述邏輯失敗，不會執行到這裡）
    if (false) {
      // ⚠️ 向後兼容：如果佔位符不在表格中，使用原有邏輯
      const placeholderParagraph = tablePlaceholder.getElement().getParent();
      const insertIndex = body.getChildIndex(placeholderParagraph);
      placeholderParagraph.removeFromParent();

      let tableHeader;
      if (assetCategory === '非消耗品') {
        tableHeader = ['序號', '物品編號', '物品名稱', '購置日期', '使用年限', '已使用期間', '報廢原因'];
      } else {
        tableHeader = ['序號', '財產編號', '財產名稱', '購置日期', '使用年限', '已使用期間', '報廢原因'];
      }
      const tableValues = [tableHeader];

      assetsToScrap.forEach((asset, index) => {
        const assetInfo = assetMap.get(asset.assetId.trim());
        if (assetInfo) {
          let purchaseDateStr = (assetInfo.purchaseDate || '').toString();
          purchaseDateStr = purchaseDateStr.split('\n')[0].trim();

          let purchaseDate = null;
          let years = 'N/A';
          let months = 'N/A';
          let purchaseDateFormatted = '無日期資料';

          if (purchaseDateStr.includes('GMT')) {
              purchaseDate = new Date(purchaseDateStr);
          } else {
              const dateParts = purchaseDateStr.match(/(0?\d+)\/(\d+)\/(\d+)/);
              if (dateParts) {
                  const minguoYear = parseInt(dateParts[1], 10);
                  const gregorianYear = minguoYear + 1911;
                  const monthJs = parseInt(dateParts[2], 10) - 1;
                  const day = parseInt(dateParts[3], 10);
                  purchaseDate = new Date(gregorianYear, monthJs, day);
              }
          }

          if (purchaseDate && !isNaN(purchaseDate.getTime())) {
               purchaseDateFormatted = Utilities.formatDate(purchaseDate, "GMT+8", "yyyy/MM/dd");
               const monthsUsed = (now.getFullYear() - purchaseDate.getFullYear()) * 12 + (now.getMonth() - purchaseDate.getMonth());
               years = Math.floor(monthsUsed / 12);
               months = monthsUsed % 12;
          }

          const serialNumber = (index + 1).toString();
          const usefulLifeRaw = assetInfo.useLife;
          const usefulLife = !isNaN(parseInt(usefulLifeRaw)) ? parseInt(usefulLifeRaw).toString() : (usefulLifeRaw || '');
          const reasonCode = assetInfo.remarks || '';

          const rowData = [
            serialNumber,
            assetInfo.assetId.trim(),
            assetInfo.assetName,
            purchaseDateFormatted,
            usefulLife,
            `${years}/${months}`,
            reasonCode
          ];
          tableValues.push(rowData);
        }
      });

      const newTable = body.insertTable(insertIndex, tableValues);
      const headerRowStyle = {};
      headerRowStyle[DocumentApp.Attribute.BOLD] = true;
      newTable.getRow(0).setAttributes(headerRowStyle);
    }

    newDoc.saveAndClose();
    const fileUrl = newFile.getUrl();
    
    assetsToScrap.forEach(asset => {
      const location = findAssetLocation(asset.assetId);
      if (location) {
        const indices = location.sheetName === PROPERTY_MASTER_SHEET_NAME ? PROPERTY_COLUMN_INDICES : ITEM_COLUMN_INDICES;
        location.sheet.getRange(location.rowIndex, indices.DOC_URL).setValue(fileUrl);
      }
    });
    
    Logger.log(`成功為 ${applicantName} 產生文件: ${fileUrl}`);
    return {
      fileUrl: fileUrl,
      assetIds: assetsToScrap.map(asset => asset.assetId)
    };

  } catch (e) {
    Logger.log(`createScrapDocForApplicant 失敗: ${e.message} at ${e.stack}`);
    throw new Error("產生報表文件時發生錯誤: " + e.message);
  }
}

// ========== ✨ 轉移列印功能 ========== //

/**
 * [供 printTransfer.html 呼叫] 取得已完成轉移的資產統計（按保管人分組）
 * @param {string} assetCategory - 財產類別：'財產' 或 '物品'
 * @returns {Array} 返回格式：[{ keeper: '李四', count: 3 }, ...]
 */
function getTransferDataForPrint(assetCategory) {
  const currentUserEmail = Session.getActiveUser().getEmail().toLowerCase();
  const isAdmin = checkAdminPermissions();
  // 移除強制阻擋，改為下方邏輯判斷
  
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const appLogSheet = ss.getSheetByName(APPLICATION_LOG_SHEET_NAME);
    const appLogData = appLogSheet.getRange(2, 1, appLogSheet.getLastRow() - 1, appLogSheet.getLastColumn()).getValues();

    // 建立資產ID到最新轉移記錄的映射
    const assetToLatestTransfer = new Map();

    appLogData.forEach(row => {
      const assetId = row[AL_ASSET_ID_COLUMN_INDEX - 1];
      const status = row[AL_STATUS_COLUMN_INDEX - 1];
      const reviewTime = row[AL_REVIEW_TIME_COLUMN_INDEX - 1];

      if (status === '已完成' && reviewTime) {
        // 比較時間，保留最新的記錄
        if (!assetToLatestTransfer.has(assetId) ||
            new Date(reviewTime) > new Date(assetToLatestTransfer.get(assetId).reviewTime)) {
          assetToLatestTransfer.set(assetId, {
            newKeeper: row[AL_NEW_LEADER_COLUMN_INDEX - 1],
            newKeeperEmail: row[AL_NEW_LEADER_EMAIL_COLUMN_INDEX - 1], // ✨ 用於權限判斷
            reviewTime: reviewTime
          });
        }
      }
    });

    // 取得所有資產資料，用於篩選類別
    const allAssets = getAllAssets();
    const assetCategoryMap = new Map(allAssets.map(asset => [asset.assetId, asset.assetCategory]));
    const assetIsUploadedMap = new Map(allAssets.map(asset => [asset.assetId, asset.isUploaded]));

    // 按新保管人分組計數（同時篩選類別）
    const keeperCount = {};

    assetToLatestTransfer.forEach((transfer, assetId) => {
      const category = assetCategoryMap.get(assetId);
      const isUploaded = assetIsUploadedMap.get(assetId);

      // 1. 類別與上傳狀態篩選
      if (category === assetCategory && isUploaded !== 'V') {
        
        // 2. 🛡️ 權限篩選
        if (!isAdmin) {
          // 一般使用者只能看到自己是新保管人的記錄
          // (假設列印轉移記錄主要是為了「接收確認」或「保管證明」)
          const isMyRecord = (transfer.newKeeperEmail && transfer.newKeeperEmail.toLowerCase() === currentUserEmail);
          if (!isMyRecord) return;
        }

        const keeperName = transfer.newKeeper;
        if (keeperCount[keeperName]) {
          keeperCount[keeperName]++;
        } else {
          keeperCount[keeperName] = 1;
        }
      }
    });

    // 轉換為陣列格式並排序
    const result = Object.keys(keeperCount)
      .map(name => ({
        keeper: name,
        count: keeperCount[name]
      }))
      .sort((a, b) => a.keeper.localeCompare(b.keeper, 'zh-Hant'));

    Logger.log(`成功取得 ${assetCategory} 的轉移統計，共 ${result.length} 位保管人`);
    return result;

  } catch (e) {
    Logger.log(`getTransferDataForPrint 失敗: ${e.message}`);
    throw new Error("讀取轉移資料失敗: " + e.message);
  }
}

/**
 * [供 printTransfer.html 呼叫] 取得所有已完成轉移資產的明細清單（詳細模式）
 * @param {string} assetCategory - 財產類別：'財產' 或 '物品'
 * @returns {Array} 返回格式：[{ assetId, assetName, oldKeeper, newKeeper, oldLocation, newLocation, transferDate }, ...]
 */
function getAllTransferableItems(assetCategory) {
  const currentUserEmail = Session.getActiveUser().getEmail().toLowerCase();
  const isAdmin = checkAdminPermissions();
  // 移除強制阻擋

  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const appLogSheet = ss.getSheetByName(APPLICATION_LOG_SHEET_NAME);
    const appLogData = appLogSheet.getRange(2, 1, appLogSheet.getLastRow() - 1, appLogSheet.getLastColumn()).getValues();

    // 建立資產ID到最新轉移記錄的映射
    const assetToLatestTransfer = new Map();

    appLogData.forEach(row => {
      const assetId = row[AL_ASSET_ID_COLUMN_INDEX - 1];
      const status = row[AL_STATUS_COLUMN_INDEX - 1];
      const reviewTime = row[AL_REVIEW_TIME_COLUMN_INDEX - 1];

      if (status === '已完成' && reviewTime) {
        // 比較時間，保留最新的記錄
        if (!assetToLatestTransfer.has(assetId) ||
            new Date(reviewTime) > new Date(assetToLatestTransfer.get(assetId).reviewTime)) {
          assetToLatestTransfer.set(assetId, {
            oldKeeper: row[AL_OLD_LEADER_COLUMN_INDEX - 1],
            oldLocation: row[AL_OLD_LOCATION_COLUMN_INDEX - 1],
            oldUser: row[AL_OLD_USER_COLUMN_INDEX - 1],
            newKeeper: row[AL_NEW_LEADER_COLUMN_INDEX - 1],
            newKeeperEmail: row[AL_NEW_LEADER_EMAIL_COLUMN_INDEX - 1], // ✨ 用於權限判斷
            newLocation: row[AL_NEW_LOCATION_COLUMN_INDEX - 1],
            newUser: row[AL_NEW_USER_COLUMN_INDEX - 1],
            newUserEmail: row[AL_NEW_USER_EMAIL_COLUMN_INDEX - 1], // ✨ 用於權限判斷
            transferType: row[AL_TRANSFER_TYPE_COLUMN_INDEX - 1] || '地點',
            reviewTime: reviewTime
          });
        }
      }
    });

    // 取得所有資產資料
    const allAssets = getAllAssets();
    const items = [];

    allAssets.forEach(asset => {
      // 篩選條件：資產類別匹配且有轉移記錄且未上傳
      if (asset.assetCategory === assetCategory &&
          assetToLatestTransfer.has(asset.assetId) &&
          asset.isUploaded !== 'V') {
        
        const transfer = assetToLatestTransfer.get(asset.assetId);

        // 🛡️ 權限過濾
        if (!isAdmin) {
           // 一般使用者只能看到自己相關的（新保管人或新使用人）
           const isRelevant = (transfer.newKeeperEmail && transfer.newKeeperEmail.toLowerCase() === currentUserEmail) ||
                              (transfer.newUserEmail && transfer.newUserEmail.toLowerCase() === currentUserEmail);
           if (!isRelevant) return;
        }

        items.push({
          assetId: asset.assetId,
          assetName: asset.assetName,
          oldKeeper: transfer.oldKeeper,
          oldUser: transfer.oldUser || '',
          oldLocation: transfer.oldLocation,
          newKeeper: transfer.newKeeper,
          newUser: transfer.newUser || '',
          newLocation: transfer.newLocation,
          transferType: transfer.transferType,
          transferDate: new Date(transfer.reviewTime).toLocaleDateString('zh-TW')
        });
      }
    });

    Logger.log(`成功取得 ${assetCategory} 的轉移明細，共 ${items.length} 筆`);
    return items;

  } catch (e) {
    Logger.log(`getAllTransferableItems 失敗: ${e.message}`);
    throw new Error("讀取轉移明細失敗: " + e.message);
  }
}

/**
 * [供 printTransfer.html 呼叫] 為指定保管人產生一份彙整的轉移記錄文件
 * @param {string} keeperName - 保管人名稱（簡易模式）或管理員名稱（詳細模式）
 * @param {string} assetCategory - 財產類別：'財產' 或 '物品'
 * @param {Array|null} assetIds - 指定的資產ID陣列（詳細模式），或 null（簡易模式）
 * @returns {Object} { fileUrl: '...' }
 */
function createTransferDoc(keeperName, assetCategory, assetIds) {
  const currentUserEmail = Session.getActiveUser().getEmail().toLowerCase();
  const isAdmin = checkAdminPermissions();

  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const appLogSheet = ss.getSheetByName(APPLICATION_LOG_SHEET_NAME);
    const appLogData = appLogSheet.getRange(2, 1, appLogSheet.getLastRow() - 1, appLogSheet.getLastColumn()).getValues();
    const now = new Date();

    // 1️⃣ 建立資產ID到最新轉移記錄的映射
    const assetToLatestTransfer = new Map();

    appLogData.forEach(row => {
      const assetId = row[AL_ASSET_ID_COLUMN_INDEX - 1];
      const status = row[AL_STATUS_COLUMN_INDEX - 1];
      const reviewTime = row[AL_REVIEW_TIME_COLUMN_INDEX - 1];

      if (status === '已完成' && reviewTime) {
        // 比較時間，保留最新的記錄
        if (!assetToLatestTransfer.has(assetId) ||
            new Date(reviewTime) > new Date(assetToLatestTransfer.get(assetId).reviewTime)) {
          assetToLatestTransfer.set(assetId, {
            oldKeeper: row[AL_OLD_LEADER_COLUMN_INDEX - 1],
            oldLocation: row[AL_OLD_LOCATION_COLUMN_INDEX - 1],
            oldUser: row[AL_OLD_USER_COLUMN_INDEX - 1],
            newKeeper: row[AL_NEW_LEADER_COLUMN_INDEX - 1],
            newKeeperEmail: row[AL_NEW_LEADER_EMAIL_COLUMN_INDEX - 1], // 🛡️
            newLocation: row[AL_NEW_LOCATION_COLUMN_INDEX - 1],
            newUser: row[AL_NEW_USER_COLUMN_INDEX - 1],
            newUserEmail: row[AL_NEW_USER_EMAIL_COLUMN_INDEX - 1], // 🛡️
            reviewTime: reviewTime
          });
        }
      }
    });

    // 2️⃣ 取得所有資產並篩選目標資產
    const allAssets = getAllAssets();
    const assetsToTransfer = [];

    if (assetIds && assetIds.length > 0) {
      // 詳細模式：根據指定的ID陣列篩選
      const assetIdSet = new Set(assetIds);
      allAssets.forEach(asset => {
        if (assetIdSet.has(asset.assetId) && assetToLatestTransfer.has(asset.assetId)) {
          const transfer = assetToLatestTransfer.get(asset.assetId);
          
          // 🛡️ 權限檢查
          if (!isAdmin) {
             const isRelevant = (transfer.newKeeperEmail && transfer.newKeeperEmail.toLowerCase() === currentUserEmail) ||
                                (transfer.newUserEmail && transfer.newUserEmail.toLowerCase() === currentUserEmail);
             if (!isRelevant) return; // 跳過不相關的
          }
          
          assetsToTransfer.push({
            asset: asset,
            transfer: transfer
          });
        }
      });
    } else {
      // 簡易模式：根據保管人名稱 + 類別篩選
      allAssets.forEach(asset => {
        if (assetToLatestTransfer.has(asset.assetId)) {
          const transfer = assetToLatestTransfer.get(asset.assetId);
          // 篩選條件：新保管人匹配 + 類別匹配
          if (transfer.newKeeper === keeperName && asset.assetCategory === assetCategory) {
            
            // 🛡️ 權限檢查
            if (!isAdmin) {
                const isRelevant = (transfer.newKeeperEmail && transfer.newKeeperEmail.toLowerCase() === currentUserEmail) ||
                                   (transfer.newUserEmail && transfer.newUserEmail.toLowerCase() === currentUserEmail);
                if (!isRelevant) return; 
            }

            assetsToTransfer.push({
              asset: asset,
              transfer: transfer
            });
          }
        }
      });
    }

    if (assetsToTransfer.length === 0) {
      throw new Error(`找不到 ${keeperName} 的已完成轉移記錄，或您沒有權限存取。`);
    }

    // 3️⃣ 選擇模板並複製文件
    const templateId = assetCategory === '財產'
        ? TRANSFER_TEMPLATE_DOC_ID_PROPERTY
        : TRANSFER_TEMPLATE_DOC_ID_ITEM;

    const categoryName = assetCategory === '財產' ? '財產' : '物品';
    const docName = `${categoryName}轉移記錄_${keeperName}_${Utilities.formatDate(now, "GMT+8", "yyyyMMdd")}`;

    const templateFile = DriveApp.getFileById(templateId);
    const outputFolder = DriveApp.getFolderById(TRANSFER_OUTPUT_FOLDER_ID);
    const newFile = templateFile.makeCopy(docName, outputFolder);
    const newDoc = DocumentApp.openById(newFile.getId());

    // 4️⃣ 填充文字佔位符
    const body = newDoc.getBody();
    body.replaceText("{{申請日期}}", Utilities.formatDate(now, "GMT+8", "yyyy/MM/dd"));
    body.replaceText("{{填表人}}", keeperName);
    // 註：聯繫電話「02-26523580#710」和單據編號「（總務室填列）」已在模板中寫死

    // 5️⃣ 找到模板中的表格
    const tables = body.getTables();
    if (tables.length === 0) {
      throw new Error('模板中找不到表格！請確認模板包含表格結構。');
    }
    const targetTable = tables[0];  // 假設模板中只有一個表格

    // 6️⃣ 找到標記為 {{TEMPLATE_ROW}} 的行（數據範本行）
    let templateRowIndex = -1;
    for (let i = 0; i < targetTable.getNumRows(); i++) {
      const cellText = targetTable.getRow(i).getCell(0).getText();
      if (cellText.includes('{{TEMPLATE_ROW}}')) {
        templateRowIndex = i;
        break;
      }
    }

    if (templateRowIndex === -1) {
      throw new Error('找不到數據範本行標記 "{{TEMPLATE_ROW}}"！請確認模板表格格式正確。');
    }

    // 7️⃣ 動態插入數據列（方案 2：手動創建儲存格）
    Logger.log(`開始插入 ${assetsToTransfer.length} 筆數據`);

    // ⚠️ 診斷：檢查範本行的儲存格數量
    const templateRow = targetTable.getRow(templateRowIndex);
    const templateCellCount = templateRow.getNumCells();
    Logger.log(`範本行儲存格數量: ${templateCellCount}`);

    if (templateCellCount !== 9) {
      throw new Error(`範本行儲存格數量錯誤！預期 9 個，實際 ${templateCellCount} 個。請檢查模板中的 {{TEMPLATE_ROW}} 列。`);
    }

    // 使用手動創建儲存格的方式（適用於有合併儲存格的表格）
    assetsToTransfer.forEach((item, index) => {
      const asset = item.asset;
      const transfer = item.transfer;

      try {
        // 創建新行（空行）
        const newRow = targetTable.appendTableRow();

        // 準備 9 個欄位的數據
        const cellData = [
          (index + 1).toString(),           // 序號
          asset.assetId,                    // 財產編號
          asset.assetName || '',            // 財產名稱
          '核心設施',                        // 移出單位（固定）
          transfer.oldKeeper,               // 移出保管人
          transfer.oldLocation,             // 移出存置地點
          '核心設施',                        // 移入單位（固定）
          transfer.newKeeper,               // 移入保管人
          transfer.newLocation              // 移入存置地點
        ];

        // 複製範本行的儲存格樣式並填充數據
        for (let i = 0; i < cellData.length; i++) {
          // 1. 獲取對應的範本儲存格
          const templateCell = templateRow.getCell(i);
          
          // 2. 複製該儲存格 (保留樣式、邊框、對齊)
          const newCell = templateCell.copy();
          
          // 3. 設定文字內容 (保留段落樣式)
          // 嘗試獲取第一個段落並設定文字，如果沒有段落則直接設定儲存格文字
          if (newCell.getNumChildren() > 0 && newCell.getChild(0).getType() === DocumentApp.ElementType.PARAGRAPH) {
             newCell.getChild(0).asParagraph().setText(cellData[i]);
             // 移除可能存在的多餘段落 (如果範本儲存格有多行)
             while(newCell.getNumChildren() > 1) {
               newCell.removeChild(newCell.getChild(1));
             }
          } else {
             newCell.setText(cellData[i]);
          }

          // 4. 強制設定邊框 (確保黑色實線)
          // 使用 setAttributes 設定邊框樣式
          try {
            const style = {};
            style[DocumentApp.Attribute.BORDER_WIDTH] = 1; // 設定邊框寬度為 1pt
            style[DocumentApp.Attribute.BORDER_COLOR] = '#000000'; // 設定邊框顏色為黑色
            newCell.setAttributes(style);

            // Logger.log(`✓ 儲存格 ${i} 邊框設定成功`);
          } catch (borderError) {
            Logger.log(`⚠️ 儲存格 ${i} 邊框設定失敗: ${borderError.message}`);
          }

          // 5. 將處理好的儲存格加入新行
          newRow.appendTableCell(newCell);
        }

        // 註：序號置中對齊需要在模板中預先設定
        // Google Docs API 的 appendTableCell() 在表格有合併儲存格時
        // 可能無法正確支援某些樣式設定（如對齊），但邊框設定通常可以正常運作

        Logger.log(`✅ 第 ${index + 1} 行數據填充成功（${cellData.length} 個儲存格）`);
      } catch (e) {
        Logger.log(`❌ 填充第 ${index + 1} 行時發生錯誤: ${e.message}`);
        throw new Error(`填充數據時發生錯誤（第 ${index + 1} 筆）: ${e.message}`);
      }
    });

    // 8️⃣ 刪除範本行（因為已經複製完成）
    Logger.log(`刪除範本行（索引 ${templateRowIndex}）`);
    targetTable.removeRow(templateRowIndex);
    Logger.log(`✅ 成功刪除範本行`);

    // 9️⃣ 保存文件並取得URL
    newDoc.saveAndClose();
    const fileUrl = newFile.getUrl();

    // 🔟 回寫 DOC_URL 到資產表
    assetsToTransfer.forEach(item => {
      const asset = item.asset;
      const location = findAssetLocation(asset.assetId);
      if (location) {
        const indices = location.sheetName === PROPERTY_MASTER_SHEET_NAME
            ? PROPERTY_COLUMN_INDICES
            : ITEM_COLUMN_INDICES;

        location.sheet.getRange(location.rowIndex, indices.DOC_URL).setValue(fileUrl);
      }
    });

    Logger.log(`成功為 ${keeperName} 產生轉移記錄文件: ${fileUrl}`);
    return {
      fileUrl: fileUrl,
      assetIds: assetsToTransfer.map(item => item.asset.assetId)
    };

  } catch (e) {
    Logger.log(`createTransferDoc 失敗: ${e.message} at ${e.stack}`);
    throw new Error("產生轉移記錄文件時發生錯誤: " + e.message);
  }
}


// --- 除錯專用測試函式 ---
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
/**
 * [供 userstate.html 呼叫] 取消「轉移中」或「報廢中」的資產申請
 * @param {string} assetId - 要取消的財產編號
 * @returns {object} - 回傳 { success: true } 或 { success: false, error: '...' }
 */
function cancelTransferOrScrap(assetId) {
  try {
    const currentUserEmail = Session.getActiveUser().getEmail();
    const isAdmin = checkAdminPermissions();
    
    const allAssets = getAllAssets();
    const asset = allAssets.find(a => a.assetId === assetId);

    if (!asset) {
      throw new Error(`找不到財產編號為 ${assetId} 的資料。`);
    }

    // Security Check: Must be admin or the asset's owner (keeper or user)
    if (!isAdmin && asset.leaderEmail !== currentUserEmail && asset.userEmail !== currentUserEmail) {
      throw new Error("權限不足，只有此財產的保管人、使用人或管理員才能執行此操作。");
    }

    const originalStatus = asset.assetStatus;

    if (originalStatus === '轉移中' || originalStatus === '待接收') { 
      const location = findAssetLocation(assetId);
      if (!location) throw new Error(`在工作表中找不到資產 ${assetId} 的位置。`);

      // 1. Update asset status in main sheet
      const indices = location.sheetName === PROPERTY_MASTER_SHEET_NAME ? PROPERTY_COLUMN_INDICES : ITEM_COLUMN_INDICES;
      location.sheet.getRange(location.rowIndex, indices.ASSET_STATUS).setValue('在庫');
      
      // 2. Update status in APPLICATION_LOG_SHEET
      const appLogSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(APPLICATION_LOG_SHEET_NAME);
      const logData = appLogSheet.getRange(2, 1, appLogSheet.getLastRow() - 1, appLogSheet.getLastColumn()).getValues();
      
      // Find the last pending application for this asset and cancel it
      for (let i = logData.length - 1; i >= 0; i--) {
        const row = logData[i];
        const logAssetId = row[AL_ASSET_ID_COLUMN_INDEX - 1];
        const logStatus = row[AL_STATUS_COLUMN_INDEX - 1];
        if (logAssetId === assetId && (logStatus === '待接收' || logStatus === '轉移中')) {
          appLogSheet.getRange(i + 2, AL_STATUS_COLUMN_INDEX).setValue('已取消');
          break; // Cancel only the most recent one
        }
      }
      
    } else if (originalStatus === '報廢中') {
      const location = findAssetLocation(assetId);
      if (!location) throw new Error(`在工作表中找不到資產 ${assetId} 的位置。`);

      // 1. Update asset status in main sheet
      const indices = location.sheetName === PROPERTY_MASTER_SHEET_NAME ? PROPERTY_COLUMN_INDICES : ITEM_COLUMN_INDICES;
      location.sheet.getRange(location.rowIndex, indices.ASSET_STATUS).setValue('在庫');

      // 2. Clear the remarks and last modified date
      location.sheet.getRange(location.rowIndex, indices.REMARKS).setValue('');
      location.sheet.getRange(location.rowIndex, indices.LAST_MODIFIED).setValue('');

    } else {
      throw new Error(`此財產的狀態 (${originalStatus}) 無法被取消。`);
    }

    return { success: true };

  } catch (e) {
    Logger.log(`取消申請失敗 (assetId: ${assetId}): ${e.message} at ${e.stack}`);
    return { success: false, error: e.message };
  }
}