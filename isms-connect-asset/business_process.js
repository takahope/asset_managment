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

// ------------------------------------------
// ② 端點
// ------------------------------------------

/**
 * 批次設定資訊資產的業務流程(V 欄)。管理員限定。
 *
 * 為何不擴充 updateIsmsAsset:那支強制 name 非空且 CIA 為 1~4,
 * 而 ISO 掃描補號產生的資產刻意留空 CIA,會被它擋下——那批正是最需要補業務流程的。
 *
 * 刻意不做的事:
 * - 不更新對照表 F/G/H 欄(ISO 基準線)。F 欄的定義是「上次掃描套用的結果」,
 *   改業務流程後**應該**在下次掃描顯示為一筆待套用差異,那是稽核軌跡;
 *   在此順手改掉等於讓變更繞過掃描的確認關卡。
 * - 不對未對照的實體資產補號。補號是 ISO 掃描的職責,兩處都做會出現兩條編號產生路徑。
 *
 * @param {{ismsAssetIds: Array<string>, businessProcess: string, expectedAffectedCount: number}} payload
 * @returns {{success:boolean, updated?:Array, skipped?:Array, noChange?:Array, error?:string}}
 */
function setIsmsBusinessProcessBatch(payload) {
  // 🛡️ 守門在搶鎖之前:未授權的呼叫不該佔用全域鎖
  const access = assertWriteAccess_(true);
  if (!access.ok) return { success: false, error: access.error };

  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);

    if (!payload || typeof payload !== 'object') {
      return { success: false, error: '參數不正確' };
    }
    const targetIds = Array.isArray(payload.ismsAssetIds) ? payload.ismsAssetIds : [];
    if (targetIds.length === 0) {
      return { success: false, error: '未指定資訊資產' };
    }
    const newValue = String(payload.businessProcess == null ? '' : payload.businessProcess).trim();

    // 值域檢查:不接受自由輸入
    const options = getDropdownOptions();
    if (!options.success) {
      return { success: false, error: '讀取下拉選單失敗:' + options.error };
    }
    const allowed = (options.businessProcesses || []).map(p => p.display);
    if (!isAllowedBusinessProcess_(newValue, allowed)) {
      return { success: false, error: '業務流程「' + newValue + '」不在允許清單內' };
    }

    const ss = SpreadsheetApp.openById(CONFIG.ISMS_SPREADSHEET_ID);

    // TOCTOU:後端重算波及台數,與前端畫面當下的數字比對
    if (typeof payload.expectedAffectedCount === 'number') {
      const mappingSheet = ss.getSheetByName(CONFIG.MAPPING_SHEET_NAME);
      const mappingRows = mappingSheet ? mappingSheet.getDataRange().getValues() : [];
      const actual = countAffectedAssets_(mappingRows, targetIds);
      if (actual !== payload.expectedAffectedCount) {
        return {
          success: false,
          error: '資料已變動,請重新整理後再試(畫面顯示 ' + payload.expectedAffectedCount +
                 ' 台,實際 ' + actual + ' 台)'
        };
      }
    }

    const sheet = ss.getSheetByName(CONFIG.ISMS_ASSET_SHEET_NAME);
    if (!sheet) return { success: false, error: '找不到資訊資產工作表' };

    const rows = sheet.getDataRange().getValues();
    const plan = buildBusinessProcessPlan_(rows, targetIds, newValue);
    const idx = ISMS_ASSET_COLUMN_INDICES;

    // 讀整表 → 記憶體改 → 一次 setValues 寫回 V 欄整欄。
    // 逐格 setValue 會是 N 趟 API 往返,200 筆就吃掉大半個 6 分鐘配額。
    if (plan.updates.length > 0) {
      const column = [];
      for (let r = 1; r < rows.length; r++) {
        column.push([rows[r][idx.BUSINESS_PROCESS - 1]]);
      }
      plan.updates.forEach(u => { column[u.rowIndex - 2] = [u.after]; });
      sheet.getRange(2, idx.BUSINESS_PROCESS, column.length, 1).setValues(column);
      SpreadsheetApp.flush();
    }

    // 稽核 log:前後快照都由記憶體裡那列組出來,不再回頭讀表(避免 N 次全表掃描)
    plan.updates.forEach(u => {
      const beforeRow = rows[u.rowIndex - 1].slice();
      const beforeObj = mapRowToIsmsAssetObject_(beforeRow);
      const afterRow = beforeRow.slice();
      afterRow[idx.BUSINESS_PROCESS - 1] = u.after;
      const afterObj = mapRowToIsmsAssetObject_(afterRow);
      logIsmsOperation_('編輯', u.ismsAssetId, 'businessProcess', beforeObj, afterObj, '批次設定業務流程');
    });

    return {
      success: true,
      updated: plan.updates.map(u => ({
        ismsAssetId: u.ismsAssetId, before: u.before, after: u.after
      })),
      skipped: plan.skipped,
      noChange: plan.noChange
    };
  } catch (e) {
    console.error('setIsmsBusinessProcessBatch 錯誤:', e);
    return { success: false, error: e.message };
  } finally {
    try { lock.releaseLock(); } catch (_) {}
  }
}
