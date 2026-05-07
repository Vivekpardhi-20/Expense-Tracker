import React from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

interface CategoryExpensesProps {
  data: Array<{
    name: string;
    value: number;
    percentage: number;
  }>;
}

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#94a3b8'];

export const CategoryExpenses: React.FC<CategoryExpensesProps> = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  if (!data.length) {
    return (
      <div className="h-full rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-950">Expenses by Category</h2>
          <select className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-500">
            <option>This Month</option>
          </select>
        </div>
        <div className="flex h-[260px] items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 text-center">
          <div>
            <p className="font-semibold text-slate-800">No category spending yet</p>
            <p className="mt-1 text-sm text-slate-500">Add an expense to build this chart.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-950">Expenses by Category</h2>
        <select className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-500">
          <option>This Month</option>
        </select>
      </div>
      <div className="grid items-center gap-4 xl:grid-cols-[220px_1fr]">
        <div className="relative h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={66} outerRadius={100} paddingAngle={2} dataKey="value">
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `Rs. ${value.toLocaleString('en-IN')}`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-2xl font-bold text-slate-950">Rs. {total.toLocaleString('en-IN')}</p>
            <p className="text-sm text-slate-500">Total</p>
          </div>
        </div>
        <div className="space-y-3">
          {data.map((item, index) => (
            <div key={item.name} className="grid grid-cols-[1fr_auto_auto] items-center gap-3 text-sm">
              <div className="flex min-w-0 items-center gap-3">
                <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="truncate font-medium text-slate-700">{item.name}</span>
              </div>
              <span className="font-semibold text-slate-950">Rs. {item.value.toLocaleString('en-IN')}</span>
              <span className="w-12 text-right text-slate-500">{item.percentage.toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
