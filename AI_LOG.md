# AI Prompt Log (AI_LOG.md)

As required by the take-home assessment guidelines, this document provides complete transparency regarding Generative AI usage, prompt strategies, technical challenges resolved, and structural modifications applied throughout the development of the **Student Expense & Budget Tracker Dashboard**.

---

## 1. Key Prompts Used During Development

### Prompt 1: Architecture & State Layer Isolation
> *"Design a modular architecture for a React + TypeScript Student Expense & Budget Tracker. Requirements: strict separation between UI components and persistence logic (`localStorage` / DB client encapsulated in `src/services/`), immutable state management, clean relative paths, and zero direct calls to browser storage inside view components."*

- **Intent:** Establish the service repository pattern early so that React components remain pure presentation layers while `storageService` and `fileStorageService` handle serialization, validation, and browser storage limits.

### Prompt 2: Robust Financial Calculations & Edge Cases
> *"Write pure mathematical utility functions in TypeScript to compute Total Income, Total Expenses, Dynamic Net Balance (`Total Income - Total Expenses`), Category Distribution Percentages, and Savings Rate. Include guard rails for empty lists, floating point rounding, zero divisions, and negative balances."*

- **Intent:** Ensure all calculations are deterministic, easily unit-tested with Vitest, and free from side effects or floating-point precision artifacts.

### Prompt 3: File & Receipt Upload with LocalStorage Optimization
> *"Create a file processing service for student receipts (PNG, JPG, WebP, PDF) that supports drag-and-drop, client-side validation (max 5MB, allowed MIME types), HTML5 Canvas image resizing to prevent `localStorage` 5MB quota exhaustion, and Base64 Data URL conversion for instant preview and offline persistence."*

- **Intent:** Fulfill the receipt/file attachment requirement safely within client-side browser limits without requiring an external S3/Cloudinary server.

### Prompt 4: Comprehensive Vitest & React Testing Library Suite
> *"Generate comprehensive unit and integration test suites covering calculations, validators, storage service CRUD operations, financial summary cards, transaction entry form validation errors, receipt upload preview, and transaction list deletion flows."*

- **Intent:** Achieve exhaustive test coverage (37 passing tests across 6 suites) verifying functional criteria and edge states.

---

## 2. Challenges & Bugs Resolved with AI Assistance

### Challenge 1: LocalStorage Quota Exceeded with High-Resolution Receipts
- **Problem:** When users upload high-resolution camera photos of receipts (e.g., 3-5MB each), standard base64 encoding inflates the payload by ~33%, quickly exhausting the browser's 5MB-10MB `localStorage` limit.
- **Resolution:** Implemented an asynchronous client-side canvas compression pipeline in `src/services/fileStorage.ts`. It downscales dimensions exceeding 1200px and re-encodes images at 80% JPEG quality, reducing payload size by over 80% while preserving receipt legibility.

### Challenge 2: Synchronizing Derived State with Real-Time Deletions
- **Problem:** When a transaction was deleted or edited, summary cards and category distributions initially suffered from redundant renders or potential state desynchronization.
- **Resolution:** Utilized React's `useMemo` hooks paired with single-source-of-truth state in `useTransactions`. Pure computation helpers (`calculateFinancialSummary`, `calculateCategoryTotals`, `filterAndSortTransactions`) now execute reactively and immutably on state updates.

### Challenge 3: Vitest Multi-Span String Matcher Regression
- **Problem:** In `TransactionList.test.tsx`, testing for `-$12.50` failed because the negative sign and formatted amount were initially rendered in distinct sibling `<span>` tags for icon alignment, causing `@testing-library/react`'s `getByText` to fail exact string matching.
- **Resolution:** Consolidated the sign and currency string into a single formatted expression (`{isIncome ? `+${formatted}` : `-${formatted}`}`), improving screen reader semantics and passing test assertions cleanly.

---

## 3. Structural Modifications & Architectural Adaptations

### 1. From Monolithic Forms to Isolated Modular Atoms
- **AI Output Initially Proposed:** Combining form inputs, file dropzone, filter controls, and summary cards in 2 large component files.
- **Modification Made:** Decomposed strictly into single-responsibility components:
  - `src/components/common/` (`Button`, `Card`, `Input`, `Select`, `Modal`, `Badge`, `EmptyState`)
  - `src/components/dashboard/` (`FinancialSummary`, `BudgetProgress`, `CategoryBreakdown`)
  - `src/components/transactions/` (`TransactionForm`, `TransactionList`, `TransactionItem`, `TransactionFilters`, `ReceiptModal`, `DeleteConfirmModal`)
  - `src/components/layout/` (`Navbar`, `Footer`)

### 2. Student-Centric Domain Customization
- **AI Output Initially Proposed:** Generic personal finance categories (`Car`, `Mortgage`, `Stocks`).
- **Modification Made:** Tailored specifically to student campus life:
  - Categories: `Books & Supplies`, `Campus Dining / Food`, `Dorm Rent`, `Tuition & Education`, `Transportation`, `Stipends & Salary`, `Student Utilities`.
  - Added Student Monthly Budget Cap with real-time threshold warnings (On Track, Near Cap, Over Budget) and campus finance guidance.

### 3. Removal of Superfluous AI Comments & Dead Code
- Removed generic AI boilerplates, inline pseudocode, and unused dependencies (`clsx` fallback cleanup).
- Enforced strict TypeScript mode with zero compiler warnings and zero `any` types.
