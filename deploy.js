// =================================================================
// --- 手動部署：工作表與表頭初始化 ---
// =================================================================

const PROPERTY_MASTER_HEADERS = [
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
  '財產類別',
  '保管人Email',
  '使用人Email',
  '財產狀態',
  '申請時間',
  '接收時間',
  '是否上傳',
  '上傳時間',
  '是否為駐站電腦',
  '報廢日期',
  '報廢原因',
  '報廢申請文件',
  '是否為資訊資產',
  '是否為電腦',
  '是否在ISO驗證範圍內',
  '是否連網',
  '是否可存取資訊',
  '是否為大陸產品',
  '備註',
  '預設組別'
];

const ITEM_MASTER_HEADERS = [
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
  '',
  '保管地點',
  '保管人Email',
  '財產狀態',
  '申請時間',
  '接收時間',
  '是否上傳',
  '上傳時間',
  '是否為駐站電腦',
  '報廢日期',
  '報廢原因',
  '報廢申請文件',
  '是否為資訊資產',
  '是否為電腦',
  '是否在ISO驗證範圍內',
  '是否連網',
  '是否可存取資訊',
  '是否為大陸產品',
  '備註',
  '預設組別'
];

const APPLICATION_LOG_HEADERS = [
  '申請ID',
  '申請時間',
  '財產編號',
  '原保管人',
  '原地點',
  '新保管人',
  '新地點',
  '狀態',
  '新保管人Email',
  '審核時間',
  '審核連結',
  '原使用人',
  '新使用人',
  '新使用人Email',
  '轉移類型',
  '審核者Email',
  '申請操作人員Email',
  '轉移文件連結'
];

const LENDING_LOG_HEADERS = [
  '出借ID',
  '出借日期',
  '財產編號',
  '出借人Email',
  '借用人',
  '預計歸還日期',
  '實際歸還日期',
  '借用事由',
  '狀態',
  '借出後地點',
  '借用類型',
  '聯絡電話',
  '文件連結',
  '列印時間'
];

const SCRAP_LOG_HEADERS = [
  '報廢ID',
  '申請日期',
  '財產編號',
  '申請人Email',
  '保管人',
  '使用人',
  '地點',
  '財產類別',
  '財產名稱',
  '型號/廠牌',
  '報廢原因',
  '狀態',
  '更新時間',
  '審核者Email',
  '文件連結',
  '列印時間'
];

const ADMIN_LIST_HEADERS = [
  '管理員Email',
  '電腦回報管理員Email',
  '管理員通知開關'
];

const KEEPER_EMAIL_MAP_HEADERS = [
  '姓名',
  'Email',
  '是否為駐管',
  '資訊組駐站資產保管人',
  '資訊組駐站資產使用人',
  '駐站轉中心收案組保管＆使用人',
  '組別'
];

const KEEPER_LOCATION_MAP_HEADERS = [
  '地點名稱',
  '是否為駐站',
  '駐站轉資訊組',
  '駐站轉中心收案',
  '資訊組電腦專用'
];

const SOFTWARE_VERSIONS_HEADERS = ['7-Zip 版本'];

const RESPONSE_SHEET_HEADERS = [
  '時間戳記',
  '駐站',
  '電腦',
  '備註',
  'Windows 更新',
  'Chrome 更新',
  '防毒更新',
  '7-Zip 版本'
];

const INVENTORY_LOG_HEADERS = [
  '盤點ID',
  '盤點日期',
  '盤點人',
  '盤點人Email',
  '盤點範圍',
  '已盤點數量',
  '總數量',
  '狀態',
  '完成時間'
];

const INVENTORY_DETAIL_HEADERS = [
  '盤點ID',
  '財產編號',
  '財產名稱',
  '保管人',
  '使用人',
  '地點',
  '原狀態',
  '盤點結果',
  '備註',
  '盤點時間',
  '盤點人',
  '指派人員'
];

/**
 * 手動部署：建立所有必要工作表與表頭
 */
function deployAllSheets() {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const results = [];
    const definitions = getDeploySheetDefinitions_();

    definitions.forEach(definition => {
      results.push(ensureSheetWithHeaders_(ss, definition));
    });

    const inventoryResults = ensureInventorySheets_(ss);
    inventoryResults.forEach(result => results.push(result));

    const summary = buildDeploySummary_(results);
    Logger.log(summary);
    return summary;
  } catch (e) {
    Logger.log(`deployAllSheets 失敗: ${e.message}`);
    throw e;
  } finally {
    lock.releaseLock();
  }
}

function getDeploySheetDefinitions_() {
  return [
    { sheetName: PROPERTY_MASTER_SHEET_NAME, headers: PROPERTY_MASTER_HEADERS, styleHeaders: true },
    { sheetName: ITEM_MASTER_SHEET_NAME, headers: ITEM_MASTER_HEADERS, styleHeaders: true },
    { sheetName: RESPONSE_SHEET_NAME, headers: RESPONSE_SHEET_HEADERS, styleHeaders: true },
    { sheetName: SOFTWARE_VERSIONS_SHEET_NAME, headers: SOFTWARE_VERSIONS_HEADERS, styleHeaders: true },
    { sheetName: APPLICATION_LOG_SHEET_NAME, headers: APPLICATION_LOG_HEADERS, styleHeaders: true },
    { sheetName: LENDING_LOG_SHEET_NAME, headers: LENDING_LOG_HEADERS, styleHeaders: true },
    { sheetName: SCRAP_LOG_SHEET_NAME, headers: SCRAP_LOG_HEADERS, styleHeaders: true },
    { sheetName: ADMIN_LIST_SHEET_NAME, headers: ADMIN_LIST_HEADERS, styleHeaders: true },
    { sheetName: KEEPER_EMAIL_MAP_SHEET_NAME, headers: KEEPER_EMAIL_MAP_HEADERS, styleHeaders: true },
    { sheetName: KEEPER_LOCATION_MAP_SHEET_NAME, headers: KEEPER_LOCATION_MAP_HEADERS, styleHeaders: true }
  ];
}

function ensureSheetWithHeaders_(ss, definition) {
  const sheetName = definition.sheetName;
  const headers = definition.headers;
  const styleHeaders = Boolean(definition.styleHeaders);
  let sheet = ss.getSheetByName(sheetName);
  let created = false;

  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    created = true;
  }

  const targetColumnCount = Math.max(headers.length, sheet.getLastColumn(), 1);
  const headerRange = sheet.getRange(1, 1, 1, targetColumnCount);
  const currentRow = headerRange.getValues()[0];
  const normalized = currentRow.map(value => String(value || '').trim());
  const hasAnyHeader = normalized.some(value => value);
  let updated = false;

  if (!hasAnyHeader) {
    const values = headers.concat(Array(targetColumnCount - headers.length).fill(''));
    headerRange.setValues([values]);
    updated = true;
  } else {
    const nextRow = currentRow.slice();
    headers.forEach((header, index) => {
      if (!String(currentRow[index] || '').trim()) {
        nextRow[index] = header;
        updated = true;
      }
    });
    if (updated) {
      headerRange.setValues([nextRow]);
    }
  }

  if (styleHeaders && (created || !hasAnyHeader)) {
    applyHeaderStyle_(sheet, headers.length);
  }

  return { sheetName: sheetName, created: created, updated: updated };
}

function ensureInventorySheets_(ss) {
  const results = [];
  results.push(ensureSheetWithHeaders_(ss, {
    sheetName: INVENTORY_LOG_SHEET_NAME,
    headers: INVENTORY_LOG_HEADERS,
    styleHeaders: true
  }));

  let detailSheet = ss.getSheetByName(INVENTORY_DETAIL_SHEET_NAME);
  let created = false;
  let updated = false;

  if (!detailSheet) {
    detailSheet = ss.insertSheet(INVENTORY_DETAIL_SHEET_NAME);
    created = true;
  }

  const initialColumnCount = Math.max(detailSheet.getLastColumn(), INVENTORY_DETAIL_HEADERS.length, 1);
  let headerRange = detailSheet.getRange(1, 1, 1, initialColumnCount);
  let currentRow = headerRange.getValues()[0];
  let normalized = currentRow.map(value => String(value || '').trim());
  const hasAnyHeader = normalized.some(value => value);

  if (!hasAnyHeader) {
    const values = INVENTORY_DETAIL_HEADERS.concat(
      Array(initialColumnCount - INVENTORY_DETAIL_HEADERS.length).fill('')
    );
    headerRange.setValues([values]);
    updated = true;
  } else {
    if (!normalized.includes('使用人')) {
      detailSheet.insertColumnAfter(4);
      updated = true;
    }

    const targetColumnCount = Math.max(detailSheet.getLastColumn(), INVENTORY_DETAIL_HEADERS.length, 1);
    headerRange = detailSheet.getRange(1, 1, 1, targetColumnCount);
    currentRow = headerRange.getValues()[0];
    normalized = currentRow.map(value => String(value || '').trim());

    const nextRow = currentRow.slice();
    INVENTORY_DETAIL_HEADERS.forEach((header, index) => {
      if (!normalized[index]) {
        nextRow[index] = header;
        updated = true;
      }
    });
    if (updated) {
      headerRange.setValues([nextRow]);
    }
  }

  if (created || !hasAnyHeader) {
    applyHeaderStyle_(detailSheet, INVENTORY_DETAIL_HEADERS.length);
  }

  results.push({ sheetName: INVENTORY_DETAIL_SHEET_NAME, created: created, updated: updated });
  return results;
}

function applyHeaderStyle_(sheet, headerLength) {
  if (headerLength <= 0) return;
  sheet.getRange(1, 1, 1, headerLength)
    .setFontWeight('bold')
    .setBackground('#4285f4')
    .setFontColor('#ffffff');
}

function buildDeploySummary_(results) {
  const createdSheets = results
    .filter(result => result.created)
    .map(result => result.sheetName);
  const updatedSheets = results
    .filter(result => result.updated && !result.created)
    .map(result => result.sheetName);

  let message = '部署完成';
  if (createdSheets.length > 0) {
    message += `，新增工作表：${createdSheets.join(', ')}`;
  }
  if (updatedSheets.length > 0) {
    message += `，更新表頭：${updatedSheets.join(', ')}`;
  }
  if (createdSheets.length === 0 && updatedSheets.length === 0) {
    message += '（無需更新）';
  }
  return message;
}
