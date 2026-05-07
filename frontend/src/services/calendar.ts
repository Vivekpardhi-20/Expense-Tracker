import apiClient from './api';
import { CalendarDay } from '../types';

export const calendarService = {
  month: async (month: number, year: number) => {
    const response = await apiClient.get<CalendarDay[]>('/api/calendar', { params: { month, year } });
    return response.data;
  },
  day: async (date: string) => {
    const response = await apiClient.get<CalendarDay>('/api/calendar/day', { params: { date } });
    return response.data;
  },
};
