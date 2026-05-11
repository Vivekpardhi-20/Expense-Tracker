import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Edit2, Loader2, Trash2, X } from 'lucide-react';
import { dashboardService } from '../services/dashboard';
import { expenseService } from '../services/expense';
import { incomeService } from '../services/income';
import { investmentService } from '../services/investment';
import { lentMoneyService } from '../services/lentMoney';
import { DashboardHistoryItem, DashboardHistoryType } from '../types';

const historyTitles: Record<DashboardHistoryType, string> = {
  expenses: 'Total Expenses History',
  income: 'Total Income History',
  savings: 'Savings Ledger',
  receivable: 'Receivable History',
  investments: 'Investment History',
  transactions: 'All Money Movements',
};

const negativeImpacts = new Set(['EXPENSE', 'MONEY_LENT', 'INVESTMENT']);

const toDateInput = (value: string) => new Date(value).toISOString().slice(0, 10);
const toDateTime = (value: string) => `${value}T00:00:00`;

interface DashboardHistoryModalProps {
  type: DashboardHistoryType;
  month: string;
  onClose: () => void;
  onChanged: () => void;
}

export const DashboardHistoryModal: React.FC<DashboardHistoryModalProps> = ({ type, month, onClose, onChanged }) => {
  const [rows, setRows] = useState<DashboardHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState<DashboardHistoryItem | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});

  const loadHistory = async () => {
    try {
      setLoading(true);
      setError('');
      setRows(await dashboardService.getHistory(type, month));
    } catch (loadError) {
      console.error('Unable to load dashboard history:', loadError);
      setError('Unable to load history right now.');
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [type, month]);

  const totalImpact = useMemo(
    () => rows.reduce((sum, row) => sum + (negativeImpacts.has(row.impact) ? -row.amount : row.amount), 0),
    [rows],
  );

  const startEdit = (row: DashboardHistoryItem) => {
    if (row.type === 'Money Returned') return;
    setEditing(row);
    setForm({
      title: row.title,
      category: row.source_category_id || row.category,
      amount: String(row.amount),
      date: toDateInput(row.date),
      mode: row.mode || '',
      notes: row.notes || '',
    });
  };

  const deleteRow = async (row: DashboardHistoryItem) => {
    const label = row.type === 'Money Returned' ? 'linked money lent entry' : row.type.toLowerCase();
    if (!window.confirm(`Delete this ${label}?`)) return;
    if (row.source_type === 'expense') await expenseService.deleteExpense(row.source_id);
    if (row.source_type === 'income') await incomeService.deleteIncome(row.source_id);
    if (row.source_type === 'lent_money') await lentMoneyService.delete(row.source_id);
    if (row.source_type === 'investment') await investmentService.delete(row.source_id);
    await loadHistory();
    onChanged();
  };

  const markReturned = async (row: DashboardHistoryItem) => {
    if (row.source_type !== 'lent_money') return;
    await lentMoneyService.markReturned(row.source_id);
    await loadHistory();
    onChanged();
  };

  const submitEdit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!editing) return;

    if (editing.source_type === 'expense') {
      await expenseService.updateExpense(editing.source_id, {
        category_id: form.category,
        title: form.title,
        amount: Number(form.amount),
        date: toDateTime(form.date),
        description: form.title,
        notes: form.notes,
        payment_mode: form.mode,
      });
    }

    if (editing.source_type === 'income') {
      await incomeService.updateIncome(editing.source_id, {
        source: form.category,
        title: form.title,
        amount: Number(form.amount),
        date: toDateTime(form.date),
        description: form.notes,
        notes: form.notes,
      });
    }

    if (editing.source_type === 'lent_money') {
      await lentMoneyService.update(editing.source_id, {
        person_name: form.category,
        amount: Number(form.amount),
        payment_mode: form.mode,
        given_date: toDateTime(form.date),
        notes: form.notes,
      });
    }

    if (editing.source_type === 'investment') {
      await investmentService.update(editing.source_id, {
        investment_type: form.category,
        investment_name: form.title,
        amount_invested: Number(form.amount),
        broker_name: form.mode,
        purchase_date: toDateTime(form.date),
        notes: form.notes,
      });
    }

    setEditing(null);
    setForm({});
    await loadHistory();
    onChanged();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-0 sm:items-center sm:p-4">
      <div className="flex max-h-[92vh] w-full max-w-6xl flex-col rounded-t-lg bg-white shadow-2xl sm:rounded-lg">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4 sm:px-6">
          <div>
            <h2 className="text-lg font-bold text-slate-950">{historyTitles[type]}</h2>
            <p className="mt-1 text-sm text-slate-500">
              {new Date(`${month}-01T00:00:00`).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
              {rows.length > 0 && <span> · Net impact Rs. {Math.abs(totalImpact).toLocaleString('en-IN')}</span>}
            </p>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Close history">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-auto p-4 sm:p-6">
          {loading ? (
            <div className="flex h-56 items-center justify-center text-slate-600">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Loading history...
            </div>
          ) : error ? (
            <div className="rounded-lg border border-red-100 bg-red-50 p-5 text-sm font-medium text-red-700">{error}</div>
          ) : rows.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-200 p-10 text-center">
              <p className="font-semibold text-slate-800">No transactions found for this month</p>
              <p className="mt-1 text-sm text-slate-500">Money movements for this card will appear here.</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg border border-slate-200">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1080px]">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      {['Date', 'Type', 'Title / Name', 'Category / Person / Investment Type', 'Payment Mode / Platform', 'Amount', 'Impact', 'Status', 'Actions'].map((heading) => (
                        <th key={heading} className="px-4 py-3 text-left text-sm font-semibold text-slate-900">{heading}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {rows.map((row) => {
                      const isNegative = negativeImpacts.has(row.impact);
                      return (
                        <tr key={row.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 text-sm text-slate-600">{new Date(row.date).toLocaleDateString()}</td>
                          <td className="px-4 py-3"><MovementBadge type={row.type} /></td>
                          <td className="px-4 py-3 text-sm font-medium text-slate-900">{row.title}</td>
                          <td className="px-4 py-3 text-sm text-slate-600">{row.category}</td>
                          <td className="px-4 py-3 text-sm text-slate-600">{row.mode || '-'}</td>
                          <td className={`px-4 py-3 text-sm font-bold ${isNegative ? 'text-red-600' : 'text-emerald-600'}`}>
                            {isNegative ? '-' : '+'}Rs. {row.amount.toLocaleString('en-IN')}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600">{row.impact}</td>
                          <td className="px-4 py-3 text-sm text-slate-600">{row.status || '-'}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              {row.type !== 'Money Returned' && (
                                <button onClick={() => startEdit(row)} className="rounded-lg p-2 text-blue-600 hover:bg-blue-50" aria-label={`Edit ${row.type}`}>
                                  <Edit2 className="h-4 w-4" />
                                </button>
                              )}
                              <button onClick={() => deleteRow(row)} className="rounded-lg p-2 text-red-600 hover:bg-red-50" aria-label={`Delete ${row.type}`}>
                                <Trash2 className="h-4 w-4" />
                              </button>
                              {row.type === 'Money Lent' && row.status === 'PENDING' && (
                                <button onClick={() => markReturned(row)} className="rounded-lg p-2 text-emerald-600 hover:bg-emerald-50" aria-label="Mark returned">
                                  <CheckCircle2 className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {editing && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-4">
          <form onSubmit={submitEdit} className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-950">Edit {editing.type}</h3>
              <button type="button" onClick={() => setEditing(null)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Close edit form">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <HistoryInput label="Title / Name" name="title" form={form} setForm={setForm} />
              <HistoryInput label="Amount" name="amount" type="number" form={form} setForm={setForm} />
              <HistoryInput label="Date" name="date" type="date" form={form} setForm={setForm} />
              <HistoryInput label="Category / Person / Investment Type" name="category" form={form} setForm={setForm} />
              <HistoryInput label="Payment Mode / Platform" name="mode" form={form} setForm={setForm} />
              <HistoryInput label="Notes" name="notes" form={form} setForm={setForm} />
            </div>
            <button className="mt-5 w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700">Save Changes</button>
          </form>
        </div>
      )}
    </div>
  );
};

const MovementBadge = ({ type }: { type: DashboardHistoryItem['type'] }) => {
  const classes: Record<DashboardHistoryItem['type'], string> = {
    Expense: 'bg-red-50 text-red-700',
    Income: 'bg-emerald-50 text-emerald-700',
    'Money Lent': 'bg-cyan-50 text-cyan-700',
    'Money Returned': 'bg-green-50 text-green-700',
    Investment: 'bg-amber-50 text-amber-700',
  };
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${classes[type]}`}>{type}</span>;
};

const HistoryInput = ({
  label,
  name,
  type = 'text',
  form,
  setForm,
}: {
  label: string;
  name: string;
  type?: string;
  form: Record<string, string>;
  setForm: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}) => (
  <label className="block">
    <span className="mb-1 block text-sm font-semibold text-slate-700">{label}</span>
    <input
      type={type}
      value={form[name] || ''}
      onChange={(event) => setForm((current) => ({ ...current, [name]: event.target.value }))}
      className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
    />
  </label>
);
