// =================================================================
// --- 全域設定 (Global Settings) ---
// 所有功能都會使用此處的設定，請在此統一修改
// =================================================================

// --- 工作表名稱設定 ---
// const COMPUTER_DATA_SHEET_NAME = "電腦資料財產總表"; // 這個工作表已不再需要
const MASTER_ASSET_LIST_SHEET_NAME = "財產總表"; // **所有資料的唯一來源**
const RESPONSE_SHEET_NAME = "表單回應 1"; // Web App 回報結果寫入的工作表
const SOFTWARE_VERSIONS_SHEET_NAME = "軟體版本清單"; // 軟體版本清單工作表
const APPLICATION_LOG_SHEET_NAME = "轉移申請紀錄";
const CUSTODIAN_MAPPING_SHEET_NAME = "存放位置/信箱/保管人";
const LENDING_LOG_SHEET_NAME = "出借紀錄"; // ✨ **新增：出借紀錄工作表**
const ADMIN_LIST_SHEET_NAME = "管理員名單"; // ✨ **新增：管理員權限列表**



// --- 欄位索引設定 (A欄是1, B欄是2, ...) ---

// --- 「財產總表」工作表中的欄位索引 (A欄是1, B欄是2, ...) ---
// --- 「財產總表」工作表中的欄位索引 (用於生成報表) ---
const MASTER_ASSET_ID_COLUMN_INDEX = 1;     // A欄: 財產編號(含分號)
const MASTER_ASSET_NAME_COLUMN_INDEX = 2;   // B欄: 財產名稱
const MASTER_PURCHASE_DATE_COLUMN_INDEX = 5;// E欄: 取得日期購置日期
const MASTER_USE_LIFE_COLUMN_INDEX = 6;     // F欄: 使用年限
const MASTER_ASSET_CATEGORY_COLUMN_INDEX = 10; // J欄: 財產類別
const MASTER_LOCATION_COLUMN_INDEX = 14;      // 保管位置
const MASTER_LEADER_EMAIL_COLUMN_INDEX = 15;  // 駐管電子郵件
const MASTER_LEADER_NAME_COLUMN_INDEX = 16;   // 駐管
const MASTER_ASSET_STATUS_COLUMN_INDEX = 17; // ✨ **新增：財產狀態**
const MASTER_APPLICATION_TIME_COLUMN_INDEX = 18; //
const MASTER_TRANSFER_TIME_COLUMN_INDEX = 19; // **新增：** 異動時間 (用來判斷轉移是否完成)
const MASTER_IS_UPLOADED_COLUMN_INDEX = 20;   // **新增：** 是否上傳
const MASTER_UPLOAD_TIME_COLUMN_INDEX = 21;   // **新增：** 上傳時間
const MASTER_IS_COMPUTER_COLUMN_INDEX = 22;   // ✨ **新增這一行 (是否為電腦)**
const MASTER_LAST_MODIFIED_COLUMN_INDEX = 23; // K欄
const MASTER_REMARKS_COLUMN_INDEX = 24;         // L欄
const MASTER_DOC_URL_COLUMN_INDEX = 25;        // M欄: ✨ **新增** 文件連結欄位


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
function getAppUrl() {
  return ScriptApp.getService().getUrl();
}

/**
 * [供 Index.html 呼叫] 獲取駐站與電腦的二級下拉選單資料 (修正並清理版)
 */
function getSelectData() {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(MASTER_ASSET_LIST_SHEET_NAME);
  const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, MASTER_IS_COMPUTER_COLUMN_INDEX).getValues();
  
  const dataMap = {};

  data.forEach(row => {
    // ✨ 核心修改：新增狀態過濾
    const status = row[MASTER_ASSET_STATUS_COLUMN_INDEX - 1];
    if (row[MASTER_IS_COMPUTER_COLUMN_INDEX - 1] === '是' && status !== '已報廢') {
      const group = row[MASTER_LOCATION_COLUMN_INDEX - 1];
      const computer = row[MASTER_ASSET_ID_COLUMN_INDEX - 1];
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
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const currentUserEmail = Session.getActiveUser().getEmail();
  const mappingSheet = ss.getSheetByName(CUSTODIAN_MAPPING_SHEET_NAME);
  const mappingData = mappingSheet.getRange(2, 1, mappingSheet.getLastRow() - 1, 3).getValues();
  const custodianMap = {};
  mappingData.forEach(row => {
    const location = row[0], email = row[1], name = row[2];
    if (email && name && location) {
      if (!custodianMap[email]) {
        custodianMap[email] = { name: name, locations: [] };
      }
      if (custodianMap[email].locations.indexOf(location) === -1) {
         custodianMap[email].locations.push(location);
      }
    }
  });
  // ✨ **修改點**
  const computerListSheet = ss.getSheetByName(MASTER_ASSET_LIST_SHEET_NAME);
  const computerData = computerListSheet.getRange(2, 1, computerListSheet.getLastRow() - 1, computerListSheet.getLastColumn()).getValues();
  
  const myAssets = computerData
    // ✨ 核心修改：狀態必須為「在庫」，排除「出借中」與「已報廢」
    .filter(row => row[MASTER_LEADER_EMAIL_COLUMN_INDEX - 1] === currentUserEmail && row[MASTER_ASSET_STATUS_COLUMN_INDEX - 1] === '在庫')
    .map(row => ({
      id: row[MASTER_ASSET_ID_COLUMN_INDEX - 1],
      location: row[MASTER_LOCATION_COLUMN_INDEX - 1]
    }));
  
  return { userEmail: currentUserEmail, assets: myAssets, custodianMap: custodianMap };
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

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const computerListSheet = ss.getSheetByName(MASTER_ASSET_LIST_SHEET_NAME);
    const appLogSheet = ss.getSheetByName(APPLICATION_LOG_SHEET_NAME);
    const mappingSheet = ss.getSheetByName(CUSTODIAN_MAPPING_SHEET_NAME);
    
    // 1. 一次性讀取所有需要的資料到記憶體中
    const computerListRange = computerListSheet.getRange(2, 1, computerListSheet.getLastRow() - 1, computerListSheet.getLastColumn());
    const computerData = computerListRange.getValues();
    const mappingData = mappingSheet.getRange(2, 1, mappingSheet.getLastRow() - 1, 3).getValues();
    
    // 2. 在記憶體中進行資料查找與準備
    // 建立一個 Map，方便快速透過 assetId 找到其在 computerData 陣列中的索引和原始列號
    const computerDataMap = new Map(computerData.map((row, index) => [
      row[MASTER_ASSET_ID_COLUMN_INDEX - 1].toString(), 
      { row, memoryIndex: index, sheetRowIndex: index + 2 } // 記住陣列索引和工作表列號
    ]));
    const newKeeperInfo = mappingData.find(row => row[1] === newKeeperEmail);
    if (!newKeeperInfo) throw new Error("在保管人清單中找不到 Email: " + newKeeperEmail);
    const newKeeperName = newKeeperInfo[2];

    const now = new Date();
    const newLogsToAdd = []; // 用於存放準備要新增到「申請紀錄」的所有新資料列
    const createdApplications = [];

    // ✨ **修改核心：不再直接修改 computerData 陣列，而是使用精準更新**
    assetIds.forEach(assetId => {
      const assetDetails = computerDataMap.get(assetId.toString());
      // 確保財產存在且狀態為「在庫」
      if (assetDetails && assetDetails.row[MASTER_ASSET_STATUS_COLUMN_INDEX - 1] === '在庫') {
        const sheetRow = assetDetails.sheetRowIndex; // 取得該財產在工作表中的實際列號

        // 3. ✨ **執行精準的單點更新**
        // 使用 .setValue() 直接更新目標儲存格，而不是修改記憶體中的陣列
        computerListSheet.getRange(sheetRow, MASTER_APPLICATION_TIME_COLUMN_INDEX).setValue(now);
        computerListSheet.getRange(sheetRow, MASTER_IS_UPLOADED_COLUMN_INDEX).setValue('');
        computerListSheet.getRange(sheetRow, MASTER_UPLOAD_TIME_COLUMN_INDEX).setValue('');
        computerListSheet.getRange(sheetRow, MASTER_TRANSFER_TIME_COLUMN_INDEX).setValue(''); 
        
        // --- 以下準備「申請紀錄」資料的邏輯不變 ---
        const assetRow = assetDetails.row;
        const oldLocation = assetRow[MASTER_LOCATION_COLUMN_INDEX - 1];
        const oldKeeperName = assetRow[MASTER_LEADER_NAME_COLUMN_INDEX - 1];
        const appId = `APP-${now.getTime()}-${createdApplications.length}`;
        
        const newLogRow = [
          appId, now, assetId,
          oldKeeperName, oldLocation,
          newKeeperName, newLocation,
          "待接收", newKeeperEmail,
          "", ""
        ];
        newLogsToAdd.push(newLogRow);
        createdApplications.push({ id: assetId });
      }
    });

    if (createdApplications.length === 0) {
      throw new Error("處理失敗，勾選的財產可能已不存在或狀態不符 (非在庫)。");
    }

    // 4. ✨ **移除原本複寫整張表的 setValues**
    // computerListRange.setValues(computerData); // <--- 這行危險的程式碼已被移除並替換為上面的迴圈內更新
    
    // 新增所有「申請紀錄」
    if (newLogsToAdd.length > 0) {
      appLogSheet.getRange(appLogSheet.getLastRow() + 1, 1, newLogsToAdd.length, newLogsToAdd[0].length)
                 .setValues(newLogsToAdd);
    }

    // 5. 寄送通知信 (邏輯不變)
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
  Logger.log("--- getPendingApprovals 函式開始執行 ---");
  const startTime = new Date();

  try {
    const currentUserEmail = Session.getActiveUser().getEmail();
    Logger.log(`步驟 1: 獲取當前使用者 Email: ${currentUserEmail}`);

    const appLogSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(APPLICATION_LOG_SHEET_NAME);
    Logger.log(`步驟 2: 連接到 "${APPLICATION_LOG_SHEET_NAME}" 工作表。`);
    
    const range = appLogSheet.getRange(2, 1, appLogSheet.getLastRow() - 1, appLogSheet.getLastColumn());
    const values = range.getValues();
    const readEndTime = new Date();
    Logger.log(`步驟 3: 一次性讀取 ${values.length} 筆資料完成。耗時: ${(readEndTime - startTime) / 1000} 秒。`);

    const pendingApprovals = values
      .filter(row => row[AL_NEW_LEADER_EMAIL_COLUMN_INDEX - 1] === currentUserEmail && row[AL_STATUS_COLUMN_INDEX - 1] === "待接收")
      .map(row => ({
        appId: row[0],
        applyTime: new Date(row[1]).toLocaleString('zh-TW'),
        assetId: row[2],
        oldKeeper: row[3],
        oldLocation: row[4],
        newLocation: row[6]
      }));
    
    const processEndTime = new Date();
    Logger.log(`步驟 4: 在記憶體中過濾與轉換資料完成，共找到 ${pendingApprovals.length} 筆待審核項目。耗時: ${(processEndTime - readEndTime) / 1000} 秒。`);
    Logger.log(`--- getPendingApprovals 函式執行完畢，總耗時: ${(processEndTime - startTime) / 1000} 秒 ---`);
    
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
  Logger.log("\n\n--- processBatchApproval (終極偵錯版) 開始執行 ---");
  Logger.log(`接收到 ${appIds.length} 個待處理 AppID: [${appIds.slice(0, 5).join(", ")}...]`); // 只顯示前5個，避免日誌過長

  if (!appIds || appIds.length === 0) { 
    Logger.log("錯誤：appIds 陣列為空，提前終止。");
    return "您沒有選擇任何項目。"; 
  }

  try {
    // --- 準備階段 ---
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const appLogSheet = ss.getSheetByName(APPLICATION_LOG_SHEET_NAME);
    const computerListSheet = ss.getSheetByName(MASTER_ASSET_LIST_SHEET_NAME);
    
    Logger.log("步驟 1: 開始一次性讀取所有資料...");
    const appLogData = appLogSheet.getRange(2, 1, appLogSheet.getLastRow(), appLogSheet.getLastColumn()).getValues();
    const computerData = computerListSheet.getRange(2, 1, computerListSheet.getLastRow(), computerListSheet.getLastColumn()).getValues();
    Logger.log(` -> 「申請紀錄」讀取了 ${appLogData.length} 筆。`);
    Logger.log(` -> 「應回報電腦清單」讀取了 ${computerData.length} 筆。`);

    Logger.log("\n步驟 2: 建立 Map 查找表 (強制將 Key 轉為字串)...");
    
    // ✨ **核心修正點 1：建立 Map 時，將所有 Key 都轉換為字串**
    const computerDataMap = new Map(computerData.map((row, index) => [
      row[MASTER_ASSET_ID_COLUMN_INDEX - 1].toString(), 
      { row, index: index + 2 }
    ]));
    
    // (appLogMap 保持原樣，因為我們是從中讀取而不是用它來查找)
    const appLogMap = new Map(appLogData.map((row, index) => [row[AL_APP_ID_COLUMN_INDEX - 1], { row, index: index + 2 }]));
    Logger.log(` -> computerDataMap 建立完成，大小為: ${computerDataMap.size}`);

    // --- 處理階段 ---
    const now = new Date();
    let successCount = 0;
    const approvedAssetIds = [];
    const errors = [];

    Logger.log("\n步驟 3: === 開始遍歷從前端傳來的 appIds 陣列 ===");
    appIds.forEach(appId => {
      // 為每一次迴圈印出詳細的檢查過程
      Logger.log(`\n  [處理中] 前端傳來的 AppID: "${appId}" (類型: ${typeof appId})`);
      
      const appDetails = appLogMap.get(appId);
      
      // ✨ 核心偵錯點：我們將在這裡看到所有關鍵資訊
      if (appDetails) {
        Logger.log(`    -> ✅ 匹配成功! 在 Map 中找到了這筆申請。`);
        const statusInSheet = appDetails.row[AL_STATUS_COLUMN_INDEX - 1];
        Logger.log(`    -> 其在工作表中的狀態為: "${statusInSheet}" (類型: ${typeof statusInSheet})`);

        if (statusInSheet === "待接收") {
          Logger.log(`    -> ✅ 狀態匹配成功! 準備開始更新工作表...`);
          
          const assetId = appDetails.row[AL_ASSET_ID_COLUMN_INDEX - 1];
          const computerDetails = computerDataMap.get(assetId);

          if (computerDetails) {
            // 這是成功的路徑
            const appRowIndex = appDetails.index;
            appLogSheet.getRange(appRowIndex, AL_STATUS_COLUMN_INDEX).setValue("已完成");
            appLogSheet.getRange(appRowIndex, AL_REVIEW_TIME_COLUMN_INDEX).setValue(now);
            
            const computerRowIndex = computerDetails.index;
            const newLocation = appDetails.row[AL_NEW_LOCATION_COLUMN_INDEX - 1];
            computerListSheet.getRange(computerRowIndex, MASTER_LOCATION_COLUMN_INDEX).setValue(newLocation);
            computerListSheet.getRange(computerRowIndex, MASTER_TRANSFER_TIME_COLUMN_INDEX).setValue(now);
            
            successCount++;
            approvedAssetIds.push(assetId);
            Logger.log(`    -> [成功] 此筆 ${appId} 已更新完畢。`);
          } else {
             const errorMessage = `找不到財產編號 ${assetId}`;
             errors.push(errorMessage);
             Logger.log(`    -> [錯誤] 雖然找到申請紀錄，但在財產總表中找不到財產 ${assetId}。`);
          }
        } else {
          const errorMessage = `申請ID ${appId} 的狀態不符`;
          errors.push(errorMessage);
          Logger.log(`    -> [跳過] 狀態為 "${statusInSheet}"，不為 "待接收"，因此無法處理。`);
        }
      } else {
        const errorMessage = `申請ID ${appId} 可能已被處理或不存在`;
        errors.push(errorMessage);
        Logger.log(`    -> [錯誤] 匹配失敗! 在 appLogMap 中找不到 AppID: "${appId}"。`);
      }
    });
    Logger.log("=== 迴圈處理結束 ===");
    
    // --- 結果回報階段 ---
    // (後續寄信和回傳邏輯不變，僅加上日誌)
    if (successCount > 0) {
        const adminEmails = getAdminEmails();
        if (adminEmails && adminEmails.length > 0) {
            Logger.log(`\n步驟 4: 準備寄送通知信給 ${adminEmails.length} 位管理員...`);
      const subject = `[系統通知] 有 ${successCount} 筆已完成轉移的財產待您更新`;
      let body = `您好，\n\n系統剛剛有 ${successCount} 筆財產轉移申請已被核准，請您執行後續的上傳更新作業。\n\n`;
      body += `您可以從試算表的「財產管理系統」選單進入「更新已轉移財產」頁面進行操作。\n\n此為系統自動發送郵件。`;
      MailApp.sendEmail(adminEmails.join(','), subject, body); // ✨ **修改點**
      Logger.log(" -> 通知信已寄送。");
        }
    }

    let message = `成功核准 ${successCount} 筆申請。`;
    if (errors.length > 0) {
      message += `\n失敗或跳過 ${errors.length} 筆。`;
    }
    Logger.log(`\n--- processBatchApproval 函式執行完畢，最終回傳訊息: "${message.replace(/\n/g, " ")}" ---`);
    return message;

  } catch (e) {
    Logger.log(`!!!!!! processBatchApproval 發生嚴重錯誤 !!!!!!`);
    Logger.log(`錯誤訊息: ${e.message}`);
    Logger.log(`錯誤堆疊: ${e.stack}`);
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

  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(MASTER_ASSET_LIST_SHEET_NAME);
  const values = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues();
  
  const assetsForUpload = [];
  const assetsForScrap = [];

  values.forEach(row => {
    const assetStatus = row[MASTER_ASSET_STATUS_COLUMN_INDEX - 1];
    
    // 條件一：篩選待上傳的項目
    const transferTime = row[MASTER_TRANSFER_TIME_COLUMN_INDEX - 1];
    const isUploaded = row[MASTER_IS_UPLOADED_COLUMN_INDEX - 1];
    if (transferTime && isUploaded !== 'V') {
      assetsForUpload.push({
        assetId: row[MASTER_ASSET_ID_COLUMN_INDEX - 1],
        location: row[MASTER_LOCATION_COLUMN_INDEX - 1],
        leader: row[MASTER_LEADER_NAME_COLUMN_INDEX - 1],
        transferDate: new Date(transferTime).toLocaleDateString('zh-TW')
      });
    }

    // 條件二：篩選待報廢的項目
    if (assetStatus === '報廢中') {
      assetsForScrap.push({
        assetId: row[MASTER_ASSET_ID_COLUMN_INDEX - 1],
        location: row[MASTER_LOCATION_COLUMN_INDEX - 1],
        leader: row[MASTER_LEADER_NAME_COLUMN_INDEX - 1],
        scrapReason: row[MASTER_REMARKS_COLUMN_INDEX - 1]
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
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(MASTER_ASSET_LIST_SHEET_NAME);
    const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues();
    const now = new Date();
    let updatedCount = 0;

    // 建立一個資產編號到列索引的映射，以提高效率
    const assetIdToRowIndex = {};
    data.forEach((row, index) => {
      assetIdToRowIndex[row[MASTER_ASSET_ID_COLUMN_INDEX - 1]] = index + 2; // +2 for 1-based index and header
    });

    assetIds.forEach(id => {
      const rowIndex = assetIdToRowIndex[id];
      if (rowIndex) {
        // 更新 "是否上傳" 和 "上傳時間" 兩個欄位
        sheet.getRange(rowIndex, MASTER_IS_UPLOADED_COLUMN_INDEX).setValue('V');
        sheet.getRange(rowIndex, MASTER_UPLOAD_TIME_COLUMN_INDEX).setValue(now);
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
  const computerListSheet = ss.getSheetByName(MASTER_ASSET_LIST_SHEET_NAME);
  const responseSheet = ss.getSheetByName(RESPONSE_SHEET_NAME);

  // 讀取範圍擴大到 I 欄
  const allRequiredData = computerListSheet.getRange(2, 1, computerListSheet.getLastRow() - 1, MASTER_IS_COMPUTER_COLUMN_INDEX).getValues();
  
  // ✨ **新增的過濾條件：只篩選出需要回報的電腦**
  const requiredComputers = allRequiredData.filter(row => row[MASTER_IS_COMPUTER_COLUMN_INDEX - 1] === '是');

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

  // 使用過濾後的 requiredComputers 陣列來進行檢查
  for (const row of requiredComputers) {
    const computerName = row[MASTER_ASSET_ID_COLUMN_INDEX - 1];
    const groupName = row[MASTER_LOCATION_COLUMN_INDEX - 1];
    const leaderEmail = row[MASTER_LEADER_EMAIL_COLUMN_INDEX - 1];

    if (computerName) {
      const computerNameStr = String(computerName).trim();
      if (computerNameStr && !submittedComputers.has(computerNameStr)) {
        const missingInfo = ` - 駐站: ${groupName}, 電腦: ${computerNameStr}`;
        allMissingForAdmin.push(missingInfo);
        if (leaderEmail) {
          if (!remindersForLeaders[leaderEmail]) {
            remindersForLeaders[leaderEmail] = [];
          }
          remindersForLeaders[leaderEmail].push(missingInfo);
        }
      }
    }
  }

  // 後續寄送郵件的邏輯維持不變
  const subjectDate = `${currentYear}年${currentMonth + 1}月`;
  for (const leaderEmail in remindersForLeaders) {
    if (remindersForLeaders[leaderEmail].length > 0) {
      const subject = `[自動通知] ${subjectDate} 駐站有電腦尚未回報狀態`;
      let body = `您好，\n\n截至目前，駐站尚有以下電腦未透過表單回報本月份狀態：\n` + remindersForLeaders[leaderEmail].join("\n") + `\n\n請協助處理。\n\n此為系統自動發送郵件。`;
      MailApp.sendEmail(leaderEmail, subject, body);
    }
  }

  if (allMissingForAdmin.length > 0) {
    // ✨ **修改點：從呼叫新函式來取得收件人列表**
    const reportAdmins = getReportAdmins();
    
    if (reportAdmins && reportAdmins.length > 0) {
      const subject = `[自動通知] ${subjectDate} 未回報電腦總清單`;
      let body = `您好，\n\n截至目前，本月份尚有以下所有電腦未回報狀態：\n\n` + allMissingForAdmin.join("\n") + `\n\n系統已同步寄送通知給相關駐管。\n\n此為系統自動發送郵件。`;
      
      // ✨ **修改點：將 Email 陣列用逗號串接，一次寄給所有管理員**
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
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const currentUserEmail = Session.getActiveUser().getEmail();
    
    // 1. 獲取使用者名下「在庫」的資產清單 (邏輯不變)
    const computerListSheet = ss.getSheetByName(MASTER_ASSET_LIST_SHEET_NAME);
    const computerData = computerListSheet.getRange(2, 1, computerListSheet.getLastRow() - 1, computerListSheet.getLastColumn()).getValues();
    const availableAssets = computerData
      .filter(row => row[MASTER_LEADER_EMAIL_COLUMN_INDEX - 1] === currentUserEmail && row[MASTER_ASSET_STATUS_COLUMN_INDEX - 1] === '在庫')
      .map(row => ({
        id: row[MASTER_ASSET_ID_COLUMN_INDEX - 1],
        location: row[MASTER_LOCATION_COLUMN_INDEX - 1]
      }));
      
    // ✨ **新增：獲取所有可能的借用人名單**
    // 我們從 CUSTODIAN_MAPPING_SHEET_NAME (駐站/信箱/駐管) 來取得最完整的人員名單
    const mappingSheet = ss.getSheetByName(CUSTODIAN_MAPPING_SHEET_NAME);
    const mappingData = mappingSheet.getRange(2, 1, mappingSheet.getLastRow() - 1, 3).getValues();
    
    const borrowers = {}; // 使用物件來自動處理重複的名字
    mappingData.forEach(row => {
        const name = row[2];
        if (name) {
            borrowers[name.trim()] = true; // key 是姓名，value 不重要
        }
    });
    
    // 將物件的 key (不重複的姓名) 轉為陣列並排序
    const borrowerList = Object.keys(borrowers).sort((a, b) => a.localeCompare(b, 'zh-Hant'));

    // 2. 回傳整合後的資料
    return { 
        assets: availableAssets,
        borrowers: borrowerList // 新增回傳借用人列表
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
    const { assetIds, borrowerName, returnDate, reason } = formData;
    if (!assetIds || assetIds.length === 0 || !borrowerName || !returnDate) {
      throw new Error("資料不完整，請至少勾選一筆財產並填寫借用人和預計歸還日期。");
    }

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const computerListSheet = ss.getSheetByName(MASTER_ASSET_LIST_SHEET_NAME);
    const lendingLogSheet = ss.getSheetByName(LENDING_LOG_SHEET_NAME);
    
    const computerData = computerListSheet.getRange(2, 1, computerListSheet.getLastRow() - 1, computerListSheet.getLastColumn()).getValues();
    const computerDataMap = new Map(computerData.map((row, index) => [row[MASTER_ASSET_ID_COLUMN_INDEX - 1], { row, index: index + 2 }]));

    const now = new Date();
    const currentUser = Session.getActiveUser().getEmail();
    let successCount = 0;

    assetIds.forEach(assetId => {
      const assetDetails = computerDataMap.get(assetId);
      // 雙重確認該資產仍為「在庫」狀態
      if (assetDetails && assetDetails.row[MASTER_ASSET_STATUS_COLUMN_INDEX - 1] === '在庫') {
        const assetRowIndex = assetDetails.index;
        
        // 1. 更新「應回報電腦清單」的財產狀態
        computerListSheet.getRange(assetRowIndex, MASTER_ASSET_STATUS_COLUMN_INDEX).setValue('出借中');

        // 2. 在「出借紀錄」中新增一筆紀錄
        const lendId = `LEND-${now.getTime()}-${successCount}`;
        const originalKeeperName = assetDetails.row[MASTER_LEADER_NAME_COLUMN_INDEX - 1];
        
        lendingLogSheet.appendRow([
          lendId, now, assetId, originalKeeperName,
          borrowerName, new Date(returnDate), "", // 實際歸還日期留空
          reason, "出借中"
        ]);
        successCount++;
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
        const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(LENDING_LOG_SHEET_NAME);
        const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues();

        const computerListSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(MASTER_ASSET_LIST_SHEET_NAME);
        const computerData = computerListSheet.getRange(2, 1, computerListSheet.getLastRow() - 1, MASTER_LEADER_EMAIL_COLUMN_INDEX).getValues();
        const computerKeeperMap = new Map(computerData.map(row => [row[MASTER_ASSET_ID_COLUMN_INDEX - 1], row[MASTER_LEADER_EMAIL_COLUMN_INDEX - 1]]));

        const lentAssets = data
            .filter(row => {
                const assetId = row[2];
                const keeperEmail = computerKeeperMap.get(assetId);
                return keeperEmail === currentUserEmail && row[LL_STATUS_COLUMN_INDEX - 1] === '出借中';
            })
            .map(row => ({
                lendId: row[0],
                applyTime: new Date(row[1]).toLocaleDateString('zh-TW'),
                assetId: row[2],
                borrower: row[4],
                expectedReturnDate: new Date(row[5]).toLocaleDateString('zh-TW'),
                reason: row[7]
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
        const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
        const computerListSheet = ss.getSheetByName(MASTER_ASSET_LIST_SHEET_NAME);
        const lendingLogSheet = ss.getSheetByName(LENDING_LOG_SHEET_NAME);
        
        const lendingData = lendingLogSheet.getRange(2, 1, lendingLogSheet.getLastRow() - 1, lendingLogSheet.getLastColumn()).getValues();
        const lendingMap = new Map(lendingData.map((row, index) => [row[LL_LEND_ID_COLUMN_INDEX - 1], { row, index: index + 2 }]));

        const computerData = computerListSheet.getRange(2, 1, computerListSheet.getLastRow() - 1, computerListSheet.getLastColumn()).getValues();
        const computerDataMap = new Map(computerData.map((row, index) => [row[MASTER_ASSET_ID_COLUMN_INDEX - 1], { row, index: index + 2 }]));

        const now = new Date();
        let successCount = 0;

        lendIds.forEach(lendId => {
            const lendDetails = lendingMap.get(lendId);
            if (lendDetails && lendDetails.row[LL_STATUS_COLUMN_INDEX - 1] === '出借中') {
                const assetId = lendDetails.row[2];
                const computerDetails = computerDataMap.get(assetId);

                // 1. 更新「出借紀錄」
                const lendRowIndex = lendDetails.index;
                lendingLogSheet.getRange(lendRowIndex, LL_STATUS_COLUMN_INDEX).setValue('已歸還');
                lendingLogSheet.getRange(lendRowIndex, LL_RETURN_DATE_COLUMN_INDEX).setValue(now);
                
                // 2. 更新「應回報電腦清單」
                if (computerDetails) {
                    const computerRowIndex = computerDetails.index;
                    computerListSheet.getRange(computerRowIndex, MASTER_ASSET_STATUS_COLUMN_INDEX).setValue('在庫');
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
// --- ✨ 全新功能模組：財產報廢 ✨ ---
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
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(MASTER_ASSET_LIST_SHEET_NAME);
    const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues();

    const availableAssets = data
      .filter(row => {
        const status = row[MASTER_ASSET_STATUS_COLUMN_INDEX - 1];
        // 只有「在庫」或「出借中」的財產才能被申請報廢
        return row[MASTER_LEADER_EMAIL_COLUMN_INDEX - 1] === currentUserEmail && (status === '在庫' || status === '出借中');
      })
      .map(row => ({
        id: row[MASTER_ASSET_ID_COLUMN_INDEX - 1],
        location: row[MASTER_LOCATION_COLUMN_INDEX - 1],
        status: row[MASTER_ASSET_STATUS_COLUMN_INDEX - 1],
        category: row[MASTER_ASSET_CATEGORY_COLUMN_INDEX - 1]
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

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const computerListSheet = ss.getSheetByName(MASTER_ASSET_LIST_SHEET_NAME);
    
    const computerData = computerListSheet.getRange(2, 1, computerListSheet.getLastRow() - 1, computerListSheet.getLastColumn()).getValues();
    const computerDataMap = new Map(computerData.map((row, index) => [row[MASTER_ASSET_ID_COLUMN_INDEX - 1], { row, index: index + 2 }]));

    const now = new Date();
    let successCount = 0;
    const fullReason = reason === '其他' ? `其他: ${remarks}` : `${reason} ${remarks}`;

    assetIds.forEach(assetId => {
      const assetDetails = computerDataMap.get(assetId);
      const currentStatus = assetDetails ? assetDetails.row[MASTER_ASSET_STATUS_COLUMN_INDEX - 1] : '';

      if (assetDetails && currentStatus !== '已報廢' && currentStatus !== '報廢中') {
        const assetRowIndex = assetDetails.index;
        
        // ✨ **核心修改點：將狀態更新為「報廢中」**
        computerListSheet.getRange(assetRowIndex, MASTER_ASSET_STATUS_COLUMN_INDEX).setValue('報廢中');
        computerListSheet.getRange(assetRowIndex, MASTER_LAST_MODIFIED_COLUMN_INDEX).setValue(now);
        computerListSheet.getRange(assetRowIndex, MASTER_REMARKS_COLUMN_INDEX).setValue(fullReason);
        
        successCount++;
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
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const computerListSheet = ss.getSheetByName(MASTER_ASSET_LIST_SHEET_NAME);
    
    const computerData = computerListSheet.getRange(2, 1, computerListSheet.getLastRow() - 1, computerListSheet.getLastColumn()).getValues();
    const computerDataMap = new Map(computerData.map((row, index) => [row[MASTER_ASSET_ID_COLUMN_INDEX - 1], { row, index: index + 2 }]));

    const now = new Date();
    let successCount = 0;

    assetIds.forEach(assetId => {
      const assetDetails = computerDataMap.get(assetId);
      // 確保該資產確實處於「報廢中」狀態
      if (assetDetails && assetDetails.row[MASTER_ASSET_STATUS_COLUMN_INDEX - 1] === '報廢中') {
        const assetRowIndex = assetDetails.index;
        
        // 將狀態從「報廢中」更新為「已報廢」，並更新備註
        computerListSheet.getRange(assetRowIndex, MASTER_ASSET_STATUS_COLUMN_INDEX).setValue('已報廢');
        const originalReason = assetDetails.row[MASTER_REMARKS_COLUMN_INDEX - 1];
        computerListSheet.getRange(assetRowIndex, MASTER_REMARKS_COLUMN_INDEX).setValue(originalReason.replace('[報廢申請]', '[報廢完成]'));
        computerListSheet.getRange(assetRowIndex, MASTER_LAST_MODIFIED_COLUMN_INDEX).setValue(now); // 再次更新異動日期
        
        successCount++;
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
    Logger.log("從快取中成功讀取管理員名單。");
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

/**
 * [供 printScrap.html 呼叫] 取得所有狀態為「報廢中」的財產，並按保管人分組
 * @returns {Array<Object>} 回傳一個陣列，包含 { applicant: '保管人名稱', count: 報廢數量 }
 */
function getScrappingApplicants(assetCategory) {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(MASTER_ASSET_LIST_SHEET_NAME);
    if (!sheet) return [];
    
    const dataRange = sheet.getRange(2, 1, sheet.getLastRow() - 1, Math.max(MASTER_ASSET_STATUS_COLUMN_INDEX, MASTER_ASSET_CATEGORY_COLUMN_INDEX));
    const values = dataRange.getValues();
    
    const applicants = {}; // 使用物件來分組

    values.forEach(row => {
      const status = row[MASTER_ASSET_STATUS_COLUMN_INDEX - 1];
      const applicantName = row[MASTER_LEADER_NAME_COLUMN_INDEX - 1];
      const category = row[MASTER_ASSET_CATEGORY_COLUMN_INDEX - 1];
      
      if (status === '報廢中' && applicantName && category === assetCategory) {
        if (applicants[applicantName]) {
          applicants[applicantName]++;
        } else {
          applicants[applicantName] = 1;
        }
      }
    });

    // 將物件轉換為前端需要的陣列格式
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
function createScrapDocForApplicant(applicantName, assetCategory) {
  const now = new Date();
  try {

    // --- 2. 取得資料 (邏輯不變) ---
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const computerListSheet = ss.getSheetByName(MASTER_ASSET_LIST_SHEET_NAME);
    const masterSheet = ss.getSheetByName(MASTER_ASSET_LIST_SHEET_NAME);

    const computerListData = computerListSheet.getDataRange().getValues();
    const assetsToScrap = [];
    for (let i = 1; i < computerListData.length; i++) {
      const row = computerListData[i];
      if (row[MASTER_LEADER_NAME_COLUMN_INDEX - 1] === applicantName && row[MASTER_ASSET_STATUS_COLUMN_INDEX - 1] === '報廢中' && row[MASTER_ASSET_CATEGORY_COLUMN_INDEX - 1] === assetCategory) {
        assetsToScrap.push({
          assetId: row[MASTER_ASSET_ID_COLUMN_INDEX - 1],
          rowIndex: i + 1,
          // 直接讀取 L 欄的報廢原因備註
          scrapReason: row[MASTER_REMARKS_COLUMN_INDEX - 1] 
        });
      }
    }
    if (assetsToScrap.length === 0) throw new Error(`找不到 ${applicantName} 的待報廢財產。`);

    const masterData = masterSheet.getRange(2, 1, masterSheet.getLastRow() - 1, Math.max(MASTER_USE_LIFE_COLUMN_INDEX, MASTER_PURCHASE_DATE_COLUMN_INDEX)).getValues();
    const masterDataMap = new Map(masterData.map(row => [row[MASTER_ASSET_ID_COLUMN_INDEX - 1], row]));

    // --- 3. 複製與替換表頭 (邏輯不變) ---
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

    // --- 4. 準備並插入表格 ---
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
      const assetInfo = masterDataMap.get(asset.assetId.trim());
      if (assetInfo) {
        
        // --- ✨ 核心修正點 2：處理民國年日期 & 計算已使用期間 ---
        let purchaseDateStr = (assetInfo[MASTER_PURCHASE_DATE_COLUMN_INDEX - 1] || '').toString();
        Logger.log('Original purchaseDateStr: ' + purchaseDateStr);
        purchaseDateStr = purchaseDateStr.split('\n')[0].trim(); // 清理可能的換行符

        let purchaseDate = null;
        let years = 'N/A';
        let months = 'N/A';
        let purchaseDateFormatted = '無日期資料';

        if (purchaseDateStr.includes('GMT')) {
            purchaseDate = new Date(purchaseDateStr);
            const originalYear = purchaseDate.getFullYear();
            purchaseDate.setFullYear(originalYear + 11);
        } else {
            const dateParts = purchaseDateStr.match(/(\d+)\/(\d+)\/(\d+)/);
            if (dateParts) {
                const minguoYear = parseInt(dateParts[1], 10);
                const gregorianYear = minguoYear + 1911;
                const monthJs = parseInt(dateParts[2], 10) - 1; // JavaScript 的月份是 0-11
                const day = parseInt(dateParts[3], 10);
                purchaseDate = new Date(gregorianYear, monthJs, day);
            }
        }

        if (purchaseDate && !isNaN(purchaseDate.getTime())) {
             purchaseDateFormatted = Utilities.formatDate(purchaseDate, "GMT+8", "yyyy/MM/dd");
             // 重新計算正確的已使用期間
             const monthsUsed = (now.getFullYear() - purchaseDate.getFullYear()) * 12 + (now.getMonth() - purchaseDate.getMonth());
             years = Math.floor(monthsUsed / 12);
             months = monthsUsed % 12;
        }

        // --- ✨ 核心修正點 3：格式化數字為整數字串 ---
        const serialNumber = (index + 1).toString(); // 序號轉字串
        const usefulLifeRaw = assetInfo[MASTER_USE_LIFE_COLUMN_INDEX - 1];
        // 使用 parseInt 確保得到整數，再轉為字串
        const usefulLife = !isNaN(parseInt(usefulLifeRaw)) ? parseInt(usefulLifeRaw).toString() : (usefulLifeRaw || '');

        // ✨ **核心修改點：直接使用從 L 欄讀取到的原因，不再進行任何解析**
        const reasonCode = asset.scrapReason || ''; // 如果 L 欄是空的，就填入空字串

        const rowData = [
          serialNumber,
          asset.assetId.trim(),
          assetInfo[MASTER_ASSET_NAME_COLUMN_INDEX - 1],
          purchaseDateFormatted,
          usefulLife,
          `${years}/${months}`, // 正確的已使用期間
          reasonCode // 直接使用從 L 欄讀取的值
        ];
        tableValues.push(rowData);
      }
    });
      
    const newTable = body.insertTable(insertIndex, tableValues);
    const headerRowStyle = {};
    headerRowStyle[DocumentApp.Attribute.BOLD] = true;
    newTable.getRow(0).setAttributes(headerRowStyle);

    // --- 5. 儲存並回寫連結 (邏輯不變) ---
    newDoc.saveAndClose();
    const fileUrl = newFile.getUrl();
    
    assetsToScrap.forEach(asset => {
    //  computerListSheet.getRange(asset.rowIndex, MASTER_ASSET_STATUS_COLUMN_INDEX).setValue("報廢完成");
      computerListSheet.getRange(asset.rowIndex, MASTER_DOC_URL_COLUMN_INDEX).setValue(fileUrl);
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
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(MASTER_ASSET_LIST_SHEET_NAME);
  const firstDataEmail = sheet.getRange("C2").getValue(); // 取得第一筆資料的 Email

  Logger.log("系統偵測到您登入的 Email 是：" + currentUserEmail);
  Logger.log("工作表中第一筆財產的保管人 Email 是：" + firstDataEmail);

  if (currentUserEmail === firstDataEmail) {
    Logger.log("比對結果：相符！");
  } else {
    Logger.log("比對結果：不相符！請檢查這兩個 Email 是否有差異。");
  }
}