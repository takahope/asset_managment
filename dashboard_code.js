// =================================================================
// --- 儀表板 (Dashboard) 後端邏輯 ---
// --- 整合資產總覽與電腦回報統計的後端程式碼 ---
// =================================================================

function formatDashboardDate(value, pattern) {
  if (!value) {
    return '';
  }
  try {
    return Utilities.formatDate(new Date(value), Session.getScriptTimeZone(), pattern);
  } catch (e) {
    return String(value);
  }
}

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

    // 3. 統計待更新的資產（已轉移但尚未上傳到外部系統）
    const pendingUploadAssets = allAssets.filter(asset =>
      asset.transferTime && asset.isUploaded !== 'V'
    );

    // 整理待更新資產詳細資訊
    const pendingUploadDetails = pendingUploadAssets.map(asset => {
      const transferDate = asset.transferTime
        ? formatDashboardDate(asset.transferTime, 'yyyy/MM/dd')
        : '-';

      return {
        assetId: asset.assetId,
        assetName: asset.assetName,
        leaderName: asset.leaderName,
        userName: asset.userName,
        location: asset.location,
        transferDate: transferDate,
        status: asset.assetStatus
      };
    });

    // 4. 統計達到使用年限的資產（排除已報廢和報廢中的資產）
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

      const purchaseDate = asset.purchaseDate
        ? formatDashboardDate(asset.purchaseDate, 'yyyy/MM/dd')
        : '';

      return {
        assetId: asset.assetId,
        assetName: asset.assetName,
        leaderName: asset.leaderName,
        location: asset.location,
        purchaseDate: purchaseDate,
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
      pendingUpload: {
        count: pendingUploadAssets.length,
        assets: pendingUploadDetails
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

/**
 * 取得整合儀表板資料（包含資產總覽和電腦回報統計）
 * 這是一個整合函式，同時取得兩種統計資料以減少後端呼叫次數
 * @returns {object} 包含資產總覽和電腦回報統計的整合物件
 */
function getIntegratedDashboardData() {
  try {
    // 同時取得兩種統計資料
    const assetOverview = getDashboardData();
    const computerReportStats = getComputerReportStats();
    
    return {
      assetOverview: assetOverview,
      computerReportStats: computerReportStats,
      lastUpdated: new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })
    };
  } catch (error) {
    Logger.log(`getIntegratedDashboardData 錯誤: ${error}`);
    throw new Error(`無法載入整合儀表板資料: ${error.message}`);
  }
}

// =================================================================
// --- 駐站電腦回報統計 (Station Computer Report Statistics) 後端邏輯 ---
// --- 獨立的後端程式碼，用於顯示電腦回報狀態統計資訊 ---
// =================================================================

/**
 * 獲取指定月份已回報的電腦集合
 * @param {Sheet} responseSheet - 回應工作表
 * @param {number} year - 年份
 * @param {number} month - 月份（0-11）
 * @returns {Set<string>} - 已回報的電腦ID集合
 */
function getSubmittedComputersForMonth(responseSheet, year, month) {
  const responseData = responseSheet.getRange(2, 1, Math.max(1, responseSheet.getLastRow() - 1), 3).getValues();
  const submittedComputers = new Set();

  for (const row of responseData) {
    if (!row[0]) continue; // 跳過空行

    const timestamp = new Date(row[0]);
    if (timestamp.getFullYear() === year && timestamp.getMonth() === month) {
      const computerName = row[2];
      if (computerName) {
        submittedComputers.add(String(computerName).trim());
      }
    }
  }

  return submittedComputers;
}

/**
 * 取得駐站電腦回報統計資料
 * @returns {object} 包含所有回報統計資訊的物件
 */
function getComputerReportStats() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const responseSheet = ss.getSheetByName(RESPONSE_SHEET_NAME);
    const allAssets = getAllAssets();

    // 1. 獲取所有需要回報的駐站電腦
    const requiredComputers = allAssets.filter(asset => asset.isComputer === '是');

    // 2. 取得當前月份和上個月的資訊
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    // 計算上個月
    let lastMonth = currentMonth - 1;
    let lastMonthYear = currentYear;
    if (lastMonth < 0) {
      lastMonth = 11;
      lastMonthYear = currentYear - 1;
    }

    // 3. 獲取本月已回報的電腦
    const currentMonthSubmitted = getSubmittedComputersForMonth(responseSheet, currentYear, currentMonth);

    // 4. 獲取上月已回報的電腦
    const lastMonthSubmitted = getSubmittedComputersForMonth(responseSheet, lastMonthYear, lastMonth);

    // 5. 統計資料
    const totalComputers = requiredComputers.length;
    const reportedCount = currentMonthSubmitted.size;
    const notReportedCount = totalComputers - reportedCount;
    const reportRate = totalComputers > 0 ? ((reportedCount / totalComputers) * 100).toFixed(1) : 0;

    // 6. 本月未回報列表
    const currentMonthNotReported = [];
    const twoMonthsNotReported = []; // 連續兩個月未回報

    requiredComputers.forEach(asset => {
      const computerNameStr = String(asset.assetId).trim();

      if (computerNameStr && !currentMonthSubmitted.has(computerNameStr)) {
        // 本月未回報
        const notReportedInfo = {
          assetId: asset.assetId,
          assetName: asset.assetName,
          location: asset.location,
          leaderName: asset.leaderName,
          leaderEmail: asset.leaderEmail
        };

        currentMonthNotReported.push(notReportedInfo);

        // 檢查是否上個月也未回報
        if (!lastMonthSubmitted.has(computerNameStr)) {
          twoMonthsNotReported.push(notReportedInfo);
        }
      }
    });

    // 7. 按駐站地點分組統計
    const locationStats = {};
    requiredComputers.forEach(asset => {
      const location = asset.location || '未指定';
      if (!locationStats[location]) {
        locationStats[location] = {
          total: 0,
          reported: 0,
          notReported: 0
        };
      }

      locationStats[location].total++;

      const computerNameStr = String(asset.assetId).trim();
      if (currentMonthSubmitted.has(computerNameStr)) {
        locationStats[location].reported++;
      } else {
        locationStats[location].notReported++;
      }
    });

    // 轉換為陣列並計算百分比
    const locationStatsArray = Object.keys(locationStats).map(location => ({
      location: location,
      total: locationStats[location].total,
      reported: locationStats[location].reported,
      notReported: locationStats[location].notReported,
      reportRate: locationStats[location].total > 0
        ? ((locationStats[location].reported / locationStats[location].total) * 100).toFixed(1)
        : 0
    })).sort((a, b) => b.reportRate - a.reportRate); // 按回報率降序排列

    // 8. 按保管人分組統計
    const leaderStats = {};
    requiredComputers.forEach(asset => {
      const leaderName = asset.leaderName || '未指定';
      if (!leaderStats[leaderName]) {
        leaderStats[leaderName] = {
          email: asset.leaderEmail,
          total: 0,
          reported: 0,
          notReported: 0,
          computers: []
        };
      }

      leaderStats[leaderName].total++;

      const computerNameStr = String(asset.assetId).trim();
      const isReported = currentMonthSubmitted.has(computerNameStr);

      if (isReported) {
        leaderStats[leaderName].reported++;
      } else {
        leaderStats[leaderName].notReported++;
        leaderStats[leaderName].computers.push({
          assetId: asset.assetId,
          location: asset.location
        });
      }
    });

    // 轉換為陣列，只包含有未回報電腦的保管人
    const leaderStatsArray = Object.keys(leaderStats)
      .filter(leaderName => leaderStats[leaderName].notReported > 0)
      .map(leaderName => ({
        leaderName: leaderName,
        email: leaderStats[leaderName].email,
        total: leaderStats[leaderName].total,
        reported: leaderStats[leaderName].reported,
        notReported: leaderStats[leaderName].notReported,
        computers: leaderStats[leaderName].computers,
        reportRate: leaderStats[leaderName].total > 0
          ? ((leaderStats[leaderName].reported / leaderStats[leaderName].total) * 100).toFixed(1)
          : 0
      }))
      .sort((a, b) => b.notReported - a.notReported); // 按未回報數量降序排列

    // 9. 按使用人分組統計
    const userStats = {};
    requiredComputers.forEach(asset => {
      const userName = asset.userName || '未指定';
      const userEmail = asset.userEmail || '';

      if (!userStats[userName]) {
        userStats[userName] = {
          email: userEmail,
          total: 0,
          reported: 0,
          notReported: 0,
          computers: []
        };
      }

      userStats[userName].total++;

      const computerNameStr = String(asset.assetId).trim();
      const isReported = currentMonthSubmitted.has(computerNameStr);

      if (isReported) {
        userStats[userName].reported++;
      } else {
        userStats[userName].notReported++;
        userStats[userName].computers.push({
          assetId: asset.assetId,
          assetName: asset.assetName,
          location: asset.location,
          leaderName: asset.leaderName
        });
      }
    });

    // 轉換為陣列，只包含有未回報電腦的使用人
    const userStatsArray = Object.keys(userStats)
      .filter(userName => userStats[userName].notReported > 0)
      .map(userName => ({
        userName: userName,
        email: userStats[userName].email,
        total: userStats[userName].total,
        reported: userStats[userName].reported,
        notReported: userStats[userName].notReported,
        computers: userStats[userName].computers,
        reportRate: userStats[userName].total > 0
          ? ((userStats[userName].reported / userStats[userName].total) * 100).toFixed(1)
          : 0
      }))
      .sort((a, b) => b.notReported - a.notReported); // 按未回報數量降序排列

    // 返回統計結果
    return {
      summary: {
        totalComputers: totalComputers,
        reportedCount: reportedCount,
        notReportedCount: notReportedCount,
        reportRate: reportRate,
        currentMonth: `${currentYear}年${currentMonth + 1}月`,
        lastMonth: `${lastMonthYear}年${lastMonth + 1}月`
      },
      currentMonthNotReported: currentMonthNotReported,
      twoMonthsNotReported: twoMonthsNotReported,
      locationStats: locationStatsArray,
      leaderStats: leaderStatsArray,
      userStats: userStatsArray,
      lastUpdated: new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })
    };

  } catch (error) {
    Logger.log(`getComputerReportStats 錯誤: ${error}`);
    throw new Error(`無法載入電腦回報統計資料: ${error.message}`);
  }
}
