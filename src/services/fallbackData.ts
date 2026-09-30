import { DashboardData, PersonaProfile, User } from '../types';

export const FALLBACK_USERS: Record<string, User> = {
  user_alex: {
    id: 'user_alex',
    name: 'Alex Sharma',
    email: 'alex.sharma@example.com',
    user_type: 'salaried',
    currency: 'INR',
    monthly_income: 65000,
    primary_goal: 'Build emergency fund & save for new laptop',
    created_at: '2026-03-01T00:00:00.000Z',
    updated_at: '2026-09-30T04:00:00.000Z'
  },
  user_priya: {
    id: 'user_priya',
    name: 'Priya Patel',
    email: 'priya.patel@student.edu',
    user_type: 'student',
    currency: 'INR',
    monthly_income: 12000,
    primary_goal: 'Control discretionary dining & save for tech gear',
    created_at: '2026-04-01T00:00:00.000Z',
    updated_at: '2026-09-30T04:00:00.000Z'
  },
  user_rohan: {
    id: 'user_rohan',
    name: 'Rohan Verma',
    email: 'rohan@creativelabs.io',
    user_type: 'freelancer',
    currency: 'INR',
    monthly_income: 95000,
    primary_goal: 'Build 6-month variable income runway buffer',
    created_at: '2026-02-01T00:00:00.000Z',
    updated_at: '2026-09-30T04:00:00.000Z'
  },
  user_sunita: {
    id: 'user_sunita',
    name: 'Sunita Rao',
    email: 'sunita.family@household.in',
    user_type: 'household',
    currency: 'INR',
    monthly_income: 110000,
    primary_goal: 'Consolidate family grocery & schooling budget',
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-09-30T04:00:00.000Z'
  }
};

export function getFallbackDashboardData(userId = 'user_alex'): DashboardData {
  const user = FALLBACK_USERS[userId] || FALLBACK_USERS['user_alex'];

  return {
    user,
    period: {
      month: 9,
      year: 2026,
      label: 'September 2026'
    },
    kpis: {
      total_income: user.monthly_income,
      total_expenses: Math.round(user.monthly_income * 0.63),
      total_savings: Math.round(user.monthly_income * 0.37),
      savings_rate: 36.5,
      prev_income: user.monthly_income - 3000,
      prev_expenses: Math.round(user.monthly_income * 0.65),
      prev_savings: Math.round(user.monthly_income * 0.32),
      prev_savings_rate: 32.1,
      income_growth_pct: 8.4,
      expense_growth_pct: -3.2,
      savings_growth_pct: 15.6
    },
    monthly_trend: [
      { month: 'Apr', month_num: 4, year: 2026, income: 60000, expenses: 40500, savings: 19500 },
      { month: 'May', month_num: 5, year: 2026, income: 60000, expenses: 42200, savings: 17800 },
      { month: 'Jun', month_num: 6, year: 2026, income: 60000, expenses: 39100, savings: 20900 },
      { month: 'Jul', month_num: 7, year: 2026, income: 70000, expenses: 43400, savings: 26600 },
      { month: 'Aug', month_num: 8, year: 2026, income: 62000, expenses: 41800, savings: 20200 },
      { month: 'Sep', month_num: 9, year: 2026, income: 65000, expenses: 41250, savings: 23750 }
    ],
    expense_breakdown: [
      { category: 'Housing', amount: 15000, percentage: 36, color: '#0F172A' },
      { category: 'Food', amount: 6500, percentage: 16, color: '#10B981' },
      { category: 'Shopping', amount: 4000, percentage: 10, color: '#F59E0B' },
      { category: 'Transport', amount: 3000, percentage: 7, color: '#3B82F6' },
      { category: 'Utilities', amount: 3000, percentage: 7, color: '#64748B' },
      { category: 'Entertainment', amount: 2500, percentage: 6, color: '#8B5CF6' },
      { category: 'Education', amount: 2000, percentage: 5, color: '#06B6D4' },
      { category: 'Healthcare', amount: 1500, percentage: 4, color: '#EC4899' },
      { category: 'Subscriptions', amount: 1000, percentage: 2, color: '#6366F1' },
      { category: 'Other', amount: 2750, percentage: 7, color: '#94A3B8' }
    ],
    budget_utilization: [
      { category: 'Housing', limit: 15000, spent: 15000, remaining: 0, percentage: 100, status: 'near_limit' },
      { category: 'Food', limit: 6000, spent: 6500, remaining: -500, percentage: 108, status: 'exceeded' },
      { category: 'Transport', limit: 3500, spent: 3000, remaining: 500, percentage: 86, status: 'warning' },
      { category: 'Shopping', limit: 4500, spent: 4000, remaining: 500, percentage: 89, status: 'warning' },
      { category: 'Entertainment', limit: 2000, spent: 2500, remaining: -500, percentage: 125, status: 'exceeded' },
      { category: 'Utilities', limit: 3200, spent: 3000, remaining: 200, percentage: 94, status: 'near_limit' }
    ],
    savings_goals: [
      {
        id: 'goal_alex_emergency',
        user_id: 'user_alex',
        name: 'Emergency Fund (6 Months)',
        target_amount: 100000,
        current_amount: 45000,
        target_date: '2027-03-31',
        monthly_contribution: 7000,
        icon: 'ShieldCheck',
        created_at: '2026-03-01T00:00:00.000Z',
        updated_at: '2026-09-30T04:00:00.000Z'
      },
      {
        id: 'goal_alex_laptop',
        user_id: 'user_alex',
        name: 'Workstation Laptop Upgrade',
        target_amount: 60000,
        current_amount: 32000,
        target_date: '2026-12-15',
        monthly_contribution: 5000,
        icon: 'Laptop',
        created_at: '2026-05-01T00:00:00.000Z',
        updated_at: '2026-09-30T04:00:00.000Z'
      }
    ],
    ai_insights: [
      {
        id: 'ins_food_over',
        category: 'Food & Dining',
        icon: 'AlertCircle',
        title: 'Dining Budget Exceeded',
        text: 'You have spent ₹6,500 on dining, which is 108% of your planned monthly allowance.',
        suggested_action: 'Reduce discretionary dining this weekend',
        action_type: 'budget',
        urgency: 'warning'
      },
      {
        id: 'ins_savings_high',
        category: 'Savings Pace',
        icon: 'TrendingUp',
        title: 'Strong Savings Rate',
        text: 'Your current savings rate of 36.5% exceeds the standard 20% benchmark by +16.5%.',
        suggested_action: 'Allocate surplus to Emergency Fund',
        action_type: 'savings',
        urgency: 'positive'
      },
      {
        id: 'ins_goal_proj',
        category: 'Goal Projections',
        icon: 'Target',
        title: 'Emergency Fund Projection',
        text: 'At your current monthly pace of ₹7,000, you will reach your target in approximately 8 months.',
        suggested_action: 'Boost contribution by ₹1,000 to save 1 month',
        action_type: 'savings',
        urgency: 'normal'
      }
    ],
    recent_transactions: [
      { id: 't1', type: 'income', amount: 65000, categoryOrSource: 'TechCorp Solutions', description: 'Monthly Salary Credit', date: '2026-09-01', paymentMethodOrType: 'salary' },
      { id: 't2', type: 'expense', amount: 15000, categoryOrSource: 'Housing', description: 'Apartment Monthly Rent', date: '2026-09-02', paymentMethodOrType: 'Bank Transfer' },
      { id: 't3', type: 'expense', amount: 3800, categoryOrSource: 'Food', description: 'Weekly Supermarket & Organic Groceries', date: '2026-09-05', paymentMethodOrType: 'UPI' },
      { id: 't4', type: 'expense', amount: 3000, categoryOrSource: 'Transport', description: 'Metro Card Reload & Fuel', date: '2026-09-08', paymentMethodOrType: 'Debit Card' },
      { id: 't5', type: 'expense', amount: 3000, categoryOrSource: 'Utilities', description: 'Electricity & High-speed Broadband', date: '2026-09-10', paymentMethodOrType: 'UPI' },
      { id: 't6', type: 'expense', amount: 2700, categoryOrSource: 'Food', description: 'Weekend Cafes & Dining Out', date: '2026-09-14', paymentMethodOrType: 'Credit Card' }
    ],
    health_score: {
      score: 78,
      rating: 'Good',
      explanation: 'Your financial health score is 78/100. Your savings rate (36.5%) is strong and 4 of 6 category budgets are well maintained.',
      breakdown: [
        { factor: 'Savings Rate', score: 30, max: 30, status: 'good', recommendation: 'Target a 30%+ savings rate consistently' },
        { factor: 'Budget Adherence', score: 20, max: 30, status: 'fair', recommendation: 'Keep all discretionary categories under 90%' },
        { factor: 'Goal Milestones', score: 14, max: 20, status: 'good', recommendation: 'Maintain regular monthly contributions' },
        { factor: 'Spending Stability', score: 14, max: 20, status: 'good', recommendation: 'Keep expenses well below total cashflow' }
      ]
    },
    monthly_summary: {
      period: 'September 2026',
      income: 65000,
      expenses: 41250,
      savings: 23750,
      savings_rate: 36.5,
      summary: 'In September 2026, you accumulated ₹65,000 in inflows and spent ₹41,250, leaving ₹23,750 in net savings. Housing was your largest category at ₹15,000 (36%).',
      focus_items: [
        '1. Monitor and curb discretionary dining expenses before weekends.',
        '2. Continue automating ₹7,000 monthly toward your Emergency Fund.',
        '3. Review recurring subscriptions to eliminate unused streaming or cloud services.'
      ]
    }
  };
}
