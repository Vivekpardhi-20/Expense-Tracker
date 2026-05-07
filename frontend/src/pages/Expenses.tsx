import React, { useEffect, useState } from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { Header } from '../components/Header';
import { expenseService } from '../services/expense';
import { Expense } from '../types';

export const Expenses: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        setLoading(true);
        setExpenses(await expenseService.getExpenses(selectedMonth));
      } catch (error) {
        console.error('Error fetching expenses:', error);
        setExpenses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [selectedMonth]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await expenseService.deleteExpense(id);
        setExpenses((current) => current.filter((expense) => expense.id !== id));
      } catch (error) {
        console.error('Error deleting expense:', error);
      }
    }
  };

  return (
    <div className="min-h-screen">
      <Header title="Expenses" subtitle="Audit every recorded expense for the selected month." />
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-2xl font-bold text-slate-950">Expense Ledger</h1>
            <p className="mt-1 text-sm text-slate-500">Filter, review, edit, or remove entries.</p>
          </div>
          <input type="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
              <p className="text-slate-600">Loading expenses...</p>
            </div>
          </div>
        ) : expenses.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-200 bg-white p-10 text-center shadow-sm">
            <p className="font-semibold text-slate-800">No expenses added yet</p>
            <p className="mt-1 text-sm text-slate-500">Add an expense to start building your ledger.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Title</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Category</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Mode</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-slate-900">Amount</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {expenses.map((expense) => (
                    <tr key={expense.id} className="transition-colors hover:bg-slate-50">
                      <td className="px-6 py-4 text-sm text-slate-600">{new Date(expense.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{expense.title || expense.description || 'Expense'}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{expense.category_id}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{expense.payment_mode}</td>
                      <td className="px-6 py-4 text-right text-sm font-bold text-red-600">-Rs. {expense.amount.toLocaleString('en-IN')}</td>
                      <td className="px-6 py-4 text-center">
                        <button className="mr-2 rounded-lg p-2 text-blue-600 transition-colors hover:bg-blue-50" aria-label="Edit expense">
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(expense.id)} className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50" aria-label="Delete expense">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
