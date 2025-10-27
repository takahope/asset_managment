# GEMINI.md

## Project Overview

This is a Google Apps Script project that creates a web-based asset management system. The system is designed to be used within a Google Sheet and allows users to manage the entire lifecycle of company assets, including:

*   **Computer Health Reporting:** Users can report the monthly health status of their computers.
*   **Asset Transfer:** Users can request to transfer assets to other users.
*   **Transfer Approval:** Users can approve or reject asset transfer requests.
*   **Asset Lending and Returning:** Users can lend out assets and manage their return.
*   **Asset Scrapping:** Users can request to scrap assets that are old or broken.
*   **Admin Updates:** Asset administrators can update the status of assets.

The project uses Google Sheets as a database, with the primary data source split into two main sheets: "財產總表" (for properties) and "物品總表" (for items). The backend logic is written in Google Apps Script (`code.js`).

## Building and Running

This is a Google Apps Script project, so there is no traditional build process. To run the project, you need to:

1.  **Open the Google Sheet:** Open the Google Sheet that is associated with this project.
2.  **Open the Script Editor:** In the Google Sheet, go to "Extensions" > "Apps Script". This will open the script editor.
3.  **Run the `onOpen` function:** To create the custom menu in the Google Sheet, you can either manually run the `onOpen` function from the script editor or simply reopen the Google Sheet.
4.  **Access the Web App:** The web application can be accessed through the custom menu in the Google Sheet ("財產管理系統" > "🔗 開啟系統入口網站").

## Development Conventions

*   **Backend:** The backend logic is written in a single file, `code.js`. The code is well-structured and includes comments in Traditional Chinese.

*   **Data Source:** The primary data source is split into two separate Google Sheets: `財產總表` (Property Master List) and `物品總表` (Item Master List). These two sheets can have different column structures.

*   **Data Abstraction Layer:** To handle the complexity of two separate and potentially different data sources, the code implements a Data Access Layer (DAL) in `code.js`.
    *   **`getAllAssets()`:** This is the primary function for reading data. It fetches raw data from both master sheets and normalizes them into a consistent array of JavaScript objects. All other functions in the application consume this standardized object array, making them independent of the physical layout of the sheets.
    *   **`findAssetLocation()`:** This function is used for write operations. It takes an asset ID and determines which sheet (`財產總表` or `物品總表`) the asset belongs to, returning the sheet object and row number for precise updates.

*   **Schema Definition:** The column layouts for the two master sheets are defined at the top of `code.js` using two distinct objects: `PROPERTY_COLUMN_INDICES` and `ITEM_COLUMN_INDICES`. This allows for flexible and independent management of each sheet's structure. To change a column's position, one only needs to update the corresponding value in these objects.

*   **Frontend:** The frontend is composed of several HTML files, each representing a different page of the application. The project uses Bootstrap for styling.

*   **Shared Code:** The `shared-nav.html` file contains a shared navigation bar that is included in other pages using the `include` function in `code.js`.

*   **Error Handling:** The code includes error handling and logging using `Logger.log`.

*   **Caching:** The `getAdminEmails` and `getReportAdmins` functions use `CacheService` to cache data and improve performance.