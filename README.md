# Personal Finance Advisor Bot (FinAdvisor)

> **"Understand Your Money. Plan Smarter. Save Better."**

FinAdvisor is a production-grade personal finance management and financial planning platform. It empowers individuals, students, freelancers, and household managers to record income inflows, track categorized expenditures, set proactive monthly budgets, monitor savings milestones, and receive AI-grounded financial intelligence powered by Google Gemini.

---

## Key Features

1. **Intelligent Financial Dashboard**
   - Real-time KPIs: Total Inflow, Total Outflow, Net Savings, and Savings Rate with month-over-month growth indicators.
   - Dual-axis Income vs Expense historical bar charts and expense donut breakdown.
   - Proactive category budget utilization with color-coded warning stages (0–70% Green, 70–90% Amber, 90–100% Orange, >100% Red).
   - AI-assisted Financial Wellness Indicator (0–100 score).

2. **Pre-Configured Real-World Scenarios (1-Click Switcher)**
   - **Scenario 1 — Salaried Professional (Alex Sharma)**: Fixed salary (₹60,000–₹65,000/mo), structured housing, commute, and emergency fund focus with 6 months of historical data.
   - **Scenario 2 — College Student (Priya Patel)**: Limited monthly allowance (₹12,000/mo), hostel mess, book expenses, and study tech certification savings.
   - **Scenario 3 — Freelancer (Rohan Verma)**: Variable cashflow across multiple client retainers (₹60,000–₹95,000/mo) with a 6-month buffer runway target.
   - **Scenario 4 — Household Manager (Sunita Rao)**: Consolidated family income (₹1,10,000/mo) spanning children's tuition, groceries, healthcare, and home renovation.

3. **Autonomous AI Financial Advisor**
   - Direct conversational interface grounded strictly in the authenticated user's actual financial records.
   - Suggested prompts: *"Where am I overspending?"*, *"How can I save ₹5,000 this month?"*, *"Create a budget for me"*, *"Project my emergency fund completion"*.
   - One-click **AI Budget Generator** that computes personalized category allocations tailored to user personas.

4. **Ledger & Transaction Management**
   - Searchable, filterable transactions with categorization, payment method tracking, and CSV export.
   - Dedicated views for Income sources and Categorized Expenses.

5. **Goal & Milestone Tracking**
   - Visual progress bars, target completion dates, monthly automated deposit calculators, and confetti celebrations upon completion.

6. **Executive Reports & Export**
   - Monthly Financial Statement with AI summary and next month priority items.
   - Print-optimized PDF formatting and complete CSV data export.

7. **Fintech Design & Dark Mode**
   - Deep navy and clean slate color system with emerald green accents.
   - Accessible WCAG AA contrast with dark mode and light mode.
   - Multi-currency support (Default INR ₹, USD $, EUR €, GBP £, AED د.إ).

---

## Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Chart.js, Lucide Icons, Canvas Confetti.
- **Backend**: Express.js full-stack server with Vite middleware mode in development and static bundle serving in production.
- **Python / Flask Architecture**: Complete reference implementation in `backend_flask/` with SQLAlchemy ORM, Flask REST API blueprints, and pytest suite.
- **AI Engine**: Google Gemini API (`@google/genai` TypeScript SDK using `gemini-3.8-flash`) executed exclusively on the server side.
- **Database**: Relational in-memory and persistent JSON file store (`data/finance_db.json`) with SQLite/PostgreSQL architecture readiness.

---

## Installation & Running

### Full-Stack Node.js / Vite Mode (Active Environment)

```bash
# Install dependencies
npm install

# Start development server on port 3000
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Python Flask Backend (Alternative Service)

```bash
cd backend_flask
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Run Flask server on port 5000
python run.py

# Run tests
pytest tests/
```

---

## Environment Variables

Configure your `.env` file according to `.env.example`:

```env
GEMINI_API_KEY="your-google-gemini-api-key"
PORT=3000
NODE_ENV=development
SECRET_KEY="finadvisor-secure-session-secret"
DATABASE_URL="sqlite:///finance.db"
```

---

## API Documentation

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/dashboard?userId=&month=&year=` | Returns KPIs, trend charts, budget progress, AI insights, health score |
| `GET` | `/api/income` | Retrieves user's income records |
| `POST` | `/api/income` | Records a new income deposit |
| `DELETE` | `/api/income/:id` | Deletes an income deposit |
| `GET` | `/api/expenses` | Retrieves user's expense ledger |
| `POST` | `/api/expenses` | Records an expense with category and payment method |
| `DELETE` | `/api/expenses/:id` | Deletes an expense |
| `GET` | `/api/budgets?month=&year=` | Retrieves category budget thresholds |
| `POST` | `/api/budgets` | Sets or updates a category budget limit |
| `POST` | `/api/budgets/ai-generate` | Generates AI-recommended limits based on user income |
| `GET` | `/api/savings-goals` | Retrieves active savings goals |
| `POST` | `/api/savings-goals` | Creates a new financial milestone |
| `POST` | `/api/savings-goals/:id/contribute` | Adds funds toward a savings goal |
| `GET` | `/api/ai/conversation` | Retrieves chat history |
| `POST` | `/api/ai/chat` | Sends prompt to Gemini AI advisor with user context |
| `GET` | `/api/notifications` | Retrieves user notifications and alerts |
| `POST` | `/api/data/reset-demo` | Restores default 6-month historical demo data |

---

## Educational Disclaimer

FinAdvisor provides educational financial planning assistance, pattern analysis, and tracking tools. It does not constitute licensed financial, investment, tax, or legal advice.
