import { Category } from '../types/transaction';

export interface FormErrors {
  description?: string;
  amount?: string;
  type?: string;
  category?: string;
  date?: string;
  receipt?: string;
}

export const VALID_CATEGORIES: Category[] = [
  'Food',
  'Rent',
  'Salary',
  'Entertainment',
  'Utilities',
  'Education',
  'Books & Supplies',
  'Transportation',
  'Healthcare',
  'Other',
];

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'application/pdf',
];

/**
 * Validates transaction inputs
 */
export const validateTransactionInput = (input: {
  description: string;
  amount: number | string;
  type: string;
  category: string;
  date: string;
}): { isValid: boolean; errors: FormErrors } => {
  const errors: FormErrors = {};

  // Description
  const trimmedDesc = input.description ? input.description.trim() : '';
  if (!trimmedDesc) {
    errors.description = 'Description is required';
  } else if (trimmedDesc.length < 2) {
    errors.description = 'Description must be at least 2 characters';
  } else if (trimmedDesc.length > 100) {
    errors.description = 'Description cannot exceed 100 characters';
  }

  // Amount
  const numAmount = typeof input.amount === 'string' ? parseFloat(input.amount) : input.amount;
  if (input.amount === '' || input.amount === null || input.amount === undefined || isNaN(numAmount)) {
    errors.amount = 'Amount is required and must be a number';
  } else if (numAmount <= 0) {
    errors.amount = 'Amount must be greater than zero';
  } else if (numAmount > 10_000_000) {
    errors.amount = 'Amount cannot exceed $10,000,000';
  }

  // Type
  if (input.type !== 'Income' && input.type !== 'Expense') {
    errors.type = 'Please select either Income or Expense';
  }

  // Category
  if (!VALID_CATEGORIES.includes(input.category as Category)) {
    errors.category = 'Please select a valid category';
  }

  // Date
  if (!input.date) {
    errors.date = 'Date is required';
  } else {
    const parsed = new Date(input.date);
    if (isNaN(parsed.getTime())) {
      errors.date = 'Please enter a valid date';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validates uploaded receipt file
 */
export const validateReceiptFile = (file: File): { isValid: boolean; error?: string } => {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      isValid: false,
      error: `Receipt file size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds maximum limit of 5MB`,
    };
  }

  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: 'Allowed file formats: PNG, JPG, WebP, GIF, or PDF',
    };
  }

  return { isValid: true };
};
