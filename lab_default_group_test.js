/**
 * lab_default_group_test.js — 實驗組 AE 規則單元測試（spec 2026-10-02）
 * GAS 編輯器執行 runLabDefaultGroupTests()；Node 由 scripts/test_lab_default_group.mjs 以 vm 載入同一份。
 * 依賴 group_notify_test.js 的 createNotifyTestReporter_；外部依賴一律以參數注入，不讀試算表、不寫入。
 */

function testLabDefaultGroup_() {
  const t = createNotifyTestReporter_();
  const canon = function (g) {
    const s = String(g || '').trim();
    return ({ '實驗室組': '實驗組' })[s] || s;
  };
  const directory = {
    emailToGroup: { 'lab1@x.com': '實驗組', 'lab2@x.com': '實驗室組', 'ceo@x.com': '執行長', 'out@x.com': 'B組', 'out2@x.com': 'C組' },
    emailToName: { 'lab1@x.com': '甲', 'lab2@x.com': '乙', 'ceo@x.com': '執行長本人', 'out@x.com': '丙', 'out2@x.com': '丁' }
  };
  const isLabMember = buildLabMemberChecker_({
    directory: directory, commonAccounts: collectLabCommonAccounts_(' CEO@X.com ', []), canonicalize: canon
  });
  const isActive = function (email) {
    return Object.prototype.hasOwnProperty.call(directory.emailToName, String(email || '').toLowerCase().trim());
  };

  // 案例 40：公用帳號集合
  t.eq('40-1 設定值小寫去空白', JSON.stringify(collectLabCommonAccounts_(' CEO@X.com ', [])), '{"ceo@x.com":true}');
  t.eq('40-2 空設定忽略', JSON.stringify(collectLabCommonAccounts_('', [])), '{}');
  t.eq('40-3 收共同轉移列新保管人（含代理前綴），忽略他類型、空值與 null',
    JSON.stringify(collectLabCommonAccounts_(null, [
      { newKeeperEmail: 'Old@X.com', transferType: '轉移實驗組(共同)' },
      { newKeeperEmail: 'old2@x.com', transferType: '【同組代理】轉移實驗組(共同)（原保管人：甲）' },
      { newKeeperEmail: 'p@x.com', transferType: '轉移實驗組(個人)' },
      { newKeeperEmail: 'k@x.com', transferType: '保管人+使用人' },
      { newKeeperEmail: '', transferType: '轉移實驗組(共同)' },
      null
    ])), '{"old@x.com":true,"old2@x.com":true}');

  // 案例 41：成員判定
  t.eq('41-1 空 email 非成員', isLabMember('') + '|' + isLabMember(null), 'false|false');
  t.eq('41-2 公用帳號（HR 為執行長）是成員', isLabMember('ceo@x.com'), true);
  t.eq('41-3 HR 實驗組與別名是成員（大小寫不敏感）', isLabMember('LAB1@x.com') + '|' + isLabMember(' lab2@x.com '), 'true|true');
  t.eq('41-4 組外與查無非成員', isLabMember('out@x.com') + '|' + isLabMember('nobody@x.com'), 'false|false');
  t.eq('41-5 原型鍵 email 不誤判',
    buildLabMemberChecker_({ directory: { emailToGroup: {} }, commonAccounts: {}, canonicalize: canon })('constructor'), false);

  // 案例 42：computePostTransferAe_
  const post = function (o) {
    return computePostTransferAe_(Object.assign({ hasUserColumn: true, isLabMember: isLabMember, canonicalize: canon }, o));
  };
  t.eq('42-1 實驗組(個人) → 實驗組', post({ currentAe: '', transferType: '轉移實驗組(個人)', newKeeperEmail: 'out@x.com' }), '實驗組');
  t.eq('42-2 實驗組(共同) → 實驗組', post({ currentAe: 'B組', transferType: '轉移實驗組(共同)', newKeeperEmail: 'ceo@x.com' }), '實驗組');
  t.eq('42-3 同組代理前綴 → 實驗組',
    post({ currentAe: '', transferType: '【同組代理】轉移實驗組(個人)（原保管人：甲）', newKeeperEmail: 'lab1@x.com' }), '實驗組');
  t.eq('42-4 AE 為他組不變',
    post({ currentAe: 'B組', transferType: '保管人+使用人', newKeeperEmail: 'out2@x.com', newUserEmail: 'out2@x.com' }), 'B組');
  t.eq('42-5 未傳 isLabMember 不變',
    computePostTransferAe_({ currentAe: '實驗組', transferType: '保管人', newKeeperEmail: 'out@x.com', canonicalize: canon }), '實驗組');
  t.eq('42-6 新保管人為成員保留',
    post({ currentAe: '實驗組', transferType: '保管人+使用人', newKeeperEmail: 'lab1@x.com', newUserEmail: 'out@x.com' }), '實驗組');
  t.eq('42-7 新使用人為成員保留',
    post({ currentAe: '實驗組', transferType: '保管人+使用人', newKeeperEmail: 'out@x.com', newUserEmail: 'lab2@x.com' }), '實驗組');
  t.eq('42-8 皆非成員移除',
    post({ currentAe: '實驗組', transferType: '保管人+使用人', newKeeperEmail: 'out@x.com', newUserEmail: 'out2@x.com' }), '');
  t.eq('42-9 使用人空白視為保管人',
    post({ currentAe: '實驗組', transferType: '保管人', newKeeperEmail: 'out@x.com', newUserEmail: '' }) + '|' +
    post({ currentAe: '實驗組', transferType: '保管人', newKeeperEmail: 'lab1@x.com', newUserEmail: '' }), '|實驗組');
  t.eq('42-10 物品總表忽略使用人',
    post({ currentAe: '實驗組', transferType: '保管人', newKeeperEmail: 'out@x.com', newUserEmail: 'lab1@x.com', hasUserColumn: false }), '');
  t.eq('42-11 轉給公用帳號保留',
    post({ currentAe: '實驗組', transferType: '保管人+使用人', newKeeperEmail: 'CEO@x.com', newUserEmail: 'ceo@x.com' }), '實驗組');
  t.eq('42-12 空設定＋物品總表＋空使用人不誤判', computePostTransferAe_({
    currentAe: '實驗組', transferType: '保管人', newKeeperEmail: 'out@x.com', newUserEmail: '', hasUserColumn: false, canonicalize: canon,
    isLabMember: buildLabMemberChecker_({ directory: directory, commonAccounts: collectLabCommonAccounts_('', []), canonicalize: canon })
  }), '');
  t.eq('42-13 AE 別名與空白辨識為實驗組',
    post({ currentAe: ' 實驗室組 ', transferType: '保管人', newKeeperEmail: 'out@x.com' }), '');

  // 案例 43：computeRollbackAe_ / encodeOldAeForLog_
  const rb = function (o) {
    return computeRollbackAe_(Object.assign({ hasUserColumn: true, isLabMember: isLabMember }, o));
  };
  t.eq('43-1 （空白）→ 空字串', rb({ recordedOldAe: '（空白）', transferType: '轉移實驗組(個人)' }), '');
  t.eq('43-2 記錄實驗組 → 還原', rb({ recordedOldAe: '實驗組', transferType: '保管人+使用人' }), '實驗組');
  t.eq('43-3 記錄他組 → 還原（去空白）', rb({ recordedOldAe: ' B組 ', transferType: '保管人' }), 'B組');
  t.eq('43-4 舊紀錄＋實驗組類型＋還原者為成員',
    rb({ recordedOldAe: '', transferType: '轉移實驗組(個人)', restoredKeeperEmail: 'lab1@x.com' }), '實驗組');
  t.eq('43-5 舊紀錄＋實驗組類型＋還原者非成員',
    rb({ recordedOldAe: '', transferType: '轉移實驗組(共同)', restoredKeeperEmail: 'out@x.com', restoredUserEmail: 'out2@x.com' }), '');
  t.eq('43-6 舊紀錄＋他類型不改動',
    rb({ recordedOldAe: '', transferType: '保管人+使用人', restoredKeeperEmail: 'out@x.com' }), null);
  t.eq('43-7 encodeOldAeForLog_',
    encodeOldAeForLog_('') + '|' + encodeOldAeForLog_(null) + '|' + encodeOldAeForLog_(' 實驗組 '), '（空白）|（空白）|實驗組');

  // 案例 44：classifyLabAeResidue_
  const cls = function (o) {
    return classifyLabAeResidue_(Object.assign({
      ae: '實驗組', status: '在庫', hasUserColumn: true, isLabMember: isLabMember, isActiveHrMember: isActive, canonicalize: canon
    }, o));
  };
  t.eq('44-1 AE 他組 skip', cls({ ae: 'B組', keeperEmail: 'out@x.com' }), 'skip');
  t.eq('44-2 轉移中 skip', cls({ status: '轉移中', keeperEmail: 'out@x.com' }), 'skip');
  t.eq('44-3 已報廢 skip', cls({ status: '已報廢', keeperEmail: 'out@x.com' }), 'skip');
  t.eq('44-4 公用帳號名下 ok', cls({ keeperEmail: 'ceo@x.com', userEmail: 'ceo@x.com' }), 'ok');
  t.eq('44-5 使用人為成員 ok', cls({ keeperEmail: 'out@x.com', userEmail: 'lab1@x.com' }), 'ok');
  t.eq('44-6 皆在職非成員 remove', cls({ keeperEmail: 'out@x.com', userEmail: 'out2@x.com' }), 'remove');
  t.eq('44-7 保管人空白 review', cls({ keeperEmail: '', userEmail: '' }), 'review');
  t.eq('44-8 保管人非 HR review', cls({ keeperEmail: 'gone@x.com', userEmail: '' }), 'review');
  t.eq('44-9 使用人非 HR review', cls({ keeperEmail: 'out@x.com', userEmail: 'gone@x.com' }), 'review');
  t.eq('44-10 物品總表 remove／ok',
    cls({ hasUserColumn: false, keeperEmail: 'out@x.com', userEmail: 'lab1@x.com' }) + '|' +
    cls({ hasUserColumn: false, keeperEmail: 'lab1@x.com' }), 'remove|ok');
  t.eq('44-11 AE 別名辨識', cls({ ae: ' 實驗室組 ', keeperEmail: 'out@x.com', userEmail: 'out2@x.com' }), 'remove');

  // 案例 45：與通知分流 resolvePostTransferAe_ 銜接
  t.eq('45-1 未傳 ctx 維持舊行為', resolvePostTransferAe_('實驗組', '保管人+使用人'), '實驗組');
  t.eq('45-2 傳 ctx 套用新規則', resolvePostTransferAe_('實驗組', '保管人+使用人', {
    newKeeperEmail: 'out@x.com', newUserEmail: 'out2@x.com', hasUserColumn: true, isLabMember: isLabMember, canonicalize: canon
  }), '');

  return t.result('testLabDefaultGroup_');
}

/**
 * GAS 編輯器執行入口：`_` 結尾為私有函式，不會出現在執行選單，故提供此公開包裝。
 * 純函式測試，不讀試算表、不寫入。
 */
function runLabDefaultGroupTests() {
  const result = testLabDefaultGroup_();
  Logger.log(`=== runLabDefaultGroupTests：通過 ${result.passed}，失敗 ${result.failed} ===`);
  return result;
}
