import React from 'react';
import { Bus, Clapperboard, FileText, ShoppingBag, Utensils } from 'lucide-react';

interface BudgetItem {
  category: string;
  spent: number;
  limit: number;
  percentage: number;
}

interface BudgetOverviewProps {
  budgets: BudgetItem[];
}

const categoryStyles = [
  { color: 'bg-blue-600', iconBg: 'bg-blue-50 text-blue-600', icon: Utensils },
  { color: 'bg-emerald-500', iconBg: 'bg-emerald-50 text-emerald-600', icon: Bus },
  { color: 'bg-amber-500', iconBg: 'bg-amber-50 text-amber-600', icon: ShoppingBag },
  { color: 'bg-violet-500', iconBg: 'bg-violet-50 text-violet-600', icon: FileText },
  { color: 'bg-pink-500', iconBg: 'bg-pink-50 text-pink-600', icon: Clapperboard },
];

export const BudgetOverview: React.FC<BudgetOverviewProps> = ({ budgets }) => {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-950">Budget Overview</h2>
        <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">View All</button>
      </div>
      {budgets.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
          <p className="font-semibold text-slate-800">No budgets configured yet</p>
          <p className="mt-1 text-sm text-slate-500">Create category budgets to monitor monthly limits.</p>
        </div>
      ) : (
      <div className="space-y-5">
        {budgets.map((budget, index) => {
          const style = categoryStyles[index % categoryStyles.length];
          const Icon = style.icon;

          return (
            <div key={budget.category} className="grid gap-3 sm:grid-cols-[170px_1fr_140px_48px] sm:items-center">
              <div className="flex items-center gap-3">
                <span className={`rounded-lg p-2 ${style.iconBg}`}>
                  <Icon className="h-5 w-5" />
                </span>
                <p className="font-medium text-slate-900">{budget.category}</p>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div className={`h-full rounded-full ${style.color}`} style={{ width: `${Math.min(budget.percentage, 100)}%` }} />
              </div>
              <p className="text-sm text-slate-500">
                <span className="font-semibold text-slate-900">Rs. {budget.spent.toLocaleString('en-IN')}</span> / Rs.{' '}
                {budget.limit.toLocaleString('en-IN')}
              </p>
              <p className="text-sm font-semibold text-orange-600">{budget.percentage.toFixed(0)}%</p>
            </div>
          );
        })}
      </div>
      )}
    </div>
  );
};
