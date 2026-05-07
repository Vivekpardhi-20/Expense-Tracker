import apiClient from './api';
import { Goal } from '../types';

export const goalService = {
  list: async () => (await apiClient.get<Goal[]>('/api/goals')).data,
  create: async (data: { name: string; target_amount: number; current_amount: number; target_date: string; status: string; notes?: string }) => (await apiClient.post<Goal>('/api/goals', data)).data,
  update: async (id: string, data: { name: string; target_amount: number; current_amount: number; target_date: string; status: string; notes?: string }) => (await apiClient.put<Goal>(`/api/goals/${id}`, data)).data,
  contribute: async (id: string, data: { amount: number; contribution_date: string; notes?: string }) => (await apiClient.post<Goal>(`/api/goals/${id}/contribute`, data)).data,
  delete: async (id: string) => apiClient.delete(`/api/goals/${id}`),
};
