import apiClient from './api';
import { DashboardStats, DailyExpense, CategoryWiseExpense, BudgetStatus, Transaction } from '../types';
import { dashboardParams } from '../utils/dateFilters';

export const dashboardService = {
  getStats: async (month?: string) => {
    const response = await apiClient.get<DashboardStats>('/dashboard/stats', {
      params: month ? dashboardParams(month) : undefined,
    });
    return response.data;
  },

  getExpenseOverview: async (month?: string) => {
    const response = await apiClient.get<DailyExpense[]>('/dashboard/expense-overview', {
      params: month ? dashboardParams(month) : undefined,
    });
    return response.data;
  },

  getCategoryWiseExpenses: async (month?: string) => {
    const response = await apiClient.get<CategoryWiseExpense[]>('/dashboard/category-expenses', {
      params: month ? dashboardParams(month) : undefined,
    });
    return response.data;
  },

  getRecentTransactions: async (limit: number = 10, month?: string) => {
    const response = await apiClient.get<Transaction[]>('/dashboard/recent-transactions', {
      params: { limit, ...(month ? dashboardParams(month) : {}) },
    });
    return response.data;
  },

  getBudgetStatus: async (month?: string) => {
    const response = await apiClient.get<BudgetStatus[]>('/dashboard/budget-status', {
      params: month ? dashboardParams(month) : undefined,
    });
    return response.data;
  },
};
