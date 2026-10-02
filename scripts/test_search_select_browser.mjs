// searchSelect 瀏覽器回歸測試（2026-10-02）：以無頭 Chrome + 真實 Alpine 3.15.12 執行
// 頁面由 repo 實際程式碼組成：alpine_store.html 的 filterSelectOptions/searchSelect、
// alpine_modals_single.html 的「新保管人」下拉 markup、css_tailwind.html，外層仿轉移彈窗結構
// （backdrop-blur 遮罩 + overflow-hidden 外框 + overflow-y-auto 內容區，上方為財產資訊）。
// 執行：node scripts/test_search_select_browser.mjs（無 google-chrome 或無法下載 Alpine 時略過）
import assert from 'node:assert';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const WORK = path.join(os.tmpdir(), 'search-select-browser-test');
fs.mkdirSync(WORK, { recursive: true });

function which(cmd) {
  try { return execFileSync('which', [cmd], { encoding: 'utf8' }).trim(); } catch (e) { return ''; }
}
const chrome = which('google-chrome') || which('chromium') || which('chromium-browser');
if (!chrome) { console.log('⏭️  略過：找不到 google-chrome / chromium'); process.exit(0); }
const alpinePath = path.join(WORK, 'alpine-3.15.12.js');
if (!fs.existsSync(alpinePath)) {
  try {
    execFileSync('curl', ['-sS', '-m', '30', '-o', alpinePath, 'https://cdn.jsdelivr.net/npm/alpinejs@3.15.12/dist/cdn.min.js']);
  } catch (e) { console.log('⏭️  略過：無法下載 Alpine 3.15.12'); process.exit(0); }
}

const store = fs.readFileSync(path.join(ROOT, 'alpine_store.html'), 'utf8');
const fso = store.match(/    var filterSelectOptions = function[\s\S]*?\n    };\n/)[0];
const comp = store.match(/    document\.addEventListener\('alpine:init', function \(\) \{\n        Alpine\.data\('searchSelect'[\s\S]*?\n    \}\);\n/)[0];
const lines = fs.readFileSync(path.join(ROOT, 'alpine_modals_single.html'), 'utf8').split('\n');
const start = lines.findIndex(l => l.includes('searchSelect(') && l.includes('x-model="newKeeperEmail"'));
assert.ok(start !== -1, '找不到新保管人 searchSelect markup');
const indent = lines[start].length - lines[start].trimStart().length;
let end = start + 1;
while (!(lines[end].startsWith(' '.repeat(indent) + '</div>') && lines[end].length - lines[end].trimStart().length === indent)) end++;
const markup = lines.slice(start, end + 1).join('\n');
const css = fs.readFileSync(path.join(ROOT, 'css_tailwind.html'), 'utf8');

const page = `<!doctype html><html><head><meta charset="utf-8">${css}
<script>
window.__issues = [];
window.addEventListener('error', e => window.__issues.push('ERROR: ' + e.message));
console.error = function () { window.__issues.push('console.error: ' + Array.from(arguments).map(String).join(' ')); };
console.warn = function () { window.__issues.push('console.warn: ' + Array.from(arguments).map(String).join(' ')); };
// 無頭 --dump-dom 不產生畫格，requestAnimationFrame（x-show 顯示時機）可能永不觸發：以 16ms 計時器模擬
window.requestAnimationFrame = function (cb) { return setTimeout(function () { cb(performance.now()); }, 16); };
(function () {
${fso}
${comp}
})();
</script>
<script defer src="${alpinePath}"></script>
</head><body>
<div class="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
  <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
    <div id="body" class="px-6 py-4 overflow-y-auto" style="max-height:320px">
      <div id="info" class="mb-4 p-4 bg-slate-50 rounded-lg" style="height:150px">財產資訊</div>
      <div style="height:80px">轉移模式</div>
      <div id="parent" x-data="{ newKeeperEmail: '', cancelled: false, manyKeepers: false, get availableKeepers() { var base = [['chen@x.com','陳大華'],['lin@x.com','林小美'],['wang@x.com','王小明']]; if (!this.manyKeepers) return base; return base.concat(Array.from({ length: 20 }, function (_, i) { return ['p' + i + '@x.com', '同仁' + i]; })); } }">
${markup}
        <button id="cancel" type="button" @click="cancelled = true">取消</button>
      </div>
    </div>
  </div>
</div>
<pre id="out"></pre>
<script>
document.addEventListener('alpine:initialized', () => setTimeout(run, 50));
const $ = s => document.querySelector(s);
const wait = ms => new Promise(r => setTimeout(r, ms));
// x-show 以 setTimeout 延後顯示：以條件輪詢等待，避免固定延遲在虛擬時鐘下不穩定
async function waitFor(cond, ms) { for (let t = 0; t < ms; t += 10) { if (cond()) return true; await wait(10); } return cond(); }
const shown = el => getComputedStyle(el).display !== 'none';
function geo() {
  const b = $('#body'), br = b.getBoundingClientRect(), ir = $('#info').getBoundingClientRect();
  return { scrollTop: b.scrollTop, scrollHeight: b.scrollHeight, infoVisible: ir.bottom > br.top && ir.top >= br.top - 1 };
}
async function run() {
  const r = { steps: [] };
  try {
    const root = $('[x-data^="searchSelect"]');
    const data = () => Alpine.$data(root);
    const before = geo();
    const panel = root.querySelector('[x-ref="panel"]');
    root.querySelector('button').click();
    r.shown = await waitFor(() => shown(panel), 1000);
    await wait(30);
    const after = geo();
    const pr = panel.getBoundingClientRect();
    const hit = document.elementFromPoint(pr.left + pr.width / 2, pr.top + 20);
    r.open = { open: data().open, before, after, panelVisible: !!hit && panel.contains(hit), inViewport: pr.top >= 0 && pr.bottom <= window.innerHeight,
      belowButton: Math.round(pr.top - root.querySelector('button').getBoundingClientRect().bottom), focused: document.activeElement === root.querySelector('input') };
    // 長清單（下方放不下）改向上展開，面板下緣貼齊按鈕上緣
    $('#body').scrollTop = 0;
    root.querySelector('button').click(); await waitFor(() => !shown(panel), 1000);
    Alpine.$data($('#parent')).manyKeepers = true;
    await wait(30);
    root.querySelector('button').click(); await waitFor(() => shown(panel), 1000); await wait(30);
    const pr2 = panel.getBoundingClientRect(), br2 = root.querySelector('button').getBoundingClientRect();
    r.up = { aboveButton: Math.round(br2.top - pr2.bottom), inViewport: pr2.top >= 0, scrollHeight: $('#body').scrollHeight };
    root.querySelector('button').click(); await waitFor(() => !shown(panel), 1000);
    Alpine.$data($('#parent')).manyKeepers = false;
    await wait(30);
    root.querySelector('button').click(); await waitFor(() => shown(panel), 1000); await wait(30);
    const input = root.querySelector('input'); input.value = '陳'; input.dispatchEvent(new Event('input', { bubbles: true })); await wait(50);
    r.filteredLabels = Array.from(panel.querySelectorAll('div.flex span')).map(s => s.textContent);
    const opt = Array.from(panel.querySelectorAll('div.flex')).find(el => el.textContent.includes('陳大華'));
    opt.dispatchEvent(new MouseEvent('mousedown', { bubbles: true })); opt.click();
    await waitFor(() => !shown(panel), 1000);
    const safe = v => (typeof v === 'string' ? v : '[非字串：' + typeof v + ']');
    r.pick = { open: data().open, value: safe(data().value), outer: safe(Alpine.$data($('#parent')).newKeeperEmail), label: root.querySelector('button span').textContent };
    $('#cancel').click(); await wait(30);
    r.cancelWorks = Alpine.$data($('#parent')).cancelled === true;
  } catch (e) { r.exception = e.message; }
  r.issues = window.__issues;
  $('#out').textContent = JSON.stringify(r);
}
</script>
</body></html>`;
const pagePath = path.join(WORK, 'page.html');
fs.writeFileSync(pagePath, page);

let dom = '';
try {
  dom = execFileSync('timeout', ['60', chrome, '--headless=new', '--disable-gpu', '--no-sandbox', '--allow-file-access-from-files',
    '--window-size=1200,900', '--virtual-time-budget=8000', '--dump-dom', 'file://' + pagePath],
    { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 64 * 1024 * 1024 });
} catch (e) { dom = e.stdout || ''; }
const m = dom.match(/<pre id="out">([\s\S]*?)<\/pre>/);
assert.ok(m && m[1], '瀏覽器未產出結果（可能卡死）');
const r = JSON.parse(m[1].replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&'));

assert.strictEqual(r.exception, undefined, '執行中拋出例外：' + r.exception);
assert.deepStrictEqual(r.issues, [], 'Alpine／主控台出現警告或錯誤：\n' + (r.issues || []).join('\n'));
assert.strictEqual(r.open.open, true, '點擊後展開');
assert.strictEqual(r.shown, true, '面板實際顯示');
assert.strictEqual(r.open.after.scrollTop, r.open.before.scrollTop, '展開不得捲動彈窗內容區（財產資訊不被擠出）');
assert.strictEqual(r.open.after.scrollHeight, r.open.before.scrollHeight, '展開不得撐高彈窗內容區（不產生多餘捲軸）');
assert.strictEqual(r.open.after.infoVisible, true, '展開後財產資訊仍可見');
assert.strictEqual(r.open.panelVisible, true, '面板未被外框 overflow 裁切且位於最上層');
assert.strictEqual(r.open.inViewport, true, '面板完整位於視窗內');
assert.ok(r.open.belowButton >= 0 && r.open.belowButton <= 8, '面板緊貼按鈕下方（實際間距 ' + r.open.belowButton + 'px）');
assert.strictEqual(r.open.focused, true, '展開後游標自動落在搜尋框');
assert.ok(r.up.aboveButton >= 0 && r.up.aboveButton <= 8, '長清單向上展開並貼齊按鈕上緣（實際間距 ' + r.up.aboveButton + 'px）');
assert.strictEqual(r.up.inViewport, true, '向上展開的面板不超出視窗上緣');
assert.strictEqual(r.up.scrollHeight, r.open.before.scrollHeight, '向上展開也不撐高彈窗內容區');
assert.strictEqual(r.filteredLabels.join('|'), '陳大華', '搜尋即時篩選');
assert.strictEqual(r.pick.value, 'chen@x.com', '點選寫入元件值');
assert.strictEqual(r.pick.outer, 'chen@x.com', '點選同步外部 x-model');
assert.strictEqual(r.pick.label, '陳大華', '按鈕顯示選中名稱');
assert.strictEqual(r.pick.open, false, '點選後收起');
assert.strictEqual(r.cancelWorks, true, '點選後彈窗其他按鈕仍可操作');
console.log('✅ searchSelect 瀏覽器回歸測試：20 項通過');
