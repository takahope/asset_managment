// 主頁面 Tailwind 設定:掃描舊頁(遷移期間 class 詞彙的母集)、Alpine 新頁與 partial、include 局部檔。
// 原本使用 Play CDN(無自訂 config),故沿用預設 theme、preflight 開啟以維持視覺一致。
// Alpine 版 class 字串照抄舊頁 markup,故產出的 CSS 天然覆蓋新頁;舊頁退場(Phase 7)後再移除該行。
module.exports = {
  content: [
    './userstate.html',
    './userstate_alpine.html',
    './alpine_*.html',
    './copilot_chat.html',
    './batch_processing_list.html',
    './progress_bar_fly.html',
    './toast_progress.html',
    './selectbyqr.html',
  ],
};
