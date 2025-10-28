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
const KEEPER_LOCATION_MAP_SHEET_NAME = "存放位置/信箱/保管人";
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
  PURCHASE_DATE: 5, // E欄: 取得日期
  USE_LIFE: 6,      // F欄: 使用年限
  ASSET_CATEGORY: 10, // J欄: 財產類別
  LOCATION: 14,      // H欄: 保管地點 (財產)
  LEADER_EMAIL: 15, // O欄: 駐管電子郵件
  LEADER_NAME: 16,  // P欄: 駐管
  ASSET_STATUS: 17, // Q欄: 財產狀態
  APPLICATION_TIME: 18, // R欄
  TRANSFER_TIME: 19,    // S欄
  IS_UPLOADED: 20,      // T欄
  UPLOAD_TIME: 21,      // U欄
  IS_COMPUTER: 22,      // V欄
  LAST_MODIFIED: 23,    // W欄
  REMARKS: 24,          // X欄
  DOC_URL: 25,          // Y欄
  IS_ACTUALLY_COMPUTER: 27 // AA欄
};

const ITEM_COLUMN_INDICES = {
  ASSET_ID: 1,      // A欄: 物品編號
  ASSET_NAME: 2,    // B欄: 物品名稱
  PURCHASE_DATE: 5, // E欄: 取得日期
  USE_LIFE: 6,      // F欄: 使用年限
  ASSET_CATEGORY: 10, // J欄: 財產類別
  LOCATION: 14,     // M欄: 保管地點 (物品)
  LEADER_EMAIL: 15, // O欄: 駐管電子郵件
  LEADER_NAME: 16,  // P欄: 駐管
  ASSET_STATUS: 17, // Q欄: 財產狀態
  APPLICATION_TIME: 18, // R欄
  TRANSFER_TIME: 19,    // S欄
  IS_UPLOADED: 20,      // T欄
  UPLOAD_TIME: 21,      // U欄
  IS_COMPUTER: 22,      // V欄
  LAST_MODIFIED: 23,    // W欄
  REMARKS: 24,          // X欄
  DOC_URL: 25,          // Y欄
  IS_ACTUALLY_COMPUTER: 27 // AA欄
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
    case 'userstate':
      template = HtmlService.createTemplateFromFile('userstate');
      title = "個人財產狀態查詢";
      break;
    default:
      // 預設顯示入口網站
      template = HtmlService.createTemplateFromFile('portal');
      title = "財產管理系統入口";
      break;
  }

  const html = template.evaluate();
  html.setTitle(title);
  return html;
}
function getUserStateData() {
  const currentUserEmail = Session.getActiveUser().getEmail();
  const isAdmin = checkAdminPermissions();

  const allData = getAllAssets();

  let filteredData;

  if (isAdmin) {
    filteredData = allData;
  } else {
    filteredData = allData.filter(asset => asset.leaderEmail === currentUserEmail);
  }

  const results = filteredData.map(asset => ({
    assetId: asset.assetId,
    assetName: asset.assetName,
    leader: asset.leaderName,
    leaderEmail: asset.leaderEmail, // ✨ Add leaderEmail
    location: asset.location,
    status: asset.assetStatus,
    category: asset.assetCategory
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
  const allAssets = getAllAssets();

  // 1. 從所有資產中，篩選出屬於當前使用者的、可轉移的資產
  const myAssets = allAssets
    .filter(asset => asset.leaderEmail === currentUserEmail && asset.assetStatus === '在庫')
    .map(asset => ({
      id: asset.assetId,
      assetName: asset.assetName,
      location: asset.location,
      category: asset.assetCategory
    }));

  // 2. 從所有資產中，提取不重複的保管人 (Email -> Name) 和地點
  const uniqueKeepersMap = new Map();
  const uniqueLocationsSet = new Set();

  allAssets.forEach(asset => {
    if (asset.leaderEmail && asset.leaderName) {
      if (!uniqueKeepersMap.has(asset.leaderEmail)) {
        uniqueKeepersMap.set(asset.leaderEmail, asset.leaderName);
      }
    }
    if (asset.location) {
      uniqueLocationsSet.add(asset.location);
    }
  });

  // 3. 將 Map 和 Set 轉換為前端需要的格式
  const keepers = {};
  uniqueKeepersMap.forEach((name, email) => {
    keepers[email] = name;
  });

  const locations = Array.from(uniqueLocationsSet).sort();

  // 4. 回傳整合後的資料
  return { 
    userEmail: currentUserEmail, 
    assets: myAssets, 
    keepers: keepers, 
    locations: locations 
  };
}

/**
 * [供 apply.html 呼叫] 處理前端提交的「批次」財產轉移申請 (高效能且安全版)
 * 使用批次讀取 + 分欄批次寫入，在保護公式的同時實現高效能。
 */
function processBatchTransferApplication(formData) {
  try {
    const { assetIds, newKeeperEmail, newLocation } = formData;
    if (!assetIds || assetIds.length === 0 || !newKeeperEmail || !newLocation) {
        throw new Error("提交的資料不完整，請至少勾選一筆財產並選擇保管人與地點。");
    }

    const allAssets = getAllAssets();
    const emailToNameMap = new Map(allAssets.map(asset => [asset.leaderEmail, asset.leaderName]));
    const newKeeperName = emailToNameMap.get(newKeeperEmail) || newKeeperEmail.split('@')[0];

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const appLogSheet = ss.getSheetByName(APPLICATION_LOG_SHEET_NAME);

    const now = new Date();
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
          location.sheet.getRange(location.rowIndex, indicesToUpdate.ASSET_STATUS).setValue("待接收");
          location.sheet.getRange(location.rowIndex, indicesToUpdate.APPLICATION_TIME).setValue(now);
          location.sheet.getRange(location.rowIndex, indicesToUpdate.IS_UPLOADED).setValue('');
          location.sheet.getRange(location.rowIndex, indicesToUpdate.UPLOAD_TIME).setValue('');
          location.sheet.getRange(location.rowIndex, indicesToUpdate.TRANSFER_TIME).setValue('');

          const appId = `APP-${now.getTime()}-${createdApplications.length}`;
          const newLogRow = [
            appId, now, asset.assetId,
            asset.leaderName, asset.location,
            newKeeperName, newLocation,
            "待接收", newKeeperEmail,
            "", ""
          ];
          newLogsToAdd.push(newLogRow);
          createdApplications.push({ id: asset.assetId });
        }
      }
    });

    if (createdApplications.length === 0) {
      throw new Error("處理失敗，勾選的財產可能已不存在或狀態不符 (非在庫)。");
    }
    
    if (newLogsToAdd.length > 0) {
      appLogSheet.getRange(appLogSheet.getLastRow() + 1, 1, newLogsToAdd.length, newLogsToAdd[0].length)
                 .setValues(newLogsToAdd);
    }

    const webAppUrl = getAppUrl();
    const reviewLink = `${webAppUrl}?page=review`;
    const subject = `[財產轉移通知] 您有 ${createdApplications.length} 筆待接收的財產`;
    let body = `您好 ${newKeeperName}，\n\n${Session.getActiveUser().getEmail()} 已申請將 ${createdApplications.length} 筆財產轉移給您。\n\n`;
    body += `請點擊下方連結，前往您的審核儀表板進行批次簽核：\n`;
    body += `${reviewLink}\n\n`;
    body += `此為系統自動發送郵件。`;
    
    MailApp.sendEmail(newKeeperEmail, subject, body);

    return `成功為 ${createdApplications.length} 筆財產提交申請！`;

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
    const assetIdToNameMap = new Map(allAssets.map(asset => [asset.assetId, asset.assetName]));
    
    const range = appLogSheet.getRange(2, 1, appLogSheet.getLastRow() - 1, appLogSheet.getLastColumn());
    const values = range.getValues();

    const pendingApprovals = values
      .filter(row => {
        const newLeaderEmail = row[AL_NEW_LEADER_EMAIL_COLUMN_INDEX - 1];
        const status = row[AL_STATUS_COLUMN_INDEX - 1];
        return newLeaderEmail === currentUserEmail && status === "待接收";
      })
      .map(row => {
        const assetId = row[AL_ASSET_ID_COLUMN_INDEX - 1];
        return {
          appId: row[AL_APP_ID_COLUMN_INDEX - 1],
          applyTime: new Date(row[AL_APP_TIME_COLUMN_INDEX - 1]).toLocaleString('zh-TW'),
          assetId: assetId,
          assetName: assetIdToNameMap.get(assetId) || '（找不到名稱）',
          oldKeeper: row[AL_OLD_LEADER_COLUMN_INDEX - 1],
          oldLocation: row[AL_OLD_LOCATION_COLUMN_INDEX - 1],
          newLocation: row[AL_NEW_LOCATION_COLUMN_INDEX - 1]
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
    const locationIsStationMap = new Map(locationData.map(row => [row[0], row[3]]));
    
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
          appLogSheet.getRange(appRowIndex, AL_STATUS_COLUMN_INDEX).setValue("已完成");
          appLogSheet.getRange(appRowIndex, AL_REVIEW_TIME_COLUMN_INDEX).setValue(now);
          
          const newLocation = appDetails.row[AL_NEW_LOCATION_COLUMN_INDEX - 1];
          const indices = location.sheetName === PROPERTY_MASTER_SHEET_NAME ? PROPERTY_COLUMN_INDICES : ITEM_COLUMN_INDICES;
          
          location.sheet.getRange(location.rowIndex, indices.LOCATION).setValue(newLocation);
          location.sheet.getRange(location.rowIndex, indices.ASSET_STATUS).setValue("在庫");
          location.sheet.getRange(location.rowIndex, indices.TRANSFER_TIME).setValue(now);

          const isStation = locationIsStationMap.get(newLocation) === '是';
          // IS_ACTUALLY_COMPUTER 欄位可能不存在於所有物件中，需要安全檢查
          const assetRow = location.sheet.getRange(location.rowIndex, 1, 1, location.sheet.getLastColumn()).getValues()[0];
          const isActuallyComputer = assetRow[indices.IS_ACTUALLY_COMPUTER - 1] === '是';
          const shouldBeMarked = isStation && isActuallyComputer;
          location.sheet.getRange(location.rowIndex, indices.IS_COMPUTER).setValue(shouldBeMarked ? '是' : '');
          
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
      if (adminEmails && adminEmails.length > 0) {
        const subject = `[系統通知] 有 ${successCount} 筆已完成轉移的財產待您更新`;
        let body = `您好，\n\n系統剛剛有 ${successCount} 筆財產轉移申請已被核准，請您執行後續的上傳更新作業。\n\n`;
        body += `您可以從試算表的「財產管理系統」選單進入「更新已轉移財產」頁面進行操作。\n\n此為系統自動發送郵件。`;
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

  const allAssets = getAllAssets();
  
  const assetsForUpload = [];
  const assetsForScrap = [];

  allAssets.forEach(asset => {
    // 條件一：篩選待上傳的項目
    if (asset.transferTime && asset.isUploaded !== 'V') {
      assetsForUpload.push({
        assetId: asset.assetId,
        location: asset.location,
        leader: asset.leaderName,
        transferDate: new Date(asset.transferTime).toLocaleDateString('zh-TW')
      });
    }

    // 條件二：篩選待報廢的項目
    if (asset.assetStatus === '報廢中') {
      assetsForScrap.push({
        assetId: asset.assetId,
        location: asset.location,
        leader: asset.leaderName,
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
    const allAssets = getAllAssets();

    // 1. 篩選出當前使用者可出借的資產
    const availableAssets = allAssets
      .filter(asset => asset.leaderEmail === currentUserEmail && asset.assetStatus === '在庫')
      .map(asset => ({
        id: asset.assetId,
        assetName: asset.assetName,
        leaderName: asset.leaderName,
        location: asset.location
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
    const currentUserEmail = Session.getActiveUser().getEmail();
    const allAssets = getAllAssets();

    const availableAssets = allAssets
      .filter(asset => {
        return asset.leaderEmail === currentUserEmail && (asset.assetStatus === '在庫' || asset.assetStatus === '出借中');
      })
      .map(asset => ({
        id: asset.assetId,
        location: asset.location,
        status: asset.assetStatus,
        category: asset.assetCategory
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
          successCount++;
        } else {
          Logger.log(`processBatchScrapping: 找不到資產 ${assetId}，跳過。`);
        }
      }
    });

    if (successCount === 0) {
      throw new Error("處理失敗，勾選的財產可能已在報廢流程中或狀態已變更。");
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

function getAllScrappableItems(assetCategory) {
  if (!checkAdminPermissions()) {
    return { error: "權限不足，您無法存取此功能。" };
  }
  try {
    const allAssets = getAllAssets();
    const items = [];
    allAssets.forEach(asset => {
      if (asset.assetStatus === '報廢中' && asset.assetCategory === assetCategory) {
        items.push({
          assetId: asset.assetId,
          assetName: asset.assetName,
          originalKeeper: asset.leaderName
        });
      }
    });
    return items;
  } catch (e) {
    Logger.log("getAllScrappableItems 失敗: " + e.message);
    throw new Error("讀取所有待報廢項目時發生錯誤。");
  }
}

function getAdminName() {
  const currentUserEmail = Session.getActiveUser().getEmail();
  const mappingSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(KEEPER_EMAIL_MAP_SHEET_NAME);
  const data = mappingSheet.getRange("A2:B" + mappingSheet.getLastRow()).getValues();
  const mapping = new Map(data.map(row => [row[1], row[0]])); // Email -> Name
  return mapping.get(currentUserEmail) || currentUserEmail; // 如果找不到，就回傳 Email
}

function getScrappingDataForAdmin(assetCategory) {
  const currentUserEmail = Session.getActiveUser().getEmail().toLowerCase();
  const adminEmails = getAdminEmails().map(email => email.toLowerCase());

  if (!adminEmails.includes(currentUserEmail)) {
    Logger.log(`權限阻擋：使用者 ${currentUserEmail} 嘗試存取管理員報廢清單。`);
    return { error: "權限不足，您無法存取此功能。" };
  }

  try {
    const allAssets = getAllAssets();
    
    const applicants = {};

    allAssets.forEach(asset => {
      if (asset.assetStatus === '報廢中' && asset.leaderName && asset.assetCategory === assetCategory) {
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
  try {
    const allAssets = getAllAssets();
    
    const applicants = {};

    allAssets.forEach(asset => {
      if (asset.assetStatus === '報廢中' && asset.leaderName && asset.assetCategory === assetCategory) {
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
    Logger.log("getScrappingApplicants 失敗: " + e.message);
    throw new Error("讀取待報廢清單時發生錯誤。");
  }
}

/**
 * [供 printScrap.html 呼叫] 為指定保管人產生一份彙整的報廢申請文件 (最終格式修正版)
 * 修正了數字格式、民國日期解析、以及已使用期間的計算問題。
 * @param {string} applicantName 要處理的保管人名稱
 * @returns {object} 包含新文件 URL 的物件 { fileUrl: '...' }
 */
function createScrapDoc(applicantName, assetCategory, assetIds) {
  const now = new Date();
  try {
    const allAssets = getAllAssets();
    const assetsToScrap = [];

    if (assetIds && assetIds.length > 0) {
      const assetIdSet = new Set(assetIds);
      allAssets.forEach(asset => {
        if (assetIdSet.has(asset.assetId)) {
          assetsToScrap.push(asset);
        }
      });
    } else {
      allAssets.forEach(asset => {
        if (asset.leaderName === applicantName && asset.assetStatus === '報廢中' && asset.assetCategory === assetCategory) {
          assetsToScrap.push(asset);
        }
      });
    }
    if (assetsToScrap.length === 0) throw new Error(`找不到 ${applicantName} 的待報廢財產。`);

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

    const tablePlaceholder = body.findText("{{報廢項目表格}}");
    if (!tablePlaceholder) {
      throw new Error('錯誤：在您的 Google Docs 範本文件中找不到 "{{報廢項目表格}}" 這個佔位符！');
    }
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
    return { fileUrl: fileUrl };

  } catch (e) {
    Logger.log(`createScrapDocForApplicant 失敗: ${e.message} at ${e.stack}`);
    throw new Error("產生報表文件時發生錯誤: " + e.message);
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

    // Security Check: Must be admin or the asset's owner
    if (!isAdmin && asset.leaderEmail !== currentUserEmail) {
      throw new Error("權限不足，只有此財產的保管人或管理員才能執行此操作。");
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
      
      // 2. Clear the remarks
      location.sheet.getRange(location.rowIndex, indices.REMARKS).setValue('');

    } else {
      throw new Error(`此財產的狀態 (${originalStatus}) 無法被取消。`);
    }

    return { success: true };

  } catch (e) {
    Logger.log(`取消申請失敗 (assetId: ${assetId}): ${e.message} at ${e.stack}`);
    return { success: false, error: e.message };
  }
}