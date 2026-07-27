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
