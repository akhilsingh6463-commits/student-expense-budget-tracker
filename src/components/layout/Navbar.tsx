import React, { useRef } from 'react';
import {
  Wallet,
  Upload,
  RefreshCw,
  Trash2,
  FileSpreadsheet,
  FileCode,
} from 'lucide-react';

interface NavbarProps {
  currency: string;
  onCurrencyChange: (currency: string) => void;
  onExportJson: () => void;
  onExportCsv: () => void;
  onImportJson: (jsonContent: string) => void;
  onResetToSample: () => void;
  onClearAll: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currency,
  onCurrencyChange,
  onExportJson,
  onExportCsv,
  onImportJson,
  onResetToSample,
  onClearAll,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) onImportJson(text);
      };
      reader.readAsText(file);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const currencies = [
    { code: 'USD', label: 'USD ($)' },
    { code: 'EUR', label: 'EUR (€)' },
    { code: 'GBP', label: 'GBP (£)' },
    { code: 'INR', label: 'INR (₹)' },
    { code: 'CAD', label: 'CAD ($)' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/70">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
            <Wallet className="w-4 h-4" />
          </div>
          <span className="text-sm font-semibold text-slate-900 tracking-tight">
            CampusBudget
          </span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Currency Switcher */}
          <div className="flex items-center">
            <label htmlFor="currency-select" className="sr-only">
              Currency
            </label>
            <select
              id="currency-select"
              value={currency}
              onChange={(e) => onCurrencyChange(e.target.value)}
              className="bg-slate-100 hover:bg-slate-200/80 transition-colors border-0 text-slate-700 text-xs font-medium rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-400 cursor-pointer"
            >
              {currencies.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div className="h-4 w-px bg-slate-200 mx-1" />

          {/* Export / Import */}
          <button
            onClick={onExportCsv}
            title="Export CSV"
            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4" />
          </button>
          <button
            onClick={onExportJson}
            title="Backup JSON"
            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <FileCode className="w-4 h-4" />
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleFileUpload}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            title="Import JSON"
            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Upload className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-slate-200 mx-1" />

          {/* Reset / Clear */}
          <button
            onClick={onResetToSample}
            title="Reset sample data"
            className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              if (window.confirm('Clear all transactions?')) {
                onClearAll();
              }
            }}
            title="Clear all"
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
