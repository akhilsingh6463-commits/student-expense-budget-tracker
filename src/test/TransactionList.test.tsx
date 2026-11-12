import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { TransactionList } from '../components/transactions/TransactionList';
import { Transaction } from '../types/transaction';

const mockTransactions: Transaction[] = [
  {
    id: 'tx-101',
    description: 'Library Lab Printouts',
    amount: 12.5,
    type: 'Expense',
    category: 'Education',
    date: '2026-11-09',
    createdAt: '2026-11-09T10:00:00Z',
    receipt: {
      name: 'receipt_printout.png',
      size: 1024 * 50,
      type: 'image/png',
      dataUrl: 'data:image/png;base64,mock',
      uploadedAt: '2026-11-09T10:00:00Z',
    },
  },
  {
    id: 'tx-102',
    description: 'Campus Resident Assistant Pay',
    amount: 400.0,
    type: 'Income',
    category: 'Salary',
    date: '2026-11-10',
    createdAt: '2026-11-10T10:00:00Z',
    receipt: null,
  },
];

describe('TransactionList Component', () => {
  it('renders all transaction items with description and formatted amount', () => {
    render(
      <TransactionList
        transactions={mockTransactions}
        totalTransactionsCount={2}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    expect(screen.getByText('Library Lab Printouts')).toBeInTheDocument();
    expect(screen.getByText('Campus Resident Assistant Pay')).toBeInTheDocument();
    expect(screen.getByText('-$12.50')).toBeInTheDocument();
    expect(screen.getByText('+$400.00')).toBeInTheDocument();
  });

  it('renders empty state when totalTransactionsCount is 0', () => {
    render(
      <TransactionList
        transactions={[]}
        totalTransactionsCount={0}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onAddNewClick={vi.fn()}
      />
    );

    expect(screen.getByText('No Transactions Recorded Yet')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add New Transaction/i })).toBeInTheDocument();
  });

  it('renders no results state when filters produce zero items', () => {
    render(
      <TransactionList
        transactions={[]}
        totalTransactionsCount={2}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onResetFilters={vi.fn()}
      />
    );

    expect(screen.getByText('No transactions found')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reset Filters/i })).toBeInTheDocument();
  });

  it('opens confirmation modal and triggers onDelete when confirmed', async () => {
    const user = userEvent.setup();
    const handleDelete = vi.fn();

    render(
      <TransactionList
        transactions={mockTransactions}
        totalTransactionsCount={2}
        onEdit={vi.fn()}
        onDelete={handleDelete}
      />
    );

    const deleteBtn = screen.getByLabelText('Delete Library Lab Printouts');
    await user.click(deleteBtn);

    expect(screen.getByText('Are you sure you want to delete this record?')).toBeInTheDocument();

    const confirmBtn = screen.getByRole('button', { name: 'Delete' });
    await user.click(confirmBtn);

    expect(handleDelete).toHaveBeenCalledWith('tx-101');
  });

  it('opens receipt modal when receipt badge is clicked', async () => {
    const user = userEvent.setup();

    render(
      <TransactionList
        transactions={mockTransactions}
        totalTransactionsCount={2}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    const receiptBtn = screen.getByRole('button', { name: /Receipt/i });
    await user.click(receiptBtn);

    expect(screen.getByText(/Receipt: Library Lab Printouts/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Download Receipt/i })).toBeInTheDocument();
  });
});
