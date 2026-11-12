import React, { useState } from 'react';
import { Transaction } from '../../types/transaction';
import { TransactionItem } from './TransactionItem';
import { EmptyState } from '../common/EmptyState';
import { ReceiptModal } from './ReceiptModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';

interface TransactionListProps {
  transactions: Transaction[];
  totalTransactionsCount: number;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  onAddNewClick?: () => void;
  onResetFilters?: () => void;
  onLoadSamples?: () => void;
  currency?: string;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  totalTransactionsCount,
  onEdit,
  onDelete,
  onAddNewClick,
  onResetFilters,
  onLoadSamples,
  currency = 'USD',
}) => {
  const [selectedReceiptTx, setSelectedReceiptTx] = useState<Transaction | null>(null);
  const [txToDelete, setTxToDelete] = useState<Transaction | null>(null);

  // If there are zero transactions anywhere in the app
  if (totalTransactionsCount === 0) {
    return (
      <EmptyState
        type="no-data"
        onActionClick={onAddNewClick}
        onLoadSamples={onLoadSamples}
      />
    );
  }

  // If transactions exist, but current search/filter yields zero
  if (transactions.length === 0) {
    return (
      <EmptyState
        type="no-results"
        onResetFilters={onResetFilters}
      />
    );
  }

  return (
    <>
      <div className="space-y-2.5" data-testid="transaction-list">
        {transactions.map((tx) => (
          <TransactionItem
            key={tx.id}
            transaction={tx}
            onEdit={onEdit}
            onDeleteRequest={(t) => setTxToDelete(t)}
            onViewReceipt={(t) => setSelectedReceiptTx(t)}
            currency={currency}
          />
        ))}
      </div>

      {/* Receipt inspection modal */}
      <ReceiptModal
        isOpen={Boolean(selectedReceiptTx)}
        onClose={() => setSelectedReceiptTx(null)}
        receipt={selectedReceiptTx?.receipt || null}
        transactionDescription={selectedReceiptTx?.description}
      />

      {/* Delete confirmation modal */}
      <DeleteConfirmModal
        isOpen={Boolean(txToDelete)}
        onClose={() => setTxToDelete(null)}
        onConfirm={() => {
          if (txToDelete) {
            onDelete(txToDelete.id);
            setTxToDelete(null);
          }
        }}
        transaction={txToDelete}
        currency={currency}
      />
    </>
  );
};
