// ==========================================
// business_process.js — 批次指定資訊資產的業務流程(V 欄)
//
// 分兩段:①純函式(不碰任何 GAS API,可用 node test/business_process.test.cjs 測)
//         ②端點
// 比照 iso_scope.js 的切法;code.js 已逾 1300 行,不再往裡塞。
// ==========================================

// ------------------------------------------
// ① 純函式
// ------------------------------------------

/**
 * 業務流程值域檢查。空字串代表「清除」,一律合法;其餘必須在允許清單內。
 * 不接受自由輸入——值域的唯一真相是「下拉選單」工作表。
 * @param {*} value
 * @param {Array<string>} allowedDisplays getDropdownOptions().businessProcesses 的 display
 * @returns {boolean}
 */
function isAllowedBusinessProcess_(value, allowedDisplays) {
  const v = String(value == null ? '' : value).trim();
  if (v === '') return true;
  return (allowedDisplays || []).indexOf(v) !== -1;
}

/**
 * 由資訊資產清單全表算出變更計畫。只計算,不寫入。
 * @param {Array<Array>} rows 含表頭的整表(getDataRange().getValues())
 * @param {Array<string>} targetIds 目標資訊資產編號
 * @param {string} newValue 新值;'' 代表清除
 * @returns {{updates: Array<{ismsAssetId:string, rowIndex:number, before:string, after:string}>,
 *            noChange: Array<string>,
 *            skipped: Array<{ismsAssetId:string, reason:string}>}}
 */
function buildBusinessProcessPlan_(rows, targetIds, newValue) {
  const idx = ISMS_ASSET_COLUMN_INDICES;
  const after = String(newValue == null ? '' : newValue).trim();

  // 編號(小寫) -> { ismsAssetId, rowIndex, before }
  const found = {};
  for (let r = 1; r < rows.length; r++) {
    const id = String(rows[r][idx.ISMS_ASSET_ID - 1] || '').trim();
    if (!id) continue;
    found[id.toLowerCase()] = {
      ismsAssetId: id,
      rowIndex: r + 1,
      before: String(rows[r][idx.BUSINESS_PROCESS - 1] || '').trim()
    };
  }

  const updates = [];
  const noChange = [];
  const skipped = [];
  const seen = {};

  (targetIds || []).forEach(raw => {
    const trimmed = String(raw == null ? '' : raw).trim();
    if (!trimmed) return;
    const key = trimmed.toLowerCase();
    if (seen[key]) return;   // 去重:同一筆被算兩次會寫兩列 log
    seen[key] = true;

    const hit = found[key];
    if (!hit) {
      skipped.push({ ismsAssetId: trimmed, reason: '找不到此資訊資產' });
      return;
    }
    if (hit.before === after) {
      noChange.push(hit.ismsAssetId);
      return;
    }
    updates.push({
      ismsAssetId: hit.ismsAssetId,
      rowIndex: hit.rowIndex,
      before: hit.before,
      after: after
    });
  });

  return { updates: updates, noChange: noChange, skipped: skipped };
}

/**
 * 目標資訊資產底下**所有**已對照實體資產的總數(含未勾選者)。
 * 這是 TOCTOU 比對的基準數字,定義必須與前端 resolveBusinessProcessTargets()
 * 的 affectedCount 完全一致,否則每次套用都會誤判成「資料已變動」。
 * @param {Array<Array>} mappingRows 對照表整表(含表頭)
 * @param {Array<string>} targetIds
 * @returns {number}
 */
function countAffectedAssets_(mappingRows, targetIds) {
  const idx = MAPPING_COLUMN_INDICES;
  const wanted = {};
  (targetIds || []).forEach(id => {
    const k = String(id == null ? '' : id).trim().toLowerCase();
    if (k) wanted[k] = true;
  });

  let count = 0;
  for (let r = 1; r < mappingRows.length; r++) {
    const assetId = String(mappingRows[r][idx.ASSET_ID - 1] || '').trim();
    const ismsId = String(mappingRows[r][idx.ISMS_ASSET_ID - 1] || '').trim().toLowerCase();
    if (assetId && ismsId && wanted[ismsId]) count++;
  }
  return count;
}
