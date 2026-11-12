import React from 'react';
import { ArrowUpRight, ArrowDownRight, Wallet, PiggyBank, Sparkles } from 'lucide-react';
import { FinancialSummaryData } from '../../types/transaction';
import { formatCurrency } from '../../utils/formatters';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

interface FinancialSummaryProps {
  summary: FinancialSummaryData;
  currency?: string;
}

export const FinancialSummary: React.FC<FinancialSummaryProps> = ({
  summary,
  currency = 'USD',
}) => {
  const isPositiveBalance = summary.netBalance >= 0;

  return (
    <section aria-label="Financial Summary Cards" className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Income Card */}
        <Card className="p-5 relative overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-md border-emerald-100 bg-gradient-to-br from-white to-emerald-50/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Income
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight" data-testid="total-income">
              {formatCurrency(summary.totalIncome, currency)}
            </h2>
            <div className="flex items-center gap-2 pt-1">
              <Badge variant="success" size="sm">
                +{summary.incomeCount} {summary.incomeCount === 1 ? 'entry' : 'entries'}
              </Badge>
              <span className="text-xs text-slate-400">stipends & funds</span>
            </div>
          </div>
        </Card>

        {/* Total Expenses Card */}
        <Card className="p-5 relative overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-md border-rose-100 bg-gradient-to-br from-white to-rose-50/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Expenses
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <ArrowDownRight className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight" data-testid="total-expenses">
              {formatCurrency(summary.totalExpenses, currency)}
            </h2>
            <div className="flex items-center gap-2 pt-1">
              <Badge variant="danger" size="sm">
                -{summary.expenseCount} {summary.expenseCount === 1 ? 'entry' : 'entries'}
              </Badge>
              <span className="text-xs text-slate-400">campus living</span>
            </div>
          </div>
        </Card>

        {/* Net Balance Card */}
        <Card
          className={`p-5 relative overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-md ${
            isPositiveBalance
              ? 'border-indigo-100 bg-gradient-to-br from-white to-indigo-50/30'
              : 'border-amber-200 bg-gradient-to-br from-white to-amber-50/30'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Net Balance
            </span>
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                isPositiveBalance
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-amber-100 text-amber-700'
              }`}
            >
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <h2
              className={`text-2xl font-bold tracking-tight ${
                isPositiveBalance ? 'text-indigo-950' : 'text-amber-800'
              }`}
              data-testid="net-balance"
            >
              {formatCurrency(summary.netBalance, currency)}
            </h2>
            <div className="flex items-center gap-1.5 pt-1 text-xs text-slate-500">
              <span className="font-mono text-[11px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                Income - Expenses
              </span>
              <span className="text-[11px] text-slate-400">dynamic</span>
            </div>
          </div>
        </Card>

        {/* Student Savings Rate / Financial Wellness Card */}
        <Card className="p-5 relative overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-md border-purple-100 bg-gradient-to-br from-white to-purple-50/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Savings Rate
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <PiggyBank className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight" data-testid="savings-rate">
                {summary.savingsRate}%
              </h2>
              <span className="text-xs text-slate-400">of income saved</span>
            </div>
            <div className="flex items-center gap-1.5 pt-1">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span className="text-xs font-medium text-purple-700">
                {summary.savingsRate >= 30
                  ? 'Great financial discipline!'
                  : summary.savingsRate > 0
                  ? 'Building positive cushion'
                  : 'Spending matches or exceeds income'}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};
