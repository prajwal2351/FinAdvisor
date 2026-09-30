export type UserType = 'salaried' | 'student' | 'freelancer' | 'household' | 'other';

export type ExpenseCategory =
  | 'Housing'
  | 'Food'
  | 'Transport'
  | 'Shopping'
  | 'Entertainment'
  | 'Healthcare'
  | 'Education'
  | 'Utilities'
  | 'Subscriptions'
  | 'Travel'
  | 'Other';

export type IncomeType =
  | 'salary'
  | 'freelance'
  | 'business'
  | 'investment'
  | 'allowance'
  | 'bonus'
  | 'other';

export type PaymentMethod =
  | 'Cash'
  | 'UPI'
  | 'Debit Card'
  | 'Credit Card'
  | 'Bank Transfer'
  | 'Other';

export interface User {
  id: string;
  name: string;
  email: string;
  user_type: UserType;
  currency: string; // 'INR', 'USD', 'EUR', 'GBP', 'AED'
  monthly_income: number;
  primary_goal?: string;
  created_at: string;
  updated_at: string;
}

export interface Income {
  id: string;
  user_id: string;
  amount: number;
  source: string;
  income_type: IncomeType;
  date: string; // YYYY-MM-DD
  description: string;
  created_at: string;
}

export interface Expense {
  id: string;
  user_id: string;
  amount: number;
  category: ExpenseCategory;
  description: string;
  date: string; // YYYY-MM-DD
  payment_method: PaymentMethod;
  notes?: string;
  created_at: string;
}

export interface Budget {
  id: string;
  user_id: string;
  month: number; // 1-12
  year: number;
  category: ExpenseCategory;
  limit_amount: number;
  created_at: string;
  updated_at: string;
}

export interface SavingsGoal {
  id: string;
  user_id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  target_date: string; // YYYY-MM-DD
  monthly_contribution: number;
  icon?: string;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'budget' | 'savings' | 'tip' | 'system';
  is_read: boolean;
  created_at: string;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
  suggested_actions?: string[];
}

export interface AIConversation {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
  messages: AIMessage[];
}

export interface UnifiedTransaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  categoryOrSource: string;
  description: string;
  date: string;
  paymentMethodOrType: string;
  notes?: string;
}

export interface BudgetUtilization {
  category: ExpenseCategory;
  limit: number;
  spent: number;
  remaining: number;
  percentage: number;
  status: 'normal' | 'warning' | 'near_limit' | 'exceeded';
}

export interface HealthScoreBreakdown {
  factor: string;
  score: number;
  max: number;
  status: 'good' | 'fair' | 'poor';
  recommendation: string;
}

export interface FinancialHealthScore {
  score: number;
  rating: string;
  explanation: string;
  breakdown: HealthScoreBreakdown[];
}

export interface AIInsight {
  id: string;
  category: string;
  icon: string;
  title: string;
  text: string;
  suggested_action?: string;
  action_type?: 'budget' | 'expense' | 'savings' | 'chat';
  urgency: 'normal' | 'warning' | 'positive';
}

export interface MonthlyFinancialSummary {
  period: string;
  income: number;
  expenses: number;
  savings: number;
  savings_rate: number;
  summary: string;
  focus_items: string[];
}

export interface DashboardData {
  user: User;
  period: { month: number; year: number; label: string };
  kpis: {
    total_income: number;
    total_expenses: number;
    total_savings: number;
    savings_rate: number;
    prev_income: number;
    prev_expenses: number;
    prev_savings: number;
    prev_savings_rate: number;
    income_growth_pct: number;
    expense_growth_pct: number;
    savings_growth_pct: number;
  };
  monthly_trend: {
    month: string;
    month_num: number;
    year: number;
    income: number;
    expenses: number;
    savings: number;
  }[];
  expense_breakdown: {
    category: ExpenseCategory;
    amount: number;
    percentage: number;
    color: string;
  }[];
  budget_utilization: BudgetUtilization[];
  savings_goals: SavingsGoal[];
  ai_insights: AIInsight[];
  recent_transactions: UnifiedTransaction[];
  health_score: FinancialHealthScore;
  monthly_summary: MonthlyFinancialSummary;
}

export interface AIBudgetRecommendation {
  category: ExpenseCategory;
  recommended_limit: number;
  percentage_of_income: number;
  reasoning: string;
}

export interface PersonaProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  user_type: UserType;
  income: number;
  tagline: string;
  avatarColor: string;
  scenarioDescription: string;
}
