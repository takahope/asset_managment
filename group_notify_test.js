/**
 * group_notify_test.js — 「只通知組別窗口」單元測試（spec 2026-10-01）
 * GAS 編輯器可直接執行；Node 由 scripts/test_group_notify.mjs 以 vm 載入同一份。
 * 所有外部依賴皆以參數注入，不讀 Script Properties、不實際寄信。
 */

function createNotifyTestReporter_() {
  const failures = [];
  let passed = 0;
  return {
    ok: function (title, condition) {
      if (condition) passed++;
      else failures.push(title);
    },
    eq: function (title, actual, expected) {
      if (actual === expected) { passed++; return; }
      failures.push(`${title}\n  expected: ${JSON.stringify(expected)}\n  actual:   ${JSON.stringify(actual)}`);
    },
    throws: function (title, fn, expectedMessage) {
      try {
        fn();
        failures.push(`${title}：未拋出錯誤`);
      } catch (e) {
        if (String(e.message) === expectedMessage) passed++;
        else failures.push(`${title}：錯誤訊息不符 ${JSON.stringify(e.message)}`);
      }
    },
    result: function (suite) {
      Logger.log(`=== ${suite}：通過 ${passed}，失敗 ${failures.length} ===`);
      failures.forEach(f => Logger.log('❌ ' + f));
      return { passed: passed, failed: failures.length, failures: failures };
    }
  };
}

function testGroupNotifyRouting_() {
  const t = createNotifyTestReporter_();
  const canon = function (g) {
    const s = String(g || '').trim();
    return ({ '實驗室組': '實驗組' })[s] || s;
  };
  const directory = {
    emailToGroup: { 'wang@x.com': 'A組', 'chen@x.com': 'C組', 'lee@x.com': 'C組' },
    emailToName: { 'wang@x.com': '王小明', 'chen@x.com': '陳大華', 'lin@x.com': '林窗口', 'awin@x.com': 'A窗口', 'cwin@x.com': 'C窗口', 'op@x.com': '操作者' },
    groupToMembers: {}
  };
  const contactsOf = function (obj) { return parseGroupNotifyContacts_(JSON.stringify(obj), canon); };
  const item = function (assetId, aeValue, kind) {
    return { assetId: assetId, assetName: 'N' + assetId, aeValue: aeValue, kind: kind, windowLine: assetId + ' ' + kind + ' line' };
  };
  const entry = function (email, label, items) {
    return {
      email: email,
      items: items,
      render: function (list) {
        return { subject: label + ' ' + list.length + ' 筆', body: list.map(function (i) { return i.assetId; }).join(',') };
      }
    };
  };
  const run = function (entries, overrides) {
    const sent = [];
    const opts = {
      event: 'transferApply', operatorEmail: 'op@x.com', appUrl: 'https://app',
      userMailEnabled: true, enabled: true, directory: directory, canonicalize: canon, contacts: {},
      sendMail: function (to, subject, body) { sent.push({ to: to, subject: subject, body: body }); }
    };
    Object.keys(overrides || {}).forEach(function (k) { opts[k] = overrides[k]; });
    const collector = createMailCollector_(opts);
    entries.forEach(function (e) { collector.add(e); });
    return { sent: sent, summary: collector.flush() };
  };
  const tos = function (sent) { return sent.map(function (m) { return m.to; }).join('|'); };

  // 案例 1：開關關閉 → 照舊寄本人，render 收到全部 items
  {
    const r = run([
      entry('chen@x.com', '審核', [item('P1', 'B組', 'approve'), item('P2', '', 'approve')]),
      entry('wang@x.com', '知會', [item('P1', 'B組', 'notice')])
    ], { enabled: false, contacts: contactsOf({ 'B組': 'lin@x.com' }) });
    t.eq('1-1 開關關閉：收件人為本人', tos(r.sent), 'chen@x.com|wang@x.com');
    t.eq('1-2 開關關閉：render 收到全部 items', r.sent[0].subject + '/' + r.sent[0].body, '審核 2 筆/P1,P2');
    t.eq('1-3 開關關閉：無窗口信', r.summary.windowCount, 0);
    t.eq('1-4 開關關閉：無改寄提示', formatRoutedNote_(r.summary), '');
  }

  // 案例 2：例 1 — AE = B組 且有窗口 → 新方與舊方皆入 B組窗口
  {
    const r = run([
      entry('chen@x.com', '審核', [item('P1', 'B組', 'approve')]),
      entry('wang@x.com', '知會', [item('P1', 'B組', 'notice')])
    ], { contacts: contactsOf({ 'B組': 'lin@x.com' }) });
    t.eq('2-1 例1：只寄 B組窗口一封', tos(r.sent), 'lin@x.com');
    t.eq('2-2 例1：主旨', r.sent[0].subject, '[組別窗口通知][B組] 財產轉移申請：1 筆（其中 1 筆待接收審核）');
    t.eq('2-3 例1：內文', r.sent[0].body,
      '您好 林窗口，\n\n' +
      '您是「B組」的組別通知窗口。依系統設定，以下原本寄給組內同仁的通知改由您統一接收，請視需要轉知相關同仁。\n\n' +
      '操作者：操作者 (op@x.com)\n\n' +
      '【待接收審核】請轉知下列人員至「審核儀表板」接收：\n  - P1 approve line\n\n' +
      '【知會】\n  - P1 notice line\n\n' +
      '系統連結：https://app\n\n' +
      '此為系統自動發送郵件。');
    t.eq('2-4 例1：本人信 0 封', r.summary.personalCount, 0);
    t.eq('2-5 例1：改寄提示', formatRoutedNote_(r.summary), '（通知已依設定改寄：B組窗口）');
  }

  // 案例 3：例 2 — AE 空白 → 依各收件人 HR 組別
  {
    const r = run([
      entry('chen@x.com', '審核', [item('P1', '', 'approve')]),
      entry('wang@x.com', '知會', [item('P1', '', 'notice')])
    ], { contacts: contactsOf({ 'A組': 'awin@x.com', 'C組': 'cwin@x.com' }) });
    t.eq('3-1 例2：新方寄 C組、舊方寄 A組', tos(r.sent), 'cwin@x.com|awin@x.com');
    t.eq('3-2 例2：C組主旨', r.sent[0].subject, '[組別窗口通知][C組] 財產轉移申請：1 筆（其中 1 筆待接收審核）');
    t.eq('3-3 例2：A組主旨（無待審核）', r.sent[1].subject, '[組別窗口通知][A組] 財產轉移申請：1 筆');
  }

  // 案例 4：例 3 — 同批混合，本人信只含剩餘資產
  {
    const r = run([
      entry('chen@x.com', '審核', [item('P1', 'B組', 'approve'), item('P2', 'B組', 'approve'), item('P3', '', 'approve')])
    ], { contacts: contactsOf({ 'B組': 'lin@x.com' }) });
    t.eq('4-1 例3：本人與 B組窗口各一封', tos(r.sent), 'chen@x.com|lin@x.com');
    t.eq('4-2 例3：本人信只含剩餘 1 筆', r.sent[0].subject + '/' + r.sent[0].body, '審核 1 筆/P3');
    t.eq('4-3 例3：窗口主旨 2 筆', r.sent[1].subject, '[組別窗口通知][B組] 財產轉移申請：2 筆（其中 2 筆待接收審核）');
  }

  // 案例 5：該組未設窗口 / 查無組別 → 寄本人
  {
    const r = run([entry('wang@x.com', '知會', [item('P1', '', 'notice')])], { contacts: contactsOf({ 'C組': 'cwin@x.com' }) });
    t.eq('5-1 未設窗口：寄本人', tos(r.sent), 'wang@x.com');
    t.eq('5-2 未設窗口：無改寄提示', formatRoutedNote_(r.summary), '');
    const r2 = run([entry('nobody@x.com', '知會', [item('P1', '', 'notice')])], { contacts: contactsOf({ 'C組': 'cwin@x.com' }) });
    t.eq('5-3 查無組別：寄本人', tos(r2.sent), 'nobody@x.com');
  }

  // 案例 6：窗口為操作者（大小寫混用）
  {
    const r1 = run([entry('chen@x.com', '審核', [item('P1', 'B組', 'approve')])],
      { operatorEmail: 'Op@X.com', contacts: contactsOf({ 'B組': 'OP@x.com, lin@x.com' }) });
    t.eq('6-1 窗口含操作者（大小寫不同）：只寄其他窗口', tos(r1.sent), 'lin@x.com');
    const r2 = run([entry('chen@x.com', '審核', [item('P1', 'B組', 'approve')])], { contacts: contactsOf({ 'B組': 'op@x.com' }) });
    t.eq('6-2 唯一窗口為操作者：不寄任何人', r2.sent.length, 0);
    t.eq('6-3 唯一窗口為操作者：仍視為已改寄', formatRoutedNote_(r2.summary), '（通知已依設定改寄：B組窗口）');
  }

  // 案例 7：一組多窗口（全形逗號分隔）
  {
    const r = run([entry('chen@x.com', '審核', [item('P1', 'B組', 'approve')])], { contacts: contactsOf({ 'B組': 'lin@x.com，hub@x.com' }) });
    t.eq('7-1 一組多窗口：每位皆收', tos(r.sent), 'lin@x.com|hub@x.com');
  }

  // 案例 8：一窗口跨多組 → 一封、組名串接
  {
    const r = run([entry('chen@x.com', '審核', [item('P1', 'B組', 'approve'), item('P2', '', 'approve')])],
      { contacts: contactsOf({ 'B組': 'hub@x.com', 'C組': 'hub@x.com' }) });
    t.eq('8-1 跨多組：只收一封', tos(r.sent), 'hub@x.com');
    t.eq('8-2 跨多組：主旨組名串接', r.sent[0].subject, '[組別窗口通知][B組、C組] 財產轉移申請：2 筆（其中 2 筆待接收審核）');
    t.eq('8-3 跨多組：改寄提示', formatRoutedNote_(r.summary), '（通知已依設定改寄：B組、C組窗口）');
  }

  // 案例 9：一般使用者通知總開關關閉
  {
    const r = run([entry('chen@x.com', '審核', [item('P1', 'B組', 'approve')])],
      { userMailEnabled: false, contacts: contactsOf({ 'B組': 'lin@x.com' }) });
    t.eq('9-1 一般使用者通知關閉：完全不寄', r.sent.length, 0);
  }

  // 案例 10：JSON 損毀 → 視為無窗口
  {
    t.eq('10-1 JSON 損毀：解析為空', JSON.stringify(parseGroupNotifyContacts_('{bad json', canon)), '{}');
    t.eq('10-2 非物件 JSON：解析為空', JSON.stringify(parseGroupNotifyContacts_('["a@x.com"]', canon)), '{}');
    const r = run([entry('chen@x.com', '審核', [item('P1', 'B組', 'approve')])], { contacts: parseGroupNotifyContacts_('{bad json', canon) });
    t.eq('10-3 JSON 損毀：寄本人', tos(r.sent), 'chen@x.com');
  }

  // 案例 11：AE / 設定鍵別名正規化
  {
    const r1 = run([entry('chen@x.com', '審核', [item('P1', ' 實驗室組 ', 'approve')])], { contacts: contactsOf({ '實驗組': 'lab@x.com' }) });
    t.eq('11-1 AE 別名（含空白）對上窗口', tos(r1.sent), 'lab@x.com');
    t.ok('11-2 主旨顯示正規化組名', r1.sent.length === 1 && r1.sent[0].subject.indexOf('[實驗組]') !== -1);
    const r2 = run([entry('chen@x.com', '審核', [item('P1', '實驗組', 'approve')])], { contacts: contactsOf({ '實驗室組': 'lab@x.com' }) });
    t.eq('11-3 設定鍵為別名也能對上', tos(r2.sent), 'lab@x.com');
  }

  // 案例 12：相同 windowLine 去重
  {
    const r = run([
      entry('chen@x.com', '審核', [item('P1', 'B組', 'approve')]),
      entry('lee@x.com', '審核', [item('P1', 'B組', 'approve')])
    ], { contacts: contactsOf({ 'B組': 'lin@x.com' }) });
    t.eq('12-1 相同 windowLine 只出現一次', r.sent[0].body.split('P1 approve line').length - 1, 1);
  }

  // 案例 13：normalizeGroupNotifyContacts_
  {
    t.eq('13-1 正規化：多種分隔、剔除空白組',
      normalizeGroupNotifyContacts_({ 'B組': ' a@x.com，b@x.com; ', ' ': 'x@x.com', 'C組': '   ', ' D組 ': 'd@x.com,' }),
      '{"B組":"a@x.com, b@x.com","D組":"d@x.com"}');
    t.throws('13-2 Email 格式錯誤拋錯',
      function () { normalizeGroupNotifyContacts_({ 'B組': 'a@x.com, not-an-email' }); },
      '「B組」窗口 Email 格式錯誤：not-an-email');
    t.ok('13-3 換行輸入輸出為單行', normalizeGroupNotifyContacts_({ 'B組': 'a@x.com\nb@x.com' }).indexOf('\n') === -1);
    t.eq('13-4 非物件輸入', normalizeGroupNotifyContacts_(null), '{}');
  }

  // 案例 14：resolvePostTransferAe_
  {
    t.eq('14-1 實驗組(個人)', resolvePostTransferAe_('', '轉移實驗組(個人)'), '實驗組');
    t.eq('14-2 實驗組(共同)', resolvePostTransferAe_('B組', '轉移實驗組(共同)'), '實驗組');
    t.eq('14-3 同組代理前綴', resolvePostTransferAe_('', '【同組代理】轉移實驗組(個人)（原保管人：王小明）'), '實驗組');
    t.eq('14-4 一般轉移維持原 AE', resolvePostTransferAe_(' 實驗組 ', '保管人+使用人'), '實驗組');
    t.eq('14-5 地點轉移空白維持空白', resolvePostTransferAe_('', '地點'), '');
    t.eq('14-6 空值', resolvePostTransferAe_(null, undefined), '');
  }

  // 案例 15：resolveNotifyGroup_
  {
    t.eq('15-1 AE 優先', resolveNotifyGroup_('B組', 'chen@x.com', directory, canon), 'B組');
    t.eq('15-2 AE 空白用 HR 組別（大小寫不敏感）', resolveNotifyGroup_('', ' Chen@X.com ', directory, canon), 'C組');
    t.eq('15-3 查無組別', resolveNotifyGroup_('', 'nobody@x.com', directory, canon), '');
    t.eq('15-4 未分組視為無組別', resolveNotifyGroup_('', 'u@x.com', { emailToGroup: { 'u@x.com': '未分組' } }, canon), '');
  }

  // 案例 16：窗口即原收件人 → 只收一封彙整信
  {
    const r = run([entry('lin@x.com', '審核', [item('P1', 'B組', 'approve')])], { contacts: contactsOf({ 'B組': 'lin@x.com' }) });
    t.eq('16-1 窗口即原收件人：只收一封', tos(r.sent), 'lin@x.com');
    t.ok('16-2 窗口即原收件人：收到的是窗口信', r.sent.length === 1 && r.sent[0].subject.indexOf('[組別窗口通知]') === 0);
  }

  // 案例 17：寄送/渲染失敗不中斷
  {
    const delivered = [];
    const r = run([
      entry('wang@x.com', '知會', [item('P1', '', 'notice')]),
      entry('nobody@x.com', '知會', [item('P2', '', 'notice')])
    ], { sendMail: function (to) { if (to === 'wang@x.com') throw new Error('quota'); delivered.push(to); } });
    t.eq('17-1 單封失敗後續照寄', delivered.join('|'), 'nobody@x.com');
    t.eq('17-2 成功計數只算成功', r.summary.personalCount, 1);
    const r3 = run([
      { email: 'wang@x.com', items: [item('P1', '', 'notice')], render: function () { throw new Error('render boom'); } },
      entry('nobody@x.com', '知會', [item('P2', '', 'notice')])
    ]);
    t.eq('17-3 render 失敗不拋出且後續照寄', tos(r3.sent), 'nobody@x.com');
  }

  // 案例 18：空收件人 / 空 items 不寄
  {
    const r = run([
      { email: '', items: [item('P1', '', 'notice')], render: function () { return { subject: 's', body: 'b' }; } },
      entry('wang@x.com', '知會', [])
    ]);
    t.eq('18-1 空收件人或空 items 不寄', r.sent.length, 0);
  }

  // 案例 19：事件主旨、已完成區塊、operatorName、未知 kind
  {
    const r1 = run([entry('chen@x.com', '完成', [item('P1', 'B組', 'done')])],
      { event: 'transferApproval', contacts: contactsOf({ 'B組': 'lin@x.com' }) });
    t.eq('19-1 審核完成主旨', r1.sent[0].subject, '[組別窗口通知][B組] 財產轉移已審核完成：1 筆');
    t.ok('19-2 已完成區塊', r1.sent[0].body.indexOf('【已完成】\n  - P1 done line\n') !== -1);
    const r2 = run([entry('wang@x.com', '報廢', [item('P1', 'B組', 'notice')])],
      { event: 'scrapProxy', operatorName: '林窗口', contacts: contactsOf({ 'B組': 'lin2@x.com' }) });
    t.eq('19-3 代辦報廢主旨', r2.sent[0].subject, '[組別窗口通知][B組] 同組代辦報廢申請：1 筆');
    t.ok('19-4 operatorName 優先', r2.sent[0].body.indexOf('操作者：林窗口 (op@x.com)') !== -1);
    t.ok('19-5 窗口名查無時用帳號前綴', r2.sent[0].body.indexOf('您好 lin2，') === 0);
    const r3 = run([entry('wang@x.com', '知會', [item('P1', 'B組', 'weird')])], { contacts: contactsOf({ 'B組': 'lin@x.com' }) });
    t.ok('19-6 未知 kind 歸入知會', r3.sent[0].body.indexOf('【知會】\n  - P1 weird line\n') !== -1);
  }

  return t.result('testGroupNotifyRouting_');
}
