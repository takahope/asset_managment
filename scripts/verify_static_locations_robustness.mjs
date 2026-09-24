// scripts/verify_static_locations_robustness.mjs
// 本地測試 STATIC_LOCATIONS 解析與儲存強健性

import assert from 'node:assert';
import fs from 'node:fs';

// 讀取 hr_directory.js 驗證語法
const hrDirectoryContent = fs.readFileSync('hr_directory.js', 'utf8');
const codeContent = fs.readFileSync('code.js', 'utf8');

// 提取 parseStaticLocations_ 函式進行測試
const parseStaticLocationsMatch = hrDirectoryContent.match(/function parseStaticLocations_\([\s\S]*?\n\}/);
if (!parseStaticLocationsMatch) {
  throw new Error('找不到 parseStaticLocations_ 函式');
}

const parseStaticLocations = new Function('raw', `
  ${parseStaticLocationsMatch[0]}
  return parseStaticLocations_(raw);
`);

console.log('🧪 開始驗證 parseStaticLocations_ 強健性...');

// 測試案例 1: 傳統換行格式
{
  const input = "中心八樓\n中心九樓\n\n行政辦公室\n";
  const result = parseStaticLocations(input);
  assert.deepStrictEqual(result, ['中心八樓', '中心九樓', '行政辦公室'], '案例 1 失敗: 傳統換行格式解析不符');
  console.log('✅ 案例 1 通過: 傳統換行格式正確解析並過濾空行');
}

// 測試案例 2: JSON 陣列字串 (新標準格式)
{
  const input = '["中心八樓", "中心九樓", "行政辦公室"]';
  const result = parseStaticLocations(input);
  assert.deepStrictEqual(result, ['中心八樓', '中心九樓', '行政辦公室'], '案例 2 失敗: JSON 陣列格式解析不符');
  console.log('✅ 案例 2 通過: JSON 陣列格式正確解析');
}

// 測試案例 3: 逗號與中文逗號混合 (GAS 原生介面手動輸入容錯)
{
  const input = "中心八樓,中心九樓，行政辦公室;地下庫房";
  const result = parseStaticLocations(input);
  assert.deepStrictEqual(result, ['中心八樓', '中心九樓', '行政辦公室', '地下庫房'], '案例 3 失敗: 逗號分號分隔不符');
  console.log('✅ 案例 3 通過: 逗號、中文逗號、分號混合正確解析');
}

// 測試案例 4: 去除重複與頭尾空白
{
  const input = '[" 中心八樓 ", "中心九樓", "中心八樓"]';
  const result = parseStaticLocations(input);
  assert.deepStrictEqual(result, ['中心八樓', '中心九樓'], '案例 4 失敗: JSON 陣列去重或去空白不符');
  console.log('✅ 案例 4 通過: JSON 陣列去重與 trim 正確生效');
}

// 測試案例 5: 空值或無效值防呆
{
  assert.deepStrictEqual(parseStaticLocations(''), []);
  assert.deepStrictEqual(parseStaticLocations(null), []);
  assert.deepStrictEqual(parseStaticLocations(undefined), []);
  assert.deepStrictEqual(parseStaticLocations('   '), []);
  assert.deepStrictEqual(parseStaticLocations('[]'), []);
  console.log('✅ 案例 5 通過: 空值與空白防呆正確回傳空陣列');
}

// 測試案例 6: 往返序列化測試 (Round-trip: array -> JSON.stringify -> parse -> join('\n') -> textarea)
{
  const original = ['中心八樓', '中心九樓', '行政辦公室'];
  const serialized = JSON.stringify(original);
  // 模擬 GAS Script Property 儲存 JSON
  const parsed = parseStaticLocations(serialized);
  const forTextarea = parsed.join('\n');
  assert.strictEqual(forTextarea, '中心八樓\n中心九樓\n行政辦公室');
  console.log('✅ 案例 6 通過: 往返序列化與前端 textarea 格式相容無損');
}

console.log('\n🎉 所有本地單元測試全數通過！');
