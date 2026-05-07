import React, { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { recurringService } from '../services/recurring';
import { RecurringTransaction } from '../types';

export const Recurring: React.FC = () => {
  const [items, setItems] = useState<RecurringTransaction[]>([]);
  const [form, setForm] = useState({ type: 'EXPENSE', title: '', amount: '', frequency: 'MONTHLY', next_due_date: new Date().toISOString().slice(0, 10), notes: '' });
  const load = () => recurringService.list().then(setItems).catch(console.error);
  useEffect(() => { load(); }, []);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await recurringService.create({ ...form, amount: Number(form.amount), start_date: `${form.next_due_date}T00:00:00`, next_due_date: `${form.next_due_date}T00:00:00`, status: 'ACTIVE' });
    setForm({ ...form, title: '', amount: '', notes: '' });
    load();
  };
  return <div className="min-h-screen"><Header title="Recurring" subtitle="Manage repeating expenses and income." /><main className="space-y-6 p-4 sm:p-6 lg:p-8"><form onSubmit={submit} className="grid gap-3 rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-5"><select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="rounded-lg border px-3 py-2"><option>EXPENSE</option><option>INCOME</option></select><input required placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="rounded-lg border px-3 py-2" /><input required type="number" placeholder="Amount" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="rounded-lg border px-3 py-2" /><select value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value })} className="rounded-lg border px-3 py-2"><option>DAILY</option><option>WEEKLY</option><option>MONTHLY</option><option>YEARLY</option></select><button className="rounded-lg bg-blue-600 text-white">Add</button></form>{items.length === 0 ? <Empty text="No recurring transactions yet." /> : <div className="grid gap-4">{items.map((item) => <div key={item.id} className="rounded-lg border bg-white p-5 shadow-sm"><div className="flex justify-between gap-3"><div><p className="font-semibold">{item.title}</p><p className="text-sm text-slate-500">{item.type} | {item.frequency} | next {new Date(item.next_due_date).toLocaleDateString()}</p></div><div className="space-x-2"><button onClick={() => recurringService.markPaid(item.id).then(load)} className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white">Mark Paid</button><button onClick={() => recurringService.delete(item.id).then(load)} className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600">Delete</button></div></div></div>)}</div>}</main></div>;
};
const Empty = ({ text }: { text: string }) => <div className="rounded-lg border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm">{text}</div>;
