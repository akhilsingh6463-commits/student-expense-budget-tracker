import React, { useState, useRef, useEffect } from 'react';
import {
  Paperclip,
  X,
  FileText,
  RotateCcw,
} from 'lucide-react';
import {
  Transaction,
  TransactionType,
  Category,
  ReceiptAttachment,
} from '../../types/transaction';
import {
  validateTransactionInput,
  validateReceiptFile,
  VALID_CATEGORIES,
  FormErrors,
} from '../../utils/validators';
import { fileStorageService } from '../../services/fileStorage';
import { formatFileSize } from '../../utils/formatters';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';

interface TransactionFormProps {
  onAddTransaction: (item: Omit<Transaction, 'id' | 'createdAt'>) => void;
  onUpdateTransaction?: (id: string, updates: Partial<Transaction>) => void;
  editingTransaction?: Transaction | null;
  onCancelEdit?: () => void;
  currency?: string;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  onAddTransaction,
  onUpdateTransaction,
  editingTransaction,
  onCancelEdit,
  currency = 'USD',
}) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('Expense');
  const [category, setCategory] = useState<Category>('Food');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [receipt, setReceipt] = useState<ReceiptAttachment | null>(null);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingTransaction) {
      setDescription(editingTransaction.description);
      setAmount(editingTransaction.amount.toString());
      setType(editingTransaction.type);
      setCategory(editingTransaction.category);
      setDate(editingTransaction.date);
      setReceipt(editingTransaction.receipt || null);
      setErrors({});
    } else {
      resetForm();
    }
  }, [editingTransaction]);

  const resetForm = () => {
    setDescription('');
    setAmount('');
    setType('Expense');
    setCategory('Food');
    setDate(new Date().toISOString().split('T')[0]);
    setReceipt(null);
    setErrors({});
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileChange = async (file: File | null) => {
    if (!file) return;

    const validation = validateReceiptFile(file);
    if (!validation.isValid) {
      setErrors((prev) => ({ ...prev, receipt: validation.error }));
      return;
    }

    try {
      setIsProcessingFile(true);
      setErrors((prev) => ({ ...prev, receipt: undefined }));
      const processed = await fileStorageService.processReceiptFile(file);
      setReceipt(processed);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error processing receipt';
      setErrors((prev) => ({ ...prev, receipt: msg }));
    } finally {
      setIsProcessingFile(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateTransactionInput({
      description,
      amount,
      type,
      category,
      date,
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    const numericAmount = parseFloat(amount);

    if (editingTransaction && onUpdateTransaction) {
      onUpdateTransaction(editingTransaction.id, {
        description: description.trim(),
        amount: numericAmount,
        type,
        category,
        date,
        receipt,
      });
      if (onCancelEdit) onCancelEdit();
    } else {
      onAddTransaction({
        description: description.trim(),
        amount: numericAmount,
        type,
        category,
        date,
        receipt,
      });
      resetForm();
    }
  };

  const categoryOptions = VALID_CATEGORIES.map((cat) => ({
    value: cat,
    label: cat,
  }));

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200/70 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-slate-900">
          {editingTransaction ? 'Edit Transaction' : 'New Transaction'}
        </h2>
        {editingTransaction && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="text-xs text-slate-400 hover:text-slate-700"
          >
            Cancel
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
        {/* Type Segmented Pill */}
        <div>
          <label className="sr-only">Transaction Type</label>
          <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              type="button"
              onClick={() => {
                setType('Expense');
                if (category === 'Salary') setCategory('Food');
              }}
              className={`py-1.5 text-xs font-semibold rounded-md transition-all ${
                type === 'Expense'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => {
                setType('Income');
                if (category === 'Food') setCategory('Salary');
              }}
              className={`py-1.5 text-xs font-semibold rounded-md transition-all ${
                type === 'Income'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Income
            </button>
          </div>
        </div>

        {/* Description & Amount */}
        <div className="space-y-3">
          <Input
            label="Description *"
            placeholder="e.g. Textbooks, Dining Hall, Lab Fee"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (errors.description) setErrors((prev) => ({ ...prev, description: undefined }));
            }}
            error={errors.description}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label={`Amount (${currency}) *`}
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                if (errors.amount) setErrors((prev) => ({ ...prev, amount: undefined }));
              }}
              error={errors.amount}
              required
            />

            <Input
              label="Date *"
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                if (errors.date) setErrors((prev) => ({ ...prev, date: undefined }));
              }}
              error={errors.date}
              required
            />
          </div>

          <Select
            label="Category *"
            options={categoryOptions}
            value={category}
            onChange={(e) => {
              setCategory(e.target.value as Category);
              if (errors.category) setErrors((prev) => ({ ...prev, category: undefined }));
            }}
            error={errors.category}
            required
          />
        </div>

        {/* Minimal Receipt Attachment */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif,application/pdf"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileChange(e.target.files[0]);
              }
            }}
          />

          {receipt ? (
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs">
              <div className="flex items-center gap-2 overflow-hidden">
                {receipt.type.startsWith('image/') ? (
                  <img
                    src={receipt.dataUrl}
                    alt="Receipt thumbnail"
                    className="w-7 h-7 rounded object-cover flex-shrink-0"
                  />
                ) : (
                  <FileText className="w-4 h-4 text-slate-500 flex-shrink-0" />
                )}
                <span className="truncate text-slate-700 font-medium">{receipt.name}</span>
                <span className="text-[11px] text-slate-400 flex-shrink-0">
                  ({formatFileSize(receipt.size)})
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setReceipt(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="p-1 text-slate-400 hover:text-rose-600 rounded"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2 px-3 border border-dashed border-slate-200 hover:border-slate-300 rounded-lg text-xs text-slate-500 hover:text-slate-700 transition-colors flex items-center justify-center gap-1.5"
            >
              <Paperclip className="w-3.5 h-3.5 text-slate-400" />
              <span>{isProcessingFile ? 'Processing...' : 'Attach Receipt (optional)'}</span>
            </button>
          )}
          {errors.receipt && <p className="mt-1 text-xs text-rose-600">{errors.receipt}</p>}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={resetForm}
            icon={<RotateCcw className="w-3 h-3" />}
          >
            Reset
          </Button>
          <Button
            type="submit"
            variant={type === 'Expense' ? 'primary' : 'success'}
            size="sm"
          >
            {editingTransaction ? 'Save Changes' : type === 'Expense' ? 'Record Expense' : 'Record Income'}
          </Button>
        </div>
      </form>
    </div>
  );
};
