import React from 'react';
import { Download, FileText, ExternalLink } from 'lucide-react';
import { ReceiptAttachment } from '../../types/transaction';
import { formatFileSize, formatDate } from '../../utils/formatters';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  receipt: ReceiptAttachment | null;
  transactionDescription?: string;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  isOpen,
  onClose,
  receipt,
  transactionDescription,
}) => {
  if (!receipt) return null;

  const isImage = receipt.type.startsWith('image/');

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = receipt.dataUrl;
    a.download = receipt.name;
    a.click();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Receipt: ${transactionDescription || receipt.name}`}
      maxWidth="lg"
    >
      <div className="space-y-4">
        {/* Receipt Preview */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-2 flex items-center justify-center max-h-[480px] overflow-auto">
          {isImage ? (
            <img
              src={receipt.dataUrl}
              alt={receipt.name}
              className="max-h-[440px] w-auto object-contain rounded-lg shadow-sm"
            />
          ) : (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <FileText className="w-16 h-16 text-indigo-500 mb-3" />
              <p className="text-sm font-semibold text-slate-800">{receipt.name}</p>
              <p className="text-xs text-slate-400 mt-1">PDF Document Receipt</p>
            </div>
          )}
        </div>

        {/* Metadata info */}
        <div className="flex items-center justify-between text-xs text-slate-500 bg-slate-50/80 px-3.5 py-2.5 rounded-lg border border-slate-100">
          <div>
            <span className="font-semibold text-slate-700">{receipt.name}</span>
            <span className="mx-1.5">•</span>
            <span>{formatFileSize(receipt.size)}</span>
          </div>
          <div>Attached {formatDate(receipt.uploadedAt)}</div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {isImage && (
            <a
              href={receipt.dataUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Open Original
            </a>
          )}
          <Button
            size="sm"
            variant="primary"
            onClick={handleDownload}
            icon={<Download className="w-4 h-4" />}
          >
            Download Receipt
          </Button>
        </div>
      </div>
    </Modal>
  );
};
