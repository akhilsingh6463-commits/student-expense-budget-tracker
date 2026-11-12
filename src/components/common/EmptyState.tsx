import React from 'react';
import { Receipt, Search, PlusCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  type?: 'no-data' | 'no-results';
  onActionClick?: () => void;
  onResetFilters?: () => void;
  onLoadSamples?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type = 'no-data',
  onActionClick,
  onResetFilters,
  onLoadSamples,
}) => {
  if (type === 'no-results') {
    return (
      <div className="py-12 px-4 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
          <Search className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-semibold text-slate-900 mb-1">No transactions found</h4>
        <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
          No records match your active search and filter criteria. Try adjusting or clearing your filters.
        </p>
        {onResetFilters && (
          <Button
            size="sm"
            variant="outline"
            onClick={onResetFilters}
            icon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Reset Filters
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="py-16 px-4 text-center bg-slate-50/60 rounded-2xl border-2 border-dashed border-slate-200">
      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
        <Receipt className="w-8 h-8" />
      </div>
      <h3 className="text-base font-bold text-slate-900 mb-1">No Transactions Recorded Yet</h3>
      <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
        Start tracking your campus expenses, tuition allowances, dining plans, or salary. Add your first transaction above or load sample student data to preview the dashboard.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {onActionClick && (
          <Button
            size="md"
            variant="primary"
            onClick={onActionClick}
            icon={<PlusCircle className="w-4 h-4" />}
          >
            Add New Transaction
          </Button>
        )}
        {onLoadSamples && (
          <Button
            size="md"
            variant="outline"
            onClick={onLoadSamples}
            icon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Load Student Sample Data
          </Button>
        )}
      </div>
    </div>
  );
};
