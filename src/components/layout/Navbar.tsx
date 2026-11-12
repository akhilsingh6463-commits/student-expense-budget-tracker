import React, { useRef } from 'react';
import {
  GraduationCap,
  Upload,
  RefreshCw,
  Trash2,
  FileSpreadsheet,
  FileCode,
} from 'lucide-react';
import { Button } from '../common/Button';

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
        if (text) {
          onImportJson(text);
        }
      };
      reader.readAsText(file);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const currencies = [
    { code: 'USD', symbol: '$', label: 'USD ($)' },
    { code: 'EUR', symbol: '€', label: 'EUR (€)' },
    { code: 'GBP', symbol: '£', label: 'GBP (£)' },
    { code: 'INR', symbol: '₹', label: 'INR (₹)' },
    { code: 'CAD', symbol: 'C$', label: 'CAD ($)' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & App Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center shadow-md shadow-indigo-200 flex-shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-none">
                CampusBudget
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                Student Edition
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block mt-0.5">
              Student Expense & Budget Tracker
            </p>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Currency Switcher */}
          <div className="flex items-center">
            <label htmlFor="currency-select" className="sr-only">
              Currency
            </label>
            <select
              id="currency-select"
              value={currency}
              onChange={(e) => onCurrencyChange(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 cursor-pointer"
            >
              {currencies.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Export Dropdown / Buttons */}
          <div className="hidden md:flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={onExportCsv}
              icon={<FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />}
              title="Export to CSV"
            >
              CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onExportJson}
              icon={<FileCode className="w-3.5 h-3.5 text-indigo-600" />}
              title="Backup JSON"
            >
              JSON
            </Button>
          </div>

          {/* Import JSON button */}
          <div className="relative">
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleFileUpload}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              icon={<Upload className="w-3.5 h-3.5" />}
              title="Import JSON Backup"
              className="hidden sm:inline-flex"
            >
              Import
            </Button>
          </div>

          {/* Reset / Sample Data */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onResetToSample}
              icon={<RefreshCw className="w-3.5 h-3.5" />}
              title="Reset to sample student data"
              className="text-slate-600 hover:text-indigo-600 p-2"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (window.confirm('Are you sure you want to clear all transactions?')) {
                  onClearAll();
                }
              }}
              icon={<Trash2 className="w-3.5 h-3.5 text-rose-500" />}
              title="Clear all transactions"
              className="text-slate-600 hover:text-rose-600 p-2"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
