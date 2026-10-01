// 驗證「組別窗口通知」卡片只使用凍結 css_tailwind.html 已收錄的 utility（參 2026-07-22 事件）
// 執行：node scripts/verify_group_notify_ui_classes.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const html = fs.readFileSync(path.join(ROOT, 'alpine_model_setting.html'), 'utf8');
const css = fs.readFileSync(path.join(ROOT, 'css_tailwind.html'), 'utf8');

const START = '<!-- 組別窗口通知（spec 2026-10-01） -->';
const END = '<!-- /組別窗口通知 -->';
const start = html.indexOf(START);
const end = html.indexOf(END);
if (start === -1 || end === -1 || end < start) {
  console.error('❌ 找不到組別窗口通知卡片的起訖註解');
  process.exit(1);
}
const block = html.slice(start, end);

const classes = new Set();
for (const m of block.matchAll(/\sclass="([^"]+)"/g)) {
  m[1].split(/\s+/).filter(Boolean).forEach(c => classes.add(c));
}
for (const m of block.matchAll(/:class="([^"]+)"/g)) {
  for (const q of m[1].matchAll(/'([^']+)'/g)) q[1].split(/\s+/).filter(Boolean).forEach(c => classes.add(c));
}

const reEscape = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const selectorOf = c => '.' + c.replace(/[:/[\].%]/g, ch => '\\' + ch);
const isPresent = c => new RegExp(reEscape(selectorOf(c)) + '(?=[\\s{,:>.\\[])').test(css);
const isExempt = c => c.startsWith('fa-') || c.startsWith('group-notify-');

const missing = [...classes].filter(c => !isExempt(c) && !isPresent(c));
if (missing.length > 0) {
  console.error('❌ 凍結 Tailwind 未收錄：' + missing.join(' '));
  process.exit(1);
}
console.log(`✅ 組別窗口通知卡片 ${classes.size} 個 class 皆可用（凍結 utility 或具名 scoped class）`);
