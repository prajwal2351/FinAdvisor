import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  CreditCard,
  PiggyBank,
  Percent,
  Plus,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Calendar,
  ChevronRight,
  ShieldCheck,
  Target
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { api } from '../services/api';
import { DashboardData } from '../types';
import { KPICard } from '../components/common/KPICard';
import { IncomeExpenseChart } from '../components/charts/IncomeExpenseChart';
import { ExpenseDonutChart } from '../components/charts/ExpenseDonutChart';
import { BudgetProgressBar } from '../components/charts/BudgetProgressBar';
import { FinancialHealthGauge } from '../components/common/FinancialHealthGauge';
import { AIBudgetModal } from '../components/modals/AIBudgetModal';
import { ContributeGoalModal } from '../components/modals/ContributeGoalModal';
import { AddGoalModal } from '../components/modals/AddGoalModal';

export const DashboardView: React.FC = () => {
  const { user, refreshTrigger, setIsAddTransactionOpen, setActiveTab } = useAuth();
  const { formatAmount } = useCurrency();

  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAIBudgetOpen, setIsAIBudgetOpen] = useState(false);
  const [selectedGoalForContribution, setSelectedGoalForContribution] = useState<any>(null);
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);

  useEffect(() => {
    async function loadDashboard() {
      setIsLoading(true);
      try {
        const res = await api.getDashboard(9, 2026);
        setData(res);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadDashboard();
  }, [refreshTrigger, user?.id]);

  if (isLoading || !data) {
    return (
      <div className="p-4 md:p-8 space-y-6 animate-pulse">
        <div className="h-8 w-64 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-72 lg:col-span-2 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          <div className="h-72 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        </div>
      </div>
    );
  }

  const { kpis, period, monthly_trend, expense_breakdown, budget_utilization, savings_goals, ai_insights, recent_transactions, health_score, monthly_summary } = data;

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Greeting & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Good morning, {user?.name?.split(' ')[0] || 'Alex'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>Here's your financial overview for {period.label}.</span>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsAIBudgetOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 hover:bg-purple-100 transition-colors shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-500" />
            <span>AI Budget</span>
          </button>

          <button
            onClick={() => setIsAddTransactionOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 rounded-xl transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      {/* Row 1: KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          label="Total Income"
          amount={formatAmount(kpis.total_income)}
          changePct={kpis.income_growth_pct}
          changeLabel="vs last month"
          icon={TrendingUp}
          variant="emerald"
        />
        <KPICard
          label="Total Expenses"
          amount={formatAmount(kpis.total_expenses)}
          changePct={kpis.expense_growth_pct}
          changeLabel="vs last month"
          icon={CreditCard}
          variant="slate"
          isInverseSentiment
        />
        <KPICard
          label="Total Savings"
          amount={formatAmount(kpis.total_savings)}
          changePct={kpis.savings_growth_pct}
          changeLabel="vs last month"
          icon={PiggyBank}
          variant="emerald"
        />
        <KPICard
          label="Savings Rate"
          amount={`${kpis.savings_rate}%`}
          changePct={Math.round((kpis.savings_rate - (kpis.prev_savings_rate || 25)) * 10) / 10}
          changeLabel="pts vs last month"
          icon={Percent}
          variant="navy"
        />
      </div>

      {/* Row 2: Charts (Income vs Expense + Donut) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Cashflow Inflow vs Outflow</h2>
              <p className="text-xs text-slate-500">Historical performance over the past 6 months</p>
            </div>
            <button
              onClick={() => setActiveTab('reports')}
              className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              Detailed Report <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <IncomeExpenseChart data={monthly_trend} />
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Expense Distribution</h2>
              <p className="text-xs text-slate-500">Spending by category for {period.label}</p>
            </div>
            <ExpenseDonutChart categories={expense_breakdown} totalExpense={kpis.total_expenses} />
          </div>

          <div className="pt-3 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>{expense_breakdown.length} active categories</span>
            <button
              onClick={() => setActiveTab('expenses')}
              className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
            >
              View ledger →
            </button>
          </div>
        </div>
      </div>

      {/* Row 3: Budget Utilization + Savings Goals Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Budget Utilization Progress */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-2">
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Budget Utilization</h2>
              <p className="text-xs text-slate-500">Actual spending against monthly category limits</p>
            </div>
            <button
              onClick={() => setActiveTab('budgets')}
              className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              Manage Budgets →
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {budget_utilization.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No active budgets set for this month.
                <button
                  onClick={() => setIsAIBudgetOpen(true)}
                  className="block mx-auto mt-2 text-purple-600 hover:underline font-semibold"
                >
                  Generate Budget with AI
                </button>
              </div>
            ) : (
              budget_utilization.slice(0, 5).map(b => (
                <BudgetProgressBar
                  key={b.category}
                  category={b.category}
                  limit={b.limit}
                  spent={b.spent}
                  percentage={b.percentage}
                  status={b.status}
                />
              ))
            )}
          </div>
        </div>

        {/* Savings Goals Cards */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div>
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Savings Milestones</h2>
                <p className="text-xs text-slate-500">Long-term targets and automated contributions</p>
              </div>
              <button
                onClick={() => setIsAddGoalOpen(true)}
                className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
              >
                + New Goal
              </button>
            </div>

            <div className="space-y-3">
              {savings_goals.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  No savings goals created yet.
                </div>
              ) : (
                savings_goals.map(g => {
                  const pct = Math.min(100, Math.round((g.current_amount / (g.target_amount || 1)) * 100));
                  return (
                    <div
                      key={g.id}
                      className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4 text-emerald-600" />
                          <span className="font-semibold text-slate-900 dark:text-white">{g.name}</span>
                        </div>
                        <span className="font-bold text-emerald-600 tabular-nums">{pct}%</span>
                      </div>

                      <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                        <span className="tabular-nums">
                          {formatAmount(g.current_amount)} of {formatAmount(g.target_amount)}
                        </span>
                        <button
                          onClick={() => setSelectedGoalForContribution(g)}
                          className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                        >
                          + Add Funds
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="pt-3 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>Automating ₹{savings_goals.reduce((acc, g) => acc + g.monthly_contribution, 0).toLocaleString()} / month</span>
            <button
              onClick={() => setActiveTab('savings')}
              className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
            >
              All Goals →
            </button>
          </div>
        </div>
      </div>

      {/* Row 4: AI Financial Insights + Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Prominent AI Insights Section */}
        <div className="bg-gradient-to-br from-purple-50/80 via-white to-purple-50/30 dark:from-purple-950/20 dark:via-slate-900 dark:to-slate-900 border border-purple-200/80 dark:border-purple-900/40 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-purple-100 dark:border-purple-900/40 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-slate-900 dark:text-white">AI Financial Insights</h2>
                  <p className="text-[11px] text-slate-500">Autonomous pattern detection & tips</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('ai-advisor')}
                className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline"
              >
                Ask AI →
              </button>
            </div>

            <div className="space-y-3">
              {ai_insights.map(ins => (
                <div
                  key={ins.id}
                  className="p-3.5 rounded-xl border border-purple-100 dark:border-purple-900/40 bg-white/80 dark:bg-slate-900/80 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                      {ins.category}
                    </span>
                    {ins.urgency === 'warning' && (
                      <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> Over budget
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                    {ins.text}
                  </p>
                  {ins.suggested_action && (
                    <div className="pt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <span>Suggested action: {ins.suggested_action}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-purple-100 dark:border-purple-900/40 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">Personalized for {user?.name}</span>
            <button
              onClick={() => setActiveTab('ai-advisor')}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors shadow-xs"
            >
              Open AI Chat
            </button>
          </div>
        </div>

        {/* Recent Transactions List */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div>
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Recent Financial Activity</h2>
                <p className="text-xs text-slate-500">Latest recorded income & expenses</p>
              </div>
              <button
                onClick={() => setActiveTab('transactions')}
                className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                View all transactions →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-medium">
                    <th className="pb-2">Date</th>
                    <th className="pb-2">Description</th>
                    <th className="pb-2">Category / Source</th>
                    <th className="pb-2">Method</th>
                    <th className="pb-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {recent_transactions.slice(0, 6).map(t => {
                    const isIncome = t.type === 'income';
                    return (
                      <tr key={t.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-2.5 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                          {t.date}
                        </td>
                        <td className="py-2.5 font-medium text-slate-900 dark:text-white truncate max-w-[200px]">
                          {t.description}
                        </td>
                        <td className="py-2.5 text-slate-600 dark:text-slate-400">
                          {t.categoryOrSource}
                        </td>
                        <td className="py-2.5 text-slate-500 dark:text-slate-400">
                          {t.paymentMethodOrType}
                        </td>
                        <td className={`py-2.5 text-right font-semibold tabular-nums whitespace-nowrap ${
                          isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'
                        }`}>
                          {isIncome ? '+' : '-'}{formatAmount(t.amount)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>Showing verified ledger entries</span>
            <button
              onClick={() => setIsAddTransactionOpen(true)}
              className="text-emerald-600 font-medium hover:underline"
            >
              + Quick Record
            </button>
          </div>
        </div>
      </div>

      {/* Row 5: Financial Health Indicator & Monthly Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FinancialHealthGauge healthScore={health_score} />

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                {monthly_summary.period} Financial Summary
              </h2>
              <p className="text-xs text-slate-500">AI-generated monthly synthesis & next month priorities</p>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {monthly_summary.summary}
            </p>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs font-semibold text-slate-900 dark:text-white block mb-2">
                Suggested Focus for Next Month:
              </span>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                {monthly_summary.focus_items.map(item => (
                  <li key={item} className="flex items-start gap-1.5">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">Export available in Reports</span>
            <button
              onClick={() => setActiveTab('reports')}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              View Full PDF/CSV Report →
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AIBudgetModal
        isOpen={isAIBudgetOpen}
        onClose={() => setIsAIBudgetOpen(false)}
        onApplySuccess={() => {}}
      />

      <ContributeGoalModal
        goal={selectedGoalForContribution}
        onClose={() => setSelectedGoalForContribution(null)}
        onSuccess={() => {}}
      />

      <AddGoalModal
        isOpen={isAddGoalOpen}
        onClose={() => setIsAddGoalOpen(false)}
        onSuccess={() => {}}
      />
    </div>
  );
};
