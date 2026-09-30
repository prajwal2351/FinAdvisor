import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import {
  User,
  Income,
  Expense,
  Budget,
  SavingsGoal,
  Notification,
  AIConversation,
  AIMessage,
  DashboardData,
  ExpenseCategory,
  UnifiedTransaction,
  FinancialHealthScore,
  BudgetUtilization,
  MonthlyFinancialSummary,
  AIInsight
} from '../types';

interface DatabaseSchema {
  users: User[];
  incomes: Income[];
  expenses: Expense[];
  budgets: Budget[];
  savings_goals: SavingsGoal[];
  notifications: Notification[];
  conversations: AIConversation[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'finance_db.json');

const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  Housing: '#0F172A',
  Food: '#10B981',
  Transport: '#3B82F6',
  Shopping: '#F59E0B',
  Entertainment: '#8B5CF6',
  Healthcare: '#EC4899',
  Education: '#06B6D4',
  Utilities: '#64748B',
  Subscriptions: '#6366F1',
  Travel: '#14B8A6',
  Other: '#94A3B8'
};

function round2(val: number): number {
  return Math.round((val + Number.EPSILON) * 100) / 100;
}

export function generateSeedData(): DatabaseSchema {
  const now = '2026-09-30T04:00:00.000Z';

  // 1. Salaried: Alex Sharma
  const userAlex: User = {
    id: 'user_alex',
    name: 'Alex Sharma',
    email: 'alex.sharma@example.com',
    user_type: 'salaried',
    currency: 'INR',
    monthly_income: 65000,
    primary_goal: 'Build emergency fund & save for new laptop',
    created_at: '2026-03-01T00:00:00.000Z',
    updated_at: now
  };

  // 2. Student: Priya Patel
  const userPriya: User = {
    id: 'user_priya',
    name: 'Priya Patel',
    email: 'priya.patel@student.edu',
    user_type: 'student',
    currency: 'INR',
    monthly_income: 12000,
    primary_goal: 'Control discretionary dining & save for tech gear',
    created_at: '2026-04-01T00:00:00.000Z',
    updated_at: now
  };

  // 3. Freelancer: Rohan Verma
  const userRohan: User = {
    id: 'user_rohan',
    name: 'Rohan Verma',
    email: 'rohan@creativelabs.io',
    user_type: 'freelancer',
    currency: 'INR',
    monthly_income: 95000,
    primary_goal: 'Build 6-month variable income runway buffer',
    created_at: '2026-02-01T00:00:00.000Z',
    updated_at: now
  };

  // 4. Household Manager: Sunita Rao
  const userSunita: User = {
    id: 'user_sunita',
    name: 'Sunita Rao',
    email: 'sunita.family@household.in',
    user_type: 'household',
    currency: 'INR',
    monthly_income: 110000,
    primary_goal: 'Consolidate family grocery & schooling budget',
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: now
  };

  const users = [userAlex, userPriya, userRohan, userSunita];

  // Incomes:
  const incomes: Income[] = [];
  const expenses: Expense[] = [];
  const budgets: Budget[] = [];
  const savings_goals: SavingsGoal[] = [];
  const notifications: Notification[] = [];
  const conversations: AIConversation[] = [];

  // Seed Alex (6 months history: Apr - Sep 2026)
  const alexMonths = [
    { year: 2026, m: 4, inc: 60000, expMult: 0.98 },
    { year: 2026, m: 5, inc: 60000, expMult: 1.05 },
    { year: 2026, m: 6, inc: 60000, expMult: 0.95 },
    { year: 2026, m: 7, inc: 62000, expMult: 1.02 },
    { year: 2026, m: 8, inc: 62000, expMult: 1.00 },
    { year: 2026, m: 9, inc: 65000, expMult: 0.96 }
  ];

  alexMonths.forEach(({ year, m, inc, expMult }) => {
    const monthStr = m.toString().padStart(2, '0');
    incomes.push({
      id: `inc_alex_${year}_${monthStr}_sal`,
      user_id: userAlex.id,
      amount: inc,
      source: 'TechCorp Solutions',
      income_type: 'salary',
      date: `${year}-${monthStr}-01`,
      description: `Monthly Salary Credit - ${new Date(year, m - 1).toLocaleString('default', { month: 'long' })}`,
      created_at: `${year}-${monthStr}-01T09:00:00.000Z`
    });

    if (m === 7) {
      incomes.push({
        id: `inc_alex_${year}_${monthStr}_perf`,
        user_id: userAlex.id,
        amount: 8000,
        source: 'Quarterly Bonus',
        income_type: 'bonus',
        date: `${year}-${monthStr}-15`,
        description: 'Mid-year performance recognition award',
        created_at: `${year}-${monthStr}-15T10:00:00.000Z`
      });
    }

    // Typical monthly expenses for Alex
    const baseExpenses: { cat: ExpenseCategory; desc: string; base: number; day: number; pay: Expense['payment_method'] }[] = [
      { cat: 'Housing', desc: 'Apartment Monthly Rent', base: 15000, day: 2, pay: 'Bank Transfer' },
      { cat: 'Food', desc: 'Weekly Supermarket & Organic Groceries', base: 3800 * expMult, day: 5, pay: 'UPI' },
      { cat: 'Food', desc: 'Weekend Cafes & Dining Out', base: 2700 * expMult, day: 14, pay: 'Credit Card' },
      { cat: 'Transport', desc: 'Metro Card Reload & Fuel', base: 3000 * expMult, day: 8, pay: 'Debit Card' },
      { cat: 'Shopping', desc: 'Apparel & Seasonal Essentials', base: 4000 * expMult, day: 18, pay: 'Credit Card' },
      { cat: 'Entertainment', desc: 'Concert & Movie Passes', base: 2500 * expMult, day: 20, pay: 'UPI' },
      { cat: 'Utilities', desc: 'Electricity & High-speed Broadband', base: 3000, day: 10, pay: 'UPI' },
      { cat: 'Education', desc: 'Cloud Certifications & Books', base: 2000, day: 12, pay: 'Credit Card' },
      { cat: 'Healthcare', desc: 'Health Checkup & Vitamins', base: 1500, day: 22, pay: 'Debit Card' },
      { cat: 'Subscriptions', desc: 'Cloud Storage & Media Streaming', base: 1000, day: 3, pay: 'Credit Card' },
      { cat: 'Other', desc: 'Home Maintenance & Miscellaneous', base: 1750, day: 25, pay: 'UPI' }
    ];

    baseExpenses.forEach((be, idx) => {
      const dayStr = be.day.toString().padStart(2, '0');
      expenses.push({
        id: `exp_alex_${year}_${monthStr}_${idx}`,
        user_id: userAlex.id,
        amount: round2(be.base),
        category: be.cat,
        description: be.desc,
        date: `${year}-${monthStr}-${dayStr}`,
        payment_method: be.pay,
        notes: 'Verified transaction',
        created_at: `${year}-${monthStr}-${dayStr}T14:20:00.000Z`
      });
    });
  });

  // Alex Budgets for Sep 2026
  const alexBudgetLimits: { cat: ExpenseCategory; limit: number }[] = [
    { cat: 'Housing', limit: 15000 },
    { cat: 'Food', limit: 6000 },
    { cat: 'Transport', limit: 3500 },
    { cat: 'Shopping', limit: 4500 },
    { cat: 'Entertainment', limit: 2000 },
    { cat: 'Utilities', limit: 3200 },
    { cat: 'Education', limit: 2500 },
    { cat: 'Healthcare', limit: 2000 },
    { cat: 'Subscriptions', limit: 1200 },
    { cat: 'Other', limit: 2500 }
  ];

  alexBudgetLimits.forEach(b => {
    budgets.push({
      id: `bgt_alex_2026_9_${b.cat.toLowerCase()}`,
      user_id: userAlex.id,
      month: 9,
      year: 2026,
      category: b.cat,
      limit_amount: b.limit,
      created_at: '2026-09-01T00:00:00.000Z',
      updated_at: '2026-09-01T00:00:00.000Z'
    });
  });

  // Alex Goals
  savings_goals.push(
    {
      id: 'goal_alex_emergency',
      user_id: userAlex.id,
      name: 'Emergency Fund (6 Months)',
      target_amount: 100000,
      current_amount: 45000,
      target_date: '2027-03-31',
      monthly_contribution: 7000,
      icon: 'ShieldCheck',
      created_at: '2026-03-01T00:00:00.000Z',
      updated_at: now
    },
    {
      id: 'goal_alex_laptop',
      user_id: userAlex.id,
      name: 'Workstation Laptop Upgrade',
      target_amount: 60000,
      current_amount: 32000,
      target_date: '2026-12-15',
      monthly_contribution: 5000,
      icon: 'Laptop',
      created_at: '2026-05-01T00:00:00.000Z',
      updated_at: now
    }
  );

  // Alex Notifications
  notifications.push(
    {
      id: 'notif_alex_1',
      user_id: userAlex.id,
      title: 'Food budget is 85% used',
      message: 'You have spent ₹5,240 of your ₹6,000 monthly food allowance with 5 days remaining in September.',
      type: 'budget',
      is_read: false,
      created_at: '2026-09-25T10:15:00.000Z'
    },
    {
      id: 'notif_alex_2',
      user_id: userAlex.id,
      title: 'Savings Milestone Achieved',
      message: 'Your Emergency Fund has crossed ₹45,000 (45% of your total ₹1,00,000 goal)!',
      type: 'savings',
      is_read: false,
      created_at: '2026-09-22T08:30:00.000Z'
    },
    {
      id: 'notif_alex_3',
      user_id: userAlex.id,
      title: 'AI Monthly Financial Report Ready',
      message: 'Your September financial summary and savings analysis are available for review.',
      type: 'tip',
      is_read: true,
      created_at: '2026-09-28T09:00:00.000Z'
    }
  );

  // Alex Initial AI conversation
  conversations.push({
    id: 'conv_alex_1',
    user_id: userAlex.id,
    title: 'Spending Analysis & Savings Review',
    created_at: '2026-09-26T14:00:00.000Z',
    updated_at: '2026-09-26T14:02:00.000Z',
    messages: [
      {
        id: 'msg_alex_1',
        role: 'user',
        content: 'Analyze my spending this month and show me where I can optimize savings.',
        created_at: '2026-09-26T14:00:00.000Z'
      },
      {
        id: 'msg_alex_2',
        role: 'assistant',
        content: `Here is your spending analysis for September 2026 based on your verified records:

- **Total Inflow**: ₹65,000
- **Total Expenses to Date**: ₹40,250
- **Projected Surplus**: ₹24,750 (approx. **38% savings rate**)

### Key Observations:
1. **Housing & Fixed Utilities**: ₹18,000 combined (27.7% of income) — healthy and well within the recommended 30% guideline.
2. **Food & Dining**: ₹6,240 spent against your ₹6,000 limit (104% utilization). Discretionary dining and coffee runs made up ₹2,600 of this.
3. **Entertainment**: Tracking at ₹2,400 against a ₹2,000 target.

### Actionable Recommendation:
Trimming ₹1,200 from weekend dining and streaming subscriptions will restore your budget buffer and accelerate your **Emergency Fund** contribution to reach your ₹1,00,000 milestone 3 weeks sooner.

*Educational reminder: FinAdvisor offers planning insights and calculations; consult a certified advisor for personalized investment or tax advice.*`,
        created_at: '2026-09-26T14:02:00.000Z',
        suggested_actions: ['Create a budget for next month', 'Adjust Food budget limit', 'Calculate emergency runway']
      }
    ]
  });

  // Seed Priya (College Student)
  incomes.push({
    id: 'inc_priya_sep',
    user_id: userPriya.id,
    amount: 12000,
    source: 'Monthly Family Allowance',
    income_type: 'allowance',
    date: '2026-09-02',
    description: 'College hostel allowance and living stipend',
    created_at: '2026-09-02T10:00:00.000Z'
  });

  const priyaExpenses: { cat: ExpenseCategory; desc: string; amt: number; day: number; pay: Expense['payment_method'] }[] = [
    { cat: 'Food', desc: 'Hostel Mess & Evening Tea', amt: 4200, day: 4, pay: 'UPI' },
    { cat: 'Education', desc: 'Semester Reference Books & Printing', amt: 1800, day: 8, pay: 'UPI' },
    { cat: 'Transport', desc: 'Student Bus Pass & Campus Rickshaw', amt: 1200, day: 10, pay: 'Cash' },
    { cat: 'Utilities', desc: 'Mobile Data Pack & Hostelite Wifi', amt: 599, day: 12, pay: 'UPI' },
    { cat: 'Entertainment', desc: 'College Fest & Weekend Movie', amt: 1400, day: 18, pay: 'UPI' },
    { cat: 'Shopping', desc: 'Stationery & Project Supplies', amt: 850, day: 22, pay: 'Cash' }
  ];

  priyaExpenses.forEach((pe, idx) => {
    expenses.push({
      id: `exp_priya_sep_${idx}`,
      user_id: userPriya.id,
      amount: pe.amt,
      category: pe.cat,
      description: pe.desc,
      date: `2026-09-${pe.day.toString().padStart(2, '0')}`,
      payment_method: pe.pay,
      notes: 'College daily tracker',
      created_at: `2026-09-${pe.day.toString().padStart(2, '0')}T12:00:00.000Z`
    });
  });

  budgets.push(
    { id: 'bgt_priya_food', user_id: userPriya.id, month: 9, year: 2026, category: 'Food', limit_amount: 4500, created_at: now, updated_at: now },
    { id: 'bgt_priya_edu', user_id: userPriya.id, month: 9, year: 2026, category: 'Education', limit_amount: 2000, created_at: now, updated_at: now },
    { id: 'bgt_priya_ent', user_id: userPriya.id, month: 9, year: 2026, category: 'Entertainment', limit_amount: 1500, created_at: now, updated_at: now }
  );

  savings_goals.push({
    id: 'goal_priya_cert',
    user_id: userPriya.id,
    name: 'AWS Cloud Certification & Tech Prep',
    target_amount: 15000,
    current_amount: 5200,
    target_date: '2027-01-20',
    monthly_contribution: 1500,
    icon: 'GraduationCap',
    created_at: '2026-04-01T00:00:00.000Z',
    updated_at: now
  });

  // Seed Rohan (Freelancer)
  incomes.push(
    { id: 'inc_rohan_1', user_id: userRohan.id, amount: 45000, source: 'Alpha FinTech App Design Retainer', income_type: 'freelance', date: '2026-09-04', description: 'Milestone 2 payment', created_at: now },
    { id: 'inc_rohan_2', user_id: userRohan.id, amount: 32000, source: 'Beta Commerce UI Revamp', income_type: 'freelance', date: '2026-09-15', description: 'Design system delivery', created_at: now },
    { id: 'inc_rohan_3', user_id: userRohan.id, amount: 18000, source: 'Design Consultation & Audit', income_type: 'business', date: '2026-09-24', description: 'Hourly architectural review', created_at: now }
  );

  const rohanExpenses: { cat: ExpenseCategory; desc: string; amt: number; day: number; pay: Expense['payment_method'] }[] = [
    { cat: 'Housing', desc: 'Studio Apartment & Home Office', amt: 18000, day: 3, pay: 'Bank Transfer' },
    { cat: 'Food', desc: 'Groceries & Co-working Lunches', amt: 7800, day: 8, pay: 'Credit Card' },
    { cat: 'Subscriptions', desc: 'Figma Org, Adobe CC, AI Tools', amt: 6500, day: 5, pay: 'Credit Card' },
    { cat: 'Transport', desc: 'Cab fares for client syncs', amt: 3400, day: 16, pay: 'UPI' },
    { cat: 'Utilities', desc: 'Gigabit Fiber & Studio Power', amt: 3800, day: 11, pay: 'UPI' },
    { cat: 'Healthcare', desc: 'Health Insurance Premium', amt: 3500, day: 20, pay: 'Bank Transfer' }
  ];

  rohanExpenses.forEach((re, idx) => {
    expenses.push({
      id: `exp_rohan_sep_${idx}`,
      user_id: userRohan.id,
      amount: re.amt,
      category: re.cat,
      description: re.desc,
      date: `2026-09-${re.day.toString().padStart(2, '0')}`,
      payment_method: re.pay,
      created_at: now
    });
  });

  savings_goals.push({
    id: 'goal_rohan_runway',
    user_id: userRohan.id,
    name: '6-Month Variable Runway Buffer',
    target_amount: 300000,
    current_amount: 185000,
    target_date: '2027-06-30',
    monthly_contribution: 25000,
    icon: 'ShieldAlert',
    created_at: '2026-02-01T00:00:00.000Z',
    updated_at: now
  });

  // Seed Sunita (Household Manager)
  incomes.push(
    { id: 'inc_sunita_1', user_id: userSunita.id, amount: 75000, source: 'Spouse Senior Engineer Salary', income_type: 'salary', date: '2026-09-01', description: 'Primary household salary pool', created_at: now },
    { id: 'inc_sunita_2', user_id: userSunita.id, amount: 35000, source: 'Curriculum Consulting Retainer', income_type: 'business', date: '2026-09-05', description: 'Secondary educational consultancy', created_at: now }
  );

  const sunitaExpenses: { cat: ExpenseCategory; desc: string; amt: number; day: number; pay: Expense['payment_method'] }[] = [
    { cat: 'Housing', desc: 'Society Maintenance & Home EMI', amt: 26000, day: 2, pay: 'Bank Transfer' },
    { cat: 'Food', desc: 'Monthly Family Grocery & Dairy', amt: 21500, day: 6, pay: 'Credit Card' },
    { cat: 'Education', desc: 'Children Term Tuition & Activity Classes', amt: 17500, day: 9, pay: 'Bank Transfer' },
    { cat: 'Utilities', desc: 'Electricity, LPG, Water & Fiber', amt: 6200, day: 12, pay: 'UPI' },
    { cat: 'Transport', desc: 'Family Car Fuel & School Van Fee', amt: 7200, day: 15, pay: 'Credit Card' },
    { cat: 'Healthcare', desc: 'Pediatric Checkup & Monthly Medicines', amt: 4800, day: 21, pay: 'Debit Card' }
  ];

  sunitaExpenses.forEach((se, idx) => {
    expenses.push({
      id: `exp_sunita_sep_${idx}`,
      user_id: userSunita.id,
      amount: se.amt,
      category: se.cat,
      description: se.desc,
      date: `2026-09-${se.day.toString().padStart(2, '0')}`,
      payment_method: se.pay,
      created_at: now
    });
  });

  savings_goals.push({
    id: 'goal_sunita_reno',
    user_id: userSunita.id,
    name: 'Home Renovation & Rain-Day Reserve',
    target_amount: 400000,
    current_amount: 210000,
    target_date: '2027-05-31',
    monthly_contribution: 20000,
    icon: 'Home',
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: now
  });

  return {
    users,
    incomes,
    expenses,
    budgets,
    savings_goals,
    notifications,
    conversations
  };
}

class FinanceDatabase {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadOrSeed();
  }

  private loadOrSeed(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.warn('Could not read existing database file, reseeding:', err);
    }
    const seeded = generateSeedData();
    this.save(seeded);
    return seeded;
  }

  private save(dataToSave?: DatabaseSchema) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(dataToSave || this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to persist database to disk:', err);
    }
  }

  public resetDemoData(): DatabaseSchema {
    this.data = generateSeedData();
    this.save();
    return this.data;
  }

  public getUsers(): User[] {
    return this.data.users;
  }

  public getUserById(id: string): User | undefined {
    return this.data.users.find(u => u.id === id);
  }

  public getUserByEmail(email: string): User | undefined {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  public createUser(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): User {
    const newUser: User = {
      id: `user_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
      ...userData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.data.users.push(newUser);
    this.save();
    return newUser;
  }

  public updateUser(userId: string, partial: Partial<User>): User | undefined {
    const idx = this.data.users.findIndex(u => u.id === userId);
    if (idx === -1) return undefined;
    this.data.users[idx] = {
      ...this.data.users[idx],
      ...partial,
      updated_at: new Date().toISOString()
    };
    this.save();
    return this.data.users[idx];
  }

  // Incomes
  public getIncomes(userId: string): Income[] {
    return this.data.incomes.filter(i => i.user_id === userId).sort((a, b) => b.date.localeCompare(a.date));
  }

  public addIncome(userId: string, data: Omit<Income, 'id' | 'user_id' | 'created_at'>): Income {
    const newInc: Income = {
      id: `inc_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
      user_id: userId,
      ...data,
      amount: round2(Number(data.amount)),
      created_at: new Date().toISOString()
    };
    this.data.incomes.push(newInc);
    this.save();
    return newInc;
  }

  public updateIncome(userId: string, incomeId: string, partial: Partial<Income>): Income | undefined {
    const idx = this.data.incomes.findIndex(i => i.id === incomeId && i.user_id === userId);
    if (idx === -1) return undefined;
    if (partial.amount !== undefined) partial.amount = round2(Number(partial.amount));
    this.data.incomes[idx] = { ...this.data.incomes[idx], ...partial };
    this.save();
    return this.data.incomes[idx];
  }

  public deleteIncome(userId: string, incomeId: string): boolean {
    const lenBefore = this.data.incomes.length;
    this.data.incomes = this.data.incomes.filter(i => !(i.id === incomeId && i.user_id === userId));
    const changed = this.data.incomes.length !== lenBefore;
    if (changed) this.save();
    return changed;
  }

  // Expenses
  public getExpenses(userId: string): Expense[] {
    return this.data.expenses.filter(e => e.user_id === userId).sort((a, b) => b.date.localeCompare(a.date));
  }

  public addExpense(userId: string, data: Omit<Expense, 'id' | 'user_id' | 'created_at'>): Expense {
    const newExp: Expense = {
      id: `exp_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
      user_id: userId,
      ...data,
      amount: round2(Number(data.amount)),
      created_at: new Date().toISOString()
    };
    this.data.expenses.push(newExp);

    // Auto-check budget limit and emit notification if near or exceeded
    this.checkBudgetAlerts(userId, newExp.category);

    this.save();
    return newExp;
  }

  public updateExpense(userId: string, expenseId: string, partial: Partial<Expense>): Expense | undefined {
    const idx = this.data.expenses.findIndex(e => e.id === expenseId && e.user_id === userId);
    if (idx === -1) return undefined;
    if (partial.amount !== undefined) partial.amount = round2(Number(partial.amount));
    this.data.expenses[idx] = { ...this.data.expenses[idx], ...partial };
    this.save();
    return this.data.expenses[idx];
  }

  public deleteExpense(userId: string, expenseId: string): boolean {
    const lenBefore = this.data.expenses.length;
    this.data.expenses = this.data.expenses.filter(e => !(e.id === expenseId && e.user_id === userId));
    const changed = this.data.expenses.length !== lenBefore;
    if (changed) this.save();
    return changed;
  }

  // Budgets
  public getBudgets(userId: string, month?: number, year?: number): Budget[] {
    return this.data.budgets.filter(b => {
      if (b.user_id !== userId) return false;
      if (month !== undefined && b.month !== month) return false;
      if (year !== undefined && b.year !== year) return false;
      return true;
    });
  }

  public setBudget(userId: string, category: ExpenseCategory, limit: number, month: number, year: number): Budget {
    const existing = this.data.budgets.find(b => b.user_id === userId && b.category === category && b.month === month && b.year === year);
    if (existing) {
      existing.limit_amount = round2(Number(limit));
      existing.updated_at = new Date().toISOString();
      this.save();
      return existing;
    }
    const newBudget: Budget = {
      id: `bgt_${Date.now()}_${crypto.randomBytes(2).toString('hex')}`,
      user_id: userId,
      month,
      year,
      category,
      limit_amount: round2(Number(limit)),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.data.budgets.push(newBudget);
    this.save();
    return newBudget;
  }

  public deleteBudget(userId: string, budgetId: string): boolean {
    const before = this.data.budgets.length;
    this.data.budgets = this.data.budgets.filter(b => !(b.id === budgetId && b.user_id === userId));
    const changed = this.data.budgets.length !== before;
    if (changed) this.save();
    return changed;
  }

  // Savings Goals
  public getSavingsGoals(userId: string): SavingsGoal[] {
    return this.data.savings_goals.filter(g => g.user_id === userId);
  }

  public addSavingsGoal(userId: string, data: Omit<SavingsGoal, 'id' | 'user_id' | 'created_at' | 'updated_at'>): SavingsGoal {
    const newGoal: SavingsGoal = {
      id: `goal_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
      user_id: userId,
      ...data,
      target_amount: round2(Number(data.target_amount)),
      current_amount: round2(Number(data.current_amount || 0)),
      monthly_contribution: round2(Number(data.monthly_contribution || 0)),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.data.savings_goals.push(newGoal);
    this.save();
    return newGoal;
  }

  public updateSavingsGoal(userId: string, goalId: string, partial: Partial<SavingsGoal>): SavingsGoal | undefined {
    const idx = this.data.savings_goals.findIndex(g => g.id === goalId && g.user_id === userId);
    if (idx === -1) return undefined;
    if (partial.target_amount !== undefined) partial.target_amount = round2(Number(partial.target_amount));
    if (partial.current_amount !== undefined) partial.current_amount = round2(Number(partial.current_amount));
    this.data.savings_goals[idx] = {
      ...this.data.savings_goals[idx],
      ...partial,
      updated_at: new Date().toISOString()
    };
    this.save();
    return this.data.savings_goals[idx];
  }

  public contributeToGoal(userId: string, goalId: string, amount: number): SavingsGoal | undefined {
    const goal = this.data.savings_goals.find(g => g.id === goalId && g.user_id === userId);
    if (!goal) return undefined;
    goal.current_amount = round2(goal.current_amount + Number(amount));
    goal.updated_at = new Date().toISOString();

    // Check if goal reached milestone
    if (goal.current_amount >= goal.target_amount) {
      this.addNotification(userId, {
        title: `Goal Accomplished: ${goal.name}!`,
        message: `Congratulations! You reached 100% of your target amount (₹${goal.target_amount.toLocaleString()})!`,
        type: 'savings'
      });
    }
    this.save();
    return goal;
  }

  public deleteSavingsGoal(userId: string, goalId: string): boolean {
    const before = this.data.savings_goals.length;
    this.data.savings_goals = this.data.savings_goals.filter(g => !(g.id === goalId && g.user_id === userId));
    const changed = this.data.savings_goals.length !== before;
    if (changed) this.save();
    return changed;
  }

  // Notifications
  public getNotifications(userId: string): Notification[] {
    return this.data.notifications
      .filter(n => n.user_id === userId)
      .sort((a, b) => b.created_at.localeCompare(a.created_at));
  }

  public addNotification(userId: string, data: { title: string; message: string; type: Notification['type'] }): Notification {
    const notif: Notification = {
      id: `notif_${Date.now()}_${crypto.randomBytes(2).toString('hex')}`,
      user_id: userId,
      ...data,
      is_read: false,
      created_at: new Date().toISOString()
    };
    this.data.notifications.unshift(notif);
    this.save();
    return notif;
  }

  public markNotificationRead(userId: string, notifId: string): boolean {
    const notif = this.data.notifications.find(n => n.id === notifId && n.user_id === userId);
    if (notif) {
      notif.is_read = true;
      this.save();
      return true;
    }
    return false;
  }

  public markAllNotificationsRead(userId: string): number {
    let count = 0;
    this.data.notifications.forEach(n => {
      if (n.user_id === userId && !n.is_read) {
        n.is_read = true;
        count++;
      }
    });
    if (count > 0) this.save();
    return count;
  }

  // AI Chat
  public getConversation(userId: string): AIConversation {
    let conv = this.data.conversations.find(c => c.user_id === userId);
    if (!conv) {
      conv = {
        id: `conv_${userId}`,
        user_id: userId,
        title: 'Financial Planning & Strategy',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        messages: [
          {
            id: `msg_welcome_${Date.now()}`,
            role: 'assistant',
            content: `Hello! I am your **FinAdvisor AI** personal financial assistant. 

I have direct access to your verified income records, category spending, active budgets, and savings goals for this period. 

How can I help you today? You can ask:
- *"Where am I overspending this month?"*
- *"How can I save ₹5,000 this month?"*
- *"Create a balanced budget recommendation based on my income"*
- *"How fast can I reach my emergency fund goal?"*`,
            created_at: new Date().toISOString(),
            suggested_actions: [
              'Where am I overspending?',
              'How can I save ₹5,000 this month?',
              'Analyze my spending this month',
              'Create a budget for me'
            ]
          }
        ]
      };
      this.data.conversations.push(conv);
      this.save();
    }
    return conv;
  }

  public addChatMessage(userId: string, role: 'user' | 'assistant', content: string, suggested_actions?: string[]): AIMessage {
    const conv = this.getConversation(userId);
    const msg: AIMessage = {
      id: `msg_${Date.now()}_${crypto.randomBytes(2).toString('hex')}`,
      role,
      content,
      created_at: new Date().toISOString(),
      suggested_actions
    };
    conv.messages.push(msg);
    conv.updated_at = new Date().toISOString();
    this.save();
    return msg;
  }

  private checkBudgetAlerts(userId: string, category: ExpenseCategory) {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    const budget = this.data.budgets.find(b => b.user_id === userId && b.category === category && b.month === currentMonth && b.year === currentYear);
    if (!budget) return;

    // Sum category spending
    const startStr = `${currentYear}-${currentMonth.toString().padStart(2, '0')}-01`;
    const endStr = `${currentYear}-${currentMonth.toString().padStart(2, '0')}-31`;
    const spent = this.data.expenses
      .filter(e => e.user_id === userId && e.category === category && e.date >= startStr && e.date <= endStr)
      .reduce((sum, e) => sum + e.amount, 0);

    const ratio = spent / budget.limit_amount;
    if (ratio >= 1.0) {
      this.addNotification(userId, {
        title: `${category} budget exceeded`,
        message: `Your spending on ${category} (₹${spent.toLocaleString()}) has exceeded your limit of ₹${budget.limit_amount.toLocaleString()}.`,
        type: 'budget'
      });
    } else if (ratio >= 0.85) {
      this.addNotification(userId, {
        title: `${category} budget is ${Math.round(ratio * 100)}% used`,
        message: `You have used ₹${spent.toLocaleString()} of your ₹${budget.limit_amount.toLocaleString()} limit for ${category}.`,
        type: 'budget'
      });
    }
  }

  // Dashboard Aggregator
  public getDashboardData(userId: string, targetMonth = 9, targetYear = 2026): DashboardData {
    const user = this.getUserById(userId) || this.data.users[0];
    const monthStr = targetMonth.toString().padStart(2, '0');
    const startOfMonth = `${targetYear}-${monthStr}-01`;
    const endOfMonth = `${targetYear}-${monthStr}-31`;

    // Previous month calculation
    const prevMonthDate = new Date(targetYear, targetMonth - 2, 1);
    const prevMonth = prevMonthDate.getMonth() + 1;
    const prevYear = prevMonthDate.getFullYear();
    const prevMonthStr = prevMonth.toString().padStart(2, '0');
    const prevStartOfMonth = `${prevYear}-${prevMonthStr}-01`;
    const prevEndOfMonth = `${prevYear}-${prevMonthStr}-31`;

    // Filter incomes & expenses
    const curIncomes = this.data.incomes.filter(i => i.user_id === userId && i.date >= startOfMonth && i.date <= endOfMonth);
    const curExpenses = this.data.expenses.filter(e => e.user_id === userId && e.date >= startOfMonth && e.date <= endOfMonth);

    const prevIncomes = this.data.incomes.filter(i => i.user_id === userId && i.date >= prevStartOfMonth && i.date <= prevEndOfMonth);
    const prevExpenses = this.data.expenses.filter(e => e.user_id === userId && e.date >= prevStartOfMonth && e.date <= prevEndOfMonth);

    const total_income = round2(curIncomes.reduce((acc, i) => acc + i.amount, 0));
    const total_expenses = round2(curExpenses.reduce((acc, e) => acc + e.amount, 0));
    const total_savings = round2(total_income - total_expenses);
    const savings_rate = total_income > 0 ? round2((total_savings / total_income) * 100) : 0;

    const prev_income = round2(prevIncomes.reduce((acc, i) => acc + i.amount, 0));
    const prev_expenses = round2(prevExpenses.reduce((acc, e) => acc + e.amount, 0));
    const prev_savings = round2(prev_income - prev_expenses);
    const prev_savings_rate = prev_income > 0 ? round2((prev_savings / prev_income) * 100) : 0;

    const income_growth_pct = prev_income > 0 ? round2(((total_income - prev_income) / prev_income) * 100) : 0;
    const expense_growth_pct = prev_expenses > 0 ? round2(((total_expenses - prev_expenses) / prev_expenses) * 100) : 0;
    const savings_growth_pct = prev_savings > 0 ? round2(((total_savings - prev_savings) / prev_savings) * 100) : 0;

    // Monthly trend (last 6 months)
    const monthly_trend: DashboardData['monthly_trend'] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(targetYear, targetMonth - 1 - i, 1);
      const mNum = d.getMonth() + 1;
      const yNum = d.getFullYear();
      const mCode = mNum.toString().padStart(2, '0');
      const s = `${yNum}-${mCode}-01`;
      const e = `${yNum}-${mCode}-31`;

      const mInc = this.data.incomes.filter(inc => inc.user_id === userId && inc.date >= s && inc.date <= e).reduce((a, b) => a + b.amount, 0);
      const mExp = this.data.expenses.filter(exp => exp.user_id === userId && exp.date >= s && exp.date <= e).reduce((a, b) => a + b.amount, 0);
      const mSav = round2(mInc - mExp);

      monthly_trend.push({
        month: d.toLocaleString('default', { month: 'short' }),
        month_num: mNum,
        year: yNum,
        income: round2(mInc),
        expenses: round2(mExp),
        savings: mSav
      });
    }

    // Expense Breakdown
    const catMap: Partial<Record<ExpenseCategory, number>> = {};
    curExpenses.forEach(exp => {
      catMap[exp.category] = (catMap[exp.category] || 0) + exp.amount;
    });

    const expense_breakdown = Object.entries(catMap).map(([cat, amt]) => {
      const category = cat as ExpenseCategory;
      const percentage = total_expenses > 0 ? round2((amt / total_expenses) * 100) : 0;
      return {
        category,
        amount: round2(amt),
        percentage,
        color: CATEGORY_COLORS[category] || '#64748B'
      };
    }).sort((a, b) => b.amount - a.amount);

    // Budget Utilization
    const curBudgets = this.data.budgets.filter(b => b.user_id === userId && b.month === targetMonth && b.year === targetYear);
    const budget_utilization: BudgetUtilization[] = curBudgets.map(b => {
      const spent = round2(catMap[b.category] || 0);
      const remaining = round2(b.limit_amount - spent);
      const pct = b.limit_amount > 0 ? round2((spent / b.limit_amount) * 100) : 0;

      let status: BudgetUtilization['status'] = 'normal';
      if (pct > 100) status = 'exceeded';
      else if (pct >= 90) status = 'near_limit';
      else if (pct >= 70) status = 'warning';

      return {
        category: b.category,
        limit: b.limit_amount,
        spent,
        remaining,
        percentage: pct,
        status
      };
    }).sort((a, b) => b.percentage - a.percentage);

    // Savings Goals
    const savings_goals = this.data.savings_goals.filter(g => g.user_id === userId);

    // AI Financial Insights (dynamic based on actual numbers)
    const ai_insights: AIInsight[] = [];

    // Food insight
    const foodSpent = catMap['Food'] || 0;
    const foodBudget = curBudgets.find(b => b.category === 'Food')?.limit_amount;
    if (foodBudget && foodSpent > foodBudget) {
      ai_insights.push({
        id: 'ins_food_over',
        category: 'Food & Dining',
        icon: 'AlertCircle',
        title: 'Dining Budget Exceeded',
        text: `You have spent ₹${foodSpent.toLocaleString()} on dining, which is ${Math.round((foodSpent / foodBudget) * 100)}% of your planned limit.`,
        suggested_action: 'Reduce discretionary takeout this weekend',
        action_type: 'budget',
        urgency: 'warning'
      });
    }

    // Savings rate insight
    if (savings_rate >= 25) {
      ai_insights.push({
        id: 'ins_savings_high',
        category: 'Savings Pace',
        icon: 'TrendingUp',
        title: 'Strong Savings Rate',
        text: `Your current savings rate of ${savings_rate}% exceeds the typical 20% benchmark by +${round2(savings_rate - 20)}%.`,
        suggested_action: 'Allocate surplus to Emergency Fund',
        action_type: 'savings',
        urgency: 'positive'
      });
    } else {
      ai_insights.push({
        id: 'ins_savings_boost',
        category: 'Savings Opportunity',
        icon: 'Compass',
        title: 'Elevate Monthly Savings',
        text: `Trimming discretionary subscriptions and transport by ₹1,500 would lift your savings rate to ${round2(((total_savings + 1500) / (total_income || 1)) * 100)}%.`,
        suggested_action: 'Review recurring subscriptions',
        action_type: 'expense',
        urgency: 'normal'
      });
    }

    // Goal projection insight
    const primaryGoal = savings_goals[0];
    if (primaryGoal && primaryGoal.target_amount > primaryGoal.current_amount) {
      const remainingAmount = primaryGoal.target_amount - primaryGoal.current_amount;
      const monthsNeeded = primaryGoal.monthly_contribution > 0 ? Math.ceil(remainingAmount / primaryGoal.monthly_contribution) : 12;
      ai_insights.push({
        id: 'ins_goal_proj',
        category: 'Goal Projections',
        icon: 'Target',
        title: `${primaryGoal.name} Projection`,
        text: `At your current monthly pace of ₹${primaryGoal.monthly_contribution.toLocaleString()}, you will reach your target in approximately ${monthsNeeded} months.`,
        suggested_action: 'Boost monthly contribution by ₹1,000',
        action_type: 'savings',
        urgency: 'normal'
      });
    }

    // Recent Transactions (merged and sorted)
    const recent_incomes: UnifiedTransaction[] = curIncomes.map(i => ({
      id: i.id,
      type: 'income',
      amount: i.amount,
      categoryOrSource: i.source,
      description: i.description,
      date: i.date,
      paymentMethodOrType: i.income_type
    }));

    const recent_expenses: UnifiedTransaction[] = curExpenses.map(e => ({
      id: e.id,
      type: 'expense',
      amount: e.amount,
      categoryOrSource: e.category,
      description: e.description,
      date: e.date,
      paymentMethodOrType: e.payment_method,
      notes: e.notes
    }));

    const recent_transactions = [...recent_incomes, ...recent_expenses]
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 8);

    // Financial Health Score Calculation (0-100)
    let healthPoints = 0;
    // 1. Savings rate (max 30 pts)
    const srPoints = Math.min(30, Math.max(0, Math.round((savings_rate / 35) * 30)));
    // 2. Budget adherence (max 30 pts)
    const overBudgetCats = budget_utilization.filter(b => b.percentage > 100).length;
    const baPoints = Math.max(0, 30 - overBudgetCats * 10);
    // 3. Goal progress (max 20 pts)
    const gpPoints = savings_goals.length > 0 ? Math.min(20, Math.round((savings_goals[0].current_amount / (savings_goals[0].target_amount || 1)) * 20)) : 10;
    // 4. Expense consistency (max 20 pts)
    const ecPoints = total_expenses <= total_income ? 18 : 6;

    healthPoints = Math.min(100, Math.max(10, srPoints + baPoints + gpPoints + ecPoints));

    const health_score: FinancialHealthScore = {
      score: healthPoints,
      rating: healthPoints >= 80 ? 'Excellent' : healthPoints >= 65 ? 'Good' : healthPoints >= 50 ? 'Fair' : 'Needs Attention',
      explanation: `Your financial health score is ${healthPoints}/100. Your savings rate (${savings_rate}%) is healthy, and ${budget_utilization.length - overBudgetCats} of ${budget_utilization.length || 1} budgets are in good standing.`,
      breakdown: [
        { factor: 'Savings Rate', score: srPoints, max: 30, status: srPoints >= 20 ? 'good' : 'fair', recommendation: 'Target a 30%+ savings rate consistently' },
        { factor: 'Budget Adherence', score: baPoints, max: 30, status: baPoints >= 20 ? 'good' : 'fair', recommendation: 'Keep all discretionary categories under 90%' },
        { factor: 'Goal Milestones', score: gpPoints, max: 20, status: gpPoints >= 12 ? 'good' : 'fair', recommendation: 'Maintain regular monthly contributions' },
        { factor: 'Spending Stability', score: ecPoints, max: 20, status: ecPoints >= 15 ? 'good' : 'fair', recommendation: 'Keep expenses well below total cashflow' }
      ]
    };

    // Monthly summary
    const monthName = new Date(targetYear, targetMonth - 1).toLocaleString('default', { month: 'long' });
    const topCat = expense_breakdown[0]?.category || 'Housing';
    const topCatAmt = expense_breakdown[0]?.amount || 0;

    const monthly_summary: MonthlyFinancialSummary = {
      period: `${monthName} ${targetYear}`,
      income: total_income,
      expenses: total_expenses,
      savings: total_savings,
      savings_rate,
      summary: `In ${monthName} ${targetYear}, you accumulated ₹${total_income.toLocaleString()} in inflows and spent ₹${total_expenses.toLocaleString()}, leaving ₹${total_savings.toLocaleString()} in net savings. ${topCat} was your largest category at ₹${topCatAmt.toLocaleString()} (${expense_breakdown[0]?.percentage || 0}%).`,
      focus_items: [
        '1. Monitor and curb discretionary dining expenses before weekends.',
        '2. Continue automating ₹7,000 monthly toward your Emergency Fund.',
        '3. Review recurring subscriptions to eliminate unused streaming or cloud services.'
      ]
    };

    return {
      user,
      period: {
        month: targetMonth,
        year: targetYear,
        label: `${monthName} ${targetYear}`
      },
      kpis: {
        total_income,
        total_expenses,
        total_savings,
        savings_rate,
        prev_income,
        prev_expenses,
        prev_savings,
        prev_savings_rate,
        income_growth_pct,
        expense_growth_pct,
        savings_growth_pct
      },
      monthly_trend,
      expense_breakdown,
      budget_utilization,
      savings_goals,
      ai_insights,
      recent_transactions,
      health_score,
      monthly_summary
    };
  }
}

export const db = new FinanceDatabase();
