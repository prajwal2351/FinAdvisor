import React from 'react';
import {
  LayoutDashboard,
  Receipt,
  TrendingUp,
  CreditCard,
  PieChart,
  Target,
  Sparkles,
  BarChart3,
  Bell,
  Settings,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, user } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: Receipt },
    { id: 'income', label: 'Income', icon: TrendingUp },
    { id: 'expenses', label: 'Expenses', icon: CreditCard },
    { id: 'budgets', label: 'Budgets', icon: PieChart },
    { id: 'savings', label: 'Savings Goals', icon: Target },
    { id: 'ai-advisor', label: 'AI Advisor', icon: Sparkles, badge: 'AI' },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-[#0F172A] text-slate-300 border-r border-slate-800 shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-black text-base shadow-sm">
            F
          </div>
          <div>
            <div className="text-base font-bold text-white tracking-tight">FinAdvisor</div>
            <div className="text-[10px] text-slate-400 font-medium tracking-tight">Personal Finance Advisor Bot</div>
          </div>
        </div>
        <p className="mt-2 text-[11px] text-slate-400 leading-tight">
          "Understand Your Money. Plan Smarter. Save Better."
        </p>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Trust & Safety Mini Banner */}
      <div className="p-3 mx-3 mb-3 rounded-xl bg-slate-800/40 border border-slate-800 text-[11px] text-slate-400 space-y-1">
        <div className="flex items-center gap-1.5 text-slate-200 font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Private & Grounded</span>
        </div>
        <p className="text-[10px] text-slate-400 leading-snug">
          Data isolated to your session. Never mixed across users.
        </p>
      </div>

      {/* User Quick Info */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 flex items-center justify-between">
        <div className="flex items-center gap-2.5 truncate pr-2">
          <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div className="truncate">
            <div className="text-xs font-semibold text-white truncate">{user?.name}</div>
            <div className="text-[10px] text-slate-400 capitalize truncate">{user?.user_type}</div>
          </div>
        </div>
      </div>
    </aside>
  );
};
