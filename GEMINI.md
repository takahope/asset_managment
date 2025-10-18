# GEMINI.md

## Project Overview

This is a Google Apps Script project that creates a web-based asset management system. The system is designed to be used within a Google Sheet and allows users to manage the entire lifecycle of company assets, including:

*   **Computer Health Reporting:** Users can report the monthly health status of their computers.
*   **Asset Transfer:** Users can request to transfer assets to other users.
*   **Transfer Approval:** Users can approve or reject asset transfer requests.
*   **Asset Lending and Returning:** Users can lend out assets and manage their return.
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

*   **Backend:** The backend logic is written in a single file, `code.js`. The code is well-structured and includes comments in Traditional Chinese.
*   **Frontend:** The frontend is composed of several HTML files, each representing a different page of the application. The project uses Bootstrap for styling.
*   **Shared Code:** The `shared-nav.html` file contains a shared navigation bar that is included in other pages using the `include` function in `code.js`.
*   **Global Settings:** Global settings, such as sheet names and column indices, are defined at the top of the `code.js` file.
*   **Error Handling:** The code includes error handling and logging using `Logger.log`.
*   **Caching:** The `getAdminEmails` and `getReportAdmins` functions use `CacheService` to cache data and improve performance.
