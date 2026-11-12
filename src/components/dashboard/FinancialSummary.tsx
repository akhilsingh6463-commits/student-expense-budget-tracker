import React from 'react';
import { FinancialSummaryData } from '../../types/transaction';
import { formatCurrency } from '../../utils/formatters';

interface FinancialSummaryProps {
  summary: FinancialSummaryData;
  currency?: string;
}

export const FinancialSummary: React.FC<FinancialSummaryProps> = ({
  summary,
  currency = 'USD',
}) => {
  return (
    <section aria-label="Financial Summary" className="w-full">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Income */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/70 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-medium">Total Income</span>
            <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
              +{summary.incomeCount} {summary.incomeCount === 1 ? 'entry' : 'entries'}
            </span>
          </div>
          <div
            className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight"
            data-testid="total-income"
          >
            {formatCurrency(summary.totalIncome, currency)}
          </div>
        </div>

        {/* Total Expenses */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/70 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-medium">Total Expenses</span>
            <span className="text-[11px] font-medium text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded">
              -{summary.expenseCount} {summary.expenseCount === 1 ? 'entry' : 'entries'}
            </span>
          </div>
          <div
            className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight"
            data-testid="total-expenses"
          >
            {formatCurrency(summary.totalExpenses, currency)}
          </div>
        </div>

        {/* Net Balance */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/70 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-medium">Net Balance</span>
            <span
              className={`text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded ${
                summary.netBalance >= 0
                  ? 'text-indigo-700 bg-indigo-50'
                  : 'text-amber-700 bg-amber-50'
              }`}
            >
              {summary.netBalance >= 0 ? 'Surplus' : 'Deficit'}
            </span>
          </div>
          <div
            className={`text-xl sm:text-2xl font-bold tracking-tight ${
              summary.netBalance >= 0 ? 'text-slate-900' : 'text-amber-700'
            }`}
            data-testid="net-balance"
          >
            {formatCurrency(summary.netBalance, currency)}
          </div>
        </div>

        {/* Savings Rate */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/70 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-medium">Savings Rate</span>
            <span className="text-[11px] text-slate-400 font-mono">
              {summary.savingsRate > 0 ? `${summary.savingsRate}% saved` : '0%'}
            </span>
          </div>
          <div
            className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight"
            data-testid="savings-rate"
          >
            {summary.savingsRate}%
          </div>
        </div>
      </div>
    </section>
  );
};
