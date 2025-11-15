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
      lastUpdated: new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })
    };

  } catch (error) {
    Logger.log(`getComputerReportStats 錯誤: ${error}`);
    throw new Error(`無法載入電腦回報統計資料: ${error.message}`);
  }
}
