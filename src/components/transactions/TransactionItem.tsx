import React from 'react';
import {
  Paperclip,
  Trash2,
  Pencil,
} from 'lucide-react';
import { Transaction } from '../../types/transaction';
import {
  formatCurrency,
  formatDate,
  CATEGORY_COLORS,
} from '../../utils/formatters';

interface TransactionItemProps {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
  onDeleteRequest: (transaction: Transaction) => void;
  onViewReceipt: (transaction: Transaction) => void;
  currency?: string;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  onEdit,
  onDeleteRequest,
  onViewReceipt,
  currency = 'USD',
}) => {
  const isIncome = transaction.type === 'Income';
  const colorMeta = CATEGORY_COLORS[transaction.category] || CATEGORY_COLORS.Other;

  return (
    <div className="group flex items-center justify-between p-3 sm:p-3.5 rounded-xl bg-white border border-slate-200/70 hover:border-slate-300 transition-all duration-150">
      {/* Left side */}
      <div className="flex items-center gap-3 min-w-0">
        <span
          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: colorMeta.dot }}
          title={transaction.category}
        />

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-xs sm:text-sm font-medium text-slate-900 truncate">
              {transaction.description}
            </h3>
            {transaction.receipt && (
              <button
                type="button"
                onClick={() => onViewReceipt(transaction)}
                className="inline-flex items-center gap-1 text-[10px] text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-1.5 py-0.5 rounded transition-colors flex-shrink-0"
                title="View receipt"
              >
                <Paperclip className="w-2.5 h-2.5" />
                Receipt
              </button>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
            <span>{transaction.category}</span>
            <span>•</span>
            <span>{formatDate(transaction.date)}</span>
          </div>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3 flex-shrink-0 ml-3">
        <div className="text-right">
          <div
            className={`text-sm sm:text-base font-semibold tracking-tight ${
              isIncome ? 'text-emerald-600' : 'text-slate-900'
            }`}
          >
            <span>
              {isIncome
                ? `+${formatCurrency(transaction.amount, currency)}`
                : `-${formatCurrency(transaction.amount, currency)}`}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-0.5 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(transaction)}
            className="p-1.5 text-slate-400 hover:text-slate-800 rounded hover:bg-slate-100 transition-colors"
            title="Edit"
            aria-label={`Edit ${transaction.description}`}
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDeleteRequest(transaction)}
            className="p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors"
            title="Delete"
            aria-label={`Delete ${transaction.description}`}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
