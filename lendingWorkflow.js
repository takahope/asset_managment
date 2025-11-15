/**
 * 借出/歸還工作流程函數
 * 從 code.js 中提取的借出和歸還相關功能
 *
 * 依賴項目：
 * - getAllAssets() - 數據抽象層函數
 * - findAssetLocation() - 數據抽象層函數
 * - SPREADSHEET_ID - 全局配置常數
 * - LENDING_LOG_SHEET_NAME - 工作表名稱常數
 * - PROPERTY_MASTER_SHEET_NAME - 工作表名稱常數
 * - PROPERTY_COLUMN_INDICES - 欄位索引常數
 * - ITEM_COLUMN_INDICES - 欄位索引常數
 * - LL_STATUS_COLUMN_INDEX - 出借紀錄狀態欄索引
 * - LL_LEND_ID_COLUMN_INDEX - 出借紀錄ID欄索引
 * - LL_RETURN_DATE_COLUMN_INDEX - 出借紀錄歸還日期欄索引
 */

/**
 * [供 lending.html 呼叫] 獲取當前使用者可出借的資產及借用人、地點清單
 */
function getLendingData() {
  try {
    const currentUserEmail = Session.getActiveUser().getEmail();
    const allAssets = getAllAssets();

    // 1. 篩選出當前使用者可出借的資產
    const availableAssets = allAssets
      .filter(asset => asset.leaderEmail === currentUserEmail && asset.assetStatus === '在庫')
      .map(asset => ({
        id: asset.assetId,
        assetName: asset.assetName,
        leaderName: asset.leaderName,
        location: asset.location,
        userName: asset.userName || '無' // 使用者名稱，物品總表顯示「無」
      }));

    // 2. 從所有資產中，提取不重複的借用人 (姓名) 和地點
    const uniqueBorrowersSet = new Set();
    const uniqueLocationsSet = new Set();
    allAssets.forEach(asset => {
      if (asset.leaderName) {
        uniqueBorrowersSet.add(asset.leaderName);
      }
      if (asset.location) {
        uniqueLocationsSet.add(asset.location);
      }
    });

    // 3. 將 Set 轉換為排序後的陣列
    const borrowerList = Array.from(uniqueBorrowersSet).sort((a, b) => a.localeCompare(b, 'zh-Hant'));
    const locationList = Array.from(uniqueLocationsSet).sort();

    // 4. 回傳整合後的資料
    return {
        assets: availableAssets,
        borrowers: borrowerList,
        locations: locationList
    };

  } catch (e) {
    Logger.log("獲取可出借資產失敗: " + e.message);
    return { error: "讀取資料時發生錯誤：" + e.message };
  }
}

/**
 * [供 lending.html 呼叫] 處理批次的財產出借申請
 */
function processBatchLending(formData) {
  try {
    const { assetIds, borrowerName, returnDate, reason, lendingLocation } = formData;
    if (!assetIds || assetIds.length === 0 || !borrowerName || !returnDate || !lendingLocation) {
      throw new Error("資料不完整，請填寫所有必填欄位。");
    }

    const lendingLogSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(LENDING_LOG_SHEET_NAME);
    const allAssets = getAllAssets();
    const assetMap = new Map(allAssets.map(asset => [asset.assetId, asset]));

    const now = new Date();
    let successCount = 0;

    assetIds.forEach(assetId => {
      const asset = assetMap.get(assetId);
      if (asset && asset.assetStatus === '在庫') {
        const location = findAssetLocation(assetId);
        if (location) {
          const indices = location.sheetName === PROPERTY_MASTER_SHEET_NAME ? PROPERTY_COLUMN_INDICES : ITEM_COLUMN_INDICES;
          location.sheet.getRange(location.rowIndex, indices.ASSET_STATUS).setValue('出借中');

          const lendId = `LEND-${now.getTime()}-${successCount}`;
          // ✨ **核心修改：在 appendRow 中增加 lendingLocation**
          lendingLogSheet.appendRow([
            lendId, now, asset.assetId, asset.leaderName,
            borrowerName, new Date(returnDate), "", // 實際歸還日期留空
            reason, "出借中", lendingLocation // 寫入新的 J 欄
          ]);
          successCount++;
        } else {
          Logger.log(`processBatchLending: 找不到資產 ${assetId}，跳過。`);
        }
      }
    });

    if (successCount === 0) {
      throw new Error("處理失敗，勾選的財產可能已被他人借出或狀態已變更。");
    }

    return `成功為 ${successCount} 筆財產辦理出借！`;

  } catch (e) {
    Logger.log("批次出借失敗: " + e.message);
    return "申請出借失敗：" + e.message;
  }
}

/**
 * [供 return.html 呼叫] 獲取該保管人所有「出借中」的資產
 */
function getLentOutAssets() {
    try {
        const currentUserEmail = Session.getActiveUser().getEmail();
        const lendingLogSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(LENDING_LOG_SHEET_NAME);
        const lendingData = lendingLogSheet.getRange(2, 1, lendingLogSheet.getLastRow() - 1, 10).getValues(); // ✨ 讀取到 J 欄

        const allAssets = getAllAssets();
        const assetKeeperMap = new Map(allAssets.map(asset => [asset.assetId, asset.leaderEmail]));

        const lentAssets = lendingData
            .filter(row => {
                const assetId = row[2];
                const keeperEmail = assetKeeperMap.get(assetId);
                const status = row[LL_STATUS_COLUMN_INDEX - 1];
                return keeperEmail === currentUserEmail && status === '出借中';
            })
            .map(row => ({
                lendId: row[0],
                applyTime: new Date(row[1]).toLocaleDateString('zh-TW'),
                assetId: row[2],
                borrower: row[4],
                expectedReturnDate: new Date(row[5]).toLocaleDateString('zh-TW'),
                reason: row[7],
                lendingLocation: row[9] || '' // ✨ 新增：讀取 J 欄 (索引為9) 的出借後地點
            }));

        return { assets: lentAssets };
    } catch (e) {
        Logger.log("獲取出借中資產失敗: " + e.message);
        return { error: "讀取資料時發生錯誤：" + e.message };
    }
}


/**
 * [供 return.html 呼叫] 處理批次的財產歸還作業
 */
function processBatchReturn(lendIds) {
    if (!lendIds || lendIds.length === 0) {
        throw new Error("您沒有勾選任何要歸還的項目。");
    }

    try {
        const lendingLogSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(LENDING_LOG_SHEET_NAME);
        const lendingData = lendingLogSheet.getRange(2, 1, lendingLogSheet.getLastRow() - 1, lendingLogSheet.getLastColumn()).getValues();
        const lendingMap = new Map(lendingData.map((row, index) => [row[LL_LEND_ID_COLUMN_INDEX - 1], { row, index: index + 2 }]));

        const now = new Date();
        let successCount = 0;

        lendIds.forEach(lendId => {
            const lendDetails = lendingMap.get(lendId);
            if (lendDetails && lendDetails.row[LL_STATUS_COLUMN_INDEX - 1] === '出借中') {
                const assetId = lendDetails.row[2];

                // 1. 更新「出借紀錄」
                const lendRowIndex = lendDetails.index;
                lendingLogSheet.getRange(lendRowIndex, LL_STATUS_COLUMN_INDEX).setValue('已歸還');
                lendingLogSheet.getRange(lendRowIndex, LL_RETURN_DATE_COLUMN_INDEX).setValue(now);

                // 2. 更新財產總表的狀態
                const location = findAssetLocation(assetId);
                if (location) {
                    const indices = location.sheetName === PROPERTY_MASTER_SHEET_NAME ? PROPERTY_COLUMN_INDICES : ITEM_COLUMN_INDICES;
                    location.sheet.getRange(location.rowIndex, indices.ASSET_STATUS).setValue('在庫');
                }
                successCount++;
            }
        });

        return `成功將 ${successCount} 筆財產狀態更新為「在庫」！`;

    } catch (e) {
        Logger.log("批次歸還失敗: " + e.message);
        return "歸還作業失敗：" + e.message;
    }
}
