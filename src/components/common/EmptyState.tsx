import React from 'react';
import { Search, PlusCircle, RefreshCw } from 'lucide-react';
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
      <div className="py-10 px-4 text-center bg-white rounded-xl border border-dashed border-slate-200">
        <div className="w-9 h-9 mx-auto mb-2 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <h4 className="text-xs font-semibold text-slate-900 mb-1">No transactions found</h4>
        <p className="text-xs text-slate-400 max-w-xs mx-auto mb-3">
          No records match your active filters.
        </p>
        {onResetFilters && (
          <Button
            size="sm"
            variant="outline"
            onClick={onResetFilters}
            icon={<RefreshCw className="w-3 h-3" />}
          >
            Reset Filters
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="py-12 px-4 text-center bg-white rounded-xl border border-dashed border-slate-200">
      <h3 className="text-sm font-semibold text-slate-900 mb-1">No Transactions Recorded Yet</h3>
      <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
        Log allowances, meals, textbooks, or load sample campus data to begin.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {onActionClick && (
          <Button
            size="sm"
            variant="primary"
            onClick={onActionClick}
            icon={<PlusCircle className="w-3.5 h-3.5" />}
          >
            Add New Transaction
          </Button>
        )}
        {onLoadSamples && (
          <Button
            size="sm"
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
