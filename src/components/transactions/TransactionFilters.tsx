import React from 'react';
import { Search, RotateCcw, Paperclip } from 'lucide-react';
import {
  TransactionFiltersState,
  TransactionType,
  Category,
} from '../../types/transaction';
import { VALID_CATEGORIES } from '../../utils/validators';

interface TransactionFiltersProps {
  filters: TransactionFiltersState;
  onFilterChange: (updates: Partial<TransactionFiltersState>) => void;
  onResetFilters: () => void;
  totalCount: number;
  filteredCount: number;
}

export const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  totalCount,
  filteredCount,
}) => {
  const hasActiveFilters =
    filters.search !== '' ||
    filters.type !== 'All' ||
    filters.category !== 'All' ||
    filters.sortBy !== 'date-desc' ||
    Boolean(filters.hasReceiptOnly);

  return (
    <div className="bg-white rounded-xl border border-slate-200/70 p-3 shadow-xs space-y-2.5">
      {/* Search and Type Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search transactions by title or category..."
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border-0 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-400 placeholder:text-slate-400"
          />
        </div>

        {/* Type Filter Pills */}
        <div className="inline-flex items-center p-0.5 bg-slate-100 rounded-lg" data-testid="type-filter-pills">
          {(['All', 'Expense', 'Income'] as const).map((typeOpt) => {
            const isActive = filters.type === typeOpt;
            return (
              <button
                key={typeOpt}
                data-testid={`filter-type-${typeOpt.toLowerCase()}`}
                onClick={() => onFilterChange({ type: typeOpt as 'All' | TransactionType })}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {typeOpt}
              </button>
            );
          })}
        </div>
      </div>

      {/* Category, Sort, Receipts and Count */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <select
            value={filters.category}
            onChange={(e) => onFilterChange({ category: e.target.value as 'All' | Category })}
            className="bg-slate-50 border-0 rounded-md px-2 py-1 text-xs text-slate-700 font-medium focus:ring-1 focus:ring-slate-300 cursor-pointer"
          >
            <option value="All">All Categories</option>
            {VALID_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={filters.sortBy}
            onChange={(e) =>
              onFilterChange({
                sortBy: e.target.value as TransactionFiltersState['sortBy'],
              })
            }
            className="bg-slate-50 border-0 rounded-md px-2 py-1 text-xs text-slate-700 font-medium focus:ring-1 focus:ring-slate-300 cursor-pointer"
          >
            <option value="date-desc">Newest</option>
            <option value="date-asc">Oldest</option>
            <option value="amount-desc">Highest</option>
            <option value="amount-asc">Lowest</option>
          </select>

          <button
            type="button"
            onClick={() => onFilterChange({ hasReceiptOnly: !filters.hasReceiptOnly })}
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-colors ${
              filters.hasReceiptOnly
                ? 'bg-indigo-50 text-indigo-700'
                : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
            }`}
          >
            <Paperclip className="w-3 h-3" />
            Receipt
          </button>
        </div>

        {/* Counter and Reset */}
        <div className="flex items-center gap-2 text-slate-400 text-[11px]">
          <span data-testid="filter-counter">
            Showing <strong className="text-slate-700">{filteredCount}</strong> of {totalCount}
          </span>
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="text-slate-400 hover:text-slate-700 flex items-center gap-1"
              title="Reset Filters"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
