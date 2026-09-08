import assert from 'node:assert';

function simulateGetGroupCollaborationSettings(props) {
  const legacy = props['GROUP_PROXY_ENABLED'] === 'true';
  const viewRaw = props['GROUP_VIEW_ENABLED'];
  const transferLendRaw = props['GROUP_PROXY_TRANSFER_LEND_ENABLED'];
  const scrapRaw = props['GROUP_PROXY_SCRAP_ENABLED'];

  const view = viewRaw !== undefined && viewRaw !== null ? viewRaw === 'true' : legacy;
  const transferLend = view && (transferLendRaw !== undefined && transferLendRaw !== null ? transferLendRaw === 'true' : legacy);
  const scrap = view && (scrapRaw !== undefined && scrapRaw !== null ? scrapRaw === 'true' : false);

  return { view, transferLend, scrap };
}

// 1. 舊設定相容測試：舊環境僅 GROUP_PROXY_ENABLED = 'true'
{
  const res = simulateGetGroupCollaborationSettings({ GROUP_PROXY_ENABLED: 'true' });
  assert.strictEqual(res.view, true, '舊設定應使 view=true');
  assert.strictEqual(res.transferLend, true, '舊設定應使 transferLend=true');
  assert.strictEqual(res.scrap, false, '舊設定應使 scrap=false (安全防護)');
}

// 2. 嚴格階層相依測試：view 為 false 時，其餘即便為 true 也必須強制為 false
{
  const res = simulateGetGroupCollaborationSettings({
    GROUP_VIEW_ENABLED: 'false',
    GROUP_PROXY_TRANSFER_LEND_ENABLED: 'true',
    GROUP_PROXY_SCRAP_ENABLED: 'true'
  });
  assert.strictEqual(res.view, false);
  assert.strictEqual(res.transferLend, false, 'view 關閉時 transferLend 必須被強制關閉');
  assert.strictEqual(res.scrap, false, 'view 關閉時 scrap 必須被強制關閉');
}

// 3. 全開測試
{
  const res = simulateGetGroupCollaborationSettings({
    GROUP_VIEW_ENABLED: 'true',
    GROUP_PROXY_TRANSFER_LEND_ENABLED: 'true',
    GROUP_PROXY_SCRAP_ENABLED: 'true'
  });
  assert.strictEqual(res.view, true);
  assert.strictEqual(res.transferLend, true);
  assert.strictEqual(res.scrap, true);
}

console.log('✅ Task 1 設定邏輯單元測試通過！');
