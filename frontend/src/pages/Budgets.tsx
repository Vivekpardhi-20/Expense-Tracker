import React, { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { budgetService } from '../services/budget';
import { categoryService } from '../services/category';
import { BudgetDetail, Category } from '../types';

export const Budgets: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [budgets, setBudgets] = useState<BudgetDetail[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({ category_id: '', limit_amount: '', month: selectedMonth });

  const load = async () => {
    setBudgets(await budgetService.list(selectedMonth));
    setCategories(await categoryService.getCategories('EXPENSE'));
  };
  useEffect(() => { load().catch(console.error); }, [selectedMonth]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const category = categories.find((item) => item.id === form.category_id);
    await budgetService.create({ category_id: form.category_id, category_name: category?.name, limit_amount: Number(form.limit_amount), month: selectedMonth });
    setForm({ category_id: '', limit_amount: '', month: selectedMonth });
    await load();
  };

  return (
    <div className="min-h-screen">
      <Header title="Budgets" subtitle="Set monthly category limits and track usage." selectedMonth={selectedMonth} onDateRangeChange={setSelectedMonth} />
      <main className="space-y-6 p-4 sm:p-6 lg:p-8">
        <form onSubmit={submit} className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-[1fr_180px_140px]">
          <select required value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className="rounded-lg border border-slate-300 px-3 py-2">
            <option value="">Select category</option>
            {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
          </select>
          <input required type="number" min="1" placeholder="Budget amount" value={form.limit_amount} onChange={(e) => setForm({ ...form, limit_amount: e.target.value })} className="rounded-lg border border-slate-300 px-3 py-2" />
          <button className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white">Add Budget</button>
        </form>
        {budgets.length === 0 ? <Empty text="No budgets configured for this month." /> : (
          <div className="space-y-4">
            {budgets.map((budget) => (
              <div key={budget.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div><p className="font-semibold text-slate-950">{budget.category_name}</p><p className="text-sm text-slate-500">Spent Rs. {budget.spent.toLocaleString('en-IN')} of Rs. {budget.limit_amount.toLocaleString('en-IN')} | Remaining Rs. {budget.remaining.toLocaleString('en-IN')}</p></div>
                  <button onClick={() => budgetService.delete(budget.id).then(load)} className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600">Delete</button>
                </div>
                <div className="mt-4 h-2 rounded-full bg-slate-100"><div className="h-full rounded-full bg-blue-600" style={{ width: `${Math.min(budget.percentage, 100)}%` }} /></div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

const Empty = ({ text }: { text: string }) => <div className="rounded-lg border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm">{text}</div>;
