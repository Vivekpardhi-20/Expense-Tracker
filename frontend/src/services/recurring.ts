import apiClient from './api';
import { RecurringTransaction } from '../types';

export const recurringService = {
  list: async () => (await apiClient.get<RecurringTransaction[]>('/api/recurring')).data,
  create: async (data: Omit<RecurringTransaction, 'id' | 'user_id'>) => (await apiClient.post<RecurringTransaction>('/api/recurring', data)).data,
  update: async (id: string, data: Omit<RecurringTransaction, 'id' | 'user_id'>) => (await apiClient.put<RecurringTransaction>(`/api/recurring/${id}`, data)).data,
  markPaid: async (id: string) => (await apiClient.post<RecurringTransaction>(`/api/recurring/${id}/mark-paid`)).data,
  delete: async (id: string) => apiClient.delete(`/api/recurring/${id}`),
};
