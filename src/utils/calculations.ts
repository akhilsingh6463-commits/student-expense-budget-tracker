import {
  Transaction,
  FinancialSummaryData,
  Category,
  TransactionFiltersState,
} from '../types/transaction';

/**
 * Calculates sum of all income transactions
 */
export const calculateTotalIncome = (transactions: Transaction[]): number => {
  return transactions
    .filter((t) => t.type === 'Income')
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
};

/**
 * Calculates sum of all expense transactions
 */
export const calculateTotalExpenses = (transactions: Transaction[]): number => {
  return transactions
    .filter((t) => t.type === 'Expense')
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
};

/**
 * Calculates net balance (Total Income - Total Expenses)
 */
export const calculateNetBalance = (transactions: Transaction[]): number => {
  const income = calculateTotalIncome(transactions);
  const expenses = calculateTotalExpenses(transactions);
  return income - expenses;
};

/**
 * Calculates complete financial summary
 */
export const calculateFinancialSummary = (
  transactions: Transaction[]
): FinancialSummaryData => {
  const totalIncome = calculateTotalIncome(transactions);
  const totalExpenses = calculateTotalExpenses(transactions);
  const netBalance = totalIncome - totalExpenses;
  const incomeCount = transactions.filter((t) => t.type === 'Income').length;
  const expenseCount = transactions.filter((t) => t.type === 'Expense').length;

  let savingsRate = 0;
  if (totalIncome > 0) {
    savingsRate = Math.max(0, Math.round((netBalance / totalIncome) * 100));
  }

  return {
    totalIncome,
    totalExpenses,
    netBalance,
    savingsRate,
    transactionCount: transactions.length,
    incomeCount,
    expenseCount,
  };
};

/**
 * Aggregates expenses by category
 */
export const calculateCategoryTotals = (
  transactions: Transaction[],
  type: 'Expense' | 'Income' = 'Expense'
): { category: Category; amount: number; percentage: number; count: number }[] => {
  const filtered = transactions.filter((t) => t.type === type);
  const total = filtered.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  const map = new Map<Category, { amount: number; count: number }>();

  filtered.forEach((t) => {
    const existing = map.get(t.category) || { amount: 0, count: 0 };
    map.set(t.category, {
      amount: existing.amount + Number(t.amount),
      count: existing.count + 1,
    });
  });

  const results: { category: Category; amount: number; percentage: number; count: number }[] = [];

  map.forEach((val, category) => {
    results.push({
      category,
      amount: val.amount,
      percentage: total > 0 ? Math.round((val.amount / total) * 100) : 0,
      count: val.count,
    });
  });

  // Sort descending by amount
  return results.sort((a, b) => b.amount - a.amount);
};

/**
 * Filter and sort transactions according to active filter options
 */
export const filterAndSortTransactions = (
  transactions: Transaction[],
  filters: TransactionFiltersState
): Transaction[] => {
  return transactions
    .filter((t) => {
      // Type filter
      if (filters.type !== 'All' && t.type !== filters.type) {
        return false;
      }

      // Category filter
      if (filters.category !== 'All' && t.category !== filters.category) {
        return false;
      }

      // Search query (matches description or category)
      if (filters.search && filters.search.trim() !== '') {
        const query = filters.search.toLowerCase().trim();
        const matchesDescription = t.description.toLowerCase().includes(query);
        const matchesCategory = t.category.toLowerCase().includes(query);
        if (!matchesDescription && !matchesCategory) {
          return false;
        }
      }

      // Receipt filter
      if (filters.hasReceiptOnly && !t.receipt) {
        return false;
      }

      // Date range filter
      if (filters.startDate && t.date < filters.startDate) {
        return false;
      }
      if (filters.endDate && t.date > filters.endDate) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case 'date-desc':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'date-asc':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'amount-desc':
          return b.amount - a.amount;
        case 'amount-asc':
          return a.amount - b.amount;
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });
};
