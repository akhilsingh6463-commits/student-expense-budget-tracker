import React, { useState, useRef } from 'react';
import {
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { useTransactions } from './hooks/useTransactions';
import { useBudget } from './hooks/useBudget';
import { Transaction } from './types/transaction';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { FinancialSummary } from './components/dashboard/FinancialSummary';
import { BudgetProgress } from './components/dashboard/BudgetProgress';
import { CategoryBreakdown } from './components/dashboard/CategoryBreakdown';
import { TransactionForm } from './components/transactions/TransactionForm';
import { TransactionFilters } from './components/transactions/TransactionFilters';
import { TransactionList } from './components/transactions/TransactionList';

export const App: React.FC = () => {
  const {
    transactions,
    filteredTransactions,
    summary,
    categoryExpenses,
    filters,
    setFilters,
    resetFilters,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    clearAll,
    resetToSampleData,
    exportJson,
    exportCsv,
    importJson,
    feedback,
  } = useTransactions();

  const { budgetConfig, updateBudgetConfig } = useBudget(summary.totalExpenses);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const formSectionRef = useRef<HTMLDivElement>(null);

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    formSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleCancelEdit = () => {
    setEditingTransaction(null);
  };

  const handleScrollToForm = () => {
    formSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/60 text-slate-800">
      {/* Navigation */}
      <Navbar
        currency={budgetConfig.currency}
        onCurrencyChange={(curr) => updateBudgetConfig({ currency: curr })}
        onExportJson={exportJson}
        onExportCsv={exportCsv}
        onImportJson={importJson}
        onResetToSample={resetToSampleData}
        onClearAll={clearAll}
      />

      {/* Toast Notification */}
      {feedback && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-3.5 py-2.5 rounded-xl shadow-lg border text-xs font-medium backdrop-blur-md animate-in fade-in"
          style={{
            backgroundColor: feedback.type === 'success' ? '#f0fdf4' : '#fef2f2',
            color: feedback.type === 'success' ? '#166534' : '#991b1b',
            borderColor: feedback.type === 'success' ? '#bbf7d0' : '#fecaca',
          }}
        >
          {feedback.type === 'success' ? (
            <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Minimal Header */}
        <section className="flex items-center justify-between pb-1">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Expense & Budget Dashboard
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Campus finances, expenses, and budget tracking
            </p>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            {transactions.length} records
          </span>
        </section>

        {/* Financial Summary Cards */}
        <FinancialSummary summary={summary} currency={budgetConfig.currency} />

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Form & Budget (5 cols) */}
          <div ref={formSectionRef} className="lg:col-span-5 space-y-4">
            <TransactionForm
              onAddTransaction={addTransaction}
              onUpdateTransaction={updateTransaction}
              editingTransaction={editingTransaction}
              onCancelEdit={handleCancelEdit}
              currency={budgetConfig.currency}
            />

            <BudgetProgress
              budgetConfig={budgetConfig}
              totalExpenses={summary.totalExpenses}
              onUpdateBudget={updateBudgetConfig}
            />

            <CategoryBreakdown
              categories={categoryExpenses}
              currency={budgetConfig.currency}
            />
          </div>

          {/* Right Column: Filters and Transaction List (7 cols) */}
          <div className="lg:col-span-7 space-y-3">
            <TransactionFilters
              filters={filters}
              onFilterChange={(newFilters) => setFilters((prev) => ({ ...prev, ...newFilters }))}
              onResetFilters={resetFilters}
              totalCount={transactions.length}
              filteredCount={filteredTransactions.length}
            />

            <TransactionList
              transactions={filteredTransactions}
              totalTransactionsCount={transactions.length}
              onEdit={handleEdit}
              onDelete={deleteTransaction}
              onAddNewClick={handleScrollToForm}
              onResetFilters={resetFilters}
              onLoadSamples={resetToSampleData}
              currency={budgetConfig.currency}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default App;
