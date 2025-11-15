// =================================================================
// --- 儀表板 (Dashboard) 後端邏輯 ---
// --- 獨立的後端程式碼，用於顯示系統總覽資訊 ---
// =================================================================

/**
 * 計算資產是否已達使用年限
 * @param {Date|string} purchaseDate - 取得日期
 * @param {number} useLife - 使用年限（年）
 * @returns {boolean} - 是否已達使用年限
 */
function isAssetExpired(purchaseDate, useLife) {
  if (!purchaseDate || !useLife || useLife === 0) {
    return false;
  }

  try {
    const purchase = new Date(purchaseDate);
    const today = new Date();
    const yearsDiff = (today - purchase) / (1000 * 60 * 60 * 24 * 365.25);
    return yearsDiff >= useLife;
  } catch (e) {
    Logger.log(`計算使用年限錯誤: ${e}`);
    return false;
  }
}

/**
 * 取得儀表板統計資料
 * @returns {object} 包含所有儀表板統計資訊的物件
 */
function getDashboardData() {
  try {
    const allAssets = getAllAssets();

    // 1. 統計待接收資產 (狀態 = '待接收')
    const pendingAssets = allAssets.filter(asset => asset.assetStatus === '待接收');

    // 按新保管人分組（需要從申請紀錄中查找）
    const pendingUserMap = new Map(); // key: email, value: {name, email, count, assets}

    // 讀取申請紀錄以獲取新保管人資訊
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const appLogSheet = ss.getSheetByName(APPLICATION_LOG_SHEET_NAME);

    if (appLogSheet && appLogSheet.getLastRow() > 1) {
      const logData = appLogSheet.getRange(2, 1, appLogSheet.getLastRow() - 1, appLogSheet.getLastColumn()).getValues();

      pendingAssets.forEach(asset => {
        // 在申請紀錄中找到對應的轉移申請
        const logEntry = logData.find(row =>
          row[AL_ASSET_ID_COLUMN_INDEX - 1] === asset.assetId &&
          row[AL_STATUS_COLUMN_INDEX - 1] === '待接收'
        );

        if (logEntry) {
          const newLeaderEmail = logEntry[AL_NEW_LEADER_EMAIL_COLUMN_INDEX - 1];
          const newLeaderName = logEntry[AL_NEW_LEADER_COLUMN_INDEX - 1];

          if (!pendingUserMap.has(newLeaderEmail)) {
            pendingUserMap.set(newLeaderEmail, {
              name: newLeaderName,
              email: newLeaderEmail,
              count: 0,
              assets: []
            });
          }

          const userInfo = pendingUserMap.get(newLeaderEmail);
          userInfo.count++;
          userInfo.assets.push({
            assetId: asset.assetId,
            assetName: asset.assetName
          });
        }
      });
    }

    const pendingUsers = Array.from(pendingUserMap.values());

    // 2. 統計報廢中資產 (狀態 = '報廢中')
    const scrappingAssets = allAssets.filter(asset => asset.assetStatus === '報廢中');

    // 按保管人分組
    const scrappingUserMap = new Map(); // key: email, value: {name, email, count, assets}

    scrappingAssets.forEach(asset => {
      const email = asset.leaderEmail;
      const name = asset.leaderName;

      if (!scrappingUserMap.has(email)) {
        scrappingUserMap.set(email, {
          name: name,
          email: email,
          count: 0,
          assets: []
        });
      }

      const userInfo = scrappingUserMap.get(email);
      userInfo.count++;
      userInfo.assets.push({
        assetId: asset.assetId,
        assetName: asset.assetName
      });
    });

    const scrappingUsers = Array.from(scrappingUserMap.values());

    // 3. 統計達到使用年限的資產（排除已報廢和報廢中的資產）
    const activeAssets = allAssets.filter(asset =>
      asset.assetStatus !== '已報廢' && asset.assetStatus !== '報廢中'
    );

    const expiredAssets = activeAssets.filter(asset =>
      isAssetExpired(asset.purchaseDate, asset.useLife)
    );

    // 整理過期資產詳細資訊
    const expiredAssetsDetails = expiredAssets.map(asset => {
      let yearsUsed = 0;
      if (asset.purchaseDate && asset.useLife) {
        const purchase = new Date(asset.purchaseDate);
        const today = new Date();
        yearsUsed = Math.floor((today - purchase) / (1000 * 60 * 60 * 24 * 365.25));
      }

      return {
        assetId: asset.assetId,
        assetName: asset.assetName,
        leaderName: asset.leaderName,
        location: asset.location,
        purchaseDate: asset.purchaseDate,
        useLife: asset.useLife,
        yearsUsed: yearsUsed,
        status: asset.assetStatus
      };
    });

    // 返回統計結果
    return {
      pendingTransfer: {
        userCount: pendingUsers.length,
        totalAssets: pendingAssets.length,
        users: pendingUsers
      },
      scrappingInProgress: {
        userCount: scrappingUsers.length,
        totalAssets: scrappingAssets.length,
        users: scrappingUsers
      },
      expiredAssets: {
        count: expiredAssets.length,
        assets: expiredAssetsDetails
      },
      lastUpdated: new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })
    };

  } catch (error) {
    Logger.log(`getDashboardData 錯誤: ${error}`);
    throw new Error(`無法載入儀表板資料: ${error.message}`);
  }
}
