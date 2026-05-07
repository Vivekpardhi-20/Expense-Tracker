import React, { useEffect, useState } from 'react';
import { Calendar, CreditCard, FileText, IndianRupee, Tag, Upload, X } from 'lucide-react';
import { Header } from '../components/Header';
import { categoryService } from '../services/category';
import { expenseService } from '../services/expense';
import { incomeService } from '../services/income';
import { investmentService } from '../services/investment';
import { lentMoneyService } from '../services/lentMoney';
import { Category } from '../types';

interface AddExpenseProps {
  onSaved?: () => void;
}

type EntryType = 'expense' | 'income' | 'lent' | 'returned' | 'investment';

const investmentTypes = ['Stocks', 'Mutual Funds', 'SIP', 'ETF', 'Gold', 'Crypto', 'FD', 'PPF', 'NPS', 'Bonds', 'Other'];

export const AddExpense: React.FC<AddExpenseProps> = ({ onSaved }) => {
  const [entryType, setEntryType] = useState<EntryType>('expense');
  const [formData, setFormData] = useState({
    category_id: '',
    new_category: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    title: '',
    notes: '',
    payment_mode: 'upi',
    person_name: '',
    expected_return_date: '',
    investment_type: 'Stocks',
    investment_name: '',
    quantity: '',
    broker_name: '',
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [receipt, setReceipt] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const fetchCategories = async () => {
    try {
      setCategories(await categoryService.getCategories('EXPENSE'));
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      category_id: '',
      new_category: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      title: '',
      notes: '',
      payment_mode: 'upi',
      person_name: '',
      expected_return_date: '',
      investment_type: 'Stocks',
      investment_name: '',
      quantity: '',
      broker_name: '',
    });
    setReceipt(null);
  };

  const resolveCategoryId = async () => {
    if (formData.category_id) {
      return formData.category_id;
    }

    const name = formData.new_category.trim();
    if (!name) {
      throw new Error('Choose or create a category.');
    }

    const category = await categoryService.createCategory({ name, category_type: 'EXPENSE' });
    await fetchCategories();
    return category.id;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const amount = parseFloat(formData.amount);

      if (entryType === 'expense') {
        const categoryId = await resolveCategoryId();
        await expenseService.createExpense({
          category_id: categoryId,
          title: formData.title,
          amount,
          date: `${formData.date}T00:00:00`,
          description: formData.title,
          notes: formData.notes,
          payment_mode: formData.payment_mode,
        });
        setMessage('Expense added successfully.');
      } else if (entryType === 'income' || entryType === 'returned') {
        await incomeService.createIncome({
          source: entryType === 'returned' ? 'Money Returned' : formData.title,
          title: formData.title,
          amount,
          date: `${formData.date}T00:00:00`,
          description: formData.title,
          notes: formData.notes,
        });
        setMessage(entryType === 'returned' ? 'Money returned income added successfully.' : 'Income added successfully.');
      } else if (entryType === 'lent') {
        await lentMoneyService.create({
          person_name: formData.person_name,
          amount,
          payment_mode: formData.payment_mode,
          given_date: `${formData.date}T00:00:00`,
          expected_return_date: formData.expected_return_date ? `${formData.expected_return_date}T00:00:00` : undefined,
          notes: formData.notes,
        });
        setMessage('Money lent entry added as pending receivable.');
      } else {
        await investmentService.create({
          investment_type: formData.investment_type,
          investment_name: formData.investment_name,
          amount_invested: amount,
          quantity: formData.quantity ? parseFloat(formData.quantity) : undefined,
          broker_name: formData.broker_name,
          purchase_date: `${formData.date}T00:00:00`,
          notes: formData.notes,
        });
        setMessage('Investment transaction added successfully.');
      }

      resetForm();
      onSaved?.();
    } catch (error) {
      console.error('Error:', error);
      setMessage(error instanceof Error ? error.message : 'Unable to save entry. Please try again.');
    } finally {
      setLoading(false);
      window.setTimeout(() => setMessage(''), 3500);
    }
  };

  return (
    <div className="min-h-screen">
      <Header title="Add Transaction" subtitle="Record expenses, income, money lent, money returned, and investments." />
      <main className="p-4 sm:p-6 lg:p-8">
        <form onSubmit={handleSubmit} className="mx-auto max-w-4xl rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <div className="mb-6 inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1">
            <button
              type="button"
              onClick={() => setEntryType('expense')}
              className={`rounded-md px-4 py-2 text-sm font-semibold ${entryType === 'expense' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600'}`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setEntryType('income')}
              className={`rounded-md px-4 py-2 text-sm font-semibold ${entryType === 'income' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600'}`}
            >
              Income
            </button>
            <button type="button" onClick={() => setEntryType('lent')} className={`rounded-md px-4 py-2 text-sm font-semibold ${entryType === 'lent' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600'}`}>
              Money Lent
            </button>
            <button type="button" onClick={() => setEntryType('returned')} className={`rounded-md px-4 py-2 text-sm font-semibold ${entryType === 'returned' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600'}`}>
              Money Returned
            </button>
            <button type="button" onClick={() => setEntryType('investment')} className={`rounded-md px-4 py-2 text-sm font-semibold ${entryType === 'investment' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600'}`}>
              Investment
            </button>
          </div>

          {message && <div className="mb-6 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700">{message}</div>}

          <div className="grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <IndianRupee className="h-4 w-4" /> Amount
              </span>
              <input type="number" name="amount" value={formData.amount} onChange={handleChange} required step="0.01" min="0" placeholder="0.00" className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
            </label>

            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <FileText className="h-4 w-4" /> {entryType === 'expense' ? 'Title' : 'Source / title'}
              </span>
              <input name="title" value={formData.title} onChange={handleChange} required={entryType !== 'lent' && entryType !== 'investment'} placeholder={entryType === 'expense' ? 'Groceries' : entryType === 'returned' ? 'Money returned by friend' : 'Salary'} className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
            </label>

            {entryType === 'expense' && (
              <>
                <label className="block">
                  <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <Tag className="h-4 w-4" /> Category
                  </span>
                  <select name="category_id" value={formData.category_id} onChange={handleChange} className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                    <option value="">Create new category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">New category name</span>
                  <input name="new_category" value={formData.new_category} onChange={handleChange} disabled={!!formData.category_id} placeholder={categories.length ? 'Optional' : 'Food, Transport, Bills...'} className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100" />
                </label>

                <label className="block">
                  <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <CreditCard className="h-4 w-4" /> Payment mode
                  </span>
                  <select name="payment_mode" value={formData.payment_mode} onChange={handleChange} className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                    <option value="cash">Cash</option>
                    <option value="credit_card">Credit Card</option>
                    <option value="debit_card">Debit Card</option>
                    <option value="upi">UPI</option>
                    <option value="net_banking">Net Banking</option>
                  </select>
                </label>
              </>
            )}

            {entryType === 'lent' && (
              <>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">Person Name</span>
                  <input name="person_name" value={formData.person_name} onChange={handleChange} required placeholder="Rahul" className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">Expected Return Date</span>
                  <input type="date" name="expected_return_date" value={formData.expected_return_date} onChange={handleChange} className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                </label>
                <label className="block">
                  <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <CreditCard className="h-4 w-4" /> Payment mode
                  </span>
                  <select name="payment_mode" value={formData.payment_mode} onChange={handleChange} className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                    <option value="cash">Cash</option>
                    <option value="credit_card">Credit Card</option>
                    <option value="debit_card">Debit Card</option>
                    <option value="upi">UPI</option>
                    <option value="net_banking">Net Banking</option>
                  </select>
                </label>
              </>
            )}

            {entryType === 'investment' && (
              <>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">Investment Type</span>
                  <select name="investment_type" value={formData.investment_type} onChange={handleChange} className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                    {investmentTypes.map((type) => <option key={type}>{type}</option>)}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">Investment Name</span>
                  <input name="investment_name" value={formData.investment_name} onChange={handleChange} required placeholder="HDFC Mutual Fund" className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">Units / Quantity</span>
                  <input type="number" step="0.0001" name="quantity" value={formData.quantity} onChange={handleChange} placeholder="10" className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">Broker / Platform</span>
                  <input name="broker_name" value={formData.broker_name} onChange={handleChange} placeholder="Zerodha, Groww, Kuvera" className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                </label>
              </>
            )}

            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Calendar className="h-4 w-4" /> {entryType === 'investment' ? 'Purchase date' : entryType === 'income' || entryType === 'returned' ? 'Income date' : 'Date'}
              </span>
              <input type="date" name="date" value={formData.date} onChange={handleChange} required className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
            </label>
          </div>

          <label className="mt-5 block">
            <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
              <FileText className="h-4 w-4" /> Notes
            </span>
            <textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="Add notes..." rows={4} className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
          </label>

          {entryType === 'expense' && (
            <div className="mt-5">
              <label className="mb-2 block text-sm font-semibold text-slate-700">Upload receipt</label>
              <div className="rounded-lg border-2 border-dashed border-slate-300 p-6 text-center transition-colors hover:border-blue-400">
                <Upload className="mx-auto mb-2 h-8 w-8 text-slate-400" />
                <p className="mb-2 text-sm text-slate-600">Drag and drop or click to upload</p>
                <input type="file" accept="image/*,.pdf" onChange={(event) => setReceipt(event.target.files?.[0] || null)} className="hidden" id="receipt-upload" />
                <label htmlFor="receipt-upload" className="cursor-pointer text-sm font-semibold text-blue-600 hover:text-blue-700">
                  Choose file
                </label>
                {receipt && (
                  <div className="mt-4 flex items-center justify-between rounded-lg bg-slate-50 p-3">
                    <span className="truncate text-sm text-slate-700">{receipt.name}</span>
                    <button type="button" onClick={() => setReceipt(null)} className="text-red-500 hover:text-red-700" aria-label="Remove receipt">
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          <button type="submit" disabled={loading} className="mt-6 w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
            {loading ? 'Saving...' : 'Save Transaction'}
          </button>
        </form>
      </main>
    </div>
  );
};
