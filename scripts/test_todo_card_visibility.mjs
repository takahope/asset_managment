// 待辦卡片顯示規則測試（2026-10-19）：使用者視角隱藏兩張「待列印」卡，待辦總數不計入
// 自 alpine_store.html / alpine_views.html 擷取實際程式碼，以 vm 執行並 stub Alpine store。
// 執行：node scripts/test_todo_card_visibility.mjs
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const storeHtml = fs.readFileSync(path.join(ROOT, 'alpine_store.html'), 'utf8');
const viewsHtml = fs.readFileSync(path.join(ROOT, 'alpine_views.html'), 'utf8');

// 擷取 store 成員（12 格縮排的屬性，至同縮排的結尾 `},`）
function extractMember(src, head) {
  const start = src.indexOf(head);
  assert.ok(start !== -1, '找不到 alpine_store.html 中的 ' + head);
  const end = src.indexOf('\n            },', start);
  assert.ok(end !== -1, '找不到 ' + head + ' 的結尾');
  return src.slice(start, end + '\n            },'.length);
}
const members = [
  extractMember(storeHtml, 'get isAdminView()'),
  extractMember(storeHtml, 'isTodoCardVisible: function'),
  extractMember(storeHtml, 'get sidebarPendingTotal()'),
  extractMember(storeHtml, 'showSuccessPrompt: function')
].join('\n');

const comp = viewsHtml.match(/Alpine\.data\('dashboardCards'[\s\S]*?\n    \}\);\n/);
assert.ok(comp, '找不到 dashboardCards 元件註冊程式碼');

const context = {};
vm.createContext(context);
// cardCounts 以一般屬性 stub（其計算邏輯不在本測試範圍）
vm.runInContext('this.makeStore = function (cardCounts) { return {\n'
  + 'isAdmin: false, viewMode: "user", cardCounts: cardCounts,\n' + members + '\n}; };', context);

let store;
const registry = {};
context.Alpine = {
  data: (name, factory) => { registry[name] = factory; },
  store: () => store
};
vm.runInContext(comp[0], context);
assert.strictEqual(typeof registry.dashboardCards, 'function', 'dashboardCards 已註冊');

const ALL_IDS = 'transferring|pending|lent|scrapPending|transferPending|inventory|locationError';
const USER_IDS = 'transferring|pending|lent|inventory|locationError';
const counts = { transferring: 1, pending: 2, lent: 4, scrapPending: 8, transferPending: 16, inventory: 32, locationError: 64 };

function setup(view, cardCounts) {
  store = context.makeStore(cardCounts);
  store.isAdmin = view === 'admin';
  store.viewMode = view === 'admin' ? 'admin' : 'user';
  const cards = registry.dashboardCards();
  const visibleIds = () => cards.visibleCards.map(c => c.id).join('|');
  return { store, cards, visibleIds };
}

let passed = 0;
function check(fn, name) { fn(); passed++; console.log('  ✓ ' + name); }

check(() => {
  const { cards, visibleIds } = setup('user', counts);
  assert.strictEqual(cards.cards.length, 7, '卡片定義仍保留 7 張');
  assert.strictEqual(visibleIds(), USER_IDS);
}, '使用者視角：可見 5 張卡、不含兩張待列印卡、順序不變');

check(() => {
  const { store } = setup('user', counts);
  assert.strictEqual(store.sidebarPendingTotal, 1 + 2 + 4 + 32 + 64);
}, '使用者視角：待辦總數不計兩張待列印卡（其數字非 0）');

check(() => {
  const { visibleIds } = setup('admin', counts);
  assert.strictEqual(visibleIds(), ALL_IDS);
}, '管理員視角：可見 7 張卡、順序不變');

check(() => {
  const { store } = setup('admin', counts);
  assert.strictEqual(store.sidebarPendingTotal, 127);
}, '管理員視角：待辦總數為 7 張總和');

check(() => {
  const { store, visibleIds } = setup('admin', counts);
  store.viewMode = 'user';
  assert.strictEqual(visibleIds(), USER_IDS);
  assert.strictEqual(store.sidebarPendingTotal, 103);
  store.viewMode = 'admin';
  assert.strictEqual(visibleIds(), ALL_IDS);
  assert.strictEqual(store.sidebarPendingTotal, 127);
}, '視角切換：清單與總數隨之改變並可恢復');

check(() => {
  const sparse = { transferring: undefined, pending: null, lent: 3, scrapPending: null, transferPending: undefined, inventory: 5 };
  assert.strictEqual(setup('admin', sparse).store.sidebarPendingTotal, 8);
  assert.strictEqual(setup('user', sparse).store.sidebarPendingTotal, 8);
}, '數字缺值（undefined／null）視為 0');

check(() => {
  const extended = Object.assign({}, counts, { newCard: 128 });
  assert.strictEqual(setup('admin', extended).store.sidebarPendingTotal, 255);
  assert.strictEqual(setup('user', extended).store.sidebarPendingTotal, 231);
}, 'cardCounts 新增的卡片 key（預設可見）自動計入待辦總數');

check(() => {
  const { store } = setup('user', counts);
  store.showSuccessPrompt({ actionType: 'TRANSFER', requiresPrint: true });
  assert.strictEqual(store.successPromptData.requiresPrint, false);
}, '使用者視角：成功提示不顯示「前往列印申請單」');

check(() => {
  const { store } = setup('admin', counts);
  store.showSuccessPrompt({ actionType: 'SCRAP', requiresPrint: true });
  assert.strictEqual(store.successPromptData.requiresPrint, true);
  store.showSuccessPrompt({ actionType: 'SCRAP' });
  assert.strictEqual(store.successPromptData.requiresPrint, false);
}, '管理員視角：成功提示依 requiresPrint 顯示列印按鈕');

console.log('✅ 待辦卡片顯示規則：' + passed + ' 項通過');
