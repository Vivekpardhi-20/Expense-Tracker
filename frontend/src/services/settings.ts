import apiClient from './api';
import { User, UserPreference } from '../types';

export const settingsService = {
  profile: async () => (await apiClient.get<User>('/api/settings/profile')).data,
  updateProfile: async (data: { first_name: string; last_name: string; username: string; email: string }) => (await apiClient.put<User>('/api/settings/profile', data)).data,
  updatePassword: async (data: { current_password: string; new_password: string }) => (await apiClient.put('/api/settings/password', data)).data,
  preferences: async () => (await apiClient.get<UserPreference>('/api/settings/preferences')).data,
  updatePreferences: async (data: { currency: string; theme: string; monthly_income_target: number; monthly_budget_target: number }) => (await apiClient.put<UserPreference>('/api/settings/preferences', data)).data,
};
