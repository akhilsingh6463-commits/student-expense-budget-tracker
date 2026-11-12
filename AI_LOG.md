# AI Prompt Log (`AI_LOG.md`)

## 1. Prompt Used

> *"hey bro, I have this Fullstack React take-home assignment to build a Student Expense & Budget Tracker dashboard. We need to build the whole project using React, TypeScript, and Tailwind CSS. The persistence logic (localStorage) must be kept strictly separated in `src/services/` and not called directly inside UI components. Implement the real-time financial summary (Total Income, Total Expenses, dynamic Net Balance), transaction entry form with proper validation, and proper file upload for receipts (compressing images on canvas so it doesn't crash localStorage with 5MB limits). Keep the UI clean and minimal without too much text clutter, make proper test cases and all using Vitest and React Testing Library, write proper documentation, and then push the code to GitHub and host it on GitHub Pages. Bro okay bro."*

---

## 2. Challenges & Bugs Resolved

1. **LocalStorage Quota Crash on Camera Receipts:**
   - **Problem:** Uploading uncompressed photos of receipts (3MB–5MB) quickly exceeded the browser's 5MB `localStorage` limit.
   - **Resolution:** Built a canvas compression pipeline in `src/services/fileStorage.ts` to resize images to max 1200px at 80% quality before converting to base64, dropping file sizes by ~80% while keeping receipts readable.

2. **Test Failure on Formatted Amount (`-$12.50`):**
   - **Problem:** In `TransactionList.test.tsx`, testing for `-$12.50` failed because the minus sign and amount were in separate sibling `<span>` tags.
   - **Resolution:** Merged them into a single string expression (`{isIncome ? `+${amount}` : `-${amount}`}`), resolving the test and improving screen reader output.

3. **Multiple Element Match in Integration Test:**
   - **Problem:** React Testing Library threw an error finding multiple buttons with the text "Income" (one in the form toggle, one in the filter pills).
   - **Resolution:** Added explicit `data-testid` attributes (`filter-type-income`, `filter-type-all`) for unambiguous querying.

---

## 3. Structural Modifications Made

- **Component Modularity:** Decomposed the application into small single-responsibility components across `src/components/common/`, `dashboard/`, `transactions/`, and `layout/` instead of a monolithic file.
- **Campus-Specific Categories:** Configured categories specifically for student life (`Books & Supplies`, `Campus Dining`, `Dorm Rent`, `Tuition`, `Utilities`, `Transportation`, `Stipends/Salary`).
- **Student Monthly Budget Cap:** Added a configurable monthly expense limit with visual progress indicators (**On Track**, **Near Cap**, **Over Budget**).
- **Minimalist UI Refinement:** Removed verbose helper paragraphs and banners to keep the interface clean, modern, and uncluttered.
- **Clean Codebase:** Removed all generated comments, unused imports, and enabled strict TypeScript mode with zero compiler warnings.
