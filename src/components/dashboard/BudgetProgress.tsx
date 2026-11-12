import React, { useState } from 'react';
import { Target, Settings2, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { BudgetConfig } from '../../types/transaction';
import { formatCurrency } from '../../utils/formatters';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Badge } from '../common/Badge';

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
  const [thresholdInput, setThresholdInput] = useState(budgetConfig.warningThreshold.toString());

  const limit = budgetConfig.monthlyLimit;
  const percentage = limit > 0 ? Math.min(Math.round((totalExpenses / limit) * 100), 100) : 0;
  const rawPercentage = limit > 0 ? (totalExpenses / limit) * 100 : 0;
  const remaining = Math.max(0, limit - totalExpenses);
  const isOver = totalExpenses > limit;
  const isNear = !isOver && rawPercentage >= budgetConfig.warningThreshold;

  const handleOpenModal = () => {
    setLimitInput(budgetConfig.monthlyLimit.toString());
    setThresholdInput(budgetConfig.warningThreshold.toString());
    setIsModalOpen(true);
  };

  const handleSaveBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedLimit = parseFloat(limitInput);
    const parsedThreshold = parseFloat(thresholdInput);
    if (!isNaN(parsedLimit) && parsedLimit > 0) {
      onUpdateBudget({
        monthlyLimit: parsedLimit,
        warningThreshold: !isNaN(parsedThreshold) ? Math.min(Math.max(parsedThreshold, 10), 99) : 80,
      });
      setIsModalOpen(false);
    }
  };

  // Color classes depending on budget condition
  const getBarColor = () => {
    if (isOver) return 'bg-rose-500';
    if (isNear) return 'bg-amber-500';
    return 'bg-indigo-600';
  };

  return (
    <>
      <Card className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Student Monthly Budget Cap</h3>
              <p className="text-xs text-slate-500">
                Track campus spending against your allocated monthly limit
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isOver ? (
              <Badge variant="danger" icon={<ShieldAlert className="w-3.5 h-3.5" />}>
                Over Budget ({Math.round(rawPercentage)}%)
              </Badge>
            ) : isNear ? (
              <Badge variant="warning" icon={<AlertTriangle className="w-3.5 h-3.5" />}>
                Near Cap ({Math.round(rawPercentage)}%)
              </Badge>
            ) : (
              <Badge variant="success" icon={<CheckCircle2 className="w-3.5 h-3.5" />}>
                On Track ({Math.round(rawPercentage)}%)
              </Badge>
            )}
            <button
              onClick={handleOpenModal}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              title="Adjust Budget"
              aria-label="Adjust Budget"
            >
              <Settings2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2 mt-4">
          <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
            <div
              className={`h-full rounded-full transition-all duration-500 ${getBarColor()}`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium pt-1">
            <span>Spent: {formatCurrency(totalExpenses, budgetConfig.currency)}</span>
            <span>
              {isOver
                ? `Exceeded by ${formatCurrency(totalExpenses - limit, budgetConfig.currency)}`
                : `Remaining: ${formatCurrency(remaining, budgetConfig.currency)}`}
            </span>
            <span className="text-slate-700 font-semibold">
              Cap: {formatCurrency(limit, budgetConfig.currency)}
            </span>
          </div>
        </div>
      </Card>

      {/* Adjust Budget Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Adjust Student Monthly Budget"
      >
        <form onSubmit={handleSaveBudget} className="space-y-4">
          <Input
            label="Monthly Expense Cap"
            type="number"
            step="10"
            min="10"
            value={limitInput}
            onChange={(e) => setLimitInput(e.target.value)}
            helperText="Set the maximum amount you plan to spend per month on tuition, meals, dorm, and living."
            required
          />
          <Input
            label="Warning Alert Threshold (%)"
            type="number"
            step="5"
            min="10"
            max="95"
            value={thresholdInput}
            onChange={(e) => setThresholdInput(e.target.value)}
            helperText="Receive visual warning status once expenses exceed this percentage of your cap."
            required
          />
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Save Budget
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};
