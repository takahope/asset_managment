// =================================================================
// --- 全域設定 (Global Settings) ---
// 所有功能都會使用此處的設定,請在此統一修改
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

// 在「軟體版本清單」工作表中的欄位
const SV_SEVENZIP_COLUMN_INDEX = 1; // 7zip 版本在 A 欄

// --- ✨ **新增：「出借紀錄」工作表中的欄位索引** ---
const LL_LEND_ID_COLUMN_INDEX = 1;
const LL_STATUS_COLUMN_INDEX = 9;
const LL_RETURN_DATE_COLUMN_INDEX = 7;

const PROPERTY_MASTER_SHEET_NAME = "財產總表"; // ✨ **拆分後：財產總表**
const ITEM_MASTER_SHEET_NAME = "物品總表";   // ✨ **拆分後：物品總表**
