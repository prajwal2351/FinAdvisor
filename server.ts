import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { db } from './src/server/dataStore';
import { askFinAdvisor, generateAIBudget } from './src/server/aiService';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(cors());
app.use(express.json());

// Helper to determine active userId (from query, body, header, or default to Alex)
function resolveUserId(req: Request): string {
  const fromHeader = req.headers['x-user-id'] as string;
  const fromQuery = req.query.userId as string;
  const fromBody = req.body?.userId as string;
  const targetId = fromHeader || fromQuery || fromBody;
  if (targetId && db.getUserById(targetId)) {
    return targetId;
  }
  return 'user_alex';
}

// --------------------------------------------------------------------------
// Auth Routes
// --------------------------------------------------------------------------
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  const user = db.getUserByEmail(email);
  if (!user) {
    return res.status(404).json({ error: 'User not found. Try one of our demo accounts or register.' });
  }
  return res.json({ user, token: `token_${user.id}` });
});

app.post('/api/auth/register', (req: Request, res: Response) => {
  const { name, email, user_type = 'salaried', monthly_income = 50000, primary_goal, currency = 'INR' } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }
  const existing = db.getUserByEmail(email);
  if (existing) {
    return res.status(409).json({ error: 'An account with this email already exists.' });
  }
  const newUser = db.createUser({
    name,
    email,
    user_type,
    monthly_income: Number(monthly_income) || 50000,
    primary_goal,
    currency
  });
  return res.status(201).json({ user: newUser, token: `token_${newUser.id}` });
});

app.get('/api/auth/me', (req: Request, res: Response) => {
  const userId = resolveUserId(req);
  const user = db.getUserById(userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  return res.json({ user });
});

app.put('/api/auth/profile', (req: Request, res: Response) => {
  const userId = resolveUserId(req);
  const updated = db.updateUser(userId, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'User not found' });
  }
  return res.json({ user: updated });
});

app.post('/api/auth/switch-demo', (req: Request, res: Response) => {
  const { personaId } = req.body;
  const targetUserId = `user_${personaId}`;
  const user = db.getUserById(targetUserId);
  if (!user) {
    return res.status(404).json({ error: 'Demo persona not found' });
  }
  return res.json({ user, token: `token_${user.id}` });
});

// --------------------------------------------------------------------------
// Dashboard Overview Route
// --------------------------------------------------------------------------
app.get('/api/dashboard', (req: Request, res: Response) => {
  const userId = resolveUserId(req);
  const month = Number(req.query.month) || 9;
  const year = Number(req.query.year) || 2026;
  const dashboard = db.getDashboardData(userId, month, year);
  return res.json(dashboard);
});

// --------------------------------------------------------------------------
// Income Routes
// --------------------------------------------------------------------------
app.get('/api/income', (req: Request, res: Response) => {
  const userId = resolveUserId(req);
  const incomes = db.getIncomes(userId);
  return res.json({ incomes });
});

app.post('/api/income', (req: Request, res: Response) => {
  const userId = resolveUserId(req);
  const { amount, source, income_type = 'salary', date, description } = req.body;
  if (!amount || !source || !date) {
    return res.status(400).json({ error: 'Amount, source, and date are required' });
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

app.put('/api/income/:id', (req: Request, res: Response) => {
  const userId = resolveUserId(req);
  const updated = db.updateIncome(userId, req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Income record not found' });
  return res.json({ income: updated });
});

app.delete('/api/income/:id', (req: Request, res: Response) => {
  const userId = resolveUserId(req);
  const success = db.deleteIncome(userId, req.params.id);
  if (!success) return res.status(404).json({ error: 'Income record not found' });
  return res.json({ success: true });
});

// --------------------------------------------------------------------------
// Expense Routes
// --------------------------------------------------------------------------
app.get('/api/expenses', (req: Request, res: Response) => {
  const userId = resolveUserId(req);
  const expenses = db.getExpenses(userId);
  return res.json({ expenses });
});

app.post('/api/expenses', (req: Request, res: Response) => {
  const userId = resolveUserId(req);
  const { amount, category, description, date, payment_method = 'UPI', notes } = req.body;
  if (!amount || !category || !description || !date) {
    return res.status(400).json({ error: 'Amount, category, description, and date are required' });
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

app.put('/api/expenses/:id', (req: Request, res: Response) => {
  const userId = resolveUserId(req);
  const updated = db.updateExpense(userId, req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Expense record not found' });
  return res.json({ expense: updated });
});

app.delete('/api/expenses/:id', (req: Request, res: Response) => {
  const userId = resolveUserId(req);
  const success = db.deleteExpense(userId, req.params.id);
  if (!success) return res.status(404).json({ error: 'Expense record not found' });
  return res.json({ success: true });
});

// --------------------------------------------------------------------------
// Budget Routes
// --------------------------------------------------------------------------
app.get('/api/budgets', (req: Request, res: Response) => {
  const userId = resolveUserId(req);
  const month = Number(req.query.month) || 9;
  const year = Number(req.query.year) || 2026;
  const budgets = db.getBudgets(userId, month, year);
  return res.json({ budgets });
});

app.post('/api/budgets', (req: Request, res: Response) => {
  const userId = resolveUserId(req);
  const { category, limit_amount, month = 9, year = 2026 } = req.body;
  if (!category || limit_amount === undefined) {
    return res.status(400).json({ error: 'Category and limit_amount are required' });
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

app.delete('/api/budgets/:id', (req: Request, res: Response) => {
  const userId = resolveUserId(req);
  const success = db.deleteBudget(userId, req.params.id);
  if (!success) return res.status(404).json({ error: 'Budget not found' });
  return res.json({ success: true });
});

app.post('/api/budgets/ai-generate', async (req: Request, res: Response) => {
  const userId = resolveUserId(req);
  try {
    const recommendations = await generateAIBudget(userId);
    return res.json({ recommendations });
  } catch (err: any) {
    console.error('Error generating AI budget:', err);
    return res.status(500).json({ error: 'Could not generate recommendations' });
  }
});

// --------------------------------------------------------------------------
// Savings Goals Routes
// --------------------------------------------------------------------------
app.get('/api/savings-goals', (req: Request, res: Response) => {
  const userId = resolveUserId(req);
  const goals = db.getSavingsGoals(userId);
  return res.json({ goals });
});

app.post('/api/savings-goals', (req: Request, res: Response) => {
  const userId = resolveUserId(req);
  const { name, target_amount, current_amount = 0, target_date, monthly_contribution = 0, icon = 'Target' } = req.body;
  if (!name || !target_amount || !target_date) {
    return res.status(400).json({ error: 'Name, target_amount, and target_date are required' });
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

app.put('/api/savings-goals/:id', (req: Request, res: Response) => {
  const userId = resolveUserId(req);
  const updated = db.updateSavingsGoal(userId, req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Goal not found' });
  return res.json({ goal: updated });
});

app.post('/api/savings-goals/:id/contribute', (req: Request, res: Response) => {
  const userId = resolveUserId(req);
  const { amount } = req.body;
  if (!amount || Number(amount) <= 0) {
    return res.status(400).json({ error: 'Valid positive amount required' });
  }
  const goal = db.contributeToGoal(userId, req.params.id, Number(amount));
  if (!goal) return res.status(404).json({ error: 'Goal not found' });
  return res.json({ goal });
});

app.delete('/api/savings-goals/:id', (req: Request, res: Response) => {
  const userId = resolveUserId(req);
  const success = db.deleteSavingsGoal(userId, req.params.id);
  if (!success) return res.status(404).json({ error: 'Goal not found' });
  return res.json({ success: true });
});

// --------------------------------------------------------------------------
// AI Advisor Chat Routes
// --------------------------------------------------------------------------
app.get('/api/ai/conversation', (req: Request, res: Response) => {
  const userId = resolveUserId(req);
  const conversation = db.getConversation(userId);
  return res.json({ conversation });
});

app.post('/api/ai/chat', async (req: Request, res: Response) => {
  const userId = resolveUserId(req);
  const { message } = req.body;
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message text is required' });
  }

  // Record user message
  const userMsg = db.addChatMessage(userId, 'user', message);

  try {
    const aiAnswer = await askFinAdvisor(userId, message);

    const botMsg = db.addChatMessage(
      userId,
      'assistant',
      aiAnswer,
      ['Where am I overspending?', 'How can I save ₹5,000 this month?', 'Analyze my spending this month']
    );

    return res.json({ message: botMsg, userMessage: userMsg });
  } catch (err: any) {
    console.error('Error generating AI response:', err);
    return res.status(500).json({ error: 'Failed to process AI response' });
  }
});

// --------------------------------------------------------------------------
// Notifications Routes
// --------------------------------------------------------------------------
app.get('/api/notifications', (req: Request, res: Response) => {
  const userId = resolveUserId(req);
  const notifications = db.getNotifications(userId);
  return res.json({ notifications });
});

app.put('/api/notifications/:id/read', (req: Request, res: Response) => {
  const userId = resolveUserId(req);
  const success = db.markNotificationRead(userId, req.params.id);
  if (!success) return res.status(404).json({ error: 'Notification not found' });
  return res.json({ success: true });
});

app.put('/api/notifications/read-all', (req: Request, res: Response) => {
  const userId = resolveUserId(req);
  const count = db.markAllNotificationsRead(userId);
  return res.json({ success: true, count });
});

// --------------------------------------------------------------------------
// Reset Data Route
// --------------------------------------------------------------------------
app.post('/api/data/reset-demo', (_req: Request, res: Response) => {
  db.resetDemoData();
  return res.json({ success: true, message: 'All demo datasets and historical periods have been restored.' });
});

// --------------------------------------------------------------------------
// Server Startup & Vite Middleware
// --------------------------------------------------------------------------
async function startServer() {
  const distPath = path.resolve(process.cwd(), 'dist');
  const distIndex = path.join(distPath, 'index.html');
  const hasDist = fs.existsSync(distIndex);

  if (isProduction && hasDist) {
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(distIndex);
    });
  } else {
    try {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa'
      });
      app.use(vite.middlewares);
    } catch (e) {
      if (hasDist) {
        console.warn('Vite middleware initialization failed, falling back to static build:', e);
        app.use(express.static(distPath));
        app.get('*', (_req, res) => {
          res.sendFile(distIndex);
        });
      } else {
        throw e;
      }
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FinAdvisor full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
