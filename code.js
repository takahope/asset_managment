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
const SCRAP_LOG_SHEET_NAME = "報廢紀錄"; // ✨ **新增：報廢紀錄工作表**
const ADMIN_LIST_SHEET_NAME = "管理員名單"; // ✨ **新增：管理員權限列表**
const INVENTORY_LOG_SHEET_NAME = "盤點紀錄"; // ✨ **新增：資產盤點紀錄工作表**
const INVENTORY_DETAIL_SHEET_NAME = "盤點明細"; // ✨ **新增：資產盤點明細工作表**


// --- 欄位索引設定 (A欄是1, B欄是2, ...) ---

// ✨ **V2 架構：已棄用** - 改用下面的物件導向索引
// const MASTER_ASSET_ID_COLUMN_INDEX = 1;
// ... (其他舊的 MASTER_ 常數)

// ✨ **V3 架構：物件導向欄位索引** ✨
const PROPERTY_COLUMN_INDICES = {
  ASSET_ID: 1,      // A欄: 財產編號
  ASSET_NAME: 2,    // B欄: 財產名稱
  ASSET_ALIAS: 3,   // C欄: 財產別名
  MODEL_BRAND: 4,   // D欄: 型號/廠牌
  UNIT: 5,          // E欄: 單位
  PURCHASE_DATE: 6, // F欄: 取得日期
  USE_LIFE: 7,      // G欄: 使用年限
  ASSET_CATEGORY: 12, // L欄: 財產類別
  LOCATION: 8,      // H欄: 保管地點 (財產)
  ACCESSORY: 9,     // I欄: 附屬設備
  LEADER_EMAIL: 13, // M欄: 保管人電子郵件
  LEADER_NAME: 10,  // J欄: 保管人
  USER_NAME: 11,    // K欄: 使用人
  USER_EMAIL: 14,   // N欄: 使用人電子郵件 ✨ 新增
  ASSET_STATUS: 15, // O欄: 財產狀態 (原N欄)
  APPLICATION_TIME: 16, // P欄: 申請時間 (原O欄)
  TRANSFER_TIME: 17,    // Q欄: 接收時間 (原P欄)
  IS_UPLOADED: 18,      // R欄: 是否上傳 (原Q欄)
  UPLOAD_TIME: 19,      // S欄: 上傳時間 (原R欄)
  IS_COMPUTER: 20,      // T欄: 是否為駐站電腦 (原S欄)
  LAST_MODIFIED: 21,    // U欄: 報廢日期 (原T欄)
  REMARKS: 22,          // V欄: 報廢原因 (原U欄)
  DOC_URL: 23,          // W欄: 報廢申請文件 (原V欄)
  IS_IT_ASSET: 24,      // X欄: 是否為資訊資產
  IS_ACTUALLY_COMPUTER: 25, // Y欄: 是否為電腦 (原X欄)
  IS_ISO_SCOPE: 26,     // Z欄: 是否在ISO驗證範圍內
  NOTES: 30,            // AD欄: 備註
  DEFAULT_GROUP: 31,    // AE欄: 預設組別
  ISMS_ASSET_ID: 32,    // AF欄: 對應資訊資產編號
  PROPERTY_CATEGORY: 33 // AG欄: 財產區分（科研基金 / 公務用_一般 等）
};

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
  IS_IT_ASSET: 24,      // X欄 是否為資訊資產
  IS_ACTUALLY_COMPUTER: 25, // Y欄 是否為電腦
  IS_ISO_SCOPE: 26,     // Z欄 是否在ISO驗證範圍內
  NOTES: 30,            // AD欄: 備註
  DEFAULT_GROUP: 31,    // AE欄: 預設組別
  ISMS_ASSET_ID: 32     // AF欄: 對應資訊資產編號
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
const AL_DOC_URL_COLUMN_INDEX = 18;  // R 欄：轉移文件連結

// --- ✨ **新增：「盤點紀錄」工作表中的欄位索引** ---
const IL_INVENTORY_ID_COLUMN_INDEX = 1;        // A欄: 盤點ID
const IL_INVENTORY_DATE_COLUMN_INDEX = 2;      // B欄: 盤點日期
const IL_INVENTORY_PERSON_COLUMN_INDEX = 3;    // C欄: 盤點人
const IL_INVENTORY_EMAIL_COLUMN_INDEX = 4;     // D欄: 盤點人Email
const IL_INVENTORY_FILTER_COLUMN_INDEX = 5;    // E欄: 盤點範圍 (篩選條件)
const IL_VERIFIED_COUNT_COLUMN_INDEX = 6;      // F欄: 已盤點數量
const IL_TOTAL_COUNT_COLUMN_INDEX = 7;         // G欄: 總數量
const IL_STATUS_COLUMN_INDEX = 8;              // H欄: 狀態
const IL_COMPLETION_TIME_COLUMN_INDEX = 9;     // I欄: 完成時間
const IL_SUMMARY_COLUMN_INDEX = 10;            // J欄: 篩選條件摘要（系統類別 + 範圍 + 分派）

// --- ✨ **新增：「盤點明細」工作表中的欄位索引** ---
const ID_INVENTORY_ID_COLUMN_INDEX = 1;        // A欄: 盤點ID
const ID_ASSET_ID_COLUMN_INDEX = 2;            // B欄: 財產編號
const ID_INVENTORY_RESULT_COLUMN_INDEX = 3;    // C欄: 盤點結果
const ID_REMARKS_COLUMN_INDEX = 4;             // D欄: 備註
const ID_VERIFICATION_TIME_COLUMN_INDEX = 5;   // E欄: 盤點時間
const ID_VERIFIED_BY_COLUMN_INDEX = 6;         // F欄: 盤點人
const ID_ASSIGNED_USER_COLUMN_INDEX = 7;       // G欄: 指派人員

// --- ✨ **新增：ISMS 資訊資產欄位索引** ---
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
  STATUS: 13,            // M欄: 狀態
  CONFIDENTIALITY: 15,   // O欄: 機密性
  INTEGRITY: 16,         // P欄: 完整性
  AVAILABILITY: 17,      // Q欄: 可用性
  ASSET_VALUE: 18,       // R欄: 資產價值
  GROUP: 19,             // S欄: 組別代號
  SERIAL_NO: 20,         // T欄: 流水號
  INVENTORY_COUNT: 21,   // U欄: 已盤點數量
  BUSINESS_PROCESS: 22   // V欄: 業務流程
};

// ISMS 資產對照表欄位索引
const ISMS_MAPPING_COLUMN_INDICES = {
  ASSET_ID: 1,           // A欄: 資產編號
  ISMS_ASSET_ID: 2,      // B欄: 資訊資產編號
  CREATED_TIME: 3,       // C欄: 建立時間
  CREATED_BY: 4,         // D欄: 建立人
  REMARKS: 5             // E欄: 備註
};

// 在「軟體版本清單」工作表中的欄位
const SV_SEVENZIP_COLUMN_INDEX = 1; // 7zip 版本在 A 欄

// --- ✨ **新增：「出借紀錄」工作表中的欄位索引** ---
const LL_LEND_ID_COLUMN_INDEX = 1;
const LL_LEND_TIME_COLUMN_INDEX = 2;
const LL_ASSET_ID_COLUMN_INDEX = 3;
const LL_LENDER_EMAIL_COLUMN_INDEX = 4;  // ✨ D 欄：出借人 Email
const LL_BORROWER_NAME_COLUMN_INDEX = 5;
const LL_EXPECTED_RETURN_DATE_COLUMN_INDEX = 6;
const LL_STATUS_COLUMN_INDEX = 9;
const LL_RETURN_DATE_COLUMN_INDEX = 7;
const LL_REASON_COLUMN_INDEX = 8;
const LL_LENDING_LOCATION_COLUMN_INDEX = 10;
const LL_BORROWER_TYPE_COLUMN_INDEX = 11; // ✨ 借用類型（內部/外部）
const LL_CONTACT_PHONE_COLUMN_INDEX = 12; // ✨ 聯絡電話
const LL_DOC_URL_COLUMN_INDEX = 13; // ✨ 出借申請單文件連結
const LL_PRINT_TIME_COLUMN_INDEX = 14; // ✨ 列印時間

// --- ✨ **新增：「報廢紀錄」工作表中的欄位索引** ---
const SL_SCRAP_ID_COLUMN_INDEX = 1;
const SL_APPLY_TIME_COLUMN_INDEX = 2;
const SL_ASSET_ID_COLUMN_INDEX = 3;
const SL_APPLICANT_EMAIL_COLUMN_INDEX = 4;
const SL_KEEPER_NAME_COLUMN_INDEX = 5;
const SL_USER_NAME_COLUMN_INDEX = 6;
const SL_LOCATION_COLUMN_INDEX = 7;
const SL_ASSET_CATEGORY_COLUMN_INDEX = 8;
const SL_ASSET_NAME_COLUMN_INDEX = 9;
const SL_MODEL_BRAND_COLUMN_INDEX = 10;
const SL_SCRAP_REASON_COLUMN_INDEX = 11;
const SL_STATUS_COLUMN_INDEX = 12;
const SL_UPDATE_TIME_COLUMN_INDEX = 13;
const SL_APPROVER_EMAIL_COLUMN_INDEX = 14;
const SL_DOC_URL_COLUMN_INDEX = 15;
const SL_PRINT_TIME_COLUMN_INDEX = 16;

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
      assetAlias: indices.ASSET_ALIAS ? row[indices.ASSET_ALIAS - 1] : null,
      productSerial: indices.PRODUCT_SERIAL ? row[indices.PRODUCT_SERIAL - 1] : null,
      modelBrand: row[indices.MODEL_BRAND - 1] || '',
      unit: indices.UNIT ? row[indices.UNIT - 1] : null,
      amountTwd: indices.AMOUNT_TWD ? row[indices.AMOUNT_TWD - 1] : null,
      purchaseOrder: indices.PURCHASE_ORDER ? row[indices.PURCHASE_ORDER - 1] : null,
      purchaseDate: row[indices.PURCHASE_DATE - 1],
      useLife: row[indices.USE_LIFE - 1],
      assetCategory: row[indices.ASSET_CATEGORY - 1],
      location: row[indices.LOCATION - 1],
      accessory: indices.ACCESSORY ? row[indices.ACCESSORY - 1] : null,
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
      isItAsset: row[indices.IS_IT_ASSET - 1],
      isActuallyComputer: row[indices.IS_ACTUALLY_COMPUTER - 1],
      isIsoScope: row[indices.IS_ISO_SCOPE - 1],
      ismsAssetId: indices.ISMS_ASSET_ID ? row[indices.ISMS_ASSET_ID - 1] : '',
      defaultGroup: indices.DEFAULT_GROUP ? row[indices.DEFAULT_GROUP - 1] : null,
      propertyCategory: indices.PROPERTY_CATEGORY ? (row[indices.PROPERTY_CATEGORY - 1] || '') : '',
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

function buildAssetAliasFields_(asset) {
  return {
    assetAlias: String(asset?.assetAlias || ''),
    productSerial: String(asset?.productSerial || ''),
    sourceSheet: String(asset?.sourceSheet || '')
  };
}

function createEmptyInventoryAssetContext_(assetId) {
  return {
    assetId: String(assetId || '').trim(),
    assetName: '',
    assetAlias: '',
    productSerial: '',
    keeperName: '',
    userName: '',
    modelBrand: '',
    unit: '',
    purchaseDate: '',
    useLife: '',
    location: '',
    accessory: '',
    originalStatus: '',
    status: '',
    isItAsset: '',
    isIsoScope: '',
    ismsAssetId: '',
    sourceSheet: ''
  };
}

function buildInventoryAssetContextMap_(assetIds) {
  const normalizedIds = Array.from(new Set((assetIds || [])
    .map(id => String(id || '').trim())
    .filter(Boolean)));
  const contextMap = {};

  if (normalizedIds.length === 0) {
    return contextMap;
  }

  const assetIdSet = {};
  normalizedIds.forEach(id => {
    assetIdSet[id] = true;
    contextMap[id] = createEmptyInventoryAssetContext_(id);
  });

  const allAssets = getAllAssets();
  allAssets.forEach(asset => {
    const assetId = String(asset.assetId || '').trim();
    if (!assetId || !assetIdSet[assetId]) return;
    contextMap[assetId] = {
      assetId: assetId,
      assetName: String(asset.assetName || ''),
      assetAlias: String(asset.assetAlias || ''),
      productSerial: String(asset.productSerial || ''),
      keeperName: String(asset.leaderName || ''),
      userName: String(asset.userName || ''),
      modelBrand: String(asset.modelBrand || ''),
      unit: String(asset.unit || ''),
      purchaseDate: asset.purchaseDate || '',
      useLife: String(asset.useLife || ''),
      location: String(asset.location || ''),
      accessory: String(asset.accessory || ''),
      originalStatus: String(asset.assetStatus || ''),
      status: String(asset.assetStatus || ''),
      isItAsset: String(asset.isItAsset || ''),
      isIsoScope: String(asset.isIsoScope || ''),
      ismsAssetId: String(asset.ismsAssetId || ''),
      sourceSheet: String(asset.sourceSheet || '')
    };
  });

  const ismsMappingResult = getIsmsMappingForAssets(normalizedIds);
  const ismsMappings = ismsMappingResult && ismsMappingResult.success && ismsMappingResult.mappings
    ? ismsMappingResult.mappings
    : {};

  normalizedIds.forEach(assetId => {
    const mapping = ismsMappings[assetId] || {};
    if (mapping.isItAsset && !contextMap[assetId].isItAsset) {
      contextMap[assetId].isItAsset = String(mapping.isItAsset || '');
    }
    if (mapping.ismsAssetId) {
      contextMap[assetId].ismsAssetId = String(mapping.ismsAssetId || '');
    }
  });

  return contextMap;
}

/**
 * ✨ [系統功能] 檢查是否啟用「同組代理轉移」功能
 * 透過「管理員名單」工作表 D2 儲存格控制
 * @returns {boolean} true = 啟用，false = 停用
 */
function isGroupProxyTransferEnabled() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const adminSheet = ss.getSheetByName(ADMIN_LIST_SHEET_NAME);

    if (!adminSheet) {
      Logger.log('找不到管理員名單工作表，預設關閉同組代理轉移功能');
      return false;
    }

    // 讀取 D2 儲存格
    const d2Value = adminSheet.getRange('D2').getValue();
    const isEnabled = String(d2Value).trim() === '是';

    Logger.log(`同組代理轉移功能狀態: ${isEnabled ? '啟用' : '停用'} (D2=${d2Value})`);
    return isEnabled;

  } catch (error) {
    Logger.log(`isGroupProxyTransferEnabled 錯誤: ${error.message}`);
    return false; // 發生錯誤時預設關閉
  }
}

/**
 * 轉移類型正規化：移除代理標記與原保管人註記，方便權限判斷
 * @param {string} transferType 原始轉移類型
 * @returns {string} 正規化後的轉移類型
 */
function normalizeTransferType_(transferType) {
  const raw = String(transferType || '').trim();
  if (!raw) return '';
  let normalized = raw.replace(/^【[^】]+】/, '');
  normalized = normalized.replace(/（原保管人：.*?）/g, '');
  return normalized.trim();
}

/**
 * 判斷使用者是否可審核/接收某筆轉移（含同組代理）
 * @param {Object} options
 * @returns {boolean}
 */
function canApproveTransfer_(options) {
  const currentUserEmailLower = String(options.currentUserEmailLower || '').toLowerCase();
  const newLeaderEmailLower = String(options.newLeaderEmailLower || '').toLowerCase();
  const newUserEmailLower = String(options.newUserEmailLower || '').toLowerCase();
  const groupProxyEnabled = Boolean(options.groupProxyEnabled);
  const groupEmailSet = options.groupEmailSet || null;
  const normalizedTransferType = normalizeTransferType_(options.transferType);

  let canApprove = false;
  if (normalizedTransferType === '保管人+使用人') {
    canApprove = currentUserEmailLower === newLeaderEmailLower || currentUserEmailLower === newUserEmailLower;
  } else if (normalizedTransferType === '使用人') {
    canApprove = currentUserEmailLower === newUserEmailLower;
  } else {
    canApprove = currentUserEmailLower === newLeaderEmailLower;
  }

  if (canApprove) return true;
  if (!groupProxyEnabled || !groupEmailSet) return false;

  if (normalizedTransferType === '保管人+使用人') {
    return groupEmailSet.has(newLeaderEmailLower) || groupEmailSet.has(newUserEmailLower);
  }
  if (normalizedTransferType === '使用人') {
    return groupEmailSet.has(newUserEmailLower);
  }
  return groupEmailSet.has(newLeaderEmailLower);
}

/**
 * ✨ NEW: 獲取當前使用者相關的所有資產 (無論是保管人或使用人)。
 * 當 D2 = "是" 時，會自動包含同組所有成員的資產
 * @returns {Array<Object>} 包含所有相關資產物件的陣列。
 */
function getAssetsForCurrentUser() {
  const currentUserEmail = Session.getActiveUser().getEmail();
  const normalizedCurrentEmail = String(currentUserEmail).toLowerCase().trim();

  // ✨ 檢查是否啟用同組代理功能
  const groupProxyEnabled = isGroupProxyTransferEnabled();

  let targetEmails = [normalizedCurrentEmail]; // 預設只查詢自己的資產

  if (groupProxyEnabled) {
    // ✨ 啟用同組代理：取得同組所有成員的 Email
    const groupMemberEmails = getGroupMemberEmails(currentUserEmail);

    if (groupMemberEmails && groupMemberEmails.length > 0) {
      targetEmails = groupMemberEmails.map(email => String(email).toLowerCase().trim());
      Logger.log(`同組代理模式啟用：包含 ${targetEmails.length} 位成員的資產`);
    } else {
      Logger.log('未找到同組成員，僅顯示自己的資產');
    }
  }

  // 取得所有資產
  const allAssets = getAllAssets();

  // 篩選：保管人或使用人是目標 Email 集合中的任一個
  const userAssets = allAssets.filter(asset => {
    const leaderEmail = String(asset.leaderEmail || '').toLowerCase().trim();
    const userEmail = String(asset.userEmail || '').toLowerCase().trim();

    return targetEmails.includes(leaderEmail) || targetEmails.includes(userEmail);
  });

  Logger.log(`getAssetsForCurrentUser: 為 ${currentUserEmail} 找到 ${userAssets.length} 筆相關資產 (同組代理: ${groupProxyEnabled})`);
  return userAssets;
}

/**
 * 取得指定使用者的同組成員 Email 清單（包含自己）
 * @param {string} targetEmail 使用者 Email
 * @returns {string[]} 同組成員 Email 陣列（小寫化）
 */
function getGroupMemberEmails(targetEmail) {
  const normalizedTarget = String(targetEmail || '').toLowerCase().trim();
  if (!normalizedTarget) return [];

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const keeperEmailSheet = ss.getSheetByName(KEEPER_EMAIL_MAP_SHEET_NAME);
  if (!keeperEmailSheet || keeperEmailSheet.getLastRow() <= 1) {
    return [normalizedTarget];
  }

  const keeperData = keeperEmailSheet.getRange(2, 1, keeperEmailSheet.getLastRow() - 1, 7).getValues();
  const emailToGroupMap = {};
  const groupToMembersMap = {};

  keeperData.forEach(row => {
    const email = row[1];
    if (!email) return;
    const normalizedEmail = String(email).toLowerCase().trim();
    const groupName = row[6] ? String(row[6]).trim() : '';
    if (!groupName) return;
    emailToGroupMap[normalizedEmail] = groupName;
    if (!groupToMembersMap[groupName]) {
      groupToMembersMap[groupName] = [];
    }
    groupToMembersMap[groupName].push(normalizedEmail);
  });

  const groupName = emailToGroupMap[normalizedTarget];
  if (!groupName) {
    return [normalizedTarget];
  }

  const members = groupToMembersMap[groupName] || [];
  const uniqueMembers = new Set(members);
  uniqueMembers.add(normalizedTarget);
  return Array.from(uniqueMembers);
}

/**
 * 取得目前使用者的組別與 ISMS 盤點白名單權限
 * G欄：使用者組別
 * H欄：允許使用 ISMS 盤點的組別
 * 管理員永遠可用，不受 H 欄限制
 * @param {SpreadsheetApp.Spreadsheet} ss
 * @param {string} currentUserEmail
 * @param {boolean} isAdmin
 * @returns {{ currentUserGroup: string, allowedIsmsGroups: string[], canUseIsmsInventory: boolean }}
 */
function getIsmsInventoryAccess_(ss, currentUserEmail, isAdmin) {
  const normalizedEmail = String(currentUserEmail || '').toLowerCase().trim();
  let currentUserGroup = '未分組';
  const allowedIsmsGroupSet = new Set();

  const keeperEmailSheet = ss.getSheetByName(KEEPER_EMAIL_MAP_SHEET_NAME);
  if (keeperEmailSheet && keeperEmailSheet.getLastRow() > 1) {
    const keeperData = keeperEmailSheet.getRange(2, 1, keeperEmailSheet.getLastRow() - 1, 8).getValues();
    keeperData.forEach(row => {
      const email = row[1];
      const groupName = row[6] ? String(row[6]).trim() : '';
      const allowedGroup = row[7] ? String(row[7]).trim() : '';
      if (allowedGroup) {
        allowedIsmsGroupSet.add(allowedGroup);
      }
      if (!email) return;
      const rowEmail = String(email).toLowerCase().trim();
      if (rowEmail === normalizedEmail && groupName) {
        currentUserGroup = groupName;
      }
    });
  }

  return {
    currentUserGroup: currentUserGroup,
    allowedIsmsGroups: Array.from(allowedIsmsGroupSet),
    canUseIsmsInventory: Boolean(isAdmin || (currentUserGroup && allowedIsmsGroupSet.has(currentUserGroup)))
  };
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

// =================================================================
// --- 全域存取控制 (Global Access Control) ---
// =================================================================

/**
 * 取得系統存取白名單（含快取）
 * 來源：保管人信箱 + 資產管理員
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

  // 來源 1：保管人信箱（B 欄）
  let keeperEmails = [];
  try {
    const keeperSheet = SpreadsheetApp.openById(SPREADSHEET_ID)
      .getSheetByName(KEEPER_EMAIL_MAP_SHEET_NAME);
    if (keeperSheet && keeperSheet.getLastRow() > 1) {
      const range = keeperSheet.getRange(2, 2, keeperSheet.getLastRow() - 1, 1); // B2:B
      keeperEmails = range.getValues()
        .map(row => row[0])
        .filter(email => email && String(email).includes('@'))
        .map(email => String(email).toLowerCase().trim());
    }
  } catch (e) {
    Logger.log("讀取保管人信箱時發生錯誤：" + e.message);
  }

  // 來源 2：管理員名單（防呆機制）
  const adminEmails = getAdminEmails().map(e => String(e).toLowerCase().trim());

  // 合併並去重複
  const allEmails = [...new Set([...keeperEmails, ...adminEmails])];

  // 存入快取（10 分鐘）
  if (allEmails.length > 0) {
    cache.put(cacheKey, JSON.stringify(allEmails), 600);
    Logger.log(`已將 ${allEmails.length} 筆授權 Email 存入快取。`);
  }

  return allEmails;
}

/**
 * 清除權限快取（改完「保管人/信箱」或「管理員名單」工作表後可手動執行）
 */
function clearPermissionCache() {
  CacheService.getScriptCache().remove('system_access_allowlist');
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
      max-width: 450px;
    }
    .icon {
      font-size: 64px;
      margin-bottom: 20px;
    }
    h1 {
      color: #dc3545;
      margin-bottom: 16px;
      font-size: 24px;
    }
    p {
      color: #666;
      line-height: 1.6;
      margin-bottom: 12px;
    }
    .email {
      background: #f8f9fa;
      padding: 8px 16px;
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

// =================================================================
// --- 路由入口 (Web App Entry Point) ---
// =================================================================

/**
 * 當使用者打開網頁應用程式的網址時執行
 */
function doGet(e) {
  // ===== 全域存取控制 =====
  const currentUserEmail = Session.getActiveUser().getEmail();
  const allowedEmails = getAllowedEmails();

  if (!allowedEmails.includes(currentUserEmail.toLowerCase())) {
    Logger.log(`存取被拒絕：${currentUserEmail} 不在授權名單中。`);
    return createAccessDeniedPage(currentUserEmail);
  }
  // ===== 全域存取控制結束 =====

  const page = e.parameter.page;
  let template;
  let title;

  switch (page) {
    case 'barcodeprint':
      // 列印條碼標籤頁面
      template = HtmlService.createTemplateFromFile('barcodeprint');
      title = "列印條碼";
      break;
    default:
      // 預設顯示入口網站
      template = HtmlService.createTemplateFromFile('userstate');
      title = "財產管理";
      break;
  }

  const html = template.evaluate();
  html.setTitle(title);
  html.addMetaTag('viewport', 'width=device-width, initial-scale=1.0');
  return html;
}

function parseUserStateDateValue_(value) {
  if (!value) {
    return null;
  }

  if (Object.prototype.toString.call(value) === '[object Date]') {
    const time = value.getTime();
    return Number.isNaN(time) ? null : new Date(time);
  }

  const raw = String(value).trim();
  if (!raw) {
    return null;
  }

  const firstLine = raw
    .split('\n')
    .map(line => line.trim())
    .find(line => line) || raw;

  const dateMatch = firstLine.match(/(\d{1,4})\s*[\/\-\.]\s*(\d{1,2})\s*[\/\-\.]\s*(\d{1,2})/);
  if (dateMatch) {
    let year = parseInt(dateMatch[1], 10);
    const month = parseInt(dateMatch[2], 10);
    const day = parseInt(dateMatch[3], 10);

    if (Number.isFinite(year) && Number.isFinite(month) && Number.isFinite(day)) {
      if (year < 1911) {
        year += 1911;
      }

      const parsed = new Date(year, month - 1, day);
      if (!Number.isNaN(parsed.getTime()) &&
          parsed.getFullYear() === year &&
          parsed.getMonth() === month - 1 &&
          parsed.getDate() === day) {
        return parsed;
      }
    }
  }

  const fallback = new Date(firstLine);
  if (!Number.isNaN(fallback.getTime())) {
    return fallback;
  }

  return null;
}

function formatUserStateDateDisplay_(value) {
  if (!value) {
    return '';
  }

  const parsed = parseUserStateDateValue_(value);
  if (parsed) {
    return Utilities.formatDate(parsed, Session.getScriptTimeZone(), 'yyyy/MM/dd');
  }

  const raw = String(value || '').trim();
  if (!raw) {
    return '';
  }

  return raw
    .split('\n')
    .map(line => line.trim())
    .find(line => line) || raw;
}

function getUserStateData(forceUserScope) {
  const currentUserEmail = Session.getActiveUser().getEmail();
  const normalizedCurrentEmail = String(currentUserEmail).toLowerCase();
  const isAdmin = checkAdminPermissions();
  const useAdminScope = isAdmin && !forceUserScope;

  // 查詢使用者姓名
  let currentUserName = currentUserEmail.split('@')[0]; // 預設使用 email 前綴
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const keeperEmailSheet = ss.getSheetByName(KEEPER_EMAIL_MAP_SHEET_NAME);
  const userNameToGroupMap = {};
  if (keeperEmailSheet && keeperEmailSheet.getLastRow() > 1) {
    const keeperData = keeperEmailSheet.getRange(2, 1, keeperEmailSheet.getLastRow() - 1, 7).getValues();
    for (let row of keeperData) {
      const name = row[0] ? String(row[0]).trim() : '';
      const email = row[1];
      const groupName = row[6] ? String(row[6]).trim() : '';
      if (email && String(email).toLowerCase() === normalizedCurrentEmail) {
        currentUserName = name || currentUserName; // 找到對應的姓名
      }
      if (name && groupName && !userNameToGroupMap[name]) {
        userNameToGroupMap[name] = groupName;
      }
    }
  }

  let filteredData;

  if (useAdminScope) {
    filteredData = getAllAssets();
  } else {
    // ✨ 檢查是否啟用同組代理功能
    const groupProxyEnabled = isGroupProxyTransferEnabled();
    const allAssets = getAllAssets();

    if (groupProxyEnabled) {
      // 功能啟用：顯示同組成員的資產
      const groupEmails = getGroupMemberEmails(currentUserEmail);
      const groupEmailSet = new Set(groupEmails.map(email => String(email).toLowerCase()));
      filteredData = allAssets.filter(asset => {
        const leaderEmail = asset.leaderEmail ? String(asset.leaderEmail).toLowerCase() : '';
        const userEmail = asset.userEmail ? String(asset.userEmail).toLowerCase() : '';
        return groupEmailSet.has(leaderEmail) || groupEmailSet.has(userEmail);
      });
    } else {
      // 功能關閉：只顯示自己的資產
      filteredData = allAssets.filter(asset => {
        const leaderEmail = asset.leaderEmail ? String(asset.leaderEmail).toLowerCase() : '';
        const userEmail = asset.userEmail ? String(asset.userEmail).toLowerCase() : '';
        return leaderEmail === normalizedCurrentEmail || userEmail === normalizedCurrentEmail;
      });
    }
  }

  const assetIds = filteredData
    .map(asset => String(asset.assetId || '').trim())
    .filter(Boolean);
  const ismsMappingResult = getIsmsMappingForAssets(assetIds);
  const ismsMappings = ismsMappingResult && ismsMappingResult.success && ismsMappingResult.mappings
    ? ismsMappingResult.mappings
    : {};

  const results = filteredData.map(asset => {
    const assetId = String(asset.assetId || '').trim();
    const mapping = ismsMappings[assetId] || {};
    const defaultGroup = asset.defaultGroup ? String(asset.defaultGroup).trim() : '';
    const mappedUserGroup = asset.userName ? (userNameToGroupMap[String(asset.userName).trim()] || '') : '';
    const mappedLeaderGroup = asset.leaderName ? (userNameToGroupMap[String(asset.leaderName).trim()] || '') : '';
    const groupName = defaultGroup || mappedUserGroup || mappedLeaderGroup || '未分組';
    return {
      assetId: asset.assetId,
      assetName: asset.assetName,
      assetAlias: asset.assetAlias || '',
      productSerial: asset.productSerial || '',
      modelBrand: asset.modelBrand || '',
      leader: asset.leaderName,
      leaderEmail: asset.leaderEmail,
      userEmail: asset.userEmail || '',
      location: asset.location,
      status: asset.assetStatus,
      category: asset.assetCategory,
      group: groupName,
      userName: asset.userName || '無',
      sourceSheet: asset.sourceSheet || '',
      useLife: asset.useLife || '',
      purchaseDate: asset.purchaseDate ? (asset.purchaseDate instanceof Date ? asset.purchaseDate.toISOString() : String(asset.purchaseDate)) : '',
      purchaseDateDisplay: formatUserStateDateDisplay_(asset.purchaseDate),
      isItAsset: asset.isItAsset || '',
      isIsoScope: asset.isIsoScope || '',
      ismsAssetId: String(mapping.ismsAssetId || asset.ismsAssetId || ''),
      propertyCategory: String(asset.propertyCategory || '')
    };
  });

  return {
    isAdmin: isAdmin,
    userEmail: currentUserEmail, // ✨ Add userEmail
    userName: currentUserName, // ✨ 新增使用者姓名
    assets: results
  };
}

function getUserStateExportDataByTargets(targets, forceUserScope) {
  try {
    const currentUserEmail = Session.getActiveUser().getEmail();
    const isAdmin = checkAdminPermissions();
    const useAdminScope = isAdmin && !forceUserScope;

    let filteredData;

    if (useAdminScope) {
      filteredData = getAllAssets();
    } else {
      const groupEmails = getGroupMemberEmails(currentUserEmail);
      const groupEmailSet = new Set(groupEmails.map(email => String(email).toLowerCase()));
      const allAssets = getAllAssets();
      filteredData = allAssets.filter(asset => {
        const leaderEmail = asset.leaderEmail ? String(asset.leaderEmail).toLowerCase() : '';
        const userEmail = asset.userEmail ? String(asset.userEmail).toLowerCase() : '';
        return groupEmailSet.has(leaderEmail) || groupEmailSet.has(userEmail);
      });
    }

    const targetList = Array.isArray(targets) ? targets : [];
    const normalizedTargets = targetList.map(item => ({
      assetId: String(item?.assetId || '').trim(),
      sourceSheet: String(item?.sourceSheet || '').trim()
    })).filter(item => item.assetId);

    if (normalizedTargets.length === 0) {
      return { property: { headers: [], rows: [] }, items: { headers: [], rows: [] } };
    }

    const targetKeySet = new Set(
      normalizedTargets.map(item => `${item.sourceSheet}::${item.assetId}`)
    );

    const filteredTargets = filteredData.filter(asset => {
      const assetId = String(asset.assetId || '').trim();
      const sourceSheet = String(asset.sourceSheet || '').trim();
      if (!assetId || !sourceSheet) return false;
      return targetKeySet.has(`${sourceSheet}::${assetId}`);
    });

    const timeZone = Session.getScriptTimeZone();
    const formatCell = (value) => {
      if (value instanceof Date) {
        return Utilities.formatDate(value, timeZone, 'yyyy/MM/dd');
      }
      if (value === null || value === undefined) return '';
      return String(value);
    };

    const propertyHeaders = [
      '財產編號',
      '財產名稱',
      '財產別名',
      '型號/廠牌',
      '單位',
      '取得日期',
      '使用年限',
      '保管地點',
      '附屬設備',
      '保管人',
      '使用人',
      '財產類別'
    ];

    const itemHeaders = [
      '物品編號',
      '物品名稱',
      '產品序號',
      '型號/廠牌',
      '取得日期',
      '使用年限',
      '單位',
      '台幣金額',
      '申購單號',
      '財產類別',
      '保管人',
      '保管地點'
    ];

    const propertyRows = [];
    const itemRows = [];

    filteredTargets.forEach(asset => {
      if (asset.sourceSheet === PROPERTY_MASTER_SHEET_NAME) {
        propertyRows.push([
          formatCell(asset.assetId),
          formatCell(asset.assetName),
          formatCell(asset.assetAlias),
          formatCell(asset.modelBrand),
          formatCell(asset.unit),
          formatCell(asset.purchaseDate),
          formatCell(asset.useLife),
          formatCell(asset.location),
          formatCell(asset.accessory),
          formatCell(asset.leaderName),
          formatCell(asset.userName),
          formatCell(asset.assetCategory)
        ]);
      } else if (asset.sourceSheet === ITEM_MASTER_SHEET_NAME) {
        itemRows.push([
          formatCell(asset.assetId),
          formatCell(asset.assetName),
          formatCell(asset.productSerial),
          formatCell(asset.modelBrand),
          formatCell(asset.purchaseDate),
          formatCell(asset.useLife),
          formatCell(asset.unit),
          formatCell(asset.amountTwd),
          formatCell(asset.purchaseOrder),
          formatCell(asset.assetCategory),
          formatCell(asset.leaderName),
          formatCell(asset.location)
        ]);
      }
    });

    return {
      property: { headers: propertyHeaders, rows: propertyRows },
      items: { headers: itemHeaders, rows: itemRows }
    };
  } catch (e) {
    Logger.log(`getUserStateExportDataByTargets 失敗: ${e.message}`);
    return {
      property: { headers: [], rows: [] },
      items: { headers: [], rows: [] },
      error: e.message
    };
  }
}

function getAppUrl() {
  return ScriptApp.getService().getUrl();
}

function sanitizeOptionalUrl_(value) {
  var raw = String(value || '').trim();
  if (!raw) return '';
  if (raw.indexOf('YOUR_') !== -1) return '';
  return raw;
}

/**
 * 取得 userstate.html 需要的頁面連結
 */
function getUserStatePageUrls() {
  var fallbackManualUrl = sanitizeOptionalUrl_(USERSTATE_OPERATION_MANUAL_URL);
  var pdfDownloadUrl = sanitizeOptionalUrl_(USERSTATE_OPERATION_MANUAL_PDF_DOWNLOAD_URL) || fallbackManualUrl;
  return {
    webAppUrl: ScriptApp.getService().getUrl(),
    operationManualUrl: fallbackManualUrl,
    operationManualPdfDownloadUrl: pdfDownloadUrl,
    operationManualVideoYoutubeUrl: sanitizeOptionalUrl_(USERSTATE_OPERATION_MANUAL_VIDEO_YOUTUBE_URL),
    operationManualVideoDriveUrl: sanitizeOptionalUrl_(USERSTATE_OPERATION_MANUAL_VIDEO_DRIVE_URL)
  };
}

/**
 * 取得浮動按鈕導航連結（供 userstate.html FAB 使用）
 */
function getFabNavigationUrls() {
  var webAppUrl = ScriptApp.getService().getUrl();
  return {
    isAdmin: checkAdminPermissions(),
    ismsAssetUrl: FAB_URL_ISMS_ASSET,
    ismsConnectUrl: FAB_URL_ISMS_CONNECT,
    softwareListUrl: FAB_URL_SOFTWARE_LIST,
    barcodePrintUrl: webAppUrl + '?page=barcodeprint'
  };
}

/**
 * [供 Index.html 呼叫] 獲取駐站與電腦的二級下拉選單資料 (修正並清理版)
 */
// =================================================================
// --- 財產轉移申請與審核功能 (後端) ---
// (請將此區塊完整替換)
// =================================================================

/**
 * [供 apply.html 呼叫] 獲取申請頁面所需的所有初始資料
 * (此函式與前一版相同，為求完整一併提供)
 */
function getTransferData(forceUserScope) {
  const currentUserEmail = Session.getActiveUser().getEmail();
  const allAssets = getAllAssets(); // Keep this to get all users/keepers for dropdowns
  const allMyAssets = getAssetsForCurrentUser();

  // ✨ 提前宣告 ss 變數，避免後續使用時未定義
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

  // ✨ 檢查權限和視圖模式
  const isAdmin = checkAdminPermissions();
  const useAdminScope = isAdmin && !forceUserScope;

  // ✨ 檢查同組代理功能狀態（只在一般使用者視圖時生效）
  const groupProxyEnabled = !useAdminScope && isGroupProxyTransferEnabled();

  // ✨ 取得同組成員 Email 列表（用於前端判斷）
  let groupMemberEmailsLower = [];
  let currentGroup = null;

  if (groupProxyEnabled) {
    const groupMemberEmails = getGroupMemberEmails(currentUserEmail);
    groupMemberEmailsLower = groupMemberEmails.map(e => String(e).toLowerCase().trim());

    // 從「保管人/信箱」工作表讀取當前使用者的組別名稱
    const keeperEmailSheet = ss.getSheetByName(KEEPER_EMAIL_MAP_SHEET_NAME);
    const keeperDataForGroup = keeperEmailSheet.getRange(2, 1, keeperEmailSheet.getLastRow() - 1, 7).getValues();

    const normalizedCurrentEmail = String(currentUserEmail).toLowerCase().trim();
    keeperDataForGroup.forEach(row => {
      const email = row[1];
      if (!email) return;

      const normalizedEmail = String(email).toLowerCase().trim();
      if (normalizedEmail === normalizedCurrentEmail) {
        currentGroup = row[6] ? String(row[6]).trim() : null;
      }
    });
  }

  // 1. 從所有資產中，篩選出屬於當前使用者的、可轉移的資產
  const myAssets = allMyAssets
    .filter(asset => asset.assetStatus === '在庫')
    .map(asset => ({
      id: asset.assetId,
      assetName: asset.assetName,
      assetAlias: String(asset.assetAlias || ''),
      productSerial: String(asset.productSerial || ''),
      modelBrand: asset.modelBrand || '',
      location: asset.location,
      category: asset.assetCategory,
      userName: asset.userName || '無', // 使用者名稱，物品總表顯示「無」
      leaderName: asset.leaderName, // 保管人姓名
      leaderEmail: asset.leaderEmail, // ✨ 新增：用於前端判斷是否為自己的資產
      sourceSheet: asset.sourceSheet // 標記資料來源
    }));

  // 2. 從「保管人/信箱」工作表讀取保管人和使用人列表（改用固定列表）
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
    const isCustodian = String(row[2]).trim(); // C欄：是否為駐管
    const isInfoCustodian = String(row[3]).trim(); // D欄：資訊組駐站資產保管人
    const isInfoUser = String(row[4]).trim(); // E欄：資訊組駐站資產使用人
    const isIntakeCustodian = String(row[5]).trim(); // F欄：駐站轉中心收案組保管＆使用人

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
    .filter(row => String(row[1]).trim() === '是') // B欄為「是」
    .map(row => row[0])
    .filter(loc => loc);

  // ✨ 新增：篩選出資訊組地點
  const infoLocationList = locationData
    .filter(row => String(row[2]).trim() === '是') // C欄為「是」
    .map(row => row[0])
    .filter(loc => loc);

  // ✨ 新增：篩選出收案組地點
  const intakeLocationList = locationData
    .filter(row => String(row[3]).trim() === '是') // D欄為「是」
    .map(row => row[0])
    .filter(loc => loc);

  // ✨ 新增：篩選出資訊組電腦專用地點
  const infoComputerLocationList = locationData
    .filter(row => String(row[4]).trim() === '是') // E欄為「是」
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
    intakeLocation: intakeLocationList.length > 0 ? intakeLocationList[0] : null,
    // ✨ 同組代理功能資訊
    groupProxyEnabled: groupProxyEnabled,
    currentGroup: currentGroup,
    currentUserEmail: currentUserEmail,
    groupMemberEmailsLower: groupMemberEmailsLower,
    isAdmin: isAdmin
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
      intakeLocation,      // 收案組地點
      // ✨ 新增：代理轉移參數（前端傳入）
      proxyTransfers      // 格式：[{ assetId, originalKeeperEmail, originalKeeperName }]
    } = formData;

    // ✨ 改進：支援選擇性參數（可以只變更其中一項）
    if (!assetIds || assetIds.length === 0) {
        throw new Error("請至少勾選一筆財產。");
    }

    // ✨ 新增：取得同組代理轉移功能狀態（提前宣告，避免後續重複呼叫）
    const groupProxyEnabled = isGroupProxyTransferEnabled();

    // ✨ 建立代理轉移對照表（如果前端有傳入）
    const proxyTransferMap = new Map();
    if (proxyTransfers && Array.isArray(proxyTransfers)) {
      proxyTransfers.forEach(pt => {
        proxyTransferMap.set(pt.assetId, {
          originalKeeperEmail: pt.originalKeeperEmail,
          originalKeeperName: pt.originalKeeperName
        });
      });
      Logger.log(`收到 ${proxyTransfers.length} 筆代理轉移資訊`);
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
    const applicantEmailLower = applicantEmail.toLowerCase(); // 🛡️ 安全性修復：統一小寫比對
    const isAdmin = checkAdminPermissions(); // 🛡️ 安全性修復：檢查是否為管理員
    const groupEmailSet = groupProxyEnabled
      ? new Set(getGroupMemberEmails(applicantEmail).map(e => String(e).toLowerCase().trim()))
      : null;
    const newLogsToAdd = [];
    const createdApplications = [];
    const unauthorizedAssets = []; // 🛡️ 安全性修復：收集無權限的資產

    assetIds.forEach(assetId => {
      const location = findAssetLocation(assetId);
      if (location) {
        const assetRow = location.sheet.getRange(location.rowIndex, 1, 1, location.sheet.getLastColumn()).getValues()[0];
        const indices = location.sheetName === PROPERTY_MASTER_SHEET_NAME ? PROPERTY_COLUMN_INDICES : ITEM_COLUMN_INDICES;
        const asset = mapRowToAssetObject(assetRow, indices, location.sheetName);

        // 🛡️ 安全性修復：驗證使用者是否有權操作此資產
        if (!isAdmin) {
          const assetLeaderEmail = String(asset.leaderEmail || '').toLowerCase();
          const assetUserEmail = String(asset.userEmail || '').toLowerCase();
          const isOwner = assetLeaderEmail === applicantEmailLower || assetUserEmail === applicantEmailLower;
          const isGroupProxyAllowed = groupProxyEnabled && groupEmailSet
            ? (groupEmailSet.has(assetLeaderEmail) || (assetUserEmail && groupEmailSet.has(assetUserEmail)))
            : false;
          if (!isOwner && !isGroupProxyAllowed) {
            unauthorizedAssets.push(assetId);
            Logger.log(`🛡️ 權限拒絕：${applicantEmail} 無權轉移資產 ${assetId}`);
            return; // 跳過此資產
          }
        }

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

          // ✨ 判斷是否為代理轉移（保管人 ≠ 當前使用者）
          const assetLeaderEmail = String(asset.leaderEmail || '').toLowerCase().trim();
          const assetUserEmail = String(asset.userEmail || '').toLowerCase().trim();
          const isProxyTransfer = assetLeaderEmail !== applicantEmailLower;
          let proxyInfo = null;

          if (isProxyTransfer) {
            // 驗證代理轉移權限
            if (isAdmin) {
              // 管理員：可以轉移任何人的資產
              proxyInfo = {
                type: 'admin',
                originalEmail: assetLeaderEmail,
                originalName: asset.leaderName
              };
              Logger.log(`管理員代理轉移：${assetId} (原保管人：${asset.leaderName})`);
            } else if (groupProxyEnabled) {
              // 同組代理：驗證是否為同組成員
              const normalizedGroupEmails = groupEmailSet
                ? groupEmailSet
                : new Set(getGroupMemberEmails(applicantEmail).map(e => String(e).toLowerCase().trim()));

              if (normalizedGroupEmails.has(assetLeaderEmail) || (assetUserEmail && normalizedGroupEmails.has(assetUserEmail))) {
                proxyInfo = {
                  type: 'group',
                  originalEmail: assetLeaderEmail,
                  originalName: asset.leaderName
                };
                Logger.log(`同組代理轉移：${assetId} (原保管人：${asset.leaderName})`);
              } else {
                throw new Error(`權限不足：資產 ${assetId} 的保管人不是您的同組成員，無法代理轉移。`);
              }
            } else {
              throw new Error(`權限不足：資產 ${assetId} 不屬於您，且同組代理功能未啟用。`);
            }
          }

          // ✨ 判斷轉移類型（優先使用駐站轉移標記，否則動態組合變更項目）
          let transferType = '';
          if (actualTransferType === '駐站轉移') {
            transferType = '駐站轉移'; // 駐站轉移有最高優先級
          } else if (actualTransferType === '駐站回送資訊組') {
            transferType = '駐站回送資訊組';
          } else if (actualTransferType === '駐站回送收案組') {
            transferType = '駐站回送收案組';
          } else {
            // 動態組合轉移類型
            const parts = [];
            if (isKeeperChange) parts.push('保管人');
            if (isUserChange) parts.push('使用人');
            if (isLocationChange) parts.push('地點');

            if (parts.length > 0) {
              transferType = parts.join('+');
            } else {
              // 沒有實際變更，跳過此資產
              return;
            }
          }

          // ✨ 新增：代理轉移標記
          if (proxyInfo) {
            const originalName = proxyInfo.originalName || proxyInfo.originalEmail.split('@')[0];
            if (proxyInfo.type === 'admin') {
              transferType = `【管理員代理】${transferType}（原保管人：${originalName}）`;
            } else if (proxyInfo.type === 'group') {
              transferType = `【同組代理】${transferType}（原保管人：${originalName}）`;
            }
          }
          
          // 只有變更保管人或使用人時才需要設為「待接收」狀態
          const needsApproval = isKeeperChange || isUserChange;
          
          if (needsApproval) {
            location.sheet.getRange(location.rowIndex, indicesToUpdate.ASSET_STATUS).setValue("轉移中");
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

    // 🛡️ 安全性修復：如果有無權限的資產，附加提示訊息
    if (unauthorizedAssets.length > 0) {
      const warningMsg = `（注意：${unauthorizedAssets.length} 筆財產因權限不足已跳過）`;
      if (resultMessage) {
        resultMessage += warningMsg;
      } else if (createdApplications.length === 0) {
        // 全部都無權限
        throw new Error(`權限不足：您不是所選財產的保管人或使用人，無法執行轉移操作。`);
      }
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
function getPendingApprovals(forceUserScope) {
  Logger.log("--- getPendingApprovals 函式開始執行 (v3) ---");
  const startTime = new Date();

  try {
    const currentUserEmail = Session.getActiveUser().getEmail();
    const currentUserEmailLower = String(currentUserEmail || '').toLowerCase();
    const isAdmin = checkAdminPermissions();
    const useAdminScope = isAdmin && !forceUserScope;
    const groupProxyEnabled = !useAdminScope && isGroupProxyTransferEnabled();
    const groupEmailSet = groupProxyEnabled
      ? new Set(getGroupMemberEmails(currentUserEmail).map(email => String(email || '').toLowerCase().trim()))
      : null;
    const appLogSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(APPLICATION_LOG_SHEET_NAME);
    
    const allAssets = getAllAssets();
    const assetIdToInfoMap = new Map(allAssets.map(asset => [
      asset.assetId,
      {
        assetName: asset.assetName,
        assetAlias: String(asset.assetAlias || ''),
        productSerial: String(asset.productSerial || ''),
        modelBrand: asset.modelBrand || '',
        userName: asset.userName || '無',
        sourceSheet: String(asset.sourceSheet || '')
      }
    ]));
    
    const range = appLogSheet.getRange(2, 1, appLogSheet.getLastRow() - 1, appLogSheet.getLastColumn());
    const values = range.getValues();

    const pendingApprovals = values
      .filter(row => {
        const status = row[AL_STATUS_COLUMN_INDEX - 1];
        if (status !== "待接收") return false;

        if (useAdminScope) return true;

        const newLeaderEmail = row[AL_NEW_LEADER_EMAIL_COLUMN_INDEX - 1];
        const newUserEmail = row[AL_NEW_USER_EMAIL_COLUMN_INDEX - 1];
        const transferType = row.length > AL_TRANSFER_TYPE_COLUMN_INDEX - 1
          ? row[AL_TRANSFER_TYPE_COLUMN_INDEX - 1]
          : '地點';

        return canApproveTransfer_({
          currentUserEmailLower,
          newLeaderEmailLower: newLeaderEmail,
          newUserEmailLower: newUserEmail,
          transferType: transferType,
          groupProxyEnabled: groupProxyEnabled,
          groupEmailSet: groupEmailSet
        });
      })
      .map(row => {
        const assetId = row[AL_ASSET_ID_COLUMN_INDEX - 1];
        const assetInfo = assetIdToInfoMap.get(assetId) || { assetName: '（找不到名稱）', assetAlias: '', productSerial: '', modelBrand: '', userName: '無', sourceSheet: '' };

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
          assetAlias: String(assetInfo.assetAlias || ''),
          productSerial: String(assetInfo.productSerial || ''),
          modelBrand: assetInfo.modelBrand,
          userName: assetInfo.userName,
          oldKeeper: row[AL_OLD_LEADER_COLUMN_INDEX - 1],
          oldLocation: row[AL_OLD_LOCATION_COLUMN_INDEX - 1],
          newLocation: row[AL_NEW_LOCATION_COLUMN_INDEX - 1],
          newKeeper: row[AL_NEW_LEADER_COLUMN_INDEX - 1], // ✨ 新增：新保管人姓名
          oldUser: oldUser, // ✨ 新增：原使用人
          newUser: newUser, // ✨ 新增：新使用人
          transferType: transferType, // ✨ 新增：轉移類型
          sourceSheet: String(assetInfo.sourceSheet || '')
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

    // 🛡️ 安全性修復：取得當前使用者身分
    const currentUserEmail = Session.getActiveUser().getEmail();
    const currentUserEmailLower = currentUserEmail.toLowerCase();
    const isAdmin = checkAdminPermissions();
    const groupProxyEnabled = !isAdmin && isGroupProxyTransferEnabled();
    const groupEmailSet = groupProxyEnabled
      ? new Set(getGroupMemberEmails(currentUserEmail).map(email => String(email || '').toLowerCase().trim()))
      : null;
    const unauthorizedApps = []; // 🛡️ 收集無權限的申請

    appIds.forEach(appId => {
      const appDetails = appLogMap.get(appId);
      if (appDetails && appDetails.row[AL_STATUS_COLUMN_INDEX - 1] === "待接收") {
        // 🛡️ 安全性修復：驗證審核權限
        const newLeaderEmail = (appDetails.row[AL_NEW_LEADER_EMAIL_COLUMN_INDEX - 1] || '').toLowerCase();
        const newUserEmail = (appDetails.row.length > AL_NEW_USER_EMAIL_COLUMN_INDEX - 1
          ? appDetails.row[AL_NEW_USER_EMAIL_COLUMN_INDEX - 1]
          : '').toLowerCase();
        const transferTypeRaw = appDetails.row.length > AL_TRANSFER_TYPE_COLUMN_INDEX - 1
          ? appDetails.row[AL_TRANSFER_TYPE_COLUMN_INDEX - 1]
          : '地點';
        const normalizedTransferType = normalizeTransferType_(transferTypeRaw);

        if (!isAdmin) {
          const canApprove = canApproveTransfer_({
            currentUserEmailLower,
            newLeaderEmailLower: newLeaderEmail,
            newUserEmailLower: newUserEmail,
            transferType: transferTypeRaw,
            groupProxyEnabled: groupProxyEnabled,
            groupEmailSet: groupEmailSet
          });

          if (!canApprove) {
            unauthorizedApps.push(appId);
            Logger.log(`🛡️ 權限拒絕：${currentUserEmail} 無權審核申請 ${appId}`);
            return; // 跳過此申請
          }
        }

        const assetId = appDetails.row[AL_ASSET_ID_COLUMN_INDEX - 1].toString();
        const location = findAssetLocation(assetId);

        if (location) {
          const appRowIndex = appDetails.index;

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
          if (normalizedTransferType === '保管人+使用人') {
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

    // 🛡️ 安全性修復：如果有無權限的申請，附加提示訊息
    if (unauthorizedApps.length > 0) {
      if (successCount === 0 && errors.length === 0) {
        // 全部都無權限
        throw new Error('權限不足：您不是這些申請的指定審核人，無法執行審核操作。');
      }
      message += `\n（注意：${unauthorizedApps.length} 筆申請因權限不足已跳過）`;
    }

    return message;

  } catch (e) {
    Logger.log(`!!!!!! processBatchApproval 發生嚴重錯誤: ${e.message} at ${e.stack}`);
    return "批次核准過程中發生嚴重錯誤: " + e.message;
  }
}

/**
 * [供 userstate.html 呼叫] 批次拒絕待接收資產
 * @param {Array<string>} appIds - 申請紀錄 ID 清單
 * @returns {string} 處理結果訊息
 */
function processBatchRejection(appIds) {
  Logger.log("\n\n--- processBatchRejection 開始執行 ---");
  if (!appIds || appIds.length === 0) {
    return "您沒有選擇任何項目。";
  }

  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const appLogSheet = ss.getSheetByName(APPLICATION_LOG_SHEET_NAME);
    const appLogData = appLogSheet.getRange(2, 1, appLogSheet.getLastRow(), appLogSheet.getLastColumn()).getValues();
    const appLogMap = new Map(appLogData.map((row, index) => [row[AL_APP_ID_COLUMN_INDEX - 1], { row, index: index + 2 }]));

    const now = new Date();
    let successCount = 0;
    const errors = [];
    const unauthorizedApps = [];

    const currentUserEmail = Session.getActiveUser().getEmail();
    const currentUserEmailLower = currentUserEmail.toLowerCase();
    const isAdmin = checkAdminPermissions();
    const groupProxyEnabled = !isAdmin && isGroupProxyTransferEnabled();
    const groupEmailSet = groupProxyEnabled
      ? new Set(getGroupMemberEmails(currentUserEmail).map(email => String(email || '').toLowerCase().trim()))
      : null;

    appIds.forEach(appId => {
      const appDetails = appLogMap.get(appId);
      if (!appDetails) {
        errors.push(`找不到申請紀錄：${appId}`);
        return;
      }

      if (appDetails.row[AL_STATUS_COLUMN_INDEX - 1] !== "待接收") {
        return;
      }

      const newLeaderEmail = (appDetails.row[AL_NEW_LEADER_EMAIL_COLUMN_INDEX - 1] || '').toLowerCase();
      const newUserEmail = (appDetails.row.length > AL_NEW_USER_EMAIL_COLUMN_INDEX - 1
        ? appDetails.row[AL_NEW_USER_EMAIL_COLUMN_INDEX - 1]
        : '').toLowerCase();
      const transferType = appDetails.row.length > AL_TRANSFER_TYPE_COLUMN_INDEX - 1
        ? appDetails.row[AL_TRANSFER_TYPE_COLUMN_INDEX - 1]
        : '地點';

      if (!isAdmin) {
        const canReject = canApproveTransfer_({
          currentUserEmailLower,
          newLeaderEmailLower: newLeaderEmail,
          newUserEmailLower: newUserEmail,
          transferType: transferType,
          groupProxyEnabled: groupProxyEnabled,
          groupEmailSet: groupEmailSet
        });

        if (!canReject) {
          unauthorizedApps.push(appId);
          Logger.log(`🛡️ 權限拒絕：${currentUserEmail} 無權拒絕申請 ${appId}`);
          return;
        }
      }

      const assetId = appDetails.row[AL_ASSET_ID_COLUMN_INDEX - 1].toString();
      const location = findAssetLocation(assetId);
      if (location) {
        const indices = location.sheetName === PROPERTY_MASTER_SHEET_NAME ? PROPERTY_COLUMN_INDICES : ITEM_COLUMN_INDICES;
        location.sheet.getRange(location.rowIndex, indices.ASSET_STATUS).setValue("在庫");
        location.sheet.getRange(location.rowIndex, indices.APPLICATION_TIME).setValue('');
        location.sheet.getRange(location.rowIndex, indices.TRANSFER_TIME).setValue('');
      }

      const appRowIndex = appDetails.index;
      appLogSheet.getRange(appRowIndex, AL_STATUS_COLUMN_INDEX).setValue("已取消");
      appLogSheet.getRange(appRowIndex, AL_REVIEW_TIME_COLUMN_INDEX).setValue(now);
      appLogSheet.getRange(appRowIndex, AL_APPROVER_EMAIL_COLUMN_INDEX).setValue(currentUserEmail);

      successCount++;
    });

    let message = `已拒絕 ${successCount} 筆待接收資產。`;
    if (unauthorizedApps.length > 0) {
      message += `\n${unauthorizedApps.length} 筆因權限不足未處理。`;
    }
    if (errors.length > 0) {
      message += `\n${errors.join('；')}`;
    }

    Logger.log(message);
    return message;
  } catch (e) {
    Logger.log(`processBatchRejection 失敗: ${e.message}`);
    return `拒絕作業失敗：${e.message}`;
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
        assetAlias: String(asset.assetAlias || ''),
        productSerial: String(asset.productSerial || ''),
        modelBrand: asset.modelBrand || '',
        leaderName: asset.leaderName,
        location: asset.location,
        userName: asset.userName || '無', // 使用者名稱，物品總表顯示「無」
        sourceSheet: String(asset.sourceSheet || '')
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
    const { assetIds, borrowerName, returnDate, reason, lendingLocation, borrowerType, contactPhone } = formData;
    const normalizedBorrowerType = borrowerType === 'external' ? 'external' : 'internal';
    const trimmedBorrowerName = String(borrowerName || '').trim();
    const trimmedReturnDate = String(returnDate || '').trim();
    const trimmedReason = String(reason || '').trim();
    const trimmedLocation = String(lendingLocation || '').trim();
    const trimmedContactPhone = String(contactPhone || '').trim();

    if (!assetIds || assetIds.length === 0 || !trimmedBorrowerName || !trimmedReturnDate || !trimmedLocation) {
      throw new Error("資料不完整，請填寫所有必填欄位。");
    }
    if (normalizedBorrowerType === 'external' && (!trimmedReason || !trimmedContactPhone)) {
      throw new Error("外部借用需填寫借用人、聯絡電話、借出後地點、出借事由與預計歸還日期。");
    }

    // 🛡️ 安全性修復：取得當前使用者身分
    const currentUserEmail = Session.getActiveUser().getEmail();
    const currentUserEmailLower = currentUserEmail.toLowerCase();
    const isAdmin = checkAdminPermissions();
    const unauthorizedAssets = []; // 🛡️ 收集無權限的資產

    const lendingLogSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(LENDING_LOG_SHEET_NAME);
    const allAssets = getAllAssets();
    const assetMap = new Map(allAssets.map(asset => [asset.assetId, asset]));

    const now = new Date();
    let successCount = 0;

    assetIds.forEach(assetId => {
      const asset = assetMap.get(assetId);
      if (asset) {
        // 🛡️ 安全性修復：驗證使用者是否有權出借此資產（保管人或使用人皆可出借）
        if (!isAdmin) {
          const assetLeaderEmail = (asset.leaderEmail || '').toLowerCase();
          const assetUserEmail = (asset.userEmail || '').toLowerCase();

          // 允許保管人 OR 使用人
          if (assetLeaderEmail !== currentUserEmailLower && assetUserEmail !== currentUserEmailLower) {
            unauthorizedAssets.push(assetId);
            Logger.log(`🛡️ 權限拒絕：${currentUserEmail} 無權出借資產 ${assetId}（非保管人也非使用人）`);
            return; // 跳過此資產
          }
        }
      }

      if (asset && asset.assetStatus === '在庫') {
        const location = findAssetLocation(assetId);
        if (location) {
          const indices = location.sheetName === PROPERTY_MASTER_SHEET_NAME ? PROPERTY_COLUMN_INDICES : ITEM_COLUMN_INDICES;
          location.sheet.getRange(location.rowIndex, indices.ASSET_STATUS).setValue('出借中');
          
          const lendId = `LEND-${now.getTime()}-${successCount}`;
          // ✨ **核心修改：D 欄改為記錄出借人 Email（而非保管人名稱）**
          lendingLogSheet.appendRow([
            lendId, now, asset.assetId, currentUserEmail, // ✨ 改為出借人 Email
            trimmedBorrowerName, new Date(trimmedReturnDate), "", // 實際歸還日期留空
            trimmedReason, "出借中", trimmedLocation, // J 欄
            normalizedBorrowerType, trimmedContactPhone, "", "" // K~N 欄
          ]);
          successCount++;
        } else {
          Logger.log(`processBatchLending: 找不到資產 ${assetId}，跳過。`);
        }
      }
    });

    // 🛡️ 安全性修復：如果有無權限的資產，處理錯誤
    if (unauthorizedAssets.length > 0) {
      if (successCount === 0) {
        throw new Error(`權限不足：您不是所選財產的保管人，無法執行出借操作。`);
      }
    }

    if (successCount === 0) {
      throw new Error("處理失敗，勾選的財產可能已被他人借出或狀態已變更。");
    }

    let resultMessage = `成功為 ${successCount} 筆財產辦理出借！`;
    if (unauthorizedAssets.length > 0) {
      resultMessage += `（注意：${unauthorizedAssets.length} 筆財產因權限不足已跳過）`;
    }

    return resultMessage;

  } catch (e) {
    Logger.log("批次出借失敗: " + e.message);
    return "申請出借失敗：" + e.message;
  }
}

/**
 * [供 return.html 呼叫] 獲取該保管人所有「出借中」的資產
 */
function getLentOutAssets(forceUserScope) {
    try {
        const currentUserEmail = Session.getActiveUser().getEmail().toLowerCase();
        const isAdmin = checkAdminPermissions();
        const useAdminScope = isAdmin && !forceUserScope;
        const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
        const lendingLogSheet = ss.getSheetByName(LENDING_LOG_SHEET_NAME);
        
        // ✨ 新增：檢查工作表是否為空或只有標題行
        if (!lendingLogSheet || lendingLogSheet.getLastRow() < 2) {
            Logger.log("出借紀錄工作表為空或只有標題行，回傳空陣列。");
            return { assets: [] };
        }

        const dataColumnCount = Math.max(LL_PRINT_TIME_COLUMN_INDEX, lendingLogSheet.getLastColumn());
        const lendingData = lendingLogSheet.getRange(2, 1, lendingLogSheet.getLastRow() - 1, dataColumnCount).getValues();

        const formatDateValue = (value, pattern) => {
            if (!value) return '';
            try {
                return Utilities.formatDate(new Date(value), Session.getScriptTimeZone(), pattern);
            } catch (e) {
                return String(value);
            }
        };

        const keeperEmailSheet = ss.getSheetByName(KEEPER_EMAIL_MAP_SHEET_NAME);
        const emailToNameMap = new Map();
        if (keeperEmailSheet && keeperEmailSheet.getLastRow() > 1) {
            const keeperData = keeperEmailSheet.getRange(2, 1, keeperEmailSheet.getLastRow() - 1, 2).getValues();
            keeperData.forEach(row => {
                const name = row[0];
                const email = row[1];
                if (email) {
                    emailToNameMap.set(String(email).toLowerCase(), name || String(email).split('@')[0]);
                }
            });
        }

        const allAssets = getAllAssets();
        const assetIdToInfoMap = new Map(allAssets.map(asset => [String(asset.assetId || '').trim(), {
            assetName: asset.assetName,
            assetAlias: String(asset.assetAlias || ''),
            productSerial: String(asset.productSerial || ''),
            modelBrand: asset.modelBrand || '',
            leaderName: asset.leaderName || '',
            leaderEmail: asset.leaderEmail || '',
            userName: asset.userName || '無',
            userEmail: asset.userEmail || '',
            location: asset.location || '',
            sourceSheet: String(asset.sourceSheet || '')
        }]));  // ✨ 新增：資產資訊映射

        const lentAssets = lendingData
            .filter(row => {
                const lenderEmail = row[LL_LENDER_EMAIL_COLUMN_INDEX - 1];  // ✨ 讀取 D 欄（出借人 Email）
                const status = row[LL_STATUS_COLUMN_INDEX - 1];

                // ✨ 容錯：跳過舊格式記錄（D 欄不是 Email）
                if (!lenderEmail || !lenderEmail.includes('@')) {
                    Logger.log(`⚠️ 跳過舊格式記錄：lendId=${row[0]}, D欄=${lenderEmail}`);
                    return false;
                }

                if (status !== '出借中') return false;

                if (useAdminScope) return true;

                const normalizedLender = String(lenderEmail).toLowerCase();
                const assetId = String(row[LL_ASSET_ID_COLUMN_INDEX - 1] || '').trim();
                const assetInfo = assetIdToInfoMap.get(assetId) || {};
                const leaderEmail = (assetInfo.leaderEmail || '').toLowerCase();
                const userEmail = (assetInfo.userEmail || '').toLowerCase();
                return normalizedLender === currentUserEmail ||
                       (leaderEmail && leaderEmail === currentUserEmail) ||
                       (userEmail && userEmail === currentUserEmail);
            })
            .map(row => {
                const assetId = String(row[LL_ASSET_ID_COLUMN_INDEX - 1] || '').trim();
                const assetInfo = assetIdToInfoMap.get(assetId) || {};
                const lenderEmail = (row[LL_LENDER_EMAIL_COLUMN_INDEX - 1] || '').toString().toLowerCase();
                const lenderName = emailToNameMap.get(lenderEmail) || lenderEmail || '';
                const borrowerTypeRaw = row[LL_BORROWER_TYPE_COLUMN_INDEX - 1];
                const borrowerType = borrowerTypeRaw === 'external' ? 'external' : 'internal';
                const contactPhone = row[LL_CONTACT_PHONE_COLUMN_INDEX - 1] || '';
                const docUrl = row[LL_DOC_URL_COLUMN_INDEX - 1] || '';
                const printTime = formatDateValue(row[LL_PRINT_TIME_COLUMN_INDEX - 1], 'yyyy/MM/dd');
                return {
                    lendId: row[LL_LEND_ID_COLUMN_INDEX - 1],
                    applyTime: formatDateValue(row[LL_LEND_TIME_COLUMN_INDEX - 1], 'yyyy/MM/dd'),
                    assetId: assetId,
                    assetName: assetInfo.assetName || '',
                    assetAlias: String(assetInfo.assetAlias || ''),
                    productSerial: String(assetInfo.productSerial || ''),
                    modelBrand: assetInfo.modelBrand || '',
                    keeperName: assetInfo.leaderName || '',
                    userName: assetInfo.userName || '',
                    originalLocation: assetInfo.location || '',
                    lenderName: lenderName,
                    borrower: row[LL_BORROWER_NAME_COLUMN_INDEX - 1],
                    expectedReturnDate: formatDateValue(row[LL_EXPECTED_RETURN_DATE_COLUMN_INDEX - 1], 'yyyy/MM/dd'),
                    reason: row[LL_REASON_COLUMN_INDEX - 1],
                    lendingLocation: row[LL_LENDING_LOCATION_COLUMN_INDEX - 1] || '',
                    borrowerType: borrowerType,
                    contactPhone: contactPhone,
                    docUrl: docUrl,
                    printTime: printTime,
                    sourceSheet: String(assetInfo.sourceSheet || '')
                };
            });

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
        // 🛡️ 安全性修復：取得當前使用者身分
        const currentUserEmail = Session.getActiveUser().getEmail();
        const currentUserEmailLower = currentUserEmail.toLowerCase();
        const isAdmin = checkAdminPermissions();
        const unauthorizedLends = []; // 🛡️ 收集無權限的歸還

        const lendingLogSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(LENDING_LOG_SHEET_NAME);
        const lendingData = lendingLogSheet.getRange(2, 1, lendingLogSheet.getLastRow() - 1, lendingLogSheet.getLastColumn()).getValues();
        const lendingMap = new Map(lendingData.map((row, index) => [row[LL_LEND_ID_COLUMN_INDEX - 1], { row, index: index + 2 }]));

        const now = new Date();
        let successCount = 0;

        lendIds.forEach(lendId => {
            const lendDetails = lendingMap.get(lendId);
            if (lendDetails && lendDetails.row[LL_STATUS_COLUMN_INDEX - 1] === '出借中') {
                const assetId = lendDetails.row[2];
                const lenderEmail = lendDetails.row[LL_LENDER_EMAIL_COLUMN_INDEX - 1];  // ✨ 讀取 D 欄（出借人 Email）

                // 🛡️ 安全性修復：驗證使用者是否為出借人
                if (!isAdmin) {
                    if (!lenderEmail || lenderEmail.toLowerCase() !== currentUserEmailLower) {
                        unauthorizedLends.push(lendId);
                        Logger.log(`🛡️ 權限拒絕：${currentUserEmail} 無權歸還此記錄（出借人：${lenderEmail}）`);
                        return; // 跳過此記錄
                    }
                }

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

        // 🛡️ 安全性修復：如果有無權限的記錄，處理錯誤
        if (unauthorizedLends.length > 0) {
            if (successCount === 0) {
                throw new Error('權限不足：您不是這些資產的出借人，無法執行歸還操作。');
            }
        }

        let resultMessage = `成功將 ${successCount} 筆財產狀態更新為「在庫」！`;
        if (unauthorizedLends.length > 0) {
            resultMessage += `（注意：${unauthorizedLends.length} 筆記錄因權限不足已跳過）`;
        }

        return resultMessage;

    } catch (e) {
        Logger.log("批次歸還失敗: " + e.message);
        return "歸還作業失敗：" + e.message;
    }
}

/**
 * [供 userstate.html 呼叫] 取得外部借用待列印清單（按借用人資訊分組）
 */
function getExternalLendingPrintGroups(forceUserScope) {
  try {
    const currentUserEmail = Session.getActiveUser().getEmail().toLowerCase();
    const isAdmin = checkAdminPermissions();
    const useAdminScope = isAdmin && !forceUserScope;
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const lendingLogSheet = ss.getSheetByName(LENDING_LOG_SHEET_NAME);
    if (!lendingLogSheet || lendingLogSheet.getLastRow() < 2) {
      return { groups: [] };
    }

    const dataColumnCount = Math.max(LL_PRINT_TIME_COLUMN_INDEX, lendingLogSheet.getLastColumn());
    const lendingData = lendingLogSheet.getRange(2, 1, lendingLogSheet.getLastRow() - 1, dataColumnCount).getValues();
    const allAssets = getAllAssets();
    const assetMap = new Map(allAssets.map(asset => [String(asset.assetId || '').trim(), asset]));
    const groups = new Map();

    const formatDateValue = (value, pattern) => {
      if (!value) return '';
      try {
        return Utilities.formatDate(new Date(value), Session.getScriptTimeZone(), pattern);
      } catch (e) {
        return String(value);
      }
    };

    lendingData.forEach(row => {
      const status = row[LL_STATUS_COLUMN_INDEX - 1];
      if (status !== '出借中') return;
      const borrowerType = row[LL_BORROWER_TYPE_COLUMN_INDEX - 1];
      if (borrowerType !== 'external') return;
      const docUrl = row[LL_DOC_URL_COLUMN_INDEX - 1];
      if (docUrl) return;

      const assetId = String(row[LL_ASSET_ID_COLUMN_INDEX - 1] || '').trim();
      if (!assetId) return;
      const lenderEmail = String(row[LL_LENDER_EMAIL_COLUMN_INDEX - 1] || '').toLowerCase();
      const assetInfo = assetMap.get(assetId) || {};
      const leaderEmail = String(assetInfo.leaderEmail || '').toLowerCase();
      const userEmail = String(assetInfo.userEmail || '').toLowerCase();
      if (!useAdminScope) {
        if (lenderEmail !== currentUserEmail && leaderEmail !== currentUserEmail && userEmail !== currentUserEmail) return;
      }

      const borrowerName = row[LL_BORROWER_NAME_COLUMN_INDEX - 1] || '';
      const contactPhone = row[LL_CONTACT_PHONE_COLUMN_INDEX - 1] || '';
      const reason = row[LL_REASON_COLUMN_INDEX - 1] || '';
      const expectedReturnDate = formatDateValue(row[LL_EXPECTED_RETURN_DATE_COLUMN_INDEX - 1], 'yyyy/MM/dd');
      const lendingLocation = row[LL_LENDING_LOCATION_COLUMN_INDEX - 1] || '';
      const serialNumber = assetInfo.sourceSheet === PROPERTY_MASTER_SHEET_NAME
        ? (assetInfo.modelBrand || '')
        : (assetInfo.productSerial || '');
      const serialAndId = serialNumber ? `${serialNumber}/${assetId}` : assetId;
      const groupKey = [borrowerName, contactPhone, reason, expectedReturnDate].map(value => String(value || '').trim()).join('||');

      if (!groups.has(groupKey)) {
        groups.set(groupKey, {
          groupKey: groupKey,
          borrowerName: borrowerName,
          contactPhone: contactPhone,
          reason: reason,
          expectedReturnDate: expectedReturnDate,
          assets: []
        });
      }
      groups.get(groupKey).assets.push({
        lendId: row[LL_LEND_ID_COLUMN_INDEX - 1],
        assetId: assetId,
        assetName: assetInfo.assetName || '',
        assetAlias: String(assetInfo.assetAlias || ''),
        productSerial: String(assetInfo.productSerial || ''),
        serialNumber: serialAndId,
        lendingLocation: lendingLocation,
        sourceSheet: String(assetInfo.sourceSheet || '')
      });
    });

    const result = Array.from(groups.values()).map(group => ({
      ...group,
      assetCount: group.assets.length
    }));

    return { groups: result };
  } catch (e) {
    Logger.log(`getExternalLendingPrintGroups 失敗: ${e.message}`);
    return { error: `讀取資料時發生錯誤：${e.message}` };
  }
}

/**
 * [供 userstate.html 呼叫] 建立外部借用出借申請單
 */
function createLendingDoc(lendIds) {
  try {
    if (!lendIds || lendIds.length === 0) {
      throw new Error('請至少選取一筆外部借用記錄。');
    }
    const currentUserEmail = Session.getActiveUser().getEmail().toLowerCase();
    const isAdmin = checkAdminPermissions();
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const lendingLogSheet = ss.getSheetByName(LENDING_LOG_SHEET_NAME);
    const dataColumnCount = Math.max(LL_PRINT_TIME_COLUMN_INDEX, lendingLogSheet.getLastColumn());
    const lendingData = lendingLogSheet.getRange(2, 1, lendingLogSheet.getLastRow() - 1, dataColumnCount).getValues();
    const lendingMap = new Map(lendingData.map((row, index) => [
      row[LL_LEND_ID_COLUMN_INDEX - 1],
      { row, index: index + 2 }
    ]));

    const allAssets = getAllAssets();
    const assetMap = new Map(allAssets.map(asset => [String(asset.assetId || '').trim(), asset]));
    const selected = [];
    const unauthorized = [];
    let groupMeta = null;

    const formatDateValue = (value, pattern) => {
      if (!value) return '';
      try {
        return Utilities.formatDate(new Date(value), Session.getScriptTimeZone(), pattern);
      } catch (e) {
        return String(value);
      }
    };

    lendIds.forEach(lendId => {
      const entry = lendingMap.get(lendId);
      if (!entry) return;
      const row = entry.row;
      if (row[LL_STATUS_COLUMN_INDEX - 1] !== '出借中') return;
      if (row[LL_BORROWER_TYPE_COLUMN_INDEX - 1] !== 'external') return;

      const assetId = String(row[LL_ASSET_ID_COLUMN_INDEX - 1] || '').trim();
      if (!assetId) return;
      const lenderEmail = String(row[LL_LENDER_EMAIL_COLUMN_INDEX - 1] || '').toLowerCase();
      const assetInfo = assetMap.get(assetId) || {};
      const leaderEmail = String(assetInfo.leaderEmail || '').toLowerCase();
      const userEmail = String(assetInfo.userEmail || '').toLowerCase();
      if (!isAdmin && lenderEmail !== currentUserEmail && leaderEmail !== currentUserEmail && userEmail !== currentUserEmail) {
        unauthorized.push(lendId);
        return;
      }

      const borrowerName = String(row[LL_BORROWER_NAME_COLUMN_INDEX - 1] || '').trim();
      const contactPhone = String(row[LL_CONTACT_PHONE_COLUMN_INDEX - 1] || '').trim();
      const reason = String(row[LL_REASON_COLUMN_INDEX - 1] || '').trim();
      const expectedReturnDate = formatDateValue(row[LL_EXPECTED_RETURN_DATE_COLUMN_INDEX - 1], 'yyyy/MM/dd');
      if (!borrowerName || !contactPhone || !reason || !expectedReturnDate) return;

      if (!groupMeta) {
        groupMeta = { borrowerName, contactPhone, reason, expectedReturnDate };
      } else if (
        groupMeta.borrowerName !== borrowerName ||
        groupMeta.contactPhone !== contactPhone ||
        groupMeta.reason !== reason ||
        groupMeta.expectedReturnDate !== expectedReturnDate
      ) {
        throw new Error('選取的外部借用資料條件不一致，請分開列印。');
      }

      const serialNumber = assetInfo.sourceSheet === PROPERTY_MASTER_SHEET_NAME
        ? (assetInfo.modelBrand || '')
        : (assetInfo.productSerial || '');
      const serialAndId = serialNumber ? `${serialNumber}/${assetId}` : assetId;
      selected.push({
        lendId: lendId,
        rowIndex: entry.index,
        assetId: assetId,
        assetName: assetInfo.assetName || '',
        serialNumber: serialAndId,
        lendingLocation: row[LL_LENDING_LOCATION_COLUMN_INDEX - 1] || ''
      });
    });

    if (unauthorized.length > 0 && selected.length === 0) {
      throw new Error('權限不足：您不是這些外部借用記錄的出借人，無法列印。');
    }
    if (!groupMeta || selected.length === 0) {
      throw new Error('找不到可列印的外部借用記錄。');
    }

    const now = new Date();
    const docName = `儀器設備出借單_${groupMeta.borrowerName}_${Utilities.formatDate(now, "GMT+8", "yyyyMMdd")}`;
    const templateFile = DriveApp.getFileById(LENDING_TEMPLATE_DOC_ID);
    const outputFolder = DriveApp.getFolderById(LENDING_OUTPUT_FOLDER_ID);
    const newFile = templateFile.makeCopy(docName, outputFolder);
    const newDoc = DocumentApp.openById(newFile.getId());
    const body = newDoc.getBody();

    body.replaceText("{{申請日期}}", Utilities.formatDate(now, "GMT+8", "yyyy/MM/dd"));
    body.replaceText("{{借用人}}", groupMeta.borrowerName);
    body.replaceText("{{聯絡電話}}", groupMeta.contactPhone);
    body.replaceText("{{出借事由}}", groupMeta.reason);
    body.replaceText("{{預計歸還日期}}", groupMeta.expectedReturnDate);

    const tables = body.getTables();
    if (tables.length === 0) {
      throw new Error('錯誤：在模板文件中找不到表格！');
    }
    const targetTable = tables[0];
    let templateRowIndex = -1;
    for (let i = 0; i < targetTable.getNumRows(); i++) {
      const firstCell = targetTable.getRow(i).getCell(0);
      if (firstCell.getText().includes('{{TEMPLATE_ROW}}')) {
        templateRowIndex = i;
        break;
      }
    }
    if (templateRowIndex === -1) {
      throw new Error('錯誤：在表格中找不到 {{TEMPLATE_ROW}} 範本行！');
    }

    const borderStyle = {};
    borderStyle[DocumentApp.Attribute.BORDER_WIDTH] = 1.5;
    borderStyle[DocumentApp.Attribute.BORDER_COLOR] = '#000000';

    const templateRow = targetTable.getRow(templateRowIndex);
    const templateCellCount = templateRow.getNumCells();
    if (templateCellCount !== 4) {
      throw new Error(`範本行儲存格數量錯誤！預期 4 個，實際 ${templateCellCount} 個。`);
    }

    selected.forEach((item, index) => {
      const cellData = [
        (index + 1).toString(),
        item.assetName || '',
        item.serialNumber || '',
        item.lendingLocation || ''
      ];

      const insertPosition = templateRowIndex + index + 1;
      const newRow = targetTable.insertTableRow(insertPosition);
      for (let i = 0; i < cellData.length; i++) {
        const templateCell = templateRow.getCell(i);
        const newCell = templateCell.copy();
        if (newCell.getNumChildren() > 0 &&
            newCell.getChild(0).getType() === DocumentApp.ElementType.PARAGRAPH) {
          newCell.getChild(0).asParagraph().setText(cellData[i]);
          while (newCell.getNumChildren() > 1) {
            newCell.removeChild(newCell.getChild(1));
          }
        } else {
          newCell.setText(cellData[i]);
        }
        try {
          newCell.setAttributes(borderStyle);
        } catch (borderError) {
          Logger.log(`⚠️ 儲存格 ${i} 設定邊框失敗: ${borderError.message}`);
        }
        newRow.appendTableCell(newCell);
      }
    });

    targetTable.removeRow(templateRowIndex);
    newDoc.saveAndClose();
    const fileUrl = newFile.getUrl();

    selected.forEach(item => {
      lendingLogSheet.getRange(item.rowIndex, LL_DOC_URL_COLUMN_INDEX).setValue(fileUrl);
      lendingLogSheet.getRange(item.rowIndex, LL_PRINT_TIME_COLUMN_INDEX).setValue(now);
    });

    return {
      fileUrl: fileUrl,
      lendIds: selected.map(item => item.lendId)
    };
  } catch (e) {
    Logger.log(`createLendingDoc 失敗: ${e.message} at ${e.stack}`);
    throw new Error('產生出借申請單時發生錯誤：' + e.message);
  }
}

/**
 * [供 userstate.html 呼叫] 取得外部借用列印歷史
 */
function getLendingDocHistory(forceUserScope) {
  const currentUserEmail = Session.getActiveUser().getEmail().toLowerCase();
  const isAdmin = checkAdminPermissions();
  const useAdminScope = isAdmin && !forceUserScope;

  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const lendingLogSheet = ss.getSheetByName(LENDING_LOG_SHEET_NAME);
    if (!lendingLogSheet || lendingLogSheet.getLastRow() < 2) {
      return [];
    }
    const dataColumnCount = Math.max(LL_PRINT_TIME_COLUMN_INDEX, lendingLogSheet.getLastColumn());
    const lendingData = lendingLogSheet.getRange(2, 1, lendingLogSheet.getLastRow() - 1, dataColumnCount).getValues();
    const allAssets = getAllAssets();
    const assetMap = new Map(allAssets.map(asset => [String(asset.assetId || '').trim(), asset]));

    const formatDateValue = (value, pattern) => {
      if (!value) return '';
      try {
        return Utilities.formatDate(new Date(value), Session.getScriptTimeZone(), pattern);
      } catch (e) {
        return String(value);
      }
    };

    const records = [];
    lendingData.forEach(row => {
      const docUrl = row[LL_DOC_URL_COLUMN_INDEX - 1];
      if (!docUrl) return;
      if (row[LL_BORROWER_TYPE_COLUMN_INDEX - 1] !== 'external') return;

      const assetId = String(row[LL_ASSET_ID_COLUMN_INDEX - 1] || '').trim();
      const lenderEmail = String(row[LL_LENDER_EMAIL_COLUMN_INDEX - 1] || '').toLowerCase();
      const assetInfo = assetMap.get(assetId) || {};
      const leaderEmail = String(assetInfo.leaderEmail || '').toLowerCase();
      const userEmail = String(assetInfo.userEmail || '').toLowerCase();
      if (!useAdminScope) {
        if (lenderEmail !== currentUserEmail && leaderEmail !== currentUserEmail && userEmail !== currentUserEmail) return;
      }

      const borrowerName = row[LL_BORROWER_NAME_COLUMN_INDEX - 1] || '';
      const contactPhone = row[LL_CONTACT_PHONE_COLUMN_INDEX - 1] || '';
      const printTime = formatDateValue(row[LL_PRINT_TIME_COLUMN_INDEX - 1], 'yyyy/MM/dd');
      const fallbackTime = formatDateValue(row[LL_LEND_TIME_COLUMN_INDEX - 1], 'yyyy/MM/dd');
      records.push({
        url: docUrl,
        borrowerName: borrowerName,
        contactPhone: contactPhone,
        date: printTime || fallbackTime
      });
    });

    const docMap = new Map();
    records.forEach(record => {
      const url = record.url;
      if (!docMap.has(url)) {
        docMap.set(url, {
          url: url,
          borrowerName: record.borrowerName,
          contactPhone: record.contactPhone,
          date: record.date,
          count: 0
        });
      }
      docMap.get(url).count++;
    });

    const history = Array.from(docMap.values()).map(item => ({
      url: item.url,
      borrowerName: item.borrowerName,
      contactPhone: item.contactPhone,
      date: item.date,
      count: item.count
    }));

    history.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB - dateA;
    });

    return history;
  } catch (e) {
    Logger.log(`getLendingDocHistory 失敗: ${e.message}`);
    throw new Error("取得歷史紀錄時發生錯誤: " + e.message);
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
    const currentUserEmailLower = String(currentUserEmail || '').toLowerCase();
    const appLogSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(APPLICATION_LOG_SHEET_NAME);
    const lastRow = appLogSheet.getLastRow();
    if (lastRow < 2) {
      return 0;
    }
    const values = appLogSheet.getRange(2, 1, lastRow - 1, AL_TRANSFER_TYPE_COLUMN_INDEX).getValues();
    const groupProxyEnabled = isGroupProxyTransferEnabled();
    const groupEmailSet = groupProxyEnabled
      ? new Set(getGroupMemberEmails(currentUserEmail).map(email => String(email || '').toLowerCase().trim()))
      : null;
    
    let count = 0;
    for (const row of values) {
      if (row[AL_STATUS_COLUMN_INDEX - 1] !== "待接收") continue;
      const newLeaderEmail = row[AL_NEW_LEADER_EMAIL_COLUMN_INDEX - 1];
      const newUserEmail = row[AL_NEW_USER_EMAIL_COLUMN_INDEX - 1];
      const transferType = row[AL_TRANSFER_TYPE_COLUMN_INDEX - 1] || '地點';
      if (canApproveTransfer_({
        currentUserEmailLower,
        newLeaderEmailLower: newLeaderEmail,
        newUserEmailLower: newUserEmail,
        transferType: transferType,
        groupProxyEnabled: groupProxyEnabled,
        groupEmailSet: groupEmailSet
      })) {
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

function getScrapLogSheet(ss) {
  const spreadsheet = ss || SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = spreadsheet.getSheetByName(SCRAP_LOG_SHEET_NAME);
  if (!sheet) {
    throw new Error(`找不到工作表「${SCRAP_LOG_SHEET_NAME}」，請先建立報廢紀錄表。`);
  }
  return sheet;
}

function getScrapLogEffectiveTime(row) {
  const rawUpdate = row[SL_UPDATE_TIME_COLUMN_INDEX - 1];
  const rawApply = row[SL_APPLY_TIME_COLUMN_INDEX - 1];
  const raw = rawUpdate || rawApply;
  const timeValue = raw ? new Date(raw).getTime() : 0;
  return Number.isNaN(timeValue) ? 0 : timeValue;
}

function buildLatestScrapLogIndex(scrapLogData, statusFilterSet) {
  const latestByAsset = {};
  const latestTimeByAsset = {};
  scrapLogData.forEach((row, index) => {
    const assetId = String(row[SL_ASSET_ID_COLUMN_INDEX - 1] || '').trim();
    if (!assetId) return;
    const status = row[SL_STATUS_COLUMN_INDEX - 1];
    if (statusFilterSet && !statusFilterSet.has(status)) return;

    const timeValue = getScrapLogEffectiveTime(row);
    if (!latestByAsset[assetId] || timeValue >= (latestTimeByAsset[assetId] || 0)) {
      latestByAsset[assetId] = { row: row, rowIndex: index + 2 };
      latestTimeByAsset[assetId] = timeValue;
    }
  });
  return latestByAsset;
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
        modelBrand: asset.modelBrand || '',
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

    // 🛡️ 安全性修復：取得當前使用者身分
    const currentUserEmail = Session.getActiveUser().getEmail();
    const currentUserEmailLower = currentUserEmail.toLowerCase();
    const isAdmin = checkAdminPermissions();
    const unauthorizedAssets = []; // 🛡️ 收集無權限的資產

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const scrapLogSheet = getScrapLogSheet(ss);
    const allAssets = getAllAssets();
    const assetMap = new Map(allAssets.map(asset => [asset.assetId, asset]));

    const now = new Date();
    let successCount = 0;
    const scrappedAssets = []; // 收集報廢財產資訊供郵件通知使用
    const fullReason = reason === '其他' ? `其他: ${remarks}` : `${reason} ${remarks}`;
    const scrapLogRows = [];
    let logSequence = 0;

    assetIds.forEach(assetId => {
      const asset = assetMap.get(assetId);

      // 🛡️ 安全性修復：驗證使用者是否有權報廢此資產
      if (asset && !isAdmin) {
        const assetLeaderEmail = (asset.leaderEmail || '').toLowerCase();
        const assetUserEmail = (asset.userEmail || '').toLowerCase();
        if (assetLeaderEmail !== currentUserEmailLower && assetUserEmail !== currentUserEmailLower) {
          unauthorizedAssets.push(assetId);
          Logger.log(`🛡️ 權限拒絕：${currentUserEmail} 無權報廢資產 ${assetId}`);
          return; // 跳過此資產
        }
      }

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

          const scrapId = `SCRAP-${now.getTime()}-${logSequence}`;
          logSequence += 1;
          scrapLogRows.push([
            scrapId,
            now,
            asset.assetId,
            currentUserEmail,
            asset.leaderName || '',
            asset.userName || '無',
            asset.location || '',
            asset.assetCategory || '',
            asset.assetName || '',
            asset.modelBrand || '',
            fullReason,
            '報廢中',
            '',
            '',
            '',
            ''
          ]);

          successCount++;
        } else {
          Logger.log(`processBatchScrapping: 找不到資產 ${assetId}，跳過。`);
        }
      }
    });

    // 🛡️ 安全性修復：如果有無權限的資產，處理錯誤
    if (unauthorizedAssets.length > 0) {
      if (successCount === 0) {
        throw new Error(`權限不足：您不是所選財產的保管人或使用人，無法執行報廢操作。`);
      }
    }

    if (successCount === 0) {
      throw new Error("處理失敗，勾選的財產可能已在報廢流程中或狀態已變更。");
    }

    if (scrapLogRows.length > 0) {
      scrapLogSheet.getRange(scrapLogSheet.getLastRow() + 1, 1, scrapLogRows.length, scrapLogRows[0].length)
        .setValues(scrapLogRows);
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

    let resultMessage = `成功為 ${successCount} 筆財產提交報廢申請，請列印報廢申請單。`;
    if (unauthorizedAssets.length > 0) {
      resultMessage += `（注意：${unauthorizedAssets.length} 筆財產因權限不足已跳過）`;
    }

    return resultMessage;

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
    const scrapLogSheet = getScrapLogSheet(ss);
    const scrapLogLastRow = scrapLogSheet.getLastRow();
    const scrapLogData = scrapLogLastRow > 1
      ? scrapLogSheet.getRange(2, 1, scrapLogLastRow - 1, scrapLogSheet.getLastColumn()).getValues()
      : [];
    const pendingLogMap = buildLatestScrapLogIndex(scrapLogData, new Set(['報廢中']));
    const approverEmail = Session.getActiveUser().getEmail();

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

          const logEntry = pendingLogMap[String(assetId || '').trim()];
          if (logEntry) {
            scrapLogSheet.getRange(logEntry.rowIndex, SL_STATUS_COLUMN_INDEX).setValue('已報廢');
            scrapLogSheet.getRange(logEntry.rowIndex, SL_UPDATE_TIME_COLUMN_INDEX).setValue(now);
            scrapLogSheet.getRange(logEntry.rowIndex, SL_APPROVER_EMAIL_COLUMN_INDEX).setValue(approverEmail);
          }
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
 * [供 scrapHistory.html 呼叫] 取得所有已報廢的資產清單
 * 僅管理員可存取
 * @returns {Object} { assets: Array, isAdmin: boolean, error?: string }
 */
function getScrapHistoryData() {
  try {
    const isAdmin = checkAdminPermissions();

    if (!isAdmin) {
      return {
        assets: [],
        isAdmin: false,
        error: '權限不足：僅管理員可查看已報廢資產歷史紀錄。'
      };
    }

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const scrapLogSheet = getScrapLogSheet(ss);
    const scrapLogLastRow = scrapLogSheet.getLastRow();
    if (scrapLogLastRow < 2) {
      return { assets: [], isAdmin: true };
    }

    const scrapLogData = scrapLogSheet.getRange(2, 1, scrapLogLastRow - 1, scrapLogSheet.getLastColumn()).getValues();
    const latestLogMap = buildLatestScrapLogIndex(scrapLogData, null);

    const formatDateValue = (value, pattern) => {
      if (!value) return '';
      try {
        return Utilities.formatDate(new Date(value), Session.getScriptTimeZone(), pattern);
      } catch (e) {
        return '';
      }
    };

    const results = Object.keys(latestLogMap)
      .map(assetId => latestLogMap[assetId].row)
      .filter(row => row[SL_STATUS_COLUMN_INDEX - 1] === '已報廢')
      .map(row => {
        const rawDate = row[SL_UPDATE_TIME_COLUMN_INDEX - 1] || row[SL_APPLY_TIME_COLUMN_INDEX - 1];
        return {
          assetId: String(row[SL_ASSET_ID_COLUMN_INDEX - 1] || ''),
          assetName: String(row[SL_ASSET_NAME_COLUMN_INDEX - 1] || ''),
          modelBrand: String(row[SL_MODEL_BRAND_COLUMN_INDEX - 1] || ''),
          assetCategory: String(row[SL_ASSET_CATEGORY_COLUMN_INDEX - 1] || ''),
          leaderName: String(row[SL_KEEPER_NAME_COLUMN_INDEX - 1] || ''),
          userName: String(row[SL_USER_NAME_COLUMN_INDEX - 1] || ''),
          location: String(row[SL_LOCATION_COLUMN_INDEX - 1] || ''),
          scrapDate: formatDateValue(rawDate, 'yyyy/MM/dd'),
          scrapReason: String(row[SL_SCRAP_REASON_COLUMN_INDEX - 1] || ''),
          sourceSheet: ''
        };
      });

    // 按報廢日期降序排列（最新的在前面）
    results.sort((a, b) => {
      if (!a.scrapDate && !b.scrapDate) return 0;
      if (!a.scrapDate) return 1;
      if (!b.scrapDate) return -1;
      return b.scrapDate.localeCompare(a.scrapDate);
    });

    return {
      assets: results,
      isAdmin: true
    };

  } catch (e) {
    Logger.log("取得已報廢資產失敗: " + e.message);
    return {
      assets: [],
      isAdmin: false,
      error: '取得資料失敗：' + e.message
    };
  }
}

/**
 * [供 printScrap.html Tab 2 呼叫] 根據日期範圍獲取已報廢資產清單（管理員專用）
 * @param {string} startDate - 起始日期 (YYYY-MM-DD)
 * @param {string} endDate - 結束日期 (YYYY-MM-DD)
 * @param {string} assetCategory - 資產類別 ("財產" 或 "非消耗品")
 * @returns {Array} 已報廢資產物件陣列
 */
function getScrapAssetsByDateRange(startDate, endDate, assetCategory) {
  try {
    Logger.log(`📅 [getScrapAssetsByDateRange] 開始處理 - 日期範圍: ${startDate} ~ ${endDate}, 類別: ${assetCategory}`);

    // 權限檢查
    if (!checkAdminPermissions()) {
      throw new Error("您沒有權限執行此操作");
    }

    // 日期驗證
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new Error("日期格式錯誤");
    }

    if (start > end) {
      throw new Error("起始日期不能晚於結束日期");
    }

    // 設定日期範圍為一整天（00:00:00 ~ 23:59:59）
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const scrapLogSheet = getScrapLogSheet(ss);
    const scrapLogLastRow = scrapLogSheet.getLastRow();
    if (scrapLogLastRow < 2) {
      return [];
    }

    const scrapLogData = scrapLogSheet.getRange(2, 1, scrapLogLastRow - 1, scrapLogSheet.getLastColumn()).getValues();
    const latestLogMap = buildLatestScrapLogIndex(scrapLogData, null);
    const latestRows = Object.keys(latestLogMap).map(assetId => latestLogMap[assetId].row);

    const filteredRows = latestRows.filter(row => {
      const status = row[SL_STATUS_COLUMN_INDEX - 1];
      if (status !== '已報廢') return false;
      if (assetCategory && row[SL_ASSET_CATEGORY_COLUMN_INDEX - 1] !== assetCategory) return false;
      const rawDate = row[SL_UPDATE_TIME_COLUMN_INDEX - 1] || row[SL_APPLY_TIME_COLUMN_INDEX - 1];
      if (!rawDate) return false;
      try {
        const assetDate = new Date(rawDate);
        return assetDate >= start && assetDate <= end;
      } catch (e) {
        Logger.log(`⚠️  資產 ${row[SL_ASSET_ID_COLUMN_INDEX - 1]} 的日期解析失敗: ${e.message}`);
        return false;
      }
    });

    Logger.log(`✅ 找到 ${filteredRows.length} 筆符合條件的資產`);

    const formatDateValue = (value, pattern) => {
      if (!value) return '';
      try {
        return Utilities.formatDate(new Date(value), Session.getScriptTimeZone(), pattern);
      } catch (e) {
        return '';
      }
    };

    const assetMap = new Map(getAllAssets().map(asset => [String(asset.assetId || '').trim(), asset]));
    const results = filteredRows.map(row => {
      const rawDate = row[SL_UPDATE_TIME_COLUMN_INDEX - 1] || row[SL_APPLY_TIME_COLUMN_INDEX - 1];
      const assetId = String(row[SL_ASSET_ID_COLUMN_INDEX - 1] || '').trim();
      const asset = assetMap.get(assetId) || {};
      return {
        assetId: assetId,
        assetName: String(row[SL_ASSET_NAME_COLUMN_INDEX - 1] || ''),
        assetAlias: String(asset.assetAlias || ''),
        productSerial: String(asset.productSerial || ''),
        modelBrand: String(row[SL_MODEL_BRAND_COLUMN_INDEX - 1] || ''),
        leaderName: String(row[SL_KEEPER_NAME_COLUMN_INDEX - 1] || ''),
        userName: String(row[SL_USER_NAME_COLUMN_INDEX - 1] || ''),
        location: String(row[SL_LOCATION_COLUMN_INDEX - 1] || ''),
        scrapDate: formatDateValue(rawDate, 'yyyy/MM/dd'),
        scrapReason: String(row[SL_SCRAP_REASON_COLUMN_INDEX - 1] || ''),
        sourceSheet: String(asset.sourceSheet || '')
      };
    });

    // 按報廢日期降序排列
    results.sort((a, b) => {
      if (!a.scrapDate && !b.scrapDate) return 0;
      if (!a.scrapDate) return 1;
      if (!b.scrapDate) return -1;
      return b.scrapDate.localeCompare(a.scrapDate);
    });

    return results;

  } catch (e) {
    Logger.log('❌ [getScrapAssetsByDateRange] 錯誤: ' + e.message);
    throw new Error('獲取資料失敗：' + e.message);
  }
}

/**
 * [供 scrapHistory.html 呼叫] 將已報廢資產回溯為在庫狀態
 * 僅管理員可執行
 * @param {string[]} assetIds - 要回溯的資產編號陣列
 * @returns {string} 成功/失敗訊息
 */
function restoreFromScrap(assetIds) {
  if (!assetIds || assetIds.length === 0) {
    throw new Error("您沒有勾選任何要回溯的項目。");
  }

  // 權限檢查
  const isAdmin = checkAdminPermissions();
  if (!isAdmin) {
    throw new Error("權限不足：僅管理員可執行回溯作業。");
  }

  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const scrapLogSheet = getScrapLogSheet(ss);
    const scrapLogLastRow = scrapLogSheet.getLastRow();
    const scrapLogData = scrapLogLastRow > 1
      ? scrapLogSheet.getRange(2, 1, scrapLogLastRow - 1, scrapLogSheet.getLastColumn()).getValues()
      : [];
    const completedLogMap = buildLatestScrapLogIndex(scrapLogData, new Set(['已報廢']));

    const allAssets = getAllAssets();
    const assetMap = new Map(allAssets.map(asset => [asset.assetId, asset]));

    const now = new Date();
    let successCount = 0;
    const failedIds = [];
    const currentUserEmail = Session.getActiveUser().getEmail();

    assetIds.forEach(assetId => {
      const asset = assetMap.get(assetId);
      if (asset && asset.assetStatus === '已報廢') {
        const location = findAssetLocation(assetId);
        if (location) {
          const indices = location.sheetName === PROPERTY_MASTER_SHEET_NAME ? PROPERTY_COLUMN_INDICES : ITEM_COLUMN_INDICES;

          // 更新狀態為「在庫」
          location.sheet.getRange(location.rowIndex, indices.ASSET_STATUS).setValue('在庫');

          // 更新備註欄位，標記為已回溯
          const originalReason = asset.remarks || '';
          const restoreNote = `[回溯] ${Utilities.formatDate(now, Session.getScriptTimeZone(), "yyyy/MM/dd")} 由管理員回溯為在庫。原報廢原因：${originalReason.replace('[報廢完成]', '').trim()}`;
          location.sheet.getRange(location.rowIndex, indices.REMARKS).setValue(restoreNote);

          // 更新最後修改日期
          location.sheet.getRange(location.rowIndex, indices.LAST_MODIFIED).setValue(now);

          const logEntry = completedLogMap[String(assetId || '').trim()];
          if (logEntry) {
            scrapLogSheet.getRange(logEntry.rowIndex, SL_STATUS_COLUMN_INDEX).setValue('已回溯');
            scrapLogSheet.getRange(logEntry.rowIndex, SL_UPDATE_TIME_COLUMN_INDEX).setValue(now);
            scrapLogSheet.getRange(logEntry.rowIndex, SL_APPROVER_EMAIL_COLUMN_INDEX).setValue(currentUserEmail);
          }

          successCount++;
        } else {
          failedIds.push(assetId);
        }
      } else {
        failedIds.push(assetId);
      }
    });

    let message = `成功將 ${successCount} 筆資產回溯為在庫狀態！`;
    if (failedIds.length > 0) {
      message += `\n以下資產回溯失敗（可能狀態非「已報廢」或找不到資料）：${failedIds.join(', ')}`;
    }

    return {
      success: successCount > 0,
      message: message,
      count: successCount,
      failed: failedIds
    };

  } catch (e) {
    Logger.log("回溯報廢資產失敗: " + e.message);
    return {
      success: false,
      message: "回溯失敗：" + e.message,
      count: 0,
      failed: []
    };
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

function checkAdminPermissions() {
  const currentUserEmail = Session.getActiveUser().getEmail().toLowerCase();
  const adminEmails = getAdminEmails().map(email => email.toLowerCase());
  return adminEmails.includes(currentUserEmail);
}

function checkAdminStatus() {
  return checkAdminPermissions();
}

/**
 * 取得所有待報廢的詳細項目 (詳細模式用)
 * @param {string} assetCategory - 財產類別 (財產/非消耗品)
 * @returns {Array<Object>} 包含詳細資訊的陣列
 */
function getAllScrappableItems(assetCategory, forceUserScope) {
  // 1. 取得當前使用者身分與權限
  const currentUserEmail = Session.getActiveUser().getEmail();
  const currentUserEmailLower = String(currentUserEmail || '').toLowerCase().trim();
  const isAdmin = checkAdminPermissions();
  const useAdminScope = isAdmin && !forceUserScope;

  // ✨ 同組協作：取得同組成員 Email 清單
  const groupProxyEnabled = !useAdminScope && isGroupProxyTransferEnabled();
  const groupEmailSet = groupProxyEnabled
    ? new Set(getGroupMemberEmails(currentUserEmail).map(email => String(email || '').toLowerCase().trim()))
    : null;

  const allAssets = getAllAssets();

  // 2. 篩選符合條件的資產 (狀態 + 權限)
  const targetAssets = allAssets.filter(asset => {
    // 基本條件
    if (asset.assetStatus !== '報廢中' || asset.assetCategory !== assetCategory) {
      return false;
    }

    // 權限條件：管理員看全部
    if (useAdminScope) return true;

    // 一般使用者：檢查是否為保管人或使用人
    const assetLeaderEmail = String(asset.leaderEmail || '').toLowerCase().trim();
    const assetUserEmail = String(asset.userEmail || '').toLowerCase().trim();
    const isOwner = assetLeaderEmail === currentUserEmailLower || assetUserEmail === currentUserEmailLower;

    // ✨ 同組協作：同組成員的報廢中資產也應可見
    const isGroupMember = groupProxyEnabled && groupEmailSet &&
                          (groupEmailSet.has(assetLeaderEmail) || groupEmailSet.has(assetUserEmail));

    return isOwner || isGroupMember;
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
      assetAlias: String(asset.assetAlias || ''),
      productSerial: String(asset.productSerial || ''),
      modelBrand: String(asset.modelBrand || ''),
      originalKeeper: String(asset.leaderName || ''),
      originalUser: String(asset.userName || ''), // 物品總表可能無此欄位，轉為空字串
      scrapDate: scrapDateStr,                    // 傳送格式化後的字串，而非 Date 物件
      scrapReason: String(asset.remarks || ''),    // 確保為字串
      sourceSheet: String(asset.sourceSheet || '')
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

function getScrappingDataForAdmin(assetCategory, forceUserScope) {
  // 此函式名稱雖保留 "ForAdmin"，但現在已支援一般使用者
  const currentUserEmail = Session.getActiveUser().getEmail();
  const isAdmin = checkAdminPermissions();
  const useAdminScope = isAdmin && !forceUserScope;

  try {
    const allAssets = getAllAssets();
    
    const applicants = {};

    allAssets.forEach(asset => {
      if (asset.assetStatus === '報廢中' && asset.leaderName && asset.assetCategory === assetCategory) {
        // 權限過濾：非管理員只能看到自己的資料
        if (!useAdminScope) {
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
function getScrappingApplicants(assetCategory, forceUserScope) {
  // 直接轉呼叫通用的邏輯
  return getScrappingDataForAdmin(assetCategory, forceUserScope);
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
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const scrapLogSheet = getScrapLogSheet(ss);
    const scrapLogLastRow = scrapLogSheet.getLastRow();
    const scrapLogData = scrapLogLastRow > 1
      ? scrapLogSheet.getRange(2, 1, scrapLogLastRow - 1, scrapLogSheet.getLastColumn()).getValues()
      : [];
    const printableLogMap = buildLatestScrapLogIndex(scrapLogData, new Set(['報廢中', '已報廢']));

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
            // 若年份 < 1912，視為民國年並補 +1911（處理試算表將 0109/12/25 解析成西元 109 年的情況）
            if (purchaseDate.getFullYear() < 1912) {
                purchaseDate.setFullYear(purchaseDate.getFullYear() + 1911);
            }
        } else {
            const dateParts = purchaseDateStr.match(/(\d+)\/(\d+)\/(\d+)/);
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
          assetInfo.modelBrand || '',                                                      // 型號/廠牌（表頭仍顯示「序號」）
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

    assetsToScrap.forEach(asset => {
      const logEntry = printableLogMap[String(asset.assetId || '').trim()];
      if (logEntry) {
        scrapLogSheet.getRange(logEntry.rowIndex, SL_DOC_URL_COLUMN_INDEX).setValue(fileUrl);
        scrapLogSheet.getRange(logEntry.rowIndex, SL_PRINT_TIME_COLUMN_INDEX).setValue(now);
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

/**
 * [供 printScrap.html Tab 2 呼叫] 根據日期範圍生成報廢申請單（管理員專用）
 * @param {string} startDate - 起始日期 (YYYY-MM-DD)
 * @param {string} endDate - 結束日期 (YYYY-MM-DD)
 * @param {string} assetCategory - 資產類別 ("財產" 或 "非消耗品")
 * @returns {Object} { fileUrl: 文件URL, assetCount: 資產數量, assetIds: 資產ID陣列, dateRange: 日期範圍 }
 */
function createScrapDocByDateRange(startDate, endDate, assetCategory) {
  try {
    Logger.log(`📄 [createScrapDocByDateRange] 開始生成文件 - 日期範圍: ${startDate} ~ ${endDate}, 類別: ${assetCategory}`);

    // 權限檢查
    if (!checkAdminPermissions()) {
      throw new Error("您沒有權限執行此操作");
    }

    // 獲取日期範圍內的資產
    const assets = getScrapAssetsByDateRange(startDate, endDate, assetCategory);

    if (!assets || assets.length === 0) {
      throw new Error("該日期範圍內沒有已報廢的資產");
    }

    Logger.log(`✅ 找到 ${assets.length} 筆資產，準備生成文件`);

    // 提取所有資產ID
    const assetIds = assets.map(asset => asset.assetId);

    // 獲取管理員名稱作為申請人
    const adminName = getAdminName();
    Logger.log(`👤 管理員名稱: ${adminName}`);

    // 使用現有的 createScrapDoc 函數生成文件
    // 第三個參數傳入 assetIds 陣列，會觸發「彙總模式」
    const result = createScrapDoc(adminName, assetCategory, assetIds);

    Logger.log(`📄 文件生成成功: ${result.fileUrl}`);

    // 補充額外資訊
    return {
      fileUrl: result.fileUrl,
      assetCount: assets.length,
      assetIds: result.assetIds,
      dateRange: `${startDate} ~ ${endDate}`
    };

  } catch (e) {
    Logger.log('❌ [createScrapDocByDateRange] 錯誤: ' + e.message);
    throw new Error('生成文件失敗：' + e.message);
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
function getAllTransferableItems(assetCategory, forceUserScope) {
  const currentUserEmail = Session.getActiveUser().getEmail().toLowerCase();
  const isAdmin = checkAdminPermissions();
  const useAdminScope = isAdmin && !forceUserScope;
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
        if (!useAdminScope) {
           // 一般使用者只能看到自己相關的（新保管人或新使用人）
           const newKeeperEmailLower = transfer.newKeeperEmail ? transfer.newKeeperEmail.toLowerCase() : '';
           const newUserEmailLower = transfer.newUserEmail ? transfer.newUserEmail.toLowerCase() : '';
           const isOwner = newKeeperEmailLower === currentUserEmail || newUserEmailLower === currentUserEmail;

           // ✨ 同組協作：同組成員的轉移申請單也應可見
           let isGroupMember = false;
           const groupProxyEnabled = isGroupProxyTransferEnabled();
           if (groupProxyEnabled) {
             const groupEmails = getGroupMemberEmails(currentUserEmail).map(email => String(email || '').toLowerCase().trim());
             const groupEmailSet = new Set(groupEmails);
             isGroupMember = groupEmailSet.has(newKeeperEmailLower) || (newUserEmailLower && groupEmailSet.has(newUserEmailLower));
           }

           if (!isOwner && !isGroupMember) return;
        }

        items.push({
          assetId: asset.assetId,
          assetName: asset.assetName,
          assetAlias: String(asset.assetAlias || ''),
          productSerial: String(asset.productSerial || ''),
          modelBrand: asset.modelBrand || '',
          oldKeeper: transfer.oldKeeper,
          oldUser: transfer.oldUser || '',
          oldLocation: transfer.oldLocation,
          newKeeper: transfer.newKeeper,
          newUser: transfer.newUser || '',
          newLocation: transfer.newLocation,
          transferType: transfer.transferType,
          transferDate: new Date(transfer.reviewTime).toLocaleDateString('zh-TW'),
          sourceSheet: String(asset.sourceSheet || '')
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
 * [供 userstate.html 呼叫] 獲取待列印轉移申請單的數量
 * @returns {number} 待列印的轉移記錄總數（財產 + 物品）
 */
function getTransferableItemsCount(forceUserScope) {
  try {
    const propertyItems = getAllTransferableItems('財產', forceUserScope);
    const itemItems = getAllTransferableItems('物品', forceUserScope);
    return propertyItems.length + itemItems.length;
  } catch (e) {
    Logger.log(`getTransferableItemsCount 失敗: ${e.message}`);
    return 0; // 錯誤時返回 0，避免前端崩潰
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

    appLogData.forEach((row, index) => {  // ✨ 新增 index 參數
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
            reviewTime: reviewTime,
            rowIndex: index + 2  // ✨ 新增：記錄工作表行號（陣列索引 + 2）
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
          asset.modelBrand || '',           // 型號/廠牌（表頭仍顯示「序號」）
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

    // ✨ 新增：回寫 DOC_URL 到 APPLICATION_LOG (R 欄)
    Logger.log(`準備更新 APPLICATION_LOG 的 R 欄，共 ${assetsToTransfer.length} 筆記錄`);
    let updatedCount = 0;

    assetsToTransfer.forEach(item => {
      const transfer = item.transfer;
      const assetId = item.asset.assetId;

      // 檢查是否有記錄行號（理論上一定有，因為是從 Map 中篩選出來的）
      if (transfer.rowIndex) {
        try {
          appLogSheet.getRange(transfer.rowIndex, AL_DOC_URL_COLUMN_INDEX).setValue(fileUrl);
          updatedCount++;
          Logger.log(`✓ 已更新資產 ${assetId} 的轉移記錄（行 ${transfer.rowIndex}）`);
        } catch (e) {
          Logger.log(`✗ 更新資產 ${assetId} 的轉移記錄時失敗（行 ${transfer.rowIndex}）: ${e.message}`);
          // 不中斷流程，繼續處理其他資產
        }
      } else {
        Logger.log(`⚠️ 警告：資產 ${assetId} 的轉移記錄缺少 rowIndex，跳過更新`);
      }
    });

    Logger.log(`APPLICATION_LOG R 欄更新完成：成功 ${updatedCount}/${assetsToTransfer.length} 筆`);

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

/**
 * 取得轉移文件的歷史紀錄
 * @param {string} assetCategory - 財產類別（'財產' 或 '物品'）
 * @returns {Array} 歷史紀錄陣列，按日期降序排列
 */
function getTransferDocHistory(assetCategory) {
  const currentUserEmail = Session.getActiveUser().getEmail().toLowerCase();
  const isAdmin = checkAdminPermissions();

  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const appLogSheet = ss.getSheetByName(APPLICATION_LOG_SHEET_NAME);
    const appLogData = appLogSheet.getRange(2, 1, appLogSheet.getLastRow() - 1, appLogSheet.getLastColumn()).getValues();

    // 1️⃣ 篩選有文件連結的記錄
    const recordsWithDoc = [];
    appLogData.forEach(row => {
      const docUrl = row[AL_DOC_URL_COLUMN_INDEX - 1];
      const status = row[AL_STATUS_COLUMN_INDEX - 1];
      const assetId = row[AL_ASSET_ID_COLUMN_INDEX - 1];
      const newKeeperEmail = row[AL_NEW_LEADER_EMAIL_COLUMN_INDEX - 1];
      const newUserEmail = row[AL_NEW_USER_EMAIL_COLUMN_INDEX - 1];

      // 跳過沒有文件連結或狀態不是「已完成」的記錄
      if (!docUrl || docUrl.trim() === '' || status !== '已完成') {
        return;
      }

      // 權限檢查（非管理員只能看到與自己相關的記錄）
      if (!isAdmin) {
        const isRelevant = (newKeeperEmail && newKeeperEmail.toLowerCase() === currentUserEmail) ||
                           (newUserEmail && newUserEmail.toLowerCase() === currentUserEmail);
        if (!isRelevant) {
          return;
        }
      }

      // 取得資產類別（需要從資產表查詢）
      const asset = getAllAssets().find(a => a.assetId === assetId);
      if (!asset) return;

      // 類別篩選
      if (assetCategory && asset.assetCategory !== assetCategory) {
        return;
      }

      recordsWithDoc.push({
        url: docUrl,
        keeper: row[AL_NEW_LEADER_COLUMN_INDEX - 1],
        date: row[AL_REVIEW_TIME_COLUMN_INDEX - 1],  // 審核時間作為轉移日期
        assetId: assetId
      });
    });

    // 2️⃣ 依文件 URL 分組統計
    const docMap = new Map();
    recordsWithDoc.forEach(record => {
      const url = record.url;
      if (!docMap.has(url)) {
        docMap.set(url, {
          url: url,
          keeper: record.keeper,
          date: record.date,
          count: 0
        });
      }
      docMap.get(url).count++;
    });

    // 3️⃣ 轉換為陣列並排序（按日期降序）
    const history = Array.from(docMap.values()).map(item => ({
      url: item.url,
      keeper: item.keeper,
      date: Utilities.formatDate(new Date(item.date), Session.getScriptTimeZone(), "yyyy/MM/dd"),
      count: item.count
    }));

    // 按日期降序排列（最新的在前）
    history.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB - dateA;
    });

    Logger.log(`成功取得轉移文件歷史紀錄，共 ${history.length} 筆`);
    return history;

  } catch (e) {
    Logger.log(`getTransferDocHistory 失敗: ${e.message}`);
    throw new Error("取得歷史紀錄時發生錯誤: " + e.message);
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
    const currentUserEmailLower = String(currentUserEmail || '').toLowerCase().trim();
    const isAdmin = checkAdminPermissions();

    const allAssets = getAllAssets();
    const asset = allAssets.find(a => a.assetId === assetId);

    if (!asset) {
      throw new Error(`找不到財產編號為 ${assetId} 的資料。`);
    }

    // Security Check: Must be admin, asset owner, or group member (if group proxy enabled)
    const assetLeaderEmail = String(asset.leaderEmail || '').toLowerCase().trim();
    const assetUserEmail = String(asset.userEmail || '').toLowerCase().trim();

    let hasPermission = isAdmin ||
                        assetLeaderEmail === currentUserEmailLower ||
                        assetUserEmail === currentUserEmailLower;

    // ✨ 同組協作權限檢查：同組成員可以取消同組資產的轉移/報廢
    if (!hasPermission && !isAdmin) {
      const groupProxyEnabled = isGroupProxyTransferEnabled();
      if (groupProxyEnabled) {
        const groupEmails = getGroupMemberEmails(currentUserEmail).map(email => String(email || '').toLowerCase().trim());
        const groupEmailSet = new Set(groupEmails);
        if (groupEmailSet.has(assetLeaderEmail) || (assetUserEmail && groupEmailSet.has(assetUserEmail))) {
          hasPermission = true;
        }
      }
    }

    if (!hasPermission) {
      throw new Error("權限不足，只有此財產的保管人、使用人、同組成員或管理員才能執行此操作。");
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

      const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
      const scrapLogSheet = getScrapLogSheet(ss);
      const scrapLogLastRow = scrapLogSheet.getLastRow();
      const scrapLogData = scrapLogLastRow > 1
        ? scrapLogSheet.getRange(2, 1, scrapLogLastRow - 1, scrapLogSheet.getLastColumn()).getValues()
        : [];
      const pendingLogMap = buildLatestScrapLogIndex(scrapLogData, new Set(['報廢中']));
      const logEntry = pendingLogMap[String(assetId || '').trim()];
      if (logEntry) {
        const now = new Date();
        scrapLogSheet.getRange(logEntry.rowIndex, SL_STATUS_COLUMN_INDEX).setValue('已取消');
        scrapLogSheet.getRange(logEntry.rowIndex, SL_UPDATE_TIME_COLUMN_INDEX).setValue(now);
        scrapLogSheet.getRange(logEntry.rowIndex, SL_APPROVER_EMAIL_COLUMN_INDEX).setValue(currentUserEmail);
      }

    } else {
      throw new Error(`此財產的狀態 (${originalStatus}) 無法被取消。`);
    }

    return { success: true };

  } catch (e) {
    Logger.log(`取消申請失敗 (assetId: ${assetId}): ${e.message} at ${e.stack}`);
    return { success: false, error: e.message };
  }
}

/**
 * [供 userstate.html 呼叫] 獲取當前使用者申請的「轉移中」或「待接收」資產
 * 用於顯示使用者自己發起但尚未被對方接收的轉移申請
 * @returns {Object} { assets: Array, count: number }
 */
function getTransferringAssets(forceUserScope) {
  try {
    const currentUserEmail = Session.getActiveUser().getEmail().toLowerCase();
    const isAdmin = checkAdminPermissions();
    const useAdminScope = isAdmin && !forceUserScope;

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const appLogSheet = ss.getSheetByName(APPLICATION_LOG_SHEET_NAME);

    if (appLogSheet.getLastRow() <= 1) {
      return { assets: [], count: 0 };
    }

    const appLogData = appLogSheet.getRange(2, 1, appLogSheet.getLastRow() - 1, appLogSheet.getLastColumn()).getValues();
    const allAssets = getAllAssets();
    const assetMap = new Map(allAssets.map(a => [a.assetId, a]));

    const results = [];

    appLogData.forEach(row => {
      const status = row[AL_STATUS_COLUMN_INDEX - 1];
      const applicantEmail = (row[AL_APPLICANT_EMAIL_COLUMN_INDEX - 1] || '').toString().toLowerCase();
      const assetId = row[AL_ASSET_ID_COLUMN_INDEX - 1];

      // 篩選條件：狀態為「轉移中」或「待接收」
      if (status === '轉移中' || status === '待接收') {
        // 權限檢查：只顯示自己申請的，或管理員可見全部
        const isMyApplication = applicantEmail === currentUserEmail;

        if (useAdminScope || isMyApplication) {
          const asset = assetMap.get(assetId);

          // 格式化申請時間
          let applicationTime = '';
          const rawTime = row[AL_APP_TIME_COLUMN_INDEX - 1];
          if (rawTime) {
            try {
              applicationTime = Utilities.formatDate(new Date(rawTime), 'Asia/Taipei', 'yyyy/MM/dd HH:mm');
            } catch (e) {
              applicationTime = rawTime.toString();
            }
          }

          results.push({
            assetId: assetId || '',
            assetName: asset ? asset.assetName : '',
            assetAlias: asset ? String(asset.assetAlias || '') : '',
            productSerial: asset ? String(asset.productSerial || '') : '',
            modelBrand: asset ? asset.modelBrand : '',
            category: asset ? asset.assetCategory : '',
            oldKeeper: row[AL_OLD_LEADER_COLUMN_INDEX - 1] || '',
            oldLocation: row[AL_OLD_LOCATION_COLUMN_INDEX - 1] || '',
            oldUser: row[AL_OLD_USER_COLUMN_INDEX - 1] || '',
            newKeeper: row[AL_NEW_LEADER_COLUMN_INDEX - 1] || '',
            newLocation: row[AL_NEW_LOCATION_COLUMN_INDEX - 1] || '',
            newUser: row[AL_NEW_USER_COLUMN_INDEX - 1] || '',
            userName: asset ? asset.userName || '無' : '無',
            applicationTime: applicationTime,
            status: status,
            transferType: row[AL_TRANSFER_TYPE_COLUMN_INDEX - 1] || '地點',
            sourceSheet: asset ? String(asset.sourceSheet || '') : ''
          });
        }
      }
    });

    return {
      assets: results,
      count: results.length
    };

  } catch (e) {
    Logger.log(`getTransferringAssets 失敗: ${e.message} at ${e.stack}`);
    return { assets: [], count: 0, error: e.message };
  }
}

/**
 * [供 userstate.html 呼叫] 取得轉移中/待接收的整合資料（含卡片與詳情）
 * @param {boolean} forceUserScope 是否強制使用者視角
 * @returns {Object} { transferring: { assets, count }, pending: { approvals, count }, transferDetailMap }
 */
function getTransferOverviewForUserState(forceUserScope) {
  try {
    const currentUserEmail = Session.getActiveUser().getEmail();
    const currentUserEmailLower = String(currentUserEmail || '').toLowerCase();
    const isAdmin = checkAdminPermissions();
    const useAdminScope = isAdmin && !forceUserScope;
    const groupProxyEnabled = !useAdminScope && isGroupProxyTransferEnabled();

    const allAssets = getAllAssets();
    const assetMap = new Map(allAssets.map(asset => [String(asset.assetId || '').trim(), asset]));

    let groupEmailSet = null;
    if (!useAdminScope) {
      const groupEmails = getGroupMemberEmails(currentUserEmail).map(email => String(email || '').toLowerCase());
      groupEmailSet = new Set(groupEmails);
    }

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const appLogSheet = ss.getSheetByName(APPLICATION_LOG_SHEET_NAME);
    if (!appLogSheet || appLogSheet.getLastRow() < 2) {
      return {
        transferring: { assets: [], count: 0 },
        pending: { approvals: [], count: 0 },
        transferDetailMap: {}
      };
    }

    const appLogData = appLogSheet.getRange(2, 1, appLogSheet.getLastRow() - 1, appLogSheet.getLastColumn()).getValues();
    const transferringAssets = [];
    const pendingApprovals = [];
    const latestRowByAsset = {};
    const latestTimeByAsset = {};

    const formatDateValue = (value, pattern) => {
      if (!value) return '';
      try {
        return Utilities.formatDate(new Date(value), Session.getScriptTimeZone(), pattern);
      } catch (e) {
        return String(value);
      }
    };

    appLogData.forEach(row => {
      const status = row[AL_STATUS_COLUMN_INDEX - 1];
      if (status !== '轉移中' && status !== '待接收') return;

      const assetId = String(row[AL_ASSET_ID_COLUMN_INDEX - 1] || '').trim();
      if (!assetId) return;

      const applicantEmail = String(row[AL_APPLICANT_EMAIL_COLUMN_INDEX - 1] || '').toLowerCase();
      const isMyApplication = applicantEmail && applicantEmail === currentUserEmailLower;

      const newLeaderEmail = String(row[AL_NEW_LEADER_EMAIL_COLUMN_INDEX - 1] || '').toLowerCase();
      const newUserEmail = String(row[AL_NEW_USER_EMAIL_COLUMN_INDEX - 1] || '').toLowerCase();
      const transferType = row.length > AL_TRANSFER_TYPE_COLUMN_INDEX - 1
        ? row[AL_TRANSFER_TYPE_COLUMN_INDEX - 1]
        : '地點';

      const isPendingForUser = canApproveTransfer_({
        currentUserEmailLower,
        newLeaderEmailLower: newLeaderEmail,
        newUserEmailLower: newUserEmail,
        transferType: transferType,
        groupProxyEnabled: groupProxyEnabled,
        groupEmailSet: groupEmailSet
      });

      // ✨ 同組協作：同組成員申請的轉移也應可見
      const isGroupMemberApplication = groupProxyEnabled && groupEmailSet && groupEmailSet.has(applicantEmail);

      if (useAdminScope || isMyApplication || isGroupMemberApplication) {
        const assetInfo = assetMap.get(assetId) || {};
        const rawTime = row[AL_APP_TIME_COLUMN_INDEX - 1];
        const applicationTime = rawTime
          ? formatDateValue(rawTime, 'yyyy/MM/dd HH:mm')
          : '';

        transferringAssets.push({
          assetId: assetId,
          assetName: assetInfo.assetName || '',
          assetAlias: String(assetInfo.assetAlias || ''),
          productSerial: String(assetInfo.productSerial || ''),
          modelBrand: assetInfo.modelBrand || '',
          category: assetInfo.assetCategory || '',
          oldKeeper: row[AL_OLD_LEADER_COLUMN_INDEX - 1] || '',
          oldLocation: row[AL_OLD_LOCATION_COLUMN_INDEX - 1] || '',
          oldUser: row[AL_OLD_USER_COLUMN_INDEX - 1] || '',
          newKeeper: row[AL_NEW_LEADER_COLUMN_INDEX - 1] || '',
          newLocation: row[AL_NEW_LOCATION_COLUMN_INDEX - 1] || '',
          newUser: row[AL_NEW_USER_COLUMN_INDEX - 1] || '',
          userName: assetInfo.userName || '無',
          applicationTime: applicationTime,
          status: status,
          transferType: transferType,
          applicantEmail: applicantEmail || '',
          sourceSheet: String(assetInfo.sourceSheet || '')
        });
      }

      if (status === '待接收' && (useAdminScope || isPendingForUser)) {
        const assetInfo = assetMap.get(assetId) || { assetName: '（找不到名稱）', modelBrand: '', userName: '無' };
        const rawTime = row[AL_APP_TIME_COLUMN_INDEX - 1];
        const applyTime = rawTime
          ? formatDateValue(rawTime, 'yyyy/MM/dd HH:mm')
          : '';

        pendingApprovals.push({
          appId: row[AL_APP_ID_COLUMN_INDEX - 1],
          applyTime: applyTime,
          assetId: assetId,
          assetName: assetInfo.assetName,
          assetAlias: String(assetInfo.assetAlias || ''),
          productSerial: String(assetInfo.productSerial || ''),
          modelBrand: assetInfo.modelBrand,
          userName: assetInfo.userName,
          oldKeeper: row[AL_OLD_LEADER_COLUMN_INDEX - 1],
          oldLocation: row[AL_OLD_LOCATION_COLUMN_INDEX - 1],
          newLocation: row[AL_NEW_LOCATION_COLUMN_INDEX - 1],
          newKeeper: row[AL_NEW_LEADER_COLUMN_INDEX - 1] || '',
          oldUser: row[AL_OLD_USER_COLUMN_INDEX - 1] || '',
          newUser: row[AL_NEW_USER_COLUMN_INDEX - 1] || '',
          transferType: transferType,
          sourceSheet: String(assetInfo.sourceSheet || '')
        });
      }

      const rawTime = row[AL_APP_TIME_COLUMN_INDEX - 1];
      const timeValue = rawTime ? new Date(rawTime).getTime() : 0;
      const normalizedTime = Number.isNaN(timeValue) ? 0 : timeValue;
      if (!latestRowByAsset[assetId] || normalizedTime >= (latestTimeByAsset[assetId] || 0)) {
        latestRowByAsset[assetId] = row;
        latestTimeByAsset[assetId] = normalizedTime;
      }
    });

    const transferDetailMap = {};
    Object.keys(latestRowByAsset).forEach(assetId => {
      const asset = assetMap.get(assetId);
      if (!asset) return;

      const row = latestRowByAsset[assetId];
      if (!useAdminScope) {
        const leaderEmail = String(asset.leaderEmail || '').toLowerCase();
        const userEmail = String(asset.userEmail || '').toLowerCase();
        const hasAssetAccess = groupEmailSet
          ? (groupEmailSet.has(leaderEmail) || (userEmail && groupEmailSet.has(userEmail)))
          : false;
        const canApprove = canApproveTransfer_({
          currentUserEmailLower,
          newLeaderEmailLower: String(row[AL_NEW_LEADER_EMAIL_COLUMN_INDEX - 1] || '').toLowerCase(),
          newUserEmailLower: String(row[AL_NEW_USER_EMAIL_COLUMN_INDEX - 1] || '').toLowerCase(),
          transferType: row[AL_TRANSFER_TYPE_COLUMN_INDEX - 1] || '地點',
          groupProxyEnabled: groupProxyEnabled,
          groupEmailSet: groupEmailSet
        });
        if (!hasAssetAccess && !canApprove) {
          return;
        }
      }

      transferDetailMap[assetId] = {
        assetId: assetId,
        assetName: String(asset.assetName || ''),
        ...buildAssetAliasFields_(asset),
        status: String(asset.assetStatus || row[AL_STATUS_COLUMN_INDEX - 1] || '').trim(),
        type: 'transfer',
        detail: {
          workflowStatus: row[AL_STATUS_COLUMN_INDEX - 1] || '',
          applicationTime: formatDateValue(row[AL_APP_TIME_COLUMN_INDEX - 1], 'yyyy/MM/dd HH:mm'),
          transferType: row[AL_TRANSFER_TYPE_COLUMN_INDEX - 1] || '地點',
          oldKeeper: row[AL_OLD_LEADER_COLUMN_INDEX - 1] || '',
          newKeeper: row[AL_NEW_LEADER_COLUMN_INDEX - 1] || '',
          oldUser: row[AL_OLD_USER_COLUMN_INDEX - 1] || '',
          newUser: row[AL_NEW_USER_COLUMN_INDEX - 1] || '',
          oldLocation: row[AL_OLD_LOCATION_COLUMN_INDEX - 1] || '',
          newLocation: row[AL_NEW_LOCATION_COLUMN_INDEX - 1] || '',
          applicantEmail: row[AL_APPLICANT_EMAIL_COLUMN_INDEX - 1] || ''
        }
      };
    });

    return {
      transferring: { assets: transferringAssets, count: transferringAssets.length },
      pending: { approvals: pendingApprovals, count: pendingApprovals.length },
      transferDetailMap: transferDetailMap
    };
  } catch (e) {
    Logger.log(`getTransferOverviewForUserState 失敗: ${e.message} at ${e.stack}`);
    return {
      transferring: { assets: [], count: 0 },
      pending: { approvals: [], count: 0 },
      transferDetailMap: {},
      error: e.message
    };
  }
}

/**
 * [供 userstate.html 呼叫] 批次取得轉移中/待接收資產的最新狀態詳情
 * @param {string[]} assetIds 資產編號清單
 * @param {boolean} forceUserScope 是否強制使用者視角
 * @returns {Object} { details: { [assetId]: { type, detail, assetName, status } }, error? }
 */
function getTransferStatusDetailsByAssets(assetIds, forceUserScope) {
  try {
    const normalizedIds = (Array.isArray(assetIds) ? assetIds : [])
      .map(id => String(id || '').trim())
      .filter(id => id);
    if (normalizedIds.length === 0) {
      return { details: {} };
    }

    const uniqueIds = Array.from(new Set(normalizedIds));
    const currentUserEmail = Session.getActiveUser().getEmail();
    const currentUserEmailLower = String(currentUserEmail || '').toLowerCase();
    const isAdmin = checkAdminPermissions();
    const useAdminScope = isAdmin && !forceUserScope;
    const groupProxyEnabled = !useAdminScope && isGroupProxyTransferEnabled();
    const groupEmailSet = !useAdminScope
      ? new Set(getGroupMemberEmails(currentUserEmail).map(email => String(email || '').toLowerCase()))
      : null;
    const allAssets = getAllAssets();
    const assetMap = new Map(allAssets.map(asset => [String(asset.assetId || '').trim(), asset]));

    let targetIds = uniqueIds;
    // 先保留所有 targetIds，後續再依權限與審核資格過濾

    if (targetIds.length === 0) {
      return { details: {} };
    }

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const appLogSheet = ss.getSheetByName(APPLICATION_LOG_SHEET_NAME);
    if (!appLogSheet || appLogSheet.getLastRow() < 2) {
      return { details: {} };
    }

    const appLogData = appLogSheet.getRange(2, 1, appLogSheet.getLastRow() - 1, appLogSheet.getLastColumn()).getValues();
    const targetSet = new Set(targetIds);
    const latestRowByAsset = {};
    const latestTimeByAsset = {};

    appLogData.forEach(row => {
      const assetId = String(row[AL_ASSET_ID_COLUMN_INDEX - 1] || '').trim();
      if (!targetSet.has(assetId)) return;
      const status = row[AL_STATUS_COLUMN_INDEX - 1];
      if (status !== '待接收' && status !== '轉移中') return;

      const rawTime = row[AL_APP_TIME_COLUMN_INDEX - 1];
      const timeValue = rawTime ? new Date(rawTime).getTime() : 0;
      const normalizedTime = Number.isNaN(timeValue) ? 0 : timeValue;
      if (!latestRowByAsset[assetId] || normalizedTime >= (latestTimeByAsset[assetId] || 0)) {
        latestRowByAsset[assetId] = row;
        latestTimeByAsset[assetId] = normalizedTime;
      }
    });

    const formatDateValue = (value, pattern) => {
      if (!value) return '';
      try {
        return Utilities.formatDate(new Date(value), Session.getScriptTimeZone(), pattern);
      } catch (e) {
        return String(value);
      }
    };

    const details = {};
    Object.keys(latestRowByAsset).forEach(assetId => {
      const row = latestRowByAsset[assetId];
      const asset = assetMap.get(assetId);
      if (!asset) return;
      if (!useAdminScope) {
        const leaderEmail = String(asset.leaderEmail || '').toLowerCase();
        const userEmail = String(asset.userEmail || '').toLowerCase();
        const hasAssetAccess = groupEmailSet
          ? (groupEmailSet.has(leaderEmail) || (userEmail && groupEmailSet.has(userEmail)))
          : false;
        const canApprove = canApproveTransfer_({
          currentUserEmailLower,
          newLeaderEmailLower: String(row[AL_NEW_LEADER_EMAIL_COLUMN_INDEX - 1] || '').toLowerCase(),
          newUserEmailLower: String(row[AL_NEW_USER_EMAIL_COLUMN_INDEX - 1] || '').toLowerCase(),
          transferType: row[AL_TRANSFER_TYPE_COLUMN_INDEX - 1] || '地點',
          groupProxyEnabled: groupProxyEnabled,
          groupEmailSet: groupEmailSet
        });
        if (!hasAssetAccess && !canApprove) {
          return;
        }
      }
      details[assetId] = {
        assetId: assetId,
        assetName: asset ? String(asset.assetName || '') : '',
        ...buildAssetAliasFields_(asset),
        status: String(asset?.assetStatus || row[AL_STATUS_COLUMN_INDEX - 1] || '').trim(),
        type: 'transfer',
        detail: {
          workflowStatus: row[AL_STATUS_COLUMN_INDEX - 1] || '',
          applicationTime: formatDateValue(row[AL_APP_TIME_COLUMN_INDEX - 1], 'yyyy/MM/dd HH:mm'),
          transferType: row[AL_TRANSFER_TYPE_COLUMN_INDEX - 1] || '地點',
          oldKeeper: row[AL_OLD_LEADER_COLUMN_INDEX - 1] || '',
          newKeeper: row[AL_NEW_LEADER_COLUMN_INDEX - 1] || '',
          oldUser: row[AL_OLD_USER_COLUMN_INDEX - 1] || '',
          newUser: row[AL_NEW_USER_COLUMN_INDEX - 1] || '',
          oldLocation: row[AL_OLD_LOCATION_COLUMN_INDEX - 1] || '',
          newLocation: row[AL_NEW_LOCATION_COLUMN_INDEX - 1] || '',
          applicantEmail: row[AL_APPLICANT_EMAIL_COLUMN_INDEX - 1] || ''
        }
      };
    });

    return { details: details };
  } catch (e) {
    Logger.log(`getTransferStatusDetailsByAssets 失敗: ${e.message} at ${e.stack}`);
    return { details: {}, error: e.message };
  }
}

/**
 * [供 userstate.html 呼叫] 取得單一資產狀態詳情
 * @param {string} assetId 資產編號
 * @param {boolean} forceUserScope 是否強制使用者視角
 * @returns {Object} { assetId, assetName, status, type, detail } 或 { error }
 */
function getAssetStatusDetail(assetId, forceUserScope) {
  try {
    const normalizedAssetId = String(assetId || '').trim();
    if (!normalizedAssetId) {
      return { error: '缺少資產編號' };
    }

    const currentUserEmail = Session.getActiveUser().getEmail();
    const isAdmin = checkAdminPermissions();
    const useAdminScope = isAdmin && !forceUserScope;
    const allAssets = getAllAssets();
    const asset = allAssets.find(item => String(item.assetId || '').trim() === normalizedAssetId);

    if (!asset) {
      return { error: '找不到資產資料' };
    }

    if (!useAdminScope) {
      const groupEmails = getGroupMemberEmails(currentUserEmail).map(email => String(email || '').toLowerCase());
      const leaderEmail = String(asset.leaderEmail || '').toLowerCase();
      const userEmail = String(asset.userEmail || '').toLowerCase();
      const hasAccess = groupEmails.includes(leaderEmail) || (userEmail && groupEmails.includes(userEmail));
      if (!hasAccess) {
        return { error: '權限不足，無法查看此資產狀態詳情。' };
      }
    }

    const status = String(asset.assetStatus || '').trim();
    const baseResult = {
      assetId: normalizedAssetId,
      assetName: String(asset.assetName || ''),
      ...buildAssetAliasFields_(asset),
      status: status
    };
    const formatDateValue = (value, pattern) => {
      if (!value) return '';
      try {
        return Utilities.formatDate(new Date(value), Session.getScriptTimeZone(), pattern);
      } catch (e) {
        return String(value);
      }
    };

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

    if (status === '轉移中' || status === '待接收') {
      const appLogSheet = ss.getSheetByName(APPLICATION_LOG_SHEET_NAME);
      if (!appLogSheet || appLogSheet.getLastRow() < 2) {
        return { error: '找不到轉移申請紀錄資料。' };
      }
      const appLogData = appLogSheet.getRange(2, 1, appLogSheet.getLastRow() - 1, appLogSheet.getLastColumn()).getValues();
      let latestRow = null;
      let latestTime = 0;

      appLogData.forEach(row => {
        const logAssetId = String(row[AL_ASSET_ID_COLUMN_INDEX - 1] || '').trim();
        const logStatus = row[AL_STATUS_COLUMN_INDEX - 1];
        if (logAssetId !== normalizedAssetId) return;
        if (logStatus !== '待接收' && logStatus !== '轉移中') return;

        const rawTime = row[AL_APP_TIME_COLUMN_INDEX - 1];
        const timeValue = rawTime ? new Date(rawTime).getTime() : 0;
        const normalizedTime = Number.isNaN(timeValue) ? 0 : timeValue;
        if (!latestRow || normalizedTime >= latestTime) {
          latestRow = row;
          latestTime = normalizedTime;
        }
      });

      if (!latestRow) {
        return { error: '找不到此資產的轉移申請資料。' };
      }

      return {
        ...baseResult,
        type: 'transfer',
        detail: {
          workflowStatus: latestRow[AL_STATUS_COLUMN_INDEX - 1] || '',
          applicationTime: formatDateValue(latestRow[AL_APP_TIME_COLUMN_INDEX - 1], 'yyyy/MM/dd HH:mm'),
          transferType: latestRow[AL_TRANSFER_TYPE_COLUMN_INDEX - 1] || '地點',
          oldKeeper: latestRow[AL_OLD_LEADER_COLUMN_INDEX - 1] || '',
          newKeeper: latestRow[AL_NEW_LEADER_COLUMN_INDEX - 1] || '',
          oldUser: latestRow[AL_OLD_USER_COLUMN_INDEX - 1] || '',
          newUser: latestRow[AL_NEW_USER_COLUMN_INDEX - 1] || '',
          oldLocation: latestRow[AL_OLD_LOCATION_COLUMN_INDEX - 1] || '',
          newLocation: latestRow[AL_NEW_LOCATION_COLUMN_INDEX - 1] || '',
          applicantEmail: latestRow[AL_APPLICANT_EMAIL_COLUMN_INDEX - 1] || ''
        }
      };
    }

    if (status === '出借中' || status === '借出中') {
      const lendingLogSheet = ss.getSheetByName(LENDING_LOG_SHEET_NAME);
      if (!lendingLogSheet || lendingLogSheet.getLastRow() < 2) {
        return { error: '找不到出借紀錄資料。' };
      }
      const lendingData = lendingLogSheet.getRange(2, 1, lendingLogSheet.getLastRow() - 1, 10).getValues();
      let latestRow = null;
      let latestTime = 0;

      lendingData.forEach(row => {
        const logAssetId = String(row[LL_ASSET_ID_COLUMN_INDEX - 1] || '').trim();
        const logStatus = row[LL_STATUS_COLUMN_INDEX - 1];
        if (logAssetId !== normalizedAssetId) return;
        if (logStatus !== '出借中') return;

        const rawTime = row[LL_LEND_TIME_COLUMN_INDEX - 1];
        const timeValue = rawTime ? new Date(rawTime).getTime() : 0;
        const normalizedTime = Number.isNaN(timeValue) ? 0 : timeValue;
        if (!latestRow || normalizedTime >= latestTime) {
          latestRow = row;
          latestTime = normalizedTime;
        }
      });

      if (!latestRow) {
        return { error: '找不到此資產的出借紀錄。' };
      }

      const lenderEmail = String(latestRow[LL_LENDER_EMAIL_COLUMN_INDEX - 1] || '').toLowerCase();
      let lenderName = lenderEmail || '';
      if (lenderEmail) {
        const keeperEmailSheet = ss.getSheetByName(KEEPER_EMAIL_MAP_SHEET_NAME);
        if (keeperEmailSheet && keeperEmailSheet.getLastRow() > 1) {
          const keeperData = keeperEmailSheet.getRange(2, 1, keeperEmailSheet.getLastRow() - 1, 2).getValues();
          for (let i = 0; i < keeperData.length; i++) {
            const name = keeperData[i][0];
            const email = keeperData[i][1];
            if (email && String(email).toLowerCase() === lenderEmail) {
              lenderName = name || lenderEmail;
              break;
            }
          }
        }
      }

      return {
        ...baseResult,
        type: 'lending',
        detail: {
          lendId: latestRow[LL_LEND_ID_COLUMN_INDEX - 1] || '',
          applyTime: formatDateValue(latestRow[LL_LEND_TIME_COLUMN_INDEX - 1], 'yyyy/MM/dd'),
          lenderName: lenderName,
          borrower: latestRow[LL_BORROWER_NAME_COLUMN_INDEX - 1] || '',
          borrowerType: latestRow[LL_BORROWER_TYPE_COLUMN_INDEX - 1] === 'external' ? 'external' : 'internal',
          contactPhone: latestRow[LL_CONTACT_PHONE_COLUMN_INDEX - 1] || '',
          expectedReturnDate: formatDateValue(latestRow[LL_EXPECTED_RETURN_DATE_COLUMN_INDEX - 1], 'yyyy/MM/dd'),
          reason: latestRow[LL_REASON_COLUMN_INDEX - 1] || '',
          lendingLocation: latestRow[LL_LENDING_LOCATION_COLUMN_INDEX - 1] || '',
          originalLocation: String(asset.location || ''),
          keeperName: String(asset.leaderName || ''),
          userName: String(asset.userName || '')
        }
      };
    }

    if (status === '報廢中') {
      const scrapLogSheet = getScrapLogSheet(ss);
      const scrapLogLastRow = scrapLogSheet.getLastRow();
      if (scrapLogLastRow > 1) {
        const scrapLogData = scrapLogSheet.getRange(2, 1, scrapLogLastRow - 1, scrapLogSheet.getLastColumn()).getValues();
        let latestRow = null;
        let latestTime = 0;

        scrapLogData.forEach(row => {
          const logAssetId = String(row[SL_ASSET_ID_COLUMN_INDEX - 1] || '').trim();
          const logStatus = row[SL_STATUS_COLUMN_INDEX - 1];
          if (logAssetId !== normalizedAssetId) return;
          if (logStatus !== '報廢中') return;
          const timeValue = getScrapLogEffectiveTime(row);
          if (!latestRow || timeValue >= latestTime) {
            latestRow = row;
            latestTime = timeValue;
          }
        });

        if (latestRow) {
          const rawDate = latestRow[SL_UPDATE_TIME_COLUMN_INDEX - 1] || latestRow[SL_APPLY_TIME_COLUMN_INDEX - 1];
          return {
            ...baseResult,
            type: 'scrap',
            detail: {
              scrapDate: formatDateValue(rawDate, 'yyyy/MM/dd'),
              scrapReason: String(latestRow[SL_SCRAP_REASON_COLUMN_INDEX - 1] || ''),
              originalKeeper: String(latestRow[SL_KEEPER_NAME_COLUMN_INDEX - 1] || ''),
              originalUser: String(latestRow[SL_USER_NAME_COLUMN_INDEX - 1] || ''),
              location: String(latestRow[SL_LOCATION_COLUMN_INDEX - 1] || '')
            }
          };
        }
      }

      return {
        ...baseResult,
        type: 'scrap',
        detail: {
          scrapDate: formatDateValue(asset.lastModified, 'yyyy/MM/dd'),
          scrapReason: String(asset.remarks || ''),
          originalKeeper: String(asset.leaderName || ''),
          originalUser: String(asset.userName || ''),
          location: String(asset.location || '')
        }
      };
    }

    return { error: `此資產狀態為「${status}」，目前無詳細資訊。` };
  } catch (e) {
    Logger.log(`getAssetStatusDetail 失敗: ${e.message} at ${e.stack}`);
    return { error: `讀取資料時發生錯誤：${e.message}` };
  }
}

/**
 * [供 printScrap.html 呼叫] 獲取已列印的報廢文件歷史紀錄
 * @param {string} assetCategory - 財產類別
 * @returns {Array<Object>} 文件列表 { url, applicant, date, count }
 */
function getScrapDocHistory(assetCategory) {
  const currentUserEmail = Session.getActiveUser().getEmail();
  const isAdmin = checkAdminPermissions();
  const allAssets = getAllAssets();
  
  // 1. 篩選有 docUrl 且符合類別的資產
  const printedAssets = allAssets.filter(asset => {
    if (!asset.docUrl || asset.docUrl.trim() === '') return false;
    if (assetCategory && asset.assetCategory !== assetCategory) return false;
    
    // 權限檢查
    if (!isAdmin) {
      return asset.leaderEmail === currentUserEmail || asset.userEmail === currentUserEmail;
    }
    return true;
  });

  // 2. 依 docUrl 分組
  const docMap = new Map();
  printedAssets.forEach(asset => {
    const url = asset.docUrl;
    if (!docMap.has(url)) {
      docMap.set(url, {
        url: url,
        applicant: asset.leaderName,
        date: asset.lastModified, // 使用最後修改日期作為參考
        count: 0,
        assets: [] // 儲存包含的資產名稱 (可選)
      });
    }
    const docInfo = docMap.get(url);
    docInfo.count++;
    // 如果日期為空，嘗試用其他資產的日期補
    if (!docInfo.date && asset.lastModified) {
      docInfo.date = asset.lastModified;
    }
  });

  // 3. 轉換為陣列並排序 (依日期新到舊)
  const history = Array.from(docMap.values()).map(item => {
    let dateStr = '未知日期';
    if (item.date) {
      try {
        dateStr = Utilities.formatDate(new Date(item.date), Session.getScriptTimeZone(), "yyyy/MM/dd");
      } catch (e) {
        // ignore date error
      }
    }
    return {
      url: item.url,
      applicant: item.applicant,
      date: dateStr,
      count: item.count
    };
  });

  // 排序：最新的在前
  return history.sort((a, b) => {
    if (a.date === b.date) return 0;
    return a.date < b.date ? 1 : -1;
  });
}

/**
 * [供 printScrap.html 呼叫] 讀取報廢輸出資料夾中的檔案
 * 用於 "查看資料夾檔案" 功能 (直接讀取 Drive)
 */
function getScrapDriveFiles() {
  if (!SCRAP_OUTPUT_FOLDER_ID) throw new Error("尚未設定 SCRAP_OUTPUT_FOLDER_ID");

  try {
    const folder = DriveApp.getFolderById(SCRAP_OUTPUT_FOLDER_ID);
    const files = folder.getFiles();
    const fileList = [];

    while (files.hasNext()) {
      const file = files.next();
      fileList.push({
        name: file.getName(),
        url: file.getUrl(),
        lastUpdated: Utilities.formatDate(file.getLastUpdated(), Session.getScriptTimeZone(), "yyyy/MM/dd HH:mm"),
        id: file.getId(),
        size: Math.round(file.getSize() / 1024) + " KB"
      });
    }

    // 依最後修改時間排序 (新 -> 舊)
    fileList.sort((a, b) => {
        return b.lastUpdated.localeCompare(a.lastUpdated);
    });

    return fileList;
  } catch (e) {
    Logger.log("getScrapDriveFiles Error: " + e.toString());
    throw new Error("讀取資料夾失敗: " + e.message);
  }
}

// =================================================================
// --- ✨ 全新功能模組：新增財產/物品 (addnew.html) ✨ ---
// =================================================================

/**
 * [供 addnew.html 呼叫] 獲取新增頁面所需的下拉選單資料
 * (地點、保管人、分類)
 */
function getDropdownData() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

    // 1. 讀取保管人 (Email -> 姓名)
    const keeperSheet = ss.getSheetByName(KEEPER_EMAIL_MAP_SHEET_NAME);
    const keeperData = keeperSheet.getRange(2, 1, keeperSheet.getLastRow() - 1, 2).getValues();
    const keepers = {};
    keeperData.forEach(row => {
      const name = row[0];
      const email = row[1];
      if (email) keepers[email] = name;
    });

    // 2. 讀取地點
    const locSheet = ss.getSheetByName(KEEPER_LOCATION_MAP_SHEET_NAME);
    const locData = locSheet.getRange(2, 1, locSheet.getLastRow() - 1, 1).getValues();
    const locations = locData.map(row => row[0]).filter(loc => loc && loc.toString().trim() !== "");

    // 3. 讀取現有分類 (從所有資產中掃描不重複的分類)
    const allAssets = getAllAssets();
    const categories = [...new Set(allAssets.map(a => a.assetCategory).filter(c => c))].sort();

    return { keepers, locations, categories };
  } catch (e) {
    Logger.log("getDropdownData 失敗: " + e.message);
    throw new Error("讀取選單資料失敗：" + e.message);
  }
}

/**
 * [供 addnew.html 呼叫] 處理新增財產/物品的表單提交
 */
function addNewAsset(form) {
  Logger.log("開始新增資產: " + JSON.stringify(form));
  if (!checkAdminPermissions()) {
    throw new Error("您沒有權限執行此操作");
  }
  
  // 1. 檢查必填與唯一性
  if (!form.assetId || !form.assetName) throw new Error("編號與名稱為必填項目");
  
  if (findAssetLocation(form.assetId)) {
    throw new Error("編號 " + form.assetId + " 已存在於系統中，請勿重複新增。");
  }

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet, indices;

  // 2. 決定寫入的工作表
  if (form.assetType === 'property') {
    sheet = ss.getSheetByName(PROPERTY_MASTER_SHEET_NAME);
    indices = PROPERTY_COLUMN_INDICES;
  } else {
    sheet = ss.getSheetByName(ITEM_MASTER_SHEET_NAME);
    indices = ITEM_COLUMN_INDICES;
  }
  
  if (!sheet) throw new Error("找不到目標工作表，請聯絡管理員。");

  // 3. 準備輔助資料 (名稱查找 & 駐站判斷)
  const keeperSheet = ss.getSheetByName(KEEPER_EMAIL_MAP_SHEET_NAME);
  const keeperData = keeperSheet.getRange(2, 1, keeperSheet.getLastRow() - 1, 2).getValues();
  const emailToName = new Map(keeperData.map(r => [r[1], r[0]])); // Email -> Name

  const locSheet = ss.getSheetByName(KEEPER_LOCATION_MAP_SHEET_NAME);
  const locData = locSheet.getRange(2, 1, locSheet.getLastRow() - 1, 2).getValues(); // A=Name, B=IsStation
  const locIsStationMap = new Map(locData.map(r => [r[0], r[1] === '是']));

  // 4. 解析名稱
  const keeperName = emailToName.get(form.keeperEmail) || form.keeperEmail.split('@')[0];
  const userName = form.userEmail ? (emailToName.get(form.userEmail) || form.userEmail.split('@')[0]) : keeperName;

  // 5. 建構資料列 (Array)
  // 找出最大的索引值以決定陣列長度
  const maxIndex = Math.max(...Object.values(indices));
  const row = new Array(maxIndex).fill(""); // 建立足夠長度的空陣列 (注意：索引從1開始，所以長度要是 maxIndex)
  
  // 填入資料 (注意：indices 是 1-based，陣列是 0-based，所以要 -1)
  row[indices.ASSET_ID - 1] = form.assetId;
  row[indices.ASSET_NAME - 1] = form.assetName;
  row[indices.MODEL_BRAND - 1] = form.modelBrand || ""; // ✨ 新增型號/廠牌
  row[indices.PURCHASE_DATE - 1] = form.purchaseDate ? new Date(form.purchaseDate) : "";
  row[indices.USE_LIFE - 1] = form.useLife;
  row[indices.ASSET_CATEGORY - 1] = form.category;
  row[indices.LOCATION - 1] = form.location;
  row[indices.LEADER_EMAIL - 1] = form.keeperEmail;
  row[indices.LEADER_NAME - 1] = keeperName;
  row[indices.ASSET_STATUS - 1] = "在庫"; // 預設狀態
  if (indices.NOTES) row[indices.NOTES - 1] = form.remarks; // 備註寫入AD欄

  // 處理特定欄位
  if (indices.USER_EMAIL) row[indices.USER_EMAIL - 1] = form.userEmail || form.keeperEmail; // 若無使用人Email則預設同保管人
  if (indices.USER_NAME) row[indices.USER_NAME - 1] = userName;

  // ✨ 新增：處理資訊資產標記 (X 欄)
  if (form.isItAsset && indices.IS_IT_ASSET) {
    row[indices.IS_IT_ASSET - 1] = "是";
  }

  // ✨ 修改：處理電腦相關標記（只有資訊資產才能是電腦）
  if (form.isItAsset && form.isActuallyComputer) {
    if (indices.IS_ACTUALLY_COMPUTER) {
        row[indices.IS_ACTUALLY_COMPUTER - 1] = "是";  // Y 欄
    }

    // 如果是駐站地點 + 是電腦實體 -> 標記為需回報電腦 (IS_COMPUTER)
    const isStation = locIsStationMap.get(form.location);
    if (isStation && indices.IS_COMPUTER) {
        row[indices.IS_COMPUTER - 1] = "是";  // T 欄
    }
  }

  // ✨ 新增：處理 ISO 驗證範圍標記 (Z 欄)
  if (form.isItAsset && form.isIsoScope && indices.IS_ISO_SCOPE) {
    row[indices.IS_ISO_SCOPE - 1] = "是";
  }

  // 6. 寫入資料
  sheet.appendRow(row);

  return "成功新增 " + (form.assetType === 'property' ? "財產" : "物品") + "：" + form.assetId;
}

/**
 * [供 userstate.html 呼叫] 批次新增財產/物品
 * @param {Object} payload 批次匯入資料
 * @returns {Object} 匯入結果統計
 */
function addNewAssetsBatch(payload) {
  try {
    if (!checkAdminPermissions()) {
      return { error: '您沒有權限執行此操作' };
    }

    const propertyRows = Array.isArray(payload?.propertyRows) ? payload.propertyRows : [];
    const itemRows = Array.isArray(payload?.itemRows) ? payload.itemRows : [];
    const propertyCategory = String(payload?.propertyCategory || '').trim();

    if (propertyRows.length === 0 && itemRows.length === 0) {
      return { successCount: 0, failureCount: 0, failures: [] };
    }

    if (propertyRows.length > 0) {
      const allowedCategories = { '財產': true, '非消耗品': true };
      if (!propertyCategory || !allowedCategories[propertyCategory]) {
        return { error: '請選擇正確的財產類別' };
      }
    }

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const existingAssets = getAllAssets();
    const existingIdSet = new Set(existingAssets.map(asset => String(asset.assetId || '').trim()).filter(id => id));
    const incomingIdSet = new Set();

    const keeperSheet = ss.getSheetByName(KEEPER_EMAIL_MAP_SHEET_NAME);
    if (!keeperSheet || keeperSheet.getLastRow() <= 1) {
      return { error: '找不到保管人名單，無法匯入' };
    }
    const keeperData = keeperSheet.getRange(2, 1, keeperSheet.getLastRow() - 1, 2).getValues();
    const nameToEmail = {};
    const duplicateNames = new Set();
    keeperData.forEach(row => {
      const name = String(row[0] || '').trim();
      const email = String(row[1] || '').trim().toLowerCase();
      if (!name || !email) return;
      if (nameToEmail[name] && nameToEmail[name] !== email) {
        duplicateNames.add(name);
        return;
      }
      nameToEmail[name] = email;
    });

    const normalizeText = (value) => String(value || '').trim();
    // ✨ 讀取存置地點列表（B 欄：是否為駐站）
    const locationSheet = ss.getSheetByName(KEEPER_LOCATION_MAP_SHEET_NAME);
    const locationData = locationSheet.getRange(2, 1, locationSheet.getLastRow() - 1, 2).getValues();
    const locationIsStationMap = new Map(
      locationData.map(row => [normalizeText(row[0]), normalizeText(row[1]) === '是'])
    );
    const parseDateValue = (value) => {
      if (!value) return '';
      if (value instanceof Date) return value;
      const normalized = normalizeText(value).replace(/-/g, '/');
      if (!normalized) return '';
      const parsed = new Date(normalized);
      if (Number.isNaN(parsed.getTime())) {
        return normalized;
      }
      return parsed;
    };
    const resolveNameEmail = (name, label, errors) => {
      const normalizedName = normalizeText(name);
      if (!normalizedName) {
        errors.push(`${label}必填`);
        return '';
      }
      if (normalizedName.includes('@')) {
        errors.push(`${label}請填姓名`);
        return '';
      }
      if (duplicateNames.has(normalizedName)) {
        errors.push(`${label}姓名重複，請改用唯一姓名`);
        return '';
      }
      const email = nameToEmail[normalizedName];
      if (!email) {
        errors.push(`${label}不在名單中`);
        return '';
      }
      return email;
    };

    const failures = [];
    const propertyValues = [];
    const itemValues = [];

    const addFailure = (row, assetType, reason) => {
      failures.push({
        rowIndex: row?.rowIndex || 0,
        assetId: row?.assetId || '',
        assetType: assetType,
        reason: reason
      });
    };

    const appendPropertyRow = (row) => {
      const errors = [];
      const assetId = normalizeText(row.assetId);
      const assetName = normalizeText(row.assetName);
      const location = normalizeText(row.location);
      if (!assetId) errors.push('編號必填');
      if (!assetName) errors.push('名稱必填');
      if (!location) errors.push('保管地點必填');
      const keeperEmail = resolveNameEmail(row.keeperName, '保管人', errors);
      const userName = normalizeText(row.userName) || normalizeText(row.keeperName);
      let userEmail = '';
      if (userName) {
        userEmail = resolveNameEmail(userName, '使用人', errors);
      } else {
        errors.push('使用人必填');
      }

      if (errors.length > 0) {
        addFailure(row, '財產', errors.join('、'));
        return;
      }
      if (existingIdSet.has(assetId)) {
        addFailure(row, '財產', '編號已存在');
        return;
      }
      if (incomingIdSet.has(assetId)) {
        addFailure(row, '財產', '匯入清單內編號重複');
        return;
      }
      incomingIdSet.add(assetId);

      const maxIndex = Math.max(...Object.values(PROPERTY_COLUMN_INDICES));
      const values = new Array(maxIndex).fill('');
      values[PROPERTY_COLUMN_INDICES.ASSET_ID - 1] = assetId;
      values[PROPERTY_COLUMN_INDICES.ASSET_NAME - 1] = assetName;
      values[PROPERTY_COLUMN_INDICES.ASSET_ALIAS - 1] = normalizeText(row.assetAlias);
      values[PROPERTY_COLUMN_INDICES.MODEL_BRAND - 1] = normalizeText(row.modelBrand);
      values[PROPERTY_COLUMN_INDICES.UNIT - 1] = normalizeText(row.unit);
      values[PROPERTY_COLUMN_INDICES.PURCHASE_DATE - 1] = parseDateValue(row.purchaseDate);
      values[PROPERTY_COLUMN_INDICES.USE_LIFE - 1] = normalizeText(row.useLife);
      values[PROPERTY_COLUMN_INDICES.LOCATION - 1] = location;
      values[PROPERTY_COLUMN_INDICES.ACCESSORY - 1] = normalizeText(row.accessory);
      values[PROPERTY_COLUMN_INDICES.LEADER_NAME - 1] = normalizeText(row.keeperName);
      values[PROPERTY_COLUMN_INDICES.LEADER_EMAIL - 1] = keeperEmail;
      values[PROPERTY_COLUMN_INDICES.USER_NAME - 1] = userName;
      if (PROPERTY_COLUMN_INDICES.USER_EMAIL) {
        values[PROPERTY_COLUMN_INDICES.USER_EMAIL - 1] = userEmail;
      }
      values[PROPERTY_COLUMN_INDICES.ASSET_CATEGORY - 1] = propertyCategory;
      values[PROPERTY_COLUMN_INDICES.ASSET_STATUS - 1] = '在庫';
      if (assetName.includes('電腦')) {
        if (PROPERTY_COLUMN_INDICES.IS_IT_ASSET) {
          values[PROPERTY_COLUMN_INDICES.IS_IT_ASSET - 1] = '是';
        }
        if (PROPERTY_COLUMN_INDICES.IS_ACTUALLY_COMPUTER) {
          values[PROPERTY_COLUMN_INDICES.IS_ACTUALLY_COMPUTER - 1] = '是';
        }
        const isStation = locationIsStationMap.get(location);
        if (isStation && PROPERTY_COLUMN_INDICES.IS_COMPUTER) {
          values[PROPERTY_COLUMN_INDICES.IS_COMPUTER - 1] = '是';
        }
      }

      propertyValues.push(values);
    };

    const appendItemRow = (row) => {
      const errors = [];
      const assetId = normalizeText(row.assetId);
      const assetName = normalizeText(row.assetName);
      const location = normalizeText(row.location);
      if (!assetId) errors.push('編號必填');
      if (!assetName) errors.push('名稱必填');
      if (!location) errors.push('保管地點必填');
      const keeperEmail = resolveNameEmail(row.keeperName, '保管人', errors);

      if (errors.length > 0) {
        addFailure(row, '物品', errors.join('、'));
        return;
      }
      if (existingIdSet.has(assetId)) {
        addFailure(row, '物品', '編號已存在');
        return;
      }
      if (incomingIdSet.has(assetId)) {
        addFailure(row, '物品', '匯入清單內編號重複');
        return;
      }
      incomingIdSet.add(assetId);

      const maxIndex = Math.max(...Object.values(ITEM_COLUMN_INDICES));
      const values = new Array(maxIndex).fill('');
      values[ITEM_COLUMN_INDICES.ASSET_ID - 1] = assetId;
      values[ITEM_COLUMN_INDICES.ASSET_NAME - 1] = assetName;
      values[ITEM_COLUMN_INDICES.PRODUCT_SERIAL - 1] = normalizeText(row.productSerial);
      values[ITEM_COLUMN_INDICES.MODEL_BRAND - 1] = normalizeText(row.modelBrand);
      values[ITEM_COLUMN_INDICES.PURCHASE_DATE - 1] = parseDateValue(row.purchaseDate);
      values[ITEM_COLUMN_INDICES.USE_LIFE - 1] = normalizeText(row.useLife);
      values[ITEM_COLUMN_INDICES.UNIT - 1] = normalizeText(row.unit);
      values[ITEM_COLUMN_INDICES.AMOUNT_TWD - 1] = normalizeText(row.amountTwd);
      values[ITEM_COLUMN_INDICES.PURCHASE_ORDER - 1] = normalizeText(row.purchaseOrder);
      values[ITEM_COLUMN_INDICES.ASSET_CATEGORY - 1] = normalizeText(row.assetCategory);
      values[ITEM_COLUMN_INDICES.LEADER_NAME - 1] = normalizeText(row.keeperName);
      values[ITEM_COLUMN_INDICES.LEADER_EMAIL - 1] = keeperEmail;
      values[ITEM_COLUMN_INDICES.LOCATION - 1] = location;
      values[ITEM_COLUMN_INDICES.ASSET_STATUS - 1] = '在庫';

      itemValues.push(values);
    };

    propertyRows.forEach(row => appendPropertyRow(row));
    itemRows.forEach(row => appendItemRow(row));

    if (propertyValues.length > 0) {
      const propertySheet = ss.getSheetByName(PROPERTY_MASTER_SHEET_NAME);
      if (!propertySheet) {
        return { error: '找不到財產總表，無法匯入' };
      }
      const startRow = propertySheet.getLastRow() + 1;
      propertySheet.getRange(startRow, 1, propertyValues.length, propertyValues[0].length).setValues(propertyValues);
    }

    if (itemValues.length > 0) {
      const itemSheet = ss.getSheetByName(ITEM_MASTER_SHEET_NAME);
      if (!itemSheet) {
        return { error: '找不到物品總表，無法匯入' };
      }
      const startRow = itemSheet.getLastRow() + 1;
      itemSheet.getRange(startRow, 1, itemValues.length, itemValues[0].length).setValues(itemValues);
    }

    return {
      successCount: propertyValues.length + itemValues.length,
      failureCount: failures.length,
      failures: failures
    };
  } catch (e) {
    Logger.log(`addNewAssetsBatch 失敗: ${e.message}`);
    return { successCount: 0, failureCount: 0, failures: [], error: e.message };
  }
}


/**
 * ✨ 更新單一資產的基本資訊（僅限管理員）
 * 可更新欄位：名稱、型號/廠牌、類別、取得日期、使用年限、資訊資產標記
 * @param {string} assetId - 資產編號
 * @param {object} updates - 要更新的欄位物件
 * @returns {string} 成功訊息
 */
function updateAssetBasicInfo(assetId, updates) {
  // 1. 驗證管理員權限
  const currentUserEmail = Session.getActiveUser().getEmail().toLowerCase();
  const adminEmails = getAdminEmails().map(e => e.toLowerCase());
  if (!adminEmails.includes(currentUserEmail)) {
    throw new Error('您沒有權限執行此操作，僅限管理員使用');
  }

  // 2. 定位資產
  const location = findAssetLocation(assetId);
  if (!location) {
    throw new Error(`找不到資產「${assetId}」`);
  }

  // 3. 選擇正確的欄位索引
  const indices = location.sheetName === PROPERTY_MASTER_SHEET_NAME
    ? PROPERTY_COLUMN_INDICES
    : ITEM_COLUMN_INDICES;

  // 4. 更新欄位
  const sheet = location.sheet;
  const row = location.rowIndex;

  // 名稱
  if (updates.assetName !== undefined && updates.assetName !== null) {
    sheet.getRange(row, indices.ASSET_NAME).setValue(updates.assetName);
  }

  // 型號/廠牌
  if (updates.modelBrand !== undefined && updates.modelBrand !== null) {
    sheet.getRange(row, indices.MODEL_BRAND).setValue(updates.modelBrand);
  }

  // 類別
  if (updates.category !== undefined && updates.category !== null) {
    sheet.getRange(row, indices.ASSET_CATEGORY).setValue(updates.category);
  }

  // 取得日期
  if (updates.purchaseDate !== undefined && updates.purchaseDate !== null) {
    const dateValue = updates.purchaseDate ? new Date(updates.purchaseDate) : '';
    sheet.getRange(row, indices.PURCHASE_DATE).setValue(dateValue);
  }

  // 使用年限
  if (updates.useLife !== undefined && updates.useLife !== null) {
    sheet.getRange(row, indices.USE_LIFE).setValue(updates.useLife);
  }

  // 資訊資產標記
  if (updates.isItAsset !== undefined && updates.isItAsset !== null) {
    sheet.getRange(row, indices.IS_IT_ASSET).setValue(updates.isItAsset);
  }

  // 電腦主機/筆電標記
  if (updates.isActuallyComputer !== undefined && updates.isActuallyComputer !== null) {
    sheet.getRange(row, indices.IS_ACTUALLY_COMPUTER).setValue(updates.isActuallyComputer);
  }

  // ISO 驗證範圍標記
  if (updates.isIsoScope !== undefined && updates.isIsoScope !== null) {
    sheet.getRange(row, indices.IS_ISO_SCOPE).setValue(updates.isIsoScope);
  }

  Logger.log(`[updateAssetBasicInfo] 管理員 ${currentUserEmail} 更新了資產 ${assetId} 的基本資料`);
  return `成功更新資產「${assetId}」的基本資料`;
}


// =================================================================
// --- ✨ 資產盤點功能 (Asset Inventory Functions) ---
// =================================================================

/**
 * 取得盤點頁面所需的資料
 * @returns {object} 包含資產列表、地點選項、保管人選項和現有盤點會話
 */
function getInventoryData(forceUserScope) {
  try {
    const currentUserEmail = Session.getActiveUser().getEmail().toLowerCase();
    const allAssets = getAllAssets();
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

    // 檢查是否為管理員
    const isAdmin = checkAdminPermissions();
    const useAdminScope = isAdmin && !forceUserScope;

    // 只取得狀態為「在庫」的資產
    const availableAssets = allAssets.filter(asset => asset.assetStatus === '在庫');

    // 提取唯一的地點
    const locations = [...new Set(availableAssets.map(a => a.location))].filter(Boolean).sort();

    // 提取唯一的保管人
    const keepers = [...new Set(availableAssets.map(a => a.leaderName))].filter(Boolean).sort();

    // 提取唯一的使用人 (只從財產總表,因為物品總表沒有使用人欄位)
    const users = [...new Set(availableAssets.map(a => a.userName))].filter(Boolean).sort();

    const ismsAccess = getIsmsInventoryAccess_(ss, currentUserEmail, isAdmin);

    // 建立 Email -> 姓名 / 組別 對照表（用於前端顯示指派人員與分派判斷）
    const emailToNameMap = {};
    const emailToGroupMap = {};
    const assigneeUserMap = {};
    const keeperEmailSheet = ss.getSheetByName(KEEPER_EMAIL_MAP_SHEET_NAME);
    if (keeperEmailSheet && keeperEmailSheet.getLastRow() > 1) {
      const keeperData = keeperEmailSheet.getRange(2, 1, keeperEmailSheet.getLastRow() - 1, 7).getValues();
      keeperData.forEach(row => {
        const name = row[0];
        const email = row[1];
        const groupName = row[6];
        if (email) {
          const normalizedEmail = String(email).toLowerCase();
          const displayName = name ? String(name).trim() : String(email).split('@')[0];
          emailToNameMap[normalizedEmail] = displayName;
          const normalizedGroup = groupName ? String(groupName).trim() : '';
          if (normalizedGroup) {
            emailToGroupMap[normalizedEmail] = normalizedGroup;
          }
          if (!assigneeUserMap[normalizedEmail]) {
            assigneeUserMap[normalizedEmail] = {
              name: displayName,
              email: normalizedEmail,
              group: normalizedGroup
            };
          } else if (normalizedGroup && !assigneeUserMap[normalizedEmail].group) {
            assigneeUserMap[normalizedEmail].group = normalizedGroup;
          }
        }
      });
    }
    const currentUserGroup = ismsAccess.currentUserGroup || emailToGroupMap[currentUserEmail] || '未分組';
    const groups = Array.from(new Set(Object.values(emailToGroupMap).filter(Boolean))).sort();
    const assigneeUsers = Object.values(assigneeUserMap).sort((a, b) => {
      const left = a.name || a.email || '';
      const right = b.name || b.email || '';
      return left.localeCompare(right, 'zh-Hant');
    });

    // 取得進行中盤點會話（管理員可以看到所有會話）
    const activeSessions = getActiveInventorySessions(currentUserEmail, useAdminScope, currentUserGroup);

    // ✨ 計算待盤點資產數量
    let myPendingInventoryCount = 0;
    let totalPendingInventoryCount = 0;
    const inventoryDetailSheet = ss.getSheetByName(INVENTORY_DETAIL_SHEET_NAME);
    if (inventoryDetailSheet && inventoryDetailSheet.getLastRow() > 1) {
      // 取得所有進行中會話的 ID
      const activeSessionIds = new Set(activeSessions.map(s => s.inventoryId));

      // 讀取盤點明細
      const detailData = inventoryDetailSheet.getRange(2, 1, inventoryDetailSheet.getLastRow() - 1, ID_ASSIGNED_USER_COLUMN_INDEX).getValues();

      detailData.forEach(row => {
        const inventoryId = row[ID_INVENTORY_ID_COLUMN_INDEX - 1];
        const inventoryResult = row[ID_INVENTORY_RESULT_COLUMN_INDEX - 1];
        const assignedUser = row[ID_ASSIGNED_USER_COLUMN_INDEX - 1];

        // 只計算進行中會話的明細
        if (!activeSessionIds.has(inventoryId)) return;

        // 只計算未盤點的資產（空值或「未盤點」）
        if (inventoryResult && inventoryResult !== '未盤點') return;

        totalPendingInventoryCount++;

        // 判斷是否屬於當前使用者（Email 或組別）
        if (assignedUser) {
          const normalized = String(assignedUser).trim();
          const isEmail = normalized.includes('@');
          const isMyTask = isEmail
            ? normalized.toLowerCase() === currentUserEmail
            : normalized === currentUserGroup;
          if (isMyTask) myPendingInventoryCount++;
        }
      });
    }

    // ✨ 取得 ISMS 資訊資產清單（供盤點時選擇）
    let ismsAssets = [];
    let ismsEnabled = false;
    const isIsmsConfigured = ISMS_SPREADSHEET_ID && ISMS_SPREADSHEET_ID !== 'YOUR_ISMS_SPREADSHEET_ID_HERE';
    if (isIsmsConfigured && ismsAccess.canUseIsmsInventory) {
      ismsEnabled = true;
      try {
        const ismsResult = getIsmsAssetList();
        if (ismsResult.success) {
          ismsAssets = ismsResult.assets;
        }
      } catch (e) {
        Logger.log('載入 ISMS 資產清單失敗（非致命）: ' + e.message);
      }
    }

    // 注意: 不返回完整的 assets 陣列,因為其中包含 Date 物件無法序列化
    // 前端只需要 locations, keepers, users 和 activeSessions
    return {
      assets: [], // 空陣列,避免序列化 Date 物件
      locations: locations,
      keepers: keepers,
      users: users,
      groups: groups,
      assigneeUsers: assigneeUsers,
      activeSessions: activeSessions,
      emailToNameMap: emailToNameMap,
      currentUserGroup: currentUserGroup,
      currentUserEmail: currentUserEmail,
      isAdmin: isAdmin,
      myPendingInventoryCount: myPendingInventoryCount, // ✨ 使用者待盤點資產數量
      totalPendingInventoryCount: totalPendingInventoryCount, // ✨ 管理員全域待盤點資產數量
      ismsAssets: ismsAssets, // ✨ ISMS 資訊資產清單
      ismsEnabled: ismsEnabled // ✨ 目前使用者是否可使用 ISMS 功能
    };
  } catch (e) {
    Logger.log(`getInventoryData 失敗: ${e.message}`);
    throw e;
  }
}

/**
 * [供 userstate.html 呼叫] 取得待盤點資產與盤點會話對應清單
 * 管理員：回傳所有進行中會話的未盤點資產
 * 一般使用者：僅回傳指派給自己的未盤點資產（Email 或組別）
 * @returns {Object} { pendingItems: Array, currentUserEmail, currentUserGroup, isAdmin, inventoryStatusByAsset }
 */
function getPendingInventoryAssignments(forceUserScope) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const currentUserEmail = Session.getActiveUser().getEmail().toLowerCase();
    const isAdmin = checkAdminPermissions();
    const useAdminScope = isAdmin && !forceUserScope;
    const inventoryStatusByAsset = {};
    const inventoryStatusPriority = {
      '未盤點': 0,
      '遺失': 1,
      '損壞': 2,
      '過舊': 3,
      '正常': 4
    };
    const getStatusPriority = (status) => (
      Object.prototype.hasOwnProperty.call(inventoryStatusPriority, status)
        ? inventoryStatusPriority[status]
        : 99
    );
    const normalizeInventoryStatus = (value) => {
      const normalized = String(value || '').trim();
      if (!normalized || normalized === '未盤點') return '未盤點';
      return normalized;
    };
    const trackInventoryStatus = (assetId, inventoryId, statusValue) => {
      if (!inventoryStatusByAsset[assetId]) {
        inventoryStatusByAsset[assetId] = {
          status: statusValue,
          sessionIds: {}
        };
      } else {
        const currentStatus = inventoryStatusByAsset[assetId].status;
        if (getStatusPriority(statusValue) < getStatusPriority(currentStatus)) {
          inventoryStatusByAsset[assetId].status = statusValue;
        }
      }
      inventoryStatusByAsset[assetId].sessionIds[inventoryId] = true;
    };

    // 建立 Email -> 姓名 / 組別 對照表
    let currentUserGroup = '未分組';
    const emailToNameMap = {};
    const emailToGroupMap = {};
    const keeperEmailSheet = ss.getSheetByName(KEEPER_EMAIL_MAP_SHEET_NAME);
    if (keeperEmailSheet && keeperEmailSheet.getLastRow() > 1) {
      const keeperData = keeperEmailSheet.getRange(2, 1, keeperEmailSheet.getLastRow() - 1, 7).getValues();
      keeperData.forEach(row => {
        const name = row[0];
        const email = row[1];
        const groupName = row[6];
        if (email) {
          const normalizedEmail = String(email).toLowerCase();
          emailToNameMap[normalizedEmail] = name || String(email).split('@')[0];
          if (groupName) {
            emailToGroupMap[normalizedEmail] = String(groupName).trim();
          }
          if (normalizedEmail === currentUserEmail && groupName) {
            currentUserGroup = String(groupName).trim();
          }
        }
      });
    }

    const inventoryLogSheet = ss.getSheetByName(INVENTORY_LOG_SHEET_NAME);
    if (!inventoryLogSheet || inventoryLogSheet.getLastRow() <= 1) {
      return {
        pendingItems: [],
        currentUserEmail: currentUserEmail,
        currentUserGroup: currentUserGroup,
        isAdmin: isAdmin,
        inventoryStatusByAsset: {}
      };
    }

    // 讀取所有進行中的盤點會話
    const logData = inventoryLogSheet.getRange(2, 1, inventoryLogSheet.getLastRow() - 1, inventoryLogSheet.getLastColumn()).getValues();
    const activeSessions = {};
    logData.forEach(row => {
      const status = row[IL_STATUS_COLUMN_INDEX - 1];
      if (status !== '進行中') return;
      const inventoryId = row[IL_INVENTORY_ID_COLUMN_INDEX - 1];
      if (!inventoryId) return;

      const sessionEmail = row[IL_INVENTORY_EMAIL_COLUMN_INDEX - 1];
      const rawDate = row[IL_INVENTORY_DATE_COLUMN_INDEX - 1];
      const inventoryDateStr = rawDate instanceof Date
        ? Utilities.formatDate(rawDate, Session.getScriptTimeZone(), "yyyy/MM/dd HH:mm:ss")
        : (rawDate ? String(rawDate) : '');
      const inventoryPersonName = emailToNameMap[String(sessionEmail).toLowerCase()] ||
        row[IL_INVENTORY_PERSON_COLUMN_INDEX - 1] ||
        (sessionEmail ? String(sessionEmail).split('@')[0] : '');

      activeSessions[inventoryId] = {
        inventoryId: inventoryId,
        inventoryDate: inventoryDateStr,
        inventoryPerson: inventoryPersonName,
        inventoryEmail: sessionEmail || ''
      };
    });

    if (Object.keys(activeSessions).length === 0) {
      return {
        pendingItems: [],
        currentUserEmail: currentUserEmail,
        currentUserGroup: currentUserGroup,
        isAdmin: isAdmin,
        inventoryStatusByAsset: {}
      };
    }

    const inventoryDetailSheet = ss.getSheetByName(INVENTORY_DETAIL_SHEET_NAME);
    if (!inventoryDetailSheet || inventoryDetailSheet.getLastRow() <= 1) {
      return {
        pendingItems: [],
        currentUserEmail: currentUserEmail,
        currentUserGroup: currentUserGroup,
        isAdmin: isAdmin,
        inventoryStatusByAsset: {}
      };
    }

    const detailReadCols = Math.max(inventoryDetailSheet.getLastColumn(), ID_ASSIGNED_USER_COLUMN_INDEX);
    const detailData = inventoryDetailSheet.getRange(2, 1, inventoryDetailSheet.getLastRow() - 1, detailReadCols).getValues();
    const scopedRows = [];
    const assetIds = [];
    const pendingItems = [];

    detailData.forEach(row => {
      const inventoryId = row[ID_INVENTORY_ID_COLUMN_INDEX - 1];
      if (!inventoryId || !activeSessions[inventoryId]) return;

      const assignedUser = row[ID_ASSIGNED_USER_COLUMN_INDEX - 1];
      if (!useAdminScope) {
        if (!assignedUser) return;
        const normalized = String(assignedUser).trim();
        const isEmail = normalized.includes('@');
        const isMyTask = isEmail
          ? normalized.toLowerCase() === currentUserEmail
          : normalized === currentUserGroup;
        if (!isMyTask) return;
      }

      scopedRows.push(row);
      const assetId = String(row[ID_ASSET_ID_COLUMN_INDEX - 1] || '').trim();
      if (assetId) {
        assetIds.push(assetId);
      }
    });

    const inventoryAssetContextMap = buildInventoryAssetContextMap_(assetIds);

    scopedRows.forEach(row => {
      const inventoryId = row[ID_INVENTORY_ID_COLUMN_INDEX - 1];
      const assignedUser = row[ID_ASSIGNED_USER_COLUMN_INDEX - 1];

      const inventoryResult = row[ID_INVENTORY_RESULT_COLUMN_INDEX - 1];
      const normalizedStatus = normalizeInventoryStatus(inventoryResult);
      const assetId = String(row[ID_ASSET_ID_COLUMN_INDEX - 1] || '').trim();
      if (assetId) {
        trackInventoryStatus(assetId, inventoryId, normalizedStatus);
      }

      if (normalizedStatus !== '未盤點') return;

      const session = activeSessions[inventoryId];
      const assetContext = inventoryAssetContextMap[assetId] || createEmptyInventoryAssetContext_(assetId);
      const assignedUserValue = assignedUser ? String(assignedUser).trim() : '';
      const assignedIsEmail = assignedUserValue.includes('@');
      const normalizedAssignedEmail = assignedIsEmail ? assignedUserValue.toLowerCase() : '';
      const assignedUserLabel = assignedUserValue
        ? (assignedIsEmail
          ? (emailToNameMap[normalizedAssignedEmail] || assignedUserValue.split('@')[0])
          : assignedUserValue)
        : '';
      const assignedGroup = assignedUserValue
        ? (assignedIsEmail
          ? (emailToGroupMap[normalizedAssignedEmail] || '未分組')
          : assignedUserValue)
        : '';
      const assignedUserType = assignedUserValue
        ? (assignedIsEmail ? 'user' : 'group')
        : 'none';

      pendingItems.push({
        inventoryId: inventoryId,
        inventoryDate: session.inventoryDate,
        inventoryPerson: session.inventoryPerson,
        inventoryEmail: session.inventoryEmail,
        assetId: assetId,
        assetName: assetContext.assetName,
        assetAlias: assetContext.assetAlias,
        productSerial: assetContext.productSerial,
        keeperName: assetContext.keeperName,
        userName: assetContext.userName,
        location: assetContext.location,
        originalStatus: assetContext.originalStatus,
        assignedUser: assignedUserValue,
        assignedUserLabel: assignedUserLabel,
        assignedGroup: assignedGroup,
        assignedUserType: assignedUserType,
        isItAsset: assetContext.isItAsset,
        ismsAssetId: assetContext.ismsAssetId,
        isIsoScope: assetContext.isIsoScope,
        sourceSheet: assetContext.sourceSheet
      });
    });

    Object.keys(inventoryStatusByAsset).forEach(assetId => {
      const entry = inventoryStatusByAsset[assetId];
      const sessionIds = entry.sessionIds || {};
      inventoryStatusByAsset[assetId] = {
        status: entry.status || '未盤點',
        sessionCount: Object.keys(sessionIds).length
      };
    });

    return {
      pendingItems: pendingItems,
      currentUserEmail: currentUserEmail,
      currentUserGroup: currentUserGroup,
      isAdmin: isAdmin,
      inventoryStatusByAsset: inventoryStatusByAsset
    };
  } catch (e) {
    Logger.log(`getPendingInventoryAssignments 失敗: ${e.message}`);
    return { pendingItems: [], error: e.message, inventoryStatusByAsset: {} };
  }
}

/**
 * 取得使用者的進行中盤點會話
 * @param {string} userEmail - 使用者電子郵件
 * @param {boolean} isAdminMode - 是否為管理員模式（可選，預設 false）
 * @param {string} userGroup - 使用者所屬組別
 * @returns {Array} 進行中的盤點會話列表
 */
function getActiveInventorySessions(userEmail, isAdminMode, userGroup) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const inventoryLogSheet = ss.getSheetByName(INVENTORY_LOG_SHEET_NAME);

    if (!inventoryLogSheet) {
      Logger.log('找不到盤點紀錄工作表，請先執行 deployAllSheets。');
      return [];
    }

    if (inventoryLogSheet.getLastRow() <= 1) {
      return [];
    }

    // 建立 Email 到姓名的映射（從「保管人/信箱」表）
    const keeperEmailSheet = ss.getSheetByName(KEEPER_EMAIL_MAP_SHEET_NAME);
    const emailToNameMap = new Map();
    if (keeperEmailSheet && keeperEmailSheet.getLastRow() > 1) {
      const keeperData = keeperEmailSheet.getRange(2, 1, keeperEmailSheet.getLastRow() - 1, 2).getValues();
      keeperData.forEach(row => {
        const name = row[0];
        const email = row[1];
        if (email) {
          emailToNameMap.set(String(email).toLowerCase(), name);
        }
      });
    }

    const normalizedUserEmail = String(userEmail || '').toLowerCase();
    const normalizedUserGroup = userGroup ? String(userGroup).trim() : '';

    // 始終載入 assignedMap（無論是否為管理員），供前端判斷任務歸屬
    let assignedMap = new Map();
    const inventoryDetailSheet = ss.getSheetByName(INVENTORY_DETAIL_SHEET_NAME);
    if (inventoryDetailSheet && inventoryDetailSheet.getLastRow() > 1) {
      const detailRows = inventoryDetailSheet.getRange(2, 1, inventoryDetailSheet.getLastRow() - 1, ID_ASSIGNED_USER_COLUMN_INDEX).getValues();
      detailRows.forEach(row => {
        const inventoryId = row[ID_INVENTORY_ID_COLUMN_INDEX - 1];
        const assignedRaw = row[ID_ASSIGNED_USER_COLUMN_INDEX - 1];
        if (!inventoryId || !assignedRaw) return;
        let assignedValue = String(assignedRaw).trim();
        if (!assignedValue) return;
        if (assignedValue.includes('@')) {
          assignedValue = assignedValue.toLowerCase();
        }
        if (!assignedMap.has(inventoryId)) {
          assignedMap.set(inventoryId, new Set());
        }
        assignedMap.get(inventoryId).add(assignedValue);
      });
    }

    const data = inventoryLogSheet.getRange(2, 1, inventoryLogSheet.getLastRow() - 1, inventoryLogSheet.getLastColumn()).getValues();
    const activeSessions = [];

    for (let row of data) {
      const inventoryId = row[IL_INVENTORY_ID_COLUMN_INDEX - 1];
      const sessionEmail = row[IL_INVENTORY_EMAIL_COLUMN_INDEX - 1];
      const status = row[IL_STATUS_COLUMN_INDEX - 1];

      // 管理員模式：顯示所有進行中的會話
      // 一般模式：只顯示自己的會話
      const assignedSet = assignedMap.get(inventoryId);
      const isAssignedByEmail = assignedSet ? assignedSet.has(normalizedUserEmail) : false;
      const isAssignedByGroup = assignedSet && normalizedUserGroup ? assignedSet.has(normalizedUserGroup) : false;
      const shouldInclude = status === '進行中' &&
        (isAdminMode || (sessionEmail && sessionEmail.toLowerCase() === normalizedUserEmail) || isAssignedByEmail || isAssignedByGroup);

      if (shouldInclude) {
        const rawDate = row[IL_INVENTORY_DATE_COLUMN_INDEX - 1];
        const inventoryDateStr = rawDate instanceof Date
          ? Utilities.formatDate(rawDate, Session.getScriptTimeZone(), "yyyy/MM/dd HH:mm:ss")
          : String(rawDate);

        // 從映射表查詢真實姓名，找不到則使用原始的 inventoryPerson
        const inventoryPersonName = emailToNameMap.get(String(sessionEmail).toLowerCase()) || row[IL_INVENTORY_PERSON_COLUMN_INDEX - 1];

        // 取得該會話的所有指派人員/組別（供前端判斷任務歸屬）
        const assignedUsers = assignedSet ? Array.from(assignedSet) : [];

        activeSessions.push({
          inventoryId: inventoryId,
          inventoryDate: inventoryDateStr,
          inventoryPerson: inventoryPersonName, // 使用從映射表查詢的真實姓名
          inventoryEmail: sessionEmail, // 新增：管理員需要知道會話屬於誰
          filter: row[IL_INVENTORY_FILTER_COLUMN_INDEX - 1],
          conditionSummary: row[IL_SUMMARY_COLUMN_INDEX - 1] || '', // J 欄：篩選條件摘要（新舊會話相容）
          verifiedCount: row[IL_VERIFIED_COUNT_COLUMN_INDEX - 1],
          totalCount: row[IL_TOTAL_COUNT_COLUMN_INDEX - 1],
          status: status,
          assignedUsers: assignedUsers // 新增：指派人員/組別陣列
        });
      }
    }

    return activeSessions;
  } catch (e) {
    Logger.log(`getActiveInventorySessions 失敗: ${e.message}`);
    return [];
  }
}

/**
 * 檢查使用者是否為盤點會話的擁有者或管理員
 * @param {string} inventoryId - 盤點 ID
 * @returns {boolean} 是否有權限操作此會話
 */
function checkInventorySessionOwner(inventoryId) {
  try {
    const currentUserEmail = Session.getActiveUser().getEmail().toLowerCase();

    // 檢查是否為管理員
    const isAdmin = checkAdminPermissions();
    if (isAdmin) {
      return true; // 管理員可以操作所有會話
    }

    // 檢查是否為會話擁有者
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const inventoryLogSheet = ss.getSheetByName(INVENTORY_LOG_SHEET_NAME);

    if (!inventoryLogSheet) {
      Logger.log('找不到盤點紀錄工作表');
      return false;
    }

    const data = inventoryLogSheet.getRange(2, 1, inventoryLogSheet.getLastRow() - 1, inventoryLogSheet.getLastColumn()).getValues();

    for (let row of data) {
      if (row[IL_INVENTORY_ID_COLUMN_INDEX - 1] === inventoryId) {
        const sessionEmail = row[IL_INVENTORY_EMAIL_COLUMN_INDEX - 1];
        return sessionEmail.toLowerCase() === currentUserEmail;
      }
    }

    Logger.log(`找不到盤點會話: ${inventoryId}`);
    return false;
  } catch (e) {
    Logger.log(`checkInventorySessionOwner 失敗: ${e.message}`);
    return false;
  }
}

/**
 * 開始新的盤點會話 (包含自動分發邏輯)
 * @param {object} options - 盤點選項 { filterType, filterValue, assetIds }
 * @returns {object} 包含 inventoryId 和訊息
 */
function startInventorySession(options) {
  try {
    const currentUserEmail = Session.getActiveUser().getEmail().toLowerCase();
    const currentUserName = Session.getActiveUser().getEmail().split('@')[0];
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const isAdmin = checkAdminPermissions();

    const inventoryLogSheet = ss.getSheetByName(INVENTORY_LOG_SHEET_NAME);
    const inventoryDetailSheet = ss.getSheetByName(INVENTORY_DETAIL_SHEET_NAME);
    if (!inventoryLogSheet || !inventoryDetailSheet) {
      throw new Error('找不到盤點工作表，請先執行 deployAllSheets 進行初始化。');
    }

    // 產生唯一的盤點ID
    const inventoryId = 'INV' + new Date().getTime();
    const inventoryDate = new Date();

    const normalizeFilterValues = (value) => (
      Array.isArray(value) ? value : [value]
    ).map(item => String(item || '').trim()).filter(Boolean);
    const locationFilterValues = options.filterType === 'location' ? normalizeFilterValues(options.filterValue) : [];
    const keeperFilterValues = options.filterType === 'keeper' ? normalizeFilterValues(options.filterValue) : [];
    const userFilterValues = options.filterType === 'user' ? normalizeFilterValues(options.filterValue) : [];
    const groupFilterValues = options.filterType === 'group' ? normalizeFilterValues(options.filterValue) : [];

    // ✨ 系統類別範圍：all / new / old，與 filterType 正交組合（AND）
    const systemScopeRaw = String(options.systemScope || 'all').trim().toLowerCase();
    const systemScope = (systemScopeRaw === 'new' || systemScopeRaw === 'old') ? systemScopeRaw : 'all';
    const systemScopeLabel = systemScope === 'new' ? '僅新系統'
      : systemScope === 'old' ? '僅舊系統'
      : '全部系統';

    // 建立篩選描述
    let filterDescription = '全部';
    if (options.filterType === 'location') {
      filterDescription = locationFilterValues.length > 0 ? `地點: ${locationFilterValues.join('、')}` : '地點: (未選擇)';
    } else if (options.filterType === 'keeper') {
      filterDescription = keeperFilterValues.length > 0 ? `保管人: ${keeperFilterValues.join('、')}` : '保管人: (未選擇)';
    } else if (options.filterType === 'user') {
      filterDescription = userFilterValues.length > 0 ? `使用人: ${userFilterValues.join('、')}` : '使用人: (未選擇)';
    } else if (options.filterType === 'group') {
      filterDescription = groupFilterValues.length > 0 ? `組別: ${groupFilterValues.join('、')}` : '組別: (未選擇)';
    }

    const locationFilterSet = new Set(locationFilterValues);
    const keeperFilterSet = new Set(keeperFilterValues);
    const userFilterSet = new Set(userFilterValues);
    const groupFilterSet = new Set(groupFilterValues);

    const assignmentModeRaw = String(options.assignmentMode || '').trim().toLowerCase();
    const assignmentMode = assignmentModeRaw === 'group'
      ? 'group'
      : assignmentModeRaw === 'custom' ? 'custom' : 'person';
    const assignmentTargetType = String(options.assignmentTargetType || '').trim().toLowerCase() === 'group'
      ? 'group'
      : 'user';
    const assignmentTargetValue = String(options.assignmentTargetValue || '').trim();

    // 建立 Email -> 組別/姓名 對照表（組別篩選/分派時使用）
    const emailToGroupMap = {};
    const emailToNameMap = {};
    if (assignmentMode === 'group' || assignmentMode === 'custom' || groupFilterSet.size > 0) {
      const keeperEmailSheet = ss.getSheetByName(KEEPER_EMAIL_MAP_SHEET_NAME);
      if (keeperEmailSheet && keeperEmailSheet.getLastRow() > 1) {
        const keeperData = keeperEmailSheet.getRange(2, 1, keeperEmailSheet.getLastRow() - 1, 7).getValues();
        keeperData.forEach(row => {
          const name = row[0];
          const email = row[1];
          const groupName = row[6];
          if (email) {
            const normalizedEmail = String(email).toLowerCase();
            const displayName = name ? String(name).trim() : String(email).split('@')[0];
            emailToGroupMap[normalizedEmail] = groupName ? String(groupName).trim() : '';
            emailToNameMap[normalizedEmail] = displayName;
          }
        });
      }
    }

    let customAssignedUser = '';
    let assignmentTargetLabel = '';
    if (assignmentMode === 'custom') {
      if (!isAdmin) {
        throw new Error('權限不足：只有管理員可以指定分派對象');
      }
      if (!assignmentTargetValue) {
        throw new Error('請指定分派對象');
      }
      if (assignmentTargetType === 'user') {
        if (!assignmentTargetValue.includes('@')) {
          throw new Error('指定的使用者 Email 不正確');
        }
        const normalizedEmail = assignmentTargetValue.toLowerCase();
        customAssignedUser = normalizedEmail;
        const displayName = emailToNameMap[normalizedEmail] || normalizedEmail.split('@')[0];
        assignmentTargetLabel = displayName ? `${displayName} (${normalizedEmail})` : normalizedEmail;
      } else {
        customAssignedUser = assignmentTargetValue;
        assignmentTargetLabel = assignmentTargetValue;
      }
    }

    const resolveAssetGroup = (asset) => {
      const defaultGroup = asset.defaultGroup ? String(asset.defaultGroup).trim() : '';
      if (defaultGroup) return defaultGroup;
      let assignedEmail = '';
      if (asset.sourceSheet === PROPERTY_MASTER_SHEET_NAME) {
        assignedEmail = asset.userEmail || asset.leaderEmail || '';
      } else {
        assignedEmail = asset.leaderEmail || '';
      }
      const normalizedEmail = assignedEmail ? String(assignedEmail).toLowerCase() : '';
      return normalizedEmail ? (emailToGroupMap[normalizedEmail] || '') : '';
    };

    // 取得要盤點的資產
    const allAssets = getAllAssets();

    let assetsToInventory = allAssets.filter(asset => {
      if (asset.assetStatus !== '在庫' && asset.assetStatus !== '出借中' && asset.assetStatus !== '轉移中' && asset.assetStatus !== '報廢中') return false;

      // ✨ 系統類別前置過濾（與 filterType 正交 AND）
      if (systemScope === 'new' && asset.sourceSheet !== PROPERTY_MASTER_SHEET_NAME) return false;
      if (systemScope === 'old' && asset.sourceSheet !== ITEM_MASTER_SHEET_NAME) return false;

      if (options.filterType === 'all') return true;
      if (options.filterType === 'location') return locationFilterSet.size > 0 && locationFilterSet.has(asset.location);
      if (options.filterType === 'keeper') return keeperFilterSet.size > 0 && keeperFilterSet.has(asset.leaderName);
      if (options.filterType === 'user') return userFilterSet.size > 0 && userFilterSet.has(asset.userName);
      if (options.filterType === 'group') {
        const assetGroup = resolveAssetGroup(asset);
        return assetGroup && groupFilterSet.has(assetGroup);
      }
      if (options.filterType === 'selected') return options.assetIds.includes(asset.assetId);

      return false;
    });

    if (assetsToInventory.length === 0) {
      throw new Error('沒有符合條件的資產可供盤點');
    }

    // ✨ 組裝 J 欄篩選條件摘要：系統類別 + 盤點範圍 + 分派方式
    const assignmentLabelForSummary = assignmentMode === 'custom'
      ? `指定${assignmentTargetType === 'group' ? '組別' : '使用者'}: ${assignmentTargetLabel || assignmentTargetValue}`
      : assignmentMode === 'group'
        ? '依組別分派'
        : '依人名分派';
    const sessionSummary = `系統類別: ${systemScopeLabel}, 盤點範圍: ${filterDescription}, 分派方式: ${assignmentLabelForSummary}`;

    // 在盤點紀錄表新增一筆記錄
    inventoryLogSheet.appendRow([
      inventoryId,
      inventoryDate,
      currentUserName,
      currentUserEmail, // 記錄發起人
      filterDescription,
      0, // 已盤點數量
      assetsToInventory.length, // 總數量
      '進行中',
      '', // 完成時間
      sessionSummary // J 欄：篩選條件摘要
    ]);

    // ✨ 核心邏輯：準備寫入明細表，並自動分發任務
    const detailRows = assetsToInventory.map(asset => {
      // 自動分發：
      // - 財產總表 → 指派給使用人
      // - 物品總表 → 指派給保管人
      // 若缺少使用人或保管人 Email，則留空 (未指派)
      let assignedUser = '';
      if (assignmentMode === 'custom') {
        assignedUser = customAssignedUser;
      } else {
        let assignedEmail = '';
        if (asset.sourceSheet === PROPERTY_MASTER_SHEET_NAME) {
          assignedEmail = asset.userEmail || asset.leaderEmail || '';
        } else {
          assignedEmail = asset.leaderEmail || '';
        }
        if (assignmentMode === 'group') {
          const defaultGroup = asset.defaultGroup ? String(asset.defaultGroup).trim() : '';
          if (defaultGroup) {
            assignedUser = defaultGroup;
          } else {
            const normalizedEmail = assignedEmail ? assignedEmail.toLowerCase() : '';
            const groupName = normalizedEmail ? emailToGroupMap[normalizedEmail] : '';
            assignedUser = groupName || '未分組';
          }
        } else {
          assignedUser = assignedEmail ? assignedEmail.toLowerCase() : '';
        }
      }

      return [
        inventoryId,
        asset.assetId,
        '未盤點', // 盤點結果
        '', // 備註
        '', // 盤點時間
        '', // 盤點人
        assignedUser
      ];
    });

    if (detailRows.length > 0) {
      inventoryDetailSheet.getRange(
        inventoryDetailSheet.getLastRow() + 1,
        1,
        detailRows.length,
        ID_ASSIGNED_USER_COLUMN_INDEX
      ).setValues(detailRows);
    }

    const assignmentMessage = assignmentMode === 'custom'
      ? `任務已指定分派給 ${assignmentTargetLabel}。`
      : `任務已依資產類型與${assignmentMode === 'group' ? '組別' : '人名'}自動分發。`;
    Logger.log(`成功開始盤點會話: ${inventoryId}，共 ${assetsToInventory.length} 筆資產，${assignmentMessage}`);

    return {
      success: true,
      inventoryId: inventoryId,
      totalCount: assetsToInventory.length,
      message: `已成功開始盤點會話，共 ${assetsToInventory.length} 筆資產。${assignmentMessage}`
    };

  } catch (e) {
    Logger.log(`startInventorySession 失敗: ${e.message}`);
    return { success: false, error: e.message };
  }
}

/**
 * 取得盤點會話的明細 (包含指派資訊)
 * @param {string} inventoryId - 盤點ID
 * @returns {Array} 盤點明細列表
 */
function getInventoryDetails(inventoryId) {
  try {
    // 🛡️ 權限放寬：為了讓參與協作的保管人也能讀取資料，我們不再限制「只有擁有者可讀」。
    // 改為在前端過濾顯示內容，或是後端只回傳該使用者相關的資料。
    // 為了監控儀表板功能，這裡我們回傳完整資料，但在前端做視圖控制。
    
    // 檢查是否為該會話的參與者 (擁有者、管理員、或是被指派的人)
    // 由於效能考量，這裡先做基本的權限檢查，更細的過濾在前端或專用 API 做
    
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const inventoryDetailSheet = ss.getSheetByName(INVENTORY_DETAIL_SHEET_NAME);

    if (!inventoryDetailSheet || inventoryDetailSheet.getLastRow() <= 1) {
      return [];
    }

    const readCols = Math.max(inventoryDetailSheet.getLastColumn(), ID_ASSIGNED_USER_COLUMN_INDEX);
    const data = inventoryDetailSheet.getRange(2, 1, inventoryDetailSheet.getLastRow() - 1, readCols).getValues();
    const assetIds = [];
    data.forEach(row => {
      if (row[ID_INVENTORY_ID_COLUMN_INDEX - 1] !== inventoryId) return;
      const assetId = String(row[ID_ASSET_ID_COLUMN_INDEX - 1] || '').trim();
      if (assetId) {
        assetIds.push(assetId);
      }
    });
    const inventoryAssetContextMap = buildInventoryAssetContextMap_(assetIds);
    const details = [];

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      if (row[ID_INVENTORY_ID_COLUMN_INDEX - 1] === inventoryId) {
        const assetId = String(row[ID_ASSET_ID_COLUMN_INDEX - 1] || '').trim();
        const assetContext = inventoryAssetContextMap[assetId] || createEmptyInventoryAssetContext_(assetId);
        const rawVerificationTime = row[ID_VERIFICATION_TIME_COLUMN_INDEX - 1];
        const verificationTimeStr = rawVerificationTime instanceof Date
          ? Utilities.formatDate(rawVerificationTime, Session.getScriptTimeZone(), "yyyy/MM/dd HH:mm:ss")
          : (rawVerificationTime ? String(rawVerificationTime) : '');

        details.push({
          rowIndex: i + 2,
          assetId: assetId,
          assetName: assetContext.assetName,
          assetAlias: assetContext.assetAlias,
          productSerial: assetContext.productSerial,
          keeperName: assetContext.keeperName,
          userName: assetContext.userName,
          modelBrand: assetContext.modelBrand,
          unit: assetContext.unit,
          purchaseDate: assetContext.purchaseDate,
          useLife: assetContext.useLife,
          location: assetContext.location,
          accessory: assetContext.accessory,
          originalStatus: assetContext.originalStatus,
          inventoryResult: row[ID_INVENTORY_RESULT_COLUMN_INDEX - 1],
          remarks: row[ID_REMARKS_COLUMN_INDEX - 1],
          verificationTime: verificationTimeStr,
          verifiedBy: row[ID_VERIFIED_BY_COLUMN_INDEX - 1],
          assignedUser: row[ID_ASSIGNED_USER_COLUMN_INDEX - 1],
          isItAsset: assetContext.isItAsset,
          ismsAssetId: assetContext.ismsAssetId,
          sourceSheet: assetContext.sourceSheet
        });
      }
    }

    return details;
  } catch (e) {
    Logger.log(`getInventoryDetails 失敗: ${e.message}`);
    throw e;
  }
}

function getInventoryAssigneeNameMap() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const emailToNameMap = {};
  const keeperEmailSheet = ss.getSheetByName(KEEPER_EMAIL_MAP_SHEET_NAME);
  if (keeperEmailSheet && keeperEmailSheet.getLastRow() > 1) {
    const keeperData = keeperEmailSheet.getRange(2, 1, keeperEmailSheet.getLastRow() - 1, 2).getValues();
    keeperData.forEach(row => {
      const name = row[0];
      const email = row[1];
      if (!email) return;
      const normalizedEmail = String(email).toLowerCase();
      emailToNameMap[normalizedEmail] = name || String(email).split('@')[0];
    });
  }
  return emailToNameMap;
}

function getInventoryExportHeaders_() {
  return [
    '項次',
    '財產區分',
    '編號(含分號)/名稱',
    '別名',
    '型式/廠牌',
    '大陸製造',
    '數量單位',
    '取得日期／購置日期',
    '使用年限',
    '存置地點',
    '使用人／使用單位',
    '已達使用年限',
    '附屬設備',
    '盤點結果',
    '備註',
    '盤點時間',
    '盤點人',
    '指派對象'
  ];
}

function parseInventoryExportDate_(value) {
  if (!value) return null;

  if (Object.prototype.toString.call(value) === '[object Date]') {
    const time = value.getTime();
    return Number.isNaN(time) ? null : new Date(time);
  }

  const raw = String(value).trim();
  if (!raw) return null;

  const firstLine = raw
    .split('\n')
    .map(line => line.trim())
    .find(line => line) || raw;

  const dateMatch = firstLine.match(/(\d{1,4})\s*[\/\-\.]\s*(\d{1,2})\s*[\/\-\.]\s*(\d{1,2})/);
  if (dateMatch) {
    let year = parseInt(dateMatch[1], 10);
    const month = parseInt(dateMatch[2], 10);
    const day = parseInt(dateMatch[3], 10);

    if (Number.isFinite(year) && Number.isFinite(month) && Number.isFinite(day)) {
      if (year < 1911) {
        year += 1911;
      }

      const parsed = new Date(year, month - 1, day);
      if (!Number.isNaN(parsed.getTime()) &&
          parsed.getFullYear() === year &&
          parsed.getMonth() === month - 1 &&
          parsed.getDate() === day) {
        return parsed;
      }
    }
  }

  const fallback = new Date(firstLine);
  if (!Number.isNaN(fallback.getTime())) {
    return fallback;
  }

  return null;
}

function formatInventoryExportDate_(value) {
  if (!value) return '';
  const parsed = parseInventoryExportDate_(value);
  if (!parsed) {
    return String(value || '');
  }
  return Utilities.formatDate(parsed, Session.getScriptTimeZone(), 'yyyy/MM/dd');
}

function getInventoryAssetTypeLabel_(sourceSheet) {
  return String(sourceSheet || '').trim() === ITEM_MASTER_SHEET_NAME ? '物品' : '財產';
}

function computeReachedUseLifeLabel_(purchaseDateValue, useLifeValue) {
  if (!purchaseDateValue || useLifeValue === null || useLifeValue === undefined || useLifeValue === '') {
    return '';
  }

  const purchaseDate = parseInventoryExportDate_(purchaseDateValue);
  if (!purchaseDate) {
    return '';
  }

  const useLife = parseInt(String(useLifeValue).trim(), 10);
  if (isNaN(useLife) || useLife <= 0) {
    return '';
  }

  const expireDate = new Date(purchaseDate.getTime());
  expireDate.setFullYear(expireDate.getFullYear() + useLife);
  expireDate.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return expireDate.getTime() <= today.getTime() ? '是' : '否';
}

function formatInventoryAssignedUserLabel_(assignedUser, emailToNameMap) {
  const raw = String(assignedUser || '').trim();
  if (!raw) return '';
  if (!raw.includes('@')) return raw;

  const normalizedEmail = raw.toLowerCase();
  const displayName = emailToNameMap[normalizedEmail] || normalizedEmail.split('@')[0];
  return `${displayName} (${normalizedEmail})`;
}

function canAccessInventorySession_(ss, inventoryId, currentUserEmail, isAdmin) {
  if (isAdmin) return true;

  const normalizedInventoryId = String(inventoryId || '').trim();
  const normalizedCurrentEmail = String(currentUserEmail || '').toLowerCase().trim();
  if (!normalizedInventoryId || !normalizedCurrentEmail) return false;

  const inventoryLogSheet = ss.getSheetByName(INVENTORY_LOG_SHEET_NAME);
  if (inventoryLogSheet && inventoryLogSheet.getLastRow() > 1) {
    const logData = inventoryLogSheet.getRange(2, 1, inventoryLogSheet.getLastRow() - 1, inventoryLogSheet.getLastColumn()).getValues();
    for (let i = 0; i < logData.length; i++) {
      const row = logData[i];
      if (String(row[IL_INVENTORY_ID_COLUMN_INDEX - 1] || '').trim() !== normalizedInventoryId) continue;
      const ownerEmail = String(row[IL_INVENTORY_EMAIL_COLUMN_INDEX - 1] || '').toLowerCase().trim();
      if (ownerEmail && ownerEmail === normalizedCurrentEmail) {
        return true;
      }
      break;
    }
  }

  const currentUserGroup = getInventoryUserGroup_(ss, normalizedCurrentEmail);
  const inventoryDetailSheet = ss.getSheetByName(INVENTORY_DETAIL_SHEET_NAME);
  if (!inventoryDetailSheet || inventoryDetailSheet.getLastRow() <= 1) {
    return false;
  }

  const readCols = Math.max(inventoryDetailSheet.getLastColumn(), ID_ASSIGNED_USER_COLUMN_INDEX);
  const detailData = inventoryDetailSheet.getRange(2, 1, inventoryDetailSheet.getLastRow() - 1, readCols).getValues();
  for (let i = 0; i < detailData.length; i++) {
    const row = detailData[i];
    if (String(row[ID_INVENTORY_ID_COLUMN_INDEX - 1] || '').trim() !== normalizedInventoryId) continue;
    const assignedUser = String(row[ID_ASSIGNED_USER_COLUMN_INDEX - 1] || '').trim();
    if (!assignedUser) continue;
    if (assignedUser.includes('@')) {
      if (assignedUser.toLowerCase() === normalizedCurrentEmail) {
        return true;
      }
    } else if (currentUserGroup && assignedUser === currentUserGroup) {
      return true;
    }
  }

  return false;
}

function getInventoryExportData(inventoryId) {
  try {
    const normalizedInventoryId = String(inventoryId || '').trim();
    if (!normalizedInventoryId) {
      throw new Error('缺少盤點會話 ID');
    }

    const currentUserEmail = Session.getActiveUser().getEmail();
    const normalizedCurrentEmail = String(currentUserEmail || '').toLowerCase().trim();
    const isAdmin = checkAdminPermissions();
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

    if (!canAccessInventorySession_(ss, normalizedInventoryId, normalizedCurrentEmail, isAdmin)) {
      throw new Error('權限不足：您無法匯出此盤點會話');
    }

    const details = getInventoryDetails(normalizedInventoryId);
    const emailToNameMap = getInventoryAssigneeNameMap();
    const headers = getInventoryExportHeaders_();
    const rows = (Array.isArray(details) ? details : []).map((detail, index) => {
      const assetId = String(detail?.assetId || '').trim();
      const assetName = String(detail?.assetName || '').trim();
      const idAndName = assetId && assetName
        ? `${assetId}\n${assetName}`
        : (assetId || assetName || '');
      const userDisplay = String(detail?.userName || '').trim() || String(detail?.keeperName || '').trim();
      const inventoryResult = String(detail?.inventoryResult || '').trim() || '未盤點';

      return [
        index + 1,
        getInventoryAssetTypeLabel_(detail?.sourceSheet || ''),
        idAndName,
        String(detail?.assetAlias || '').trim(),
        String(detail?.modelBrand || '').trim(),
        '',
        String(detail?.unit || '').trim(),
        formatInventoryExportDate_(detail?.purchaseDate || ''),
        String(detail?.useLife || '').trim(),
        String(detail?.location || '').trim(),
        userDisplay,
        computeReachedUseLifeLabel_(detail?.purchaseDate || '', detail?.useLife || ''),
        String(detail?.accessory || '').trim(),
        inventoryResult,
        String(detail?.remarks || '').trim(),
        String(detail?.verificationTime || '').trim(),
        String(detail?.verifiedBy || '').trim(),
        formatInventoryAssignedUserLabel_(detail?.assignedUser || '', emailToNameMap)
      ];
    });

    return {
      inventoryId: normalizedInventoryId,
      headers: headers,
      rows: rows
    };
  } catch (e) {
    Logger.log(`getInventoryExportData 失敗: ${e.message}`);
    throw e;
  }
}

function buildInventoryStatsByAssignee(details, emailToNameMap) {
  const statsMap = {};
  (details || []).forEach(item => {
    const rawAssigned = item && item.assignedUser ? String(item.assignedUser).trim() : '';
    let assignmentKey = '未指派';
    let displayName = '未指派';
    if (rawAssigned) {
      if (rawAssigned.includes('@')) {
        assignmentKey = rawAssigned.toLowerCase();
        displayName = emailToNameMap[assignmentKey] || rawAssigned.split('@')[0] || assignmentKey;
      } else {
        assignmentKey = rawAssigned;
        displayName = rawAssigned;
      }
    }

    if (!statsMap[assignmentKey]) {
      statsMap[assignmentKey] = {
        email: assignmentKey,
        name: displayName,
        displayName: displayName,
        assignedCount: 0,
        verifiedCount: 0
      };
    }

    const stats = statsMap[assignmentKey];
    stats.assignedCount += 1;

    if (item.inventoryResult && item.inventoryResult !== '未盤點') {
      stats.verifiedCount += 1;
    }
  });

  const result = Object.values(statsMap).map(item => {
    const assignedCount = Number(item.assignedCount || 0);
    const verifiedCount = Number(item.verifiedCount || 0);
    return {
      email: item.email || '',
      name: item.name || '',
      displayName: item.displayName || item.name || '',
      assignedCount: assignedCount,
      verifiedCount: verifiedCount,
      progress: assignedCount > 0 ? Math.round((verifiedCount / assignedCount) * 100) : 0
    };
  });

  return result.sort((a, b) => a.progress - b.progress);
}

function getInventoryDashboardData(inventoryId) {
  try {
    const details = getInventoryDetails(inventoryId);
    const emailToNameMap = getInventoryAssigneeNameMap();
    const stats = buildInventoryStatsByAssignee(details, emailToNameMap);
    const safeDetails = (Array.isArray(details) ? details : []).map(item => ({
      rowIndex: Number(item?.rowIndex || 0),
      assetId: item?.assetId || '',
      assetName: item?.assetName || '',
      keeperName: item?.keeperName || '',
      userName: item?.userName || '',
      location: item?.location || '',
      originalStatus: item?.originalStatus || '',
      inventoryResult: item?.inventoryResult || '',
      remarks: item?.remarks || '',
      verificationTime: item?.verificationTime || '',
      verifiedBy: item?.verifiedBy || '',
      assignedUser: item?.assignedUser || '',
      isItAsset: item?.isItAsset || '',     // ✨ ISMS
      ismsAssetId: item?.ismsAssetId || ''  // ✨ ISMS
    }));
    const safeStats = (Array.isArray(stats) ? stats : []).map(item => ({
      email: item?.email || '',
      name: item?.name || '',
      displayName: item?.displayName || item?.name || '',
      assignedCount: Number(item?.assignedCount || 0),
      verifiedCount: Number(item?.verifiedCount || 0),
      progress: Number(item?.progress || 0)
    }));
    return {
      stats: safeStats,
      details: safeDetails
    };
  } catch (e) {
    Logger.log(`getInventoryDashboardData 失敗: ${e.message}`);
    return { stats: [], details: [], error: e.message };
  }
}

/**
 * ✨ 新增：取得盤點會話的指派對象分組統計 (用於儀表板)
 * @param {string} inventoryId - 盤點ID
 * @returns {Array} 統計資料列表
 */
function getInventoryStatsByAssignee(inventoryId) {
  try {
    const details = getInventoryDetails(inventoryId);
    const emailToNameMap = getInventoryAssigneeNameMap();
    return buildInventoryStatsByAssignee(details, emailToNameMap);
  } catch (e) {
    Logger.log(`getInventoryStatsByAssignee 失敗: ${e.message}`);
    return [];
  }
}

/**
 * 標記資產盤點結果
 * @param {string} inventoryId - 盤點ID
 * @param {string} assetId - 資產ID
 * @param {string} result - 盤點結果（正常/遺失/損壞/過舊）
 * @param {string} remarks - 備註
 * @returns {object} 操作結果
 */
function markAssetInventory(inventoryId, assetId, result, remarks) {
  try {
    // 🛡️ 權限檢查：確認使用者是會話擁有者或管理員
    if (!checkInventorySessionOwner(inventoryId)) {
      Logger.log(`權限不足：使用者 ${Session.getActiveUser().getEmail()} 嘗試標記會話 ${inventoryId} 的資產 ${assetId}`);
      return { success: false, error: '權限不足：您無法標記此盤點會話的資產' };
    }

    const currentUserEmail = Session.getActiveUser().getEmail();
    const currentUserName = currentUserEmail.split('@')[0];
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const inventoryDetailSheet = ss.getSheetByName(INVENTORY_DETAIL_SHEET_NAME);

    if (!inventoryDetailSheet) {
      throw new Error('找不到盤點明細工作表');
    }

    // 找到對應的明細記錄
    const data = inventoryDetailSheet.getRange(2, 1, inventoryDetailSheet.getLastRow() - 1, inventoryDetailSheet.getLastColumn()).getValues();
    let rowIndex = -1;

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      if (row[ID_INVENTORY_ID_COLUMN_INDEX - 1] === inventoryId &&
          row[ID_ASSET_ID_COLUMN_INDEX - 1] === assetId) {
        rowIndex = i + 2;
        break;
      }
    }

    if (rowIndex === -1) {
      throw new Error(`找不到盤點明細記錄 (inventoryId: ${inventoryId}, assetId: ${assetId})`);
    }

    // 更新盤點結果
    inventoryDetailSheet.getRange(rowIndex, ID_INVENTORY_RESULT_COLUMN_INDEX).setValue(result);
    inventoryDetailSheet.getRange(rowIndex, ID_REMARKS_COLUMN_INDEX).setValue(remarks || '');
    inventoryDetailSheet.getRange(rowIndex, ID_VERIFICATION_TIME_COLUMN_INDEX).setValue(new Date());
    inventoryDetailSheet.getRange(rowIndex, ID_VERIFIED_BY_COLUMN_INDEX).setValue(currentUserName);

    // 更新盤點紀錄中的已盤點數量
    updateInventoryProgress(inventoryId);

    Logger.log(`成功標記資產盤點: ${assetId} - ${result}`);

    return { success: true, message: '已成功標記盤點結果' };

  } catch (e) {
    Logger.log(`markAssetInventory 失敗: ${e.message}`);
    return { success: false, error: e.message };
  }
}

/**
 * 取消單筆盤點結果（重設為「未盤點」）
 * @param {string} inventoryId - 盤點ID
 * @param {string} assetId - 資產ID
 * @returns {object} 操作結果
 */
function resetAssetInventory(inventoryId, assetId) {
  try {
    // 🛡️ 權限檢查：確認使用者是會話擁有者或管理員
    if (!checkInventorySessionOwner(inventoryId)) {
      Logger.log(`權限不足：使用者 ${Session.getActiveUser().getEmail()} 嘗試取消盤點會話 ${inventoryId} 的資產 ${assetId}`);
      return { success: false, error: '權限不足：您無法取消此盤點會話的資產' };
    }

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const inventoryDetailSheet = ss.getSheetByName(INVENTORY_DETAIL_SHEET_NAME);

    if (!inventoryDetailSheet) {
      throw new Error('找不到盤點明細工作表');
    }

    // 找到對應的明細記錄
    const data = inventoryDetailSheet.getRange(2, 1, inventoryDetailSheet.getLastRow() - 1, inventoryDetailSheet.getLastColumn()).getValues();
    let rowIndex = -1;

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      if (row[ID_INVENTORY_ID_COLUMN_INDEX - 1] === inventoryId &&
          row[ID_ASSET_ID_COLUMN_INDEX - 1] === assetId) {
        rowIndex = i + 2;
        break;
      }
    }

    if (rowIndex === -1) {
      throw new Error(`找不到盤點明細記錄 (inventoryId: ${inventoryId}, assetId: ${assetId})`);
    }

    inventoryDetailSheet.getRange(rowIndex, ID_INVENTORY_RESULT_COLUMN_INDEX).setValue('未盤點');
    inventoryDetailSheet.getRange(rowIndex, ID_REMARKS_COLUMN_INDEX).setValue('');
    inventoryDetailSheet.getRange(rowIndex, ID_VERIFICATION_TIME_COLUMN_INDEX).setValue('');
    inventoryDetailSheet.getRange(rowIndex, ID_VERIFIED_BY_COLUMN_INDEX).setValue('');

    updateInventoryProgress(inventoryId);

    Logger.log(`成功取消盤點資產: ${assetId}`);

    return { success: true, message: '已取消盤點結果' };

  } catch (e) {
    Logger.log(`resetAssetInventory 失敗: ${e.message}`);
    return { success: false, error: e.message };
  }
}

/**
 * 批次標記資產盤點結果
 * @param {string} inventoryId - 盤點 ID
 * @param {Array<{assetId: string, result: string, remarks: string}>} assetResults - 資產結果陣列
 * @returns {Object} {success: boolean, count: number, message: string}
 */
function markBatchInventory(inventoryId, assetResults) {
  try {
    // 🛡️ 權限檢查：確認使用者是會話擁有者或管理員
    if (!checkInventorySessionOwner(inventoryId)) {
      Logger.log(`權限不足：使用者 ${Session.getActiveUser().getEmail()} 嘗試批次標記會話 ${inventoryId}`);
      return { success: false, message: '權限不足：您無法標記此盤點會話的資產' };
    }

    const currentUserEmail = Session.getActiveUser().getEmail();
    const currentUserName = currentUserEmail.split('@')[0];
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const inventoryDetailSheet = ss.getSheetByName(INVENTORY_DETAIL_SHEET_NAME);

    if (!inventoryDetailSheet) {
      return { success: false, message: '找不到盤點明細工作表' };
    }

    // 取得所有明細資料
    const data = inventoryDetailSheet.getRange(2, 1, inventoryDetailSheet.getLastRow() - 1, inventoryDetailSheet.getLastColumn()).getValues();

    let successCount = 0;
    let errorMessages = [];
    const now = new Date();

    // 建立資產 ID 索引以加快查找
    const assetRowMap = new Map();
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const rowInventoryId = row[ID_INVENTORY_ID_COLUMN_INDEX - 1];
      const rowAssetId = row[ID_ASSET_ID_COLUMN_INDEX - 1];

      if (rowInventoryId === inventoryId) {
        assetRowMap.set(rowAssetId, i + 2); // +2 因為從第 2 行開始
      }
    }

    // 批次處理每個資產
    assetResults.forEach(item => {
      try {
        const rowIndex = assetRowMap.get(item.assetId);

        if (!rowIndex) {
          errorMessages.push(`找不到資產 ${item.assetId} 的盤點明細`);
          return;
        }

        // 更新盤點結果
        inventoryDetailSheet.getRange(rowIndex, ID_INVENTORY_RESULT_COLUMN_INDEX).setValue(item.result);
        inventoryDetailSheet.getRange(rowIndex, ID_REMARKS_COLUMN_INDEX).setValue(item.remarks || '');
        inventoryDetailSheet.getRange(rowIndex, ID_VERIFICATION_TIME_COLUMN_INDEX).setValue(now);
        inventoryDetailSheet.getRange(rowIndex, ID_VERIFIED_BY_COLUMN_INDEX).setValue(currentUserName);

        successCount++;
      } catch (error) {
        errorMessages.push(`標記 ${item.assetId} 時發生錯誤: ${error.message}`);
      }
    });

    // 更新盤點進度（只需執行一次）
    if (successCount > 0) {
      updateInventoryProgress(inventoryId);
    }

    // 記錄日誌
    const logMessage = `批次標記 ${successCount} 筆資產 by ${currentUserName}`;
    Logger.log(`[Inventory] ${logMessage}`);

    // 組合回應訊息
    if (errorMessages.length > 0) {
      return {
        success: true,
        count: successCount,
        message: `成功標記 ${successCount} 筆，${errorMessages.length} 筆失敗\n${errorMessages.slice(0, 5).join('\n')}${errorMessages.length > 5 ? '\n...' : ''}`
      };
    }

    return {
      success: true,
      count: successCount,
      message: `成功標記 ${successCount} 筆資產`
    };

  } catch (error) {
    Logger.log('[Inventory] 批次標記失敗: ' + error.message);
    return {
      success: false,
      message: '批次標記失敗: ' + error.message
    };
  }
}

/**
 * 取消批次盤點結果（重設為「未盤點」）
 * @param {string} inventoryId - 盤點 ID
 * @param {Array<string>} assetIds - 資產ID陣列
 * @returns {Object} {success: boolean, count: number, message: string}
 */
function resetBatchInventory(inventoryId, assetIds) {
  try {
    // 🛡️ 權限檢查：確認使用者是會話擁有者或管理員
    if (!checkInventorySessionOwner(inventoryId)) {
      Logger.log(`權限不足：使用者 ${Session.getActiveUser().getEmail()} 嘗試批次取消會話 ${inventoryId}`);
      return { success: false, message: '權限不足：您無法取消此盤點會話的資產' };
    }

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const inventoryDetailSheet = ss.getSheetByName(INVENTORY_DETAIL_SHEET_NAME);

    if (!inventoryDetailSheet) {
      return { success: false, message: '找不到盤點明細工作表' };
    }

    const data = inventoryDetailSheet.getRange(2, 1, inventoryDetailSheet.getLastRow() - 1, inventoryDetailSheet.getLastColumn()).getValues();
    const assetRowMap = new Map();

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      if (row[ID_INVENTORY_ID_COLUMN_INDEX - 1] === inventoryId) {
        assetRowMap.set(row[ID_ASSET_ID_COLUMN_INDEX - 1], i + 2);
      }
    }

    let successCount = 0;
    let errorMessages = [];

    assetIds.forEach(assetId => {
      try {
        const rowIndex = assetRowMap.get(assetId);
        if (!rowIndex) {
          errorMessages.push(`找不到資產 ${assetId} 的盤點明細`);
          return;
        }

        inventoryDetailSheet.getRange(rowIndex, ID_INVENTORY_RESULT_COLUMN_INDEX).setValue('未盤點');
        inventoryDetailSheet.getRange(rowIndex, ID_REMARKS_COLUMN_INDEX).setValue('');
        inventoryDetailSheet.getRange(rowIndex, ID_VERIFICATION_TIME_COLUMN_INDEX).setValue('');
        inventoryDetailSheet.getRange(rowIndex, ID_VERIFIED_BY_COLUMN_INDEX).setValue('');

        successCount++;
      } catch (error) {
        errorMessages.push(`取消 ${assetId} 時發生錯誤: ${error.message}`);
      }
    });

    if (successCount > 0) {
      updateInventoryProgress(inventoryId);
    }

    if (errorMessages.length > 0) {
      return {
        success: true,
        count: successCount,
        message: `成功取消 ${successCount} 筆，${errorMessages.length} 筆失敗\n${errorMessages.slice(0, 5).join('\n')}${errorMessages.length > 5 ? '\n...' : ''}`
      };
    }

    return {
      success: true,
      count: successCount,
      message: `成功取消 ${successCount} 筆資產的盤點結果`
    };

  } catch (error) {
    Logger.log('[Inventory] 批次取消失敗: ' + error.message);
    return {
      success: false,
      message: '批次取消失敗: ' + error.message
    };
  }
}

/**
 * 取得使用者所屬組別（供盤點權限判斷）
 * @param {Spreadsheet} ss - 既有 Spreadsheet 物件
 * @param {string} currentUserEmail - 使用者 Email（小寫）
 * @returns {string} 組別名稱
 */
function getInventoryUserGroup_(ss, currentUserEmail) {
  let currentUserGroup = '未分組';
  const keeperEmailSheet = ss.getSheetByName(KEEPER_EMAIL_MAP_SHEET_NAME);
  if (keeperEmailSheet && keeperEmailSheet.getLastRow() > 1) {
    const keeperData = keeperEmailSheet.getRange(2, 1, keeperEmailSheet.getLastRow() - 1, 7).getValues();
    for (let i = 0; i < keeperData.length; i++) {
      const row = keeperData[i];
      const email = row[1];
      if (!email) continue;
      const normalizedEmail = String(email).toLowerCase().trim();
      if (normalizedEmail === currentUserEmail) {
        const groupName = row[6];
        if (groupName) {
          currentUserGroup = String(groupName).trim();
        }
        break;
      }
    }
  }
  return currentUserGroup;
}

/**
 * 判斷指派對象是否符合目前使用者（Email 或組別）
 * @param {string} assignedRaw - 指派欄位原始值
 * @param {string} currentUserEmail - 使用者 Email（小寫）
 * @param {string} currentUserGroup - 使用者組別
 * @returns {boolean} 是否有權限
 */
function isInventoryAssignedToUser_(assignedRaw, currentUserEmail, currentUserGroup) {
  const assignedValue = String(assignedRaw || '').trim();
  if (!assignedValue) return false;
  if (assignedValue.includes('@')) {
    return assignedValue.toLowerCase() === currentUserEmail;
  }
  return assignedValue === currentUserGroup;
}

/**
 * 更新進行中盤點會話內的資產盤點結果
 * @param {Array<{assetId: string, result?: string, remarks?: string}>} assetResults - 資產結果
 * @param {Object} options - 更新選項
 * @param {boolean} options.reset - 是否重設為未盤點
 * @returns {Object} 操作結果
 */
function updateInventoryDetailsInActiveSessions_(assetResults, options) {
  try {
    const isReset = options && options.reset === true;
    if (!Array.isArray(assetResults) || assetResults.length === 0) {
      return { success: false, error: '沒有可處理的資產' };
    }

    const sanitizedResults = {};
    const invalidResults = [];
    assetResults.forEach(item => {
      const assetId = String(item.assetId || '').trim();
      if (!assetId) return;
      if (!isReset) {
        const result = String(item.result || '').trim();
        if (!result) {
          invalidResults.push(assetId);
          return;
        }
        sanitizedResults[assetId] = {
          result: result,
          remarks: item.remarks
        };
      } else {
        sanitizedResults[assetId] = { result: '', remarks: '' };
      }
    });

    const assetIds = Object.keys(sanitizedResults);
    if (assetIds.length === 0) {
      return { success: false, error: '沒有可處理的資產' };
    }
    if (!isReset && invalidResults.length > 0) {
      return { success: false, error: `盤點結果不可為空：${invalidResults.join(', ')}` };
    }

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const inventoryLogSheet = ss.getSheetByName(INVENTORY_LOG_SHEET_NAME);
    if (!inventoryLogSheet || inventoryLogSheet.getLastRow() <= 1) {
      return { success: false, error: '找不到盤點紀錄工作表' };
    }

    const logData = inventoryLogSheet.getRange(2, 1, inventoryLogSheet.getLastRow() - 1, inventoryLogSheet.getLastColumn()).getValues();
    const activeSessionOwners = {};
    logData.forEach(row => {
      const status = row[IL_STATUS_COLUMN_INDEX - 1];
      if (status !== '進行中') return;
      const inventoryId = row[IL_INVENTORY_ID_COLUMN_INDEX - 1];
      if (!inventoryId) return;
      const sessionEmail = row[IL_INVENTORY_EMAIL_COLUMN_INDEX - 1];
      activeSessionOwners[inventoryId] = sessionEmail ? String(sessionEmail).toLowerCase() : '';
    });

    const activeSessionIds = Object.keys(activeSessionOwners);
    if (activeSessionIds.length === 0) {
      return { success: false, error: '目前沒有進行中的盤點會話' };
    }

    const inventoryDetailSheet = ss.getSheetByName(INVENTORY_DETAIL_SHEET_NAME);
    if (!inventoryDetailSheet || inventoryDetailSheet.getLastRow() <= 1) {
      return { success: false, error: '找不到盤點明細工作表' };
    }

    const currentUserEmail = Session.getActiveUser().getEmail().toLowerCase();
    const currentUserName = currentUserEmail.split('@')[0];
    const isAdmin = checkAdminPermissions();
    const currentUserGroup = getInventoryUserGroup_(ss, currentUserEmail);
    const detailData = inventoryDetailSheet.getRange(2, 1, inventoryDetailSheet.getLastRow() - 1, ID_ASSIGNED_USER_COLUMN_INDEX).getValues();
    const updatedSessionMap = {};
    let updatedCount = 0;
    let skippedCount = 0;
    const now = new Date();

    for (let i = 0; i < detailData.length; i++) {
      const row = detailData[i];
      const inventoryId = row[ID_INVENTORY_ID_COLUMN_INDEX - 1];
      if (!inventoryId || !activeSessionOwners[inventoryId]) continue;

      const assetId = String(row[ID_ASSET_ID_COLUMN_INDEX - 1] || '').trim();
      const assetResult = sanitizedResults[assetId];
      if (!assetResult) continue;

      const ownerEmail = activeSessionOwners[inventoryId];
      const assignedRaw = row[ID_ASSIGNED_USER_COLUMN_INDEX - 1];
      const hasPermission = isAdmin ||
        (ownerEmail && ownerEmail === currentUserEmail) ||
        isInventoryAssignedToUser_(assignedRaw, currentUserEmail, currentUserGroup);

      if (!hasPermission) {
        skippedCount++;
        continue;
      }

      const rowIndex = i + 2;
      if (isReset) {
        inventoryDetailSheet.getRange(rowIndex, ID_INVENTORY_RESULT_COLUMN_INDEX, 1, 4)
          .setValues([['未盤點', '', '', '']]);
      } else {
        inventoryDetailSheet.getRange(rowIndex, ID_INVENTORY_RESULT_COLUMN_INDEX, 1, 4)
          .setValues([[assetResult.result, assetResult.remarks || '', now, currentUserName]]);
      }

      updatedCount++;
      updatedSessionMap[inventoryId] = true;
    }

    const updatedSessionIds = Object.keys(updatedSessionMap);
    updatedSessionIds.forEach(sessionId => updateInventoryProgress(sessionId));

    if (updatedCount === 0) {
      const errorMessage = skippedCount > 0
        ? '權限不足：您無法更新任何進行中的盤點會話'
        : '找不到符合條件的盤點明細';
      return { success: false, error: errorMessage };
    }

    const sessionCount = updatedSessionIds.length;
    const skippedSuffix = skippedCount > 0 ? `，略過 ${skippedCount} 筆（權限不足）` : '';
    const message = isReset
      ? `已取消 ${updatedCount} 筆盤點結果（${sessionCount} 個會話）${skippedSuffix}`
      : `已更新 ${updatedCount} 筆盤點結果（${sessionCount} 個會話）${skippedSuffix}`;

    return {
      success: true,
      updatedCount: updatedCount,
      sessionCount: sessionCount,
      skippedCount: skippedCount,
      message: message
    };
  } catch (e) {
    Logger.log(`updateInventoryDetailsInActiveSessions_ 失敗: ${e.message}`);
    return { success: false, error: e.message };
  }
}

/**
 * 更新單筆資產於所有進行中盤點會話的盤點結果
 * @param {string} assetId - 資產 ID
 * @param {string} result - 盤點結果
 * @param {string} remarks - 備註
 * @returns {Object} 操作結果
 */
function markAssetInventoryInActiveSessions(assetId, result, remarks) {
  return updateInventoryDetailsInActiveSessions_([{ assetId: assetId, result: result, remarks: remarks }], { reset: false });
}

/**
 * 批次更新資產於所有進行中盤點會話的盤點結果
 * @param {Array<{assetId: string, result: string, remarks: string}>} assetResults - 資產結果
 * @returns {Object} 操作結果
 */
function markBatchInventoryInActiveSessions(assetResults) {
  return updateInventoryDetailsInActiveSessions_(assetResults, { reset: false });
}

/**
 * 取消單筆資產於所有進行中盤點會話的盤點結果
 * @param {string} assetId - 資產 ID
 * @returns {Object} 操作結果
 */
function resetAssetInventoryInActiveSessions(assetId) {
  return updateInventoryDetailsInActiveSessions_([{ assetId: assetId }], { reset: true });
}

/**
 * 批次取消資產於所有進行中盤點會話的盤點結果
 * @param {Array<string>} assetIds - 資產 ID 陣列
 * @returns {Object} 操作結果
 */
function resetBatchInventoryInActiveSessions(assetIds) {
  const results = (assetIds || []).map(assetId => ({ assetId: assetId }));
  return updateInventoryDetailsInActiveSessions_(results, { reset: true });
}

/**
 * 更新盤點進度
 * @param {string} inventoryId - 盤點ID
 */
function updateInventoryProgress(inventoryId) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const inventoryLogSheet = ss.getSheetByName(INVENTORY_LOG_SHEET_NAME);
    const inventoryDetailSheet = ss.getSheetByName(INVENTORY_DETAIL_SHEET_NAME);

    // 計算已盤點數量
    const detailData = inventoryDetailSheet.getRange(2, 1, inventoryDetailSheet.getLastRow() - 1, inventoryDetailSheet.getLastColumn()).getValues();
    let verifiedCount = 0;

    for (let row of detailData) {
      if (row[ID_INVENTORY_ID_COLUMN_INDEX - 1] === inventoryId) {
        const result = row[ID_INVENTORY_RESULT_COLUMN_INDEX - 1];
        if (result && result !== '未盤點') {
          verifiedCount++;
        }
      }
    }

    // 更新盤點紀錄
    const logData = inventoryLogSheet.getRange(2, 1, inventoryLogSheet.getLastRow() - 1, inventoryLogSheet.getLastColumn()).getValues();
    for (let i = 0; i < logData.length; i++) {
      if (logData[i][IL_INVENTORY_ID_COLUMN_INDEX - 1] === inventoryId) {
        inventoryLogSheet.getRange(i + 2, IL_VERIFIED_COUNT_COLUMN_INDEX).setValue(verifiedCount);
        break;
      }
    }

  } catch (e) {
    Logger.log(`updateInventoryProgress 失敗: ${e.message}`);
  }
}

/**
 * 完成盤點會話
 * @param {string} inventoryId - 盤點ID
 * @returns {object} 操作結果和統計資訊
 */
function completeInventorySession(inventoryId) {
  try {
    // 🛡️ 權限檢查：確認使用者是會話擁有者或管理員
    if (!checkInventorySessionOwner(inventoryId)) {
      Logger.log(`權限不足：使用者 ${Session.getActiveUser().getEmail()} 嘗試完成會話 ${inventoryId}`);
      return {
        success: false,
        error: '權限不足：您無法完成此盤點會話'
      };
    }

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const inventoryLogSheet = ss.getSheetByName(INVENTORY_LOG_SHEET_NAME);
    const inventoryDetailSheet = ss.getSheetByName(INVENTORY_DETAIL_SHEET_NAME);

    // 統計盤點結果
    const detailData = inventoryDetailSheet.getRange(2, 1, inventoryDetailSheet.getLastRow() - 1, inventoryDetailSheet.getLastColumn()).getValues();
    let stats = {
      total: 0,
      normal: 0,
      missing: 0,
      damaged: 0,
      old: 0,
      unverified: 0
    };

    for (let row of detailData) {
      if (row[ID_INVENTORY_ID_COLUMN_INDEX - 1] === inventoryId) {
        stats.total++;
        const result = row[ID_INVENTORY_RESULT_COLUMN_INDEX - 1];
        if (result === '正常') stats.normal++;
        else if (result === '遺失') stats.missing++;
        else if (result === '損壞') stats.damaged++;
        else if (result === '過舊') stats.old++;
        else stats.unverified++;
      }
    }

    // 檢查是否還有未盤點的項目
    if (stats.unverified > 0) {
      return {
        success: false,
        error: `還有 ${stats.unverified} 筆資產尚未盤點，請完成所有資產的盤點後再結束會話`,
        stats: stats
      };
    }

    // 更新盤點紀錄狀態為已完成
    const logData = inventoryLogSheet.getRange(2, 1, inventoryLogSheet.getLastRow() - 1, inventoryLogSheet.getLastColumn()).getValues();
    for (let i = 0; i < logData.length; i++) {
      if (logData[i][IL_INVENTORY_ID_COLUMN_INDEX - 1] === inventoryId) {
        inventoryLogSheet.getRange(i + 2, IL_STATUS_COLUMN_INDEX).setValue('已完成');
        inventoryLogSheet.getRange(i + 2, IL_COMPLETION_TIME_COLUMN_INDEX).setValue(new Date());
        break;
      }
    }

    Logger.log(`成功完成盤點會話: ${inventoryId}`);

    return {
      success: true,
      message: '盤點會話已完成',
      stats: stats
    };

  } catch (e) {
    Logger.log(`completeInventorySession 失敗: ${e.message}`);
    return { success: false, error: e.message };
  }
}

/**
 * 取得盤點歷史記錄
 * @param {boolean} allRecords - 是否取得所有記錄（管理員用）
 * @returns {Array} 盤點歷史記錄
 */
function getInventoryHistory(allRecords) {
  try {
    const isAdmin = checkAdminStatus();
    if (allRecords && !isAdmin) {
      throw new Error('Access Denied');
    }
    const currentUserEmail = Session.getActiveUser().getEmail().toLowerCase();
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const inventoryLogSheet = ss.getSheetByName(INVENTORY_LOG_SHEET_NAME);

    if (!inventoryLogSheet || inventoryLogSheet.getLastRow() <= 1) {
      return [];
    }

    const formatTimestamp = (rawValue) => {
      if (!rawValue) return '';
      if (rawValue instanceof Date) {
        return Utilities.formatDate(rawValue, Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm");
      }
      const parsed = new Date(rawValue);
      if (!Number.isNaN(parsed.getTime())) {
        return Utilities.formatDate(parsed, Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm");
      }
      return String(rawValue);
    };

    // 建立 Email 到姓名的映射（從「保管人/信箱」表）
    const keeperEmailSheet = ss.getSheetByName(KEEPER_EMAIL_MAP_SHEET_NAME);
    const emailToNameMap = new Map();
    if (keeperEmailSheet && keeperEmailSheet.getLastRow() > 1) {
      const keeperData = keeperEmailSheet.getRange(2, 1, keeperEmailSheet.getLastRow() - 1, 2).getValues();
      keeperData.forEach(row => {
        const name = row[0];
        const email = row[1];
        if (email) {
          emailToNameMap.set(String(email).toLowerCase(), name);
        }
      });
    }

    const data = inventoryLogSheet.getRange(2, 1, inventoryLogSheet.getLastRow() - 1, inventoryLogSheet.getLastColumn()).getValues();
    const history = data.map(row => {
      const sessionEmail = row[IL_INVENTORY_EMAIL_COLUMN_INDEX - 1];
      const normalizedSessionEmail = sessionEmail ? String(sessionEmail).toLowerCase() : '';

      // 如果不是管理員模式，只顯示自己的記錄
      if (!allRecords && normalizedSessionEmail !== currentUserEmail) {
        return null;
      }

      const rawInventoryDate = row[IL_INVENTORY_DATE_COLUMN_INDEX - 1];
      const inventoryDateStr = rawInventoryDate instanceof Date
        ? Utilities.formatDate(rawInventoryDate, Session.getScriptTimeZone(), "yyyy/MM/dd HH:mm:ss")
        : (rawInventoryDate ? String(rawInventoryDate) : '');
      const timestampDisplay = formatTimestamp(rawInventoryDate);

      const rawCompletionTime = row[IL_COMPLETION_TIME_COLUMN_INDEX - 1];
      const completionTimeStr = rawCompletionTime instanceof Date
        ? Utilities.formatDate(rawCompletionTime, Session.getScriptTimeZone(), "yyyy/MM/dd HH:mm:ss")
        : (rawCompletionTime ? String(rawCompletionTime) : '');

      // 從映射表查詢真實姓名，找不到則使用原始的 inventoryPerson
      const inventoryPersonName = emailToNameMap.get(normalizedSessionEmail) || row[IL_INVENTORY_PERSON_COLUMN_INDEX - 1];
      const statusLabel = row[IL_STATUS_COLUMN_INDEX - 1];
      const statusCode = statusLabel === '已完成'
        ? 'COMPLETED'
        : statusLabel === '進行中'
          ? 'OPEN'
          : 'UNKNOWN';
      const verifiedCount = Number(row[IL_VERIFIED_COUNT_COLUMN_INDEX - 1] || 0);
      const totalCount = Number(row[IL_TOTAL_COUNT_COLUMN_INDEX - 1] || 0);
      const sessionId = row[IL_INVENTORY_ID_COLUMN_INDEX - 1];
      const summary = row[IL_INVENTORY_FILTER_COLUMN_INDEX - 1] || '';
      const conditionSummary = row[IL_SUMMARY_COLUMN_INDEX - 1] || '';

      return {
        inventoryId: sessionId,
        inventoryDate: inventoryDateStr,
        inventoryPerson: inventoryPersonName, // 使用從映射表查詢的真實姓名
        inventoryEmail: sessionEmail,
        filter: summary,
        verifiedCount: verifiedCount,
        totalCount: totalCount,
        status: statusLabel,
        completionTime: completionTimeStr,
        sessionId: sessionId,
        timestamp: timestampDisplay,
        auditor: sessionEmail || inventoryPersonName || '',
        statusCode: statusCode,
        progressDisplay: `${verifiedCount} / ${totalCount}`,
        summary: summary,
        conditionSummary: conditionSummary // J 欄：篩選條件摘要（新舊會話相容）
      };
    }).filter(item => item);

    // 按日期倒序排列
    history.sort((a, b) => new Date(b.inventoryDate) - new Date(a.inventoryDate));

    return history;

  } catch (e) {
    Logger.log(`getInventoryHistory 失敗: ${e.message}`);
    throw e;
  }
}

/**
 * 檢查是否有進行中的盤點會話
 * @returns {Object} { hasActive: boolean, sessionId: string | null }
 */
function checkActiveSession() {
  const isAdmin = checkAdminStatus();
  if (!isAdmin) {
    throw new Error('Access Denied');
  }

  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const inventoryLogSheet = ss.getSheetByName(INVENTORY_LOG_SHEET_NAME);

    if (!inventoryLogSheet || inventoryLogSheet.getLastRow() <= 1) {
      return { hasActive: false, sessionId: null };
    }

    const data = inventoryLogSheet.getRange(2, 1, inventoryLogSheet.getLastRow() - 1, inventoryLogSheet.getLastColumn()).getValues();
    let activeSessionId = null;
    let activeSessionDate = null;

    data.forEach(row => {
      const status = row[IL_STATUS_COLUMN_INDEX - 1];
      if (status !== '進行中') return;
      const inventoryId = row[IL_INVENTORY_ID_COLUMN_INDEX - 1];
      if (!inventoryId) return;

      const rawDate = row[IL_INVENTORY_DATE_COLUMN_INDEX - 1];
      let dateValue = null;
      if (rawDate instanceof Date) {
        dateValue = rawDate;
      } else if (rawDate) {
        const parsed = new Date(rawDate);
        if (!Number.isNaN(parsed.getTime())) {
          dateValue = parsed;
        }
      }

      if (!activeSessionId) {
        activeSessionId = inventoryId;
        activeSessionDate = dateValue;
        return;
      }

      if (dateValue && (!activeSessionDate || dateValue > activeSessionDate)) {
        activeSessionId = inventoryId;
        activeSessionDate = dateValue;
      }
    });

    return {
      hasActive: Boolean(activeSessionId),
      sessionId: activeSessionId || null
    };
  } catch (e) {
    Logger.log(`checkActiveSession 失敗: ${e.message}`);
    throw e;
  }
}

/**
 * 刪除盤點會話與明細
 * @param {string} sessionId - 盤點會話 ID
 * @returns {Object} 刪除結果
 */
function deleteInventorySession(sessionId) {
  const isAdmin = checkAdminStatus();
  if (!isAdmin) {
    throw new Error('Access Denied');
  }

  const targetId = String(sessionId || '').trim();
  if (!targetId) {
    throw new Error('缺少盤點會話 ID');
  }

  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const inventoryLogSheet = ss.getSheetByName(INVENTORY_LOG_SHEET_NAME);
    const inventoryDetailSheet = ss.getSheetByName(INVENTORY_DETAIL_SHEET_NAME);

    let deletedLogRows = 0;
    if (inventoryLogSheet && inventoryLogSheet.getLastRow() > 1) {
      const logData = inventoryLogSheet.getRange(2, 1, inventoryLogSheet.getLastRow() - 1, inventoryLogSheet.getLastColumn()).getValues();
      const logRowsToDelete = [];

      logData.forEach((row, index) => {
        if (row[IL_INVENTORY_ID_COLUMN_INDEX - 1] === targetId) {
          logRowsToDelete.push(index + 2);
        }
      });

      for (let i = logRowsToDelete.length - 1; i >= 0; i--) {
        inventoryLogSheet.deleteRow(logRowsToDelete[i]);
        deletedLogRows += 1;
      }
    }

    let deletedDetailRows = 0;
    if (inventoryDetailSheet && inventoryDetailSheet.getLastRow() > 1) {
      const detailData = inventoryDetailSheet.getRange(2, 1, inventoryDetailSheet.getLastRow() - 1, inventoryDetailSheet.getLastColumn()).getValues();
      const detailRowsToDelete = [];

      detailData.forEach((row, index) => {
        if (row[ID_INVENTORY_ID_COLUMN_INDEX - 1] === targetId) {
          detailRowsToDelete.push(index + 2);
        }
      });

      for (let i = detailRowsToDelete.length - 1; i >= 0; i--) {
        inventoryDetailSheet.deleteRow(detailRowsToDelete[i]);
        deletedDetailRows += 1;
      }
    }

    if (deletedLogRows === 0 && deletedDetailRows === 0) {
      throw new Error('找不到盤點會話');
    }

    return {
      success: true,
      message: `已刪除盤點會話 ${targetId}`,
      deletedLogRows: deletedLogRows,
      deletedDetailRows: deletedDetailRows
    };
  } catch (e) {
    Logger.log(`deleteInventorySession 失敗: ${e.message}`);
    throw e;
  }
}

// =================================================================
// --- ✨ ISMS 資訊資產分類整合（盤點流程用）---
// =================================================================

/**
 * 取得 ISMS 資訊資產清單（供盤點時下拉選擇）
 * 僅回傳必要欄位以減少傳輸量
 * @returns {Object} { success, assets: [{ ismsAssetId, category, name, mainCategory, subCategory }] }
 */
function getIsmsAssetList() {
  try {
    if (!ISMS_SPREADSHEET_ID || ISMS_SPREADSHEET_ID === 'YOUR_ISMS_SPREADSHEET_ID_HERE') {
      return { success: false, error: 'ISMS 試算表 ID 尚未設定，請在 env.js 中設定 ISMS_SPREADSHEET_ID' };
    }

    const ss = SpreadsheetApp.openById(ISMS_SPREADSHEET_ID);
    const sheet = ss.getSheetByName(ISMS_ASSET_SHEET_NAME);

    if (!sheet) {
      return { success: false, error: '找不到資訊資產清單工作表' };
    }

    const lastRow = sheet.getLastRow();
    if (lastRow <= 1) {
      return { success: true, assets: [] };
    }

    const data = sheet.getRange(2, 1, lastRow - 1, ISMS_ASSET_COLUMN_INDICES.STATUS).getValues();
    const assets = [];
    const indices = ISMS_ASSET_COLUMN_INDICES;

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const ismsAssetId = row[indices.ISMS_ASSET_ID - 1];
      if (!ismsAssetId) continue;

      assets.push({
        ismsAssetId: ismsAssetId.toString(),
        category: row[indices.CATEGORY - 1] ? row[indices.CATEGORY - 1].toString() : '',
        name: row[indices.NAME - 1] ? row[indices.NAME - 1].toString() : '',
        mainCategory: row[indices.MAIN_CATEGORY - 1] ? row[indices.MAIN_CATEGORY - 1].toString() : '',
        subCategory: row[indices.SUB_CATEGORY - 1] ? row[indices.SUB_CATEGORY - 1].toString() : '',
        responsibleUnit: row[indices.RESPONSIBLE_UNIT - 1] ? row[indices.RESPONSIBLE_UNIT - 1].toString() : ''
      });
    }

    return { success: true, assets: assets };
  } catch (e) {
    Logger.log('getIsmsAssetList 失敗: ' + e.message);
    return { success: false, error: e.message };
  }
}

/**
 * 讀取 ISMS 試算表「下拉選單」工作表，回傳類別 / 組別 / 狀態三組
 * B 欄=key、C 欄=中文顯示文字、D 欄=代號
 */
function getIsmsDropdownOptions() {
  try {
    if (!ISMS_SPREADSHEET_ID || ISMS_SPREADSHEET_ID === 'YOUR_ISMS_SPREADSHEET_ID_HERE') {
      return { success: false, error: 'ISMS 試算表 ID 尚未設定' };
    }
    const ss = SpreadsheetApp.openById(ISMS_SPREADSHEET_ID);
    const sheet = ss.getSheetByName(ISMS_DROPDOWN_SHEET_NAME);
    if (!sheet) return { success: false, error: '找不到「下拉選單」工作表' };

    const categories = [];
    const groups = [];
    const statuses = [];
    const businessProcesses = [];

    if (sheet.getLastRow() > 1) {
      const data = sheet.getRange(2, 2, sheet.getLastRow() - 1, 3).getValues();
      for (let i = 0; i < data.length; i++) {
        const key = data[i][0] ? String(data[i][0]).trim() : '';     // B 欄
        const display = data[i][1] ? String(data[i][1]).trim() : ''; // C 欄
        const code = data[i][2] ? String(data[i][2]).trim() : '';    // D 欄
        if (!key || !display) continue;

        if (key === '資訊資產類別' || key === '類別') categories.push({ display, code });
        else if (key === '組別') groups.push({ display, code });
        else if (key === '資訊資產狀態' || key === '資產狀態' || key === '狀態') statuses.push({ display, code });
        else if (key === '業務流程') businessProcesses.push({ display });
      }
    }

    return { success: true, categories, groups, statuses, businessProcesses };
  } catch (e) {
    Logger.log('getIsmsDropdownOptions 錯誤: ' + e.message);
    return { success: false, error: e.message };
  }
}

/**
 * 新增 ISMS 資訊資產：自動產號 + 計算資產價值
 * 供盤點流程即時建立新資訊資產使用
 * @param {Object} form
 *   - categoryDisplay / categoryCode
 *   - groupDisplay / groupCode
 *   - statusDisplay
 *   - name, description
 *   - confidentiality, integrity, availability (1~4)
 * @returns {Object} { success, ismsAssetId, serial, assetValue, rowIndex }
 */
function createIsmsAsset(form) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);

    if (!ISMS_SPREADSHEET_ID || ISMS_SPREADSHEET_ID === 'YOUR_ISMS_SPREADSHEET_ID_HERE') {
      return { success: false, error: 'ISMS 試算表 ID 尚未設定' };
    }
    if (!form || typeof form !== 'object') {
      return { success: false, error: '表單資料不正確' };
    }

    const name = (form.name || '').toString().trim();
    const categoryDisplay = (form.categoryDisplay || '').toString().trim();
    const categoryCode = (form.categoryCode || '').toString().trim();
    const groupDisplay = (form.groupDisplay || '').toString().trim();
    const groupCode = (form.groupCode || '').toString().trim();
    const statusDisplay = (form.statusDisplay || '').toString().trim();
    const businessProcess = (form.businessProcess || '').toString().trim();
    const description = (form.description || '').toString();
    const c = Number(form.confidentiality);
    const i = Number(form.integrity);
    const a = Number(form.availability);

    if (!name) return { success: false, error: '資產名稱必填' };
    if (!categoryDisplay || !categoryCode) return { success: false, error: '請選擇類別' };
    if (!groupDisplay || !groupCode) return { success: false, error: '請選擇組別' };
    const isValidCIA = (n) => Number.isInteger(n) && n >= 1 && n <= 4;
    if (!isValidCIA(c) || !isValidCIA(i) || !isValidCIA(a)) {
      return { success: false, error: 'CIA 三項必須是 1~4 的整數' };
    }

    const ss = SpreadsheetApp.openById(ISMS_SPREADSHEET_ID);
    const sheet = ss.getSheetByName(ISMS_ASSET_SHEET_NAME);
    if (!sheet) return { success: false, error: '找不到資訊資產工作表' };

    const idx = ISMS_ASSET_COLUMN_INDICES;
    // 序號策略：(1) 掃 A 欄比對 `{group}-{category}-\d+` 抽尾號 (2) 備援比對 B/S 欄 (3) 最終迴圈避免撞號
    const escapeRegExp = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const idPattern = new RegExp('^' + escapeRegExp(groupCode) + '-' + escapeRegExp(categoryCode) + '-(\\d+)$', 'i');
    const existingIds = new Set();
    let maxSerial = 0;

    if (sheet.getLastRow() > 1) {
      const data = sheet.getDataRange().getValues();
      for (let r = 1; r < data.length; r++) {
        const row = data[r];
        const rowId = String(row[idx.ISMS_ASSET_ID - 1] || '').trim();
        if (rowId) existingIds.add(rowId.toLowerCase());

        const m = rowId.match(idPattern);
        if (m) {
          const serial = Number(m[1]);
          if (!isNaN(serial) && serial > maxSerial) maxSerial = serial;
          continue;
        }

        const rowCategory = String(row[idx.CATEGORY - 1] || '').trim();
        const rowGroup = String(row[idx.GROUP - 1] || '').trim();
        const categoryMatch = rowCategory === categoryCode || rowCategory === categoryDisplay;
        const groupMatch = rowGroup === groupCode || rowGroup === groupDisplay;
        if (!categoryMatch || !groupMatch) continue;
        const serial = Number(row[idx.SERIAL_NO - 1]);
        if (!isNaN(serial) && serial > maxSerial) maxSerial = serial;
      }
    }

    let nextSerial = maxSerial + 1;
    let serialPadded = String(nextSerial).padStart(3, '0');
    let ismsAssetId = `${groupCode}-${categoryCode}-${serialPadded}`;
    while (existingIds.has(ismsAssetId.toLowerCase())) {
      nextSerial += 1;
      serialPadded = String(nextSerial).padStart(3, '0');
      ismsAssetId = `${groupCode}-${categoryCode}-${serialPadded}`;
    }
    const assetValue = c + i + a;

    const row = new Array(22).fill('');
    row[idx.ISMS_ASSET_ID - 1] = ismsAssetId;
    row[idx.CATEGORY - 1] = categoryCode;
    row[idx.NAME - 1] = name;
    row[idx.DESCRIPTION - 1] = description;
    row[idx.RESPONSIBLE_UNIT - 1] = groupDisplay;
    row[idx.STATUS - 1] = statusDisplay;
    row[idx.CONFIDENTIALITY - 1] = c;
    row[idx.INTEGRITY - 1] = i;
    row[idx.AVAILABILITY - 1] = a;
    row[idx.ASSET_VALUE - 1] = assetValue;
    row[idx.GROUP - 1] = groupCode;
    row[idx.SERIAL_NO - 1] = nextSerial;
    row[idx.BUSINESS_PROCESS - 1] = businessProcess; // V 欄:業務流程

    sheet.appendRow(row);
    SpreadsheetApp.flush();

    return {
      success: true,
      ismsAssetId,
      serial: nextSerial,
      assetValue,
      rowIndex: sheet.getLastRow()
    };
  } catch (e) {
    Logger.log('createIsmsAsset 錯誤: ' + e.message);
    return { success: false, error: e.message };
  } finally {
    try { lock.releaseLock(); } catch (_) {}
  }
}

/**
 * 取得指定資產的 ISMS 對照資訊
 * @param {string[]} assetIds - 資產編號陣列
 * @returns {Object} { success, mappings: { [assetId]: { ismsAssetId, isItAsset } } }
 */
function getIsmsMappingForAssets(assetIds) {
  try {
    if (!assetIds || assetIds.length === 0) {
      return { success: true, mappings: {} };
    }

    const result = {};

    // 從主試算表讀取 IS_IT_ASSET 欄位
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const assetIdSet = {};
    for (let i = 0; i < assetIds.length; i++) {
      assetIdSet[assetIds[i]] = true;
      result[assetIds[i]] = { isItAsset: '', ismsAssetId: '' };
    }

    // 讀取財產總表的 IS_IT_ASSET
    const propSheet = ss.getSheetByName(PROPERTY_MASTER_SHEET_NAME);
    if (propSheet && propSheet.getLastRow() > 1) {
      const propData = propSheet.getRange(2, 1, propSheet.getLastRow() - 1, PROPERTY_COLUMN_INDICES.DEFAULT_GROUP).getValues();
      for (let i = 0; i < propData.length; i++) {
        const aid = propData[i][PROPERTY_COLUMN_INDICES.ASSET_ID - 1];
        if (aid && assetIdSet[aid.toString()]) {
          result[aid.toString()].isItAsset = propData[i][PROPERTY_COLUMN_INDICES.IS_IT_ASSET - 1] ? propData[i][PROPERTY_COLUMN_INDICES.IS_IT_ASSET - 1].toString() : '';
        }
      }
    }

    // 讀取物品總表的 IS_IT_ASSET
    const itemSheet = ss.getSheetByName(ITEM_MASTER_SHEET_NAME);
    if (itemSheet && itemSheet.getLastRow() > 1) {
      const itemData = itemSheet.getRange(2, 1, itemSheet.getLastRow() - 1, ITEM_COLUMN_INDICES.DEFAULT_GROUP).getValues();
      for (let i = 0; i < itemData.length; i++) {
        const aid = itemData[i][ITEM_COLUMN_INDICES.ASSET_ID - 1];
        if (aid && assetIdSet[aid.toString()]) {
          result[aid.toString()].isItAsset = itemData[i][ITEM_COLUMN_INDICES.IS_IT_ASSET - 1] ? itemData[i][ITEM_COLUMN_INDICES.IS_IT_ASSET - 1].toString() : '';
        }
      }
    }

    // 讀取 ISMS 對照表
    if (ISMS_SPREADSHEET_ID && ISMS_SPREADSHEET_ID !== 'YOUR_ISMS_SPREADSHEET_ID_HERE') {
      try {
        const ismsSs = SpreadsheetApp.openById(ISMS_SPREADSHEET_ID);
        const mappingSheet = ismsSs.getSheetByName(ISMS_MAPPING_SHEET_NAME);
        if (mappingSheet && mappingSheet.getLastRow() > 1) {
          const mappingData = mappingSheet.getRange(2, 1, mappingSheet.getLastRow() - 1, ISMS_MAPPING_COLUMN_INDICES.REMARKS).getValues();
          for (let i = 0; i < mappingData.length; i++) {
            const aid = mappingData[i][ISMS_MAPPING_COLUMN_INDICES.ASSET_ID - 1];
            if (aid && assetIdSet[aid.toString()]) {
              result[aid.toString()].ismsAssetId = mappingData[i][ISMS_MAPPING_COLUMN_INDICES.ISMS_ASSET_ID - 1] ? mappingData[i][ISMS_MAPPING_COLUMN_INDICES.ISMS_ASSET_ID - 1].toString() : '';
            }
          }
        }
      } catch (e) {
        Logger.log('讀取 ISMS 對照表失敗（非致命）: ' + e.message);
      }
    }

    return { success: true, mappings: result };
  } catch (e) {
    Logger.log('getIsmsMappingForAssets 失敗: ' + e.message);
    return { success: false, error: e.message };
  }
}

/**
 * 儲存資產的 ISMS 分類（盤點時呼叫）
 * 同時更新：1) 主試算表 IS_IT_ASSET 欄位 2) ISMS 對照表
 * @param {string} assetId - 資產編號
 * @param {boolean} isItAsset - 是否為資訊資產
 * @param {string} ismsAssetId - 資訊資產編號（空字串表示不對照）
 * @returns {Object} 操作結果
 */
function saveIsmsClassification(assetId, isItAsset, ismsAssetId, isIsoScope) {
  try {
    const currentUserEmail = Session.getActiveUser().getEmail();
    const timestamp = new Date().toISOString();

    // 1. 更新主試算表的 IS_IT_ASSET / IS_ISO_SCOPE / ISMS_ASSET_ID 欄位
    const location = findAssetLocation(assetId);
    if (location) {
      const indices = location.sheetName === PROPERTY_MASTER_SHEET_NAME
        ? PROPERTY_COLUMN_INDICES
        : ITEM_COLUMN_INDICES;
      location.sheet.getRange(location.rowIndex, indices.IS_IT_ASSET).setValue(isItAsset ? '是' : '');
      // 更新 IS_ISO_SCOPE 欄位（僅當 isItAsset 為 true 時允許 isIsoScope）
      if (indices.IS_ISO_SCOPE) {
        location.sheet.getRange(location.rowIndex, indices.IS_ISO_SCOPE).setValue(
          (isItAsset && isIsoScope) ? '是' : ''
        );
      }
      if (indices.ISMS_ASSET_ID) {
        location.sheet.getRange(location.rowIndex, indices.ISMS_ASSET_ID).setValue(
          isItAsset ? String(ismsAssetId || '').trim() : ''
        );
      }
    }

    // 2. 更新 ISMS 對照表
    if (ismsAssetId && ISMS_SPREADSHEET_ID && ISMS_SPREADSHEET_ID !== 'YOUR_ISMS_SPREADSHEET_ID_HERE') {
      try {
        const ismsSs = SpreadsheetApp.openById(ISMS_SPREADSHEET_ID);
        let mappingSheet = ismsSs.getSheetByName(ISMS_MAPPING_SHEET_NAME);

        if (!mappingSheet) {
          mappingSheet = ismsSs.insertSheet(ISMS_MAPPING_SHEET_NAME);
          mappingSheet.appendRow(['資產編號', '資訊資產編號', '建立時間', '建立人', '備註']);
        }

        // 查找是否已有對照記錄
        const lastRow = mappingSheet.getLastRow();
        let existingRow = -1;
        if (lastRow > 1) {
          const existingData = mappingSheet.getRange(2, 1, lastRow - 1, 1).getValues();
          for (let i = 0; i < existingData.length; i++) {
            if (existingData[i][0] && existingData[i][0].toString() === assetId) {
              existingRow = i + 2;
              break;
            }
          }
        }

        if (existingRow > 0) {
          // 更新現有記錄
          mappingSheet.getRange(existingRow, ISMS_MAPPING_COLUMN_INDICES.ISMS_ASSET_ID).setValue(ismsAssetId);
          mappingSheet.getRange(existingRow, ISMS_MAPPING_COLUMN_INDICES.CREATED_TIME).setValue(timestamp);
          mappingSheet.getRange(existingRow, ISMS_MAPPING_COLUMN_INDICES.CREATED_BY).setValue(currentUserEmail);
        } else {
          // 新增記錄
          mappingSheet.appendRow([assetId, ismsAssetId, timestamp, currentUserEmail, '盤點時建立']);
        }
      } catch (e) {
        Logger.log('更新 ISMS 對照表失敗（非致命）: ' + e.message);
      }
    } else if (!isItAsset && ISMS_SPREADSHEET_ID && ISMS_SPREADSHEET_ID !== 'YOUR_ISMS_SPREADSHEET_ID_HERE') {
      // 如果取消資訊資產標記，刪除對照記錄
      try {
        const ismsSs = SpreadsheetApp.openById(ISMS_SPREADSHEET_ID);
        const mappingSheet = ismsSs.getSheetByName(ISMS_MAPPING_SHEET_NAME);
        if (mappingSheet && mappingSheet.getLastRow() > 1) {
          const existingData = mappingSheet.getRange(2, 1, mappingSheet.getLastRow() - 1, 1).getValues();
          for (let i = existingData.length - 1; i >= 0; i--) {
            if (existingData[i][0] && existingData[i][0].toString() === assetId) {
              mappingSheet.deleteRow(i + 2);
              break;
            }
          }
        }
      } catch (e) {
        Logger.log('刪除 ISMS 對照記錄失敗（非致命）: ' + e.message);
      }
    }

    return { success: true, message: '已儲存資訊資產分類' };
  } catch (e) {
    Logger.log('saveIsmsClassification 失敗: ' + e.message);
    return { success: false, error: e.message };
  }
}

/**
 * 盤點時同時提交盤點結果與 ISMS 分類（單筆）
 * @param {string} assetId - 資產編號
 * @param {string} result - 盤點結果
 * @param {string} remarks - 備註
 * @param {Object} ismsData - ISMS 分類資料 { isItAsset: boolean, ismsAssetId: string }
 * @returns {Object} 操作結果
 */
function markAssetInventoryWithIsms(assetId, result, remarks, ismsData) {
  // 先執行原有的盤點標記
  const inventoryResult = markAssetInventoryInActiveSessions(assetId, result, remarks);

  // 如果有 ISMS 資料，同步處理 ISMS 分類
  if (ismsData && (ismsData.isItAsset !== undefined)) {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const currentUserEmail = Session.getActiveUser().getEmail();
    const isAdmin = checkAdminPermissions();
    const ismsAccess = getIsmsInventoryAccess_(ss, currentUserEmail, isAdmin);
    if (!ismsAccess.canUseIsmsInventory) {
      Logger.log('使用者無 ISMS 盤點權限，已忽略 ISMS 資料: ' + assetId);
    } else {
      const ismsResult = saveIsmsClassification(assetId, ismsData.isItAsset, ismsData.ismsAssetId || '', ismsData.isIsoScope || false);
      if (!ismsResult.success) {
        Logger.log('ISMS 分類儲存失敗（盤點結果已成功）: ' + ismsResult.error);
      }
    }
  }

  return inventoryResult;
}

/**
 * 盤點時同時提交盤點結果與 ISMS 分類（批次）
 * @param {Array} assetResults - [{ assetId, result, remarks, ismsData: { isItAsset, ismsAssetId } }]
 * @returns {Object} 操作結果
 */
function markBatchInventoryWithIsms(assetResults) {
  // 分離盤點資料與 ISMS 資料
  const inventoryResults = assetResults.map(function(item) {
    return {
      assetId: item.assetId,
      result: item.result,
      remarks: item.remarks
    };
  });

  // 先執行批次盤點標記
  const inventoryResult = markBatchInventoryInActiveSessions(inventoryResults);

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const currentUserEmail = Session.getActiveUser().getEmail();
  const isAdmin = checkAdminPermissions();
  const ismsAccess = getIsmsInventoryAccess_(ss, currentUserEmail, isAdmin);

  // 處理 ISMS 分類
  for (let i = 0; i < assetResults.length; i++) {
    var item = assetResults[i];
    if (item.ismsData && (item.ismsData.isItAsset !== undefined)) {
      if (!ismsAccess.canUseIsmsInventory) {
        Logger.log('使用者無 ISMS 盤點權限，已忽略批次 ISMS 資料: ' + item.assetId);
        continue;
      }
      var ismsResult = saveIsmsClassification(item.assetId, item.ismsData.isItAsset, item.ismsData.ismsAssetId || '', item.ismsData.isIsoScope || false);
      if (!ismsResult.success) {
        Logger.log('批次 ISMS 分類儲存失敗 (' + item.assetId + '): ' + ismsResult.error);
      }
    }
  }

  return inventoryResult;
}
