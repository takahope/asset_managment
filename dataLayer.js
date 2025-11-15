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
