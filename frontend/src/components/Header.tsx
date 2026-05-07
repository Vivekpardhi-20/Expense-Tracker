import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Bell, Calendar, ChevronDown, ChevronLeft, ChevronRight, Menu, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { currentMonthKey, formatMonthLabel, parseMonthKey } from '../utils/dateFilters';

interface HeaderProps {
  onDateRangeChange?: (range: string) => void;
  selectedMonth?: string;
  title?: string;
  subtitle?: string;
}

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const toMonthKey = (year: number, month: number) => `${year}-${String(month).padStart(2, '0')}`;

export const Header: React.FC<HeaderProps> = ({
  onDateRangeChange,
  selectedMonth = currentMonthKey(),
  title,
  subtitle = "Here's what's happening with your finances.",
}) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const displayName = user ? `${user.first_name} ${user.last_name}`.trim() || user.username : 'User';
  const heading = title || `Welcome back, ${displayName}!`;
  const selected = parseMonthKey(selectedMonth);
  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 21 }, (_, index) => currentYear - 10 + index);
  }, []);

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsPickerOpen(false);
      }
    };

    document.addEventListener('mousedown', closeOnOutsideClick);
    return () => document.removeEventListener('mousedown', closeOnOutsideClick);
  }, []);

  const changeMonth = (year: number, month: number) => {
    onDateRangeChange?.(toMonthKey(year, month));
  };

  const moveMonth = (offset: number) => {
    const next = new Date(selected.year, selected.month - 1 + offset, 1);
    changeMonth(next.getFullYear(), next.getMonth() + 1);
  };

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="min-w-0 pl-12 md:pl-0">
          <button className="mb-3 hidden rounded-lg border border-slate-200 p-2 text-slate-600 lg:inline-flex" aria-label="Menu">
            <Menu className="h-5 w-5" />
          </button>
          <h2 className="truncate text-xl font-bold text-slate-950 sm:text-2xl">{heading}</h2>
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <div ref={pickerRef} className="relative">
            <button
              onClick={() => setIsPickerOpen((current) => !current)}
              className="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 sm:px-4"
            >
              <Calendar className="h-4 w-4 text-slate-600" />
              <span className="hidden sm:inline">{formatMonthLabel(selectedMonth)}</span>
              <span className="sm:hidden">{selectedMonth}</span>
              <ChevronDown className="h-4 w-4 text-slate-500" />
            </button>

            {isPickerOpen && (
              <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] max-w-sm rounded-lg border border-slate-200 bg-white p-4 shadow-xl sm:w-80">
                <div className="mb-4 flex items-center justify-between">
                  <button onClick={() => moveMonth(-1)} className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50" aria-label="Previous month">
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <p className="font-semibold text-slate-950">{formatMonthLabel(selectedMonth)}</p>
                  <button onClick={() => moveMonth(1)} className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50" aria-label="Next month">
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Month</span>
                    <select
                      value={selected.month}
                      onChange={(event) => changeMonth(selected.year, Number(event.target.value))}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                      {months.map((month, index) => (
                        <option key={month} value={index + 1}>
                          {month}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Year</span>
                    <select
                      value={selected.year}
                      onChange={(event) => changeMonth(Number(event.target.value), selected.month)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button onClick={() => changeMonth(new Date().getFullYear(), new Date().getMonth() + 1)} className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                    Current Month
                  </button>
                  <button onClick={() => moveMonth(-1)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                    Previous Month
                  </button>
                </div>
              </div>
            )}
          </div>

          <button className="relative rounded-lg border border-slate-200 p-2.5 transition-colors hover:bg-slate-50" aria-label="Notifications">
            <Bell className="h-5 w-5 text-slate-600" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
          </button>
          <button className="flex items-center gap-2 rounded-lg border border-slate-200 p-2.5 transition-colors hover:bg-slate-50" aria-label="Profile">
            <User className="h-5 w-5 text-slate-600" />
            <span className="hidden text-sm font-medium text-slate-700 xl:inline">{displayName}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
