// ==========================================
// 1. 全局設定 (Configuration)
// ==========================================
const CONFIG = {
  SENDER_B_EMAIL: 'asc.edu.tw',
  
  // [新增] 篩選信件標題的關鍵字
  SUBJECT_KEYWORD: '【漏警】',
  
  PERSON_A_EMAIL: 'eru.tw',
  SPREADSHEET_ID: '1uRyOZs-0g0GoQ7QMI', 
  SHEET_NAME: 'Sheet1', // 資產清單
  LOG_SHEET_NAME: 'SystemLogs', // [新增] 用於儲存比對紀錄的工作表名稱
  SETTINGS_SHEET_NAME: 'Settings', // [新增] 設定表
  DATA_COLUMN_INDEX: 0, 
  
  GOOGLE_CHAT_WEBHOOK_URL: 'https://chat.googleapis.com/v1/sp=AIzoggV4qis8',
  
  // 修改後的搜尋語法：同時檢查寄件者、標題關鍵字與未讀狀態
  getSearchQuery: function() {
    return `from:${this.SENDER_B_EMAIL} subject:"${this.SUBJECT_KEYWORD}" is:unread`;
  }
};