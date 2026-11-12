import React, { useState } from 'react';
import { Settings2 } from 'lucide-react';
import { BudgetConfig } from '../../types/transaction';
import { formatCurrency } from '../../utils/formatters';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';

interface BudgetProgressProps {
  budgetConfig: BudgetConfig;
  totalExpenses: number;
  onUpdateBudget: (newConfig: Partial<BudgetConfig>) => void;
}

export const BudgetProgress: React.FC<BudgetProgressProps> = ({
  budgetConfig,
  totalExpenses,
  onUpdateBudget,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [limitInput, setLimitInput] = useState(budgetConfig.monthlyLimit.toString());

  const limit = budgetConfig.monthlyLimit;
  const percentage = limit > 0 ? Math.min(Math.round((totalExpenses / limit) * 100), 100) : 0;
  const isOver = totalExpenses > limit;
  const remaining = Math.max(0, limit - totalExpenses);

  const handleOpenModal = () => {
    setLimitInput(budgetConfig.monthlyLimit.toString());
    setIsModalOpen(true);
  };

  const handleSaveBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedLimit = parseFloat(limitInput);
    if (!isNaN(parsedLimit) && parsedLimit > 0) {
      onUpdateBudget({ monthlyLimit: parsedLimit });
      setIsModalOpen(false);
    }
  };

  return (
    <>
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/70 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-900">Monthly Budget</span>
            <button
              onClick={handleOpenModal}
              className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
              title="Edit Budget"
              aria-label="Edit Budget"
            >
              <Settings2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <span
            className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
              isOver
                ? 'bg-rose-50 text-rose-700'
                : percentage >= budgetConfig.warningThreshold
                ? 'bg-amber-50 text-amber-700'
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            {isOver ? 'Over Budget' : `${percentage}% used`}
          </span>
        </div>

        {/* Minimal Bar */}
        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mb-2">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              isOver ? 'bg-rose-500' : 'bg-slate-900'
            }`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>
            {formatCurrency(totalExpenses, budgetConfig.currency)} of{' '}
            {formatCurrency(limit, budgetConfig.currency)}
          </span>
          <span className="font-medium text-slate-700">
            {isOver
              ? `Exceeded by ${formatCurrency(totalExpenses - limit, budgetConfig.currency)}`
              : `${formatCurrency(remaining, budgetConfig.currency)} left`}
          </span>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Set Monthly Budget"
        maxWidth="sm"
      >
        <form onSubmit={handleSaveBudget} className="space-y-4">
          <Input
            label="Monthly Limit"
            type="number"
            step="10"
            min="10"
            value={limitInput}
            onChange={(e) => setLimitInput(e.target.value)}
            required
          />
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Save
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};
