import React, { useState } from 'react';
import { WalletCards } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

type Mode = 'login' | 'signup';

export const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<Mode>('login');
  const [form, setForm] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();

  const updateForm = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(form.email, form.password);
      } else {
        await signup(form);
      }
    } catch (err) {
      console.error(err);
      setError(mode === 'login' ? 'Invalid email or password.' : 'Unable to create account. Check your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm lg:grid-cols-[0.9fr_1.1fr]">
        <div className="bg-slate-950 p-8 text-white sm:p-10">
          <div className="mb-8 flex items-center gap-3">
            <span className="rounded-lg bg-blue-600 p-2">
              <WalletCards className="h-6 w-6" />
            </span>
            <span className="text-lg font-bold">Expense Tracker</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Track your own money, from zero.</h1>
          <p className="mt-4 text-sm leading-6 text-slate-300">
            Sign up or log in to manage personal expenses, income, budgets, categories, reports, and receipts with your own private data.
          </p>
        </div>

        <form onSubmit={submit} className="p-6 sm:p-10">
          <div className="mb-6 inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`rounded-md px-4 py-2 text-sm font-semibold ${mode === 'login' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600'}`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`rounded-md px-4 py-2 text-sm font-semibold ${mode === 'signup' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600'}`}
            >
              Signup
            </button>
          </div>

          <h2 className="text-2xl font-bold text-slate-950">{mode === 'login' ? 'Welcome back' : 'Create your account'}</h2>
          <p className="mt-1 text-sm text-slate-500">
            {mode === 'login' ? 'Use your email and password to continue.' : 'Your dashboard starts empty and grows with your entries.'}
          </p>

          {error && <div className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</div>}

          <div className="mt-6 grid gap-4">
            {mode === 'signup' && (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-slate-700">First name</span>
                    <input name="first_name" value={form.first_name} onChange={updateForm} required className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-slate-700">Last name</span>
                    <input name="last_name" value={form.last_name} onChange={updateForm} required className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                  </label>
                </div>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">Username</span>
                  <input name="username" value={form.username} onChange={updateForm} required className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                </label>
              </>
            )}

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Email</span>
              <input name="email" type="email" value={form.email} onChange={updateForm} required className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Password</span>
              <input name="password" type="password" value={form.password} onChange={updateForm} required minLength={6} className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
            </label>
          </div>

          <button disabled={loading} className="mt-6 w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
            {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create account'}
          </button>
        </form>
      </section>
    </main>
  );
};
