import React from 'react';
import { Search, RotateCcw, Paperclip } from 'lucide-react';
import {
  TransactionFiltersState,
  TransactionType,
  Category,
} from '../../types/transaction';
import { VALID_CATEGORIES } from '../../utils/validators';
import { Button } from '../common/Button';

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
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm space-y-3">
      {/* Search and Quick Type Pills */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search transactions by title or category..."
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            className="block w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 placeholder:text-slate-400"
          />
        </div>

        {/* Type Filter Pills */}
        <div className="inline-flex items-center p-1 bg-slate-100 rounded-xl">
          {(['All', 'Expense', 'Income'] as const).map((typeOpt) => {
            const isActive = filters.type === typeOpt;
            return (
              <button
                key={typeOpt}
                onClick={() => onFilterChange({ type: typeOpt as 'All' | TransactionType })}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {typeOpt}
              </button>
            );
          })}
        </div>
      </div>

      {/* Category, Sort, and Receipt Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Dropdown */}
          <select
            value={filters.category}
            onChange={(e) => onFilterChange({ category: e.target.value as 'All' | Category })}
            className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="All">All Categories</option>
            {VALID_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Sort By Dropdown */}
          <select
            value={filters.sortBy}
            onChange={(e) =>
              onFilterChange({
                sortBy: e.target.value as TransactionFiltersState['sortBy'],
              })
            }
            className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="amount-desc">Amount: High to Low</option>
            <option value="amount-asc">Amount: Low to High</option>
          </select>

          {/* Receipts Only Toggle */}
          <button
            type="button"
            onClick={() => onFilterChange({ hasReceiptOnly: !filters.hasReceiptOnly })}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
              filters.hasReceiptOnly
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Paperclip className="w-3.5 h-3.5" />
            With Receipt
          </button>
        </div>

        {/* Counter and Reset */}
        <div className="flex items-center gap-2 text-slate-500">
          <span>
            Showing <strong className="text-slate-800">{filteredCount}</strong> of {totalCount}
          </span>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onResetFilters}
              icon={<RotateCcw className="w-3 h-3" />}
              className="text-xs py-1 px-2 h-auto text-slate-500 hover:text-indigo-600"
            >
              Reset
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

