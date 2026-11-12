import React from 'react';
import {
  ArrowUpRight,
  ArrowDownRight,
  Paperclip,
  Trash2,
  Pencil,
  GraduationCap,
  Utensils,
  Home,
  Briefcase,
  Film,
  Zap,
  BookOpen,
  Bus,
  HeartPulse,
  Tag,
} from 'lucide-react';
import { Transaction, Category } from '../../types/transaction';
import {
  formatCurrency,
  formatDate,
  CATEGORY_COLORS,
} from '../../utils/formatters';
import { Badge } from '../common/Badge';

interface TransactionItemProps {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
  onDeleteRequest: (transaction: Transaction) => void;
  onViewReceipt: (transaction: Transaction) => void;
  currency?: string;
}

const getCategoryIcon = (category: Category) => {
  switch (category) {
    case 'Food':
      return <Utensils className="w-4 h-4" />;
    case 'Rent':
      return <Home className="w-4 h-4" />;
    case 'Salary':
      return <Briefcase className="w-4 h-4" />;
    case 'Entertainment':
      return <Film className="w-4 h-4" />;
    case 'Utilities':
      return <Zap className="w-4 h-4" />;
    case 'Education':
      return <GraduationCap className="w-4 h-4" />;
    case 'Books & Supplies':
      return <BookOpen className="w-4 h-4" />;
    case 'Transportation':
      return <Bus className="w-4 h-4" />;
    case 'Healthcare':
      return <HeartPulse className="w-4 h-4" />;
    default:
      return <Tag className="w-4 h-4" />;
  }
};

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
    <div
      className={`group flex items-center justify-between p-4 rounded-xl border transition-all duration-150 ${
        isIncome
          ? 'bg-white hover:bg-emerald-50/20 border-slate-200/90 hover:border-emerald-200'
          : 'bg-white hover:bg-rose-50/20 border-slate-200/90 hover:border-rose-200'
      }`}
    >
      {/* Left side: Icon, Title, Category & Date */}
      <div className="flex items-center gap-3.5 min-w-0">
        {/* Type & Category Icon Avatar */}
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 ${
            isIncome
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-rose-100 text-rose-700'
          }`}
          title={`${transaction.type} - ${transaction.category}`}
        >
          {getCategoryIcon(transaction.category)}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-slate-900 truncate">
              {transaction.description}
            </h3>
            {transaction.receipt && (
              <button
                type="button"
                onClick={() => onViewReceipt(transaction)}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded-md transition-colors flex-shrink-0"
                title="Click to view attached receipt"
              >
                <Paperclip className="w-3 h-3" />
                Receipt
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md ${colorMeta.bg} ${colorMeta.text}`}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: colorMeta.dot }}
              />
              {transaction.category}
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-400 font-normal">
              {formatDate(transaction.date)}
            </span>
          </div>
        </div>
      </div>

      {/* Right side: Amount, Type Badge & Actions */}
      <div className="flex items-center gap-3 flex-shrink-0 ml-3">
        <div className="text-right">
          <div
            className={`text-base font-bold tracking-tight flex items-center justify-end gap-1 ${
              isIncome ? 'text-emerald-600' : 'text-slate-900'
            }`}
          >
            <span>
              {isIncome ? `+${formatCurrency(transaction.amount, currency)}` : `-${formatCurrency(transaction.amount, currency)}`}
            </span>
          </div>
          <div className="flex justify-end mt-0.5">
            <Badge
              variant={isIncome ? 'success' : 'danger'}
              size="sm"
              icon={
                isIncome ? (
                  <ArrowUpRight className="w-3 h-3" />
                ) : (
                  <ArrowDownRight className="w-3 h-3" />
                )
              }
            >
              {transaction.type}
            </Badge>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 pl-2 border-l border-slate-100">
          <button
            onClick={() => onEdit(transaction)}
            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            title="Edit Transaction"
            aria-label={`Edit ${transaction.description}`}
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDeleteRequest(transaction)}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title="Delete Transaction"
            aria-label={`Delete ${transaction.description}`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
