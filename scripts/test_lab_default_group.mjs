// 實驗組 AE 規則 Node 測試執行器（spec 2026-10-02）
// 以 vm 載入實際 GAS 檔案，執行共用測試套件 + Node 專屬整合案例。
// 執行：node scripts/test_lab_default_group.mjs
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FILES = ['group_notify.js', 'lab_default_group.js', 'group_notify_test.js', 'lab_default_group_test.js'];

function loadContext(props, directory, extra) {
  const store = Object.assign({}, props || {});
  const context = Object.assign({
    Logger: { log: () => {} },
    PropertiesService: {
      getScriptProperties: () => ({
        getProperty: key => (Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null)
      })
    },
    canonicalizeGroupName_: g => String(g || '').trim(),
    getKeeperDirectory_: () => directory || { emailToGroup: {}, emailToName: {}, allEmails: [] },
    AL_NEW_LEADER_EMAIL_COLUMN_INDEX: 9,
    AL_TRANSFER_TYPE_COLUMN_INDEX: 15
  }, extra || {});
  vm.createContext(context);
  FILES.forEach(file => {
    vm.runInContext(fs.readFileSync(path.join(ROOT, file), 'utf8'), context, { filename: file });
  });
  return context;
}

// 1. 共用測試套件（與 GAS 編輯器執行同一份）
{
  const context = loadContext();
  ['testLabDefaultGroup_', 'runLabDefaultGroupTests'].forEach(suite => {
    const result = context[suite]();
    assert.strictEqual(result.failed, 0, `${suite} 失敗 ${result.failed} 項：\n${result.failures.join('\n')}`);
    console.log(`✅ ${suite}：${result.passed} 項通過`);
  });
}

// 2. 整合：getLabMemberChecker_ 合併設定、歷任公用帳號（自紀錄推得）與 HR 實驗組，且同請求記憶化
{
  const context = loadContext({ LAB_COMMON_CUSTODIAN_EMAIL: 'CEO@x.com' }, {
    emailToGroup: { 'lab@x.com': '實驗組', 'ceo@x.com': '執行長', 'out@x.com': 'B組' },
    emailToName: {}
  });
  const row = (keeper, type) => {
    const r = new Array(15).fill('');
    r[8] = keeper;
    r[14] = type;
    return r;
  };
  const isLabMember = context.getLabMemberChecker_([row('Old@x.com', '轉移實驗組(共同)'), row('k@x.com', '保管人')]);
  assert.strictEqual(isLabMember('ceo@x.com'), true, '目前設定的公用帳號');
  assert.strictEqual(isLabMember('old@x.com'), true, '歷任公用帳號');
  assert.strictEqual(isLabMember('lab@x.com'), true, 'HR 實驗組');
  assert.strictEqual(isLabMember('k@x.com'), false, '他類型轉移的保管人');
  assert.strictEqual(isLabMember('out@x.com'), false, '組外');
  assert.strictEqual(context.getLabMemberChecker_(), isLabMember, '同請求記憶化');
  context.clearLabMemberCheckerMemo_();
  console.log('✅ 整合：getLabMemberChecker_ 合併三個來源且同請求記憶化');
}

// 3. 整合：ensureAppLogOldAeColumn_ 補欄位與表頭，可重複呼叫（spec 2026-10-02 R4）
{
  const calls = [];
  const header = {};
  let maxCols = 18;
  const sheet = {
    getMaxColumns: () => maxCols,
    insertColumnsAfter: (after, n) => { calls.push(`insert:${after}:${n}`); maxCols += n; },
    getRange: (r, c) => ({
      getValue: () => header[`${r},${c}`] || '',
      setValue: v => { header[`${r},${c}`] = v; calls.push(`set:${r},${c}:${v}`); }
    })
  };
  const context = loadContext({}, null, { AL_OLD_AE_COLUMN_INDEX: 19 });
  context.ensureAppLogOldAeColumn_(sheet);
  context.ensureAppLogOldAeColumn_(sheet);
  assert.strictEqual(calls.join('|'), 'insert:18:1|set:1,19:原預設組別(AE)');
  console.log('✅ 整合：ensureAppLogOldAeColumn_ 補欄位與表頭且可重複呼叫');
}

// 4. 整合：殘留 AE 預覽／修正（stub 試算表與資料層）
function makeCleanupContext(options) {
  const opts = options || {};
  const aeCells = Object.assign({}, opts.aeCells);
  const writes = [];
  const masterSheet = {
    getRange: (row) => ({
      getValue: () => aeCells[row],
      setValue: v => { aeCells[row] = v; writes.push({ row: row, value: v }); }
    })
  };
  const logSheet = {
    getLastRow: () => (opts.logRows || []).length + 1,
    getRange: (r, c, n, w) => ({ getValues: () => (opts.logRows || []).map(x => x.slice(0, w)) })
  };
  const assets = opts.assets || [];
  const context = loadContext({ LAB_COMMON_CUSTODIAN_EMAIL: 'ceo@x.com' }, opts.directory, {
    checkAdminPermissions: () => opts.admin !== false,
    getAllAssets: () => assets,
    findAssetLocation: id => {
      const a = assets.find(x => String(x.assetId) === String(id));
      return a ? { sheet: masterSheet, rowIndex: a.row, sheetName: a.sourceSheet } : null;
    },
    SpreadsheetApp: { openById: () => ({ getSheetByName: () => logSheet }) },
    SPREADSHEET_ID: 'sid',
    APPLICATION_LOG_SHEET_NAME: '轉移申請紀錄',
    PROPERTY_MASTER_SHEET_NAME: '財產總表',
    PROPERTY_COLUMN_INDICES: { DEFAULT_GROUP: 31 },
    ITEM_COLUMN_INDICES: { DEFAULT_GROUP: 31 },
    HR_SYNC_MIN_HEADCOUNT: 5
  });
  return { context: context, aeCells: aeCells, writes: writes };
}

{
  const directory = {
    emailToGroup: { 'lab@x.com': '實驗組', 'ceo@x.com': '執行長', 'out@x.com': 'B組', 'out2@x.com': 'C組' },
    emailToName: { 'lab@x.com': '甲', 'ceo@x.com': '執行長', 'out@x.com': '丙', 'out2@x.com': '丁', 'x1@x.com': '戊', 'x2@x.com': '己' },
    allEmails: ['lab@x.com', 'ceo@x.com', 'out@x.com', 'out2@x.com', 'x1@x.com', 'x2@x.com']
  };
  const asset = (id, row, extra) => Object.assign({
    assetId: id, assetName: 'N' + id, sourceSheet: '財產總表', row: row, assetStatus: '在庫', defaultGroup: '實驗組',
    leaderName: '', leaderEmail: '', userName: '', userEmail: ''
  }, extra);
  const assets = [
    asset('A1', 2, { leaderEmail: 'ceo@x.com', userEmail: 'ceo@x.com' }),                    // 公用帳號名下 → ok
    asset('A2', 3, { leaderEmail: 'out@x.com', userEmail: 'out2@x.com' }),                   // → remove
    asset('A3', 4, { leaderEmail: 'gone@x.com' }),                                           // 不在 HR → review
    asset('A4', 5, { defaultGroup: '', leaderEmail: 'out@x.com' }),                          // AE 空白 → skip
    asset('A5', 6, { assetStatus: '轉移中', leaderEmail: 'out@x.com', userEmail: 'out2@x.com' }), // 轉移中 → skip
    asset('A6', 7, { leaderEmail: 'out@x.com', userEmail: 'out2@x.com' })                    // 快照為 remove，但格子已被改掉
  ];
  const aeCells = { 2: '實驗組', 3: '實驗組', 4: '實驗組', 5: '', 6: '實驗組', 7: '' };

  const preview = makeCleanupContext({ directory: directory, assets: assets, aeCells: aeCells });
  const p = preview.context.previewLabAeCleanup();
  assert.strictEqual(Array.from(p.remove).map(i => i.assetId).join('|'), 'A2|A6');
  assert.strictEqual(Array.from(p.review).map(i => i.assetId).join('|'), 'A3');
  assert.strictEqual(p.okCount, 1);
  assert.strictEqual(preview.writes.length, 0, '預覽不得寫入');
  console.log('✅ 整合：previewLabAeCleanup 分類正確且不寫入（公用帳號名下資產列為正常）');

  const apply = makeCleanupContext({ directory: directory, assets: assets, aeCells: aeCells });
  const a = apply.context.applyLabAeCleanup();
  assert.strictEqual(a.updated, 1);
  assert.strictEqual(apply.aeCells[3], '', 'A2 清除');
  assert.strictEqual(apply.aeCells[2], '實驗組', 'A1 公用帳號名下保留');
  assert.strictEqual(apply.aeCells[4], '實驗組', 'A3 需人工確認不動');
  assert.strictEqual(apply.writes.length, 1, '只寫入一格（A6 寫入前重讀已非實驗組而略過）');
  console.log('✅ 整合：applyLabAeCleanup 只清除可安全移除者，寫入前重讀');

  const denied = makeCleanupContext({ admin: false, directory: directory, assets: assets, aeCells: aeCells });
  assert.throws(() => denied.context.previewLabAeCleanup(), /權限不足/);
  assert.throws(() => denied.context.applyLabAeCleanup(), /權限不足/);
  const degraded = makeCleanupContext({ directory: Object.assign({}, directory, { allEmails: ['a@x.com'] }), assets: assets, aeCells: aeCells });
  assert.throws(() => degraded.context.applyLabAeCleanup(), /HR 名錄人數異常/);
  assert.strictEqual(degraded.writes.length, 0);
  console.log('✅ 整合：非管理員與名錄異常時中止');
}

console.log('🎉 lab_default_group 全部測試通過');
