/**
 * copilot.js — 智慧導覽助理 (Copilot) 後端（支援多供應商 AI 入口）
 *
 * 透過 UrlFetchApp 呼叫 AI 供應商（Google Gemini / OpenAI / NVIDIA NIM）取得回覆，
 * 以 knowledge_base.js 的 SYSTEM_PROMPT_MANUAL 作為 system prompt，
 * 回答使用者的系統操作問題。前端以 google.script.run.askCopilot() 呼叫。
 *
 * 【設定】Apps Script 專案設定 → 指令碼屬性 (Script Properties)：
 *   GEMINI_API_KEY  （provider=GEMINI 時必填）Google AI Studio 申請的金鑰
 *   GEMINI_MODEL    （選填）Gemini 模型名稱，預設 gemini-2.5-flash
 *   OPENAI_API_KEY  （provider=OPENAI 時必填）platform.openai.com 申請的金鑰
 *   OPENAI_MODEL_ID （選填）OpenAI 模型名稱，預設 gpt-4o-mini
 *   NVIDIA_API_KEY  （provider=NVIDIA 時必填）build.nvidia.com (NIM) 申請的金鑰
 *   NVIDIA_MODEL_ID （選填）NVIDIA NIM 模型名稱，預設 meta/llama-3.1-70b-instruct
 *   AI_PROVIDER     （選填）GEMINI / OPENAI / NVIDIA，預設 GEMINI
 *   COPILOT_ENABLED （選填）'false' 才停用，其餘（含未設定）視為啟用
 *
 *   以上金鑰皆不透過前端設定介面輸入，需由管理員手動在此新增，避免機密經前端表單傳輸。
 *   【設計決策】本檔案的所有設定（含啟用開關）一律使用 PropertiesService，
 *   不比照 code.js 的 isInventoryFeatureEnabled() 等寫入「管理員名單」工作表儲存格的慣例。
 *   原因：(1) GEMINI_API_KEY/GEMINI_MODEL 本來就已經是 PropertiesService，避免同一功能
 *   設定分裂在兩套儲存機制；(2) getCopilotSettings() 會被每位使用者、每次頁面載入呼叫
 *   （用來決定 FAB 是否顯示），PropertiesService 讀取比開試算表讀儲存格更輕量。
 *   請勿為了「統一慣例」把這裡改成寫入工作表。
 *
 * 【首次導入】clasp push 後，在編輯器執行一次 authorizeCopilot() 完成
 *   UrlFetchApp（script.external_request）授權，再 clasp deploy 更新部署。
 */

// 預設模型：使用穩定版，避免易失效的 preview / 1.5 模型造成 HTTP 404
const COPILOT_DEFAULT_MODEL = 'gemini-2.5-flash';
const COPILOT_DEFAULT_OPENAI_MODEL = 'gpt-4o-mini';
const COPILOT_DEFAULT_NVIDIA_MODEL = 'meta/llama-3.1-70b-instruct';
const COPILOT_SUPPORTED_PROVIDERS = ['GEMINI', 'OPENAI', 'NVIDIA'];
// 使用者單則訊息長度上限（字），避免濫用與超量
const COPILOT_MAX_INPUT_LENGTH = 1000;
// 常見問答快取秒數（6 小時）；相同問題直接回快取，降低成本與延遲
const COPILOT_CACHE_TTL_SECONDS = 21600;

/**
 * 取得智慧導覽助理設定。前端可讀，故意不做管理員權限檢查——
 * copilot_chat.html 的 FAB 需要對「所有使用者」可讀以判斷是否顯示，
 * AI 設定 modal 也用同一支取得初始值。不回傳任何 API Key。
 * 請勿在此加上 checkAdminPermissions() 守衛，否則一般使用者的 FAB 會全部消失。
 * @returns {{enabled:boolean, provider:string, geminiModelId:string, openaiModelId:string, nvidiaModelId:string}}
 */
function getCopilotSettings() {
  const props = PropertiesService.getScriptProperties();
  const provider = props.getProperty('AI_PROVIDER') || 'GEMINI';
  return {
    enabled: props.getProperty('COPILOT_ENABLED') !== 'false', // 未設定 = 開啟，向後相容現行行為
    provider: COPILOT_SUPPORTED_PROVIDERS.indexOf(provider) !== -1 ? provider : 'GEMINI',
    geminiModelId: props.getProperty('GEMINI_MODEL') || COPILOT_DEFAULT_MODEL,
    openaiModelId: props.getProperty('OPENAI_MODEL_ID') || COPILOT_DEFAULT_OPENAI_MODEL,
    nvidiaModelId: props.getProperty('NVIDIA_MODEL_ID') || COPILOT_DEFAULT_NVIDIA_MODEL
  };
}

/**
 * 儲存智慧導覽助理設定（管理員專用）。
 * 比照 code.js 的 saveSystemSettings() 權限守衛慣例。
 * @param {{enabled?:boolean, provider?:string, geminiModelId?:string, openaiModelId?:string, nvidiaModelId?:string}} settings
 * @returns {{success:boolean}}
 */
function saveCopilotSettings(settings) {
  if (!checkAdminPermissions()) {
    throw new Error('權限不足：僅管理員可變更智慧導覽助理設定。');
  }
  const props = PropertiesService.getScriptProperties();
  const s = settings || {};
  if (s.enabled !== undefined) {
    props.setProperty('COPILOT_ENABLED', String(!!s.enabled));
  }
  if (s.provider !== undefined) {
    const p = String(s.provider).toUpperCase();
    if (COPILOT_SUPPORTED_PROVIDERS.indexOf(p) === -1) {
      throw new Error('不支援的 AI 供應商：' + s.provider);
    }
    props.setProperty('AI_PROVIDER', p);
  }
  if (s.geminiModelId !== undefined) props.setProperty('GEMINI_MODEL', String(s.geminiModelId).trim());
  if (s.openaiModelId !== undefined) props.setProperty('OPENAI_MODEL_ID', String(s.openaiModelId).trim());
  if (s.nvidiaModelId !== undefined) props.setProperty('NVIDIA_MODEL_ID', String(s.nvidiaModelId).trim());
  return { success: true };
}

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

    // 2. 讀取設定：是否啟用、目前供應商與對應模型
    const settings = getCopilotSettings();
    if (!settings.enabled) {
      return { ok: false, error: '智慧導覽助理目前已停用，請聯絡管理員。' };
    }

    const providerKeyMap = { GEMINI: 'GEMINI_API_KEY', OPENAI: 'OPENAI_API_KEY', NVIDIA: 'NVIDIA_API_KEY' };
    const providerModelMap = { GEMINI: settings.geminiModelId, OPENAI: settings.openaiModelId, NVIDIA: settings.nvidiaModelId };
    const provider = settings.provider;
    const model = providerModelMap[provider];
    const apiKey = PropertiesService.getScriptProperties().getProperty(providerKeyMap[provider]);
    if (!apiKey) {
      Logger.log('Copilot：缺少 ' + providerKeyMap[provider] + '（provider=' + provider + '）。');
      return { ok: false, error: '系統尚未設定 AI 功能，請聯絡管理員。' };
    }

    // 3. 命中快取直接回（以供應商+模型+問題內容雜湊為 key，換供應商/模型會讓快取自然失效）
    const cache = CacheService.getScriptCache();
    const cacheKey = 'copilot_' + _copilotHash(provider + '|' + model + '|' + message);
    const cached = cache.get(cacheKey);
    if (cached) {
      return { ok: true, reply: cached };
    }

    // 4. 依供應商呼叫對應 AI 服務
    let result;
    if (provider === 'OPENAI') {
      result = _callOpenAI(apiKey, model, message);
    } else if (provider === 'NVIDIA') {
      result = _callNvidia(apiKey, model, message);
    } else {
      result = _callGemini(apiKey, model, message);
    }
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
 * 呼叫 OpenAI 相容的 chat/completions API（OpenAI 本身與 NVIDIA NIM 皆採此 schema）。
 * @return {{ok: boolean, reply?: string, error?: string}}
 */
function _callOpenAiCompatible_(endpoint, apiKey, model, message, providerLabel) {
  const payload = {
    model: model,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT_MANUAL },
      { role: 'user', content: message }
    ],
    temperature: 0.3,
    max_tokens: 1024
  };

  let response;
  try {
    response = UrlFetchApp.fetch(endpoint, {
      method: 'post',
      contentType: 'application/json',
      headers: { Authorization: 'Bearer ' + apiKey },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    });
  } catch (e) {
    Logger.log('Copilot(' + providerLabel + ') UrlFetchApp 失敗：' + e.message);
    const msg = String(e.message || '');
    if (msg.indexOf('script.external_request') !== -1 || msg.indexOf('UrlFetchApp') !== -1) {
      return { ok: false, error: 'AI 服務尚未完成授權，請管理員在 Apps Script 執行一次 authorizeCopilot() 後重新部署。' };
    }
    return { ok: false, error: '連線 AI 服務失敗，請稍後再試。' };
  }

  const code = response.getResponseCode();
  const body = response.getContentText();

  if (code !== 200) {
    Logger.log('Copilot(' + providerLabel + ') 非 200：code=' + code + ' detail=' + body);
    if (code === 400) {
      return { ok: false, error: 'AI 服務設定有誤（可能是模型名稱不正確），請聯絡管理員。' };
    }
    if (code === 401 || code === 403) {
      return { ok: false, error: 'AI 金鑰權限不足或已失效，請聯絡管理員。' };
    }
    if (code === 404) {
      return { ok: false, error: 'AI 模型設定有誤，請聯絡管理員確認 Model ID 設定。' };
    }
    if (code === 429) {
      return { ok: false, error: '目前詢問人數較多，請稍後再試。' };
    }
    return { ok: false, error: 'AI 服務暫時無法使用，請稍後再試。' };
  }

  let data;
  try {
    data = JSON.parse(body);
  } catch (e) {
    Logger.log('Copilot(' + providerLabel + ') 回應 JSON 解析失敗：' + body);
    return { ok: false, error: 'AI 回應解析失敗，請稍後再試。' };
  }

  const text = data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
  if (!text || !String(text).trim()) {
    Logger.log('Copilot(' + providerLabel + ') 無有效回覆內容。');
    return { ok: false, error: '抱歉，我這次沒有產生有效回覆，請換個方式再問一次。' };
  }

  return { ok: true, reply: String(text).trim() };
}

function _callOpenAI(apiKey, model, message) {
  return _callOpenAiCompatible_('https://api.openai.com/v1/chat/completions', apiKey, model, message, 'OpenAI');
}

function _callNvidia(apiKey, model, message) {
  return _callOpenAiCompatible_('https://integrate.api.nvidia.com/v1/chat/completions', apiKey, model, message, 'NVIDIA');
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
 * - 已授權時：對「目前設定的供應商」做一次最小測試請求，確認金鑰與模型可正常呼叫 AI。
 */
function authorizeCopilot() {
  const authInfo = ScriptApp.getAuthorizationInfo(ScriptApp.AuthMode.FULL);
  if (authInfo.getAuthorizationStatus() === ScriptApp.AuthorizationStatus.REQUIRED) {
    const url = authInfo.getAuthorizationUrl();
    Logger.log('尚未授權，請開啟以下網址完成授權後，再執行一次 authorizeCopilot()：\n' + url);
    return '尚未授權，請開啟此網址完成授權後再執行一次：' + url;
  }

  const settings = getCopilotSettings();
  const providerKeyMap = { GEMINI: 'GEMINI_API_KEY', OPENAI: 'OPENAI_API_KEY', NVIDIA: 'NVIDIA_API_KEY' };
  const requiredKey = providerKeyMap[settings.provider];
  const apiKey = PropertiesService.getScriptProperties().getProperty(requiredKey);
  if (!apiKey) {
    return '授權狀態正常，但目前供應商（' + settings.provider + '）尚未設定 ' + requiredKey + '，請先到「專案設定 → 指令碼屬性」新增金鑰。';
  }

  const test = askCopilot('請只回覆「授權成功」四個字。');
  Logger.log('authorizeCopilot 測試結果（provider=' + settings.provider + '）：' + JSON.stringify(test));
  return test.ok
    ? ('授權與金鑰皆正常（供應商：' + settings.provider + '），AI 回覆：' + test.reply)
    : ('授權正常，但 AI 呼叫失敗（供應商：' + settings.provider + '）：' + test.error);
}
