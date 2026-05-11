export interface User {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface Category {
  id: string;
  name: string;
  category_type: 'EXPENSE' | 'INCOME';
  icon?: string;
  color?: string;
  user_id: string;
}

export interface Expense {
  id: string;
  user_id: string;
  category_id: string;
  title: string;
  amount: number;
  date: string;
  description: string;
  notes?: string;
  payment_mode: string;
  receipt_url?: string;
  created_at: string;
}

export interface Income {
  id: string;
  user_id: string;
  source: string;
  title?: string;
  amount: number;
  date: string;
  description?: string;
  notes?: string;
  created_at: string;
}

export interface Budget {
  id: string;
  user_id: string;
  category_id: string;
  limit_amount: number;
  month: string;
  created_at: string;
}

export interface RecurringExpense {
  id: string;
  user_id: string;
  category_id: string;
  amount: number;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  start_date: string;
  end_date?: string;
  description: string;
  created_at: string;
}

export interface DashboardStats {
  total_expenses: number;
  total_income: number;
  savings: number;
  receivable_amount: number;
  total_investments: number;
  total_transactions: number;
  expenses_change_percent: number;
  income_change_percent: number;
  savings_change_percent: number;
  transactions_change_percent: number;
}

export interface Transaction {
  id: string;
  type: 'expense' | 'income' | 'lent' | 'money_returned' | 'investment';
  category: string;
  amount: number;
  date: string;
  title: string;
  description: string;
}

export type DashboardHistoryType = 'expenses' | 'income' | 'savings' | 'receivable' | 'investments' | 'transactions';

export interface DashboardHistoryItem {
  id: string;
  source_id: string;
  source_type: 'expense' | 'income' | 'lent_money' | 'investment';
  source_category_id?: string;
  type: 'Expense' | 'Income' | 'Money Lent' | 'Money Returned' | 'Investment';
  title: string;
  category: string;
  mode?: string;
  amount: number;
  impact: 'INCOME' | 'EXPENSE' | 'MONEY_LENT' | 'MONEY_RETURNED' | 'INVESTMENT';
  date: string;
  status?: string;
  notes?: string;
}

export interface LentMoney {
  id: string;
  user_id: string;
  person_name: string;
  amount: number;
  payment_mode: string;
  given_date: string;
  expected_return_date?: string;
  returned_date?: string;
  status: 'PENDING' | 'RETURNED' | 'CANCELLED';
  notes?: string;
}

export interface Investment {
  id: string;
  user_id: string;
  investment_type: string;
  investment_name: string;
  amount_invested: number;
  quantity?: number;
  broker_name?: string;
  purchase_date: string;
  notes?: string;
}

export interface CategoryWiseExpense {
  name: string;
  value: number;
  percentage: number;
}

export interface DailyExpense {
  date: string;
  amount: number;
}

export interface BudgetStatus {
  category: string;
  spent: number;
  limit: number;
  percentage: number;
}

export interface BudgetDetail {
  id: string;
  user_id: string;
  category_id: string;
  category_name?: string;
  amount?: number;
  limit_amount: number;
  month: string;
  year?: number;
  spent: number;
  remaining: number;
  percentage: number;
}

export interface CalendarDay {
  date: string;
  expenses: number;
  income: number;
  transactions: Array<{ type: string; amount: number; title: string }>;
}

export interface RecurringTransaction {
  id: string;
  user_id: string;
  type: string;
  title: string;
  category?: string;
  amount: number;
  payment_mode?: string;
  frequency: string;
  start_date: string;
  next_due_date: string;
  status: string;
  notes?: string;
}

export interface Goal {
  id: string;
  user_id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  target_date: string;
  status: string;
  notes?: string;
  progress_percentage: number;
}

export interface UserPreference {
  id: string;
  user_id: string;
  currency: string;
  theme: string;
  monthly_income_target: number;
  monthly_budget_target: number;
}
