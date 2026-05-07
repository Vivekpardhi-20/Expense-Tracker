import apiClient from './api';
import { Expense } from '../types';

export const expenseService = {
  createExpense: async (data: {
    category_id: string;
    title: string;
    amount: number;
    date: string;
    description?: string;
    notes?: string;
    payment_mode: string;
  }) => {
    const response = await apiClient.post<Expense>('/api/expenses', data);
    return response.data;
  },

  getExpenses: async (month?: string, category_id?: string) => {
    const response = await apiClient.get<Expense[]>('/api/expenses', {
      params: { month, category_id },
    });
    return response.data;
  },

  updateExpense: async (id: string, data: Partial<Expense>) => {
    const response = await apiClient.put<Expense>(`/api/expenses/${id}`, data);
    return response.data;
  },

  deleteExpense: async (id: string) => {
    await apiClient.delete(`/api/expenses/${id}`);
  },
};
