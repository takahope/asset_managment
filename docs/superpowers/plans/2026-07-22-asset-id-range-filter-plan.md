# Asset ID Range Filter Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enhance the global search bar to support Asset ID range filtering (e.g., `3140101~3140503`) alongside normal keyword matching.

**Architecture:** Modify the `filteredAssets` computed property in `alpine_store.html` to parse the search string into keywords and ranges, evaluating ranges with OR logic and keywords with AND logic.

**Tech Stack:** JavaScript (ES5 compatible for Google Apps Script Frontend), Alpine.js.

## Global Constraints

- No automated test framework is configured (AGENTS.md). Manual verification is required.
- Do not use modern ES6+ syntax (like `const`, `let`, `=>`) if the file strictly uses ES5 (e.g., `var`, `function() {}`). The file `alpine_store.html` uses `var` and `function`.
- Ensure changes are within `alpine_store.html` script tags.

---

### Task 1: Update Search Parsing and Filtering Logic

**Files:**
- Modify: `alpine_store.html`

**Interfaces:**
- Consumes: User search string from `this.filters.search`.
- Produces: A filtered array of assets returned by the `filteredAssets` getter.

- [ ] **Step 1: Write the updated filtering logic implementation**

Modify `alpine_store.html` around line 328 in the `filteredAssets` getter.

Replace this section:
```javascript
                var searchLower = filters.search ? filters.search.toLowerCase() : '';
                return this.allAssets.filter(function (asset) {
```

With the new parsing logic:
```javascript
                var searchLower = filters.search ? filters.search.toLowerCase() : '';
                
                var searchTokens = searchLower.split(/[\s,]+/).filter(Boolean);
                var rangeTokens = [];
                var keywordTokens = [];
                searchTokens.forEach(function(token) {
                    if (token.indexOf('~') !== -1) {
                        rangeTokens.push(token);
                    } else {
                        keywordTokens.push(token);
                    }
                });
                
                var parsedRanges = rangeTokens.map(function(rt) {
                    var parts = rt.split('~');
                    var startBound = (parts[0] || '').trim();
                    var endBound = (parts[1] || '').trim();
                    if (endBound) {
                        endBound += '\uffff'; // Append high character for inclusive prefix matching
                    }
                    return { start: startBound, end: endBound };
                });

                return this.allAssets.filter(function (asset) {
```

- [ ] **Step 2: Update the `searchMatch` condition**

Further down in the `filteredAssets` iteration, replace the old `searchMatch` variable logic:

```javascript
                    var searchMatch = !searchLower || (asset.searchText && asset.searchText.indexOf(searchLower) !== -1);
                    return statusMatch && categoryMatch && systemCategoryMatch && leaderMatch && userMatch && groupMatch && locationMatch && inventoryTaskMatch && searchMatch;
```

With the new combined matching logic:

```javascript
                    var keywordMatch = true;
                    if (keywordTokens.length > 0) {
                        keywordMatch = keywordTokens.every(function(kw) {
                            return asset.searchText && asset.searchText.indexOf(kw) !== -1;
                        });
                    }

                    var rangeMatch = true;
                    if (parsedRanges.length > 0) {
                        var aId = String(asset.assetId || '').toLowerCase();
                        rangeMatch = parsedRanges.some(function(r) {
                            var passStart = !r.start || aId >= r.start;
                            var passEnd = !r.end || aId <= r.end;
                            return passStart && passEnd;
                        });
                    }
                    var searchMatch = keywordMatch && rangeMatch;

                    return statusMatch && categoryMatch && systemCategoryMatch && leaderMatch && userMatch && groupMatch && locationMatch && inventoryTaskMatch && searchMatch;
```

- [ ] **Step 3: Manually test the logic (via GAS Dev UI or locally if stubbed)**

Because there is no test framework, you must confirm the logic by visually checking the code and potentially deploying or loading the page to verify:
1. `3140101~3140503` filters correctly by range.
2. `3140101~3140503, 4030204~4030206` correctly displays assets in either range.
3. `3140101~3140503 筆電` filters by range AND keyword.

- [ ] **Step 4: Commit the changes**

```bash
git add alpine_store.html
git commit -m "feat(filter): support asset id range search with ~ operator"
```
