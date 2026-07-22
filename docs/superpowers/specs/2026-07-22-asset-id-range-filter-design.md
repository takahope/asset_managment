# Asset ID Range Filter Design

## 1. Overview
The current asset management system allows users to search for assets using keywords in a global search bar. However, it lacks the ability to filter assets based on specific ranges of Asset IDs (e.g., 3140101 to 3140503). This design outlines a hybrid approach to parsing the search bar input, enabling it to handle both standard text queries and multiple Asset ID ranges seamlessly.

## 2. Requirements & Behavior
* **Syntax**: Users can specify an Asset ID range using a tilde `~` (e.g., `3140101~3140503`). Multiple ranges and keywords can be separated by commas (`,`) or spaces.
* **Hybrid Search**: The search bar can process both ranges and regular keywords simultaneously. 
  * Example: `3140101~3140503, 4030204~4030206 筆記型電腦`
  * Action: Filters assets where the Asset ID is in either Range 1 OR Range 2, AND the asset data contains "筆記型電腦".
* **Inclusive Matching**: The upper bound of a range must automatically cover subsets if omitted. For instance, `3140503` as an upper bound should include `3140503-0001` and `3140503-9999`.

## 3. Architecture & Implementation Details

### 3.1 Parser Logic
The input from the global search bar (`filters.search`) will be processed as follows:
1.  **Tokenization**: Split the search string into tokens using commas and spaces as delimiters.
2.  **Classification**: 
    *   Tokens containing `~` are classified as **Range Tokens**.
    *   All other non-empty tokens are classified as **Keyword Tokens**.
3.  **Range Extraction**:
    *   For each Range Token, split by `~` to get `[startBound, endBound]`.
    *   `startBound`: Cleaned string.
    *   `endBound`: Cleaned string. To ensure inclusive matching for asset ID suffixes, append `\uffff` to the `endBound` if it does not already end with a high-value character.

### 3.2 Core Filtering Logic (`alpine_store.html`)
The filtering logic resides in the `filteredAssets` computed property within `alpine_store.html`. The updated logic will evaluate both Keyword Tokens and Range Tokens:

*   **Keyword Matching (AND logic)**: For every Keyword Token, check if the token is present in the `asset.searchText`. The asset must match *all* Keyword Tokens.
*   **Range Matching (OR logic)**: If any Range Tokens are present, check if the `asset.assetId` falls within at least one of the specified bounds (`startBound <= asset.assetId && asset.assetId <= endBound`). If no Range Tokens are provided, this check automatically passes.
*   **Final Output**: An asset is included in the output if it passes the existing dropdown filters (Status, Category, etc.) AND the Keyword Matching AND the Range Matching.

## 4. Edge Cases and Error Handling
*   **Invalid Range Syntax**: Tokens like just `~` without bounds will be ignored or safely skipped.
*   **Case Insensitivity**: Standardized to lowercase comparison for both text and ID bounds to ensure robustness.
*   **Blank Inputs**: Safely handled by existing conditional blocks; empty searches render all visible assets as usual.

## 5. Scope & Validation
This is a focused enhancement entirely contained within the frontend Alpine.js store logic (`alpine_store.html`). It does not require backend changes, GAS function updates, or database schema modifications.
