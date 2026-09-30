import React, { useState } from 'react';
import { User, Shield, Moon, Sun, DollarSign, RefreshCw, Check, Sparkles, Sliders } from 'lucide-react';
import { useAuth, DEMO_PERSONAS } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useCurrency, CurrencyCode } from '../context/CurrencyContext';
import { api } from '../services/api';
import { UserType } from '../types';

export const SettingsView: React.FC = () => {
  const { user, updateProfile, personas, activePersonaId, switchPersona, triggerRefresh, setShowOnboarding } = useAuth();
  const { theme, setTheme } = useTheme();
  const { currency, setCurrency, currencySymbol } = useCurrency();

  const [name, setName] = useState(user?.name || '');
  const [userType, setUserType] = useState<UserType>(user?.user_type || 'salaried');
  const [monthlyIncome, setMonthlyIncome] = useState(user?.monthly_income?.toString() || '60000');
  const [primaryGoal, setPrimaryGoal] = useState(user?.primary_goal || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      await updateProfile({
        name,
        user_type: userType,
        monthly_income: parseFloat(monthlyIncome) || 0,
        primary_goal: primaryGoal
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err: any) {
      console.error('Failed to update profile:', err);
    } finally {
      setIsSaving(false);
    }
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

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Settings & Preferences
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Customize currency formatting, appearance theme, persona profiles, and data controls
        </p>
      </div>

      {/* Scenario Persona Switcher */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">Scenario Switcher</h2>
          <p className="text-xs text-slate-500">Test FinAdvisor across all 4 target user profiles</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {personas.map(p => {
            const isActive = activePersonaId === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => switchPersona(p.id)}
                className={`p-3.5 text-left rounded-xl border transition-all ${
                  isActive
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 ring-1 ring-emerald-500'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{p.name}</span>
                  <span className="text-[10px] uppercase font-bold text-slate-400">{p.role}</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{p.tagline}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Profile Form */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Profile & Cashflow Parameters</h2>
            <p className="text-xs text-slate-500">Parameters utilized by FinAdvisor AI for budget recommendations</p>
          </div>
          <button
            onClick={() => setShowOnboarding(true)}
            className="text-xs text-purple-600 dark:text-purple-400 hover:underline font-semibold flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5" /> Re-run Setup Wizard
          </button>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">User Persona Type</label>
              <select
                value={userType}
                onChange={e => setUserType(e.target.value as UserType)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="salaried">Salaried Professional</option>
                <option value="student">College Student</option>
                <option value="freelancer">Freelancer / Contractor</option>
                <option value="household">Household Manager</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Typical Monthly Cashflow ({currencySymbol})
              </label>
              <input
                type="number"
                step="500"
                value={monthlyIncome}
                onChange={e => setMonthlyIncome(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white tabular-nums font-semibold"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Primary Financial Goal</label>
              <input
                type="text"
                value={primaryGoal}
                onChange={e => setPrimaryGoal(e.target.value)}
                placeholder="e.g. Build emergency fund, buy laptop"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            {saveSuccess ? (
              <span className="text-emerald-600 flex items-center gap-1 font-semibold">
                <Check className="w-3.5 h-3.5" /> Profile updated successfully!
              </span>
            ) : <div />}

            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 rounded-xl transition-colors disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* Currency & Appearance Settings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Currency Selection */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
            <DollarSign className="w-4 h-4 text-emerald-500" />
            <span>Display Currency</span>
          </div>
          <p className="text-xs text-slate-500">
            Select your preferred currency symbol. Default is INR (₹).
          </p>

          <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
            {[
              { code: 'INR', label: 'INR (₹) - Rupee' },
              { code: 'USD', label: 'USD ($) - Dollar' },
              { code: 'EUR', label: 'EUR (€) - Euro' },
              { code: 'GBP', label: 'GBP (£) - Pound' },
              { code: 'AED', label: 'AED (د.إ) - Dirham' }
            ].map(c => (
              <button
                key={c.code}
                onClick={() => setCurrency(c.code as CurrencyCode)}
                className={`p-2.5 rounded-xl border text-left font-medium transition-colors ${
                  currency === c.code
                    ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-bold'
                    : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Appearance Theme */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
            {theme === 'dark' ? <Moon className="w-4 h-4 text-purple-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
            <span>Interface Appearance</span>
          </div>
          <p className="text-xs text-slate-500">
            Switch between crisp light mode and high-contrast dark mode.
          </p>

          <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
            <button
              onClick={() => setTheme('light')}
              className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 transition-colors ${
                theme === 'light'
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold'
                  : 'border-slate-200 text-slate-600'
              }`}
            >
              <Sun className="w-4 h-4" /> Light Mode
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 transition-colors ${
                theme === 'dark'
                  ? 'border-emerald-500 bg-emerald-950/40 text-emerald-200 font-bold'
                  : 'border-slate-800 text-slate-400'
              }`}
            >
              <Moon className="w-4 h-4" /> Dark Mode
            </button>
          </div>
        </div>
      </div>

      {/* Data Management & Danger Zone */}
      <div className="p-6 rounded-2xl border border-rose-200 dark:border-rose-900/40 bg-rose-50/30 dark:bg-rose-950/20 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-rose-900 dark:text-rose-200">Reset Demo Datasets</h2>
          <p className="text-xs text-rose-700/80 dark:text-rose-300/80 mt-0.5">
            Restores all original 6 months of historical transactions, budgets, and goals across all personas.
          </p>
        </div>

        <button
          onClick={handleResetData}
          disabled={isResetting}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition-colors shrink-0 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
          <span>{isResetting ? 'Restoring...' : 'Reset All Data'}</span>
        </button>
      </div>
    </div>
  );
};
