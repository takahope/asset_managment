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
// 這四個細分狀態合稱「在職」；「在勤」只是其中一種細分狀態,不可拿來代稱整組
const HR_ACTIVE_STATUSES = ['在勤', '休假', '育嬰假', '外派人員'];

// 駐管判定:人員職務配置 E 欄職務等於此值(任一列即算,涵蓋兼任)
const HR_STATION_MANAGER_TITLE = '駐站管理員';

// 駐站類別規則(spec 2026-07-19):代碼字首(大小寫不敏感)→ 類別鍵;先具體後泛化,順序不可調換
const STATION_CATEGORY_RULES = [
  { key: 'OUTSOURCED', prefix: 'GRP-CO-EX-' },     // 委外駐站
  { key: 'PORTABLE', prefix: 'GRP-CO-PROTABLE' },  // 行動駐站(走出借流程,一般不列入存置地點)
  { key: 'PERMANENT', prefix: 'GRP-CO-' }          // 常設駐站(兜底)
];

/**
 * 判定組別代碼所屬駐站類別;非駐站代碼回傳 null。
 * @param {string} code
 * @returns {'PERMANENT'|'OUTSOURCED'|'PORTABLE'|null}
 */
function stationCategoryOf_(code) {
  const upper = String(code || '').trim().toUpperCase();
  for (let i = 0; i < STATION_CATEGORY_RULES.length; i++) {
    if (upper.indexOf(STATION_CATEGORY_RULES[i].prefix) === 0) return STATION_CATEGORY_RULES[i].key;
  }
  return null;
}

// 同步防呆:HR 在職人數低於此門檻即中止同步,避免上游異常清空白名單
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

  // 1. 人員主檔:A 信箱、B 姓名、C 狀態 → 在職過濾(離職排除契約)
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

  // 2. 組織架構樹:C 代碼、D 名稱 → 代碼轉中文名;順手收集駐站組別(GRP-CO-*)
  const orgSheet = hrSs.getSheetByName(HR_ORG_TREE_SHEET_NAME);
  const codeToOrgName = {};
  const stationGroups = [];
  if (orgSheet && orgSheet.getLastRow() > 1) {
    orgSheet.getRange(2, 1, orgSheet.getLastRow() - 1, 4).getValues().forEach(row => {
      const code = String(row[2] || '').trim();
      const name = String(row[3] || '').trim();
      if (code && name) {
        codeToOrgName[code] = name;
        if (stationCategoryOf_(code)) stationGroups.push({ code: code, name: name });
      }
    });
  }

  // 3. 人員職務配置:A 信箱、C 組別代碼、E 職務 → 主職組別代碼 + 駐管判定
  const assignmentSheet = hrSs.getSheetByName(HR_ASSIGNMENT_SHEET_NAME);
  const emailToMainCode = {};
  const custodianSet = {};
  if (assignmentSheet && assignmentSheet.getLastRow() > 1) {
    assignmentSheet.getRange(2, 1, assignmentSheet.getLastRow() - 1, 5).getValues().forEach(row => {
      const email = String(row[0] || '').toLowerCase().trim();
      if (!email || !emailToName[email]) return; // 只處理在職人員
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
    allEmails: Object.keys(emailToName),
    stationGroups: stationGroups
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
  LOCATION_CONFIG_MEMO_ = null;
  CacheService.getScriptCache().remove(KEEPER_DIRECTORY_CACHE_KEY);
}

// --- 存置地點設定(spec 2026-07-19:原「存置地點列表」工作表遷 Script Properties + HR 駐站) ---

let LOCATION_CONFIG_MEMO_ = null; // 同一請求內記憶化

/** 清除 location config 記憶化(設定儲存後呼叫,確保同請求內讀到新值) */
function clearLocationConfigMemo_() {
  LOCATION_CONFIG_MEMO_ = null;
}

/**
 * 存置地點設定唯一入口(六個讀取點皆走此,不再讀「存置地點列表」)。
 * 靜態地點來自 STATIC_LOCATIONS;駐站依 STATION_CATEGORIES 過濾 HR 組織架構樹,
 * 名稱經 HR_GROUP_NAME_MAP 轉慣用名;directory 走 fallback 時改用 STATION_NAME_SNAPSHOT。
 * 順序:靜態(設定順序)在前、駐站(組織架構樹列序)在後。
 * @returns {{locations:string[], stationLocations:string[], infoLocation:?string, intakeLocation:?string, infoComputerLocation:?string}}
 */
function getLocationConfig_() {
  if (LOCATION_CONFIG_MEMO_) return LOCATION_CONFIG_MEMO_;
  const props = PropertiesService.getScriptProperties().getProperties();
  const staticLocations = String(props['STATIC_LOCATIONS'] || '')
    .split(/\n+/).map(s => s.trim()).filter(Boolean);
  const enabledCategories = String(props['STATION_CATEGORIES'] || '')
    .split(/[\n,;]+/).map(s => s.trim().toUpperCase()).filter(Boolean);

  // 駐站名冊:HR 直讀優先;fallback 物件無 stationGroups 鍵時降級用快照
  let stationGroups = getKeeperDirectory_().stationGroups;
  if (!Array.isArray(stationGroups)) {
    try {
      const snapshot = JSON.parse(props['STATION_NAME_SNAPSHOT'] || '{}');
      stationGroups = Object.keys(snapshot).map(code => ({ code: code, name: snapshot[code] }));
    } catch (e) {
      Logger.log('STATION_NAME_SNAPSHOT 解析失敗(駐站清單降級為空):' + e.message);
      stationGroups = [];
    }
  }

  const groupNameMap = getHrGroupNameMap_();
  const stationLocations = stationGroups
    .filter(g => enabledCategories.indexOf(stationCategoryOf_(g.code)) !== -1)
    .map(g => groupNameMap[g.name] || g.name)
    .filter(Boolean);

  LOCATION_CONFIG_MEMO_ = {
    locations: staticLocations.concat(stationLocations),
    stationLocations: stationLocations,
    infoLocation: String(props['INFO_LOCATION'] || '').trim() || null,
    intakeLocation: String(props['INTAKE_LOCATION'] || '').trim() || null,
    infoComputerLocation: String(props['INFO_COMPUTER_LOCATION'] || '').trim() || null
  };
  return LOCATION_CONFIG_MEMO_;
}

/** 判斷地點是否為駐站(批次轉移/審核/新增資產的電腦欄位標記用) */
function isStationLocation_(name) {
  const normalized = String(name || '').trim();
  if (!normalized) return false;
  return getLocationConfig_().stationLocations.indexOf(normalized) !== -1;
}

/**
 * 以 HR 當前駐站名冊更新 STATION_NAME_SNAPSHOT(收錄全部 GRP-CO-*,含未啟用類別;name 存 HR 原名)。
 * 只在每日同步/手動同步/設定儲存/一次性遷移呼叫;讀取路徑禁止寫入。
 * 空陣列不寫入,避免 HR 暫時故障時清空既有快照。
 * @param {Array<{code:string,name:string}>} stationGroups
 */
function updateStationNameSnapshot_(stationGroups) {
  if (!Array.isArray(stationGroups) || !stationGroups.length) return;
  try {
    const snapshot = {};
    stationGroups.forEach(g => { snapshot[g.code] = g.name; });
    PropertiesService.getScriptProperties().setProperty('STATION_NAME_SNAPSHOT', JSON.stringify(snapshot));
  } catch (e) {
    Logger.log('STATION_NAME_SNAPSHOT 更新失敗(不影響主流程):' + e.message);
  }
}

/**
 * [設定視窗用] 直讀 HR 組織架構樹取得全部駐站候選(不吃快取,管理介面要即時);
 * HR 失敗時退回快照。name 已經過 HR_GROUP_NAME_MAP 轉換、hrName 為 HR 原名。
 * @returns {Array<{code:string, name:string, hrName:string, category:string}>}
 */
function getStationCandidates_() {
  const groupNameMap = getHrGroupNameMap_();
  let hrCandidates = [];
  try {
    const hrSs = SpreadsheetApp.openById(getHrSpreadsheetId_());
    const orgSheet = hrSs.getSheetByName(HR_ORG_TREE_SHEET_NAME);
    
    if (orgSheet && orgSheet.getLastRow() > 1) {
      orgSheet.getRange(2, 1, orgSheet.getLastRow() - 1, 4).getValues().forEach(row => {
        const code = String(row[2] || '').trim();
        const hrName = String(row[3] || '').trim();
        const category = stationCategoryOf_(code);
        
        // 略過 PORTABLE，因其將由外部試算表提供
        if (code && hrName && category && category !== 'PORTABLE') {
          hrCandidates.push({ code: code, name: groupNameMap[hrName] || hrName, hrName: hrName, category: category });
        }
      });
    }
  } catch (e) {
    Logger.log('駐站候選直讀 HR 失敗,改用快照:' + e.message);
    try {
      const snapshot = JSON.parse(PropertiesService.getScriptProperties().getProperty('STATION_NAME_SNAPSHOT') || '{}');
      hrCandidates = Object.keys(snapshot).map(code => ({
        code: code,
        name: groupNameMap[snapshot[code]] || snapshot[code],
        hrName: snapshot[code],
        category: stationCategoryOf_(code)
      })).filter(c => c.category && c.category !== 'PORTABLE');
    } catch (e2) {
      hrCandidates = [];
    }
  }

  // 合併外部行動駐站
  const portableStations = getPortableStationObjects_();
  return hrCandidates.concat(portableStations);
}

/** [編輯器手動執行] 檢視 directory 組裝結果,核對人數/駐管/組別分布 */
function debugKeeperDirectory() {
  clearKeeperDirectoryCache();
  const d = buildKeeperDirectoryFromHr_();
  Logger.log('在職人數: ' + d.allEmails.length);
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
 * 防呆:在職人數低於 HR_SYNC_MIN_HEADCOUNT 即中止(不寄送通知,GAS 觸發器失敗會自動通知 script owner)。
 */
function syncKeeperSheetFromHR() {
  const directory = buildKeeperDirectoryFromHr_(); // 直接重建,不吃快取
  const emails = directory.allEmails.slice().sort();
  if (emails.length < HR_SYNC_MIN_HEADCOUNT) {
    const msg = `HR 同步中止:在職人數 ${emails.length} 低於門檻 ${HR_SYNC_MIN_HEADCOUNT},「保管人/信箱」未變更。`;
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
  updateStationNameSnapshot_(directory.stationGroups);
  clearKeeperDirectoryCache();
  clearPermissionCache(); // 白名單快取一併重建
  Logger.log(`HR 同步完成:寫入 ${rows.length} 筆。`);
  return { success: true, count: rows.length, syncedAt: syncedAt };
}


/** ✨ [設定視窗呼叫] 手動觸發 HR 同步(admin 守衛) */
function manualSyncFromHr() {
  if (!checkAdminPermissions()) throw new Error('權限不足:僅管理員可執行 HR 同步。');
  return syncKeeperSheetFromHR();
}

/**
 * 取得 HR 組織架構樹中的所有官方組別名稱(供設定 UI 顯示用)
 * @returns {string[]}
 */
function getHrOfficialGroups_() {
  try {
    const hrSs = SpreadsheetApp.openById(getHrSpreadsheetId_());
    const orgSheet = hrSs.getSheetByName(HR_ORG_TREE_SHEET_NAME);
    if (!orgSheet || orgSheet.getLastRow() <= 1) return [];
    const names = new Set();
    orgSheet.getRange(2, 1, orgSheet.getLastRow() - 1, 4).getValues().forEach(row => {
      const code = String(row[2] || '').trim();
      const name = String(row[3] || '').trim();
      // ✨ 根據 ECOSYSTEM 契約，只列出權重小於 99 的組織 (PRE, CEO, DEPT-*, GRP-*)
      if (name && orgCodeRank_(code) < 99) {
        names.add(name);
      }
    });
    return Array.from(names).sort((a, b) => a.localeCompare(b, 'zh-Hant'));
  } catch (e) {
    Logger.log('無法取得 HR 組織名稱: ' + e.message);
    return [];
  }
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

// --- 存置地點一次性遷移與驗證工具(spec 2026-07-19;觀察期後可整段移除) ---

/**
 * [編輯器手動執行一次] 「存置地點列表」A–E 欄 → Script Properties。
 * 冪等:重跑整組覆蓋;執行前先 log 舊值以便回復。
 * B=是 的列比對 HR 駐站顯示名 → 推定 STATION_CATEGORIES;對不到者暫歸靜態清單保底。
 */
function migrateLocationSheetToProperties() {
  const props = PropertiesService.getScriptProperties();
  const oldValues = {};
  ['STATIC_LOCATIONS', 'STATION_CATEGORIES', 'STATION_NAME_SNAPSHOT', 'INFO_LOCATION', 'INTAKE_LOCATION', 'INFO_COMPUTER_LOCATION'].forEach(key => {
    oldValues[key] = props.getProperty(key);
  });
  Logger.log('遷移前舊值(回復用):' + JSON.stringify(oldValues));

  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(KEEPER_LOCATION_MAP_SHEET_NAME);
  if (!sheet || sheet.getLastRow() <= 1) throw new Error('「存置地點列表」工作表讀取失敗或無資料。');
  const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, 5).getValues();

  // HR 駐站名冊(強制重建,不吃快取;HR 失敗直接 throw,遷移不允許降級)
  clearKeeperDirectoryCache();
  const directory = buildKeeperDirectoryFromHr_();
  const groupNameMap = getHrGroupNameMap_();
  const displayNameToStation = {};
  (directory.stationGroups || []).forEach(g => {
    displayNameToStation[groupNameMap[g.name] || g.name] = g;
  });

  const staticList = [];
  const matchedCategories = [];
  const unmatchedStations = [];
  let infoLocation = '';
  let intakeLocation = '';
  let infoComputerLocation = '';

  rows.forEach(row => {
    const name = String(row[0] || '').trim();
    if (!name) return;
    if (String(row[2] || '').trim() === '是' && !infoLocation) infoLocation = name;
    if (String(row[3] || '').trim() === '是' && !intakeLocation) intakeLocation = name;
    if (String(row[4] || '').trim() === '是' && !infoComputerLocation) infoComputerLocation = name;
    if (String(row[1] || '').trim() === '是') {
      const station = displayNameToStation[name];
      if (station) {
        const category = stationCategoryOf_(station.code);
        if (category && matchedCategories.indexOf(category) === -1) matchedCategories.push(category);
      } else {
        unmatchedStations.push(name);
        if (staticList.indexOf(name) === -1) staticList.push(name); // 保底不掉地點
      }
    } else {
      if (staticList.indexOf(name) === -1) staticList.push(name);
    }
  });

  props.setProperty('STATIC_LOCATIONS', staticList.join('\n'));
  props.setProperty('STATION_CATEGORIES', matchedCategories.join(','));
  props.setProperty('INFO_LOCATION', infoLocation);
  props.setProperty('INTAKE_LOCATION', intakeLocation);
  props.setProperty('INFO_COMPUTER_LOCATION', infoComputerLocation);
  updateStationNameSnapshot_(directory.stationGroups || []);
  clearKeeperDirectoryCache();

  Logger.log('=== 遷移報告 ===');
  Logger.log('STATIC_LOCATIONS(' + staticList.length + ' 筆):\n' + staticList.join('\n'));
  Logger.log('STATION_CATEGORIES:' + (matchedCategories.join(',') || '(無)'));
  Logger.log('INFO_LOCATION:' + (infoLocation || '(未設定)'));
  Logger.log('INTAKE_LOCATION:' + (intakeLocation || '(未設定)'));
  Logger.log('INFO_COMPUTER_LOCATION:' + (infoComputerLocation || '(未設定)'));
  Logger.log('工作表有但 HR 對不到的駐站(已暫歸靜態清單):' + (unmatchedStations.join('、') || '(無)'));
}

/**
 * [編輯器手動執行] 比對 getLocationConfig_() 與現行工作表;遷移後 diff 必須為空(硬性驗收證據)。
 */
function debugLocationConfig() {
  clearKeeperDirectoryCache();
  const config = getLocationConfig_();

  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(KEEPER_LOCATION_MAP_SHEET_NAME);
  const rows = (sheet && sheet.getLastRow() > 1)
    ? sheet.getRange(2, 1, sheet.getLastRow() - 1, 5).getValues()
    : [];
  const sheetLocations = rows.map(r => String(r[0] || '').trim()).filter(Boolean);
  const sheetStations = rows.filter(r => String(r[1] || '').trim() === '是').map(r => String(r[0] || '').trim());
  const firstFlag = colIndex => {
    const hit = rows.filter(r => String(r[colIndex] || '').trim() === '是')[0];
    return hit ? String(hit[0]).trim() : null;
  };
  const logDiff = (label, sheetSide, configSide) => {
    const onlySheet = sheetSide.filter(x => configSide.indexOf(x) === -1);
    const onlyConfig = configSide.filter(x => sheetSide.indexOf(x) === -1);
    Logger.log('=== ' + label + ' diff ===');
    Logger.log('工作表有但新設定沒有:' + (onlySheet.join('、') || '(無)'));
    Logger.log('新設定有但工作表沒有:' + (onlyConfig.join('、') || '(無)'));
  };

  logDiff('地點集合', sheetLocations, config.locations);
  logDiff('駐站集合', sheetStations, config.stationLocations);
  Logger.log('=== 特殊地點 ===');
  Logger.log('資訊組:表=' + firstFlag(2) + ' / 新=' + config.infoLocation + (firstFlag(2) === config.infoLocation ? ' ✔' : ' ✘'));
  Logger.log('收案組:表=' + firstFlag(3) + ' / 新=' + config.intakeLocation + (firstFlag(3) === config.intakeLocation ? ' ✔' : ' ✘'));
  Logger.log('電腦專用:表=' + firstFlag(4) + ' / 新=' + config.infoComputerLocation + (firstFlag(4) === config.infoComputerLocation ? ' ✔' : ' ✘'));
}
