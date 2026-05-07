import apiClient from './api';
import { Investment } from '../types';
import { dashboardParams } from '../utils/dateFilters';

export const investmentService = {
  list: async (month?: string) => {
    const response = await apiClient.get<Investment[]>('/api/investments', {
      params: month ? dashboardParams(month) : undefined,
    });
    return response.data;
  },
  create: async (data: {
    investment_type: string;
    investment_name: string;
    amount_invested: number;
    quantity?: number;
    broker_name?: string;
    purchase_date: string;
    notes?: string;
  }) => {
    const response = await apiClient.post<Investment>('/api/investments', data);
    return response.data;
  },
  update: async (id: string, data: {
    investment_type: string;
    investment_name: string;
    amount_invested: number;
    quantity?: number;
    broker_name?: string;
    purchase_date: string;
    notes?: string;
  }) => {
    const response = await apiClient.put<Investment>(`/api/investments/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    await apiClient.delete(`/api/investments/${id}`);
  },
};
