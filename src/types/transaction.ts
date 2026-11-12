export type TransactionType = 'Income' | 'Expense';

export type Category =
  | 'Food'
  | 'Rent'
  | 'Salary'
  | 'Entertainment'
  | 'Utilities'
  | 'Education'
  | 'Books & Supplies'
  | 'Transportation'
  | 'Healthcare'
  | 'Other';

export interface ReceiptAttachment {
  name: string;
  size: number;
  type: string;
  dataUrl: string; // Base64 Data URL for persistent storage & rendering
  uploadedAt: string;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: Category;
  date: string; // YYYY-MM-DD
  receipt?: ReceiptAttachment | null;
  createdAt: string; // ISO 8601 string
  updatedAt?: string;
}

export interface BudgetConfig {
  monthlyLimit: number; // e.g. 1500
  currency: string;     // e.g. 'USD', 'INR', 'EUR', 'GBP'
  warningThreshold: number; // percentage, e.g. 80 (80%)
}

export interface TransactionFiltersState {
  search: string;
  type: 'All' | TransactionType;
  category: 'All' | Category;
  sortBy: 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc';
  startDate?: string;
  endDate?: string;
  hasReceiptOnly?: boolean;
}

export interface FinancialSummaryData {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  savingsRate: number; // Percentage (0-100)
  transactionCount: number;
  incomeCount: number;
  expenseCount: number;
}
