import {
  DashboardData,
  Income,
  Expense,
  Budget,
  SavingsGoal,
  Notification,
  User,
  AIConversation,
  AIMessage,
  AIBudgetRecommendation
} from '../types';
import { getFallbackDashboardData, FALLBACK_USERS } from './fallbackData';

let currentUserId = 'user_alex';

export function setActiveUserId(id: string) {
  currentUserId = id;
  localStorage.setItem('finadvisor_user_id', id);
}

export function getActiveUserId(): string {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('finadvisor_user_id');
    if (saved) return saved;
  }
  return currentUserId;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  headers.set('x-user-id', getActiveUserId());

  const response = await fetch(endpoint, {
    ...options,
    headers
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Request failed with status ${response.status}`);
  }

  return response.json();
}

export const api = {
  // Auth
  async login(email: string): Promise<{ user: User; token: string }> {
    return request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  },

  async register(data: { name: string; email: string; user_type: string; monthly_income: number; primary_goal?: string; currency?: string }): Promise<{ user: User; token: string }> {
    return request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async switchDemo(personaId: string): Promise<{ user: User; token: string }> {
    try {
      return await request('/api/auth/switch-demo', {
        method: 'POST',
        body: JSON.stringify({ personaId })
      });
    } catch {
      const u = FALLBACK_USERS[`user_${personaId}`] || FALLBACK_USERS['user_alex'];
      setActiveUserId(u.id);
      return { user: u, token: `token_${u.id}` };
    }
  },

  async getMe(): Promise<{ user: User }> {
    try {
      return await request('/api/auth/me');
    } catch {
      const u = FALLBACK_USERS[getActiveUserId()] || FALLBACK_USERS['user_alex'];
      return { user: u };
    }
  },

  async updateProfile(data: Partial<User>): Promise<{ user: User }> {
    try {
      return await request('/api/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(data)
      });
    } catch {
      const u = { ...(FALLBACK_USERS[getActiveUserId()] || FALLBACK_USERS['user_alex']), ...data };
      return { user: u };
    }
  },

  // Dashboard
  async getDashboard(month = 9, year = 2026): Promise<DashboardData> {
    try {
      return await request(`/api/dashboard?month=${month}&year=${year}`);
    } catch (e) {
      console.warn('Backend call failed, using client-side fallback data:', e);
      return getFallbackDashboardData(getActiveUserId());
    }
  },

  // Incomes
  async getIncomes(): Promise<{ incomes: Income[] }> {
    return request('/api/income');
  },

  async addIncome(data: Omit<Income, 'id' | 'user_id' | 'created_at'>): Promise<{ income: Income }> {
    return request('/api/income', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async updateIncome(id: string, data: Partial<Income>): Promise<{ income: Income }> {
    return request(`/api/income/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  async deleteIncome(id: string): Promise<{ success: boolean }> {
    return request(`/api/income/${id}`, { method: 'DELETE' });
  },

  // Expenses
  async getExpenses(): Promise<{ expenses: Expense[] }> {
    return request('/api/expenses');
  },

  async addExpense(data: Omit<Expense, 'id' | 'user_id' | 'created_at'>): Promise<{ expense: Expense }> {
    return request('/api/expenses', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async updateExpense(id: string, data: Partial<Expense>): Promise<{ expense: Expense }> {
    return request(`/api/expenses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  async deleteExpense(id: string): Promise<{ success: boolean }> {
    return request(`/api/expenses/${id}`, { method: 'DELETE' });
  },

  // Budgets
  async getBudgets(month = 9, year = 2026): Promise<{ budgets: Budget[] }> {
    return request(`/api/budgets?month=${month}&year=${year}`);
  },

  async setBudget(data: { category: string; limit_amount: number; month?: number; year?: number }): Promise<{ budget: Budget }> {
    return request('/api/budgets', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async deleteBudget(id: string): Promise<{ success: boolean }> {
    return request(`/api/budgets/${id}`, { method: 'DELETE' });
  },

  async generateAIBudget(): Promise<{ recommendations: AIBudgetRecommendation[] }> {
    return request('/api/budgets/ai-generate', { method: 'POST' });
  },

  // Savings Goals
  async getSavingsGoals(): Promise<{ goals: SavingsGoal[] }> {
    return request('/api/savings-goals');
  },

  async addSavingsGoal(data: Omit<SavingsGoal, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<{ goal: SavingsGoal }> {
    return request('/api/savings-goals', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async updateSavingsGoal(id: string, data: Partial<SavingsGoal>): Promise<{ goal: SavingsGoal }> {
    return request(`/api/savings-goals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  async contributeToGoal(id: string, amount: number): Promise<{ goal: SavingsGoal; message: string }> {
    return request(`/api/savings-goals/${id}/contribute`, {
      method: 'POST',
      body: JSON.stringify({ amount })
    });
  },

  async deleteSavingsGoal(id: string): Promise<{ success: boolean }> {
    return request(`/api/savings-goals/${id}`, { method: 'DELETE' });
  },

  // AI Advisor
  async getAIConversation(): Promise<{ conversation: AIConversation }> {
    return request('/api/ai/conversation');
  },

  async sendAIMessage(message: string): Promise<{ message: AIMessage }> {
    return request('/api/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message })
    });
  },

  // Notifications
  async getNotifications(): Promise<{ notifications: Notification[] }> {
    return request('/api/notifications');
  },

  async markNotificationRead(id: string): Promise<{ success: boolean }> {
    return request(`/api/notifications/${id}/read`, { method: 'PUT' });
  },

  async markAllNotificationsRead(): Promise<{ success: boolean; count: number }> {
    return request('/api/notifications/read-all', { method: 'POST' });
  },

  // Reset Data
  async resetDemoData(): Promise<{ success: boolean; message: string }> {
    return request('/api/data/reset-demo', { method: 'POST' });
  }
};
