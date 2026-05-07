import apiClient from './api';
import { Income } from '../types';

export const incomeService = {
  createIncome: async (data: {
    source: string;
    title?: string;
    amount: number;
    date: string;
    description?: string;
    notes?: string;
  }) => {
    const response = await apiClient.post<Income>('/api/income', data);
    return response.data;
  },

  getIncome: async (month?: string) => {
    const response = await apiClient.get<Income[]>('/api/income', {
      params: { month },
    });
    return response.data;
  },

  deleteIncome: async (id: string) => {
    await apiClient.delete(`/api/income/${id}`);
  },
};
