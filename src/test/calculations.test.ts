import { describe, it, expect } from 'vitest';
import {
  calculateTotalIncome,
  calculateTotalExpenses,
  calculateNetBalance,
  calculateFinancialSummary,
  calculateCategoryTotals,
  filterAndSortTransactions,
} from '../utils/calculations';
import { Transaction } from '../types/transaction';

const mockTransactions: Transaction[] = [
  {
    id: 'tx-1',
    description: 'Part-time Tutoring',
    amount: 500,
    type: 'Income',
    category: 'Salary',
    date: '2026-11-01',
    createdAt: '2026-11-01T10:00:00Z',
  },
  {
    id: 'tx-2',
    description: 'Biology Textbooks',
    amount: 150,
    type: 'Expense',
    category: 'Books & Supplies',
    date: '2026-11-02',
    createdAt: '2026-11-02T10:00:00Z',
  },
  {
    id: 'tx-3',
    description: 'Campus Cafeteria Meal',
    amount: 50,
    type: 'Expense',
    category: 'Food',
    date: '2026-11-03',
    createdAt: '2026-11-03T10:00:00Z',
  },
  {
    id: 'tx-4',
    description: 'Scholarship Allowance',
    amount: 250,
    type: 'Income',
    category: 'Education',
    date: '2026-11-04',
    createdAt: '2026-11-04T10:00:00Z',
  },
];

describe('Financial Calculations', () => {
  it('correctly calculates total income', () => {
    const total = calculateTotalIncome(mockTransactions);
    expect(total).toBe(750); // 500 + 250
  });

  it('correctly calculates total expenses', () => {
    const total = calculateTotalExpenses(mockTransactions);
    expect(total).toBe(200); // 150 + 50
  });

  it('correctly calculates net balance as Total Income - Total Expenses', () => {
    const balance = calculateNetBalance(mockTransactions);
    expect(balance).toBe(550); // 750 - 200
  });

  it('handles negative net balance gracefully when expenses exceed income', () => {
    const heavyExpenses: Transaction[] = [
      {
        id: 'tx-1',
        description: 'Allowance',
        amount: 100,
        type: 'Income',
        category: 'Salary',
        date: '2026-11-01',
        createdAt: '2026-11-01T10:00:00Z',
      },
      {
        id: 'tx-2',
        description: 'Tuition Fee',
        amount: 800,
        type: 'Expense',
        category: 'Education',
        date: '2026-11-02',
        createdAt: '2026-11-02T10:00:00Z',
      },
    ];
    const balance = calculateNetBalance(heavyExpenses);
    expect(balance).toBe(-700);
  });

  it('generates a complete financial summary object with savings rate', () => {
    const summary = calculateFinancialSummary(mockTransactions);
    expect(summary.totalIncome).toBe(750);
    expect(summary.totalExpenses).toBe(200);
    expect(summary.netBalance).toBe(550);
    expect(summary.transactionCount).toBe(4);
    expect(summary.incomeCount).toBe(2);
    expect(summary.expenseCount).toBe(2);
    // savingsRate = (550 / 750) * 100 = 73%
    expect(summary.savingsRate).toBe(73);
  });

  it('calculates category totals and percentages correctly', () => {
    const categoryExpenses = calculateCategoryTotals(mockTransactions, 'Expense');
    expect(categoryExpenses).toHaveLength(2);
    // Books & Supplies: 150 out of 200 = 75%
    expect(categoryExpenses[0].category).toBe('Books & Supplies');
    expect(categoryExpenses[0].amount).toBe(150);
    expect(categoryExpenses[0].percentage).toBe(75);

    // Food: 50 out of 200 = 25%
    expect(categoryExpenses[1].category).toBe('Food');
    expect(categoryExpenses[1].amount).toBe(50);
    expect(categoryExpenses[1].percentage).toBe(25);
  });

  describe('filterAndSortTransactions', () => {
    it('filters by transaction type', () => {
      const expensesOnly = filterAndSortTransactions(mockTransactions, {
        search: '',
        type: 'Expense',
        category: 'All',
        sortBy: 'date-desc',
      });
      expect(expensesOnly).toHaveLength(2);
      expect(expensesOnly.every((t) => t.type === 'Expense')).toBe(true);
    });

    it('filters by category', () => {
      const foodOnly = filterAndSortTransactions(mockTransactions, {
        search: '',
        type: 'All',
        category: 'Food',
        sortBy: 'date-desc',
      });
      expect(foodOnly).toHaveLength(1);
      expect(foodOnly[0].description).toBe('Campus Cafeteria Meal');
    });

    it('filters by search term in description', () => {
      const results = filterAndSortTransactions(mockTransactions, {
        search: 'bio',
        type: 'All',
        category: 'All',
        sortBy: 'date-desc',
      });
      expect(results).toHaveLength(1);
      expect(results[0].description).toBe('Biology Textbooks');
    });

    it('sorts by amount descending', () => {
      const sorted = filterAndSortTransactions(mockTransactions, {
        search: '',
        type: 'All',
        category: 'All',
        sortBy: 'amount-desc',
      });
      expect(sorted[0].amount).toBe(500);
      expect(sorted[3].amount).toBe(50);
    });
  });
});

