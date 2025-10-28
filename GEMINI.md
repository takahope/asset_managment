# GEMINI.md

## Project Overview

This is a Google Apps Script project that creates a web-based asset management system. The system is designed to be used within a Google Sheet and allows users to manage the entire lifecycle of company assets, including:

*   **Computer Health Reporting:** Users can report the monthly health status of their computers.
*   **Asset Transfer:** Users can request to transfer assets to other users.
*   **Transfer Approval:** Users can approve or reject asset transfer requests.
*   **Asset Lending and Returning:** Users can lend out assets, specifying the location where the asset will be kept during the lending period, and manage their return.
*   **Asset Scrapping:** Users can request to scrap assets that are old or broken.
*   **Admin Updates:** Asset administrators can update the status of assets.

The project uses Google Sheets as a database and a web-based user interface built with HTML, CSS, and JavaScript. The backend logic is written in Google Apps Script (`code.js`).

## Building and Running

This is a Google Apps Script project, so there is no traditional build process. To run the project, you need to:

1.  **Open the Google Sheet:** Open the Google Sheet that is associated with this project.
2.  **Open the Script Editor:** In the Google Sheet, go to "Extensions" > "Apps Script". This will open the script editor.
3.  **Run the `onOpen` function:** To create the custom menu in the Google Sheet, you can either manually run the `onOpen` function from the script editor or simply reopen the Google Sheet.
4.  **Access the Web App:** The web application can be accessed through the custom menu in the Google Sheet ("財產管理系統" > "🔗 開啟系統入口網站").

## Development Conventions

*   **Backend:** The backend logic is written in a single file, `code.js`. The code is well-structured and includes comments in Traditional Chinese. It features a data abstraction layer where functions like `getAllAssets()` read from the Google Sheets and convert the data into a standardized array of JavaScript objects. This approach decouples the application logic from the physical sheet structure.

*   **Frontend:** The frontend is composed of several HTML files, each representing a different page of the application. The project uses Bootstrap for styling.

*   **Dynamic UI Elements:** Pages like "Asset Transfer" (`apply.html`) and "Asset Lending" (`lending.html`) dynamically populate UI elements such as dropdown menus (e.g., for keepers, locations, borrowers). The data for these elements is sourced directly from the main asset list via functions in `code.js` (e.g., `getTransferData()`, `getLendingData()`). This ensures that the options presented to the user are always up-to-date and reflect the current state of the asset data, removing the need for separate mapping sheets.

*   **Shared Code:** The `shared-nav.html` file contains a shared navigation bar that is included in other pages using the `include` function in `code.js`.

*   **Error Handling:** The code includes error handling and logging using `Logger.log`.

*   **Caching:** The `getAdminEmails` and `getReportAdmins` functions use `CacheService` to cache data and improve performance.
