import React from 'react';
import {
  BarChart3,
  Calendar,
  Goal,
  Home,
  LogOut,
  Menu,
  Moon,
  Plus,
  RotateCw,
  Settings,
  Tag,
  Target,
  Wallet,
  WalletCards,
  X,
} from 'lucide-react';
import type { PageType } from '../App';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen, currentPage, onNavigate }) => {
  const { user, logout } = useAuth();
  const userName = user ? `${user.first_name} ${user.last_name}`.trim() || user.username : 'User';

  const menuItems: Array<{ icon: React.ElementType; label: string; page: PageType }> = [
    { icon: Home, label: 'Dashboard', page: 'dashboard' },
    { icon: Wallet, label: 'Expenses', page: 'expenses' },
    { icon: Plus, label: 'Add Expense', page: 'add-expense' },
    { icon: Tag, label: 'Categories', page: 'categories' },
    { icon: Target, label: 'Budgets', page: 'budgets' },
    { icon: BarChart3, label: 'Reports', page: 'reports' },
    { icon: Calendar, label: 'Calendar', page: 'calendar' },
    { icon: RotateCw, label: 'Recurring', page: 'recurring' },
    { icon: Goal, label: 'Goals', page: 'goals' },
    { icon: Settings, label: 'Settings', page: 'settings' },
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-4 top-4 z-50 rounded-lg border border-slate-200 bg-white p-2 shadow-sm md:hidden"
        aria-label="Toggle sidebar"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside
        className={`fixed left-0 top-0 z-40 flex h-full w-64 flex-col bg-slate-950 text-white shadow-2xl transition-transform duration-300 md:sticky md:top-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex h-full flex-col p-5">
          <div className="mb-8 flex items-center gap-3">
            <div className="rounded-lg bg-blue-600 p-2 shadow-lg shadow-blue-950/30">
              <WalletCards className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-lg font-bold tracking-tight">Expense Tracker</h1>
          </div>

          <div className="mb-6 rounded-lg border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400">Welcome back</p>
            <p className="mt-1 text-sm font-semibold text-white">{userName}</p>
          </div>

          <nav className="mb-8 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.page}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                  currentPage === item.page
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-950/30'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
                onClick={() => {
                  onNavigate(item.page);
                  setIsOpen(false);
                }}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="mt-auto rounded-lg border border-white/10 bg-white/10 p-4">
            <p className="mb-2 text-sm font-semibold text-white">Go Premium</p>
            <p className="mb-4 text-xs leading-5 text-slate-300">Unlock deeper reports, audit trails, and receipt storage.</p>
            <button className="w-full rounded-lg bg-white py-2 text-sm font-semibold text-blue-700 transition-colors hover:bg-slate-100">
              Upgrade Now
            </button>
          </div>

          <div className="mt-6 flex items-center justify-between rounded-lg px-1 text-sm text-slate-300">
            <span className="flex items-center gap-2">
              <Moon className="h-4 w-4" />
              Dark Mode
            </span>
            <span className="h-6 w-11 rounded-full bg-slate-700 p-1">
              <span className="block h-4 w-4 rounded-full bg-white" />
            </span>
          </div>
          <button
            onClick={logout}
            className="mt-4 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {isOpen && <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={() => setIsOpen(false)} />}
    </>
  );
};
