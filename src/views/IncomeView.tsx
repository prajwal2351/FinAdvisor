import React, { useState, useEffect } from 'react';
import { TrendingUp, Plus, Trash2, Calendar, Building2, Briefcase, DollarSign } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { api } from '../services/api';
import { Income, IncomeType } from '../types';

export const IncomeView: React.FC = () => {
  const { refreshTrigger, triggerRefresh, setIsAddTransactionOpen } = useAuth();
  const { formatAmount, currencySymbol } = useCurrency();

  const [incomes, setIncomes] = useState<Income[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadIncomes() {
      setIsLoading(true);
      try {
        const res = await api.getIncomes();
        setIncomes(res.incomes);
      } catch (err) {
        console.error('Failed to load incomes:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadIncomes();
  }, [refreshTrigger]);

  const handleDelete = async (id: string) => {
    try {
      await api.deleteIncome(id);
      triggerRefresh();
    } catch (e) {
      console.error('Delete income failed:', e);
    }
  };

  const totalInflow = incomes.reduce((acc, i) => acc + i.amount, 0);

  // Group by source
  const sourceBreakdown = incomes.reduce((acc, inc) => {
    acc[inc.source] = (acc[inc.source] || 0) + inc.amount;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Income Streams & Inflows
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage your salary, freelance retainers, bonuses, and investment yields
          </p>
        </div>

        <button
          onClick={() => setIsAddTransactionOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Record Inflow</span>
        </button>
      </div>

      {/* KPI Cards for Income */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Recorded Inflow</span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1 tabular-nums">
            {formatAmount(totalInflow)}
          </div>
          <span className="text-xs text-emerald-600 mt-1 font-medium block">Across {incomes.length} deposits</span>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Income Sources</span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1 tabular-nums">
            {Object.keys(sourceBreakdown).length}
          </div>
          <span className="text-xs text-slate-500 mt-1 font-medium block">Employers & Client accounts</span>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Average Inflow / Deposit</span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1 tabular-nums">
            {formatAmount(incomes.length > 0 ? totalInflow / incomes.length : 0)}
          </div>
          <span className="text-xs text-slate-500 mt-1 font-medium block">Calculated baseline</span>
        </div>
      </div>

      {/* Income Records Ledger */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Income Ledger</h2>
          <span className="text-xs text-slate-400 font-medium">{incomes.length} records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Source / Entity</th>
                <th className="py-3 px-4">Income Type</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {incomes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No income records found. Click "+ Record Inflow" above.
                  </td>
                </tr>
              ) : (
                incomes.map(inc => (
                  <tr key={inc.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap font-medium">
                      {inc.date}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                      {inc.source}
                    </td>
                    <td className="py-3 px-4 capitalize text-slate-600 dark:text-slate-400">
                      {inc.income_type}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                      {inc.description}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-600 dark:text-emerald-400 tabular-nums whitespace-nowrap">
                      +{formatAmount(inc.amount)}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleDelete(inc.id)}
                        className="w-7 h-7 inline-flex items-center justify-center rounded-lg text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
