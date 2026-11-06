// 「報廢中資訊」彈窗取消報廢申請：瀏覽器回歸測試（2026-11-06）
// 以無頭 Chrome + 真實 Alpine 3.15.12 執行。頁面由 repo 實際程式碼組成：
// alpine_views.html 的狀態詳情彈窗 markup / statusDetailModal 元件 / 具名 CSS、
// alpine_store.html 的 addProcessingAsset 等 store 成員、css_tailwind.html；後端 google.script.run 以 stub 取代。
// 執行：node scripts/test_cancel_scrap_detail_browser.mjs（無 google-chrome 或無法下載 Alpine 時略過）
import assert from 'node:assert';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const WORK = path.join(os.tmpdir(), 'cancel-scrap-detail-browser-test');
fs.mkdirSync(WORK, { recursive: true });

function which(cmd) {
  try { return execFileSync('which', [cmd], { encoding: 'utf8' }).trim(); } catch (e) { return ''; }
}
const chrome = which('google-chrome') || which('chromium') || which('chromium-browser');
if (!chrome) { console.log('⏭️  略過：找不到 google-chrome / chromium'); process.exit(0); }
const alpinePath = path.join(WORK, 'alpine-3.15.12.js');
const sharedAlpine = path.join(os.tmpdir(), 'search-select-browser-test', 'alpine-3.15.12.js');
if (!fs.existsSync(alpinePath) && fs.existsSync(sharedAlpine)) fs.copyFileSync(sharedAlpine, alpinePath);
if (!fs.existsSync(alpinePath)) {
  try {
    execFileSync('curl', ['-sS', '-m', '30', '-o', alpinePath, 'https://cdn.jsdelivr.net/npm/alpinejs@3.15.12/dist/cdn.min.js']);
  } catch (e) { console.log('⏭️  略過：無法下載 Alpine 3.15.12'); process.exit(0); }
}

const storeHtml = fs.readFileSync(path.join(ROOT, 'alpine_store.html'), 'utf8');
const viewsHtml = fs.readFileSync(path.join(ROOT, 'alpine_views.html'), 'utf8');
const css = fs.readFileSync(path.join(ROOT, 'css_tailwind.html'), 'utf8');

function extractMember(src, head) {
  const start = src.indexOf(head);
  assert.ok(start !== -1, '找不到 ' + head);
  const end = src.indexOf('\n            },', start);
  return src.slice(start, end + '\n            },'.length);
}
const storeMembers = ['isAssetProcessing: function', 'addProcessingAsset: function', 'removeProcessingAsset: function', 'handleCloseStatusDetail: function']
  .map(h => extractMember(storeHtml, h)).join('\n');

const comp = viewsHtml.match(/    Alpine\.data\('statusDetailModal'[\s\S]*?\n    \}\);\n/);
assert.ok(comp, '找不到 statusDetailModal 元件');
const tplStart = viewsHtml.indexOf('<template x-if="$store.app.statusDetailState">');
assert.ok(tplStart !== -1, '找不到狀態詳情彈窗 markup');
const tplEnd = viewsHtml.indexOf('\n        </template>\n', tplStart);
const modalMarkup = viewsHtml.slice(tplStart, tplEnd + '\n        </template>'.length);
const styleBlock = viewsHtml.match(/<style>[\s\S]*?<\/style>/)[0];

const page = `<!doctype html><html><head><meta charset="utf-8">${css}${styleBlock}
<script>
window.__issues = [];
window.addEventListener('error', e => window.__issues.push('ERROR: ' + e.message));
console.error = function () { window.__issues.push('console.error: ' + Array.from(arguments).map(String).join(' ')); };
console.warn = function () { window.__issues.push('console.warn: ' + Array.from(arguments).map(String).join(' ')); };
window.requestAnimationFrame = function (cb) { return setTimeout(function () { cb(performance.now()); }, 16); };
window.__pending = null; window.__local = null; window.__toast = null;
window.google = { script: { run: (function () {
  var r = { _s: null, _f: null };
  r.withSuccessHandler = function (f) { r._s = f; return r; };
  r.withFailureHandler = function (f) { r._f = f; return r; };
  r.cancelTransferOrScrap = function (id) { window.__pending = { id: id, s: r._s, f: r._f }; r._s = r._f = null; return r; };
  return r;
})() } };
var S = { STATUS_COLORS: { '報廢中': 'bg-red-50 text-red-700 border-red-200' },
  STATUS_DETAIL_THEMES: { scrap: { title: '報廢中資訊', icon: 'fa-trash-can', headerClass: 'bg-red-50', textClass: 'text-red-700' },
    transfer: { title: '轉移中資訊', icon: 'fa-right-left', headerClass: 'bg-cyan-50', textClass: 'text-cyan-800' } },
  getAssetAliasLabel: function () { return '別名'; }, getAssetAliasDisplay: function () { return '-'; } };
document.addEventListener('alpine:init', function () {
  Alpine.store('app', {
    statusDetailState: null, processingAssetIds: [],
${storeMembers}
    updateAssetLocalStatus: function (id, st) { window.__local = { id: id, st: st }; },
    toastOrAlert: function (m, l) { window.__toast = { m: m, l: l }; }
  });
${comp[0]}
});
</script>
<script defer src="${alpinePath}"></script>
</head><body>
<div x-data>
${modalMarkup}
</div>
<pre id="out"></pre>
<script>
document.addEventListener('alpine:initialized', () => setTimeout(run, 50));
const $ = s => document.querySelector(s);
const wait = ms => new Promise(r => setTimeout(r, ms));
async function waitFor(cond, ms) { for (let t = 0; t < ms; t += 10) { if (cond()) return true; await wait(10); } return cond(); }
const visible = el => !!el && getComputedStyle(el).display !== 'none' && el.getBoundingClientRect().width > 0;
const byText = (sel, txt) => Array.from(document.querySelectorAll(sel)).find(e => e.textContent.trim().includes(txt));
const S0 = () => Alpine.store('app');
function open(over) {
  S0().statusDetailState = Object.assign({
    asset: { assetId: 'A1', assetName: '筆記型電腦', status: '報廢中' }, type: 'scrap',
    detail: { scrapDate: '2026-11-06', scrapReason: 'A', originalKeeper: '王小明', originalUser: '', location: 'R1' },
    isLoading: false, error: '', canCancel: true }, over || {});
}
async function run() {
  const r = {};
  try {
    // 有權限的報廢中彈窗
    open(); await waitFor(() => !!$('.status-detail-footer'), 1000); await wait(30);
    const cancelBtn = () => byText('.status-detail-footer button', '取消報廢申請');
    const closeBtn = () => byText('.status-detail-footer button', '關閉');
    r.initial = { cancelVisible: visible(cancelBtn()), footerVisible: visible($('.status-detail-footer')), confirmVisible: visible($('.status-detail-cancel-confirm')) };
    const cr = cancelBtn().getBoundingClientRect(), xr = closeBtn().getBoundingClientRect(), fr = $('.status-detail-footer').getBoundingClientRect();
    r.layout = { cancelLeft: cr.left - fr.left < 40, closeRight: fr.right - xr.right < 40, sameRow: Math.abs(cr.top - xr.top) < 20 };
    r.cancelStyle = { bg: getComputedStyle(cancelBtn()).backgroundColor, color: getComputedStyle(cancelBtn()).color };

    // 進入確認列
    cancelBtn().click(); await waitFor(() => visible($('.status-detail-cancel-confirm')), 1000); await wait(30);
    r.confirm = { footerHidden: !visible($('.status-detail-footer')), confirmVisible: visible($('.status-detail-cancel-confirm')),
      prompt: $('.status-detail-cancel-text').textContent, errorHidden: !visible($('.status-detail-cancel-error')),
      focusOnBack: document.activeElement === $('.status-detail-cancel-back') };
    r.submitStyle = { bg: getComputedStyle($('.status-detail-cancel-submit')).backgroundColor };

    // 返回
    $('.status-detail-cancel-back').click(); await waitFor(() => visible($('.status-detail-footer')), 1000); await wait(30);
    r.back = { footerVisible: visible($('.status-detail-footer')), confirmHidden: !visible($('.status-detail-cancel-confirm')) };

    // 送出 → 失敗（後端拒絕）
    cancelBtn().click(); await waitFor(() => visible($('.status-detail-cancel-confirm')), 1000); await wait(30);
    $('.status-detail-cancel-submit').click(); await wait(50);
    r.busy = { disabled: $('.status-detail-cancel-submit').disabled, backDisabled: $('.status-detail-cancel-back').disabled,
      label: $('.status-detail-cancel-submit').textContent.trim(), pendingId: window.__pending && window.__pending.id,
      processing: S0().isAssetProcessing('A1') };
    window.__pending.s({ success: false, error: '此財產的狀態 (已報廢) 無法被取消。' }); await wait(50);
    r.failed = { errorVisible: visible($('.status-detail-cancel-error')), errorText: $('.status-detail-cancel-error').textContent.trim(),
      modalOpen: !!S0().statusDetailState, submitEnabled: !$('.status-detail-cancel-submit').disabled,
      label: $('.status-detail-cancel-submit').textContent.trim(), processing: S0().isAssetProcessing('A1') };

    // 重試 → 成功
    $('.status-detail-cancel-submit').click(); await wait(50);
    r.retryClearsError = !visible($('.status-detail-cancel-error'));
    window.__pending.s({ success: true }); await waitFor(() => !S0().statusDetailState, 1000); await wait(50);
    r.success = { modalClosed: S0().statusDetailState === null, domGone: !$('.status-detail-footer'), local: window.__local,
      toastLevel: window.__toast && window.__toast.l, processing: S0().isAssetProcessing('A1') };

    // 無權限：不顯示取消鈕，但仍有關閉
    open({ canCancel: false }); await waitFor(() => !!$('.status-detail-footer'), 1000); await wait(30);
    r.noPerm = { cancelVisible: visible(cancelBtn()), closeVisible: visible(closeBtn()),
      closeRight: $('.status-detail-footer').getBoundingClientRect().right - closeBtn().getBoundingClientRect().right < 40 };
    S0().statusDetailState = null; await wait(50);

    // 轉移中彈窗：不顯示（本次範圍外）
    open({ type: 'transfer', asset: { assetId: 'T1', assetName: 'PC', status: '轉移中' }, detail: { workflowStatus: '轉移中' } });
    await waitFor(() => !!$('.status-detail-footer'), 1000); await wait(30);
    r.transfer = { cancelVisible: visible(cancelBtn()) };
  } catch (e) { r.exception = e.message + ' @ ' + (e.stack || '').split('\\n')[1]; }
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
    '--window-size=1200,900', '--virtual-time-budget=12000', '--dump-dom', 'file://' + pagePath],
    { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 64 * 1024 * 1024 });
} catch (e) { dom = e.stdout || ''; }
const m = dom.match(/<pre id="out">([\s\S]*?)<\/pre>/);
assert.ok(m && m[1], '瀏覽器未產出結果（可能卡死）');
const r = JSON.parse(m[1].replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&'));

let n = 0;
const ok = (cond, msg) => { assert.ok(cond, msg + '\n' + JSON.stringify(r, null, 1)); n++; };
assert.strictEqual(r.exception, undefined, '執行中拋出例外：' + r.exception);
assert.deepStrictEqual(r.issues, [], 'Alpine／主控台出現警告或錯誤：\n' + (r.issues || []).join('\n'));
ok(r.initial.cancelVisible && r.initial.footerVisible && !r.initial.confirmVisible, '初始：顯示「取消報廢申請」，確認列收起');
ok(r.layout.cancelLeft && r.layout.closeRight && r.layout.sameRow, '取消鈕在左、關閉在右、同一列');
ok(r.cancelStyle.bg === 'rgb(255, 241, 242)' && r.cancelStyle.color === 'rgb(190, 18, 60)', '取消鈕套用具名 CSS（玫瑰紅淡底）');
ok(r.confirm.footerHidden && r.confirm.confirmVisible, '按下後頁尾換成確認列');
ok(r.confirm.prompt.includes('A1') && r.confirm.prompt.includes('筆記型電腦') && r.confirm.prompt.includes('在庫'), '確認列顯示財產編號、名稱與「在庫」說明');
ok(r.confirm.errorHidden, '確認列初始不顯示錯誤');
ok(r.confirm.focusOnBack, '游標預設落在較安全的「返回」');
ok(r.submitStyle.bg === 'rgb(225, 29, 72)', '確認鈕套用具名 CSS（實心玫瑰紅）');
ok(r.back.footerVisible && r.back.confirmHidden, '返回後回到原頁尾');
ok(r.busy.pendingId === 'A1' && r.busy.disabled && r.busy.backDisabled && r.busy.label === '取消中...' && r.busy.processing, '送出後：以財產編號呼叫後端、按鈕禁用並顯示「取消中...」、列表該列鎖定');
ok(r.failed.errorVisible && r.failed.errorText.includes('已報廢') && r.failed.modalOpen && r.failed.submitEnabled && r.failed.label === '確定取消報廢申請' && !r.failed.processing, '後端拒絕：錯誤顯示在確認列、彈窗不關、可重試、解除鎖定');
ok(r.retryClearsError, '重試時清除舊錯誤');
ok(r.success.modalClosed && r.success.domGone && r.success.local && r.success.local.id === 'A1' && r.success.local.st === '在庫' && r.success.toastLevel === 'success' && !r.success.processing, '成功：彈窗關閉、列表該筆變回在庫、顯示成功提示、解除鎖定');
ok(!r.noPerm.cancelVisible && r.noPerm.closeVisible && r.noPerm.closeRight, '無權限：不顯示取消鈕，「關閉」仍靠右');
ok(!r.transfer.cancelVisible, '轉移中彈窗不顯示取消鈕（本次範圍外）');
console.log('✅ 取消報廢申請彈窗瀏覽器回歸測試：' + n + ' 項通過');
