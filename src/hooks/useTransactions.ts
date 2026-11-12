import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Transaction,
  TransactionFiltersState,
  FinancialSummaryData,
} from '../types/transaction';
import { storageService } from '../services/storage';
import {
  calculateFinancialSummary,
  calculateCategoryTotals,
  filterAndSortTransactions,
} from '../utils/calculations';

const DEFAULT_FILTERS: TransactionFiltersState = {
  search: '',
  type: 'All',
  category: 'All',
  sortBy: 'date-desc',
  hasReceiptOnly: false,
};

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filters, setFilters] = useState<TransactionFiltersState>(DEFAULT_FILTERS);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Load transactions once on mount through storage service
  useEffect(() => {
    try {
      const data = storageService.getTransactions();
      setTransactions(data);
    } catch {
      setFeedback({ type: 'error', message: 'Failed to load transactions from local storage.' });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Show auto-dismissing feedback messages
  const triggerFeedback = useCallback((type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback((current) => (current?.message === message ? null : current));
    }, 3500);
  }, []);

  // Filtered and sorted transactions (derived state)
  const filteredTransactions = useMemo(() => {
    return filterAndSortTransactions(transactions, filters);
  }, [transactions, filters]);

  // Real-time financial summary (derived state)
  const summary: FinancialSummaryData = useMemo(() => {
    return calculateFinancialSummary(transactions);
  }, [transactions]);

  // Category breakdown for expenses
  const categoryExpenses = useMemo(() => {
    return calculateCategoryTotals(transactions, 'Expense');
  }, [transactions]);

  // Category breakdown for income
  const categoryIncome = useMemo(() => {
    return calculateCategoryTotals(transactions, 'Income');
  }, [transactions]);

  // Add transaction
  const addTransaction = useCallback(
    (item: Omit<Transaction, 'id' | 'createdAt'>): Transaction => {
      const created = storageService.addTransaction(item);
      setTransactions((prev) => [created, ...prev]);
      triggerFeedback('success', `Added "${created.description}" successfully.`);
      return created;
    },
    [triggerFeedback]
  );

  // Update transaction
  const updateTransaction = useCallback(
    (id: string, updates: Partial<Transaction>): Transaction => {
      const updated = storageService.updateTransaction(id, updates);
      setTransactions((prev) => prev.map((t) => (t.id === id ? updated : t)));
      triggerFeedback('success', `Updated "${updated.description}" successfully.`);
      return updated;
    },
    [triggerFeedback]
  );

  // Delete transaction
  const deleteTransaction = useCallback(
    (id: string) => {
      const target = transactions.find((t) => t.id === id);
      storageService.deleteTransaction(id);
      setTransactions((prev) => prev.filter((t) => t.id !== id));
      triggerFeedback('success', `Deleted "${target?.description || 'transaction'}" successfully.`);
    },
    [transactions, triggerFeedback]
  );

  // Clear all
  const clearAll = useCallback(() => {
    storageService.clearAllTransactions();
    setTransactions([]);
    triggerFeedback('success', 'Cleared all transaction records.');
  }, [triggerFeedback]);

  // Reset to sample data
  const resetToSampleData = useCallback(() => {
    const samples = storageService.resetToSampleData();
    setTransactions(samples);
    setFilters(DEFAULT_FILTERS);
    triggerFeedback('success', 'Reset dashboard to sample student dataset.');
  }, [triggerFeedback]);

  // Export JSON
  const exportJson = useCallback(() => {
    const jsonStr = storageService.exportToJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `student-budget-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    triggerFeedback('success', 'Exported transactions to JSON.');
  }, [triggerFeedback]);

  // Export CSV
  const exportCsv = useCallback(() => {
    const csvStr = storageService.exportToCsv();
    const blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `student-budget-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    triggerFeedback('success', 'Exported transactions to CSV.');
  }, [triggerFeedback]);

  // Import JSON
  const importJson = useCallback(
    (fileContent: string): boolean => {
      const result = storageService.importFromJson(fileContent);
      if (result.success) {
        const refreshed = storageService.getTransactions();
        setTransactions(refreshed);
        triggerFeedback('success', `Successfully imported ${result.count} transactions.`);
        return true;
      } else {
        triggerFeedback('error', result.error || 'Failed to import data.');
        return false;
      }
    },
    [triggerFeedback]
  );

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  return {
    transactions,
    filteredTransactions,
    summary,
    categoryExpenses,
    categoryIncome,
    filters,
    setFilters,
    resetFilters,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    clearAll,
    resetToSampleData,
    exportJson,
    exportCsv,
    importJson,
    isLoading,
    feedback,
  };
};
