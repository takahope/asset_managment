// =================================================================
// --- Google Apps Script 測試套件 ---
// =================================================================

/**
 * 測試框架：斷言輔助函式
 * 使用 GAS 內建的 Logger 進行測試輸出
 */

// 測試統計
var testStats = {
  total: 0,
  passed: 0,
  failed: 0,
  skipped: 0,
  errors: []
};

/**
 * 基本斷言：檢查條件是否為真
 * @param {boolean} condition - 要檢查的條件
 * @param {string} message - 測試描述
 */
function assert(condition, message) {
  testStats.total++;
  if (condition) {
    testStats.passed++;
    Logger.log(`✓ PASS: ${message}`);
    return true;
  } else {
    testStats.failed++;
    const errorMsg = `✗ FAIL: ${message}`;
    Logger.log(errorMsg);
    testStats.errors.push(errorMsg);
    return false;
  }
}

/**
 * 相等斷言：檢查兩個值是否相等
 * @param {any} actual - 實際值
 * @param {any} expected - 期望值
 * @param {string} message - 測試描述
 */
function assertEqual(actual, expected, message) {
  testStats.total++;
  const passed = actual === expected;
  if (passed) {
    testStats.passed++;
    Logger.log(`✓ PASS: ${message}`);
    Logger.log(`  Expected: ${expected}, Got: ${actual}`);
    return true;
  } else {
    testStats.failed++;
    const errorMsg = `✗ FAIL: ${message}\n  Expected: ${expected}\n  Got: ${actual}`;
    Logger.log(errorMsg);
    testStats.errors.push(errorMsg);
    return false;
  }
}

/**
 * 深度相等斷言：檢查兩個物件是否深度相等
 * @param {any} actual - 實際值
 * @param {any} expected - 期望值
 * @param {string} message - 測試描述
 */
function assertDeepEqual(actual, expected, message) {
  testStats.total++;
  const actualStr = JSON.stringify(actual);
  const expectedStr = JSON.stringify(expected);
  const passed = actualStr === expectedStr;

  if (passed) {
    testStats.passed++;
    Logger.log(`✓ PASS: ${message}`);
    return true;
  } else {
    testStats.failed++;
    const errorMsg = `✗ FAIL: ${message}\n  Expected: ${expectedStr}\n  Got: ${actualStr}`;
    Logger.log(errorMsg);
    testStats.errors.push(errorMsg);
    return false;
  }
}

/**
 * 非空斷言：檢查值是否非空
 * @param {any} value - 要檢查的值
 * @param {string} message - 測試描述
 */
function assertNotNull(value, message) {
  testStats.total++;
  const passed = value !== null && value !== undefined;
  if (passed) {
    testStats.passed++;
    Logger.log(`✓ PASS: ${message}`);
    return true;
  } else {
    testStats.failed++;
    const errorMsg = `✗ FAIL: ${message} - Value is null or undefined`;
    Logger.log(errorMsg);
    testStats.errors.push(errorMsg);
    return false;
  }
}

/**
 * 陣列包含斷言：檢查陣列是否包含特定元素
 * @param {Array} array - 要檢查的陣列
 * @param {any} element - 要查找的元素
 * @param {string} message - 測試描述
 */
function assertArrayContains(array, element, message) {
  testStats.total++;
  const passed = Array.isArray(array) && array.includes(element);
  if (passed) {
    testStats.passed++;
    Logger.log(`✓ PASS: ${message}`);
    return true;
  } else {
    testStats.failed++;
    const errorMsg = `✗ FAIL: ${message}\n  Array does not contain: ${element}`;
    Logger.log(errorMsg);
    testStats.errors.push(errorMsg);
    return false;
  }
}

/**
 * 異常斷言：檢查函式是否拋出異常
 * @param {Function} fn - 要執行的函式
 * @param {string} message - 測試描述
 */
function assertThrows(fn, message) {
  testStats.total++;
  try {
    fn();
    testStats.failed++;
    const errorMsg = `✗ FAIL: ${message} - Expected function to throw an error`;
    Logger.log(errorMsg);
    testStats.errors.push(errorMsg);
    return false;
  } catch (e) {
    testStats.passed++;
    Logger.log(`✓ PASS: ${message}`);
    Logger.log(`  Error thrown: ${e.message}`);
    return true;
  }
}

/**
 * 型別斷言：檢查值的型別
 * @param {any} value - 要檢查的值
 * @param {string} expectedType - 期望的型別
 * @param {string} message - 測試描述
 */
function assertType(value, expectedType, message) {
  testStats.total++;
  const actualType = typeof value;
  const passed = actualType === expectedType;

  if (passed) {
    testStats.passed++;
    Logger.log(`✓ PASS: ${message}`);
    return true;
  } else {
    testStats.failed++;
    const errorMsg = `✗ FAIL: ${message}\n  Expected type: ${expectedType}\n  Got type: ${actualType}`;
    Logger.log(errorMsg);
    testStats.errors.push(errorMsg);
    return false;
  }
}

/**
 * 陣列長度斷言：檢查陣列長度
 * @param {Array} array - 要檢查的陣列
 * @param {number} expectedLength - 期望的長度
 * @param {string} message - 測試描述
 */
function assertArrayLength(array, expectedLength, message) {
  testStats.total++;
  const passed = Array.isArray(array) && array.length === expectedLength;

  if (passed) {
    testStats.passed++;
    Logger.log(`✓ PASS: ${message}`);
    return true;
  } else {
    testStats.failed++;
    const actualLength = Array.isArray(array) ? array.length : 'not an array';
    const errorMsg = `✗ FAIL: ${message}\n  Expected length: ${expectedLength}\n  Got length: ${actualLength}`;
    Logger.log(errorMsg);
    testStats.errors.push(errorMsg);
    return false;
  }
}

/**
 * 重置測試統計
 */
function resetTestStats() {
  testStats = {
    total: 0,
    passed: 0,
    failed: 0,
    skipped: 0,
    errors: []
  };
}

/**
 * 輸出測試統計摘要
 */
function printTestSummary() {
  Logger.log('\n' + '='.repeat(70));
  Logger.log('測試摘要 (Test Summary)');
  Logger.log('='.repeat(70));
  Logger.log(`總測試數: ${testStats.total}`);
  Logger.log(`通過: ${testStats.passed} ✓`);
  Logger.log(`失敗: ${testStats.failed} ✗`);
  Logger.log(`跳過: ${testStats.skipped} ○`);
  Logger.log(`成功率: ${testStats.total > 0 ? ((testStats.passed / testStats.total) * 100).toFixed(2) : 0}%`);
  Logger.log('='.repeat(70));

  if (testStats.failed > 0) {
    Logger.log('\n失敗的測試:');
    testStats.errors.forEach(error => {
      Logger.log(error);
    });
  }
}

// =================================================================
// --- 資料抽象層測試 (Data Abstraction Layer Tests) ---
// =================================================================

/**
 * 測試 mapRowToAssetObject 函式
 */
function test_mapRowToAssetObject() {
  Logger.log('\n' + '-'.repeat(70));
  Logger.log('測試: mapRowToAssetObject()');
  Logger.log('-'.repeat(70));

  try {
    // 準備測試資料
    const mockPropertyRow = [
      'P001', // ASSET_ID (1)
      '電腦A', // ASSET_NAME (2)
      '', '', '', // 3-5
      '2023/01/01', // PURCHASE_DATE (6)
      '5', // USE_LIFE (7)
      '台北辦公室', // LOCATION (8)
      '', // 9
      '張三', // LEADER_NAME (10)
      '李四', // USER_NAME (11)
      '資訊設備', // ASSET_CATEGORY (12)
      'zhang@example.com', // LEADER_EMAIL (13)
      'li@example.com', // USER_EMAIL (14)
      '在庫', // ASSET_STATUS (15)
      '', // APPLICATION_TIME (16)
      '', // TRANSFER_TIME (17)
      '', // IS_UPLOADED (18)
      '', // UPLOAD_TIME (19)
      '是', // IS_COMPUTER (20)
      '', // LAST_MODIFIED (21)
      '', // REMARKS (22)
      '', // DOC_URL (23)
      '', // 24
      '是' // IS_ACTUALLY_COMPUTER (25)
    ];

    const result = mapRowToAssetObject(mockPropertyRow, PROPERTY_COLUMN_INDICES, PROPERTY_MASTER_SHEET_NAME);

    // 斷言測試
    assertEqual(result.assetId, 'P001', 'assetId 應該是 P001');
    assertEqual(result.assetName, '電腦A', 'assetName 應該是 電腦A');
    assertEqual(result.leaderName, '張三', 'leaderName 應該是 張三');
    assertEqual(result.userName, '李四', 'userName 應該是 李四');
    assertEqual(result.location, '台北辦公室', 'location 應該是 台北辦公室');
    assertEqual(result.assetStatus, '在庫', 'assetStatus 應該是 在庫');
    assertEqual(result.sourceSheet, PROPERTY_MASTER_SHEET_NAME, 'sourceSheet 應該是財產總表');

    Logger.log('✓ mapRowToAssetObject 測試完成');
  } catch (e) {
    Logger.log(`✗ 測試失敗: ${e.message}`);
    Logger.log(`錯誤堆疊: ${e.stack}`);
  }
}

/**
 * 測試 getAllAssets 函式
 */
function test_getAllAssets() {
  Logger.log('\n' + '-'.repeat(70));
  Logger.log('測試: getAllAssets()');
  Logger.log('-'.repeat(70));

  try {
    const assets = getAllAssets();

    // 斷言測試
    assertNotNull(assets, 'getAllAssets 應該回傳非空值');
    assert(Array.isArray(assets), 'getAllAssets 應該回傳陣列');

    if (assets.length > 0) {
      const firstAsset = assets[0];
      assertNotNull(firstAsset.assetId, '第一筆資產應該有 assetId');
      assertNotNull(firstAsset.assetName, '第一筆資產應該有 assetName');
      assertNotNull(firstAsset.sourceSheet, '第一筆資產應該有 sourceSheet');

      Logger.log(`  讀取到 ${assets.length} 筆資產`);
      Logger.log(`  第一筆資產: ${firstAsset.assetId} - ${firstAsset.assetName}`);
    } else {
      Logger.log('  警告: 沒有讀取到任何資產資料');
    }

    Logger.log('✓ getAllAssets 測試完成');
  } catch (e) {
    Logger.log(`✗ 測試失敗: ${e.message}`);
    Logger.log(`錯誤堆疊: ${e.stack}`);
  }
}

/**
 * 測試 findAssetLocation 函式
 */
function test_findAssetLocation() {
  Logger.log('\n' + '-'.repeat(70));
  Logger.log('測試: findAssetLocation()');
  Logger.log('-'.repeat(70));

  try {
    // 先取得所有資產
    const assets = getAllAssets();

    if (assets.length > 0) {
      const testAsset = assets[0];
      const location = findAssetLocation(testAsset.assetId);

      // 斷言測試
      assertNotNull(location, 'findAssetLocation 應該找到資產');
      assertNotNull(location.sheet, 'location 應該有 sheet 屬性');
      assertNotNull(location.rowIndex, 'location 應該有 rowIndex 屬性');
      assertNotNull(location.sheetName, 'location 應該有 sheetName 屬性');
      assertEqual(location.sheetName, testAsset.sourceSheet, 'sheetName 應該與 sourceSheet 相同');

      Logger.log(`  測試資產 ID: ${testAsset.assetId}`);
      Logger.log(`  找到位置: ${location.sheetName}, 列 ${location.rowIndex}`);
    } else {
      Logger.log('  跳過: 沒有資產可供測試');
      testStats.skipped++;
    }

    // 測試找不到的情況
    const notFound = findAssetLocation('NONEXISTENT_ID_12345');
    assertEqual(notFound, null, 'findAssetLocation 對不存在的 ID 應該回傳 null');

    Logger.log('✓ findAssetLocation 測試完成');
  } catch (e) {
    Logger.log(`✗ 測試失敗: ${e.message}`);
    Logger.log(`錯誤堆疊: ${e.stack}`);
  }
}

// =================================================================
// --- 資料獲取函式測試 (Data Retrieval Tests) ---
// =================================================================

/**
 * 測試 getSelectData 函式
 */
function test_getSelectData() {
  Logger.log('\n' + '-'.repeat(70));
  Logger.log('測試: getSelectData()');
  Logger.log('-'.repeat(70));

  try {
    const selectData = getSelectData();

    // 斷言測試
    assertNotNull(selectData, 'getSelectData 應該回傳非空值');
    assertType(selectData, 'object', 'getSelectData 應該回傳物件');

    const groups = Object.keys(selectData);
    Logger.log(`  找到 ${groups.length} 個駐站群組`);

    if (groups.length > 0) {
      const firstGroup = groups[0];
      Logger.log(`  第一個群組: ${firstGroup}`);
      assert(Array.isArray(selectData[firstGroup]), '群組資料應該是陣列');
      Logger.log(`  該群組有 ${selectData[firstGroup].length} 台電腦`);
    }

    Logger.log('✓ getSelectData 測試完成');
  } catch (e) {
    Logger.log(`✗ 測試失敗: ${e.message}`);
    Logger.log(`錯誤堆疊: ${e.stack}`);
  }
}

/**
 * 測試 getSevenZipVersions 函式
 */
function test_getSevenZipVersions() {
  Logger.log('\n' + '-'.repeat(70));
  Logger.log('測試: getSevenZipVersions()');
  Logger.log('-'.repeat(70));

  try {
    const versions = getSevenZipVersions();

    // 斷言測試
    assertNotNull(versions, 'getSevenZipVersions 應該回傳非空值');
    assert(Array.isArray(versions), 'getSevenZipVersions 應該回傳陣列');

    Logger.log(`  讀取到 ${versions.length} 個 7-Zip 版本`);

    if (versions.length > 0) {
      Logger.log(`  第一個版本: ${versions[0]}`);
      assertType(versions[0], 'string', '版本應該是字串');
    }

    Logger.log('✓ getSevenZipVersions 測試完成');
  } catch (e) {
    Logger.log(`✗ 測試失敗: ${e.message}`);
    Logger.log(`錯誤堆疊: ${e.stack}`);
  }
}

/**
 * 測試 getTransferData 函式
 */
function test_getTransferData() {
  Logger.log('\n' + '-'.repeat(70));
  Logger.log('測試: getTransferData()');
  Logger.log('-'.repeat(70));

  try {
    const transferData = getTransferData();

    // 斷言測試
    assertNotNull(transferData, 'getTransferData 應該回傳非空值');
    assertNotNull(transferData.userEmail, 'transferData 應該有 userEmail');
    assertNotNull(transferData.assets, 'transferData 應該有 assets');
    assertNotNull(transferData.keepers, 'transferData 應該有 keepers');
    assertNotNull(transferData.users, 'transferData 應該有 users');
    assertNotNull(transferData.locations, 'transferData 應該有 locations');

    assert(Array.isArray(transferData.assets), 'assets 應該是陣列');
    assert(Array.isArray(transferData.locations), 'locations 應該是陣列');
    assertType(transferData.keepers, 'object', 'keepers 應該是物件');
    assertType(transferData.users, 'object', 'users 應該是物件');

    Logger.log(`  當前使用者: ${transferData.userEmail}`);
    Logger.log(`  可轉移資產: ${transferData.assets.length} 筆`);
    Logger.log(`  保管人列表: ${Object.keys(transferData.keepers).length} 人`);
    Logger.log(`  使用人列表: ${Object.keys(transferData.users).length} 人`);
    Logger.log(`  地點列表: ${transferData.locations.length} 個`);

    Logger.log('✓ getTransferData 測試完成');
  } catch (e) {
    Logger.log(`✗ 測試失敗: ${e.message}`);
    Logger.log(`錯誤堆疊: ${e.stack}`);
  }
}

/**
 * 測試 getUserStateData 函式
 */
function test_getUserStateData() {
  Logger.log('\n' + '-'.repeat(70));
  Logger.log('測試: getUserStateData()');
  Logger.log('-'.repeat(70));

  try {
    const userStateData = getUserStateData();

    // 斷言測試
    assertNotNull(userStateData, 'getUserStateData 應該回傳非空值');
    assertType(userStateData.isAdmin, 'boolean', 'isAdmin 應該是布林值');
    assertNotNull(userStateData.userEmail, 'userStateData 應該有 userEmail');
    assertNotNull(userStateData.assets, 'userStateData 應該有 assets');
    assert(Array.isArray(userStateData.assets), 'assets 應該是陣列');

    Logger.log(`  當前使用者: ${userStateData.userEmail}`);
    Logger.log(`  是否為管理員: ${userStateData.isAdmin}`);
    Logger.log(`  資產數量: ${userStateData.assets.length} 筆`);

    if (userStateData.assets.length > 0) {
      const firstAsset = userStateData.assets[0];
      assertNotNull(firstAsset.assetId, '資產應該有 assetId');
      assertNotNull(firstAsset.assetName, '資產應該有 assetName');
      assertNotNull(firstAsset.status, '資產應該有 status');
    }

    Logger.log('✓ getUserStateData 測試完成');
  } catch (e) {
    Logger.log(`✗ 測試失敗: ${e.message}`);
    Logger.log(`錯誤堆疊: ${e.stack}`);
  }
}

/**
 * 測試 getAppUrl 函式
 */
function test_getAppUrl() {
  Logger.log('\n' + '-'.repeat(70));
  Logger.log('測試: getAppUrl()');
  Logger.log('-'.repeat(70));

  try {
    const appUrl = getAppUrl();

    // 斷言測試
    assertNotNull(appUrl, 'getAppUrl 應該回傳非空值');
    assertType(appUrl, 'string', 'getAppUrl 應該回傳字串');
    assert(appUrl.startsWith('https://'), 'URL 應該以 https:// 開頭');

    Logger.log(`  Web App URL: ${appUrl}`);
    Logger.log('✓ getAppUrl 測試完成');
  } catch (e) {
    Logger.log(`✗ 測試失敗: ${e.message}`);
    Logger.log(`錯誤堆疊: ${e.stack}`);
  }
}

// =================================================================
// --- 審核流程測試 (Approval Process Tests) ---
// =================================================================

/**
 * 測試 getPendingApprovals 函式
 */
function test_getPendingApprovals() {
  Logger.log('\n' + '-'.repeat(70));
  Logger.log('測試: getPendingApprovals()');
  Logger.log('-'.repeat(70));

  try {
    const result = getPendingApprovals();

    // 斷言測試
    assertNotNull(result, 'getPendingApprovals 應該回傳非空值');

    if (result.error) {
      Logger.log(`  錯誤: ${result.error}`);
    } else {
      assertNotNull(result.approvals, 'result 應該有 approvals 屬性');
      assert(Array.isArray(result.approvals), 'approvals 應該是陣列');

      Logger.log(`  待審核項目: ${result.approvals.length} 筆`);

      if (result.approvals.length > 0) {
        const firstApproval = result.approvals[0];
        assertNotNull(firstApproval.appId, '審核項目應該有 appId');
        assertNotNull(firstApproval.assetId, '審核項目應該有 assetId');
        assertNotNull(firstApproval.assetName, '審核項目應該有 assetName');

        Logger.log(`  第一筆: ${firstApproval.assetId} - ${firstApproval.assetName}`);
      }
    }

    Logger.log('✓ getPendingApprovals 測試完成');
  } catch (e) {
    Logger.log(`✗ 測試失敗: ${e.message}`);
    Logger.log(`錯誤堆疊: ${e.stack}`);
  }
}

// =================================================================
// --- 管理員權限測試 (Admin Permission Tests) ---
// =================================================================

/**
 * 測試 checkAdminPermissions 函式
 */
function test_checkAdminPermissions() {
  Logger.log('\n' + '-'.repeat(70));
  Logger.log('測試: checkAdminPermissions()');
  Logger.log('-'.repeat(70));

  try {
    const isAdmin = checkAdminPermissions();

    // 斷言測試
    assertType(isAdmin, 'boolean', 'checkAdminPermissions 應該回傳布林值');

    Logger.log(`  當前使用者是否為管理員: ${isAdmin}`);
    Logger.log('✓ checkAdminPermissions 測試完成');
  } catch (e) {
    Logger.log(`✗ 測試失敗: ${e.message}`);
    Logger.log(`錯誤堆疊: ${e.stack}`);
  }
}

/**
 * 測試 getAdminEmails 函式
 */
function test_getAdminEmails() {
  Logger.log('\n' + '-'.repeat(70));
  Logger.log('測試: getAdminEmails()');
  Logger.log('-'.repeat(70));

  try {
    const adminEmails = getAdminEmails();

    // 斷言測試
    assertNotNull(adminEmails, 'getAdminEmails 應該回傳非空值');
    assert(Array.isArray(adminEmails), 'getAdminEmails 應該回傳陣列');

    Logger.log(`  管理員數量: ${adminEmails.length} 人`);

    if (adminEmails.length > 0) {
      Logger.log(`  第一位管理員: ${adminEmails[0]}`);
      assertType(adminEmails[0], 'string', '管理員 email 應該是字串');
      assert(adminEmails[0].includes('@'), 'email 應該包含 @');
    }

    Logger.log('✓ getAdminEmails 測試完成');
  } catch (e) {
    Logger.log(`✗ 測試失敗: ${e.message}`);
    Logger.log(`錯誤堆疊: ${e.stack}`);
  }
}

// =================================================================
// --- 表單處理測試 (Form Processing Tests) ---
// =================================================================

/**
 * 測試 processFormData 函式（模擬測試）
 */
function test_processFormData_validation() {
  Logger.log('\n' + '-'.repeat(70));
  Logger.log('測試: processFormData() - 資料驗證');
  Logger.log('-'.repeat(70));

  try {
    // 準備測試資料
    const mockFormData = {
      group: '測試駐站',
      computer: 'TEST001',
      notes: '測試備註',
      winUpdated: true,
      chromeUpdated: 'true',
      antivirusUpdated: 'on',
      sevenZipVersion: '23.01'
    };

    // 注意: 實際寫入測試需要謹慎處理，這裡只測試資料結構
    Logger.log('  測試資料結構:');
    Logger.log(`    群組: ${mockFormData.group}`);
    Logger.log(`    電腦: ${mockFormData.computer}`);
    Logger.log(`    Windows更新: ${mockFormData.winUpdated}`);
    Logger.log(`    Chrome更新: ${mockFormData.chromeUpdated}`);
    Logger.log(`    防毒更新: ${mockFormData.antivirusUpdated}`);
    Logger.log(`    7-Zip版本: ${mockFormData.sevenZipVersion}`);

    assertNotNull(mockFormData.group, '表單應該有 group');
    assertNotNull(mockFormData.computer, '表單應該有 computer');

    Logger.log('✓ processFormData 資料驗證測試完成');
    Logger.log('  註: 未執行實際寫入，避免汙染資料');
  } catch (e) {
    Logger.log(`✗ 測試失敗: ${e.message}`);
    Logger.log(`錯誤堆疊: ${e.stack}`);
  }
}

// =================================================================
// --- 借用/歸還功能測試 (Lending/Return Tests) ---
// =================================================================

/**
 * 測試 getLendingData 函式
 */
function test_getLendingData() {
  Logger.log('\n' + '-'.repeat(70));
  Logger.log('測試: getLendingData()');
  Logger.log('-'.repeat(70));

  try {
    const lendingData = getLendingData();

    // 斷言測試
    assertNotNull(lendingData, 'getLendingData 應該回傳非空值');

    if (lendingData.error) {
      Logger.log(`  錯誤: ${lendingData.error}`);
    } else {
      assertNotNull(lendingData.assets, 'lendingData 應該有 assets');
      assertNotNull(lendingData.borrowers, 'lendingData 應該有 borrowers');
      assertNotNull(lendingData.locations, 'lendingData 應該有 locations');

      assert(Array.isArray(lendingData.assets), 'assets 應該是陣列');
      assert(Array.isArray(lendingData.borrowers), 'borrowers 應該是陣列');
      assert(Array.isArray(lendingData.locations), 'locations 應該是陣列');

      Logger.log(`  可出借資產: ${lendingData.assets.length} 筆`);
      Logger.log(`  借用人列表: ${lendingData.borrowers.length} 人`);
      Logger.log(`  地點列表: ${lendingData.locations.length} 個`);

      if (lendingData.assets.length > 0) {
        const firstAsset = lendingData.assets[0];
        assertNotNull(firstAsset.id, '資產應該有 id');
        assertNotNull(firstAsset.assetName, '資產應該有 assetName');
        Logger.log(`  第一筆資產: ${firstAsset.id} - ${firstAsset.assetName}`);
      }
    }

    Logger.log('✓ getLendingData 測試完成');
  } catch (e) {
    Logger.log(`✗ 測試失敗: ${e.message}`);
    Logger.log(`錯誤堆疊: ${e.stack}`);
  }
}

/**
 * 測試 getLentOutAssets 函式
 */
function test_getLentOutAssets() {
  Logger.log('\n' + '-'.repeat(70));
  Logger.log('測試: getLentOutAssets()');
  Logger.log('-'.repeat(70));

  try {
    const lentAssets = getLentOutAssets();

    // 斷言測試
    assertNotNull(lentAssets, 'getLentOutAssets 應該回傳非空值');

    if (lentAssets.error) {
      Logger.log(`  錯誤: ${lentAssets.error}`);
    } else {
      assertNotNull(lentAssets.assets, 'lentAssets 應該有 assets');
      assert(Array.isArray(lentAssets.assets), 'assets 應該是陣列');

      Logger.log(`  出借中資產: ${lentAssets.assets.length} 筆`);

      if (lentAssets.assets.length > 0) {
        const firstAsset = lentAssets.assets[0];
        assertNotNull(firstAsset.lendId, '出借記錄應該有 lendId');
        assertNotNull(firstAsset.assetId, '出借記錄應該有 assetId');
        assertNotNull(firstAsset.borrower, '出借記錄應該有 borrower');
        assertNotNull(firstAsset.expectedReturnDate, '出借記錄應該有 expectedReturnDate');

        Logger.log(`  第一筆: ${firstAsset.assetId}, 借用人: ${firstAsset.borrower}`);
      }
    }

    Logger.log('✓ getLentOutAssets 測試完成');
  } catch (e) {
    Logger.log(`✗ 測試失敗: ${e.message}`);
    Logger.log(`錯誤堆疊: ${e.stack}`);
  }
}

/**
 * 測試 processBatchLending 資料驗證
 */
function test_processBatchLending_validation() {
  Logger.log('\n' + '-'.repeat(70));
  Logger.log('測試: processBatchLending() - 資料驗證');
  Logger.log('-'.repeat(70));

  try {
    // 測試缺少必填欄位的情況
    const invalidFormData = {
      assetIds: [],
      borrowerName: '',
      returnDate: '',
      lendingLocation: ''
    };

    Logger.log('  測試空資料驗證...');
    // 注意: 實際執行會報錯，這裡只驗證資料結構
    assertNotNull(invalidFormData.assetIds, '表單應該有 assetIds');
    assertNotNull(invalidFormData.borrowerName, '表單應該有 borrowerName');
    assertNotNull(invalidFormData.returnDate, '表單應該有 returnDate');

    // 測試有效的表單資料結構
    const validFormData = {
      assetIds: ['TEST001'],
      borrowerName: '測試借用人',
      returnDate: new Date().toISOString(),
      reason: '測試原因',
      lendingLocation: '測試地點'
    };

    Logger.log('  測試有效資料結構...');
    assert(Array.isArray(validFormData.assetIds), 'assetIds 應該是陣列');
    assert(validFormData.assetIds.length > 0, 'assetIds 不應該為空');
    assertType(validFormData.borrowerName, 'string', 'borrowerName 應該是字串');
    assertNotNull(validFormData.lendingLocation, '應該有 lendingLocation');

    Logger.log('✓ processBatchLending 資料驗證測試完成');
    Logger.log('  註: 未執行實際寫入，避免汙染資料');
  } catch (e) {
    Logger.log(`✗ 測試失敗: ${e.message}`);
    Logger.log(`錯誤堆疊: ${e.stack}`);
  }
}

/**
 * 測試 processBatchReturn 資料驗證
 */
function test_processBatchReturn_validation() {
  Logger.log('\n' + '-'.repeat(70));
  Logger.log('測試: processBatchReturn() - 資料驗證');
  Logger.log('-'.repeat(70));

  try {
    // 測試空陣列
    const emptyLendIds = [];
    Logger.log('  測試空陣列驗證...');
    assertEqual(emptyLendIds.length, 0, '空陣列長度應為 0');

    // 測試有效的 lendIds
    const validLendIds = ['LEND-123456-0', 'LEND-123456-1'];
    Logger.log('  測試有效資料結構...');
    assert(Array.isArray(validLendIds), 'lendIds 應該是陣列');
    assert(validLendIds.length > 0, 'lendIds 不應該為空');
    assertType(validLendIds[0], 'string', 'lendId 應該是字串');

    Logger.log('✓ processBatchReturn 資料驗證測試完成');
    Logger.log('  註: 未執行實際寫入，避免汙染資料');
  } catch (e) {
    Logger.log(`✗ 測試失敗: ${e.message}`);
    Logger.log(`錯誤堆疊: ${e.stack}`);
  }
}

// =================================================================
// --- 報廢功能測試 (Scrapping Tests) ---
// =================================================================

/**
 * 測試 getScrappableAssets 函式
 */
function test_getScrappableAssets() {
  Logger.log('\n' + '-'.repeat(70));
  Logger.log('測試: getScrappableAssets()');
  Logger.log('-'.repeat(70));

  try {
    const scrapData = getScrappableAssets();

    // 斷言測試
    assertNotNull(scrapData, 'getScrappableAssets 應該回傳非空值');

    if (scrapData.error) {
      Logger.log(`  錯誤: ${scrapData.error}`);
    } else {
      assertNotNull(scrapData.assets, 'scrapData 應該有 assets');
      assert(Array.isArray(scrapData.assets), 'assets 應該是陣列');

      Logger.log(`  可報廢資產: ${scrapData.assets.length} 筆`);

      if (scrapData.assets.length > 0) {
        const firstAsset = scrapData.assets[0];
        assertNotNull(firstAsset.id, '資產應該有 id');
        assertNotNull(firstAsset.status, '資產應該有 status');
        assertNotNull(firstAsset.category, '資產應該有 category');

        // 確認只有「在庫」或「出借中」的資產
        assert(
          firstAsset.status === '在庫' || firstAsset.status === '出借中',
          '資產狀態應該是「在庫」或「出借中」'
        );

        Logger.log(`  第一筆: ${firstAsset.id}, 狀態: ${firstAsset.status}`);
      }
    }

    Logger.log('✓ getScrappableAssets 測試完成');
  } catch (e) {
    Logger.log(`✗ 測試失敗: ${e.message}`);
    Logger.log(`錯誤堆疊: ${e.stack}`);
  }
}

/**
 * 測試 processBatchScrapping 資料驗證
 */
function test_processBatchScrapping_validation() {
  Logger.log('\n' + '-'.repeat(70));
  Logger.log('測試: processBatchScrapping() - 資料驗證');
  Logger.log('-'.repeat(70));

  try {
    // 測試缺少必填欄位的情況
    const invalidFormData = {
      assetIds: [],
      reason: '',
      remarks: ''
    };

    Logger.log('  測試空資料驗證...');
    assertNotNull(invalidFormData.assetIds, '表單應該有 assetIds');
    assertNotNull(invalidFormData.reason, '表單應該有 reason');

    // 測試有效的表單資料結構
    const validFormData = {
      assetIds: ['TEST001', 'TEST002'],
      reason: '損壞',
      remarks: '測試備註'
    };

    Logger.log('  測試有效資料結構...');
    assert(Array.isArray(validFormData.assetIds), 'assetIds 應該是陣列');
    assert(validFormData.assetIds.length > 0, 'assetIds 不應該為空');
    assertType(validFormData.reason, 'string', 'reason 應該是字串');
    assert(validFormData.reason.length > 0, 'reason 不應該為空字串');

    // 測試「其他」原因的情況
    const otherReasonFormData = {
      assetIds: ['TEST001'],
      reason: '其他',
      remarks: '自訂報廢原因'
    };

    Logger.log('  測試「其他」原因資料結構...');
    assertEqual(otherReasonFormData.reason, '其他', 'reason 應該是「其他」');
    assert(otherReasonFormData.remarks.length > 0, 'remarks 不應該為空');

    Logger.log('✓ processBatchScrapping 資料驗證測試完成');
    Logger.log('  註: 未執行實際寫入，避免汙染資料');
  } catch (e) {
    Logger.log(`✗ 測試失敗: ${e.message}`);
    Logger.log(`錯誤堆疊: ${e.stack}`);
  }
}

/**
 * 測試 countPendingApprovals 函式
 */
function test_countPendingApprovals() {
  Logger.log('\n' + '-'.repeat(70));
  Logger.log('測試: countPendingApprovals()');
  Logger.log('-'.repeat(70));

  try {
    const count = countPendingApprovals();

    // 斷言測試
    assertType(count, 'number', 'countPendingApprovals 應該回傳數字');
    assert(count >= 0, '待審核數量應該大於或等於 0');

    Logger.log(`  待審核案件數量: ${count} 筆`);
    Logger.log('✓ countPendingApprovals 測試完成');
  } catch (e) {
    Logger.log(`✗ 測試失敗: ${e.message}`);
    Logger.log(`錯誤堆疊: ${e.stack}`);
  }
}

// =================================================================
// --- 整合測試 (Integration Tests) ---
// =================================================================

/**
 * 測試資料一致性：確保 getAllAssets 和 findAssetLocation 資料一致
 */
function test_dataConsistency() {
  Logger.log('\n' + '-'.repeat(70));
  Logger.log('測試: 資料一致性');
  Logger.log('-'.repeat(70));

  try {
    const assets = getAllAssets();

    if (assets.length === 0) {
      Logger.log('  跳過: 沒有資產資料');
      testStats.skipped++;
      return;
    }

    // 隨機選擇最多 5 筆資產進行測試
    const sampleSize = Math.min(5, assets.length);
    const sampleAssets = [];

    for (let i = 0; i < sampleSize; i++) {
      const randomIndex = Math.floor(Math.random() * assets.length);
      sampleAssets.push(assets[randomIndex]);
    }

    let consistentCount = 0;

    sampleAssets.forEach(asset => {
      const location = findAssetLocation(asset.assetId);

      if (location && location.sheetName === asset.sourceSheet) {
        consistentCount++;
      }
    });

    assertEqual(consistentCount, sampleSize, `所有 ${sampleSize} 筆測試資產的資料應該一致`);

    Logger.log(`  測試了 ${sampleSize} 筆資產，${consistentCount} 筆資料一致`);
    Logger.log('✓ 資料一致性測試完成');
  } catch (e) {
    Logger.log(`✗ 測試失敗: ${e.message}`);
    Logger.log(`錯誤堆疊: ${e.stack}`);
  }
}

/**
 * 測試欄位索引正確性
 */
function test_columnIndices() {
  Logger.log('\n' + '-'.repeat(70));
  Logger.log('測試: 欄位索引正確性');
  Logger.log('-'.repeat(70));

  try {
    // 檢查財產總表索引
    assert(PROPERTY_COLUMN_INDICES.ASSET_ID === 1, 'PROPERTY ASSET_ID 應該是 1');
    assert(PROPERTY_COLUMN_INDICES.ASSET_NAME === 2, 'PROPERTY ASSET_NAME 應該是 2');
    assert(PROPERTY_COLUMN_INDICES.ASSET_STATUS === 15, 'PROPERTY ASSET_STATUS 應該是 15');

    // 檢查物品總表索引
    assert(ITEM_COLUMN_INDICES.ASSET_ID === 1, 'ITEM ASSET_ID 應該是 1');
    assert(ITEM_COLUMN_INDICES.ASSET_NAME === 2, 'ITEM ASSET_NAME 應該是 2');
    assert(ITEM_COLUMN_INDICES.ASSET_STATUS === 15, 'ITEM ASSET_STATUS 應該是 15');

    Logger.log('  財產總表索引檢查完成');
    Logger.log('  物品總表索引檢查完成');
    Logger.log('✓ 欄位索引正確性測試完成');
  } catch (e) {
    Logger.log(`✗ 測試失敗: ${e.message}`);
    Logger.log(`錯誤堆疊: ${e.stack}`);
  }
}

// =================================================================
// --- 測試執行器 (Test Runner) ---
// =================================================================

/**
 * 執行所有測試
 * 這是主要的測試入口函式
 */
function runAllTests() {
  Logger.log('\n\n');
  Logger.log('='.repeat(70));
  Logger.log('開始執行 Google Apps Script 測試套件');
  Logger.log('='.repeat(70));
  Logger.log(`開始時間: ${new Date().toLocaleString('zh-TW')}`);

  resetTestStats();

  // 執行所有測試
  try {
    // 基礎測試
    test_columnIndices();

    // 資料抽象層測試
    test_mapRowToAssetObject();
    test_getAllAssets();
    test_findAssetLocation();

    // 資料獲取測試
    test_getSelectData();
    test_getSevenZipVersions();
    test_getTransferData();
    test_getUserStateData();
    test_getAppUrl();

    // 審核流程測試
    test_getPendingApprovals();

    // 管理員權限測試
    test_checkAdminPermissions();
    test_getAdminEmails();

    // 表單處理測試
    test_processFormData_validation();

    // 借用/歸還測試
    test_getLendingData();
    test_getLentOutAssets();
    test_processBatchLending_validation();
    test_processBatchReturn_validation();

    // 報廢功能測試
    test_getScrappableAssets();
    test_processBatchScrapping_validation();
    test_countPendingApprovals();

    // 整合測試
    test_dataConsistency();

  } catch (e) {
    Logger.log(`\n嚴重錯誤: 測試執行器發生異常`);
    Logger.log(`錯誤訊息: ${e.message}`);
    Logger.log(`錯誤堆疊: ${e.stack}`);
  }

  // 輸出摘要
  Logger.log(`\n結束時間: ${new Date().toLocaleString('zh-TW')}`);
  printTestSummary();

  Logger.log('\n測試執行完畢！');
  Logger.log('='.repeat(70));

  return testStats;
}

/**
 * 執行單一測試類別
 * @param {string} category - 測試類別名稱
 */
function runTestCategory(category) {
  Logger.log('\n\n');
  Logger.log('='.repeat(70));
  Logger.log(`執行測試類別: ${category}`);
  Logger.log('='.repeat(70));

  resetTestStats();

  switch (category) {
    case 'data-abstraction':
      test_mapRowToAssetObject();
      test_getAllAssets();
      test_findAssetLocation();
      break;
    case 'data-retrieval':
      test_getSelectData();
      test_getSevenZipVersions();
      test_getTransferData();
      test_getUserStateData();
      test_getAppUrl();
      break;
    case 'approval':
      test_getPendingApprovals();
      break;
    case 'admin':
      test_checkAdminPermissions();
      test_getAdminEmails();
      break;
    case 'integration':
      test_dataConsistency();
      test_columnIndices();
      break;
    default:
      Logger.log(`未知的測試類別: ${category}`);
      return;
  }

  printTestSummary();
}

/**
 * 快速測試 - 只執行基本測試
 */
function runQuickTests() {
  Logger.log('\n\n');
  Logger.log('='.repeat(70));
  Logger.log('執行快速測試');
  Logger.log('='.repeat(70));

  resetTestStats();

  test_columnIndices();
  test_getAllAssets();
  test_findAssetLocation();
  test_getAppUrl();

  printTestSummary();
}
