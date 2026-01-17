/**
 * @fileoverview Gmail 自動回覆與轉寄處理器 (含儀表板後端)
 * @description 讀取郵件 -> 比對資產 -> 建立草稿 -> 寫入Log -> 提供儀表板資料。
 * @author Google Apps Script Expert
 */

// ==========================================
// 2. 網頁應用程式與設定 API (Web App & Settings)
// ==========================================

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Dashboard')
    .setTitle('資安預警即時儀表板')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * [前端專用] 獲取目前的所有設定狀態
 */
function getSystemSettings() {
  ensureSettingsSheetExists();
  const sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getSheetByName(CONFIG.SETTINGS_SHEET_NAME);
  // 讀取 A2:C2
  const values = sheet.getRange("A2:C2").getDisplayValues()[0];
  return {
    scanRead: values[0] === "是",
    autoDraft: values[1] === "是",
    chatNotify: values[2] === "是"
  };
}

/**
 * [前端專用] 更新設定
 * @param {string} key - 'scanRead' | 'autoDraft' | 'chatNotify'
 * @param {boolean} isEnabled 
 */
function updateSystemSetting(key, isEnabled) {
  const sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getSheetByName(CONFIG.SETTINGS_SHEET_NAME);
  const val = isEnabled ? "是" : "否";
  
  if (key === 'scanRead') sheet.getRange("A2").setValue(val);
  if (key === 'autoDraft') sheet.getRange("B2").setValue(val);
  if (key === 'chatNotify') sheet.getRange("C2").setValue(val);
  
  return { success: true };
}

/**
 * [前端專用] 獲取儀表板紀錄
 */
function getDashboardData() {
  try {
    const sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getSheetByName(CONFIG.LOG_SHEET_NAME);
    if (!sheet) return [];
    
    const lastRow = sheet.getLastRow();
    if (lastRow <= 1) return [];
    
    const startRow = Math.max(2, lastRow - 19);
    const numRows = lastRow - startRow + 1;
    
    // 讀取 5 欄: [Timestamp, Status, WarningName, MatchedAsset, Action]
    // 注意：原本是 4 欄，但下方我們新增了 Message ID 欄位 (在第6欄)，儀表板暫時只需前 5 欄顯示
    const values = sheet.getRange(startRow, 1, numRows, 5).getDisplayValues();
    return values.reverse(); 
  } catch (e) {
    console.error("獲取儀表板資料失敗: " + e.message);
    return [];
  }
}

// ==========================================
// 3. 主控制器 (Main Controller)
// ==========================================

function processIncomingEmails() {
  // 1. 讀取當前設定
  const settings = getSystemSettings();
  
  // 2. 構建搜尋語法
  let query = `from:${CONFIG.SENDER_B_EMAIL} subject:"${CONFIG.SUBJECT_KEYWORD}"`;
  
  // 如果設定 A2="是" (掃描已讀)，則不加 "is:unread"；否則預設只抓未讀
  if (!settings.scanRead) {
    query += ` is:unread`;
  }

  const threads = GmailApp.search(query);
  if (threads.length === 0) {
    console.log("目前沒有符合條件的信件。");
    return;
  }

  ensureLogSheetExists();
  const assetList = fetchComparisonData();
  
  // 3. 獲取已處理過的 Message IDs (防止 Scan Read 開啟時無限迴圈)
  const processedMessageIds = fetchProcessedMessageIds();

  threads.forEach(thread => {
    const messages = thread.getMessages();
    // 針對每一封信進行檢查 (因為 Thread 可能包含多封，若開啟 Scan Read，需精確判斷)
    messages.forEach(message => {
      // 檢查去重：如果 Message ID 已經在 Log 裡，絕對不處理
      if (processedMessageIds.has(message.getId())) {
        return;
      }
      
      // 如果設定只需未讀，但該信已讀 (雙重防護)，則跳過
      if (!settings.scanRead && !message.isUnread()) {
        return;
      }

      processSingleMessage(message, assetList, settings);
      
      // 標記為已讀 (雖然有 ID 去重，但保持良好的信箱衛生習慣)
      if (message.isUnread()) {
        GmailApp.markMessageRead(message);
      }
    });
  });
}

function processSingleMessage(message, assetList, settings) {
  const body = message.getPlainBody();
  const warningName = extractWarningName(body);
  const msgId = message.getId();
  
  if (!warningName) {
    const errorMsg = `無法提取警訊名稱`;
    console.warn(`${errorMsg} (ID: ${msgId})`);
    logExecutionResult('ERROR', '解析失敗', 'N/A', errorMsg, msgId);
    if (settings.chatNotify) sendToChat(`⚠️ 錯誤報告：${errorMsg}`);
    return; 
  }

  console.log(`提取到的警訊名稱: ${warningName}`);

  const matchedAsset = assetList.find(asset => 
    warningName.toLowerCase().includes(asset.toLowerCase())
  );

  if (matchedAsset) {
    let actionLog = '僅紀錄 (自動草稿已關閉)';
    // B2 檢查：自動草稿
    if (settings.autoDraft) {
      createDraftForPersonA(warningName, matchedAsset, message, settings); // 傳入 settings 以檢查 chat
      actionLog = '已建立通知草稿';
    } else if (settings.chatNotify) {
       // 即使不建立草稿，若命中資產且 Chat 開啟，還是通知一下比較好
       sendToChat(`🚨 **[資產命中] (草稿功能未啟用)**\n偵測資產：${matchedAsset}\n警訊名稱：${warningName}`);
    }
    
    logExecutionResult('ALERT', warningName, matchedAsset, actionLog, msgId);
    
  } else {
    let actionLog = '僅紀錄 (自動草稿已關閉)';
    // B2 檢查：自動草稿
    if (settings.autoDraft) {
      createDraftReplyToSenderB(warningName, message, settings);
      actionLog = '已建立回覆草稿';
    }
    
    logExecutionResult('SAFE', warningName, '無相關資產', actionLog, msgId);
  }
}

// ==========================================
// 4. 資料提取與資料庫服務
// ==========================================

function extractWarningName(text) {
  const regex = /警訊名稱[：:]\s*(.+)/i;
  const match = text.match(regex);
  return (match && match[1]) ? match[1].trim() : null; 
}

function fetchComparisonData() {
  try {
    const sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getSheetByName(CONFIG.SHEET_NAME);
    if (!sheet) throw new Error("找不到資產清單工作表");
    const lastRow = sheet.getLastRow();
    if (lastRow === 0) return [];
    return sheet.getRange(1, CONFIG.DATA_COLUMN_INDEX + 1, lastRow, 1)
      .getValues().flat().map(String).map(s => s.trim()).filter(s => s.length > 0);
  } catch (e) {
    console.error("讀取試算表失敗: " + e.message);
    return [];
  }
}

/**
 * [新增] 讀取所有已處理過的 Message ID
 */
function fetchProcessedMessageIds() {
  const ids = new Set();
  try {
    const sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getSheetByName(CONFIG.LOG_SHEET_NAME);
    if (!sheet) return ids;
    const lastRow = sheet.getLastRow();
    if (lastRow <= 1) return ids;
    
    // 假設 Message ID 在第 6 欄 (F欄)
    const data = sheet.getRange(2, 6, lastRow - 1, 1).getValues();
    data.flat().forEach(id => { if(id) ids.add(String(id)); });
  } catch (e) {
    console.error("讀取 Processed IDs 失敗: " + e.message);
  }
  return ids;
}

/**
 * 確保 Log Sheet 和 Settings Sheet 存在
 */
function ensureSettingsSheetExists() {
  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  
  // 檢查 Settings
  let settingSheet = ss.getSheetByName(CONFIG.SETTINGS_SHEET_NAME);
  if (!settingSheet) {
    settingSheet = ss.insertSheet(CONFIG.SETTINGS_SHEET_NAME);
    settingSheet.appendRow(['掃描已讀信件 (A2)', '開啟自動草稿 (B2)', '開啟Chat通知 (C2)']);
    settingSheet.appendRow(['否', '是', '是']); // 預設值
    console.log("已建立 Settings 工作表");
  }
}

function ensureLogSheetExists() {
  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  let sheet = ss.getSheetByName(CONFIG.LOG_SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.LOG_SHEET_NAME);
    // 新增 Message ID 欄位
    sheet.appendRow(['Timestamp', 'Status', 'Warning Name', 'Matched Asset', 'Action', 'Message ID']);
    sheet.setFrozenRows(1);
  }
}

/**
 * 寫入紀錄 (包含 Message ID)
 */
function logExecutionResult(status, warningName, asset, action, msgId) {
  try {
    const sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getSheetByName(CONFIG.LOG_SHEET_NAME);
    if (sheet) {
      const time = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss");
      sheet.appendRow([time, status, warningName, asset, action, msgId]);
    }
  } catch (e) {
    console.error("寫入 Log 失敗: " + e.message);
  }
}

// ==========================================
// 5. 通知與草稿服務
// ==========================================

function createDraftForPersonA(warningName, matchedAsset, originalMessage, settings) {
  const subject = `[資產風險警示] 發現內部資產 ${matchedAsset} 相關漏洞`;
  const body = `
    親愛的 A：
    
    系統檢測到最新的資安警訊與我方資產 "${matchedAsset}" 相關。
    警訊名稱：${warningName}
    
    請儘速確認並評估影響範圍。
    
    原始信件內容摘要：
    ${originalMessage.getPlainBody().substring(0, 300)}...
  `;
  
  GmailApp.createDraft(CONFIG.PERSON_A_EMAIL, subject, body);
  
  // C2 檢查：Chat 通知
  if (settings.chatNotify) {
    sendToChat(
      `🚨 **[資產命中] 已建立通知草稿**\n` +
      `偵測資產：${matchedAsset}\n` +
      `警訊名稱：${warningName}`
    );
  }
}

function createDraftReplyToSenderB(warningName, originalMessage, settings) {
  const replyBody = `
    您好，
    
    系統已收到漏洞預警通知：
    "${warningName}"
    
    經自動比對資產清單，目前我方無相關軟硬體資產，無需處理。
    感謝通知。
  `;
  
  originalMessage.getThread().createDraftReply(replyBody);
  
  // C2 檢查：Chat 通知
  if (settings.chatNotify) {
    sendToChat(
      `✅ **[無相關資產] 已建立回覆草稿**\n` +
      `警訊名稱：${warningName}`
    );
  }
}

function sendToChat(text) {
  if (!CONFIG.GOOGLE_CHAT_WEBHOOK_URL || CONFIG.GOOGLE_CHAT_WEBHOOK_URL.includes('YOUR_KEY')) {
    console.log("模擬 Chat 通知: " + text);
    return;
  }
  try {
    UrlFetchApp.fetch(CONFIG.GOOGLE_CHAT_WEBHOOK_URL, {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify({ text: text }),
      muteHttpExceptions: true
    });
  } catch (e) {
    console.error("Chat 通知失敗: " + e.message);
  }
}