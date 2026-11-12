import { useState, useEffect, useCallback } from 'react';
import { BudgetConfig } from '../types/transaction';
import { storageService, DEFAULT_BUDGET_CONFIG } from '../services/storage';

export const useBudget = (currentTotalExpenses: number = 0) => {
  const [budgetConfig, setBudgetConfig] = useState<BudgetConfig>(DEFAULT_BUDGET_CONFIG);

  useEffect(() => {
    try {
      const config = storageService.getBudgetConfig();
      setBudgetConfig(config);
    } catch {
      setBudgetConfig(DEFAULT_BUDGET_CONFIG);
    }
  }, []);

  const updateBudgetConfig = useCallback((newConfig: Partial<BudgetConfig>) => {
    setBudgetConfig((prev) => {
      const updated = { ...prev, ...newConfig };
      storageService.saveBudgetConfig(updated);
      return updated;
    });
  }, []);

  const percentUsed = budgetConfig.monthlyLimit > 0
    ? Math.round((currentTotalExpenses / budgetConfig.monthlyLimit) * 100)
    : 0;

  const remainingBudget = Math.max(0, budgetConfig.monthlyLimit - currentTotalExpenses);
  const isOverBudget = currentTotalExpenses > budgetConfig.monthlyLimit;
  const isNearBudget =
    !isOverBudget && percentUsed >= budgetConfig.warningThreshold;

  return {
    budgetConfig,
    updateBudgetConfig,
    percentUsed,
    remainingBudget,
    isOverBudget,
    isNearBudget,
  };
};

