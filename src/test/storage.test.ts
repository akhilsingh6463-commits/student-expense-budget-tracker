import { describe, it, expect, beforeEach } from 'vitest';
import { storageService, DEFAULT_BUDGET_CONFIG } from '../services/storage';

describe('StorageService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes with sample student data when storage is empty', () => {
    const list = storageService.getTransactions();
    expect(list.length).toBeGreaterThan(0);
    expect(list[0]).toHaveProperty('id');
    expect(list[0]).toHaveProperty('description');
    expect(list[0]).toHaveProperty('amount');
  });

  it('adds a transaction immutably with generated id and timestamp', () => {
    const newTx = storageService.addTransaction({
      description: 'Lab Equipment Purchase',
      amount: 45.99,
      type: 'Expense',
      category: 'Education',
      date: '2026-11-12',
    });

    expect(newTx.id).toBeDefined();
    expect(newTx.createdAt).toBeDefined();
    expect(newTx.description).toBe('Lab Equipment Purchase');

    const stored = storageService.getTransactions();
    expect(stored[0].id).toBe(newTx.id);
  });

  it('updates an existing transaction immutably', () => {
    const added = storageService.addTransaction({
      description: 'Notebooks',
      amount: 15.0,
      type: 'Expense',
      category: 'Books & Supplies',
      date: '2026-11-12',
    });

    const updated = storageService.updateTransaction(added.id, {
      amount: 18.5,
      description: 'Notebooks & Highlighters',
    });

    expect(updated.amount).toBe(18.5);
    expect(updated.description).toBe('Notebooks & Highlighters');

    const list = storageService.getTransactions();
    const found = list.find((t) => t.id === added.id);
    expect(found?.amount).toBe(18.5);
  });

  it('deletes a transaction immutably', () => {
    const added = storageService.addTransaction({
      description: 'Temp Item to delete',
      amount: 10,
      type: 'Expense',
      category: 'Other',
      date: '2026-11-12',
    });

    const afterDelete = storageService.deleteTransaction(added.id);
    expect(afterDelete.find((t) => t.id === added.id)).toBeUndefined();
  });

  it('persists and retrieves budget configuration', () => {
    expect(storageService.getBudgetConfig()).toEqual(DEFAULT_BUDGET_CONFIG);

    storageService.saveBudgetConfig({
      monthlyLimit: 2000,
      currency: 'EUR',
      warningThreshold: 85,
    });

    const saved = storageService.getBudgetConfig();
    expect(saved.monthlyLimit).toBe(2000);
    expect(saved.currency).toBe('EUR');
    expect(saved.warningThreshold).toBe(85);
  });

  it('exports and imports JSON data properly', () => {
    const jsonOutput = storageService.exportToJson();
    expect(jsonOutput).toContain('transactions');
    expect(jsonOutput).toContain('budgetConfig');

    storageService.clearAllTransactions();
    expect(storageService.getTransactions()).toHaveLength(0);

    const result = storageService.importFromJson(jsonOutput);
    expect(result.success).toBe(true);
    expect(storageService.getTransactions().length).toBeGreaterThan(0);
  });
});
