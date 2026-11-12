import React from 'react';
import { Lightbulb, CheckCircle2, Code2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-slate-200/80 bg-white/60 py-8 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Student Smart Budgeting Tip */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-100/80 text-indigo-900">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700 flex-shrink-0">
              <Lightbulb className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-xs text-indigo-950">Campus Finance Tip: </span>
              <span className="text-xs text-indigo-900/80">
                Aim to keep fixed university living costs under 60% of total allowances and save at least 15% for unexpected semester supplies.
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full flex-shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Active Session Saved Locally
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <p className="text-slate-400">
            Student Expense & Budget Tracker Dashboard • Built with React, TypeScript & Tailwind CSS
          </p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-slate-500">
              <Code2 className="w-3.5 h-3.5" />
              <span>Fullstack Engineering Take-Home</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
