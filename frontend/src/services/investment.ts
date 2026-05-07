import apiClient from './api';
import { Investment } from '../types';
import { dashboardParams } from '../utils/dateFilters';

export const investmentService = {
  list: async (month?: string) => {
    const response = await apiClient.get<Investment[]>('/investments', {
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
    const response = await apiClient.post<Investment>('/investments', data);
    return response.data;
  },
  delete: async (id: string) => {
    await apiClient.delete(`/investments/${id}`);
  },
};
