import React from 'react';
import { useCurrency } from '../../context/CurrencyContext';

interface BudgetProgressBarProps {
  category: string;
  limit: number;
  spent: number;
  percentage: number;
  status: 'normal' | 'warning' | 'near_limit' | 'exceeded';
}

export const BudgetProgressBar: React.FC<BudgetProgressBarProps> = ({
  category,
  limit,
  spent,
  percentage,
  status
}) => {
  const { formatAmount } = useCurrency();

  // Color mapping based on financial rules:
  // Green for safe, Amber for warning (70-90%), Orange for near limit (90-100%), Red for exceeded (>100%)
  let barColor = 'bg-emerald-500';
  let badgeColor = 'text-emerald-700 dark:text-emerald-400';
  let badgeText = 'On track';

  if (status === 'exceeded') {
    barColor = 'bg-rose-500';
    badgeColor = 'text-rose-600 dark:text-rose-400 font-semibold';
    badgeText = 'Exceeded';
  } else if (status === 'near_limit') {
    barColor = 'bg-orange-500';
    badgeColor = 'text-orange-600 dark:text-orange-400 font-medium';
    badgeText = 'Near limit';
  } else if (status === 'warning') {
    barColor = 'bg-amber-500';
    badgeColor = 'text-amber-600 dark:text-amber-400';
    badgeText = 'Approaching';
  }

  const fillWidth = Math.min(100, Math.max(0, percentage));

  return (
    <div className="py-2.5">
      <div className="flex items-center justify-between text-xs mb-1.5">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-800 dark:text-slate-200">{category}</span>
          <span className={`text-[11px] ${badgeColor}`}>({badgeText})</span>
        </div>
        <div className="text-slate-500 dark:text-slate-400 tabular-nums">
          <span className="font-medium text-slate-900 dark:text-slate-100">{formatAmount(spent)}</span>
          <span className="mx-1">/</span>
          <span>{formatAmount(limit)}</span>
          <span className="ml-2 font-semibold text-slate-700 dark:text-slate-300">({percentage}%)</span>
        </div>
      </div>
      <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${barColor}`}
          style={{ width: `${fillWidth}%` }}
        />
      </div>
    </div>
  );
};
