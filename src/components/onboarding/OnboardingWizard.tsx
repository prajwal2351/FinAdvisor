import React, { useState } from 'react';
import { X, Check, ArrowRight, ArrowLeft, Sparkles, Shield, User, Wallet, Target, Sliders } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCurrency } from '../../context/CurrencyContext';
import { UserType, ExpenseCategory } from '../../types';

interface OnboardingWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ isOpen, onClose }) => {
  const { user, updateProfile, triggerRefresh } = useAuth();
  const { currencySymbol, formatAmount } = useCurrency();

  const [step, setStep] = useState(1);
  const [name, setName] = useState(user?.name || 'Alex Sharma');
  const [userType, setUserType] = useState<UserType>(user?.user_type || 'salaried');
  const [monthlyIncome, setMonthlyIncome] = useState(user?.monthly_income?.toString() || '60000');
  const [selectedCategories, setSelectedCategories] = useState<ExpenseCategory[]>([
    'Housing',
    'Food',
    'Transport',
    'Utilities',
    'Entertainment'
  ]);
  const [primaryGoal, setPrimaryGoal] = useState(
    user?.primary_goal || 'Build emergency fund & maintain 30% savings rate'
  );
  const [isFinishing, setIsFinishing] = useState(false);

  if (!isOpen) return null;

  const totalSteps = 5;

  const toggleCategory = (cat: ExpenseCategory) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(prev => prev.filter(c => c !== cat));
    } else {
      setSelectedCategories(prev => [...prev, cat]);
    }
  };

  const handleFinish = async () => {
    setIsFinishing(true);
    try {
      await updateProfile({
        name,
        user_type: userType,
        monthly_income: parseFloat(monthlyIncome) || 50000,
        primary_goal: primaryGoal
      });
      triggerRefresh();
      onClose();
    } catch (e) {
      console.error('Failed to save profile during onboarding:', e);
    } finally {
      setIsFinishing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
        {/* Progress header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Setup Wizard
            </span>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <span className="text-xs font-medium text-slate-500">
              Step {step} of {totalSteps}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map(s => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s === step ? 'w-6 bg-emerald-500' : s < step ? 'w-3 bg-emerald-300 dark:bg-emerald-800' : 'w-3 bg-slate-200 dark:bg-slate-800'
                }`}
              />
            ))}
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step contents */}
        <div className="p-6 md:p-8 space-y-5 flex-1 min-h-[320px]">
          {/* Step 1 */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <User className="w-5 h-5" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Tell us about yourself</h3>
              </div>
              <p className="text-xs text-slate-500">
                FinAdvisor personalizes calculations and budgeting models according to your career stage.
              </p>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                  What best describes your financial setup?
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { id: 'salaried', label: 'Salaried Professional', desc: 'Consistent monthly pay & corporate benefits' },
                    { id: 'student', label: 'College Student', desc: 'Limited allowance & student budgets' },
                    { id: 'freelancer', label: 'Freelancer / Contractor', desc: 'Variable multi-client cashflow' },
                    { id: 'household', label: 'Household Manager', desc: 'Shared family pooling & grocery management' }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setUserType(opt.id as UserType)}
                      className={`p-3 text-left rounded-xl border transition-all ${
                        userType === opt.id
                          ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 ring-1 ring-emerald-500'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                      }`}
                    >
                      <div className="text-xs font-semibold text-slate-900 dark:text-white">{opt.label}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <Wallet className="w-5 h-5" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  What's your typical monthly income?
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                This forms the baseline for your savings rates, emergency buffer calculations, and category caps.
              </p>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Expected Monthly Take-Home ({currencySymbol})
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">
                    {currencySymbol}
                  </span>
                  <input
                    type="number"
                    step="500"
                    min="1000"
                    value={monthlyIncome}
                    onChange={e => setMonthlyIncome(e.target.value)}
                    className="w-full pl-8 pr-4 py-3 text-lg font-bold tabular-nums rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                💡 <span className="font-semibold">Healthy benchmark:</span> Allocating ~50% for essential needs, 20-30% for savings & investments, and 20% for discretionary living.
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <Sliders className="w-5 h-5" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Major spending categories
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                Select the spending pillars you wish to monitor actively with budget thresholds.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  'Housing',
                  'Food',
                  'Transport',
                  'Shopping',
                  'Entertainment',
                  'Healthcare',
                  'Education',
                  'Utilities',
                  'Subscriptions',
                  'Travel',
                  'Other'
                ].map(cat => {
                  const isChecked = selectedCategories.includes(cat as ExpenseCategory);
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => toggleCategory(cat as ExpenseCategory)}
                      className={`flex items-center justify-between p-2.5 text-xs rounded-xl border transition-all ${
                        isChecked
                          ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-semibold'
                          : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                      }`}
                    >
                      <span>{cat}</span>
                      {isChecked && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 4 */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <Target className="w-5 h-5" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  What is your primary financial goal?
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                Your AI Advisor will track your monthly surplus against this milestone.
              </p>

              <div className="space-y-2">
                {[
                  'Build emergency fund (3 to 6 months)',
                  'Save money for a major tech purchase or laptop',
                  'Reduce unnecessary dining & subscription expenses',
                  'Pay off high-interest debt & credit balance',
                  'Plan a vacation or travel fund',
                  'General overall financial wellness'
                ].map(g => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setPrimaryGoal(g)}
                    className={`w-full p-3 text-left rounded-xl border text-xs transition-all flex items-center justify-between ${
                      primaryGoal === g
                        ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 font-semibold'
                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <span>{g}</span>
                    {primaryGoal === g && <Check className="w-4 h-4 text-emerald-600" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5 */}
          {step === 5 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <Sparkles className="w-5 h-5" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Your customized plan is ready
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                Here is a summary of your profile configured for FinAdvisor:
              </p>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Profile Name:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Persona Profile:</span>
                  <span className="font-semibold text-slate-900 dark:text-white capitalize">{userType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Monthly Cashflow:</span>
                  <span className="font-semibold text-slate-900 dark:text-white tabular-nums">
                    {formatAmount(parseFloat(monthlyIncome) || 60000)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Primary Goal:</span>
                  <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[240px]">
                    {primaryGoal}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tracked Categories:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {selectedCategories.length} categories
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 text-xs text-emerald-900 dark:text-emerald-300">
                🎉 Your dashboard and AI assistant are primed with these parameters!
              </div>
            </div>
          )}
        </div>

        {/* Wizard Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/80">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(prev => prev - 1)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back
            </button>
          ) : (
            <div />
          )}

          {step < totalSteps ? (
            <button
              type="button"
              onClick={() => setStep(prev => prev + 1)}
              className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 rounded-xl transition-colors shadow-xs"
            >
              Continue
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              disabled={isFinishing}
              className="flex items-center gap-1.5 px-6 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-colors shadow-xs disabled:opacity-50"
            >
              {isFinishing ? 'Saving Setup...' : 'Enter Dashboard'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
