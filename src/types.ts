export type TransactionType = 'income' | 'expense';

export type Transaction = {
  id: number;
  title: string;
  type: TransactionType;
  amount: number;
  category: string;
  transaction_date: string;
  notes?: string;
  created_at?: string;
};

export type Category = {
  id: string;
  name: string;
  type: TransactionType;
  color?: string;
  icon?: string;
};

export type Summary = {
  total_income: number;
  total_expense: number;
  net_savings: number;
  transaction_count: number;
};
