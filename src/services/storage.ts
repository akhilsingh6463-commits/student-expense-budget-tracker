import { Transaction, BudgetConfig } from '../types/transaction';
import { INITIAL_STUDENT_TRANSACTIONS } from '../assets/sampleData';

const TRANSACTIONS_KEY = 'student_expense_tracker_transactions_v1';
const BUDGET_CONFIG_KEY = 'student_expense_tracker_budget_config_v1';

export const DEFAULT_BUDGET_CONFIG: BudgetConfig = {
  monthlyLimit: 1200,
  currency: 'USD',
  warningThreshold: 80,
};

/**
 * Storage Service encapsulating browser storage persistence
 * Strictly decouples persistence mechanism from UI components.
 */
export const storageService = {
  /**
   * Retrieves all transactions from localStorage.
   * If empty or corrupted, initializes with sample data.
   */
  getTransactions(): Transaction[] {
    try {
      const stored = localStorage.getItem(TRANSACTIONS_KEY);
      if (!stored) {
        // Initialize with realistic student sample data
        this.saveTransactions(INITIAL_STUDENT_TRANSACTIONS);
        return [...INITIAL_STUDENT_TRANSACTIONS];
      }
      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed)) {
        return [];
      }
      return parsed;
    } catch (error) {
      console.error('[StorageService] Error loading transactions:', error);
      return [];
    }
  },

  /**
   * Saves transaction array to localStorage
   */
  saveTransactions(transactions: Transaction[]): void {
    try {
      localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
    } catch (error) {
      console.error('[StorageService] Error saving transactions:', error);
      throw new Error('Failed to save transactions. Local storage might be full.');
    }
  },

  /**
   * Adds a new transaction item immutably
   */
  addTransaction(item: Omit<Transaction, 'id' | 'createdAt'>): Transaction {
    const current = this.getTransactions();
    const newTransaction: Transaction = {
      ...item,
      id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [newTransaction, ...current];
    this.saveTransactions(updated);
    return newTransaction;
  },

  /**
   * Updates an existing transaction immutably
   */
  updateTransaction(id: string, updates: Partial<Transaction>): Transaction {
    const current = this.getTransactions();
    const index = current.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new Error(`Transaction with id "${id}" not found.`);
    }

    const updatedItem: Transaction = {
      ...current[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    const updatedList = [
      ...current.slice(0, index),
      updatedItem,
      ...current.slice(index + 1),
    ];

    this.saveTransactions(updatedList);
    return updatedItem;
  },

  /**
   * Deletes a transaction by ID immutably
   */
  deleteTransaction(id: string): Transaction[] {
    const current = this.getTransactions();
    const updated = current.filter((t) => t.id !== id);
    this.saveTransactions(updated);
    return updated;
  },

  /**
   * Clears all transactions
   */
  clearAllTransactions(): void {
    this.saveTransactions([]);
  },

  /**
   * Resets transactions to initial sample set
   */
  resetToSampleData(): Transaction[] {
    this.saveTransactions(INITIAL_STUDENT_TRANSACTIONS);
    return [...INITIAL_STUDENT_TRANSACTIONS];
  },

  /**
   * Retrieves budget configuration
   */
  getBudgetConfig(): BudgetConfig {
    try {
      const stored = localStorage.getItem(BUDGET_CONFIG_KEY);
      if (!stored) {
        return { ...DEFAULT_BUDGET_CONFIG };
      }
      return { ...DEFAULT_BUDGET_CONFIG, ...JSON.parse(stored) };
    } catch {
      return { ...DEFAULT_BUDGET_CONFIG };
    }
  },

  /**
   * Saves budget configuration
   */
  saveBudgetConfig(config: BudgetConfig): void {
    try {
      localStorage.setItem(BUDGET_CONFIG_KEY, JSON.stringify(config));
    } catch (error) {
      console.error('[StorageService] Error saving budget config:', error);
    }
  },

  /**
   * Exports data to JSON string
   */
  exportToJson(): string {
    const data = {
      transactions: this.getTransactions(),
      budgetConfig: this.getBudgetConfig(),
      exportedAt: new Date().toISOString(),
      version: '1.0',
    };
    return JSON.stringify(data, null, 2);
  },

  /**
   * Imports data from JSON string
   */
  importFromJson(jsonString: string): { success: boolean; count?: number; error?: string } {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || !Array.isArray(parsed.transactions)) {
        return { success: false, error: 'Invalid JSON format: missing transactions array' };
      }

      // Validate each item has required fields
      const validTransactions: Transaction[] = parsed.transactions.filter(
        (t: unknown): t is Transaction => {
          if (typeof t !== 'object' || t === null) return false;
          const candidate = t as Partial<Transaction>;
          return (
            typeof candidate.id === 'string' &&
            typeof candidate.description === 'string' &&
            typeof candidate.amount === 'number' &&
            (candidate.type === 'Income' || candidate.type === 'Expense') &&
            typeof candidate.category === 'string' &&
            typeof candidate.date === 'string'
          );
        }
      );

      this.saveTransactions(validTransactions);

      if (parsed.budgetConfig && typeof parsed.budgetConfig === 'object') {
        this.saveBudgetConfig(parsed.budgetConfig);
      }

      return { success: true, count: validTransactions.length };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'JSON parse failure';
      return { success: false, error: message };
    }
  },

  /**
   * Exports data to CSV string
   */
  exportToCsv(): string {
    const transactions = this.getTransactions();
    const headers = ['ID', 'Date', 'Description', 'Type', 'Category', 'Amount', 'HasReceipt'];
    const rows = transactions.map((t) => [
      `"${t.id}"`,
      `"${t.date}"`,
      `"${t.description.replace(/"/g, '""')}"`,
      `"${t.type}"`,
      `"${t.category}"`,
      t.amount,
      t.receipt ? 'Yes' : 'No',
    ]);
    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  },
};

