import React from 'react';
import { Banknote, Receipt } from 'lucide-react';

interface RecentTransaction {
  id: string;
  type: 'expense' | 'income' | 'lent' | 'money_returned' | 'investment';
  category: string;
  amount: number;
  date: string;
  title: string;
  description: string;
}

interface RecentTransactionsProps {
  transactions: RecentTransaction[];
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions }) => {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-950">Recent Transactions</h2>
        <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">View All</button>
      </div>
      {transactions.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
          <p className="font-semibold text-slate-800">No transactions found for this month</p>
          <p className="mt-1 text-sm text-slate-500">Add backdated or current transactions to see activity here.</p>
        </div>
      ) : (
      <div className="divide-y divide-slate-100">
        {transactions.map((transaction) => {
          const isExpenseLike = transaction.type === 'expense' || transaction.type === 'lent' || transaction.type === 'investment';

          return (
            <div key={`${transaction.type}-${transaction.id}`} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
              <div className="flex min-w-0 items-center gap-3">
                <div className={`rounded-lg p-2 ${isExpenseLike ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                  {isExpenseLike ? <Receipt className="h-5 w-5" /> : <Banknote className="h-5 w-5" />}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-950">{transaction.title || transaction.description}</p>
                  <p className="truncate text-sm text-slate-500">
                    {transaction.category} | {transaction.date}
                  </p>
                </div>
              </div>
              <p className={`shrink-0 text-right font-bold ${isExpenseLike ? 'text-red-600' : 'text-emerald-600'}`}>
                {isExpenseLike ? '-' : '+'}Rs. {transaction.amount.toLocaleString('en-IN')}
              </p>
            </div>
          );
        })}
      </div>
      )}
    </div>
  );
};
