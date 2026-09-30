import React, { useState, useEffect } from 'react';
import { Target, Plus, ShieldCheck, Laptop, GraduationCap, Home, Calendar, Sparkles, Trash2, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { api } from '../services/api';
import { SavingsGoal } from '../types';
import { AddGoalModal } from '../components/modals/AddGoalModal';
import { ContributeGoalModal } from '../components/modals/ContributeGoalModal';

export const SavingsGoalsView: React.FC = () => {
  const { refreshTrigger, triggerRefresh, setActiveTab } = useAuth();
  const { formatAmount } = useCurrency();

  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
  const [contributeGoal, setContributeGoal] = useState<SavingsGoal | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadGoals() {
      setIsLoading(true);
      try {
        const res = await api.getSavingsGoals();
        setGoals(res.goals);
      } catch (err) {
        console.error('Failed to load goals:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadGoals();
  }, [refreshTrigger]);

  const handleDelete = async (id: string) => {
    try {
      await api.deleteSavingsGoal(id);
      triggerRefresh();
    } catch (e) {
      console.error('Delete goal failed:', e);
    }
  };

  const totalSaved = goals.reduce((acc, g) => acc + g.current_amount, 0);
  const totalTarget = goals.reduce((acc, g) => acc + g.target_amount, 0);
  const overallProgress = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Savings Goals & Milestones
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Build disciplined wealth targets, emergency safety cushions, and asset purchase funds
          </p>
        </div>

        <button
          onClick={() => setIsAddGoalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Create Financial Goal</span>
        </button>
      </div>

      {/* Aggregate Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Accumulated Wealth</span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1 tabular-nums">
            {formatAmount(totalSaved)}
          </div>
          <span className="text-xs text-emerald-600 mt-1 font-medium block">
            Across {goals.length} active savings targets
          </span>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Cumulative Target Objective</span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1 tabular-nums">
            {formatAmount(totalTarget)}
          </div>
          <span className="text-xs text-slate-500 mt-1 font-medium block">
            Remaining gap: {formatAmount(Math.max(0, totalTarget - totalSaved))}
          </span>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Overall Goal Completion</span>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums">
            {overallProgress}%
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${overallProgress}%` }} />
          </div>
        </div>
      </div>

      {/* AI Savings Recommendation Banner */}
      <div className="p-4 sm:p-5 rounded-2xl border border-purple-200 dark:border-purple-900/50 bg-purple-50/60 dark:bg-purple-950/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="space-y-0.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300">
              AI Savings Strategy & Surplus Allocation
            </h3>
            <p className="text-xs text-slate-700 dark:text-slate-300 max-w-2xl leading-relaxed">
              Based on your monthly surplus, allocating an extra ₹2,500/month towards your primary goal will help you reach completion <strong>6 weeks ahead of schedule</strong>.
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('ai-advisor')}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-xl transition-colors shrink-0 shadow-xs"
        >
          <span>Ask AI Strategy</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.length === 0 ? (
          <div className="col-span-2 py-16 text-center text-slate-400 text-xs bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <Target className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
            <p>No savings goals created yet.</p>
            <button
              onClick={() => setIsAddGoalOpen(true)}
              className="mt-3 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl"
            >
              Create Your First Goal
            </button>
          </div>
        ) : (
          goals.map(goal => {
            const pct = Math.min(100, Math.round((goal.current_amount / (goal.target_amount || 1)) * 100));
            const remaining = Math.max(0, goal.target_amount - goal.current_amount);
            const monthsLeft = goal.monthly_contribution > 0 ? Math.ceil(remaining / goal.monthly_contribution) : 12;

            return (
              <div
                key={goal.id}
                className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between shadow-xs space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                        <Target className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-base font-bold text-slate-900 dark:text-white">{goal.name}</h2>
                        <div className="text-[11px] text-slate-500 flex items-center gap-2">
                          <Calendar className="w-3 h-3" />
                          <span>Target: {goal.target_date}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDelete(goal.id)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Amounts */}
                  <div className="mt-5 flex items-baseline justify-between">
                    <div>
                      <span className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums">
                        {formatAmount(goal.current_amount)}
                      </span>
                      <span className="text-xs text-slate-400 ml-1.5">
                        of {formatAmount(goal.target_amount)}
                      </span>
                    </div>
                    <span className="text-base font-bold text-emerald-600 tabular-nums">{pct}%</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  {/* Sub-metrics */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs text-slate-500">
                    <div>
                      <span className="block text-[11px] text-slate-400 font-medium">Monthly Allocation:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 tabular-nums">
                        {formatAmount(goal.monthly_contribution)} / mo
                      </span>
                    </div>
                    <div>
                      <span className="block text-[11px] text-slate-400 font-medium">Estimated Pace:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {remaining === 0 ? 'Goal Completed! 🎉' : `~${monthsLeft} months remaining`}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end">
                  <button
                    onClick={() => setContributeGoal(goal)}
                    className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-colors shadow-xs"
                  >
                    + Add Funds
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modals */}
      <AddGoalModal
        isOpen={isAddGoalOpen}
        onClose={() => setIsAddGoalOpen(false)}
        onSuccess={() => triggerRefresh()}
      />

      <ContributeGoalModal
        goal={contributeGoal}
        onClose={() => setContributeGoal(null)}
        onSuccess={() => triggerRefresh()}
      />
    </div>
  );
};
