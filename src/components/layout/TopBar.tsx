import React, { useState, useEffect, useRef } from 'react';
import {
  Bell,
  Plus,
  Sun,
  Moon,
  ChevronDown,
  User,
  Settings,
  LogOut,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { api } from '../../services/api';
import { Notification } from '../../types';

interface TopBarProps {
  onOpenMobileMenu?: () => void;
}

export const TopBar: React.FC<TopBarProps> = () => {
  const {
    user,
    personas,
    activePersonaId,
    switchPersona,
    activeTab,
    setActiveTab,
    setIsAddTransactionOpen,
    setShowOnboarding,
    refreshTrigger,
    triggerRefresh,
    logout
  } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isPersonaOpen, setIsPersonaOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const personaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadNotifications() {
      try {
        const res = await api.getNotifications();
        setNotifications(res.notifications);
      } catch (err) {
        // silent
      }
    }
    loadNotifications();
  }, [refreshTrigger, user?.id]);

  // Click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (personaRef.current && !personaRef.current.contains(e.target as Node)) {
        setIsPersonaOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleMarkAllRead = async () => {
    await api.markAllNotificationsRead();
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  const handleResetData = async () => {
    setIsResetting(true);
    try {
      await api.resetDemoData();
      triggerRefresh();
    } finally {
      setIsResetting(false);
    }
  };

  const currentPersona = personas.find(p => p.id === activePersonaId) || personas[0];

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-8 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      {/* Zone 1: Brand / Active Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setActiveTab('dashboard')}
          className="text-lg font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          FinAdvisor
        </button>
        <span className="hidden sm:inline-block text-slate-300 dark:text-slate-700">/</span>
        <span className="hidden sm:inline-block text-xs font-semibold capitalize text-slate-500 dark:text-slate-400">
          {activeTab.replace('-', ' ')}
        </span>
      </div>

      {/* Zone 2: Scenario Quick Switcher */}
      <div className="hidden lg:flex items-center gap-2" ref={personaRef}>
        <div className="relative">
          <button
            onClick={() => setIsPersonaOpen(!isPersonaOpen)}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <span className="text-slate-400 font-normal">Scenario:</span>
            <span className="font-semibold text-slate-900 dark:text-white">{currentPersona.name}</span>
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">({currentPersona.user_type})</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isPersonaOpen && (
            <div className="absolute left-0 mt-2 w-72 p-2 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-2 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Select Pre-Configured Scenario
              </div>
              {personas.map(p => (
                <button
                  key={p.id}
                  onClick={() => {
                    switchPersona(p.id);
                    setIsPersonaOpen(false);
                  }}
                  className={`w-full text-left p-2 rounded-lg text-xs transition-colors flex flex-col gap-0.5 ${
                    activePersonaId === p.id
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/70 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900 dark:text-white">{p.name}</span>
                    <span className="text-[10px] uppercase font-bold text-slate-400">{p.role}</span>
                  </div>
                  <span className="text-[11px] text-slate-500 line-clamp-1">{p.tagline}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Zone 3: Actions (Add Transaction, Notifications, Theme, User) */}
      <div className="flex items-center gap-2.5">
        {/* Quick Add CTA */}
        <button
          onClick={() => setIsAddTransactionOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-xs transition-colors whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Transaction</span>
          <span className="sm:hidden">Add</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle Dark Mode"
          className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            aria-label="Notifications"
            className="relative w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 p-3 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 mb-2">
                <span className="text-xs font-semibold text-slate-900 dark:text-white">
                  Notifications ({unreadCount} new)
                </span>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[11px] text-emerald-600 hover:underline font-medium"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto space-y-1.5 text-xs">
                {notifications.length === 0 ? (
                  <div className="py-6 text-center text-slate-400">No notifications</div>
                ) : (
                  notifications.slice(0, 5).map(n => (
                    <div
                      key={n.id}
                      className={`p-2.5 rounded-lg border transition-colors ${
                        n.is_read
                          ? 'border-transparent text-slate-500 dark:text-slate-400'
                          : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <div className="font-semibold text-slate-900 dark:text-white text-xs">{n.title}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                        {n.message}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 mt-2 text-center">
                <button
                  onClick={() => {
                    setActiveTab('notifications');
                    setIsNotifOpen(false);
                  }}
                  className="text-xs text-slate-600 dark:text-slate-400 hover:text-emerald-600 font-medium"
                >
                  View all notifications →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs flex items-center justify-center">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <span className="hidden md:inline text-xs font-semibold text-slate-900 dark:text-white max-w-[100px] truncate">
              {user?.name || 'Alex'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 p-2 animate-in fade-in zoom-in-95 duration-150 text-xs">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                <div className="font-semibold text-slate-900 dark:text-white">{user?.name}</div>
                <div className="text-[11px] text-slate-500 truncate">{user?.email}</div>
              </div>

              <button
                onClick={() => {
                  setShowOnboarding(true);
                  setIsUserMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                Setup Wizard
              </button>

              <button
                onClick={() => {
                  setActiveTab('settings');
                  setIsUserMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Settings className="w-3.5 h-3.5" />
                Settings
              </button>

              <button
                onClick={() => {
                  handleResetData();
                  setIsUserMenuOpen(false);
                }}
                disabled={isResetting}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
                Reset Demo Data
              </button>

              <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

              <button
                onClick={() => {
                  logout();
                  setIsUserMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
