// =================================================================
// iso_scope.js — ISO 驗證範圍判定與掃描
// 設計文件:docs/superpowers/specs/2026-07-27-iso-scope-automation-design.md
// 結構:①純函式(可本地 node 測試) ②讀取層 ③端點
// =================================================================

// -----------------------------------------------------------------
// ① 純函式(不碰任何 GAS API,可用 node 直接測試)
// -----------------------------------------------------------------

/**
 * 認證旗標判定。沿用 station_status/code.js:957 的寬鬆比對,兩邊語意必須一致。
 * @param {*} value 組織架構樹 I 欄的值
 * @returns {boolean}
 */
function isCertifiedFlagValue_(value) {
  const normalized = String(value || '').trim().toUpperCase();
  return normalized === 'V' || normalized === '認證駐站';
}

/**
 * 台級 ISO 範圍判定(spec §3.1)。
 * @param {Object} ctx { stationMap, certifiedProcesses, exceptions }
 * @param {Object} asset 實體資產,需有 assetId 與 location
 * @param {?Object} ismsAsset 對照到的資訊資產,可為 null;有值時讀 businessProcess
 * @returns {{status: string, basis: string}}
 */
function judgeAssetIsoScope_(ctx, asset, ismsAsset) {
  // 1. 例外優先於一切
  const exception = ctx.exceptions[asset.assetId];
  if (exception) {
    return { status: exception.forced, basis: '人工例外' };
  }

  // 2. 地點反查駐站
  const location = String(asset.location || '').trim();
  const station = ctx.stationMap[location];
  if (station) {
    return station.certified
      ? { status: ISO_JUDGEMENT.IN, basis: '認證駐站:' + station.name }
      : { status: ISO_JUDGEMENT.OUT, basis: '非認證駐站:' + station.name };
  }

  // 3. 非駐站:看資訊資產的業務流程
  const process = ismsAsset ? String(ismsAsset.businessProcess || '').trim() : '';
  if (!process) {
    return { status: ISO_JUDGEMENT.PENDING, basis: '業務流程未填' };
  }
  return ctx.certifiedProcesses[process]
    ? { status: ISO_JUDGEMENT.IN, basis: '業務流程:' + process }
    : { status: ISO_JUDGEMENT.OUT, basis: '業務流程:' + process };
}

/**
 * 聚合台級判定到資訊資產層級(spec §3.3)。有任一台待判定即整筆待判定。
 * @param {Array<{status: string}>} judgements
 * @returns {{state: string, inCount: number, total: number}}
 */
function aggregateIsmsScope_(judgements) {
  const total = judgements.length;
  let inCount = 0;
  let hasPending = false;
  for (let i = 0; i < total; i++) {
    if (judgements[i].status === ISO_JUDGEMENT.IN) inCount++;
    else if (judgements[i].status === ISO_JUDGEMENT.PENDING) hasPending = true;
  }
  if (hasPending) return { state: ISO_AGGREGATE.PENDING, inCount: inCount, total: total };
  if (total > 0 && inCount === total) return { state: ISO_AGGREGATE.ALL, inCount: inCount, total: total };
  if (inCount > 0) return { state: ISO_AGGREGATE.PARTIAL, inCount: inCount, total: total };
  return { state: ISO_AGGREGATE.NONE, inCount: 0, total: total };
}

// -----------------------------------------------------------------
// ② 讀取層
// -----------------------------------------------------------------

const ISO_STATION_CACHE_KEY = 'iso_certified_station_map_v1';
const ISO_STATION_CACHE_SECONDS = 600; // 與 HR 組別快取同為 10 分鐘

/**
 * 讀 HR 組織架構樹,建立「地點慣用名 → 駐站資訊」對照(spec §3.2)。
 *
 * key 必須是慣用名而非 HR 原名:資產地點欄存的是主專案
 * hr_directory.js:300 經 HR_GROUP_NAME_MAP 轉換後的字串。
 *
 * ⚠️ fail-closed(spec §8.1):HR 讀不到就 throw,絕不回空物件。
 * 回空物件會讓全部駐站資產被判成「不在範圍」且無聲無息。
 *
 * @returns {Object<string, {code: string, name: string, certified: boolean}>}
 */
function getCertifiedStationMap_() {
  const cache = CacheService.getScriptCache();
  const cached = cache.get(ISO_STATION_CACHE_KEY);
  if (cached) {
    try { return JSON.parse(cached); } catch (_) { /* 快取毀損,重讀 */ }
  }

  const hrSs = SpreadsheetApp.openById(getHrSpreadsheetId_());
  const orgSheet = hrSs.getSheetByName(CONFIG.HR_ORG_TREE_SHEET_NAME);
  if (!orgSheet || orgSheet.getLastRow() <= 1) {
    throw new Error(`HR「${CONFIG.HR_ORG_TREE_SHEET_NAME}」讀取失敗或無資料,無法判定認證駐站。`);
  }

  const idx = HR_ORG_TREE_COLUMN_INDICES;
  const numCols = Math.max(idx.CERTIFIED_FLAG, idx.NAME, idx.CODE);
  if (orgSheet.getMaxColumns() < numCols) {
    throw new Error(`HR「${CONFIG.HR_ORG_TREE_SHEET_NAME}」欄數不足 ${numCols},讀不到認證旗標欄。`);
  }

  const groupNameMap = getHrGroupNameMap_();
  const rows = orgSheet.getRange(2, 1, orgSheet.getLastRow() - 1, numCols).getValues();
  const map = {};

  rows.forEach(row => {
    const code = String(row[idx.CODE - 1] || '').trim();
    if (code.toUpperCase().indexOf(STATION_CODE_PREFIX) !== 0) return;
    const hrName = String(row[idx.NAME - 1] || '').trim();
    if (!hrName) return;
    const displayName = groupNameMap[hrName] || hrName;
    map[displayName] = {
      code: code,
      name: displayName,
      certified: isCertifiedFlagValue_(row[idx.CERTIFIED_FLAG - 1])
    };
  });

  try {
    cache.put(ISO_STATION_CACHE_KEY, JSON.stringify(map), ISO_STATION_CACHE_SECONDS);
  } catch (_) { /* 快取寫入失敗不影響功能 */ }
  return map;
}

/**
 * 清除認證駐站快取(改完 HR 組織架構樹 I 欄後執行,否則要等 10 分鐘)。
 * 僅限管理員。
 */
function clearIsoScopeCache() {
  const access = assertWriteAccess_(true);
  if (!access.ok) return { success: false, error: access.error };
  CacheService.getScriptCache().remove(ISO_STATION_CACHE_KEY);
  return { success: true, message: '認證駐站快取已清除' };
}

// -----------------------------------------------------------------
// ③ 工作表維運
// -----------------------------------------------------------------

/**
 * 確保「ISO範圍例外」工作表存在,不存在則建立並寫表頭。
 * @returns {Sheet}
 */
function ensureIsoExceptionSheet_() {
  const ss = SpreadsheetApp.openById(CONFIG.ISMS_SPREADSHEET_ID);
  let sheet = ss.getSheetByName(CONFIG.ISO_EXCEPTION_SHEET_NAME);
  if (sheet) return sheet;

  sheet = ss.insertSheet(CONFIG.ISO_EXCEPTION_SHEET_NAME);
  sheet.appendRow(['資產編號', '強制值', '理由', '操作者', '時間']);
  sheet.setColumnWidth(1, 150);
  sheet.setColumnWidth(2, 100);
  sheet.setColumnWidth(3, 300);
  sheet.setColumnWidth(4, 200);
  sheet.setColumnWidth(5, 180);
  sheet.setFrozenRows(1);
  return sheet;
}
