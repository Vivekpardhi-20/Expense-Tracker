import apiClient from './api';
import { BudgetDetail } from '../types';
import { dashboardParams } from '../utils/dateFilters';

export const budgetService = {
  list: async (month?: string) => {
    const response = await apiClient.get<BudgetDetail[]>('/api/budgets', { params: month ? dashboardParams(month) : undefined });
    return response.data;
  },
  create: async (data: { category_id: string; category_name?: string; limit_amount: number; amount?: number; month: string; year?: number }) => {
    const response = await apiClient.post<BudgetDetail>('/api/budgets', data);
    return response.data;
  },
  update: async (id: string, data: { category_id: string; category_name?: string; limit_amount: number; amount?: number; month: string; year?: number }) => {
    const response = await apiClient.put<BudgetDetail>(`/api/budgets/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => apiClient.delete(`/api/budgets/${id}`),
};
