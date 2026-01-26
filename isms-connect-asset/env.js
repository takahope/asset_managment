// ==========================================
// 環境設定 (Configuration)
// ==========================================

const CONFIG = {
  // 主資產試算表 ID（複用現有資產管理系統）
  ASSET_SPREADSHEET_ID: '1ChjQbozyd8ROoGDo',

  // 資訊資產試算表 ID（請替換為實際 ID）
  ISMS_SPREADSHEET_ID: 'YOUR_ISMS_SPREADSHEET_ID_HERE',

  // 工作表名稱
  PROPERTY_MASTER_SHEET_NAME: '財產總表',
  ITEM_MASTER_SHEET_NAME: '物品總表',
  ISMS_ASSET_SHEET_NAME: '資訊資產清單',
  MAPPING_SHEET_NAME: '資產對照表',

  // 管理員名單
  ADMIN_LIST_SHEET_NAME: '管理員名單'
};

// ==========================================
// 欄位索引設定
// ==========================================

// 財產總表欄位索引（複用主系統定義）
const PROPERTY_COLUMN_INDICES = {
  ASSET_ID: 1,      // A欄: 財產編號
  ASSET_NAME: 2,    // B欄: 財產名稱
  ASSET_ALIAS: 3,   // C欄: 財產別名
  MODEL_BRAND: 4,   // D欄: 型號/廠牌
  UNIT: 5,          // E欄: 單位
  PURCHASE_DATE: 6, // F欄: 取得日期
  USE_LIFE: 7,      // G欄: 使用年限
  LOCATION: 8,      // H欄: 保管地點
  ACCESSORY: 9,     // I欄: 附屬設備
  LEADER_NAME: 10,  // J欄: 保管人
  USER_NAME: 11,    // K欄: 使用人
  ASSET_CATEGORY: 12, // L欄: 財產類別
  LEADER_EMAIL: 13, // M欄: 保管人電子郵件
  USER_EMAIL: 14,   // N欄: 使用人電子郵件
  ASSET_STATUS: 15, // O欄: 財產狀態
  IS_IT_ASSET: 24,  // X欄: 是否為資訊資產
  IS_ISO_SCOPE: 26, // Z欄: 是否在ISO驗證範圍內
  DEFAULT_GROUP: 31 // AE欄: 預設組別
};

// 物品總表欄位索引
const ITEM_COLUMN_INDICES = {
  ASSET_ID: 1,      // A欄: 物品編號
  ASSET_NAME: 2,    // B欄: 物品名稱
  PRODUCT_SERIAL: 3, // C欄: 產品序號
  MODEL_BRAND: 4,   // D欄: 型號/廠牌
  PURCHASE_DATE: 5, // E欄: 取得日期
  USE_LIFE: 6,      // F欄: 使用年限
  UNIT: 7,          // G欄: 單位
  AMOUNT_TWD: 8,    // H欄: 台幣金額
  PURCHASE_ORDER: 9, // I欄: 申購單號
  ASSET_CATEGORY: 10, // J欄: 財產類別
  LEADER_NAME: 11,  // K欄: 保管人
  LOCATION: 13,     // M欄: 保管地點
  LEADER_EMAIL: 14, // N欄: 保管人電子郵件
  ASSET_STATUS: 15, // O欄: 財產狀態
  IS_IT_ASSET: 24,  // X欄: 是否為資訊資產
  IS_ISO_SCOPE: 26, // Z欄: 是否在ISO驗證範圍內
  DEFAULT_GROUP: 31 // AE欄: 預設組別
};

// 資訊資產欄位索引（依規格書 A~V 欄）
const ISMS_ASSET_COLUMN_INDICES = {
  ISMS_ASSET_ID: 1,      // A欄: 資訊資產編號
  CATEGORY: 2,           // B欄: 資訊資產類別
  NAME: 3,               // C欄: 資訊資產名稱
  DESCRIPTION: 4,        // D欄: 資訊資產說明
  QUANTITY: 5,           // E欄: 數量
  LOCATION: 6,           // F欄: 地點
  RESPONSIBLE_UNIT: 7,   // G欄: 權責單位
  MAIN_CATEGORY: 8,      // H欄: 主類別
  SUB_CATEGORY: 9,       // I欄: 子類別
  BRAND: 10,             // J欄: 品牌
  MODEL: 11,             // K欄: 型號
  VERSION: 12,           // L欄: 版本
  STATUS: 13,            // M欄: 狀態
  CENTER_CATEGORY: 14,   // N欄: 所中心調查分類
  CONFIDENTIALITY: 15,   // O欄: 機密性
  INTEGRITY: 16,         // P欄: 完整性
  AVAILABILITY: 17,      // Q欄: 可用性
  ASSET_VALUE: 18,       // R欄: 資產價值
  GROUP: 19,             // S欄: 組別
  SERIAL_NO: 20,         // T欄: 序號
  INVENTORY_COUNT: 21    // U欄: 已盤點數量
};

// 資產對照表欄位索引
const MAPPING_COLUMN_INDICES = {
  ASSET_ID: 1,           // A欄: 資產編號
  ISMS_ASSET_ID: 2,      // B欄: 資訊資產編號
  CREATED_TIME: 3,       // C欄: 建立時間
  CREATED_BY: 4,         // D欄: 建立人
  REMARKS: 5             // E欄: 備註
};
