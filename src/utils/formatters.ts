import { Category, TransactionType } from '../types/transaction';

/**
 * Format an amount into localized currency
 */
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(safeAmount);
  } catch {
    return `$${safeAmount.toFixed(2)}`;
  }
};

/**
 * Format YYYY-MM-DD or ISO string into human friendly date (e.g. "Oct 12, 2026")
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return 'N/A';
  try {
    const [year, month, day] = dateString.split('T')[0].split('-').map(Number);
    if (!year || !month || !day) return dateString;
    const dateObj = new Date(year, month - 1, day);
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
};

/**
 * Format bytes to readable string (e.g. "1.2 MB")
 */
export const formatFileSize = (bytes: number): string => {
  if (!bytes || bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i] || 'B'}`;
};

/**
 * Color metadata for transaction types
 */
export const getTypeBadgeClass = (type: TransactionType): string => {
  if (type === 'Income') {
    return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800';
  }
  return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800';
};

/**
 * Category color scheme for tags and charts
 */
export const CATEGORY_COLORS: Record<Category, { bg: string; text: string; dot: string }> = {
  Food: { bg: 'bg-amber-50', text: 'text-amber-700', dot: '#f59e0b' },
  Rent: { bg: 'bg-indigo-50', text: 'text-indigo-700', dot: '#6366f1' },
  Salary: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: '#10b981' },
  Entertainment: { bg: 'bg-purple-50', text: 'text-purple-700', dot: '#a855f7' },
  Utilities: { bg: 'bg-cyan-50', text: 'text-cyan-700', dot: '#06b6d4' },
  Education: { bg: 'bg-blue-50', text: 'text-blue-700', dot: '#3b82f6' },
  'Books & Supplies': { bg: 'bg-teal-50', text: 'text-teal-700', dot: '#14b8a6' },
  Transportation: { bg: 'bg-orange-50', text: 'text-orange-700', dot: '#f97316' },
  Healthcare: { bg: 'bg-red-50', text: 'text-red-700', dot: '#ef4444' },
  Other: { bg: 'bg-slate-100', text: 'text-slate-700', dot: '#64748b' },
};
