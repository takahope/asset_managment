/**
 * lab_default_group.js — 實驗組 AE 欄（DEFAULT_GROUP）轉入／轉出規則（spec 2026-10-02）
 * 轉移申請預測、審核寫入、退回還原、殘留清理與通知分流共用同一套規則。
 * 與 code.js 共用 GAS 全域範圍：內部函式一律 `_` 結尾；公開入口僅測試與清理函式。
 */

const LAB_DEFAULT_GROUP_NAME_ = '實驗組';
const LAB_TRANSFER_TYPE_MARK_ = '轉移實驗組';           // 涵蓋 個人／共同／【同組代理】前綴
const LAB_COMMON_TRANSFER_TYPE_ = '轉移實驗組(共同)';
const AL_OLD_AE_EMPTY_MARK_ = '（空白）';               // S 欄：區分「原 AE 空白」與「舊紀錄未記錄」

let LAB_MEMBER_CHECKER_MEMO_ = null; // 同請求記憶化，避免重讀轉移紀錄

/** 組名是否為實驗組（別名正規化、大小寫不敏感） */
function isLabGroupName_(name, canonicalize) {
  const canon = canonicalize || canonicalizeGroupName_;
  const g = String(name == null ? '' : name).trim();
  if (!g) return false;
  return String(canon(g) || g).trim().toLowerCase() === LAB_DEFAULT_GROUP_NAME_;
}

/** 公用帳號集合（小寫）：設定值 ∪ 轉移紀錄中「轉移實驗組(共同)」列的新保管人（歷任） */
function collectLabCommonAccounts_(settingEmail, logRows) {
  const accounts = {};
  const add = email => {
    const e = String(email == null ? '' : email).toLowerCase().trim();
    if (e) accounts[e] = true;
  };
  add(settingEmail);
  (logRows || []).forEach(row => {
    if (row && String(row.transferType || '').indexOf(LAB_COMMON_TRANSFER_TYPE_) !== -1) add(row.newKeeperEmail);
  });
  return accounts;
}

/** 實驗組成員判定：公用帳號或 HR 組別為實驗組；空 email 一律非成員 */
function buildLabMemberChecker_(src) {
  const s = src || {};
  const common = s.commonAccounts || {};
  const groups = (s.directory && s.directory.emailToGroup) || {};
  const canon = s.canonicalize;
  return function (email) {
    const e = String(email == null ? '' : email).toLowerCase().trim();
    if (!e) return false;
    if (common[e] === true) return true;
    const group = Object.prototype.hasOwnProperty.call(groups, e) ? groups[e] : '';
    return isLabGroupName_(group, canon);
  };
}

/** HR 名錄是否足以判定實驗組成員：人數達門檻且至少一人 HR 組別為實驗組（防組別對照失效時誤刪 AE） */
function isLabDirectoryHealthy_(directory, canonicalize) {
  if (!directory || !directory.allEmails || directory.allEmails.length < HR_SYNC_MIN_HEADCOUNT) return false;
  const groups = directory.emailToGroup || {};
  return Object.keys(groups).some(email => isLabGroupName_(groups[email], canonicalize));
}

/** 保管人或（有使用人欄時）實際使用人是否為成員；使用人空白視為保管人 */
function labPartiesIncludeMember_(keeperEmail, userEmail, hasUserColumn, isLabMember) {
  if (isLabMember(keeperEmail)) return true;
  if (!hasUserColumn) return false;
  const effectiveUser = String(userEmail == null ? '' : userEmail).trim() || keeperEmail;
  return isLabMember(effectiveUser);
}

/**
 * 轉移後 AE（申請時預測與審核時寫入共用，spec §4.3）。
 * @returns {string} 實驗組轉移→'實驗組'；轉出實驗組→''；其餘維持目前值（trim）
 */
function computePostTransferAe_(p) {
  const o = p || {};
  if (String(o.transferType || '').indexOf(LAB_TRANSFER_TYPE_MARK_) !== -1) return LAB_DEFAULT_GROUP_NAME_;
  const current = String(o.currentAe == null ? '' : o.currentAe).trim();
  if (!isLabGroupName_(current, o.canonicalize)) return current;
  if (typeof o.isLabMember !== 'function') return current;
  return labPartiesIncludeMember_(o.newKeeperEmail, o.newUserEmail, o.hasUserColumn, o.isLabMember) ? current : '';
}

/** 轉移申請紀錄 S 欄寫入值：原 AE 空白時寫標記 */
function encodeOldAeForLog_(ae) {
  const v = String(ae == null ? '' : ae).trim();
  return v || AL_OLD_AE_EMPTY_MARK_;
}

/**
 * 退回轉移時應還原的 AE（spec §4.4）。
 * @returns {string|null} null 表示不改動 AE
 */
function computeRollbackAe_(p) {
  const o = p || {};
  const recorded = String(o.recordedOldAe == null ? '' : o.recordedOldAe).trim();
  if (recorded === AL_OLD_AE_EMPTY_MARK_) return '';
  if (recorded) return recorded;
  if (String(o.transferType || '').indexOf(LAB_TRANSFER_TYPE_MARK_) === -1) return null;
  if (typeof o.isLabMember !== 'function') return null;
  if (labPartiesIncludeMember_(o.restoredKeeperEmail, o.restoredUserEmail, o.hasUserColumn, o.isLabMember)) {
    return LAB_DEFAULT_GROUP_NAME_;
  }
  // 還原保管人 Email 未知時不據以清空（避免依缺漏資料誤刪 AE）
  return String(o.restoredKeeperEmail == null ? '' : o.restoredKeeperEmail).trim() ? '' : null;
}

/**
 * 殘留 AE 分類（spec §6.1）。
 * @returns {'skip'|'ok'|'review'|'remove'}
 */
function classifyLabAeResidue_(p) {
  const o = p || {};
  if (!isLabGroupName_(o.ae, o.canonicalize)) return 'skip';
  const status = String(o.status || '').trim();
  if (status === '轉移中' || status === '已報廢') return 'skip';
  const keeper = String(o.keeperEmail == null ? '' : o.keeperEmail).toLowerCase().trim();
  const effectiveUser = String(o.userEmail == null ? '' : o.userEmail).toLowerCase().trim() || keeper;
  if (labPartiesIncludeMember_(keeper, effectiveUser, o.hasUserColumn, o.isLabMember)) return 'ok';
  if (!keeper) return 'review';
  if (!o.isActiveHrMember(keeper)) return 'review';
  if (o.hasUserColumn && !o.isActiveHrMember(effectiveUser)) return 'review';
  return 'remove';
}

// --- GAS 組裝 ---

/** 轉移申請紀錄原始列 → { newKeeperEmail, transferType }（I、O 欄） */
function toLabLogRows_(rawRows) {
  return (rawRows || []).map(row => ({
    newKeeperEmail: row[AL_NEW_LEADER_EMAIL_COLUMN_INDEX - 1],
    transferType: row[AL_TRANSFER_TYPE_COLUMN_INDEX - 1]
  }));
}

/** 讀轉移申請紀錄 A～O 欄（取 I 新保管人 Email、O 轉移類型）推得歷任公用帳號 */
function readLabLogRows_() {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(APPLICATION_LOG_SHEET_NAME);
  if (!sheet || sheet.getLastRow() <= 1) return [];
  return toLabLogRows_(sheet.getRange(2, 1, sheet.getLastRow() - 1, AL_TRANSFER_TYPE_COLUMN_INDEX).getValues());
}

/**
 * 實驗組成員判定（同請求記憶化）。
 * @param {Array<Array>} [appLogValues] 呼叫端已讀取的轉移申請紀錄原始列（第 2 列起）；省略時自行讀取
 * @returns {function(string): boolean}
 */
function getLabMemberChecker_(appLogValues) {
  if (LAB_MEMBER_CHECKER_MEMO_) return LAB_MEMBER_CHECKER_MEMO_;
  const directory = getKeeperDirectory_();
  if (!isLabDirectoryHealthy_(directory, canonicalizeGroupName_)) {
    // HR 名錄無法判定實驗組成員：一律視為成員，本請求不移除任何 AE（保守，避免誤刪）
    Logger.log('⚠️ HR 名錄人數不足或無人屬實驗組，實驗組成員判定改為一律視為成員（本次不移除 AE）');
    LAB_MEMBER_CHECKER_MEMO_ = function () { return true; };
    return LAB_MEMBER_CHECKER_MEMO_;
  }
  const logRows = appLogValues ? toLabLogRows_(appLogValues) : readLabLogRows_();
  const setting = PropertiesService.getScriptProperties().getProperty('LAB_COMMON_CUSTODIAN_EMAIL');
  LAB_MEMBER_CHECKER_MEMO_ = buildLabMemberChecker_({
    directory: directory,
    commonAccounts: collectLabCommonAccounts_(setting, logRows),
    canonicalize: canonicalizeGroupName_
  });
  return LAB_MEMBER_CHECKER_MEMO_;
}

/** 清除成員判定記憶化（測試用） */
function clearLabMemberCheckerMemo_() {
  LAB_MEMBER_CHECKER_MEMO_ = null;
}

/**
 * 惰性且容錯的成員判定（寫入點使用）：首次呼叫才建立判定；建立失敗時視為成員（不移除 AE）並記錄。
 * @param {Array<Array>} [appLogValues] 呼叫端已讀取的轉移申請紀錄原始列；省略時自行讀取
 * @returns {function(string): boolean}
 */
function makeLazyLabMemberChecker_(appLogValues) {
  return function (email) {
    try {
      return getLabMemberChecker_(appLogValues)(email);
    } catch (e) {
      Logger.log('⚠️ 實驗組成員判定失敗，視為成員（不移除 AE）：' + e.message);
      return true;
    }
  };
}

/** 確保「轉移申請紀錄」有 S 欄並補表頭「原預設組別(AE)」（申請與審核共用，免先執行 deployAllSheets） */
function ensureAppLogOldAeColumn_(appLogSheet) {
  if (appLogSheet.getMaxColumns() < AL_OLD_AE_COLUMN_INDEX) {
    appLogSheet.insertColumnsAfter(appLogSheet.getMaxColumns(), AL_OLD_AE_COLUMN_INDEX - appLogSheet.getMaxColumns());
  }
  if (!appLogSheet.getRange(1, AL_OLD_AE_COLUMN_INDEX).getValue()) {
    appLogSheet.getRange(1, AL_OLD_AE_COLUMN_INDEX).setValue('原預設組別(AE)');
  }
}

// --- 殘留 AE 清理（GAS 編輯器手動執行，spec §6） ---

/** [管理員・GAS 編輯器] 預覽殘留 AE（不修改） */
function previewLabAeCleanup() {
  return runLabAeCleanup_(false);
}

/** [管理員・GAS 編輯器] 清除「可安全移除」類殘留 AE；「需人工確認」永不自動修改。建議離峰執行。 */
function applyLabAeCleanup() {
  return runLabAeCleanup_(true);
}

/** 清理共用流程：每次都重新計算，不沿用前次預覽 */
function runLabAeCleanup_(apply) {
  if (!checkAdminPermissions()) throw new Error('權限不足：僅管理員可執行實驗組 AE 清理。');
  const directory = getKeeperDirectory_();
  if (!isLabDirectoryHealthy_(directory)) {
    throw new Error('HR 名錄人數異常或無人屬實驗組（需達 ' + HR_SYNC_MIN_HEADCOUNT + ' 人且至少一人為實驗組），中止實驗組 AE 清理。');
  }
  const isLabMember = getLabMemberChecker_();
  const names = directory.emailToName || {};
  const isActiveHrMember = email => Object.prototype.hasOwnProperty.call(names, String(email == null ? '' : email).toLowerCase().trim());
  const remove = [];
  const review = [];
  let okCount = 0;

  getAllAssets().forEach(asset => {
    const hasUserColumn = asset.sourceSheet === PROPERTY_MASTER_SHEET_NAME;
    const result = classifyLabAeResidue_({
      ae: asset.defaultGroup,
      status: asset.assetStatus,
      keeperEmail: asset.leaderEmail,
      userEmail: hasUserColumn ? asset.userEmail : '',
      hasUserColumn: hasUserColumn,
      isLabMember: isLabMember,
      isActiveHrMember: isActiveHrMember
    });
    if (result === 'ok') { okCount++; return; }
    if (result !== 'remove' && result !== 'review') return;
    const item = {
      assetId: String(asset.assetId),
      assetName: String(asset.assetName || ''),
      sourceSheet: String(asset.sourceSheet || ''),
      status: String(asset.assetStatus || ''),
      keeper: `${asset.leaderName || ''} (${asset.leaderEmail || ''})`,
      user: hasUserColumn ? `${asset.userName || ''} (${asset.userEmail || ''})` : '-',
      reason: result === 'remove'
        ? '保管人與使用人皆為 HR 在職且非實驗組成員'
        : '保管人空白，或保管人／使用人不在 HR 在職名錄，請人工確認'
    };
    (result === 'remove' ? remove : review).push(item);
  });

  Logger.log(`=== 實驗組 AE 殘留${apply ? '清理' : '預覽'}：可移除 ${remove.length}／需人工確認 ${review.length}／正常 ${okCount} ===`);
  remove.forEach(i => Logger.log(`🗑️ 可移除 ${i.assetId} ${i.assetName}｜${i.sourceSheet}｜${i.status}｜保管人 ${i.keeper}｜使用人 ${i.user}｜${i.reason}`));
  review.forEach(i => Logger.log(`🔍 需人工確認 ${i.assetId} ${i.assetName}｜${i.sourceSheet}｜${i.status}｜保管人 ${i.keeper}｜使用人 ${i.user}｜${i.reason}`));
  if (!apply) return { remove: remove, review: review, okCount: okCount };

  let updated = 0;
  remove.forEach(i => {
    const location = findAssetLocation(i.assetId);
    if (!location) {
      Logger.log(`⚠️ 找不到資產 ${i.assetId}，略過`);
      return;
    }
    if (location.sheetName !== i.sourceSheet) {
      Logger.log(`⏭️ ${i.assetId} 位於 ${location.sheetName}，與判定時的 ${i.sourceSheet} 不符，略過`);
      return;
    }
    const indices = location.sheetName === PROPERTY_MASTER_SHEET_NAME ? PROPERTY_COLUMN_INDICES : ITEM_COLUMN_INDICES;
    // 寫入前以最新整列重新判定（執行期間狀態、保管人、使用人或 AE 可能已變動）
    const freshRow = location.sheet.getRange(location.rowIndex, 1, 1, location.sheet.getLastColumn()).getValues()[0];
    const fresh = mapRowToAssetObject(freshRow, indices, location.sheetName);
    const hasUserColumn = location.sheetName === PROPERTY_MASTER_SHEET_NAME;
    const recheck = classifyLabAeResidue_({
      ae: fresh.defaultGroup,
      status: fresh.assetStatus,
      keeperEmail: fresh.leaderEmail,
      userEmail: hasUserColumn ? fresh.userEmail : '',
      hasUserColumn: hasUserColumn,
      isLabMember: isLabMember,
      isActiveHrMember: isActiveHrMember
    });
    if (recheck !== 'remove') {
      Logger.log(`⏭️ ${i.assetId} 重新判定為 ${recheck}，略過`);
      return;
    }
    location.sheet.getRange(location.rowIndex, indices.DEFAULT_GROUP).setValue('');
    updated++;
    Logger.log(`✅ 已清除 ${i.assetId} 的 AE（實驗組）`);
  });
  Logger.log(`=== 實驗組 AE 清理完成：實際清除 ${updated} 筆 ===`);
  return { updated: updated };
}
