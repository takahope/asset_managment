/**
 * notify_templates.js — 保管人/使用人個人通知信範本（spec 2026-10-01）
 * 由 code.js 寄信點抽出的純函式；傳入全部 items 時輸出須與改版前逐字相同，
 * 傳入子集合（部分資產已改寄組別窗口）時筆數與清單同步縮減。
 */

/** 「  - {id}: {名稱}{suffix}\n」清單列 */
function notifyAssetLines_(items, suffix) {
  return items.map(it => `  - ${it.assetId}: ${it.assetName}${suffix || ''}\n`).join('');
}

/** 情況1（只變更使用人）：通知新使用人 */
function renderTransferUserOnlyNewUserMail_(ctx, items) {
  const subject = `[財產轉移通知] 您有 ${items.length} 筆待接收的財產（使用人變更）`;
  let body = `您好 ${ctx.newUserName}，\n\n${ctx.operatorEmail} 已申請將您設為 ${items.length} 筆財產的使用人。\n\n`;
  body += `財產清單：\n`;
  body += notifyAssetLines_(items);
  body += `\n請點擊下方連結，前往系統主頁的「審核儀表板」進行批次簽核：\n`;
  body += `${ctx.systemLink}\n\n此為系統自動發送郵件。`;
  return { subject, body };
}

/** 情況1：通知原保管人 */
function renderTransferUserOnlyOldKeeperMail_(ctx, items) {
  const subject = `[財產通知] 您保管的 ${items.length} 筆財產的使用人已變更`;
  let body = `您好，\n\n您保管的以下財產的使用人已變更：\n\n`;
  body += notifyAssetLines_(items, ` → 新使用人: ${ctx.newUserName}`);
  body += `\n此為系統自動發送郵件。`;
  return { subject, body };
}

/** 情況2（只變更保管人）：通知新保管人 */
function renderTransferKeeperOnlyNewKeeperMail_(ctx, items) {
  const subject = `[財產轉移通知] 您有 ${items.length} 筆待接收的財產（保管人變更）`;
  let body = `您好 ${ctx.newKeeperName}，\n\n${ctx.operatorEmail} 已申請將 ${items.length} 筆財產轉移給您保管。\n\n`;
  body += `財產清單：\n`;
  body += notifyAssetLines_(items);
  body += `\n請點擊下方連結，前往系統主頁的「審核儀表板」進行批次簽核：\n`;
  body += `${ctx.systemLink}\n\n此為系統自動發送郵件。`;
  return { subject, body };
}

/** 情況2：通知原使用人 */
function renderTransferKeeperOnlyOldUserMail_(ctx, items) {
  const subject = `[財產通知] 您使用的 ${items.length} 筆財產的保管人已變更`;
  let body = `您好，\n\n您使用的以下財產的保管人已變更：\n\n`;
  body += notifyAssetLines_(items, ` → 新保管人: ${ctx.newKeeperName}`);
  body += `\n此為系統自動發送郵件。`;
  return { subject, body };
}

/** 情況4（組合變更）：通知新保管人 */
function renderTransferComboNewKeeperMail_(ctx, items) {
  const subject = `[財產轉移通知] 您有 ${items.length} 筆待接收的財產（需審核）`;
  let body = `您好 ${ctx.newKeeperName}，\n\n${ctx.operatorEmail} 已申請將 ${items.length} 筆財產轉移給您保管。\n\n`;
  body += `轉移類型：${ctx.typeDescription}\n\n`;
  body += `財產清單：\n`;
  body += notifyAssetLines_(items);
  if (ctx.hasNewUser) {
    body += `\n新使用人：${ctx.newUserName}\n`;
  }
  body += `\n請點擊下方連結，前往系統主頁的「審核儀表板」進行批次簽核：\n`;
  body += `${ctx.systemLink}\n`;
  body += `\n⚠️ 提醒：此申請需要您或新使用人審核，任一方審核即可完成轉移。\n`;
  body += `\n此為系統自動發送郵件。`;
  return { subject, body };
}

/** 情況4：通知新使用人 */
function renderTransferComboNewUserMail_(ctx, items) {
  const subject = `[財產轉移通知] 您有 ${items.length} 筆待接收的財產（需審核）`;
  let body = `您好 ${ctx.newUserName}，\n\n${ctx.operatorEmail} 已申請將 ${items.length} 筆財產轉移給您使用。\n\n`;
  body += `轉移類型：${ctx.typeDescription}\n\n`;
  body += `財產清單：\n`;
  body += notifyAssetLines_(items);
  if (ctx.hasNewKeeper) {
    body += `\n新保管人：${ctx.newKeeperName}\n`;
  }
  body += `\n請點擊下方連結，前往系統主頁的「審核儀表板」進行批次簽核：\n`;
  body += `${ctx.systemLink}\n`;
  body += `\n⚠️ 提醒：此申請需要您或新保管人審核，任一方審核即可完成轉移。\n`;
  body += `\n此為系統自動發送郵件。`;
  return { subject, body };
}

/** 情況4：通知原保管人 */
function renderTransferComboOldKeeperMail_(ctx, items) {
  const subject = `[財產通知] 您保管的 ${items.length} 筆財產已申請轉出`;
  let body = `您好 ${ctx.oldKeeperName}，\n\n${ctx.operatorEmail} 已申請將您保管的以下財產轉移給新保管人。\n\n`;
  body += `財產清單：\n`;
  body += notifyAssetLines_(items);
  body += `\n新保管人：${ctx.newKeeperName}\n`;
  if (ctx.hasNewUser) {
    body += `新使用人：${ctx.newUserName}\n`;
  }
  body += `\n此申請正在等待新保管人或新使用人審核中（任一方審核即可完成）。\n`;
  body += `\n此為系統自動發送郵件。`;
  return { subject, body };
}

/** 情況4：通知原使用人 */
function renderTransferComboOldUserMail_(ctx, items) {
  const subject = `[財產通知] 您使用的 ${items.length} 筆財產的使用人已變更`;
  let body = `您好 ${ctx.oldUserName}，\n\n${ctx.operatorEmail} 已申請變更以下財產的使用人。\n\n`;
  body += `財產清單：\n`;
  body += notifyAssetLines_(items);
  body += `\n新使用人：${ctx.newUserName}\n`;
  if (ctx.hasNewKeeper) {
    body += `新保管人：${ctx.newKeeperName}\n`;
  }
  body += `\n此申請正在等待新保管人或新使用人審核中（任一方審核即可完成）。\n`;
  body += `\n此為系統自動發送郵件。`;
  return { subject, body };
}

/** 審核完成：通知另一方審核者 */
function renderApprovalOtherReviewerMail_(ctx) {
  const subject = `[財產通知] 您的待審核申請已由其他審核者完成`;
  let body = `您好 ${ctx.otherReviewerName}，\n\n`;
  body += `您收到的財產轉移審核申請（申請ID: ${ctx.appId}）已由 ${ctx.approverName} 完成審核。\n\n`;
  body += `資產編號：${ctx.assetId}\n`;
  body += `新保管人：${ctx.newKeeperName}\n`;
  body += `新使用人：${ctx.newUserName}\n`;
  body += `審核時間：${ctx.reviewTime}\n\n`;
  body += `此申請已完成，您無需再進行審核。\n\n`;
  body += `此為系統自動發送郵件。`;
  return { subject, body };
}

/** 審核完成：通知原申請人 */
function renderApprovalApplicantMail_(ctx) {
  const subject = `[財產轉移通知] 您的轉移申請已審核完成`;
  let body = `您好 ${ctx.applicantName}，\n\n`;
  body += `您提交的財產轉移申請（申請ID: ${ctx.appId}）已審核完成。\n\n`;
  body += `資產編號：${ctx.assetId}\n`;
  body += `新保管人：${ctx.newKeeperName}\n`;
  if (ctx.newUserName && String(ctx.newUserName).trim() !== '') {
    body += `新使用人：${ctx.newUserName}\n`;
  }
  body += `審核時間：${ctx.reviewTime}\n\n`;
  body += `請點擊下方連結，前往系統主頁列印轉移申請單：\n`;
  body += `${ctx.systemLink}\n\n`;
  body += `此為系統自動發送郵件。`;
  return { subject, body };
}

/** 同組代辦報廢：通知原保管人 */
function renderScrapProxyKeeperMail_(ctx, items) {
  const subject = `[資產管理通知] 同組同仁 ${ctx.applicantName} 已代您提交 ${items.length} 筆資產報廢申請`;
  let body = `您好 ${ctx.keeperName}，\n\n`;
  body += `同組同仁 ${ctx.applicantName} (${ctx.applicantEmail}) 已代您提交了 ${items.length} 筆由您保管的資產報廢申請：\n\n`;
  items.forEach(a => {
    body += `  📦 ${a.assetId} - ${a.assetName}\n`;
    body += `     地點：${a.location} | 類別：${a.category}\n\n`;
  });
  body += `📋 報廢原因：${ctx.pureReason}\n`;
  body += `👤 申請方式：同組代辦 (代辦人: ${ctx.applicantName})\n\n`;
  body += `若您對此申請有任何疑義，請儘速與同組同仁 (${ctx.applicantName}) 或資產管理窗口聯繫確認。\n\n`;
  body += `此為系統自動發送郵件。`;
  return { subject, body };
}
