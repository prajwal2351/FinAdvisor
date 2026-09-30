import React, { useState } from 'react';
import { X, PlusCircle, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { SavingsGoal } from '../../types';
import { useCurrency } from '../../context/CurrencyContext';
import { api } from '../../services/api';

interface ContributeGoalModalProps {
  goal: SavingsGoal | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const ContributeGoalModal: React.FC<ContributeGoalModalProps> = ({ goal, onClose, onSuccess }) => {
  const { currencySymbol, formatAmount } = useCurrency();
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!goal) return null;

  const quickAmounts = [1000, 2500, 5000, goal.monthly_contribution || 5000];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) return;

    setIsSubmitting(true);
    try {
      await api.contributeToGoal(goal.id, val);
      setSuccessMsg(`Deposited ${formatAmount(val)} to ${goal.name}!`);

      // Trigger celebratory confetti if milestone
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch (e) {
        // ignore
      }

      setTimeout(() => {
        onSuccess();
        onClose();
      }, 700);
    } catch (err: any) {
      console.error('Contribution error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Add Funds to Goal</h2>
            <p className="text-[11px] text-slate-500 truncate">{goal.name}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {successMsg ? (
            <div className="flex items-center gap-2 p-3 text-xs rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200">
              <Check className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Contribution Amount ({currencySymbol})
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                    {currencySymbol}
                  </span>
                  <input
                    type="number"
                    step="50"
                    min="1"
                    required
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    placeholder="e.g. 5000"
                    className="w-full pl-8 pr-4 py-2.5 text-base font-semibold tabular-nums rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>
              </div>

              {/* Quick Select Buttons */}
              <div className="flex items-center gap-2">
                {Array.from(new Set(quickAmounts)).map(amt => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setAmount(amt.toString())}
                    className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-medium tabular-nums transition-colors"
                  >
                    +{formatAmount(amt, { compact: true })}
                  </button>
                ))}
              </div>
            </>
          )}

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !!successMsg}
              className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-colors disabled:opacity-50"
            >
              <PlusCircle className="w-4 h-4" />
              {isSubmitting ? 'Processing...' : 'Confirm Deposit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
