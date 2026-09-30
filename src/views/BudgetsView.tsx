import React, { useState, useEffect } from 'react';
import { PieChart, Plus, Sparkles, AlertTriangle, CheckCircle2, TrendingUp, Sliders } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { api } from '../services/api';
import { DashboardData, ExpenseCategory } from '../types';
import { BudgetProgressBar } from '../components/charts/BudgetProgressBar';
import { AIBudgetModal } from '../components/modals/AIBudgetModal';

const ALL_CATEGORIES: ExpenseCategory[] = [
  'Housing',
  'Food',
  'Transport',
  'Shopping',
  'Entertainment',
  'Healthcare',
  'Education',
  'Utilities',
  'Subscriptions',
  'Travel',
  'Other'
];

export const BudgetsView: React.FC = () => {
  const { refreshTrigger, triggerRefresh } = useAuth();
  const { formatAmount } = useCurrency();

  const [dashData, setDashData] = useState<DashboardData | null>(null);
  const [isAIBudgetOpen, setIsAIBudgetOpen] = useState(false);
  const [isCustomLimitOpen, setIsCustomLimitOpen] = useState(false);
  const [selectedCat, setSelectedCat] = useState<ExpenseCategory>('Food');
  const [customLimit, setCustomLimit] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadBudgets() {
      setIsLoading(true);
      try {
        const res = await api.getDashboard(9, 2026);
        setDashData(res);
      } catch (err) {
        console.error('Failed to load budgets:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadBudgets();
  }, [refreshTrigger]);

  const handleSaveCustomLimit = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(customLimit);
    if (isNaN(val) || val <= 0) return;

    try {
      await api.setBudget({
        category: selectedCat,
        limit_amount: val,
        month: 9,
        year: 2026
      });
      setIsCustomLimitOpen(false);
      setCustomLimit('');
      triggerRefresh();
    } catch (e: any) {
      console.error('Failed to set budget:', e);
    }
  };

  if (isLoading || !dashData) {
    return <div className="p-8 text-center text-xs text-slate-400">Loading budget planner...</div>;
  }

  const { budget_utilization, kpis, period } = dashData;

  const totalPlannedExpenses = budget_utilization.reduce((acc, b) => acc + b.limit, 0);
  const totalActualSpent = budget_utilization.reduce((acc, b) => acc + b.spent, 0);
  const expectedSavings = Math.max(0, kpis.total_income - totalPlannedExpenses);
  const remainingBudgetOverall = totalPlannedExpenses - totalActualSpent;

  const exceededCount = budget_utilization.filter(b => b.status === 'exceeded').length;

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {period.label} Budget Planner
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Monitor planned spending thresholds, control category outflows, and prevent overruns
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsCustomLimitOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-xs"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Set Category Limit</span>
          </button>

          <button
            onClick={() => setIsAIBudgetOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-xl transition-colors shadow-xs"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Budget with AI</span>
          </button>
        </div>
      </div>

      {/* Top 4 Budget KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Monthly Cashflow</span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1 tabular-nums">
            {formatAmount(kpis.total_income)}
          </div>
          <span className="text-xs text-slate-500 mt-1 block">Baseline inflow for {period.label}</span>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Planned Expense Cap</span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1 tabular-nums">
            {formatAmount(totalPlannedExpenses)}
          </div>
          <span className="text-xs text-slate-500 mt-1 block">Sum of active category limits</span>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Expected Savings Buffer</span>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums">
            {formatAmount(expectedSavings)}
          </div>
          <span className="text-xs text-emerald-600 mt-1 block font-medium">
            {Math.round((expectedSavings / (kpis.total_income || 1)) * 100)}% projected savings rate
          </span>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Remaining Buffer</span>
          <div className={`text-2xl font-bold mt-1 tabular-nums ${
            remainingBudgetOverall >= 0 ? 'text-slate-900 dark:text-white' : 'text-rose-600'
          }`}>
            {formatAmount(remainingBudgetOverall)}
          </div>
          <span className={`text-xs mt-1 block font-medium ${exceededCount > 0 ? 'text-rose-500' : 'text-slate-500'}`}>
            {exceededCount > 0 ? `${exceededCount} category over limit` : 'All categories within limits'}
          </span>
        </div>
      </div>

      {/* Main Budget Progress Ledger */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">Category Limits & Spending Pace</h2>
            <p className="text-xs text-slate-500">Color states: 0–70% Green, 70–90% Amber, 90–100% Orange, &gt;100% Red</p>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            {budget_utilization.length} tracked categories
          </span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {budget_utilization.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No budgets established for {period.label}.
              <button
                onClick={() => setIsAIBudgetOpen(true)}
                className="block mx-auto mt-2 text-purple-600 hover:underline font-semibold"
              >
                Generate Budget with AI
              </button>
            </div>
          ) : (
            budget_utilization.map(b => (
              <div key={b.category} className="py-3">
                <BudgetProgressBar
                  category={b.category}
                  limit={b.limit}
                  spent={b.spent}
                  percentage={b.percentage}
                  status={b.status}
                />
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>
                    Remaining room: <strong className={b.remaining >= 0 ? 'text-slate-700 dark:text-slate-300' : 'text-rose-600'}>{formatAmount(b.remaining)}</strong>
                  </span>
                  <button
                    onClick={() => {
                      setSelectedCat(b.category);
                      setCustomLimit(b.limit.toString());
                      setIsCustomLimitOpen(true);
                    }}
                    className="text-emerald-600 dark:text-emerald-400 hover:underline font-semibold"
                  >
                    Adjust Limit
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Manual Custom Limit Modal */}
      {isCustomLimitOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Set Budget Limit</h3>

            <form onSubmit={handleSaveCustomLimit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                <select
                  value={selectedCat}
                  onChange={e => setSelectedCat(e.target.value as ExpenseCategory)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                >
                  {ALL_CATEGORIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Monthly Limit Amount</label>
                <input
                  type="number"
                  step="100"
                  required
                  value={customLimit}
                  onChange={e => setCustomLimit(e.target.value)}
                  placeholder="e.g. 6000"
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white tabular-nums"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCustomLimitOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl"
                >
                  Save Limit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Budget Modal */}
      <AIBudgetModal
        isOpen={isAIBudgetOpen}
        onClose={() => setIsAIBudgetOpen(false)}
        onApplySuccess={() => triggerRefresh()}
      />
    </div>
  );
};
