import React from 'react';
import './chartSetup';
import { Bar } from 'react-chartjs-2';
import { useTheme } from '../../context/ThemeContext';
import { useCurrency } from '../../context/CurrencyContext';

interface IncomeExpenseChartProps {
  data: {
    month: string;
    income: number;
    expenses: number;
    savings: number;
  }[];
}

export const IncomeExpenseChart: React.FC<IncomeExpenseChartProps> = ({ data }) => {
  const { theme } = useTheme();
  const { currencySymbol, formatAmount } = useCurrency();
  const isDark = theme === 'dark';

  const textColor = isDark ? '#94A3B8' : '#64748B';
  const gridColor = isDark ? 'rgba(51, 65, 85, 0.4)' : 'rgba(226, 232, 240, 0.7)';

  const chartData = {
    labels: data.map(d => d.month),
    datasets: [
      {
        label: 'Income',
        data: data.map(d => d.income),
        backgroundColor: '#10B981', // Emerald green
        borderRadius: 4,
        barPercentage: 0.65,
        categoryPercentage: 0.75
      },
      {
        label: 'Expenses',
        data: data.map(d => d.expenses),
        backgroundColor: isDark ? '#334155' : '#CBD5E1', // Subdued slate
        borderRadius: 4,
        barPercentage: 0.65,
        categoryPercentage: 0.75
      }
    ]
  };

  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        align: 'end' as const,
        labels: {
          color: textColor,
          boxWidth: 10,
          boxHeight: 10,
          usePointStyle: true,
          font: { family: "'Plus Jakarta Sans', sans-serif", size: 12, weight: '500' }
        }
      },
      tooltip: {
        backgroundColor: isDark ? '#0F172A' : '#1E293B',
        titleColor: '#FFFFFF',
        bodyColor: '#F8FAFC',
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          label: (context: any) => {
            return ` ${context.dataset.label}: ${formatAmount(context.raw)}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: textColor,
          font: { family: "'Plus Jakarta Sans', sans-serif", size: 12 }
        }
      },
      y: {
        grid: { color: gridColor },
        ticks: {
          color: textColor,
          font: { family: "'Plus Jakarta Sans', sans-serif", size: 11 },
          callback: (value: any) => `${currencySymbol}${Number(value) >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}`
        }
      }
    }
  };

  return (
    <div className="w-full h-64 md:h-72">
      <Bar data={chartData} options={options} />
    </div>
  );
};
