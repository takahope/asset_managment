// 「只通知組別窗口」Node 測試執行器（spec 2026-10-01）
// 以 vm 載入實際 GAS 檔案，執行共用測試套件 + Node 專屬整合/效能案例。
// 執行：node scripts/test_group_notify.mjs
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FILES = ['group_notify.js', 'group_notify_test.js'];
const SUITES = ['testGroupNotifyRouting_'];

function loadContext(props) {
  const store = Object.assign({}, props || {});
  const reads = {};
  const sent = [];
  const context = {
    Logger: { log: () => {} },
    PropertiesService: {
      getScriptProperties: () => ({
        getProperty: key => {
          reads[key] = (reads[key] || 0) + 1;
          return Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null;
        }
      })
    },
    canonicalizeGroupName_: g => String(g || '').trim(),
    isUserEmailEnabled: () => true,
    getKeeperDirectory_: () => ({
      emailToGroup: { 'chen@x.com': 'C組' },
      emailToName: { 'chen@x.com': '陳大華' },
      groupToMembers: { 'C組': ['chen@x.com'] }
    }),
    MailApp: { sendEmail: (to, subject, body) => { sent.push({ to, subject, body }); } }
  };
  vm.createContext(context);
  FILES.forEach(file => {
    vm.runInContext(fs.readFileSync(path.join(ROOT, file), 'utf8'), context, { filename: file });
  });
  return { context, sent, reads };
}

// 1. 共用測試套件（與 GAS 編輯器執行同一份）
{
  const { context } = loadContext();
  SUITES.forEach(suite => {
    const result = context[suite]();
    assert.strictEqual(result.failed, 0, `${suite} 失敗 ${result.failed} 項：\n${result.failures.join('\n')}`);
    console.log(`✅ ${suite}：${result.passed} 項通過`);
  });
}

// 2. 整合：未注入時讀 Script Properties 並經 MailApp 寄窗口
{
  const { context, sent } = loadContext({
    GROUP_CONTACT_NOTIFY_ONLY: 'true',
    GROUP_NOTIFY_CONTACTS: JSON.stringify({ 'C組': 'CWin@x.com' })
  });
  const collector = context.createMailCollector_({ event: 'transferApply', operatorEmail: 'op@x.com', appUrl: 'https://app' });
  collector.add({
    email: 'chen@x.com',
    items: [{ assetId: 'P1', assetName: '顯微鏡', aeValue: '', kind: 'approve', windowLine: 'P1: 顯微鏡 → 待 陳大華（新保管人）審核' }],
    render: () => ({ subject: 'personal', body: 'personal' })
  });
  const summary = collector.flush();
  assert.strictEqual(sent.map(m => m.to).join('|'), 'cwin@x.com');
  assert.strictEqual(summary.windowCount, 1);
  assert.strictEqual(sent[0].subject, '[組別窗口通知][C組] 財產轉移申請：1 筆（其中 1 筆待接收審核）');
  console.log('✅ 整合：開關開啟時讀取 Script Properties 並經 MailApp 寄窗口');
}

// 3. 整合：開關未設定（預設關閉）→ 照舊寄本人
{
  const { context, sent } = loadContext({ GROUP_NOTIFY_CONTACTS: JSON.stringify({ 'C組': 'cwin@x.com' }) });
  const collector = context.createMailCollector_({ event: 'transferApply', operatorEmail: 'op@x.com', appUrl: 'https://app' });
  collector.add({
    email: 'chen@x.com',
    items: [{ assetId: 'P1', assetName: '顯微鏡', aeValue: '', kind: 'approve', windowLine: 'x' }],
    render: () => ({ subject: 'personal', body: 'personal' })
  });
  collector.flush();
  assert.strictEqual(sent.map(m => m.to).join('|'), 'chen@x.com');
  console.log('✅ 整合：開關預設關閉時照舊寄本人');
}

// 4. 效能：同請求內窗口設定只讀一次（避免逐筆 PropertiesService RPC，參 2026-09-15 事件）
{
  const { context, reads } = loadContext({
    GROUP_CONTACT_NOTIFY_ONLY: 'true',
    GROUP_NOTIFY_CONTACTS: JSON.stringify({ 'C組': 'cwin@x.com' })
  });
  const items = Array.from({ length: 500 }, (_, i) => ({ assetId: 'P' + i, assetName: 'N', aeValue: '', kind: 'approve', windowLine: 'P' + i }));
  for (let round = 0; round < 3; round++) {
    const collector = context.createMailCollector_({ event: 'transferApply', operatorEmail: 'op@x.com', appUrl: 'https://app' });
    collector.add({ email: 'chen@x.com', items, render: () => ({ subject: 's', body: 'b' }) });
    collector.flush();
  }
  assert.strictEqual(reads.GROUP_NOTIFY_CONTACTS, 1, 'GROUP_NOTIFY_CONTACTS 同請求內應只讀一次');
  assert.ok(reads.GROUP_CONTACT_NOTIFY_ONLY <= 3, '開關每次 flush 至多讀一次');
  console.log('✅ 效能：500 筆 × 3 次 flush，窗口設定只讀 1 次');
}

console.log('🎉 group_notify 全部測試通過');
