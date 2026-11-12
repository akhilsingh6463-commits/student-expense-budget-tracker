import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach } from 'vitest';
import App from '../App';

describe('App Full Integration Flow', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders initial dashboard, handles form validation, records new transaction, filters, and deletes', async () => {
    const user = userEvent.setup();
    render(<App />);

    // 1. Initial Load & Summary Check
    expect(screen.getByText('Expense & Budget Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Total Income')).toBeInTheDocument();
    expect(screen.getByText('Total Expenses')).toBeInTheDocument();
    expect(screen.getByText('Net Balance')).toBeInTheDocument();

    const initialIncome = screen.getByTestId('total-income');
    const initialExpenses = screen.getByTestId('total-expenses');
    const initialBalance = screen.getByTestId('net-balance');

    expect(initialIncome).toHaveTextContent('$1,850.00');
    expect(initialExpenses).toHaveTextContent('$434.00');
    expect(initialBalance).toHaveTextContent('$1,416.00');

    // 2. Test Form Validation (Submitting empty form)
    const recordBtn = screen.getByRole('button', { name: /Record Expense/i });
    await user.click(recordBtn);

    expect(await screen.findByText('Description is required')).toBeInTheDocument();
    expect(await screen.findByText('Amount is required and must be a number')).toBeInTheDocument();

    // 3. Add New Transaction
    const descInput = screen.getByLabelText(/Description \*/i);
    const amountInput = screen.getByLabelText(/Amount \(USD\) \*/i);
    const categorySelect = screen.getByLabelText(/Category \*/i);

    await user.type(descInput, 'Advanced Robotics Lab Kit');
    await user.type(amountInput, '85.50');
    await user.selectOptions(categorySelect, 'Education');

    await user.click(recordBtn);

    // Verify feedback toast appears
    expect(
      await screen.findByText(/Added "Advanced Robotics Lab Kit" successfully/i)
    ).toBeInTheDocument();

    // Verify summary values updated immediately
    expect(initialExpenses).toHaveTextContent('$519.50'); // 434 + 85.50
    expect(initialBalance).toHaveTextContent('$1,330.50'); // 1416 - 85.50

    // Verify item is present in list
    expect(screen.getByText('Advanced Robotics Lab Kit')).toBeInTheDocument();
    expect(screen.getByText('-$85.50')).toBeInTheDocument();

    // 4. Test Search Filtering
    const searchInput = screen.getByPlaceholderText(/Search transactions by title or category/i);
    await user.type(searchInput, 'Robotics');

    // Only 1 item should be shown
    expect(screen.getByTestId('filter-counter')).toHaveTextContent('Showing 1 of 8');
    expect(screen.getByText('Advanced Robotics Lab Kit')).toBeInTheDocument();
    expect(screen.queryByText('Fall Semester Textbooks (Calculus & Physics)')).not.toBeInTheDocument();

    // Clear search
    await user.clear(searchInput);
    expect(screen.getByTestId('filter-counter')).toHaveTextContent('Showing 8 of 8');

    // 5. Test Type Filter (Income only)
    const incomeFilterPill = screen.getByTestId('filter-type-income');
    await user.click(incomeFilterPill);

    // Initial 2 income + 0 new income = 2 income entries
    expect(screen.getByTestId('filter-counter')).toHaveTextContent('Showing 2 of 8');
    expect(screen.getByText('Part-time Library Assistant Stipend')).toBeInTheDocument();
    expect(screen.getByText('Merit Academic Scholarship Installment')).toBeInTheDocument();
    expect(screen.queryByText('Advanced Robotics Lab Kit')).not.toBeInTheDocument();

    // Reset filter to All
    const allFilterPill = screen.getByTestId('filter-type-all');
    await user.click(allFilterPill);
    expect(screen.getByTestId('filter-counter')).toHaveTextContent('Showing 8 of 8');

    // 6. Test Deleting a Transaction
    const deleteBtn = screen.getByLabelText('Delete Advanced Robotics Lab Kit');
    await user.click(deleteBtn);

    // Verify modal appeared
    expect(screen.getByText('Are you sure you want to delete this record?')).toBeInTheDocument();

    // Click confirm Delete
    const modalContainer = screen.getByRole('dialog');
    const confirmDeleteBtn = within(modalContainer).getByRole('button', { name: 'Delete' });
    await user.click(confirmDeleteBtn);

    // Verify deletion feedback toast and derived recalculation
    expect(
      await screen.findByText(/Deleted "Advanced Robotics Lab Kit" successfully/i)
    ).toBeInTheDocument();

    expect(screen.queryByText('Advanced Robotics Lab Kit')).not.toBeInTheDocument();
    expect(initialExpenses).toHaveTextContent('$434.00'); // reverted back
    expect(initialBalance).toHaveTextContent('$1,416.00'); // reverted back

    // 7. Test Currency Selector Switch
    const currencySelect = screen.getByRole('combobox', { name: /Currency/i });
    await user.selectOptions(currencySelect, 'EUR');

    // Values should now display with € symbol
    expect(initialIncome).toHaveTextContent('€1,850.00');
    expect(initialExpenses).toHaveTextContent('€434.00');
    expect(initialBalance).toHaveTextContent('€1,416.00');
  });
});
