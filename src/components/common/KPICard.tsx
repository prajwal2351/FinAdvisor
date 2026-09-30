import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  label: string;
  amount: string;
  changePct?: number;
  changeLabel?: string;
  icon: LucideIcon;
  variant?: 'emerald' | 'slate' | 'navy' | 'purple';
  isInverseSentiment?: boolean; // For expenses where a decrease is positive
}

export const KPICard: React.FC<KPICardProps> = ({
  label,
  amount,
  changePct,
  changeLabel = 'vs last month',
  icon: Icon,
  variant = 'slate',
  isInverseSentiment = false
}) => {
  // Determine if growth is positive or negative
  const isPositiveGrowth = (changePct ?? 0) > 0;
  const isZero = changePct === 0 || changePct === undefined;

  // Good sentiment: If positive growth and not inverse (income up = good) OR negative growth and inverse (expense down = good)
  const isGood = isInverseSentiment ? (changePct ?? 0) <= 0 : (changePct ?? 0) >= 0;

  let trendColor = 'text-slate-500 dark:text-slate-400';
  if (!isZero) {
    trendColor = isGood ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400';
  }

  const iconBg = {
    emerald: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400',
    slate: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300',
    navy: 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400',
    purple: 'bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400'
  }[variant];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs transition-shadow hover:shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {label}
        </span>
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${iconBg}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="mt-3">
        <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums">
          {amount}
        </div>

        {changePct !== undefined && (
          <div className="mt-2 flex items-center gap-1.5 text-xs">
            <span className={`inline-flex items-center font-semibold tabular-nums ${trendColor}`}>
              {isZero ? (
                <Minus className="w-3.5 h-3.5 mr-0.5" />
              ) : isPositiveGrowth ? (
                <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
              )}
              {isPositiveGrowth ? '+' : ''}{changePct}%
            </span>
            <span className="text-slate-400 dark:text-slate-500">{changeLabel}</span>
          </div>
        )}
      </div>
    </div>
  );
};
