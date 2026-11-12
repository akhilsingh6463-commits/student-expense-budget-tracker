import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { TransactionForm } from '../components/transactions/TransactionForm';

describe('TransactionForm Component', () => {
  it('renders required input fields', () => {
    render(<TransactionForm onAddTransaction={vi.fn()} currency="USD" />);

    expect(screen.getByText('Transaction Type')).toBeInTheDocument();
    expect(screen.getByLabelText(/Description \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Amount \(USD\) \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Category \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Date \*/i)).toBeInTheDocument();
  });

  it('displays validation errors when submitting empty form', async () => {
    const user = userEvent.setup();
    const handleAdd = vi.fn();
    render(<TransactionForm onAddTransaction={handleAdd} currency="USD" />);

    const submitBtn = screen.getByRole('button', { name: /Record Expense/i });
    await user.click(submitBtn);

    expect(await screen.findByText('Description is required')).toBeInTheDocument();
    expect(await screen.findByText('Amount is required and must be a number')).toBeInTheDocument();
    expect(handleAdd).not.toHaveBeenCalled();
  });

  it('displays validation error for negative amount', async () => {
    const user = userEvent.setup();
    const handleAdd = vi.fn();
    render(<TransactionForm onAddTransaction={handleAdd} currency="USD" />);

    const descInput = screen.getByLabelText(/Description \*/i);
    const amountInput = screen.getByLabelText(/Amount \(USD\) \*/i);

    await user.type(descInput, 'Math Books');
    await user.type(amountInput, '-20');

    const submitBtn = screen.getByRole('button', { name: /Record Expense/i });
    await user.click(submitBtn);

    expect(await screen.findByText('Amount must be greater than zero')).toBeInTheDocument();
    expect(handleAdd).not.toHaveBeenCalled();
  });

  it('submits valid transaction data', async () => {
    const user = userEvent.setup();
    const handleAdd = vi.fn();
    render(<TransactionForm onAddTransaction={handleAdd} currency="USD" />);

    const descInput = screen.getByLabelText(/Description \*/i);
    const amountInput = screen.getByLabelText(/Amount \(USD\) \*/i);

    await user.type(descInput, 'Organic Chemistry Textbook');
    await user.type(amountInput, '85.50');

    const submitBtn = screen.getByRole('button', { name: /Record Expense/i });
    await user.click(submitBtn);

    expect(handleAdd).toHaveBeenCalledTimes(1);
    expect(handleAdd).toHaveBeenCalledWith(
      expect.objectContaining({
        description: 'Organic Chemistry Textbook',
        amount: 85.5,
        type: 'Expense',
        category: 'Food', // default category
      })
    );
  });

  it('allows toggling between Expense and Income', async () => {
    const user = userEvent.setup();
    render(<TransactionForm onAddTransaction={vi.fn()} currency="USD" />);

    const incomeBtn = screen.getByRole('button', { name: /Income/i });
    await user.click(incomeBtn);

    expect(screen.getByRole('button', { name: /Record Income/i })).toBeInTheDocument();
  });
});
