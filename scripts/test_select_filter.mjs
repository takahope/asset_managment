// 轉移彈窗下拉選單關鍵字篩選 filterSelectOptions 測試（2026-10-02）
// 自 alpine_store.html 擷取實際函式原始碼，以 vm 執行。
// 執行：node scripts/test_select_filter.mjs
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const html = fs.readFileSync(path.join(ROOT, 'alpine_store.html'), 'utf8');
const match = html.match(/var filterSelectOptions = function[\s\S]*?\n    };\n/);
assert.ok(match, '找不到 alpine_store.html 中的 filterSelectOptions');
const context = {};
vm.createContext(context);
vm.runInContext(match[0] + '\nthis.filterSelectOptions = filterSelectOptions;', context);
const f = context.filterSelectOptions;
const join = list => Array.from(list).map(x => (Array.isArray(x) ? x[0] : x)).join('|');

const locations = ['B219', '園區B219', '台北駐站', 'A101'];
const people = [['chen@x.com', '陳大華'], ['lin@x.com', '林小美'], ['Wang@X.com', '王小明']];

assert.strictEqual(join(f(locations, '', '')), 'B219|園區B219|台北駐站|A101', '空字串回傳完整清單');
assert.strictEqual(join(f(locations, '   ', '')), 'B219|園區B219|台北駐站|A101', '空白回傳完整清單');
assert.strictEqual(join(f(locations, 'b219', '')), 'B219|園區B219', '不分大小寫、包含即符合');
assert.strictEqual(join(f(locations, '駐站', '')), '台北駐站', '中文包含');
assert.strictEqual(join(f(people, '陳', '')), 'chen@x.com', '人員依姓名比對');
assert.strictEqual(join(f(people, 'WANG', '')), 'Wang@X.com', '人員依 Email 比對（不分大小寫）');
assert.strictEqual(join(f(people, '不存在', '')), '', '查無結果回傳空陣列');
assert.strictEqual(join(f(people, '不存在', 'lin@x.com')), 'lin@x.com', '目前已選的選項永遠保留');
assert.strictEqual(join(f(locations, 'A1', 'B219')), 'B219|A101', '已選字串選項保留並維持原順序');
assert.strictEqual(join(f(null, 'x', '')), '', '非陣列輸入回傳空陣列');
assert.strictEqual(join(f(people, 'x', null)), 'chen@x.com|lin@x.com|Wang@X.com', 'selected 為 null 不保留任何項');
console.log('✅ filterSelectOptions：11 項通過');

// searchSelect 元件邏輯（擷取 alpine_store.html 實際註冊程式碼，以 stub 模擬 Alpine）
const comp = html.match(/document\.addEventListener\('alpine:init', function \(\) \{\n        Alpine\.data\('searchSelect'[\s\S]*?\n    \}\);\n/);
assert.ok(comp, '找不到 searchSelect 元件註冊程式碼');
const registry = {};
const listeners = {};
const winListeners = {};
const frames = [];
Object.assign(context, {
  Alpine: { data: (name, factory) => { registry[name] = factory; } },
  document: {
    addEventListener: (type, fn) => { (listeners[type] = listeners[type] || []).push(fn); },
    removeEventListener: (type, fn) => { listeners[type] = (listeners[type] || []).filter(x => x !== fn); }
  },
  window: {
    innerHeight: 800,
    requestAnimationFrame: fn => { frames.push(fn); },
    addEventListener: (type, fn) => { (winListeners[type] = winListeners[type] || []).push(fn); },
    removeEventListener: (type, fn) => { winListeners[type] = (winListeners[type] || []).filter(x => x !== fn); }
  }
});
vm.runInContext(comp[0], context);
listeners['alpine:init'].forEach(fn => fn());
assert.strictEqual(typeof registry.searchSelect, 'function', 'searchSelect 已註冊');

function mount(list, value, rect) {
  const dispatched = [];
  const focused = [];
  const rootChildren = new Set(['inside']);
  const c = registry.searchSelect({ options: () => list, placeholder: '請選擇...', searchPlaceholder: '搜尋...' });
  c.value = value || '';
  c.$dispatch = (name, detail) => dispatched.push([name, detail]);
  c.$nextTick = fn => fn();
  const box = { top: 100, bottom: 136, left: 20, width: 300 };
  c.$refs = {
    button: { getBoundingClientRect: () => Object.assign({}, box, rect) },
    search: { focus: opts => focused.push(opts) }
  };
  c.$root = { contains: target => rootChildren.has(target) };
  c.init();
  return { c, dispatched, focused, box };
}

{
  const { c, dispatched } = mount(people, 'lin@x.com');
  assert.strictEqual(c.selectedLabel, '林小美', '依值顯示選中名稱');
  c.toggle();
  assert.strictEqual(c.open, true, '點擊按鈕展開');
  c.onInput({ target: { value: '陳' } });
  assert.strictEqual(join(c.filtered), 'chen@x.com', '即時篩選');
  c.pick(c.optValue(c.filtered[0]));
  assert.strictEqual(c.value, 'chen@x.com', '點選後寫入值');
  assert.strictEqual(c.open, false, '選定後收起');
  assert.strictEqual(c.query, '', '收起時清空搜尋');
  assert.strictEqual(JSON.stringify(dispatched), '[["search-select-change","chen@x.com"]]', '發出選定事件');
}
{
  const { c } = mount(people, '');
  assert.strictEqual(c.selectedLabel, '', '未選擇時無名稱（按鈕顯示 placeholder）');
  c.openPanel();
  c.composing = true;
  c.onInput({ target: { value: 'ㄔㄣ' }, isComposing: true });
  assert.strictEqual(c.query, '', '組字期間不篩選');
  c.onEnter({ isComposing: true, keyCode: 229 });
  assert.strictEqual(c.value, '', '組字中的 Enter 不選取');
  c.onCompositionEnd({ target: { value: '王' } });
  assert.strictEqual(c.query, '王', '選字完成才篩選');
  c.onEnter({ isComposing: false, keyCode: 13 });
  assert.strictEqual(c.value, 'Wang@X.com', 'Enter 選第一筆符合項目');
}
{
  const { c } = mount(locations, 'B219');
  c.openPanel();
  c.onInput({ target: { value: '不存在' } });
  assert.strictEqual(c.filtered.length, 0, '查無結果');
  c.onEnter({ keyCode: 13 });
  assert.strictEqual(c.value, 'B219', '查無結果時 Enter 不改變選擇');
  c.pick('');
  assert.strictEqual(c.value, '', '點「請選擇…」可清除選擇');
  c.openPanel();
  listeners.mousedown.forEach(fn => fn({ target: 'inside' }));
  assert.strictEqual(c.open, true, '點面板內部不收起');
  listeners.mousedown.forEach(fn => fn({ target: 'outside' }));
  assert.strictEqual(c.open, false, '點外部收起');
  assert.strictEqual(mount(locations, '不在清單').c.selectedLabel, '不在清單', '值不在清單時顯示原值');
  const before = (listeners.mousedown || []).length;
  c.destroy();
  assert.strictEqual(listeners.mousedown.length, before - 1, 'destroy 移除外部點擊監聽');
}
{
  // 面板以 position: fixed 依按鈕位置浮動，不佔彈窗捲動區高度（2026-10-02 修正撐大彈窗）
  const { c, focused, box } = mount(people, '');
  frames.length = 0;
  c.openPanel();
  const st = c.panelStyle;
  assert.strictEqual(st.position, 'fixed', '面板為 fixed 定位');
  assert.strictEqual(st.top, '140px', '向下展開：緊貼按鈕下緣 + 4px');
  assert.strictEqual(st.bottom, 'auto', '向下展開時不設 bottom');
  assert.strictEqual(st.left, '20px', '與按鈕左緣對齊');
  assert.strictEqual(st.width, '300px', '與按鈕同寬');
  assert.strictEqual(c.listMax, 288, '空間足夠時清單高度上限 288px');
  assert.strictEqual(focused.length, 0, '面板顯示前不聚焦');
  frames.splice(0).forEach(fn => fn());
  assert.strictEqual(JSON.stringify(focused), '[{"preventScroll":true}]', '面板顯示後聚焦搜尋框且不捲動頁面');
  box.top = 700; box.bottom = 736;
  winListeners.scroll.forEach(fn => fn());
  assert.strictEqual(c.panelStyle.top, 'auto', '下方空間不足：改向上展開');
  assert.strictEqual(c.panelStyle.bottom, '104px', '向上展開：貼齊按鈕上緣 + 4px');
  assert.strictEqual(c.listMax, 288, '上方空間足夠時清單高度上限 288px');
  box.top = 200; box.bottom = 236;
  context.window.innerHeight = 400;
  winListeners.resize.forEach(fn => fn());
  assert.strictEqual(c.panelStyle.bottom, '204px', '視窗大小改變時重新定位');
  assert.strictEqual(c.listMax, 128, '空間不足時清單高度隨可用空間縮小');
  c.close();
  box.top = 10; box.bottom = 46;
  winListeners.scroll.forEach(fn => fn());
  assert.strictEqual(c.panelStyle.bottom, '204px', '收起時捲動不重新定位');
  context.window.innerHeight = 800;
  const before = [winListeners.scroll.length, winListeners.resize.length];
  c.destroy();
  assert.deepStrictEqual([winListeners.scroll.length, winListeners.resize.length], [before[0] - 1, before[1] - 1], 'destroy 移除捲動/縮放監聽');
}
{
  // 依選項數估算面板高度：短清單下方放得下就不向上翻（避免無故遮住上方財產資訊）
  const short = mount(locations, '', { top: 500, bottom: 536 }).c;
  short.openPanel();
  assert.strictEqual(short.panelStyle.top, '540px', '短清單下方放得下：向下展開');
  const many = Array.from({ length: 20 }, (_, i) => 'L' + i);
  const long = mount(many, '', { top: 500, bottom: 536 }).c;
  long.openPanel();
  assert.strictEqual(long.panelStyle.bottom, '304px', '長清單下方放不下：向上展開');
}
console.log('✅ searchSelect 元件：38 項通過');
