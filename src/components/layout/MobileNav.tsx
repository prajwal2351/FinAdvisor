import React from 'react';
import {
  LayoutDashboard,
  Receipt,
  PieChart,
  Target,
  Sparkles,
  BarChart3
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const MobileNav: React.FC = () => {
  const { activeTab, setActiveTab } = useAuth();

  const items = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'transactions', label: 'Activity', icon: Receipt },
    { id: 'budgets', label: 'Budgets', icon: PieChart },
    { id: 'savings', label: 'Savings', icon: Target },
    { id: 'ai-advisor', label: 'AI Advisor', icon: Sparkles }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 flex items-center justify-around shadow-lg">
      {items.map(item => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-[10px] font-semibold transition-colors ${
              isActive
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Icon className="w-4 h-4 mb-0.5" />
            <span className="truncate">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
