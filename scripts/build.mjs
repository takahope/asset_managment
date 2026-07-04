// 前端建置(Alpine 版):Tailwind 靜態掃描 → 預編譯 CSS。
// 邏輯層(Alpine)零編譯,本檔僅在「首次用到新 utility class」時需要執行。
// 用法:npm run build:css(等同 npm run build)
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const mode = process.argv[2] || 'all';

// 防止內嵌內容提前終結外層 <style> 標籤
const escapeStyle = (css) => css.replace(/<\/style/gi, '<\\/style');

function write(name, content) {
  writeFileSync(resolve(ROOT, name), content);
  console.log(`✓ ${name} (${(content.length / 1024).toFixed(0)} KB)`);
}

// ---------- css:Tailwind 靜態掃描 → 預編譯 CSS ----------
function buildCss() {
  mkdirSync(resolve(ROOT, 'dist'), { recursive: true });
  const tw = resolve(ROOT, 'node_modules/.bin/tailwindcss');

  // 主頁面(掃描 userstate.html 舊頁 + Alpine 新頁與 partial + include 局部檔)
  execFileSync(tw, ['-c', 'tailwind.config.js', '-i', 'src/tailwind.css', '-o', 'dist/tailwind.css', '--minify'], { cwd: ROOT, stdio: 'inherit' });
  const mainCss = readFileSync(resolve(ROOT, 'dist/tailwind.css'), 'utf8');
  write('css_tailwind.html', `<style>\n/* Tailwind 預編譯產物(npm run build:css),勿手改 */\n${escapeStyle(mainCss)}\n</style>\n`);

  // 操作手冊 iframe(srcdoc 無法用 include,直接把 CSS 寫進標記區)
  // 標記尚未加入(Phase 6 遷移操作手冊時處理)則跳過,不視為錯誤。
  const manualPath = resolve(ROOT, 'operation_manual_srcdoc.html');
  const manualHtml = readFileSync(manualPath, 'utf8');
  const START = '<!-- TW_CSS_START(npm run build:css 產生,勿手改) -->';
  const END = '<!-- TW_CSS_END -->';
  const pattern = new RegExp(`${START.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\\s\\S]*?${END.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`);
  if (!pattern.test(manualHtml) || !existsSync(resolve(ROOT, 'tailwind.manual.config.js'))) {
    console.log('- operation_manual_srcdoc.html 無 TW_CSS 標記或缺 manual config,跳過(Phase 6 處理)');
    return;
  }
  // 掃描前先剝除已嵌入的 CSS,避免掃描器把 CSS 文字誤認為 class(確保重複建置冪等)
  writeFileSync(resolve(ROOT, 'dist/operation_manual_scan.html'), manualHtml.replace(pattern, `${START}\n${END}`));
  execFileSync(tw, ['-c', 'tailwind.manual.config.js', '-i', 'src/tailwind.css', '-o', 'dist/tailwind.manual.css', '--minify'], { cwd: ROOT, stdio: 'inherit' });
  const manualCss = readFileSync(resolve(ROOT, 'dist/tailwind.manual.css'), 'utf8');
  const block = `${START}\n<style>\n${escapeStyle(manualCss)}\n</style>\n${END}`;
  writeFileSync(manualPath, manualHtml.replace(pattern, block));
  console.log(`✓ operation_manual_srcdoc.html(內嵌 tailwind ${(manualCss.length / 1024).toFixed(0)} KB)`);
}

if (mode === 'css' || mode === 'all') buildCss();
