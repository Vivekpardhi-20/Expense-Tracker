import apiClient from './api';
import { Category } from '../types';

export const categoryService = {
  getCategories: async (categoryType?: 'EXPENSE' | 'INCOME') => {
    const response = await apiClient.get<Category[]>('/api/categories', {
      params: { category_type: categoryType },
    });
    return response.data;
  },

  createCategory: async (data: { name: string; category_type?: 'EXPENSE' | 'INCOME'; icon?: string; color?: string }) => {
    const response = await apiClient.post<Category>('/api/categories', data);
    return response.data;
  },

  updateCategory: async (id: string, data: Partial<Category>) => {
    const response = await apiClient.put<Category>(`/api/categories/${id}`, data);
    return response.data;
  },

  deleteCategory: async (id: string) => {
    await apiClient.delete(`/api/categories/${id}`);
  },
};
