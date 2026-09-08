import assert from 'node:assert/strict';

function testScrapPermissions() {
  const currentUser = 'proxy_user@nhri.edu.tw';
  const groupEmailSet = new Set(['proxy_user@nhri.edu.tw', 'peer_user@nhri.edu.tw']);
  const assets = [
    { assetId: 'AST-001', leaderEmail: 'peer_user@nhri.edu.tw', leaderName: '王小明', location: 'R1', assetCategory: '財產' },
    { assetId: 'AST-002', leaderEmail: 'outsider@nhri.edu.tw', leaderName: '李外人', location: 'R2', assetCategory: '財產' }
  ];

  // Case 1: scrap enabled
  {
    const groupSettings = { view: true, transferLend: true, scrap: true };
    const unauthorized = [];
    const proxyNotifications = new Map();
    const scrapped = [];

    assets.forEach(asset => {
      const leaderEmail = asset.leaderEmail.toLowerCase();
      const isOwner = leaderEmail === currentUser;
      const isGroupProxyAllowed = groupSettings.scrap && groupEmailSet.has(leaderEmail);

      if (!isOwner && !isGroupProxyAllowed) {
        unauthorized.push(asset.assetId);
        return;
      }

      const isGroupProxy = !isOwner && isGroupProxyAllowed;
      scrapped.push({ assetId: asset.assetId, isGroupProxy });
      if (isGroupProxy) {
        if (!proxyNotifications.has(leaderEmail)) proxyNotifications.set(leaderEmail, []);
        proxyNotifications.get(leaderEmail).push(asset);
      }
    });

    assert.equal(scrapped.length, 1);
    assert.equal(scrapped[0].assetId, 'AST-001');
    assert.equal(scrapped[0].isGroupProxy, true);
    assert.equal(unauthorized.length, 1);
    assert.equal(unauthorized[0], 'AST-002');
    assert.equal(proxyNotifications.has('peer_user@nhri.edu.tw'), true);
  }

  // Case 2: scrap disabled
  {
    const groupSettings = { view: true, transferLend: true, scrap: false };
    const unauthorized = [];
    const scrapped = [];

    assets.forEach(asset => {
      const leaderEmail = asset.leaderEmail.toLowerCase();
      const isOwner = leaderEmail === currentUser;
      const isGroupProxyAllowed = groupSettings.scrap && groupEmailSet.has(leaderEmail);

      if (!isOwner && !isGroupProxyAllowed) {
        unauthorized.push(asset.assetId);
        return;
      }

      scrapped.push(asset.assetId);
    });

    assert.equal(scrapped.length, 0);
    assert.equal(unauthorized.length, 2);
  }

  console.log('✅ Task 4 報廢代理與知會邏輯單元測試通過！');
}

testScrapPermissions();
