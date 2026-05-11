import React, { useState, useEffect, useCallback } from 'react';
import { DashboardStats } from '../components/DashboardStats';
import { ExpenseOverview } from '../components/ExpenseOverview';
import { CategoryExpenses } from '../components/CategoryExpenses';
import { RecentTransactions } from '../components/RecentTransactions';
import { BudgetOverview } from '../components/BudgetOverview';
import { Header } from '../components/Header';
import { DashboardHistoryModal } from '../components/DashboardHistoryModal';
import { dashboardService } from '../services/dashboard';
import { DashboardHistoryType, DashboardStats as DashboardStatsType, DailyExpense, CategoryWiseExpense, Transaction, BudgetStatus } from '../types';

const emptyStats: DashboardStatsType = {
  total_expenses: 0,
  total_income: 0,
  savings: 0,
  receivable_amount: 0,
  total_investments: 0,
  total_transactions: 0,
  expenses_change_percent: 0,
  income_change_percent: 0,
  savings_change_percent: 0,
  transactions_change_percent: 0,
};

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStatsType | null>(null);
  const [expenses, setExpenses] = useState<DailyExpense[]>([]);
  const [categoryExpenses, setCategoryExpenses] = useState<CategoryWiseExpense[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<BudgetStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [historyType, setHistoryType] = useState<DashboardHistoryType | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [statsData, expenseData, categoryData, transactionData, budgetData] = await Promise.all([
        dashboardService.getStats(selectedMonth),
        dashboardService.getExpenseOverview(selectedMonth),
        dashboardService.getCategoryWiseExpenses(selectedMonth),
        dashboardService.getRecentTransactions(10, selectedMonth),
        dashboardService.getBudgetStatus(selectedMonth),
      ]);

      setStats(statsData);
      setExpenses(expenseData);
      setCategoryExpenses(categoryData);
      setTransactions(transactionData);
      setBudgets(budgetData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setStats(emptyStats);
      setExpenses([]);
      setCategoryExpenses([]);
      setTransactions([]);
      setBudgets([]);
    } finally {
      setLoading(false);
    }
  }, [selectedMonth]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading || !stats) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header selectedMonth={selectedMonth} onDateRangeChange={setSelectedMonth} />
      <main className="p-4 sm:p-6 lg:p-8">
        <DashboardStats stats={stats} onCardClick={setHistoryType} />
        <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-[1fr_520px]">
          <div className="min-w-0">
            <ExpenseOverview data={expenses} />
          </div>
          <div className="min-w-0">
            <CategoryExpenses data={categoryExpenses} />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <RecentTransactions transactions={transactions} />
          <BudgetOverview budgets={budgets} />
        </div>
      </main>
      {historyType && (
        <DashboardHistoryModal
          type={historyType}
          month={selectedMonth}
          onClose={() => setHistoryType(null)}
          onChanged={fetchData}
        />
      )}
    </div>
  );
};
