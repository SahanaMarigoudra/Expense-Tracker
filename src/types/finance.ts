export type TransactionType = 'income' | 'expense';

export type Transaction = {
  id: number;
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  account_name: string;
  payment_method: string;
  transaction_date: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
};

export type Account = {
  id: number;
  name: string;
  type: string;
  opening_balance: number;
  current_balance: number;
  description?: string;
  is_active: boolean;
  created_at?: string;
};

export type Category = {
  id: number;
  name: string;
  type: TransactionType;
  icon: string;
  color: string;
  is_default: boolean;
};

export type Budget = {
  id: number;
  category: string;
  monthly_limit: number;
  spent: number;
  remaining: number;
  percentage: number;
  month?: number;
  year?: number;
};

export type SavingsGoal = {
  id: number;
  title: string;
  target_amount: number;
  current_amount: number;
  progress_percentage: number;
  remaining_amount: number;
  target_date?: string;
  notes?: string;
};

export type Reminder = {
  id: number;
  title: string;
  amount: number;
  due_date: string;
  category: string;
  frequency: string;
  status: 'Upcoming' | 'Paid' | 'Overdue' | 'Cancelled';
  account_name?: string;
};

export type Summary = {
  total_balance: number;
  total_income: number;
  total_expense: number;
  net_savings: number;
  transaction_count: number;
  income_count: number;
  expense_count: number;
  balance_pct: number;
  expense_pct: number;
  income_pct: number;
};

export type CategoryBreakdownItem = {
  category: string;
  amount: number;
  percentage: number;
  color: string;
  icon?: string;
};

export type MonthlyBarItem = {
  period: string;
  income: number;
  expense: number;
};

export type DashboardData = {
  summary: Summary;
  recent_transactions: Transaction[];
  category_breakdown: CategoryBreakdownItem[];
  monthly_trend: MonthlyBarItem[];
  reminders: Reminder[];
  upcoming: Reminder[];
  accounts: Account[];
};
