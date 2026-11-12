import React, { useState, useRef } from 'react';
import {
  Sparkles,
  TrendingUp,
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
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Navigation Bar */}
      <Navbar
        currency={budgetConfig.currency}
        onCurrencyChange={(curr) => updateBudgetConfig({ currency: curr })}
        onExportJson={exportJson}
        onExportCsv={exportCsv}
        onImportJson={importJson}
        onResetToSample={resetToSampleData}
        onClearAll={clearAll}
      />

      {/* Floating Feedback Toast Notification */}
      {feedback && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl border animate-in slide-in-from-bottom-4 duration-200 text-xs font-semibold backdrop-blur-md"
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

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Hero / Header */}
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                <Sparkles className="w-3 h-3 text-indigo-600" />
                Student Budgeting Hub
              </span>
              <span className="text-xs text-slate-400">Current Semester</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Expense & Budget Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Monitor allowances, track university expenses, and maintain balanced finances.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-slate-200/90 shadow-xs">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-medium text-slate-600">
                {transactions.length} Total Transactions
              </span>
            </div>
          </div>
        </section>

        {/* Real-time Financial Summary Cards */}
        <FinancialSummary summary={summary} currency={budgetConfig.currency} />

        {/* Dashboard Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form & Budget Gauges (5 cols on lg) */}
          <div ref={formSectionRef} className="lg:col-span-5 space-y-6">
            {/* Transaction Entry Form */}
            <TransactionForm
              onAddTransaction={addTransaction}
              onUpdateTransaction={updateTransaction}
              editingTransaction={editingTransaction}
              onCancelEdit={handleCancelEdit}
              currency={budgetConfig.currency}
            />

            {/* Monthly Budget Cap Progress */}
            <BudgetProgress
              budgetConfig={budgetConfig}
              totalExpenses={summary.totalExpenses}
              onUpdateBudget={updateBudgetConfig}
            />

            {/* Spending Category Distribution */}
            <CategoryBreakdown
              categories={categoryExpenses}
              currency={budgetConfig.currency}
            />
          </div>

          {/* Right Column: Filters and Transaction List (7 cols on lg) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-indigo-600" />
                  Transaction History
                </h2>
                <p className="text-xs text-slate-500">
                  Filter, sort, search, and manage individual records
                </p>
              </div>
            </div>

            {/* Filter Bar */}
            <TransactionFilters
              filters={filters}
              onFilterChange={(newFilters) => setFilters((prev) => ({ ...prev, ...newFilters }))}
              onResetFilters={resetFilters}
              totalCount={transactions.length}
              filteredCount={filteredTransactions.length}
            />

            {/* Transaction Item List */}
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

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;
