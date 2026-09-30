import React, { useState, useEffect } from 'react';
import { CreditCard, Plus, Trash2, Filter, DollarSign } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { api } from '../services/api';
import { Expense, ExpenseCategory } from '../types';

export const ExpensesView: React.FC = () => {
  const { refreshTrigger, triggerRefresh, setIsAddTransactionOpen } = useAuth();
  const { formatAmount } = useCurrency();

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadExpenses() {
      setIsLoading(true);
      try {
        const res = await api.getExpenses();
        setExpenses(res.expenses);
      } catch (err) {
        console.error('Failed to load expenses:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadExpenses();
  }, [refreshTrigger]);

  const handleDelete = async (id: string) => {
    try {
      await api.deleteExpense(id);
      triggerRefresh();
    } catch (e) {
      console.error('Delete expense failed:', e);
    }
  };

  const filtered = selectedCat === 'all' ? expenses : expenses.filter(e => e.category === selectedCat);
  const totalOutflow = filtered.reduce((acc, e) => acc + e.amount, 0);

  const categories = Array.from(new Set(expenses.map(e => e.category)));

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Expenses & Outflows
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track daily, weekly, and monthly spending across all categories
          </p>
        </div>

        <button
          onClick={() => setIsAddTransactionOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 rounded-xl transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Record Expense</span>
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Filtered Expenditure</span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1 tabular-nums">
            {formatAmount(totalOutflow)}
          </div>
          <span className="text-xs text-slate-500 mt-1 font-medium block">Across {filtered.length} transactions</span>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tracked Categories</span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1 tabular-nums">
            {categories.length}
          </div>
          <span className="text-xs text-slate-500 mt-1 font-medium block">Active spending buckets</span>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Average Outflow</span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1 tabular-nums">
            {formatAmount(filtered.length > 0 ? totalOutflow / filtered.length : 0)}
          </div>
          <span className="text-xs text-slate-500 mt-1 font-medium block">Per recorded expense</span>
        </div>
      </div>

      {/* Filter row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedCat('all')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
            selectedCat === 'all'
              ? 'bg-slate-900 dark:bg-emerald-600 text-white'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 hover:text-slate-900'
          }`}
        >
          All Categories
        </button>
        {categories.map(c => (
          <button
            key={c}
            onClick={() => setSelectedCat(c)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
              selectedCat === c
                ? 'bg-slate-900 dark:bg-emerald-600 text-white'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 hover:text-slate-900'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Expenses Ledger */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No expenses found in this category.
                  </td>
                </tr>
              ) : (
                filtered.map(exp => (
                  <tr key={exp.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap font-medium">
                      {exp.date}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                      {exp.description}
                      {exp.notes && <div className="text-[11px] text-slate-400 font-normal">{exp.notes}</div>}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                      {exp.category}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {exp.payment_method}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900 dark:text-white tabular-nums whitespace-nowrap">
                      -{formatAmount(exp.amount)}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleDelete(exp.id)}
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
