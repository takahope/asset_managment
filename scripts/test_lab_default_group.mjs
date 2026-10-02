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

console.log('🎉 lab_default_group 全部測試通過');
