import { describe, it, expect } from 'vitest';
import {
  validateTransactionInput,
  validateReceiptFile,
} from '../utils/validators';

describe('Validators', () => {
  describe('validateTransactionInput', () => {
    it('passes for valid input fields', () => {
      const input = {
        description: 'Semester Tuition Fee',
        amount: '1200.50',
        type: 'Expense',
        category: 'Education',
        date: '2026-11-10',
      };
      const result = validateTransactionInput(input);
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors)).toHaveLength(0);
    });

    it('rejects empty or whitespace-only description', () => {
      const input = {
        description: '   ',
        amount: '50',
        type: 'Expense',
        category: 'Food',
        date: '2026-11-10',
      };
      const result = validateTransactionInput(input);
      expect(result.isValid).toBe(false);
      expect(result.errors.description).toBe('Description is required');
    });

    it('rejects zero amount', () => {
      const input = {
        description: 'Coffee',
        amount: '0',
        type: 'Expense',
        category: 'Food',
        date: '2026-11-10',
      };
      const result = validateTransactionInput(input);
      expect(result.isValid).toBe(false);
      expect(result.errors.amount).toBe('Amount must be greater than zero');
    });

    it('rejects negative amount', () => {
      const input = {
        description: 'Refund',
        amount: '-25',
        type: 'Expense',
        category: 'Food',
        date: '2026-11-10',
      };
      const result = validateTransactionInput(input);
      expect(result.isValid).toBe(false);
      expect(result.errors.amount).toBe('Amount must be greater than zero');
    });

    it('rejects invalid category', () => {
      const input = {
        description: 'Stock options',
        amount: '500',
        type: 'Income',
        category: 'CryptoTradingNonExistent',
        date: '2026-11-10',
      };
      const result = validateTransactionInput(input);
      expect(result.isValid).toBe(false);
      expect(result.errors.category).toBe('Please select a valid category');
    });
  });

  describe('validateReceiptFile', () => {
    it('accepts valid PNG image under 5MB', () => {
      const file = new File(['dummy content'], 'receipt.png', { type: 'image/png' });
      const result = validateReceiptFile(file);
      expect(result.isValid).toBe(true);
    });

    it('accepts valid PDF document under 5MB', () => {
      const file = new File(['dummy content'], 'invoice.pdf', { type: 'application/pdf' });
      const result = validateReceiptFile(file);
      expect(result.isValid).toBe(true);
    });

    it('rejects files larger than 5MB', () => {
      // Mock large file size
      const bigFile = new File(['dummy'], 'giant-scan.png', { type: 'image/png' });
      Object.defineProperty(bigFile, 'size', { value: 6 * 1024 * 1024 });

      const result = validateReceiptFile(bigFile);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('exceeds maximum limit of 5MB');
    });

    it('rejects disallowed file types such as .exe or .zip', () => {
      const badFile = new File(['dummy'], 'archive.zip', { type: 'application/zip' });
      const result = validateReceiptFile(badFile);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Allowed file formats: PNG, JPG, WebP, GIF, or PDF');
    });
  });
});
