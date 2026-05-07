import React, { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { categoryService } from '../services/category';
import { Category } from '../types';

export const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    categoryService.getCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  const expenseCategories = categories.filter((category) => category.category_type === 'EXPENSE');
  const incomeCategories = categories.filter((category) => category.category_type === 'INCOME');

  const renderList = (items: Category[], empty: string) =>
    items.length ? (
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((category) => (
          <div key={category.id} className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
            {category.name}
          </div>
        ))}
      </div>
    ) : (
      <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">{empty}</div>
    );

  return (
    <div className="min-h-screen">
      <Header title="Categories" subtitle="Default and custom categories for expenses and income." />
      <main className="space-y-6 p-4 sm:p-6 lg:p-8">
        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-950">Expense Categories</h2>
          {renderList(expenseCategories, 'No expense categories found. New users receive defaults automatically.')}
        </section>
        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-950">Income Categories</h2>
          {renderList(incomeCategories, 'No income categories found. New users receive defaults automatically.')}
        </section>
      </main>
    </div>
  );
};
