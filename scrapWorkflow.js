/**
 * 報廢工作流程相關函數
 * 從 code.js 提取的報廢相關功能
 */

/**
 * [供 scrap.html 呼叫] 獲取使用者名下可報廢的資產 (狀態為「在庫」或「出借中」)
 */
function getScrappableAssets() {
  try {
    const currentUserEmail = Session.getActiveUser().getEmail();
    const allAssets = getAllAssets();

    const availableAssets = allAssets
      .filter(asset => {
        return asset.leaderEmail === currentUserEmail && (asset.assetStatus === '在庫' || asset.assetStatus === '出借中');
      })
      .map(asset => ({
        id: asset.assetId,
        location: asset.location,
        status: asset.assetStatus,
        category: asset.assetCategory,
        userName: asset.userName || '無' // 使用者名稱，物品總表顯示「無」
      }));

    return { assets: availableAssets };
  } catch (e) {
    Logger.log("獲取可報廢資產失敗: " + e.message);
    return { error: "讀取資料時發生錯誤：" + e.message };
  }
}


/**
 * [供 scrap.html 呼叫] 處理批次的財產報廢申請 (改為"報廢中"狀態)
 */
function processBatchScrapping(formData) {
  try {
    const { assetIds, reason, remarks } = formData;
    if (!assetIds || assetIds.length === 0 || !reason) {
      throw new Error("資料不完整，請至少勾選一筆財產並選擇報廢原因。");
    }

    const allAssets = getAllAssets();
    const assetMap = new Map(allAssets.map(asset => [asset.assetId, asset]));

    const now = new Date();
    let successCount = 0;
    const fullReason = reason === '其他' ? `其他: ${remarks}` : `${reason} ${remarks}`;

    assetIds.forEach(assetId => {
      const asset = assetMap.get(assetId);
      if (asset && asset.assetStatus !== '已報廢' && asset.assetStatus !== '報廢中') {
        const location = findAssetLocation(assetId);
        if (location) {
          const indices = location.sheetName === PROPERTY_MASTER_SHEET_NAME ? PROPERTY_COLUMN_INDICES : ITEM_COLUMN_INDICES;
          location.sheet.getRange(location.rowIndex, indices.ASSET_STATUS).setValue('報廢中');
          location.sheet.getRange(location.rowIndex, indices.LAST_MODIFIED).setValue(now);
          location.sheet.getRange(location.rowIndex, indices.REMARKS).setValue(fullReason);
          successCount++;
        } else {
          Logger.log(`processBatchScrapping: 找不到資產 ${assetId}，跳過。`);
        }
      }
    });

    if (successCount === 0) {
      throw new Error("處理失敗，勾選的財產可能已在報廢流程中或狀態已變更。");
    }

    return `成功為 ${successCount} 筆財產提交報廢申請，待管理員確認。`;

  } catch (e) {
    Logger.log("批次報廢申請失敗: " + e.message);
    return "申請報廢失敗：" + e.message;
  }
}

/**
 * [供 update.html 呼叫] 處理管理員的批次報廢確認
 */
function processScrapConfirmation(assetIds) {
  if (!assetIds || assetIds.length === 0) {
    throw new Error("您沒有勾選任何要確認報廢的項目。");
  }

  try {
    const allAssets = getAllAssets();
    const assetMap = new Map(allAssets.map(asset => [asset.assetId, asset]));

    const now = new Date();
    let successCount = 0;

    assetIds.forEach(assetId => {
      const asset = assetMap.get(assetId);
      if (asset && asset.assetStatus === '報廢中') {
        const location = findAssetLocation(assetId);
        if (location) {
          const indices = location.sheetName === PROPERTY_MASTER_SHEET_NAME ? PROPERTY_COLUMN_INDICES : ITEM_COLUMN_INDICES;
          location.sheet.getRange(location.rowIndex, indices.ASSET_STATUS).setValue('已報廢');
          const originalReason = asset.remarks;
          location.sheet.getRange(location.rowIndex, indices.REMARKS).setValue(originalReason.replace('[報廢申請]', '[報廢完成]'));
          location.sheet.getRange(location.rowIndex, indices.LAST_MODIFIED).setValue(now);
          successCount++;
        }
      }
    });

    return `成功確認 ${successCount} 筆財產的報廢作業！`;

  } catch (e) {
    Logger.log("批次報廢確認失敗: " + e.message);
    return "報廢確認失敗：" + e.message;
  }
}

function getAllScrappableItems(assetCategory) {
  if (!checkAdminPermissions()) {
    return { error: "權限不足，您無法存取此功能。" };
  }
  try {
    const allAssets = getAllAssets();
    const items = [];
    allAssets.forEach(asset => {
      if (asset.assetStatus === '報廢中' && asset.assetCategory === assetCategory) {
        items.push({
          assetId: asset.assetId,
          assetName: asset.assetName,
          originalKeeper: asset.leaderName
        });
      }
    });
    return items;
  } catch (e) {
    Logger.log("getAllScrappableItems 失敗: " + e.message);
    throw new Error("讀取所有待報廢項目時發生錯誤。");
  }
}

function getScrappingDataForAdmin(assetCategory) {
  const currentUserEmail = Session.getActiveUser().getEmail().toLowerCase();
  const adminEmails = getAdminEmails().map(email => email.toLowerCase());

  if (!adminEmails.includes(currentUserEmail)) {
    Logger.log(`權限阻擋：使用者 ${currentUserEmail} 嘗試存取管理員報廢清單。`);
    return { error: "權限不足，您無法存取此功能。" };
  }

  try {
    const allAssets = getAllAssets();

    const applicants = {};

    allAssets.forEach(asset => {
      if (asset.assetStatus === '報廢中' && asset.leaderName && asset.assetCategory === assetCategory) {
        if (applicants[asset.leaderName]) {
          applicants[asset.leaderName]++;
        } else {
          applicants[asset.leaderName] = 1;
        }
      }
    });

    return Object.keys(applicants).map(name => ({
      applicant: name,
      count: applicants[name]
    }));

  } catch (e) {
    Logger.log("getScrappingDataForAdmin 失敗: " + e.message);
    throw new Error("讀取待報廢清單時發生錯誤。");
  }
}

/**
 * [供 printScrap.html 呼叫] 取得所有狀態為「報廢中」的財產，並按保管人分組
 * @returns {Array<Object>} 回傳一個陣列，包含 { applicant: '保管人名稱', count: 報廢數量 }
 */
function getScrappingApplicants(assetCategory) {
  try {
    const allAssets = getAllAssets();

    const applicants = {};

    allAssets.forEach(asset => {
      if (asset.assetStatus === '報廢中' && asset.leaderName && asset.assetCategory === assetCategory) {
        if (applicants[asset.leaderName]) {
          applicants[asset.leaderName]++;
        } else {
          applicants[asset.leaderName] = 1;
        }
      }
    });

    return Object.keys(applicants).map(name => ({
      applicant: name,
      count: applicants[name]
    }));

  } catch (e) {
    Logger.log("getScrappingApplicants 失敗: " + e.message);
    throw new Error("讀取待報廢清單時發生錯誤。");
  }
}

/**
 * [供 printScrap.html 呼叫] 為指定保管人產生一份彙整的報廢申請文件 (最終格式修正版)
 * 修正了數字格式、民國日期解析、以及已使用期間的計算問題。
 * @param {string} applicantName 要處理的保管人名稱
 * @returns {object} 包含新文件 URL 的物件 { fileUrl: '...' }
 */
function createScrapDoc(applicantName, assetCategory, assetIds) {
  const now = new Date();
  try {
    const allAssets = getAllAssets();
    const assetsToScrap = [];

    if (assetIds && assetIds.length > 0) {
      const assetIdSet = new Set(assetIds);
      allAssets.forEach(asset => {
        if (assetIdSet.has(asset.assetId)) {
          assetsToScrap.push(asset);
        }
      });
    } else {
      allAssets.forEach(asset => {
        if (asset.leaderName === applicantName && asset.assetStatus === '報廢中' && asset.assetCategory === assetCategory) {
          assetsToScrap.push(asset);
        }
      });
    }
    if (assetsToScrap.length === 0) throw new Error(`找不到 ${applicantName} 的待報廢財產。`);

    const assetMap = new Map(allAssets.map(asset => [asset.assetId, asset]));

    const templateId = assetCategory === '財產' ? SCRAP_TEMPLATE_DOC_ID_PROPERTY : SCRAP_TEMPLATE_DOC_ID_NON_CONSUMABLE;
    const categoryName = assetCategory === '財產' ? '財產' : '非消耗品';
    const docName = `財產報廢單_${categoryName}_${applicantName}_${Utilities.formatDate(now, "GMT+8", "yyyyMMdd")}`;
    const templateFile = DriveApp.getFileById(templateId);
    const outputFolder = DriveApp.getFolderById(SCRAP_OUTPUT_FOLDER_ID);
    const newFile = templateFile.makeCopy(docName, outputFolder);
    const newDoc = DocumentApp.openById(newFile.getId());
    const body = newDoc.getBody();
    body.replaceText("{{申請日期}}", Utilities.formatDate(now, "GMT+8", "yyyy/MM/dd"));
    body.replaceText("{{填表人}}", applicantName);

    const tablePlaceholder = body.findText("{{報廢項目表格}}");
    if (!tablePlaceholder) {
      throw new Error('錯誤：在您的 Google Docs 範本文件中找不到 "{{報廢項目表格}}" 這個佔位符！');
    }
    const placeholderParagraph = tablePlaceholder.getElement().getParent();
    const insertIndex = body.getChildIndex(placeholderParagraph);
    placeholderParagraph.removeFromParent();

    let tableHeader;
    if (assetCategory === '非消耗品') {
      tableHeader = ['序號', '物品編號', '物品名稱', '購置日期', '使用年限', '已使用期間', '報廢原因'];
    } else {
      tableHeader = ['序號', '財產編號', '財產名稱', '購置日期', '使用年限', '已使用期間', '報廢原因'];
    }
    const tableValues = [tableHeader];

    assetsToScrap.forEach((asset, index) => {
      const assetInfo = assetMap.get(asset.assetId.trim());
      if (assetInfo) {
        let purchaseDateStr = (assetInfo.purchaseDate || '').toString();
        purchaseDateStr = purchaseDateStr.split('\n')[0].trim();

        let purchaseDate = null;
        let years = 'N/A';
        let months = 'N/A';
        let purchaseDateFormatted = '無日期資料';

        if (purchaseDateStr.includes('GMT')) {
            purchaseDate = new Date(purchaseDateStr);
        } else {
            const dateParts = purchaseDateStr.match(/(0?\d+)\/(\d+)\/(\d+)/);
            if (dateParts) {
                const minguoYear = parseInt(dateParts[1], 10);
                const gregorianYear = minguoYear + 1911;
                const monthJs = parseInt(dateParts[2], 10) - 1;
                const day = parseInt(dateParts[3], 10);
                purchaseDate = new Date(gregorianYear, monthJs, day);
            }
        }

        if (purchaseDate && !isNaN(purchaseDate.getTime())) {
             purchaseDateFormatted = Utilities.formatDate(purchaseDate, "GMT+8", "yyyy/MM/dd");
             const monthsUsed = (now.getFullYear() - purchaseDate.getFullYear()) * 12 + (now.getMonth() - purchaseDate.getMonth());
             years = Math.floor(monthsUsed / 12);
             months = monthsUsed % 12;
        }

        const serialNumber = (index + 1).toString();
        const usefulLifeRaw = assetInfo.useLife;
        const usefulLife = !isNaN(parseInt(usefulLifeRaw)) ? parseInt(usefulLifeRaw).toString() : (usefulLifeRaw || '');
        const reasonCode = assetInfo.remarks || '';

        const rowData = [
          serialNumber,
          assetInfo.assetId.trim(),
          assetInfo.assetName,
          purchaseDateFormatted,
          usefulLife,
          `${years}/${months}`,
          reasonCode
        ];
        tableValues.push(rowData);
      }
    });

    const newTable = body.insertTable(insertIndex, tableValues);
    const headerRowStyle = {};
    headerRowStyle[DocumentApp.Attribute.BOLD] = true;
    newTable.getRow(0).setAttributes(headerRowStyle);

    newDoc.saveAndClose();
    const fileUrl = newFile.getUrl();

    assetsToScrap.forEach(asset => {
      const location = findAssetLocation(asset.assetId);
      if (location) {
        const indices = location.sheetName === PROPERTY_MASTER_SHEET_NAME ? PROPERTY_COLUMN_INDICES : ITEM_COLUMN_INDICES;
        location.sheet.getRange(location.rowIndex, indices.DOC_URL).setValue(fileUrl);
      }
    });

    Logger.log(`成功為 ${applicantName} 產生文件: ${fileUrl}`);
    return { fileUrl: fileUrl };

  } catch (e) {
    Logger.log(`createScrapDocForApplicant 失敗: ${e.message} at ${e.stack}`);
    throw new Error("產生報表文件時發生錯誤: " + e.message);
  }
}
