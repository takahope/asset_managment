import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const linkedCustodianEmail = 'station.manager@example.com';
const titleBasedCustodianEmail = 'role.manager@example.com';

async function verifyTransferOptionsIncludeLinkedCustodians() {
  const source = await readFile(new URL('../code.js', import.meta.url), 'utf8');
  const context = {};
  vm.createContext(context);
  vm.runInContext(source, context, { filename: 'code.js' });

  Object.assign(context, {
    Session: { getActiveUser: () => ({ getEmail: () => 'operator@example.com' }) },
    getAllAssets: () => [],
    getAssetsForCurrentUser: () => [],
    checkAdminPermissions: () => false,
    checkProjectViewerPermissions: () => false,
    isGroupProxyTransferEnabled: () => false,
    getGroupMemberEmails: () => [],
    getKeeperDirectory_: () => ({
      emailToName: {
        [linkedCustodianEmail]: '站點管理人',
        [titleBasedCustodianEmail]: '職務駐管'
      },
      allEmails: [linkedCustodianEmail, titleBasedCustodianEmail],
      // 模擬站點 H 欄指定的管理人，未剛好擁有「駐站管理員」職務。
      custodianEmails: [titleBasedCustodianEmail]
    }),
    getInfoStationCustodianEmails_: () => [],
    getInfoStationUserEmails_: () => [],
    getIntakeCustodianEmails_: () => [],
    getLocationConfig_: () => ({
      locations: ['中心', '測試駐站'],
      stationLocations: ['測試駐站'],
      stationToCustodians: {
        '測試駐站': [{ email: linkedCustodianEmail, name: '站點管理人' }]
      },
      custodianToStations: {
        [linkedCustodianEmail]: ['測試駐站']
      },
      infoLocation: null,
      infoComputerLocation: null,
      intakeLocation: null
    })
  });

  const result = context.getTransferData(false);
  assert.deepEqual(
    Object.keys(result.custodians).sort(),
    [linkedCustodianEmail, titleBasedCustodianEmail].sort(),
    '站點對照表中的在職駐管必須同時出現在轉移下拉選單，否則選擇站點後無法顯示或保留自動帶入的駐管'
  );
}

async function verifyOldDirectoryCacheIsIgnored() {
  const source = await readFile(new URL('../hr_directory.js', import.meta.url), 'utf8');
  const cacheReads = [];
  const context = {
    CacheService: {
      getScriptCache: () => ({
        // 模擬部署連動功能前留下、沒有 managers 欄位的快取內容。
        get: (key) => {
          cacheReads.push(key);
          return key === 'keeper_directory_v1'
            ? JSON.stringify({ stationGroups: [{ code: 'GRP-CO-001', name: '舊站點' }] })
            : null;
        },
        put: () => {}
      })
    }
  };
  vm.createContext(context);
  vm.runInContext(source, context, { filename: 'hr_directory.js' });
  context.buildKeeperDirectoryFromHr_ = () => ({
    stationGroups: [{
      code: 'GRP-CO-001',
      name: '新站點',
      managers: [{ email: linkedCustodianEmail, name: '站點管理人' }]
    }]
  });

  const directory = context.getKeeperDirectory_();
  assert.deepEqual(directory.stationGroups[0].managers, [{
    email: linkedCustodianEmail,
    name: '站點管理人'
  }], '部署雙向連動後，舊 schema 的 directory 快取不可再被讀取');
  assert.deepEqual(cacheReads, ['keeper_directory_v2']);
}

await verifyTransferOptionsIncludeLinkedCustodians();
await verifyOldDirectoryCacheIsIgnored();
console.log('PASS station-custodian linkage regressions');
