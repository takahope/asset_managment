// ==========================================
// ISMS 資產對照管理系統 - 後端 API
// ==========================================

/**
 * Web App 入口點
 */
function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('資產與資訊資產對照管理')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// ==========================================
// 輔助函式
// ==========================================

/**
 * 取得當前使用者資訊
 */
function getCurrentUser() {
  const email = Session.getActiveUser().getEmail();
  return {
    email: email,
    isAdmin: checkIsAdmin_(email)
  };
}

/**
 * 檢查是否為管理員
 */
function checkIsAdmin_(email) {
  try {
    const ss = SpreadsheetApp.openById(CONFIG.ASSET_SPREADSHEET_ID);
    const sheet = ss.getSheetByName(CONFIG.ADMIN_LIST_SHEET_NAME);
    if (!sheet) return false;

    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] && data[i][0].toString().toLowerCase() === email.toLowerCase()) {
        return true;
      }
    }
    return false;
  } catch (e) {
    console.error('檢查管理員權限失敗:', e);
    return false;
  }
}

/**
 * 建立 Email -> 組別對照表（從「保管人/信箱」工作表的G欄）
 */
function getEmailToGroupMap_() {
  const emailToGroupMap = {};
  try {
    const ss = SpreadsheetApp.openById(CONFIG.ASSET_SPREADSHEET_ID);
    const sheet = ss.getSheetByName('保管人/信箱');

    if (!sheet || sheet.getLastRow() <= 1) {
      return emailToGroupMap;
    }

    const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 7).getValues();

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const email = row[1]; // B欄：Email
      const groupName = row[6]; // G欄：組別

      if (email && groupName) {
        const normalizedEmail = String(email).toLowerCase().trim();
        emailToGroupMap[normalizedEmail] = String(groupName).trim();
      }
    }
  } catch (e) {
    console.error('讀取保管人/信箱工作表失敗:', e);
  }

  return emailToGroupMap;
}

/**
 * 取得資產的組別（優先使用 DEFAULT_GROUP，其次查詢 email 對照表）
 */
function getAssetGroup_(asset, emailToGroupMap) {
  // 第一優先：使用資產的 DEFAULT_GROUP
  if (asset.defaultGroup) {
    return String(asset.defaultGroup).trim();
  }

  // 第二優先：根據使用人 email 查詢組別
  if (asset.userEmail) {
    const normalizedEmail = String(asset.userEmail).toLowerCase().trim();
    const groupName = emailToGroupMap[normalizedEmail];
    if (groupName) {
      return groupName;
    }
  }

  // 預設值
  return '未分組';
}

/**
 * 取得對照表 Map（資產編號 -> 對照資料）
 */
function getMappingMap_() {
  const ss = SpreadsheetApp.openById(CONFIG.ISMS_SPREADSHEET_ID);
  const sheet = ss.getSheetByName(CONFIG.MAPPING_SHEET_NAME);

  const map = new Map();
  if (!sheet) return map;

  const data = sheet.getDataRange().getValues();
  const indices = MAPPING_COLUMN_INDICES;

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const assetId = row[indices.ASSET_ID - 1];
    if (assetId) {
      map.set(assetId.toString(), {
        assetId: assetId.toString(),
        ismsAssetId: row[indices.ISMS_ASSET_ID - 1] ? row[indices.ISMS_ASSET_ID - 1].toString() : '',
        createdTime: row[indices.CREATED_TIME - 1] ? row[indices.CREATED_TIME - 1].toString() : '',
        createdBy: row[indices.CREATED_BY - 1] ? row[indices.CREATED_BY - 1].toString() : '',
        remarks: row[indices.REMARKS - 1] ? row[indices.REMARKS - 1].toString() : '',
        rowIndex: i + 1
      });
    }
  }
  return map;
}

/**
 * 將資產工作表列轉換為物件
 */
function mapRowToAssetObject_(row, indices, sourceSheet) {
  return {
    assetId: row[indices.ASSET_ID - 1] ? row[indices.ASSET_ID - 1].toString() : '',
    assetName: row[indices.ASSET_NAME - 1] ? row[indices.ASSET_NAME - 1].toString() : '',
    modelBrand: row[indices.MODEL_BRAND - 1] ? row[indices.MODEL_BRAND - 1].toString() : '',
    location: row[indices.LOCATION - 1] ? row[indices.LOCATION - 1].toString() : '',
    leaderName: row[indices.LEADER_NAME - 1] ? row[indices.LEADER_NAME - 1].toString() : '',
    leaderEmail: row[indices.LEADER_EMAIL - 1] ? row[indices.LEADER_EMAIL - 1].toString() : '',
    userName: row[indices.USER_NAME - 1] ? row[indices.USER_NAME - 1].toString() : '',
    userEmail: row[indices.USER_EMAIL - 1] ? row[indices.USER_EMAIL - 1].toString() : '',
    assetCategory: row[indices.ASSET_CATEGORY - 1] ? row[indices.ASSET_CATEGORY - 1].toString() : '',
    assetStatus: row[indices.ASSET_STATUS - 1] ? row[indices.ASSET_STATUS - 1].toString() : '',
    isItAsset: row[indices.IS_IT_ASSET - 1] ? row[indices.IS_IT_ASSET - 1].toString() : '',
    isIsoScope: row[indices.IS_ISO_SCOPE - 1] ? row[indices.IS_ISO_SCOPE - 1].toString() : '',
    defaultGroup: row[indices.DEFAULT_GROUP - 1] ? row[indices.DEFAULT_GROUP - 1].toString() : '',
    sourceSheet: sourceSheet
  };
}

/**
 * 將資訊資產工作表列轉換為物件
 */
function mapRowToIsmsAssetObject_(row) {
  const indices = ISMS_ASSET_COLUMN_INDICES;
  return {
    ismsAssetId: row[indices.ISMS_ASSET_ID - 1] ? row[indices.ISMS_ASSET_ID - 1].toString() : '',
    category: row[indices.CATEGORY - 1] ? row[indices.CATEGORY - 1].toString() : '',
    name: row[indices.NAME - 1] ? row[indices.NAME - 1].toString() : '',
    description: row[indices.DESCRIPTION - 1] ? row[indices.DESCRIPTION - 1].toString() : '',
    quantity: row[indices.QUANTITY - 1] ? row[indices.QUANTITY - 1].toString() : '',
    location: row[indices.LOCATION - 1] ? row[indices.LOCATION - 1].toString() : '',
    responsibleUnit: row[indices.RESPONSIBLE_UNIT - 1] ? row[indices.RESPONSIBLE_UNIT - 1].toString() : '',
    mainCategory: row[indices.MAIN_CATEGORY - 1] ? row[indices.MAIN_CATEGORY - 1].toString() : '',
    subCategory: row[indices.SUB_CATEGORY - 1] ? row[indices.SUB_CATEGORY - 1].toString() : '',
    brand: row[indices.BRAND - 1] ? row[indices.BRAND - 1].toString() : '',
    model: row[indices.MODEL - 1] ? row[indices.MODEL - 1].toString() : '',
    version: row[indices.VERSION - 1] ? row[indices.VERSION - 1].toString() : '',
    status: row[indices.STATUS - 1] ? row[indices.STATUS - 1].toString() : '',
    centerCategory: row[indices.CENTER_CATEGORY - 1] ? row[indices.CENTER_CATEGORY - 1].toString() : '',
    confidentiality: row[indices.CONFIDENTIALITY - 1] ? row[indices.CONFIDENTIALITY - 1].toString() : '',
    integrity: row[indices.INTEGRITY - 1] ? row[indices.INTEGRITY - 1].toString() : '',
    availability: row[indices.AVAILABILITY - 1] ? row[indices.AVAILABILITY - 1].toString() : '',
    assetValue: row[indices.ASSET_VALUE - 1] ? row[indices.ASSET_VALUE - 1].toString() : '',
    group: row[indices.GROUP - 1] ? row[indices.GROUP - 1].toString() : '',
    serialNo: row[indices.SERIAL_NO - 1] ? row[indices.SERIAL_NO - 1].toString() : '',
    inventoryCount: row[indices.INVENTORY_COUNT - 1] ? row[indices.INVENTORY_COUNT - 1].toString() : ''
  };
}

// ==========================================
// 資產 API
// ==========================================

/**
 * 取得資產清單（含對照狀態）
 * @param {Object} options - 篩選選項
 * @returns {Object} 資產清單與統計
 */
function getAssetsWithMappingStatus(options = {}) {
  try {
    const ss = SpreadsheetApp.openById(CONFIG.ASSET_SPREADSHEET_ID);
    const assets = [];

    // 建立 Email -> 組別對照表
    const emailToGroupMap = getEmailToGroupMap_();

    // 讀取財產總表
    const propertySheet = ss.getSheetByName(CONFIG.PROPERTY_MASTER_SHEET_NAME);
    if (propertySheet) {
      const propertyData = propertySheet.getDataRange().getValues();
      for (let i = 1; i < propertyData.length; i++) {
        const asset = mapRowToAssetObject_(propertyData[i], PROPERTY_COLUMN_INDICES, '財產');
        if (asset.assetId && asset.assetStatus !== '已報廢') {
          // 使用雙層分組邏輯計算組別
          asset.group = getAssetGroup_(asset, emailToGroupMap);
          assets.push(asset);
        }
      }
    }

    // 讀取物品總表
    const itemSheet = ss.getSheetByName(CONFIG.ITEM_MASTER_SHEET_NAME);
    if (itemSheet) {
      const itemData = itemSheet.getDataRange().getValues();
      for (let i = 1; i < itemData.length; i++) {
        const asset = mapRowToAssetObject_(itemData[i], ITEM_COLUMN_INDICES, '物品');
        if (asset.assetId && asset.assetStatus !== '已報廢') {
          // 使用雙層分組邏輯計算組別
          asset.group = getAssetGroup_(asset, emailToGroupMap);
          assets.push(asset);
        }
      }
    }

    // 取得對照表
    const mappingMap = getMappingMap_();

    // 合併對照狀態
    const result = assets.map(asset => {
      const mapping = mappingMap.get(asset.assetId);
      return {
        ...asset,
        isMapped: !!mapping,
        mappedIsmsAssetId: mapping ? mapping.ismsAssetId : '',
        mappingRemarks: mapping ? mapping.remarks : ''
      };
    });

    // 篩選
    let filtered = result;

    if (options.unmappedOnly) {
      filtered = filtered.filter(a => !a.isMapped);
    }

    if (options.searchKeyword) {
      const keyword = options.searchKeyword.toLowerCase();
      filtered = filtered.filter(a =>
        a.assetId.toLowerCase().includes(keyword) ||
        a.assetName.toLowerCase().includes(keyword) ||
        a.leaderName.toLowerCase().includes(keyword) ||
        a.location.toLowerCase().includes(keyword)
      );
    }

    if (options.filterGroup) {
      filtered = filtered.filter(a => a.group === options.filterGroup);
    }

    // 統計
    const totalCount = result.length;
    const mappedCount = result.filter(a => a.isMapped).length;
    const unmappedCount = totalCount - mappedCount;
    const mappingRate = totalCount > 0 ? Math.round((mappedCount / totalCount) * 100) : 0;

    return {
      success: true,
      assets: filtered,
      statistics: {
        totalCount,
        mappedCount,
        unmappedCount,
        mappingRate
      }
    };
  } catch (e) {
    console.error('getAssetsWithMappingStatus 錯誤:', e);
    return { success: false, error: e.message };
  }
}

/**
 * 取得所有組別清單
 */
function getGroupList() {
  try {
    const result = getAssetsWithMappingStatus();
    if (!result.success) return { success: false, error: result.error };

    // 使用計算後的 group 欄位（而非 defaultGroup）
    const groups = [...new Set(result.assets.map(a => a.group).filter(g => g))];
    groups.sort();

    return { success: true, groups };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

// ==========================================
// 資訊資產 API
// ==========================================

/**
 * 取得資訊資產清單
 * @param {Object} options - 篩選選項
 * @returns {Object} 資訊資產清單
 */
function getIsmsAssets(options = {}) {
  try {
    const ss = SpreadsheetApp.openById(CONFIG.ISMS_SPREADSHEET_ID);
    const sheet = ss.getSheetByName(CONFIG.ISMS_ASSET_SHEET_NAME);

    if (!sheet) {
      return { success: false, error: '找不到資訊資產工作表' };
    }

    const data = sheet.getDataRange().getValues();
    const assets = [];

    for (let i = 1; i < data.length; i++) {
      const asset = mapRowToIsmsAssetObject_(data[i]);
      if (asset.ismsAssetId) {
        assets.push(asset);
      }
    }

    // 篩選
    let filtered = assets;

    if (options.searchKeyword) {
      const keyword = options.searchKeyword.toLowerCase();
      filtered = filtered.filter(a =>
        a.ismsAssetId.toLowerCase().includes(keyword) ||
        a.name.toLowerCase().includes(keyword) ||
        a.category.toLowerCase().includes(keyword) ||
        a.responsibleUnit.toLowerCase().includes(keyword)
      );
    }

    return {
      success: true,
      assets: filtered
    };
  } catch (e) {
    console.error('getIsmsAssets 錯誤:', e);
    return { success: false, error: e.message };
  }
}

// ==========================================
// 對照管理 API
// ==========================================

/**
 * 檢查資產是否已有對照
 * @param {string[]} assetIds - 資產編號陣列
 * @returns {Object} 已有對照的資產資訊
 */
function checkExistingMappings(assetIds) {
  try {
    const mappingMap = getMappingMap_();
    const existingMappings = [];

    for (const assetId of assetIds) {
      const mapping = mappingMap.get(assetId);
      if (mapping && mapping.ismsAssetId) {
        existingMappings.push({
          assetId: assetId,
          currentIsmsAssetId: mapping.ismsAssetId
        });
      }
    }

    return {
      success: true,
      hasExisting: existingMappings.length > 0,
      existingMappings: existingMappings
    };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

/**
 * 建立多對一對照
 * @param {string[]} assetIds - 資產編號陣列
 * @param {string} ismsAssetId - 資訊資產編號
 * @param {string} remarks - 備註
 * @returns {Object} 操作結果
 */
function createMappings(assetIds, ismsAssetId, remarks = '') {
  try {
    const email = Session.getActiveUser().getEmail();
    const timestamp = new Date().toISOString();

    const ss = SpreadsheetApp.openById(CONFIG.ISMS_SPREADSHEET_ID);
    let sheet = ss.getSheetByName(CONFIG.MAPPING_SHEET_NAME);

    // 若工作表不存在則建立
    if (!sheet) {
      sheet = ss.insertSheet(CONFIG.MAPPING_SHEET_NAME);
      sheet.appendRow(['資產編號', '資訊資產編號', '建立時間', '建立人', '備註']);
    }

    const mappingMap = getMappingMap_();
    let createdCount = 0;
    let updatedCount = 0;

    for (const assetId of assetIds) {
      const existing = mappingMap.get(assetId);

      if (existing && existing.rowIndex) {
        // 更新既有對照
        const rowIndex = existing.rowIndex;
        sheet.getRange(rowIndex, MAPPING_COLUMN_INDICES.ISMS_ASSET_ID).setValue(ismsAssetId);
        sheet.getRange(rowIndex, MAPPING_COLUMN_INDICES.CREATED_TIME).setValue(timestamp);
        sheet.getRange(rowIndex, MAPPING_COLUMN_INDICES.CREATED_BY).setValue(email);
        sheet.getRange(rowIndex, MAPPING_COLUMN_INDICES.REMARKS).setValue(remarks);
        updatedCount++;
      } else {
        // 新增對照
        sheet.appendRow([assetId, ismsAssetId, timestamp, email, remarks]);
        createdCount++;
      }
    }

    return {
      success: true,
      message: `成功建立 ${createdCount} 筆、更新 ${updatedCount} 筆對照`,
      createdCount,
      updatedCount
    };
  } catch (e) {
    console.error('createMappings 錯誤:', e);
    return { success: false, error: e.message };
  }
}

/**
 * 更新單筆對照
 * @param {string} assetId - 資產編號
 * @param {string} newIsmsAssetId - 新的資訊資產編號
 * @returns {Object} 操作結果
 */
function updateMapping(assetId, newIsmsAssetId) {
  try {
    const mappingMap = getMappingMap_();
    const existing = mappingMap.get(assetId);

    if (!existing || !existing.rowIndex) {
      return { success: false, error: '找不到該資產的對照記錄' };
    }

    const ss = SpreadsheetApp.openById(CONFIG.ISMS_SPREADSHEET_ID);
    const sheet = ss.getSheetByName(CONFIG.MAPPING_SHEET_NAME);
    const email = Session.getActiveUser().getEmail();
    const timestamp = new Date().toISOString();

    sheet.getRange(existing.rowIndex, MAPPING_COLUMN_INDICES.ISMS_ASSET_ID).setValue(newIsmsAssetId);
    sheet.getRange(existing.rowIndex, MAPPING_COLUMN_INDICES.CREATED_TIME).setValue(timestamp);
    sheet.getRange(existing.rowIndex, MAPPING_COLUMN_INDICES.CREATED_BY).setValue(email);

    return { success: true, message: '對照更新成功' };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

/**
 * 刪除對照
 * @param {string[]} assetIds - 資產編號陣列
 * @returns {Object} 操作結果
 */
function deleteMappings(assetIds) {
  try {
    const ss = SpreadsheetApp.openById(CONFIG.ISMS_SPREADSHEET_ID);
    const sheet = ss.getSheetByName(CONFIG.MAPPING_SHEET_NAME);

    if (!sheet) {
      return { success: false, error: '對照表工作表不存在' };
    }

    const mappingMap = getMappingMap_();
    const rowsToDelete = [];

    for (const assetId of assetIds) {
      const mapping = mappingMap.get(assetId);
      if (mapping && mapping.rowIndex) {
        rowsToDelete.push(mapping.rowIndex);
      }
    }

    // 由下往上刪除以避免索引錯位
    rowsToDelete.sort((a, b) => b - a);
    for (const rowIndex of rowsToDelete) {
      sheet.deleteRow(rowIndex);
    }

    return {
      success: true,
      message: `成功刪除 ${rowsToDelete.length} 筆對照`,
      deletedCount: rowsToDelete.length
    };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

// ==========================================
// 報表 API
// ==========================================

/**
 * 取得對照統計資料
 */
function getMappingStatistics() {
  try {
    const result = getAssetsWithMappingStatus();
    if (!result.success) return result;

    // 依組別統計（使用計算後的 group 欄位）
    const groupStats = {};
    for (const asset of result.assets) {
      const group = asset.group || '未分組';
      if (!groupStats[group]) {
        groupStats[group] = { total: 0, mapped: 0 };
      }
      groupStats[group].total++;
      if (asset.isMapped) {
        groupStats[group].mapped++;
      }
    }

    // 轉換為陣列
    const groupStatsArray = Object.entries(groupStats).map(([group, stats]) => ({
      group,
      total: stats.total,
      mapped: stats.mapped,
      unmapped: stats.total - stats.mapped,
      rate: stats.total > 0 ? Math.round((stats.mapped / stats.total) * 100) : 0
    }));

    groupStatsArray.sort((a, b) => a.group.localeCompare(b.group, 'zh-TW'));

    return {
      success: true,
      overall: result.statistics,
      byGroup: groupStatsArray
    };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

/**
 * 查詢某資訊資產下的所有資產
 * @param {string} ismsAssetId - 資訊資產編號
 */
function getAssetsByIsmsAsset(ismsAssetId) {
  try {
    const result = getAssetsWithMappingStatus();
    if (!result.success) return result;

    const assets = result.assets.filter(a => a.mappedIsmsAssetId === ismsAssetId);

    return {
      success: true,
      ismsAssetId,
      assets,
      count: assets.length
    };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

/**
 * 匯出對照報表（CSV 格式）
 */
function exportMappingReport() {
  try {
    const result = getAssetsWithMappingStatus();
    if (!result.success) return result;

    const ismsResult = getIsmsAssets();
    const ismsMap = {};
    if (ismsResult.success) {
      for (const isms of ismsResult.assets) {
        ismsMap[isms.ismsAssetId] = isms;
      }
    }

    // 建立 CSV 內容
    const headers = ['資產編號', '資產名稱', '資產類別', '保管人', '地點', '組別', '對照狀態', '資訊資產編號', '資訊資產名稱', '資訊資產類別'];
    const rows = result.assets.map(asset => {
      const isms = ismsMap[asset.mappedIsmsAssetId] || {};
      return [
        asset.assetId,
        asset.assetName,
        asset.assetCategory,
        asset.leaderName,
        asset.location,
        asset.group,
        asset.isMapped ? '已對照' : '未對照',
        asset.mappedIsmsAssetId || '',
        isms.name || '',
        isms.category || ''
      ];
    });

    // 組合 CSV
    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${(cell || '').replace(/"/g, '""')}"`).join(','))
      .join('\n');

    return {
      success: true,
      csvContent,
      filename: `資產對照報表_${new Date().toISOString().slice(0, 10)}.csv`
    };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

/**
 * 初始化對照表工作表
 */
function initMappingSheet() {
  try {
    const ss = SpreadsheetApp.openById(CONFIG.ISMS_SPREADSHEET_ID);
    let sheet = ss.getSheetByName(CONFIG.MAPPING_SHEET_NAME);

    if (sheet) {
      return { success: true, message: '對照表工作表已存在' };
    }

    sheet = ss.insertSheet(CONFIG.MAPPING_SHEET_NAME);
    sheet.appendRow(['資產編號', '資訊資產編號', '建立時間', '建立人', '備註']);

    // 設定欄寬
    sheet.setColumnWidth(1, 150);
    sheet.setColumnWidth(2, 150);
    sheet.setColumnWidth(3, 180);
    sheet.setColumnWidth(4, 200);
    sheet.setColumnWidth(5, 200);

    // 凍結標題列
    sheet.setFrozenRows(1);

    return { success: true, message: '對照表工作表建立成功' };
  } catch (e) {
    return { success: false, error: e.message };
  }
}
