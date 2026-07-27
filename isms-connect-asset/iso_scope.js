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

/**
 * 把未對照的實體資產按歸併鍵分組,產出補號預告(spec §6.2)。
 *
 * 歸併鍵 = 地點 + 資產名稱 + 財產類別 + 歸屬組別。組別入鍵讓 S 欄在每組內
 * 必然唯一,因此 S 與 G 永遠一對一;駐站與非駐站適用同一條規則,沒有特例。
 *
 * ⚠️ 廠牌型號欄不可入鍵——該欄混有序號,每台唯一,會讓歸併靜默退化成一台一筆。
 *
 * @param {Array<Object>} assets 未對照資產,需有 assetId/assetName/assetCategory/location/group
 * @param {{byDisplay: Object, byCode: Object}} groupCodeMap
 * @returns {{groups: Array<Object>, skipped: Array<Object>}}
 */
function buildAutoCreateGroups_(assets, groupCodeMap) {
  const buckets = {};

  assets.forEach(asset => {
    const location = String(asset.location || '').trim();
    const assetName = String(asset.assetName || '').trim();
    const category = String(asset.assetCategory || '').trim();
    const groupName = String(asset.group || '').trim();
    const key = [location, assetName, category, groupName].join('|');

    if (!buckets[key]) {
      buckets[key] = {
        key: key,
        location: location,
        assetName: assetName,
        category: category,
        groupName: groupName,
        groupCode: groupCodeMap.byDisplay[groupName] || '',
        assetIds: []
      };
    }
    buckets[key].assetIds.push(asset.assetId);
  });

  const groups = [];
  const skipped = [];
  Object.keys(buckets).forEach(key => {
    const bucket = buckets[key];
    if (bucket.groupName === ISO_UNASSIGNED_GROUP_NAME) {
      bucket.reason = '組別解析失敗(未分組)';
      skipped.push(bucket);
      return;
    }
    if (!bucket.groupCode) {
      bucket.reason = `組別「${bucket.groupName}」查不到代號`;
      skipped.push(bucket);
      return;
    }
    if (!bucket.assetName) {
      bucket.reason = '資產名稱為空,無法命名資訊資產';
      skipped.push(bucket);
      return;
    }
    groups.push(bucket);
  });

  return { groups: groups, skipped: skipped };
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

/**
 * 認證業務流程集合(下拉選單 key=業務流程 且 E 欄為 V)。
 * @returns {Object<string, boolean>}
 */
function getCertifiedProcessSet_() {
  const options = getDropdownOptions();
  if (!options.success) {
    throw new Error('讀取下拉選單失敗,無法取得認證業務流程:' + options.error);
  }
  const set = {};
  (options.businessProcesses || []).forEach(item => {
    if (item.isCertified) set[item.display] = true;
  });
  return set;
}

/**
 * 組別中文名 ↔ 代號雙向對照(補號時 S/G 欄互推用)。
 * @returns {{byDisplay: Object<string,string>, byCode: Object<string,string>}}
 */
function getGroupCodeMap_() {
  const options = getDropdownOptions();
  if (!options.success) {
    throw new Error('讀取下拉選單失敗,無法取得組別對照:' + options.error);
  }
  const byDisplay = {};
  const byCode = {};
  (options.groups || []).forEach(item => {
    if (!item.display || !item.code) return;
    byDisplay[item.display] = item.code;
    byCode[item.code] = item.display;
  });
  return { byDisplay: byDisplay, byCode: byCode };
}

/**
 * 讀「ISO範圍例外」工作表(spec §4.2)。工作表不存在時回空物件——
 * 例外是選用機制,沒有例外表不該讓判定失敗(與認證駐站的 fail-closed 不同)。
 * @returns {Object<string, {forced: string, reason: string}>}
 */
function getIsoExceptionMap_() {
  const ss = SpreadsheetApp.openById(CONFIG.ISMS_SPREADSHEET_ID);
  const sheet = ss.getSheetByName(CONFIG.ISO_EXCEPTION_SHEET_NAME);
  const map = {};
  if (!sheet || sheet.getLastRow() <= 1) return map;

  const idx = ISO_EXCEPTION_COLUMN_INDICES;
  const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, idx.TIMESTAMP).getValues();
  rows.forEach(row => {
    const assetId = String(row[idx.ASSET_ID - 1] || '').trim();
    const forcedRaw = String(row[idx.FORCED_VALUE - 1] || '').trim();
    if (!assetId || !forcedRaw) return;
    const forced = forcedRaw === '在範圍' ? ISO_JUDGEMENT.IN
                 : forcedRaw === '不在範圍' ? ISO_JUDGEMENT.OUT
                 : null;
    if (!forced) {
      console.error(`ISO範圍例外:資產 ${assetId} 的強制值「${forcedRaw}」無法識別,已略過。`);
      return;
    }
    map[assetId] = { forced: forced, reason: String(row[idx.REASON - 1] || '').trim() };
  });
  return map;
}

/**
 * 組裝判定用 context。認證駐站讀取失敗會往外 throw(fail-closed)。
 * @returns {{stationMap: Object, certifiedProcesses: Object, exceptions: Object}}
 */
function buildIsoScopeContext_() {
  return {
    stationMap: getCertifiedStationMap_(),
    certifiedProcesses: getCertifiedProcessSet_(),
    exceptions: getIsoExceptionMap_()
  };
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

// -----------------------------------------------------------------
// ④ 端點
// -----------------------------------------------------------------

/**
 * 逐台判定 + 與對照表 F 欄比差異 + 算補號預告。**完全唯讀,不寫任何資料。**
 * 權限:白名單。
 * @returns {Object}
 */
function previewIsoScopeScan() {
  try {
    const email = getCurrentUserEmail_();
    if (!isInWhitelist_(email)) {
      return { success: false, error: '您沒有權限執行範圍掃描。' };
    }

    const plan = computeIsoScopePlan_();
    return Object.assign({ success: true }, plan.report);
  } catch (e) {
    console.error('previewIsoScopeScan 錯誤:', e);
    return { success: false, error: e.message };
  }
}

/**
 * 掃描的計算核心。preview 與 apply 共用,確保套用時重算的邏輯與試算完全一致
 * (spec §5.4 TOCTOU)。
 * @returns {{report: Object, judgements: Array, groups: Array}}
 */
function computeIsoScopePlan_() {
  const ctx = buildIsoScopeContext_();
  const groupCodeMap = getGroupCodeMap_();

  const assetResult = getAssetsWithMappingStatus();
  if (!assetResult.success) throw new Error('讀取資產清單失敗:' + assetResult.error);
  const assets = assetResult.assets;

  const ismsResult = getIsmsAssets();
  if (!ismsResult.success) throw new Error('讀取資訊資產失敗:' + ismsResult.error);
  const ismsById = {};
  // getIsmsAssets 回傳的鍵是 assets(code.js:990),不是 ismsAssets
  (ismsResult.assets || []).forEach(item => { ismsById[item.ismsAssetId] = item; });

  const mappingMap = getMappingMap_();
  const now = new Date().toISOString();

  const judgements = [];
  const entering = [];
  const leaving = [];
  const unmapped = [];
  let zMismatch = 0;

  assets.forEach(asset => {
    const ismsAsset = asset.mappedIsmsAssetId ? (ismsById[asset.mappedIsmsAssetId] || null) : null;
    const verdict = judgeAssetIsoScope_(ctx, asset, ismsAsset);
    const cell = verdict.status === ISO_JUDGEMENT.IN ? ISO_SCOPE_CELL.IN
               : verdict.status === ISO_JUDGEMENT.PENDING ? ISO_SCOPE_CELL.PENDING
               : ISO_SCOPE_CELL.OUT;

    judgements.push({
      assetId: asset.assetId,
      ismsAssetId: asset.mappedIsmsAssetId || '',
      status: verdict.status,
      basis: verdict.basis,
      cell: cell,
      judgedAt: now
    });

    if (!asset.isMapped) unmapped.push(asset);

    // 與對照表 F 欄(基準線)比差異
    const mapping = mappingMap.get(asset.assetId);
    const previous = mapping ? mapping.isoScope : '';
    if (mapping && previous !== cell) {
      const record = {
        assetId: asset.assetId,
        assetName: asset.assetName,
        location: asset.location,
        basis: verdict.basis,
        previousScope: previous
      };
      if (cell === ISO_SCOPE_CELL.IN) entering.push(record);
      else if (previous === ISO_SCOPE_CELL.IN) leaving.push(record);
    }

    // 與主表 Z 欄的舊人工真相比對(僅計數供參考,不回寫)
    const zSaysIn = String(asset.isIsoScope || '').trim() === '是';
    if (zSaysIn !== (verdict.status === ISO_JUDGEMENT.IN)) zMismatch++;
  });

  // 聚合到資訊資產層級
  const byIsms = {};
  judgements.forEach(j => {
    if (!j.ismsAssetId) return;
    if (!byIsms[j.ismsAssetId]) byIsms[j.ismsAssetId] = [];
    byIsms[j.ismsAssetId].push(j);
  });
  const summary = { inScope: 0, partial: 0, pending: 0, outScope: 0 };
  Object.keys(byIsms).forEach(id => {
    const agg = aggregateIsmsScope_(byIsms[id]);
    if (agg.state === ISO_AGGREGATE.ALL) summary.inScope++;
    else if (agg.state === ISO_AGGREGATE.PARTIAL) summary.partial++;
    else if (agg.state === ISO_AGGREGATE.PENDING) summary.pending++;
    else summary.outScope++;
  });

  // 補號預告
  const built = buildAutoCreateGroups_(unmapped, groupCodeMap);
  const serialTracker = {};
  const autoCreate = built.groups.map(group => {
    return {
      key: group.key,
      location: group.location,
      assetName: group.assetName,
      category: group.category,
      groupCode: group.groupCode,
      groupName: group.groupName,
      count: group.assetIds.length,
      previewId: previewNextIsmsAssetId_(group.groupCode, serialTracker)
    };
  });

  return {
    report: {
      generatedAt: now,
      summary: summary,
      diff: { entering: entering, leaving: leaving },
      autoCreate: autoCreate,
      skipped: built.skipped.map(s => ({
        key: s.key, location: s.location, assetName: s.assetName,
        groupName: s.groupName, count: s.assetIds.length, reason: s.reason
      })),
      zColumnMismatch: zMismatch,
      totals: {
        assets: assets.length,
        mapped: assets.length - unmapped.length,
        unmapped: unmapped.length
      }
    },
    judgements: judgements,
    groups: built.groups
  };
}

/**
 * 取得目前使用者 email(統一入口,方便測試與除錯)。
 * @returns {string}
 */
function getCurrentUserEmail_() {
  return String(Session.getActiveUser().getEmail() || '').toLowerCase().trim();
}

/**
 * 預告下一個資訊資產編號(唯讀,不寫入)。serialTracker 讓同一次試算中
 * 同組別的多筆預告不會撞號。
 * @param {string} groupCode
 * @param {Object} serialTracker { [groupCode]: 已配發到的序號 }
 * @returns {string}
 */
function previewNextIsmsAssetId_(groupCode, serialTracker) {
  if (serialTracker[groupCode] === undefined) {
    serialTracker[groupCode] = readMaxIsmsSerial_(groupCode, ISO_SCAN_DEFAULT_CATEGORY_CODE);
  }
  serialTracker[groupCode] += 1;
  const padded = String(serialTracker[groupCode]).padStart(3, '0');
  return `${groupCode}-${ISO_SCAN_DEFAULT_CATEGORY_CODE}-${padded}`;
}

/**
 * 掃資訊資產清單 A 欄,取某組別+類別目前的最大流水號。
 * 沿用 createIsmsAsset 的「A 欄是唯一真相」策略(code.js:684)。
 * @param {string} groupCode
 * @param {string} categoryCode
 * @returns {number}
 */
function readMaxIsmsSerial_(groupCode, categoryCode) {
  const ss = SpreadsheetApp.openById(CONFIG.ISMS_SPREADSHEET_ID);
  const sheet = ss.getSheetByName(CONFIG.ISMS_ASSET_SHEET_NAME);
  if (!sheet || sheet.getLastRow() <= 1) return 0;

  const escapeRegExp = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp('^' + escapeRegExp(groupCode) + '-' + escapeRegExp(categoryCode) + '-(\\d+)$', 'i');
  const idx = ISMS_ASSET_COLUMN_INDICES;
  const ids = sheet.getRange(2, idx.ISMS_ASSET_ID, sheet.getLastRow() - 1, 1).getValues();

  let max = 0;
  ids.forEach(row => {
    const m = String(row[0] || '').trim().match(pattern);
    if (!m) return;
    const serial = Number(m[1]);
    if (!isNaN(serial) && serial > max) max = serial;
  });
  return max;
}

/**
 * 套用掃描結果:建號 → 建對照 → 覆寫 F/G/H → 寫 log。
 * 權限:管理員(spec §9)。守門在搶鎖之前。
 *
 * TOCTOU(spec §5.4):不信任前端帶回的預告內容,重新完整計算一次;
 * 若筆數與前端帶回的不符即中止,要求重新試算。
 *
 * @param {{generatedAt: string, autoCreateCount: number, enteringCount: number, leavingCount: number}} payload
 * @returns {Object}
 */
function applyIsoScopeScan(payload) {
  const access = assertWriteAccess_(true);
  if (!access.ok) return { success: false, error: access.error };

  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000);

    const plan = computeIsoScopePlan_();
    const report = plan.report;

    // TOCTOU 檢查
    if (payload && typeof payload.autoCreateCount === 'number') {
      const drifted =
        report.autoCreate.length !== payload.autoCreateCount ||
        report.diff.entering.length !== payload.enteringCount ||
        report.diff.leaving.length !== payload.leavingCount;
      if (drifted) {
        return {
          success: false,
          error: '資料在試算之後已變動(可能有人剛完成轉移或對照),請重新執行掃描後再套用。'
        };
      }
    }

    const email = access.email;
    const now = new Date().toISOString();

    // ① 建立資訊資產(逐筆 appendRow + flush,沿用三道防撞號;量級=歸併後筆數)
    const created = [];
    const newMappings = [];
    plan.groups.forEach(group => {
      const ismsAssetId = appendIsmsAssetRow_(group);
      created.push({ ismsAssetId: ismsAssetId, count: group.assetIds.length });
      group.assetIds.forEach(assetId => {
        newMappings.push({ assetId: assetId, ismsAssetId: ismsAssetId });
      });
    });

    // ② 重算判定(新建的對照會改變非駐站資產的業務流程來源)
    const finalPlan = plan.groups.length ? computeIsoScopePlan_() : plan;

    // ③ 對照表一次寫完:新列 + 既有列的 F/G/H
    const written = writeMappingBaseline_(finalPlan.judgements, newMappings, email, now);

    return {
      success: true,
      created: created.length,
      mappingsWritten: written.newRows,
      baselineRows: written.updatedRows,
      message: `已建立 ${created.length} 筆資訊資產、寫入 ${written.newRows} 筆對照、更新 ${written.updatedRows} 列基準線。`
    };
  } catch (e) {
    console.error('applyIsoScopeScan 錯誤:', e);
    return { success: false, error: e.message };
  } finally {
    try { lock.releaseLock(); } catch (_) {}
  }
}

/**
 * 依歸併組建立一列資訊資產。CIA 刻意留空(spec §6.3):填 1/1/1 會混進
 * 資產價值統計變成「看起來已完成」,空白才是待補訊號。因此不重用
 * createIsmsAsset()(它強制 CIA 為 1~4)。
 * @param {Object} group buildAutoCreateGroups_ 的一組
 * @returns {string} 產出的資訊資產編號
 */
function appendIsmsAssetRow_(group) {
  const ss = SpreadsheetApp.openById(CONFIG.ISMS_SPREADSHEET_ID);
  const sheet = ss.getSheetByName(CONFIG.ISMS_ASSET_SHEET_NAME);
  if (!sheet) throw new Error('找不到資訊資產工作表');

  const idx = ISMS_ASSET_COLUMN_INDICES;
  const categoryCode = ISO_SCAN_DEFAULT_CATEGORY_CODE;

  // 三道防線:掃 A 欄取 max → 遞增 → 確認不存在
  const existingIds = {};
  if (sheet.getLastRow() > 1) {
    sheet.getRange(2, idx.ISMS_ASSET_ID, sheet.getLastRow() - 1, 1).getValues()
      .forEach(row => {
        const id = String(row[0] || '').trim().toLowerCase();
        if (id) existingIds[id] = true;
      });
  }
  let serial = readMaxIsmsSerial_(group.groupCode, categoryCode) + 1;
  let ismsAssetId = `${group.groupCode}-${categoryCode}-${String(serial).padStart(3, '0')}`;
  while (existingIds[ismsAssetId.toLowerCase()]) {
    serial += 1;
    ismsAssetId = `${group.groupCode}-${categoryCode}-${String(serial).padStart(3, '0')}`;
  }

  const isStation = !!getCertifiedStationMap_()[group.location];
  const row = new Array(22).fill('');
  row[idx.ISMS_ASSET_ID - 1] = ismsAssetId;
  row[idx.CATEGORY - 1] = categoryCode;
  row[idx.NAME - 1] = group.assetName;
  row[idx.QUANTITY - 1] = group.assetIds.length;
  row[idx.LOCATION - 1] = group.location;
  row[idx.RESPONSIBLE_UNIT - 1] = group.groupName;
  row[idx.GROUP - 1] = group.groupCode;
  row[idx.SERIAL_NO - 1] = serial;
  row[idx.BUSINESS_PROCESS - 1] = isStation ? STATION_DEFAULT_BUSINESS_PROCESS : '';
  // O/P/Q(CIA)與 R(資產價值)刻意留空

  sheet.appendRow(row);
  SpreadsheetApp.flush();

  const snapshot = mapRowToIsmsAssetObject_(
    sheet.getRange(sheet.getLastRow(), 1, 1, 22).getValues()[0]
  );
  logIsmsOperation_('掃描新增', ismsAssetId, '', null, snapshot, 'ISO 範圍掃描自動補號');

  return ismsAssetId;
}

/**
 * 對照表一次寫完:讀整表 → 記憶體內加新列、改 F/G/H → 一次 setValues 覆寫。
 *
 * ⚠️ 不可重用 createMappings():它每筆一次 appendRow / 四次 setValue,
 * 200 台就是 200 趟 API 往返(spec §5.3)。
 * ⚠️ 既有列的 C(建立時間)/D(建立人)不覆寫。
 *
 * @param {Array} judgements computeIsoScopePlan_ 的台級判定
 * @param {Array<{assetId: string, ismsAssetId: string}>} newMappings
 * @param {string} email
 * @param {string} now ISO 字串
 * @returns {{newRows: number, updatedRows: number}}
 */
function writeMappingBaseline_(judgements, newMappings, email, now) {
  const ss = SpreadsheetApp.openById(CONFIG.ISMS_SPREADSHEET_ID);
  let sheet = ss.getSheetByName(CONFIG.MAPPING_SHEET_NAME);
  if (!sheet) {
    const init = initMappingSheet();
    if (!init.success) throw new Error('對照表不存在且自動建立失敗:' + init.error);
    sheet = ss.getSheetByName(CONFIG.MAPPING_SHEET_NAME);
  }

  const idx = MAPPING_COLUMN_INDICES;
  const width = idx.ISO_JUDGED_AT;
  const lastRow = sheet.getLastRow();
  const existing = lastRow > 1
    ? sheet.getRange(2, 1, lastRow - 1, width).getValues()
    : [];

  // 既有列索引
  const rowByAssetId = {};
  existing.forEach((row, i) => {
    const assetId = String(row[idx.ASSET_ID - 1] || '').trim();
    if (assetId) rowByAssetId[assetId] = i;
  });

  // 追加新對照列
  let newRows = 0;
  newMappings.forEach(m => {
    if (rowByAssetId[m.assetId] !== undefined) return; // 已有列,只更新不新增
    const row = new Array(width).fill('');
    row[idx.ASSET_ID - 1] = m.assetId;
    row[idx.ISMS_ASSET_ID - 1] = m.ismsAssetId;
    row[idx.CREATED_TIME - 1] = now;
    row[idx.CREATED_BY - 1] = email;
    row[idx.REMARKS - 1] = 'ISO 範圍掃描自動建立';
    existing.push(row);
    rowByAssetId[m.assetId] = existing.length - 1;
    newRows++;
  });

  // 寫入 F/G/H
  let updatedRows = 0;
  judgements.forEach(j => {
    const i = rowByAssetId[j.assetId];
    if (i === undefined) return; // 未對照的資產不寫基準線
    existing[i][idx.ISO_SCOPE - 1] = j.cell;
    existing[i][idx.ISO_BASIS - 1] = j.basis;
    existing[i][idx.ISO_JUDGED_AT - 1] = j.judgedAt;
    updatedRows++;
  });

  if (existing.length) {
    sheet.getRange(2, 1, existing.length, width).setValues(existing);
    SpreadsheetApp.flush();
  }
  return { newRows: newRows, updatedRows: updatedRows };
}
