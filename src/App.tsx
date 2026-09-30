import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TopBar } from './components/layout/TopBar';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { AddTransactionModal } from './components/modals/AddTransactionModal';
import { OnboardingWizard } from './components/onboarding/OnboardingWizard';

import { LandingView } from './views/LandingView';
import { DashboardView } from './views/DashboardView';
import { TransactionsView } from './views/TransactionsView';
import { IncomeView } from './views/IncomeView';
import { ExpensesView } from './views/ExpensesView';
import { BudgetsView } from './views/BudgetsView';
import { SavingsGoalsView } from './views/SavingsGoalsView';
import { AIAdvisorView } from './views/AIAdvisorView';
import { ReportsView } from './views/ReportsView';
import { NotificationsView } from './views/NotificationsView';
import { SettingsView } from './views/SettingsView';

const AppContent: React.FC = () => {
  const { activeTab, showOnboarding, setShowOnboarding } = useAuth();

  if (activeTab === 'landing') {
    return <LandingView />;
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'transactions':
        return <TransactionsView />;
      case 'income':
        return <IncomeView />;
      case 'expenses':
        return <ExpensesView />;
      case 'budgets':
        return <BudgetsView />;
      case 'savings':
        return <SavingsGoalsView />;
      case 'ai-advisor':
        return <AIAdvisorView />;
      case 'reports':
        return <ReportsView />;
      case 'notifications':
        return <NotificationsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto pb-20 md:pb-8">
          {renderActiveView()}
        </main>
      </div>

      {/* Mobile Sticky Navigation */}
      <MobileNav />

      {/* Global Modals */}
      <AddTransactionModal />
      <OnboardingWizard
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
      />
    </div>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <CurrencyProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </CurrencyProvider>
    </ThemeProvider>
  );
}

export default App;
