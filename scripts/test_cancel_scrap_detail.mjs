// 「報廢中資訊」彈窗取消報廢申請測試（2026-11-06）
// 自 alpine_store.html / alpine_views.html 擷取實際程式碼，以 vm 執行並 stub Alpine / google.script.run。
// 涵蓋：①取消權限共用判斷與改版前列表邏輯逐項等價 ②彈窗開啟時帶入 canCancel
//       ③彈窗取消流程（成功／失敗／重複點擊／彈窗已換成別筆）④markup 繫結檢查
// 執行：node scripts/test_cancel_scrap_detail.mjs
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const storeHtml = fs.readFileSync(path.join(ROOT, 'alpine_store.html'), 'utf8');
const viewsHtml = fs.readFileSync(path.join(ROOT, 'alpine_views.html'), 'utf8');
const codeJs = fs.readFileSync(path.join(ROOT, 'code.js'), 'utf8');

// 擷取 store 成員（12 格縮排的屬性，至同縮排的結尾 `},`）
function extractMember(src, head) {
  const start = src.indexOf(head);
  assert.ok(start !== -1, '找不到 alpine_store.html 中的 ' + head);
  const end = src.indexOf('\n            },', start);
  assert.ok(end !== -1, '找不到 ' + head + ' 的結尾');
  return src.slice(start, end + '\n            },'.length);
}
const members = [
  'get isAdminView()',
  'isInventoryTaskOnly: function',
  'getCancelContext: function',
  'canCancelAsset: function',
  'isAssetProcessing: function',
  'addProcessingAsset: function',
  'removeProcessingAsset: function',
  'handleOpenStatusDetail: function',
  'handleCloseStatusDetail: function'
].map(h => extractMember(storeHtml, h)).join('\n');

const modalSrc = viewsHtml.match(/Alpine\.data\('statusDetailModal'[\s\S]*?\n    \}\);\n/);
assert.ok(modalSrc, '找不到 statusDetailModal 元件註冊程式碼');

// ---- vm 環境 ----
const context = {};
vm.createContext(context);
const calls = [];                // 後端呼叫紀錄
let pending = null;              // 最近一次尚未回應的 cancelTransferOrScrap
function makeRun() {
  const run = { _s: null, _f: null };
  run.withSuccessHandler = function (fn) { run._s = fn; return run; };
  run.withFailureHandler = function (fn) { run._f = fn; return run; };
  ['getAssetStatusDetail', 'cancelTransferOrScrap'].forEach(name => {
    run[name] = function () {
      const rec = { name, args: Array.from(arguments), success: run._s, failure: run._f };
      calls.push(rec);
      if (name === 'cancelTransferOrScrap') pending = rec;
      run._s = null; run._f = null;
      return run;
    };
  });
  return run;
}
context.google = { script: { run: makeRun() } };
context.console = console;
context.window = {};
context.requestAnimationFrame = fn => fn();
vm.runInContext([
  'var normalizeEmail = function (v) { return String(v || "").trim().toLowerCase(); };',
  'var STATUS_DETAIL_TYPES = { "轉移中": "transfer", "出借中": "lending", "借出中": "lending", "報廢中": "scrap" };',
  'var refs = { statusDetailRequest: 0 };',
  'this.makeStore = function () { return {',
  '  isAdmin: false, viewMode: "user", currentUserEmail: "me@x.com", transferOptions: null,',
  '  inventoryStatusByAsset: {}, processingAssetIds: [], statusDetailState: null, allAssets: [],',
  '  buildCachedStatusDetail: function () { return null; },',
  members,
  '}; };'
].join('\n'), context);

const registry = {};
context.Alpine = { data: (name, factory) => { registry[name] = factory; } };
context.S = { STATUS_DETAIL_THEMES: {}, STATUS_COLORS: {}, getAssetAliasLabel: () => '', getAssetAliasDisplay: () => '' };
vm.runInContext(modalSrc[0], context);
assert.strictEqual(typeof registry.statusDetailModal, 'function', 'statusDetailModal 已註冊');

let passed = 0;
function check(fn, name) { fn(); passed++; console.log('  ✓ ' + name); }

function makeOptions(o) {
  return {
    groupViewEnabled: o.view,
    groupProxyTransferLendEnabled: o.transferLend,
    groupProxyScrapEnabled: o.scrap,
    groupMemberEmailsLower: ['peer@x.com']
  };
}

// ① 取消權限：與改版前列表(alpine_views.html assetTable.rows)的 inline 判斷逐項等價 ----
// 以下 legacy 為改版前的原始運算式（含 isTask 的「僅限盤點」排除）
function legacyCanCancel(store, asset, isTask) {
  const opts = store.transferOptions;
  const normalizedCurrentEmail = String(store.currentUserEmail || '').toLowerCase().trim();
  const groupViewEnabled = (opts && (opts.groupViewEnabled !== undefined ? opts.groupViewEnabled : opts.groupProxyEnabled)) || false;
  const groupTransferLendEnabled = (opts && (opts.groupProxyTransferLendEnabled !== undefined ? opts.groupProxyTransferLendEnabled : opts.groupProxyEnabled)) || false;
  const groupScrapEnabled = (opts && (opts.groupProxyScrapEnabled !== undefined ? opts.groupProxyScrapEnabled : opts.groupProxyEnabled)) || false;
  const groupMemberEmailsLower = (opts && opts.groupMemberEmailsLower) || [];
  const isAdmin = store.isAdminView;
  const isOwner = normalizedCurrentEmail &&
    (normalizedCurrentEmail === String(asset.leaderEmail || '').toLowerCase().trim() ||
      normalizedCurrentEmail === String(asset.userEmail || '').toLowerCase().trim());
  const assetLeaderEmail = String(asset.leaderEmail || '').toLowerCase().trim();
  const isGroupMemberAsset = groupViewEnabled &&
    assetLeaderEmail !== normalizedCurrentEmail &&
    groupMemberEmailsLower.indexOf(assetLeaderEmail) !== -1;
  return !!(!isTask && (isAdmin || isOwner || (isGroupMemberAsset && ((asset.status === '報廢中' && groupScrapEnabled) || (asset.status !== '報廢中' && groupTransferLendEnabled)))));
}

check(() => {
  let combos = 0;
  [true, false].forEach(isAdmin => {
    ['me@x.com', ''].forEach(current => {
      ['me@x.com', 'peer@x.com', 'out@x.com'].forEach(leader => {
        ['me@x.com', '', 'other@x.com'].forEach(user => {
          ['報廢中', '轉移中', '待接收'].forEach(status => {
            [true, false].forEach(view => [true, false].forEach(tl => [true, false].forEach(sc => [true, false].forEach(task => {
              const store = context.makeStore();
              store.isAdmin = isAdmin; store.viewMode = 'admin';
              store.currentUserEmail = current;
              store.transferOptions = makeOptions({ view, transferLend: tl, scrap: sc });
              const asset = { assetId: 'A1', leaderEmail: leader, userEmail: user, status };
              if (task) store.inventoryStatusByAsset = { A1: { status: '未盤點' } };
              const isTask = store.isInventoryTaskOnly(asset);
              assert.strictEqual(store.canCancelAsset(asset, store.getCancelContext()), legacyCanCancel(store, asset, isTask),
                JSON.stringify({ isAdmin, current, leader, user, status, view, tl, sc, task }));
              combos++;
            }))));
          });
        });
      });
    });
  });
  assert.ok(combos > 1000, '組合數足夠：' + combos);
}, '共用判斷與改版前列表邏輯逐項等價（全排列組合）');

check(() => {
  const store = context.makeStore();
  store.transferOptions = makeOptions({ view: true, transferLend: true, scrap: true });
  const asset = { assetId: 'A1', leaderEmail: 'me@x.com', userEmail: '', status: '報廢中' };
  assert.strictEqual(store.canCancelAsset(asset), true, '省略 ctx 時自行建立');
  assert.strictEqual(store.canCancelAsset(null), false, 'null 資產');
  store.transferOptions = null;
  assert.strictEqual(store.canCancelAsset({ assetId: 'A2', leaderEmail: 'out@x.com', userEmail: '', status: '報廢中' }), false, 'transferOptions 尚未載入時不報錯');
}, '共用判斷：省略 ctx、null 資產、transferOptions 未載入');

// ② 開啟彈窗時帶入 canCancel ----
function openDetail(store, asset) {
  calls.length = 0;
  store.handleOpenStatusDetail(asset);
  return calls.find(c => c.name === 'getAssetStatusDetail');
}

check(() => {
  const store = context.makeStore();
  store.transferOptions = makeOptions({ view: false, transferLend: false, scrap: false });
  const own = { assetId: 'A1', assetName: 'NB', leaderEmail: 'me@x.com', userEmail: '', status: '報廢中' };
  const rec = openDetail(store, own);
  assert.strictEqual(store.statusDetailState.canCancel, true, '本人名下 → 可取消');
  // 背景更新回來後 canCancel 不能遺失
  rec.success({ status: '報廢中', type: 'scrap', detail: { scrapReason: 'A' } });
  assert.strictEqual(store.statusDetailState.canCancel, true, '背景更新後仍保留 canCancel');
  assert.strictEqual(store.statusDetailState.detail.scrapReason, 'A');

  const other = { assetId: 'A2', assetName: 'PC', leaderEmail: 'out@x.com', userEmail: '', status: '報廢中' };
  openDetail(store, other);
  assert.strictEqual(store.statusDetailState.canCancel, false, '他人資產且非同組 → 不可取消');
}, '開啟彈窗：依資產帶入 canCancel，背景更新後保留');

// ③ 彈窗取消流程 ----
function setupModal(canCancel, type, status) {
  const store = context.makeStore();
  store.allAssets = [{ assetId: 'A1', status: '報廢中' }];
  store.updateAssetLocalStatus = function (id, st) { store.localStatus = { id, st }; };
  store.toastOrAlert = function (msg, level) { store.toast = { msg, level }; };
  store.statusDetailState = {
    asset: { assetId: 'A1', assetName: 'NB', status: status || '報廢中' },
    type: type || 'scrap', detail: {}, isLoading: false, error: '', canCancel: canCancel
  };
  const comp = registry.statusDetailModal();
  comp.$store = { app: store };
  comp.$nextTick = fn => fn();
  comp.$refs = {};
  calls.length = 0; pending = null;
  return { store, comp };
}

check(() => {
  assert.strictEqual(setupModal(true, 'scrap', '報廢中').comp.canCancelScrap, true);
  assert.strictEqual(setupModal(false, 'scrap', '報廢中').comp.canCancelScrap, false, '無權限不顯示');
  assert.strictEqual(setupModal(true, 'transfer', '轉移中').comp.canCancelScrap, false, '轉移彈窗不顯示（本次範圍外）');
  assert.strictEqual(setupModal(true, 'lending', '出借中').comp.canCancelScrap, false, '出借彈窗不顯示');
  assert.strictEqual(setupModal(true, 'scrap', '已報廢').comp.canCancelScrap, false, '狀態已非報廢中（背景更新後）不顯示');
}, '取消鈕可見條件：僅「報廢中」彈窗 + 有權限 + 狀態仍為報廢中');

check(() => {
  const { comp } = setupModal(true);
  assert.strictEqual(comp.confirmingCancel, false);
  comp.cancelError = '舊錯誤';
  comp.startCancel();
  assert.strictEqual(comp.confirmingCancel, true, '按下按鈕進入確認列');
  assert.strictEqual(comp.cancelError, '', '進入確認列清除舊錯誤');
  comp.abortCancel();
  assert.strictEqual(comp.confirmingCancel, false, '返回收起確認列');
}, '確認列：開啟 / 返回');

check(() => {
  const { store, comp } = setupModal(true);
  comp.startCancel();
  comp.submitCancel();
  assert.strictEqual(calls.filter(c => c.name === 'cancelTransferOrScrap').length, 1);
  assert.deepStrictEqual(calls[0].args, ['A1'], '以財產編號呼叫既有後端');
  assert.strictEqual(comp.isCancelling, true, '處理中');
  assert.ok(store.isAssetProcessing('A1'), '列表該列同步鎖定');
  comp.abortCancel();
  assert.strictEqual(comp.confirmingCancel, true, '處理中不可返回');
  comp.submitCancel();
  assert.strictEqual(calls.filter(c => c.name === 'cancelTransferOrScrap').length, 1, '處理中重複點擊不重送');
  pending.success({ success: true });
  assert.strictEqual(comp.isCancelling, false);
  assert.ok(!store.isAssetProcessing('A1'), '解除列鎖定');
  assert.strictEqual(store.statusDetailState, null, '成功後彈窗關閉');
  assert.deepStrictEqual(store.localStatus, { id: 'A1', st: '在庫' }, '列表該筆立即變回在庫');
  assert.strictEqual(store.toast.level, 'success');
}, '取消成功：送出一次、處理中鎖定、關閉彈窗、列表狀態變回在庫');

check(() => {
  const { store, comp } = setupModal(true);
  comp.startCancel();
  comp.submitCancel();
  pending.success({ success: false, error: '此財產的狀態 (已報廢) 無法被取消。' });
  assert.strictEqual(comp.cancelError, '此財產的狀態 (已報廢) 無法被取消。', '錯誤顯示在確認列');
  assert.ok(store.statusDetailState, '失敗時彈窗不關');
  assert.strictEqual(comp.confirmingCancel, true);
  assert.strictEqual(comp.isCancelling, false, '可返回或重試');
  assert.ok(!store.isAssetProcessing('A1'));
  assert.strictEqual(store.localStatus, undefined, '失敗不改列表狀態');
}, '取消失敗（後端回 success:false）：錯誤顯示在確認列、彈窗不關');

check(() => {
  const { store, comp } = setupModal(true);
  comp.startCancel();
  comp.submitCancel();
  pending.failure({ message: '網路中斷' });
  assert.strictEqual(comp.cancelError, '網路中斷');
  assert.ok(store.statusDetailState);
  assert.ok(!store.isAssetProcessing('A1'));
  comp.submitCancel();
  assert.strictEqual(calls.filter(c => c.name === 'cancelTransferOrScrap').length, 2, '失敗後可重試');
  assert.strictEqual(comp.cancelError, '', '重試時清除舊錯誤');
}, '取消失敗（連線錯誤）：顯示訊息且可重試');

check(() => {
  const { store, comp } = setupModal(true);
  comp.startCancel();
  comp.submitCancel();
  // 使用者在回應前關掉彈窗並改開另一筆
  store.statusDetailState = { asset: { assetId: 'B9', status: '報廢中' }, type: 'scrap', detail: {}, isLoading: false, error: '', canCancel: true };
  pending.success({ success: true });
  assert.ok(store.statusDetailState && store.statusDetailState.asset.assetId === 'B9', '不可誤關別筆資產的彈窗');
  assert.deepStrictEqual(store.localStatus, { id: 'A1', st: '在庫' }, '但 A1 的列表狀態仍要更新');
}, '回應時彈窗已換成別筆：不誤關，仍更新 A1 狀態');

// ④ markup / 後端契約 ----
check(() => {
  assert.ok(/x-show="canCancelScrap"/.test(viewsHtml), '彈窗頁尾有取消鈕（canCancelScrap）');
  assert.ok(/@click="startCancel\(\)"/.test(viewsHtml), '取消鈕綁 startCancel');
  assert.ok(/@click="submitCancel\(\)"/.test(viewsHtml), '確認鈕綁 submitCancel');
  assert.ok(/x-text="cancelError"/.test(viewsHtml), '錯誤訊息繫結 cancelError');
  assert.ok(/store\.canCancelAsset\(asset,\s*cancelCtx\)/.test(viewsHtml), '列表 canCancel 改走共用判斷');
  assert.ok(/function cancelTransferOrScrap\(assetId\)/.test(codeJs), '後端沿用 cancelTransferOrScrap');
}, 'markup 繫結與後端契約');

console.log('\n通過 ' + passed + ' 組測試');
