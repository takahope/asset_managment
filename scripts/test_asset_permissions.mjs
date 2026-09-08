import assert from 'node:assert';

function calculateAssetPermissions(asset, currentUserEmail, groupEmails, settings, isAdmin) {
  const normalizedCurrentEmail = currentUserEmail.toLowerCase().trim();
  const leaderEmail = String(asset.leaderEmail || '').toLowerCase().trim();
  const userEmail = String(asset.userEmail || '').toLowerCase().trim();
  const groupEmailSet = new Set(groupEmails.map(e => e.toLowerCase().trim()));

  const isOwner = leaderEmail === normalizedCurrentEmail || userEmail === normalizedCurrentEmail;
  const isGroupMember = groupEmailSet.has(leaderEmail) || groupEmailSet.has(userEmail);

  const canTransfer = isAdmin || isOwner || (settings.transferLend && isGroupMember);
  const canLend     = isAdmin || isOwner || (settings.transferLend && isGroupMember);
  const canScrap    = isAdmin || isOwner || (settings.scrap && isGroupMember);
  const canOperate  = canTransfer || canLend || canScrap;

  return { canTransfer, canLend, canScrap, canOperate };
}

const myAsset = { leaderEmail: 'user@test.org', userEmail: '' };
const teammateAsset = { leaderEmail: 'mate@test.org', userEmail: '' };
const otherAsset = { leaderEmail: 'other@test.org', userEmail: '' };
const groupEmails = ['user@test.org', 'mate@test.org'];

// 情境 A：純檢視模式 (view: true, transferLend: false, scrap: false)
{
  const s = { view: true, transferLend: false, scrap: false };
  const perm = calculateAssetPermissions(teammateAsset, 'user@test.org', groupEmails, s, false);
  assert.strictEqual(perm.canTransfer, false, '純檢視不可轉移同組資產');
  assert.strictEqual(perm.canLend, false, '純檢視不可出借同組資產');
  assert.strictEqual(perm.canScrap, false, '純檢視不可報廢同組資產');
  assert.strictEqual(perm.canOperate, false);
}

// 情境 B：代理轉移出借開啟，報廢關閉 (view: true, transferLend: true, scrap: false)
{
  const s = { view: true, transferLend: true, scrap: false };
  const perm = calculateAssetPermissions(teammateAsset, 'user@test.org', groupEmails, s, false);
  assert.strictEqual(perm.canTransfer, true, '應可轉移同組資產');
  assert.strictEqual(perm.canLend, true, '應可出借同組資產');
  assert.strictEqual(perm.canScrap, false, '報廢仍必須為 false');
  assert.strictEqual(perm.canOperate, true);
}

// 情境 C：本人名下資產無論開關為何皆可操作
{
  const s = { view: false, transferLend: false, scrap: false };
  const perm = calculateAssetPermissions(myAsset, 'user@test.org', groupEmails, s, false);
  assert.strictEqual(perm.canTransfer, true);
  assert.strictEqual(perm.canLend, true);
  assert.strictEqual(perm.canScrap, true);
}

// 情境 D：專案檢視員 (isAdmin=false, 非本人非同組) 權限全為 false
{
  const s = { view: true, transferLend: true, scrap: true };
  const perm = calculateAssetPermissions(otherAsset, 'viewer@test.org', ['viewer@test.org'], s, false);
  assert.strictEqual(perm.canTransfer, false);
  assert.strictEqual(perm.canLend, false);
  assert.strictEqual(perm.canScrap, false);
  assert.strictEqual(perm.canOperate, false);
}

console.log('✅ Task 2 細粒度權限計算單元測試通過！');
