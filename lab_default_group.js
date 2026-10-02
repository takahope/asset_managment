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
  return labPartiesIncludeMember_(o.restoredKeeperEmail, o.restoredUserEmail, o.hasUserColumn, o.isLabMember)
    ? LAB_DEFAULT_GROUP_NAME_
    : '';
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
  const logRows = appLogValues ? toLabLogRows_(appLogValues) : readLabLogRows_();
  const setting = PropertiesService.getScriptProperties().getProperty('LAB_COMMON_CUSTODIAN_EMAIL');
  LAB_MEMBER_CHECKER_MEMO_ = buildLabMemberChecker_({
    directory: getKeeperDirectory_(),
    commonAccounts: collectLabCommonAccounts_(setting, logRows),
    canonicalize: canonicalizeGroupName_
  });
  return LAB_MEMBER_CHECKER_MEMO_;
}

/** 清除成員判定記憶化（測試用） */
function clearLabMemberCheckerMemo_() {
  LAB_MEMBER_CHECKER_MEMO_ = null;
}
