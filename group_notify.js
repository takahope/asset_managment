/**
 * group_notify.js — 「只通知組別窗口」通知分流（spec 2026-10-01）
 * 依資產 AE 欄（空白則依收件人 HR 組別）把保管人/使用人通知改寄該組窗口；未設窗口者照舊寄本人。
 * 與 code.js 共用 GAS 全域範圍，函式一律 `_` 結尾避免與子專案同名函式互相覆寫。
 */

const GROUP_NOTIFY_KIND_ORDER_ = ['approve', 'notice', 'done'];
const GROUP_NOTIFY_KIND_TITLE_ = {
  approve: '【待接收審核】請轉知下列人員至「審核儀表板」接收：',
  notice: '【知會】',
  done: '【已完成】'
};

let GROUP_NOTIFY_CONTACTS_MEMO_ = null; // 同請求記憶化，避免逐筆 PropertiesService RPC（參 2026-09-15 事件）

/** 「只通知組別窗口」開關，預設關閉 */
function isGroupContactNotifyOnly_() {
  return PropertiesService.getScriptProperties().getProperty('GROUP_CONTACT_NOTIFY_ONLY') === 'true';
}

/** 組名 → 比對鍵（正規化 + 小寫） */
function groupNotifyKey_(groupName, canonicalize) {
  const canon = canonicalize || canonicalizeGroupName_;
  const g = String(groupName || '').trim();
  if (!g) return '';
  return String(canon(g) || g).trim().toLowerCase();
}

/** 拆分窗口 Email：支援半形/全形逗號、分號、頓號、空白、換行 */
function splitNotifyEmails_(raw) {
  return String(raw == null ? '' : raw)
    .split(/[\s,;，；、]+/)
    .map(s => s.trim())
    .filter(Boolean);
}

/**
 * 解析 GROUP_NOTIFY_CONTACTS → { 比對鍵: [小寫 email…] }；JSON 損毀或非物件視為未設定窗口。
 * @param {string} raw
 * @param {function} [canonicalize]
 * @returns {Object<string, string[]>}
 */
function parseGroupNotifyContacts_(raw, canonicalize) {
  if (!raw) return {};
  let obj;
  try {
    obj = JSON.parse(raw);
  } catch (e) {
    Logger.log('⚠️ GROUP_NOTIFY_CONTACTS 不是合法 JSON，視為未設定窗口：' + e.message);
    return {};
  }
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return {};
  const result = {};
  Object.keys(obj).forEach(group => {
    const key = groupNotifyKey_(group, canonicalize);
    if (!key) return;
    const list = result[key] || [];
    splitNotifyEmails_(obj[group]).forEach(email => {
      const e = email.toLowerCase();
      if (e.indexOf('@') > 0 && list.indexOf(e) === -1) list.push(e);
    });
    if (list.length > 0) result[key] = list;
  });
  return result;
}

/** 讀取窗口設定（同請求記憶化） */
function getGroupNotifyContacts_() {
  if (GROUP_NOTIFY_CONTACTS_MEMO_) return GROUP_NOTIFY_CONTACTS_MEMO_;
  GROUP_NOTIFY_CONTACTS_MEMO_ = parseGroupNotifyContacts_(
    PropertiesService.getScriptProperties().getProperty('GROUP_NOTIFY_CONTACTS'));
  return GROUP_NOTIFY_CONTACTS_MEMO_;
}

/** 清除窗口設定記憶化（儲存設定後呼叫） */
function clearGroupNotifyContactsMemo_() {
  GROUP_NOTIFY_CONTACTS_MEMO_ = null;
}

/**
 * 儲存前驗證並正規化窗口設定，回傳單行 JSON（免疫 GAS 原生屬性介面抹除換行，參 2026-09-24 事件）。
 * @param {Object<string, string>} obj { 組名: 'a@x.com, b@x.com' }
 * @returns {string}
 */
function normalizeGroupNotifyContacts_(obj) {
  const source = (obj && typeof obj === 'object' && !Array.isArray(obj)) ? obj : {};
  const result = {};
  Object.keys(source).forEach(rawGroup => {
    const group = String(rawGroup || '').trim();
    if (!group) return;
    const emails = splitNotifyEmails_(source[rawGroup]);
    emails.forEach(email => {
      if (!/^[^@]+@[^@]+$/.test(email)) {
        throw new Error(`「${group}」窗口 Email 格式錯誤：${email}`);
      }
    });
    if (emails.length > 0) result[group] = emails.join(', ');
  });
  return JSON.stringify(result);
}

/**
 * 唯一組別判定：AE 欄優先，空白則用收件人通知用組別（駐站已歸併，見 notifyGroupOf_）。
 * @returns {string} 正規化組名；查無回傳 ''
 */
function resolveNotifyGroup_(aeValue, personEmail, directory, canonicalize) {
  const canon = canonicalize || canonicalizeGroupName_;
  const ae = String(aeValue || '').trim();
  if (ae) return String(canon(ae) || ae).trim();
  const group = notifyGroupOf_(directory, personEmail);
  if (!group || group === '未分組') return '';
  return String(canon(group) || group).trim();
}

// --- 通知用組別歸併（spec 2026-10-02）：只影響通知分流，同組權限與組別顯示仍用 emailToGroup ---

/** 代碼歸併：GRP- 開頭只取前兩段（GRP-CO-A01 / GRP-CO-EX-01 → GRP-CO），其餘原樣 */
function rollupNotifyGroupCode_(code) {
  const c = String(code || '').trim();
  if (c.indexOf('GRP-') !== 0) return c;
  return c.split('-').slice(0, 2).join('-');
}

/**
 * 建立通知用組別對照（稀疏：只存與 emailToGroup 不同者，控制名錄快取大小）。
 * 歸併後代碼不在組織架構樹時不歸併（沿用原組別）。
 * @param {{emailToMainCode:Object, codeToOrgName:Object, groupNameMap:Object, emailToGroup:Object}} src
 * @returns {Object<string, string>} email → 通知用組名
 */
function buildNotifyGroupOverrides_(src) {
  const s = src || {};
  const mainCodes = s.emailToMainCode || {};
  const orgNames = s.codeToOrgName || {};
  const nameMap = s.groupNameMap || {};
  const groups = s.emailToGroup || {};
  const overrides = {};
  Object.keys(mainCodes).forEach(email => {
    const code = String(mainCodes[email] || '').trim();
    const rolled = rollupNotifyGroupCode_(code);
    if (!rolled || rolled === code) return;
    const hrName = orgNames[rolled];
    if (!hrName) return;
    const groupName = nameMap[hrName] || hrName;
    if (groupName !== groups[email]) overrides[email] = groupName;
  });
  return overrides;
}

/** 收件人通知用組別：駐站同仁取歸併後組別，其餘（或舊版名錄）沿用 emailToGroup */
function notifyGroupOf_(directory, email) {
  if (!directory) return '';
  const key = String(email || '').toLowerCase().trim();
  const overrides = directory.emailToNotifyGroup || {};
  return String(overrides[key] || (directory.emailToGroup || {})[key] || '').trim();
}

/** 名錄中所有通知用組別（去重、未排序），供設定頁候選清單 */
function listNotifyGroups_(directory) {
  if (!directory) return [];
  const emails = Object.keys(directory.emailToGroup || {}).concat(Object.keys(directory.emailToNotifyGroup || {}));
  const seen = {};
  const result = [];
  emails.forEach(email => {
    const group = notifyGroupOf_(directory, email);
    if (group && !seen[group]) {
      seen[group] = true;
      result.push(group);
    }
  });
  return result;
}

/**
 * 預測轉移後 AE 欄（新方組別判定用）。
 * 轉出實驗組移除 AE 尚未實作（spec §12），補上時只需改此函式與審核時的 AE 寫入。
 */
function resolvePostTransferAe_(currentAe, transferType) {
  if (String(transferType || '').indexOf('轉移實驗組') !== -1) return '實驗組';
  return String(currentAe || '').trim();
}

/**
 * 建立通知收集器：寄信點 add() 個人信件，區塊尾端 flush() 依設定分流寄出。
 * @param {Object} opts 見 spec §5.3；sendMail/enabled/userMailEnabled/contacts/directory/canonicalize 供測試注入
 */
function createMailCollector_(opts) {
  const options = opts || {};
  const entries = [];
  return {
    add: function (entry) {
      if (!entry || !String(entry.email || '').trim() || !entry.items || entry.items.length === 0) return;
      entries.push(entry);
    },
    flush: function () {
      return flushGroupNotifyEntries_(entries.splice(0, entries.length), options);
    }
  };
}

/** flush 實作：本人子集合照舊寄出；有窗口的項目彙整成每位窗口一封 */
function flushGroupNotifyEntries_(entries, o) {
  const summary = { personalCount: 0, windowCount: 0, routedGroups: [] };
  if (!entries || entries.length === 0) return summary;
  const userMailEnabled = o.userMailEnabled !== undefined ? !!o.userMailEnabled : isUserEmailEnabled();
  if (!userMailEnabled) return summary;

  const enabled = o.enabled !== undefined ? !!o.enabled : isGroupContactNotifyOnly_();
  const canon = o.canonicalize || canonicalizeGroupName_;
  const contacts = enabled ? (o.contacts || getGroupNotifyContacts_()) : {};
  const directory = enabled ? (o.directory || getKeeperDirectory_()) : null;
  const sendMail = o.sendMail || function (to, subject, body) { MailApp.sendEmail(to, subject, body); };
  const operator = String(o.operatorEmail || '').toLowerCase().trim();
  const buckets = {};
  const bucketOrder = [];

  const deliver = function (to, render) {
    try {
      const mail = render();
      sendMail(to, mail.subject, mail.body);
      return true;
    } catch (e) {
      Logger.log(`⚠️ 通知寄送失敗（${to}）：${e.message}`);
      return false;
    }
  };

  entries.forEach(entry => {
    const keep = [];
    entry.items.forEach(item => {
      if (!enabled) { keep.push(item); return; }
      const group = resolveNotifyGroup_(item.aeValue, entry.email, directory, canon);
      const windows = group ? (contacts[groupNotifyKey_(group, canon)] || []) : [];
      if (windows.length === 0) { keep.push(item); return; }
      if (summary.routedGroups.indexOf(group) === -1) summary.routedGroups.push(group);
      windows.forEach(w => {
        if (w === operator) return; // 決策 B：操作者本人不收自己觸發的信
        if (!buckets[w]) {
          buckets[w] = { groups: [], lines: { approve: [], notice: [], done: [] }, assetIds: [], approveIds: [] };
          bucketOrder.push(w);
        }
        const b = buckets[w];
        const kind = b.lines[item.kind] ? item.kind : 'notice';
        if (b.groups.indexOf(group) === -1) b.groups.push(group);
        if (b.lines[kind].indexOf(item.windowLine) === -1) b.lines[kind].push(item.windowLine);
        if (b.assetIds.indexOf(item.assetId) === -1) b.assetIds.push(item.assetId);
        if (kind === 'approve' && b.approveIds.indexOf(item.assetId) === -1) b.approveIds.push(item.assetId);
      });
    });
    if (keep.length > 0 && deliver(entry.email, () => entry.render(keep))) summary.personalCount++;
  });

  bucketOrder.forEach(w => {
    if (deliver(w, () => renderGroupWindowMail_(w, buckets[w], o, directory))) summary.windowCount++;
  });
  return summary;
}

/** 窗口彙整信（spec §6） */
function renderGroupWindowMail_(windowEmail, bucket, o, directory) {
  const groupLabel = bucket.groups.join('、');
  const n = bucket.assetIds.length;
  let title;
  if (o.event === 'transferApply') {
    title = `財產轉移申請：${n} 筆` + (bucket.approveIds.length > 0 ? `（其中 ${bucket.approveIds.length} 筆待接收審核）` : '');
  } else if (o.event === 'transferApproval') {
    title = `財產轉移已審核完成：${n} 筆`;
  } else if (o.event === 'scrapProxy') {
    title = `同組代辦報廢申請：${n} 筆`;
  } else {
    title = `財產異動通知：${n} 筆`;
  }
  const names = (directory && directory.emailToName) || {};
  const operatorEmail = String(o.operatorEmail || '');
  const operatorName = o.operatorName || names[operatorEmail.toLowerCase().trim()] || operatorEmail.split('@')[0];
  const windowName = names[windowEmail] || windowEmail.split('@')[0];

  let body = `您好 ${windowName}，\n\n`;
  body += `您是「${groupLabel}」的組別通知窗口。依系統設定，以下原本寄給組內同仁的通知改由您統一接收，請視需要轉知相關同仁。\n\n`;
  body += `操作者：${operatorName} (${operatorEmail})\n\n`;
  GROUP_NOTIFY_KIND_ORDER_.forEach(kind => {
    const lines = bucket.lines[kind];
    if (!lines || lines.length === 0) return;
    body += `${GROUP_NOTIFY_KIND_TITLE_[kind]}\n`;
    lines.forEach(line => { body += `  - ${line}\n`; });
    body += `\n`;
  });
  if (o.appUrl) body += `系統連結：${o.appUrl}\n\n`;
  body += `此為系統自動發送郵件。`;
  return { subject: `[組別窗口通知][${groupLabel}] ${title}`, body: body };
}

/** 結果訊息補充句；無改寄時回傳 '' */
function formatRoutedNote_(summary) {
  if (!summary || !summary.routedGroups || summary.routedGroups.length === 0) return '';
  return `（通知已依設定改寄：${summary.routedGroups.join('、')}窗口）`;
}

// --- 設定頁（alpine_model_setting.html）支援 ---

/** 讀取窗口設定原字串供設定頁編輯；損毀回傳 {} */
function readGroupNotifyContactsForSettings_(raw) {
  if (!raw) return {};
  try {
    const obj = JSON.parse(raw);
    if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return {};
    const result = {};
    Object.keys(obj).forEach(group => {
      result[group] = String(obj[group] == null ? '' : obj[group]);
    });
    return result;
  } catch (e) {
    Logger.log('⚠️ GROUP_NOTIFY_CONTACTS 不是合法 JSON，設定頁以空白顯示：' + e.message);
    return {};
  }
}

/**
 * 設定頁可設定組別 = 已存鍵 ∪ HR 名錄通知用組別（駐站已歸併）∪ AE 欄值（後兩者正規化），去重後依中文排序。
 * 已存鍵原樣保留，避免組別改名後舊設定看不到。
 */
function buildGroupNotifyCandidates_(directoryGroups, aeValues, savedKeys, canonicalize) {
  const canon = canonicalize || canonicalizeGroupName_;
  const seen = {};
  const result = [];
  const push = (name, doCanon) => {
    const raw = String(name || '').trim();
    if (!raw || raw === '未分組') return;
    const display = doCanon ? String(canon(raw) || raw).trim() : raw;
    const key = display.toLowerCase();
    if (!display || seen[key]) return;
    seen[key] = true;
    result.push(display);
  };
  (savedKeys || []).forEach(g => push(g, false));
  (directoryGroups || []).forEach(g => push(g, true));
  (aeValues || []).forEach(g => push(g, true));
  return result.sort((a, b) => a.localeCompare(b, 'zh-Hant'));
}

/** 讀兩張總表 AE 欄（僅單欄）出現過的值 */
function readDefaultGroupValues_() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const values = [];
  [[PROPERTY_MASTER_SHEET_NAME, PROPERTY_COLUMN_INDICES], [ITEM_MASTER_SHEET_NAME, ITEM_COLUMN_INDICES]].forEach(pair => {
    const sheet = ss.getSheetByName(pair[0]);
    const col = pair[1].DEFAULT_GROUP;
    if (!sheet || !col || sheet.getLastRow() <= 1 || sheet.getLastColumn() < col) return;
    sheet.getRange(2, col, sheet.getLastRow() - 1, 1).getValues().forEach(row => {
      const v = String(row[0] || '').trim();
      if (v && values.indexOf(v) === -1) values.push(v);
    });
  });
  return values;
}

/** 設定頁候選組別（各來源失敗皆不阻斷設定頁載入） */
function getGroupNotifyCandidates_() {
  let directoryGroups = [];
  try {
    directoryGroups = listNotifyGroups_(getKeeperDirectory_());
  } catch (e) {
    Logger.log('⚠️ 組別窗口候選：HR 名錄讀取失敗：' + e.message);
  }
  let aeValues = [];
  try {
    aeValues = readDefaultGroupValues_();
  } catch (e) {
    Logger.log('⚠️ 組別窗口候選：AE 欄讀取失敗：' + e.message);
  }
  const savedKeys = Object.keys(readGroupNotifyContactsForSettings_(
    PropertiesService.getScriptProperties().getProperty('GROUP_NOTIFY_CONTACTS')));
  return buildGroupNotifyCandidates_(directoryGroups, aeValues, savedKeys);
}
