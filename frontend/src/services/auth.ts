import apiClient from './api';

export const authService = {
  login: async (email: string, password: string) => {
    const response = await apiClient.post('/api/auth/login', { email, password });
    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token);
    }
    return response.data;
  },

  register: async (data: {
    username: string;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
  }) => {
    const response = await apiClient.post('/api/auth/register', data);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('access_token');
  },

  getCurrentUser: async () => {
    const response = await apiClient.get('/api/auth/me');
    return response.data;
  },
};
