import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FinancialSummary } from '../components/dashboard/FinancialSummary';
import { FinancialSummaryData } from '../types/transaction';

const mockSummary: FinancialSummaryData = {
  totalIncome: 1850,
  totalExpenses: 450,
  netBalance: 1400,
  savingsRate: 76,
  transactionCount: 5,
  incomeCount: 2,
  expenseCount: 3,
};

describe('FinancialSummary Component', () => {
  it('renders total income, total expenses, and net balance cards', () => {
    render(<FinancialSummary summary={mockSummary} currency="USD" />);

    expect(screen.getByText('Total Income')).toBeInTheDocument();
    expect(screen.getByText('Total Expenses')).toBeInTheDocument();
    expect(screen.getByText('Net Balance')).toBeInTheDocument();
    expect(screen.getByText('Savings Rate')).toBeInTheDocument();

    const incomeEl = screen.getByTestId('total-income');
    expect(incomeEl).toHaveTextContent('$1,850.00');

    const expensesEl = screen.getByTestId('total-expenses');
    expect(expensesEl).toHaveTextContent('$450.00');

    const balanceEl = screen.getByTestId('net-balance');
    expect(balanceEl).toHaveTextContent('$1,400.00');

    const savingsEl = screen.getByTestId('savings-rate');
    expect(savingsEl).toHaveTextContent('76%');
  });

  it('renders entry count badges correctly', () => {
    render(<FinancialSummary summary={mockSummary} currency="USD" />);

    expect(screen.getByText('+2 entries')).toBeInTheDocument();
    expect(screen.getByText('-3 entries')).toBeInTheDocument();
  });
});
