import React, { useState, useRef, useEffect } from 'react';
import {
  PlusCircle,
  Paperclip,
  X,
  FileText,
  Check,
  RotateCcw,
  UploadCloud,
  Save,
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
import { Card } from '../common/Card';
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
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Populate form if editing
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
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
      const msg = err instanceof Error ? err.message : 'Error processing receipt file';
      setErrors((prev) => ({ ...prev, receipt: msg }));
    } finally {
      setIsProcessingFile(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
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
    <Card className="p-6 border-slate-200/90 shadow-sm">
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            {editingTransaction ? (
              <>
                <Save className="w-5 h-5 text-indigo-600" />
                Edit Transaction
              </>
            ) : (
              <>
                <PlusCircle className="w-5 h-5 text-indigo-600" />
                Record New Transaction
              </>
            )}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Log income, daily allowances, textbook expenses, or upload proof receipts
          </p>
        </div>
        {editingTransaction && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancelEdit}
            icon={<X className="w-4 h-4" />}
          >
            Cancel Edit
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Transaction Type Selector (Income vs Expense) */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Transaction Type
          </label>
          <div className="grid grid-cols-2 gap-3 p-1 bg-slate-100/90 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setType('Expense');
                if (category === 'Salary') setCategory('Food');
              }}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-semibold transition-all duration-150 ${
                type === 'Expense'
                  ? 'bg-white text-rose-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className={`w-2.5 h-2.5 rounded-full ${type === 'Expense' ? 'bg-rose-500' : 'bg-slate-300'}`} />
              Expense
            </button>
            <button
              type="button"
              onClick={() => {
                setType('Income');
                if (category === 'Food') setCategory('Salary');
              }}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-semibold transition-all duration-150 ${
                type === 'Income'
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className={`w-2.5 h-2.5 rounded-full ${type === 'Income' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
              Income
            </button>
          </div>
          {errors.type && <p className="mt-1 text-xs text-rose-600">{errors.type}</p>}
        </div>

        {/* Description & Amount */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Input
              label="Description *"
              placeholder="e.g. Calculus Textbooks, Campus Lunch, Lab Supplies"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description) setErrors((prev) => ({ ...prev, description: undefined }));
              }}
              error={errors.description}
              required
            />
          </div>
          <div>
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
          </div>
        </div>

        {/* Category & Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        {/* File / Receipt Upload Area */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Paperclip className="w-3.5 h-3.5 text-slate-500" />
              Receipt / Invoice Proof (Optional)
            </span>
            <span className="text-[11px] font-normal text-slate-400">PNG, JPG, PDF up to 5MB</span>
          </label>

          {receipt ? (
            /* Uploaded Receipt Preview */
            <div className="flex items-center justify-between p-3 rounded-xl border border-indigo-200 bg-indigo-50/40">
              <div className="flex items-center gap-3 overflow-hidden">
                {receipt.type.startsWith('image/') ? (
                  <img
                    src={receipt.dataUrl}
                    alt="Receipt thumbnail"
                    className="w-12 h-12 rounded-lg object-cover border border-indigo-200 flex-shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700 flex-shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                )}
                <div className="truncate">
                  <p className="text-xs font-semibold text-slate-900 truncate">{receipt.name}</p>
                  <p className="text-[11px] text-slate-500">
                    {formatFileSize(receipt.size)} • Attached
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setReceipt(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-white transition-colors"
                title="Remove Receipt"
                aria-label="Remove Receipt"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* Drag & Drop Upload Container */
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-4 rounded-xl border-2 border-dashed cursor-pointer text-center transition-all duration-150 ${
                isDragging
                  ? 'border-indigo-500 bg-indigo-50/50'
                  : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50/50'
              }`}
            >
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
              <div className="flex flex-col items-center gap-1.5">
                <UploadCloud className="w-6 h-6 text-indigo-500" />
                <p className="text-xs text-slate-700 font-medium">
                  {isProcessingFile ? (
                    'Processing receipt image...'
                  ) : (
                    <>
                      <span className="text-indigo-600 font-semibold underline underline-offset-2">
                        Click to browse
                      </span>{' '}
                      or drag & drop receipt here
                    </>
                  )}
                </p>
              </div>
            </div>
          )}
          {errors.receipt && <p className="mt-1 text-xs text-rose-600">{errors.receipt}</p>}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={resetForm}
            icon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Reset
          </Button>
          <Button
            type="submit"
            variant={type === 'Expense' ? 'primary' : 'success'}
            size="md"
            icon={<Check className="w-4 h-4" />}
          >
            {editingTransaction ? 'Save Changes' : type === 'Expense' ? 'Record Expense' : 'Record Income'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

