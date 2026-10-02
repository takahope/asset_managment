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
