import React, { useState } from 'react';
import {
  TrendingUp,
  Sparkles,
  ShieldCheck,
  PieChart,
  ArrowRight,
  Target,
  CheckCircle2,
  ChevronDown,
  Lock,
  Layers,
  Wallet,
  Zap,
  BarChart3
} from 'lucide-react';
import { useAuth, DEMO_PERSONAS } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';

export const LandingView: React.FC = () => {
  const { switchPersona, setActiveTab } = useAuth();
  const { formatAmount } = useCurrency();
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const handleLaunchScenario = async (personaId: string) => {
    await switchPersona(personaId);
    setActiveTab('dashboard');
  };

  const faqs = [
    {
      q: 'How does FinAdvisor AI calculate my budget and financial health?',
      a: 'FinAdvisor AI synthesizes your verified monthly inflows, outflows, and active category limits. It evaluates your savings rate, budget adherence percentage, expense stability, and goal milestones to produce a transparent 0-100 score with actionable suggestions.'
    },
    {
      q: 'Can freelancers with variable, fluctuating income use this?',
      a: 'Yes! FinAdvisor specifically includes a Freelancer profile that accommodates multiple client retainers, tracks monthly cashflow spikes and dips, and calculates multi-month emergency runway buffers.'
    },
    {
      q: 'Is this considered licensed financial advice?',
      a: 'No. FinAdvisor AI is strictly an educational financial planning and tracking assistant. It helps you organize records, calculate trends, and build disciplined habits. It does not provide certified legal, tax, or regulated investment advice.'
    },
    {
      q: 'Can I export my monthly reports and transaction records?',
      a: 'Yes. You can export complete CSV spreadsheets of your transactions, income, and expenses, or generate print-ready executive PDF monthly reports directly from the Reports section.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased">
      {/* Landing Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-black text-sm">
              F
            </div>
            <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
              FinAdvisor
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <a href="#benefits" className="hover:text-emerald-600 transition-colors">Key Benefits</a>
            <a href="#scenarios" className="hover:text-emerald-600 transition-colors">Scenarios</a>
            <a href="#ai-advisor" className="hover:text-emerald-600 transition-colors">AI Advisor</a>
            <a href="#faq" className="hover:text-emerald-600 transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleLaunchScenario('alex')}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 rounded-xl transition-colors shadow-xs"
            >
              Launch Live App
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-300 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Powered Personal Finance & Budget Planning</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Take Control of Your Money <br className="hidden sm:inline" />
            <span className="text-emerald-600 dark:text-emerald-400">with Intelligent AI</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Track your income, understand your spending, build smarter budgets, and achieve your financial goals with an intelligent personal finance assistant.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => handleLaunchScenario('alex')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-all shadow-md hover:shadow-lg"
            >
              Get Started with Live Demo
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#scenarios"
              className="w-full sm:w-auto px-6 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Explore 4 Real-World Scenarios
            </a>
          </div>

          {/* Social Proof Bar */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Full Double-Entry Rigor</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Grounded in Your Numbers</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Zero Session Bleed</span>
            </div>
          </div>
        </div>

        {/* Hero Interactive Visual Mockup */}
        <div className="max-w-6xl mx-auto px-4 mt-12">
          <div className="relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-400" />
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="ml-2 font-semibold text-slate-700 dark:text-slate-300">
                  Alex Sharma · September 2026 Financial Overview
                </span>
              </div>
              <span className="font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                Savings Rate: 36.5%
              </span>
            </div>

            {/* Mock Dashboard Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <div className="text-[11px] font-semibold text-slate-400 uppercase">Monthly Income</div>
                <div className="text-xl font-bold text-slate-900 dark:text-white mt-1 tabular-nums">₹65,000</div>
                <div className="text-[11px] text-emerald-600 mt-1 font-semibold">+8.4% vs last month</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <div className="text-[11px] font-semibold text-slate-400 uppercase">Total Expenses</div>
                <div className="text-xl font-bold text-slate-900 dark:text-white mt-1 tabular-nums">₹41,250</div>
                <div className="text-[11px] text-emerald-600 mt-1 font-semibold">-3.2% vs last month</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <div className="text-[11px] font-semibold text-slate-400 uppercase">Net Savings</div>
                <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums">₹23,750</div>
                <div className="text-[11px] text-emerald-600 mt-1 font-semibold">+15.6% vs last month</div>
              </div>
              <div className="p-4 rounded-xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40">
                <div className="text-[11px] font-semibold text-purple-600 uppercase">Financial Health</div>
                <div className="text-xl font-bold text-purple-700 dark:text-purple-300 mt-1 tabular-nums">78 / 100</div>
                <div className="text-[11px] text-purple-600 mt-1 font-semibold">AI Wellness: Excellent</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section id="benefits" className="py-20 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Why Individuals Trust FinAdvisor
            </h2>
            <p className="mt-3 text-sm text-slate-500">
              Clean financial planning built on reliable math, intuitive progress bars, and helpful AI insights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
                <PieChart className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Smart Category Budgeting</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Color-coded utilization bars warn you when you cross 70%, 90%, or exceed 100% of limits before the month ends.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">AI Financial Insights</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Get plain-English explanations of where your surplus went, specific suggestions to trim discretionary costs, and timeline forecasts.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Goal & Emergency Tracking</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Set milestones for emergency funds, tech purchases, or home projects. Track monthly automated deposits with visual progress.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Real-World Scenarios */}
      <section id="scenarios" className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">Built for Every Walk of Life</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
              Explore 4 Pre-Configured Personas
            </h2>
            <p className="mt-3 text-sm text-slate-500">
              Click any scenario to jump directly into the live, fully populated dashboard with months of realistic historical records.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {DEMO_PERSONAS.map(p => (
              <div
                key={p.id}
                className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between hover:border-emerald-500/50 transition-all shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {p.role}
                    </span>
                    <span className="text-xs font-bold text-emerald-600 tabular-nums">
                      ~{formatAmount(p.income)} / mo
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{p.name}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                    {p.scenarioDescription}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Pre-seeded with historical data</span>
                  <button
                    onClick={() => handleLaunchScenario(p.id)}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 rounded-xl transition-colors"
                  >
                    Open Profile
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Advisor Preview */}
      <section id="ai-advisor" className="py-20 bg-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/60 border border-purple-700/60 text-purple-300 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Financial Intelligence</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Chat with Your Personal FinAdvisor Bot
          </h2>
          <p className="mt-4 text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            Ask specific questions about your spending bottlenecks, savings acceleration strategies, or request an instant personalized budget.
          </p>

          <div className="mt-10 p-6 rounded-2xl bg-slate-950 border border-slate-800 text-left max-w-2xl mx-auto space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-slate-800 text-white font-bold text-xs flex items-center justify-center shrink-0">
                U
              </div>
              <div className="p-3 rounded-xl bg-slate-800/80 text-xs text-slate-200">
                "Where did I overspend this month and how can I save ₹5,000 before October?"
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                AI
              </div>
              <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-800/50 text-xs text-purple-100 space-y-2">
                <p className="font-semibold text-purple-300">Analysis for September 2026:</p>
                <p>
                  1. <strong>Dining & Cafes:</strong> ₹6,240 spent vs ₹6,000 budget limit (104% utilization). Trimming 2 weekend dinners saves ~₹2,200.
                </p>
                <p>
                  2. <strong>Subscriptions:</strong> Review 3 active streaming packages to reclaim ₹800.
                </p>
                <p>
                  3. <strong>Result:</strong> Freeing ₹5,000 lifts your savings rate to 44%, reaching your Emergency Fund milestone 6 weeks earlier!
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <button
              onClick={() => {
                handleLaunchScenario('alex');
                setActiveTab('ai-advisor');
              }}
              className="inline-flex items-center gap-2 px-6 py-3 text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 rounded-xl transition-colors shadow-lg"
            >
              Try AI Advisor Now
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Security & Financial Privacy */}
      <section className="py-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 mx-auto flex items-center justify-center">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Uncompromising Privacy & Data Isolation
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
            Your financial records belong exclusively to you. Every API route verifies authenticated ownership. No user credentials or API tokens are ever exposed to the client.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 max-w-3xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-10">
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {faqs.map((f, idx) => (
            <div
              key={f.q}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between p-4 text-left text-xs sm:text-sm font-semibold text-slate-900 dark:text-white"
              >
                <span>{f.q}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${activeFaq === idx ? 'rotate-180' : ''}`} />
              </button>
              {activeFaq === idx && (
                <div className="px-4 pb-4 text-xs text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                  {f.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-950 text-slate-400 border-t border-slate-800 text-xs">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="font-bold text-white text-sm">FinAdvisor</div>
            <p className="text-slate-500">"Understand Your Money. Plan Smarter. Save Better."</p>
          </div>

          <div className="flex items-center gap-6 text-slate-400">
            <button onClick={() => handleLaunchScenario('alex')} className="hover:text-white">Dashboard</button>
            <a href="#benefits" className="hover:text-white">Features</a>
            <a href="#ai-advisor" className="hover:text-white">AI Advisor</a>
            <a href="#faq" className="hover:text-white">FAQ</a>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 mt-8 pt-6 border-t border-slate-900 text-center text-[11px] text-slate-600">
          Disclaimer: FinAdvisor provides educational financial planning assistance and does not constitute professional financial, investment, tax, or legal advice.
        </div>
      </footer>
    </div>
  );
};
