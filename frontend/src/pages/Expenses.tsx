import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Edit2, Trash2, X } from 'lucide-react';
import { Header } from '../components/Header';
import { expenseService } from '../services/expense';
import { investmentService } from '../services/investment';
import { lentMoneyService } from '../services/lentMoney';
import { Expense, Investment, LentMoney } from '../types';

type LedgerType = 'Expense' | 'Money Lent' | 'Investment';

type LedgerRow =
  | { id: string; type: 'Expense'; date: string; title: string; category: string; mode: string; amount: number; status: string; source: Expense }
  | { id: string; type: 'Money Lent'; date: string; title: string; category: string; mode: string; amount: number; status: string; source: LentMoney }
  | { id: string; type: 'Investment'; date: string; title: string; category: string; mode: string; amount: number; status: string; source: Investment };

const toDateInput = (value: string) => new Date(value).toISOString().slice(0, 10);
const toDateTime = (value: string) => `${value}T00:00:00`;

export const Expenses: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [lentMoney, setLentMoney] = useState<LentMoney[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [editing, setEditing] = useState<LedgerRow | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});

  const loadLedger = async () => {
    try {
      setLoading(true);
      const [expenseData, lentData, investmentData] = await Promise.all([
        expenseService.getExpenses(selectedMonth),
        lentMoneyService.list(selectedMonth),
        investmentService.list(selectedMonth),
      ]);
      setExpenses(expenseData);
      setLentMoney(lentData);
      setInvestments(investmentData);
    } catch (error) {
      console.error('Error fetching ledger:', error);
      setExpenses([]);
      setLentMoney([]);
      setInvestments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLedger();
  }, [selectedMonth]);

  const rows = useMemo<LedgerRow[]>(() => {
    const expenseRows: LedgerRow[] = expenses.map((expense) => ({
      id: expense.id,
      type: 'Expense',
      date: expense.date,
      title: expense.title || expense.description || 'Expense',
      category: expense.category_id,
      mode: expense.payment_mode,
      amount: expense.amount,
      status: 'Recorded',
      source: expense,
    }));

    const lentRows: LedgerRow[] = lentMoney.map((entry) => ({
      id: entry.id,
      type: 'Money Lent',
      date: entry.given_date,
      title: entry.notes || `Money lent to ${entry.person_name}`,
      category: entry.person_name,
      mode: entry.payment_mode,
      amount: entry.amount,
      status: entry.status,
      source: entry,
    }));

    const investmentRows: LedgerRow[] = investments.map((investment) => ({
      id: investment.id,
      type: 'Investment',
      date: investment.purchase_date,
      title: investment.investment_name,
      category: investment.investment_type,
      mode: investment.broker_name || '-',
      amount: investment.amount_invested,
      status: 'Invested',
      source: investment,
    }));

    return [...expenseRows, ...lentRows, ...investmentRows].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [expenses, investments, lentMoney]);

  const startEdit = (row: LedgerRow) => {
    setEditing(row);
    if (row.type === 'Expense') {
      setForm({
        title: row.source.title || row.source.description || '',
        amount: String(row.source.amount),
        date: toDateInput(row.source.date),
        category_id: row.source.category_id,
        payment_mode: row.source.payment_mode,
        notes: row.source.notes || '',
      });
    } else if (row.type === 'Money Lent') {
      setForm({
        person_name: row.source.person_name,
        amount: String(row.source.amount),
        given_date: toDateInput(row.source.given_date),
        payment_mode: row.source.payment_mode,
        expected_return_date: row.source.expected_return_date ? toDateInput(row.source.expected_return_date) : '',
        notes: row.source.notes || '',
      });
    } else {
      setForm({
        investment_type: row.source.investment_type,
        investment_name: row.source.investment_name,
        amount_invested: String(row.source.amount_invested),
        quantity: row.source.quantity ? String(row.source.quantity) : '',
        broker_name: row.source.broker_name || '',
        purchase_date: toDateInput(row.source.purchase_date),
        notes: row.source.notes || '',
      });
    }
  };

  const deleteRow = async (row: LedgerRow) => {
    if (!window.confirm(`Delete this ${row.type} entry?`)) return;
    if (row.type === 'Expense') await expenseService.deleteExpense(row.id);
    if (row.type === 'Money Lent') await lentMoneyService.delete(row.id);
    if (row.type === 'Investment') await investmentService.delete(row.id);
    await loadLedger();
  };

  const markReturned = async (row: LedgerRow) => {
    if (row.type !== 'Money Lent') return;
    await lentMoneyService.markReturned(row.id);
    await loadLedger();
  };

  const submitEdit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!editing) return;

    if (editing.type === 'Expense') {
      await expenseService.updateExpense(editing.id, {
        ...editing.source,
        title: form.title,
        amount: Number(form.amount),
        date: toDateTime(form.date),
        category_id: form.category_id,
        payment_mode: form.payment_mode,
        notes: form.notes,
        description: form.title,
      });
    } else if (editing.type === 'Money Lent') {
      await lentMoneyService.update(editing.id, {
        person_name: form.person_name,
        amount: Number(form.amount),
        payment_mode: form.payment_mode,
        given_date: toDateTime(form.given_date),
        expected_return_date: form.expected_return_date ? toDateTime(form.expected_return_date) : undefined,
        notes: form.notes,
      });
    } else {
      await investmentService.update(editing.id, {
        investment_type: form.investment_type,
        investment_name: form.investment_name,
        amount_invested: Number(form.amount_invested),
        quantity: form.quantity ? Number(form.quantity) : undefined,
        broker_name: form.broker_name,
        purchase_date: toDateTime(form.purchase_date),
        notes: form.notes,
      });
    }

    setEditing(null);
    setForm({});
    await loadLedger();
  };

  return (
    <div className="min-h-screen">
      <Header title="Expenses" subtitle="Complete outflow ledger for expenses, money lent, and investments." selectedMonth={selectedMonth} onDateRangeChange={setSelectedMonth} />
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-950">Expense Ledger</h1>
          <p className="mt-1 text-sm text-slate-500">Manage every money outflow that affects expenses and savings.</p>
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600" />
              <p className="text-slate-600">Loading ledger...</p>
            </div>
          </div>
        ) : rows.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-200 bg-white p-10 text-center shadow-sm">
            <p className="font-semibold text-slate-800">No money-outflow entries found for this month</p>
            <p className="mt-1 text-sm text-slate-500">Expenses, money lent, and investments will appear here.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1080px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    {['Date', 'Type', 'Title / Name', 'Category / Investment Type / Person Name', 'Mode / Platform', 'Amount', 'Status', 'Actions'].map((heading) => (
                      <th key={heading} className="px-4 py-4 text-left text-sm font-semibold text-slate-900">{heading}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rows.map((row) => (
                    <tr key={`${row.type}-${row.id}`} className="transition-colors hover:bg-slate-50">
                      <td className="px-4 py-4 text-sm text-slate-600">{new Date(row.date).toLocaleDateString()}</td>
                      <td className="px-4 py-4"><TypeBadge type={row.type} /></td>
                      <td className="px-4 py-4 text-sm font-medium text-slate-900">{row.title}</td>
                      <td className="px-4 py-4 text-sm text-slate-600">{row.category}</td>
                      <td className="px-4 py-4 text-sm text-slate-600">{row.mode}</td>
                      <td className="px-4 py-4 text-sm font-bold text-red-600">-Rs. {row.amount.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-4 text-sm text-slate-600">{row.status}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => startEdit(row)} className="rounded-lg p-2 text-blue-600 transition-colors hover:bg-blue-50" aria-label={`Edit ${row.type}`}>
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button onClick={() => deleteRow(row)} className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50" aria-label={`Delete ${row.type}`}>
                            <Trash2 className="h-4 w-4" />
                          </button>
                          {row.type === 'Money Lent' && row.status === 'PENDING' && (
                            <button onClick={() => markReturned(row)} className="rounded-lg p-2 text-emerald-600 transition-colors hover:bg-emerald-50" aria-label="Mark returned">
                              <CheckCircle2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <form onSubmit={submitEdit} className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-950">Edit {editing.type}</h2>
              <button type="button" onClick={() => setEditing(null)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Close edit form">
                <X className="h-5 w-5" />
              </button>
            </div>
            <EditFields type={editing.type} form={form} setForm={setForm} />
            <button className="mt-5 w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700">Save Changes</button>
          </form>
        </div>
      )}
    </div>
  );
};

const TypeBadge = ({ type }: { type: LedgerType }) => {
  const classes = {
    Expense: 'bg-red-50 text-red-700',
    'Money Lent': 'bg-cyan-50 text-cyan-700',
    Investment: 'bg-amber-50 text-amber-700',
  }[type];
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${classes}`}>{type}</span>;
};

const EditFields = ({ type, form, setForm }: { type: LedgerType; form: Record<string, string>; setForm: React.Dispatch<React.SetStateAction<Record<string, string>>> }) => {
  const input = (name: string, label: string, inputType = 'text') => (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-slate-700">{label}</span>
      <input type={inputType} value={form[name] || ''} onChange={(event) => setForm((current) => ({ ...current, [name]: event.target.value }))} className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
    </label>
  );

  if (type === 'Expense') {
    return <div className="grid gap-4 sm:grid-cols-2">{input('title', 'Title')}{input('amount', 'Amount', 'number')}{input('date', 'Expense Date', 'date')}{input('category_id', 'Category ID')}{input('payment_mode', 'Payment Mode')}{input('notes', 'Notes')}</div>;
  }
  if (type === 'Money Lent') {
    return <div className="grid gap-4 sm:grid-cols-2">{input('person_name', 'Person Name')}{input('amount', 'Amount', 'number')}{input('given_date', 'Given Date', 'date')}{input('expected_return_date', 'Expected Return Date', 'date')}{input('payment_mode', 'Payment Mode')}{input('notes', 'Notes')}</div>;
  }
  return <div className="grid gap-4 sm:grid-cols-2">{input('investment_type', 'Investment Type')}{input('investment_name', 'Investment Name')}{input('amount_invested', 'Amount Invested', 'number')}{input('quantity', 'Units / Quantity', 'number')}{input('purchase_date', 'Purchase Date', 'date')}{input('broker_name', 'Broker / Platform')}{input('notes', 'Notes')}</div>;
};
