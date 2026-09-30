import React, { useState, useEffect } from 'react';
import { BarChart3, Download, Printer, Calendar, Sparkles, TrendingUp, CreditCard, PiggyBank, Target, ArrowUpRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { api } from '../services/api';
import { DashboardData } from '../types';
import { IncomeExpenseChart } from '../components/charts/IncomeExpenseChart';
import { ExpenseDonutChart } from '../components/charts/ExpenseDonutChart';

export const ReportsView: React.FC = () => {
  const { user, refreshTrigger } = useAuth();
  const { formatAmount } = useCurrency();

  const [dashData, setDashData] = useState<DashboardData | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(9);
  const [selectedYear, setSelectedYear] = useState(2026);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadReport() {
      setIsLoading(true);
      try {
        const res = await api.getDashboard(selectedMonth, selectedYear);
        setDashData(res);
      } catch (err) {
        console.error('Failed to load report:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadReport();
  }, [selectedMonth, selectedYear, refreshTrigger]);

  const handlePrint = () => {
    window.print();
  };

  const handleExportSummaryCSV = () => {
    if (!dashData) return;
    const { kpis, monthly_summary, expense_breakdown } = dashData;
    const rows = [
      ['FinAdvisor Monthly Financial Executive Report'],
      ['Reporting Period', monthly_summary.period],
      ['User Name', user?.name || 'Alex Sharma'],
      ['Generated On', new Date().toLocaleDateString()],
      [''],
      ['Key Performance Indicator', 'Amount / Value'],
      ['Total Income', kpis.total_income],
      ['Total Expenses', kpis.total_expenses],
      ['Net Savings', kpis.total_savings],
      ['Savings Rate (%)', `${kpis.savings_rate}%`],
      [''],
      ['Category Breakdown', 'Amount', 'Percentage'],
      ...expense_breakdown.map(e => [e.category, e.amount, `${e.percentage}%`]),
      [''],
      ['AI Monthly Synthesis'],
      [`"${monthly_summary.summary.replace(/"/g, '""')}"`]
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `FinAdvisor_Report_${selectedMonth}_${selectedYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading || !dashData) {
    return <div className="p-8 text-center text-xs text-slate-400">Compiling executive financial report...</div>;
  }

  const { kpis, period, monthly_trend, expense_breakdown, budget_utilization, savings_goals, monthly_summary } = dashData;
  const topCategory = expense_breakdown[0];

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto print:p-0 print:max-w-none">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Financial Reports & Analytics
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Executive financial synthesis, category deep-dives, and printable statements
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportSummaryCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 rounded-xl transition-colors shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Report Document Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs space-y-8 print:border-none print:shadow-none print:p-0">
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-lg font-bold text-slate-900 dark:text-white">FinAdvisor Statement</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Account Holder: <strong className="text-slate-800 dark:text-slate-200">{user?.name}</strong> · Profile: <strong className="capitalize">{user?.user_type}</strong>
            </p>
          </div>

          <div className="text-left sm:text-right text-xs">
            <span className="font-bold text-slate-900 dark:text-white block text-sm">
              {period.label} Report
            </span>
            <span className="text-slate-400">Generated: {new Date().toLocaleDateString()}</span>
          </div>
        </div>

        {/* Executive Summary Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Total Inflow</span>
            <div className="text-xl font-bold text-slate-900 dark:text-white mt-1 tabular-nums">
              {formatAmount(kpis.total_income)}
            </div>
            <span className="text-[11px] text-emerald-600 font-medium">+{kpis.income_growth_pct}% vs last mo</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Total Outflow</span>
            <div className="text-xl font-bold text-slate-900 dark:text-white mt-1 tabular-nums">
              {formatAmount(kpis.total_expenses)}
            </div>
            <span className="text-[11px] text-slate-500 font-medium">{kpis.expense_growth_pct}% vs last mo</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Net Savings</span>
            <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums">
              {formatAmount(kpis.total_savings)}
            </div>
            <span className="text-[11px] text-emerald-600 font-medium">+{kpis.savings_growth_pct}% vs last mo</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Savings Rate</span>
            <div className="text-xl font-bold text-slate-900 dark:text-white mt-1 tabular-nums">
              {kpis.savings_rate}%
            </div>
            <span className="text-[11px] text-slate-500 font-medium">Healthy benchmark</span>
          </div>
        </div>

        {/* AI Synthesis Section */}
        <div className="p-5 rounded-2xl border border-purple-200 dark:border-purple-900/50 bg-purple-50/40 dark:bg-purple-950/20 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">AI Monthly Financial Review</h3>
          </div>

          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            {monthly_summary.summary}
          </p>

          <div className="pt-2">
            <span className="text-xs font-bold text-slate-900 dark:text-white block mb-1.5">
              Strategic Next Steps:
            </span>
            <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
              {monthly_summary.focus_items.map(item => (
                <li key={item} className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Charts in Report */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Cashflow Trend</h3>
            <IncomeExpenseChart data={monthly_trend} />
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Category Distribution</h3>
            <ExpenseDonutChart categories={expense_breakdown} totalExpense={kpis.total_expenses} />
          </div>
        </div>

        {/* Category Breakdown Table */}
        <div className="pt-4 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Detailed Category Breakdown</h3>
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
                  <th className="py-2.5 px-4">Category</th>
                  <th className="py-2.5 px-4 text-right">Actual Spent</th>
                  <th className="py-2.5 px-4 text-right">Share of Outflow</th>
                  <th className="py-2.5 px-4 text-right">Budget Limit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {expense_breakdown.map(e => {
                  const matchingBudget = budget_utilization.find(b => b.category === e.category);
                  return (
                    <tr key={e.category}>
                      <td className="py-2.5 px-4 font-semibold text-slate-900 dark:text-white">{e.category}</td>
                      <td className="py-2.5 px-4 text-right font-medium tabular-nums">{formatAmount(e.amount)}</td>
                      <td className="py-2.5 px-4 text-right tabular-nums text-slate-500">{e.percentage}%</td>
                      <td className="py-2.5 px-4 text-right tabular-nums text-slate-500">
                        {matchingBudget ? formatAmount(matchingBudget.limit) : 'Unbudgeted'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Disclaimer in Print */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 text-center">
          FinAdvisor provides educational financial planning assistance and does not constitute professional financial, investment, tax, or legal advice.
        </div>
      </div>
    </div>
  );
};
