import React from 'react';
import { Category } from '../../types/transaction';
import { formatCurrency, CATEGORY_COLORS } from '../../utils/formatters';

interface CategoryBreakdownProps {
  categories: { category: Category; amount: number; percentage: number; count: number }[];
  currency?: string;
}

export const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({
  categories,
  currency = 'USD',
}) => {
  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/70 shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-900">Spending by Category</span>
        <span className="text-[11px] text-slate-400">
          {categories.length} {categories.length === 1 ? 'category' : 'categories'}
        </span>
      </div>

      <div className="space-y-2.5">
        {categories.slice(0, 5).map((item) => {
          const colorMeta = CATEGORY_COLORS[item.category] || CATEGORY_COLORS.Other;
          return (
            <div key={item.category} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: colorMeta.dot }}
                  />
                  <span className="text-slate-700">{item.category}</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[11px]">
                  <span className="text-slate-900 font-medium">
                    {formatCurrency(item.amount, currency)}
                  </span>
                  <span className="text-slate-400 w-7 text-right">
                    {item.percentage}%
                  </span>
                </div>
              </div>
              <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
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
    </div>
  );
};
