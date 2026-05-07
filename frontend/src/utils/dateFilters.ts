export interface MonthFilterParams {
  month: number;
  year: number;
}

export const currentMonthKey = () => new Date().toISOString().slice(0, 7);

export const parseMonthKey = (value: string): MonthFilterParams => {
  const [year, month] = value.split('-').map(Number);
  return { month, year };
};

export const formatMonthLabel = (value: string) => {
  const { month, year } = parseMonthKey(value);
  return new Date(year, month - 1, 1).toLocaleString('en-US', {
    month: 'long',
    year: 'numeric',
  });
};

export const dashboardParams = (value: string) => parseMonthKey(value);
