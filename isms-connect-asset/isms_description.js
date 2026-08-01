// ==========================================
// isms_description.js — 只更新資訊資產說明(D 欄)
//
// 為何不重用 updateIsmsAsset:那支強制 CIA 為 1~4,
// ISO 掃描補號產生的資產刻意留空 CIA,會被它擋下。
// ==========================================

/**
 * 更新單一資訊資產的說明(D 欄)。白名單可寫。
 * @param {string} ismsAssetId
 * @param {string} description
 * @returns {{success:boolean, ismsAssetId?:string, noChange?:boolean, error?:string}}
 */
function updateIsmsDescription(ismsAssetId, description) {
  // 🛡️ 守門在搶鎖之前
  const access = assertWriteAccess_(false);
  if (!access.ok) return { success: false, error: access.error };

  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);

    const id = String(ismsAssetId == null ? '' : ismsAssetId).trim();
    if (!id) return { success: false, error: '資訊資產編號必填' };

    const newDesc = description == null ? '' : String(description);

    const located = findIsmsAssetRow_(id);
    if (!located) return { success: false, error: '找不到資產:' + id };

    const idx = ISMS_ASSET_COLUMN_INDICES;
    const sheet = located.sheet;
    const rowIndex = located.rowIndex;
    const before = mapRowToIsmsAssetObject_(located.rowData);
    const beforeDesc = before.description || '';

    if (beforeDesc === newDesc) {
      return { success: true, noChange: true, ismsAssetId: id };
    }

    sheet.getRange(rowIndex, idx.DESCRIPTION).setValue(newDesc);
    SpreadsheetApp.flush();

    const afterRow = sheet.getRange(rowIndex, 1, 1, 22).getValues()[0];
    const after = mapRowToIsmsAssetObject_(afterRow);

    logIsmsOperation_('編輯', id, 'description', before, after, '');

    return { success: true, ismsAssetId: id };
  } catch (e) {
    console.error('updateIsmsDescription 錯誤:', e);
    return { success: false, error: e.message };
  } finally {
    try { lock.releaseLock(); } catch (_) {}
  }
}
