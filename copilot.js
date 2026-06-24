/**
 * copilot.js — 智慧導覽助理 (Copilot) 後端（單一 AI 入口）
 *
 * 透過 UrlFetchApp 呼叫 Google Gemini（AI Studio）的 generateContent，
 * 以 knowledge_base.js 的 SYSTEM_PROMPT_MANUAL 作為 system instruction，
 * 回答使用者的系統操作問題。前端以 google.script.run.askCopilot() 呼叫。
 *
 * 【設定】Apps Script 專案設定 → 指令碼屬性 (Script Properties)：
 *   GEMINI_API_KEY （必填）Google AI Studio 申請的金鑰
 *   GEMINI_MODEL   （選填）模型名稱，預設 gemini-2.5-flash
 *
 * 【首次導入】clasp push 後，在編輯器執行一次 authorizeCopilot() 完成
 *   UrlFetchApp（script.external_request）授權，再 clasp deploy 更新部署。
 */

// 預設模型：使用穩定版，避免易失效的 preview / 1.5 模型造成 HTTP 404
const COPILOT_DEFAULT_MODEL = 'gemini-2.5-flash';
// 使用者單則訊息長度上限（字），避免濫用與超量
const COPILOT_MAX_INPUT_LENGTH = 1000;
// 常見問答快取秒數（6 小時）；相同問題直接回快取，降低成本與延遲
const COPILOT_CACHE_TTL_SECONDS = 21600;

/**
 * 前端入口：詢問 Copilot。
 * @param {string} userMessage 使用者輸入的問題
 * @return {{ok: boolean, reply?: string, error?: string}}
 */
function askCopilot(userMessage) {
  try {
    // 1. 基本輸入驗證
    const message = (userMessage == null) ? '' : String(userMessage).trim();
    if (!message) {
      return { ok: false, error: '請先輸入您的問題。' };
    }
    if (message.length > COPILOT_MAX_INPUT_LENGTH) {
      return { ok: false, error: '問題太長了，請精簡到 ' + COPILOT_MAX_INPUT_LENGTH + ' 字以內再試一次。' };
    }

    // 2. 取得 API 金鑰
    const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
    if (!apiKey) {
      Logger.log('Copilot：缺少 GEMINI_API_KEY。');
      return { ok: false, error: '系統尚未設定 AI 功能，請聯絡管理員。' };
    }

    // 3. 命中快取直接回（以問題內容雜湊為 key）
    const cache = CacheService.getScriptCache();
    const cacheKey = 'copilot_' + _copilotHash(message);
    const cached = cache.get(cacheKey);
    if (cached) {
      return { ok: true, reply: cached };
    }

    // 4. 呼叫 Gemini
    const model = PropertiesService.getScriptProperties().getProperty('GEMINI_MODEL') || COPILOT_DEFAULT_MODEL;
    const result = _callGemini(apiKey, model, message);
    if (!result.ok) {
      return result; // 已是 user-safe 錯誤訊息
    }

    // 5. 寫入快取並回傳
    cache.put(cacheKey, result.reply, COPILOT_CACHE_TTL_SECONDS);
    return { ok: true, reply: result.reply };

  } catch (e) {
    Logger.log('askCopilot 未預期錯誤：' + e.message + ' @ ' + e.stack);
    return { ok: false, error: '抱歉，AI 服務暫時發生問題，請稍後再試。' };
  }
}

/**
 * 實際呼叫 Gemini AI Studio 的 generateContent。
 * @return {{ok: boolean, reply?: string, error?: string}}
 */
function _callGemini(apiKey, model, message) {
  const endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/'
    + encodeURIComponent(model) + ':generateContent?key=' + encodeURIComponent(apiKey);

  const payload = {
    system_instruction: {
      parts: [{ text: SYSTEM_PROMPT_MANUAL }]
    },
    contents: [
      { role: 'user', parts: [{ text: message }] }
    ],
    generationConfig: {
      temperature: 0.3,
      topP: 0.9,
      maxOutputTokens: 1024,
      // 關閉「思考」：此導覽問答不需推理，可加快回應並避免思考吃光輸出額度導致空回覆。
      // 註：僅 gemini-2.5-flash 等支援關閉；若改用不支援的模型，請移除此行並調高 maxOutputTokens。
      thinkingConfig: { thinkingBudget: 0 }
    }
  };

  let response;
  try {
    response = UrlFetchApp.fetch(endpoint, {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    });
  } catch (e) {
    // 多半是 manifest 缺 script.external_request 或尚未重新授權
    Logger.log('Copilot UrlFetchApp 失敗：' + e.message);
    const msg = String(e.message || '');
    if (msg.indexOf('script.external_request') !== -1 || msg.indexOf('UrlFetchApp') !== -1) {
      return { ok: false, error: 'AI 服務尚未完成授權，請管理員在 Apps Script 執行一次 authorizeCopilot() 後重新部署。' };
    }
    return { ok: false, error: '連線 AI 服務失敗，請稍後再試。' };
  }

  const code = response.getResponseCode();
  const body = response.getContentText();

  if (code !== 200) {
    Logger.log('Copilot Gemini 非 200：code=' + code + ' detail=' + body);
    if (code === 400) {
      return { ok: false, error: 'AI 服務設定有誤（可能是金鑰或模型名稱不正確），請聯絡管理員。' };
    }
    if (code === 403) {
      return { ok: false, error: 'AI 金鑰權限不足或已失效，請聯絡管理員。' };
    }
    if (code === 404) {
      return { ok: false, error: 'AI 模型設定有誤，請聯絡管理員確認 GEMINI_MODEL 設定。' };
    }
    if (code === 429) {
      return { ok: false, error: '目前詢問人數較多，請稍後再試。' };
    }
    return { ok: false, error: 'AI 服務暫時無法使用，請稍後再試。' };
  }

  // 解析回應
  let data;
  try {
    data = JSON.parse(body);
  } catch (e) {
    Logger.log('Copilot 回應 JSON 解析失敗：' + body);
    return { ok: false, error: 'AI 回應解析失敗，請稍後再試。' };
  }

  // safety / policy block：沒有 candidates
  const candidate = data && data.candidates && data.candidates[0];
  if (!candidate) {
    const blockReason = data && data.promptFeedback && data.promptFeedback.blockReason;
    Logger.log('Copilot 無 candidate，blockReason=' + blockReason);
    return { ok: false, error: '這個問題我無法回答，請換個方式詢問，或詢問與系統操作相關的問題。' };
  }

  const parts = candidate.content && candidate.content.parts;
  const text = parts && parts.map(function (p) { return p.text || ''; }).join('').trim();
  if (!text) {
    Logger.log('Copilot candidate 無文字，finishReason=' + candidate.finishReason);
    return { ok: false, error: '抱歉，我這次沒有產生有效回覆，請換個方式再問一次。' };
  }

  return { ok: true, reply: text };
}

/**
 * 簡單字串雜湊（給快取 key 用，非加密用途）。
 */
function _copilotHash(str) {
  const bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, str, Utilities.Charset.UTF_8);
  return bytes.map(function (b) {
    return ('0' + (b & 0xff).toString(16)).slice(-2);
  }).join('');
}

/**
 * 授權 helper：請在 Apps Script 編輯器手動執行一次。
 * 用途是讓「外部請求 (UrlFetchApp / script.external_request)」這個權限被授權。
 * - 未授權時：回傳授權網址，請開啟後完成授權，再執行一次本函式。
 * - 已授權時：做一次最小測試請求，確認金鑰與模型可正常呼叫 AI。
 */
function authorizeCopilot() {
  const authInfo = ScriptApp.getAuthorizationInfo(ScriptApp.AuthMode.FULL);
  if (authInfo.getAuthorizationStatus() === ScriptApp.AuthorizationStatus.REQUIRED) {
    const url = authInfo.getAuthorizationUrl();
    Logger.log('尚未授權，請開啟以下網址完成授權後，再執行一次 authorizeCopilot()：\n' + url);
    return '尚未授權，請開啟此網址完成授權後再執行一次：' + url;
  }

  const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
  if (!apiKey) {
    return '授權狀態正常，但尚未設定 GEMINI_API_KEY，請先到「專案設定 → 指令碼屬性」新增金鑰。';
  }

  const test = askCopilot('請只回覆「授權成功」四個字。');
  Logger.log('authorizeCopilot 測試結果：' + JSON.stringify(test));
  return test.ok
    ? ('授權與金鑰皆正常，AI 回覆：' + test.reply)
    : ('授權正常，但 AI 呼叫失敗：' + test.error);
}
