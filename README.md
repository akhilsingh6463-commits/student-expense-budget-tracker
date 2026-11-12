# Student Expense & Budget Tracker Dashboard

[![CI & GitHub Pages Deployment](https://github.com/akhilsingh6463-commits/student-expense-budget-tracker/actions/workflows/deploy.yml/badge.svg)](https://github.com/akhilsingh6463-commits/student-expense-budget-tracker/actions/workflows/deploy.yml)
[![Tests: 37 Passed](https://img.shields.io/badge/Tests-37%20Passed-emerald)](https://github.com/akhilsingh6463-commits/student-expense-budget-tracker)
[![TypeScript: Strict](https://img.shields.io/badge/TypeScript-Strict%20Mode-blue)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

A modern, responsive, and accessible **Student Expense & Budget Tracker** dashboard engineered with **React 18**, **TypeScript**, **Tailwind CSS**, and **Vitest**. Built as a comprehensive take-home engineering assessment demonstrating clean architecture, strict layer separation, persistent storage, and polished UI/UX.

🌐 **Live Demo:** [https://akhilsingh6463-commits.github.io/student-expense-budget-tracker/](https://akhilsingh6463-commits.github.io/student-expense-budget-tracker/)

---

## 📸 Key Features

- **Real-Time Financial Summary Dashboard:**
  - **Total Income:** Sum of all stipends, scholarships, and salary earnings.
  - **Total Expenses:** Sum of all student spending (tuition, books, dorm, dining).
  - **Dynamic Net Balance:** Dynamically calculated as `Total Income - Total Expenses` with color differentiation (emerald for positive, amber for deficit).
  - **Savings Rate & Financial Wellness:** Real-time percentage indicator of income saved.

- **Transaction Entry Form & File/Receipt Upload:**
  - Robust client-side validation (non-empty description, positive amount `> 0`, valid category, valid date).
  - Quick toggle between **Income** and **Expense** modes.
  - **Receipt & Invoice Attachment:** Drag-and-drop or click-to-upload receipts (PNG, JPG, WebP, PDF) with image compression, client-side thumbnail preview, and full-resolution modal viewer.

- **Transaction Management:**
  - Structured, responsive table & card view with clear visual badges.
  - Search by description and category.
  - Filter by type (`All`, `Income`, `Expense`), category, or "With Receipt Only".
  - Multi-criteria sorting (Newest, Oldest, Amount: High to Low, Amount: Low to High).
  - Edit existing transactions with form pre-fill.
  - Safe transaction deletion with confirmation dialog and instant derived state recalculation.
  - Graceful fallback empty states for zero-data and no-filter-match scenarios.

- **Student Monthly Budget Cap:**
  - Configurable monthly expense cap (e.g., $1,200) with visual progress bar.
  - Real-time status badges: **On Track** (0-80%), **Near Cap** (80-100%), or **Over Budget** (>100%).
  - Remaining monthly allowance calculator.

- **Category Breakdown & Analytics:**
  - Spending distribution across campus categories with color codes and percentages.

- **Data Portability & Persistence:**
  - Automatic `localStorage` persistence with seed fallback.
  - One-click **Export to CSV** and **Export to JSON**.
  - **Import JSON backup** to restore previous student sessions.
  - Multi-currency switcher (USD `$`, EUR `€`, GBP `£`, INR `₹`, CAD `C$`).

---

## 🏛️ Architecture & Folder Structure

Following strict engineering modularity and the take-home checklist standards:

```text
student-expense-tracker/
├── .github/
│   └── workflows/
│       └── deploy.yml           # Automated CI test & GitHub Pages deployment
├── src/
│   ├── assets/
│   │   └── sampleData.ts        # Realistic student initial seed dataset
│   ├── components/
│   │   ├── common/              # Reusable atomic UI components
│   │   │   ├── Badge.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── Select.tsx
│   │   ├── dashboard/           # Dashboard summary & analytics
│   │   │   ├── BudgetProgress.tsx
│   │   │   ├── CategoryBreakdown.tsx
│   │   │   └── FinancialSummary.tsx
│   │   ├── layout/              # Application shell
│   │   │   ├── Footer.tsx
│   │   │   └── Navbar.tsx
│   │   └── transactions/        # Transaction management
│   │       ├── DeleteConfirmModal.tsx
│   │       ├── ReceiptModal.tsx
│   │       ├── TransactionFilters.tsx
│   │       ├── TransactionForm.tsx
│   │       ├── TransactionItem.tsx
│   │       └── TransactionList.tsx
│   ├── hooks/                   # Custom business logic hooks
│   │   ├── useBudget.ts         # Monthly cap & threshold management
│   │   └── useTransactions.ts   # Reactive transaction state & CRUD
│   ├── services/                # Layer Separation (Isolated from UI)
│   │   ├── fileStorage.ts       # Receipt reader, compressor & base64 serializer
│   │   └── storage.ts           # LocalStorage CRUD, CSV/JSON exporters
│   ├── test/                    # Comprehensive Vitest & RTL test suites
│   │   ├── calculations.test.ts # Financial math & filter unit tests
│   │   ├── FinancialSummary.test.tsx
│   │   ├── setup.ts             # JSDOM & storage mock setup
│   │   ├── storage.test.ts      # Storage service tests
│   │   ├── TransactionForm.test.tsx
│   │   ├── TransactionList.test.tsx
│   │   └── validators.test.ts   # Form input & file validation tests
│   ├── types/
│   │   └── transaction.ts       # Strict TypeScript schema interfaces
│   ├── utils/
│   │   ├── calculations.ts      # Pure calculation functions
│   │   ├── formatters.ts        # Currency, date, and file size formatters
│   │   └── validators.ts        # Input validation rules
│   ├── App.tsx                  # Main modular composition
│   ├── index.css                # Tailwind base & custom styles
│   └── main.tsx                 # Application entry point
├── AI_LOG.md                    # Detailed Generative AI prompt & adaptation log
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 📋 Take-Home Evaluation Checklist Compliance

| Checklist Item | Status | Implementation Details |
| :--- | :---: | :--- |
| **Component Modularity** | ✅ Passed | Decomposed into 15+ single-responsibility components in `src/components/`. |
| **State Feedback** | ✅ Passed | Interactive hover, focus, active states, loading indicators, and toast feedback. |
| **Visual Distinction** | ✅ Passed | Emerald green badges and indicators for Income; rose red for Expenses. |
| **Edge & Empty States** | ✅ Passed | Custom empty states for initial state and zero search/filter matches. Form validation prevents negative/empty submissions. |
| **Responsive Design** | ✅ Passed | Mobile-first layout fully responsive across smartphones, tablets, and desktops. |
| **Directory Hygiene** | ✅ Passed | Organized by `components/`, `services/`, `utils/`, `assets/`, `hooks/`, `types/`. PascalCase components and camelCase helpers. |
| **Unique Keys** | ✅ Passed | Every item uses a unique `id` as a React key. |
| **Schema Compliance** | ✅ Passed | Strictly matches `Transaction` JSON interface. |
| **Layer Separation** | ✅ Passed | UI components never access `localStorage` directly; all persistence is encapsulated in `src/services/`. |
| **Immutable State** | ✅ Passed | State updates strictly use immutability (`[newItem, ...prev]`, `.filter()`, `.map()`). |
| **AI Documentation** | ✅ Passed | Complete prompt history, bug resolutions, and architectural changes in `AI_LOG.md`. |

---

## 🚀 Quickstart & Setup Instructions

### Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher

### 1. Clone the Repository
```bash
git clone https://github.com/akhilsingh6463-commits/student-expense-budget-tracker.git
cd student-expense-budget-tracker
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 4. Run Test Suite
```bash
npm test
```
To run tests with watch mode:
```bash
npm run test:watch
```

### 5. Build for Production
```bash
npm run build
```
The compiled bundle will be output to the `dist/` directory.

---

## 🧪 Testing Suite Overview

The project includes **37 automated tests** across 6 comprehensive test suites:

- **`calculations.test.ts`**: Pure functions for `totalIncome`, `totalExpenses`, dynamic `netBalance`, `savingsRate`, category percentages, and multi-field filtering.
- **`validators.test.ts`**: Form validation edge cases (empty strings, zero/negative amounts, boundary lengths, file size limits, MIME type filtering).
- **`storage.test.ts`**: Verification of `storageService` CRUD operations, state immutability, JSON/CSV exports, and corrupt storage fallbacks.
- **`FinancialSummary.test.tsx`**: Component tests verifying accurate real-time summary card figures and formatting.
- **`TransactionForm.test.tsx`**: Integration tests verifying validation error rendering, submission callbacks, and type switching.
- **`TransactionList.test.tsx`**: Integration tests verifying list rendering, empty state fallbacks, receipt preview modals, and deletion workflows.

---

## 📄 License
This project is licensed under the MIT License.
