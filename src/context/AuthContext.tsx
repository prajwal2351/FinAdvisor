import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, PersonaProfile } from '../types';
import { api, setActiveUserId, getActiveUserId } from '../services/api';

export const DEMO_PERSONAS: PersonaProfile[] = [
  {
    id: 'alex',
    name: 'Alex Sharma',
    email: 'alex.sharma@example.com',
    role: 'Salaried Professional',
    user_type: 'salaried',
    income: 65000,
    tagline: 'Fixed monthly salary with structured housing, commute, and emergency fund focus.',
    avatarColor: 'from-blue-600 to-indigo-700',
    scenarioDescription: 'Records monthly salary and regular expenses (rent, groceries, transit, dining). Receives automated budget alerts and savings recommendations.'
  },
  {
    id: 'priya',
    name: 'Priya Patel',
    email: 'priya.patel@student.edu',
    role: 'College Student',
    user_type: 'student',
    income: 12000,
    tagline: 'Monthly stipend & family allowance with strict hostel mess and tech cert budgeting.',
    avatarColor: 'from-emerald-500 to-teal-700',
    scenarioDescription: 'Limited allowance requiring realistic category limits, identifying discretionary spending, and building disciplined savings habits.'
  },
  {
    id: 'rohan',
    name: 'Rohan Verma',
    email: 'rohan@creativelabs.io',
    role: 'Freelance Designer',
    user_type: 'freelancer',
    income: 95000,
    tagline: 'Variable cashflow across multiple clients with 6-month buffer runway planning.',
    avatarColor: 'from-purple-600 to-violet-800',
    scenarioDescription: 'Records multiple client retainers, tracks income fluctuations across months, and optimizes emergency runway buffers.'
  },
  {
    id: 'sunita',
    name: 'Sunita Rao',
    email: 'sunita.family@household.in',
    role: 'Household Manager',
    user_type: 'household',
    income: 110000,
    tagline: 'Shared family cashflow spanning children tuition, groceries, healthcare & home upkeep.',
    avatarColor: 'from-amber-600 to-orange-700',
    scenarioDescription: 'Consolidates family income and expenses (groceries, school tuition, healthcare), identifying category overruns and home goals.'
  }
];

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  activePersonaId: string;
  personas: PersonaProfile[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAddTransactionOpen: boolean;
  setIsAddTransactionOpen: (open: boolean) => void;
  showOnboarding: boolean;
  setShowOnboarding: (show: boolean) => void;
  refreshTrigger: number;
  triggerRefresh: () => void;
  login: (email: string) => Promise<void>;
  register: (data: { name: string; email: string; user_type: string; monthly_income: number; primary_goal?: string }) => Promise<void>;
  switchPersona: (personaId: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activePersonaId, setActivePersonaId] = useState<string>('alex');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState<boolean>(false);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  const triggerRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  useEffect(() => {
    async function initUser() {
      try {
        const storedId = getActiveUserId();
        const matched = DEMO_PERSONAS.find(p => `user_${p.id}` === storedId);
        if (matched) {
          setActivePersonaId(matched.id);
        }
        const res = await api.getMe();
        setUser(res.user);
      } catch (err) {
        console.warn('Could not load current user session, falling back to Alex Sharma:', err);
        // Default to Alex
        try {
          const res = await api.switchDemo('alex');
          setUser(res.user);
          setActivePersonaId('alex');
        } catch (e) {
          console.error('Failed to set fallback demo user:', e);
        }
      } finally {
        setIsLoading(false);
      }
    }
    initUser();
  }, []);

  const login = async (email: string) => {
    setIsLoading(true);
    try {
      const res = await api.login(email);
      setUser(res.user);
      setActiveUserId(res.user.id);
      const persona = DEMO_PERSONAS.find(p => p.email.toLowerCase() === email.toLowerCase());
      if (persona) setActivePersonaId(persona.id);
      triggerRefresh();
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: { name: string; email: string; user_type: string; monthly_income: number; primary_goal?: string }) => {
    setIsLoading(true);
    try {
      const res = await api.register(data);
      setUser(res.user);
      setActiveUserId(res.user.id);
      setActivePersonaId('custom');
      setShowOnboarding(true);
      triggerRefresh();
    } finally {
      setIsLoading(false);
    }
  };

  const switchPersona = async (personaId: string) => {
    setIsLoading(true);
    try {
      const res = await api.switchDemo(personaId);
      setUser(res.user);
      setActivePersonaId(personaId);
      setActiveUserId(res.user.id);
      triggerRefresh();
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Revert to landing view or default demo
    setUser(null);
    localStorage.removeItem('finadvisor_user_id');
    setActiveTab('landing');
  };

  const updateProfile = async (data: Partial<User>) => {
    const res = await api.updateProfile(data);
    setUser(res.user);
    triggerRefresh();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        activePersonaId,
        personas: DEMO_PERSONAS,
        activeTab,
        setActiveTab,
        isAddTransactionOpen,
        setIsAddTransactionOpen,
        showOnboarding,
        setShowOnboarding,
        refreshTrigger,
        triggerRefresh,
        login,
        register,
        switchPersona,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
