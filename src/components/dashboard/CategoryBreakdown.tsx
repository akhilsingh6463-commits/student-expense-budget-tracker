import React from 'react';
import { PieChart } from 'lucide-react';
import { Category } from '../../types/transaction';
import { formatCurrency, CATEGORY_COLORS } from '../../utils/formatters';
import { Card } from '../common/Card';

interface CategoryBreakdownProps {
  categories: { category: Category; amount: number; percentage: number; count: number }[];
  currency?: string;
}

export const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({
  categories,
  currency = 'USD',
}) => {
  if (categories.length === 0) {
    return (
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <PieChart className="w-5 h-5 text-indigo-600" />
          <h3 className="text-sm font-bold text-slate-900">Expense Breakdown</h3>
        </div>
        <p className="text-xs text-slate-400 py-4 text-center">
          No expenses recorded yet. Once you log expenses, your category distribution will appear here.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
            <PieChart className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Spending by Category</h3>
            <p className="text-xs text-slate-500">Distribution across campus expense categories</p>
          </div>
        </div>
        <span className="text-xs font-semibold text-slate-400">
          {categories.length} {categories.length === 1 ? 'category' : 'categories'}
        </span>
      </div>

      <div className="space-y-3.5">
        {categories.map((item) => {
          const colorMeta = CATEGORY_COLORS[item.category] || CATEGORY_COLORS.Other;
          return (
            <div key={item.category} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-medium">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: colorMeta.dot }}
                  />
                  <span className="text-slate-800 font-medium">{item.category}</span>
                  <span className="text-slate-400 text-[11px]">({item.count})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-900 font-semibold">
                    {formatCurrency(item.amount, currency)}
                  </span>
                  <span className="text-slate-400 text-[11px] w-8 text-right font-mono">
                    {item.percentage}%
                  </span>
                </div>
              </div>

              {/* Mini category bar */}
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${item.percentage}%`,
                    backgroundColor: colorMeta.dot,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

