// =================================================================
// --- 財產管理系統 - 主入口文件 ---
// =================================================================
//
// 此文件為 Google Apps Script 財產管理系統的主入口點
//
// 模組架構：
// - config.js: 全域配置和常量定義
// - dataLayer.js: 資料抽象層（getAllAssets, findAssetLocation, mapRowToAssetObject）
// - uiHandlers.js: UI 選單和 Web 路由處理（onOpen, doGet 等）
// - transferWorkflow.js: 資產轉移工作流程
// - lendingWorkflow.js: 資產借出/歸還工作流程
// - scrapWorkflow.js: 資產報廢工作流程
// - adminFunctions.js: 管理員權限和功能
// - computerReport.js: 電腦狀態回報功能
//
// 注意：Google Apps Script 會自動載入所有 .gs 文件
//      本文件主要用於文檔和潛在的初始化邏輯
// =================================================================

/**
 * 系統版本資訊
 */
const SYSTEM_VERSION = "3.0.0";
const SYSTEM_NAME = "財產管理系統";

/**
 * 系統初始化函數（可選）
 * 可用於執行一次性設置或檢查
 */
function initializeSystem() {
  Logger.log(`${SYSTEM_NAME} v${SYSTEM_VERSION} 已載入`);
  Logger.log("模組已拆分為多個文件，提高可維護性");
}

/**
 * 獲取系統資訊
 * @returns {object} 系統版本和模組資訊
 */
function getSystemInfo() {
  return {
    name: SYSTEM_NAME,
    version: SYSTEM_VERSION,
    modules: [
      "config.js - 全域配置",
      "dataLayer.js - 資料抽象層",
      "uiHandlers.js - UI 處理",
      "transferWorkflow.js - 轉移工作流",
      "lendingWorkflow.js - 借出/歸還工作流",
      "scrapWorkflow.js - 報廢工作流",
      "adminFunctions.js - 管理功能",
      "computerReport.js - 電腦報告"
    ],
    description: "Google Apps Script 資產管理系統 - 模組化重構版本"
  };
}

// =================================================================
// 注意：所有功能函數已拆分到各自的模組文件中
//
// 入口函數：
// - onOpen() -> uiHandlers.js
// - doGet(e) -> uiHandlers.js
//
// 資料處理：
// - getAllAssets() -> dataLayer.js
// - findAssetLocation() -> dataLayer.js
//
// 工作流程：
// - 轉移相關 -> transferWorkflow.js
// - 借出/歸還 -> lendingWorkflow.js
// - 報廢相關 -> scrapWorkflow.js
//
// 管理功能：
// - 權限檢查 -> adminFunctions.js
// - 電腦報告 -> computerReport.js
// =================================================================
