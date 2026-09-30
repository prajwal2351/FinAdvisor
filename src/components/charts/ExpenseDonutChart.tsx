import React from 'react';
import './chartSetup';
import { Doughnut } from 'react-chartjs-2';
import { ExpenseCategory } from '../../types';
import { useCurrency } from '../../context/CurrencyContext';

interface ExpenseDonutChartProps {
  categories: {
    category: ExpenseCategory;
    amount: number;
    percentage: number;
    color: string;
  }[];
  totalExpense: number;
}

export const ExpenseDonutChart: React.FC<ExpenseDonutChartProps> = ({ categories, totalExpense }) => {
  const { formatAmount } = useCurrency();

  if (!categories || categories.length === 0 || totalExpense === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-400 dark:text-slate-500 text-sm">
        <span>No expenses recorded for this period</span>
      </div>
    );
  }

  const topCategories = categories.slice(0, 6);
  const otherAmount = categories.slice(6).reduce((acc, c) => acc + c.amount, 0);

  const displayLabels = [...topCategories.map(c => c.category)];
  const displayAmounts = [...topCategories.map(c => c.amount)];
  const displayColors = [...topCategories.map(c => c.color)];

  if (otherAmount > 0) {
    displayLabels.push('Other');
    displayAmounts.push(otherAmount);
    displayColors.push('#94A3B8');
  }

  const chartData = {
    labels: displayLabels,
    datasets: [
      {
        data: displayAmounts,
        backgroundColor: displayColors,
        borderWidth: 2,
        borderColor: 'transparent',
        hoverOffset: 4
      }
    ]
  };

  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '74%',
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          label: (context: any) => {
            const val = context.raw;
            const pct = Math.round((val / totalExpense) * 100);
            return ` ${context.label}: ${formatAmount(val)} (${pct}%)`;
          }
        }
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center gap-6">
      <div className="relative w-48 h-48 shrink-0">
        <Doughnut data={chartData} options={options} />
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">Total Outflow</span>
          <span className="text-lg font-bold text-slate-900 dark:text-white tabular-nums">
            {formatAmount(totalExpense, { compact: true })}
          </span>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-x-4 gap-y-2 w-full text-xs">
        {displayLabels.map((label, idx) => {
          const amt = displayAmounts[idx];
          const pct = Math.round((amt / totalExpense) * 100);
          return (
            <div key={label} className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 truncate pr-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: displayColors[idx] }} />
                <span className="text-slate-700 dark:text-slate-300 truncate">{label}</span>
              </div>
              <span className="font-semibold text-slate-900 dark:text-slate-100 tabular-nums shrink-0">
                {pct}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
