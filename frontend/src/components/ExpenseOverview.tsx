import React from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface ExpenseOverviewProps {
  data: Array<{
    date: string;
    amount: number;
  }>;
}

export const ExpenseOverview: React.FC<ExpenseOverviewProps> = ({ data }) => {
  const chartData = data.length ? data : [{ date: 'No data', amount: 0 }];

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-950">Expense Overview</h2>
        <select className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-500">
          <option>This Month</option>
        </select>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="expenseLine" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity={0.18} />
              <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis dataKey="date" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis
            stroke="#64748b"
            tick={{ fill: '#64748b', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `Rs. ${Number(value) / 1000}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              boxShadow: '0 12px 30px rgba(15, 23, 42, 0.12)',
            }}
            formatter={(value: number) => [`Rs. ${value.toLocaleString('en-IN')}`, 'Spent']}
          />
          <Line
            type="monotone"
            dataKey="amount"
            stroke="#2563eb"
            strokeWidth={3}
            dot={{ fill: '#ffffff', stroke: '#2563eb', strokeWidth: 2, r: 4 }}
            activeDot={{ fill: '#2563eb', r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
      {!data.length && <p className="mt-3 text-center text-sm text-slate-500">No expenses added for this month yet.</p>}
    </div>
  );
};
