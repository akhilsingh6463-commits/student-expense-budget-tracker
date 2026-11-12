# AI Prompt Log (`AI_LOG.md`)

This log documents the actual prompts, issues faced, and adjustments made while using AI assistants to build this **Student Expense & Budget Tracker Dashboard** for the take-home assessment.

---

## 1. Prompts Used During Development

### Prompt 1: Initial Setup & Folder Architecture
> *"hey bro, I have this react take-home assignment for an interview to build a student expense & budget tracker dashboard. I want to build it using react, vite, typescript, and tailwind. The assignment specifically says persistence logic like localStorage must be kept completely separate inside `src/services/` and not called directly inside components, plus components must be modular and not a monolithic App.jsx. Can you help me scaffold the project and set up a clean folder structure with services, utils, hooks, and components?"*

- **Context / Why:** Wanted to get the architecture right from the start so that state persistence is strictly isolated in `services/storage.ts` and the UI stays modular as required by the checklist.

### Prompt 2: Core Financial Logic & Edge Cases
> *"bro now write pure typescript functions for the calculations: total income, total expenses, net balance (income minus expenses), savings rate, and category totals. Make sure it handles edge cases properly, like when there are no transactions yet, or when expenses are higher than income (negative balance), and don't let it crash with divide-by-zero errors."*

- **Context / Why:** Needed all financial math in pure helper functions in `src/utils/calculations.ts` so they are deterministic and easy to unit test with Vitest.

### Prompt 3: Handling Receipt Uploads Without Breaking LocalStorage
> *"bro I also need to let students attach receipts/invoices (png, jpg, pdf) to their transactions. But if someone takes a photo with their phone it can be 3MB to 5MB, and localStorage has a 5MB limit so it will crash with quota exceeded error. Can we compress the images on a canvas first before converting to base64 data URL so it doesn't blow up localStorage?"*

- **Context / Why:** High-res receipt photos would instantly exhaust browser storage without client-side image compression.

### Prompt 4: Writing Tests with Vitest & React Testing Library
> *"make proper test cases and all using vitest and react-testing-library. Test the calculations, form validations (empty description, negative or zero amounts), storage service, summary cards, and test that deleting an item updates the balance immediately."*

- **Context / Why:** The assignment emphasized test coverage and graceful edge state handling, so we needed comprehensive unit and integration tests.

### Prompt 5: Making the UI Minimal & Clean
> *"make the design a little minimal and all please, there is too much text and helper sentences on the screen. Make it clean and good looking with subtle borders, concise labels, and nice typography so it looks modern and not cluttered."*

- **Context / Why:** The initial layout had too many explanatory paragraphs. Stripped away all redundant text so the dashboard feels crisp, modern, and easy to use.

---

## 2. Real Issues & Bugs Fixed Along the Way

1. **LocalStorage Quota Crash with Camera Receipts:**
   - **Issue:** When testing receipt uploads with high-res phone pictures, browser localStorage immediately threw `QuotaExceededError`.
   - **Fix:** Implemented an offscreen canvas resize in `src/services/fileStorage.ts` that scales images down to max 1200px and 80% quality. This shrunk receipt payloads by over 80% while keeping receipts sharp and readable.

2. **Test Failing on `-$12.50` String Match:**
   - **Issue:** In `TransactionList.test.tsx`, testing for `-$12.50` failed because the minus sign `-` and the `$12.50` were rendered inside two separate `<span>` tags for icon styling, so React Testing Library couldn't find the combined text.
   - **Fix:** Combined them into a single string expression (`{isIncome ? `+${amount}` : `-${amount}`}`) which fixed the test and made it cleaner for screen readers.

3. **Multiple Button Match in Integration Test:**
   - **Issue:** The integration test threw an error finding multiple buttons named "Income" because both the form type toggle and the filter pill shared the same button text.
   - **Fix:** Added dedicated `data-testid` attributes (`filter-type-income`, `filter-type-all`, etc.) so the test queries the exact element without ambiguity.

---

## 3. Changes & Customizations Made by Me

- **Decomposed Large Components:** Rather than having large files with form + table + filters together, I broke everything down into single-responsibility components in `src/components/common/`, `dashboard/`, `transactions/`, and `layout/`.
- **Realistic Student Categories:** Replaced generic budget categories with actual college student needs: `Books & Supplies`, `Campus Dining`, `Dorm Rent`, `Education / Tuition`, `Student Utilities`, `Transportation`, and `Salary / Stipends`.
- **Added Student Monthly Budget Cap:** Added a monthly budget progress bar with status pills (**On Track**, **Near Cap**, **Over Budget**) and quick budget limit editing.
- **Removed AI Boilerplate & Comments:** Cleaned out all auto-generated code comments, unused variables, and enforced strict TypeScript compiler settings with zero warnings.
