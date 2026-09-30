// server.ts
import express from "express";
import path2 from "path";
import fs2 from "fs";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

// src/server/dataStore.ts
import fs from "fs";
import path from "path";
import crypto from "crypto";
var DATA_DIR = path.resolve(process.cwd(), "data");
var DB_FILE = path.join(DATA_DIR, "finance_db.json");
var CATEGORY_COLORS = {
  Housing: "#0F172A",
  Food: "#10B981",
  Transport: "#3B82F6",
  Shopping: "#F59E0B",
  Entertainment: "#8B5CF6",
  Healthcare: "#EC4899",
  Education: "#06B6D4",
  Utilities: "#64748B",
  Subscriptions: "#6366F1",
  Travel: "#14B8A6",
  Other: "#94A3B8"
};
function round2(val) {
  return Math.round((val + Number.EPSILON) * 100) / 100;
}
function generateSeedData() {
  const now = "2026-09-30T04:00:00.000Z";
  const userAlex = {
    id: "user_alex",
    name: "Alex Sharma",
    email: "alex.sharma@example.com",
    user_type: "salaried",
    currency: "INR",
    monthly_income: 65e3,
    primary_goal: "Build emergency fund & save for new laptop",
    created_at: "2026-03-01T00:00:00.000Z",
    updated_at: now
  };
  const userPriya = {
    id: "user_priya",
    name: "Priya Patel",
    email: "priya.patel@student.edu",
    user_type: "student",
    currency: "INR",
    monthly_income: 12e3,
    primary_goal: "Control discretionary dining & save for tech gear",
    created_at: "2026-04-01T00:00:00.000Z",
    updated_at: now
  };
  const userRohan = {
    id: "user_rohan",
    name: "Rohan Verma",
    email: "rohan@creativelabs.io",
    user_type: "freelancer",
    currency: "INR",
    monthly_income: 95e3,
    primary_goal: "Build 6-month variable income runway buffer",
    created_at: "2026-02-01T00:00:00.000Z",
    updated_at: now
  };
  const userSunita = {
    id: "user_sunita",
    name: "Sunita Rao",
    email: "sunita.family@household.in",
    user_type: "household",
    currency: "INR",
    monthly_income: 11e4,
    primary_goal: "Consolidate family grocery & schooling budget",
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: now
  };
  const users = [userAlex, userPriya, userRohan, userSunita];
  const incomes = [];
  const expenses = [];
  const budgets = [];
  const savings_goals = [];
  const notifications = [];
  const conversations = [];
  const alexMonths = [
    { year: 2026, m: 4, inc: 6e4, expMult: 0.98 },
    { year: 2026, m: 5, inc: 6e4, expMult: 1.05 },
    { year: 2026, m: 6, inc: 6e4, expMult: 0.95 },
    { year: 2026, m: 7, inc: 62e3, expMult: 1.02 },
    { year: 2026, m: 8, inc: 62e3, expMult: 1 },
    { year: 2026, m: 9, inc: 65e3, expMult: 0.96 }
  ];
  alexMonths.forEach(({ year, m, inc, expMult }) => {
    const monthStr = m.toString().padStart(2, "0");
    incomes.push({
      id: `inc_alex_${year}_${monthStr}_sal`,
      user_id: userAlex.id,
      amount: inc,
      source: "TechCorp Solutions",
      income_type: "salary",
      date: `${year}-${monthStr}-01`,
      description: `Monthly Salary Credit - ${new Date(year, m - 1).toLocaleString("default", { month: "long" })}`,
      created_at: `${year}-${monthStr}-01T09:00:00.000Z`
    });
    if (m === 7) {
      incomes.push({
        id: `inc_alex_${year}_${monthStr}_perf`,
        user_id: userAlex.id,
        amount: 8e3,
        source: "Quarterly Bonus",
        income_type: "bonus",
        date: `${year}-${monthStr}-15`,
        description: "Mid-year performance recognition award",
        created_at: `${year}-${monthStr}-15T10:00:00.000Z`
      });
    }
    const baseExpenses = [
      { cat: "Housing", desc: "Apartment Monthly Rent", base: 15e3, day: 2, pay: "Bank Transfer" },
      { cat: "Food", desc: "Weekly Supermarket & Organic Groceries", base: 3800 * expMult, day: 5, pay: "UPI" },
      { cat: "Food", desc: "Weekend Cafes & Dining Out", base: 2700 * expMult, day: 14, pay: "Credit Card" },
      { cat: "Transport", desc: "Metro Card Reload & Fuel", base: 3e3 * expMult, day: 8, pay: "Debit Card" },
      { cat: "Shopping", desc: "Apparel & Seasonal Essentials", base: 4e3 * expMult, day: 18, pay: "Credit Card" },
      { cat: "Entertainment", desc: "Concert & Movie Passes", base: 2500 * expMult, day: 20, pay: "UPI" },
      { cat: "Utilities", desc: "Electricity & High-speed Broadband", base: 3e3, day: 10, pay: "UPI" },
      { cat: "Education", desc: "Cloud Certifications & Books", base: 2e3, day: 12, pay: "Credit Card" },
      { cat: "Healthcare", desc: "Health Checkup & Vitamins", base: 1500, day: 22, pay: "Debit Card" },
      { cat: "Subscriptions", desc: "Cloud Storage & Media Streaming", base: 1e3, day: 3, pay: "Credit Card" },
      { cat: "Other", desc: "Home Maintenance & Miscellaneous", base: 1750, day: 25, pay: "UPI" }
    ];
    baseExpenses.forEach((be, idx) => {
      const dayStr = be.day.toString().padStart(2, "0");
      expenses.push({
        id: `exp_alex_${year}_${monthStr}_${idx}`,
        user_id: userAlex.id,
        amount: round2(be.base),
        category: be.cat,
        description: be.desc,
        date: `${year}-${monthStr}-${dayStr}`,
        payment_method: be.pay,
        notes: "Verified transaction",
        created_at: `${year}-${monthStr}-${dayStr}T14:20:00.000Z`
      });
    });
  });
  const alexBudgetLimits = [
    { cat: "Housing", limit: 15e3 },
    { cat: "Food", limit: 6e3 },
    { cat: "Transport", limit: 3500 },
    { cat: "Shopping", limit: 4500 },
    { cat: "Entertainment", limit: 2e3 },
    { cat: "Utilities", limit: 3200 },
    { cat: "Education", limit: 2500 },
    { cat: "Healthcare", limit: 2e3 },
    { cat: "Subscriptions", limit: 1200 },
    { cat: "Other", limit: 2500 }
  ];
  alexBudgetLimits.forEach((b) => {
    budgets.push({
      id: `bgt_alex_2026_9_${b.cat.toLowerCase()}`,
      user_id: userAlex.id,
      month: 9,
      year: 2026,
      category: b.cat,
      limit_amount: b.limit,
      created_at: "2026-09-01T00:00:00.000Z",
      updated_at: "2026-09-01T00:00:00.000Z"
    });
  });
  savings_goals.push(
    {
      id: "goal_alex_emergency",
      user_id: userAlex.id,
      name: "Emergency Fund (6 Months)",
      target_amount: 1e5,
      current_amount: 45e3,
      target_date: "2027-03-31",
      monthly_contribution: 7e3,
      icon: "ShieldCheck",
      created_at: "2026-03-01T00:00:00.000Z",
      updated_at: now
    },
    {
      id: "goal_alex_laptop",
      user_id: userAlex.id,
      name: "Workstation Laptop Upgrade",
      target_amount: 6e4,
      current_amount: 32e3,
      target_date: "2026-12-15",
      monthly_contribution: 5e3,
      icon: "Laptop",
      created_at: "2026-05-01T00:00:00.000Z",
      updated_at: now
    }
  );
  notifications.push(
    {
      id: "notif_alex_1",
      user_id: userAlex.id,
      title: "Food budget is 85% used",
      message: "You have spent \u20B95,240 of your \u20B96,000 monthly food allowance with 5 days remaining in September.",
      type: "budget",
      is_read: false,
      created_at: "2026-09-25T10:15:00.000Z"
    },
    {
      id: "notif_alex_2",
      user_id: userAlex.id,
      title: "Savings Milestone Achieved",
      message: "Your Emergency Fund has crossed \u20B945,000 (45% of your total \u20B91,00,000 goal)!",
      type: "savings",
      is_read: false,
      created_at: "2026-09-22T08:30:00.000Z"
    },
    {
      id: "notif_alex_3",
      user_id: userAlex.id,
      title: "AI Monthly Financial Report Ready",
      message: "Your September financial summary and savings analysis are available for review.",
      type: "tip",
      is_read: true,
      created_at: "2026-09-28T09:00:00.000Z"
    }
  );
  conversations.push({
    id: "conv_alex_1",
    user_id: userAlex.id,
    title: "Spending Analysis & Savings Review",
    created_at: "2026-09-26T14:00:00.000Z",
    updated_at: "2026-09-26T14:02:00.000Z",
    messages: [
      {
        id: "msg_alex_1",
        role: "user",
        content: "Analyze my spending this month and show me where I can optimize savings.",
        created_at: "2026-09-26T14:00:00.000Z"
      },
      {
        id: "msg_alex_2",
        role: "assistant",
        content: `Here is your spending analysis for September 2026 based on your verified records:

- **Total Inflow**: \u20B965,000
- **Total Expenses to Date**: \u20B940,250
- **Projected Surplus**: \u20B924,750 (approx. **38% savings rate**)

### Key Observations:
1. **Housing & Fixed Utilities**: \u20B918,000 combined (27.7% of income) \u2014 healthy and well within the recommended 30% guideline.
2. **Food & Dining**: \u20B96,240 spent against your \u20B96,000 limit (104% utilization). Discretionary dining and coffee runs made up \u20B92,600 of this.
3. **Entertainment**: Tracking at \u20B92,400 against a \u20B92,000 target.

### Actionable Recommendation:
Trimming \u20B91,200 from weekend dining and streaming subscriptions will restore your budget buffer and accelerate your **Emergency Fund** contribution to reach your \u20B91,00,000 milestone 3 weeks sooner.

*Educational reminder: FinAdvisor offers planning insights and calculations; consult a certified advisor for personalized investment or tax advice.*`,
        created_at: "2026-09-26T14:02:00.000Z",
        suggested_actions: ["Create a budget for next month", "Adjust Food budget limit", "Calculate emergency runway"]
      }
    ]
  });
  incomes.push({
    id: "inc_priya_sep",
    user_id: userPriya.id,
    amount: 12e3,
    source: "Monthly Family Allowance",
    income_type: "allowance",
    date: "2026-09-02",
    description: "College hostel allowance and living stipend",
    created_at: "2026-09-02T10:00:00.000Z"
  });
  const priyaExpenses = [
    { cat: "Food", desc: "Hostel Mess & Evening Tea", amt: 4200, day: 4, pay: "UPI" },
    { cat: "Education", desc: "Semester Reference Books & Printing", amt: 1800, day: 8, pay: "UPI" },
    { cat: "Transport", desc: "Student Bus Pass & Campus Rickshaw", amt: 1200, day: 10, pay: "Cash" },
    { cat: "Utilities", desc: "Mobile Data Pack & Hostelite Wifi", amt: 599, day: 12, pay: "UPI" },
    { cat: "Entertainment", desc: "College Fest & Weekend Movie", amt: 1400, day: 18, pay: "UPI" },
    { cat: "Shopping", desc: "Stationery & Project Supplies", amt: 850, day: 22, pay: "Cash" }
  ];
  priyaExpenses.forEach((pe, idx) => {
    expenses.push({
      id: `exp_priya_sep_${idx}`,
      user_id: userPriya.id,
      amount: pe.amt,
      category: pe.cat,
      description: pe.desc,
      date: `2026-09-${pe.day.toString().padStart(2, "0")}`,
      payment_method: pe.pay,
      notes: "College daily tracker",
      created_at: `2026-09-${pe.day.toString().padStart(2, "0")}T12:00:00.000Z`
    });
  });
  budgets.push(
    { id: "bgt_priya_food", user_id: userPriya.id, month: 9, year: 2026, category: "Food", limit_amount: 4500, created_at: now, updated_at: now },
    { id: "bgt_priya_edu", user_id: userPriya.id, month: 9, year: 2026, category: "Education", limit_amount: 2e3, created_at: now, updated_at: now },
    { id: "bgt_priya_ent", user_id: userPriya.id, month: 9, year: 2026, category: "Entertainment", limit_amount: 1500, created_at: now, updated_at: now }
  );
  savings_goals.push({
    id: "goal_priya_cert",
    user_id: userPriya.id,
    name: "AWS Cloud Certification & Tech Prep",
    target_amount: 15e3,
    current_amount: 5200,
    target_date: "2027-01-20",
    monthly_contribution: 1500,
    icon: "GraduationCap",
    created_at: "2026-04-01T00:00:00.000Z",
    updated_at: now
  });
  incomes.push(
    { id: "inc_rohan_1", user_id: userRohan.id, amount: 45e3, source: "Alpha FinTech App Design Retainer", income_type: "freelance", date: "2026-09-04", description: "Milestone 2 payment", created_at: now },
    { id: "inc_rohan_2", user_id: userRohan.id, amount: 32e3, source: "Beta Commerce UI Revamp", income_type: "freelance", date: "2026-09-15", description: "Design system delivery", created_at: now },
    { id: "inc_rohan_3", user_id: userRohan.id, amount: 18e3, source: "Design Consultation & Audit", income_type: "business", date: "2026-09-24", description: "Hourly architectural review", created_at: now }
  );
  const rohanExpenses = [
    { cat: "Housing", desc: "Studio Apartment & Home Office", amt: 18e3, day: 3, pay: "Bank Transfer" },
    { cat: "Food", desc: "Groceries & Co-working Lunches", amt: 7800, day: 8, pay: "Credit Card" },
    { cat: "Subscriptions", desc: "Figma Org, Adobe CC, AI Tools", amt: 6500, day: 5, pay: "Credit Card" },
    { cat: "Transport", desc: "Cab fares for client syncs", amt: 3400, day: 16, pay: "UPI" },
    { cat: "Utilities", desc: "Gigabit Fiber & Studio Power", amt: 3800, day: 11, pay: "UPI" },
    { cat: "Healthcare", desc: "Health Insurance Premium", amt: 3500, day: 20, pay: "Bank Transfer" }
  ];
  rohanExpenses.forEach((re, idx) => {
    expenses.push({
      id: `exp_rohan_sep_${idx}`,
      user_id: userRohan.id,
      amount: re.amt,
      category: re.cat,
      description: re.desc,
      date: `2026-09-${re.day.toString().padStart(2, "0")}`,
      payment_method: re.pay,
      created_at: now
    });
  });
  savings_goals.push({
    id: "goal_rohan_runway",
    user_id: userRohan.id,
    name: "6-Month Variable Runway Buffer",
    target_amount: 3e5,
    current_amount: 185e3,
    target_date: "2027-06-30",
    monthly_contribution: 25e3,
    icon: "ShieldAlert",
    created_at: "2026-02-01T00:00:00.000Z",
    updated_at: now
  });
  incomes.push(
    { id: "inc_sunita_1", user_id: userSunita.id, amount: 75e3, source: "Spouse Senior Engineer Salary", income_type: "salary", date: "2026-09-01", description: "Primary household salary pool", created_at: now },
    { id: "inc_sunita_2", user_id: userSunita.id, amount: 35e3, source: "Curriculum Consulting Retainer", income_type: "business", date: "2026-09-05", description: "Secondary educational consultancy", created_at: now }
  );
  const sunitaExpenses = [
    { cat: "Housing", desc: "Society Maintenance & Home EMI", amt: 26e3, day: 2, pay: "Bank Transfer" },
    { cat: "Food", desc: "Monthly Family Grocery & Dairy", amt: 21500, day: 6, pay: "Credit Card" },
    { cat: "Education", desc: "Children Term Tuition & Activity Classes", amt: 17500, day: 9, pay: "Bank Transfer" },
    { cat: "Utilities", desc: "Electricity, LPG, Water & Fiber", amt: 6200, day: 12, pay: "UPI" },
    { cat: "Transport", desc: "Family Car Fuel & School Van Fee", amt: 7200, day: 15, pay: "Credit Card" },
    { cat: "Healthcare", desc: "Pediatric Checkup & Monthly Medicines", amt: 4800, day: 21, pay: "Debit Card" }
  ];
  sunitaExpenses.forEach((se, idx) => {
    expenses.push({
      id: `exp_sunita_sep_${idx}`,
      user_id: userSunita.id,
      amount: se.amt,
      category: se.cat,
      description: se.desc,
      date: `2026-09-${se.day.toString().padStart(2, "0")}`,
      payment_method: se.pay,
      created_at: now
    });
  });
  savings_goals.push({
    id: "goal_sunita_reno",
    user_id: userSunita.id,
    name: "Home Renovation & Rain-Day Reserve",
    target_amount: 4e5,
    current_amount: 21e4,
    target_date: "2027-05-31",
    monthly_contribution: 2e4,
    icon: "Home",
    created_at: "2026-01-01T00:00:00.000Z",
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
var FinanceDatabase = class {
  constructor() {
    this.data = this.loadOrSeed();
  }
  loadOrSeed() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, "utf-8");
        return JSON.parse(raw);
      }
    } catch (err) {
      console.warn("Could not read existing database file, reseeding:", err);
    }
    const seeded = generateSeedData();
    this.save(seeded);
    return seeded;
  }
  save(dataToSave) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(dataToSave || this.data, null, 2), "utf-8");
    } catch (err) {
      console.error("Failed to persist database to disk:", err);
    }
  }
  resetDemoData() {
    this.data = generateSeedData();
    this.save();
    return this.data;
  }
  getUsers() {
    return this.data.users;
  }
  getUserById(id) {
    return this.data.users.find((u) => u.id === id);
  }
  getUserByEmail(email) {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }
  createUser(userData) {
    const newUser = {
      id: `user_${Date.now()}_${crypto.randomBytes(3).toString("hex")}`,
      ...userData,
      created_at: (/* @__PURE__ */ new Date()).toISOString(),
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.data.users.push(newUser);
    this.save();
    return newUser;
  }
  updateUser(userId, partial) {
    const idx = this.data.users.findIndex((u) => u.id === userId);
    if (idx === -1) return void 0;
    this.data.users[idx] = {
      ...this.data.users[idx],
      ...partial,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.save();
    return this.data.users[idx];
  }
  // Incomes
  getIncomes(userId) {
    return this.data.incomes.filter((i) => i.user_id === userId).sort((a, b) => b.date.localeCompare(a.date));
  }
  addIncome(userId, data) {
    const newInc = {
      id: `inc_${Date.now()}_${crypto.randomBytes(3).toString("hex")}`,
      user_id: userId,
      ...data,
      amount: round2(Number(data.amount)),
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.data.incomes.push(newInc);
    this.save();
    return newInc;
  }
  updateIncome(userId, incomeId, partial) {
    const idx = this.data.incomes.findIndex((i) => i.id === incomeId && i.user_id === userId);
    if (idx === -1) return void 0;
    if (partial.amount !== void 0) partial.amount = round2(Number(partial.amount));
    this.data.incomes[idx] = { ...this.data.incomes[idx], ...partial };
    this.save();
    return this.data.incomes[idx];
  }
  deleteIncome(userId, incomeId) {
    const lenBefore = this.data.incomes.length;
    this.data.incomes = this.data.incomes.filter((i) => !(i.id === incomeId && i.user_id === userId));
    const changed = this.data.incomes.length !== lenBefore;
    if (changed) this.save();
    return changed;
  }
  // Expenses
  getExpenses(userId) {
    return this.data.expenses.filter((e) => e.user_id === userId).sort((a, b) => b.date.localeCompare(a.date));
  }
  addExpense(userId, data) {
    const newExp = {
      id: `exp_${Date.now()}_${crypto.randomBytes(3).toString("hex")}`,
      user_id: userId,
      ...data,
      amount: round2(Number(data.amount)),
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.data.expenses.push(newExp);
    this.checkBudgetAlerts(userId, newExp.category);
    this.save();
    return newExp;
  }
  updateExpense(userId, expenseId, partial) {
    const idx = this.data.expenses.findIndex((e) => e.id === expenseId && e.user_id === userId);
    if (idx === -1) return void 0;
    if (partial.amount !== void 0) partial.amount = round2(Number(partial.amount));
    this.data.expenses[idx] = { ...this.data.expenses[idx], ...partial };
    this.save();
    return this.data.expenses[idx];
  }
  deleteExpense(userId, expenseId) {
    const lenBefore = this.data.expenses.length;
    this.data.expenses = this.data.expenses.filter((e) => !(e.id === expenseId && e.user_id === userId));
    const changed = this.data.expenses.length !== lenBefore;
    if (changed) this.save();
    return changed;
  }
  // Budgets
  getBudgets(userId, month, year) {
    return this.data.budgets.filter((b) => {
      if (b.user_id !== userId) return false;
      if (month !== void 0 && b.month !== month) return false;
      if (year !== void 0 && b.year !== year) return false;
      return true;
    });
  }
  setBudget(userId, category, limit, month, year) {
    const existing = this.data.budgets.find((b) => b.user_id === userId && b.category === category && b.month === month && b.year === year);
    if (existing) {
      existing.limit_amount = round2(Number(limit));
      existing.updated_at = (/* @__PURE__ */ new Date()).toISOString();
      this.save();
      return existing;
    }
    const newBudget = {
      id: `bgt_${Date.now()}_${crypto.randomBytes(2).toString("hex")}`,
      user_id: userId,
      month,
      year,
      category,
      limit_amount: round2(Number(limit)),
      created_at: (/* @__PURE__ */ new Date()).toISOString(),
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.data.budgets.push(newBudget);
    this.save();
    return newBudget;
  }
  deleteBudget(userId, budgetId) {
    const before = this.data.budgets.length;
    this.data.budgets = this.data.budgets.filter((b) => !(b.id === budgetId && b.user_id === userId));
    const changed = this.data.budgets.length !== before;
    if (changed) this.save();
    return changed;
  }
  // Savings Goals
  getSavingsGoals(userId) {
    return this.data.savings_goals.filter((g) => g.user_id === userId);
  }
  addSavingsGoal(userId, data) {
    const newGoal = {
      id: `goal_${Date.now()}_${crypto.randomBytes(3).toString("hex")}`,
      user_id: userId,
      ...data,
      target_amount: round2(Number(data.target_amount)),
      current_amount: round2(Number(data.current_amount || 0)),
      monthly_contribution: round2(Number(data.monthly_contribution || 0)),
      created_at: (/* @__PURE__ */ new Date()).toISOString(),
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.data.savings_goals.push(newGoal);
    this.save();
    return newGoal;
  }
  updateSavingsGoal(userId, goalId, partial) {
    const idx = this.data.savings_goals.findIndex((g) => g.id === goalId && g.user_id === userId);
    if (idx === -1) return void 0;
    if (partial.target_amount !== void 0) partial.target_amount = round2(Number(partial.target_amount));
    if (partial.current_amount !== void 0) partial.current_amount = round2(Number(partial.current_amount));
    this.data.savings_goals[idx] = {
      ...this.data.savings_goals[idx],
      ...partial,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.save();
    return this.data.savings_goals[idx];
  }
  contributeToGoal(userId, goalId, amount) {
    const goal = this.data.savings_goals.find((g) => g.id === goalId && g.user_id === userId);
    if (!goal) return void 0;
    goal.current_amount = round2(goal.current_amount + Number(amount));
    goal.updated_at = (/* @__PURE__ */ new Date()).toISOString();
    if (goal.current_amount >= goal.target_amount) {
      this.addNotification(userId, {
        title: `Goal Accomplished: ${goal.name}!`,
        message: `Congratulations! You reached 100% of your target amount (\u20B9${goal.target_amount.toLocaleString()})!`,
        type: "savings"
      });
    }
    this.save();
    return goal;
  }
  deleteSavingsGoal(userId, goalId) {
    const before = this.data.savings_goals.length;
    this.data.savings_goals = this.data.savings_goals.filter((g) => !(g.id === goalId && g.user_id === userId));
    const changed = this.data.savings_goals.length !== before;
    if (changed) this.save();
    return changed;
  }
  // Notifications
  getNotifications(userId) {
    return this.data.notifications.filter((n) => n.user_id === userId).sort((a, b) => b.created_at.localeCompare(a.created_at));
  }
  addNotification(userId, data) {
    const notif = {
      id: `notif_${Date.now()}_${crypto.randomBytes(2).toString("hex")}`,
      user_id: userId,
      ...data,
      is_read: false,
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.data.notifications.unshift(notif);
    this.save();
    return notif;
  }
  markNotificationRead(userId, notifId) {
    const notif = this.data.notifications.find((n) => n.id === notifId && n.user_id === userId);
    if (notif) {
      notif.is_read = true;
      this.save();
      return true;
    }
    return false;
  }
  markAllNotificationsRead(userId) {
    let count = 0;
    this.data.notifications.forEach((n) => {
      if (n.user_id === userId && !n.is_read) {
        n.is_read = true;
        count++;
      }
    });
    if (count > 0) this.save();
    return count;
  }
  // AI Chat
  getConversation(userId) {
    let conv = this.data.conversations.find((c) => c.user_id === userId);
    if (!conv) {
      conv = {
        id: `conv_${userId}`,
        user_id: userId,
        title: "Financial Planning & Strategy",
        created_at: (/* @__PURE__ */ new Date()).toISOString(),
        updated_at: (/* @__PURE__ */ new Date()).toISOString(),
        messages: [
          {
            id: `msg_welcome_${Date.now()}`,
            role: "assistant",
            content: `Hello! I am your **FinAdvisor AI** personal financial assistant. 

I have direct access to your verified income records, category spending, active budgets, and savings goals for this period. 

How can I help you today? You can ask:
- *"Where am I overspending this month?"*
- *"How can I save \u20B95,000 this month?"*
- *"Create a balanced budget recommendation based on my income"*
- *"How fast can I reach my emergency fund goal?"*`,
            created_at: (/* @__PURE__ */ new Date()).toISOString(),
            suggested_actions: [
              "Where am I overspending?",
              "How can I save \u20B95,000 this month?",
              "Analyze my spending this month",
              "Create a budget for me"
            ]
          }
        ]
      };
      this.data.conversations.push(conv);
      this.save();
    }
    return conv;
  }
  addChatMessage(userId, role, content, suggested_actions) {
    const conv = this.getConversation(userId);
    const msg = {
      id: `msg_${Date.now()}_${crypto.randomBytes(2).toString("hex")}`,
      role,
      content,
      created_at: (/* @__PURE__ */ new Date()).toISOString(),
      suggested_actions
    };
    conv.messages.push(msg);
    conv.updated_at = (/* @__PURE__ */ new Date()).toISOString();
    this.save();
    return msg;
  }
  checkBudgetAlerts(userId, category) {
    const now = /* @__PURE__ */ new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    const budget = this.data.budgets.find((b) => b.user_id === userId && b.category === category && b.month === currentMonth && b.year === currentYear);
    if (!budget) return;
    const startStr = `${currentYear}-${currentMonth.toString().padStart(2, "0")}-01`;
    const endStr = `${currentYear}-${currentMonth.toString().padStart(2, "0")}-31`;
    const spent = this.data.expenses.filter((e) => e.user_id === userId && e.category === category && e.date >= startStr && e.date <= endStr).reduce((sum, e) => sum + e.amount, 0);
    const ratio = spent / budget.limit_amount;
    if (ratio >= 1) {
      this.addNotification(userId, {
        title: `${category} budget exceeded`,
        message: `Your spending on ${category} (\u20B9${spent.toLocaleString()}) has exceeded your limit of \u20B9${budget.limit_amount.toLocaleString()}.`,
        type: "budget"
      });
    } else if (ratio >= 0.85) {
      this.addNotification(userId, {
        title: `${category} budget is ${Math.round(ratio * 100)}% used`,
        message: `You have used \u20B9${spent.toLocaleString()} of your \u20B9${budget.limit_amount.toLocaleString()} limit for ${category}.`,
        type: "budget"
      });
    }
  }
  // Dashboard Aggregator
  getDashboardData(userId, targetMonth = 9, targetYear = 2026) {
    const user = this.getUserById(userId) || this.data.users[0];
    const monthStr = targetMonth.toString().padStart(2, "0");
    const startOfMonth = `${targetYear}-${monthStr}-01`;
    const endOfMonth = `${targetYear}-${monthStr}-31`;
    const prevMonthDate = new Date(targetYear, targetMonth - 2, 1);
    const prevMonth = prevMonthDate.getMonth() + 1;
    const prevYear = prevMonthDate.getFullYear();
    const prevMonthStr = prevMonth.toString().padStart(2, "0");
    const prevStartOfMonth = `${prevYear}-${prevMonthStr}-01`;
    const prevEndOfMonth = `${prevYear}-${prevMonthStr}-31`;
    const curIncomes = this.data.incomes.filter((i) => i.user_id === userId && i.date >= startOfMonth && i.date <= endOfMonth);
    const curExpenses = this.data.expenses.filter((e) => e.user_id === userId && e.date >= startOfMonth && e.date <= endOfMonth);
    const prevIncomes = this.data.incomes.filter((i) => i.user_id === userId && i.date >= prevStartOfMonth && i.date <= prevEndOfMonth);
    const prevExpenses = this.data.expenses.filter((e) => e.user_id === userId && e.date >= prevStartOfMonth && e.date <= prevEndOfMonth);
    const total_income = round2(curIncomes.reduce((acc, i) => acc + i.amount, 0));
    const total_expenses = round2(curExpenses.reduce((acc, e) => acc + e.amount, 0));
    const total_savings = round2(total_income - total_expenses);
    const savings_rate = total_income > 0 ? round2(total_savings / total_income * 100) : 0;
    const prev_income = round2(prevIncomes.reduce((acc, i) => acc + i.amount, 0));
    const prev_expenses = round2(prevExpenses.reduce((acc, e) => acc + e.amount, 0));
    const prev_savings = round2(prev_income - prev_expenses);
    const prev_savings_rate = prev_income > 0 ? round2(prev_savings / prev_income * 100) : 0;
    const income_growth_pct = prev_income > 0 ? round2((total_income - prev_income) / prev_income * 100) : 0;
    const expense_growth_pct = prev_expenses > 0 ? round2((total_expenses - prev_expenses) / prev_expenses * 100) : 0;
    const savings_growth_pct = prev_savings > 0 ? round2((total_savings - prev_savings) / prev_savings * 100) : 0;
    const monthly_trend = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(targetYear, targetMonth - 1 - i, 1);
      const mNum = d.getMonth() + 1;
      const yNum = d.getFullYear();
      const mCode = mNum.toString().padStart(2, "0");
      const s = `${yNum}-${mCode}-01`;
      const e = `${yNum}-${mCode}-31`;
      const mInc = this.data.incomes.filter((inc) => inc.user_id === userId && inc.date >= s && inc.date <= e).reduce((a, b) => a + b.amount, 0);
      const mExp = this.data.expenses.filter((exp) => exp.user_id === userId && exp.date >= s && exp.date <= e).reduce((a, b) => a + b.amount, 0);
      const mSav = round2(mInc - mExp);
      monthly_trend.push({
        month: d.toLocaleString("default", { month: "short" }),
        month_num: mNum,
        year: yNum,
        income: round2(mInc),
        expenses: round2(mExp),
        savings: mSav
      });
    }
    const catMap = {};
    curExpenses.forEach((exp) => {
      catMap[exp.category] = (catMap[exp.category] || 0) + exp.amount;
    });
    const expense_breakdown = Object.entries(catMap).map(([cat, amt]) => {
      const category = cat;
      const percentage = total_expenses > 0 ? round2(amt / total_expenses * 100) : 0;
      return {
        category,
        amount: round2(amt),
        percentage,
        color: CATEGORY_COLORS[category] || "#64748B"
      };
    }).sort((a, b) => b.amount - a.amount);
    const curBudgets = this.data.budgets.filter((b) => b.user_id === userId && b.month === targetMonth && b.year === targetYear);
    const budget_utilization = curBudgets.map((b) => {
      const spent = round2(catMap[b.category] || 0);
      const remaining = round2(b.limit_amount - spent);
      const pct = b.limit_amount > 0 ? round2(spent / b.limit_amount * 100) : 0;
      let status = "normal";
      if (pct > 100) status = "exceeded";
      else if (pct >= 90) status = "near_limit";
      else if (pct >= 70) status = "warning";
      return {
        category: b.category,
        limit: b.limit_amount,
        spent,
        remaining,
        percentage: pct,
        status
      };
    }).sort((a, b) => b.percentage - a.percentage);
    const savings_goals = this.data.savings_goals.filter((g) => g.user_id === userId);
    const ai_insights = [];
    const foodSpent = catMap["Food"] || 0;
    const foodBudget = curBudgets.find((b) => b.category === "Food")?.limit_amount;
    if (foodBudget && foodSpent > foodBudget) {
      ai_insights.push({
        id: "ins_food_over",
        category: "Food & Dining",
        icon: "AlertCircle",
        title: "Dining Budget Exceeded",
        text: `You have spent \u20B9${foodSpent.toLocaleString()} on dining, which is ${Math.round(foodSpent / foodBudget * 100)}% of your planned limit.`,
        suggested_action: "Reduce discretionary takeout this weekend",
        action_type: "budget",
        urgency: "warning"
      });
    }
    if (savings_rate >= 25) {
      ai_insights.push({
        id: "ins_savings_high",
        category: "Savings Pace",
        icon: "TrendingUp",
        title: "Strong Savings Rate",
        text: `Your current savings rate of ${savings_rate}% exceeds the typical 20% benchmark by +${round2(savings_rate - 20)}%.`,
        suggested_action: "Allocate surplus to Emergency Fund",
        action_type: "savings",
        urgency: "positive"
      });
    } else {
      ai_insights.push({
        id: "ins_savings_boost",
        category: "Savings Opportunity",
        icon: "Compass",
        title: "Elevate Monthly Savings",
        text: `Trimming discretionary subscriptions and transport by \u20B91,500 would lift your savings rate to ${round2((total_savings + 1500) / (total_income || 1) * 100)}%.`,
        suggested_action: "Review recurring subscriptions",
        action_type: "expense",
        urgency: "normal"
      });
    }
    const primaryGoal = savings_goals[0];
    if (primaryGoal && primaryGoal.target_amount > primaryGoal.current_amount) {
      const remainingAmount = primaryGoal.target_amount - primaryGoal.current_amount;
      const monthsNeeded = primaryGoal.monthly_contribution > 0 ? Math.ceil(remainingAmount / primaryGoal.monthly_contribution) : 12;
      ai_insights.push({
        id: "ins_goal_proj",
        category: "Goal Projections",
        icon: "Target",
        title: `${primaryGoal.name} Projection`,
        text: `At your current monthly pace of \u20B9${primaryGoal.monthly_contribution.toLocaleString()}, you will reach your target in approximately ${monthsNeeded} months.`,
        suggested_action: "Boost monthly contribution by \u20B91,000",
        action_type: "savings",
        urgency: "normal"
      });
    }
    const recent_incomes = curIncomes.map((i) => ({
      id: i.id,
      type: "income",
      amount: i.amount,
      categoryOrSource: i.source,
      description: i.description,
      date: i.date,
      paymentMethodOrType: i.income_type
    }));
    const recent_expenses = curExpenses.map((e) => ({
      id: e.id,
      type: "expense",
      amount: e.amount,
      categoryOrSource: e.category,
      description: e.description,
      date: e.date,
      paymentMethodOrType: e.payment_method,
      notes: e.notes
    }));
    const recent_transactions = [...recent_incomes, ...recent_expenses].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8);
    let healthPoints = 0;
    const srPoints = Math.min(30, Math.max(0, Math.round(savings_rate / 35 * 30)));
    const overBudgetCats = budget_utilization.filter((b) => b.percentage > 100).length;
    const baPoints = Math.max(0, 30 - overBudgetCats * 10);
    const gpPoints = savings_goals.length > 0 ? Math.min(20, Math.round(savings_goals[0].current_amount / (savings_goals[0].target_amount || 1) * 20)) : 10;
    const ecPoints = total_expenses <= total_income ? 18 : 6;
    healthPoints = Math.min(100, Math.max(10, srPoints + baPoints + gpPoints + ecPoints));
    const health_score = {
      score: healthPoints,
      rating: healthPoints >= 80 ? "Excellent" : healthPoints >= 65 ? "Good" : healthPoints >= 50 ? "Fair" : "Needs Attention",
      explanation: `Your financial health score is ${healthPoints}/100. Your savings rate (${savings_rate}%) is healthy, and ${budget_utilization.length - overBudgetCats} of ${budget_utilization.length || 1} budgets are in good standing.`,
      breakdown: [
        { factor: "Savings Rate", score: srPoints, max: 30, status: srPoints >= 20 ? "good" : "fair", recommendation: "Target a 30%+ savings rate consistently" },
        { factor: "Budget Adherence", score: baPoints, max: 30, status: baPoints >= 20 ? "good" : "fair", recommendation: "Keep all discretionary categories under 90%" },
        { factor: "Goal Milestones", score: gpPoints, max: 20, status: gpPoints >= 12 ? "good" : "fair", recommendation: "Maintain regular monthly contributions" },
        { factor: "Spending Stability", score: ecPoints, max: 20, status: ecPoints >= 15 ? "good" : "fair", recommendation: "Keep expenses well below total cashflow" }
      ]
    };
    const monthName = new Date(targetYear, targetMonth - 1).toLocaleString("default", { month: "long" });
    const topCat = expense_breakdown[0]?.category || "Housing";
    const topCatAmt = expense_breakdown[0]?.amount || 0;
    const monthly_summary = {
      period: `${monthName} ${targetYear}`,
      income: total_income,
      expenses: total_expenses,
      savings: total_savings,
      savings_rate,
      summary: `In ${monthName} ${targetYear}, you accumulated \u20B9${total_income.toLocaleString()} in inflows and spent \u20B9${total_expenses.toLocaleString()}, leaving \u20B9${total_savings.toLocaleString()} in net savings. ${topCat} was your largest category at \u20B9${topCatAmt.toLocaleString()} (${expense_breakdown[0]?.percentage || 0}%).`,
      focus_items: [
        "1. Monitor and curb discretionary dining expenses before weekends.",
        "2. Continue automating \u20B97,000 monthly toward your Emergency Fund.",
        "3. Review recurring subscriptions to eliminate unused streaming or cloud services."
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
};
var db = new FinanceDatabase();

// src/server/aiService.ts
import { GoogleGenAI } from "@google/genai";
var apiKey = process.env.GEMINI_API_KEY;
var aiClient = null;
if (apiKey && apiKey.trim().length > 0) {
  try {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
  } catch (err) {
    console.error("Failed to initialize GoogleGenAI client:", err);
  }
}
async function askFinAdvisor(userId, userMessage) {
  const dashData = db.getDashboardData(userId);
  const user = dashData.user;
  const contextSummary = {
    user_name: user.name,
    persona_type: user.user_type,
    currency: user.currency,
    monthly_inflow: dashData.kpis.total_income,
    monthly_outflow: dashData.kpis.total_expenses,
    net_savings: dashData.kpis.total_savings,
    savings_rate: `${dashData.kpis.savings_rate}%`,
    top_expenses: dashData.expense_breakdown.slice(0, 5).map((e) => `${e.category}: \u20B9${e.amount} (${e.percentage}%)`),
    budget_statuses: dashData.budget_utilization.map((b) => `${b.category}: Spent \u20B9${b.spent} of \u20B9${b.limit} (${b.percentage}%) - ${b.status}`),
    savings_goals: dashData.savings_goals.map((g) => `${g.name}: \u20B9${g.current_amount} of \u20B9${g.target_amount} (Target: ${g.target_date})`)
  };
  const systemInstruction = `You are "FinAdvisor AI", an intelligent, empathetic, and data-driven personal financial planning assistant for ${user.name}.
You provide educational personal finance analysis, budgeting guidance, and savings habits.

SAFETY & ACCURACY RULES:
1. You are a financial planning assistant, NOT a licensed financial advisor. Include a brief, polite educational disclaimer where appropriate.
2. Ground all answers strictly in the user's provided financial numbers:
   - Monthly Inflow: \u20B9${contextSummary.monthly_inflow}
   - Monthly Outflow: \u20B9${contextSummary.monthly_outflow}
   - Savings Rate: ${contextSummary.savings_rate}
   - Persona: ${contextSummary.persona_type}
3. Never promise guaranteed investment returns. Distinguish verified facts from estimates.
4. Use clean Markdown formatting, bullet points, and the currency symbol (\u20B9).
5. Explain your calculations clearly and offer 2-3 specific, actionable steps tailored to their ${contextSummary.persona_type} profile.
6. Keep tone professional, calm, encouraging, and clear.`;
  if (aiClient) {
    try {
      const response = await aiClient.models.generateContent({
        model: "gemini-3.8-flash",
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `User's current financial profile:
${JSON.stringify(contextSummary, null, 2)}

User asked: "${userMessage}"`
              }
            ]
          }
        ],
        config: {
          systemInstruction,
          temperature: 0.7
        }
      });
      const responseText = response.text;
      if (responseText && responseText.trim().length > 0) {
        return responseText.trim();
      }
    } catch (err) {
      console.warn("Gemini API call failed, falling back to local financial engine:", err);
    }
  }
  return generateIntelligentFinancialResponse(userMessage, dashData);
}
async function generateAIBudget(userId) {
  const dashData = db.getDashboardData(userId);
  const income = dashData.kpis.total_income || 6e4;
  const userType = dashData.user.user_type;
  let ratios = [];
  if (userType === "student") {
    ratios = [
      { category: "Food", pct: 0.35, reason: "Mess fees, healthy groceries, and canteen meals" },
      { category: "Education", pct: 0.18, reason: "Books, course materials, stationery, and printing" },
      { category: "Transport", pct: 0.1, reason: "Public transport, student transit passes, and rickshaw" },
      { category: "Utilities", pct: 0.07, reason: "Mobile data, student broadband, and hostel charges" },
      { category: "Entertainment", pct: 0.12, reason: "College activities, social gatherings, and hobbies" },
      { category: "Shopping", pct: 0.08, reason: "Clothing, personal care, and emergency purchases" },
      { category: "Other", pct: 0.1, reason: "Buffer for unforeseen academic or living needs" }
    ];
  } else if (userType === "freelancer") {
    ratios = [
      { category: "Housing", pct: 0.22, reason: "Home studio and residential workspace allocation" },
      { category: "Subscriptions", pct: 0.08, reason: "Design/dev software, cloud services, and domains" },
      { category: "Food", pct: 0.12, reason: "Nutritious cooking and occasional client meeting lunches" },
      { category: "Utilities", pct: 0.06, reason: "High-speed redundant internet and workspace electricity" },
      { category: "Healthcare", pct: 0.07, reason: "Independent health & accidental insurance coverage" },
      { category: "Transport", pct: 0.05, reason: "Commuting to clients and co-working hubs" },
      { category: "Entertainment", pct: 0.05, reason: "Work-life balance and creative refreshment" },
      { category: "Other", pct: 0.05, reason: "Buffer for variable client delays or equipment upkeep" }
    ];
  } else if (userType === "household") {
    ratios = [
      { category: "Housing", pct: 0.25, reason: "Home mortgage/rent and apartment society maintenance" },
      { category: "Food", pct: 0.2, reason: "Family groceries, dairy, produce, and staple kitchen supplies" },
      { category: "Education", pct: 0.16, reason: "Children school tuition, coaching, and extracurriculars" },
      { category: "Utilities", pct: 0.07, reason: "Electricity, piped LPG, water, and family broadband" },
      { category: "Transport", pct: 0.08, reason: "Family vehicle fuel, maintenance, and transit passes" },
      { category: "Healthcare", pct: 0.06, reason: "Family health insurance premiums and prescriptions" },
      { category: "Other", pct: 0.06, reason: "Household emergency buffer and repair contingencies" }
    ];
  } else {
    ratios = [
      { category: "Housing", pct: 0.25, reason: "Rent/housing costs kept within standard healthy 25-30% range" },
      { category: "Food", pct: 0.1, reason: "Balanced weekly groceries and mindful discretionary dining" },
      { category: "Transport", pct: 0.06, reason: "Daily commute, metro card, and vehicle fuel" },
      { category: "Shopping", pct: 0.06, reason: "Personal wardrobe, tech gadgets, and lifestyle items" },
      { category: "Utilities", pct: 0.05, reason: "Power, water, mobile and high-speed broadband" },
      { category: "Education", pct: 0.04, reason: "Professional upskilling, certifications, and reading" },
      { category: "Healthcare", pct: 0.03, reason: "Preventative care, gym membership, and wellness" },
      { category: "Entertainment", pct: 0.04, reason: "Weekend movies, events, and leisure activities" },
      { category: "Subscriptions", pct: 0.02, reason: "Essential media streaming and cloud storage" },
      { category: "Other", pct: 0.05, reason: "Discretionary buffer and miscellaneous expenses" }
    ];
  }
  return ratios.map((r) => ({
    category: r.category,
    recommended_limit: Math.round(income * r.pct / 100) * 100,
    percentage_of_income: Math.round(r.pct * 100),
    reasoning: r.reason
  }));
}
function generateIntelligentFinancialResponse(message, dashData) {
  const q = message.toLowerCase();
  const kpis = dashData.kpis;
  const user = dashData.user;
  const foodBudget = dashData.budget_utilization.find((b) => b.category === "Food");
  const primaryGoal = dashData.savings_goals[0];
  if (q.includes("overspend") || q.includes("where am i spending") || q.includes("spending too much")) {
    const exceeded = dashData.budget_utilization.filter((b) => b.percentage > 90);
    if (exceeded.length > 0) {
      const list = exceeded.map((e) => `- **${e.category}**: \u20B9${e.spent.toLocaleString()} spent of \u20B9${e.limit.toLocaleString()} (${e.percentage}% utilized)`).join("\n");
      return `### Spending Alert Analysis for ${dashData.period.label}:

You have **${exceeded.length} category/categories** operating near or above your planned thresholds:

${list}

**Actionable Steps to Regain Balance:**
1. **Pause non-essential transactions** in ${exceeded[0]?.category} for the remaining days of this month.
2. Consider transferring a temporary \u20B91,000 buffer from categories with surplus room (such as *Education* or *Other*).
3. Set up weekly milestone checkpoints so discretionary purchases don't accumulate all at once.

*Note: FinAdvisor AI provides educational planning calculations; consult a qualified advisor for personalized legal or investment guidance.*`;
    } else {
      return `### Excellent Budget Discipline!

None of your tracked categories have exceeded their monthly thresholds in **${dashData.period.label}**. 

- **Total Inflow**: \u20B9${kpis.total_income.toLocaleString()}
- **Total Spent**: \u20B9${kpis.total_expenses.toLocaleString()} (${Math.round(kpis.total_expenses / (kpis.total_income || 1) * 100)}% of income)
- **Net Savings**: \u20B9${kpis.total_savings.toLocaleString()} (**${kpis.savings_rate}% savings rate**)

You have preserved a healthy cushion. Keep maintaining this pace to reach your **${primaryGoal?.name || "savings"}** milestone ahead of schedule!`;
    }
  }
  if (q.includes("save") && (q.includes("5000") || q.includes("5,000") || q.includes("more"))) {
    return `### Action Plan: How to Save an Extra \u20B95,000 This Month

Based on your verified spending breakdown of \u20B9${kpis.total_expenses.toLocaleString()}:

1. **Dining & Food Delivery (-\u20B92,200)**:
   - Your Food spending currently stands at \u20B9${foodBudget?.spent.toLocaleString() || "6,240"}. Cooking 2 extra meals per week at home frees up ~\u20B92,200 effortlessly.
2. **Subscription Audit (-\u20B9800)**:
   - Review your recurring streaming and cloud storage services to pause duplicate entertainment packages.
3. **Discretionary Shopping (-\u20B92,000)**:
   - Enforce a 48-hour cool-off rule for non-essential impulse items in your cart.

**Outcome**:
Accumulating this extra \u20B95,000 would elevate your monthly savings rate from **${kpis.savings_rate}%** to **${Math.round((kpis.total_savings + 5e3) / (kpis.total_income || 1) * 100)}%**, accelerating your goal completion by approximately 1.5 months!`;
  }
  if (q.includes("emergency") || q.includes("goal")) {
    if (primaryGoal) {
      const remaining = primaryGoal.target_amount - primaryGoal.current_amount;
      const months = primaryGoal.monthly_contribution > 0 ? Math.ceil(remaining / primaryGoal.monthly_contribution) : 10;
      return `### Progress on Your ${primaryGoal.name}

- **Target Amount**: \u20B9${primaryGoal.target_amount.toLocaleString()}
- **Current Reserves**: \u20B9${primaryGoal.current_amount.toLocaleString()} (${Math.round(primaryGoal.current_amount / primaryGoal.target_amount * 100)}% complete)
- **Remaining Gap**: \u20B9${remaining.toLocaleString()}
- **Current Monthly Pace**: \u20B9${primaryGoal.monthly_contribution.toLocaleString()} / month

**Estimated Completion**: Approximately **${months} months** (Target: ${primaryGoal.target_date}).

**Pro-Tip**:
If you allocate 25% of your current monthly surplus (\u20B9${Math.round(kpis.total_savings * 0.25).toLocaleString()}) to this goal, you will shave **2 full months** off your timeline!`;
    }
  }
  return `### Financial Overview for ${user.name} (${dashData.period.label})

Here is your synthesized financial position:
- **Total Inflow**: \u20B9${kpis.total_income.toLocaleString()}
- **Total Expenses**: \u20B9${kpis.total_expenses.toLocaleString()}
- **Net Savings**: \u20B9${kpis.total_savings.toLocaleString()}
- **Savings Rate**: **${kpis.savings_rate}%** (Benchmark: 20-30%)
- **Financial Health Score**: **${dashData.health_score.score}/100** (${dashData.health_score.rating})

**Top Spending Drivers**:
${dashData.expense_breakdown.slice(0, 3).map((e) => `- **${e.category}**: \u20B9${e.amount.toLocaleString()} (${e.percentage}%)`).join("\n")}

**Recommendations for You**:
1. Keep housing & fixed utilities below 30% of total cashflow.
2. Maintain your regular automated contribution toward your savings goals.
3. Check your weekly category budget trackers to prevent late-month overruns.

What specific area would you like to explore deeper? You can ask about budgeting, expense reduction, or goal planning.`;
}

// server.ts
dotenv.config();
var app = express();
var PORT = Number(process.env.PORT) || 3e3;
var isProduction = process.env.NODE_ENV === "production";
app.use(cors());
app.use(express.json());
function resolveUserId(req) {
  const fromHeader = req.headers["x-user-id"];
  const fromQuery = req.query.userId;
  const fromBody = req.body?.userId;
  const targetId = fromHeader || fromQuery || fromBody;
  if (targetId && db.getUserById(targetId)) {
    return targetId;
  }
  return "user_alex";
}
app.post("/api/auth/login", (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }
  const user = db.getUserByEmail(email);
  if (!user) {
    return res.status(404).json({ error: "User not found. Try one of our demo accounts or register." });
  }
  return res.json({ user, token: `token_${user.id}` });
});
app.post("/api/auth/register", (req, res) => {
  const { name, email, user_type = "salaried", monthly_income = 5e4, primary_goal, currency = "INR" } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }
  const existing = db.getUserByEmail(email);
  if (existing) {
    return res.status(409).json({ error: "An account with this email already exists." });
  }
  const newUser = db.createUser({
    name,
    email,
    user_type,
    monthly_income: Number(monthly_income) || 5e4,
    primary_goal,
    currency
  });
  return res.status(201).json({ user: newUser, token: `token_${newUser.id}` });
});
app.get("/api/auth/me", (req, res) => {
  const userId = resolveUserId(req);
  const user = db.getUserById(userId);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  return res.json({ user });
});
app.put("/api/auth/profile", (req, res) => {
  const userId = resolveUserId(req);
  const updated = db.updateUser(userId, req.body);
  if (!updated) {
    return res.status(404).json({ error: "User not found" });
  }
  return res.json({ user: updated });
});
app.post("/api/auth/switch-demo", (req, res) => {
  const { personaId } = req.body;
  const targetUserId = `user_${personaId}`;
  const user = db.getUserById(targetUserId);
  if (!user) {
    return res.status(404).json({ error: "Demo persona not found" });
  }
  return res.json({ user, token: `token_${user.id}` });
});
app.get("/api/dashboard", (req, res) => {
  const userId = resolveUserId(req);
  const month = Number(req.query.month) || 9;
  const year = Number(req.query.year) || 2026;
  const dashboard = db.getDashboardData(userId, month, year);
  return res.json(dashboard);
});
app.get("/api/income", (req, res) => {
  const userId = resolveUserId(req);
  const incomes = db.getIncomes(userId);
  return res.json({ incomes });
});
app.post("/api/income", (req, res) => {
  const userId = resolveUserId(req);
  const { amount, source, income_type = "salary", date, description } = req.body;
  if (!amount || !source || !date) {
    return res.status(400).json({ error: "Amount, source, and date are required" });
  }
  const income = db.addIncome(userId, {
    amount: Number(amount),
    source,
    income_type,
    date,
    description: description || source
  });
  return res.status(201).json({ income });
});
app.put("/api/income/:id", (req, res) => {
  const userId = resolveUserId(req);
  const updated = db.updateIncome(userId, req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: "Income record not found" });
  return res.json({ income: updated });
});
app.delete("/api/income/:id", (req, res) => {
  const userId = resolveUserId(req);
  const success = db.deleteIncome(userId, req.params.id);
  if (!success) return res.status(404).json({ error: "Income record not found" });
  return res.json({ success: true });
});
app.get("/api/expenses", (req, res) => {
  const userId = resolveUserId(req);
  const expenses = db.getExpenses(userId);
  return res.json({ expenses });
});
app.post("/api/expenses", (req, res) => {
  const userId = resolveUserId(req);
  const { amount, category, description, date, payment_method = "UPI", notes } = req.body;
  if (!amount || !category || !description || !date) {
    return res.status(400).json({ error: "Amount, category, description, and date are required" });
  }
  const expense = db.addExpense(userId, {
    amount: Number(amount),
    category,
    description,
    date,
    payment_method,
    notes
  });
  return res.status(201).json({ expense });
});
app.put("/api/expenses/:id", (req, res) => {
  const userId = resolveUserId(req);
  const updated = db.updateExpense(userId, req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: "Expense record not found" });
  return res.json({ expense: updated });
});
app.delete("/api/expenses/:id", (req, res) => {
  const userId = resolveUserId(req);
  const success = db.deleteExpense(userId, req.params.id);
  if (!success) return res.status(404).json({ error: "Expense record not found" });
  return res.json({ success: true });
});
app.get("/api/budgets", (req, res) => {
  const userId = resolveUserId(req);
  const month = Number(req.query.month) || 9;
  const year = Number(req.query.year) || 2026;
  const budgets = db.getBudgets(userId, month, year);
  return res.json({ budgets });
});
app.post("/api/budgets", (req, res) => {
  const userId = resolveUserId(req);
  const { category, limit_amount, month = 9, year = 2026 } = req.body;
  if (!category || limit_amount === void 0) {
    return res.status(400).json({ error: "Category and limit_amount are required" });
  }
  const budget = db.setBudget(
    userId,
    category,
    Number(limit_amount),
    Number(month),
    Number(year)
  );
  return res.status(201).json({ budget });
});
app.delete("/api/budgets/:id", (req, res) => {
  const userId = resolveUserId(req);
  const success = db.deleteBudget(userId, req.params.id);
  if (!success) return res.status(404).json({ error: "Budget not found" });
  return res.json({ success: true });
});
app.post("/api/budgets/ai-generate", async (req, res) => {
  const userId = resolveUserId(req);
  try {
    const recommendations = await generateAIBudget(userId);
    return res.json({ recommendations });
  } catch (err) {
    console.error("Error generating AI budget:", err);
    return res.status(500).json({ error: "Could not generate recommendations" });
  }
});
app.get("/api/savings-goals", (req, res) => {
  const userId = resolveUserId(req);
  const goals = db.getSavingsGoals(userId);
  return res.json({ goals });
});
app.post("/api/savings-goals", (req, res) => {
  const userId = resolveUserId(req);
  const { name, target_amount, current_amount = 0, target_date, monthly_contribution = 0, icon = "Target" } = req.body;
  if (!name || !target_amount || !target_date) {
    return res.status(400).json({ error: "Name, target_amount, and target_date are required" });
  }
  const goal = db.addSavingsGoal(userId, {
    name,
    target_amount: Number(target_amount),
    current_amount: Number(current_amount),
    target_date,
    monthly_contribution: Number(monthly_contribution),
    icon
  });
  return res.status(201).json({ goal });
});
app.put("/api/savings-goals/:id", (req, res) => {
  const userId = resolveUserId(req);
  const updated = db.updateSavingsGoal(userId, req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: "Goal not found" });
  return res.json({ goal: updated });
});
app.post("/api/savings-goals/:id/contribute", (req, res) => {
  const userId = resolveUserId(req);
  const { amount } = req.body;
  if (!amount || Number(amount) <= 0) {
    return res.status(400).json({ error: "Valid positive amount required" });
  }
  const goal = db.contributeToGoal(userId, req.params.id, Number(amount));
  if (!goal) return res.status(404).json({ error: "Goal not found" });
  return res.json({ goal });
});
app.delete("/api/savings-goals/:id", (req, res) => {
  const userId = resolveUserId(req);
  const success = db.deleteSavingsGoal(userId, req.params.id);
  if (!success) return res.status(404).json({ error: "Goal not found" });
  return res.json({ success: true });
});
app.get("/api/ai/conversation", (req, res) => {
  const userId = resolveUserId(req);
  const conversation = db.getConversation(userId);
  return res.json({ conversation });
});
app.post("/api/ai/chat", async (req, res) => {
  const userId = resolveUserId(req);
  const { message } = req.body;
  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Message text is required" });
  }
  const userMsg = db.addChatMessage(userId, "user", message);
  try {
    const aiAnswer = await askFinAdvisor(userId, message);
    const botMsg = db.addChatMessage(
      userId,
      "assistant",
      aiAnswer,
      ["Where am I overspending?", "How can I save \u20B95,000 this month?", "Analyze my spending this month"]
    );
    return res.json({ message: botMsg, userMessage: userMsg });
  } catch (err) {
    console.error("Error generating AI response:", err);
    return res.status(500).json({ error: "Failed to process AI response" });
  }
});
app.get("/api/notifications", (req, res) => {
  const userId = resolveUserId(req);
  const notifications = db.getNotifications(userId);
  return res.json({ notifications });
});
app.put("/api/notifications/:id/read", (req, res) => {
  const userId = resolveUserId(req);
  const success = db.markNotificationRead(userId, req.params.id);
  if (!success) return res.status(404).json({ error: "Notification not found" });
  return res.json({ success: true });
});
app.put("/api/notifications/read-all", (req, res) => {
  const userId = resolveUserId(req);
  const count = db.markAllNotificationsRead(userId);
  return res.json({ success: true, count });
});
app.post("/api/data/reset-demo", (_req, res) => {
  db.resetDemoData();
  return res.json({ success: true, message: "All demo datasets and historical periods have been restored." });
});
async function startServer() {
  const distPath = path2.resolve(process.cwd(), "dist");
  const distIndex = path2.join(distPath, "index.html");
  const hasDist = fs2.existsSync(distIndex);
  if (isProduction && hasDist) {
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(distIndex);
    });
  } else {
    try {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa"
      });
      app.use(vite.middlewares);
    } catch (e) {
      if (hasDist) {
        console.warn("Vite middleware initialization failed, falling back to static build:", e);
        app.use(express.static(distPath));
        app.get("*", (_req, res) => {
          res.sendFile(distIndex);
        });
      } else {
        throw e;
      }
    }
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`FinAdvisor full-stack server running on http://0.0.0.0:${PORT}`);
  });
}
startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
