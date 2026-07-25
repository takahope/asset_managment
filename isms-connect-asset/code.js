// ==========================================
// ISMS 資產對照管理系統 - 後端 API
// ==========================================

// HR 在職狀態值域(四值合稱「在職」;「在勤」只是其中一種細分狀態)
const HR_ACTIVE_STATUSES = ['在勤', '休假', '育嬰假', '外派人員'];
const HR_GROUP_MAP_CACHE_KEY = 'hr_email_group_map_v1';
const HR_GROUP_MAP_CACHE_SECONDS = 600; // 10 分鐘

/**
 * Web App 入口點
 */
function doGet(e) {
  const email = Session.getActiveUser().getEmail();
  // 白名單檢查 — 不在 ISMS 試算表「權限」工作表 A 欄者一律拒絕
  if (!isInWhitelist_(email)) {
    return createAccessDeniedPage_(email);
  }

  const page = (e && e.parameter && e.parameter.page) ? e.parameter.page : '';
  // 路由：預設=index, connect=對照管理, softwarelist=軟體清冊
  var file = 'index';
  var title = '資訊資產清單';
  if (page === 'connect') { file = 'connect'; title = '資產與資訊資產對照管理'; }
  else if (page === 'softwarelist') { file = 'softwarelist'; title = '軟體清冊管理'; }
  const html = HtmlService.createHtmlOutputFromFile(file);
  html.setTitle(title);
  html.addMetaTag('viewport', 'width=device-width, initial-scale=1.0');
  html.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  return html;
}

/**
 * 拒絕存取頁面
 */
function createAccessDeniedPage_(email) {
  const safeEmail = String(email || '(unknown)').replace(/[<>&"]/g, c => ({
    '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;'
  }[c]));
  return HtmlService.createHtmlOutput(
    '<!DOCTYPE html><html lang="zh-TW"><head><meta charset="UTF-8"><title>存取被拒</title>' +
    '<style>body{font-family:"Noto Sans TC",sans-serif;background:#f8fafc;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;}' +
    '.box{background:white;border-radius:12px;padding:40px 48px;box-shadow:0 4px 20px rgba(15,23,42,0.08);max-width:480px;text-align:center;}' +
    '.icon{font-size:48px;color:#dc2626;margin-bottom:16px;}h1{color:#0f172a;font-size:20px;margin:0 0 12px;}' +
    'p{color:#64748b;font-size:14px;line-height:1.6;margin:8px 0;}.email{font-family:Menlo,monospace;background:#f1f5f9;padding:2px 8px;border-radius:4px;}</style></head>' +
    '<body><div class="box"><div class="icon">⛔</div><h1>存取被拒</h1>' +
    '<p>您的帳號 <span class="email">' + safeEmail + '</span> 不在資訊資產系統的授權名單中。</p>' +
    '<p>如需存取權限,請聯絡系統管理員將您加入「權限」工作表的白名單。</p></div></body></html>'
  );
}

// ==========================================
// 輔助函式
// ==========================================

/**
 * 取得當前使用者資訊
 */
function getCurrentUser() {
  const email = Session.getActiveUser().getEmail();
  return {
    email: email,
    isAdmin: checkIsAdmin_(email)
  };
}

/**
 * 讀取 ISMS 權限工作表,回傳 {whitelist:Set, admins:Set}
 * 結果快取 5 分鐘,減少試算表存取
 */
function getPermissionLists_() {
  const cache = CacheService.getScriptCache();
  const cacheKey = 'isms_permission_lists_v1';
  const cached = cache.get(cacheKey);
  if (cached) {
    try {
      const obj = JSON.parse(cached);
      return { whitelist: new Set(obj.whitelist || []), admins: new Set(obj.admins || []) };
    } catch (_) { /* fall through to fresh read */ }
  }

  const whitelist = new Set();
  const admins = new Set();
  try {
    const ss = SpreadsheetApp.openById(CONFIG.ISMS_SPREADSHEET_ID);
    const sheet = ss.getSheetByName(CONFIG.ISMS_PERMISSION_SHEET_NAME);
    if (sheet && sheet.getLastRow() >= 1) {
      // 讀 A、B 兩欄(可能有表頭,從第 1 列開始全收,toLowerCase 後比對自然會排除非 email)
      const data = sheet.getRange(1, 1, sheet.getLastRow(), 2).getValues();
      for (let i = 0; i < data.length; i++) {
        const a = String(data[i][0] || '').trim().toLowerCase();
        const b = String(data[i][1] || '').trim().toLowerCase();
        if (a && a.indexOf('@') > 0) whitelist.add(a);
        if (b && b.indexOf('@') > 0) {
          admins.add(b);
          whitelist.add(b); // 管理員自動視為白名單
        }
      }
    }
  } catch (e) {
    console.error('讀取權限工作表失敗:', e);
  }

  try {
    cache.put(cacheKey, JSON.stringify({
      whitelist: Array.from(whitelist),
      admins: Array.from(admins)
    }), 300); // 5 分鐘
  } catch (_) {}

  return { whitelist, admins };
}

/**
 * 清除權限快取(改完權限工作表後可手動執行)
 *
 * ⚠️ 這是唯一「刻意不做權限檢查」的寫入型端點,原因是會死鎖:
 * 管理員把自己加進「權限」B 欄後要清快取才會生效,但若此函式先檢查管理員,
 * 檢查讀到的正是那份還沒清掉的舊快取 → 永遠過不了 → 只能乾等 5 分鐘。
 * 影響面僅止於「強迫下次重讀工作表」,不洩漏也不竄改資料,故接受此風險。
 */
function clearPermissionCache() {
  CacheService.getScriptCache().remove('isms_permission_lists_v1');
}

/**
 * 檢查是否在白名單(A 欄或 B 欄)
 */
function isInWhitelist_(email) {
  if (!email) return false;
  const lists = getPermissionLists_();
  return lists.whitelist.has(String(email).toLowerCase().trim());
}

/**
 * 檢查是否為管理員(B 欄)
 */
function checkIsAdmin_(email) {
  if (!email) return false;
  const lists = getPermissionLists_();
  return lists.admins.has(String(email).toLowerCase().trim());
}

/**
 * 寫入端點統一守門。
 *
 * 為什麼每個寫入端點都要自己呼叫:google.script.run 直接打到後端函式,
 * **不會經過 doGet**,所以 doGet 的白名單擋不到它。任何拿得到 Web App URL
 * 的網域使用者都能在 console 直接呼叫後端函式。
 *
 * 權限模型是「角色制」而非「擁有者制」:資訊資產與對照表沒有擁有者欄位,
 * 是全所共用的登錄簿(ISMS 承辦人本來就要代表全所建對照),因此不做
 * leaderEmail/userEmail 比對,只分白名單與管理員兩級。
 *
 * 讀不到「權限」工作表時 getPermissionLists_() 回傳空集合 → 一律拒絕(fail-closed)。
 *
 * @param {boolean} requireAdmin true=僅管理員(B 欄);false=白名單即可(A 或 B 欄)
 * @returns {{ok:boolean, email:string, isAdmin:boolean, error:string}}
 */
function assertWriteAccess_(requireAdmin) {
  const email = String(Session.getActiveUser().getEmail() || '').trim();
  if (!email) {
    console.warn('權限拒絕(取不到身分)');
    return { ok: false, email: '', isAdmin: false, error: '無法取得您的帳號身分,請重新登入後再試。' };
  }

  const key = email.toLowerCase();
  const lists = getPermissionLists_();
  const isAdmin = lists.admins.has(key);

  if (!lists.whitelist.has(key)) {
    console.warn('權限拒絕(非白名單):' + email);
    return { ok: false, email: email, isAdmin: false, error: '您的帳號不在資訊資產系統的授權名單中,請聯絡系統管理員。' };
  }

  if (requireAdmin && !isAdmin) {
    console.warn('權限拒絕(非管理員):' + email);
    return { ok: false, email: email, isAdmin: false, error: '此操作僅限管理員。' };
  }

  return { ok: true, email: email, isAdmin: isAdmin, error: '' };
}

/**
 * 讀取 HR 主表試算表 ID(本專案 Script Property;與主專案各設一次)
 * @returns {string}
 */
function getHrSpreadsheetId_() {
  const id = PropertiesService.getScriptProperties().getProperty('HR_SPREADSHEET_ID');
  if (!id) {
    throw new Error('尚未設定 HR_SPREADSHEET_ID(本專案 Script Property)。');
  }
  return String(id).trim();
}

/**
 * HR 組別名 → 本系統組別名 轉換表(本專案 Script Property HR_GROUP_NAME_MAP,值同主專案)
 * @returns {Object}
 */
function getHrGroupNameMap_() {
  const raw = PropertiesService.getScriptProperties().getProperty('HR_GROUP_NAME_MAP');
  if (!raw) return {};
  try {
    return JSON.parse(raw) || {};
  } catch (e) {
    console.error('HR_GROUP_NAME_MAP 解析失敗(視為空表):', e);
    return {};
  }
}

/**
 * 主職判定順序(ECOSYSTEM 契約):PRE → CEO → DEPT-* → GRP-*;其餘(含 TF-*)視為兼任(99)。
 * @param {string} code 組別代碼
 * @returns {number}
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
 * 直讀 HR 三表,回傳在職人員的 email → 組別對照(已過名稱轉換)。
 * HR 讀取失敗時 throw,由呼叫端 fallback。
 * @returns {Object} { [emailLower]: groupName }
 */
function getHrEmailToGroupMap_() {
  const hrSs = SpreadsheetApp.openById(getHrSpreadsheetId_());

  // 1. 人員主檔 A/C → 在職 email 集合
  const personnelSheet = hrSs.getSheetByName(CONFIG.HR_PERSONNEL_SHEET_NAME);
  if (!personnelSheet || personnelSheet.getLastRow() <= 1) {
    throw new Error(`HR「${CONFIG.HR_PERSONNEL_SHEET_NAME}」讀取失敗或無資料。`);
  }
  const activeEmails = {};
  personnelSheet.getRange(2, 1, personnelSheet.getLastRow() - 1, 3).getValues().forEach(row => {
    const email = String(row[0] || '').toLowerCase().trim();
    const status = String(row[2] || '').trim();
    if (!email || !email.includes('@')) return;
    if (HR_ACTIVE_STATUSES.indexOf(status) === -1) return;
    activeEmails[email] = true;
  });

  // 2. 組織架構樹 C/D → 代碼轉中文名
  const orgSheet = hrSs.getSheetByName(CONFIG.HR_ORG_TREE_SHEET_NAME);
  const codeToOrgName = {};
  if (orgSheet && orgSheet.getLastRow() > 1) {
    orgSheet.getRange(2, 1, orgSheet.getLastRow() - 1, 4).getValues().forEach(row => {
      const code = String(row[2] || '').trim();
      const name = String(row[3] || '').trim();
      if (code && name) codeToOrgName[code] = name;
    });
  }

  // 3. 人員職務配置 A/C/E → 每人主職組別代碼(只取在職者)
  const assignmentSheet = hrSs.getSheetByName(CONFIG.HR_ASSIGNMENT_SHEET_NAME);
  const emailToMainCode = {};
  if (assignmentSheet && assignmentSheet.getLastRow() > 1) {
    assignmentSheet.getRange(2, 1, assignmentSheet.getLastRow() - 1, 5).getValues().forEach(row => {
      const email = String(row[0] || '').toLowerCase().trim();
      if (!email || !activeEmails[email]) return;
      const orgCode = String(row[2] || '').trim();
      if (orgCode && orgCodeRank_(orgCode) < 99) {
        const current = emailToMainCode[email];
        if (!current || orgCodeRank_(orgCode) < orgCodeRank_(current)) {
          emailToMainCode[email] = orgCode;
        }
      }
    });
  }

  // 4. 代碼 → HR 中文名 → 本系統組別名
  const groupNameMap = getHrGroupNameMap_();
  const emailToGroup = {};
  Object.keys(emailToMainCode).forEach(email => {
    const hrName = codeToOrgName[emailToMainCode[email]] || '';
    if (!hrName) return;
    emailToGroup[email] = groupNameMap[hrName] || hrName;
  });
  return emailToGroup;
}

/**
 * 清除 HR 組別對照快取(改 HR/property 後可手動執行)
 * 僅限管理員。與 clearPermissionCache 不同,這裡沒有死鎖問題
 * (權限快取與 HR 快取是兩把不同的 key)。
 */
function clearHrGroupMapCache() {
  const access = assertWriteAccess_(true);
  if (!access.ok) return { success: false, error: access.error };

  CacheService.getScriptCache().remove(HR_GROUP_MAP_CACHE_KEY);
  return { success: true, message: 'HR 組別對照快取已清除' };
}

/**
 * Fallback:讀「保管人/信箱」G 欄建立 Email -> 組別對照(HR 直讀失敗時使用;該表由主專案每日同步維護)。
 */
function getEmailToGroupMapFallback_() {
  const emailToGroupMap = {};
  try {
    const ss = SpreadsheetApp.openById(CONFIG.ASSET_SPREADSHEET_ID);
    const sheet = ss.getSheetByName('保管人/信箱');

    if (!sheet || sheet.getLastRow() <= 1) {
      return emailToGroupMap;
    }

    const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 7).getValues();

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const email = row[1]; // B欄：Email
      const groupName = row[6]; // G欄：組別

      if (email && groupName) {
        const normalizedEmail = String(email).toLowerCase().trim();
        emailToGroupMap[normalizedEmail] = String(groupName).trim();
      }
    }
  } catch (e) {
    console.error('讀取保管人/信箱工作表失敗:', e);
  }

  return emailToGroupMap;
}

/**
 * 建立 Email -> 組別對照表(Phase 2:直讀 HR;失敗 fallback 讀舊表 G 欄;10 分鐘快取)。
 * 對外簽名不變,回傳 { [emailLower]: groupName }。
 */
function getEmailToGroupMap_() {
  const cache = CacheService.getScriptCache();
  const cached = cache.get(HR_GROUP_MAP_CACHE_KEY);
  if (cached) {
    try { return JSON.parse(cached); } catch (_) { /* fall through */ }
  }
  let map;
  try {
    map = getHrEmailToGroupMap_();
  } catch (e) {
    console.error('直讀 HR 組別失敗，回退讀「保管人/信箱」G 欄:', e);
    map = getEmailToGroupMapFallback_();
  }
  try {
    cache.put(HR_GROUP_MAP_CACHE_KEY, JSON.stringify(map), HR_GROUP_MAP_CACHE_SECONDS);
  } catch (_) {}
  return map;
}

/**
 * 取得資產的組別（優先使用 DEFAULT_GROUP，其次查詢使用人 email，最後查詢保管人 email）
 */
function getAssetGroup_(asset, emailToGroupMap) {
  // 第一優先：使用資產的 DEFAULT_GROUP
  if (asset.defaultGroup) {
    return String(asset.defaultGroup).trim();
  }

  // 第二優先：根據使用人 email 查詢組別
  if (asset.userEmail) {
    const normalizedEmail = String(asset.userEmail).toLowerCase().trim();
    const groupName = emailToGroupMap[normalizedEmail];
    if (groupName) {
      return groupName;
    }
  }

  // 第三優先：根據保管人 email 查詢組別
  if (asset.leaderEmail) {
    const normalizedLeaderEmail = String(asset.leaderEmail).toLowerCase().trim();
    const groupName = emailToGroupMap[normalizedLeaderEmail];
    if (groupName) {
      return groupName;
    }
  }

  // 預設值
  return '未分組';
}

/**
 * 取得對照表 Map（資產編號 -> 對照資料）
 */
function getMappingMap_() {
  const ss = SpreadsheetApp.openById(CONFIG.ISMS_SPREADSHEET_ID);
  const sheet = ss.getSheetByName(CONFIG.MAPPING_SHEET_NAME);

  const map = new Map();
  if (!sheet) return map;

  const data = sheet.getDataRange().getValues();
  const indices = MAPPING_COLUMN_INDICES;

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const assetId = row[indices.ASSET_ID - 1];
    if (assetId) {
      map.set(assetId.toString(), {
        assetId: assetId.toString(),
        ismsAssetId: row[indices.ISMS_ASSET_ID - 1] ? row[indices.ISMS_ASSET_ID - 1].toString() : '',
        createdTime: row[indices.CREATED_TIME - 1] ? row[indices.CREATED_TIME - 1].toString() : '',
        createdBy: row[indices.CREATED_BY - 1] ? row[indices.CREATED_BY - 1].toString() : '',
        remarks: row[indices.REMARKS - 1] ? row[indices.REMARKS - 1].toString() : '',
        rowIndex: i + 1
      });
    }
  }
  return map;
}

/**
 * 將資產工作表列轉換為物件
 */
function mapRowToAssetObject_(row, indices, sourceSheet) {
  return {
    assetId: row[indices.ASSET_ID - 1] ? row[indices.ASSET_ID - 1].toString() : '',
    assetName: row[indices.ASSET_NAME - 1] ? row[indices.ASSET_NAME - 1].toString() : '',
    modelBrand: row[indices.MODEL_BRAND - 1] ? row[indices.MODEL_BRAND - 1].toString() : '',
    location: row[indices.LOCATION - 1] ? row[indices.LOCATION - 1].toString() : '',
    leaderName: row[indices.LEADER_NAME - 1] ? row[indices.LEADER_NAME - 1].toString() : '',
    leaderEmail: row[indices.LEADER_EMAIL - 1] ? row[indices.LEADER_EMAIL - 1].toString() : '',
    userName: row[indices.USER_NAME - 1] ? row[indices.USER_NAME - 1].toString() : '',
    userEmail: row[indices.USER_EMAIL - 1] ? row[indices.USER_EMAIL - 1].toString() : '',
    assetCategory: row[indices.ASSET_CATEGORY - 1] ? row[indices.ASSET_CATEGORY - 1].toString() : '',
    assetStatus: row[indices.ASSET_STATUS - 1] ? row[indices.ASSET_STATUS - 1].toString() : '',
    isItAsset: row[indices.IS_IT_ASSET - 1] ? row[indices.IS_IT_ASSET - 1].toString() : '',
    isIsoScope: row[indices.IS_ISO_SCOPE - 1] ? row[indices.IS_ISO_SCOPE - 1].toString() : '',
    defaultGroup: row[indices.DEFAULT_GROUP - 1] ? row[indices.DEFAULT_GROUP - 1].toString() : '',
    sourceSheet: sourceSheet
  };
}

/**
 * 將資訊資產工作表列轉換為物件
 */
function mapRowToIsmsAssetObject_(row) {
  const indices = ISMS_ASSET_COLUMN_INDICES;
  return {
    ismsAssetId: row[indices.ISMS_ASSET_ID - 1] ? row[indices.ISMS_ASSET_ID - 1].toString() : '',
    category: row[indices.CATEGORY - 1] ? row[indices.CATEGORY - 1].toString() : '',
    name: row[indices.NAME - 1] ? row[indices.NAME - 1].toString() : '',
    description: row[indices.DESCRIPTION - 1] ? row[indices.DESCRIPTION - 1].toString() : '',
    quantity: (row[indices.INVENTORY_COUNT - 1] ? row[indices.INVENTORY_COUNT - 1].toString() : '') ||
              (row[indices.QUANTITY - 1] ? row[indices.QUANTITY - 1].toString() : ''),
    quantityOriginal: row[indices.QUANTITY - 1] ? row[indices.QUANTITY - 1].toString() : '',
    location: row[indices.LOCATION - 1] ? row[indices.LOCATION - 1].toString() : '',
    responsibleUnit: row[indices.RESPONSIBLE_UNIT - 1] ? row[indices.RESPONSIBLE_UNIT - 1].toString() : '',
    mainCategory: row[indices.MAIN_CATEGORY - 1] ? row[indices.MAIN_CATEGORY - 1].toString() : '',
    subCategory: row[indices.SUB_CATEGORY - 1] ? row[indices.SUB_CATEGORY - 1].toString() : '',
    brand: row[indices.BRAND - 1] ? row[indices.BRAND - 1].toString() : '',
    model: row[indices.MODEL - 1] ? row[indices.MODEL - 1].toString() : '',
    version: row[indices.VERSION - 1] ? row[indices.VERSION - 1].toString() : '',
    status: row[indices.STATUS - 1] ? row[indices.STATUS - 1].toString() : '',
    centerCategory: row[indices.CENTER_CATEGORY - 1] ? row[indices.CENTER_CATEGORY - 1].toString() : '',
    confidentiality: row[indices.CONFIDENTIALITY - 1] ? row[indices.CONFIDENTIALITY - 1].toString() : '',
    integrity: row[indices.INTEGRITY - 1] ? row[indices.INTEGRITY - 1].toString() : '',
    availability: row[indices.AVAILABILITY - 1] ? row[indices.AVAILABILITY - 1].toString() : '',
    assetValue: row[indices.ASSET_VALUE - 1] ? row[indices.ASSET_VALUE - 1].toString() : '',
    group: row[indices.GROUP - 1] ? row[indices.GROUP - 1].toString() : '',
    serialNo: row[indices.SERIAL_NO - 1] ? row[indices.SERIAL_NO - 1].toString() : '',
    inventoryCount: row[indices.INVENTORY_COUNT - 1] ? row[indices.INVENTORY_COUNT - 1].toString() : '',
    businessProcess: row[indices.BUSINESS_PROCESS - 1] ? row[indices.BUSINESS_PROCESS - 1].toString() : ''
  };
}

// ==========================================
// 資產 API
// ==========================================

/**
 * 取得資產清單（含對照狀態）
 * @param {Object} options - 篩選選項
 * @returns {Object} 資產清單與統計
 */
function getAssetsWithMappingStatus(options = {}) {
  try {
    const ss = SpreadsheetApp.openById(CONFIG.ASSET_SPREADSHEET_ID);
    const assets = [];

    // 建立 Email -> 組別對照表
    const emailToGroupMap = getEmailToGroupMap_();

    // 讀取財產總表
    const propertySheet = ss.getSheetByName(CONFIG.PROPERTY_MASTER_SHEET_NAME);
    if (propertySheet) {
      const propertyData = propertySheet.getDataRange().getValues();
      for (let i = 1; i < propertyData.length; i++) {
        const asset = mapRowToAssetObject_(propertyData[i], PROPERTY_COLUMN_INDICES, '財產');
        if (asset.assetId && asset.assetStatus !== '已報廢') {
          // 使用雙層分組邏輯計算組別
          asset.group = getAssetGroup_(asset, emailToGroupMap);
          assets.push(asset);
        }
      }
    }

    // 讀取物品總表
    const itemSheet = ss.getSheetByName(CONFIG.ITEM_MASTER_SHEET_NAME);
    if (itemSheet) {
      const itemData = itemSheet.getDataRange().getValues();
      for (let i = 1; i < itemData.length; i++) {
        const asset = mapRowToAssetObject_(itemData[i], ITEM_COLUMN_INDICES, '物品');
        if (asset.assetId && asset.assetStatus !== '已報廢') {
          // 使用雙層分組邏輯計算組別
          asset.group = getAssetGroup_(asset, emailToGroupMap);
          assets.push(asset);
        }
      }
    }

    // 取得對照表
    const mappingMap = getMappingMap_();

    // 合併對照狀態
    const result = assets.map(asset => {
      const mapping = mappingMap.get(asset.assetId);
      return {
        ...asset,
        isMapped: !!mapping,
        mappedIsmsAssetId: mapping ? mapping.ismsAssetId : '',
        mappingRemarks: mapping ? mapping.remarks : ''
      };
    });

    // 篩選
    let filtered = result;

    if (options.unmappedOnly) {
      filtered = filtered.filter(a => !a.isMapped);
    }

    if (options.searchKeyword) {
      const keyword = options.searchKeyword.toLowerCase();
      filtered = filtered.filter(a =>
        a.assetId.toLowerCase().includes(keyword) ||
        a.assetName.toLowerCase().includes(keyword) ||
        a.leaderName.toLowerCase().includes(keyword) ||
        a.location.toLowerCase().includes(keyword)
      );
    }

    if (options.filterGroup) {
      filtered = filtered.filter(a => a.group === options.filterGroup);
    }

    // 統計
    const totalCount = result.length;
    const mappedCount = result.filter(a => a.isMapped).length;
    const unmappedCount = totalCount - mappedCount;
    const mappingRate = totalCount > 0 ? Math.round((mappedCount / totalCount) * 100) : 0;

    return {
      success: true,
      assets: filtered,
      statistics: {
        totalCount,
        mappedCount,
        unmappedCount,
        mappingRate
      }
    };
  } catch (e) {
    console.error('getAssetsWithMappingStatus 錯誤:', e);
    return { success: false, error: e.message };
  }
}

/**
 * 取得所有組別清單
 */
function getGroupList() {
  try {
    const result = getAssetsWithMappingStatus();
    if (!result.success) return { success: false, error: result.error };

    // 使用計算後的 group 欄位（而非 defaultGroup）
    const groups = [...new Set(result.assets.map(a => a.group).filter(g => g))];
    groups.sort();

    return { success: true, groups };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

// ==========================================
// 資訊資產 API
// ==========================================

/**
 * 讀取「下拉選單」工作表，一次批次回傳類別 / 組別 / 狀態三組
 * B 欄 = 定位 key、C 欄 = 顯示文字、D 欄 = 代號
 */
function getDropdownOptions() {
  try {
    const ss = SpreadsheetApp.openById(CONFIG.ISMS_SPREADSHEET_ID);
    const sheet = ss.getSheetByName(CONFIG.DROPDOWN_SHEET_NAME);
    if (!sheet) {
      return { success: false, error: '找不到「下拉選單」工作表' };
    }

    const categories = [];
    const groups = [];
    const statuses = [];
    const businessProcesses = [];

    if (sheet.getLastRow() > 1) {
      const data = sheet.getRange(2, 2, sheet.getLastRow() - 1, 3).getValues();
      for (let i = 0; i < data.length; i++) {
        const key = data[i][0] ? String(data[i][0]).trim() : '';     // B 欄
        const display = data[i][1] ? String(data[i][1]).trim() : ''; // C 欄
        const code = data[i][2] ? String(data[i][2]).trim() : '';    // D 欄
        if (!key || !display) continue;

        if (key === '資訊資產類別' || key === '類別') categories.push({ display, code });
        else if (key === '組別') groups.push({ display, code });
        else if (key === '資訊資產狀態' || key === '資產狀態' || key === '狀態') statuses.push({ display, code });
        else if (key === '業務流程') businessProcesses.push({ display });
      }
    }

    return { success: true, categories, groups, statuses, businessProcesses };
  } catch (e) {
    console.error('getDropdownOptions 錯誤:', e);
    return { success: false, error: e.message };
  }
}

/**
 * 建立新資訊資產：自動產號 + 計算資產價值
 * @param {Object} form
 *   - categoryDisplay / categoryCode
 *   - groupDisplay / groupCode
 *   - statusDisplay
 *   - name, description
 *   - confidentiality, integrity, availability (1~4)
 * @returns {Object} { success, ismsAssetId, serial, assetValue }
 */
function createIsmsAsset(form) {
  // 🛡️ 權限守門(先擋再搶鎖,未授權的呼叫不佔用 LockService)
  const access = assertWriteAccess_(false);
  if (!access.ok) return { success: false, error: access.error };

  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000); // 最多等 10 秒，避免並發撞號

    // 欄位驗證
    if (!form || typeof form !== 'object') {
      return { success: false, error: '表單資料不正確' };
    }
    const name = (form.name || '').toString().trim();
    const categoryDisplay = (form.categoryDisplay || '').toString().trim();
    const categoryCode = (form.categoryCode || '').toString().trim();
    const groupDisplay = (form.groupDisplay || '').toString().trim();
    const groupCode = (form.groupCode || '').toString().trim();
    const statusDisplay = (form.statusDisplay || '').toString().trim();
    const businessProcess = (form.businessProcess || '').toString().trim();
    const description = (form.description || '').toString();
    const c = Number(form.confidentiality);
    const i = Number(form.integrity);
    const a = Number(form.availability);

    if (!name) return { success: false, error: '資產名稱必填' };
    if (!categoryDisplay || !categoryCode) return { success: false, error: '請選擇類別' };
    if (!groupDisplay || !groupCode) return { success: false, error: '請選擇組別' };
    const isValidCIA = (n) => Number.isInteger(n) && n >= 1 && n <= 4;
    if (!isValidCIA(c) || !isValidCIA(i) || !isValidCIA(a)) {
      return { success: false, error: 'CIA 三項必須是 1~4 的整數' };
    }

    // 讀取現有資訊資產
    const ss = SpreadsheetApp.openById(CONFIG.ISMS_SPREADSHEET_ID);
    const sheet = ss.getSheetByName(CONFIG.ISMS_ASSET_SHEET_NAME);
    if (!sheet) return { success: false, error: '找不到資訊資產工作表' };

    const idx = ISMS_ASSET_COLUMN_INDICES;
    // 序號偵測策略：
    // (1) 主：掃 A 欄編號本身，比對 `{groupCode}-{categoryCode}-\d+` 抽尾號
    //     — 這是唯一真相，避免 T 欄為空或 B/S 欄資料不一致造成誤判
    // (2) 備援：若列 A 欄無法解析，再看 B/S 欄是否相符且 T 欄是有效數字
    // (3) 為避免萬一 nextSerial 仍撞號，最終再迴圈遞增直到 A 欄沒有這個 ID
    const escapeRegExp = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const idPattern = new RegExp('^' + escapeRegExp(groupCode) + '-' + escapeRegExp(categoryCode) + '-(\\d+)$', 'i');
    const existingIds = new Set();
    let maxSerial = 0;

    if (sheet.getLastRow() > 1) {
      const data = sheet.getDataRange().getValues();
      for (let r = 1; r < data.length; r++) {
        const row = data[r];
        const rowId = String(row[idx.ISMS_ASSET_ID - 1] || '').trim();
        if (rowId) existingIds.add(rowId.toLowerCase());

        const m = rowId.match(idPattern);
        if (m) {
          const serial = Number(m[1]);
          if (!isNaN(serial) && serial > maxSerial) maxSerial = serial;
          continue;
        }

        // 備援：A 欄不符合格式時，看 B/S 欄 + T 欄
        const rowCategory = String(row[idx.CATEGORY - 1] || '').trim();
        const rowGroup = String(row[idx.GROUP - 1] || '').trim();
        const categoryMatch = rowCategory === categoryCode || rowCategory === categoryDisplay;
        const groupMatch = rowGroup === groupCode || rowGroup === groupDisplay;
        if (!categoryMatch || !groupMatch) continue;
        const serial = Number(row[idx.SERIAL_NO - 1]);
        if (!isNaN(serial) && serial > maxSerial) maxSerial = serial;
      }
    }

    // 第三道防線：遞增直到 A 欄絕對不存在此 ID
    let nextSerial = maxSerial + 1;
    let serialPadded = String(nextSerial).padStart(3, '0');
    let ismsAssetId = `${groupCode}-${categoryCode}-${serialPadded}`;
    while (existingIds.has(ismsAssetId.toLowerCase())) {
      nextSerial += 1;
      serialPadded = String(nextSerial).padStart(3, '0');
      ismsAssetId = `${groupCode}-${categoryCode}-${serialPadded}`;
    }
    const assetValue = c + i + a;

    // 組 22 格陣列（A~V，對應 ISMS_ASSET_COLUMN_INDICES 1~22）
    const row = new Array(22).fill('');
    row[idx.ISMS_ASSET_ID - 1] = ismsAssetId;
    row[idx.CATEGORY - 1] = categoryCode;         // B 欄寫「代號」
    row[idx.NAME - 1] = name;
    row[idx.DESCRIPTION - 1] = description;
    row[idx.RESPONSIBLE_UNIT - 1] = groupDisplay; // G 欄寫「組別中文名稱」
    row[idx.STATUS - 1] = statusDisplay;
    row[idx.CONFIDENTIALITY - 1] = c;
    row[idx.INTEGRITY - 1] = i;
    row[idx.AVAILABILITY - 1] = a;
    row[idx.ASSET_VALUE - 1] = assetValue;
    row[idx.GROUP - 1] = groupCode;         // S 欄寫「代號」
    row[idx.SERIAL_NO - 1] = nextSerial;
    row[idx.BUSINESS_PROCESS - 1] = businessProcess; // V 欄:業務流程

    sheet.appendRow(row);
    SpreadsheetApp.flush(); // 強制同步寫入,避免後續讀取拿到 stale 資料

    // 記錄操作日誌
    const newRowIndex = sheet.getLastRow();
    const snapshot = mapRowToIsmsAssetObject_(sheet.getRange(newRowIndex, 1, 1, 22).getValues()[0]);
    logIsmsOperation_('新增', ismsAssetId, '', null, snapshot, '');

    return {
      success: true,
      ismsAssetId,
      serial: nextSerial,
      assetValue,
      rowIndex: newRowIndex
    };
  } catch (e) {
    console.error('createIsmsAsset 錯誤:', e);
    return { success: false, error: e.message };
  } finally {
    try { lock.releaseLock(); } catch (_) {}
  }
}

// ==========================================
// 編輯 / 刪除 / 操作紀錄
// ==========================================

/**
 * 確保操作紀錄工作表存在,不存在則自動建立並寫入表頭
 */
function ensureOperationLogSheet_() {
  const ss = SpreadsheetApp.openById(CONFIG.ISMS_SPREADSHEET_ID);
  let sheet = ss.getSheetByName(CONFIG.ISMS_OPERATION_LOG_SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.ISMS_OPERATION_LOG_SHEET_NAME);
    sheet.getRange(1, 1, 1, 8).setValues([[
      '時間戳', '操作者', '操作類型', '資訊資產編號',
      '變更欄位', '變更前(JSON)', '變更後(JSON)', '備註'
    ]]);
    sheet.getRange(1, 1, 1, 8).setFontWeight('bold').setBackground('#f1f5f9');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/**
 * 寫入操作紀錄
 * @param {string} operationType - '新增' / '編輯' / '刪除'
 * @param {string} ismsAssetId - 目標編號
 * @param {string} changedFields - 變更欄位 CSV(CREATE/DELETE 留空)
 * @param {Object|null} beforeObj - 變更前快照(CREATE 時為 null)
 * @param {Object|null} afterObj - 變更後快照(DELETE 時為 null)
 * @param {string} remarks - 備註
 */
function logIsmsOperation_(operationType, ismsAssetId, changedFields, beforeObj, afterObj, remarks) {
  try {
    const sheet = ensureOperationLogSheet_();
    const email = Session.getActiveUser().getEmail() || '(unknown)';
    sheet.appendRow([
      new Date().toISOString(),
      email,
      operationType,
      ismsAssetId || '',
      changedFields || '',
      beforeObj ? JSON.stringify(beforeObj) : '',
      afterObj ? JSON.stringify(afterObj) : '',
      remarks || ''
    ]);
  } catch (e) {
    console.error('logIsmsOperation_ 錯誤:', e);
    // log 失敗不阻斷主操作
  }
}

/**
 * 依編號定位資訊資產列
 * @param {string} ismsAssetId
 * @returns {{rowIndex:number, rowData:any[]}|null}
 */
function findIsmsAssetRow_(ismsAssetId) {
  const ss = SpreadsheetApp.openById(CONFIG.ISMS_SPREADSHEET_ID);
  const sheet = ss.getSheetByName(CONFIG.ISMS_ASSET_SHEET_NAME);
  if (!sheet || sheet.getLastRow() <= 1) return null;
  const idx = ISMS_ASSET_COLUMN_INDICES;
  const data = sheet.getDataRange().getValues();
  const target = String(ismsAssetId).trim().toLowerCase();
  for (let r = 1; r < data.length; r++) {
    const id = String(data[r][idx.ISMS_ASSET_ID - 1] || '').trim().toLowerCase();
    if (id && id === target) {
      return { rowIndex: r + 1, rowData: data[r], sheet: sheet };
    }
  }
  return null;
}

/**
 * 編輯資訊資產(可修改:名稱、說明、狀態、CIA)
 */
function updateIsmsAsset(form) {
  // 🛡️ 權限守門(先擋再搶鎖)
  const access = assertWriteAccess_(false);
  if (!access.ok) return { success: false, error: access.error };

  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);

    if (!form || typeof form !== 'object') {
      return { success: false, error: '表單資料不正確' };
    }
    const ismsAssetId = (form.ismsAssetId || '').toString().trim();
    const name = (form.name || '').toString().trim();
    const description = (form.description || '').toString();
    const statusDisplay = (form.statusDisplay || '').toString().trim();
    const c = Number(form.confidentiality);
    const i = Number(form.integrity);
    const a = Number(form.availability);

    if (!ismsAssetId) return { success: false, error: '資訊資產編號必填' };
    if (!name) return { success: false, error: '資產名稱必填' };
    const isValidCIA = (n) => Number.isInteger(n) && n >= 1 && n <= 4;
    if (!isValidCIA(c) || !isValidCIA(i) || !isValidCIA(a)) {
      return { success: false, error: 'CIA 三項必須是 1~4 的整數' };
    }

    const located = findIsmsAssetRow_(ismsAssetId);
    if (!located) return { success: false, error: '找不到資產:' + ismsAssetId };

    const idx = ISMS_ASSET_COLUMN_INDICES;
    const sheet = located.sheet;
    const rowIndex = located.rowIndex;
    const before = mapRowToIsmsAssetObject_(located.rowData);
    const assetValue = c + i + a;

    // 比對差異
    const changed = [];
    if (before.name !== name) changed.push('name');
    if (before.description !== description) changed.push('description');
    if (before.status !== statusDisplay) changed.push('status');
    if (Number(before.confidentiality) !== c) changed.push('confidentiality');
    if (Number(before.integrity) !== i) changed.push('integrity');
    if (Number(before.availability) !== a) changed.push('availability');
    if (Number(before.assetValue) !== assetValue) changed.push('assetValue');

    if (changed.length === 0) {
      return { success: true, noChange: true, ismsAssetId };
    }

    // 逐欄寫入
    sheet.getRange(rowIndex, idx.NAME).setValue(name);
    sheet.getRange(rowIndex, idx.DESCRIPTION).setValue(description);
    sheet.getRange(rowIndex, idx.STATUS).setValue(statusDisplay);
    sheet.getRange(rowIndex, idx.CONFIDENTIALITY).setValue(c);
    sheet.getRange(rowIndex, idx.INTEGRITY).setValue(i);
    sheet.getRange(rowIndex, idx.AVAILABILITY).setValue(a);
    sheet.getRange(rowIndex, idx.ASSET_VALUE).setValue(assetValue);
    SpreadsheetApp.flush();

    // 組 after 快照
    const afterRow = sheet.getRange(rowIndex, 1, 1, 22).getValues()[0];
    const after = mapRowToIsmsAssetObject_(afterRow);

    logIsmsOperation_('編輯', ismsAssetId, changed.join(','), before, after, '');

    return { success: true, ismsAssetId, changedFields: changed };
  } catch (e) {
    console.error('updateIsmsAsset 錯誤:', e);
    return { success: false, error: e.message };
  } finally {
    try { lock.releaseLock(); } catch (_) {}
  }
}

/**
 * 刪除資訊資產(僅管理員)
 */
function deleteIsmsAsset(ismsAssetId, reason) {
  // 🛡️ 權限守門:刪除僅限管理員(先擋再搶鎖)
  const access = assertWriteAccess_(true);
  if (!access.ok) return { success: false, error: access.error };

  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);

    const targetId = (ismsAssetId || '').toString().trim();
    if (!targetId) return { success: false, error: '資訊資產編號必填' };

    const located = findIsmsAssetRow_(targetId);
    if (!located) return { success: false, error: '找不到資產:' + targetId };

    const before = mapRowToIsmsAssetObject_(located.rowData);
    located.sheet.deleteRow(located.rowIndex);
    SpreadsheetApp.flush();

    logIsmsOperation_('刪除', targetId, '', before, null, reason || '');

    return { success: true, ismsAssetId: targetId };
  } catch (e) {
    console.error('deleteIsmsAsset 錯誤:', e);
    return { success: false, error: e.message };
  } finally {
    try { lock.releaseLock(); } catch (_) {}
  }
}

/**
 * 取得資訊資產清單
 * @param {Object} options - 篩選選項
 * @returns {Object} 資訊資產清單
 */
function getIsmsAssets(options = {}) {
  try {
    const ss = SpreadsheetApp.openById(CONFIG.ISMS_SPREADSHEET_ID);
    const sheet = ss.getSheetByName(CONFIG.ISMS_ASSET_SHEET_NAME);

    if (!sheet) {
      return { success: false, error: '找不到資訊資產工作表' };
    }

    const data = sheet.getDataRange().getValues();
    const assets = [];

    for (let i = 1; i < data.length; i++) {
      const asset = mapRowToIsmsAssetObject_(data[i]);
      if (asset.ismsAssetId) {
        assets.push(asset);
      }
    }

    // 篩選
    let filtered = assets;

    if (options.searchKeyword) {
      const keyword = options.searchKeyword.toLowerCase();
      filtered = filtered.filter(a =>
        a.ismsAssetId.toLowerCase().includes(keyword) ||
        a.name.toLowerCase().includes(keyword) ||
        a.category.toLowerCase().includes(keyword) ||
        a.responsibleUnit.toLowerCase().includes(keyword)
      );
    }

    return {
      success: true,
      assets: filtered
    };
  } catch (e) {
    console.error('getIsmsAssets 錯誤:', e);
    return { success: false, error: e.message };
  }
}

// ==========================================
// 對照管理 API
// ==========================================

/**
 * 檢查資產是否已有對照
 * @param {string[]} assetIds - 資產編號陣列
 * @returns {Object} 已有對照的資產資訊
 */
function checkExistingMappings(assetIds) {
  try {
    const mappingMap = getMappingMap_();
    const existingMappings = [];

    for (const assetId of assetIds) {
      const mapping = mappingMap.get(assetId);
      if (mapping && mapping.ismsAssetId) {
        existingMappings.push({
          assetId: assetId,
          currentIsmsAssetId: mapping.ismsAssetId
        });
      }
    }

    return {
      success: true,
      hasExisting: existingMappings.length > 0,
      existingMappings: existingMappings
    };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

/**
 * 建立多對一對照
 * @param {string[]} assetIds - 資產編號陣列
 * @param {string} ismsAssetId - 資訊資產編號
 * @param {string} remarks - 備註
 * @returns {Object} 操作結果
 */
function createMappings(assetIds, ismsAssetId, remarks = '') {
  // 🛡️ 權限守門
  const access = assertWriteAccess_(false);
  if (!access.ok) return { success: false, error: access.error };

  try {
    const email = access.email;
    const timestamp = new Date().toISOString();

    const ss = SpreadsheetApp.openById(CONFIG.ISMS_SPREADSHEET_ID);
    let sheet = ss.getSheetByName(CONFIG.MAPPING_SHEET_NAME);

    // 若工作表不存在則建立
    if (!sheet) {
      sheet = ss.insertSheet(CONFIG.MAPPING_SHEET_NAME);
      sheet.appendRow(['資產編號', '資訊資產編號', '建立時間', '建立人', '備註']);
    }

    const mappingMap = getMappingMap_();
    let createdCount = 0;
    let updatedCount = 0;

    for (const assetId of assetIds) {
      const existing = mappingMap.get(assetId);

      if (existing && existing.rowIndex) {
        // 更新既有對照
        const rowIndex = existing.rowIndex;
        sheet.getRange(rowIndex, MAPPING_COLUMN_INDICES.ISMS_ASSET_ID).setValue(ismsAssetId);
        sheet.getRange(rowIndex, MAPPING_COLUMN_INDICES.CREATED_TIME).setValue(timestamp);
        sheet.getRange(rowIndex, MAPPING_COLUMN_INDICES.CREATED_BY).setValue(email);
        sheet.getRange(rowIndex, MAPPING_COLUMN_INDICES.REMARKS).setValue(remarks);
        updatedCount++;
      } else {
        // 新增對照
        sheet.appendRow([assetId, ismsAssetId, timestamp, email, remarks]);
        createdCount++;
      }
    }

    return {
      success: true,
      message: `成功建立 ${createdCount} 筆、更新 ${updatedCount} 筆對照`,
      createdCount,
      updatedCount
    };
  } catch (e) {
    console.error('createMappings 錯誤:', e);
    return { success: false, error: e.message };
  }
}

/**
 * 更新單筆對照
 * @param {string} assetId - 資產編號
 * @param {string} newIsmsAssetId - 新的資訊資產編號
 * @returns {Object} 操作結果
 */
function updateMapping(assetId, newIsmsAssetId) {
  // 🛡️ 權限守門
  const access = assertWriteAccess_(false);
  if (!access.ok) return { success: false, error: access.error };

  try {
    const mappingMap = getMappingMap_();
    const existing = mappingMap.get(assetId);

    if (!existing || !existing.rowIndex) {
      return { success: false, error: '找不到該資產的對照記錄' };
    }

    const ss = SpreadsheetApp.openById(CONFIG.ISMS_SPREADSHEET_ID);
    const sheet = ss.getSheetByName(CONFIG.MAPPING_SHEET_NAME);
    const email = Session.getActiveUser().getEmail();
    const timestamp = new Date().toISOString();

    sheet.getRange(existing.rowIndex, MAPPING_COLUMN_INDICES.ISMS_ASSET_ID).setValue(newIsmsAssetId);
    sheet.getRange(existing.rowIndex, MAPPING_COLUMN_INDICES.CREATED_TIME).setValue(timestamp);
    sheet.getRange(existing.rowIndex, MAPPING_COLUMN_INDICES.CREATED_BY).setValue(email);

    return { success: true, message: '對照更新成功' };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

/**
 * 刪除對照
 * @param {string[]} assetIds - 資產編號陣列
 * @returns {Object} 操作結果
 */
function deleteMappings(assetIds) {
  // 🛡️ 權限守門:刪除僅限管理員(與 deleteIsmsAsset 同級)
  const access = assertWriteAccess_(true);
  if (!access.ok) return { success: false, error: access.error };

  try {
    const ss = SpreadsheetApp.openById(CONFIG.ISMS_SPREADSHEET_ID);
    const sheet = ss.getSheetByName(CONFIG.MAPPING_SHEET_NAME);

    if (!sheet) {
      return { success: false, error: '對照表工作表不存在' };
    }

    const mappingMap = getMappingMap_();
    const rowsToDelete = [];

    for (const assetId of assetIds) {
      const mapping = mappingMap.get(assetId);
      if (mapping && mapping.rowIndex) {
        rowsToDelete.push(mapping.rowIndex);
      }
    }

    // 由下往上刪除以避免索引錯位
    rowsToDelete.sort((a, b) => b - a);
    for (const rowIndex of rowsToDelete) {
      sheet.deleteRow(rowIndex);
    }

    return {
      success: true,
      message: `成功刪除 ${rowsToDelete.length} 筆對照`,
      deletedCount: rowsToDelete.length
    };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

// ==========================================
// 報表 API
// ==========================================

/**
 * 取得對照統計資料
 */
function getMappingStatistics() {
  try {
    const result = getAssetsWithMappingStatus();
    if (!result.success) return result;

    // 依組別統計（使用計算後的 group 欄位）
    const groupStats = {};
    for (const asset of result.assets) {
      const group = asset.group || '未分組';
      if (!groupStats[group]) {
        groupStats[group] = { total: 0, mapped: 0 };
      }
      groupStats[group].total++;
      if (asset.isMapped) {
        groupStats[group].mapped++;
      }
    }

    // 轉換為陣列
    const groupStatsArray = Object.entries(groupStats).map(([group, stats]) => ({
      group,
      total: stats.total,
      mapped: stats.mapped,
      unmapped: stats.total - stats.mapped,
      rate: stats.total > 0 ? Math.round((stats.mapped / stats.total) * 100) : 0
    }));

    groupStatsArray.sort((a, b) => a.group.localeCompare(b.group, 'zh-TW'));

    return {
      success: true,
      overall: result.statistics,
      byGroup: groupStatsArray
    };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

/**
 * 查詢某資訊資產下的所有資產
 * @param {string} ismsAssetId - 資訊資產編號
 */
function getAssetsByIsmsAsset(ismsAssetId) {
  try {
    const result = getAssetsWithMappingStatus();
    if (!result.success) return result;

    const assets = result.assets.filter(a => a.mappedIsmsAssetId === ismsAssetId);

    return {
      success: true,
      ismsAssetId,
      assets,
      count: assets.length
    };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

/**
 * 匯出對照報表（CSV 格式）
 */
function exportMappingReport() {
  try {
    const result = getAssetsWithMappingStatus();
    if (!result.success) return result;

    const ismsResult = getIsmsAssets();
    const ismsMap = {};
    if (ismsResult.success) {
      for (const isms of ismsResult.assets) {
        ismsMap[isms.ismsAssetId] = isms;
      }
    }

    // 建立 CSV 內容
    const headers = ['資產編號', '資產名稱', '資產類別', '保管人', '地點', '組別', '對照狀態', '資訊資產編號', '資訊資產名稱', '資訊資產類別'];
    const rows = result.assets.map(asset => {
      const isms = ismsMap[asset.mappedIsmsAssetId] || {};
      return [
        asset.assetId,
        asset.assetName,
        asset.assetCategory,
        asset.leaderName,
        asset.location,
        asset.group,
        asset.isMapped ? '已對照' : '未對照',
        asset.mappedIsmsAssetId || '',
        isms.name || '',
        isms.category || ''
      ];
    });

    // 組合 CSV
    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${(cell || '').replace(/"/g, '""')}"`).join(','))
      .join('\n');

    return {
      success: true,
      csvContent,
      filename: `資產對照報表_${new Date().toISOString().slice(0, 10)}.csv`
    };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

/**
 * 取得浮動按鈕導航連結
 */
function getFabNavigationUrls() {
  var baseUrl = ScriptApp.getService().getUrl();
  return {
    connectUrl: baseUrl + '?page=connect',
    softwareListUrl: baseUrl + '?page=softwarelist',
    mainAppUrl: 'https://script.google.com/a/macros/as.edu.tw/s/AKfycbxkg0u0OFBLCft2gHstJ3eVE94INrZ1G59Ek0MIs_fmdLG00N9YoHyH9EmbW4geifg7/exec'
  };
}

// ==========================================
// 軟體清冊 API
// ==========================================

/**
 * 取得軟體清冊資料
 * @param {Object} options - 篩選選項
 *   - searchKeyword: 關鍵字搜尋
 *   - filterType: 軟體類型篩選
 *   - filterUnit: 保管單位篩選
 * @returns {Object} { success, data, totalCount }
 */
function getSoftwareList(options) {
  options = options || {};
  try {
    var ss = SpreadsheetApp.openById(CONFIG.ISMS_SPREADSHEET_ID);
    var sheet = ss.getSheetByName(CONFIG.SOFTWARE_SHEET_NAME);
    if (!sheet) {
      return { success: false, error: '找不到「軟體清冊」工作表' };
    }

    var lastRow = sheet.getLastRow();
    if (lastRow <= 1) {
      return { success: true, data: [], totalCount: 0 };
    }

    var rawData = sheet.getRange(2, 1, lastRow - 1, 9).getValues();
    var idx = SOFTWARE_COLUMN_INDICES;
    var data = [];

    for (var i = 0; i < rawData.length; i++) {
      var row = rawData[i];
      var softwareId = row[idx.SOFTWARE_ID - 1] ? String(row[idx.SOFTWARE_ID - 1]).trim() : '';
      if (!softwareId) continue;

      data.push({
        softwareId: softwareId,
        softwareName: row[idx.SOFTWARE_NAME - 1] ? String(row[idx.SOFTWARE_NAME - 1]).trim() : '',
        quantity: row[idx.QUANTITY - 1] ? String(row[idx.QUANTITY - 1]).trim() : '',
        custodyUnit: row[idx.CUSTODY_UNIT - 1] ? String(row[idx.CUSTODY_UNIT - 1]).trim() : '',
        custodian: row[idx.CUSTODIAN - 1] ? String(row[idx.CUSTODIAN - 1]).trim() : '',
        user: row[idx.USER - 1] ? String(row[idx.USER - 1]).trim() : '',
        softwareType: row[idx.SOFTWARE_TYPE - 1] ? String(row[idx.SOFTWARE_TYPE - 1]).trim() : '',
        typeCode: row[idx.TYPE_CODE - 1] ? String(row[idx.TYPE_CODE - 1]).trim() : '',
        serialNo: row[idx.SERIAL_NO - 1] ? String(row[idx.SERIAL_NO - 1]).trim() : ''
      });
    }

    var totalCount = data.length;
    var filtered = data;

    // 關鍵字篩選
    if (options.searchKeyword) {
      var keyword = options.searchKeyword.toLowerCase();
      filtered = filtered.filter(function(item) {
        return item.softwareId.toLowerCase().indexOf(keyword) >= 0 ||
               item.softwareName.toLowerCase().indexOf(keyword) >= 0 ||
               item.custodian.toLowerCase().indexOf(keyword) >= 0 ||
               item.user.toLowerCase().indexOf(keyword) >= 0 ||
               item.serialNo.toLowerCase().indexOf(keyword) >= 0;
      });
    }

    // 軟體類型篩選
    if (options.filterType) {
      filtered = filtered.filter(function(item) {
        return item.softwareType === options.filterType;
      });
    }

    // 保管單位篩選
    if (options.filterUnit) {
      filtered = filtered.filter(function(item) {
        return item.custodyUnit === options.filterUnit;
      });
    }

    return { success: true, data: filtered, totalCount: totalCount };
  } catch (e) {
    console.error('getSoftwareList 錯誤:', e);
    return { success: false, error: e.message };
  }
}

/**
 * 取得軟體清冊的下拉選項（不重複的軟體類型、保管單位）
 * @returns {Object} { success, types, units }
 */
function getSoftwareDropdownOptions() {
  try {
    var result = getSoftwareList({});
    if (!result.success) return result;

    var typeSet = {};
    var unitSet = {};
    for (var i = 0; i < result.data.length; i++) {
      var item = result.data[i];
      if (item.softwareType) typeSet[item.softwareType] = true;
      if (item.custodyUnit) unitSet[item.custodyUnit] = true;
    }

    var types = Object.keys(typeSet).sort(function(a, b) { return a.localeCompare(b, 'zh-TW'); });
    var units = Object.keys(unitSet).sort(function(a, b) { return a.localeCompare(b, 'zh-TW'); });

    return { success: true, types: types, units: units };
  } catch (e) {
    console.error('getSoftwareDropdownOptions 錯誤:', e);
    return { success: false, error: e.message };
  }
}

/**
 * 初始化對照表工作表
 */
function initMappingSheet() {
  // 🛡️ 權限守門:建立工作表屬結構變更,僅限管理員
  const access = assertWriteAccess_(true);
  if (!access.ok) return { success: false, error: access.error };

  try {
    const ss = SpreadsheetApp.openById(CONFIG.ISMS_SPREADSHEET_ID);
    let sheet = ss.getSheetByName(CONFIG.MAPPING_SHEET_NAME);

    if (sheet) {
      return { success: true, message: '對照表工作表已存在' };
    }

    sheet = ss.insertSheet(CONFIG.MAPPING_SHEET_NAME);
    sheet.appendRow(['資產編號', '資訊資產編號', '建立時間', '建立人', '備註']);

    // 設定欄寬
    sheet.setColumnWidth(1, 150);
    sheet.setColumnWidth(2, 150);
    sheet.setColumnWidth(3, 180);
    sheet.setColumnWidth(4, 200);
    sheet.setColumnWidth(5, 200);

    // 凍結標題列
    sheet.setFrozenRows(1);

    return { success: true, message: '對照表工作表建立成功' };
  } catch (e) {
    return { success: false, error: e.message };
  }
}
