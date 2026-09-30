import React from 'react';
import { FinancialHealthScore } from '../../types';
import { Sparkles, CheckCircle2, AlertTriangle } from 'lucide-react';

interface FinancialHealthGaugeProps {
  healthScore: FinancialHealthScore;
}

export const FinancialHealthGauge: React.FC<FinancialHealthGaugeProps> = ({ healthScore }) => {
  const { score, rating, explanation, breakdown } = healthScore;

  // Circular gauge calculations
  const size = 110;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let strokeColor = '#10B981'; // Emerald
  if (score < 50) strokeColor = '#EF4444'; // Red
  else if (score < 70) strokeColor = '#F59E0B'; // Amber
  else if (score < 80) strokeColor = '#3B82F6'; // Blue

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-purple-50 dark:bg-purple-950/60 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Financial Wellness Score</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">AI-generated financial wellness indicator</p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
          {rating}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Circular SVG Gauge */}
        <div className="relative shrink-0 flex items-center justify-center">
          <svg width={size} height={size} className="transform -rotate-90">
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              className="text-slate-100 dark:text-slate-800"
              fill="transparent"
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">{score}</span>
            <span className="text-[10px] text-slate-400 font-medium">out of 100</span>
          </div>
        </div>

        {/* Narrative & Factors */}
        <div className="flex-1 space-y-2.5 text-xs">
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            {explanation}
          </p>

          <div className="grid grid-cols-2 gap-2 pt-1">
            {breakdown.map(b => (
              <div key={b.factor} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5 truncate">
                  {b.status === 'good' ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  )}
                  <span className="text-slate-700 dark:text-slate-300 truncate font-medium">{b.factor}</span>
                </div>
                <span className="tabular-nums font-semibold text-slate-900 dark:text-slate-100 shrink-0">
                  {b.score}/{b.max}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
