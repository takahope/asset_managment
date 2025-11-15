// =================================================================
// --- 財產轉移工作流模組 ---
// 此模組包含所有與財產轉移、審核、上傳確認相關的函數
// =================================================================

/**
 * [供 apply.html 呼叫] 獲取當前使用者可轉移的資產及相關選項資料
 * @returns {Object} 包含使用者資產、保管人清單、使用人清單、地點清單的物件
 */
function getTransferData() {
  const currentUserEmail = Session.getActiveUser().getEmail();
  const allAssets = getAllAssets();

  // 1. 從所有資產中，篩選出屬於當前使用者的、可轉移的資產
  const myAssets = allAssets
    .filter(asset => asset.leaderEmail === currentUserEmail && asset.assetStatus === '在庫')
    .map(asset => ({
      id: asset.assetId,
      assetName: asset.assetName,
      location: asset.location,
      category: asset.assetCategory,
      userName: asset.userName || '無', // 使用者名稱，物品總表顯示「無」
      sourceSheet: asset.sourceSheet // 標記資料來源
    }));

  // 2. 從所有資產中，提取不重複的保管人 (Email -> Name)、使用人 (Email -> Name) 和地點
  const uniqueKeepersMap = new Map();
  const uniqueUsersMap = new Map(); // ✨ 新增：使用人列表
  const uniqueLocationsSet = new Set();

  allAssets.forEach(asset => {
    if (asset.leaderEmail && asset.leaderName) {
      if (!uniqueKeepersMap.has(asset.leaderEmail)) {
        uniqueKeepersMap.set(asset.leaderEmail, asset.leaderName);
      }
    }
    // ✨ 新增：收集使用人資訊
    if (asset.userEmail && asset.userName) {
      if (!uniqueUsersMap.has(asset.userEmail)) {
        uniqueUsersMap.set(asset.userEmail, asset.userName);
      }
    }
    if (asset.location) {
      uniqueLocationsSet.add(asset.location);
    }
  });

  // 3. 將 Map 和 Set 轉換為前端需要的格式
  const keepers = {};
  uniqueKeepersMap.forEach((name, email) => {
    keepers[email] = name;
  });

  // ✨ 新增：使用人列表
  const users = {};
  uniqueUsersMap.forEach((name, email) => {
    users[email] = name;
  });

  const locations = Array.from(uniqueLocationsSet).sort();

  // 4. 回傳整合後的資料
  return {
    userEmail: currentUserEmail,
    assets: myAssets,
    keepers: keepers,
    users: users, // ✨ 新增：使用人列表
    locations: locations
  };
}

/**
 * [供 apply.html 呼叫] 處理前端提交的「批次」財產轉移申請 (高效能且安全版)
 * 使用批次讀取 + 分欄批次寫入，在保護公式的同時實現高效能。
 */
function processBatchTransferApplication(formData) {
  try {
    const { assetIds, newKeeperEmail, newLocation, newUserName, newUserEmail } = formData;

    // ✨ 改進：支援選擇性參數（可以只變更其中一項）
    if (!assetIds || assetIds.length === 0) {
        throw new Error("請至少勾選一筆財產。");
    }

    if (!newKeeperEmail && !newLocation && !newUserName && !newUserEmail) {
        throw new Error("請至少選擇一項要變更的項目（保管人、地點或使用人）。");
    }

    const allAssets = getAllAssets();
    const emailToNameMap = new Map(allAssets.map(asset => [asset.leaderEmail, asset.leaderName]));
    const newKeeperName = newKeeperEmail ? (emailToNameMap.get(newKeeperEmail) || newKeeperEmail.split('@')[0]) : null;

    // ✨ 新增：處理使用人Email
    const userEmailToNameMap = new Map();
    allAssets.forEach(asset => {
      if (asset.userEmail && asset.userName) {
        userEmailToNameMap.set(asset.userEmail, asset.userName);
      }
    });
    const finalNewUserName = newUserEmail ? (userEmailToNameMap.get(newUserEmail) || newUserName || newUserEmail.split('@')[0]) : newUserName;

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const appLogSheet = ss.getSheetByName(APPLICATION_LOG_SHEET_NAME);

    const now = new Date();
    const newLogsToAdd = [];
    const createdApplications = [];

    assetIds.forEach(assetId => {
      const location = findAssetLocation(assetId);
      if (location) {
        const assetRow = location.sheet.getRange(location.rowIndex, 1, 1, location.sheet.getLastColumn()).getValues()[0];
        const indices = location.sheetName === PROPERTY_MASTER_SHEET_NAME ? PROPERTY_COLUMN_INDICES : ITEM_COLUMN_INDICES;
        const asset = mapRowToAssetObject(assetRow, indices, location.sheetName);

        if (asset.assetStatus === '在庫') {
          const indicesToUpdate = location.sheetName === PROPERTY_MASTER_SHEET_NAME ? PROPERTY_COLUMN_INDICES : ITEM_COLUMN_INDICES;

          // ✨ 改進：判斷轉移類型並決定需要審核的項目
          const oldUserName = asset.userName || '';
          const oldUserEmail = asset.userEmail || '';
          const finalNewKeeperEmail = newKeeperEmail || asset.leaderEmail;
          const finalNewKeeperName = newKeeperName || asset.leaderName;
          const finalNewLocation = newLocation || asset.location;
          const finalNewUserEmail = newUserEmail || asset.userEmail || '';
          const finalNewUserName = finalNewUserName || (newKeeperName || asset.userName || asset.leaderName);

          const isKeeperChange = newKeeperEmail && asset.leaderEmail !== newKeeperEmail;
          const isLocationChange = newLocation && asset.location !== newLocation;
          const isUserChange = (newUserEmail && oldUserEmail !== newUserEmail) || (newUserName && oldUserName !== newUserName);

          // 判斷轉移類型
          let transferType = '';
          if (isKeeperChange && isUserChange) {
            transferType = '保管人+使用人';
          } else if (isKeeperChange) {
            transferType = '保管人';
          } else if (isUserChange) {
            transferType = '使用人';
          } else if (isLocationChange) {
            transferType = '地點';
          } else {
            // 沒有實際變更，跳過此資產
            return;
          }

          // 只有變更保管人或使用人時才需要設為「待接收」狀態
          const needsApproval = isKeeperChange || isUserChange;

          if (needsApproval) {
            location.sheet.getRange(location.rowIndex, indicesToUpdate.ASSET_STATUS).setValue("待接收");
            location.sheet.getRange(location.rowIndex, indicesToUpdate.APPLICATION_TIME).setValue(now);
            location.sheet.getRange(location.rowIndex, indicesToUpdate.IS_UPLOADED).setValue('');
            location.sheet.getRange(location.rowIndex, indicesToUpdate.UPLOAD_TIME).setValue('');
            location.sheet.getRange(location.rowIndex, indicesToUpdate.TRANSFER_TIME).setValue('');
          } else {
            // 僅變更地點，直接更新無需審核
            location.sheet.getRange(location.rowIndex, indicesToUpdate.LOCATION).setValue(finalNewLocation);
            location.sheet.getRange(location.rowIndex, indicesToUpdate.TRANSFER_TIME).setValue(now);
          }

          const appId = `APP-${now.getTime()}-${createdApplications.length}`;

          const newLogRow = [
            appId, now, asset.assetId,
            asset.leaderName, asset.location,
            finalNewKeeperName, finalNewLocation,
            needsApproval ? "待接收" : "已完成", finalNewKeeperEmail,
            needsApproval ? "" : now, // REVIEW_TIME
            "", // REVIEW_LINK
            oldUserName, // AL_OLD_USER_COLUMN_INDEX (12)
            finalNewUserName, // AL_NEW_USER_COLUMN_INDEX (13)
            finalNewUserEmail, // AL_NEW_USER_EMAIL_COLUMN_INDEX (14)
            transferType // AL_TRANSFER_TYPE_COLUMN_INDEX (15)
          ];
          newLogsToAdd.push(newLogRow);
          createdApplications.push({
            id: asset.assetId,
            transferType: transferType,
            needsApproval: needsApproval,
            oldKeeperEmail: asset.leaderEmail,
            oldUserEmail: oldUserEmail,
            newKeeperEmail: finalNewKeeperEmail,
            newUserEmail: finalNewUserEmail,
            assetName: asset.assetName
          });
        }
      }
    });

    if (createdApplications.length === 0) {
      throw new Error("處理失敗，勾選的財產可能已不存在或狀態不符 (非在庫)。");
    }

    if (newLogsToAdd.length > 0) {
      appLogSheet.getRange(appLogSheet.getLastRow() + 1, 1, newLogsToAdd.length, newLogsToAdd[0].length)
                 .setValues(newLogsToAdd);
    }

    // ✨ 新增：檢查轉移的資產中是否有使用者與保管人不同的情況，需要發送額外通知
    const assetsWithDifferentUser = [];
    assetIds.forEach(assetId => {
      const location = findAssetLocation(assetId);
      if (location) {
        const assetRow = location.sheet.getRange(location.rowIndex, 1, 1, location.sheet.getLastColumn()).getValues()[0];
        const indices = location.sheetName === PROPERTY_MASTER_SHEET_NAME ? PROPERTY_COLUMN_INDICES : ITEM_COLUMN_INDICES;
        const asset = mapRowToAssetObject(assetRow, indices, location.sheetName);

        // 只有財產總表有使用者欄位，且使用者和保管人不同時才需要記錄
        if (asset.sourceSheet === PROPERTY_MASTER_SHEET_NAME &&
            asset.userName &&
            asset.userName.trim() !== '' &&
            asset.userName !== asset.leaderName) {
          assetsWithDifferentUser.push({
            assetId: asset.assetId,
            assetName: asset.assetName,
            userName: asset.userName,
            keeperName: asset.leaderName
          });
        }
      }
    });

    // ✨ 改進：統計需要審核和不需要審核的項目
    const needsApprovalApps = createdApplications.filter(app => app.needsApproval);
    const autoCompletedApps = createdApplications.filter(app => !app.needsApproval);

    // 根據轉移類型產生摘要
    const transferTypeSummary = {};
    createdApplications.forEach(app => {
      const type = app.transferType || '地點';
      transferTypeSummary[type] = (transferTypeSummary[type] || 0) + 1;
    });

    let typeDescription = '';
    Object.keys(transferTypeSummary).forEach(type => {
      if (typeDescription) typeDescription += '、';
      typeDescription += `${type}(${transferTypeSummary[type]}筆)`;
    });

    let resultMessage = '';
    const webAppUrl = getAppUrl();
    const reviewLink = `${webAppUrl}?page=review`;
    const currentUserEmail = Session.getActiveUser().getEmail();

    // ✨ 改進：根據不同情況發送不同的通知
    // 情況1：只變更使用人（change-user 勾選，其他未勾）
    if (newUserEmail && !newKeeperEmail && !newLocation) {
      // 通知新使用人
      if (newUserEmail) {
        const subject = `[財產轉移通知] 您有 ${needsApprovalApps.length} 筆待接收的財產（使用人變更）`;
        let body = `您好 ${finalNewUserName}，\n\n${currentUserEmail} 已申請將您設為 ${needsApprovalApps.length} 筆財產的使用人。\n\n`;
        body += `財產清單：\n`;
        needsApprovalApps.forEach(app => {
          body += `  - ${app.id}: ${app.assetName}\n`;
        });
        body += `\n請點擊下方連結，前往您的審核儀表板進行批次簽核：\n`;
        body += `${reviewLink}\n\n此為系統自動發送郵件。`;
        MailApp.sendEmail(newUserEmail, subject, body);
      }

      // 通知原保管人
      const oldKeepers = new Set(needsApprovalApps.map(app => app.oldKeeperEmail).filter(e => e));
      oldKeepers.forEach(keeperEmail => {
        const keeperAssets = needsApprovalApps.filter(app => app.oldKeeperEmail === keeperEmail);
        const subject = `[財產通知] 您保管的 ${keeperAssets.length} 筆財產的使用人已變更`;
        let body = `您好，\n\n您保管的以下財產的使用人已變更：\n\n`;
        keeperAssets.forEach(app => {
          body += `  - ${app.id}: ${app.assetName} → 新使用人: ${finalNewUserName}\n`;
        });
        body += `\n此為系統自動發送郵件。`;
        MailApp.sendEmail(keeperEmail, subject, body);
      });

      resultMessage = `成功提交 ${needsApprovalApps.length} 筆使用人變更申請！已通知新使用人和原保管人。`;
    }
    // 情況2：只變更保管人（change-keeper 勾選，其他未勾）
    else if (newKeeperEmail && !newUserEmail && !newLocation) {
      // 通知新保管人
      const subject = `[財產轉移通知] 您有 ${needsApprovalApps.length} 筆待接收的財產（保管人變更）`;
      let body = `您好 ${newKeeperName}，\n\n${currentUserEmail} 已申請將 ${needsApprovalApps.length} 筆財產轉移給您保管。\n\n`;
      body += `財產清單：\n`;
      needsApprovalApps.forEach(app => {
        body += `  - ${app.id}: ${app.assetName}\n`;
      });
      body += `\n請點擊下方連結，前往您的審核儀表板進行批次簽核：\n`;
      body += `${reviewLink}\n\n此為系統自動發送郵件。`;
      MailApp.sendEmail(newKeeperEmail, subject, body);

      // 通知原使用人
      const oldUsers = new Set(needsApprovalApps.map(app => app.oldUserEmail).filter(e => e));
      oldUsers.forEach(userEmail => {
        const userAssets = needsApprovalApps.filter(app => app.oldUserEmail === userEmail);
        const subject = `[財產通知] 您使用的 ${userAssets.length} 筆財產的保管人已變更`;
        let body = `您好，\n\n您使用的以下財產的保管人已變更：\n\n`;
        userAssets.forEach(app => {
          body += `  - ${app.id}: ${app.assetName} → 新保管人: ${newKeeperName}\n`;
        });
        body += `\n此為系統自動發送郵件。`;
        MailApp.sendEmail(userEmail, subject, body);
      });

      resultMessage = `成功提交 ${needsApprovalApps.length} 筆保管人變更申請！已通知新保管人和原使用人。`;
    }
    // 情況3：只變更地點（change-location 勾選，其他未勾）
    else if (newLocation && !newKeeperEmail && !newUserEmail) {
      // 通知管理員
      const adminEmails = getAdminEmails();
      if (adminEmails && adminEmails.length > 0) {
        const subject = `[財產通知] ${autoCompletedApps.length} 筆財產地點已變更`;
        let body = `您好，\n\n${currentUserEmail} 已變更以下財產的地點：\n\n`;
        autoCompletedApps.forEach(app => {
          body += `  - ${app.id}: ${app.assetName} → 新地點: ${newLocation}\n`;
        });
        body += `\n此為系統自動發送郵件。`;
        MailApp.sendEmail(adminEmails.join(','), subject, body);
      }
      resultMessage = `${autoCompletedApps.length} 筆財產地點已變更！已通知財產管理人員。`;
    }
    // 情況4：組合變更（其他情況）
    else if (needsApprovalApps.length > 0) {
      // 通知新保管人或新使用人
      const recipientEmail = newKeeperEmail || newUserEmail;
      const recipientName = newKeeperName || finalNewUserName;

      if (recipientEmail) {
        const subject = `[財產轉移通知] 您有 ${needsApprovalApps.length} 筆待接收的財產`;
        let body = `您好 ${recipientName}，\n\n${currentUserEmail} 已申請將 ${needsApprovalApps.length} 筆財產轉移給您。\n\n`;
        body += `轉移類型：${typeDescription}\n\n`;
        body += `請點擊下方連結，前往您的審核儀表板進行批次簽核：\n`;
        body += `${reviewLink}\n\n此為系統自動發送郵件。`;
        MailApp.sendEmail(recipientEmail, subject, body);
      }
      resultMessage = `成功提交 ${needsApprovalApps.length} 筆需要審核的申請！`;
    }

    if (autoCompletedApps.length > 0 && !resultMessage) {
      resultMessage = `${autoCompletedApps.length} 筆財產已直接完成（無需審核）！`;
    }

    return resultMessage || `成功處理 ${createdApplications.length} 筆財產！`;

  } catch (e) {
    Logger.log("高效能批次申請失敗: " + e.message + " at " + e.stack);
    return "申請失敗：" + e.message;
  }
}


/**
 * ✨ **全新函式**
 * [供 review.html 呼叫] 獲取當前使用者所有待審核的申請
 */
/**
 * [供 review.html 呼叫] 獲取當前使用者所有待審核的申請 (附有詳細日誌的偵錯版)
 */
function getPendingApprovals() {
  Logger.log("--- getPendingApprovals 函式開始執行 (v3) ---");
  const startTime = new Date();

  try {
    const currentUserEmail = Session.getActiveUser().getEmail();
    const appLogSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(APPLICATION_LOG_SHEET_NAME);

    const allAssets = getAllAssets();
    const assetIdToInfoMap = new Map(allAssets.map(asset => [
      asset.assetId,
      {
        assetName: asset.assetName,
        userName: asset.userName || '無'
      }
    ]));

    const range = appLogSheet.getRange(2, 1, appLogSheet.getLastRow() - 1, appLogSheet.getLastColumn());
    const values = range.getValues();

    const pendingApprovals = values
      .filter(row => {
        const newLeaderEmail = row[AL_NEW_LEADER_EMAIL_COLUMN_INDEX - 1];
        const status = row[AL_STATUS_COLUMN_INDEX - 1];
        return newLeaderEmail === currentUserEmail && status === "待接收";
      })
      .map(row => {
        const assetId = row[AL_ASSET_ID_COLUMN_INDEX - 1];
        const assetInfo = assetIdToInfoMap.get(assetId) || { assetName: '（找不到名稱）', userName: '無' };

        // ✨ 讀取轉移類型資訊（如果有的話）
        const transferType = row.length > AL_TRANSFER_TYPE_COLUMN_INDEX - 1
          ? row[AL_TRANSFER_TYPE_COLUMN_INDEX - 1]
          : '地點';

        return {
          appId: row[AL_APP_ID_COLUMN_INDEX - 1],
          applyTime: new Date(row[AL_APP_TIME_COLUMN_INDEX - 1]).toLocaleString('zh-TW'),
          assetId: assetId,
          assetName: assetInfo.assetName,
          userName: assetInfo.userName,
          oldKeeper: row[AL_OLD_LEADER_COLUMN_INDEX - 1],
          oldLocation: row[AL_OLD_LOCATION_COLUMN_INDEX - 1],
          newLocation: row[AL_NEW_LOCATION_COLUMN_INDEX - 1],
          transferType: transferType // ✨ 新增：轉移類型
        };
      });

    Logger.log(`--- getPendingApprovals 函式執行完畢，找到 ${pendingApprovals.length} 筆待審核項目。---`);

    return { approvals: pendingApprovals };
  } catch(e) {
    Logger.log(`!!!!!! getPendingApprovals 發生嚴重錯誤: ${e.message} at ${e.stack}`);
    return { error: "讀取待審核清單時發生錯誤: " + e.message };
  }
}
/**
 * [供 review.html 呼叫] 處理前端提交的「批次」審核 (終極偵錯版)
 * 這個版本包含了極其詳細的日誌，用於找出為何處理會失敗或跳過。
 */
function processBatchApproval(appIds) {
  Logger.log("\n\n--- processBatchApproval (v3) 開始執行 ---");
  if (!appIds || appIds.length === 0) {
    return "您沒有選擇任何項目。";
  }

  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const appLogSheet = ss.getSheetByName(APPLICATION_LOG_SHEET_NAME);
    const locationSheet = ss.getSheetByName(KEEPER_LOCATION_MAP_SHEET_NAME);
    const locationData = locationSheet.getRange(2, 1, locationSheet.getLastRow() - 1, 4).getValues();
    const locationIsStationMap = new Map(locationData.map(row => [row[0], row[1]]));

    const appLogData = appLogSheet.getRange(2, 1, appLogSheet.getLastRow(), appLogSheet.getLastColumn()).getValues();
    const appLogMap = new Map(appLogData.map((row, index) => [row[AL_APP_ID_COLUMN_INDEX - 1], { row, index: index + 2 }]));

    const now = new Date();
    let successCount = 0;
    const errors = [];

    appIds.forEach(appId => {
      const appDetails = appLogMap.get(appId);
      if (appDetails && appDetails.row[AL_STATUS_COLUMN_INDEX - 1] === "待接收") {
        const assetId = appDetails.row[AL_ASSET_ID_COLUMN_INDEX - 1].toString();
        const location = findAssetLocation(assetId);

        if (location) {
          const appRowIndex = appDetails.index;
          appLogSheet.getRange(appRowIndex, AL_STATUS_COLUMN_INDEX).setValue("已完成");
          appLogSheet.getRange(appRowIndex, AL_REVIEW_TIME_COLUMN_INDEX).setValue(now);

          const newLocation = appDetails.row[AL_NEW_LOCATION_COLUMN_INDEX - 1];
          const indices = location.sheetName === PROPERTY_MASTER_SHEET_NAME ? PROPERTY_COLUMN_INDICES : ITEM_COLUMN_INDICES;

          location.sheet.getRange(location.rowIndex, indices.LOCATION).setValue(newLocation);
          location.sheet.getRange(location.rowIndex, indices.ASSET_STATUS).setValue("在庫");
          location.sheet.getRange(location.rowIndex, indices.TRANSFER_TIME).setValue(now);

          // ✨ 新增：更新保管人姓名和Email
          const newKeeperEmail = appDetails.row[AL_NEW_LEADER_EMAIL_COLUMN_INDEX - 1];
          let newKeeperName = appDetails.row[AL_NEW_LEADER_COLUMN_INDEX - 1];

          // 如果姓名為空，從Email推算
          if (!newKeeperName || newKeeperName.toString().trim() === '') {
            newKeeperName = newKeeperEmail ? newKeeperEmail.split('@')[0] : '';
          }

          location.sheet.getRange(location.rowIndex, indices.LEADER_NAME).setValue(newKeeperName);
          location.sheet.getRange(location.rowIndex, indices.LEADER_EMAIL).setValue(newKeeperEmail);

          // ✨ 新增：同時更新使用人欄位（僅財產總表有此欄位）
          if (location.sheetName === PROPERTY_MASTER_SHEET_NAME) {
            // 讀取新使用人資訊（如果有在申請記錄中）
            const newUserName = appDetails.row.length > AL_NEW_USER_COLUMN_INDEX - 1
              ? appDetails.row[AL_NEW_USER_COLUMN_INDEX - 1]
              : '';
            const newUserEmail = appDetails.row.length > AL_NEW_USER_EMAIL_COLUMN_INDEX - 1
              ? appDetails.row[AL_NEW_USER_EMAIL_COLUMN_INDEX - 1]
              : '';

            // 如果有新使用人資訊，則更新；否則保持與保管人同步
            if (newUserName && newUserName.toString().trim() !== '') {
              location.sheet.getRange(location.rowIndex, indices.USER_NAME).setValue(newUserName);
            } else {
              // 預設使用人等於保管人
              location.sheet.getRange(location.rowIndex, indices.USER_NAME).setValue(newKeeperName);
            }

            // ✨ 新增：更新使用人Email
            if (newUserEmail && newUserEmail.toString().trim() !== '') {
              location.sheet.getRange(location.rowIndex, indices.USER_EMAIL).setValue(newUserEmail);
            } else {
              // 預設使用人Email等於保管人Email
              location.sheet.getRange(location.rowIndex, indices.USER_EMAIL).setValue(newKeeperEmail);
            }
          }

          const isStation = locationIsStationMap.get(newLocation) === '是';
          // IS_ACTUALLY_COMPUTER 欄位可能不存在於所有物件中，需要安全檢查
          const assetRow = location.sheet.getRange(location.rowIndex, 1, 1, location.sheet.getLastColumn()).getValues()[0];
          const isActuallyComputer = assetRow[indices.IS_ACTUALLY_COMPUTER - 1] === '是';
          const shouldBeMarked = isStation && isActuallyComputer;
          location.sheet.getRange(location.rowIndex, indices.IS_COMPUTER).setValue(shouldBeMarked ? '是' : '');

          successCount++;
        } else {
          errors.push(`找不到資產 ${assetId}`);
        }
      } else {
        errors.push(`申請ID ${appId} 狀態不符或不存在`);
      }
    });

    if (successCount > 0) {
      const adminEmails = getAdminEmails();
      if (adminEmails && adminEmails.length > 0) {
        const webAppUrl = getAppUrl();
        const updateLink = `${webAppUrl}?page=update`; // ✨ 新增：更新頁面連結

        const subject = `[系統通知] 有 ${successCount} 筆已完成轉移的財產待您更新`;
        let body = `您好，\n\n系統剛剛有 ${successCount} 筆財產轉移申請已被核准，請您執行後續的上傳更新作業。\n\n`;
        body += `請點擊下方連結，前往更新頁面進行操作：\n`;
        body += `${updateLink}\n\n`; // ✨ 新增：直接連結
        body += `您也可以從試算表的「財產管理系統」選單進入「更新已轉移財產」頁面進行操作。\n\n此為系統自動發送郵件。`;
        MailApp.sendEmail(adminEmails.join(','), subject, body);
      }
    }

    let message = `成功核准 ${successCount} 筆申請。`;
    if (errors.length > 0) {
      message += `\n失敗或跳過 ${errors.length} 筆 (${errors.join('; ')})。`;
    }
    return message;

  } catch (e) {
    Logger.log(`!!!!!! processBatchApproval 發生嚴重錯誤: ${e.message} at ${e.stack}`);
    return "批次核准過程中發生嚴重錯誤: " + e.message;
  }
}

// =================================================================
// --- 資產管理員更新功能 (後端) ---
// =================================================================

/**
 * [供 update.html 呼叫] 獲取管理員儀表板的所有待辦事項
 * (包含待上傳 和 待報廢)
 */
// --- getAssetsForUpdate 更新版 ---
function getAssetsForUpdate() {
  const currentUserEmail = Session.getActiveUser().getEmail().toLowerCase();
  const adminEmails = getAdminEmails().map(email => email.toLowerCase());

  if (!adminEmails.includes(currentUserEmail)) {
    Logger.log(`權限阻擋：使用者 ${currentUserEmail} 嘗試存取更新頁面。`);
    return { error: "權限不足，您無法存取此功能。" };
  }

  const allAssets = getAllAssets();

  const assetsForUpload = [];
  const assetsForScrap = [];

  allAssets.forEach(asset => {
    // 條件一：篩選待上傳的項目
    if (asset.transferTime && asset.isUploaded !== 'V') {
      assetsForUpload.push({
        assetId: asset.assetId,
        location: asset.location,
        leader: asset.leaderName,
        userName: asset.userName || '無', // 使用者名稱，物品總表顯示「無」
        transferDate: new Date(asset.transferTime).toLocaleDateString('zh-TW')
      });
    }

    // 條件二：篩選待報廢的項目
    if (asset.assetStatus === '報廢中') {
      assetsForScrap.push({
        assetId: asset.assetId,
        location: asset.location,
        leader: asset.leaderName,
        userName: asset.userName || '無', // 使用者名稱，物品總表顯示「無」
        scrapReason: asset.remarks
      });
    }
  });

  // 回傳一個包含兩個陣列的物件
  return { assetsForUpload, assetsForScrap };
}

/**
 * [供 update.html 呼叫] 處理資產管理員提交的更新狀態
 * @param {Array} assetIds - 被勾選的財產編號陣列
 * @returns {string} 執行結果訊息
 */
function processUploadConfirmation(assetIds) {
  if (!assetIds || assetIds.length === 0) {
    return "沒有選擇任何項目。";
  }

  try {
    const now = new Date();
    let updatedCount = 0;

    assetIds.forEach(id => {
      const location = findAssetLocation(id);
      if (location) {
        // 根據工作表名稱，選擇對應的欄位索引
        const indices = location.sheetName === PROPERTY_MASTER_SHEET_NAME ? PROPERTY_COLUMN_INDICES : ITEM_COLUMN_INDICES;
        location.sheet.getRange(location.rowIndex, indices.IS_UPLOADED).setValue('V');
        location.sheet.getRange(location.rowIndex, indices.UPLOAD_TIME).setValue(now);
        updatedCount++;
      }
    });

    if (updatedCount > 0) {
      return `成功更新 ${updatedCount} 筆財產狀態！`;
    } else {
      return "找不到對應的財產項目，可能資料已被變更。";
    }
  } catch (e) {
    Logger.log("上傳狀態更新失敗: " + e.message);
    return "更新失敗：" + e.message;
  }
}

/**
 * [供前端呼叫] 計算當前使用者待審核的申請數量
 * @returns {number} 待審核數量
 */
function countPendingApprovals() {
  try {
    const currentUserEmail = Session.getActiveUser().getEmail();
    if (!currentUserEmail) {
      return 0;
    }
    const appLogSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(APPLICATION_LOG_SHEET_NAME);
    const values = appLogSheet.getRange(2, 1, appLogSheet.getLastRow() - 1, AL_NEW_LEADER_EMAIL_COLUMN_INDEX).getValues();

    let count = 0;
    for (const row of values) {
      if (row[AL_NEW_LEADER_EMAIL_COLUMN_INDEX - 1] === currentUserEmail && row[AL_STATUS_COLUMN_INDEX - 1] === "待接收") {
        count++;
      }
    }
    return count;
  } catch(e) {
    Logger.log("計算待審核數量失敗: " + e.message);
    return 0; // 發生錯誤時回傳 0
  }
}

/**
 * [供 userstate.html 呼叫] 取消待接收或報廢中的申請
 * @param {string} assetId - 要取消的財產編號
 * @returns {Object} 包含成功與否和錯誤訊息的物件
 */
function cancelTransferOrScrap(assetId) {
  try {
    const currentUserEmail = Session.getActiveUser().getEmail();
    const isAdmin = checkAdminPermissions();

    const allAssets = getAllAssets();
    const asset = allAssets.find(a => a.assetId === assetId);

    if (!asset) {
      throw new Error(`找不到財產編號為 ${assetId} 的資料。`);
    }

    // Security Check: Must be admin or the asset's owner
    if (!isAdmin && asset.leaderEmail !== currentUserEmail) {
      throw new Error("權限不足，只有此財產的保管人或管理員才能執行此操作。");
    }

    const originalStatus = asset.assetStatus;

    if (originalStatus === '轉移中' || originalStatus === '待接收') {
      const location = findAssetLocation(assetId);
      if (!location) throw new Error(`在工作表中找不到資產 ${assetId} 的位置。`);

      // 1. Update asset status in main sheet
      const indices = location.sheetName === PROPERTY_MASTER_SHEET_NAME ? PROPERTY_COLUMN_INDICES : ITEM_COLUMN_INDICES;
      location.sheet.getRange(location.rowIndex, indices.ASSET_STATUS).setValue('在庫');

      // 2. Update status in APPLICATION_LOG_SHEET
      const appLogSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(APPLICATION_LOG_SHEET_NAME);
      const logData = appLogSheet.getRange(2, 1, appLogSheet.getLastRow() - 1, appLogSheet.getLastColumn()).getValues();

      // Find the last pending application for this asset and cancel it
      for (let i = logData.length - 1; i >= 0; i--) {
        const row = logData[i];
        const logAssetId = row[AL_ASSET_ID_COLUMN_INDEX - 1];
        const logStatus = row[AL_STATUS_COLUMN_INDEX - 1];
        if (logAssetId === assetId && (logStatus === '待接收' || logStatus === '轉移中')) {
          appLogSheet.getRange(i + 2, AL_STATUS_COLUMN_INDEX).setValue('已取消');
          break; // Cancel only the most recent one
        }
      }

    } else if (originalStatus === '報廢中') {
      const location = findAssetLocation(assetId);
      if (!location) throw new Error(`在工作表中找不到資產 ${assetId} 的位置。`);

      // 1. Update asset status in main sheet
      const indices = location.sheetName === PROPERTY_MASTER_SHEET_NAME ? PROPERTY_COLUMN_INDICES : ITEM_COLUMN_INDICES;
      location.sheet.getRange(location.rowIndex, indices.ASSET_STATUS).setValue('在庫');

      // 2. Clear the remarks
      location.sheet.getRange(location.rowIndex, indices.REMARKS).setValue('');

    } else {
      throw new Error(`此財產的狀態 (${originalStatus}) 無法被取消。`);
    }

    return { success: true };

  } catch (e) {
    Logger.log(`取消申請失敗 (assetId: ${assetId}): ${e.message} at ${e.stack}`);
    return { success: false, error: e.message };
  }
}
