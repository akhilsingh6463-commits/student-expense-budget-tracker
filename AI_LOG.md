# AI Prompt Log (`AI_LOG.md`)

This document records the prompts, challenges, and structural modifications made while using AI coding assistants during the development of the **Student Expense & Budget Tracker Dashboard**.

---

## 1. Key Prompts Used

### Prompt 1: Project Architecture & Clean Folder Setup
> *"I'm building a Student Expense & Budget Tracker take-home project using React 18, Vite, TypeScript, and Tailwind CSS. The assignment asks for strict layer separation where persistence (localStorage) is kept isolated in `src/services/` and never called directly in UI components. Can you suggest a clean modular folder structure and how to structure the storage service and custom hooks?"*

- **Why I asked this:** I wanted to make sure the foundation was right from minute one, with proper repository patterns so UI components only deal with props and hooks, without mixing storage side-effects.

### Prompt 2: Calculations & Edge Cases
> *"Write pure TypeScript functions for financial calculations: total income, total expenses, net balance (income - expenses), savings rate %, and category breakdown. Make sure they handle edge cases like zero income, empty transaction arrays, division by zero, and negative balances properly."*

- **Why I asked this:** Calculations need to be 100% pure and deterministic so they can be unit-tested cleanly with Vitest without mocking DOM or storage state.

### Prompt 3: Handling File/Receipt Uploads without Crashing LocalStorage
> *"I need to let students attach receipts (PNG, JPG, PDF) to transactions. Since I'm storing everything in localStorage, high-res photos will exceed the 5MB quota very quickly. How can I compress images on an HTML5 canvas before converting to base64, while keeping PDFs as readable data URLs?"*

- **Why I asked this:** Real-world receipts taken with mobile phones are 3-5MB each. Compressing them down before saving to localStorage keeps the app fast and prevents quota errors.

### Prompt 4: Writing Vitest & React Testing Library Tests
> *"Help me write comprehensive Vitest tests for the calculation utilities, validators, storage service, financial summary cards, transaction entry form validation errors, and list deletion with confirmation modals."*

- **Why I asked this:** To verify all functional criteria and ensure edge cases (empty states, negative amounts, invalid categories) were thoroughly tested.

---

## 2. Challenges & Bugs Resolved with AI Assistance

### 1. Canvas Compression for LocalStorage Receipts
- **Problem:** Adding 2-3 uncompressed camera photos of receipts immediately hit the browser's `QuotaExceededError` limit in localStorage.
- **How I fixed it with AI:** Wrote an image resizing and compression utility inside `src/services/fileStorage.ts` that draws images to an offscreen `<canvas>` at a max dimension of 1200px and 0.8 quality before converting to base64. This dropped average receipt size from ~3.5MB to under 150KB while keeping text legible.

### 2. Multi-Span String Matcher Failure in Tests
- **Problem:** During test runs in `TransactionList.test.tsx`, testing for `-$12.50` failed. The negative sign and dollar amount were rendered in separate sibling `<span>` tags for styling, which broke `@testing-library/react`'s `getByText`.
- **How I fixed it with AI:** Merged the sign and formatted amount into a single string expression (`{isIncome ? `+${formatted}` : `-${formatted}`}`), which fixed the test and improved screen reader accessibility.

### 3. Reactive Balance Updates on Delete & Edit
- **Problem:** When a transaction was deleted or edited, summary cards and category distribution charts needed to update instantaneously without stale state or extra re-renders.
- **How I fixed it with AI:** Kept transactions as the single source of truth in `useTransactions`, deriving `summary`, `categoryExpenses`, and `filteredTransactions` via `useMemo` so all metrics update immediately upon state mutation.

---

## 3. Structural Modifications & Decisions I Made

1. **Splitting Monolithic Components into Atoms:**  
   The initial AI suggestion lumped the form inputs, dropzone, filter controls, and table into just two massive files. I broke these down into modular, single-responsibility components in `src/components/common/`, `src/components/dashboard/`, and `src/components/transactions/`.

2. **Customizing Categories for Campus Life:**  
   Standard templates had generic adult finance categories like "Mortgage" or "Car Loan". I updated them specifically for student needs: `Books & Supplies`, `Campus Dining`, `Dorm Rent`, `Education & Tuition`, `Student Utilities`, `Transportation`, and `Stipends/Salary`.

3. **Adding a Monthly Student Budget Cap:**  
   To make it a true budget tracker rather than just a log, I added a configurable monthly budget cap with visual progress status (**On Track**, **Near Cap**, **Over Budget**).

4. **Code Polish & Zero Clutter:**  
   Removed all auto-generated boilerplate comments, unused imports, and enabled strict TypeScript compiler settings with zero warnings.
