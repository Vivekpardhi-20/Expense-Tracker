import React from 'react';
import { ArrowDown, ArrowUp, BarChart3, PiggyBank, TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import { DashboardHistoryType } from '../types';

interface StatCardProps {
  title: string;
  amount: string;
  change: number;
  icon: React.ReactNode;
  bgColor: string;
  iconColor: string;
  onClick: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ title, amount, change, icon, bgColor, iconColor, onClick }) => {
  const isPositive = change > 0;

  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-lg border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <div className="mb-4 flex items-center gap-4">
        <div className={`${bgColor} ${iconColor} rounded-full p-3`}>{icon}</div>
        <h3 className="text-sm font-medium text-slate-600">{title}</h3>
      </div>
      <p className="mb-2 text-3xl font-bold tracking-tight text-slate-950">{amount}</p>
      <p className={`flex items-center gap-1 text-sm ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
        {isPositive ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />}
        {Math.abs(change).toFixed(1)}% from last month
      </p>
    </button>
  );
};

interface DashboardStatsProps {
  stats: {
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
  };
  onCardClick: (type: DashboardHistoryType) => void;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats, onCardClick }) => {
  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
      <StatCard
        title="Total Expenses"
        amount={`Rs. ${stats.total_expenses.toLocaleString('en-IN')}`}
        change={stats.expenses_change_percent}
        icon={<TrendingDown className="h-5 w-5" />}
        bgColor="bg-red-100"
        iconColor="text-red-500"
        onClick={() => onCardClick('expenses')}
      />
      <StatCard
        title="Total Income"
        amount={`Rs. ${stats.total_income.toLocaleString('en-IN')}`}
        change={stats.income_change_percent}
        icon={<TrendingUp className="h-5 w-5" />}
        bgColor="bg-emerald-100"
        iconColor="text-emerald-600"
        onClick={() => onCardClick('income')}
      />
      <StatCard
        title="Savings"
        amount={`Rs. ${stats.savings.toLocaleString('en-IN')}`}
        change={stats.savings_change_percent}
        icon={<Wallet className="h-5 w-5" />}
        bgColor="bg-blue-100"
        iconColor="text-blue-600"
        onClick={() => onCardClick('savings')}
      />
      <StatCard
        title="Receivable Amount"
        amount={`Rs. ${stats.receivable_amount.toLocaleString('en-IN')}`}
        change={0}
        icon={<Wallet className="h-5 w-5" />}
        bgColor="bg-cyan-100"
        iconColor="text-cyan-600"
        onClick={() => onCardClick('receivable')}
      />
      <StatCard
        title="Total Investments"
        amount={`Rs. ${stats.total_investments.toLocaleString('en-IN')}`}
        change={0}
        icon={<PiggyBank className="h-5 w-5" />}
        bgColor="bg-amber-100"
        iconColor="text-amber-600"
        onClick={() => onCardClick('investments')}
      />
      <StatCard
        title="Total Transactions"
        amount={`${stats.total_transactions}`}
        change={stats.transactions_change_percent}
        icon={<BarChart3 className="h-5 w-5" />}
        bgColor="bg-violet-100"
        iconColor="text-violet-600"
        onClick={() => onCardClick('transactions')}
      />
    </div>
  );
};
