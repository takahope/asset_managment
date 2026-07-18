// =================================================================
// hr_directory.js — HR 人員資料抽象層(Phase 1:主專案直讀 HR + 快取)
// 設計文件:docs/superpowers/specs/2026-07-18-keeper-sheet-migration-design.md
// 資料流:HR 主表 →(直讀+快取)→ 主專案;同步器另把 HR 寫回「保管人/信箱」餵子專案
// =================================================================

// --- HR 工作表名稱(欄位序以實表為準,結構關係見 ~/.agents/ECOSYSTEM.md) ---
const HR_PERSONNEL_SHEET_NAME = "人員主檔";     // A 信箱(主鍵)、B 姓名、C 狀態
const HR_ORG_TREE_SHEET_NAME = "組織架構樹";    // C 代碼、D 名稱
const HR_ASSIGNMENT_SHEET_NAME = "人員職務配置"; // A 信箱、C 組別代碼、E 職務

// 白名單納入的人員狀態值域(離職必排除;值域如需調整只改這裡)
const HR_ACTIVE_STATUSES = ['在勤', '休假', '育嬰假', '外派人員'];

// 駐管判定:人員職務配置 E 欄職務等於此值(任一列即算,涵蓋兼任)
const HR_STATION_MANAGER_TITLE = '駐站管理員';

// 同步防呆:HR 在勤人數低於此門檻即中止同步,避免上游異常清空白名單
const HR_SYNC_MIN_HEADCOUNT = 5;

const KEEPER_DIRECTORY_CACHE_KEY = 'keeper_directory_v1';
const KEEPER_DIRECTORY_CACHE_SECONDS = 600; // 與白名單快取同為 10 分鐘

/**
 * 讀取 HR 主表試算表 ID(存於 Script Properties,設定視窗可改)
 * @returns {string}
 */
function getHrSpreadsheetId_() {
  const id = PropertiesService.getScriptProperties().getProperty('HR_SPREADSHEET_ID');
  if (!id) {
    throw new Error('尚未設定 HR_SPREADSHEET_ID,請在設定視窗(進階)或 Script Properties 填入 HR 主表試算表 ID。');
  }
  return String(id).trim();
}

/**
 * HR 組別名 → 資產系統慣用組別名 轉換表
 * 例:{"行政支援組(行政組)":"行政組","資料運用組":"釋出組","專案規劃組":"策略組"}
 * @returns {Object}
 */
function getHrGroupNameMap_() {
  const raw = PropertiesService.getScriptProperties().getProperty('HR_GROUP_NAME_MAP');
  if (!raw) return {};
  try {
    return JSON.parse(raw) || {};
  } catch (e) {
    Logger.log('HR_GROUP_NAME_MAP 解析失敗(視為空表):' + e.message);
    return {};
  }
}

/** D 欄遷移:資訊組駐站資產保管人 email 清單 */
function getInfoStationCustodianEmails_() {
  return parseEmailListProperty_(PropertiesService.getScriptProperties().getProperty('INFO_STATION_CUSTODIAN_EMAILS'));
}

/** E 欄遷移:資訊組駐站資產使用人 email 清單 */
function getInfoStationUserEmails_() {
  return parseEmailListProperty_(PropertiesService.getScriptProperties().getProperty('INFO_STATION_USER_EMAILS'));
}

/** F 欄遷移:駐站轉中心收案組保管＆使用人 email 清單 */
function getIntakeCustodianEmails_() {
  return parseEmailListProperty_(PropertiesService.getScriptProperties().getProperty('INTAKE_CUSTODIAN_EMAILS'));
}

/** H 欄遷移:允許使用 ISMS 盤點的組別名稱清單 */
function getIsmsInventoryGroups_() {
  const raw = PropertiesService.getScriptProperties().getProperty('ISMS_INVENTORY_GROUPS');
  if (!raw) return [];
  return String(raw)
    .split(/[\n,;]+/)
    .map(s => s.trim())
    .filter(Boolean);
}

// --- Directory 組裝與快取 ---

let KEEPER_DIRECTORY_MEMO_ = null; // 同一請求內記憶化,避免重複解析

/**
 * 主職判定順序(ECOSYSTEM 契約):PRE → CEO → DEPT-* → GRP-*;
 * TF-* 與其他代碼只能是兼任,不作主職(回傳 99)。
 * @param {string} code 組別代碼
 * @returns {number} 排序權重,越小越優先
 */
function orgCodeRank_(code) {
  const c = String(code || '').trim();
  if (c === 'PRE') return 0;
  if (c === 'CEO') return 1;
  if (c.indexOf('DEPT-') === 0) return 2;
  if (c.indexOf('GRP-') === 0) return 3;
  return 99;
}

/**
 * 從 HR 主表三張工作表組裝人員 directory(不經快取)。
 * @returns {{emailToName:Object, emailToGroup:Object, groupToMembers:Object, custodianEmails:string[], allEmails:string[]}}
 */
function buildKeeperDirectoryFromHr_() {
  const hrSs = SpreadsheetApp.openById(getHrSpreadsheetId_());

  // 1. 人員主檔:A 信箱、B 姓名、C 狀態 → 在勤過濾(離職排除契約)
  const personnelSheet = hrSs.getSheetByName(HR_PERSONNEL_SHEET_NAME);
  if (!personnelSheet || personnelSheet.getLastRow() <= 1) {
    throw new Error(`HR「${HR_PERSONNEL_SHEET_NAME}」讀取失敗或無資料。`);
  }
  const emailToName = {};
  personnelSheet.getRange(2, 1, personnelSheet.getLastRow() - 1, 3).getValues().forEach(row => {
    const email = String(row[0] || '').toLowerCase().trim();
    const name = String(row[1] || '').trim();
    const status = String(row[2] || '').trim();
    if (!email || !email.includes('@')) return;
    if (HR_ACTIVE_STATUSES.indexOf(status) === -1) return;
    emailToName[email] = name || email.split('@')[0];
  });

  // 2. 組織架構樹:C 代碼、D 名稱 → 代碼轉中文名
  const orgSheet = hrSs.getSheetByName(HR_ORG_TREE_SHEET_NAME);
  const codeToOrgName = {};
  if (orgSheet && orgSheet.getLastRow() > 1) {
    orgSheet.getRange(2, 1, orgSheet.getLastRow() - 1, 4).getValues().forEach(row => {
      const code = String(row[2] || '').trim();
      const name = String(row[3] || '').trim();
      if (code && name) codeToOrgName[code] = name;
    });
  }

  // 3. 人員職務配置:A 信箱、C 組別代碼、E 職務 → 主職組別代碼 + 駐管判定
  const assignmentSheet = hrSs.getSheetByName(HR_ASSIGNMENT_SHEET_NAME);
  const emailToMainCode = {};
  const custodianSet = {};
  if (assignmentSheet && assignmentSheet.getLastRow() > 1) {
    assignmentSheet.getRange(2, 1, assignmentSheet.getLastRow() - 1, 5).getValues().forEach(row => {
      const email = String(row[0] || '').toLowerCase().trim();
      if (!email || !emailToName[email]) return; // 只處理在勤人員
      const orgCode = String(row[2] || '').trim();
      const title = String(row[4] || '').trim();
      if (title === HR_STATION_MANAGER_TITLE) custodianSet[email] = true;
      if (orgCode && orgCodeRank_(orgCode) < 99) {
        const current = emailToMainCode[email];
        if (!current || orgCodeRank_(orgCode) < orgCodeRank_(current)) {
          emailToMainCode[email] = orgCode;
        }
      }
    });
  }

  // 4. 組別代碼 → HR 中文名 → 資產系統慣用名(HR_GROUP_NAME_MAP)
  const groupNameMap = getHrGroupNameMap_();
  const emailToGroup = {};
  const groupToMembers = {};
  Object.keys(emailToMainCode).forEach(email => {
    const hrName = codeToOrgName[emailToMainCode[email]] || '';
    if (!hrName) return;
    const groupName = groupNameMap[hrName] || hrName;
    emailToGroup[email] = groupName;
    if (!groupToMembers[groupName]) groupToMembers[groupName] = [];
    groupToMembers[groupName].push(email);
  });

  return {
    emailToName: emailToName,
    emailToGroup: emailToGroup,
    groupToMembers: groupToMembers,
    custodianEmails: Object.keys(custodianSet),
    allEmails: Object.keys(emailToName)
  };
}

/**
 * 回退備援:HR 讀取失敗時改讀「保管人/信箱」同步快取表(A 姓名/B Email/C 駐管/G 組別)。
 * 已知限制:首次同步後 C 欄為空,fallback 期間駐管清單會是空的(緊急降級,可接受)。
 */
function buildKeeperDirectoryFromSheetFallback_() {
  const directory = { emailToName: {}, emailToGroup: {}, groupToMembers: {}, custodianEmails: [], allEmails: [] };
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(KEEPER_EMAIL_MAP_SHEET_NAME);
  if (!sheet || sheet.getLastRow() <= 1) return directory;
  sheet.getRange(2, 1, sheet.getLastRow() - 1, 7).getValues().forEach(row => {
    const email = String(row[1] || '').toLowerCase().trim();
    if (!email || !email.includes('@')) return;
    directory.emailToName[email] = String(row[0] || '').trim() || email.split('@')[0];
    directory.allEmails.push(email);
    if (String(row[2]).trim() === '是') directory.custodianEmails.push(email);
    const groupName = String(row[6] || '').trim();
    if (groupName) {
      directory.emailToGroup[email] = groupName;
      if (!directory.groupToMembers[groupName]) directory.groupToMembers[groupName] = [];
      directory.groupToMembers[groupName].push(email);
    }
  });
  return directory;
}

/**
 * 人員資料唯一入口(取代散落各處的「保管人/信箱」讀取)。
 * 兩層快取:同請求記憶化 + CacheService 10 分鐘;HR 失敗時回退讀舊表。
 * @returns {{emailToName:Object, emailToGroup:Object, groupToMembers:Object, custodianEmails:string[], allEmails:string[]}}
 */
function getKeeperDirectory_() {
  if (KEEPER_DIRECTORY_MEMO_) return KEEPER_DIRECTORY_MEMO_;
  const cache = CacheService.getScriptCache();
  const cached = cache.get(KEEPER_DIRECTORY_CACHE_KEY);
  if (cached) {
    KEEPER_DIRECTORY_MEMO_ = JSON.parse(cached);
    return KEEPER_DIRECTORY_MEMO_;
  }
  let directory;
  try {
    directory = buildKeeperDirectoryFromHr_();
  } catch (e) {
    Logger.log('⚠️ HR directory 建立失敗,回退讀「保管人/信箱」同步表:' + e.message);
    directory = buildKeeperDirectoryFromSheetFallback_();
  }
  try {
    cache.put(KEEPER_DIRECTORY_CACHE_KEY, JSON.stringify(directory), KEEPER_DIRECTORY_CACHE_SECONDS);
  } catch (e) {
    Logger.log('keeper directory 快取寫入失敗(不影響功能):' + e.message);
  }
  KEEPER_DIRECTORY_MEMO_ = directory;
  return directory;
}

/** 清除 directory 快取(設定變更、手動同步後呼叫) */
function clearKeeperDirectoryCache() {
  KEEPER_DIRECTORY_MEMO_ = null;
  CacheService.getScriptCache().remove(KEEPER_DIRECTORY_CACHE_KEY);
}

/** [編輯器手動執行] 檢視 directory 組裝結果,核對人數/駐管/組別分布 */
function debugKeeperDirectory() {
  clearKeeperDirectoryCache();
  const d = buildKeeperDirectoryFromHr_();
  Logger.log('在勤人數: ' + d.allEmails.length);
  Logger.log('駐管清單: ' + JSON.stringify(d.custodianEmails));
  Logger.log('組別分布: ' + JSON.stringify(Object.keys(d.groupToMembers).map(g => g + '=' + d.groupToMembers[g].length)));
  Logger.log('抽樣前 5 筆: ' + JSON.stringify(d.allEmails.slice(0, 5).map(e => [e, d.emailToName[e], d.emailToGroup[e] || ''])));
}

// --- 子專案過渡同步器 ---
// 目的:主專案已改直讀 HR,此同步器僅為餵養三個仍讀「保管人/信箱」的子專案
// (computer-report/dashboard-app 讀 B 欄白名單、isms-connect-asset 讀 B/G 欄)。
// Phase 2 子專案改直讀 HR 後,移除本段與工作表。

/**
 * 從 HR 整批重寫「保管人/信箱」:A 姓名/B Email/G 組別;C–F、H 留空但保留欄位序
 * (isms-connect-asset 以 row[6] 讀 G 欄,嚴禁改變欄位位置)。
 * 防呆:在勤人數低於 HR_SYNC_MIN_HEADCOUNT 即中止並通知管理員。
 */
function syncKeeperSheetFromHR() {
  const directory = buildKeeperDirectoryFromHr_(); // 直接重建,不吃快取
  const emails = directory.allEmails.slice().sort();
  if (emails.length < HR_SYNC_MIN_HEADCOUNT) {
    const msg = `HR 同步中止:在勤人數 ${emails.length} 低於門檻 ${HR_SYNC_MIN_HEADCOUNT},「保管人/信箱」未變更。`;
    notifyAdminsOfSyncFailure_(msg);
    throw new Error(msg);
  }
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(KEEPER_EMAIL_MAP_SHEET_NAME);
  if (!sheet) throw new Error(`找不到「${KEEPER_EMAIL_MAP_SHEET_NAME}」工作表。`);

  const rows = emails.map(email => [
    directory.emailToName[email] || '', // A 姓名
    email,                              // B Email
    '', '', '', '',                     // C–F 留空(角色已遷 properties/HR 推導)
    directory.emailToGroup[email] || '',// G 組別
    ''                                  // H 留空(已遷 ISMS_INVENTORY_GROUPS)
  ]);
  const lastRow = sheet.getLastRow();
  if (lastRow > 1) sheet.getRange(2, 1, lastRow - 1, 8).clearContent();
  sheet.getRange(2, 1, rows.length, 8).setValues(rows);

  const syncedAt = new Date().toISOString();
  PropertiesService.getScriptProperties().setProperty('HR_LAST_SYNC_AT', syncedAt);
  clearKeeperDirectoryCache();
  clearPermissionCache(); // 白名單快取一併重建
  Logger.log(`HR 同步完成:寫入 ${rows.length} 筆。`);
  return { success: true, count: rows.length, syncedAt: syncedAt };
}

/** 同步失敗時通知管理員(通知失敗只記 log,不再拋錯) */
function notifyAdminsOfSyncFailure_(message) {
  try {
    const admins = getAdminEmails();
    if (admins.length) {
      MailApp.sendEmail(admins.join(','), '[資產管理] HR 同步失敗', message);
    }
  } catch (e) {
    Logger.log('同步失敗通知寄送失敗:' + e.message);
  }
}

/** ✨ [設定視窗呼叫] 手動觸發 HR 同步(admin 守衛) */
function manualSyncFromHr() {
  if (!checkAdminPermissions()) throw new Error('權限不足:僅管理員可執行 HR 同步。');
  return syncKeeperSheetFromHR();
}

/**
 * [編輯器手動執行一次] 安裝每日 05:00 HR 同步觸發器(重複執行會先清舊觸發器,冪等)。
 */
function setupHrSyncTrigger() {
  ScriptApp.getProjectTriggers().forEach(trigger => {
    if (trigger.getHandlerFunction() === 'syncKeeperSheetFromHR') {
      ScriptApp.deleteTrigger(trigger);
    }
  });
  ScriptApp.newTrigger('syncKeeperSheetFromHR').timeBased().everyDays(1).atHour(5).create();
  Logger.log('已安裝每日 05:00 的 HR 同步觸發器。');
}
