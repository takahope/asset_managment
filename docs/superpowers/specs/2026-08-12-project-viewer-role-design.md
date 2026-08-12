# Design Spec: Project Viewer Role (GRP-PROJ)

## 1. Overview
This feature introduces a new "Project Viewer" (專案檢視員) permission tier that sits between standard users and system administrators. Personnel assigned the `GRP-PROJ` role in the HR master sheet will automatically inherit this permission. 
Project Viewers can see all IT assets across the entire organization but do not have administrative privileges to modify, transfer, or scrap assets. Their actionable rights are strictly limited to reporting data errors (Location Error, Keeper Error, Tag Error).

## 2. Architecture & Data Flow
The permission is dynamically inferred from the central HR master sheet (`HR_SPREADSHEET_ID`) using the existing caching infrastructure in `hr_directory.js`.

**Data Flow:**
1. `hr_directory.js` reads the `人員職務配置工作表` (HR Assignment Sheet).
2. Users with `GRP-PROJ` in column C are aggregated into a `projectViewerEmails` array.
3. This array is cached for 10 minutes along with the rest of the directory data.
4. `code.js` provides a new `checkProjectViewerPermissions(email)` function.
5. In UI state initialization (`getUserState`), the backend passes `isProjectViewer: true` to the frontend.

## 3. Implementation Details

### 3.1 Backend: HR Directory Parsing (`hr_directory.js`)
- **Modification**: In `buildKeeperDirectoryFromHr_()`, instantiate `const projectViewerSet = {};`.
- While iterating over the assignment sheet rows (row 2: orgCode), if `orgCode === 'GRP-PROJ'`, add the user's email to `projectViewerSet`.
- Export `projectViewerEmails: Object.keys(projectViewerSet)` in the final returned directory object.
- **Fallback**: In `buildKeeperDirectoryFromSheetFallback_()`, return an empty array for `projectViewerEmails` (since the legacy local sheet doesn't store the exact `GRP-PROJ` code).

### 3.2 Backend: Permission Gates (`code.js`)
- **`checkProjectViewerPermissions()`**: A new helper function that retrieves `getKeeperDirectory_().projectViewerEmails` and checks if the current user is in it.
- **Asset Retrieval**: In functions like `getInitialData` and `getUserState`, where `isAdmin` is used to fetch all assets, augment the condition to `if (isAdmin || isProjectViewer) { ... fetch all ... }`.
- **API Protection**: Ensure all mutating endpoints (`submitTransferApplications`, `submitScrapApplications`, asset editing endpoints) remain strictly guarded by `checkAdminPermissions()`. Project Viewers must be blocked if they attempt to bypass the UI.
- **Context Injection**: `getUserState()` must return `{ ..., isProjectViewer: checkProjectViewerPermissions() }` so the frontend knows how to render the UI.

### 3.3 Frontend: UI Restrictions (`alpine_views.html` / `connect.html`)
- **State Initialization**: Bind `isProjectViewer` from the backend data into the Alpine.js global store (`$store.app.isProjectViewer`).
- **Visibility**:
  - Because `isProjectViewer` acts somewhat like `isAdmin` for visibility, the asset table will show all assets.
  - **Action Panel (Modal / Bottom Sheet)**:
    - **Hide**: "財產轉移" (Transfer), "財產報廢" (Scrap), "列印條碼" (Print Barcode), "修改資產" (Edit).
    - **Show**: "位置有誤" (Location Error), "保管人有誤" (Keeper Error), "標籤有誤" (Tag Error).
    - Alpine `x-show` conditions must be updated. For example, transfer button: `x-show="$store.app.isAdmin"`. Error reporting buttons: `x-show="$store.app.isAdmin || $store.app.isProjectViewer"`.

## 4. Edge Cases & Constraints
- **Caching Delay**: When HR updates a role to `GRP-PROJ`, it may take up to 10 minutes for the `CacheService` to expire and the permission to take effect. This is acceptable and consistent with existing admin mappings.
- **Dual Roles**: If a user is both an Admin (in Script Properties) and a Project Viewer, `isAdmin` overrides `isProjectViewer`, granting full access.
- **Local Fallback**: If the HR sheet goes offline and the fallback triggers, Project Viewer permissions will temporarily drop until HR is restored. This fail-safe is acceptable as it prevents unauthorized access during an outage.

## 5. Security & Testing
- Verify that a pure Project Viewer can see assets outside their direct custody.
- Verify that a pure Project Viewer cannot see the transfer/scrap buttons.
- Attempt to manually invoke `google.script.run.submitTransferApplications()` from the browser console as a Project Viewer. The backend must throw an "Access Denied" error.
