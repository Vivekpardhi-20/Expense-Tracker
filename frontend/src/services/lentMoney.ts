import apiClient from './api';
import { LentMoney } from '../types';
import { dashboardParams } from '../utils/dateFilters';

export const lentMoneyService = {
  list: async (month?: string) => {
    const response = await apiClient.get<LentMoney[]>('/api/lent-money', {
      params: month ? dashboardParams(month) : undefined,
    });
    return response.data;
  },
  create: async (data: {
    person_name: string;
    amount: number;
    payment_mode: string;
    given_date: string;
    expected_return_date?: string;
    notes?: string;
  }) => {
    const response = await apiClient.post<LentMoney>('/api/lent-money', data);
    return response.data;
  },
  markReturned: async (id: string) => {
    const response = await apiClient.post<LentMoney>(`/api/lent-money/${id}/mark-returned`);
    return response.data;
  },
  delete: async (id: string) => {
    await apiClient.delete(`/api/lent-money/${id}`);
  },
};
