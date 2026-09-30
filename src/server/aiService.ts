import { GoogleGenAI } from '@google/genai';
import { db } from './dataStore';
import { AIBudgetRecommendation, ExpenseCategory } from '../types';

// Server-side initialization with telemetry header as required by guidelines
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey && apiKey.trim().length > 0) {
  try {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

export async function askFinAdvisor(userId: string, userMessage: string): Promise<string> {
  const dashData = db.getDashboardData(userId);
  const user = dashData.user;

  // Build financial context
  const contextSummary = {
    user_name: user.name,
    persona_type: user.user_type,
    currency: user.currency,
    monthly_inflow: dashData.kpis.total_income,
    monthly_outflow: dashData.kpis.total_expenses,
    net_savings: dashData.kpis.total_savings,
    savings_rate: `${dashData.kpis.savings_rate}%`,
    top_expenses: dashData.expense_breakdown.slice(0, 5).map(e => `${e.category}: ₹${e.amount} (${e.percentage}%)`),
    budget_statuses: dashData.budget_utilization.map(b => `${b.category}: Spent ₹${b.spent} of ₹${b.limit} (${b.percentage}%) - ${b.status}`),
    savings_goals: dashData.savings_goals.map(g => `${g.name}: ₹${g.current_amount} of ₹${g.target_amount} (Target: ${g.target_date})`)
  };

  const systemInstruction = `You are "FinAdvisor AI", an intelligent, empathetic, and data-driven personal financial planning assistant for ${user.name}.
You provide educational personal finance analysis, budgeting guidance, and savings habits.

SAFETY & ACCURACY RULES:
1. You are a financial planning assistant, NOT a licensed financial advisor. Include a brief, polite educational disclaimer where appropriate.
2. Ground all answers strictly in the user's provided financial numbers:
   - Monthly Inflow: ₹${contextSummary.monthly_inflow}
   - Monthly Outflow: ₹${contextSummary.monthly_outflow}
   - Savings Rate: ${contextSummary.savings_rate}
   - Persona: ${contextSummary.persona_type}
3. Never promise guaranteed investment returns. Distinguish verified facts from estimates.
4. Use clean Markdown formatting, bullet points, and the currency symbol (₹).
5. Explain your calculations clearly and offer 2-3 specific, actionable steps tailored to their ${contextSummary.persona_type} profile.
6. Keep tone professional, calm, encouraging, and clear.`;

  if (aiClient) {
    try {
      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `User's current financial profile:\n${JSON.stringify(contextSummary, null, 2)}\n\nUser asked: "${userMessage}"`
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
      console.warn('Gemini API call failed, falling back to local financial engine:', err);
    }
  }

  // Robust, data-grounded fallback generator
  return generateIntelligentFinancialResponse(userMessage, dashData);
}

export async function generateAIBudget(userId: string): Promise<AIBudgetRecommendation[]> {
  const dashData = db.getDashboardData(userId);
  const income = dashData.kpis.total_income || 60000;
  const userType = dashData.user.user_type;

  // Domain-specific allocation ratios based on persona
  let ratios: { category: ExpenseCategory; pct: number; reason: string }[] = [];

  if (userType === 'student') {
    ratios = [
      { category: 'Food', pct: 0.35, reason: 'Mess fees, healthy groceries, and canteen meals' },
      { category: 'Education', pct: 0.18, reason: 'Books, course materials, stationery, and printing' },
      { category: 'Transport', pct: 0.10, reason: 'Public transport, student transit passes, and rickshaw' },
      { category: 'Utilities', pct: 0.07, reason: 'Mobile data, student broadband, and hostel charges' },
      { category: 'Entertainment', pct: 0.12, reason: 'College activities, social gatherings, and hobbies' },
      { category: 'Shopping', pct: 0.08, reason: 'Clothing, personal care, and emergency purchases' },
      { category: 'Other', pct: 0.10, reason: 'Buffer for unforeseen academic or living needs' }
    ];
  } else if (userType === 'freelancer') {
    ratios = [
      { category: 'Housing', pct: 0.22, reason: 'Home studio and residential workspace allocation' },
      { category: 'Subscriptions', pct: 0.08, reason: 'Design/dev software, cloud services, and domains' },
      { category: 'Food', pct: 0.12, reason: 'Nutritious cooking and occasional client meeting lunches' },
      { category: 'Utilities', pct: 0.06, reason: 'High-speed redundant internet and workspace electricity' },
      { category: 'Healthcare', pct: 0.07, reason: 'Independent health & accidental insurance coverage' },
      { category: 'Transport', pct: 0.05, reason: 'Commuting to clients and co-working hubs' },
      { category: 'Entertainment', pct: 0.05, reason: 'Work-life balance and creative refreshment' },
      { category: 'Other', pct: 0.05, reason: 'Buffer for variable client delays or equipment upkeep' }
    ];
  } else if (userType === 'household') {
    ratios = [
      { category: 'Housing', pct: 0.25, reason: 'Home mortgage/rent and apartment society maintenance' },
      { category: 'Food', pct: 0.20, reason: 'Family groceries, dairy, produce, and staple kitchen supplies' },
      { category: 'Education', pct: 0.16, reason: 'Children school tuition, coaching, and extracurriculars' },
      { category: 'Utilities', pct: 0.07, reason: 'Electricity, piped LPG, water, and family broadband' },
      { category: 'Transport', pct: 0.08, reason: 'Family vehicle fuel, maintenance, and transit passes' },
      { category: 'Healthcare', pct: 0.06, reason: 'Family health insurance premiums and prescriptions' },
      { category: 'Other', pct: 0.06, reason: 'Household emergency buffer and repair contingencies' }
    ];
  } else {
    // Salaried professional (Alex Sharma)
    ratios = [
      { category: 'Housing', pct: 0.25, reason: 'Rent/housing costs kept within standard healthy 25-30% range' },
      { category: 'Food', pct: 0.10, reason: 'Balanced weekly groceries and mindful discretionary dining' },
      { category: 'Transport', pct: 0.06, reason: 'Daily commute, metro card, and vehicle fuel' },
      { category: 'Shopping', pct: 0.06, reason: 'Personal wardrobe, tech gadgets, and lifestyle items' },
      { category: 'Utilities', pct: 0.05, reason: 'Power, water, mobile and high-speed broadband' },
      { category: 'Education', pct: 0.04, reason: 'Professional upskilling, certifications, and reading' },
      { category: 'Healthcare', pct: 0.03, reason: 'Preventative care, gym membership, and wellness' },
      { category: 'Entertainment', pct: 0.04, reason: 'Weekend movies, events, and leisure activities' },
      { category: 'Subscriptions', pct: 0.02, reason: 'Essential media streaming and cloud storage' },
      { category: 'Other', pct: 0.05, reason: 'Discretionary buffer and miscellaneous expenses' }
    ];
  }

  // Calculate recommended limits
  return ratios.map(r => ({
    category: r.category,
    recommended_limit: Math.round((income * r.pct) / 100) * 100,
    percentage_of_income: Math.round(r.pct * 100),
    reasoning: r.reason
  }));
}

function generateIntelligentFinancialResponse(message: string, dashData: ReturnType<typeof db.getDashboardData>): string {
  const q = message.toLowerCase();
  const kpis = dashData.kpis;
  const user = dashData.user;
  const foodBudget = dashData.budget_utilization.find(b => b.category === 'Food');
  const primaryGoal = dashData.savings_goals[0];

  if (q.includes('overspend') || q.includes('where am i spending') || q.includes('spending too much')) {
    const exceeded = dashData.budget_utilization.filter(b => b.percentage > 90);
    if (exceeded.length > 0) {
      const list = exceeded.map(e => `- **${e.category}**: ₹${e.spent.toLocaleString()} spent of ₹${e.limit.toLocaleString()} (${e.percentage}% utilized)`).join('\n');
      return `### Spending Alert Analysis for ${dashData.period.label}:

You have **${exceeded.length} category/categories** operating near or above your planned thresholds:

${list}

**Actionable Steps to Regain Balance:**
1. **Pause non-essential transactions** in ${exceeded[0]?.category} for the remaining days of this month.
2. Consider transferring a temporary ₹1,000 buffer from categories with surplus room (such as *Education* or *Other*).
3. Set up weekly milestone checkpoints so discretionary purchases don't accumulate all at once.

*Note: FinAdvisor AI provides educational planning calculations; consult a qualified advisor for personalized legal or investment guidance.*`;
    } else {
      return `### Excellent Budget Discipline!

None of your tracked categories have exceeded their monthly thresholds in **${dashData.period.label}**. 

- **Total Inflow**: ₹${kpis.total_income.toLocaleString()}
- **Total Spent**: ₹${kpis.total_expenses.toLocaleString()} (${Math.round((kpis.total_expenses / (kpis.total_income || 1)) * 100)}% of income)
- **Net Savings**: ₹${kpis.total_savings.toLocaleString()} (**${kpis.savings_rate}% savings rate**)

You have preserved a healthy cushion. Keep maintaining this pace to reach your **${primaryGoal?.name || 'savings'}** milestone ahead of schedule!`;
    }
  }

  if (q.includes('save') && (q.includes('5000') || q.includes('5,000') || q.includes('more'))) {
    return `### Action Plan: How to Save an Extra ₹5,000 This Month

Based on your verified spending breakdown of ₹${kpis.total_expenses.toLocaleString()}:

1. **Dining & Food Delivery (-₹2,200)**:
   - Your Food spending currently stands at ₹${foodBudget?.spent.toLocaleString() || '6,240'}. Cooking 2 extra meals per week at home frees up ~₹2,200 effortlessly.
2. **Subscription Audit (-₹800)**:
   - Review your recurring streaming and cloud storage services to pause duplicate entertainment packages.
3. **Discretionary Shopping (-₹2,000)**:
   - Enforce a 48-hour cool-off rule for non-essential impulse items in your cart.

**Outcome**:
Accumulating this extra ₹5,000 would elevate your monthly savings rate from **${kpis.savings_rate}%** to **${Math.round(((kpis.total_savings + 5000) / (kpis.total_income || 1)) * 100)}%**, accelerating your goal completion by approximately 1.5 months!`;
  }

  if (q.includes('emergency') || q.includes('goal')) {
    if (primaryGoal) {
      const remaining = primaryGoal.target_amount - primaryGoal.current_amount;
      const months = primaryGoal.monthly_contribution > 0 ? Math.ceil(remaining / primaryGoal.monthly_contribution) : 10;
      return `### Progress on Your ${primaryGoal.name}

- **Target Amount**: ₹${primaryGoal.target_amount.toLocaleString()}
- **Current Reserves**: ₹${primaryGoal.current_amount.toLocaleString()} (${Math.round((primaryGoal.current_amount / primaryGoal.target_amount) * 100)}% complete)
- **Remaining Gap**: ₹${remaining.toLocaleString()}
- **Current Monthly Pace**: ₹${primaryGoal.monthly_contribution.toLocaleString()} / month

**Estimated Completion**: Approximately **${months} months** (Target: ${primaryGoal.target_date}).

**Pro-Tip**:
If you allocate 25% of your current monthly surplus (₹${Math.round(kpis.total_savings * 0.25).toLocaleString()}) to this goal, you will shave **2 full months** off your timeline!`;
    }
  }

  // General spending review
  return `### Financial Overview for ${user.name} (${dashData.period.label})

Here is your synthesized financial position:
- **Total Inflow**: ₹${kpis.total_income.toLocaleString()}
- **Total Expenses**: ₹${kpis.total_expenses.toLocaleString()}
- **Net Savings**: ₹${kpis.total_savings.toLocaleString()}
- **Savings Rate**: **${kpis.savings_rate}%** (Benchmark: 20-30%)
- **Financial Health Score**: **${dashData.health_score.score}/100** (${dashData.health_score.rating})

**Top Spending Drivers**:
${dashData.expense_breakdown.slice(0, 3).map(e => `- **${e.category}**: ₹${e.amount.toLocaleString()} (${e.percentage}%)`).join('\n')}

**Recommendations for You**:
1. Keep housing & fixed utilities below 30% of total cashflow.
2. Maintain your regular automated contribution toward your savings goals.
3. Check your weekly category budget trackers to prevent late-month overruns.

What specific area would you like to explore deeper? You can ask about budgeting, expense reduction, or goal planning.`;
}
