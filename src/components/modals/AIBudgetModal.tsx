import React, { useState, useEffect } from 'react';
import { X, Sparkles, Check, AlertCircle, Loader2 } from 'lucide-react';
import { AIBudgetRecommendation } from '../../types';
import { useCurrency } from '../../context/CurrencyContext';
import { api } from '../../services/api';

interface AIBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplySuccess: () => void;
  month?: number;
  year?: number;
}

export const AIBudgetModal: React.FC<AIBudgetModalProps> = ({
  isOpen,
  onClose,
  onApplySuccess,
  month = 9,
  year = 2026
}) => {
  const { formatAmount } = useCurrency();
  const [recommendations, setRecommendations] = useState<AIBudgetRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadRecommendations();
    }
  }, [isOpen]);

  const loadRecommendations = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await api.generateAIBudget();
      setRecommendations(res.recommendations);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to generate recommendations');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleApplyAll = async () => {
    setIsApplying(true);
    try {
      // Save each recommended category
      for (const rec of recommendations) {
        await api.setBudget({
          category: rec.category,
          limit_amount: rec.recommended_limit,
          month,
          year
        });
      }
      onApplySuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to apply budgets');
    } finally {
      setIsApplying(false);
    }
  };

  const handleUpdateLimit = (category: string, newLimit: number) => {
    setRecommendations(prev =>
      prev.map(r => (r.category === category ? { ...r, recommended_limit: newLimit } : r))
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/60 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">AI-Powered Budget Generator</h2>
              <p className="text-xs text-slate-500">Personalized category limits based on your cashflow and profile</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {errorMsg && (
            <div className="flex items-center gap-2 p-3 text-xs rounded-lg bg-rose-50 text-rose-600 border border-rose-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                FinAdvisor AI is analyzing your cashflow and generating customized limits...
              </p>
            </div>
          ) : (
            <>
              <div className="p-3.5 rounded-xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40 text-xs text-purple-950 dark:text-purple-200">
                <span className="font-semibold">Educational Strategy:</span> These limits are dynamically generated for your persona to preserve a 20-35% savings rate while comfortably covering essential needs and discretionary lifestyle.
              </div>

              <div className="space-y-3">
                {recommendations.map(rec => (
                  <div
                    key={rec.category}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-slate-900 dark:text-white">
                          {rec.category}
                        </span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {rec.percentage_of_income}% of Inflow
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {rec.reasoning}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <label className="text-xs text-slate-400 font-medium">Limit:</label>
                      <input
                        type="number"
                        step="100"
                        value={rec.recommended_limit}
                        onChange={e => handleUpdateLimit(rec.category, Number(e.target.value))}
                        className="w-28 px-2.5 py-1.5 text-xs font-semibold tabular-nums rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-right focus:outline-hidden focus:ring-2 focus:ring-purple-500/30"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Disclaimer */}
              <p className="text-[11px] text-slate-400 dark:text-slate-500 italic pt-2">
                Disclaimer: This recommendation is educational and should not be treated as professional financial advice.
              </p>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/80">
          <button
            type="button"
            onClick={loadRecommendations}
            disabled={isLoading || isApplying}
            className="text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 font-medium"
          >
            Regenerate
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900"
            >
              Reject
            </button>
            <button
              type="button"
              onClick={handleApplyAll}
              disabled={isLoading || isApplying || recommendations.length === 0}
              className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-xl transition-colors disabled:opacity-50 shadow-xs"
            >
              {isApplying ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Applying...
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Accept & Apply All
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
